import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ErrorDisplay } from './ErrorDisplay'; // Importe o ErrorDisplay

interface BarChartVizProps {
  data: any[];
}

// (O resto dos seus helpers 'formatKeyName' e 'getDynamicBarName' ... )
// Vou adicionar o 'getDynamicBarName' aqui para garantir
const getDynamicBarName = (key: string): string => {
  const lowerKey = key.toLowerCase();
  const isQuantity =
    lowerKey.includes('quantidade') ||
    lowerKey.includes('quantity') ||
    lowerKey.includes('contagem') ||
    lowerKey.includes('count');
    
  return isQuantity ? 'Quantidade' : 'Total';
};


export const BarChartViz: React.FC<BarChartVizProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-4">Sem dados para exibir.</div>;
  }
  
  // --- LÓGICA CORRIGIDA ---
  const keys = Object.keys(data[0]);

  // A 'dataKey' (eixo X) é a chave de 'string' (ex: nome do produto)
  const dataKey = keys.find(key => typeof data[0][key] === 'string');
  
  // A 'valueKey' (eixo Y) é a chave de 'number' (ex: total)
  const valueKey = keys.find(key => typeof data[0][key] === 'number');

  if (!dataKey || !valueKey) {
    return <ErrorDisplay error="Os dados recebidos não têm o formato esperado (string, number)." />;
  }
  // --- FIM DA CORREÇÃO ---

  const barName = getDynamicBarName(valueKey);

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis 
            dataKey={dataKey} // Chave de texto correta
            tick={{ fontSize: 12 }} 
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke="#6b7280"
          />
          <Tooltip 
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
            contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px", paddingTop: '10px'}} />
          <Bar 
            dataKey={valueKey} // Chave numérica correta
            fill="url(#colorUv)" 
            name={barName} 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};