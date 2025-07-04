// src/App.jsx
import React from 'react';
import CollaboratorsDropdown from './componentes/CollaboratorsDropdown'; // Corrected path
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Gestión de Colaboradores</h1>
      <CollaboratorsDropdown />
    </div>
  );
}

export default App;