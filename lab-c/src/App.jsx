import React, { useState, useEffect } from 'react';
import AddContactForm from './componentes/AddContactForm';
// Assuming AddUserForm is no longer needed, so removed its import.
// If AddUserForm styles were globally affecting, they are in AddUserForm.css, not App.css directly.
// App.css is still imported if it contains general app layout styles.
import './App.css'; 

function App() {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/contacto')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setContactos(data))
      .catch(err => {
        console.error("Failed to fetch contacts:", err);
        // Optionally, set an error state here to display in UI
      });
  }, []);

  const handleAddContact = (newContact) => {
    // Assuming the backend assigns an ID and returns the full contact object
    // If the newContact from the form submission already includes an ID (e.g., from server response)
    // then this is correct. Otherwise, if the server only returns a success message,
    // you might need to re-fetch contacts or optimistically add, then confirm.
    setContactos(prev => [...prev, newContact]);
  };

  return (
    <div>
      <h1>Contactos</h1>
      {/* Pass the handleAddContact function as the onAdd prop */}
      <AddContactForm onAdd={handleAddContact} /> 
      <ul>
        {contactos.map(c => (
          // Ensure 'c.id' is unique and present, otherwise use a different key or ensure IDs are handled.
          <li key={c.id || c.email}>{c.name} - {c.email}</li> 
        ))}
      </ul>
    </div>
  );
}

export default App;
