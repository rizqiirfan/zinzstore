-- ============================================================
-- MIGRASI: Admin Dashboard + Payment Gateway (Midtrans)
-- Jalankan file ini HANYA JIKA database `zinzstore` kamu sudah
-- pernah dibuat sebelumnya (sudah ada isinya / sudah pernah di-seed).
--
-- Kalau kamu baru mulai dari nol, TIDAK PERLU menjalankan file ini —
-- cukup jalankan schema.sql yang sudah ter-update.
--
-- Cara pakai:
--   mysql -u root -p zinzstore < database/migration_admin_payment.sql
-- ============================================================
USE zinzstore;

-- Tambah status 'expired' (dipakai saat pembayaran Midtrans kedaluwarsa)
ALTER TABLE transactions
  MODIFY COLUMN status ENUM('pending','paid','failed','cancelled','expired') NOT NULL DEFAULT 'pending';

-- Tambah kolom referensi Midtrans (aman dijalankan ulang berkat cek IF NOT EXISTS via prosedur di bawah)
SET @dbname = 'zinzstore';
SET @tablename = 'transactions';

SET @col_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'snap_token'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE transactions ADD COLUMN snap_token VARCHAR(255) NULL AFTER promo_code',
  'SELECT "Kolom snap_token sudah ada, dilewati."');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'payment_url'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE transactions ADD COLUMN payment_url VARCHAR(255) NULL AFTER snap_token',
  'SELECT "Kolom payment_url sudah ada, dilewati."');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists = (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = @tablename AND COLUMN_NAME = 'midtrans_status'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE transactions ADD COLUMN midtrans_status VARCHAR(30) NULL AFTER payment_url',
  'SELECT "Kolom midtrans_status sudah ada, dilewati."');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SELECT '✅ Migrasi selesai!' AS result;
