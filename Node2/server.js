const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3001; // Changed to 3001 to avoid conflicts with React's default 3000

// Use CORS middleware
app.use(cors());

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

// Simple root route
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// API endpoint to get collaborators
app.get('/api/collaborators', (req, res) => {
    const query = 'SELECT id, name FROM collaborators'; // Assuming you have a 'collaborators' table with 'id' and 'name' columns
    conexion.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener colaboradores:', err);
            res.status(500).json({ error: 'Error al obtener colaboradores' });
            return;
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});