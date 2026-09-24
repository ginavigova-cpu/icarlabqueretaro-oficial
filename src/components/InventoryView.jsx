import React, { useState } from 'react';

export default function InventoryView() {
  const [items, setItems] = useState([
    { id: 'INV-001', producto: 'Batería Automotriz 12V', stock: 14, precio: 1850.00, categoria: 'Refacciones' },
    { id: 'INV-002', producto: 'Aceite Sintético 5W30', stock: 4, precio: 320.00, categoria: 'Insumos' },
    { id: 'INV-003', producto: 'Juego de Balatas Delanteras', stock: 8, precio: 950.00, categoria: 'Frenos' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    producto: '',
    stock: '',
    precio: '',
    categoria: 'Refacciones'
  });

  // Cálculo del valor total del inventario en dinero
  const valorTotalInventario = items.reduce((acc, item) => acc + (item.stock * item.precio), 0);
  const totalArticulos = items.reduce((acc, item) => acc + item.stock, 0);

  // Agregar nuevo producto
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.producto || !newItem.precio) return alert('Completa todos los campos obligatorios');

    const itemNuevo = {
      id: `INV-00${items.length + 1}`,
      producto: newItem.producto,
      stock: parseInt(newItem.stock) || 0,
      precio: parseFloat(newItem.precio) || 0,
      categoria: newItem.categoria
    };

    setItems([...items, itemNuevo]);
    setNewItem({ producto: '', stock: '', precio: '', categoria: 'Refacciones' });
    setShowForm(false);
  };

  // Modificar Cantidades (Entradas / Salidas)
  const handleAdjustStock = (id, tipo) => {
    const cantidadStr = prompt(tipo === 'entrada' ? 'Ingrese la cantidad a sumar (ENTRADA):' : 'Ingrese la cantidad a restar (SALIDA):');
    const cantidad = parseInt(cantidadStr);

    if (isNaN(cantidad) || cantidad <= 0) return;

    setItems(items.map(item => {
      if (item.id === id) {
        let nuevoStock = item.stock;
        if (tipo === 'entrada') {
          nuevoStock += cantidad;
        } else {
          if (cantidad > item.stock) {
            alert('No puedes retirar más piezas de las que hay en existencia.');
            return item;
          }
          nuevoStock -= cantidad;
        }
        return { ...item, stock: nuevoStock };
      }
      return item;
    }));
  };

  // Exportar a CSV / Excel
  const exportToCSV = () => {
    const headers = 'Código,Producto,Categoría,Stock,Precio Unitario,Valor Total\n';
    const rows = items.map(i => `${i.id},"${i.producto}",${i.categoria},${i.stock},${i.precio},${i.stock * i.precio}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventario_icar_lab_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Imprimir reporte
  const handlePrint = () => {
    window.print();
  };

  // Eliminar producto
  const handleDelete = (id) => {
    if (confirm('¿Deseas eliminar este producto del inventario?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Encabezado y Botones de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Control de Inventario</h1>
          <p className="text-slate-500 text-sm">ICAR LAB QUERETARO — Entradas, salidas y valoración de stock</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition flex items-center gap-1"
          >
            + Agregar Producto
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

      {/* Tarjetas de Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Piezas Totales en Stock</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{totalArticulos} unidades</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold uppercase text-slate-500">Valor Total del Inventario</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${valorTotalInventario.toFixed(2)}</p>
        </div>
      </div>

      {/* Formulario desplegable para nuevo producto */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all print:hidden">
          <h2 className="text-base font-bold text-slate-700 mb-4">Registrar Nuevo Producto</h2>
          <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Descripción del producto"
              value={newItem.producto}
              onChange={(e) => setNewItem({ ...newItem, producto: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Cantidad / Stock inicial"
              value={newItem.stock}
              onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio Unitario ($)"
              value={newItem.precio}
              onChange={(e) => setNewItem({ ...newItem, precio: e.target.value })}
              className="p-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition flex-1"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg text-sm transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de Inventario */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
              <th className="p-4">Código</th>
              <th className="p-4">Producto / Descripción</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Stock Actual</th>
              <th className="p-4">Precio U.</th>
              <th className="p-4">Valor Total</th>
              <th className="p-4 text-center print:hidden">Ajustar Entradas / Salidas</th>
              <th className="p-4 text-center print:hidden">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {items.map((item) => {
              const valorFila = item.stock * item.precio;
              return (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{item.id}</td>
                  <td className="p-4 font-semibold text-slate-800">{item.producto}</td>
                  <td className="p-4 text-xs text-slate-500">{item.categoria}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.stock} pzas
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">${item.precio.toFixed(2)}</td>
                  <td className="p-4 font-bold text-slate-900">${valorFila.toFixed(2)}</td>
                  <td className="p-4 text-center print:hidden space-x-2">
                    <button
                      onClick={() => handleAdjustStock(item.id, 'entrada')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2.5 py-1.5 rounded transition font-medium"
                      title="Registrar Entrada"
                    >
                      + Entrar
                    </button>
                    <button
                      onClick={() => handleAdjustStock(item.id, 'salida')}
                      className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1.5 rounded transition font-medium"
                      title="Registrar Salida"
                    >
                      - Salida
                    </button>
                  </td>
                  <td className="p-4 text-center print:hidden">
                    <button
                      onClick={() => handleDelete(item.id)}
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