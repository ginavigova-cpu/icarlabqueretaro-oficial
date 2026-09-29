import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estado para la vista previa del reporte
  const [reportModal, setReportModal] = useState({ show: false, title: '', data: [], summary: {} });

  const [inventory, setInventory] = useState([
    { id: 1, name: 'Sensor de Flujo Qro', stock: 45, price: 1200, date: '2026-09-15' },
    { id: 2, name: 'Multímetro Digital Industrial', stock: 12, price: 2500, date: '2026-09-20' },
    { id: 3, name: 'Cable UTP Categoría 6 (Rollo)', stock: 8, price: 1800, date: '2026-09-25' }
  ]);

  const [clients, setClients] = useState([
    { id: 1, name: 'Industrias Automotrices del Bajío', contact: 'Ing. Roberto Gómez', phone: '442-123-4567', date: '2026-08-10' },
    { id: 2, name: 'Tecnología y Manufactura Queretana', contact: 'Lic. María Fernández', phone: '442-987-6543', date: '2026-09-01' }
  ]);

  const [sales, setSales] = useState([
    { id: 101, client: 'Industrias Automotrices del Bajío', totalValue: 12400, total: '$12,400.00', status: 'Completado', date: '2026-09-20' },
    { id: 102, client: 'Tecnología y Manufactura Queretana', totalValue: 5100, total: '$5,100.00', status: 'En Proceso', date: '2026-09-27' }
  ]);

  const totalRevenue = sales.reduce((acc, sale) => acc + (sale.totalValue || 0), 0);
  const totalStockUnits = inventory.reduce((acc, item) => acc + Number(item.stock || 0), 0);

  const handleAddItem = (type) => {
    const currentDate = new Date().toISOString().split('T')[0];
    if (type === 'inventory') {
      const name = prompt('Nombre del nuevo producto:');
      const stock = prompt('Cantidad en stock:');
      const price = prompt('Precio unitario:');
      if (name) {
        setInventory([...inventory, { id: Date.now(), name, stock: Number(stock) || 0, price: Number(price) || 0, date: currentDate }]);
      }
    } else if (type === 'clients') {
      const name = prompt('Nombre de la empresa cliente:');
      const contact = prompt('Nombre del contacto:');
      const phone = prompt('Teléfono:');
      if (name) {
        setClients([...clients, { id: Date.now(), name, contact, phone, date: currentDate }]);
      }
    } else if (type === 'sales') {
      const client = prompt('Nombre del cliente o empresa:');
      const totalNum = prompt('Monto total de la venta (ej. 3500):');
      const status = prompt('Estado (Completado / En Proceso):') || 'Completado';
      if (client && totalNum) {
        const numVal = Number(totalNum) || 0;
        const formattedTotal = `$${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        setSales([...sales, { id: Math.floor(100 + Math.random() * 900), client, totalValue: numVal, total: formattedTotal, status, date: currentDate }]);
      }
    }
  };

  const handleEditItem = (type, id) => {
    if (type === 'inventory') {
      const item = inventory.find(i => i.id === id);
      if (!item) return;
      const name = prompt('Modificar nombre del producto:', item.name);
      const stock = prompt('Modificar cantidad en stock:', item.stock);
      const price = prompt('Modificar precio unitario:', item.price);
      if (name !== null) {
        setInventory(inventory.map(i => i.id === id ? { ...i, name, stock: Number(stock) || 0, price: Number(price) || 0 } : i));
      }
    } else if (type === 'clients') {
      const client = clients.find(c => c.id === id);
      if (!client) return;
      const name = prompt('Modificar empresa cliente:', client.name);
      const contact = prompt('Modificar nombre del contacto:', client.contact);
      const phone = prompt('Modificar teléfono:', client.phone);
      if (name !== null) {
        setClients(clients.map(c => c.id === id ? { ...c, name, contact, phone } : c));
      }
    } else if (type === 'sales') {
      const sale = sales.find(s => s.id === id);
      if (!sale) return;
      const client = prompt('Modificar cliente o empresa:', sale.client);
      const totalNum = prompt('Modificar monto total de la venta:', sale.totalValue);
      const status = prompt('Modificar estado (Completado / En Proceso):', sale.status);
      if (client !== null && totalNum !== null) {
        const numVal = Number(totalNum) || 0;
        const formattedTotal = `$${numVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        setSales(sales.map(s => s.id === id ? { ...s, client, totalValue: numVal, total: formattedTotal, status } : s));
      }
    }
  };

  const handleDelete = (type, id) => {
    if (confirm('¿Estás seguro de eliminar este registro?')) {
      if (type === 'inventory') setInventory(inventory.filter(item => item.id !== id));
      if (type === 'clients') setClients(clients.filter(client => client.id !== id));
      if (type === 'sales') setSales(sales.filter(sale => sale.id !== id));
    }
  };

  // Preparar datos para la vista previa antes de exportar
  const handlePreviewReport = (moduleName, periodType) => {
    const now = new Date();
    const period = periodType.toUpperCase();

    const getWeekNumber = (d) => {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
      var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
      return weekNo;
    };

    let previewData = [];
    let summaryInfo = {};

    if (moduleName === 'Inventario') {
      previewData = inventory.map(i => ({ col1: i.name, col2: `${i.stock} unids.`, col3: `$${i.price.toFixed(2)}`, col4: i.date }));
      summaryInfo = { label1: 'Total Productos', val1: inventory.length, label2: 'Stock Total', val2: `${totalStockUnits} unids.` };
    } else if (moduleName === 'Clientes') {
      previewData = clients.map(c => ({ col1: c.name, col2: c.contact, col3: c.phone, col4: c.date }));
      summaryInfo = { label1: 'Total Clientes', val1: clients.length, label2: 'Estado', val2: 'Activos' };
    } else if (moduleName === 'Ventas') {
      const filteredSales = sales.filter(s => {
        const saleDate = new Date(s.date);
        if (periodType === 'semanal') return getWeekNumber(saleDate) === getWeekNumber(now) && saleDate.getFullYear() === now.getFullYear();
        if (periodType === 'mensual') return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        if (periodType === 'anual') return saleDate.getFullYear() === now.getFullYear();
        return true;
      });
      previewData = filteredSales.map(s => ({ col1: `#${s.id} - ${s.client}`, col2: s.total, col3: s.status, col4: s.date }));
      const periodRev = filteredSales.reduce((acc, s) => acc + s.totalValue, 0);
      summaryInfo = { label1: 'Transacciones', val1: filteredSales.length, label2: 'Ingresos Periodo', val2: `$${periodRev.toLocaleString()}` };
    } else {
      const filteredSales = sales.filter(s => {
        const saleDate = new Date(s.date);
        if (periodType === 'semanal') return getWeekNumber(saleDate) === getWeekNumber(now) && saleDate.getFullYear() === now.getFullYear();
        if (periodType === 'mensual') return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
        if (periodType === 'anual') return saleDate.getFullYear() === now.getFullYear();
        return true;
      });
      const periodRev = filteredSales.reduce((acc, s) => acc + s.totalValue, 0);
      previewData = [
        { col1: 'Ingresos Totales del Periodo', col2: `$${periodRev.toLocaleString()}`, col3: '-', col4: '-' },
        { col1: 'Total Transacciones', col2: filteredSales.length, col3: '-', col4: '-' },
        { col1: 'Productos en Inventario', col2: inventory.length, col3: '-', col4: '-' },
        { col1: 'Clientes Activos', col2: clients.length, col3: '-', col4: '-' }
      ];
      summaryInfo = { label1: 'Periodo Evaluado', val1: period, label2: 'Estado Sistema', val2: 'Óptimo' };
    }

    setReportModal({
      show: true,
      title: `Vista Previa: Reporte de ${moduleName} (${period})`,
      moduleName,
      periodType,
      data: previewData,
      summary: summaryInfo
    });
  };

  // Descarga real al confirmar en la vista previa
  const handleDownloadFromModal = () => {
    const { moduleName, periodType, data } = reportModal;
    const now = new Date();
    const period = periodType.toUpperCase();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Reporte de ${moduleName} - Periodo: ${period} - Fecha: ${now.toISOString().split('T')[0]}\r\n\r\n`;

    if (moduleName === 'Inventario') {
      csvContent += "Producto,Stock,Precio,Fecha\r\n";
      inventory.forEach(i => csvContent += `"${i.name}",${i.stock},${i.price},${i.date}\r\n`);
    } else if (moduleName === 'Clientes') {
      csvContent += "Empresa,Contacto,Telefono,Fecha\r\n";
      clients.forEach(c => csvContent += `"${c.name}","${c.contact}","${c.phone}",${c.date}\r\n`);
    } else {
      csvContent += "Detalle,Monto/Total,Estado,Fecha\r\n";
      data.forEach(d => csvContent += `"${d.col1}",${d.col2},${d.col3},${d.col4}\r\n`);
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_${moduleName}_${period}_ICAR_LAB.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setReportModal({ show: false, title: '', data: [], summary: {} });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f8', minHeight: '100vh', margin: 0, padding: '20px' }}>
      {/* Encabezado del ERP */}
      <header style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ color: '#1e3a8a', margin: '0 0 10px 0' }}>ICAR LAB - ERP QUERETARO</h2>
          <nav style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {['dashboard', 'inventory', 'clients', 'sales'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: activeTab === tab ? '#2563eb' : '#e2e8f0',
                  color: activeTab === tab ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}
              >
                {tab === 'dashboard' ? 'Dashboard' : tab === 'inventory' ? 'Inventario' : tab === 'clients' ? 'Clientes' : 'Ventas'}
              </button>
            ))}
          </nav>
        </div>
        <button 
          onClick={handlePrint}
          style={{ padding: '10px 15px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          🖨️ Imprimir Vista
        </button>
      </header>

      {/* Contenido según la pestaña activa */}
      <main style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ color: '#334155', margin: '0 0 5px 0' }}>Panel Principal (Dashboard Ejecutivo)</h3>
                <p style={{ color: '#64748b', margin: 0 }}>Resumen general de operaciones con vista previa de reportes.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ alignSelf: 'center', fontWeight: 'bold', color: '#475569', fontSize: '13px' }}>Vista Previa Reporte:</span>
                <button onClick={() => handlePreviewReport('Ejecutivo', 'semanal')} style={{ padding: '6px 12px', backgroundColor: '#ca8a04', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Semanal</button>
                <button onClick={() => handlePreviewReport('Ejecutivo', 'mensual')} style={{ padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Mensual</button>
                <button onClick={() => handlePreviewReport('Ejecutivo', 'anual')} style={{ padding: '6px 12px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Anual</button>
              </div>
            </div>

            {/* Tarjetas de Métricas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderLeft: '5px solid #2563eb', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>INGRESOS TOTALES</h4>
                <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>
                  ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderLeft: '5px solid #16a34a', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>PRODUCTOS EN INVENTARIO</h4>
                <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#16a34a', margin: 0 }}>
                  {inventory.length} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#64748b' }}>({totalStockUnits} unids.)</span>
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderLeft: '5px solid #ca8a04', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>CLIENTES ACTIVOS</h4>
                <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#ca8a04', margin: 0 }}>
                  {clients.length} empresas
                </p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderLeft: '5px solid #0f766e', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '14px' }}>VENTAS REGISTRADAS</h4>
                <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#0f766e', margin: 0 }}>
                  {sales.length} transacciones
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#334155', margin: 0 }}>Módulo de Inventario</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => handleAddItem('inventory')} style={{ padding: '8px 15px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ➕ Agregar Producto
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handlePreviewReport('Inventario', 'semanal')} style={{ padding: '8px 10px', backgroundColor: '#ca8a04', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Semanal</button>
                  <button onClick={() => handlePreviewReport('Inventario', 'mensual')} style={{ padding: '8px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Mensual</button>
                  <button onClick={() => handlePreviewReport('Inventario', 'anual')} style={{ padding: '8px 10px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Anual</button>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px', color: '#334155' }}>Nombre del Producto</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Stock</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Precio</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Fecha Registro</th>
                    <th style={{ padding: '12px', color: '#334155', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{item.name}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{item.stock} unidades</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{item.date}</td>
                      <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEditItem('inventory', item.id)} style={{ padding: '5px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Modificar</button>
                        <button onClick={() => handleDelete('inventory', item.id)} style={{ padding: '5px 10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Quitar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#334155', margin: 0 }}>Módulo de Clientes</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => handleAddItem('clients')} style={{ padding: '8px 15px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ➕ Agregar Cliente
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handlePreviewReport('Clientes', 'semanal')} style={{ padding: '8px 10px', backgroundColor: '#ca8a04', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Semanal</button>
                  <button onClick={() => handlePreviewReport('Clientes', 'mensual')} style={{ padding: '8px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Mensual</button>
                  <button onClick={() => handlePreviewReport('Clientes', 'anual')} style={{ padding: '8px 10px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Anual</button>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px', color: '#334155' }}>Empresa</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Contacto</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Teléfono</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Fecha Registro</th>
                    <th style={{ padding: '12px', color: '#334155', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{client.name}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{client.contact}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{client.phone}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{client.date}</td>
                      <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEditItem('clients', client.id)} style={{ padding: '5px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Modificar</button>
                        <button onClick={() => handleDelete('clients', client.id)} style={{ padding: '5px 10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Quitar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ color: '#334155', margin: 0 }}>Módulo de Ventas</h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => handleAddItem('sales')} style={{ padding: '8px 15px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  ➕ Agregar Venta
                </button>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => handlePreviewReport('Ventas', 'semanal')} style={{ padding: '8px 10px', backgroundColor: '#ca8a04', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Semanal</button>
                  <button onClick={() => handlePreviewReport('Ventas', 'mensual')} style={{ padding: '8px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Mensual</button>
                  <button onClick={() => handlePreviewReport('Ventas', 'anual')} style={{ padding: '8px 10px', backgroundColor: '#0f766e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>👁️ Anual</button>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '12px', color: '#334155' }}>ID Venta</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Cliente</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Total</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Estado</th>
                    <th style={{ padding: '12px', color: '#334155' }}>Fecha</th>
                    <th style={{ padding: '12px', color: '#334155', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px', color: '#1e293b' }}>#{sale.id}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{sale.client}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>{sale.total}</td>
                      <td style={{ padding: '12px', color: '#1e293b' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: sale.status === 'Completado' ? '#dcfce7' : '#fef9c3', color: sale.status === 'Completado' ? '#166534' : '#854d0e', fontSize: '12px', fontWeight: 'bold' }}>
                          {sale.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{sale.date}</td>
                      <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button onClick={() => handleEditItem('sales', sale.id)} style={{ padding: '5px 10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>✏️ Modificar</button>
                        <button onClick={() => handleDelete('sales', sale.id)} style={{ padding: '5px 10px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Quitar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE VISTA PREVIA DE REPORTE */}
      {reportModal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '8px', width: '90%', maxWidth: '650px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#1e3a8a', marginTop: 0, borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              {reportModal.title}
            </h3>

            {/* Resumen ejecutivo del reporte */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{reportModal.summary.label1}:</span>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', margin: '2px 0 0 0' }}>{reportModal.summary.val1}</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{reportModal.summary.label2}:</span>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '2px 0 0 0' }}>{reportModal.summary.val2}</p>
              </div>
            </div>

            {/* Tabla de detalle */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                    <th style={{ padding: '8px', color: '#334155' }}>Dato Principal</th>
                    <th style={{ padding: '8px', color: '#334155' }}>Valor / Detalle</th>
                    <th style={{ padding: '8px', color: '#334155' }}>Estado / Extra</th>
                    <th style={{ padding: '8px', color: '#334155' }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {reportModal.data.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px', color: '#1e293b' }}>{row.col1}</td>
                      <td style={{ padding: '8px', color: '#1e293b' }}>{row.col2}</td>
                      <td style={{ padding: '8px', color: '#1e293b' }}>{row.col3}</td>
                      <td style={{ padding: '8px', color: '#64748b' }}>{row.col4}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botones de acción del modal */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setReportModal({ show: false, title: '', data: [], summary: {} })}
                style={{ padding: '8px 15px', backgroundColor: '#64748b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cerrar Vista Previa
              </button>
              <button 
                onClick={handleDownloadFromModal}
                style={{ padding: '8px 15px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📥 Descargar Excel / CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}