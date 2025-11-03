import React from 'react';

interface DataTableProps {
  data: any[];
}

const formatValue = (value: any) => {
    // 1. Lógica de Números
    if (typeof value === 'number') {
        // Verifica se é um número inteiro (ex: 1500)
        if (value % 1 === 0) {
            return value.toLocaleString('pt-BR', {
                minimumFractionDigits: 0, // 0 casas decimais para inteiros
                maximumFractionDigits: 0
            });
        }
        // É um número decimal (ex: 1500.50)
        return value.toLocaleString('pt-BR', {
            minimumFractionDigits: 2, // 2 casas decimais para floats
            maximumFractionDigits: 2
        });
    }

    // 2. Lógica de Datas
    if (typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('-')) {
         const date = new Date(value);
         // Se tiver 'T' ou ':', é um timestamp completo
         if (value.includes('T') || value.includes(':')) {
             return date.toLocaleString('pt-BR');
         }
         // É apenas uma data
         return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }

    // 3. Outros valores
    return value;
};


export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500 p-4">Sem dados para exibir.</div>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {headers.map((header) => (
                <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowGrap text-sm text-gray-700">
                  {formatValue(row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};