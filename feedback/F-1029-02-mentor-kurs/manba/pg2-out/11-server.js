// server.js — AvtoIjara backend (Express + PostgreSQL)
const express = require('express');
const { Pool } = require('pg');

// Bazaga ulanish sozlamalari
const USER = 'postgres';
const PASSWORD = 'mentor123'; // o'z parolingizni yozing
const DATABASE = 'car_rental';

const pool = new Pool({ user: USER, password: PASSWORD, database: DATABASE, host: 'localhost', port: 5436 });
const app = express();
app.use(express.json());

// GET — hamma mashinalar
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — yangi mashina
app.post('/api/cars', async (req, res) => {
  try {
    const { model, daily_price, year } = req.body;
    const result = await pool.query('INSERT INTO cars (model, daily_price, year) VALUES ($1, $2, $3) RETURNING *', [model, daily_price, year]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — narxni yangilash
app.put('/api/cars/:id', async (req, res) => {
  try {
    const { daily_price } = req.body;
    const result = await pool.query('UPDATE cars SET daily_price = $1 WHERE id = $2 RETURNING *', [daily_price, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — mashinani o'chirish
app.delete('/api/cars/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM cars WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Mashina topilmadi' });
    res.json({ message: "O'chirildi", deleted: result.rowCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server 3000-portda ishlayapti'));
