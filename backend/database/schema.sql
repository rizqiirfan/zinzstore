-- ============================================================
-- ZINZSTORE DATABASE SCHEMA (MySQL 8+)
-- ============================================================
CREATE DATABASE IF NOT EXISTS zinzstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE zinzstore;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name  VARCHAR(100) NOT NULL,
  role          ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: diamond_packages
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS diamond_packages (
  id         VARCHAR(20) PRIMARY KEY,   -- e.g. 'dm-5'
  diamonds   INT NOT NULL,
  bonus      INT NOT NULL DEFAULT 0,
  price      INT NOT NULL,              -- Rupiah
  label      VARCHAR(30) NULL,          -- e.g. 'Weekly'
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: payment_methods
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_methods (
  id         VARCHAR(20) PRIMARY KEY,   -- e.g. 'dana'
  name       VARCHAR(50) NOT NULL,
  icon       VARCHAR(150) NOT NULL,
  fee        INT NOT NULL DEFAULT 0,
  category   ENUM('ewallet','qris') NOT NULL,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: promo_codes
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS promo_codes (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  code           VARCHAR(30) NOT NULL UNIQUE,
  discount_type  ENUM('percent','fixed') NOT NULL,
  discount_value INT NOT NULL,          -- percent (0-100) or fixed Rupiah
  max_discount   INT NULL,              -- cap for percent discounts
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at     DATETIME NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: transactions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no       VARCHAR(30) NOT NULL UNIQUE,
  user_id          INT NOT NULL,
  package_id       VARCHAR(20) NOT NULL,
  payment_method_id VARCHAR(20) NOT NULL,
  game_user_id     VARCHAR(50) NOT NULL,
  game_zone_id     VARCHAR(50) NOT NULL,
  game_player_name VARCHAR(150) NULL,
  price            INT NOT NULL,
  fee              INT NOT NULL,
  discount         INT NOT NULL DEFAULT 0,
  total            INT NOT NULL,
  promo_code       VARCHAR(30) NULL,
  status           ENUM('pending','paid','failed','cancelled','expired') NOT NULL DEFAULT 'pending',
  snap_token       VARCHAR(255) NULL,
  payment_url      VARCHAR(255) NULL,
  midtrans_status  VARCHAR(30) NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at          TIMESTAMP NULL,
  CONSTRAINT fk_trx_user    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_trx_package FOREIGN KEY (package_id) REFERENCES diamond_packages(id),
  CONSTRAINT fk_trx_payment FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
) ENGINE=InnoDB;

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
