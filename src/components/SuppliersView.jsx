import React, { useState } from 'react';

export default function SuppliersView() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 'PROV-001',
      proveedor: 'Refacciones y Autopartes del Bajío',
      contacto: 'Ing. Carlos Mendoza',
      telefono: '442-555-0192',
      totalCompra: 12500.00,
      pagado: 10000.00,
      estado: 'Anticipo'
    },
    {
      id: 'PROV-002',
      proveedor: 'Lubricantes y Aditivos Querétaro',
      contacto: 'Lic. María Soto',
      telefono: '442-333-8821',
      totalCompra: 4500.00,
      pagado: 4500.00,
      estado: 'Liquidado'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    proveedor: '',
    contacto: '',
    telefono: '',
    totalCompra: '',
    pagado: ''
  });

  const totalGeneralCompra = suppliers.reduce((acc, p) => acc + p.totalCompra, 0);
  const totalGeneralPagado = suppliers.reduce((acc, p) => acc + p.pagado, 0);
  const totalGeneralSaldo = totalGeneralCompra - totalGeneralPagado;

  const handleSubmit = (e) => {
    e.preventDefault();
    const compraNum = parseFloat(formData.totalCompra) || 0;
    const pagadoNum = parseFloat(formData.pagado) || 0;

    if (!formData.proveedor || compraNum <= 0) {
      return alert('El nombre del proveedor y un total de compra válido son obligatorios.');
    }
    if (pagadoNum > compraNum) {
      return alert('El monto pagado / anticipo no puede ser mayor al total de la compra.');
    }

    const estado = pagadoNum >= compraNum ? 'Liquidado' : pagadoNum > 0 ? 'Anticipo' : 'Pendiente';

    if (editingId) {
      setSuppliers(suppliers.map(p => p.id === editingId ? {
        ...p,
        proveedor: formData.proveedor,
        contacto: formData.contacto,
        telefono: formData.telefono,
        totalCompra: compraNum,
        pagado: pagadoNum,
        estado: estado
      } : p));
      setEditingId(null);
    } else {
      const nuevoProveedor = {
        id: `PROV-00${suppliers.length + 1}`,
        proveedor: formData.proveedor,
        contacto: formData.contacto || 'N/A',
        telefono: formData.telefono || 'S/N',
        totalCompra: compraNum,
        pagado: pagadoNum,
        estado: estado
      };
      setSuppliers([nuevoProveedor, ...suppliers]);
    }

    setFormData({ proveedor: '', contacto: '', telefono: '', totalCompra: '', pagado: '' });
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      proveedor: p.proveedor,
      contacto: p.contacto,
      telefono: p.telefono,
      totalCompra: p.totalCompra,
      pagado: p.pagado
    });
    setShowForm(true);
  };

  const handleRegistrarAbono = (id) => {
    const abonoStr = prompt('Ingrese el monto del anticipo / abono a abonar:');
    const abono = parseFloat(abonoStr);

    if (isNaN(abono) || abono <= 0) return;

    setSuppliers(suppliers.map(p => {
      if (p.id === id) {
        const saldoPendiente = p.totalCompra - p.pagado;
        if (abono > saldoPendiente) {
          alert(`El abono ($${abono}) excede el saldo pendiente ($${saldoPendiente}).`);
          return p;
        }
        const nuevoPagado = p.pagado + abono;
        const nuevoEstado = nuevoPagado >= p.totalCompra ? 'Liquidado' : 'Anticipo';
        return { ...p, pagado: nuevoPagado, estado: nuevoEstado };
      }
      return p;
    }));
  };

  const exportToCSV = () => {
    const headers = 'Código,Proveedor,Contacto,Teléfono,Total Compra,Pagado/Anticipo,Saldo Pendiente,Estado\n';
    const rows = suppliers.map(p => 
      `${p.id},"${p.proveedor}","${p.contacto}","${p.telefono}",${p.totalCompra},${p.pagado},${p.totalCompra - p.pagado},${p.estado}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `proveedores_icar_lab_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = (id) => {
    if (confirm('¿Deseas eliminar este proveedor del registro?')) {
      setSuppliers(suppliers.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Control de Proveedores y Cuentas</h1>
          <p className="text-slate-500 text-sm">ICAR LAB QUERETARO — Compras, anticipos y saldos pendientes</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setEditingId(null); setFormData({ proveedor: '', contacto: '', telefono: '', totalCompra: '', pagado: '' }); setShowForm(!showForm); }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition"
          >
            + Agregar Proveedor
          </button>
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition"
          >
            Exportar Excel
          </button>
          <button
            onClick={handlePrint}
            className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition"
          >
            Imprimir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Compras</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">${totalGeneralCompra.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Total Pagado / Anticipos</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${totalGeneralPagado.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Saldo Total Pendiente</p>
          <p className="text-2xl font-bold text-red-600 mt-1">${totalGeneralSaldo.toFixed(2)}</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <h2 className="text-base font-bold text-slate-700 mb-4">
            {editingId ? 'Modificar Datos de Proveedor' : 'Registrar Nuevo Proveedor y Compra'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Nombre del Proveedor / Empresa *"
              value={formData.proveedor}
              onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Persona de Contacto"
              value={formData.contacto}
              onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Total de Compra ($) *"
              value={formData.totalCompra}
              onChange={(e) => setFormData({ ...formData, totalCompra: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Anticipo / Pagado ($)"
              value={formData.pagado}
              onChange={(e) => setFormData({ ...formData, pagado: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2 items-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition flex-1"
              >
                {editingId ? 'Guardar Cambios' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
              <th className="p-4">Código</th>
              <th className="p-4">Proveedor / Contacto</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Total Compra</th>
              <th className="p-4">Pagado</th>
              <th className="p-4">Saldo Pendiente</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center print:hidden">Abonar</th>
              <th className="p-4 text-center print:hidden">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {suppliers.map((p) => {
              const saldo = p.totalCompra - p.pagado;
              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{p.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{p.proveedor}</p>
                    <p className="text-xs text-slate-500">{p.contacto}</p>
                  </td>
                  <td className="p-4 text-slate-600">{p.telefono}</td>
                  <td className="p-4 font-semibold text-slate-900">${p.totalCompra.toFixed(2)}</td>
                  <td className="p-4 text-emerald-600 font-medium">${p.pagado.toFixed(2)}</td>
                  <td className="p-4 font-bold text-red-600">${saldo.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      p.estado === 'Liquidado' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center print:hidden">
                    {saldo > 0 ? (
                      <button
                        onClick={() => handleRegistrarAbono(p.id)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded transition"
                      >
                        Abonar
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">Saldado</span>
                    )}
                  </td>
                  <td className="p-4 text-center print:hidden space-x-1">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}