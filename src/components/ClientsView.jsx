import React, { useState, useEffect } from 'react';

export default function ClientsView() {
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Formulario de nuevo cliente
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    vehiculo: '',
    correo: ''
  });

  // Cargar clientes desde localStorage al iniciar
  useEffect(() => {
    const savedClients = localStorage.getItem('icar_clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Datos iniciales por defecto con fecha de registro
      const initialClients = [
        { id: 1, nombre: 'Juan Pérez', telefono: '442 123 4567', vehiculo: 'Nissan Versa 2020', correo: 'juan@email.com', fechaRegistro: '2026-09-15' },
        { id: 2, nombre: 'Taller Mecánico El Rayo', telefono: '442 987 6543', vehiculo: 'Volkswagen Jetta', correo: 'rayo@taller.com', fechaRegistro: '2026-08-01' }
      ];
      setClients(initialClients);
      localStorage.setItem('icar_clients', JSON.stringify(initialClients));
    }
  }, []);

  // Guardar cliente nuevo con fecha automática de hoy
  const handleSaveClient = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;

    // Obtener fecha actual en formato YYYY-MM-DD (simulando 2026-09-23)
    const fechaHoy = '2026-09-23';

    const newClient = {
      id: Date.now(),
      ...formData,
      fechaRegistro: fechaHoy
    };

    const updatedClients = [newClient, ...clients];
    setClients(updatedClients);
    localStorage.setItem('icar_clients', JSON.stringify(updatedClients));

    // Limpiar y cerrar modal
    setFormData({ nombre: '', telefono: '', vehiculo: '', correo: '' });
    setShowModal(false);
  };

  // Filtrar clientes por búsqueda
  const filteredClients = clients.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.vehiculo && c.vehiculo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.telefono && c.telefono.includes(searchTerm))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Gestión de Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">Directorio de clientes y talleres mecánicos frecuentes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          ➕ Nuevo Cliente
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre, vehículo o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-slate-800">Lista de Clientes Registrados</h2>
          <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">{filteredClients.length} registros</span>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
              <th className="p-4">Fecha Registro</th>
              <th className="p-4">Nombre / Taller</th>
              <th className="p-4">Teléfono</th>
              <th className="p-4">Vehículo / Asunto</th>
              <th className="p-4">Correo Electrónico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="p-4 text-xs text-slate-500">{client.fechaRegistro || '2026-09-15'}</td>
                  <td className="p-4 font-bold text-slate-900">{client.nombre}</td>
                  <td className="p-4 text-slate-600">{client.telefono || 'N/D'}</td>
                  <td className="p-4 text-slate-800 font-medium">{client.vehiculo || 'N/D'}</td>
                  <td className="p-4 text-slate-500">{client.correo || 'N/D'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">No hay clientes registrados todavía. Agrega uno nuevo arriba.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para Nuevo Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Registrar Nuevo Cliente</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre o Taller *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez o Taller Mecánico"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="Ej. 442 123 4567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vehículo o Módulo Asociado</label>
                <input
                  type="text"
                  placeholder="Ej. Nissan Versa 2020 / Computadora ECU"
                  value={formData.vehiculo}
                  onChange={(e) => setFormData({...formData, vehiculo: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}