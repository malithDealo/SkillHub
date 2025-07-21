// Enhanced form handlers - Add this to your login and signup JS files

// Enhanced email validation with uniqueness checking
class FormValidator {
    constructor(userType) {
        this.userType = userType;
        this.emailCheckTimeout = null;
    }

    // Real-time email validation with uniqueness check
    async validateEmailRealTime(emailInput, errorContainer) {
        const email = emailInput.value.trim();
        
        // Clear previous timeout
        if (this.emailCheckTimeout) {
            clearTimeout(this.emailCheckTimeout);
        }

        // Basic validation first
        if (!email) {
            this.clearEmailValidation(emailInput, errorContainer);
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showEmailError(emailInput, errorContainer, 'Please enter a valid email address');
            return;
        }

        // Show checking state
        this.showEmailChecking(emailInput, errorContainer);

        // Debounce the API call
        this.emailCheckTimeout = setTimeout(async () => {
            try {
                const response = await fetch('/api/auth/check-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        userType: this.userType
                    })
                });

                const data = await response.json();

                if (data.success) {
                    if (data.exists) {
                        if (data.canLogin) {
                            // Email exists with same user type - good for login
                            this.showEmailSuccess(emailInput, errorContainer, 'Email found! You can sign in.');
                        } else {
                            // Email exists with different user type
                            this.showEmailError(
                                emailInput, 
                                errorContainer, 
                                `This email is already registered as a ${data.existingUserType}. Please use the ${data.existingUserType} login.`
                            );
                        }
                    } else {
                        // For signup forms
                        if (window.location.href.includes('signup')) {
                            this.showEmailSuccess(emailInput, errorContainer, 'Email is available!');
                        } else {
                            // For login forms
                            this.showEmailError(emailInput, errorContainer, 'No account found with this email and role.');
                        }
                    }
                } else {
                    this.showEmailError(emailInput, errorContainer, 'Unable to verify email. Please try again.');
                }
            } catch (error) {
                console.error('Email validation error:', error);
                this.showEmailError(emailInput, errorContainer, 'Unable to verify email. Please check your connection.');
            }
        }, 500); // 500ms delay
    }

    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    clearEmailValidation(emailInput, errorContainer) {
        emailInput.style.borderColor = '#ddd';
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        this.removeEmailIndicator(emailInput);
    }

    showEmailChecking(emailInput, errorContainer) {
        emailInput.style.borderColor = '#ffc107';
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        this.addEmailIndicator(emailInput, '⏳', '#ffc107', 'Checking...');
    }

    showEmailSuccess(emailInput, errorContainer, message) {
        emailInput.style.borderColor = '#28a745';
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
        this.addEmailIndicator(emailInput, '✓', '#28a745', message);
    }

    showEmailError(emailInput, errorContainer, message) {
        emailInput.style.borderColor = '#dc3545';
        if (errorContainer) {
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';
            errorContainer.style.color = '#dc3545';
        }
        this.addEmailIndicator(emailInput, '✗', '#dc3545', message);
    }

    addEmailIndicator(emailInput, icon, color, tooltip) {
        this.removeEmailIndicator(emailInput);
        
        const indicator = document.createElement('span');
        indicator.className = 'email-indicator';
        indicator.innerHTML = icon;
        indicator.title = tooltip;
        indicator.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: ${color};
            font-weight: bold;
            z-index: 10;
            pointer-events: none;
        `;

        const parent = emailInput.parentElement;
        parent.style.position = 'relative';
        parent.appendChild(indicator);
    }

    removeEmailIndicator(emailInput) {
        const existing = emailInput.parentElement.querySelector('.email-indicator');
        if (existing) {
            existing.remove();
        }
    }
}

// Enhanced login form initialization
function initializeEnhancedLoginForm(userType) {
    const form = document.getElementById(`${userType}-signin-form`);
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.querySelector('.signin-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    if (!form || !emailInput || !passwordInput || !signinBtn) {
        console.error('Required form elements not found');
        return;
    }

    const validator = new FormValidator(userType);

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
        color: #ff4d4d;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        display: none;
        background: rgba(255, 77, 77, 0.1);
        padding: 0.8rem;
        border-radius: 6px;
        border: 1px solid rgba(255, 77, 77, 0.3);
        text-align: center;
    `;
    
    form.insertBefore(errorMessage, signinBtn);

    // Email validation with uniqueness check
    emailInput.addEventListener('input', () => {
        validator.validateEmailRealTime(emailInput, errorMessage);
        hideError();
    });

    // Password validation
    passwordInput.addEventListener('input', () => {
        validatePasswordInput();
        hideError();
    });

    function validatePasswordInput() {
        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ddd';
        } else if (passwordInput.value.trim().length < 6) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else {
            passwordInput.style.borderColor = getColorForUserType(userType);
        }
    }

    function getColorForUserType(type) {
        const colors = {
            learner: '#4CAF50',
            teacher: '#6976DE',
            sponsor: '#F4A261'
        };
        return colors[type] || '#4CAF50';
    }

    // Enhanced login success handler
    function handleLoginSuccess(data, userType) {
        console.log(`${userType} login successful:`, data);
        
        const userData = {
            id: data.user.id || Date.now(),
            name: data.user.name || `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim(),
            email: data.user.email,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            type: userType,
            profileImage: data.user.profileImage || data.user.profile_image || null,
            ...data.user
        };
        
        localStorage.setItem('skillhub_user', JSON.stringify(userData));
        localStorage.setItem('skillhub_authenticated', 'true');
        
        if (data.token) {
            localStorage.setItem('skillhub_token', data.token);
        }

        showSuccess('Login successful! Redirecting...');

        // Use SkillHub Auth system
        if (window.SkillHubAuth) {
            try {
                window.SkillHubAuth.signIn(userData, userType);
                return;
            } catch (authError) {
                console.error('Auth system error:', authError);
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

    // Form submission handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log(`${userType} login attempt for:`, email);

        hideError();

        if (!email || !password) {
            showError('Please fill in all fields.');
            return;
        }

        if (!validator.isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        setLoadingState(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userType: userType
                })
            });

            const data = await response.json();

            if (data.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    localStorage.setItem(`${userType}Email`, email);
                } else {
                    localStorage.removeItem(`${userType}Email`);
                }
                
                handleLoginSuccess(data, userType);
            } else {
                showError(data.message || 'Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error(`${userType} login error:`, error);
            
            if (error.message.includes('Failed to fetch')) {
                showError('Unable to connect to server. Please check your connection and try again.');
            } else {
                showError('Login failed. Please try again.');
            }
        } finally {
            setLoadingState(false);
        }
    });

    // Helper functions
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#ff4d4d';
        errorMessage.style.backgroundColor = 'rgba(255, 77, 77, 0.1)';
        errorMessage.style.borderColor = 'rgba(255, 77, 77, 0.3)';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = getColorForUserType(userType);
        errorMessage.style.backgroundColor = `rgba(${getColorForUserType(userType).slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.1)`;
        errorMessage.style.borderColor = `rgba(${getColorForUserType(userType).slice(1).match(/.{2}/g).map(hex => parseInt(hex, 16)).join(', ')}, 0.3)`;
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            signinBtn.disabled = true;
            signinBtn.textContent = 'Signing In...';
            emailInput.disabled = true;
            passwordInput.disabled = true;
            if (rememberMeCheckbox) rememberMeCheckbox.disabled = true;
        } else {
            signinBtn.disabled = false;
            signinBtn.textContent = 'Sign In';
            emailInput.disabled = false;
            passwordInput.disabled = false;
            if (rememberMeCheckbox) rememberMeCheckbox.disabled = false;
        }
    }

    // Pre-fill form if "Remember Me" was previously checked
    const savedEmail = localStorage.getItem(`${userType}Email`);
    if (savedEmail && rememberMeCheckbox) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
        // Trigger validation for saved email
        validator.validateEmailRealTime(emailInput, errorMessage);
    }

    // Social login handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.textContent.trim().includes('Google') ? 'Google' : 'Facebook';
            
            if (platform === 'Google' && window.SkillHubAuth) {
                // Trigger Google Sign-In
                if (window.google && window.google.accounts) {
                    window.google.accounts.id.prompt();
                } else {
                    showError('Google Sign-In is not available. Please try again later.');
                }
            } else if (platform === 'Facebook' && window.SkillHubAuth) {
                // Trigger Facebook Sign-In
                window.SkillHubAuth.handleFacebookSignIn();
            } else {
                showError(`${platform} sign-in is not yet implemented. Please use email and password.`);
            }
        });
    });

    console.log(`✅ ${userType} login form initialized successfully`);
}

// Enhanced signup form initialization
function initializeEnhancedSignupForm(userType) {
    const form = document.getElementById(`${userType}-signup-form`);
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signupBtn = document.querySelector('.signup-btn');
    
    if (!form || !emailInput || !passwordInput || !signupBtn) {
        console.error('Required signup form elements not found');
        return;
    }

    const validator = new FormValidator(userType);

    // Create error message element
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.style.cssText = `
        color: #ff4d4d;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        display: none;
        background: rgba(255, 77, 77, 0.1);
        padding: 0.8rem;
        border-radius: 6px;
        border: 1px solid rgba(255, 77, 77, 0.3);
        text-align: center;
    `;
    
    form.insertBefore(errorMessage, signupBtn);

    // Email validation with uniqueness check
    emailInput.addEventListener('input', () => {
        validator.validateEmailRealTime(emailInput, errorMessage);
        hideError();
    });

    // Enhanced form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log(`${userType} signup attempt for:`, data.email);

        hideError();

        // Validate required fields
        if (!data.email || !data.password || !data['first-name'] || !data['last-name']) {
            showError('Please fill in all required fields.');
            return;
        }

        if (!validator.isValidEmail(data.email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (data.password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        // Check if terms are accepted
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            showError('Please accept the Terms of Service and Privacy Policy.');
            return;
        }

        setLoadingState(true);

        try {
            // Prepare signup data based on user type
            const signupData = {
                email: data.email,
                password: data.password,
                userType: userType,
                firstName: data['first-name'],
                lastName: data['last-name'],
                phone: data.phone,
                location: data.location
            };

            // Add user-type specific data
            if (userType === 'teacher') {
                signupData.skills = data.skills ? data.skills.split(',').map(s => s.trim()) : [];
                signupData.about = data.about;
                signupData.experienceYears = parseInt(data.experience) || 0;
                signupData.teachingLanguage = data['teaching-language'];
            } else if (userType === 'learner') {
                signupData.interests = data.interests ? data.interests.split(',').map(s => s.trim()) : [];
                signupData.ageGroup = data['age-group'];
                signupData.preferredLanguage = data.language;
            } else if (userType === 'sponsor') {
                signupData.companyName = data['company-name'];
                signupData.address = data.address;
                signupData.sponsorshipInterests = data.interests ? data.interests.split(',').map(s => s.trim()) : [];
                signupData.about = data.about;
                signupData.budget = parseInt(data.budget) || null;
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signupData)
            });

            const result = await response.json();

            if (result.success) {
                showSuccess('Registration successful! Please sign in to continue.');
                
                // Redirect to login page after a delay
                setTimeout(() => {
                    const loginPages = {
                        learner: 'login-learner.html',
                        teacher: 'login-teacher.html',
                        sponsor: 'login-sponsor.html'
                    };
                    window.location.href = loginPages[userType];
                }, 2000);
            } else {
                showError(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error(`${userType} signup error:`, error);
            showError('Registration failed. Please check your connection and try again.');
        } finally {
            setLoadingState(false);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#ff4d4d';
        errorMessage.style.backgroundColor = 'rgba(255, 77, 77, 0.1)';
        errorMessage.style.borderColor = 'rgba(255, 77, 77, 0.3)';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showSuccess(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.color = '#28a745';
        errorMessage.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        errorMessage.style.borderColor = 'rgba(40, 167, 69, 0.3)';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideError() {
        errorMessage.style.display = 'none';
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            signupBtn.disabled = true;
            signupBtn.textContent = 'Creating Account...';
            
            // Disable all form inputs
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.disabled = true);
        } else {
            signupBtn.disabled = false;
            signupBtn.textContent = form.dataset.originalText || 'Create My Account';
            
            // Re-enable all form inputs
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => input.disabled = false);
        }
    }

    // Store original button text
    signupBtn.dataset.originalText = signupBtn.textContent;

    console.log(`✅ ${userType} signup form initialized successfully`);
}

// Profile update functionality for dashboard pages
function initializeProfileUpdate() {
    const profileForms = document.querySelectorAll('form[id*="profile"], form[id*="settings"]');
    
    profileForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            try {
                const token = localStorage.getItem('skillhub_token');
                
                const response = await fetch('/api/auth/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    // Update local storage
                    const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || '{}');
                    const updatedUser = { ...currentUser, ...result.user };
                    localStorage.setItem('skillhub_user', JSON.stringify(updatedUser));
                    
                    // Dispatch profile update event
                    window.dispatchProfileUpdate(updatedUser);
                    
                    // Show success message
                    showFormSuccess(form, 'Profile updated successfully!');
                } else {
                    showFormError(form, result.message || 'Failed to update profile');
                }
            } catch (error) {
                console.error('Profile update error:', error);
                showFormError(form, 'Failed to update profile. Please try again.');
            }
        });
    });
}

function showFormSuccess(form, message) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.cssText = `
        background: rgba(40, 167, 69, 0.1);
        color: #28a745;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        border: 1px solid rgba(40, 167, 69, 0.3);
    `;
    messageDiv.textContent = message;
    
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

function showFormError(form, message) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message';
    messageDiv.style.cssText = `
        background: rgba(255, 77, 77, 0.1);
        color: #ff4d4d;
        padding: 0.75rem;
        border-radius: 6px;
        margin-bottom: 1rem;
        border: 1px solid rgba(255, 77, 77, 0.3);
    `;
    messageDiv.textContent = message;
    
    form.insertBefore(messageDiv, form.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

// Initialize based on page type
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Initialize login forms
    if (currentPage === 'login-learner.html') {
        initializeEnhancedLoginForm('learner');
    } else if (currentPage === 'login-teacher.html') {
        initializeEnhancedLoginForm('teacher');
    } else if (currentPage === 'login-sponsor.html') {
        initializeEnhancedLoginForm('sponsor');
    }
    
    // Initialize signup forms
    else if (currentPage === 'signup-learner.html') {
        initializeEnhancedSignupForm('learner');
    } else if (currentPage === 'signup-teacher.html') {
        initializeEnhancedSignupForm('teacher');
    } else if (currentPage === 'signup-sponsor.html') {
        initializeEnhancedSignupForm('sponsor');
    }
    
    // Initialize profile update for dashboard pages
    else if (currentPage.includes('dashboard') || currentPage.includes('profile')) {
        initializeProfileUpdate();
    }
});