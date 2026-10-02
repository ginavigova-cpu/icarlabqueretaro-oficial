import React, { useEffect } from 'react';
import { Activity, Calendar, TrendingUp, TrendingDown, DollarSign, Cpu, RefreshCw } from 'lucide-react';
import Chart from 'chart.js/auto';

export default function DashboardView() {
  useEffect(() => {
    // 1. Gráfica Financiera (Líneas)
    const ctxFinancial = document.getElementById('financialChart').getContext('2d');
    const financialChart = new Chart(ctxFinancial, {
      type: 'line',
      data: {
        labels: ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
        datasets: [
          {
            label: 'Ingresos',
            data: [32000, 38000, 41000, 45000, 43000, 48250],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#3b82f6',
            pointRadius: 4
          },
          {
            label: 'Egresos',
            data: [10500, 11200, 9800, 13000, 11500, 12400],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#ef4444',
            pointRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 } } }
        },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    // 2. Gráfica de Gastos (Doughnut)
    const ctxExpenses = document.getElementById('expensesChart').getContext('2d');
    const expensesChart = new Chart(ctxExpenses, {
      type: 'doughnut',
      data: {
        labels: ['Servicios Básicos', 'Insumos / Herramientas', 'Transporte', 'Renta y Otros'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#3b82f6', '#a855f7', '#10b981', '#f59e0b'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        cutout: '75%'
      }
    });

    // 3. Gráfica de Servicios Populares (Barras)
    const ctxServices = document.getElementById('servicesChart').getContext('2d');
    const servicesChart = new Chart(ctxServices, {
      type: 'bar',
      data: {
        labels: ['Diagnóstico ECU', 'Programación', 'Reparación ABS', 'Airbag Reset', 'Llaves Chip'],
        datasets: [{
          label: 'Servicios Realizados',
          data: [42, 35, 28, 22, 19],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(236, 72, 153, 0.8)'
          ],
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    // Limpieza de gráficas al desmontar el componente
    return () => {
      financialChart.destroy();
      expensesChart.destroy();
      servicesChart.destroy();
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner de Bienvenida */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-[#111827] border border-blue-500/20 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Resumen General del Mes</h2>
          <p className="text-sm text-slate-300 mt-1">Monitoreo en tiempo real de ingresos, servicios de laboratorio y gastos operativos.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar Métricas
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-blue-500/50 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ingresos Totales</p>
              <h3 className="text-2xl font-extrabold text-white mt-2">$48,250.00</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-semibold">+14.2% <span className="text-slate-400 font-normal">vs mes anterior</span></div>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-red-500/50 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Egresos / Gastos</p>
              <h3 className="text-2xl font-extrabold text-red-400 mt-2">-$12,400.00</h3>
            </div>
            <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20"><TrendingDown className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 text-xs text-slate-400">Operación general y suministros</div>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Utilidad Neta</p>
              <h3 className="text-2xl font-extrabold text-emerald-400 mt-2">$35,850.00</h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><DollarSign className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 text-xs text-emerald-400 font-semibold">Margen del 74.3%</div>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Servicios Activos</p>
              <h3 className="text-2xl font-extrabold text-purple-400 mt-2">28 Proyectos</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20"><Cpu className="w-5 h-5" /></div>
          </div>
          <div className="mt-4 text-xs text-purple-300 font-semibold">4 pendientes de entrega</div>
        </div>
      </div>

      {/* Gráficas Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Comportamiento Financiero Anual</h3>
              <p className="text-xs text-slate-400">Comparativa mensual de ingresos y egresos (MXN)</p>
            </div>
            <span className="text-xs bg-slate-800 px-3 py-1 rounded-full text-slate-300 border border-slate-700 font-medium">2026</span>
          </div>
          <div className="h-80 relative">
            <canvas id="financialChart"></canvas>
          </div>
        </div>

        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-bold text-white">Gastos por Categoría</h3>
            <p className="text-xs text-slate-400">Desglose porcentual de egresos</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <canvas id="expensesChart"></canvas>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Servicios Básicos</span><span className="font-bold">45%</span></div>
            <div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-purple-500"></span> Insumos</span><span className="font-bold">25%</span></div>
            <div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Transporte</span><span className="font-bold">20%</span></div>
            <div className="flex justify-between items-center text-slate-300"><span className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> Otros</span><span className="font-bold">10%</span></div>
          </div>
        </div>
      </div>

      {/* Gráfica Secundaria y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-lg">
          <div className="mb-6">
            <h3 className="text-base font-bold text-white">Servicios de Laboratorio Más Solicitados</h3>
            <p className="text-xs text-slate-400">Volumen de trabajos por área técnica</p>
          </div>
          <div className="h-72 relative">
            <canvas id="servicesChart"></canvas>
          </div>
        </div>

        <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-lg overflow-hidden flex flex-col">
          <div className="p-5 bg-[#161f33] border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-white text-sm">Últimos Movimientos Registrados</h3>
            <span className="text-xs text-blue-400 font-semibold cursor-pointer hover:underline">Ver todos</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#131b2e] border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold">
                  <th className="p-4">Concepto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Diagnóstico Electrónico ECU</td>
                  <td className="p-4"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-xs font-medium">Ingreso</span></td>
                  <td className="p-4 text-xs text-slate-400">2026-09-28</td>
                  <td className="p-4 font-bold text-emerald-400 text-right">+$2,500.00</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Pago de luz (CFE)</td>
                  <td className="p-4"><span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-2.5 py-1 rounded-full text-xs font-medium">Servicios Básicos</span></td>
                  <td className="p-4 text-xs text-slate-400">2026-09-25</td>
                  <td className="p-4 font-bold text-red-400 text-right">-$1,200.00</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Programación de Llave Pro</td>
                  <td className="p-4"><span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-xs font-medium">Ingreso</span></td>
                  <td className="p-4 text-xs text-slate-400">2026-09-22</td>
                  <td className="p-4 font-bold text-emerald-400 text-right">+$1,800.00</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-white">Gasolina para entregas</td>
                  <td className="p-4"><span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-2.5 py-1 rounded-full text-xs font-medium">Transporte</span></td>
                  <td className="p-4 text-xs text-slate-400">2026-09-20</td>
                  <td className="p-4 font-bold text-red-400 text-right">-$400.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}