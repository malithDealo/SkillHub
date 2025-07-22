CREATE TABLE IF NOT EXISTS users_new (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_picture VARCHAR(500),
    bio TEXT,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Migrate data if users table exists with different structure
INSERT OR IGNORE INTO users_new (user_id, email, password_hash, first_name, last_name, phone, created_at)
SELECT id, email, password_hash, 
       CASE WHEN instr(user_type, 'John') > 0 THEN 'John' 
            WHEN instr(user_type, 'Jane') > 0 THEN 'Jane' 
            WHEN instr(user_type, 'Mike') > 0 THEN 'Mike' 
            ELSE substr(email, 1, instr(email, '@')-1) END as first_name,
       CASE WHEN user_type = 'teacher' THEN 'Teacher'
            WHEN user_type = 'learner' THEN 'Learner' 
            WHEN user_type = 'sponsor' THEN 'Sponsor'
            ELSE 'User' END as last_name,
       NULL, created_at
FROM users WHERE EXISTS (SELECT 1 FROM pragma_table_info('users') WHERE name = 'user_type');

-- User roles table
CREATE TABLE IF NOT EXISTS user_roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role_type VARCHAR(20) CHECK (role_type IN ('teacher', 'learner', 'sponsor', 'admin')) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE
);

-- ========================================
-- Skill Management Tables
-- ========================================

CREATE TABLE IF NOT EXISTS skill_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
    skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES skill_categories(category_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teacher_skills (
    teacher_skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    experience_years INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    accepts_skill_exchange BOOLEAN DEFAULT FALSE,
    max_students_per_session INTEGER DEFAULT 10,
    session_duration_minutes INTEGER DEFAULT 60,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
    UNIQUE (user_id, skill_id)
);

-- ========================================
-- Admin Management Tables
-- ========================================

CREATE TABLE IF NOT EXISTS admin_users (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    admin_level VARCHAR(20) CHECK (admin_level IN ('super_admin', 'admin', 'moderator')) DEFAULT 'moderator',
    permissions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin_users(admin_id)
);

CREATE TABLE IF NOT EXISTS teacher_verifications (
    verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    verification_type VARCHAR(50) NOT NULL,
    document_url VARCHAR(500),
    certificate_name VARCHAR(200),
    certificate_description TEXT,
    issuing_organization VARCHAR(200),
    issue_date DATE,
    expiry_date DATE,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'expired')) DEFAULT 'pending',
    verified_by INTEGER,
    verification_date DATETIME,
    rejection_reason TEXT,
    admin_notes TEXT,
    user_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES admin_users(admin_id)
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    action_description TEXT,
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
);

-- ========================================
-- Teacher Level System
-- ========================================

CREATE TABLE IF NOT EXISTS teacher_levels (
    level_id INTEGER PRIMARY KEY AUTOINCREMENT,
    level_name VARCHAR(50) UNIQUE NOT NULL,
    min_rating DECIMAL(3,2) DEFAULT 0.00,
    min_reviews INTEGER DEFAULT 0,
    min_hours_taught INTEGER DEFAULT 0,
    benefits TEXT,
    badge_icon VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_teacher_levels (
    user_level_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level_id INTEGER NOT NULL,
    achieved_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES teacher_levels(level_id),
    UNIQUE (user_id, level_id)
);

-- ========================================
-- Learning and Session Management
-- ========================================

CREATE TABLE IF NOT EXISTS learning_requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    accepts_skill_exchange BOOLEAN DEFAULT FALSE,
    preferred_session_duration INTEGER DEFAULT 60,
    max_distance_km INTEGER,
    urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR(20) CHECK (status IN ('open', 'matched', 'closed', 'expired')) DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE IF NOT EXISTS learning_groups (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    skill_id INTEGER NOT NULL,
    creator_id INTEGER NOT NULL,
    max_members INTEGER DEFAULT 20,
    current_members INTEGER DEFAULT 0,
    meeting_schedule TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_private BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (creator_id) REFERENCES users_new(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learning_group_members (
    membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) CHECK (role IN ('creator', 'admin', 'member')) DEFAULT 'member',
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (group_id) REFERENCES learning_groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    UNIQUE (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    session_type VARCHAR(20) CHECK (session_type IN ('individual', 'group', 'workshop', 'masterclass')) DEFAULT 'individual',
    max_students INTEGER DEFAULT 1,
    current_students INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    duration_minutes INTEGER DEFAULT 60,
    session_date DATETIME NOT NULL,
    location_type VARCHAR(20) CHECK (location_type IN ('online', 'in_person', 'hybrid')) DEFAULT 'online',
    location_address TEXT,
    location_latitude DECIMAL(10,8),
    location_longitude DECIMAL(11,8),
    status VARCHAR(20) CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

CREATE TABLE IF NOT EXISTS session_enrollments (
    enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')) DEFAULT 'pending',
    attendance_status VARCHAR(20) CHECK (attendance_status IN ('registered', 'attended', 'absent', 'cancelled')) DEFAULT 'registered',
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    UNIQUE (session_id, student_id)
);

-- ========================================
-- Communication System
-- ========================================

CREATE TABLE IF NOT EXISTS messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    conversation_id VARCHAR(100),
    subject VARCHAR(200),
    content TEXT NOT NULL,
    message_type VARCHAR(20) CHECK (message_type IN ('direct', 'system', 'notification', 'group')) DEFAULT 'direct',
    is_read BOOLEAN DEFAULT FALSE,
    is_flagged BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    FOREIGN KEY (sender_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users_new(user_id) ON DELETE CASCADE
);

-- ========================================
-- Review System
-- ========================================

CREATE TABLE IF NOT EXISTS reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    reviewer_id INTEGER NOT NULL,
    reviewee_id INTEGER NOT NULL,
    review_type VARCHAR(20) CHECK (review_type IN ('session', 'teacher', 'student')) DEFAULT 'session',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(200),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users_new(user_id) ON DELETE CASCADE
);

-- ========================================
-- Community Events
-- ========================================

CREATE TABLE IF NOT EXISTS community_events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) CHECK (event_type IN ('workshop', 'meetup', 'conference', 'competition', 'social')) DEFAULT 'workshop',
    skill_id INTEGER,
    event_date DATETIME NOT NULL,
    end_date DATETIME,
    location_address TEXT,
    location_latitude DECIMAL(10,8),
    location_longitude DECIMAL(11,8),
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_fee DECIMAL(10,2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT TRUE,
    is_sponsored BOOLEAN DEFAULT FALSE,
    sponsor_id INTEGER,
    status VARCHAR(20) CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')) DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id)
);

CREATE TABLE IF NOT EXISTS event_registrations (
    registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) CHECK (attendance_status IN ('registered', 'confirmed', 'attended', 'absent', 'cancelled')) DEFAULT 'registered',
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'waived')) DEFAULT 'pending',
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES community_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    UNIQUE (event_id, user_id)
);

-- ========================================
-- Sponsor Management (Update existing)
-- ========================================

CREATE TABLE IF NOT EXISTS sponsors_new (
    sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    website VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    logo_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Migrate existing sponsor data
INSERT OR IGNORE INTO sponsors_new (sponsor_id, company_name, email, created_at)
SELECT id, 'Tech Solutions Ltd', 
       CASE WHEN EXISTS (SELECT 1 FROM pragma_table_info('sponsors') WHERE name = 'email')
            THEN email 
            ELSE 'contact@techsolutions.com' END,
       created_at
FROM sponsors WHERE EXISTS (SELECT name FROM sqlite_master WHERE type='table' AND name='sponsors');

CREATE TABLE IF NOT EXISTS sponsorships (
    sponsorship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_id INTEGER NOT NULL,
    sponsored_type VARCHAR(20) CHECK (sponsored_type IN ('event', 'session', 'user', 'platform')) NOT NULL,
    sponsored_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    sponsorship_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_days INTEGER DEFAULT 30,
    benefits_provided TEXT,
    status VARCHAR(20) CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
    FOREIGN KEY (sponsor_id) REFERENCES sponsors_new(sponsor_id) ON DELETE CASCADE
);

-- ========================================
-- Payment System
-- ========================================

CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    payer_id INTEGER NOT NULL,
    payee_id INTEGER,
    payment_type VARCHAR(20) CHECK (payment_type IN ('session', 'event', 'subscription', 'refund', 'commission')) NOT NULL,
    reference_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'paypal', 'bank_transfer', 'wallet')) DEFAULT 'card',
    transaction_id VARCHAR(100),
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')) DEFAULT 'pending',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (payer_id) REFERENCES users_new(user_id),
    FOREIGN KEY (payee_id) REFERENCES users_new(user_id)
);

-- ========================================
-- Skill Exchange System
-- ========================================

CREATE TABLE IF NOT EXISTS skill_exchanges (
    exchange_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    user1_skill_id INTEGER NOT NULL,
    user2_skill_id INTEGER NOT NULL,
    user1_hours INTEGER DEFAULT 1,
    user2_hours INTEGER DEFAULT 1,
    status VARCHAR(20) CHECK (status IN ('proposed', 'accepted', 'ongoing', 'completed', 'cancelled')) DEFAULT 'proposed',
    proposed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_date DATETIME,
    completed_date DATETIME,
    notes TEXT,
    FOREIGN KEY (user1_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user1_skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (user2_skill_id) REFERENCES skills(skill_id)
);

-- ========================================
-- User Preferences and Notifications
-- ========================================

CREATE TABLE IF NOT EXISTS user_preferences (
    preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_push BOOLEAN DEFAULT TRUE,
    privacy_show_profile BOOLEAN DEFAULT TRUE,
    privacy_show_location BOOLEAN DEFAULT FALSE,
    max_travel_distance INTEGER DEFAULT 50,
    preferred_session_times TEXT,
    accessibility_needs TEXT,
    language_preferences TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) CHECK (notification_type IN ('system', 'message', 'session', 'payment', 'review', 'event')) NOT NULL,
    reference_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    sent_via VARCHAR(20) CHECK (sent_via IN ('email', 'sms', 'push', 'in_app')) DEFAULT 'in_app',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE
);

-- ========================================
-- System Monitoring and Moderation
-- ========================================

CREATE TABLE IF NOT EXISTS system_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    table_affected VARCHAR(50),
    record_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id)
);

CREATE TABLE IF NOT EXISTS content_moderation (
    moderation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type VARCHAR(20) CHECK (content_type IN ('message', 'review', 'profile', 'session', 'event')) NOT NULL,
    content_id INTEGER NOT NULL,
    reported_by INTEGER,
    report_reason VARCHAR(100),
    auto_flagged BOOLEAN DEFAULT FALSE,
    flagged_keywords TEXT,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')) DEFAULT 'pending',
    moderator_id INTEGER,
    moderation_date DATETIME,
    moderator_notes TEXT,
    action_taken VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users_new(user_id),
    FOREIGN KEY (moderator_id) REFERENCES admin_users(admin_id)
);

-- ========================================
-- Admin Dashboard and System Management
-- ========================================

CREATE TABLE IF NOT EXISTS admin_dashboard_stats (
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    stat_date DATE UNIQUE NOT NULL,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_users_today INTEGER DEFAULT 0,
    total_teachers INTEGER DEFAULT 0,
    verified_teachers INTEGER DEFAULT 0,
    pending_verifications INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0.00,
    pending_moderations INTEGER DEFAULT 0,
    reported_content INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_suspensions (
    suspension_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    suspension_type VARCHAR(20) CHECK (suspension_type IN ('warning', 'temporary', 'permanent')) DEFAULT 'warning',
    reason TEXT NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users_new(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
);

CREATE TABLE IF NOT EXISTS system_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) CHECK (setting_type IN ('string', 'number', 'boolean', 'json')) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES admin_users(admin_id)
);

-- ========================================
-- Insert Sample Data
-- ========================================

-- Default skill categories
INSERT OR IGNORE INTO skill_categories (category_name, description, icon) VALUES
('Technology', 'Programming, web development, software engineering', 'code'),
('Languages', 'Foreign language learning and translation', 'globe'),
('Arts & Crafts', 'Creative skills like painting, sculpture, crafts', 'palette'),
('Music', 'Musical instruments, singing, music theory', 'music'),
('Sports & Fitness', 'Physical activities and fitness training', 'activity'),
('Business', 'Entrepreneurship, marketing, finance', 'briefcase'),
('Academic', 'Mathematics, science, literature, tutoring', 'book'),
('Life Skills', 'Cooking, gardening, home improvement', 'home');

-- Default skills
INSERT OR IGNORE INTO skills (category_id, skill_name, difficulty_level) VALUES
(1, 'JavaScript Programming', 'Intermediate'),
(1, 'Python Programming', 'Beginner'),
(1, 'Web Development', 'Intermediate'),
(2, 'English Conversation', 'Beginner'),
(2, 'Spanish Language', 'Beginner'),
(3, 'Digital Art', 'Intermediate'),
(3, 'Pottery', 'Beginner'),
(4, 'Guitar Playing', 'Beginner'),
(4, 'Piano Lessons', 'Beginner'),
(5, 'Yoga', 'Beginner'),
(6, 'Digital Marketing', 'Intermediate'),
(7, 'Mathematics Tutoring', 'Intermediate'),
(8, 'Cooking Basics', 'Beginner');

-- Default teacher levels
INSERT OR IGNORE INTO teacher_levels (level_name, min_rating, min_reviews, min_hours_taught, benefits) VALUES
('Bronze', 0.00, 0, 0, 'Basic teacher status'),
('Silver', 4.00, 10, 50, 'Enhanced profile visibility'),
('Gold', 4.50, 25, 100, 'Priority support and featured listings'),
('Platinum', 4.80, 50, 200, 'Premium features and top placement');

-- Default admin user
INSERT OR IGNORE INTO admin_users (username, email, password_hash, first_name, last_name, admin_level) VALUES
('admin', 'admin@skillhub.com', '$2b$12$example_hash', 'System', 'Administrator', 'super_admin');

-- Default system settings
INSERT OR IGNORE INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'SkillHub', 'string', 'Platform display name', TRUE),
('default_currency', 'USD', 'string', 'Default currency for transactions', TRUE),
('max_session_duration', '240', 'number', 'Maximum session duration in minutes', FALSE),
('commission_rate', '0.10', 'number', 'Platform commission rate', FALSE),
('email_notifications_enabled', 'true', 'boolean', 'Enable email notifications', FALSE);

-- ========================================
-- Create Indexes for Performance
-- ========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users_new(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users_new(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_type ON user_roles(role_type);
CREATE INDEX IF NOT EXISTS idx_teacher_skills_user_id ON teacher_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_teacher_skills_skill_id ON teacher_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_teacher_skills_available ON teacher_skills(is_available);
CREATE INDEX IF NOT EXISTS idx_sessions_teacher_id ON sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_session_enrollments_session_id ON session_enrollments(session_id);
CREATE INDEX IF NOT EXISTS idx_session_enrollments_student_id ON session_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_reviews_session_id ON reviews(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_unread ON messages(receiver_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ========================================
-- Create Views for Common Queries
-- ========================================

CREATE VIEW IF NOT EXISTS teacher_stats AS
SELECT 
    u.user_id,
    u.first_name || ' ' || u.last_name as full_name,
    u.email,
    COUNT(DISTINCT ts.skill_id) as skills_count,
    COUNT(DISTINCT s.session_id) as total_sessions,
    COUNT(DISTINCT CASE WHEN s.status = 'completed' THEN s.session_id END) as completed_sessions,
    AVG(r.rating) as average_rating,
    COUNT(r.review_id) as total_reviews,
    SUM(CASE WHEN s.status = 'completed' THEN s.duration_minutes END) as total_hours_taught
FROM users_new u
JOIN user_roles ur ON u.user_id = ur.user_id AND ur.role_type = 'teacher'
LEFT JOIN teacher_skills ts ON u.user_id = ts.user_id AND ts.is_available = TRUE
LEFT JOIN sessions s ON u.user_id = s.teacher_id
LEFT JOIN reviews r ON u.user_id = r.reviewee_id AND r.review_type IN ('teacher', 'session')
WHERE u.is_active = TRUE
GROUP BY u.user_id, u.first_name, u.last_name, u.email;

-- SkillHub Database Update Script - Part 2 (Continuation)
-- Views and Final Setup

CREATE VIEW IF NOT EXISTS active_sessions AS
SELECT 
    s.session_id,
    s.title,
    t.first_name || ' ' || t.last_name as teacher_name,
    sk.skill_name,
    s.session_date,
    s.duration_minutes,
    s.price,
    s.max_students,
    s.current_students,
    s.location_type,
    s.status
FROM sessions s
JOIN users_new t ON s.teacher_id = t.user_id
JOIN skills sk ON s.skill_id = sk.skill_id
WHERE s.status IN ('scheduled', 'ongoing')
ORDER BY s.session_date;

CREATE VIEW IF NOT EXISTS user_dashboard AS
SELECT 
    u.user_id,
    u.first_name || ' ' || u.last_name as full_name,
    u.email,
    u.profile_picture,
    u.city,
    u.country,
    u.is_active,
    GROUP_CONCAT(DISTINCT ur.role_type) as roles,
    COUNT(DISTINCT CASE WHEN ur.role_type = 'teacher' THEN ts.skill_id END) as teaching_skills,
    COUNT(DISTINCT CASE WHEN ur.role_type = 'teacher' THEN s.session_id END) as sessions_taught,
    COUNT(DISTINCT se.session_id) as sessions_attended,
    COUNT(DISTINCT n.notification_id) as unread_notifications
FROM users_new u
LEFT JOIN user_roles ur ON u.user_id = ur.user_id AND ur.is_active = TRUE
LEFT JOIN teacher_skills ts ON u.user_id = ts.user_id AND ts.is_available = TRUE
LEFT JOIN sessions s ON u.user_id = s.teacher_id
LEFT JOIN session_enrollments se ON u.user_id = se.student_id
LEFT JOIN notifications n ON u.user_id = n.user_id AND n.is_read = FALSE
WHERE u.is_active = TRUE
GROUP BY u.user_id, u.first_name, u.last_name, u.email, u.profile_picture, u.city, u.country, u.is_active;

CREATE VIEW IF NOT EXISTS recent_activity AS
SELECT 
    'session' as activity_type,
    s.session_id as reference_id,
    'Session "' || s.title || '" with ' || t.first_name || ' ' || t.last_name as description,
    s.created_at as activity_date,
    s.teacher_id as user_id
FROM sessions s
JOIN users_new t ON s.teacher_id = t.user_id
WHERE s.created_at >= datetime('now', '-7 days')

UNION ALL

SELECT 
    'enrollment' as activity_type,
    se.enrollment_id as reference_id,
    st.first_name || ' ' || st.last_name || ' enrolled in session "' || s.title || '"' as description,
    se.enrollment_date as activity_date,
    se.student_id as user_id
FROM session_enrollments se
JOIN sessions s ON se.session_id = s.session_id
JOIN users_new st ON se.student_id = st.user_id
WHERE se.enrollment_date >= datetime('now', '-7 days')

UNION ALL

SELECT 
    'review' as activity_type,
    r.review_id as reference_id,
    'New review: "' || COALESCE(r.title, 'No title') || '" (' || r.rating || ' stars)' as description,
    r.created_at as activity_date,
    r.reviewer_id as user_id
FROM reviews r
WHERE r.created_at >= datetime('now', '-7 days')

ORDER BY activity_date DESC
LIMIT 50;

-- ========================================
-- Create Triggers for Data Integrity
-- ========================================

-- Update session current_students count when enrollments change
CREATE TRIGGER IF NOT EXISTS update_session_students_on_enroll
AFTER INSERT ON session_enrollments
WHEN NEW.attendance_status != 'cancelled'
BEGIN
    UPDATE sessions 
    SET current_students = (
        SELECT COUNT(*) 
        FROM session_enrollments 
        WHERE session_id = NEW.session_id 
        AND attendance_status != 'cancelled'
    )
    WHERE session_id = NEW.session_id;
END;

CREATE TRIGGER IF NOT EXISTS update_session_students_on_cancel
AFTER UPDATE OF attendance_status ON session_enrollments
WHEN NEW.attendance_status = 'cancelled' AND OLD.attendance_status != 'cancelled'
BEGIN
    UPDATE sessions 
    SET current_students = (
        SELECT COUNT(*) 
        FROM session_enrollments 
        WHERE session_id = NEW.session_id 
        AND attendance_status != 'cancelled'
    )
    WHERE session_id = NEW.session_id;
END;

-- Update group member count
CREATE TRIGGER IF NOT EXISTS update_group_members_on_join
AFTER INSERT ON learning_group_members
WHEN NEW.is_active = TRUE
BEGIN
    UPDATE learning_groups 
    SET current_members = (
        SELECT COUNT(*) 
        FROM learning_group_members 
        WHERE group_id = NEW.group_id 
        AND is_active = TRUE
    )
    WHERE group_id = NEW.group_id;
END;

CREATE TRIGGER IF NOT EXISTS update_group_members_on_leave
AFTER UPDATE OF is_active ON learning_group_members
WHEN NEW.is_active = FALSE AND OLD.is_active = TRUE
BEGIN
    UPDATE learning_groups 
    SET current_members = (
        SELECT COUNT(*) 
        FROM learning_group_members 
        WHERE group_id = NEW.group_id 
        AND is_active = TRUE
    )
    WHERE group_id = NEW.group_id;
END;

-- Update event attendee count
CREATE TRIGGER IF NOT EXISTS update_event_attendees_on_register
AFTER INSERT ON event_registrations
WHEN NEW.attendance_status != 'cancelled'
BEGIN
    UPDATE community_events 
    SET current_attendees = (
        SELECT COUNT(*) 
        FROM event_registrations 
        WHERE event_id = NEW.event_id 
        AND attendance_status != 'cancelled'
    )
    WHERE event_id = NEW.event_id;
END;

-- Auto-update timestamps
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
AFTER UPDATE ON users_new
BEGIN
    UPDATE users_new 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE user_id = NEW.user_id;
END;

CREATE TRIGGER IF NOT EXISTS update_teacher_skills_timestamp
AFTER UPDATE ON teacher_skills
BEGIN
    UPDATE teacher_skills 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE teacher_skill_id = NEW.teacher_skill_id;
END;

CREATE TRIGGER IF NOT EXISTS update_sessions_timestamp
AFTER UPDATE ON sessions
BEGIN
    UPDATE sessions 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE session_id = NEW.session_id;
END;

-- Log system activity
CREATE TRIGGER IF NOT EXISTS log_user_creation
AFTER INSERT ON users_new
BEGIN
    INSERT INTO system_logs (user_id, action, table_affected, record_id)
    VALUES (NEW.user_id, 'CREATE_USER', 'users', NEW.user_id);
END;

CREATE TRIGGER IF NOT EXISTS log_session_creation
AFTER INSERT ON sessions
BEGIN
    INSERT INTO system_logs (user_id, action, table_affected, record_id)
    VALUES (NEW.teacher_id, 'CREATE_SESSION', 'sessions', NEW.session_id);
END;

-- ========================================
-- Migration Scripts (if updating existing data)
-- ========================================

-- Migrate existing user data to new structure
-- This assumes you have existing users, teachers, learners, sponsors tables

-- Insert user roles based on existing table structure
INSERT OR IGNORE INTO user_roles (user_id, role_type)
SELECT id, 'teacher' FROM teachers 
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='teachers');

INSERT OR IGNORE INTO user_roles (user_id, role_type)
SELECT id, 'learner' FROM learners 
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='learners');

INSERT OR IGNORE INTO user_roles (user_id, role_type)
SELECT id, 'sponsor' FROM sponsors 
WHERE EXISTS (SELECT 1 FROM sqlite_master WHERE type='table' AND name='sponsors');

-- Migrate teacher data if it exists with skills information
INSERT OR IGNORE INTO teacher_skills (user_id, skill_id, description, is_available)
SELECT t.id as user_id, 
       1 as skill_id, -- Default to first skill, adjust as needed
       t.skills as description,
       1 as is_available
FROM teachers t 
WHERE EXISTS (SELECT 1 FROM pragma_table_info('teachers') WHERE name = 'skills')
AND t.skills IS NOT NULL;

-- Create default preferences for all users
INSERT OR IGNORE INTO user_preferences (user_id)
SELECT user_id FROM users_new;

-- ========================================
-- Clean up old tables (uncomment if you want to remove them)
-- ========================================

-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS teachers; 
-- DROP TABLE IF EXISTS learners;
-- DROP TABLE IF EXISTS sponsors;

-- Rename new tables to replace old ones
-- ALTER TABLE users_new RENAME TO users;
-- ALTER TABLE sponsors_new RENAME TO sponsors;

-- ========================================
-- Final Verification Queries
-- ========================================

-- Check table creation
SELECT name, sql FROM sqlite_master 
WHERE type='table' AND name LIKE '%users%' OR name LIKE '%skill%' OR name LIKE '%session%'
ORDER BY name;

-- Verify indexes
SELECT name, sql FROM sqlite_master 
WHERE type='index' AND sql IS NOT NULL
ORDER BY name;

-- Check triggers
SELECT name, sql FROM sqlite_master 
WHERE type='trigger'
ORDER BY name;

-- Count records in key tables
SELECT 
    'users' as table_name, COUNT(*) as record_count FROM users_new
UNION ALL SELECT 
    'skill_categories', COUNT(*) FROM skill_categories
UNION ALL SELECT 
    'skills', COUNT(*) FROM skills
UNION ALL SELECT 
    'user_roles', COUNT(*) FROM user_roles
UNION ALL SELECT 
    'teacher_skills', COUNT(*) FROM teacher_skills
UNION ALL SELECT 
    'sessions', COUNT(*) FROM sessions
UNION ALL SELECT 
    'admin_users', COUNT(*) FROM admin_users;

-- ========================================
-- Sample Query Examples
-- ========================================

/*
-- Find all teachers with their skills and ratings
SELECT 
    ts.full_name,
    ts.email,
    ts.skills_count,
    ts.total_sessions,
    ts.average_rating,
    ts.total_reviews
FROM teacher_stats ts
WHERE ts.average_rating >= 4.0
ORDER BY ts.average_rating DESC, ts.total_reviews DESC;

-- Get upcoming sessions for a user
SELECT 
    s.title,
    s.session_date,
    s.duration_minutes,
    s.price,
    sk.skill_name,
    t.first_name || ' ' || t.last_name as teacher_name
FROM sessions s
JOIN skills sk ON s.skill_id = sk.skill_id
JOIN users_new t ON s.teacher_id = t.user_id
JOIN session_enrollments se ON s.session_id = se.session_id
WHERE se.student_id = ? -- Replace ? with actual user_id
AND s.session_date > datetime('now')
AND se.attendance_status != 'cancelled'
ORDER BY s.session_date;

-- Find teachers by skill and location
SELECT DISTINCT
    u.user_id,
    u.first_name || ' ' || u.last_name as full_name,
    u.city,
    u.country,
    ts.experience_years,
    ts.hourly_rate,
    ts.currency,
    AVG(r.rating) as average_rating,
    COUNT(r.review_id) as review_count
FROM users_new u
JOIN user_roles ur ON u.user_id = ur.user_id AND ur.role_type = 'teacher'
JOIN teacher_skills ts ON u.user_id = ts.user_id
JOIN skills s ON ts.skill_id = s.skill_id
LEFT JOIN reviews r ON u.user_id = r.reviewee_id
WHERE s.skill_name LIKE '%JavaScript%' -- Replace with desired skill
AND u.city LIKE '%New York%' -- Replace with desired city
AND ts.is_available = TRUE
AND u.is_active = TRUE
GROUP BY u.user_id, u.first_name, u.last_name, u.city, u.country, 
         ts.experience_years, ts.hourly_rate, ts.currency
HAVING COUNT(r.review_id) >= 5 -- At least 5 reviews
ORDER BY average_rating DESC, review_count DESC;
*/

-- ========================================
-- End of Script
-- ========================================

PRAGMA foreign_keys = ON;
VACUUM;
ANALYZE;