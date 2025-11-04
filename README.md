-----

# 🚀 Nolalytics - God Level Coder Challenge

Uma plataforma de análise para restaurantes que transforma perguntas em português em dashboards e insights, usando o poder da Inteligência Artificial.

## 1\. O Problema: A Dor da "Dona Maria"

A "Dona Maria", dona de restaurante, está sentada em uma montanha de dados (vendas, produtos, canais, clientes), mas não consegue usá-los.

  * **Dashboards Fixos:** Não respondem perguntas específicas como: "Qual produto vende mais na quinta à noite no iFood?"
  * **Ferramentas de BI (Power BI):** São complexas demais para quem não tem uma equipe de dados.

Ela precisa de **flexibilidade total** com **simplicidade total**.

## 2\. A Minha Solução: Analytics por Conversa

Em vez de tentar adivinhar todos os filtros e gráficos que a Maria poderia querer, minha solução vai direto ao ponto: **ela permite que a Maria "pergunte" o que quer saber.**

A aplicação usa uma abordagem de **Text-to-SQL**:

1.  O usuário digita uma pergunta em português (ex: "Qual o faturamento total por canal?").
2.  O Back-end (Python + Gemini AI) traduz essa pergunta em uma consulta SQL segura e otimizada.
3.  Essa consulta é executada no banco de dados.
4.  O Front-end (React) recebe os dados e renderiza o gráfico (Barra, Pizza, KPI) que a IA recomendou.

## 3\. Decisões Arquiteturais (Os "Porquês")

Eu projetei esta solução para atender diretamente aos pilares da avaliação:

### Foco na Qualidade da Solução para o Usuário

A dor principal da Maria é a **flexibilidade**. Ela tem perguntas que mudam todo dia. Um dashboard tradicional, por mais bonito que seja, é "burro" e só responde o que foi programado.

Minha abordagem de Text-to-SQL resolve isso 100%. Ela não se limita a filtros pré-definidos. Se a pergunta pode ser respondida pelos dados, a IA pode gerar o SQL para ela.

  * **Por que não Metabase ou Power BI?** Porque eles ainda têm uma curva de aprendizado. A Maria não quer aprender a usar um "query builder" ou "modelar dados". Ela só quer a resposta.

### Foco na UX e Usabilidade

O que é mais simples do que uma caixa de chat? Se a Maria sabe usar o WhatsApp, ela sabe usar o Nolalytics. A interface é "invisível": a complexidade de `JOINs`, `GROUP BYs` e `SUMs` é totalmente abstraída pela IA. O usuário simplesmente pergunta e recebe a visualização.

### Foco em Performance e Segurança (Escala)

Executar SQL gerado por IA diretamente no banco é perigoso. Para tornar isso viável para produção, implementei duas "guardrails" principais no back-end Python:

1.  **Guardião de `SELECT`:** A API bloqueia qualquer consulta que não comece com `SELECT`. Isso impede que a IA (ou um usuário malicioso) tente rodar `DROP TABLE`, `DELETE` ou `UPDATE`, garantindo a integridade dos dados.
2.  **Vigia de Timeout (15s):** Nenhuma consulta pode demorar mais que 15 segundos. Isso protege o banco de dados contra queries acidentalmente muito pesadas (ex: "vendas por milissegundo do ano todo") e garante que a Maria sempre receba uma resposta rápida ou uma mensagem de erro amigável.

## 4\. Stack Tecnológico

  * **Front-end:** React (Vite) com TypeScript.
  * **Visualização de Dados:** Recharts (com componentes dinâmicos para Gráficos de Barra, Linha/Área e Pizza/Donut).
  * **Back-end:** Python (Flask) como uma API.
  * **IA (O Cérebro):** Google Gemini (`gemini-1.5-flash`), guiado por um `SYSTEM_PROMPT` robusto que ensina a IA sobre o schema, regras de negócio (ex: "quantos" vs "quanto") e quais gráficos usar.
  * **Banco de Dados:** PostgreSQL (hospedado no Supabase).
  * **Hospedagem (Deploy):** Vercel (para o Front-end e o Back-end Python como Serverless Functions).

## 5\. Como Rodar o Projeto

Este projeto foi feito para deploy na Vercel com um banco de dados Supabase.

### 1\. Banco de Dados (Supabase)

1.  Crie um novo projeto no Supabase.
2.  Na seção **Database \> Connection pooler**, copie a string de conexão (em modo "Session").
3.  Vá até o **SQL Editor** do Supabase, cole o conteúdo do arquivo `backend/database-schema.sql` e execute-o para criar as tabelas.
4.  No seu terminal local (na pasta `backend/`), rode o script `generate_data.py` apontando para o seu banco Supabase para populá-lo com dados:
    ```bash
    # Ative seu venv
    source venv/bin/activate

    # Rode o script (pode levar de 5 a 15 min)
    python generate_data.py --db-url "SUA_URL_DE_CONEXAO_DO_SUPABASE_AQUI"
    ```

### 2\. Deploy (Vercel)

1.  Faça o `push` do projeto para um repositório no GitHub.
2.  Importe o projeto no Vercel.
3.  **Configuração de Build:** Configure o **Root Directory** para ser a pasta `frontend`.
4.  **Arquivos de Configuração:** O Vercel usará automaticamente:
      * `vercel.json` (na raiz): Para redirecionar `/api/generate-sql` para a função Python em `backend/app.py`.
      * `requirements.txt` (na raiz): Para instalar as dependências do Python (`Flask`, `psycopg2-binary`, etc.).
5.  **Variáveis de Ambiente:** Adicione as seguintes variáveis no painel do Vercel:
      * `API_KEY`: Sua chave da API do Google Gemini.
      * `DATABASE_URL`: A string de conexão do Supabase (a mesma que você usou para popular os dados).
6.  Clique em **Deploy**.

## 6\. Próximos Passos (Visão de Futuro)

Se eu tivesse mais tempo, os próximos passos para evoluir a plataforma seriam:

  * **Cache Inteligente:** Implementar um cache (como Redis) que armazene os resultados de perguntas comuns (ex: "faturamento de ontem"). Isso reduziria custos de API e deixaria as respostas instantâneas.
  * **Salvar "Widgets":** Permitir que a Maria "favorite" um gráfico gerado e o fixe em um dashboard pessoal, misturando a flexibilidade da IA com a conveniência de um dashboard fixo.
  * **Insights Proativos:** Criar um "watcher" que rode análises comuns automaticamente e envie insights para a Maria (ex: "Alerta: as vendas do 'X-Burger' caíram 30% esta semana em comparação com a média").