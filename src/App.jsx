import React, { useState, useEffect } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('gastos');
  const [filter, setFilter] = useState('semanal');

  // Estados de la aplicación
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    concepto: '',
    categoria: 'Servicios Básicos',
    monto: '',
    fecha: '2026-09-23'
  });

  const [sales] = useState([
    { id: 'VTA-001', cliente: 'Juan Pérez', servicio: 'Reparación de Computadora Automotriz', total: 1000.00, pagado: 500.00, estado: 'Anticipo', fecha: '2026-09-10' },
    { id: 'VTA-002', cliente: 'Taller Mecánico El Rayo', servicio: 'Programación de Llave', total: 1200.00, pagado: 1200.00, estado: 'Liquidado', fecha: '2026-09-11' }
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('icar_expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, concepto: 'Pago de luz (CFE)', categoria: 'Servicios Básicos', monto: 1200.00, fecha: '2026-09-05' },
        { id: 2, concepto: 'Gasolina para entregas', categoria: 'Transporte', monto: 400.00, fecha: '2026-09-20' }
      ];
      setExpenses(initial);
      localStorage.setItem('icar_expenses', JSON.stringify(initial));
    }
  }, []);

  const handleSaveExpense = (e) => {
    e.preventDefault();
    if (!formData.concepto || !formData.monto) return;

    const newExpense = {
      id: Date.now(),
      concepto: formData.concepto,
      categoria: formData.categoria,
      monto: parseFloat(formData.monto),
      fecha: formData.fecha
    };

    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    localStorage.setItem('icar_expenses', JSON.stringify(updated));

    setFormData({
      concepto: '',
      categoria: 'Servicios Básicos',
      monto: '',
      fecha: '2026-09-23'
    });
  };

  const handleDeleteExpense = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    localStorage.setItem('icar_expenses', JSON.stringify(updated));
  };

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

  const filteredExpenses = filterByPeriod(expenses, 'fecha', filter);
  const totalExpensesAmount = filteredExpenses.reduce((acc, e) => acc + e.monto, 0);
  const totalGastosGenerales = expenses.reduce((acc, curr) => acc + curr.monto, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Barra de Navegación */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-black tracking-wider text-blue-400">ICAR LAB QRO</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-medium">Taller</span>
          </div>

          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentView('gastos')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                currentView === 'gastos' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              💸 Gastos
            </button>
            <button
              onClick={() => setCurrentView('reportes')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition ${
                currentView === 'reportes' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              📊 Reportes (Semanal/Mensual)
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1">
        {currentView === 'gastos' && (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Control de Gastos</h1>
              <p className="text-sm text-slate-500 mt-1">ICAR LAB QUERÉTARO — Registro de egresos y costos operativos.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Total Histórico de Egresos</p>
                <p className="text-2xl font-bold text-red-600 mt-1">${totalGastosGenerales.toFixed(2)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-sm font-medium text-slate-500">Total de Movimientos</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{expenses.length} <span className="text-xs font-normal text-slate-500">registros</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Formulario */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-4">
                <h2 className="font-bold text-slate-800 text-lg border-b pb-3">Registrar Nuevo Gasto</h2>
                <form onSubmit={handleSaveExpense} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Concepto</label>
                    <input
                      type="text"
                      placeholder="Ej. Luz, Gasolina..."
                      value={formData.concepto}
                      onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Categoría</label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="Servicios Básicos">Servicios Básicos</option>
                      <option value="Insumos / Herramientas">Insumos / Herramientas</option>
                      <option value="Transporte / Gasolina">Transporte / Gasolina</option>
                      <option value="Renta / Local">Renta / Local</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Monto ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.monto}
                      onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Fecha</label>
                    <input
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl shadow-md transition text-sm"
                  >
                    Guardar Gasto
                  </button>
                </form>
              </div>

              {/* Tabla */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="font-bold text-slate-800">Historial de Gastos</h2>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">{expenses.length} registros</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Concepto</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Monto</th>
                      <th className="p-4 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {expenses.length > 0 ? (
                      expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-slate-50">
                          <td className="p-4 text-xs text-slate-500">{expense.fecha}</td>
                          <td className="p-4 font-bold text-slate-900">{expense.concepto}</td>
                          <td className="p-4">
                            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                              {expense.categoria}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-red-600">-${expense.monto.toFixed(2)}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400">No hay gastos registrados.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {currentView === 'reportes' && (
          <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Centro de Reportes</h1>
                <p className="text-sm text-slate-500 mt-1">ICAR LAB QUERETARO — Análisis Financiero.</p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm w-fit"
              >
                🖨️ Imprimir Reporte de Gastos
              </button>
            </div>

            {/* Barra de Filtros Temporal */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4 no-print">
              <div>
                <h2 className="font-bold text-slate-800">Filtro de Período para Gastos</h2>
                <p className="text-xs text-slate-500">Mostrando datos según el rango seleccionado.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setFilter('semanal')}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition ${filter === 'semanal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Semanal
                </button>
                <button
                  onClick={() => setFilter('mensual')}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition ${filter === 'mensual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setFilter('anual')}
                  className={`px-4 py-2 rounded-md text-xs font-bold transition ${filter === 'anual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Anual
                </button>
              </div>
            </div>

            {/* Contenido Imprimible */}
            <div id="printable-report" className="space-y-6">
              <div className="hidden print:block border-b border-slate-300 pb-4 mb-6">
                <h1 className="text-2xl font-black text-slate-900">ICAR LAB QUERÉTARO</h1>
                <p className="text-sm font-semibold text-slate-600 uppercase">Reporte de Egresos — Período: {filter.toUpperCase()}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-sm font-medium text-slate-500">Total de Gastos ({filter})</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">${totalExpensesAmount.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <p className="text-sm font-medium text-slate-500">Registros en este periodo</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{filteredExpenses.length} movimientos</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h2 className="font-bold text-slate-800">Detalle de Gastos ({filter.toUpperCase()})</h2>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Concepto</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {filteredExpenses.length > 0 ? (
                      filteredExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-slate-50">
                          <td className="p-4 text-xs text-slate-500">{exp.fecha}</td>
                          <td className="p-4 font-bold text-slate-900">{exp.concepto}</td>
                          <td className="p-4"><span className="bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold">{exp.categoria}</span></td>
                          <td className="p-4 font-bold text-red-600">-${exp.monto.toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-400">No hay registros de gastos para el período seleccionado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400 no-print">
        ICAR LAB Querétaro — Control Administrativo © 2026
      </footer>
    </div>
  );
}