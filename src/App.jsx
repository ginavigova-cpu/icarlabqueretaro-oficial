import React, { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [reportSubTab, setReportSubTab] = useState('semanal');
  const [reportType, setReportType] = useState('financiero'); // 'financiero', 'inventario', 'ventas', 'gastos', 'clientes'
  
  // Estados para datos operativos
  const [expenses, setExpenses] = useState([
    { id: 1, fecha: '2026-09-05', concepto: 'Pago de luz (CFE)', categoria: 'Servicios Básicos', monto: 1200 },
    { id: 2, fecha: '2026-09-20', concepto: 'Gasolina para entregas', categoria: 'Transporte', monto: 800 }
  ]);
  const [newExpense, setNewExpense] = useState({ fecha: '', concepto: '', categoria: 'Servicios Básicos', monto: '' });

  const [inventory, setInventory] = useState([
    { id: 1, codigo: 'REF-001', nombre: 'Aceite Sintético 5W30', stock: 15, precio: 250 },
    { id: 2, codigo: 'REF-002', nombre: 'Filtro de Aceite Universal', stock: 30, precio: 120 }
  ]);
  const [newInv, setNewInv] = useState({ codigo: '', nombre: '', stock: '', precio: '' });

  const [sales, setSales] = useState([
    { id: 1, cliente: 'Juan Pérez', total: 1450, fecha: '2026-09-22', estado: 'Completado' }
  ]);
  const [newSale, setNewSale] = useState({ cliente: '', total: '', fecha: '', estado: 'Completado' });

  const [clients, setClients] = useState([
    { id: 1, nombre: 'Juan Pérez', telefono: '4421234567', vehiculo: 'Nissan Versa 2022', correo: 'juan@email.com' }
  ]);
  const [newClient, setNewClient] = useState({ nombre: '', telefono: '', vehiculo: '', correo: '' });

  const [suppliers, setSuppliers] = useState([
    { id: 1, nombre: 'Refaccionaria Querétaro', contacto: 'Lic. Gómez', telefono: '4429876543' }
  ]);
  const [newSup, setNewSup] = useState({ nombre: '', contacto: '', telefono: '' });

  const [quotes, setQuotes] = useState([
    { id: 1, folio: 'COT-001', cliente: 'María López', total: 2800, fecha: '2026-09-23' }
  ]);
  const [newQuote, setNewQuote] = useState({ folio: '', cliente: '', total: '', fecha: '' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Menú Lateral */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-black text-white tracking-wider">ICAR LAB</h1>
          <p className="text-xs text-sky-400 font-medium mt-1">QUERETARO ERP</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'inventario', label: 'Inventario', icon: '📦' },
            { id: 'ventas', label: 'Ventas', icon: '💰' },
            { id: 'cotizaciones', label: 'Cotizaciones', icon: '📄' },
            { id: 'proveedores', label: 'Proveedores', icon: '🚚' },
            { id: 'clientes', label: 'Clientes', icon: '👥' },
            { id: 'reportes', label: 'Reportes', icon: '📈' },
            { id: 'gastos', label: 'Gastos', icon: '💸' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === item.id 
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/30' 
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <span className="text-sm font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            Módulo Activo: <span className="text-sky-600 uppercase">{currentView}</span>
          </span>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition shadow-sm"
          >
            🖨️ Imprimir Vista
          </button>
        </header>

        <div className="p-8 flex-1 overflow-y-auto space-y-6">
          {/* Dashboard */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Panel General</h2>
                <p className="text-slate-500">Bienvenido al sistema completo de control administrativo en línea.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas Totales</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-2">${sales.reduce((acc, s) => acc + Number(s.total || 0), 0)}.00</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventario Activo</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-2">{inventory.length} Artículos</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gastos Registrados</p>
                  <p className="text-3xl font-extrabold text-slate-800 mt-2">${expenses.reduce((acc, e) => acc + Number(e.monto || 0), 0)}.00</p>
                </div>
              </div>
            </div>
          )}

          {/* Inventario */}
          {currentView === 'inventario' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Inventario de Refacciones</h2>
                <button onClick={handlePrint} className="text-sm bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg font-medium hover:bg-sky-100 transition">Imprimir Inventario</button>
              </div>
              <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                <input type="text" placeholder="Código" value={newInv.codigo} onChange={e => setNewInv({...newInv, codigo: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="text" placeholder="Nombre" value={newInv.nombre} onChange={e => setNewInv({...newInv, nombre: e.target.value})} className="border p-2 rounded text-sm w-1/3 bg-white" />
                <input type="number" placeholder="Stock" value={newInv.stock} onChange={e => setNewInv({...newInv, stock: e.target.value})} className="border p-2 rounded text-sm w-1/6 bg-white" />
                <input type="number" placeholder="Precio" value={newInv.precio} onChange={e => setNewInv({...newInv, precio: e.target.value})} className="border p-2 rounded text-sm w-1/6 bg-white" />
                <button 
                  onClick={() => { 
                    if(newInv.codigo && newInv.nombre) { 
                      setInventory([...inventory, {id: Date.now(), ...newInv}]); 
                      setNewInv({codigo:'', nombre:'', stock:'', precio:''}); 
                    } 
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Código</th>
                    <th className="pb-3">Descripción</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3">Precio</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">{item.codigo}</td>
                      <td className="py-3">{item.nombre}</td>
                      <td className="py-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-semibold">{item.stock} pzas</span></td>
                      <td className="py-3 font-semibold">${item.precio}.00</td>
                      <td className="py-3 text-right"><button onClick={() => setInventory(inventory.filter(i => i.id !== item.id))} className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-2 py-1 rounded">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Ventas */}
          {currentView === 'ventas' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Registro de Ventas</h2>
                <button onClick={handlePrint} className="text-sm bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg font-medium hover:bg-sky-100 transition">Imprimir Ventas</button>
              </div>
              <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                <input type="text" placeholder="Cliente" value={newSale.cliente} onChange={e => setNewSale({...newSale, cliente: e.target.value})} className="border p-2 rounded text-sm w-1/3 bg-white" />
                <input type="date" value={newSale.fecha} onChange={e => setNewSale({...newSale, fecha: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="number" placeholder="Total" value={newSale.total} onChange={e => setNewSale({...newSale, total: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <button 
                  onClick={() => { 
                    if(newSale.cliente && newSale.total) { 
                      setSales([...sales, {id: Date.now(), ...newSale}]); 
                      setNewSale({cliente:'', total:'', fecha:'', estado:'Completado'}); 
                    } 
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Total</th>
                    <th className="pb-3">Estado</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">{s.cliente}</td>
                      <td className="py-3">{s.fecha}</td>
                      <td className="py-3 font-semibold">${s.total}.00</td>
                      <td className="py-3"><span className="px-2 py-1 bg-sky-50 text-sky-700 rounded-md font-semibold">{s.estado}</span></td>
                      <td className="py-3 text-right"><button onClick={() => setSales(sales.filter(item => item.id !== s.id))} className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-2 py-1 rounded">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Cotizaciones */}
          {currentView === 'cotizaciones' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Cotizaciones</h2>
                <button onClick={handlePrint} className="text-sm bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg font-medium hover:bg-sky-100 transition">Imprimir Cotizaciones</button>
              </div>
              <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                <input type="text" placeholder="Folio (ej. COT-002)" value={newQuote.folio} onChange={e => setNewQuote({...newQuote, folio: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="text" placeholder="Cliente" value={newQuote.cliente} onChange={e => setNewQuote({...newQuote, cliente: e.target.value})} className="border p-2 rounded text-sm w-1/3 bg-white" />
                <input type="date" value={newQuote.fecha} onChange={e => setNewQuote({...newQuote, fecha: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="number" placeholder="Total" value={newQuote.total} onChange={e => setNewQuote({...newQuote, total: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <button 
                  onClick={() => { 
                    if(newQuote.folio && newQuote.cliente) { 
                      setQuotes([...quotes, {id: Date.now(), ...newQuote}]); 
                      setNewQuote({folio:'', cliente:'', total:'', fecha:''}); 
                    } 
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Folio</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Total Estimado</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {quotes.map(q => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">{q.folio}</td>
                      <td className="py-3">{q.cliente}</td>
                      <td className="py-3">{q.fecha}</td>
                      <td className="py-3 font-semibold">${q.total}.00</td>
                      <td className="py-3 text-right"><button onClick={() => setQuotes(quotes.filter(item => item.id !== q.id))} className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-2 py-1 rounded">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Proveedores */}
          {currentView === 'proveedores' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Directorio de Proveedores</h2>
                <button onClick={handlePrint} className="text-sm bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg font-medium hover:bg-sky-100 transition">Imprimir Proveedores</button>
              </div>
              <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                <input type="text" placeholder="Nombre Proveedor" value={newSup.nombre} onChange={e => setNewSup({...newSup, nombre: e.target.value})} className="border p-2 rounded text-sm w-1/3 bg-white" />
                <input type="text" placeholder="Contacto" value={newSup.contacto} onChange={e => setNewSup({...newSup, contacto: e.target.value})} className="border p-2 rounded text-sm w-1/3 bg-white" />
                <input type="text" placeholder="Teléfono" value={newSup.telefono} onChange={e => setNewSup({...newSup, telefono: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <button 
                  onClick={() => { 
                    if(newSup.nombre) { 
                      setSuppliers([...suppliers, {id: Date.now(), ...newSup}]); 
                      setNewSup({nombre:'', contacto:'', telefono:''}); 
                    } 
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map(sup => (
                  <div key={sup.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-800">{sup.nombre}</h3>
                      <p className="text-sm text-slate-600 mt-1">Contacto: {sup.contacto}</p>
                      <p className="text-sm text-slate-600">Teléfono: {sup.telefono}</p>
                    </div>
                    <button onClick={() => setSuppliers(suppliers.filter(item => item.id !== sup.id))} className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-2 py-1 rounded">Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clientes */}
          {currentView === 'clientes' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Cartera de Clientes</h2>
                <button onClick={handlePrint} className="text-sm bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg font-medium hover:bg-sky-100 transition">Imprimir Clientes</button>
              </div>
              <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                <input type="text" placeholder="Nombre" value={newClient.nombre} onChange={e => setNewClient({...newClient, nombre: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="text" placeholder="Teléfono" value={newClient.telefono} onChange={e => setNewClient({...newClient, telefono: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="text" placeholder="Vehículo" value={newClient.vehiculo} onChange={e => setNewClient({...newClient, vehiculo: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="text" placeholder="Correo" value={newClient.correo} onChange={e => setNewClient({...newClient, correo: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <button 
                  onClick={() => { 
                    if(newClient.nombre) { 
                      setClients([...clients, {id: Date.now(), ...newClient}]); 
                      setNewClient({nombre:'', telefono:'', vehiculo:'', correo:''}); 
                    } 
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Nombre</th>
                    <th className="pb-3">Teléfono</th>
                    <th className="pb-3">Vehículo</th>
                    <th className="pb-3">Correo</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {clients.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-3 font-medium text-slate-900">{c.nombre}</td>
                      <td className="py-3">{c.telefono}</td>
                      <td className="py-3 font-semibold text-sky-600">{c.vehiculo}</td>
                      <td className="py-3 text-slate-500">{c.correo}</td>
                      <td className="py-3 text-right"><button onClick={() => setClients(clients.filter(item => item.id !== c.id))} className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-2 py-1 rounded">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reportes Separados */}
          {currentView === 'reportes' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Módulo de Reportes</h2>
                  <p className="text-sm text-slate-500">Selecciona el tipo de reporte y el periodo que deseas consultar.</p>
                </div>
                <button onClick={handlePrint} className="bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition">🖨️ Imprimir Este Reporte</button>
              </div>

              {/* Selector de Tipo de Reporte (Inventario, Ventas, Gastos, Clientes, Financiero) */}
              <div className="flex flex-wrap gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {[
                  { id: 'financiero', label: '📊 Financiero General' },
                  { id: 'ventas', label: '💰 Ventas' },
                  { id: 'inventario', label: '📦 Inventario' },
                  { id: 'gastos', label: '💸 Gastos' },
                  { id: 'clientes', label: '👥 Clientes' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      reportType === type.id 
                        ? 'bg-sky-600 text-white shadow' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {/* Pestañas de Periodo: Semanal / Mensual / Anual */}
              <div className="flex gap-2 border-b border-slate-200 pb-3">
                {['semanal', 'mensual', 'anual'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setReportSubTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm capitalize transition ${
                      reportSubTab === tab 
                        ? 'bg-slate-900 text-white shadow' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Periodo: {tab}
                  </button>
                ))}
              </div>

              {/* Contenido Dinámico según el Reporte Seleccionado */}
              <div className="pt-2">
                {reportType === 'financiero' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-base capitalize">Resumen Financiero Global ({reportSubTab})</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Ingresos (Ventas)</p>
                        <p className="text-2xl font-bold text-slate-800 mt-1">${sales.reduce((acc, s) => acc + Number(s.total || 0), 0)}.00</p>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Egresos (Gastos)</p>
                        <p className="text-2xl font-bold text-rose-600 mt-1">${expenses.reduce((acc, e) => acc + Number(e.monto || 0), 0)}.00</p>
                      </div>
                    </div>
                  </div>
                )}

                {reportType === 'ventas' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-base capitalize">Reporte de Ventas ({reportSubTab})</h3>
                    <table className="w-full text-left border-collapse text-sm bg-white border rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                        <tr><th className="p-3">Cliente</th><th className="p-3">Fecha</th><th className="p-3">Estado</th><th className="p-3">Total</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {sales.map(s => (
                          <tr key={s.id}><td className="p-3 font-medium">{s.cliente}</td><td className="p-3">{s.fecha}</td><td className="p-3">{s.estado}</td><td className="p-3 font-bold text-slate-900">${s.total}.00</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportType === 'inventario' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-base capitalize">Reporte de Inventario ({reportSubTab})</h3>
                    <table className="w-full text-left border-collapse text-sm bg-white border rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                        <tr><th className="p-3">Código</th><th className="p-3">Descripción</th><th className="p-3">Stock</th><th className="p-3">Precio</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {inventory.map(i => (
                          <tr key={i.id}><td className="p-3 font-medium">{i.codigo}</td><td className="p-3">{i.nombre}</td><td className="p-3 font-semibold text-emerald-600">{i.stock} pzas</td><td className="p-3 font-bold">${i.precio}.00</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportType === 'gastos' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-base capitalize">Reporte de Gastos ({reportSubTab})</h3>
                    <table className="w-full text-left border-collapse text-sm bg-white border rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                        <tr><th className="p-3">Fecha</th><th className="p-3">Concepto</th><th className="p-3">Categoría</th><th className="p-3">Monto</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {expenses.map(e => (
                          <tr key={e.id}><td className="p-3">{e.fecha}</td><td className="p-3 font-medium">{e.concepto}</td><td className="p-3">{e.categoria}</td><td className="p-3 font-bold text-rose-600">${e.monto}.00</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {reportType === 'clientes' && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-base capitalize">Reporte de Clientes ({reportSubTab})</h3>
                    <table className="w-full text-left border-collapse text-sm bg-white border rounded-lg overflow-hidden">
                      <thead className="bg-slate-100 text-slate-500 uppercase text-xs">
                        <tr><th className="p-3">Nombre</th><th className="p-3">Teléfono</th><th className="p-3">Vehículo</th><th className="p-3">Correo</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {clients.map(c => (
                          <tr key={c.id}><td className="p-3 font-medium">{c.nombre}</td><td className="p-3">{c.telefono}</td><td className="p-3 text-sky-600">{c.vehiculo}</td><td className="p-3 text-slate-500">{c.correo}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gastos */}
          {currentView === 'gastos' && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Módulo de Control de Gastos</h2>
                <button onClick={handlePrint} className="text-sm bg-sky-50 text-sky-600 border border-sky-200 px-3 py-1.5 rounded-lg font-medium hover:bg-sky-100 transition">Imprimir Gastos</button>
              </div>
              <div className="flex gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200 items-center">
                <input type="date" value={newExpense.fecha} onChange={e => setNewExpense({...newExpense, fecha: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white" />
                <input type="text" placeholder="Concepto (ej. Luz, Gasolina)" value={newExpense.concepto} onChange={e => setNewExpense({...newExpense, concepto: e.target.value})} className="border p-2 rounded text-sm w-1/3 bg-white" />
                <select value={newExpense.categoria} onChange={e => setNewExpense({...newExpense, categoria: e.target.value})} className="border p-2 rounded text-sm w-1/4 bg-white">
                  <option value="Servicios Básicos">Servicios Básicos</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Refacciones">Refacciones</option>
                </select>
                <input type="number" placeholder="Monto" value={newExpense.monto} onChange={e => setNewExpense({...newExpense, monto: e.target.value})} className="border p-2 rounded text-sm w-1/6 bg-white" />
                <button 
                  onClick={() => { 
                    if(newExpense.concepto && newExpense.monto) { 
                      setExpenses([...expenses, {id: Date.now(), ...newExpense}]); 
                      setNewExpense({fecha:'', concepto:'', categoria:'Servicios Básicos', monto:''}); 
                    } 
                  }} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-bold shadow-sm"
                >
                  +
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Fecha</th>
                    <th className="pb-3">Concepto</th>
                    <th className="pb-3">Categoría</th>
                    <th className="pb-3">Monto</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {expenses.map(ex => (
                    <tr key={ex.id} className="hover:bg-slate-50">
                      <td className="py-3">{ex.fecha}</td>
                      <td className="py-3 font-medium text-slate-900">{ex.concepto}</td>
                      <td className="py-3"><span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md font-medium">{ex.categoria}</span></td>
                      <td className="py-3 font-bold text-rose-600">${ex.monto}.00</td>
                      <td className="py-3 text-right"><button onClick={() => setExpenses(expenses.filter(item => item.id !== ex.id))} className="text-rose-600 hover:text-rose-800 font-bold text-xs bg-rose-50 px-2 py-1 rounded">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
          ICAR LAB Querétaro — Control Administrativo &copy; 2026
        </footer>
      </main>
    </div>
  );
}
