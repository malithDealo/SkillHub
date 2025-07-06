// auth.js - Authentication integration for SkillHub
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
                navbarContainer.innerHTML = navbarHTML;
                
                if (this.isAuthenticated) {
                    this.updateUserProfile();
                }
                
                this.setupNavbarEvents();
            } else {
                console.error('Failed to load navbar:', response.status);
                this.loadFallbackNavbar();
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
            this.loadFallbackNavbar();
        }
    }

    // Fallback navbar if loading fails
    loadFallbackNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) return;

        const fallbackNavbar = this.isAuthenticated ? this.getNavbar2HTML() : this.getNavbar1HTML();
        navbarContainer.innerHTML = fallbackNavbar;
        
        if (this.isAuthenticated) {
            this.updateUserProfile();
        }
        
        this.setupNavbarEvents();
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
        // Create a modal or redirect to sign-in selection page
        const modal = this.createUserTypeModal('signin');
        document.body.appendChild(modal);
    }

    // Show sign up options modal/page
    showSignUpOptions() {
        // Create a modal or redirect to sign-up selection page
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
                    <button onclick="window.location.href='${action}-learner.html'" style="
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
                    <button onclick="window.location.href='${action}-teacher.html'" style="
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
                    <button onclick="window.location.href='${action}-sponsor.html'" style="
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

    // Get navbar1 HTML (before signin)
    getNavbar1HTML() {
        return `
            <nav class="navbar-top">
                <div class="navbar-container">
                    <div class="navbar-brand">
                        <img src="images/SkillHub LOGO 3.png" alt="SkillHub Logo" class="logo">
                        <span class="brand-text">SkillHub</span>
                    </div>
                    
                    <div class="navbar-actions">
                        <a href="#" class="nav-button btn-outline" data-action="signin">
                            <img src="images/lucide_log-in.png" alt="Sign In Icon" class="button-icon">
                            Sign In
                        </a>
                        <a href="#" class="nav-button btn-filled" data-action="signup">
                            <img src="images/signup.png" alt="Sign Up Icon" class="button-icon">
                            Sign Up
                        </a>
                        <button class="mobile-menu-btn" aria-label="Toggle Menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
    }

    // Get navbar2 HTML (after signin)
    getNavbar2HTML() {
        return `
            <nav class="navbar-top">
                <div class="navbar-container">
                    <div class="navbar-brand">
                        <img src="images/SkillHub LOGO 3.png" alt="SkillHub Logo" class="logo">
                        <span class="brand-text">SkillHub</span>
                    </div>
                    
                    <div class="navbar-menu">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a href="#" class="nav-link">Home</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">How it Works</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a href="#" class="nav-link dropdown-toggle">Special Needs</a>
                                <ul class="dropdown-menu">
                                    <li><a href="#" class="dropdown-link">Sign Language</a></li>
                                    <li><a href="#" class="dropdown-link">Audio Books</a></li>
                                    <li><a href="#" class="dropdown-link">Colour Contrast</a></li>
                                </ul>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Community</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Services</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">About Us</a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">Contact Us</a>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="navbar-actions">
                        <div class="user-profile">
                            <span class="user-name">User</span>
                            <div class="profile-icon" role="button" aria-label="User Profile">
                                <img src="images/qlementine-icons_user-16.png" alt="User Profile">
                            </div>
                            <div class="profile-dropdown">
                                <a href="#" class="profile-dropdown-link">Profile Settings</a>
                                <a href="#" class="profile-dropdown-link">Dashboard</a>
                                <a href="#" class="profile-dropdown-link">My Learning</a>
                                <a href="#" class="profile-dropdown-link">Messages</a>
                                <a href="#" class="profile-dropdown-link logout" data-action="signout">Sign Out</a>
                            </div>
                        </div>
                        <button class="mobile-menu-btn" aria-label="Toggle Menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </nav>
        `;
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

// Integration functions for your existing forms
function handleFormSubmission(formData, userType, isSignUp = false) {
    if (isSignUp) {
        // Handle sign up
        console.log('Processing sign up...', formData);
        // Add your sign up logic here
        // After successful registration, sign in the user
        skillHubAuth.signIn(formData, userType);
    } else {
        // Handle sign in
        console.log('Processing sign in...', formData);
        // Add your sign in validation logic here
        // After successful validation, sign in the user
        skillHubAuth.signIn(formData, userType);
    }
}

// Example integration with your existing forms
document.addEventListener('DOMContentLoaded', function() {
    // Teacher sign up form
    const teacherSignUpForm = document.getElementById('teacher-signup-form');
    if (teacherSignUpForm) {
        teacherSignUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                firstName: formData.get('first-name'),
                lastName: formData.get('last-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                skills: formData.get('skills'),
                about: formData.get('about'),
                experience: formData.get('experience'),
                teachingLanguage: formData.get('teaching-language')
            };
            handleFormSubmission(userData, 'teacher', true);
        });
    }

    // Learner sign up form
    const learnerSignUpForm = document.getElementById('learner-signup-form');
    if (learnerSignUpForm) {
        learnerSignUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                firstName: formData.get('first-name'),
                lastName: formData.get('last-name'),
                email: formData.get('email'),
                location: formData.get('location'),
                interests: formData.get('interests'),
                ageGroup: formData.get('age-group'),
                language: formData.get('language')
            };
            handleFormSubmission(userData, 'learner', true);
        });
    }

    // Sponsor sign up form
    const sponsorSignUpForm = document.getElementById('sponsor-signup-form');
    if (sponsorSignUpForm) {
        sponsorSignUpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                firstName: formData.get('first-name'),
                lastName: formData.get('last-name'),
                email: formData.get('email'),
                companyName: formData.get('company-name'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                interests: formData.get('interests'),
                about: formData.get('about'),
                budget: formData.get('budget')
            };
            handleFormSubmission(userData, 'sponsor', true);
        });
    }

    // Teacher sign in form
    const teacherSignInForm = document.getElementById('teacher-signin-form');
    if (teacherSignInForm) {
        teacherSignInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            // Add authentication logic here
            // For demo purposes, we'll simulate successful login
            setTimeout(() => {
                skillHubAuth.signIn({
                    name: 'John Teacher',
                    email: userData.email
                }, 'teacher');
            }, 1000);
        });
    }

    // Learner sign in form
    const learnerSignInForm = document.getElementById('learner-signin-form');
    if (learnerSignInForm) {
        learnerSignInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            // Add authentication logic here
            setTimeout(() => {
                skillHubAuth.signIn({
                    name: 'Jane Learner',
                    email: userData.email
                }, 'learner');
            }, 1000);
        });
    }

    // Sponsor sign in form
    const sponsorSignInForm = document.getElementById('sponsor-signin-form');
    if (sponsorSignInForm) {
        sponsorSignInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const userData = {
                email: formData.get('email'),
                password: formData.get('password')
            };
            // Add authentication logic here
            setTimeout(() => {
                skillHubAuth.signIn({
                    name: 'Company Sponsor',
                    email: userData.email
                }, 'sponsor');
            }, 1000);
        });
    }
});

// Export for global access
window.SkillHubAuth = skillHubAuth;
window.handleFormSubmission = handleFormSubmission;