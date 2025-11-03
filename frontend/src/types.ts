
export type VisualizationHint = 'BAR_CHART' | 'LINE_CHART' | 'TABLE' | 'KPI' | 'ERROR' | 'PIE_CHART';

export interface QueryResult {
  query: string;
  sql: string;
  data: any[];
  visualizationHint: VisualizationHint;
  error?: string;
  title?: string;
  description?: string;
}

export interface UserChatMessage {
  type: 'user';
  content: string;
}

export interface AiChatMessage {
  type: 'ai';
  content: QueryResult;
}

export type ChatMessage = UserChatMessage | AiChatMessage;
