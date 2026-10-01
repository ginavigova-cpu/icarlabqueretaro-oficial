import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function InventoryDashboard() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const mockData = [
        { id: 1, name: 'Filtro de Aceite Premium', category: 'Refacciones', stock: 45, minStock: 10, price: 250, image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=100' },
        { id: 2, name: 'Pastillas de Freno Delanteras', category: 'Frenos', stock: 8, minStock: 15, price: 850, image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=100' },
        { id: 3, name: 'Aceite Sintético 5W-30', category: 'Lubricantes', stock: 30, minStock: 10, price: 600, image: 'https://images.unsplash.com/photo-1635784063230-4e0f10c71a39?w=100' },
        { id: 4, name: 'Búfalo de Diagnóstico OBD2', category: 'Herramientas', stock: 3, minStock: 5, price: 3200, image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100' },
        { id: 5, name: 'Amortiguador Trasero', category: 'Suspensión', stock: 12, minStock: 8, price: 1400, image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=100' },
      ];
      setInventory(mockData);
    } catch (error) {
      console.error('Error cargando inventario:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = inventory.length;
  const totalValue = inventory.reduce((acc, item) => acc + (item.stock * item.price), 0);
  const lowStockCount = inventory.filter(item => item.stock <= item.minStock).length;

  const chartData = filteredInventory.map(item => ({
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
    stock: item.stock,
    valorTotal: item.stock * item.price
  }));

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Cargando tablero de inventario...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard de Inventario</h1>
          <p className="text-sm text-gray-500">Monitoreo en tiempo real, alertas de stock y análisis dinámico.</p>
        </div>
        <button 
          onClick={fetchInventory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow"
        >
          Actualizar Datos
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Productos en Catálogo</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{totalProducts}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl font-bold">📦</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Valor Total en Stock</p>
            <h3 className="text-3xl font-extrabold text-gray-800 mt-1">${totalValue.toLocaleString()}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-xl font-bold">💰</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Alertas de Stock Bajo</p>
            <h3 className="text-3xl font-extrabold text-red-600 mt-1">{lowStockCount}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xl font-bold">⚠️</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input 
          type="text"
          placeholder="Buscar producto por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {['Todas', 'Refacciones', 'Frenos', 'Lubricantes', 'Herramientas', 'Suspensión'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-800 mb-4">Stock Actual por Producto (Filtrado)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-md font-bold text-gray-800 mb-4">Valor Monetario por Artículo ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valorTotal" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-md font-bold text-gray-800">Listado Detallado de Inventario</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio Unitario</th>
                <th className="p-4">Stock Actual</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {filteredInventory.length > 0 ? (
                filteredInventory.map(item => {
                  const isLow = item.stock <= item.minStock;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm" 
                        />
                        <span className="font-medium text-gray-800">{item.name}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">${item.price.toLocaleString()}</td>
                      <td className="p-4 font-bold">{item.stock} un.</td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center w-max gap-1">
                            ⚠️ Stock Bajo
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center w-max gap-1">
                            ✅ Óptimo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}