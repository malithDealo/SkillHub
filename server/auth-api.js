// auth-api.js - Fixed Backend API for SkillHub Authentication
// Run with: node server/auth-api.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key-change-this-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Also serve files from the root directory (for components, css, js, images folders)
app.use('/components', express.static(path.join(__dirname, '../components')));
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/images', express.static(path.join(__dirname, '../images')));

// Database connection
const dbPath = path.join(__dirname, '../database/skillhub.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Helper function to hash passwords
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Helper function to verify passwords
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Helper function to generate JWT token
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

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'SkillHub API is working!',
        timestamp: new Date().toISOString(),
        endpoints: [
            'POST /api/auth/login',
            'POST /api/auth/register',
            'GET /api/auth/profile'
        ]
    });
});

// User Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
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
                message: 'Missing required fields' 
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
                [email, passwordHash, userType, firstName, lastName, phone, location],
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
                    [userId, JSON.stringify(skills || []), about, experienceYears || 0, teachingLanguage],
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
                    [userId, JSON.stringify(interests || []), ageGroup, preferredLanguage || 'english'],
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
                    [userId, companyName, address, JSON.stringify(sponsorshipInterests || []), about, budget],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        res.json({ 
            success: true, 
            message: 'User registered successfully',
            userId: userId
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// User Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    const { email, password, userType } = req.body;

    console.log('Login attempt:', { email, userType }); // Debug log

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
            console.log('User not found:', email, userType); // Debug log
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password_hash);
        
        if (!isValidPassword) {
            console.log('Invalid password for:', email); // Debug log
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({ 
                success: false, 
                message: 'Account is deactivated' 
            });
        }

        console.log('Login successful for:', email); // Debug log

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

        res.json({ 
            success: true, 
            message: 'Login successful',
            token: token,
            user: userData
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send(`
        <h1>SkillHub API Server</h1>
        <p>Server is running on port ${PORT}</p>
        <ul>
            <li><a href="/api/test">Test API</a></li>
            <li><a href="/login-learner.html">Learner Login</a></li>
            <li><a href="/login-teacher.html">Teacher Login</a></li>
            <li><a href="/login-sponsor.html">Sponsor Login</a></li>
        </ul>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`SkillHub API server running on http://localhost:${PORT}`);
    console.log(`Test API: http://localhost:${PORT}/api/test`);
    console.log(`Static files served from: ${path.join(__dirname, '../public')}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});

module.exports = app;