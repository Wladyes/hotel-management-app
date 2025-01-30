import { useState, useEffect } from 'react';
import { Cliente } from '../types/types';

interface ClienteFormProps {
  onSuccess: () => void;
  clienteEdit?: Cliente;
}

const ClienteForm = ({ onSuccess, clienteEdit }: ClienteFormProps) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (clienteEdit) {
      setNombre(clienteEdit.nombre);
      setEmail(clienteEdit.email);
    }
  }, [clienteEdit]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Ingrese un email válido');
      return;
    }

    const cliente: Cliente = {
      id: clienteEdit?.id || crypto.randomUUID(),
      nombre: nombre.trim(),
      email: email.trim()
    };

    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    if (clienteEdit) {
      const index = clientes.findIndex((c: Cliente) => c.id === cliente.id);
      clientes[index] = cliente;
    } else {
      clientes.push(cliente);
    }
    
    localStorage.setItem('clientes', JSON.stringify(clientes));
    setError('');
    onSuccess();
    setNombre('');
    setEmail('');
  };

  return (
    <div className="form-container" style={{ 
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0 }}>{clienteEdit ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <input
            type="text"
            placeholder="Nombre completo del cliente"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: `1px solid ${error && !nombre.trim() ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: `1px solid ${error && !validateEmail(email) ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          />
        </div>

        {error && <div style={{ color: 'red', fontSize: '0.9rem' }}>{error}</div>}

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.8rem 1.5rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            alignSelf: 'flex-start'
          }}
        >
          {clienteEdit ? 'Actualizar Cliente' : 'Agregar Cliente'}
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;