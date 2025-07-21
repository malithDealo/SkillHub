// login-integration.js - Integration functions for login pages
// Add this code to your existing login-learner.js, login-teacher.js, and login-sponsor.js files

// Enhanced login success handler - add this function to each login file
function handleLoginSuccess(data, userType) {
    console.log(`${userType} login successful:`, data);
    
    // Store user data and token
    const userData = {
        id: data.user.id || Date.now(),
        name: data.user.name || `${data.user.firstName || ''} ${data.user.lastName || ''}`.trim(),
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        type: userType,
        profileImage: data.user.profileImage || null,
        ...data.user
    };
    
    localStorage.setItem('skillhub_user', JSON.stringify(userData));
    localStorage.setItem('skillhub_authenticated', 'true');
    
    if (data.token) {
        localStorage.setItem('skillhub_token', data.token);
    }

    // Show success message
    showSuccess('Login successful! Redirecting...');

    // Use SkillHub Auth system if available
    if (window.SkillHubAuth) {
        try {
            window.SkillHubAuth.signIn(userData, userType);
            return; // SkillHub Auth will handle redirect
        } catch (authError) {
            console.error('Auth system error:', authError);
            // Fall through to manual redirect
        }
    }
    
    // Manual redirect as fallback
    setTimeout(() => {
        const redirectMap = {
            learner: 'dashboard.html',
            teacher: 'profile_settings.html',
            sponsor: 'sponsordashboard1.html'
        };
        
        const redirectUrl = redirectMap[userType] || 'dashboard.html';
        window.location.href = redirectUrl;
    }, 1500);
}

// Enhanced logout handler - add this to pages with logout functionality
function handleLogout() {
    console.log('Logout initiated');
    
    // Get user type before clearing data
    const userString = localStorage.getItem('skillhub_user');
    const userType = userString ? JSON.parse(userString).type : 'learner';
    
    // Use SkillHub Auth system if available
    if (window.SkillHubAuth) {
        window.SkillHubAuth.signOut();
        return; // SkillHub Auth will handle redirect
    }
    
    // Manual logout as fallback
    localStorage.removeItem('skillhub_user');
    localStorage.removeItem('skillhub_authenticated');
    localStorage.removeItem('skillhub_session');
    localStorage.removeItem('skillhub_token');
    
    // Clear user-specific data
    ['learnerEmail', 'teacherEmail', 'sponsorEmail'].forEach(key => {
        localStorage.removeItem(key);
    });
    
    // Redirect to appropriate home page
    const redirectMap = {
        learner: 'home.html',
        teacher: 'homepage.html', 
        sponsor: 'sponsorhome.html'
    };

    const redirectUrl = redirectMap[userType] || 'home.html';
    console.log('Redirecting to:', redirectUrl);
    
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 100);
}

// Page protection function - add to dashboard pages
function requireAuthentication(requiredUserType = null) {
    const isAuthenticated = localStorage.getItem('skillhub_authenticated') === 'true';
    const userString = localStorage.getItem('skillhub_user');
    
    if (!isAuthenticated || !userString) {
        console.log('Authentication required, redirecting to login');
        alert('Please log in to access this page.');
        window.location.href = 'home.html';
        return false;
    }
    
    if (requiredUserType) {
        const user = JSON.parse(userString);
        if (user.type !== requiredUserType) {
            console.log(`Wrong user type. Required: ${requiredUserType}, Current: ${user.type}`);
            alert(`This page is only accessible to ${requiredUserType}s.`);
            
            // Redirect to appropriate home page
            const redirectMap = {
                learner: 'home.html',
                teacher: 'homepage.html', 
                sponsor: 'sponsorhome.html'
            };
            
            const redirectUrl = redirectMap[user.type] || 'home.html';
            window.location.href = redirectUrl;
            return false;
        }
    }
    
    return true;
}

// Initialize page protection on dashboard pages
document.addEventListener('DOMContentLoaded', () => {
    // Auto-detect page type and apply protection
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'dashboard.html') {
        requireAuthentication('learner');
    } else if (currentPage === 'dashboard_overview.html') {
        requireAuthentication('teacher');
    } else if (currentPage.includes('sponsordashboard')) {
        requireAuthentication('sponsor');
    }
    
    // Setup logout handlers for all logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn, .logout, #logoutBtn, [data-action="signout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    });
});

// Export functions for global use
window.handleLoginSuccess = handleLoginSuccess;
window.handleLogout = handleLogout;
window.requireAuth = requireAuthentication;

console.log('✅ Login Integration System Loaded');