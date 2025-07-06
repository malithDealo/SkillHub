// Updated login-teacher.js
// Replace your existing login-teacher.js with this code

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('teacher-signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.querySelector('.signin-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Create error message element
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.style.color = '#ff4d4d';
    errorMessage.style.fontSize = '0.9rem';
    errorMessage.style.marginTop = '0.5rem';
    errorMessage.style.display = 'none';
    form.insertBefore(errorMessage, signinBtn);

    // Password visibility toggle
    const togglePassword = document.createElement('span');
    togglePassword.className = 'toggle-password';
    togglePassword.innerHTML = '👁️';
    togglePassword.style.position = 'absolute';
    togglePassword.style.right = '10px';
    togglePassword.style.top = '50%';
    togglePassword.style.transform = 'translateY(-50%)';
    togglePassword.style.cursor = 'pointer';
    passwordInput.parentElement.style.position = 'relative';
    passwordInput.parentElement.appendChild(togglePassword);

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Real-time validation feedback
    const validateInput = () => {
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = '#ff4d4d';
        } else if (!validateEmail(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4d4d';
        } else {
            emailInput.style.borderColor = '#6A1B9A';
        }

        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else if (passwordInput.value.trim().length < 6) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else {
            passwordInput.style.borderColor = '#6A1B9A';
        }
    };

    emailInput.addEventListener('input', validateInput);
    passwordInput.addEventListener('input', validateInput);

    // Form submission handling with API integration
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Reset error message
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Basic validation
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in all fields.';
            errorMessage.style.display = 'block';
            return;
        }

        if (!validateEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            errorMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long.';
            errorMessage.style.display = 'block';
            return;
        }

        // Show loading state
        signinBtn.disabled = true;
        signinBtn.textContent = 'Signing In...';

        try {
            // API call to backend
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    userType: 'teacher'
                })
            });

            const data = await response.json();

            if (data.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('teacherEmail', email);
                } else {
                    localStorage.removeItem('teacherEmail');
                }

                // Store user data and token
                localStorage.setItem('skillhub_user', JSON.stringify(data.user));
                localStorage.setItem('skillhub_authenticated', 'true');
                localStorage.setItem('skillhub_token', data.token);

                // Use SkillHub Auth system to sign in
                if (window.SkillHubAuth) {
                    await window.SkillHubAuth.signIn(data.user, 'teacher');
                } else {
                    // Fallback redirect
                    window.location.href = 'teacher-dashboard.html';
                }
            } else {
                errorMessage.textContent = data.message || 'Login failed. Please try again.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Network error. Please check your connection and try again.';
            errorMessage.style.display = 'block';
        } finally {
            // Reset button state
            signinBtn.disabled = false;
            signinBtn.textContent = 'Sign In';
        }
    });

    // Pre-fill form if "Remember Me" was previously checked
    const savedEmail = localStorage.getItem('teacherEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Accessibility enhancements
    form.setAttribute('aria-label', 'Teacher Sign In Form');
    emailInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    signinBtn.setAttribute('aria-label', 'Submit teacher login credentials');
});

// Similar updates for login-learner.js
// Replace your existing login-learner.js with this code

// login-learner.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('learner-signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.querySelector('.signin-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Create error message element
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.style.color = '#ff4d4d';
    errorMessage.style.fontSize = '0.9rem';
    errorMessage.style.marginTop = '0.5rem';
    errorMessage.style.display = 'none';
    form.insertBefore(errorMessage, signinBtn);

    // Password visibility toggle
    const togglePassword = document.createElement('span');
    togglePassword.className = 'toggle-password';
    togglePassword.innerHTML = '👁️';
    togglePassword.style.position = 'absolute';
    togglePassword.style.right = '10px';
    togglePassword.style.top = '50%';
    togglePassword.style.transform = 'translateY(-50%)';
    togglePassword.style.cursor = 'pointer';
    passwordInput.parentElement.style.position = 'relative';
    passwordInput.parentElement.appendChild(togglePassword);

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Real-time validation feedback
    const validateInput = () => {
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = '#ff4d4d';
        } else if (!validateEmail(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4d4d';
        } else {
            emailInput.style.borderColor = '#4CAF50';
        }

        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else if (passwordInput.value.trim().length < 6) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else {
            passwordInput.style.borderColor = '#4CAF50';
        }
    };

    emailInput.addEventListener('input', validateInput);
    passwordInput.addEventListener('input', validateInput);

    // Form submission handling with API integration
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Reset error message
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Basic validation
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in all fields.';
            errorMessage.style.display = 'block';
            return;
        }

        if (!validateEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            errorMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long.';
            errorMessage.style.display = 'block';
            return;
        }

        // Show loading state
        signinBtn.disabled = true;
        signinBtn.textContent = 'Signing In...';

        try {
            // API call to backend
            const response = await fetch('http://localhost:3000/api/auth/login', {
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

            const data = await response.json();

            if (data.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('learnerEmail', email);
                } else {
                    localStorage.removeItem('learnerEmail');
                }

                // Store user data and token
                localStorage.setItem('skillhub_user', JSON.stringify(data.user));
                localStorage.setItem('skillhub_authenticated', 'true');
                localStorage.setItem('skillhub_token', data.token);

                // Use SkillHub Auth system to sign in
                if (window.SkillHubAuth) {
                    await window.SkillHubAuth.signIn(data.user, 'learner');
                } else {
                    // Fallback redirect
                    window.location.href = 'learner-dashboard.html';
                }
            } else {
                errorMessage.textContent = data.message || 'Login failed. Please try again.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Network error. Please check your connection and try again.';
            errorMessage.style.display = 'block';
        } finally {
            // Reset button state
            signinBtn.disabled = false;
            signinBtn.textContent = 'Sign In';
        }
    });

    // Pre-fill form if "Remember Me" was previously checked
    const savedEmail = localStorage.getItem('learnerEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Accessibility enhancements
    form.setAttribute('aria-label', 'Learner Sign In Form');
    emailInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    signinBtn.setAttribute('aria-label', 'Submit login credentials');
});

// login-sponsor.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('sponsor-signin-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signinBtn = document.querySelector('.signin-btn');
    const rememberMeCheckbox = document.getElementById('remember-me');
    
    // Create error message element
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.style.color = '#ff4d4d';
    errorMessage.style.fontSize = '0.9rem';
    errorMessage.style.marginTop = '0.5rem';
    errorMessage.style.display = 'none';
    form.insertBefore(errorMessage, signinBtn);

    // Password visibility toggle
    const togglePassword = document.createElement('span');
    togglePassword.className = 'toggle-password';
    togglePassword.innerHTML = '👁️';
    togglePassword.style.position = 'absolute';
    togglePassword.style.right = '10px';
    togglePassword.style.top = '50%';
    togglePassword.style.transform = 'translateY(-50%)';
    togglePassword.style.cursor = 'pointer';
    passwordInput.parentElement.style.position = 'relative';
    passwordInput.parentElement.appendChild(togglePassword);

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Real-time validation feedback
    const validateInput = () => {
        if (!emailInput.value.trim()) {
            emailInput.style.borderColor = '#ff4d4d';
        } else if (!validateEmail(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4d4d';
        } else {
            emailInput.style.borderColor = '#4CAF50';
        }

        if (!passwordInput.value.trim()) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else if (passwordInput.value.trim().length < 6) {
            passwordInput.style.borderColor = '#ff4d4d';
        } else {
            passwordInput.style.borderColor = '#4CAF50';
        }
    };

    emailInput.addEventListener('input', validateInput);
    passwordInput.addEventListener('input', validateInput);

    // Form submission handling with API integration
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Reset error message
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Basic validation
        if (!email || !password) {
            errorMessage.textContent = 'Please fill in all fields.';
            errorMessage.style.display = 'block';
            return;
        }

        if (!validateEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            errorMessage.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long.';
            errorMessage.style.display = 'block';
            return;
        }

        // Show loading state
        signinBtn.disabled = true;
        signinBtn.textContent = 'Signing In...';

        try {
            // API call to backend
            const response = await fetch('http://localhost:3000/api/auth/login', {
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

            const data = await response.json();

            if (data.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('sponsorEmail', email);
                } else {
                    localStorage.removeItem('sponsorEmail');
                }

                // Store user data and token
                localStorage.setItem('skillhub_user', JSON.stringify(data.user));
                localStorage.setItem('skillhub_authenticated', 'true');
                localStorage.setItem('skillhub_token', data.token);

                // Use SkillHub Auth system to sign in
                if (window.SkillHubAuth) {
                    await window.SkillHubAuth.signIn(data.user, 'sponsor');
                } else {
                    // Fallback redirect
                    window.location.href = 'sponsor-dashboard.html';
                }
            } else {
                errorMessage.textContent = data.message || 'Login failed. Please try again.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.textContent = 'Network error. Please check your connection and try again.';
            errorMessage.style.display = 'block';
        } finally {
            // Reset button state
            signinBtn.disabled = false;
            signinBtn.textContent = 'Sign In';
        }
    });

    // Pre-fill form if "Remember Me" was previously checked
    const savedEmail = localStorage.getItem('sponsorEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }

    // Accessibility enhancements
    form.setAttribute('aria-label', 'Sponsor Sign In Form');
    emailInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    signinBtn.setAttribute('aria-label', 'Submit sponsor login credentials');
});