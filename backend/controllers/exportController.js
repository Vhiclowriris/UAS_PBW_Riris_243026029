// backend/controllers/exportController.js
const db = require('../config/database');

// Export transaksi ke CSV
exports.exportTransactions = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Query dasar dengan JOIN
    let query = `
      SELECT 
        t.nomor_transaksi,
        o.nama_outlet,
        o.kota,
        u.username as kasir,
        t.tanggal_transaksi,
        t.total_amount,
        t.metode_pembayaran,
        COUNT(dt.id) as jumlah_item
      FROM transaksi t
      JOIN outlets o ON t.outlet_id = o.id
      JOIN users u ON t.user_id = u.id
      LEFT JOIN detail_transaksi dt ON t.id = dt.transaksi_id
      WHERE 1=1
    `;
    
    const params = [];
    
    // Filter tanggal jika ada
    if (start_date && end_date) {
      query += ' AND DATE(t.tanggal_transaksi) BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }
    
    query += ' GROUP BY t.id ORDER BY t.tanggal_transaksi DESC';
    
    // Eksekusi query
    const [rows] = await db.query(query, params);
    
    // Format data ke CSV
    const headers = [
      'No Transaksi',
      'Outlet',
      'Kota',
      'Kasir',
      'Tanggal',
      'Total Amount',
      'Metode Pembayaran',
      'Jumlah Item'
    ];
    
    // Convert ke format CSV
    const csvRows = [headers.join(',')]; // Header
    
    rows.forEach(row => {
      csvRows.push([
        row.nomor_transaksi,
        `"${row.nama_outlet}"`, // Quote untuk string yang ada spasi
        `"${row.kota}"`,
        row.kasir,
        row.tanggal_transaksi,
        row.total_amount,
        row.metode_pembayaran,
        row.jumlah_item
      ].join(','));
    });
    
    const csvContent = csvRows.join('\n');
    
    // Set headers untuk download file
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=laporan-transaksi-${new Date().toISOString().split('T')[0]}.csv`);
    
    // Kirim file
    res.send(csvContent);
    
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal export data: ' + error.message 
    });
  }
};

// Export summary dashboard ke CSV
exports.exportSummary = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Query summary
    const [summary] = await db.query(`
      SELECT 
        COUNT(DISTINCT t.id) as total_transaksi,
        SUM(t.total_amount) as total_revenue,
        AVG(t.total_amount) as average_transaksi,
        COUNT(DISTINCT o.id) as total_outlet
      FROM transaksi t
      LEFT JOIN outlets o ON t.outlet_id = o.id
      WHERE 1=1
      ${start_date && end_date ? 'AND DATE(t.tanggal_transaksi) BETWEEN ? AND ?' : ''}
    `, start_date && end_date ? [start_date, end_date] : []);
    
    const csvContent = [
      'Metric,Value',
      `Total Transaksi,${summary[0].total_transaksi || 0}`,
      `Total Revenue,${summary[0].total_revenue || 0}`,
      `Rata-rata Transaksi,${summary[0].average_transaksi || 0}`,
      `Total Outlet Aktif,${summary[0].total_outlet || 0}`
    ].join('\n');
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=summary-dashboard.csv');
    res.send(csvContent);
    
  } catch (error) {
    console.error('Export summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal export summary' 
    });
  }
};