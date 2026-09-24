import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'inventory', label: 'Inventario', icon: 'fa-boxes' },
    { id: 'sales', label: 'Ventas', icon: 'fa-cash-register' },
    { id: 'quotes', label: 'Cotizaciones', icon: 'fa-file-invoice-dollar' },
    { id: 'suppliers', label: 'Proveedores', icon: 'fa-truck' },
    { id: 'clients', label: 'Clientes', icon: 'fa-users' },
    { id: 'reports', label: 'Reportes', icon: 'fa-chart-bar' }, // <- Aquí agregamos la pestaña de reportes
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Encabezado o Logo */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="font-bold text-xl text-blue-600 tracking-wide">ICAR LAB</h1>
        <p className="text-xs text-gray-400 mt-0.5">QUERETARO ERP</p>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={
                isActive
                  ? "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left bg-blue-600 text-white shadow-md transition-colors"
                  : "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left text-gray-600 hover:bg-gray-100 transition-colors"
              }
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}