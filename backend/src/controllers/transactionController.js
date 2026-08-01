const { pool } = require('../config/db');

// Simulasi lama proses verifikasi pembayaran (dalam ms) — dipakai supaya
// transaksi tidak langsung "paid" begitu saja saat dibuat, melainkan lewat
// jeda proses dulu (seolah-olah lagi diverifikasi ke bank/e-wallet), baru
// setelah waktu ini terlewati status akan berubah jadi 'paid' saat dicek.
const SIMULATED_VERIFICATION_MS = 4000;

function generateInvoiceNo() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZS-${ts}-${rand}`;
}

// POST /api/transactions  (butuh login)
// Body: { packageId, paymentMethodId, gameUserId, gameZoneId, gamePlayerName, promoCode }
// Harga dihitung ulang di server (jangan percaya harga dari client) demi keamanan.
async function createTransaction(req, res, next) {
  const conn = await pool.getConnection();
  try {
    const { packageId, paymentMethodId, gameUserId, gameZoneId, gamePlayerName, promoCode } = req.body;

    if (!packageId || !paymentMethodId || !gameUserId || !gameZoneId) {
      return res.status(400).json({ success: false, message: 'Lengkapi semua data terlebih dahulu.' });
    }

    const [[pkg]] = await conn.query(
      'SELECT * FROM diamond_packages WHERE id = ? AND is_active = 1', [packageId]
    );
    if (!pkg) return res.status(404).json({ success: false, message: 'Paket diamond tidak ditemukan.' });

    const [[pay]] = await conn.query(
      'SELECT * FROM payment_methods WHERE id = ? AND is_active = 1', [paymentMethodId]
    );
    if (!pay) return res.status(404).json({ success: false, message: 'Metode pembayaran tidak ditemukan.' });

    let discount = 0;
    let appliedPromoCode = null;
    if (promoCode) {
      const [[promo]] = await conn.query(
        `SELECT * FROM promo_codes WHERE code = ? AND is_active = 1
         AND (expires_at IS NULL OR expires_at > NOW())`,
        [promoCode.trim().toUpperCase()]
      );
      if (promo) {
        appliedPromoCode = promo.code;
        discount = promo.discount_type === 'percent'
          ? Math.round((pkg.price * promo.discount_value) / 100)
          : promo.discount_value;
        if (promo.max_discount) discount = Math.min(discount, promo.max_discount);
      }
    }

    const total = Math.max(pkg.price + pay.fee - discount, 0);
    const invoiceNo = generateInvoiceNo();

    const [result] = await conn.query(
      `INSERT INTO transactions
        (invoice_no, user_id, package_id, payment_method_id, game_user_id, game_zone_id,
         game_player_name, price, fee, discount, total, promo_code, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [invoiceNo, req.user.id, pkg.id, pay.id, gameUserId, gameZoneId,
       gamePlayerName || null, pkg.price, pay.fee, discount, total, appliedPromoCode]
    );

    res.status(201).json({
      success: true,
      message: 'Transaksi dibuat, sedang menunggu verifikasi pembayaran.',
      data: {
        id: result.insertId,
        invoiceNo,
        package: pkg,
        paymentMethod: pay,
        price: pkg.price,
        fee: pay.fee,
        discount,
        total,
        status: 'pending',
      },
    });
  } catch (err) {
    next(err);
  } finally {
    conn.release();
  }
}

// POST /api/transactions/:id/sync  (butuh login)
// "Verifikasi status" transaksi. Karena tidak pakai payment gateway pihak
// ketiga, verifikasinya disimulasikan di server: begitu waktu simulasi
// (SIMULATED_VERIFICATION_MS) terlewati sejak transaksi dibuat, status
// otomatis dianggap terverifikasi/berhasil saat endpoint ini dipanggil.
// Pengecekannya tetap berdiri sendiri di backend (bukan dari klik user),
// jadi user tidak bisa curang langsung set status "paid" dari frontend.
async function syncTransactionStatus(req, res, next) {
  try {
    const { id } = req.params;
    const [[trx]] = await pool.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, req.user.id]
    );
    if (!trx) return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });

    let status = trx.status;
    if (status === 'pending') {
      const elapsedMs = Date.now() - new Date(trx.created_at).getTime();
      if (elapsedMs >= SIMULATED_VERIFICATION_MS) {
        status = 'paid';
        await pool.query(
          "UPDATE transactions SET status = 'paid', paid_at = NOW() WHERE id = ?",
          [id]
        );
      }
    }

    res.json({
      success: true,
      message:
        status === 'paid'
          ? 'Pembayaran terverifikasi! Diamond akan segera masuk ke akunmu.'
          : 'Pembayaran masih diverifikasi, coba cek lagi sebentar.',
      data: { ...trx, status },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/transactions  (riwayat transaksi user yang login)
async function getMyTransactions(req, res, next) {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, p.diamonds, p.bonus, pm.name AS payment_name
       FROM transactions t
       JOIN diamond_packages p ON p.id = t.package_id
       JOIN payment_methods pm ON pm.id = t.payment_method_id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTransaction,
  syncTransactionStatus,
  getMyTransactions,
};
