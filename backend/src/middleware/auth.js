const { verifyToken } = require('../utils/jwt');

// Middleware untuk memproteksi route yang butuh login.
// Membaca token dari header: Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token tidak ditemukan, silakan login.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, username, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau kedaluwarsa.' });
  }
}

// Middleware tambahan untuk membatasi akses khusus admin.
// Selalu dipasang SETELAH requireAuth (butuh req.user sudah terisi).
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Halaman ini khusus admin.' });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
