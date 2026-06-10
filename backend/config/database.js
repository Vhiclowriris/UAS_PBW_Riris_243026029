// backend/config/database.js
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testing koneksi saat aplikasi dimulai
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Gagal koneksi ke database:', err.message);
  } else {
    console.log('Berhasil terhubung ke database MySQL!');
    connection.release();
  }
});

module.exports = pool.promise();