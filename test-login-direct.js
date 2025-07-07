// Simple login test script - test-login-direct.js
// Run with: node test-login-direct.js
// Make sure your server is running first!

async function testLogin() {
    try {
        console.log('🧪 Testing SkillHub Login API...\n');

        // Test 1: Check if server responds
        console.log('1. Testing server...');
        const testResponse = await fetch('http://localhost:3000/api/test');
        
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('   ✅ Server is running');
            console.log('   📊 API Response:', testData.message);
            console.log('   💾 Database:', testData.database);
        } else {
            throw new Error(`Server test failed: ${testResponse.status}`);
        }

        // Test 2: Try login
        console.log('\n2. Testing login...');
        const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'learner@example.com',
                password: 'password',
                userType: 'learner'
            })
        });

        console.log('   📡 Login response status:', loginResponse.status);

        if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            
            if (loginData.success) {
                console.log('   ✅ Login successful!');
                console.log('   👤 User:', loginData.user.name);
                console.log('   📧 Email:', loginData.user.email);
                console.log('   🎭 Type:', loginData.user.type);
                console.log('   🔑 Token:', loginData.token ? 'Generated' : 'Missing');
            } else {
                console.log('   ❌ Login failed:', loginData.message);
            }
        } else {
            const errorText = await loginResponse.text();
            console.log('   ❌ HTTP Error:', loginResponse.status);
            console.log('   📄 Response:', errorText);
        }

        // Test 3: Check routes
        console.log('\n3. Testing static files...');
        const routes = [
            'http://localhost:3000/login-learner.html',
            'http://localhost:3000/css/global.css',
            'http://localhost:3000/js/login-learner.js'
        ];

        for (const route of routes) {
            try {
                const response = await fetch(route);
                const fileName = route.split('/').pop();
                if (response.ok) {
                    console.log(`   ✅ ${fileName} - OK`);
                } else {
                    console.log(`   ❌ ${fileName} - Status ${response.status}`);
                }
            } catch (error) {
                console.log(`   ❌ ${route} - Failed to fetch`);
            }
        }

        console.log('\n🎉 Test complete!');

    } catch (error) {
        console.log('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Make sure server is running: npm run dev');
        console.log('2. Check server terminal for errors');
        console.log('3. Verify port 3000 is not blocked');
        console.log('4. Try: http://localhost:3000/api/test in browser');
    }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
    console.log('❌ This script requires Node.js 18+ or you need to install node-fetch');
    console.log('💡 Alternative: Open http://localhost:3000/test-login.html in your browser');
    process.exit(1);
}

// Run the test
testLogin();