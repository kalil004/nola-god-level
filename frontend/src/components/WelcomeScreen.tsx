
import React from 'react';
import { EXAMPLE_PROMPTS } from '../constants.ts';

interface WelcomeScreenProps {
  onExampleClick: (prompt: string) => void;
}

const WandIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .5 18.122V15.75a2.25 2.25 0 0 1 2.25-2.25 2.25 2.25 0 0 1 2.25 2.25v.75A2.25 2.25 0 0 1 6 18.75Zm8.51-1.128a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118 2.25 2.25 0 0 1 2.475-2.118c1.133 0 2.14.61 2.68 1.543a3 3 0 0 0 5.78 1.128 2.25 2.25 0 0 1 2.475 2.118 2.25 2.25 0 0 1-2.475 2.118c-1.133 0-2.14-.61-2.68-1.543Zm-2.68-6.38a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 3.5 12.122V9.75a2.25 2.25 0 0 1 2.25-2.25 2.25 2.25 0 0 1 2.25 2.25v.75a2.25 2.25 0 0 1-1.5 2.122Zm8.51-1.128a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118 2.25 2.25 0 0 1 2.475-2.118c1.133 0 2.14.61 2.68 1.543a3 3 0 0 0 5.78 1.128 2.25 2.25 0 0 1 2.475 2.118 2.25 2.25 0 0 1-2.475 2.118c-1.133 0-2.14-.61-2.68-1.543Z" />
  </svg>
);

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onExampleClick }) => {
  return (
    <div className="text-center py-10">
      <WandIcon className="mx-auto h-16 w-16 text-brand-accent opacity-80" />
      <h2 className="mt-6 text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl">
        Bem-vindo ao seu Assistente de Análise
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
        Eu sou sua IA de análise de dados. Faça perguntas em linguagem natural para descobrir insights sobre seu restaurante.
        OBS: Por questões de deploy, populei o banco apenas no mês de novembro!
      </p>
      <div className="mt-10">
        <h3 className="text-md font-semibold text-gray-500 uppercase tracking-wider">Tente uma destas perguntas:</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onExampleClick(prompt)}
              className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all duration-200"
            >
              <p className="font-medium text-brand-primary">{prompt}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
