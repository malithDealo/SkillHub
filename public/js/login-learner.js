// FIXED login-learner.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('learner-signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.querySelector('.signin-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    console.log('Learner form found:', !!form);

    if (!form || !emailInput || !passwordInput || !signinBtn) {
        console.error('Required form elements not found');
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
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = '#ddd';
        } else if (!validateEmail(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4d4d';
        } else {
            emailInput.style.borderColor = '#4CAF50';
        }

        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ddd';
        } else if (passwordInput.value.trim().length < 6) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else {
            passwordInput.style.borderColor = '#4CAF50';
        }
    };

    emailInput.addEventListener('input', validateInput);
    passwordInput.addEventListener('input', validateInput);

    emailInput.addEventListener('input', () => hideError());
    passwordInput.addEventListener('input', () => hideError());

    // Enhanced login success handler function
    function handleLoginSuccess(data, userType) {
        console.log(`${userType} login successful:`, data);
        
        // Store user data and token
        const userData = {
            id: data.user.id || Date.now(),
            name: data.user.name || `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim(),
            email: data.user.email,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            type: userType,
            profileImage: data.user.profileImage || null,
            ...data.user
        };
        
        localStorage.setItem('skillhub_user', JSON.stringify(userData));
        localStorage.setItem('skillhub_authenticated', 'true');
        
        if (data.token) {
            localStorage.setItem('skillhub_token', data.token);
        }

        showSuccess('Login successful! Redirecting...');

        // Use SkillHub Auth system if available
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

        console.log('Learner login attempt for:', email);

        hideError();

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

        setLoadingState(true);

        try {
            console.log('Making API call to /api/auth/login...');
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userType: 'learner'
                })
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox && rememberMeCheckbox.checked) {
                    localStorage.setItem('learnerEmail', email);
                } else {
                    localStorage.removeItem('learnerEmail');
                }
                
                // FIXED: Use correct user type
                handleLoginSuccess(data, 'learner');
            } else {
                showError(data.message || 'Login failed. Please check your credentials and try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            
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
        errorMessage.style.color = '#4CAF50';
        errorMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        errorMessage.style.borderColor = 'rgba(76, 175, 80, 0.3)';
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
    const savedEmail = localStorage.getItem('learnerEmail');
    if (savedEmail && rememberMeCheckbox) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Social login handlers
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.textContent.trim().includes('Google') ? 'Google' : 'Facebook';
            showError(`${platform} sign-in is not yet implemented. Please use email and password.`);
        });
    });

    form.setAttribute('aria-label', 'Learner Sign In Form');
    emailInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    signinBtn.setAttribute('aria-label', 'Submit login credentials');

    console.log('✅ Learner login form initialized successfully');
});

// FIXED login-teacher.js - Update the form submission success handling
// Replace the success handling section in login-teacher.js with:

// if (data.success) {
//     if (rememberMeCheckbox && rememberMeCheckbox.checked) {
//         localStorage.setItem('teacherEmail', email);
//     } else {
//         localStorage.removeItem('teacherEmail');
//     }
//     
//     // FIXED: Use correct user type - TEACHER not learner
//     handleLoginSuccess(data, 'teacher');
// }

// FIXED login-sponsor.js - Update the form submission success handling  
// Replace the success handling section in login-sponsor.js with:

// if (data.success) {
//     if (rememberMeCheckbox && rememberMeCheckbox.checked) {
//         localStorage.setItem('sponsorEmail', email);
//     } else {
//         localStorage.removeItem('sponsorEmail');
//     }
//     
//     // FIXED: Use correct user type - SPONSOR not learner  
//     handleLoginSuccess(data, 'sponsor');
// }