import React from 'react';

export default function KpiCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl ${color}`}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
    </div>
  );
}