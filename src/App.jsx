import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Conexión a Supabase (reemplaza con tus datos o asegúrate de usar variables de entorno)
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para cargar los datos del inventario desde Supabase
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('INVENTORY').select('*');
      if (error) {
        console.error('Error al consultar inventario:', error.message);
      } else {
        setInventory(data || []);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'inventario') {
      fetchInventory();
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', background: '#f8f9fa', borderRight: '1px solid #dee2e6', padding: '20px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#1d4ed8', marginBottom: '30px' }}>ICAR LAB QUERÉTARO</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li 
            onClick={() => setActiveTab('dashboard')} 
            style={{ padding: '10px 15px', cursor: 'pointer', background: activeTab === 'dashboard' ? '#e2e8f0' : 'transparent', borderRadius: '6px', marginBottom: '5px' }}
          >
            Dashboard
          </li>
          <li 
            onClick={() => setActiveTab('inventario')} 
            style={{ padding: '10px 15px', cursor: 'pointer', background: activeTab === 'inventario' ? '#e2e8f0' : 'transparent', borderRadius: '6px', marginBottom: '5px' }}
          >
            Inventario
          </li>
          <li 
            onClick={() => setActiveTab('ventas')} 
            style={{ padding: '10px 15px', cursor: 'pointer', background: activeTab === 'ventas' ? '#e2e8f0' : 'transparent', borderRadius: '6px', marginBottom: '5px' }}
          >
            Ventas
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div style={{ flex: 1, padding: '40px', background: '#f1f5f9', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h1>Módulo: Dashboard</h1>
            <p>Sistema completo de control administrativo en línea.</p>
          </div>
        )}

        {activeTab === 'inventario' && (
          <div>
            <h1>Módulo: Inventario</h1>
            <p>Listado de productos sincronizados desde Supabase:</p>
            
            {loading ? (
              <p>Cargando datos...</p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', marginTop: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                  <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px', borderBottom: '1px solid #cbd5e1' }}>ID</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid #cbd5e1' }}>Nombre</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid #cbd5e1' }}>Stock</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid #cbd5e1' }}>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length > 0 ? (
                    inventory.map((item) => (
                      <tr key={item.id}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{item.id}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{item.NAME}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>{item.STOCK}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>${item.PRICE}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                        No hay productos registrados en el inventario.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'ventas' && (
          <div>
            <h1>Módulo: Ventas</h1>
            <p>Gestión de ventas y transacciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}