import React, { useState } from 'react';
import './AddUserForm.css';

function AddUserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newUser = { name: name, email: email };
    // Org. Jorge Chicana
    fetch('https://jsonplaceholder.typicode.com/users ', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser)
    })
    .then((res) => res.json())
    .then((data) => {
      console.log('Usuario agregado:', data);
      setResponse(data);
    })
    .catch((error) => {
      console.error('Error al agregar usuario:', error);
    });
  };

  return (
    <div className="container">
      <h2>Agregar Usuario</h2>
      <form id="user-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          id="name"
          placeholder="Jorge"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          placeholder="chicanajorge@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="register-btn">
          Registrar
        </button>
      </form>

      {response && (
        <div id="response-container">
          <h3>Respuesta del servidor:</h3>
          <pre id="response-output">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default AddUserForm;