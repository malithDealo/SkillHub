// auth-api.js - Complete Enhanced Backend API for SkillHub Authentication
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
    origin: [
        'http://localhost:3000', 
        'http://127.0.0.1:3000', 
        'http://localhost:3002',    
        'http://127.0.0.1:3002'     
    ],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced static file serving configuration
const publicPath = path.join(__dirname, '../public');
console.log(`📁 Public directory path: ${publicPath}`);
console.log(`📁 Public directory exists: ${fs.existsSync(publicPath)}`);

// Primary static file serving
app.use(express.static(publicPath));

// Add explicit static file serving with proper headers
app.use('/css', express.static(path.join(publicPath, 'css'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
            console.log(`📄 Serving CSS: ${filePath}`);
        }
    }
}));

app.use('/js', express.static(path.join(publicPath, 'js'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
            console.log(`📄 Serving JS: ${filePath}`);
        }
    }
}));

app.use('/images', express.static(path.join(publicPath, 'images')));
app.use('/components', express.static(path.join(publicPath, 'components')));

// Enhanced logging middleware for debugging
app.use((req, res, next) => {
    // Log all requests for static files
    if (req.path.includes('.css') || req.path.includes('.js') || req.path.includes('.png') || 
        req.path.includes('.jpg') || req.path.includes('.ico') || req.path.includes('.html')) {
        console.log(`📁 Static file requested: ${req.method} ${req.path}`);
        console.log(`📂 Full path would be: ${path.join(publicPath, req.path)}`);
        console.log(`🔍 File exists: ${fs.existsSync(path.join(publicPath, req.path))}`);
        console.log(`🌐 User-Agent: ${req.headers['user-agent']?.substring(0, 50)}...`);
    }
    next();
});

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

// Debug function for file structure
function debugFileStructure() {
    console.log('\n🔍 Debugging File Structure:');
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    
    const publicPath = path.join(__dirname, '../public');
    console.log('Public directory path:', publicPath);
    console.log('Public directory exists:', fs.existsSync(publicPath));
    
    if (fs.existsSync(publicPath)) {
        console.log('\n📁 Contents of public directory:');
        try {
            const files = fs.readdirSync(publicPath, { withFileTypes: true });
            files.forEach(file => {
                const icon = file.isDirectory() ? '📂' : '📄';
                console.log(`   ${icon} ${file.name}`);
                
                if (file.isDirectory() && (file.name === 'css' || file.name === 'js')) {
                    const subPath = path.join(publicPath, file.name);
                    if (fs.existsSync(subPath)) {
                        const subFiles = fs.readdirSync(subPath);
                        subFiles.forEach(subFile => {
                            console.log(`      📄 ${subFile}`);
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Error reading public directory:', error);
        }
    }
    
    // Check specific paths
    const cssPath = path.join(__dirname, '../public/css');
    const jsPath = path.join(__dirname, '../public/js');
    
    console.log('\n🎨 CSS directory:');
    console.log('Path:', cssPath);
    console.log('Exists:', fs.existsSync(cssPath));
    
    console.log('\n⚡ JS directory:');
    console.log('Path:', jsPath);
    console.log('Exists:', fs.existsSync(jsPath));
    
    console.log('\n' + '='.repeat(50));
}

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

// Record login attempt
async function recordLoginAttempt(email, ipAddress, success) {
    return new Promise((resolve) => {
        db.run(
            'INSERT INTO login_attempts (email, ip_address, success) VALUES (?, ?, ?)',
            [email, ipAddress, success],
            (err) => {
                if (err) {
                    console.error('Error recording login attempt:', err);
                }
                resolve();
            }
        );
    });
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

// Email uniqueness check endpoint
app.post('/api/auth/check-email', async (req, res) => {
    const { email, userType } = req.body;
    
    console.log('📧 Checking email exists:', email, userType);

    try {
        if (!email || !userType) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and user type are required' 
            });
        }

        // Check if user exists with this email and different user type
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT email, user_type FROM users WHERE email = ?',
                [email],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (existingUser) {
            // Email exists
            if (existingUser.user_type === userType) {
                // Same user type - can login
                return res.json({ 
                    success: true, 
                    exists: true, 
                    canLogin: true,
                    message: 'User exists with this role' 
                });
            } else {
                // Different user type - cannot register
                return res.json({ 
                    success: true, 
                    exists: true, 
                    canLogin: false,
                    existingUserType: existingUser.user_type,
                    message: `Email already registered as ${existingUser.user_type}` 
                });
            }
        } else {
            // Email doesn't exist - can register
            return res.json({ 
                success: true, 
                exists: false, 
                canRegister: true,
                message: 'Email available for registration' 
            });
        }

    } catch (error) {
        console.error('❌ Email check error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error: ' + error.message 
        });
    }
});

// Social authentication endpoint
app.post('/api/auth/social-login', async (req, res) => {
    const { email, userType, provider, userData } = req.body;

    console.log('🔗 Social login attempt:', { email, userType, provider });

    try {
        if (!email || !userType || !provider || !userData) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required social auth data' 
            });
        }

        // Check if user exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE email = ? AND user_type = ?',
                [email, userType],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (existingUser) {
            // User exists - update profile image if provided
            if (userData.profileImage && userData.profileImage !== existingUser.profile_image) {
                await new Promise((resolve, reject) => {
                    db.run(
                        'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                        [userData.profileImage, existingUser.id],
                        (err) => {
                            if (err) reject(err);
                            else resolve();
                        }
                    );
                });
                existingUser.profile_image = userData.profileImage;
            }

            // Generate token and return user data
            const token = generateToken(existingUser);

            let formattedUser = {
                id: existingUser.id,
                email: existingUser.email,
                firstName: existingUser.first_name,
                lastName: existingUser.last_name,
                name: `${existingUser.first_name} ${existingUser.last_name}`,
                phone: existingUser.phone,
                location: existingUser.location,
                type: existingUser.user_type,
                isVerified: existingUser.is_verified,
                profileImage: existingUser.profile_image
            };

            // Get user-type specific data
            try {
                if (userType === 'teacher') {
                    const teacherData = await new Promise((resolve, reject) => {
                        db.get(
                            'SELECT * FROM teachers WHERE user_id = ?',
                            [existingUser.id],
                            (err, row) => {
                                if (err) reject(err);
                                else resolve(row);
                            }
                        );
                    });
                    
                    if (teacherData) {
                        formattedUser.skills = JSON.parse(teacherData.skills || '[]');
                        formattedUser.about = teacherData.about;
                        formattedUser.experienceYears = teacherData.experience_years;
                        formattedUser.teachingLanguage = teacherData.teaching_language;
                        formattedUser.backgroundCheckStatus = teacherData.background_check_status;
                    }
                } else if (userType === 'learner') {
                    const learnerData = await new Promise((resolve, reject) => {
                        db.get(
                            'SELECT * FROM learners WHERE user_id = ?',
                            [existingUser.id],
                            (err, row) => {
                                if (err) reject(err);
                                else resolve(row);
                            }
                        );
                    });
                    
                    if (learnerData) {
                        formattedUser.interests = JSON.parse(learnerData.interests || '[]');
                        formattedUser.ageGroup = learnerData.age_group;
                        formattedUser.preferredLanguage = learnerData.preferred_language;
                    }
                } else if (userType === 'sponsor') {
                    const sponsorData = await new Promise((resolve, reject) => {
                        db.get(
                            'SELECT * FROM sponsors WHERE user_id = ?',
                            [existingUser.id],
                            (err, row) => {
                                if (err) reject(err);
                                else resolve(row);
                            }
                        );
                    });
                    
                    if (sponsorData) {
                        formattedUser.companyName = sponsorData.company_name;
                        formattedUser.address = sponsorData.address;
                        formattedUser.sponsorshipInterests = JSON.parse(sponsorData.sponsorship_interests || '[]');
                        formattedUser.about = sponsorData.about;
                        formattedUser.budget = sponsorData.budget;
                        formattedUser.organizationVerificationStatus = sponsorData.organization_verification_status;
                    }
                }
            } catch (profileError) {
                console.warn('⚠️  Error loading social auth profile data:', profileError.message);
            }

            console.log('✅ Social login successful for existing user:', email);

            return res.json({ 
                success: true, 
                message: 'Social login successful',
                token: token,
                user: formattedUser
            });

        } else {
            // Check if email exists with different user type
            const emailExists = await new Promise((resolve, reject) => {
                db.get(
                    'SELECT user_type FROM users WHERE email = ?',
                    [email],
                    (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    }
                );
            });

            if (emailExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Email already registered as ${emailExists.user_type}. Please use the ${emailExists.user_type} login.`,
                    existingUserType: emailExists.user_type
                });
            }

            // User doesn't exist - needs to complete registration
            return res.json({ 
                success: false, 
                needsRegistration: true,
                message: 'Please complete your registration',
                userData: userData
            });
        }

    } catch (error) {
        console.error('❌ Social login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error: ' + error.message 
        });
    }
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
    const ipAddress = req.ip || req.connection.remoteAddress;

    console.log('🔐 Login attempt:', { email, userType, ip: ipAddress });

    try {
        // Validate required fields
        if (!email || !password || !userType) {
            await recordLoginAttempt(email, ipAddress, false);
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
            await recordLoginAttempt(email, ipAddress, false);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email, password, or user type' 
            });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            console.log('❌ Invalid password for:', email);
            await recordLoginAttempt(email, ipAddress, false);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email, password, or user type' 
            });
        }

        // Check if user is active
        if (!user.is_active) {
            await recordLoginAttempt(email, ipAddress, false);
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated' 
            });
        }

        console.log('✅ Login successful for:', email);
        await recordLoginAttempt(email, ipAddress, true);

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
        await recordLoginAttempt(email, ipAddress, false);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error: ' + error.message 
        });
    }
});

// Profile update endpoint
app.put('/api/auth/profile', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { firstName, lastName, phone, location, profileImage, ...otherData } = req.body;

        console.log('📝 Profile update request for user:', decoded.id);

        // Update basic user info
        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET 
                    first_name = COALESCE(?, first_name),
                    last_name = COALESCE(?, last_name),
                    phone = COALESCE(?, phone),
                    location = COALESCE(?, location),
                    profile_image = COALESCE(?, profile_image),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [firstName, lastName, phone, location, profileImage, decoded.id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        // Update user-type specific data
        if (decoded.userType === 'teacher' && Object.keys(otherData).length > 0) {
            const { skills, about, experienceYears, teachingLanguage } = otherData;
            await new Promise((resolve, reject) => {
                db.run(
                    `UPDATE teachers SET 
                        skills = COALESCE(?, skills),
                        about = COALESCE(?, about),
                        experience_years = COALESCE(?, experience_years),
                        teaching_language = COALESCE(?, teaching_language)
                    WHERE user_id = ?`,
                    [
                        skills ? JSON.stringify(skills) : null,
                        about,
                        experienceYears,
                        teachingLanguage,
                        decoded.id
                    ],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        } else if (decoded.userType === 'learner' && Object.keys(otherData).length > 0) {
            const { interests, ageGroup, preferredLanguage, learningGoals } = otherData;
            await new Promise((resolve, reject) => {
                db.run(
                    `UPDATE learners SET 
                        interests = COALESCE(?, interests),
                        age_group = COALESCE(?, age_group),
                        preferred_language = COALESCE(?, preferred_language),
                        learning_goals = COALESCE(?, learning_goals)
                    WHERE user_id = ?`,
                    [
                        interests ? JSON.stringify(interests) : null,
                        ageGroup,
                        preferredLanguage,
                        learningGoals,
                        decoded.id
                    ],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        } else if (decoded.userType === 'sponsor' && Object.keys(otherData).length > 0) {
            const { companyName, address, sponsorshipInterests, about, budget } = otherData;
            await new Promise((resolve, reject) => {
                db.run(
                    `UPDATE sponsors SET 
                        company_name = COALESCE(?, company_name),
                        address = COALESCE(?, address),
                        sponsorship_interests = COALESCE(?, sponsorship_interests),
                        about = COALESCE(?, about),
                        budget = COALESCE(?, budget)
                    WHERE user_id = ?`,
                    [
                        companyName,
                        address,
                        sponsorshipInterests ? JSON.stringify(sponsorshipInterests) : null,
                        about,
                        budget,
                        decoded.id
                    ],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        // Get updated user data
        const updatedUser = await new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM users WHERE id = ?',
                [decoded.id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        const userData = {
            id: updatedUser.id,
            email: updatedUser.email,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            name: `${updatedUser.first_name} ${updatedUser.last_name}`,
            phone: updatedUser.phone,
            location: updatedUser.location,
            type: updatedUser.user_type,
            isVerified: updatedUser.is_verified,
            profileImage: updatedUser.profile_image
        };

        console.log('✅ Profile updated successfully for user:', decoded.id);

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: userData
        });

    } catch (error) {
        console.error('❌ Profile update error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error: ' + error.message 
            });
        }
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

// Get all users (admin endpoint)
app.get('/api/auth/users', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get all users with basic info
        db.all(
            'SELECT id, email, user_type, first_name, last_name, is_verified, is_active, created_at FROM users ORDER BY created_at DESC',
            [],
            (err, users) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error' 
                    });
                }

                res.json({ 
                    success: true, 
                    users: users,
                    total: users.length
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

// Delete user account
app.delete('/api/auth/profile', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password confirmation required' 
            });
        }

        // Verify password before deletion
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT password_hash FROM users WHERE id = ?',
                [decoded.id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user || !await verifyPassword(password, user.password_hash)) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid password' 
            });
        }

        // Delete user (cascade will handle related tables)
        await new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM users WHERE id = ?',
                [decoded.id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('🗑️ User account deleted:', decoded.email);

        res.json({ 
            success: true, 
            message: 'Account deleted successfully' 
        });

    } catch (error) {
        console.error('❌ Account deletion error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error: ' + error.message 
            });
        }
    }
});

// Change password endpoint
app.put('/api/auth/change-password', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long' 
            });
        }

        // Get current user
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT password_hash FROM users WHERE id = ?',
                [decoded.id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });

        if (!user || !await verifyPassword(currentPassword, user.password_hash)) {
            return res.status(401).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const newPasswordHash = await hashPassword(newPassword);

        // Update password
        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [newPasswordHash, decoded.id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        console.log('🔑 Password changed for user:', decoded.email);

        res.json({ 
            success: true, 
            message: 'Password changed successfully' 
        });

    } catch (error) {
        console.error('❌ Password change error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error: ' + error.message 
            });
        }
    }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    // In a real implementation, you might want to blacklist the token
    res.json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Get login attempts (for security monitoring)
app.get('/api/auth/login-attempts', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'No token provided' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Get recent login attempts
        db.all(
            'SELECT email, success, attempted_at, ip_address FROM login_attempts WHERE email = ? ORDER BY attempted_at DESC LIMIT 50',
            [decoded.email],
            (err, attempts) => {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error' 
                    });
                }

                res.json({ 
                    success: true, 
                    attempts: attempts
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

// Enhanced catch-all route for serving HTML files
app.get('*', (req, res) => {
    console.log(`🌐 Request for: ${req.path}`);
    console.log(`🔍 Headers accept: ${req.headers.accept}`);
    
    // Handle API routes that don't exist
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For static files with extensions (CSS, JS, images, etc.)
    if (path.extname(req.path)) {
        const filePath = path.join(__dirname, '../public', req.path);
        console.log(`📁 Static file check: ${filePath}`);
        console.log(`🔍 File exists: ${fs.existsSync(filePath)}`);
        
        if (fs.existsSync(filePath)) {
            // Set proper content type for common file types
            const ext = path.extname(req.path).toLowerCase();
            const contentTypes = {
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.html': 'text/html',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.ico': 'image/x-icon',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
                '.ttf': 'font/ttf'
            };
            
            if (contentTypes[ext]) {
                res.setHeader('Content-Type', contentTypes[ext]);
            }
            
            console.log(`✅ Serving static file: ${filePath}`);
            return res.sendFile(filePath);
        } else {
            console.log(`❌ Static file not found: ${filePath}`);
            return res.status(404).send('File not found');
        }
    }
    
    // For HTML requests (with or without .html extension)
    if (req.headers.accept?.includes('text/html')) {
        let htmlPaths = [];
        
        // If path already has .html extension, use it directly
        if (req.path.endsWith('.html')) {
            htmlPaths.push(path.join(__dirname, '../public', req.path));
        } else {
            // Try multiple variations
            htmlPaths = [
                path.join(__dirname, '../public', req.path + '.html'),
                path.join(__dirname, '../public', req.path, 'index.html'),
                path.join(__dirname, '../public', req.path.substring(1) + '.html'), // Remove leading slash
                path.join(__dirname, '../public/index.html') // fallback
            ];
        }
        
        console.log(`🔍 Looking for HTML file in paths:`, htmlPaths);
        
        for (const htmlPath of htmlPaths) {
            console.log(`🔍 Checking: ${htmlPath} - Exists: ${fs.existsSync(htmlPath)}`);
            if (fs.existsSync(htmlPath)) {
                console.log(`✅ Serving HTML: ${htmlPath}`);
                res.setHeader('Content-Type', 'text/html');
                return res.sendFile(htmlPath);
            }
        }
        
        // If no HTML file found, list available files for debugging
        const publicDir = path.join(__dirname, '../public');
        if (fs.existsSync(publicDir)) {
            const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));
            console.log(`❌ HTML file not found. Available HTML files:`, files);
            return res.status(404).send(`
                <h1>Page not found</h1>
                <p>The requested resource <code>${req.path}</code> was not found on this server.</p>
                <h3>Available HTML files:</h3>
                <ul>
                    ${files.map(f => `<li><a href="/${f}">${f}</a></li>`).join('')}
                </ul>
            `);
        } else {
            return res.status(404).send('Public directory not found');
        }
    }
    
    // For other requests
    console.log(`❌ Unhandled request: ${req.path}`);
    res.status(404).json({ error: 'Not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        // Call debug function after database initialization
        debugFileStructure();
        
        app.listen(PORT, () => {
            console.log(`🌐 Server running on http://localhost:${PORT}`);
            console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
            console.log(`📁 Static files served from: ${path.join(__dirname, '../public')}`);
            console.log('📋 Available endpoints:');
            console.log('   - GET  /api/test');
            console.log('   - GET  /api/health');
            console.log('   - POST /api/auth/check-email');
            console.log('   - POST /api/auth/social-login');
            console.log('   - POST /api/auth/login');
            console.log('   - POST /api/auth/register');
            console.log('   - GET  /api/auth/profile');
            console.log('   - PUT  /api/auth/profile');
            console.log('   - PUT  /api/auth/change-password');
            console.log('   - DELETE /api/auth/profile');
            console.log('   - POST /api/auth/logout');
            console.log('   - GET  /api/auth/users');
            console.log('   - GET  /api/auth/login-attempts');
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

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

module.exports = app;