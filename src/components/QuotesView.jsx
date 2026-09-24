import React, { useState } from 'react';

export default function QuotesView() {
  const [quotes, setQuotes] = useState([
    {
      id: 'COT-001',
      cliente: 'Juan Pérez',
      empresa: 'Particular',
      fecha: '2026-09-10',
      validez: '15 días',
      items: [
        { descripcion: 'Batería Automotriz 12V', cantidad: 1, precioUnitario: 1850.00 },
        { descripcion: 'Mano de obra instalación', cantidad: 1, precioUnitario: 250.00 }
      ],
      estado: 'En proceso'
    },
    {
      id: 'COT-002',
      cliente: 'Ana Morales',
      empresa: 'Taller Mecánico El Rayo',
      fecha: '2026-09-11',
      validez: '30 días',
      items: [
        { descripcion: 'Aceite Sintético 5W30 (Litro)', cantidad: 5, precioUnitario: 320.00 }
      ],
      estado: 'Realizada'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Estado para la nueva cotización o edición
  const [formData, setFormData] = useState({
    cliente: '',
    empresa: '',
    validez: '15 días',
    estado: 'En proceso',
    items: [{ descripcion: '', cantidad: 1, precioUnitario: '' }]
  });

  // Agregar una nueva línea de producto/servicio en el formulario
  const handleAddItemRow = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { descripcion: '', cantidad: 1, precioUnitario: '' }]
    });
  };

  // Actualizar un campo de una línea específica en el formulario
  const handleItemChange = (index, field, value) => {
    const nuevosItems = [...formData.items];
    nuevosItems[index][field] = value;
    setFormData({ ...formData, items: nuevosItems });
  };

  // Eliminar una línea de ítem del formulario
  const handleRemoveItemRow = (index) => {
    if (formData.items.length === 1) return;
    const nuevosItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: nuevosItems });
  };

  // Calcular el total de una cotización específica
  const calcularTotalCotizacion = (items) => {
    return items.reduce((acc, item) => acc + (parseFloat(item.cantidad || 0) * parseFloat(item.precioUnitario || 0)), 0);
  };

  // Guardar Cotización (Crear o Modificar)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cliente) {
      return alert('El nombre del cliente es obligatorio.');
    }

    // Validar que los ítems tengan datos válidos
    for (let item of formData.items) {
      if (!item.descripcion || !item.cantidad || !item.precioUnitario) {
        return alert('Todos los campos de los conceptos (descripción, cantidad y precio) deben estar llenos.');
      }
    }

    if (editingId) {
      // Modificar Cotización Existente
      setQuotes(quotes.map(q => q.id === editingId ? {
        ...q,
        cliente: formData.cliente,
        empresa: formData.empresa || 'Particular',
        validez: formData.validez,
        estado: formData.estado,
        items: formData.items.map(i => ({
          descripcion: i.descripcion,
          cantidad: parseFloat(i.cantidad),
          precioUnitario: parseFloat(i.precioUnitario)
        }))
      } : q));
      setEditingId(null);
    } else {
      // Crear Nueva Cotización
      const nuevaCotizacion = {
        id: `COT-00${quotes.length + 1}`,
        cliente: formData.cliente,
        empresa: formData.empresa || 'Particular',
        fecha: new Date().toISOString().split('T')[0],
        validez: formData.validez,
        estado: formData.estado,
        items: formData.items.map(i => ({
          descripcion: i.descripcion,
          cantidad: parseFloat(i.cantidad),
          precioUnitario: parseFloat(i.precioUnitario)
        }))
      };
      setQuotes([nuevaCotizacion, ...quotes]);
    }

    // Resetear formulario
    setFormData({
      cliente: '',
      empresa: '',
      validez: '15 días',
      estado: 'En proceso',
      items: [{ descripcion: '', cantidad: 1, precioUnitario: '' }]
    });
    setShowForm(false);
  };

  // Cargar datos para Modificar
  const handleEdit = (q) => {
    setEditingId(q.id);
    setFormData({
      cliente: q.cliente,
      empresa: q.empresa,
      validez: q.validez,
      estado: q.estado,
      items: q.items.map(i => ({ ...i }))
    });
    setShowForm(true);
  };

  // Cambiar estado rápido desde la tabla
  const handleCambiarEstado = (id, nuevoEstado) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, estado: nuevoEstado } : q));
  };

  // Exportar a Excel / CSV
  const exportToCSV = () => {
    const headers = 'Folio,Cliente,Empresa,Fecha,Validez,Estado,Total\n';
    const rows = quotes.map(q => {
      const total = calcularTotalCotizacion(q.items);
      return `${q.id},"${q.cliente}","${q.empresa}",${q.fecha},"${q.validez}",${q.estado},${total}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cotizaciones_icar_lab_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Imprimir reporte general
  const handlePrint = () => {
    window.print();
  };

  // Eliminar cotización
  const handleDelete = (id) => {
    if (confirm('¿Deseas eliminar esta cotización?')) {
      setQuotes(quotes.filter(q => q.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Encabezado y Botones */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Módulo de Cotizaciones</h1>
          <p className="text-slate-500 text-sm">ICAR LAB QUERETARO — Creación, control de estados y reportes</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ cliente: '', empresa: '', validez: '15 días', estado: 'En proceso', items: [{ descripcion: '', cantidad: 1, precioUnitario: '' }] });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition"
          >
            + Nueva Cotización
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

      {/* Formulario Completo de Cotización */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm print:hidden space-y-4">
          <h2 className="text-base font-bold text-slate-700">
            {editingId ? 'Modificar Cotización' : 'Crear Nueva Cotización'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nombre del Cliente *"
                value={formData.cliente}
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Empresa / Taller"
                value={formData.empresa}
                onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Validez (ej. 15 días)"
                value={formData.validez}
                onChange={(e) => setFormData({ ...formData, validez: e.target.value })}
                className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="En proceso">En proceso</option>
                <option value="Realizada">Realizada (Aceptada)</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>

            {/* Partidas / Conceptos */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-slate-700">Conceptos / Partidas</h3>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded font-medium transition"
                >
                  + Agregar Concepto
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Descripción del producto o servicio"
                    value={item.descripcion}
                    onChange={(e) => handleItemChange(index, 'descripcion', e.target.value)}
                    className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Cant"
                    value={item.cantidad}
                    onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)}
                    className="w-20 p-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Precio Unitario ($)"
                    value={item.precioUnitario}
                    onChange={(e) => handleItemChange(index, 'precioUnitario', e.target.value)}
                    className="w-36 p-2 border border-slate-300 rounded-lg text-sm"
                    required
                  />
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(index)}
                      className="text-red-500 hover:text-red-700 px-2 text-sm font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-sm transition"
              >
                {editingId ? 'Guardar Cambios' : 'Guardar Cotización'}
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

      {/* Tabla de Cotizaciones */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
              <th className="p-4">Folio</th>
              <th className="p-4">Cliente / Empresa</th>
              <th className="p-4">Fecha / Validez</th>
              <th className="p-4">Detalle / Conceptos</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center print:hidden">Cambiar Estado</th>
              <th className="p-4 text-center print:hidden">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {quotes.map((q) => {
              const totalCotizacion = calcularTotalCotizacion(q.items);
              return (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{q.id}</td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800">{q.cliente}</p>
                    <p className="text-xs text-slate-500">{q.empresa}</p>
                  </td>
                  <td className="p-4 text-xs text-slate-600">
                    <p>Fecha: {q.fecha}</p>
                    <p>Validez: {q.validez}</p>
                  </td>
                  <td className="p-4">
                    <ul className="text-xs text-slate-600 list-disc list-inside">
                      {q.items.map((item, idx) => (
                        <li key={idx}>
                          {item.cantidad}x {item.descripcion} (${item.precioUnitario})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-bold text-slate-900">${totalCotizacion.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      q.estado === 'Realizada' ? 'bg-emerald-100 text-emerald-800' :
                      q.estado === 'Rechazada' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {q.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center print:hidden">
                    <select
                      value={q.estado}
                      onChange={(e) => handleCambiarEstado(q.id, e.target.value)}
                      className="text-xs p-1 border border-slate-300 rounded bg-white"
                    >
                      <option value="En proceso">En proceso</option>
                      <option value="Realizada">Realizada</option>
                      <option value="Rechazada">Rechazada</option>
                    </select>
                  </td>
                  <td className="p-4 text-center print:hidden space-x-1">
                    <button
                      onClick={() => handleEdit(q)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
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