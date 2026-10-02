import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Package, 
  Users, 
  FileText, 
  Download, 
  Upload, 
  AlertTriangle, 
  Car 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex h-screen bg-[#0b0f19] text-slate-100 font-sans">
      
      {/* Barra Lateral (Sidebar) */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 flex flex-col justify-between p-4">
        <div>
          {/* Logo / Título */}
          <div className="flex items-center gap-3 px-2 py-4 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide text-white">iCar Lab</h1>
              <p className="text-xs text-slate-400">Sistema de Gestión Automotriz</p>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'orders'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-5 h-5" />
              Órdenes de Servicio
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Package className="w-5 h-5" />
              Inventario & Repuestos
            </button>

            <button
              onClick={() => setActiveTab('clients')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'clients'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Users className="w-5 h-5" />
              Clientes y Vehículos
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'billing'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <FileText className="w-5 h-5" />
              Facturación & Cotización
            </button>
          </nav>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Barra Superior */}
        <header className="h-20 bg-[#111827]/50 border-b border-slate-800/60 px-8 flex items-center justify-between backdrop-blur-md">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{activeTab}</h2>
            <p className="text-xs text-slate-400">Panel general del taller y métricas en tiempo real</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#1f2937] hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700/60 transition-colors">
              <Download className="w-4 h-4" />
              Exportar Datos
            </button>
            <button className="flex items-center gap-2 bg-[#1f2937] hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-sm font-medium border border-slate-700/60 transition-colors">
              <Upload className="w-4 h-4" />
              Importar
            </button>
          </div>
        </header>

        {/* Área de Visualización de Métricas y Secciones */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* Tarjetas de Estadísticas Superior */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-slate-400">Órdenes Activas</span>
                <Wrench className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">2</div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">En taller actualmente</span>
            </div>

            <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-slate-400">Ingresos Estimados</span>
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">$1,350.00</div>
              <span className="text-xs text-slate-400">Facturación acumulada</span>
            </div>

            <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-slate-400">Vehículos Registrados</span>
                <Car className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">2</div>
              <span className="text-xs text-slate-400">En base de datos</span>
            </div>

            <div className="bg-[#111827] border border-slate-800 p-5 rounded-2xl relative overflow-hidden shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-slate-400">Stock Bajo</span>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">1</div>
              <span className="text-xs text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full">Repuestos a reponer</span>
            </div>
          </div>

          {/* Sección Inferior: Alertas y Órdenes Recientes */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Alertas de Inventario Bajo */}
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-white">Alertas de Inventario Bajo</h3>
              </div>
              <div className="bg-[#1a2234] border border-slate-700/50 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-200 text-sm">Filtro de Aceite Sintético</h4>
                  <p className="text-xs text-slate-400 mt-0.5">SKU: FIL-01</p>
                </div>
                <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-3 py-1 rounded-lg font-medium">
                  Stock: 2 (Min: 4)
                </span>
              </div>
            </div>

            {/* Últimas Órdenes Registradas */}
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-white">Últimas Órdenes Registradas</h3>
              </div>
              <div className="space-y-3">
                <div className="bg-[#1a2234] border border-slate-700/50 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-200 text-sm">Orden #2 - Ana Sofía R.</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Honda Civic 2021</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-lg font-medium">
                    En Diagnóstico
                  </span>
                </div>

                <div className="bg-[#1a2234] border border-slate-700/50 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-200 text-sm">Orden #1 - Carlos Mendoza</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Volkswagen Jetta 2019</p>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2.5 py-1 rounded-lg font-medium">
                    En Reparación
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}