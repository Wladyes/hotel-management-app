import { Routes, Route, Link } from 'react-router-dom';
import Clientes from './pages/Clientes';
import Habitaciones from './pages/Habitaciones';
import Reservas from './pages/Reservas';

function App() {
  return (
    <>
      <nav style={{ padding: '1rem', background: '#eee' }}>
        <Link to="/clientes" style={{ marginRight: '1rem' }}>Clientes</Link>
        <Link to="/habitaciones" style={{ marginRight: '1rem' }}>Habitaciones</Link>
        <Link to="/reservas">Reservas</Link>
      </nav>
      
      <Routes>
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/habitaciones" element={<Habitaciones />} />
        <Route path="/reservas" element={<Reservas />} />
        <Route path="/" element={<Clientes />} />
      </Routes>
    </>
  );
}

export default App;
