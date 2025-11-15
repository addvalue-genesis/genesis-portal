-- GENESIS Portal – Phase 1.1 base schema
-- This script assumes you already have the Dolibarr ERP database on the same MySQL server.

-- 1) Create a separate database/schema for GENESIS (if not existing yet)
--    You may change `genesis_portal` to another name if you want.
CREATE DATABASE IF NOT EXISTS genesis_portal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE genesis_portal;

-- 2) Employee extension table
CREATE TABLE IF NOT EXISTS genesis_employee_ext (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fk_user_id INT NOT NULL,              -- Link to Dolibarr llx_user.rowid
    national_id VARCHAR(20) NULL,
    passport_no VARCHAR(50) NULL,
    passport_expiry DATE NULL,
    blood_type VARCHAR(5) NULL,
    health_cert_date DATE NULL,
    health_cert_expiry DATE NULL,
    training_matrix JSON NULL,
    skills JSON NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_employee_fk_user (fk_user_id)
);
