import React from 'react';

export default function CriticalStockTable() {
  const items = [
    { id: 'PROD-001', name: 'Tablero Industrial 480V', stock: 3, min: 10, status: 'Crítico' },
    { id: 'PROD-042', name: 'Cable Calibre 10 AWG (m)', stock: 15, min: 50, status: 'Bajo' },
    { id: 'PROD-108', name: 'Transformador 45kVA', stock: 1, min: 5, status: 'Crítico' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Stock Crítico</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3">Código</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Mínimo</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-3 font-medium text-slate-900">{item.id}</td>
                <td className="p-3">{item.name}</td>
                <td className="p-3 font-bold text-slate-800">{item.stock}</td>
                <td className="p-3">{item.min}</td>
                <td className="p-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Crítico' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}