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

    // Form submission handling
    form.addEventListener('submit', (e) => {
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

        // Simulate API call (modified to always succeed if fields are filled)
        setTimeout(() => {
            const mockResponse = {
                success: true, // Always success if fields are valid
                message: 'Invalid email or password.'
            };

            if (mockResponse.success) {
                // Handle "Remember Me" functionality
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem('teacherEmail', email);
                    localStorage.setItem('teacherPassword', password); // Note: Insecure for production
                } else {
                    localStorage.removeItem('teacherEmail');
                    localStorage.removeItem('teacherPassword');
                }

                // Show success alert
                alert('Login successful! Redirecting to teacher dashboard...');
                // window.location.href = '/teacher-dashboard.html'; // Uncomment for actual redirect
            } else {
                errorMessage.textContent = mockResponse.message;
                errorMessage.style.display = 'block';
            }

            // Reset button state
            signinBtn.disabled = false;
            signinBtn.textContent = 'Sign In';
        }, 1500); // Simulated delay
    });

    // Pre-fill form if "Remember Me" was previously checked
    const savedEmail = localStorage.getItem('teacherEmail');
    const savedPassword = localStorage.getItem('teacherPassword');
    if (savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }

    // Accessibility enhancements
    form.setAttribute('aria-label', 'Teacher Sign In Form');
    emailInput.setAttribute('aria-required', 'true');
    passwordInput.setAttribute('aria-required', 'true');
    signinBtn.setAttribute('aria-label', 'Submit teacher login credentials');
});