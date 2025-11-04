import React from 'react';
import { ChatMessage } from '../types.ts';
import { Visualization } from './Visualization.tsx';
import { LoadingSpinner } from './LoadingSpinner.tsx';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean; // 1. Aceita o prop isLoading
}

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const AiIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);


export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-6">
      {messages.map((msg, index) => (
        <div key={index} className={`flex items-start gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
          {msg.type === 'ai' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center">
                <AiIcon className="w-6 h-6"/>
            </div>
          )}
          <div className={`max-w-2xl w-full ${msg.type === 'user' ? 'order-2' : ''}`}>
            {msg.type === 'user' ? (
              <div className="bg-brand-secondary text-white p-4 rounded-xl rounded-br-none shadow-md">
                <p className="font-medium">{msg.content}</p>
              </div>
            ) : (
                <div className="bg-white p-4 sm:p-6 rounded-xl rounded-bl-none border border-gray-200 shadow-sm transition-all hover:shadow-lg">
                    <Visualization result={msg.content} />
                </div>
            )}
          </div>
           {msg.type === 'user' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center order-1">
                <UserIcon className="w-6 h-6"/>
            </div>
          )}
        </div>
      ))}

      {/* 2. Renderiza o spinner de loading como se fosse uma mensagem da IA */}
      {isLoading && (
        <div className="flex items-start gap-4 justify-start animate-pulse">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center">
                <AiIcon className="w-6 h-6"/>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl rounded-bl-none border border-gray-200 shadow-sm">
                <LoadingSpinner />
            </div>
        </div>
      )}
    </div>
  );
};