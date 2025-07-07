// auth-api.js - Fixed Backend API for SkillHub Authentication with Proper DB Init
// Run with: npm start or nodemon server/auth-api.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Database setup
const dbDir = path.join(__dirname, '../database');
const dbPath = path.join(dbDir, 'skillhub.db');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('📁 Created database directory');
}

console.log('🗃️  Database path:', dbPath);
console.log('🚀 SkillHub API server starting...');

// Database connection with proper initialization
let db;

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                reject(err);
            } else {
                console.log('✅ Connected to SQLite database');
                
                // Create tables with proper schema
                createTablesSequentially()
                    .then(() => testDatabase())
                    .then(resolve)
                    .catch(reject);
            }
        });
    });
}

async function createTablesSequentially() {
    return new Promise((resolve, reject) => {
        // Enable foreign keys
        db.run('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.warn('⚠️  Could not enable foreign keys:', err.message);
            }
        });

        // Define the complete schema
        const createStatements = [
            // Drop tables if they exist (in reverse order due to foreign keys)
            'DROP TABLE IF EXISTS login_attempts;',
            'DROP TABLE IF EXISTS user_sessions;', 
            'DROP TABLE IF EXISTS sponsors;',
            'DROP TABLE IF EXISTS learners;',
            'DROP TABLE IF EXISTS teachers;',
            'DROP TABLE IF EXISTS users;',
            
            // Create users table
            `CREATE TABLE users (
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
            );`,
            
            // Create teachers table
            `CREATE TABLE teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                skills TEXT,
                about TEXT,
                experience_years INTEGER DEFAULT 0,
                teaching_language TEXT CHECK (teaching_language IN ('english', 'sinhala', 'tamil')),
                certificates TEXT,
                background_check_status TEXT DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );`,
            
            // Create learners table
            `CREATE TABLE learners (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                interests TEXT,
                age_group TEXT CHECK (age_group IN ('12-15', '16-20', '21-25', '26-30', '30+')),
                preferred_language TEXT DEFAULT 'english' CHECK (preferred_language IN ('english', 'sinhala', 'tamil')),
                learning_goals TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );`,
            
            // Create sponsors table
            `CREATE TABLE sponsors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                company_name TEXT NOT NULL,
                address TEXT NOT NULL,
                sponsorship_interests TEXT,
                about TEXT,
                budget INTEGER,
                organization_verification_status TEXT DEFAULT 'pending' CHECK (organization_verification_status IN ('pending', 'approved', 'rejected')),
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );`,
            
            // Create user_sessions table
            `CREATE TABLE user_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_token TEXT UNIQUE NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );`,
            
            // Create login_attempts table
            `CREATE TABLE login_attempts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                ip_address TEXT,
                success BOOLEAN NOT NULL,
                attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );`,
            
            // Create indexes
            'CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);',
            'CREATE INDEX IF NOT EXISTS idx_users_type ON users (user_type);',
            'CREATE INDEX IF NOT EXISTS idx_users_verified ON users (is_verified);',
            'CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions (session_token);',
            'CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions (user_id);',
            'CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts (email);'
        ];

        // Execute statements sequentially
        let currentIndex = 0;
        
        function executeNext() {
            if (currentIndex >= createStatements.length) {
                console.log('✅ Database schema created successfully');
                resolve();
                return;
            }

            const statement = createStatements[currentIndex];
            currentIndex++;

            db.run(statement, (err) => {
                if (err) {
                    console.error(`❌ Error executing statement ${currentIndex}:`, err.message);
                    console.error('Statement:', statement);
                    reject(err);
                } else {
                    // Continue with next statement
                    executeNext();
                }
            });
        }

        executeNext();
    });
}

async function testDatabase() {
    return new Promise((resolve, reject) => {
        db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
            if (err) {
                console.error('❌ Database test failed:', err.message);
                reject(err);
            } else {
                console.log('✅ Database test passed. Users count:', row.count);
                
                // If no users exist, create sample data
                if (row.count === 0) {
                    createSampleData().then(resolve).catch(reject);
                } else {
                    // Show existing users
                    db.all("SELECT email, user_type, first_name, last_name FROM users", (err, rows) => {
                        if (!err && rows.length > 0) {
                            console.log('👥 Sample users in database:');
                            rows.forEach(user => {
                                console.log(`   - ${user.email} (${user.user_type}): ${user.first_name} ${user.last_name}`);
                            });
                        }
                        resolve();
                    });
                }
            }
        });
    });
}

async function createSampleData() {
    try {
        const samplePassword = await hashPassword('password');
        
        const sampleUsers = [
            {
                email: 'teacher@example.com',
                password_hash: samplePassword,
                user_type: 'teacher',
                first_name: 'John',
                last_name: 'Teacher',
                phone: '+94712345678',
                location: 'Colombo, Western',
                is_verified: 1
            },
            {
                email: 'learner@example.com',
                password_hash: samplePassword,
                user_type: 'learner',
                first_name: 'Jane',
                last_name: 'Student',
                phone: '+94712345679',
                location: 'Kandy, Central',
                is_verified: 1
            },
            {
                email: 'sponsor@example.com',
                password_hash: samplePassword,
                user_type: 'sponsor',
                first_name: 'Mike',
                last_name: 'Company',
                phone: '+94712345680',
                location: 'Galle, Southern',
                is_verified: 1
            }
        ];

        // Insert users sequentially
        for (let i = 0; i < sampleUsers.length; i++) {
            const user = sampleUsers[i];
            
            const userId = await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, location, is_verified)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [user.email, user.password_hash, user.user_type, user.first_name, user.last_name, user.phone, user.location, user.is_verified],
                    function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(this.lastID);
                        }
                    }
                );
            });

            // Insert user-type specific data
            if (user.user_type === 'teacher') {
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO teachers (user_id, skills, about, experience_years, teaching_language)
                         VALUES (?, ?, ?, ?, ?)`,
                        [userId, '["Mathematics", "Physics", "Programming"]', 'Experienced teacher with 5 years of teaching experience in STEM subjects.', 5, 'english'],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            } else if (user.user_type === 'learner') {
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO learners (user_id, interests, age_group, preferred_language)
                         VALUES (?, ?, ?, ?)`,
                        [userId, '["Programming", "Web Development", "Art"]', '21-25', 'english'],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            } else if (user.user_type === 'sponsor') {
                await new Promise((resolve, reject) => {
                    db.run(
                        `INSERT INTO sponsors (user_id, company_name, address, sponsorship_interests, about, budget)
                         VALUES (?, ?, ?, ?, ?, ?)`,
                        [userId, 'Tech Solutions Ltd', '123 Business Street, Colombo', '["Technology", "Education", "Innovation"]', 'We support technology education initiatives.', 100000],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
            }
        }
        
        console.log('✅ Sample users created successfully');
    } catch (error) {
        console.error('❌ Error creating sample data:', error);
        throw error;
    }
}

// Helper functions
async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

async function verifyPassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Error verifying password:', error);
        throw error;
    }
}

function generateToken(user) {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email, 
            userType: user.user_type 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

// API Routes

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'SkillHub API is working!',
        timestamp: new Date().toISOString(),
        database: db ? 'Connected' : 'Disconnected'
    });
});

// User Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
    console.log('📝 Registration request received:', req.body.email, req.body.userType);
    
    const { 
        email, 
        password, 
        userType, 
        firstName, 
        lastName, 
        phone, 
        location,
        // Teacher specific
        skills,
        about,
        experienceYears,
        teachingLanguage,
        // Learner specific
        interests,
        ageGroup,
        preferredLanguage,
        // Sponsor specific
        companyName,
        address,
        sponsorshipInterests,
        budget
    } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !userType || !firstName || !lastName) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: email, password, userType, firstName, lastName' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id FROM users WHERE email = ?',
                [email],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Insert user into users table
        const userId = await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, location)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [email, passwordHash, userType, firstName, lastName, phone || null, location || null],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });

        // Insert user-type specific data
        if (userType === 'teacher') {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO teachers (user_id, skills, about, experience_years, teaching_language)
                     VALUES (?, ?, ?, ?, ?)`,
                    [userId, JSON.stringify(skills || []), about || '', experienceYears || 0, teachingLanguage || 'english'],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        } else if (userType === 'learner') {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO learners (user_id, interests, age_group, preferred_language)
                     VALUES (?, ?, ?, ?)`,
                    [userId, JSON.stringify(interests || []), ageGroup || null, preferredLanguage || 'english'],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        } else if (userType === 'sponsor') {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO sponsors (user_id, company_name, address, sponsorship_interests, about, budget)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [userId, companyName || '', address || '', JSON.stringify(sponsorshipInterests || []), about || '', budget || null],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        console.log('✅ User registered successfully:', email);

        res.json({ 
            success: true, 
            message: 'User registered successfully',
            userId: userId
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error: ' + error.message 
        });
    }
});

// User Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password, userType } = req.body;

    console.log('🔐 Login attempt:', { email, userType });

    try {
        // Validate required fields
        if (!email || !password || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email, password, and user type are required' 
            });
        }

        // Get user from database
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE email = ? AND user_type = ?',
                [email, userType],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user) {
            console.log('❌ User not found:', email, userType);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email, password, or user type' 
            });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email, password, or user type' 
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated' 
            });
        }

        console.log('✅ Login successful for:', email);

        // Generate JWT token
        const token = generateToken(user);

        // Get user-specific data
        let userData = {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            name: `${user.first_name} ${user.last_name}`,
            phone: user.phone,
            location: user.location,
            type: user.user_type,
            isVerified: user.is_verified,
            profileImage: user.profile_image
        };

        // Fetch additional data based on user type
        try {
            if (userType === 'teacher') {
                const teacherData = await new Promise((resolve, reject) => {
                    db.get(
                        'SELECT * FROM teachers WHERE user_id = ?',
                        [user.id],
                        (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        }
                    );
                });
                
                if (teacherData) {
                    userData.skills = JSON.parse(teacherData.skills || '[]');
                    userData.about = teacherData.about;
                    userData.experienceYears = teacherData.experience_years;
                    userData.teachingLanguage = teacherData.teaching_language;
                    userData.backgroundCheckStatus = teacherData.background_check_status;
                }
            } else if (userType === 'learner') {
                const learnerData = await new Promise((resolve, reject) => {
                    db.get(
                        'SELECT * FROM learners WHERE user_id = ?',
                        [user.id],
                        (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        }
                    );
                });
                
                if (learnerData) {
                    userData.interests = JSON.parse(learnerData.interests || '[]');
                    userData.ageGroup = learnerData.age_group;
                    userData.preferredLanguage = learnerData.preferred_language;
                }
            } else if (userType === 'sponsor') {
                const sponsorData = await new Promise((resolve, reject) => {
                    db.get(
                        'SELECT * FROM sponsors WHERE user_id = ?',
                        [user.id],
                        (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        }
                    );
                });
                
                if (sponsorData) {
                    userData.companyName = sponsorData.company_name;
                    userData.address = sponsorData.address;
                    userData.sponsorshipInterests = JSON.parse(sponsorData.sponsorship_interests || '[]');
                    userData.about = sponsorData.about;
                    userData.budget = sponsorData.budget;
                    userData.organizationVerificationStatus = sponsorData.organization_verification_status;
                }
            }
        } catch (profileError) {
            console.warn('⚠️  Error loading profile data:', profileError.message);
        }

        res.json({ 
            success: true, 
            message: 'Login successful',
            token: token,
            user: userData
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error: ' + error.message 
        });
    }
});

// Get user profile
app.get('/api/auth/profile', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        db.get(
            'SELECT * FROM users WHERE id = ?',
            [decoded.id],
            (err, user) => {
                if (err || !user) {
                    return res.status(401).json({ 
                        success: false, 
                        message: 'Invalid token' 
                    });
                }

                const userData = {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    name: `${user.first_name} ${user.last_name}`,
                    phone: user.phone,
                    location: user.location,
                    type: user.user_type,
                    isVerified: user.is_verified,
                    profileImage: user.profile_image
                };

                res.json({ 
                    success: true, 
                    user: userData 
                });
            }
        );
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
});

// Catch-all route for serving HTML files
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, '../public', req.path);
    
    // Check if the requested file exists
    if (fs.existsSync(filePath) && path.extname(filePath)) {
        res.sendFile(filePath);
    } else {
        // If it's an HTML request and file doesn't exist, serve index.html
        if (req.path.endsWith('.html') || req.headers.accept?.includes('text/html')) {
            const htmlFile = path.join(__dirname, '../public', req.path.endsWith('.html') ? req.path : req.path + '.html');
            if (fs.existsSync(htmlFile)) {
                res.sendFile(htmlFile);
            } else {
                res.status(404).send('File not found');
            }
        } else {
            res.status(404).json({ error: 'Not found' });
        }
    }
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🌐 Server running on http://localhost:${PORT}`);
            console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
            console.log(`📁 Static files served from: ${path.join(__dirname, '../public')}`);
            console.log('📋 Available endpoints:');
            console.log('   - GET  /api/test');
            console.log('   - POST /api/auth/login');
            console.log('   - POST /api/auth/register');
            console.log('   - GET  /api/auth/profile');
            console.log('   - POST /api/auth/logout');
            console.log('🔑 Test credentials (password: "password"):');
            console.log('   - learner@example.com (learner)');
            console.log('   - teacher@example.com (teacher)');
            console.log('   - sponsor@example.com (sponsor)');
            console.log('✅ Server ready for connections!');
        });
    })
    .catch((error) => {
        console.error('❌ Failed to initialize database:', error);
        process.exit(1);
    });

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    if (db) {
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err.message);
            } else {
                console.log('✅ Database connection closed.');
            }
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

module.exports = app;