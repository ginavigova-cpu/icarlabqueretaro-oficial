import React, { useState, useEffect } from 'react';

export default function ExpensesView() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    concepto: '',
    categoria: 'Servicios Básicos',
    monto: '',
    fecha: new Date().toISOString().split('T')[0] // Fecha de hoy por defecto
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

    // Limpiar formulario (manteniendo la fecha de hoy)
    setFormData({
      concepto: '',
      categoria: 'Servicios Básicos',
      monto: '',
      fecha: new Date().toISOString().split('T')[0]
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* Encabezado */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Control de Gastos</h1>
        <p className="text-sm text-slate-500 mt-1">ICAR LAB QUERÉTARO — Registro de egresos y costos operativos.</p>
      </div>

      {/* Tarjeta de Resumen Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Total de Egresos Registrados</p>
          <p className="text-2xl font-bold text-red-600 mt-1">${totalGastos.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Cantidad de Movimientos</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{expenses.length} <span className="text-xs font-normal text-slate-500">registros</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario para Registrar Gasto */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-4">
          <h2 className="font-bold text-slate-800 text-lg border-b pb-3">Registrar Nuevo Gasto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Concepto / Descripción</label>
              <input
                type="text"
                placeholder="Ej. Compra de herramientas, Renta..."
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
                <option value="Servicios Básicos">Servicios Básicos (Luz, Agua, Internet)</option>
                <option value="Insumos / Herramientas">Insumos / Herramientas de Uso General</option>
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

        {/* Tabla de Listado de Gastos */}
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
                <th className="p-4 text-center">Acciones</th>
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
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No hay gastos registrados todavía.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}