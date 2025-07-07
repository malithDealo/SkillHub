// Update User Passwords Script - update-passwords.js
// Run with: node update-passwords.js

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'database/skillhub.db');

console.log('🔐 Updating SkillHub user passwords...\n');

// New passwords for each user
const passwordUpdates = [
    {
        email: 'learner@example.com',
        newPassword: 'Mindiya1234',
        userType: 'learner'
    },
    {
        email: 'teacher@example.com', 
        newPassword: 'Gamodya1234',
        userType: 'teacher'
    },
    {
        email: 'sponsor@example.com',
        newPassword: 'osandi1234',
        userType: 'sponsor'
    }
];

// Hash password function
async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

// Update passwords in database
async function updatePasswords() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('❌ Error opening database:', err.message);
                reject(err);
                return;
            }
            console.log('✅ Connected to database');
        });

        // Process each password update
        let completed = 0;
        const total = passwordUpdates.length;

        passwordUpdates.forEach(async (update, index) => {
            try {
                console.log(`\n${index + 1}. Updating password for ${update.email}...`);
                
                // Hash the new password
                const hashedPassword = await hashPassword(update.newPassword);
                console.log(`   🔒 Password hashed successfully`);

                // Update the database
                db.run(
                    'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE email = ?',
                    [hashedPassword, update.email],
                    function(err) {
                        if (err) {
                            console.error(`   ❌ Error updating ${update.email}:`, err.message);
                        } else if (this.changes === 0) {
                            console.log(`   ⚠️  User ${update.email} not found in database`);
                        } else {
                            console.log(`   ✅ Password updated for ${update.email}`);
                        }
                        
                        completed++;
                        if (completed === total) {
                            // Verify the updates
                            verifyUpdates(db).then(() => {
                                db.close((err) => {
                                    if (err) {
                                        console.error('❌ Error closing database:', err.message);
                                    } else {
                                        console.log('\n✅ Database connection closed');
                                        console.log('🎉 Password update complete!');
                                    }
                                    resolve();
                                });
                            });
                        }
                    }
                );
            } catch (error) {
                console.error(`   ❌ Error processing ${update.email}:`, error.message);
                completed++;
            }
        });
    });
}

// Verify the password updates
async function verifyUpdates(db) {
    return new Promise((resolve) => {
        console.log('\n📋 Verifying password updates...');
        
        db.all('SELECT email, user_type, updated_at FROM users WHERE email IN (?, ?, ?)', 
            ['learner@example.com', 'teacher@example.com', 'sponsor@example.com'],
            (err, rows) => {
                if (err) {
                    console.error('❌ Error verifying updates:', err.message);
                } else {
                    console.log('\n👥 Updated users:');
                    rows.forEach(row => {
                        console.log(`   - ${row.email} (${row.user_type}) - Updated: ${row.updated_at}`);
                    });
                }
                resolve();
            }
        );
    });
}

// Test login function
async function testLogin(email, password, userType) {
    return new Promise((resolve) => {
        const db = new sqlite3.Database(dbPath);
        
        db.get('SELECT * FROM users WHERE email = ? AND user_type = ?', 
            [email, userType], 
            async (err, user) => {
                if (err || !user) {
                    console.log(`   ❌ User not found: ${email}`);
                    resolve(false);
                    return;
                }

                try {
                    const isValid = await bcrypt.compare(password, user.password_hash);
                    if (isValid) {
                        console.log(`   ✅ Login test successful: ${email}`);
                        resolve(true);
                    } else {
                        console.log(`   ❌ Login test failed: ${email}`);
                        resolve(false);
                    }
                } catch (error) {
                    console.log(`   ❌ Error testing login: ${error.message}`);
                    resolve(false);
                }
                
                db.close();
            }
        );
    });
}

// Run password tests
async function runLoginTests() {
    console.log('\n🧪 Testing new passwords...');
    
    for (const update of passwordUpdates) {
        console.log(`\nTesting ${update.email} with password "${update.newPassword}":`);
        await testLogin(update.email, update.newPassword, update.userType);
    }
}

// Main execution
async function main() {
    try {
        await updatePasswords();
        await runLoginTests();
        
        console.log('\n📋 Password Update Summary:');
        console.log('   - learner@example.com → "Mindiya1234"');
        console.log('   - teacher@example.com → "Gamodya1234"');
        console.log('   - sponsor@example.com → "osandi1234"');
        console.log('\n🚀 You can now test login with these new passwords!');
        console.log('🌐 Test at: http://localhost:3002/login-learner.html');
        
    } catch (error) {
        console.error('❌ Password update failed:', error.message);
        process.exit(1);
    }
}

// Check if required modules are available
if (typeof bcrypt === 'undefined') {
    console.error('❌ bcrypt module not found. Make sure to run: npm install bcrypt');
    process.exit(1);
}

if (typeof sqlite3 === 'undefined') {
    console.error('❌ sqlite3 module not found. Make sure to run: npm install sqlite3');
    process.exit(1);
}

// Run the script
main();