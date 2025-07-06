document.addEventListener('DOMContentLoaded', () => {
    // Role Selection: Toggle between Learning and Teaching options
    const options = document.querySelectorAll('.role-select .option');
    if (options.length > 0) {
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                const value = option.getAttribute('data-value');
                if (value === 'teaching') {
                    window.location.href = "works_teaching.html";
                }
                // No action for 'learning' since this is the learning page
            });
        });
    }

    // CTA Button: Redirect alert for Get Started button
    const getStartedBtn = document.querySelector('.get-started');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            alert('Redirecting to registration page!');
        });
    }
});