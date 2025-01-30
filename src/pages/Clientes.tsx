import { useState, useEffect } from 'react';
import ListaClientes from '../components/ListaClientes';
import ClienteForm from '../components/ClienteForm';
import { Cliente } from '../types/types';

const Clientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const loadClientes = () => {
    const storedClientes = localStorage.getItem('clientes');
    if (storedClientes) {
      setClientes(JSON.parse(storedClientes));
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: '2rem',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem'
      }}>
        Gestión de Clientes
      </h1>
      
      <ClienteForm onSuccess={loadClientes} />
      <ListaClientes clientes={clientes} refresh={loadClientes} />
    </div>
  );
};

export default Clientes;