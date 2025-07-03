import React, { useState } from 'react';

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
  <div>
    <h2>Agregar Usuario</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <button type="submit">Registrar</button>
    </form>

    {response && (
      <div>
        <h4>Respuesta del servidor:</h4>
        <pre>{JSON.stringify(response, null, 2)}</pre>
        <pre>{JSON.stringify(response)}</pre>
      </div>
    )}
  </div>
);
  
}

export default AddUserForm;