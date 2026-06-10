// backend/controllers/dashboardController.js
const db = require('../config/database');

exports.getStats = async (req, res) => {
  try {
    // 1. Total Revenue (Pendapatan)
    const [revenueResult] = await db.query('SELECT SUM(total_amount) as total FROM transaksi');
    const totalRevenue = revenueResult[0].total || 0;

    // 2. Total Transaksi
    const [transactionResult] = await db.query('SELECT COUNT(*) as count FROM transaksi');
    const totalTransactions = transactionResult[0].count || 0;

    // 3. Produk Terlaris (Top 5)
    const [topProducts] = await db.query(`
      SELECT p.nama_produk, SUM(dt.quantity) as total_sold 
      FROM detail_transaksi dt
      JOIN produk p ON dt.produk_id = p.id
      GROUP BY p.nama_produk
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // 4. Penjualan per Kota (Revenue)
    const [revenuePerCity] = await db.query(`
      SELECT o.kota, SUM(t.total_amount) as revenue
      FROM transaksi t
      JOIN outlets o ON t.outlet_id = o.id
      GROUP BY o.kota
    `);

    // 5. Penjualan per Bulan (Tren 6 bulan terakhir)
    // Ini query agak kompleks, kita simplifikasi ambil semua aja dulu nanti di-group di JS
    const [salesByMonth] = await db.query(`
      SELECT DATE_FORMAT(tanggal_transaksi, '%Y-%m') as month, SUM(total_amount) as revenue
      FROM transaksi
      GROUP BY month
      ORDER BY month ASC
    `);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalTransactions
        },
        topProducts,
        revenuePerCity,
        salesByMonth
      }
    });

  } catch (error) {
    console.error('Error get stats:', error);
    res.status(500).json({ success: false, message: 'Gagal ambil data dashboard' });
  }
};