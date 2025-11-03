import React from 'react';
import { 
  AreaChart, // Mudou de LineChart
  Area,      // Mudou de Line
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

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

  const keys = Object.keys(data[0]).filter(key => key !== 'date');
  const dateKey = 'date';

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        {/* Mudou para AreaChart */}
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          {/* Definindo os gradientes para cada cor */}
          <defs>
            {keys.map((key, index) => (
              <linearGradient key={key} id={`color_${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorKeys[index % colorKeys.length]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colorKeys[index % colorKeys.length]} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
          <XAxis 
            dataKey={dateKey} 
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
          
          {/* Mapeia para <Area> em vez de <Line> */}
          {keys.map((key, index) => (
            <Area 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={colorKeys[index % colorKeys.length]}
                fillOpacity={1}
                fill={`url(#color_${index})`} // Usa o gradiente
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