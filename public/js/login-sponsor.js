// Corrected login-sponsor.js - matches actual HTML form IDs
document.addEventListener('DOMContentLoaded', () => {
    // Use the correct form ID from login-sponsor.html
    const form = document.getElementById('sponsor-signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.querySelector('.signin-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Debug: Log what elements we found
    console.log('Sponsor form found:', !!form);
    console.log('Email input found:', !!emailInput);
    console.log('Password input found:', !!passwordInput);
    console.log('Signin button found:', !!signinBtn);

    // Check if elements exist before proceeding
    if (!form) {
        console.error('Sponsor signin form not found! Looking for ID: sponsor-signin-form');
        return;
    }
    
    if (!emailInput || !passwordInput || !signinBtn) {
        console.error('Required form elements not found:', {
            email: !!emailInput,
            password: !!passwordInput,
            button: !!signinBtn
        });
        return;
    }

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
    
    // Insert error message before submit button
    form.insertBefore(errorMessage, signinBtn);

    // Password visibility toggle
    const passwordGroup = passwordInput.closest('.form-group');
    if (passwordGroup) {
        passwordGroup.style.position = 'relative';
        
        const togglePassword = document.createElement('span');
        togglePassword.className = 'toggle-password';
        togglePassword.innerHTML = '👁️';
        togglePassword.style.cssText = `
            position: absolute;
            right: 15px;
            top: 70%;
            transform: translateY(-50%);
            cursor: pointer;
            user-select: none;
            font-size: 1.2rem;
            z-index: 10;
        `;
        
        passwordGroup.appendChild(togglePassword);

        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            togglePassword.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Real-time validation feedback
    const validateInput = () => {
        // Email validation
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = '#ddd';
        } else if (!validateEmail(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4d4d';
        } else {
            emailInput.style.borderColor = '#007bff'; // Blue for sponsor
        }

        // Password validation
        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ddd';
        } else if (passwordInput.value.trim().length < 6) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else {
            passwordInput.style.borderColor = '#007bff'; // Blue for sponsor
        }
    };

    // Add event listeners for real-time validation
    emailInput.addEventListener('input', validateInput);
    passwordInput.addEventListener('input', validateInput);

    // Clear error message when user starts typing
    emailInput.addEventListener('input', () => {
        hideError();
    });
    passwordInput.addEventListener('input', () => {
        hideError();
    });

    // Form submission handling
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Sponsor login attempt for:', email);

        // Reset error message
        hideError();

        // Basic validation
        if (!email || !password) {
            showError('Please fill in all fields.');
            return;
        }

        if (!validateEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            console.log('Making API call to /api/auth/login...');
            
            // API call to backend
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userType: 'sponsor'
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Sponsor login response:', data);

            if (data.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    localStorage.setItem('sponsorEmail', email);
                } else {
                    localStorage.removeItem('sponsorEmail');
                }

                // Store user data and token
                localStorage.setItem('skillhub_user', JSON.stringify(data.user));
                localStorage.setItem('skillhub_authenticated', 'true');
                if (data.token) {
                    localStorage.setItem('skillhub_token', data.token);
                }

                // Show success message
                showSuccess('Login successful! Redirecting...');

                // Redirect after a short delay
                setTimeout(() => {
                    // Try to use SkillHub Auth system first
                    if (window.SkillHubAuth) {
                        try {
                            window.SkillHubAuth.signIn(data.user, 'sponsor');
                        } catch (authError) {
                            console.error('Auth system error:', authError);
                            // Fallback redirect
                            window.location.href = 'sponsor-dashboard.html';
                        }
                    } else {
                        // Direct redirect if auth system not available
                        window.location.href = 'sponsor-dashboard.html';
                    }
                }, 1500);
            } else {
                showError(data.message || 'Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Sponsor login error:', error);
            
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                showError('Unable to connect to server. Please check your connection and try again.');
            } else if (error.message.includes('404')) {
                showError('Login service not found. Please contact support.');
            } else if (error.message.includes('500')) {
                showError('Server error. Please try again later.');
            } else {
                showError('Login failed. Please try again.');
            }
        } finally {
            // Reset button state
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
        errorMessage.style.color = '#007bff';
        errorMessage.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
        errorMessage.style.borderColor = 'rgba(0, 123, 255, 0.3)';
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
    const savedEmail = localStorage.getItem('sponsorEmail');
    if (savedEmail && rememberMeCheckbox) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Social login handlers (placeholder functionality)
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.textContent.trim().includes('Google') ? 'Google' : 'Facebook';
            showError(`${platform} sign-in is not yet implemented. Please use email and password.`);
        });
    });

    // Accessibility enhancements
    form.setAttribute('aria-label', 'Sponsor Sign In Form');
    emailInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    signinBtn.setAttribute('aria-label', 'Submit sponsor login credentials');

    console.log('✅ Sponsor login form initialized successfully');
});