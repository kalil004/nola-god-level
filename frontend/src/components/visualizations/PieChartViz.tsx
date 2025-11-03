import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ErrorDisplay } from './ErrorDisplay';

interface PieChartVizProps {
  data: any[];
}

// Cores para as fatias
const PIE_COLORS = ['#3b82f6', '#9333ea', '#16a34a', '#f97316', '#dc2626', '#1e3a8a'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  if (percent < 0.05) return null; 
  
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const PieChartViz: React.FC<PieChartVizProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-4">Sem dados para exibir.</div>;
  }

  // --- LÓGICA CORRIGIDA ---
  // Não confie na ordem das chaves. Encontre-as pelo tipo de dado.
  const keys = Object.keys(data[0]);
  
  // A 'nameKey' é a primeira chave que contém um valor do tipo 'string'
  const nameKey = keys.find(key => typeof data[0][key] === 'string');
  
  // A 'valueKey' é a primeira chave que contém um valor do tipo 'number'
  const valueKey = keys.find(key => typeof data[0][key] === 'number');

  if (!nameKey || !valueKey) {
    return <ErrorDisplay error="Os dados recebidos não têm o formato esperado (string, number)." />;
  }
  // --- FIM DA CORREÇÃO ---

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey={valueKey} // Agora é a chave numérica (ex: 'faturamento')
            nameKey={nameKey}   // Agora é a chave de texto (ex: 'name')
            cx="50%"
            cy="50%"
            innerRadius={60} 
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};