import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [contactos, setContactos] = useState([]);
  useEffect(() => {
    fetch('http://localhost:3001/contacto')
      .then(res => res.json())
      .then(data => setContactos(data))
      .catch(err => console.error(err));
  }, []);

  // Org. Jorge Chicana

  const handleAddContact = (newContact) => {
    setContactos(prev => [...prev, newContact]);
  };

  return (
    <div>
      <h1>Contactos</h1>
      <AddContactForm />
      <ul>
        {contactos.map(c => (
          <li key={c.id}>{c.name} - {c.email}</li>
        ))}
      </ul>
    </div>
  );
}