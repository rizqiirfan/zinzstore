/**
 * Script seeding database.
 * Jalankan dengan: npm run seed
 * (pastikan schema.sql sudah di-import terlebih dahulu)
 */
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');

const DEMO_ACCOUNTS = [
  { username: 'admin', email: 'admin@zinzstore.com', password: 'admin', displayName: 'Admin ZinzStore', role: 'admin' },
  { username: 'demo',  email: 'demo@zinzstore.com',  password: 'demo',  displayName: 'Demo User' },
  { username: 'gamer', email: 'gamer@zinzstore.com', password: '1234',  displayName: 'Pro Gamer' },
  { username: 'zinz',  email: 'zinz@zinzstore.com',  password: 'zinz',  displayName: 'ZinzStore VIP' },
];

const PACKAGES = [
  ['dm-5',    5,    0,   1500,    null,     1],
  ['dm-12',   12,   0,   3300,    null,     2],
  ['dm-50',   50,   0,   7700,    null,     3],
  ['dm-70',   70,   0,   10500,   null,     4],
  ['dm-140',  140,  0,   20000,   null,     5],
  ['dm-355',  355,  0,   50000,   null,     6],
  ['dm-720',  720,  0,   100000,  null,     7],
  ['dm-1450', 1450, 75,  200000,  null,     8],
  ['dm-2180', 2180, 150, 300000,  null,     9],
  ['dm-3640', 3640, 360, 500000,  null,     10],
  ['dm-7290', 7290, 910, 1000000, null,     11],
  ['dm-week', 60,   420, 28000,   'Weekly', 12],
];

const PAYMENT_METHODS = [
  ['dana',      'DANA',      'icons/dana.png',      1000, 'ewallet'],
  ['gopay',     'GoPay',     'icons/gopay.png',      1000, 'ewallet'],
  ['shopeepay', 'ShopeePay', 'icons/shopeepay.png',  1000, 'ewallet'],
  ['qris',      'QRIS',      'icons/qris.png',       500,  'qris'],
];

const PROMO_CODES = [
  ['ZINZSTORE10', 'percent', 10, 50000],
  ['NEWUSER',     'fixed',   2000, null],
];

async function seed() {
  const conn = await pool.getConnection();
  try {
    console.log('🌱 Mulai seeding...');

    for (const p of PACKAGES) {
      await conn.query(
        `INSERT INTO diamond_packages (id, diamonds, bonus, price, label, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE diamonds=VALUES(diamonds), price=VALUES(price)`,
        p
      );
    }
    console.log(`✅ ${PACKAGES.length} paket diamond`);

    for (const m of PAYMENT_METHODS) {
      await conn.query(
        `INSERT INTO payment_methods (id, name, icon, fee, category)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), fee=VALUES(fee)`,
        m
      );
    }
    console.log(`✅ ${PAYMENT_METHODS.length} metode pembayaran`);

    for (const promo of PROMO_CODES) {
      await conn.query(
        `INSERT INTO promo_codes (code, discount_type, discount_value, max_discount)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE discount_value=VALUES(discount_value)`,
        promo
      );
    }
    console.log(`✅ ${PROMO_CODES.length} kode promo`);

    for (const acc of DEMO_ACCOUNTS) {
      const hash = await bcrypt.hash(acc.password, 10);
      await conn.query(
        `INSERT INTO users (username, email, password_hash, display_name, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE display_name=VALUES(display_name)`,
        [acc.username, acc.email, hash, acc.displayName, acc.role || 'user']
      );
    }
    console.log(`✅ ${DEMO_ACCOUNTS.length} akun demo (password sama dengan username, contoh: demo/demo)`);

    console.log('🎉 Seeding selesai!');
  } catch (err) {
    console.error('❌ Seeding gagal:', err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seed();
