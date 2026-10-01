import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function GeneralDashboard() {
  // Datos simulados basados en tu operación real (Cotizaciones, Caja Chica, Inventario)
  const [metrics] = useState({
    totalUnidadesMes: 116,
    cotizacionesAprobadas: 36,
    cotizacionesEnviadas: 38,
    saldoPendienteCobro: 48500,
    gastoSemanalCajaChica: 12450,
    alertasStockBajo: 3
  });

  // Datos para gráfico de estatus de unidades/cotizaciones
  const statusData = [
    { name: 'Aprobadas', value: 36 },
    { name: 'Enviadas', value: 38 },
    { name: 'En Negociación', value: 12 },
    { name: 'Rechazadas', value: 5 },
  ];

  // Datos de flujo semanal (Caja chica / Gastos)
  const weeklyExpenseData = [
    { semana: 'Sem 1 (01-06 Sep)', gastos: 9800, ingresos: 45000 },
    { semana: 'Sem 2 (07-13 Sep)', gastos: 11200, ingresos: 52000 },
    { semana: 'Sem 3 (14-20 Sep)', gastos: 8900, ingresos: 38000 },
    { semana: 'Sem 4 (21-27 Sep)', gastos: 12450, ingresos: 61000 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚀 Panel General de Operaciones</h1>
          <p className="text-sm text-gray-500">Resumen consolidado de taller, cotizaciones, caja chica y finanzas.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">
            📅 Septiembre 2026
          </span>
        </div>
      </div>

      {/* Tarjetas de Métricas Clave (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Unidades / Entradas</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{metrics.totalUnidadesMes}</h3>
            <span className="text-xs text-green-600 font-medium">🚗 Activas este mes</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl font-bold">📋</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Cotizaciones Aprobadas</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{metrics.cotizacionesAprobadas}</h3>
            <span className="text-xs text-blue-600 font-medium">✅ Listas para orden</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-xl font-bold">👍</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Saldo Pendiente de Cobro</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">${metrics.saldoPendienteCobro.toLocaleString()}</h3>
            <span className="text-xs text-amber-500 font-medium">⚠️ Por cobrar a clientes</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-xl font-bold">💰</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Alertas de Stock</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1">{metrics.alertasStockBajo}</h3>
            <span className="text-xs text-red-500 font-medium">⚠️ Refacciones críticas</span>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xl font-bold">📦</div>
        </div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Líneas: Ingresos vs Gastos Semanales (Caja Chica) */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-800 mb-4">📈 Flujo Semanal (Ingresos vs Gastos de Caja)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyExpenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="ingresos" stroke="#10B981" strokeWidth={3} name="Ingresos ($)" />
                <Line type="monotone" dataKey="gastos" stroke="#EF4444" strokeWidth={3} name="Gastos ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras: Estado de Cotizaciones */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-800 mb-4">📊 Estado Actual de Cotizaciones de Unidades</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Accesos Rápidos y Alertas Operativas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 text-sm mb-2">🌴 Próximas Vacaciones</h4>
          <p className="text-xs text-gray-500 mb-3">Personal con descanso programado próximamente.</p>
          <div className="p-3 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 flex justify-between items-center">
            <span>Carlos M. (Taller)</span>
            <span className="text-blue-600 font-bold">Próxima semana</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 text-sm mb-2">🎂 Cumpleaños del Mes</h4>
          <p className="text-xs text-gray-500 mb-3">Festejos del equipo en septiembre.</p>
          <div className="p-3 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 flex justify-between items-center">
            <span>Ana Sofía (Administración)</span>
            <span className="text-pink-600 font-bold">¡Felicidades! 🎉</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-800 text-sm mb-2">📦 Pedidos a Proveedores</h4>
          <p className="text-xs text-gray-500 mb-3">Estatus de refacciones solicitadas.</p>
          <div className="p-3 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 flex justify-between items-center">
            <span>Refaccionaria del Centro</span>
            <span className="text-amber-600 font-bold">En camino (2 pzas)</span>
          </div>
        </div>
      </div>
    </div>
  );
}