import React, { useState } from 'react';

function AddContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Org. Jorge Chicana

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { name, email };
  };
}

fetch('http://localhost:3001/contacto', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newUser),
})
.then(res => {
  if (!res.ok) throw new Error('Error en la respuesta del servidor');
  return res.json();
})
.then(data => {
  setResponse(data);
  setError(null);
  setName('');
  setEmail('');
  if (onAdd) onAdd(data);
})
.catch(err => {
  console.error('Error al agregar usuario:', err);
  setError("Error al agregar usuario");
  setResponse(null);
});

return (
  <div>
    <h2>Agregar Usuario (Org. Jorge Chicana)</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />
      <button type="submit">Registrar</button>
    </form>
    {response && (
      <div>
        <h4>Respuesta del servidor:</h4>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </div>
    )}
    {error && <p style={{ color: 'red' }}>{error}</p>}
  </div>
);

