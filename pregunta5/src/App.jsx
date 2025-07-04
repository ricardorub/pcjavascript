import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AddContactForm from './componentes/AddContactForm'

function App() {
  const [contactos, setContactos] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3000/contacto')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => setContactos(data))
      .catch(err => {
        console.error('Error fetching data:', err);
        setContactos([]);
      });
  }, []);

  // Org. Jorge Chicana

  const handleAddContact = (newContact) => {
    setContactos(prev => [...prev, newContact]);
  };

  return (
    <div>
      <h1>Contactos</h1>
      <AddContactForm onAdd={handleAddContact} />
      <ul>
        {contactos.map(c => (
          <li key={c.id}>{c.name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
