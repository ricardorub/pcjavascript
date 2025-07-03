import React from 'react';
import './componentes/menuForm.css'; // Import CSS for the menu
import './App.css'; // General app styles

function App() {
  return (
    <>
      <nav className="navbar">
        <ul className="nav-links">
          <li><a href="#" className="active">Inicio</a></li>
          <li><a href="#">Nosotros</a></li>
          <li><a href="#">Contáctanos</a></li>
        </ul>
      </nav>

      <div className="content">
        <p>Org. Jorge Chicana</p>
        <p>Inicio</p>
      </div>
    </>
  );
}

export default App;
