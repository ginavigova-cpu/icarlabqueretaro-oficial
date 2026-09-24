import React, { useState } from 'react';

export default function SalesView() {
  const [sales, setSales] = useState([
    {
      id: 'VTA-001',
      cliente: 'Juan Pérez',
      servicio: 'Reparación de Computadora Automotriz',
      total: 1000.00,
      pagado: 500.00,
      estado: 'Anticipo',
      fecha: '2026-09-10',
      historial: [{ fecha: '2026-09-10', monto: 500.00, concepto: 'Anticipo inicial' }]
    },
    {
      id: 'VTA-002',
      cliente: 'Taller Mecánico El Rayo',
      servicio: 'Programación de Llave',
      total: 1200.00,
      pagado: 1200.00,
      estado: 'Liquidado',
      fecha: '2026-09-11',
      historial: [{ fecha: '2026-09-11', monto: 1200.00, concepto: 'Pago total' }]
    },
    {
      id: 'VTA-003',
      cliente: 'Juan Pérez',
      servicio: 'Diagnóstico de Escáner',
      total: 600.00,
      pagado: 600.00,
      estado: 'Liquidado',
      fecha: '2026-09-12',
      historial: [{ fecha: '2026-09-12', monto: 600.00, concepto: 'Pago total' }]
    }
  ]);

  // Estados de filtros y formularios
  const [reportType, setReportType] = useState('general'); // 'general' o 'cliente'
  const [selectedClientFilter, setSelectedClientFilter] = useState('');
  
  const [newSale, setNewSale] = useState({ cliente: '', servicio: '', total: '', anticipo: '' });
  const [showForm, setShowForm] = useState(false);

  // Obtener lista única de clientes para el filtro
  const uniqueClients = [...new Set(sales.map(s => s.cliente))];

  // Ventas filtradas según el reporte seleccionado
  const filteredSales = reportType === 'cliente' && selectedClientFilter
    ? sales.filter(s => s.cliente === selectedClientFilter)
    : sales;

  // Totales del reporte actual
  const totalMonto = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const totalPagado = filteredSales.reduce((acc, s) => acc + s.pagado, 0);
  const totalPendiente = totalMonto - totalPagado;

  // Registrar nueva venta
  const handleAddSale = (e) => {
    e.preventDefault();
    const totalNum = parseFloat(newSale.total) || 0;
    const anticipoNum = parseFloat(newSale.anticipo) || 0;

    if (totalNum <= 0) return alert('El total debe ser mayor a 0');
    if (anticipoNum > totalNum) return alert('El anticipo no puede ser mayor al total');

    const estado = anticipoNum >= totalNum ? 'Liquidado' : anticipoNum > 0 ? 'Anticipo' : 'Pendiente';
    const fechaHoy = new Date().toISOString().split('T')[0];

    const nuevaVenta = {
      id: `VTA-00${sales.length + 1}`,
      cliente: newSale.cliente,
      servicio: newSale.servicio,
      total: totalNum,
      pagado: anticipoNum,
      estado: estado,
      fecha: fechaHoy,
      historial: anticipoNum > 0 ? [{ fecha: fechaHoy, monto: anticipoNum, concepto: 'Anticipo registrado' }] : []
    };

    setSales([nuevaVenta, ...sales]);
    setNewSale({ cliente: '', servicio: '', total: '', anticipo: '' });
    setShowForm(false);
  };

  // Registrar abono / liquidación
  const handleRegistrarAbono = (saleId) => {
    const abonoStr = prompt('Ingrese el monto a abonar/liquidar:');
    const abono = parseFloat(abonoStr);

    if (isNaN(abono) || abono <= 0) return;

    setSales(sales.map((item) => {
      if (item.id === saleId) {
        const saldoResta = item.total - item.pagado;
        if (abono > saldoResta) {
          alert(`El abono ($${abono}) supera el saldo pendiente ($${saldoResta}).`);
          return item;
        }

        const nuevoPagado = item.pagado + abono;
        const nuevoEstado = nuevoPagado >= item.total ? 'Liquidado' : 'Anticipo';
        const fechaHoy = new Date().toISOString().split('T')[0];

        return {
          ...item,
          pagado: nuevoPagado,
          estado: nuevoEstado,
          historial: [
            ...item.historial,
            { fecha: fechaHoy, monto: abono, concepto: nuevoEstado === 'Liquidado' ? 'Finiquito / Pago Final' : 'Abono a saldo' }
          ]
        };
      }
      return item;
    }));
  };

  // Exportar a CSV (Excel)
  const handleExportCSV = () => {
    if (filteredSales.length === 0) return alert('No hay datos para exportar');
    const headers = 'Folio,Fecha,Cliente,Servicio,Total,Pagado,Saldo,Estado\n';
    const rows = filteredSales.map(s => 
      `${s.id},${s.fecha},"${s.cliente}","${s.servicio}",${s.total},${s.pagado},${s.total - s.pagado},${s.estado}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reporte_ventas_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Imprimir reporte
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 space-y-6">
      {/* Encabezado y Botones Principales */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Control de Ventas y Cobranza</h1>
          <p className="text-slate-500 text-sm">ICAR LAB QUERETARO — Reportes generales y por cliente</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
          >
            + Nueva Venta
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
          >
            Exportar Excel
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
          >
            Imprimir Reporte
          </button>
        </div>
      </div>

      {/* Selector de Tipo de Reporte */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-600">Tipo de Reporte:</span>
          <button
            onClick={() => { setReportType('general'); setSelectedClientFilter(''); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              reportType === 'general' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setReportType('cliente')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
              reportType === 'cliente' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Por Cliente
          </button>
        </div>

        {reportType === 'cliente' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Seleccionar Cliente:</label>
            <select
              value={selectedClientFilter}
              onChange={(e) => setSelectedClientFilter(e.target.value)}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Elige un cliente --</option>
              {uniqueClients.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Formulario de Nueva Venta Desplegable */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <h2 className="text-base font-bold text-slate-700 mb-4">Registrar Nueva Venta / Anticipo</h2>
          <form onSubmit={handleAddSale} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Cliente"
              value={newSale.cliente}
              onChange={(e) => setNewSale({ ...newSale, cliente: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Servicio / Descripción"
              value={newSale.servicio}
              onChange={(e) => setNewSale({ ...newSale, servicio: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Monto Total ($)"
              value={newSale.total}
              onChange={(e) => setNewSale({ ...newSale, total: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <input
              type="number"
              placeholder="Anticipo Recibido ($)"
              value={newSale.anticipo}
              onChange={(e) => setNewSale({ ...newSale, anticipo: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition flex-1">
                Guardar
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Monto Total Global</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">${totalMonto.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Ingresado (Anticipos/Pagos)</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${totalPagado.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Saldo Pendiente por Cobrar</p>
          <p className="text-2xl font-bold text-red-600 mt-1">${totalPendiente.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-700 text-sm">
            {reportType === 'general' ? 'Reporte General de Ventas' : `Reporte del Cliente: ${selectedClientFilter || 'Todos'}`}
          </h2>
          <span className="text-xs text-slate-500">{filteredSales.length} registros encontrados</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
              <th className="p-4">Folio</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Cliente</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Total</th>
              <th className="p-4">Pagado</th>
              <th className="p-4">Saldo Pendiente</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center print:hidden">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {filteredSales.length > 0 ? (
              filteredSales.map((item) => {
                const saldo = item.total - item.pagado;
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{item.id}</td>
                    <td className="p-4 text-xs text-slate-500">{item.fecha}</td>
                    <td className="p-4 font-semibold text-slate-800">{item.cliente}</td>
                    <td className="p-4 text-slate-600">{item.servicio}</td>
                    <td className="p-4 font-semibold text-slate-900">${item.total.toFixed(2)}</td>
                    <td className="p-4 text-emerald-600 font-medium">${item.pagado.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`font-bold ${saldo > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                        ${saldo.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.estado === 'Liquidado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="p-4 text-center print:hidden">
                      {saldo > 0 ? (
                        <button
                          onClick={() => handleRegistrarAbono(item.id)}
                          className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-3 py-1.5 rounded-md transition"
                        >
                          Abonar / Liquidar
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Liquidado</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="p-8 text-center text-slate-400">
                  No se encontraron registros de ventas para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}