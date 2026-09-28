import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Asegúrate de que la ruta a tu archivo supabase.js sea correcta

export default function InventoryView() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', stock: '', price: '', category: '' });

  // Cargar inventario desde Supabase al iniciar
  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al cargar inventario:', error.message);
    } else {
      setInventory(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Agregar un producto nuevo
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!form.name || !form.stock || !form.price || !form.category) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const { error } = await supabase
      .from('inventory')
      .insert([
        {
          name: form.name,
          stock: parseInt(form.stock, 10),
          price: parseFloat(form.price),
          category: form.category
        }
      ]);

    if (error) {
      console.error('Error al agregar producto:', error.message);
      alert('Error al guardar el producto.');
    } else {
      setForm({ name: '', stock: '', price: '', category: '' });
      fetchInventory(); // Recargar la lista
    }
  };

  // Eliminar un producto por ID
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar producto:', error.message);
      alert('No se pudo eliminar el producto.');
    } else {
      fetchInventory(); // Recargar la lista
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestión de Inventario</h1>

      {/* Formulario para agregar productos */}
      <form onSubmit={handleAddProduct} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Nombre del producto"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Agregar Producto
        </button>
      </form>

      {/* Tabla de productos */}
      <div className="bg-white rounded shadow overflow-hidden">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Cargando inventario...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-left">
                <th className="p-3">Nombre</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Categoría</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No hay productos registrados en el inventario.
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.stock}</td>
                    <td className="p-3">${item.price}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteProduct(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}