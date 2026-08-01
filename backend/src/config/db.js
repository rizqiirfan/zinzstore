const mysql = require('mysql2/promise');
require('dotenv').config();

// Connection pool ke database MySQL.
// Menggunakan pool (bukan single connection) agar bisa handle
// banyak request secara bersamaan dengan efisien.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zinzstore',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

// Helper untuk cek koneksi saat server start
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database terkoneksi:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ Gagal koneksi database:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
