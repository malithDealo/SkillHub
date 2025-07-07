// Diagnostic Server - diagnostic-server.js
// Run this to test if basic Express server works
// node diagnostic-server.js

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001; // Using different port to avoid conflict

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test routes
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Diagnostic server is working!',
        timestamp: new Date().toISOString(),
        routes: ['GET /api/test', 'POST /api/test-login']
    });
});

app.post('/api/test-login', (req, res) => {
    console.log('Login test request:', req.body);
    res.json({
        success: true,
        message: 'Login test successful',
        received: req.body
    });
});

// Catch all routes to see what's being requested
app.use('*', (req, res) => {
    console.log(`❓ Unknown route requested: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Route not found',
        method: req.method,
        url: req.originalUrl,
        availableRoutes: [
            'GET /api/test',
            'POST /api/test-login'
        ]
    });
});

app.listen(PORT, () => {
    console.log('🔧 Diagnostic Server started');
    console.log(`🌐 Running on: http://localhost:${PORT}`);
    console.log('📋 Available endpoints:');
    console.log(`   - GET  http://localhost:${PORT}/api/test`);
    console.log(`   - POST http://localhost:${PORT}/api/test-login`);
    console.log('');
    console.log('🧪 Test commands:');
    console.log(`   curl http://localhost:${PORT}/api/test`);
    console.log(`   curl -X POST http://localhost:${PORT}/api/test-login -H "Content-Type: application/json" -d '{"test":"data"}'`);
});

module.exports = app;