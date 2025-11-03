import React from 'react';

interface KpiCardProps {
  data: any;
}

const isQuantityKey = (key: string): boolean => {
  const lowerKey = key.toLowerCase();
  return (
    lowerKey.includes('quantidade') ||
    lowerKey.includes('quantity') ||
    lowerKey.includes('contagem') ||
    lowerKey.includes('count')
  );
};

export const KpiCard: React.FC<KpiCardProps> = ({ data }) => {
  if (!data) {
    return <div className="text-center text-gray-500 p-4">Sem dados para exibir.</div>;
  }
  
  const key = Object.keys(data)[0];
  const value = data[key];
  
  let formattedValue: string;

  if (typeof value === 'number') {

    if (isQuantityKey(key)) {
      // Formata como número simples (ex: 1.500)
      formattedValue = value.toLocaleString('pt-BR', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
    } else {
      // Formata como moeda (ex: R$ 1.500,50)
      formattedValue = value.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      });
    }
  } else {
    // Se não for número, apenas exibe como está
    formattedValue = String(value);
  }
  
  return (
    <div className="bg-brand-primary p-6 rounded-lg text-white text-center">
      <h4 className="text-lg font-medium text-blue-200 uppercase tracking-wider">
        {key.replace(/_/g, ' ')}
      </h4>
      <p className="text-5xl font-bold mt-2">
        {formattedValue}
      </p>
    </div>
  );
};