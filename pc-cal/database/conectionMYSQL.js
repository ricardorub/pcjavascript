import { createPool } from "mysql2/promise";

const pool = createPool({
  host: 'localhost',
  port: 3306,
  database: '',
  user: 'root',
  password: ''
});