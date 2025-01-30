import { Cliente } from '../types/types';
import { useState } from 'react';
import ClienteForm from './ClienteForm';

interface ListaClientesProps {
  clientes: Cliente[];
  refresh: () => void;
}

const ListaClientes = ({ clientes, refresh }: ListaClientesProps) => {
  const [editandoCliente, setEditandoCliente] = useState<Cliente | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const handleDelete = (id: string) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar este cliente?');
    if (confirmar) {
      const nuevosClientes = clientes.filter(cliente => cliente.id !== id);
      localStorage.setItem('clientes', JSON.stringify(nuevosClientes));
      refresh();
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Buscar clientes por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: '100%',
            padding: '0.8rem',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>

      {editandoCliente && <ClienteForm clienteEdit={editandoCliente} onSuccess={() => {
        setEditandoCliente(null);
        refresh();
      }} />}

      <div style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {clientesFiltrados.map(cliente => (
          <div key={cliente.id} style={{
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: '8px',
            position: 'relative'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{cliente.nombre}</h4>
            <p style={{ margin: '0', color: '#666' }}>{cliente.email}</p>
            
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => setEditandoCliente(cliente)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cliente.id)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {clientesFiltrados.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#666',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          No se encontraron clientes
        </div>
      )}
    </div>
  );
};

export default ListaClientes;