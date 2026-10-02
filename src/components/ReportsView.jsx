import React, { useState, useEffect } from 'react';

export default function ReportsView() {
  const [activeTab, setActiveTab] = useState('ventas'); 
  const [filter, setFilter] = useState('mensual');

  const [sales] = useState([
    { id: 'VTA-001', cliente: 'Juan Pérez', servicio: 'Reparación de Computadora Automotriz', total: 1000.00, pagado: 500.00, estado: 'Anticipo', fecha: '2026-09-10' },
    { id: 'VTA-002', cliente: 'Taller Mecánico El Rayo', servicio: 'Programación de Llave', total: 1200.00, pagado: 1200.00, estado: 'Liquidado', fecha: '2026-09-11' },
    { id: 'VTA-003', cliente: 'Juan Pérez', servicio: 'Diagnóstico de Escáner', total: 600.00, pagado: 600.00, estado: 'Liquidado', fecha: '2026-09-12' }
  ]);

  const [inventory] = useState([
    { id: 'INV-001', codigo: 'CHIP-ID48', pieza: 'Chip Transponder ID48 (Llaves)', categoria: 'Cerrajería', stockActual: 15, stockMinimo: 5, costoUnitario: 45.00, ubicacion: 'Estante A1', fechaIngreso: '2026-09-14' },
    { id: 'INV-002', codigo: 'MOD-ECU01', pieza: 'Módulo ECU Universal / Repuesto', categoria: 'Electrónica', stockActual: 2, stockMinimo: 3, costoUnitario: 1200.00, ubicacion: 'Vitrina Principal', fechaIngreso: '2026-08-20' },
    { id: 'INV-003', codigo: 'CABLE-OBD2', pieza: 'Cable Conector OBD2 de Diagnóstico', categoria: 'Herramientas / Accesorios', stockActual: 8, stockMinimo: 2, costoUnitario: 250.00, ubicacion: 'Estante B3', fechaIngreso: '2026-09-15' },
    { id: 'INV-004', codigo: 'PILA-CR2032', pieza: 'Batería CR2032 para Llaves Inteligentes', categoria: 'Consumibles', stockActual: 30, stockMinimo: 10, costoUnitario: 10.00, ubicacion: 'Cajón de Mostrador', fechaIngreso: '2026-01-10' }
  ]);

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const savedClients = localStorage.getItem('icar_clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      setClients([
        { id: 1, nombre: 'Juan Pérez', telefono: '442 123 4567', vehiculo: 'Nissan Versa 2020', correo: 'juan@email.com', fechaRegistro: '2026-09-15' },
        { id: 2, nombre: 'Taller Mecánico El Rayo', telefono: '442 987 6543', vehiculo: 'Volkswagen Jetta', correo: 'rayo@taller.com', fechaRegistro: '2026-08-01' }
      ]);
    }
  }, []);

  const filterByPeriod = (items, dateField, tipo) => {
    const today = new Date('2026-09-23');
    return items.filter(item => {
      const rawDate = item[dateField] || '2026-09-15';
      const itemDate = new Date(rawDate);
      const diffTime = today - itemDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (tipo === 'semanal') return diffDays >= 0 && diffDays <= 7;
      if (tipo === 'mensual') return diffDays >= 0 && diffDays <= 30;
      if (tipo === 'anual') return diffDays >= 0 && diffDays <= 365;
      return true;
    });
  };

  const filteredSales = filterByPeriod(sales, 'fecha', filter);
  const totalRevenue = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const totalCollected = filteredSales.reduce((acc, s) => acc + s.pagado, 0);
  const totalPending = totalRevenue - totalCollected;

  const filteredInventory = filterByPeriod(inventory, 'fechaIngreso', filter);
  const totalItemsCount = filteredInventory.reduce((acc, item) => acc + item.stockActual, 0);
  const lowStockCount = filteredInventory.filter(item => item.stockActual <= item.stockMinimo).length;
  const totalInvestment = filteredInventory.reduce((acc, item) => acc + (item.stockActual * item.costoUnitario), 0);

  const filteredClients = filterByPeriod(clients, 'fechaRegistro', filter);
  const totalClientsCount = filteredClients.length;
  const clientsWithVehicle = filteredClients.filter(c => c.vehiculo && c.vehiculo.trim() !== '').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Estilos CSS para el modo de impresión (mantiene fondo claro al imprimir para ahorrar tinta) */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: #white !important;
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Encabezado y Acciones (Oculto al imprimir) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Centro de Reportes</h1>
          <p className="text-sm text-slate-400 mt-0.5">ICAR LAB QUERÉTARO — Análisis operativo y comercial.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Botón de Impresión */}
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
          >
            🖨️ Imprimir Reporte
          </button>

          {/* Selector de Pestañas de Reporte */}
          <div className="flex bg-[#111827] p-1.5 rounded-xl border border-slate-800 shadow-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab('ventas')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === 'ventas' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Ventas
            </button>
            <button
              onClick={() => setActiveTab('inventario')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === 'inventario' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              📦 Piezas
            </button>
            <button
              onClick={() => setActiveTab('clientes')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === 'clientes' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              👥 Clientes
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Temporal (Oculta al imprimir) */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-lg gap-4 no-print">
        <div>
          <h2 className="font-semibold text-white text-sm">
            Período de Análisis: <span className="text-blue-400 uppercase">{activeTab}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Filtrando registros por rango {filter} actual.</p>
        </div>
        <div className="flex bg-[#161f33] p-1 rounded-xl border border-slate-700/50">
          <button
            onClick={() => setFilter('semanal')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'semanal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Semanal
          </button>
          <button
            onClick={() => setFilter('mensual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'mensual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setFilter('anual')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === 'anual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Anual
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL QUE SE IMPRIME */}
      <div id="printable-report" className="space-y-6">
        {/* Encabezado especial para la hoja impresa */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-6">
          <h1 className="text-2xl font-black text-slate-900">ICAR LAB QUERÉTARO</h1>
          <p className="text-sm font-semibold text-slate-600 uppercase">
            Reporte de {activeTab} — Período: {filter.toUpperCase()}
          </p>
          <p className="text-xs text-slate-400 mt-1">Fecha de emisión: 23 de Septiembre de 2026</p>
        </div>

        {/* --- 1. VISTA DE VENTAS --- */}
        {activeTab === 'ventas' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Ingresos Totales ({filter})</p>
                <p className="text-2xl font-bold text-white mt-1.5">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Cobrado (Anticipos)</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1.5">${totalCollected.toFixed(2)}</p>
              </div>
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Pendiente por Cobrar</p>
                <p className="text-2xl font-bold text-red-400 mt-1.5">${totalPending.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-[#111827] rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
              <div className="p-5 bg-[#161f33] border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-semibold text-white text-sm">Detalle de Ventas ({filter.toUpperCase()})</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">{filteredSales.length} registros</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#131b2e] border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                      <th className="p-4">Folio</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Servicio</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Pagado</th>
                      <th className="p-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                    {filteredSales.length > 0 ? (
                      filteredSales.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-bold text-white">{s.id}</td>
                          <td className="p-4 text-xs text-slate-400">{s.fecha}</td>
                          <td className="p-4 font-semibold text-slate-200">{s.cliente}</td>
                          <td className="p-4 text-slate-300">{s.servicio}</td>
                          <td className="p-4 font-semibold text-white">${s.total.toFixed(2)}</td>
                          <td className="p-4 text-emerald-400 font-medium">${s.pagado.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              s.estado === 'Liquidado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              {s.estado}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500">No hay registros de ventas para el período seleccionado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. VISTA DE INVENTARIO / PIEZAS --- */}
        {activeTab === 'inventario' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Piezas Ingresadas ({filter})</p>
                <p className="text-2xl font-bold text-blue-400 mt-1.5">{totalItemsCount} <span className="text-xs font-normal text-slate-400">unidades</span></p>
              </div>
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Alertas de Stock Bajo</p>
                <p className={`text-2xl font-bold mt-1.5 ${lowStockCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {lowStockCount} artículos
                </p>
              </div>
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Inversión en Piezas ({filter})</p>
                <p className="text-2xl font-bold text-white mt-1.5">${totalInvestment.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-[#111827] rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
              <div className="p-5 bg-[#161f33] border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-semibold text-white text-sm">Reporte de Stock por Piezas ({filter.toUpperCase()})</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">{filteredInventory.length} SKUs</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#131b2e] border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                      <th className="p-4">Código SKU</th>
                      <th className="p-4">Fecha Ingreso</th>
                      <th className="p-4">Descripción de Pieza</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Ubicación</th>
                      <th className="p-4">Stock Físico</th>
                      <th className="p-4">Costo U.</th>
                      <th className="p-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => {
                        const isLowStock = item.stockActual <= item.stockMinimo;
                        return (
                          <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 font-bold text-white">{item.codigo}</td>
                            <td className="p-4 text-xs text-slate-400">{item.fechaIngreso}</td>
                            <td className="p-4 font-semibold text-slate-200">{item.pieza}</td>
                            <td className="p-4 text-xs text-slate-400">{item.categoria}</td>
                            <td className="p-4 text-slate-300">{item.ubicacion}</td>
                            <td className="p-4 font-bold text-white">{item.stockActual} pzas</td>
                            <td className="p-4 text-slate-300">${item.costoUnitario.toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                isLowStock ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {isLowStock ? '⚠️ Stock Bajo' : 'Óptimo'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-500">No hay registros de piezas para el período seleccionado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. VISTA DE CLIENTES --- */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Clientes Nuevos ({filter})</p>
                <p className="text-2xl font-bold text-blue-400 mt-1.5">{totalClientsCount} <span className="text-xs font-normal text-slate-400">registros</span></p>
              </div>
              <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
                <p className="text-xs font-semibold text-slate-400 uppercase">Clientes con Vehículo / Módulo Asociado</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1.5">{clientsWithVehicle} <span className="text-xs font-normal text-slate-400">asociados</span></p>
              </div>
            </div>

            <div className="bg-[#111827] rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
              <div className="p-5 bg-[#161f33] border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-semibold text-white text-sm">Reporte de Clientes Registrados ({filter.toUpperCase()})</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">{filteredClients.length} contactos</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#131b2e] border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                      <th className="p-4">Fecha Registro</th>
                      <th className="p-4">Nombre / Taller</th>
                      <th className="p-4">Teléfono</th>
                      <th className="p-4">Vehículo / Asunto</th>
                      <th className="p-4">Correo Electrónico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                    {filteredClients.length > 0 ? (
                      filteredClients.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 text-xs text-slate-400">{client.fechaRegistro || '2026-09-15'}</td>
                          <td className="p-4 font-bold text-white">{client.nombre}</td>
                          <td className="p-4 text-slate-300">{client.telefono || 'N/D'}</td>
                          <td className="p-4 text-slate-200 font-medium">{client.vehiculo || 'N/D'}</td>
                          <td className="p-4 text-slate-400">{client.correo || 'N/D'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-500">No hay clientes registrados para el período seleccionado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}