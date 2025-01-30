import { useState, useEffect } from 'react';
import { Habitacion } from '../types/types';

interface HabitacionFormProps {
  onSuccess: () => void;
  habitacionEdit?: Habitacion;
}

const HabitacionForm = ({ onSuccess, habitacionEdit }: HabitacionFormProps) => {
  const [tipo, setTipo] = useState('');
  const [precio, setPrecio] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitacionEdit) {
      setTipo(habitacionEdit.tipo);
      setPrecio(habitacionEdit.precio.toString());
    }
  }, [habitacionEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipo) {
      setError('Seleccione un tipo de habitación');
      return;
    }
    
    if (!precio || Number(precio) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    const habitacion: Habitacion = {
      id: habitacionEdit?.id || crypto.randomUUID(),
      tipo,
      precio: Number(precio)
    };

    const habitaciones = JSON.parse(localStorage.getItem('habitaciones') || '[]');
    if (habitacionEdit) {
      const index = habitaciones.findIndex((h: Habitacion) => h.id === habitacion.id);
      habitaciones[index] = habitacion;
    } else {
      habitaciones.push(habitacion);
    }
    
    localStorage.setItem('habitaciones', JSON.stringify(habitaciones));
    setError('');
    onSuccess();
    setTipo('');
    setPrecio('');
  };

  return (
    <div className="form-container" style={{ 
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ marginTop: 0 }}>{habitacionEdit ? 'Editar Habitación' : 'Nueva Habitación'}</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: `1px solid ${error && !tipo ? 'red' : '#ddd'}`,
              borderRadius: '4px',
              appearance: 'none',
              background: 'white url("data:image/svg+xml;charset=US-ASCII,<svg%20width%3D\"20\"%20height%3D\"20\"%20viewBox%3D\"0%200%2020%2020\"%20fill%3D\"none\"%20xmlns%3D\"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg\"><path%20d%3D\"M5%207.5L10%2012.5L15%207.5\"%20stroke%3D\"%23666\"%20stroke-width%3D\"1.5\"%20stroke-linecap%3D\"round\"%20stroke-linejoin%3D\"round\"%2F><%2Fsvg>") no-repeat right 0.8rem center/12px 12px'
            }}
          >
            <option value="">Seleccione tipo de habitación...</option>
            <option value="Individual">Individual</option>
            <option value="Doble">Doble</option>
            <option value="Suite">Suite</option>
            <option value="Familiar">Familiar</option>
          </select>
        </div>

        <div>
          <input
            type="number"
            placeholder="Precio por noche"
            min="0"
            step="50"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: `1px solid ${error && !precio ? 'red' : '#ddd'}`,
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
          {habitacionEdit ? 'Actualizar Habitación' : 'Agregar Habitación'}
        </button>
      </form>
    </div>
  );
};

export default HabitacionForm;