import { useState, useEffect } from 'react';
import { Cliente, Habitacion, Reserva } from '../types/types';
import { parseISO } from 'date-fns/parseISO'; 
import { isWithinInterval } from 'date-fns/isWithinInterval';

interface ReservaFormProps {
  onSuccess: () => void;
  reservaEdit?: Reserva;
}

const ReservaForm = ({ onSuccess, reservaEdit }: ReservaFormProps) => {
  const [clienteId, setClienteId] = useState('');
  const [habitacionesSeleccionadas, setHabitacionesSeleccionadas] = useState<string[]>([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');

  // Cargar datos existentes
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const cargarDatos = () => {
      setClientes(JSON.parse(localStorage.getItem('clientes') || '[]'));
      setHabitaciones(JSON.parse(localStorage.getItem('habitaciones') || '[]'));
      setReservas(JSON.parse(localStorage.getItem('reservas') || '[]'));
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (reservaEdit) {
      setClienteId(reservaEdit.clienteId);
      setHabitacionesSeleccionadas(reservaEdit.habitacionIds);
      setFechaInicio(reservaEdit.fechaInicio);
      setFechaFin(reservaEdit.fechaFin);
    }
  }, [reservaEdit]);

  const habitacionesDisponibles = () => {
    if (!fechaInicio || !fechaFin) return habitaciones;
    
    const fechaInicioObj = parseISO(fechaInicio);
    const fechaFinObj = parseISO(fechaFin);
    
    return habitaciones.filter(habitacion => {
      const reservasHabitacion = reservas.filter(reserva => 
        reserva.habitacionIds.includes(habitacion.id)
      );
      
      return !reservasHabitacion.some(reserva => {
        const reservaInicio = parseISO(reserva.fechaInicio);
        const reservaFin = parseISO(reserva.fechaFin);
        return (
          isWithinInterval(fechaInicioObj, { start: reservaInicio, end: reservaFin }) ||
          isWithinInterval(fechaFinObj, { start: reservaInicio, end: reservaFin }) ||
          (fechaInicioObj < reservaInicio && fechaFinObj > reservaFin)
        );
      });
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clienteId) {
      setError('Seleccione un cliente');
      return;
    }
    
    if (habitacionesSeleccionadas.length === 0) {
      setError('Seleccione al menos una habitación');
      return;
    }
    
    if (!fechaInicio || !fechaFin || fechaInicio >= fechaFin) {
      setError('Fechas inválidas');
      return;
    }

    const nuevaReserva: Reserva = {
      id: reservaEdit?.id || crypto.randomUUID(),
      clienteId,
      habitacionIds: habitacionesSeleccionadas,
      fechaInicio,
      fechaFin
    };

    const nuevasReservas = reservaEdit 
      ? reservas.map(r => r.id === nuevaReserva.id ? nuevaReserva : r)
      : [...reservas, nuevaReserva];

    localStorage.setItem('reservas', JSON.stringify(nuevasReservas));
    setError('');
    onSuccess();
    resetForm();
  };

  const resetForm = () => {
    setClienteId('');
    setHabitacionesSeleccionadas([]);
    setFechaInicio('');
    setFechaFin('');
  };

  return (
    <div style={{ 
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0 }}>{reservaEdit ? 'Editar Reserva' : 'Nueva Reserva'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Cliente:</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: `1px solid ${error && !clienteId ? 'red' : '#ddd'}`,
              borderRadius: '4px'
            }}
          >
            <option value="">Seleccione un cliente...</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} ({cliente.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Fechas:</label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                padding: '0.8rem',
                border: `1px solid ${error && !fechaInicio ? 'red' : '#ddd'}`,
                borderRadius: '4px',
                flex: 1
              }}
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                padding: '0.8rem',
                border: `1px solid ${error && !fechaFin ? 'red' : '#ddd'}`,
                borderRadius: '4px',
                flex: 1
              }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Habitaciones Disponibles ({fechaInicio && fechaFin ? habitacionesDisponibles().length : 'Seleccione fechas'}):
          </label>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {habitacionesDisponibles().map(habitacion => (
              <label 
                key={habitacion.id}
                style={{
                  padding: '1rem',
                  border: `2px solid ${habitacionesSeleccionadas.includes(habitacion.id) ? '#007bff' : '#ddd'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: habitacionesSeleccionadas.includes(habitacion.id) ? '#e3f2fd' : 'white'
                }}
              >
                <input
                  type="checkbox"
                  checked={habitacionesSeleccionadas.includes(habitacion.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setHabitacionesSeleccionadas([...habitacionesSeleccionadas, habitacion.id]);
                    } else {
                      setHabitacionesSeleccionadas(
                        habitacionesSeleccionadas.filter(id => id !== habitacion.id)
                      );
                    }
                  }}
                  style={{ marginRight: '0.5rem' }}
                />
                {habitacion.tipo} -{' '}
                {habitacion.precio.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                })}
              </label>
            ))}
          </div>
        </div>

        {error && <div style={{ color: 'red', padding: '0.5rem', textAlign: 'center' }}>{error}</div>}

        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '1rem 2rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginTop: '1rem'
          }}
        >
          {reservaEdit ? 'Actualizar Reserva' : 'Crear Reserva'}
        </button>
      </form>
    </div>
  );
};

export default ReservaForm;