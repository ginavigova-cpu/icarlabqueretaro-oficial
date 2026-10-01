import React, { useState } from 'react';
import InventoryDashboard from './components/InventoryDashboard';
import GeneralDashboard from './components/GeneralDashboard';
import SalesView from './components/SalesView';
import ClientsView from './components/ClientsView';
import SuppliersView from './components/SuppliersView';
import ReportsView from './components/ReportsView';
import ExpensesView from './components/ExpensesView';
import Sidebar from './components/Sidebar';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Estado para la vista previa del reporte
  const [reportModal, setReportModal] = useState({ show: false, title: '', data: [], summary: {} });

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Sensor de Flujo Qro', stock: 45, price: 1200, date: '2026-09-15' },
    { id: 2, name: 'Multímetro Digital Industrial', stock: 12, price: 2500, date: '2026-09-20' },
    { id: 3, name: 'Cable UTP Categoría 6 (Rollo)', stock: 8, price: 1800, date: '2026-09-25' }
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'Industrias Automotrices del Bajío', contact: 'Ing. Roberto Gómez', phone: '442-123-4567' }
  ]);

  const [sales, setSales] = useState([
    { id: 1, client: 'Industrias Automotrices del Bajío', total: 12500, date: '2026-09-28' }
  ]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar de Navegación */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 capitalize">
            {activeTab === 'dashboard' ? 'Panel General' : activeTab}
          </h1>
          <span className="text-sm text-gray-500">ElectroQro ERP</span>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {activeTab === 'dashboard' && (
            <GeneralDashboard 
              inventory={inventory} 
              clients={clients} 
              sales={sales} 
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryDashboard inventory={inventory} setInventory={setInventory} />
          )}

          {activeTab === 'sales' && (
            <SalesView sales={sales} setSales={setSales} clients={clients} inventory={inventory} />
          )}

          {activeTab === 'clients' && (
            <ClientsView clients={clients} setClients={setClients} />
          )}

          {activeTab === 'suppliers' && (
            <SuppliersView />
          )}

          {activeTab === 'expenses' && (
            <ExpensesView />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              reportModal={reportModal} 
              setReportModal={setReportModal} 
              inventory={inventory} 
              sales={sales} 
              clients={clients} 
            />
          )}
        </main>
      </div>
    </div>
  );
}