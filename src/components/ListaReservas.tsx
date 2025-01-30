import { Reserva, Cliente, Habitacion } from '../types/types';
import { useState } from 'react';
import ReservaForm from './ReservaForm';

interface ListaReservasProps {
  reservas: Reserva[];
  clientes: Cliente[];
  habitaciones: Habitacion[];
  refresh: () => void;
}

const ListaReservas = ({ reservas, clientes, habitaciones, refresh }: ListaReservasProps) => {
  const [editandoReserva, setEditandoReserva] = useState<Reserva | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const handleDelete = (id: string) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta reserva?');
    if (confirmar) {
      const nuevasReservas = reservas.filter(reserva => reserva.id !== id);
      localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
      refresh();
    }
  };

  const reservasFiltradas = reservas.filter(reserva => {
    const cliente = clientes.find(c => c.id === reserva.clienteId);
    return (
      cliente?.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente?.email.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  const getHabitacionesReserva = (habitacionIds: string[]) => {
    return habitaciones.filter(h => habitacionIds.includes(h.id));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Buscar reservas por cliente..."
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

      {editandoReserva && <ReservaForm reservaEdit={editandoReserva} onSuccess={() => {
        setEditandoReserva(null);
        refresh();
      }} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reservasFiltradas.map(reserva => {
          const cliente = clientes.find(c => c.id === reserva.clienteId);
          const habitacionesReserva = getHabitacionesReserva(reserva.habitacionIds);
          const total = habitacionesReserva.reduce((sum, h) => sum + h.precio, 0);
          const noches = Math.ceil(
            (new Date(reserva.fechaFin).getTime() - new Date(reserva.fechaInicio).getTime()) / 
            (1000 * 3600 * 24)
          );

          return (
            <div 
              key={reserva.id}
              style={{
                padding: '1.5rem',
                border: '1px solid #eee',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>
                    {cliente?.nombre || 'Cliente no encontrado'}
                  </h4>
                  <p style={{ margin: '0', color: '#666' }}>
                    {new Date(reserva.fechaInicio).toLocaleDateString()} -{' '}
                    {new Date(reserva.fechaFin).toLocaleDateString()} 
                    <span style={{ marginLeft: '1rem' }}>
                      ({noches} noche{noches > 1 ? 's' : ''})
                    </span>
                  </p>
                  <div style={{ marginTop: '0.5rem' }}>
                    {habitacionesReserva.map(h => (
                      <span 
                        key={h.id}
                        style={{
                          display: 'inline-block',
                          marginRight: '0.5rem',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#e3f2fd',
                          borderRadius: '4px'
                        }}
                      >
                        {h.tipo}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    Total: {total.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => setEditandoReserva(reserva)}
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
                      onClick={() => handleDelete(reserva.id)}
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
              </div>
            </div>
          );
        })}
      </div>

      {reservasFiltradas.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#666',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          No se encontraron reservas
        </div>
      )}
    </div>
  );
};

export default ListaReservas;