// Enhanced auth.js - Complete Authentication System for SkillHub
// This replaces your existing auth.js file

class SkillHubAuth {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.navbarLoaded = false;
        this.socialAuthInitialized = false;
        this.init();
    }

    init() {
        console.log('🚀 Initializing SkillHub Enhanced Auth System');
        this.checkAuthenticationStatus();
        
        // Initialize social auth
        this.initializeSocialAuth();
        
        // Load navbar with delay to ensure DOM is ready
        setTimeout(() => {
            this.loadNavbar();
        }, 100);
        
        this.setupEventListeners();
        this.setupLogoutHandlers();
    }

    // Initialize social authentication
    initializeSocialAuth() {
        if (this.socialAuthInitialized) return;
        
        // Initialize Google Sign-In
        if (window.google && window.google.accounts) {
            console.log('🔗 Initializing Google Sign-In');
            this.initializeGoogleAuth();
        } else {
            // Wait for Google API to load
            const checkGoogleAPI = setInterval(() => {
                if (window.google && window.google.accounts) {
                    clearInterval(checkGoogleAPI);
                    this.initializeGoogleAuth();
                }
            }, 100);
        }

        // Initialize Facebook SDK
        this.initializeFacebookAuth();
        
        this.socialAuthInitialized = true;
    }

    initializeGoogleAuth() {
        try {
            window.google.accounts.id.initialize({
                client_id: "57524147029-981ih9hqts2288nu7uqg0l63os60plrs.apps.googleusercontent.com",
                callback: this.handleGoogleSignIn.bind(this),
                auto_select: false,
                cancel_on_tap_outside: true
            });
            console.log('✅ Google Sign-In initialized');
        } catch (error) {
            console.error('❌ Google Sign-In initialization failed:', error);
        }
    }

    initializeFacebookAuth() {
        // Load Facebook SDK
        if (!window.FB) {
            window.fbAsyncInit = () => {
                FB.init({
                    appId: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
                    cookie: true,
                    xfbml: true,
                    version: 'v18.0'
                });
                console.log('✅ Facebook SDK initialized');
            };

            // Load the SDK asynchronously
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }

    // Handle Google Sign-In
    async handleGoogleSignIn(response) {
        try {
            console.log('🔗 Google Sign-In response received');
            
            // Decode the JWT token
            const payload = this.parseJwt(response.credential);
            
            const userData = {
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                name: payload.name,
                profileImage: payload.picture,
                provider: 'google'
            };

            // Let user choose their role
            this.showUserTypeSelection(userData, 'google');
            
        } catch (error) {
            console.error('❌ Google Sign-In error:', error);
            this.showError('Google Sign-In failed. Please try again.');
        }
    }

    // Handle Facebook Sign-In
    handleFacebookSignIn() {
        if (!window.FB) {
            this.showError('Facebook SDK not loaded');
            return;
        }

        FB.login((response) => {
            if (response.authResponse) {
                FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
                    const userData = {
                        email: userInfo.email,
                        firstName: userInfo.name.split(' ')[0],
                        lastName: userInfo.name.split(' ').slice(1).join(' '),
                        name: userInfo.name,
                        profileImage: userInfo.picture.data.url,
                        provider: 'facebook'
                    };

                    this.showUserTypeSelection(userData, 'facebook');
                });
            } else {
                console.error('Facebook login failed');
                this.showError('Facebook Sign-In failed. Please try again.');
            }
        }, { scope: 'email' });
    }

    // Show user type selection modal for social auth
    showUserTypeSelection(userData, provider) {
        const modal = document.createElement('div');
        modal.className = 'user-type-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(4px);
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background: white;
                border-radius: 20px;
                padding: 3rem;
                max-width: 500px;
                width: 90%;
                text-align: center;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                animation: modalSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            ">
                <div class="user-info" style="margin-bottom: 2rem; padding: 1.5rem; background: #f8f9fa; border-radius: 15px;">
                    <img src="${userData.profileImage}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 1rem; border: 3px solid #4CAF50;">
                    <h3 style="margin: 0.5rem 0; color: #333;">Welcome, ${userData.firstName}!</h3>
                    <p style="margin: 0; color: #666; font-size: 0.9rem;">${userData.email}</p>
                </div>
                <h3 style="margin-bottom: 2rem; color: #333; font-size: 1.6rem; font-weight: 600;">Choose your role to continue</h3>
                <div class="user-type-buttons" style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
                    <button class="role-btn learner" data-role="learner" style="
                        padding: 1.5rem;
                        border: 2px solid #4CAF50;
                        background: white;
                        color: #4CAF50;
                        border-radius: 15px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1.1rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                    ">
                        📚 Join as Learner
                    </button>
                    <button class="role-btn teacher" data-role="teacher" style="
                        padding: 1.5rem;
                        border: 2px solid #6976DE;
                        background: white;
                        color: #6976DE;
                        border-radius: 15px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1.1rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                    ">
                        🎓 Join as Teacher
                    </button>
                    <button class="role-btn sponsor" data-role="sponsor" style="
                        padding: 1.5rem;
                        border: 2px solid #F4A261;
                        background: white;
                        color: #F4A261;
                        border-radius: 15px;
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 1.1rem;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 1rem;
                    ">
                        💼 Join as Sponsor
                    </button>
                </div>
                <button class="close-btn" style="
                    margin-top: 1rem;
                    padding: 0.75rem 1.5rem;
                    background: #6c757d;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: background-color 0.3s ease;
                ">Cancel</button>
            </div>
        `;

        // Add hover effects
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            .role-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            .role-btn.learner:hover {
                background: #4CAF50 !important;
                color: white !important;
            }
            .role-btn.teacher:hover {
                background: #6976DE !important;
                color: white !important;
            }
            .role-btn.sponsor:hover {
                background: #F4A261 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(modal);

        // Handle role selection
        modal.querySelectorAll('.role-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const role = btn.dataset.role;
                btn.textContent = 'Processing...';
                btn.disabled = true;
                
                try {
                    await this.processSocialAuth(userData, role, provider);
                    modal.remove();
                    style.remove();
                } catch (error) {
                    console.error('Social auth error:', error);
                    this.showError('Authentication failed. Please try again.');
                    modal.remove();
                    style.remove();
                }
            });
        });

        // Close modal
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
            style.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });
    }

    // Process social authentication
    async processSocialAuth(userData, userType, provider) {
        try {
            // Check if user exists with this email and role
            const response = await fetch('/api/auth/social-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userData.email,
                    userType: userType,
                    provider: provider,
                    userData: userData
                })
            });

            const data = await response.json();

            if (data.success) {
                // User exists or was created successfully
                await this.signIn(data.user, userType);
            } else if (data.needsRegistration) {
                // Redirect to registration with pre-filled data
                this.redirectToRegistrationWithData(userData, userType);
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Social auth processing error:', error);
            throw error;
        }
    }

    // Redirect to registration with pre-filled data
    redirectToRegistrationWithData(userData, userType) {
        // Store data temporarily
        sessionStorage.setItem('socialAuthData', JSON.stringify({
            ...userData,
            userType: userType
        }));

        // Redirect to appropriate signup page
        const signupPages = {
            learner: 'signup-learner.html',
            teacher: 'signup-teacher.html',
            sponsor: 'signup-sponsor.html'
        };

        window.location.href = signupPages[userType];
    }

    // Parse JWT token
    parseJwt(token) {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            return null;
        }
    }

    // Check authentication status
    checkAuthenticationStatus() {
        const storedAuth = localStorage.getItem('skillhub_authenticated');
        const storedUser = localStorage.getItem('skillhub_user');
        
        if (storedAuth === 'true' && storedUser) {
            try {
                this.isAuthenticated = true;
                this.currentUser = JSON.parse(storedUser);
                console.log('✅ User authenticated:', this.currentUser.type, this.currentUser.email);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                this.clearAuthData();
            }
        } else {
            this.isAuthenticated = false;
            this.currentUser = null;
            console.log('❌ User not authenticated');
        }
    }

    // Clear authentication data
    clearAuthData() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('skillhub_user');
        localStorage.removeItem('skillhub_authenticated');
        localStorage.removeItem('skillhub_session');
        localStorage.removeItem('skillhub_token');
    }

    // Determine which navbar to load based on page and user type
    getNavbarPath() {
        const currentPage = window.location.pathname.split('/').pop();
        const publicPages = ['home.html', 'homepage.html', 'sponsorhome.html', 'index.html', ''];
        
        // For public pages, always show navbar1
        if (publicPages.includes(currentPage) || !this.isAuthenticated) {
            return 'components/navbar1.html';
        }

        // For authenticated users, show appropriate navbar based on user type
        if (this.isAuthenticated && this.currentUser) {
            const userType = this.currentUser.type;
            const navbarMap = {
                learner: 'components/navbar2.html',
                teacher: 'components/navbar3.html',
                sponsor: 'components/navbar4.html'
            };
            return navbarMap[userType] || 'components/navbar1.html';
        }

        return 'components/navbar1.html';
    }

    // Load appropriate navbar
    async loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) {
            console.log('⚠️ No navbar container found on this page');
            return;
        }

        if (this.navbarLoaded) {
            console.log('📋 Navbar already loaded, updating user info');
            this.updateUserProfile();
            return;
        }

        try {
            const navbarPath = this.getNavbarPath();
            console.log('📱 Loading navbar:', navbarPath);

            const response = await fetch(navbarPath);
            if (response.ok) {
                const navbarHTML = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(navbarHTML, 'text/html');
                const navbarElement = doc.querySelector('nav');
                
                if (navbarElement) {
                    navbarContainer.innerHTML = navbarElement.outerHTML;
                    this.navbarLoaded = true;
                    
                    // Update user info if authenticated
                    if (this.isAuthenticated && this.currentUser) {
                        this.updateUserProfile();
                    }
                    
                    // Setup navbar events
                    this.setupNavbarEvents();
                    
                    // Setup social auth buttons
                    this.setupSocialAuthButtons();
                    
                    console.log('✅ Navbar loaded successfully');
                } else {
                    console.error('❌ No nav element found in navbar HTML');
                }
            } else {
                console.error('❌ Failed to fetch navbar:', response.status);
            }
        } catch (error) {
            console.error('❌ Error loading navbar:', error);
        }
    }

    // Setup social auth buttons
    setupSocialAuthButtons() {
        // Google Sign-In buttons
        const googleBtns = document.querySelectorAll('.social-btn.google, .google-signin');
        googleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.google && window.google.accounts) {
                    window.google.accounts.id.prompt();
                } else {
                    this.showError('Google Sign-In is not available. Please try again later.');
                }
            });
        });

        // Facebook Sign-In buttons
        const facebookBtns = document.querySelectorAll('.social-btn.facebook, .facebook-signin');
        facebookBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFacebookSignIn();
            });
        });

        // Render Google Sign-In button if div exists
        const googleSignInDiv = document.querySelector('.g_id_signin');
        if (googleSignInDiv && window.google && window.google.accounts) {
            window.google.accounts.id.renderButton(googleSignInDiv, {
                theme: "outline",
                size: "large",
                text: "continue_with",
                logo_alignment: "left"
            });
        }
    }

    // Force reload navbar
    async reloadNavbar() {
        console.log('🔄 Reloading navbar...');
        this.navbarLoaded = false;
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            navbarContainer.innerHTML = '';
        }
        await this.loadNavbar();
    }

    // Update user profile information in navbar
    updateUserProfile() {
        if (!this.currentUser) {
            console.log('⚠️ No current user to update profile');
            return;
        }

        console.log('👤 Updating user profile in navbar:', this.currentUser.email);

        // Update user name
        const userNameElements = document.querySelectorAll('.user-name, #user-display-name');
        userNameElements.forEach(element => {
            if (element) {
                const displayName = this.currentUser.firstName 
                    ? `${this.currentUser.firstName} ${this.currentUser.lastName || ''}`.trim()
                    : this.currentUser.name || 'User';
                element.textContent = displayName;
                console.log('✅ Updated user name:', displayName);
            }
        });
        
        // Update profile image
        const userImageElements = document.querySelectorAll('.profile-icon img, #user-profile-image');
        userImageElements.forEach(element => {
            if (element) {
                if (this.currentUser.profileImage) {
                    element.src = this.currentUser.profileImage;
                    element.alt = `${this.currentUser.name || 'User'} Profile`;
                    element.style.display = 'block';
                    console.log('✅ Updated profile image');
                } else {
                    element.src = this.getDefaultProfileImage(this.currentUser.type);
                    element.alt = `${this.currentUser.name || 'User'} Profile`;
                    console.log('✅ Set default profile image for:', this.currentUser.type);
                }
            }
        });

        // Update profile initials if no image
        const profilePlaceholders = document.querySelectorAll('.profile-initials');
        profilePlaceholders.forEach(element => {
            if (element && !this.currentUser.profileImage) {
                const initials = this.getUserInitials();
                element.textContent = initials;
                console.log('✅ Updated profile initials:', initials);
            }
        });
    }

    // Update user data and refresh navbar
    async updateUserData(newUserData) {
        if (!this.currentUser) return;

        // Merge new data with existing data
        this.currentUser = { ...this.currentUser, ...newUserData };
        
        // Update localStorage
        localStorage.setItem('skillhub_user', JSON.stringify(this.currentUser));
        
        // Update navbar
        this.updateUserProfile();
        
        console.log('✅ User data updated:', newUserData);
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
                console.log('🚪 Sign out clicked from navbar');
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

        console.log('✅ Navbar events setup complete');
    }

    // Setup logout handlers for dashboard pages
    setupLogoutHandlers() {
        const logoutButtons = document.querySelectorAll('.logout-btn, .logout, #logoutBtn');
        logoutButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚪 Dashboard logout clicked');
                this.signOut();
            });
        });
    }

    // Setup global event listeners
    setupEventListeners() {
        // Listen for storage changes (for multi-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'skillhub_authenticated' || e.key === 'skillhub_user') {
                console.log('🔄 Storage changed, updating auth state');
                this.checkAuthenticationStatus();
                this.reloadNavbar();
            }
        });

        // Listen for page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkAuthenticationStatus();
            }
        });

        // Listen for custom profile update events
        window.addEventListener('profileUpdated', (e) => {
            console.log('👤 Profile update event received:', e.detail);
            this.updateUserData(e.detail);
        });

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.loadNavbar(), 50);
            });
        }
    }

    // Handle successful sign in
    async signIn(userData, userType = 'learner') {
        console.log('🔐 Signing in user:', userData.email, 'Type:', userType);

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
        
        console.log('✅ User signed in successfully:', this.currentUser.email);
        
        // Reload navbar to show authenticated state
        await this.reloadNavbar();
        
        // Redirect based on user type
        this.redirectAfterSignIn(userType);
        
        return true;
    }

    // Sign out user
    async signOut() {
        console.log('🚪 Signing out user:', this.currentUser?.email);
        
        const userType = this.currentUser?.type || 'learner';
        
        // Clear authentication state
        this.clearAuthData();
        
        // Clear any user-specific data
        ['learnerEmail', 'teacherEmail', 'sponsorEmail'].forEach(key => {
            localStorage.removeItem(key);
        });
        
        console.log('✅ User signed out, reloading navbar and redirecting...');
        
        // Reload navbar to show guest state
        await this.reloadNavbar();
        
        // Small delay to ensure navbar loads before redirect
        setTimeout(() => {
            this.redirectAfterSignOut(userType);
        }, 200);
    }

    // Redirect after sign out based on user type
    redirectAfterSignOut(userType) {
        window.location.href = 'index.html'; // Your single redirect page
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
            teacher: 'profile_settings.html',
            sponsor: 'sponsordashboard1.html'
        };

        const redirectUrl = redirectMap[userType] || 'dashboard.html';
        
        console.log('🔄 Redirecting after sign in to:', redirectUrl);
        
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

    // Show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10001;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 500;
            animation: slideInRight 0.3s ease;
        `;
        errorDiv.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
            style.remove();
        }, 5000);
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
    async refreshAuthState() {
        console.log('🔄 Refreshing auth state...');
        this.checkAuthenticationStatus();
        await this.reloadNavbar();
    }

    // Check if user should be redirected (for protected pages)
    requireAuthentication(requiredUserType = null) {
        if (!this.isAuthenticated) {
            console.log('🔒 Authentication required, redirecting to login');
            this.showSignInOptions();
            return false;
        }

        if (requiredUserType && this.currentUser?.type !== requiredUserType) {
            console.log(`🚫 Wrong user type. Required: ${requiredUserType}, Current: ${this.currentUser?.type}`);
            alert(`This page is only accessible to ${requiredUserType}s.`);
            this.redirectAfterSignOut(this.currentUser?.type);
            return false;
        }

        return true;
    }

    // Email uniqueness check
    async checkEmailExists(email, userType) {
        try {
            const response = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, userType })
            });

            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
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

// Profile update function for forms
window.updateProfile = (newData) => {
    return skillHubAuth.updateUserData(newData);
};

// Custom event dispatcher for profile updates
window.dispatchProfileUpdate = (updatedData) => {
    const event = new CustomEvent('profileUpdated', { 
        detail: updatedData 
    });
    window.dispatchEvent(event);
};

console.log('✅ SkillHub Enhanced Authentication System Initialized');

// Auto-fill social auth data on signup pages if available
document.addEventListener('DOMContentLoaded', () => {
    const socialAuthData = sessionStorage.getItem('socialAuthData');
    if (socialAuthData) {
        try {
            const data = JSON.parse(socialAuthData);
            
            // Fill form fields if they exist
            const fields = {
                'first-name': data.firstName,
                'last-name': data.lastName,
                'email': data.email
            };

            Object.entries(fields).forEach(([fieldId, value]) => {
                const field = document.getElementById(fieldId);
                if (field && value) {
                    field.value = value;
                    field.readOnly = true; // Make email read-only for social auth
                    if (fieldId === 'email') {
                        field.style.backgroundColor = '#f8f9fa';
                    }
                }
            });

            // Show social auth indicator
            const emailField = document.getElementById('email');
            if (emailField && data.provider) {
                const indicator = document.createElement('div');
                indicator.style.cssText = `
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                `;
                indicator.textContent = `${data.provider.charAt(0).toUpperCase() + data.provider.slice(1)} Account`;
                
                const parent = emailField.parentElement;
                parent.style.position = 'relative';
                parent.appendChild(indicator);
            }

            console.log('✅ Social auth data pre-filled');
        } catch (error) {
            console.error('Error parsing social auth data:', error);
        }
    }
});