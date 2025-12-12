const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // vacío por defecto en XAMPP
  database: 'clientes_db'
});

app.get('/clientes', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM clientes');
  res.json(rows);
});

app.post('/clientes', async (req, res) => {
  const { id, nombre, direccion, celular, tipo_cliente } = req.body;
  await pool.query('INSERT INTO clientes VALUES (?,?,?,?,?)', [id, nombre, direccion, celular, tipo_cliente]);
  res.status(201).json({ mensaje: 'Cliente agregado' });
});

app.put('/clientes/:id', async (req, res) => {
  const { nombre, direccion, celular, tipo_cliente } = req.body;
  await pool.query('UPDATE clientes SET nombre=?, direccion=?, celular=?, tipo_cliente=? WHERE id=?',
    [nombre, direccion, celular, tipo_cliente, req.params.id]);
  res.json({ mensaje: 'Cliente actualizado' });
});

app.delete('/clientes/:id', async (req, res) => {
  await pool.query('DELETE FROM clientes WHERE id=?', [req.params.id]);
  res.json({ mensaje: 'Cliente eliminado' });
});

app.listen(3000, () => console.log('API conectada a MySQL en http://localhost:3000'));
g