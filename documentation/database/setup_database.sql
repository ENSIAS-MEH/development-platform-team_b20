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
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_schema.roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users_schema.user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users_schema.users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES users_schema.roles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users_schema.user_interests (
    user_id BIGINT NOT NULL,
    interest VARCHAR(100) NOT NULL,
    PRIMARY KEY (user_id, interest),
    FOREIGN KEY (user_id) REFERENCES users_schema.users(id) ON DELETE CASCADE
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

-- Insertion des rôles
INSERT INTO users_schema.roles (name) VALUES 
('ROLE_USER'),
('ROLE_ADMIN');

-- Insertion des utilisateurs (Les mots de passe ici simulent un hash BCrypt)
INSERT INTO users_schema.users (email, full_name, password, bio) 
VALUES 
('admin@social.com', 'Admin User', '1234', 'Administrateur principal du système.'),
('nizar@social.com', 'Nizar Ben Ayad', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HCGa3KP5wEysRl9zG1Vuq', 'Passionné par l''organisation d''événements tech.');

-- Attribution des rôles
INSERT INTO users_schema.user_roles (user_id, role_id) 
VALUES 
(1, 2), -- admin@social.com devient ROLE_ADMIN
(2, 1); -- nizar@social.com devient ROLE_USER

-- Insertion des centres d'intérêt
INSERT INTO users_schema.user_interests (user_id, interest)
VALUES
(2, 'Développement Web'),
(2, 'Intelligence Artificielle');

-- Insertion d'un événement
INSERT INTO events_schema.events (title, description, location, event_date, capacity, category, organizer_id)
VALUES 
('Workshop Spring Boot', 'Apprendre les microservices', 'ENSIAS Rabat', '2026-06-01 10:00:00', 50, 'Education', 2);