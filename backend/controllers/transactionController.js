// backend/controllers/transactionController.js
const db = require('../config/database');
const Joi = require('joi');

// Schema validasi transaksi
const transactionSchema = Joi.object({
  nomor_transaksi: Joi.string().required(),
  outlet_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  tanggal_transaksi: Joi.date().required(),
  total_amount: Joi.number().positive().required(),
  metode_pembayaran: Joi.string().valid('tunai', 'debit', 'e-wallet').required(),
  items: Joi.array().items(
    Joi.object({
      produk_id: Joi.number().integer().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      harga_satuan: Joi.number().positive().required(),
      subtotal: Joi.number().positive().required()
    })
  ).required()
});

// Get semua transaksi
exports.getAllTransactions = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        t.*,
        o.nama_outlet,
        o.kota,
        u.username as kasir
      FROM transaksi t
      JOIN outlets o ON t.outlet_id = o.id
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (start_date && end_date) {
      query += ' AND DATE(t.tanggal_transaksi) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }
    
    query += ' ORDER BY t.tanggal_transaksi DESC';
    
    const [rows] = await db.query(query, params);
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error get transactions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal ambil data transaksi' 
    });
  }
};

// Create transaksi baru
exports.createTransaction = async (req, res) => {
  try {
    const { error, value } = transactionSchema.validate(req.body, { 
      abortEarly: false 
    });

    if (error) {
      const errors = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ 
        success: false, 
        message: errors 
      });
    }

    const { 
      nomor_transaksi, 
      outlet_id, 
      user_id, 
      tanggal_transaksi, 
      total_amount, 
      metode_pembayaran,
      items 
    } = value;

    // Start transaction
    await db.query('START TRANSACTION');

    // Insert ke tabel transaksi
    const [result] = await db.query(
      `INSERT INTO transaksi 
       (nomor_transaksi, outlet_id, user_id, tanggal_transaksi, total_amount, metode_pembayaran)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nomor_transaksi, outlet_id, user_id, tanggal_transaksi, total_amount, metode_pembayaran]
    );

    const transaksiId = result.insertId;

    // Insert ke tabel detail_transaksi
    if (items && items.length > 0) {
      const detailValues = items.map(item => [
        transaksiId,
        item.produk_id,
        item.quantity,
        item.harga_satuan,
        item.subtotal
      ]);

      await db.query(
        `INSERT INTO detail_transaksi 
         (transaksi_id, produk_id, quantity, harga_satuan, subtotal)
         VALUES ?`,
        [detailValues]
      );
    }

    // Commit transaction
    await db.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil ditambahkan!',
      data: { id: transaksiId }
    });

  } catch (error) {
    // Rollback jika error
    await db.query('ROLLBACK');
    
    console.error('Error create transaction:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal menambahkan transaksi: ' + error.message 
    });
  }
};

// Get semua produk
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, kode_produk, nama_produk, kategori, harga_jual, stok FROM produk'
    );
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error get products:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal ambil data produk' 
    });
  }
};

// Get semua outlets
exports.getOutlets = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, nama_outlet, kota FROM outlets'
    );
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error get outlets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal ambil data outlet' 
    });
  }
};

// Get kasir (users dengan role kasir)
exports.getCashiers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username FROM users WHERE role = 'kasir'"
    );
    
    res.json({
      success: true,
      data: rows
    });
    
  } catch (error) {
    console.error('Error get cashiers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal ambil data kasir' 
    });
  }
};