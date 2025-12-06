import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Filmes } from './pages/Filmes';
import { Salas } from './pages/Salas';
import { Sessoes } from './pages/Sessoes';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="py-3">
        <Routes>
          <Route path="/" element={<div className="container"><h1>Bem-vindo ao Cineflex</h1></div>} />
          <Route path="/filmes" element={<Filmes />} />
          <Route path="/salas" element={<Salas />} />
          <Route path="/sessoes" element={<Sessoes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;