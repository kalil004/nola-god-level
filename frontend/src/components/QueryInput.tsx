
import React, { useState } from 'react';

interface QueryInputProps {
  onSend: (query: string) => void;
  isLoading: boolean;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);


export const QueryInput: React.FC<QueryInputProps> = ({ onSend, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSend(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        }}
        placeholder="Pergunte sobre seus dados... Ex: Qual o produto mais vendido no iFood?"
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition resize-none"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="p-3 bg-brand-primary text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center"
        aria-label="Send query"
      >
       <SendIcon className="h-6 w-6" />
      </button>
    </form>
  );
};
