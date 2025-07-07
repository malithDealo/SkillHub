// Server Check Script - check-server.js
// This will help identify what server is actually running

const fs = require('fs');
const path = require('path');

console.log('🔍 SkillHub Server Diagnostic\n');

// 1. Check what files exist
console.log('1. Checking server files...');
const serverFiles = [
    'server/auth-api.js',
    'server.js',
    'app.js',
    'index.js'
];

serverFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`   ✅ Found: ${file}`);
        
        // Check if it has API routes
        try {
            const content = fs.readFileSync(file, 'utf8');
            if (content.includes('/api/test')) {
                console.log(`      📡 Has /api/test route`);
            }
            if (content.includes('/api/auth/login')) {
                console.log(`      🔐 Has /api/auth/login route`);
            }
            if (content.includes('app.listen')) {
                console.log(`      🚀 Has server startup code`);
            }
        } catch (error) {
            console.log(`      ❌ Error reading file: ${error.message}`);
        }
    } else {
        console.log(`   ❌ Missing: ${file}`);
    }
});

// 2. Check package.json scripts
console.log('\n2. Checking package.json scripts...');
if (fs.existsSync('package.json')) {
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        console.log('   📦 Package.json scripts:');
        Object.entries(packageJson.scripts || {}).forEach(([name, script]) => {
            console.log(`      ${name}: ${script}`);
        });
    } catch (error) {
        console.log('   ❌ Error reading package.json');
    }
} else {
    console.log('   ❌ package.json not found');
}

// 3. Check directory structure
console.log('\n3. Checking directory structure...');
const dirs = ['server', 'public', 'database'];
dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`   ✅ ${dir}/ exists`);
        try {
            const files = fs.readdirSync(dir);
            files.forEach(file => {
                console.log(`      - ${file}`);
            });
        } catch (error) {
            console.log(`      ❌ Cannot read ${dir}`);
        }
    } else {
        console.log(`   ❌ ${dir}/ missing`);
    }
});

// 4. Check what's listening on port 3000
console.log('\n4. Process information...');
console.log(`   Current directory: ${process.cwd()}`);
console.log(`   Node version: ${process.version}`);

// 5. Suggest next steps
console.log('\n📋 Diagnosis complete. Next steps:');
console.log('1. Make sure you are running the correct server file');
console.log('2. Check that server/auth-api.js has all the API routes');
console.log('3. Verify you are starting with: npm run dev or nodemon server/auth-api.js');
console.log('4. Check server terminal for startup errors');

console.log('\n🚀 Quick test:');
console.log('Run this diagnostic server: node diagnostic-server.js');
console.log('Then test: curl http://localhost:3001/api/test');