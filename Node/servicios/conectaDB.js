import mysql from 'mysql2';

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',       
  database: 'ricardogutierrez' 
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
  connection.release();
});

export default db;
