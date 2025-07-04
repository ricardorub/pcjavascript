const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       
  database: 'ricardogutierrez' 
});

conexion.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
