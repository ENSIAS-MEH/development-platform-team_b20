-- ==========================================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES 
-- ==========================================================

-- 1. CRÉATION DES SCHÉMAS 
CREATE SCHEMA IF NOT EXISTS users_schema;
CREATE SCHEMA IF NOT EXISTS events_schema;
CREATE SCHEMA IF NOT EXISTS interactions_schema;

-- ==========================================================
-- 2. STRUCTURE DU SERVICE : USER-SERVICE (Schéma: users_schema)
-- ==========================================================

CREATE TABLE IF NOT EXISTS users_schema.users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER'
);

CREATE TABLE IF NOT EXISTS users_schema.user_interests (
    user_id BIGINT NOT NULL,
    interests VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users_schema.users(id)
);

-- ==========================================================
-- 3. STRUCTURE DU SERVICE : EVENT-SERVICE (Schéma: events_schema)
-- ==========================================================

CREATE TABLE IF NOT EXISTS events_schema.events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    event_date TIMESTAMP NOT NULL,
    capacity INTEGER,
    category VARCHAR(100),
    organizer_id BIGINT NOT NULL 
);

-- ==========================================================
-- 4. STRUCTURE DU SERVICE : INTERACTION-SERVICE (Schéma: interactions_schema)
-- ==========================================================

CREATE TABLE IF NOT EXISTS interactions_schema.comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS interactions_schema.event_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS interactions_schema.participations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING'
);

-- ==========================================================
-- 5. DONNÉES DE TEST (SEED DATA) 
-- ==========================================================


INSERT INTO users_schema.users (email, full_name, password, role) 
VALUES 
('admin@social.com', 'Admin Hatim', 'password123', 'ADMIN'),
('nizar@social.com', 'Nizar Events', 'password123', 'USER');


INSERT INTO events_schema.events (title, description, location, event_date, capacity, category, organizer_id)
VALUES 
('Workshop Spring Boot', 'Apprendre les microservices', 'ENSIAS Rabat', '2026-06-01 10:00:00', 50, 'Education', 1);