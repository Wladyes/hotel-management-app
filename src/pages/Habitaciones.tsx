import { useState, useEffect } from 'react';
import ListaHabitaciones from '../components/ListaHabitaciones';
import HabitacionForm from '../components/HabitacionForm';
import { Habitacion } from '../types/types';

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);

  const loadHabitaciones = () => {
    const storedHabitaciones = localStorage.getItem('habitaciones');
    if (storedHabitaciones) {
      setHabitaciones(JSON.parse(storedHabitaciones));
    }
  };

  useEffect(() => {
    loadHabitaciones();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: '2rem',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem'
      }}>
        Gestión de Habitaciones
      </h1>
      
      <HabitacionForm onSuccess={loadHabitaciones} />
      <ListaHabitaciones habitaciones={habitaciones} refresh={loadHabitaciones} />
    </div>
  );
};

export default Habitaciones;