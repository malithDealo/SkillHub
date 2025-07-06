// auth.js - Updated Authentication integration for SkillHub with SQLite3
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
    }

    // Check if user is authenticated on page load
    checkAuthenticationStatus() {
        const storedAuth = localStorage.getItem('skillhub_authenticated');
        const storedUser = localStorage.getItem('skillhub_user');
        
        if (storedAuth === 'true' && storedUser) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(storedUser);
        }
    }

    // Load appropriate navbar based on authentication status
    async loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) return;

        try {
            let navbarPath;
            if (this.isAuthenticated) {
                navbarPath = 'components/navbar2.html';
            } else {
                navbarPath = 'components/navbar1.html';
            }

            const response = await fetch(navbarPath);
            if (response.ok) {
                const navbarHTML = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(navbarHTML, 'text/html');
                const navbarElement = doc.querySelector('nav');
                
                if (navbarElement) {
                    navbarContainer.innerHTML = navbarElement.outerHTML;
                    
                    if (this.isAuthenticated) {
                        this.updateUserProfile();
                    }
                    
                    this.setupNavbarEvents();
                }
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    // Update user profile information in navbar
    updateUserProfile() {
        if (!this.currentUser) return;

        const userNameElement = document.querySelector('.user-name, #user-display-name');
        const userImageElement = document.querySelector('.profile-icon img, #user-profile-image');
        
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.name || 'User';
        }
        
        if (userImageElement && this.currentUser.profileImage) {
            userImageElement.src = this.currentUser.profileImage;
        }
    }

    // Setup navbar event listeners
    setupNavbarEvents() {
        // Sign out functionality
        const signOutBtn = document.querySelector('[data-action="signout"], .logout');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.signOut();
            });
        }

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
    }

    // Setup global event listeners
    setupEventListeners() {
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'skillhub_authenticated' || e.key === 'skillhub_user') {
                this.checkAuthenticationStatus();
                this.loadNavbar();
            }
        });
    }

    // Handle successful sign in
    async signIn(userData, userType = 'learner') {
        // Validate and format user data
        const formattedUser = {
            id: userData.id || Date.now(),
            name: userData.name || `${userData.firstName} ${userData.lastName}`,
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
        
        // Reload navbar
        await this.loadNavbar();
        
        // Redirect based on user type
        this.redirectAfterSignIn(userType);
        
        return true;
    }

    // Sign out user
    signOut() {
        this.isAuthenticated = false;
        this.currentUser = null;
        
        // Clear localStorage
        localStorage.removeItem('skillhub_user');
        localStorage.removeItem('skillhub_authenticated');
        localStorage.removeItem('skillhub_session');
        
        // Reload navbar
        this.loadNavbar();
        
        // Redirect to home page
        window.location.href = 'index.html';
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
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const actionText = action === 'signin' ? 'Sign In' : 'Sign Up';
        
        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 12px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                text-align: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            ">
                <h3 style="margin-bottom: 1.5rem; color: #333;">Choose your role to ${actionText}</h3>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button onclick="window.location.href='login-learner.html'" style="
                        padding: 1rem;
                        border: 2px solid #4CAF50;
                        background: white;
                        color: #4CAF50;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#4CAF50'; this.style.color='white';" 
                       onmouseout="this.style.background='white'; this.style.color='#4CAF50';">
                        📚 ${actionText} as Learner
                    </button>
                    <button onclick="window.location.href='login-teacher.html'" style="
                        padding: 1rem;
                        border: 2px solid #87BE25;
                        background: white;
                        color: #87BE25;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#87BE25'; this.style.color='white';" 
                       onmouseout="this.style.background='white'; this.style.color='#87BE25';">
                        🎓 ${actionText} as Teacher
                    </button>
                    <button onclick="window.location.href='login-sponsor.html'" style="
                        padding: 1rem;
                        border: 2px solid #007bff;
                        background: white;
                        color: #007bff;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.background='#007bff'; this.style.color='white';" 
                       onmouseout="this.style.background='white'; this.style.color='#007bff';">
                        💼 ${actionText} as Sponsor
                    </button>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 1.5rem;
                    padding: 0.5rem 1rem;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Close</button>
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    // Redirect after successful sign in
    redirectAfterSignIn(userType) {
        const redirectMap = {
            learner: 'learner-dashboard.html',
            teacher: 'teacher-dashboard.html',
            sponsor: 'sponsor-dashboard.html'
        };

        const redirectUrl = redirectMap[userType] || 'dashboard.html';
        
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
    }

    // Get default profile image based on user type
    getDefaultProfileImage(userType) {
        const colors = {
            learner: '#4CAF50',
            teacher: '#87BE25',
            sponsor: '#007bff'
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
}

// Initialize authentication system
const skillHubAuth = new SkillHubAuth();

// Export for global access
window.SkillHubAuth = skillHubAuth;