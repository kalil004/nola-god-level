
import React, { useState } from 'react';
import { QueryResult } from '../types.ts';
import { BarChartViz } from './visualizations/BarChartViz.tsx';
import { LineChartViz } from './visualizations/LineChartViz.tsx';
import { DataTable } from './visualizations/DataTable.tsx';
import { KpiCard } from './visualizations/KpiCard.tsx';
import { ErrorDisplay } from './visualizations/ErrorDisplay.tsx';
import { PieChartViz } from './visualizations/PieChartViz.tsx'; 

interface VisualizationProps {
  result: QueryResult;
}

const CodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
);


export const Visualization: React.FC<VisualizationProps> = ({ result }) => {
  const [showSql, setShowSql] = useState(false);
  
  const renderContent = () => {
    switch (result.visualizationHint) {
      case 'BAR_CHART':
        return <BarChartViz data={result.data} />;
      case 'LINE_CHART':
        return <LineChartViz data={result.data} />;
      case 'TABLE':
        return <DataTable data={result.data} />;
      case 'KPI':
        return <KpiCard data={result.data[0]} />;
      case 'ERROR':
        return <ErrorDisplay error={result.error} />;
      case 'PIE_CHART': 
        return <PieChartViz data={result.data} />;
      default:
        return <DataTable data={result.data} />;
    }
  };

  return (
    <div className="space-y-4">
      {result.title && <h3 className="text-xl font-bold text-brand-dark">{result.title}</h3>}
      {result.description && <p className="text-gray-600">{result.description}</p>}
      
      <div className="mt-4">
        {renderContent()}
      </div>

      {result.sql && (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
                onClick={() => setShowSql(!showSql)}
                className="text-sm text-gray-500 hover:text-brand-primary flex items-center gap-2 transition"
            >
                <CodeIcon className="w-4 h-4" />
                <span>{showSql ? 'Ocultar SQL' : 'Mostrar SQL gerado'}</span>
            </button>
            {showSql && (
                <pre className="mt-2 p-3 bg-gray-800 text-white rounded-md text-xs overflow-x-auto">
                    <code>{result.sql.trim()}</code>
                </pre>
            )}
        </div>
      )}
    </div>
  );
};
