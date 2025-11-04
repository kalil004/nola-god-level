import { QueryResult } from '../types.ts';

const API_URL = '/api/generate-sql';

export const queryAnalytics = async (query: string): Promise<QueryResult> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: QueryResult = await response.json();
    return result;
    
  } catch (error) {
    console.error("Failed to query analytics service:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown network error occurred.';
    return {
      query,
      sql: 'Error connecting to backend.',
      data: [],
      visualizationHint: 'ERROR',
      title: 'Erro de Conexão',
      description: `Não foi possível conectar ao serviço de análise. Verifique se o backend está rodando na porta 5001.`,
      error: `Detalhes: ${errorMessage}`,
    };
  }
};
