import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { ChatHistory } from './components/ChatHistory';
import { WelcomeScreen } from './components/WelcomeScreen';
import { queryAnalytics } from './services/geminiAnalyticsService';
import { ChatMessage, QueryResult } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // Adicionado isLoading para rolar para baixo quando o spinner aparecer

  const handleSendQuery = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = { type: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const result: QueryResult = await queryAnalytics(query);
      const aiMessage: ChatMessage = { type: 'ai', content: result };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        type: 'ai',
        content: {
          query,
          sql: 'Error generating SQL.',
          data: [],
          visualizationHint: 'ERROR',
          error: error instanceof Error ? error.message : 'An unknown error occurred.',
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    // Usa a cor de fundo da marca
    <div className="flex flex-col h-screen bg-brand-light font-sans">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onExampleClick={handleSendQuery} />
          ) : (
            // Passa o isLoading para o ChatHistory
            <ChatHistory messages={messages} isLoading={isLoading} />
          )}
           <div ref={chatEndRef} />
        </div>
      </main>
      <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <QueryInput onSend={handleSendQuery} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;