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

CREATE TABLE IF NOT EXISTS requests (
    request_id VARCHAR(45) NOT NULL,
    uid VARCHAR(45) NOT NULL,
    amount DECIMAL(10,2) UNSIGNED NOT NULL,
    type ENUM('add_money', 'purchase') NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR(255) DEFAULT NULL,
    purchase_id VARCHAR(45) DEFAULT NULL,
    PRIMARY KEY (request_id),
    UNIQUE KEY request_id_UNIQUE (request_id),
    KEY uid_idx (uid),
    KEY type_idx (type),
    CONSTRAINT fk_requests_user FOREIGN KEY (uid) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS purchase_votes (
    vote_id VARCHAR(45) NOT NULL,
    purchase_id VARCHAR(45) NOT NULL,
    uid VARCHAR(45) NOT NULL,
    vote ENUM('yes', 'no') NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vote_id),
    UNIQUE KEY unique_purchase_user_vote (purchase_id, uid),
    KEY purchase_id_idx (purchase_id),
    KEY uid_idx (uid),
    CONSTRAINT fk_purchase_votes_purchase FOREIGN KEY (purchase_id) REFERENCES requests (request_id),
    CONSTRAINT fk_purchase_votes_user FOREIGN KEY (uid) REFERENCES users (id)
);