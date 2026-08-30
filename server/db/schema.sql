CREATE DATABASE IF NOT EXISTS dabbafund;
USE dabbafund;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_users_email (email)
);

CREATE TABLE IF NOT EXISTS transactions (
    tid VARCHAR(45) NOT NULL,
    uid VARCHAR(45) NOT NULL,
    amount DECIMAL(10,2) UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type ENUM('addition', 'purchase', 'withdraw') NOT NULL,
    description VARCHAR(100) DEFAULT NULL,
    purchase_request_id VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (tid),
    UNIQUE KEY tid_UNIQUE (tid),
    KEY ui_idx (uid),
    CONSTRAINT fk_transactions_user FOREIGN KEY (uid) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS fund_requests (
    rt_id VARCHAR(45) NOT NULL,
    uid VARCHAR(45) NOT NULL,
    amount DECIMAL(10,2) UNSIGNED NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by VARCHAR(45) DEFAULT NULL,
    reviewed_at TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (rt_id),
    UNIQUE KEY rt_id_UNIQUE (rt_id),
    KEY uid_idx (uid),
    CONSTRAINT fk_fund_requests_user FOREIGN KEY (uid) REFERENCES users (id)
);