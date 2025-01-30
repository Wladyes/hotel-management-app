import { useState, useEffect } from 'react';
import ReservaForm from '../components/ReservaForm';
import ListaReservas from '../components/ListaReservas';
import { Cliente, Habitacion, Reserva } from '../types/types';

const Reservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);

  const loadReservas = () => {
    const storedReservas = localStorage.getItem('reservas');
    if (storedReservas) setReservas(JSON.parse(storedReservas));
  };

  const loadClientesYHabitaciones = () => {
    const storedClientes = localStorage.getItem('clientes');
    const storedHabitaciones = localStorage.getItem('habitaciones');
    if (storedClientes) setClientes(JSON.parse(storedClientes));
    if (storedHabitaciones) setHabitaciones(JSON.parse(storedHabitaciones));
  };

  useEffect(() => {
    loadReservas();
    loadClientesYHabitaciones();
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ 
        marginBottom: '2rem',
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
        paddingBottom: '0.5rem'
      }}>
        Gestión de Reservas
      </h1>
      
      <ReservaForm onSuccess={() => {
        loadReservas();
        loadClientesYHabitaciones();
      }} />
      
      <ListaReservas 
        reservas={reservas}
        clientes={clientes}
        habitaciones={habitaciones}
        refresh={loadReservas}
      />
    </div>
  );
};

export default Reservas;