// backend/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../config/database');

// ============================================
// JOI VALIDATION SCHEMAS
// ============================================

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Username wajib diisi',
    'string.min': 'Username minimal 3 karakter',
    'any.required': 'Username wajib diisi'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password wajib diisi',
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi'
  })
});

// ============================================
// CONTROLLER FUNCTIONS
// ============================================

// Login endpoint
exports.login = async (req, res) => {
  try {
    // ==========================================
    // 🐛 DEBUG START: Cek apa yang masuk dari frontend
    // ==========================================
    console.log('\n🔍 ========== DEBUG LOGIN ==========');
    console.log('1. Request Body:', JSON.stringify(req.body, null, 2));

    // 1. Validasi input dengan Joi
    const { error, value } = loginSchema.validate(req.body, { 
      abortEarly: false, 
      allowUnknown: false 
    });

    if (error) {
      const errors = error.details.map(detail => detail.message).join(', ');
      console.log('❌ Validasi Gagal:', errors);
      return res.status(400).json({ 
        success: false, 
        message: errors 
      });
    }

    const { username, password } = value;
    console.log('✅ Validasi lolos');
    console.log('2. Username input:', username);
    console.log('3. Password input:', password);

    // 2. Cari user di database
    console.log('4. Mencari user di DB...');
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?', 
      [username.toLowerCase()]
    );

    console.log('5. User ditemukan:', users.length > 0 ? 'YA' : 'TIDAK');
    
    if (users.length === 0) {
      console.log('❌ User tidak ditemukan di database!');
      await new Promise(resolve => setTimeout(resolve, 300));
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah!' 
      });
    }

    const user = users[0];
    console.log('6. User DB:', user.username);
    console.log('7. Hash di DB:', user.password);

    // 3. Verifikasi password dengan bcrypt
    console.log('8. Membandingkan password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('9. Hasil bcrypt.compare:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Password tidak cocok!');
      await new Promise(resolve => setTimeout(resolve, 300));
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah!' 
      });
    }
    console.log('✅ Password cocok!');

    // 4. Generate JWT Token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { 
        expiresIn: '24h',
        issuer: 'umkm-dashboard'
      }
    );

    // 5. Kirim response
    console.log('🚀 Login Berhasil!');
    console.log('=====================================\n');

    res.json({
      success: true,
      message: 'Login berhasil!',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('💥 Error Login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server!' 
    });
  }
};

// Get profile user
exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan!' 
      });
    }

    res.json({
      success: true,
      data: users[0]
    });

  } catch (error) {
    console.error('Error get profile:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server!' 
    });
  }
};

// Register user (Optional)
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Validasi sederhana
    if (!username || !password || !role) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username.toLowerCase(), hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan!',
      data: { id: result.insertId, username, role }
    });

  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({ success: false, message: 'Error server' });
  }
};