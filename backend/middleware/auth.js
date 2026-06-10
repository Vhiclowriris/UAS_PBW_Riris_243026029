// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware untuk verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Akses ditolak! Token tidak ditemukan.' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Token tidak valid atau sudah kadaluarsa!' 
      });
    }
    req.user = user;
    next();
  });
};

// Middleware untuk check role (RBAC)
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Akses ditolak! Role ${req.user.role} tidak memiliki izin.` 
      });
    }
    next();
  };
};

module.exports = { authenticateToken, checkRole };