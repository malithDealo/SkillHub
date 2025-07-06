-- SkillHub Database Schema
-- Run this in your SQLite3 database to create the tables

-- Users table for all user types
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('learner', 'teacher', 'sponsor')),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    profile_image TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Teachers table for teacher-specific information
CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    skills TEXT, -- JSON array of skills
    about TEXT,
    experience_years INTEGER DEFAULT 0,
    teaching_language TEXT CHECK (teaching_language IN ('english', 'sinhala', 'tamil')),
    certificates TEXT, -- JSON array of certificate file paths
    background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Learners table for learner-specific information
CREATE TABLE IF NOT EXISTS learners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    interests TEXT, -- JSON array of interests
    age_group TEXT CHECK (age_group IN ('12-15', '16-20', '21-25', '26-30', '30+')),
    preferred_language TEXT DEFAULT 'english' CHECK (preferred_language IN ('english', 'sinhala', 'tamil')),
    learning_goals TEXT,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Sponsors table for sponsor-specific information
CREATE TABLE IF NOT EXISTS sponsors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    sponsorship_interests TEXT, -- JSON array of interests
    about TEXT,
    budget INTEGER,
    organization_verification_status TEXT DEFAULT 'pending' CHECK (organization_verification_status IN ('pending', 'approved', 'rejected')),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- User sessions table for managing active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Login attempts table for security
CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    ip_address TEXT,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users (user_type);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users (is_verified);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts (email);

-- Insert some sample data for testing
INSERT OR IGNORE INTO users (email, password_hash, user_type, first_name, last_name, phone, location, is_verified) VALUES
('teacher@example.com', '$2b$10$rQZ8.K9Z3Y7X5B4W2E1D8.N7M6L5K4J3H2G1F0E9D8C7B6A5Z4Y3X2W1', 'teacher', 'John', 'Teacher', '+94712345678', 'Colombo, Western', TRUE),
('learner@example.com', '$2b$10$rQZ8.K9Z3Y7X5B4W2E1D8.N7M6L5K4J3H2G1F0E9D8C7B6A5Z4Y3X2W1', 'learner', 'Jane', 'Student', '+94712345679', 'Kandy, Central', TRUE),
('sponsor@example.com', '$2b$10$rQZ8.K9Z3Y7X5B4W2E1D8.N7M6L5K4J3H2G1F0E9D8C7B6A5Z4Y3X2W1', 'sponsor', 'Mike', 'Company', '+94712345680', 'Galle, Southern', TRUE);

-- Insert sample teacher data
INSERT OR IGNORE INTO teachers (user_id, skills, about, experience_years, teaching_language) VALUES
(1, '["Mathematics", "Physics", "Programming"]', 'Experienced teacher with 5 years of teaching experience in STEM subjects.', 5, 'english');

-- Insert sample learner data
INSERT OR IGNORE INTO learners (user_id, interests, age_group, preferred_language) VALUES
(2, '["Programming", "Web Development", "Art"]', '21-25', 'english');

-- Insert sample sponsor data
INSERT OR IGNORE INTO sponsors (user_id, company_name, address, sponsorship_interests, about, budget) VALUES
(3, 'Tech Solutions Ltd', '123 Business Street, Colombo', '["Technology", "Education", "Innovation"]', 'We support technology education initiatives.', 100000);