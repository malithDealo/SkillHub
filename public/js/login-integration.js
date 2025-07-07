// auth.js - Enhanced Authentication system for SkillHub
// Place this file in your js/ folder and include it in all pages

class SkillHubAuth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthenticationStatus();
        this.loadNavbar();
        this.setupEventListeners();
        this.setupLogoutHandlers();
    }

    // Check if user is authenticated on page load
    checkAuthenticationStatus() {
        const storedAuth = localStorage.getItem('skillhub_authenticated');
        const storedUser = localStorage.getItem('skillhub_user');
        
        if (storedAuth === 'true' && storedUser) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(storedUser);
            console.log('User authenticated:', this.currentUser);
        } else {
            this.isAuthenticated = false;
            this.currentUser = null;
            console.log('User not authenticated');
        }
    }

    // Load appropriate navbar based on authentication status
    async loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) {
            console.log('No navbar container found on this page');
            return;
        }

        try {
            let navbarPath;
            if (this.isAuthenticated && this.currentUser) {
                navbarPath = 'components/navbar2.html'; // Authenticated navbar
                console.log('Loading authenticated navbar for:', this.currentUser.type);
            } else {
                navbarPath = 'components/navbar1.html'; // Guest navbar
                console.log('Loading guest navbar');
            }

            const response = await fetch(navbarPath);
            if (response.ok) {
                const navbarHTML = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(navbarHTML, 'text/html');
                const navbarElement = doc.querySelector('nav');
                
                if (navbarElement) {
                    navbarContainer.innerHTML = navbarElement.outerHTML;
                    
                    // Update user info if authenticated
                    if (this.isAuthenticated && this.currentUser) {
                        this.updateUserProfile();
                    }
                    
                    // Setup navbar event listeners
                    this.setupNavbarEvents();
                    console.log('Navbar loaded successfully');
                } else {
                    console.error('No nav element found in navbar HTML');
                }
            } else {
                console.error('Failed to fetch navbar:', response.status);
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    // Update user profile information in navbar
    updateUserProfile() {
        if (!this.currentUser) return;

        console.log('Updating user profile in navbar:', this.currentUser);

        // Update user name
        const userNameElements = document.querySelectorAll('.user-name, #user-display-name');
        userNameElements.forEach(element => {
            if (element) {
                const displayName = this.currentUser.firstName 
                    ? `${this.currentUser.firstName} ${this.currentUser.lastName || ''}`.trim()
                    : this.currentUser.name || 'User';
                element.textContent = displayName;
                console.log('Updated user name:', displayName);
            }
        });
        
        // Update profile image
        const userImageElements = document.querySelectorAll('.profile-icon img, #user-profile-image');
        userImageElements.forEach(element => {
            if (element && this.currentUser.profileImage) {
                element.src = this.currentUser.profileImage;
                element.alt = `${this.currentUser.name || 'User'} Profile`;
                console.log('Updated profile image');
            } else if (element) {
                // Set default profile image based on user type
                element.src = this.getDefaultProfileImage(this.currentUser.type);
                element.alt = `${this.currentUser.name || 'User'} Profile`;
                console.log('Set default profile image for:', this.currentUser.type);
            }
        });

        // Update profile initials if no image
        const profilePlaceholders = document.querySelectorAll('.profile-initials');
        profilePlaceholders.forEach(element => {
            if (element && !this.currentUser.profileImage) {
                const initials = this.getUserInitials();
                element.textContent = initials;
                console.log('Updated profile initials:', initials);
            }
        });
    }

    // Get user initials for placeholder
    getUserInitials() {
        if (!this.currentUser) return 'U';
        
        const firstName = this.currentUser.firstName || this.currentUser.name?.split(' ')[0] || '';
        const lastName = this.currentUser.lastName || this.currentUser.name?.split(' ')[1] || '';
        
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
    }

    // Setup navbar event listeners
    setupNavbarEvents() {
        // Sign out functionality
        const signOutElements = document.querySelectorAll('[data-action="signout"], .logout, .profile-dropdown-link.logout');
        signOutElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Sign out clicked');
                this.signOut();
            });
        });

        // Sign in/up buttons (for pre-auth navbar)
        const signInBtn = document.querySelector('[data-action="signin"]');
        const signUpBtn = document.querySelector('[data-action="signup"]');
        
        if (signInBtn) {
            signInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignInOptions();
            });
        }
        
        if (signUpBtn) {
            signUpBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignUpOptions();
            });
        }

        console.log('Navbar events setup complete');
    }

    // Setup logout handlers for dashboard pages
    setupLogoutHandlers() {
        // Handle logout buttons on dashboard pages
        const logoutButtons = document.querySelectorAll('.logout-btn, .logout, #logoutBtn');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Dashboard logout clicked');
                this.signOut();
            });
        });
    }

    // Setup global event listeners
    setupEventListeners() {
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'skillhub_authenticated' || e.key === 'skillhub_user') {
                console.log('Storage changed, updating auth state');
                this.checkAuthenticationStatus();
                this.loadNavbar();
            }
        });

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page became visible, check auth status
                this.checkAuthenticationStatus();
            }
        });
    }

    // Handle successful sign in
    async signIn(userData, userType = 'learner') {
        console.log('Signing in user:', userData, 'Type:', userType);

        // Validate and format user data
        const formattedUser = {
            id: userData.id || Date.now(),
            name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            email: userData.email,
            type: userType,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImage: userData.profileImage || this.getDefaultProfileImage(userType),
            ...userData
        };

        this.currentUser = formattedUser;
        this.isAuthenticated = true;
        
        // Store in localStorage
        localStorage.setItem('skillhub_user', JSON.stringify(this.currentUser));
        localStorage.setItem('skillhub_authenticated', 'true');
        
        console.log('User signed in successfully:', this.currentUser);
        
        // Reload navbar
        await this.loadNavbar();
        
        // Redirect based on user type
        this.redirectAfterSignIn(userType);
        
        return true;
    }

    // Sign out user
    signOut() {
        console.log('Signing out user:', this.currentUser);
        
        const userType = this.currentUser?.type || 'learner';
        
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Clear localStorage
        localStorage.removeItem('skillhub_user');
        localStorage.removeItem('skillhub_authenticated');
        localStorage.removeItem('skillhub_session');
        localStorage.removeItem('skillhub_token');
        
        // Clear any user-specific data
        ['learnerEmail', 'teacherEmail', 'sponsorEmail'].forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('User signed out, redirecting to home page for type:', userType);
        
        // Redirect to appropriate home page based on user type
        this.redirectAfterSignOut(userType);
    }

    // Redirect after sign out based on user type
    redirectAfterSignOut(userType) {
        const redirectMap = {
            learner: 'home.html',
            teacher: 'homepage.html', 
            sponsor: 'sponsorhome.html'
        };

        const redirectUrl = redirectMap[userType] || 'home.html';
        
        console.log('Redirecting to:', redirectUrl);
        
        // Small delay to ensure storage is cleared
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 100);
    }

    // Show sign in options modal/page
    showSignInOptions() {
        const modal = this.createUserTypeModal('signin');
        document.body.appendChild(modal);
    }

    // Show sign up options modal/page
    showSignUpOptions() {
        const modal = this.createUserTypeModal('signup');
        document.body.appendChild(modal);
    }

    // Create user type selection modal
    createUserTypeModal(action) {
        const modal = document.createElement('div');
        modal.className = 'user-type-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        const actionText = action === 'signin' ? 'Sign In' : 'Sign Up';
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 16px;
                padding: 2.5rem;
                max-width: 450px;
                width: 90%;
                text-align: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <h3 style="margin-bottom: 2rem; color: #333; font-size: 1.5rem; font-weight: 600;">Choose your role to ${actionText}</h3>
                <div class="user-type-buttons" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                    <button onclick="window.location.href='${action === 'signin' ? 'login-learner.html' : 'signup-learner.html'}'" style="
                        padding: 1.25rem;
                        border: 2px solid #4CAF50;
                        background: white;
                        color: #4CAF50;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                    " onmouseover="this.style.background='#4CAF50'; this.style.color='white';" 
                       onmouseout="this.style.background='white'; this.style.color='#4CAF50';">
                        📚 ${actionText} as Learner
                    </button>
                    <button onclick="window.location.href='${action === 'signin' ? 'login-teacher.html' : 'signup-teacher.html'}'" style="
                        padding: 1.25rem;
                        border: 2px solid #6976DE;
                        background: white;
                        color: #6976DE;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                    " onmouseover="this.style.background='#6976DE'; this.style.color='white';" 
                       onmouseout="this.style.background='white'; this.style.color='#6976DE';">
                        🎓 ${actionText} as Teacher
                    </button>
                    <button onclick="window.location.href='${action === 'signin' ? 'login-sponsor.html' : 'signup-sponsor.html'}'" style="
                        padding: 1.25rem;
                        border: 2px solid #F4A261;
                        background: white;
                        color: #F4A261;
                        border-radius: 12px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                    " onmouseover="this.style.background='#F4A261'; this.style.color='white';" 
                       onmouseout="this.style.background='white'; this.style.color='#F4A261';">
                        💼 ${actionText} as Sponsor
                    </button>
                </div>
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                ">Close</button>
            </div>
        `;

        // Add keyframe animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });

        return modal;
    }

    // Redirect after successful sign in
    redirectAfterSignIn(userType) {
        const redirectMap = {
            learner: 'dashboard.html',
            teacher: 'dashboard_overview.html',
            sponsor: 'sponsordashboard1.html'
        };

        const redirectUrl = redirectMap[userType] || 'dashboard.html';
        
        console.log('Redirecting after sign in to:', redirectUrl);
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }

    // Get default profile image based on user type
    getDefaultProfileImage(userType) {
        const colors = {
            learner: '#4CAF50',
            teacher: '#6976DE', 
            sponsor: '#F4A261'
        };
        
        const color = colors[userType] || '#6c757d';
        
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='45' fill='${encodeURIComponent(color)}'/%3E%3Ccircle cx='50' cy='40' r='15' fill='white'/%3E%3Cpath d='M50 60 C35 60, 25 70, 25 80 L75 80 C75 70, 65 60, 50 60' fill='white'/%3E%3C/svg%3E`;
    }

    // Utility methods
    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    getUserType() {
        return this.currentUser ? this.currentUser.type : null;
    }

    // Force refresh authentication state
    refreshAuthState() {
        this.checkAuthenticationStatus();
        this.loadNavbar();
    }

    // Check if user should be redirected (for protected pages)
    requireAuthentication(requiredUserType = null) {
        if (!this.isAuthenticated) {
            console.log('Authentication required, redirecting to login');
            this.showSignInOptions();
            return false;
        }

        if (requiredUserType && this.currentUser?.type !== requiredUserType) {
            console.log(`Wrong user type. Required: ${requiredUserType}, Current: ${this.currentUser?.type}`);
            alert(`This page is only accessible to ${requiredUserType}s.`);
            this.redirectAfterSignOut(this.currentUser?.type);
            return false;
        }

        return true;
    }
}

// Initialize authentication system
const skillHubAuth = new SkillHubAuth();

// Export for global access
window.SkillHubAuth = skillHubAuth;

// Additional utility functions for specific pages
window.requireAuth = (userType = null) => {
    return skillHubAuth.requireAuthentication(userType);
};

window.getCurrentUser = () => {
    return skillHubAuth.getCurrentUser();
};

window.isAuthenticated = () => {
    return skillHubAuth.isUserAuthenticated();
};

console.log('✅ SkillHub Authentication System Initialized');