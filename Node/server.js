//const app = express();
const PORT = 3000;

import express from 'express'; // o const express = require('express');
import cors from 'cors';
import db from './servicios/conectaDB.js';

const app = express();
app.use(cors());
app.use(express.json()); // Add this line to parse JSON bodies

// Org. Jorge Chicana

// POST - Agregar nuevo contacto
app.post('/contacto', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const result = await db.execute(
      'INSERT INTO contacto (name, email) VALUES (?, ?)', [name, email]
    );
    console.log('Insert result:', result);
    const insertId = result[0].insertId;
    res.status(201).json({
      id: insertId,
      name,
      email,
      creadoEn: new Date()
    });
  } catch (err) {
    console.error('Error al insertar:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/contacto', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM contacto');
    // Org. Jorge Chicana
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend con MySQL corriendo en http://localhost:${PORT}`);
});
