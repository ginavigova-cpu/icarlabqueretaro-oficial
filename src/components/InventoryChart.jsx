import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Transformadores', stock: 45 },
  { name: 'Cable Uso Rudo', stock: 120 },
  { name: 'Tableros', stock: 20 },
  { name: 'Luminarias', stock: 85 },
  { name: 'Interruptores', stock: 210 },
  { name: 'Automatización', stock: 60 },
  { name: 'Herramientas', stock: 150 },
];

export default function InventoryChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Nivel de Stock por Categoría</h2>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip />
            <Bar dataKey="stock" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}