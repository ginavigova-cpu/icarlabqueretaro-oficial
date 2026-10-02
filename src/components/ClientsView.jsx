import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, X, Car } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gestión de Clientes</h1>
          <p className="text-sm text-slate-400 mt-0.5">Directorio de clientes y talleres mecánicos frecuentes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Buscar por nombre, vehículo o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
        />
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-[#111827] rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
        <div className="p-5 bg-[#161f33] border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-white text-sm">Lista de Clientes Registrados</h2>
          </div>
          <span className="text-xs font-medium text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
            {filteredClients.length} registros
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#131b2e] border-b border-slate-800 text-slate-400 text-xs uppercase font-semibold tracking-wider">
                <th className="p-4">Fecha Registro</th>
                <th className="p-4">Nombre / Taller</th>
                <th className="p-4">Teléfono</th>
                <th className="p-4">Vehículo / Asunto</th>
                <th className="p-4">Correo Electrónico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-xs text-slate-400">{client.fechaRegistro || '2026-09-15'}</td>
                    <td className="p-4 font-semibold text-white">{client.nombre}</td>
                    <td className="p-4 text-slate-300">{client.telefono || 'N/D'}</td>
                    <td className="p-4 text-slate-200 font-medium">{client.vehiculo || 'N/D'}</td>
                    <td className="p-4 text-slate-400">{client.correo || 'N/D'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No hay clientes registrados todavía. Agrega uno nuevo arriba.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Nuevo Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">Registrar Nuevo Cliente</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Nombre o Taller *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez o Taller Mecánico"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Teléfono</label>
                <input
                  type="text"
                  placeholder="Ej. 442 123 4567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Vehículo o Módulo Asociado</label>
                <input
                  type="text"
                  placeholder="Ej. Nissan Versa 2020 / Computadora ECU"
                  value={formData.vehiculo}
                  onChange={(e) => setFormData({...formData, vehiculo: e.target.value})}
                  className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formData.correo}
                  onChange={(e) => setFormData({...formData, correo: e.target.value})}
                  className="w-full bg-[#1a2234] border border-slate-700/60 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 transition"
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