
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2 text-gray-500">
                <div className="h-2 w-2 bg-brand-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-brand-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-brand-secondary rounded-full animate-bounce"></div>
                <span className="text-sm">Analisando dados...</span>
            </div>
        </div>
    );
};
