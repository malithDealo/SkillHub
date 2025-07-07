// Debug API Script - Run this in your terminal to check the API
// Save as debug-api.js and run with: node debug-api.js

const http = require('http');

console.log('🔍 Debugging SkillHub API...\n');

// Test 1: Check if server is running
function testServerConnection() {
    return new Promise((resolve, reject) => {
        console.log('1. Testing server connection...');
        
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        }, (res) => {
            console.log(`   ✅ Server is running (Status: ${res.statusCode})`);
            resolve(true);
        });

        req.on('error', (error) => {
            console.log(`   ❌ Server not responding: ${error.message}`);
            reject(error);
        });

        req.setTimeout(5000, () => {
            console.log('   ❌ Server connection timeout');
            reject(new Error('Timeout'));
        });

        req.end();
    });
}

// Test 2: Check API test endpoint
function testAPIEndpoint() {
    return new Promise((resolve, reject) => {
        console.log('\n2. Testing /api/test endpoint...');
        
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/test',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        console.log(`   ✅ API test successful (Status: ${res.statusCode})`);
                        console.log(`   📊 Response: ${response.message}`);
                        console.log(`   💾 Database: ${response.database}`);
                        resolve(response);
                    } catch (error) {
                        console.log(`   ❌ Invalid JSON response: ${data}`);
                        reject(error);
                    }
                } else {
                    console.log(`   ❌ API test failed (Status: ${res.statusCode})`);
                    console.log(`   📄 Response: ${data}`);
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ API request failed: ${error.message}`);
            reject(error);
        });

        req.end();
    });
}

// Test 3: Check login endpoint
function testLoginEndpoint() {
    return new Promise((resolve, reject) => {
        console.log('\n3. Testing /api/auth/login endpoint...');
        
        const loginData = JSON.stringify({
            email: 'learner@example.com',
            password: 'password',
            userType: 'learner'
        });

        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(loginData)
            }
        }, (res) => {
            let data = '';
            
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`   📡 Login endpoint status: ${res.statusCode}`);
                
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        if (response.success) {
                            console.log(`   ✅ Login test successful`);
                            console.log(`   👤 User: ${response.user.name}`);
                            console.log(`   📧 Email: ${response.user.email}`);
                            console.log(`   🎭 Type: ${response.user.type}`);
                        } else {
                            console.log(`   ❌ Login failed: ${response.message}`);
                        }
                        resolve(response);
                    } catch (error) {
                        console.log(`   ❌ Invalid JSON response: ${data}`);
                        reject(error);
                    }
                } else {
                    console.log(`   ❌ Login endpoint failed (Status: ${res.statusCode})`);
                    console.log(`   📄 Response: ${data}`);
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.log(`   ❌ Login request failed: ${error.message}`);
            reject(error);
        });

        req.write(loginData);
        req.end();
    });
}

// Test 4: Check available routes
function testRoutes() {
    return new Promise((resolve) => {
        console.log('\n4. Testing common routes...');
        
        const routes = [
            '/login-learner.html',
            '/login-teacher.html', 
            '/login-sponsor.html',
            '/css/global.css',
            '/js/login-learner.js'
        ];

        let completed = 0;
        
        routes.forEach(route => {
            const req = http.request({
                hostname: 'localhost',
                port: 3000,
                path: route,
                method: 'GET'
            }, (res) => {
                if (res.statusCode === 200) {
                    console.log(`   ✅ ${route} - OK`);
                } else {
                    console.log(`   ❌ ${route} - Status ${res.statusCode}`);
                }
                
                completed++;
                if (completed === routes.length) {
                    resolve();
                }
            });

            req.on('error', () => {
                console.log(`   ❌ ${route} - Connection failed`);
                completed++;
                if (completed === routes.length) {
                    resolve();
                }
            });

            req.end();
        });
    });
}

// Run all tests
async function runAllTests() {
    try {
        await testServerConnection();
        await testAPIEndpoint();
        await testLoginEndpoint();
        await testRoutes();
        
        console.log('\n🎉 Debugging complete!');
        console.log('\n📋 Summary:');
        console.log('   - If all tests passed: Your setup is working correctly');
        console.log('   - If API tests failed: Check if server/auth-api.js is running');
        console.log('   - If route tests failed: Check file paths and static file serving');
        console.log('\n🚀 Next steps:');
        console.log('   1. Make sure server is running: npm run dev');
        console.log('   2. Check browser console for detailed errors');
        console.log('   3. Try the test page: http://localhost:3000/test-login.html');
        
    } catch (error) {
        console.log('\n❌ Debug failed. Please check:');
        console.log('   1. Is the server running? (npm run dev)');
        console.log('   2. Is port 3000 available?');
        console.log('   3. Are there any server errors in the terminal?');
        console.log(`\n   Error details: ${error.message}`);
    }
}

// Start debugging
runAllTests();