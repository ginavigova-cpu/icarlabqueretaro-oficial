import React from 'react';
import KpiCard from './KpiCard';
import InventoryChart from './InventoryChart';
import CriticalStockTable from './CriticalStockTable';

export default function Dashboard() {
  return (
    <main className="flex-1 p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Panel de Control ERP</h2>
          <p className="text-slate-500 text-sm">Resumen del estado del sistema e inventario</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KpiCard title="Total Productos" value="1,248" icon="fa-box" color="bg-blue-600" />
        <KpiCard title="Valor Inventario" value="$842,500" icon="fa-dollar-sign" color="bg-emerald-600" />
        <KpiCard title="Alertas de Stock" value="12" icon="fa-triangle-exclamation" color="bg-amber-500" />
        <KpiCard title="Órdenes Activas" value="28" icon="fa-truck-fast" color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InventoryChart />
        <CriticalStockTable />
      </div>
    </main>
  );
}