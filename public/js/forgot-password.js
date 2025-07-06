document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const resetBtn = document.querySelector('.reset-btn');

    // Create error and success message elements
    const errorMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    errorMessage.style.display = 'none';
    form.appendChild(errorMessage);

    const successMessage = document.createElement('p');
    successMessage.className = 'success-message';
    successMessage.textContent = 'A reset link has been sent to your email!';
    successMessage.style.display = 'none';
    form.appendChild(successMessage);

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
            emailInput.style.borderColor = '#4CAF50'; /* Green theme */
        }
    };

    emailInput.addEventListener('input', validateInput);

    // Form submission handling
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        // Reset messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Basic validation
        if (!email) {
            errorMessage.textContent = 'Please enter your email.';
            errorMessage.style.display = 'block';
            return;
        }

        if (!validateEmail(email)) {
            errorMessage.textContent = 'Please enter a valid email address.';
            errorMessage.style.display = 'block';
            return;
        }

        // Show loading state
        resetBtn.disabled = true;
        resetBtn.textContent = 'Sending...';

        // Simulate API call (modified to always succeed if email is valid)
        setTimeout(() => {
            const mockResponse = {
                success: true,
                message: 'Email not found.'
            };

            if (mockResponse.success) {
                successMessage.style.display = 'block';
                form.reset();
                emailInput.style.borderColor = '#ddd';
            } else {
                errorMessage.textContent = mockResponse.message;
                errorMessage.style.display = 'block';
            }

            // Reset button state
            resetBtn.disabled = false;
            resetBtn.textContent = 'Send Reset Link';
        }, 1500); // Simulated delay
    });

    // Accessibility enhancements
    form.setAttribute('aria-label', 'Forgot Password Form');
    emailInput.setAttribute('aria-required', 'true');
    resetBtn.setAttribute('aria-label', 'Submit email to send password reset link');
});