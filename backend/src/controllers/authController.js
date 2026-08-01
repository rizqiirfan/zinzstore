const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { signToken } = require('../utils/jwt');

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Username, email, dan password wajib diisi.' });
    }
    if (password.length < 4) {
      return res.status(400).json({ success: false, message: 'Password minimal 4 karakter.' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Username atau email sudah terdaftar.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, displayName || username]
    );

    const user = { id: result.insertId, username, displayName: displayName || username, role: 'user' };
    const token = signToken({ id: user.id, username: user.username, role: user.role });

    res.status(201).json({ success: true, message: 'Registrasi berhasil!', data: { user, token } });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username dan password harus diisi!' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );
    const account = rows[0];

    if (!account) {
      return res.status(401).json({ success: false, message: 'Username atau password salah!' });
    }

    const isMatch = await bcrypt.compare(password, account.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Username atau password salah!' });
    }

    const user = {
      id: account.id,
      username: account.username,
      displayName: account.display_name,
      role: account.role,
    };
    const token = signToken({ id: user.id, username: user.username, role: user.role });

    res.json({ success: true, message: `Selamat datang, ${user.displayName}!`, data: { user, token } });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (butuh token)
async function me(req, res, next) {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, display_name, role FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows[0]) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }
    const u = rows[0];
    res.json({
      success: true,
      data: { id: u.id, username: u.username, email: u.email, displayName: u.display_name, role: u.role },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
