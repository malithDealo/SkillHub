-- SkillHub Database Schema for SQLite3
-- Complete database structure for the neighborhood skill-sharing platform

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- 1. Users table - Core user information
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    profile_picture VARCHAR(500),
    bio TEXT,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    phone_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 2. User roles table - Teacher, Student, or Both
CREATE TABLE user_roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role_type VARCHAR(20) NOT NULL CHECK (role_type IN ('teacher', 'student', 'both')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Skill categories table
CREATE TABLE skill_categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills table - All available skills
CREATE TABLE skills (
    skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES skill_categories(category_id),
    UNIQUE(category_id, skill_name)
);

-- 5. Teacher skills - Skills offered by teachers
CREATE TABLE teacher_skills (
    teacher_skill_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    experience_years INTEGER,
    hourly_rate DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    accepts_skill_exchange BOOLEAN DEFAULT 1,
    max_students_per_session INTEGER DEFAULT 5,
    session_duration_minutes INTEGER DEFAULT 60,
    description TEXT,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    UNIQUE(user_id, skill_id)
);

-- 6. Admin users table - Separate admin management
CREATE TABLE admin_users (
    admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    admin_level VARCHAR(20) DEFAULT 'moderator' CHECK (admin_level IN ('super_admin', 'admin', 'moderator')),
    permissions TEXT, -- JSON string of specific permissions
    is_active BOOLEAN DEFAULT 1,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER,
    FOREIGN KEY (created_by) REFERENCES admin_users(admin_id)
);

-- 7. Teacher verification table - Enhanced with certificate uploads
CREATE TABLE teacher_verifications (
    verification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    verification_type VARCHAR(50) NOT NULL, -- 'identity', 'qualification', 'background_check', 'certificate'
    document_url VARCHAR(500),
    certificate_name VARCHAR(200), -- Name/title of the certificate
    certificate_description TEXT, -- Description of the certificate
    issuing_organization VARCHAR(200), -- Who issued the certificate
    issue_date DATE, -- When certificate was issued
    expiry_date DATE, -- Certificate expiry
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    verified_by INTEGER, -- References admin_users.admin_id
    verification_date DATETIME,
    rejection_reason TEXT, -- Reason for rejection if status is 'rejected'
    admin_notes TEXT, -- Internal admin notes
    user_notes TEXT, -- Notes from the user submitting verification
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES admin_users(admin_id)
);

-- 8. Admin activity logs - Track all admin actions
CREATE TABLE admin_activity_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'user_verification', 'content_moderation', 'user_management', etc.
    target_type VARCHAR(50), -- 'user', 'session', 'event', 'review', etc.
    target_id INTEGER, -- ID of the affected record
    action_description TEXT NOT NULL,
    old_values TEXT, -- JSON of previous values
    new_values TEXT, -- JSON of new values
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
);

-- 9. Teacher levels - Reputation-based advancement system
CREATE TABLE teacher_levels (
    level_id INTEGER PRIMARY KEY AUTOINCREMENT,
    level_name VARCHAR(50) NOT NULL,
    min_rating DECIMAL(3, 2),
    min_reviews INTEGER,
    min_hours_taught INTEGER,
    benefits TEXT, -- JSON string of benefits
    badge_icon VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 8. User teacher levels - Current level of each teacher
CREATE TABLE user_teacher_levels (
    user_level_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level_id INTEGER NOT NULL,
    achieved_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES teacher_levels(level_id)
);

-- 9. Learning requests - Student requests for skills
CREATE TABLE learning_requests (
    request_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    budget_min DECIMAL(10, 2),
    budget_max DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    accepts_skill_exchange BOOLEAN DEFAULT 1,
    preferred_session_duration INTEGER DEFAULT 60,
    max_distance_km INTEGER DEFAULT 10,
    urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'matched', 'in_progress', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

-- 10. Learning groups - Student learning teams
CREATE TABLE learning_groups (
    group_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    skill_id INTEGER NOT NULL,
    creator_id INTEGER NOT NULL,
    max_members INTEGER DEFAULT 10,
    current_members INTEGER DEFAULT 1,
    meeting_schedule TEXT, -- JSON string for schedule
    is_active BOOLEAN DEFAULT 1,
    is_private BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (creator_id) REFERENCES users(user_id)
);

-- 11. Learning group members
CREATE TABLE learning_group_members (
    membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('creator', 'admin', 'member')),
    joined_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1,
    FOREIGN KEY (group_id) REFERENCES learning_groups(group_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

-- 12. Sessions/Classes table
CREATE TABLE sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    session_type VARCHAR(20) DEFAULT 'individual' CHECK (session_type IN ('individual', 'group')),
    max_students INTEGER DEFAULT 1,
    current_students INTEGER DEFAULT 0,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    duration_minutes INTEGER DEFAULT 60,
    session_date DATETIME NOT NULL,
    location_type VARCHAR(20) CHECK (location_type IN ('online', 'teacher_location', 'student_location', 'public_place')),
    location_address TEXT,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(user_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
);

-- 13. Session enrollments
CREATE TABLE session_enrollments (
    enrollment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    attendance_status VARCHAR(20) DEFAULT 'enrolled' CHECK (attendance_status IN ('enrolled', 'attended', 'absent', 'cancelled')),
    notes TEXT,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(session_id, student_id)
);

-- 14. Messages table - In-app communication
CREATE TABLE messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    conversation_id VARCHAR(100), -- For grouping messages
    subject VARCHAR(200),
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
    is_read BOOLEAN DEFAULT 0,
    is_flagged BOOLEAN DEFAULT 0,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (receiver_id) REFERENCES users(user_id)
);

-- 15. Reviews and ratings
CREATE TABLE reviews (
    review_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER,
    reviewer_id INTEGER NOT NULL,
    reviewee_id INTEGER NOT NULL,
    review_type VARCHAR(20) CHECK (review_type IN ('teacher_review', 'student_review')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_anonymous BOOLEAN DEFAULT 0,
    is_verified BOOLEAN DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES sessions(session_id),
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id),
    FOREIGN KEY (reviewee_id) REFERENCES users(user_id)
);

-- 16. Community events and workshops
CREATE TABLE community_events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) CHECK (event_type IN ('workshop', 'meetup', 'sponsored_event', 'community_gathering')),
    skill_id INTEGER,
    event_date DATETIME NOT NULL,
    end_date DATETIME,
    location_address TEXT,
    location_latitude DECIMAL(10, 8),
    location_longitude DECIMAL(11, 8),
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_fee DECIMAL(10, 2) DEFAULT 0,
    is_free BOOLEAN DEFAULT 1,
    is_sponsored BOOLEAN DEFAULT 0,
    sponsor_id INTEGER,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(user_id),
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id)
);

-- 17. Event registrations
CREATE TABLE event_registrations (
    registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    attendance_status VARCHAR(20) DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'absent', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    notes TEXT,
    FOREIGN KEY (event_id) REFERENCES community_events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(event_id, user_id)
);

-- 18. Sponsors table - Local businesses
CREATE TABLE sponsors (
    sponsor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    website VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    logo_url VARCHAR(500),
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 19. Sponsorships table
CREATE TABLE sponsorships (
    sponsorship_id INTEGER PRIMARY KEY AUTOINCREMENT,
    sponsor_id INTEGER NOT NULL,
    sponsored_type VARCHAR(20) CHECK (sponsored_type IN ('event', 'teacher', 'class', 'platform')),
    sponsored_id INTEGER, -- References event_id, user_id, or session_id
    amount DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    sponsorship_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    duration_days INTEGER,
    benefits_provided TEXT, -- JSON string
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    FOREIGN KEY (sponsor_id) REFERENCES sponsors(sponsor_id)
);

-- 20. Payments table
CREATE TABLE payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    payer_id INTEGER NOT NULL,
    payee_id INTEGER NOT NULL,
    payment_type VARCHAR(20) CHECK (payment_type IN ('session_payment', 'event_registration', 'tip', 'refund')),
    reference_id INTEGER, -- session_id, event_id, etc.
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'paypal', 'bank_transfer', 'skill_exchange')),
    transaction_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (payer_id) REFERENCES users(user_id),
    FOREIGN KEY (payee_id) REFERENCES users(user_id)
);

-- 21. Skill exchanges - Non-monetary transactions
CREATE TABLE skill_exchanges (
    exchange_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    user1_skill_id INTEGER NOT NULL,
    user2_skill_id INTEGER NOT NULL,
    user1_hours INTEGER NOT NULL,
    user2_hours INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'proposed' CHECK (status IN ('proposed', 'accepted', 'in_progress', 'completed', 'cancelled')),
    proposed_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    accepted_date DATETIME,
    completed_date DATETIME,
    notes TEXT,
    FOREIGN KEY (user1_id) REFERENCES users(user_id),
    FOREIGN KEY (user2_id) REFERENCES users(user_id),
    FOREIGN KEY (user1_skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (user2_skill_id) REFERENCES skills(skill_id)
);

-- 22. User preferences table
CREATE TABLE user_preferences (
    preference_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    notification_email BOOLEAN DEFAULT 1,
    notification_sms BOOLEAN DEFAULT 0,
    notification_push BOOLEAN DEFAULT 1,
    privacy_show_profile BOOLEAN DEFAULT 1,
    privacy_show_location BOOLEAN DEFAULT 1,
    max_travel_distance INTEGER DEFAULT 10, -- in kilometers
    preferred_session_times TEXT, -- JSON array of preferred times
    accessibility_needs TEXT, -- JSON array of accessibility requirements
    language_preferences TEXT, -- JSON array of language codes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE(user_id)
);

-- 23. Notifications table
CREATE TABLE notifications (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) CHECK (notification_type IN ('session_reminder', 'new_message', 'review_received', 'payment_received', 'event_invitation', 'skill_match', 'system_update')),
    reference_id INTEGER, -- References related record
    is_read BOOLEAN DEFAULT 0,
    sent_via VARCHAR(20) CHECK (sent_via IN ('app', 'email', 'sms', 'push')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 24. System logs for security and monitoring
CREATE TABLE system_logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL,
    table_affected VARCHAR(50),
    record_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 26. Content moderation table - Enhanced for admin management
CREATE TABLE content_moderation (
    moderation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_type VARCHAR(20) CHECK (content_type IN ('message', 'review', 'profile', 'event', 'session', 'user_bio')),
    content_id INTEGER NOT NULL,
    reported_by INTEGER,
    report_reason VARCHAR(100),
    auto_flagged BOOLEAN DEFAULT 0, -- If automatically flagged by system
    flagged_keywords TEXT, -- Keywords that triggered auto-flag
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'requires_review', 'escalated')),
    moderator_id INTEGER, -- References admin_users.admin_id
    moderation_date DATETIME,
    moderator_notes TEXT,
    action_taken VARCHAR(50), -- 'approved', 'content_removed', 'user_warned', 'user_suspended', etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reported_by) REFERENCES users(user_id),
    FOREIGN KEY (moderator_id) REFERENCES admin_users(admin_id)
);

-- 27. Admin dashboard stats - Cached statistics for admin dashboard
CREATE TABLE admin_dashboard_stats (
    stat_id INTEGER PRIMARY KEY AUTOINCREMENT,
    stat_date DATE NOT NULL,
    total_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,
    new_users_today INTEGER DEFAULT 0,
    total_teachers INTEGER DEFAULT 0,
    verified_teachers INTEGER DEFAULT 0,
    pending_verifications INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    completed_sessions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12, 2) DEFAULT 0,
    pending_moderations INTEGER DEFAULT 0,
    reported_content INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(stat_date)
);

-- 28. User suspensions - Admin user management
CREATE TABLE user_suspensions (
    suspension_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    suspension_type VARCHAR(20) CHECK (suspension_type IN ('warning', 'temporary', 'permanent')),
    reason TEXT NOT NULL,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME, -- NULL for permanent suspensions
    is_active BOOLEAN DEFAULT 1,
    admin_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admin_users(admin_id)
);

-- 29. System settings - Admin configurable settings
CREATE TABLE system_settings (
    setting_id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) CHECK (setting_type IN ('string', 'integer', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT 0, -- Whether setting is visible to regular users
    updated_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES admin_users(admin_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_users_neighborhood ON users(neighborhood);
CREATE INDEX idx_teacher_skills_user ON teacher_skills(user_id);
CREATE INDEX idx_teacher_skills_skill ON teacher_skills(skill_id);
CREATE INDEX idx_teacher_verifications_status ON teacher_verifications(status);
CREATE INDEX idx_teacher_verifications_user ON teacher_verifications(user_id);
CREATE INDEX idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_events_date ON community_events(event_date);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_admin_activity_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX idx_content_moderation_status ON content_moderation(status);
CREATE INDEX idx_user_suspensions_user ON user_suspensions(user_id, is_active);

-- Insert initial data
INSERT INTO skill_categories (category_name, description) VALUES 
('Cooking', 'Culinary skills and food preparation'),
('Music', 'Musical instruments and performance'),
('Technology', 'Computer skills and programming'),
('Arts & Crafts', 'Creative and artistic skills'),
('Sports & Fitness', 'Physical activities and wellness'),
('Languages', 'Foreign language learning'),
('Home & Garden', 'Household and gardening skills'),
('Business', 'Professional and entrepreneurial skills'),
('Health & Wellness', 'Medical and wellness practices'),
('Academic', 'Educational and tutoring subjects');

INSERT INTO teacher_levels (level_name, min_rating, min_reviews, min_hours_taught, benefits) VALUES
('Bronze', 0.0, 0, 0, '{"badge": "bronze", "visibility": "standard"}'),
('Silver', 4.0, 5, 10, '{"badge": "silver", "visibility": "enhanced", "featured": false}'),
('Gold', 4.5, 20, 50, '{"badge": "gold", "visibility": "premium", "featured": true, "commission_reduction": 5}'),
('Platinum', 4.8, 50, 150, '{"badge": "platinum", "visibility": "premium", "featured": true, "commission_reduction": 10, "priority_support": true}'),
('Diamond', 4.9, 100, 300, '{"badge": "diamond", "visibility": "premium", "featured": true, "commission_reduction": 15, "priority_support": true, "exclusive_events": true}');

-- Insert default admin user (change password immediately)
INSERT INTO admin_users (username, email, password_hash, first_name, last_name, admin_level, permissions) VALUES
('superadmin', 'admin@skillhub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/lewF5K0WjpEXdcee2', 'Super', 'Admin', 'super_admin', '{"all": true}');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('max_upload_size_mb', '10', 'integer', 'Maximum file upload size in MB', 0),
('auto_verify_email', 'false', 'boolean', 'Automatically verify email addresses', 0),
('require_phone_verification', 'true', 'boolean', 'Require phone verification for teachers', 1),
('max_session_duration', '240', 'integer', 'Maximum session duration in minutes', 1),
('platform_commission_rate', '10', 'integer', 'Platform commission rate percentage', 0),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', 1),
('min_teacher_age', '18', 'integer', 'Minimum age to become a teacher', 1);

-- Create views for common queries
CREATE VIEW teacher_stats AS
SELECT 
    u.user_id,
    u.first_name || ' ' || u.last_name AS full_name,
    COUNT(DISTINCT ts.skill_id) as skills_offered,
    AVG(r.rating) as avg_rating,
    COUNT(r.review_id) as total_reviews,
    COUNT(DISTINCT s.session_id) as total_sessions,
    tl.level_name as current_level,
    CASE WHEN tv.verification_id IS NOT NULL THEN 1 ELSE 0 END as is_verified
FROM users u
JOIN teacher_skills ts ON u.user_id = ts.user_id
LEFT JOIN reviews r ON u.user_id = r.reviewee_id AND r.review_type = 'teacher_review'
LEFT JOIN sessions s ON u.user_id = s.teacher_id
LEFT JOIN user_teacher_levels utl ON u.user_id = utl.user_id AND utl.is_current = 1
LEFT JOIN teacher_levels tl ON utl.level_id = tl.level_id
LEFT JOIN teacher_verifications tv ON u.user_id = tv.user_id AND tv.status = 'approved'
WHERE ts.is_available = 1
GROUP BY u.user_id;

-- Admin dashboard view for quick stats
CREATE VIEW admin_dashboard_overview AS
SELECT 
    (SELECT COUNT(*) FROM users WHERE is_active = 1) as total_active_users,
    (SELECT COUNT(*) FROM users WHERE is_active = 1 AND user_id IN (SELECT user_id FROM teacher_skills WHERE is_available = 1)) as total_teachers,
    (SELECT COUNT(*) FROM teacher_verifications WHERE status = 'pending') as pending_verifications,
    (SELECT COUNT(*) FROM content_moderation WHERE status = 'pending') as pending_moderations,
    (SELECT COUNT(*) FROM sessions WHERE status = 'scheduled' AND session_date > datetime('now')) as upcoming_sessions,
    (SELECT COUNT(*) FROM users WHERE date(created_at) = date('now')) as new_users_today,
    (SELECT COUNT(*) FROM user_suspensions WHERE is_active = 1) as active_suspensions,
    (SELECT SUM(amount) FROM payments WHERE status = 'completed' AND date(payment_date) = date('now')) as revenue_today;

-- Verification queue view for admins
CREATE VIEW verification_queue AS
SELECT 
    tv.verification_id,
    u.first_name || ' ' || u.last_name AS teacher_name,
    u.email,
    tv.verification_type,
    tv.certificate_name,
    tv.issuing_organization,
    tv.document_url,
    tv.status,
    tv.created_at,
    tv.user_notes,
    CASE 
        WHEN tv.verification_type = 'certificate' THEN 'Certificate Verification'
        WHEN tv.verification_type = 'identity' THEN 'Identity Verification'
        WHEN tv.verification_type = 'qualification' THEN 'Qualification Verification'
        ELSE 'Background Check'
    END as verification_display_name
FROM teacher_verifications tv
JOIN users u ON tv.user_id = u.user_id
WHERE tv.status IN ('pending', 'under_review')
ORDER BY tv.created_at ASC;