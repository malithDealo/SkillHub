const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();

// Import routes
const authRoutes = require('./src/routes/auth');
const profileRoutes = require('./src/routes/profile');
const skillsRoutes = require('./src/routes/skills');
const chatRoutes = require('./src/routes/chat');
const searchRoutes = require('./src/routes/search');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to database
const db = new sqlite3.Database('mydatabase.db');

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'skillhub_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);

// === CLEAN URL ROUTING SYSTEM ===

// Route mappings for clean URLs
const routes = {
    '/': 'home.html',
    '/home': 'home.html',
    '/about': 'about.html',
    '/aboutus': 'aboutus.html',
    '/contact': 'contact.html',
    '/dashboard': 'dashboard.html',
    '/profile': 'profile_settings.html',
    '/profile-settings': 'profile_settings.html',
    
    // Authentication pages
    '/login': 'login.html',
    '/signup': 'signup.html',
    '/login-learner': 'login-learner.html',
    '/login-teacher': 'login-teacher.html',
    '/login-sponsor': 'login-sponsor.html',
    '/signup-learner': 'signup-learner.html',
    '/signup-teacher': 'signup-teacher.html',
    '/signup-sponsor': 'signup-sponsor.html',
    
    // Learner pages
    '/home-logged': 'home-logged.html',
    '/services': 'services.html',
    '/howitworks': 'howitworkslearner.html',
    '/howitworks-learner': 'howitworkslearner.html',
    '/advertising': 'advertising.html',
    '/forums': 'forums.html',
    '/events-workshops': 'events-workshops.html',
    '/success-stories': 'success-stories.html',
    '/learning-groups': 'learning-groups.html',
    '/local-partnerships': 'local-partnerships.html',
    '/community-guidelines': 'community-guidelines.html',
    '/neighborhood-spotlights': 'neighborhood-spotlights.html',
    '/community': 'community.html',
    
    // Teacher pages
    '/teacher-home': 'homepage.html',
    '/homepage': 'homepage.html',
    '/servicess': 'servicess.html',
    '/teacher-services': 'servicess.html',
    
    // Sponsor pages
    '/sponsor-home': 'sponsorhome.html',
    '/sponsorhome': 'sponsorhome.html',
    '/sponsor-dashboard': 'sponsordashboard1.html',
    '/sponsordashboard1': 'sponsordashboard1.html',
    '/sponsordashboard4': 'sponsordashboard4.html',
    '/sponsor-profile': 'sponsordashboard4.html',
    '/sponsor-howitworks': 'sponsorhowitworks.html',
    '/sponsorhowitworks': 'sponsorhowitworks.html',
    '/sponsor-sponsor': 'sponsorsponsor.html',
    '/sponsorsponsor': 'sponsorsponsor.html',
    '/sponsor-community': 'sponsorcommunity.html',
    '/sponsorcommunity': 'sponsorcommunity.html',
    '/sponsor-about': 'sponsoraboutus.html',
    '/sponsoraboutus': 'sponsoraboutus.html'
};

// Middleware to handle clean URLs - Insert BEFORE the catch-all route
app.use((req, res, next) => {
    // Skip API routes and static files
    if (req.path.startsWith('/api/') || 
        req.path.startsWith('/css/') || 
        req.path.startsWith('/js/') || 
        req.path.startsWith('/images/') || 
        req.path.startsWith('/components/') ||
        req.path.includes('.')) {
        return next();
    }
    
    // Check if the clean URL exists in our routes
    if (routes[req.path]) {
        const filePath = path.join(__dirname, 'public', routes[req.path]);
        
        // Check if file exists
        const fs = require('fs');
        if (fs.existsSync(filePath)) {
            return res.sendFile(filePath);
        }
    }
    
    // Continue to next middleware if no route found
    next();
});

// Redirect .html URLs to clean URLs (301 redirect for SEO)
app.get('/*.html', (req, res) => {
    const htmlPath = req.path;
    
    // Find the clean URL for this HTML file
    const cleanUrl = Object.keys(routes).find(key => routes[key] === htmlPath.substring(1));
    
    if (cleanUrl) {
        // Redirect to clean URL
        return res.redirect(301, cleanUrl);
    }
    
    // If no clean URL mapping found, try removing .html extension
    const pathWithoutExtension = htmlPath.replace('.html', '');
    const cleanPath = pathWithoutExtension === '/index' ? '/' : pathWithoutExtension;
    
    res.redirect(301, cleanPath);
});

// Handle specific clean URL routes (backup method)
Object.keys(routes).forEach(route => {
    app.get(route, (req, res) => {
        const filePath = path.join(__dirname, 'public', routes[route]);
        
        // Check if file exists
        const fs = require('fs');
        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            // Fallback to index.html or 404
            res.status(404).sendFile(path.join(__dirname, 'public', 'home.html'));
        }
    });
});

// === END CLEAN URL ROUTING SYSTEM ===

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
    // Check if it's a page request (not a file request)
    if (!req.path.includes('.')) {
        // Try to serve home.html as fallback for unknown clean URLs
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
    } else {
        // For file requests that don't exist, return 404
        res.status(404).send('File not found');
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Clean URLs enabled - HTML extensions hidden`);
    console.log(`Available routes: ${Object.keys(routes).join(', ')}`);
});

// Export app for testing
module.exports = app;