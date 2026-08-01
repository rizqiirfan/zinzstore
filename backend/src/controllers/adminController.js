const { pool } = require('../config/db');

// GET /api/admin/stats
async function getStats(req, res, next) {
  try {
    const [[userCount]] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const [[trxCount]] = await pool.query('SELECT COUNT(*) AS total FROM transactions');
    const [[revenue]] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS total FROM transactions WHERE status = 'paid'"
    );
    const [statusBreakdown] = await pool.query(
      'SELECT status, COUNT(*) AS count FROM transactions GROUP BY status'
    );
    const [[todayRevenue]] = await pool.query(
      "SELECT COALESCE(SUM(total), 0) AS total FROM transactions WHERE status = 'paid' AND DATE(paid_at) = CURDATE()"
    );

    const breakdown = { pending: 0, paid: 0, failed: 0, cancelled: 0, expired: 0 };
    statusBreakdown.forEach((row) => {
      breakdown[row.status] = row.count;
    });

    res.json({
      success: true,
      data: {
        totalUsers: userCount.total,
        totalTransactions: trxCount.total,
        totalRevenue: revenue.total,
        todayRevenue: todayRevenue.total,
        statusBreakdown: breakdown,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/transactions?status=&page=&limit=
async function getAllTransactions(req, res, next) {
  try {
    const { status } = req.query;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;

    const whereClause = status ? 'WHERE t.status = ?' : '';
    const params = status ? [status] : [];

    const [rows] = await pool.query(
      `SELECT t.*, u.username, u.display_name, p.diamonds, p.bonus, pm.name AS payment_name
       FROM transactions t
       JOIN users u ON u.id = t.user_id
       JOIN diamond_packages p ON p.id = t.package_id
       JOIN payment_methods pm ON pm.id = t.payment_method_id
       ${whereClause}
       ORDER BY t.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM transactions t ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/transactions/:id/status  { status }
// Override manual oleh admin — berguna untuk kasus pembayaran manual/offline
// atau kalau perlu koreksi status yang tidak sinkron dengan Midtrans.
async function updateTransactionStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'paid', 'failed', 'cancelled', 'expired'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Status tidak valid.' });
    }

    const [[trx]] = await pool.query('SELECT id FROM transactions WHERE id = ?', [id]);
    if (!trx) return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });

    await pool.query(
      `UPDATE transactions SET status = ?, paid_at = ${status === 'paid' ? 'NOW()' : 'paid_at'} WHERE id = ?`,
      [status, id]
    );

    res.json({ success: true, message: 'Status transaksi berhasil diperbarui.' });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users
async function getAllUsers(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT id, username, email, display_name, role, created_at FROM users ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getAllTransactions, updateTransactionStatus, getAllUsers };
