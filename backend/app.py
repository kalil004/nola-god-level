import os
import json
from datetime import datetime, date 
from decimal import Decimal
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import psycopg2
from psycopg2.extras import DictCursor

# Carrega .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Pega a URL do banco do .env
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("Erro: DATABASE_URL não definida no arquivo .env")

# Carrega o schema do banco de dados
try:
    with open('database-schema.sql', 'r') as f:
        db_schema = f.read()
except FileNotFoundError:
    print("Erro: Arquivo database-schema.sql não encontrado.")
    db_schema = "SCHEMA_NOT_FOUND"

# Configura a API do Gemini
genai.configure(api_key=os.getenv("API_KEY"))

# PROMPT ATUALIZADO:
# Pedimos title e description para o front-end e expandimos as regras.
SYSTEM_PROMPT = f"""
Você é um especialista em análise de dados PostgreSQL chamado Nola AI. Sua tarefa é converter uma pergunta em linguagem natural em uma query SQL para um banco de dados de restaurantes.

REGRAS IMPORTANTES:
1.  **SEMPRE** retorne sua resposta como um objeto JSON. NUNCA retorne texto puro.
2.  O JSON deve ter QUATRO chaves: "sql", "visualizationHint", "title", e "description".
3.  A chave "sql" deve conter a query PostgreSQL completa.
4. A chave "visualizationHint" deve ser 'BAR_CHART', 'LINE_CHART', 'TABLE', 'KPI', ou 'PIE_CHART'.
5.  A chave "title" deve ser um título curto e amigável para o gráfico (ex: "Top 5 Produtos Vendidos").
6.  A chave "description" deve ser uma breve descrição de 1 frase dos dados (ex: "Mostra os 5 produtos mais vendidos por quantidade total.").
7.  Baseie sua query EXCLUSIVAMENTE no schema do banco de dados fornecido.
8.  A data atual é {datetime.now().strftime('%Y-%m-%d')}. Use NOW() e INTERVAL para queries de tempo.
9.  Se a pergunta for ambígua ou não puder ser respondida, a chave "sql" deve ser "SELECT 'Não foi possível gerar a query. Por favor, reformule a pergunta.' as error;" e o hint 'ERROR'.

10. **REGRA DE AMBIGUIDADE (QUANTIDADE vs. VALOR):**
    - Se a pergunta for sobre "quantos" (how many) ou "quantidade" (quantity) de produtos vendidos, use **SUM(ps.quantity)**.
    - Se a pergunta for sobre "quanto" (how much), "faturamento" (revenue), "valor" (value), ou "total vendido" (total sold), use **SUM(ps.total_price)** ou **SUM(s.total_amount)**.
    - Exemplo "Quantos X-Burger foram vendidos?": Use SUM(ps.quantity).
    - Exemplo "Quanto foi vendido de X-Burger?": Use SUM(ps.total_price).

11. **REGRA DO PIE_CHART:** Use 'PIE_CHART' para perguntas sobre "distribuição", "proporção", ou "percentual" entre categorias (ex: "distribuição de vendas por canal"). Use 'BAR_CHART' para rankings (ex: "top 5 canais").

Aqui está o schema do banco de dados:
---
{db_schema}
---

Exemplos:

Pergunta: "Top 5 produtos mais vendidos por quantidade"
Resposta JSON:
{{
  "sql": "SELECT p.name, SUM(ps.quantity) as total_quantity FROM product_sales ps JOIN products p ON ps.product_id = p.id GROUP BY p.name ORDER BY total_quantity DESC LIMIT 5;",
  "visualizationHint": "BAR_CHART",
  "title": "Top 5 Produtos Vendidos",
  "description": "Os 5 produtos mais vendidos por quantidade total."
}}

Pergunta: "Qual o faturamento total nos últimos 30 dias?"
Resposta JSON:
{{
  "sql": "SELECT SUM(total_amount) as faturamento_total FROM sales WHERE created_at >= NOW() - INTERVAL '30 days' AND sale_status_desc = 'COMPLETED';",
  "visualizationHint": "KPI",
  "title": "Faturamento Total (Últimos 30 dias)",
  "description": "Soma de todas as vendas completas nos últimos 30 dias."
}}
Exemplo de Pizza:

Pergunta: "Qual a proporção de vendas por canal?"
Resposta JSON:
{{
    "sql": "SELECT c.name, SUM(s.total_amount) as faturamento FROM sales s JOIN channels c ON s.channel_id = c.id WHERE s.sale_status_desc = 'COMPLETED' GROUP BY c.name;",
    "visualizationHint": "PIE_CHART",
    "title": "Vendas por Canal",
    "description": "Distribuição percentual do faturamento total por canal de venda."
}}
"""

# Define um timeout global para as queries em segundos
QUERY_TIMEOUT_SECONDS = 15

def json_converter(obj):
    """Converte tipos de dados não-serializáveis do banco para JSON."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Tipo {type(obj)} não é serializável em JSON")

def execute_sql_query(query: str):
    """Conecta no banco, executa a query e retorna os dados."""
    data = []
    try:
        conn = psycopg2.connect(DATABASE_URL)
        with conn.cursor(cursor_factory=DictCursor) as cursor:
            
            # Define o timeout para ESTA query específica
            cursor.execute(f"SET statement_timeout = {QUERY_TIMEOUT_SECONDS * 1000};")
            
            cursor.execute(query)
            
            if cursor.description:
                results = cursor.fetchall()
                # Converte os resultados para dicts puros, tratando tipos
                data = []
                for row in results:
                    data.append({k: json_converter(v) if not isinstance(v, (str, int, float, bool, type(None))) else v for k, v in dict(row).items()})
            conn.commit()
            
    except psycopg2.Error as db_error:
        print(f"Erro no banco de dados: {db_error}")
        
        # Traduz o erro de timeout para o usuário
        if "statement timeout" in str(db_error):
             raise Exception(f"Sua consulta demorou mais de {QUERY_TIMEOUT_SECONDS} segundos e foi cancelada. Tente ser mais específico (ex: limitar por datas).")
        
        raise Exception(f"Erro ao executar SQL: {db_error}")
    finally:
        if 'conn' in locals() and conn:
            conn.close()
    return data


@app.route('/generate-sql', methods=['POST'])
def generate_sql():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Query não fornecida"}), 400

    user_query = data['query']
    
    final_response = {
        "query": user_query,
        "sql": "",
        "data": [],
        "visualizationHint": "ERROR",
        "title": "Erro",
        "description": "",
        "error": ""
    }

    try:
        # Passo 1: Gerar o SQL com o Gemini
        ai = genai.GenerativeModel(model_name="gemini-2.5-flash", system_instruction=SYSTEM_PROMPT)
        response = ai.generate_content(user_query)
        response_text = response.text.strip().replace("```json", "").replace("```", "")
        
        gemini_result = json.loads(response_text)
        final_response.update(gemini_result)
        sql_query = final_response.get("sql")

        if final_response.get("visualizationHint") == "ERROR" or not sql_query:
            final_response["error"] = sql_query or "IA não conseguiu gerar SQL."
            return jsonify(final_response)

        sql_lower = sql_query.strip().lower()
        if not sql_lower.startswith("select"):
            print(f"SQL BLOQUEADO: Tentativa de query não-SELECT: {sql_query}")
            final_response["error"] = "Desculpe, só posso executar consultas de leitura (SELECT)."
            final_response["visualizationHint"] = "ERROR"
            final_response["sql"] = "--- BLOQUEADO ---"
            return jsonify(final_response)

        print(f"Query recebida: {user_query}")
        print(f"SQL Gerado: {sql_query}")

        # Passo 2: Executar o SQL no banco de dados
        data_from_db = execute_sql_query(sql_query)
        
        final_response["data"] = data_from_db
        print(f"Dados retornados: {len(data_from_db)} linhas")

        return jsonify(final_response)

    except (psycopg2.Error, Exception) as e:
        print(f"Erro geral ou de execução: {e}")
        final_response["error"] = str(e)
        final_response["sql"] = final_response.get("sql", "Nenhum SQL gerado.")
        final_response["data"] = []
        return jsonify(final_response), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)