// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve file static dari folder frontend
// Agar browser bisa akses file HTML, CSS, JS langsung
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Routes untuk Halaman (Frontend)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dashboard.html'));
});

app.get('/input-transaksi', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'input-transaksi.html'));
});

// API Routes (Backend)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/transactions', require('./routes/transactions'));

// Handle 404 untuk API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint tidak ditemukan' });
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(` Server berjalan di http://localhost:${PORT}`);
  console.log(` Login Page: http://localhost:${PORT}/login`);
  console.log(` Dashboard: http://localhost:${PORT}/dashboard`);
  console.log(` API Base: http://localhost:${PORT}/api`);
});