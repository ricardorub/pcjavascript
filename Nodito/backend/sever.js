import express from 'express'; // o const express = require('express');
import cors from 'cors';
import db from './servicios/conectaDB.js';

const app = express();
const PORT = 3001;

app.use(cors());

// Org. Jorge Chicana

// POST - Agregar nuevo contacto
app.post("/contacto", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO contacto (name, email) VALUES (?, ?)', [name, email]
    );

    res.status(201).json({
      id: result.insertId,
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
    res.json(rows);
  } catch (err) {
    console.error('Error al consultar:', err);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend con MySQL2 corriendo en http://localhost:${PORT}`);
});
