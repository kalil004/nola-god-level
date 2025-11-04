import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { ErrorDisplay } from './ErrorDisplay'; // Importe o ErrorDisplay

interface LineChartVizProps {
  data: any[];
}

// Vamos usar as cores da sua marca que definiu no Tailwind
const colors = {
  primary: '#3b82f6',
  accent: '#9333ea',
  green: '#16a34a',
  orange: '#f97316',
  red: '#dc2626'
};
const colorKeys = Object.values(colors);

export const LineChartViz: React.FC<LineChartVizProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-4">Sem dados para exibir.</div>;
  }

  // --- LÓGICA CORRIGIDA ---
  const allKeys = Object.keys(data[0]);

  // A 'dateKey' (eixo X) é a chave de 'string' (ex: data_venda, dia, etc.)
  // Assumimos que a primeira coluna de string é o nosso eixo X.
  const dateKey = allKeys.find(key => typeof data[0][key] === 'string');
  
  // As 'valueKeys' (eixos Y) são TODAS as chaves de 'number'
  const valueKeys = allKeys.filter(key => typeof data[0][key] === 'number');

  if (!dateKey || valueKeys.length === 0) {
    return <ErrorDisplay error="Os dados recebidos não têm o formato esperado (pelo menos 1 string/data e 1 número)." />;
  }
  // --- FIM DA CORREÇÃO ---

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            {valueKeys.map((key, index) => (
              <linearGradient key={key} id={`color_${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorKeys[index % colorKeys.length]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colorKeys[index % colorKeys.length]} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis 
            dataKey={dateKey} // Agora usa a chave de string correta
            tick={{ fontSize: 12 }} 
            angle={-20} 
            textAnchor="end" 
            height={50}
            stroke="#6b7280"
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            stroke="#6b7280"
          />
          <Tooltip 
             contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Legend wrapperStyle={{fontSize: "14px", paddingTop: '10px'}}/>
          
          {/* Agora mapeia apenas sobre as chaves numéricas */}
          {valueKeys.map((key, index) => (
            <Area 
                key={key} 
                type="monotone" 
                dataKey={key} // Usa a chave numérica correta
                stroke={colorKeys[index % colorKeys.length]}
                fillOpacity={1}
                fill={`url(#color_${index})`} 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};