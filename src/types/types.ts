export interface Cliente {
    id: string;
    nombre: string;
    email: string;
  }
  
  export interface Habitacion {
    id: string;
    tipo: string;
    precio: number;
  }
  
  export interface Reserva {
    id: string;
    clienteId: string;
    habitacionIds: string[];
    fechaInicio: string;
    fechaFin: string;
  }