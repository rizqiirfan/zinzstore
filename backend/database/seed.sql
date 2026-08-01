-- ============================================================
-- ZINZSTORE SEED DATA
-- Password untuk semua akun demo di bawah: sama dengan username
-- (di-hash pakai bcrypt di seed.js, bukan di sini — file ini contoh saja)
-- Jalankan `npm run seed` dari folder backend untuk mengisi data
-- termasuk hashing password secara otomatis.
-- ============================================================
USE zinzstore;

-- Paket Diamond
INSERT INTO diamond_packages (id, diamonds, bonus, price, label, sort_order) VALUES
('dm-5',    5,    0,   1500,    NULL,     1),
('dm-12',   12,   0,   3300,    NULL,     2),
('dm-50',   50,   0,   7700,    NULL,     3),
('dm-70',   70,   0,   10500,   NULL,     4),
('dm-140',  140,  0,   20000,   NULL,     5),
('dm-355',  355,  0,   50000,   NULL,     6),
('dm-720',  720,  0,   100000,  NULL,     7),
('dm-1450', 1450, 75,  200000,  NULL,     8),
('dm-2180', 2180, 150, 300000,  NULL,     9),
('dm-3640', 3640, 360, 500000,  NULL,     10),
('dm-7290', 7290, 910, 1000000, NULL,     11),
('dm-week', 60,   420, 28000,   'Weekly', 12)
ON DUPLICATE KEY UPDATE diamonds=VALUES(diamonds);

-- Metode Pembayaran
INSERT INTO payment_methods (id, name, icon, fee, category) VALUES
('dana',      'DANA',      'icons/dana.png',      1000, 'ewallet'),
('gopay',     'GoPay',     'icons/gopay.png',      1000, 'ewallet'),
('shopeepay', 'ShopeePay', 'icons/shopeepay.png',  1000, 'ewallet'),
('qris',      'QRIS',      'icons/qris.png',       500,  'qris')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Kode Promo
INSERT INTO promo_codes (code, discount_type, discount_value, max_discount) VALUES
('ZINZSTORE10', 'percent', 10, 50000),
('NEWUSER',     'fixed',   2000, NULL)
ON DUPLICATE KEY UPDATE discount_value=VALUES(discount_value);
