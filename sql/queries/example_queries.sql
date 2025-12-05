-- Simple example table + queries

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

INSERT INTO users (id, username, email) VALUES
(1, 'admin', 'admin@example.com'),
(2, 'chase', 'chase@example.com');

-- Basic select
SELECT * FROM users;

-- Find by username
SELECT * FROM users WHERE username = 'chase';