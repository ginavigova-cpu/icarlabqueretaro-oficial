import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Trash2, DollarSign, Calendar } from 'lucide-react';

export default function ExpensesView() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    concepto: '',
    categoria: 'Servicios Básicos',
    monto: '',
    fecha: '2026-09-23' // Fecha estándar del sistema
  });

  // Cargar gastos guardados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('icar_expenses');
    if (saved) {
      setExpenses(JSON.parse(saved));
    } else {
      // Datos iniciales de prueba si está vacío
      const initial = [
        { id: 1, concepto: 'Pago de luz (CFE)', categoria: 'Servicios Básicos', monto: 1200.00, fecha: '2026-09-05' },
        { id: 2, concepto: 'Gasolina para entregas', categoria: 'Transporte', monto: 400.00, fecha: '2026-09-20' }
      ];
      setExpenses(initial);
      localStorage.setItem('icar_expenses', JSON.stringify(initial));
    }
  }, []);

  // Guardar nuevo gasto
  const handleSubmit = (e) => {
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

    // Limpiar formulario (manteniendo la fecha actual)
    setFormData({
      concepto: '',
      categoria: 'Servicios Básicos',
      monto: '',
      fecha: '2026-09-23'
    });
  };

  // Eliminar un gasto
  const handleDelete = (id) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    localStorage.setItem('icar_expenses', JSON.stringify(updated));
  };

  const totalGastos = expenses.reduce((acc, curr) => acc + curr.monto, 0);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Control de Gastos</h1>
        <p className="text-sm text-slate-400 mt-0.5">ICAR LAB QUERÉTARO — Registro de egresos y costos operativos.</p>
      </div>

      {/* Tarjeta de Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total de Egresos Registrados</p>
          <p className="text-2xl font-bold text-red-400 mt-1.5">-${totalGastos.toFixed(2)}</p>
        </div>
        <div className="bg-[#111827] p-5 rounded-2xl shadow-lg border border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase">Cantidad de Movimientos</p>
          <p className="text-2xl font-bold text-white mt-1.5">{expenses.length} <span className="text-xs font-normal text-slate-400">registros</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario para Registrar Gasto */}
        <div className="bg-[#111827] p-6 rounded-2xl shadow-lg border border-slate-800 h-fit space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="font-bold text-white text-base">Registrar Nuevo Gasto</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Concepto / Descripción *</label>
              <input
                type="text"
                placeholder="Ej. Compra de herramientas, Renta..."
                value={formData.concepto}
                onChange={(e) => setFormData({ ...formData, concepto: e.target.value })}
                required
                className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Categoría</label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Servicios Básicos">Servicios Básicos (Luz, Agua, Internet)</option>
                <option value="Insumos / Herramientas">Insumos / Herramientas de Uso General</option>
                <option value="Transporte / Gasolina">Transporte / Gasolina</option>
                <option value="Renta / Local">Renta / Local</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Monto ($) *</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.monto}
                onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                required
                className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                required
                className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Guardar Gasto
            </button>
          </form>
        </div>

        {/* Tabla de Listado de Gastos */}
        <div className="lg:col-span-2 bg-[#111827] rounded-2xl shadow-lg border border-slate-800 overflow-hidden flex flex-col">
          <div className="p-5 bg-[#161f33] border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h2 className="font-semibold text-white text-sm">Historial de Gastos</h2>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
              {expenses.length} registros
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#131b2e] border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Concepto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-xs text-slate-400">{expense.fecha}</td>
                      <td className="p-4 font-semibold text-white">{expense.concepto}</td>
                      <td className="p-4">
                        <span className="bg-slate-800/80 text-slate-300 border border-slate-700/50 px-2.5 py-1 rounded-full text-xs font-medium">
                          {expense.categoria}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-red-400">-${expense.monto.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-red-400 hover:text-red-300 text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-xl transition flex items-center justify-center gap-1 mx-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No hay gastos registrados todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}