import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar los datos del inventario desde Supabase
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('INVENTORY')
        .select('*');

      if (error) throw error;
      setInventory(data || []);
    } catch (err) {
      console.error('Error al cargar inventario:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar inventario al cambiar a la pestaña de inventario
  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventory();
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8' }}>
      {/* Menú Lateral */}
      <div style={{ width: '250px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '20px' }}>
        <h2 style={{ color: '#1e3a8a', fontSize: '20px', marginBottom: '30px' }}>ICAR LAB<br/><span style={{ fontSize: '12px', color: '#6b7280' }}>QUERETARO ERP</span></h2>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li 
            onClick={() => setActiveTab('dashboard')} 
            style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '6px', marginBottom: '8px', backgroundColor: activeTab === 'dashboard' ? '#e0e7ff' : 'transparent', color: activeTab === 'dashboard' ? '#1e40af' : '#374151', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal' }}
          >
            Dashboard
          </li>
          <li 
            onClick={() => setActiveTab('inventory')} 
            style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '6px', marginBottom: '8px', backgroundColor: activeTab === 'inventory' ? '#e0e7ff' : 'transparent', color: activeTab === 'inventory' ? '#1e40af' : '#374151', fontWeight: activeTab === 'inventory' ? 'bold' : 'normal' }}
          >
            Inventario
          </li>
          <li 
            onClick={() => setActiveTab('clients')} 
            style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '6px', marginBottom: '8px', backgroundColor: activeTab === 'clients' ? '#e0e7ff' : 'transparent', color: activeTab === 'clients' ? '#1e40af' : '#374151' }}
          >
            Clientes
          </li>
          <li 
            onClick={() => setActiveTab('reports')} 
            style={{ padding: '10px 15px', cursor: 'pointer', borderRadius: '6px', marginBottom: '8px', backgroundColor: activeTab === 'reports' ? '#e0e7ff' : 'transparent', color: activeTab === 'reports' ? '#1e40af' : '#374151' }}
          >
            Reportes
          </li>
        </ul>
      </div>

      {/* Contenido Principal */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ color: '#1f2937', marginBottom: '10px' }}>Módulo: Dashboard</h1>
            <p style={{ color: '#4b5563' }}>Sistema completo de control administrativo en línea.</p>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <h1 style={{ color: '#1f2937', marginBottom: '20px' }}>Módulo: Inventario</h1>
            {loading && <p style={{ color: '#2563eb' }}>Cargando registros de Supabase...</p>}
            {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}
            
            {!loading && !error && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px 16px', color: '#374151' }}>Producto</th>
                      <th style={{ padding: '12px 16px', color: '#374151' }}>Detalles / Datos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.length > 0 ? (
                      inventory.map((item, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px 16px', color: '#1f2937', fontWeight: 'bold' }}>
                            {item.product || item.nombre || JSON.stringify(item)}
                          </td>
                          <td style={{ padding: '12px 16px', color: '#4b5563' }}>
                            {JSON.stringify(item)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                          No se encontraron registros en la tabla INVENTORY.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'clients' && (
          <div>
            <h1 style={{ color: '#1f2937' }}>Módulo: Clientes</h1>
            <p style={{ color: '#4b5563' }}>Gestión de clientes y contactos.</p>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h1 style={{ color: '#1f2937' }}>Módulo: Reportes</h1>
            <p style={{ color: '#4b5563' }}>Estadísticas y métricas generales.</p>
          </div>
        )}
      </div>
    </div>
  );
}