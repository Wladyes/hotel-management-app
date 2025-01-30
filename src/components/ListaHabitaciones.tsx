import { Habitacion } from '../types/types';
import { useState } from 'react'
import HabitacionForm from './HabitacionForm';

interface ListaHabitacionesProps {
  habitaciones: Habitacion[];
  refresh: () => void;
}

const ListaHabitaciones = ({ habitaciones, refresh }: ListaHabitacionesProps) => {
  const [editandoHabitacion, setEditandoHabitacion] = useState<Habitacion | null>(null);
  const [busqueda, setBusqueda] = useState('');

  const handleDelete = (id: string) => {
    const confirmar = window.confirm('¿Estás seguro de eliminar esta habitación?');
    if (confirmar) {
      const nuevasHabitaciones = habitaciones.filter(habitacion => habitacion.id !== id);
      localStorage.setItem('habitaciones', JSON.stringify(nuevasHabitaciones));
      refresh();
    }
  };

  const habitacionesFiltradas = habitaciones.filter(habitacion =>
    habitacion.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
    habitacion.precio.toString().includes(busqueda)
  );

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Buscar habitaciones por tipo o precio..."
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

      {editandoHabitacion && <HabitacionForm habitacionEdit={editandoHabitacion} onSuccess={() => {
        setEditandoHabitacion(null);
        refresh();
      }} />}

      <div style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        {habitacionesFiltradas.map(habitacion => (
          <div key={habitacion.id} style={{
            padding: '1rem',
            border: '1px solid #eee',
            borderRadius: '8px',
            position: 'relative'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{habitacion.tipo}</h4>
            <p style={{ margin: '0', color: '#666' }}>
              Precio: {habitacion.precio.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR'
              })}/noche
            </p>
            
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => setEditandoHabitacion(habitacion)}
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
                onClick={() => handleDelete(habitacion.id)}
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

      {habitacionesFiltradas.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#666',
          border: '2px dashed #ddd',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          No se encontraron habitaciones
        </div>
      )}
    </div>
  );
};

export default ListaHabitaciones;