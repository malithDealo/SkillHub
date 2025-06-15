document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const signupForm = document.getElementById('learner-signup-form');
    const locationInput = document.getElementById('location');
    const interestsInput = document.getElementById('interests');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');
    const termsCheckbox = document.getElementById('terms');
    const updatesCheckbox = document.querySelector('input[name="updates"]');
    const ageGroupSelect = document.getElementById('age-group');
    const languageSelect = document.getElementById('language');
    let selectedInterests = [];

    // Databases
    const interestsDatabase = [
        "Mathematics", "Calculus", "Algebra", "Statistics", "Geometry",
        "Computer Science", "Web Development", "Python", "Java", "JavaScript",
        "Art History", "Digital Art", "Photography", "Music Theory", "Drawing",
        "Physics", "Chemistry", "Biology", "Astronomy", "Environmental Science",
        "Creative Writing", "Poetry", "Journalism", "Literature", "Linguistics",
        "Economics", "Business", "Entrepreneurship", "Finance", "Accounting",
        "Psychology", "Sociology", "Philosophy", "Political Science", "Anthropology",
        "Graphic Design", "UI/UX", "Animation", "Film Production", "Game Design",
        "Public Speaking", "Debate", "Leadership", "Communication", "Negotiation",
        "Cooking", "Baking", "Nutrition", "Mixology", "Food Science"
    ];

    const commonLocations = [
        "Colombo, Western", "Kandy, Central", "Galle, Southern",
        "Jaffna, Northern", "Anuradhapura, North Central",
        "Trincomalee, Eastern", "Badulla, Uva", "Ratnapura, Sabaragamuwa",
        "Negombo, Western", "Matara, Southern", "Kurunegala, North Western",
        "Batticaloa, Eastern", "Kalutara, Western", "Nuwara Eliya, Central"
    ];

    // Initialize all features
    function init() {
        createPasswordMatrix();
        setupValidationWithoutIcons();
        setupSmartInterests();
        setupSmartLocation();
        setupFormSubmission();
        setupSocialLogins();
        
        // Remove any existing validation tooltips on page load
        clearAllValidationErrors();
    }

    // Clear all validation error states and tooltips
    function clearAllValidationErrors() {
        // Remove any existing error tooltips
        document.querySelectorAll('.validation-tooltip').forEach(tooltip => {
            tooltip.remove();
        });
        
        // Reset all border colors to default
        const allInputs = document.querySelectorAll('input, select');
        allInputs.forEach(input => {
            input.style.borderColor = '#ddd';
        });
    }

    // 1. Password Strength Matrix
    function createPasswordMatrix() {
        const requirements = [
            { id: 'length', text: 'Minimum 8 characters', pattern: /.{8,}/ },
            { id: 'uppercase', text: '1 uppercase letter', pattern: /[A-Z]/ },
            { id: 'number', text: '1 number', pattern: /[0-9]/ },
            { id: 'special', text: '1 special character', pattern: /[^A-Za-z0-9]/ }
        ];

        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'password-matrix';
        
        requirements.forEach(req => {
            const item = document.createElement('div');
            item.id = `req-${req.id}`;
            item.innerHTML = `<span class="req-icon">◯</span> ${req.text}`;
            matrixContainer.appendChild(item);
        });

        passwordInput.parentNode.appendChild(matrixContainer);

        passwordInput.addEventListener('input', () => {
            requirements.forEach(req => {
                const element = document.getElementById(`req-${req.id}`);
                const isValid = req.pattern.test(passwordInput.value);
                element.querySelector('.req-icon').innerHTML = isValid ? '<i class="fas fa-check valid-icon"></i>' : '◯';
                element.style.color = isValid ? '#4CAF50' : '#777';
            });
        });
    }

    // 2. Validation without Icons (except Password)
    function setupValidationWithoutIcons() {
        // Name Validation
        [firstNameInput, lastNameInput].forEach(input => {
            input.addEventListener('input', () => {
                const isValid = /^[a-zA-Z]{2,}$/.test(input.value.trim());
                input.style.borderColor = input.value ? (isValid ? '#4CAF50' : '#ff4444') : '#ddd';
            });

            input.addEventListener('blur', () => {
                if (input.value && !/^[a-zA-Z]{2,}$/.test(input.value.trim())) {
                    showValidationTooltip(input, 'Please enter a valid name (letters only, 2+ characters)');
                } else {
                    hideValidationTooltip(input);
                }
            });
        });

        // Email Validation
        emailInput.addEventListener('input', () => {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
            emailInput.style.borderColor = emailInput.value ? (isValid ? '#4CAF50' : '#ff4444') : '#ddd';
            
            if (isValid) {
                hideValidationTooltip(emailInput);
                predictAgeGroup();
            }
        });

        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                showValidationTooltip(emailInput, 'Please enter a valid email address');
            } else {
                hideValidationTooltip(emailInput);
            }
        });

        // Location Validation
        locationInput.addEventListener('input', () => {
            const isValid = locationInput.value.trim().length > 0;
            locationInput.style.borderColor = isValid ? '#4CAF50' : '#ddd';
        });

        locationInput.addEventListener('blur', () => {
            if (!locationInput.value.trim()) {
                showValidationTooltip(locationInput, 'Please enter your location');
            } else {
                hideValidationTooltip(locationInput);
            }
        });

        // Age Group Validation
        ageGroupSelect.addEventListener('change', () => {
            const isValid = ageGroupSelect.value !== "" && ageGroupSelect.value !== null;
            ageGroupSelect.style.borderColor = isValid ? '#4CAF50' : '#ddd';
        });

        // Language Validation
        languageSelect.addEventListener('change', () => {
            const validLanguages = ['english', 'sinhala', 'tamil'];
            const isValid = validLanguages.includes(languageSelect.value);
            languageSelect.style.borderColor = isValid ? '#4CAF50' : '#ddd';
        });

        // Initialize language validation state
        const validLanguages = ['english', 'sinhala', 'tamil'];
        if (validLanguages.includes(languageSelect.value)) {
            languageSelect.style.borderColor = '#4CAF50';
        }

        // Terms Checkbox Validation
        termsCheckbox.addEventListener('change', () => {
            const isValid = termsCheckbox.checked;
            termsCheckbox.parentNode.style.color = isValid ? '#333' : '#ff4444';
        });

        // Updates Checkbox Validation (optional)
        if (updatesCheckbox) {
            updatesCheckbox.addEventListener('change', () => {
                const isValid = true; // Optional field, always valid
                updatesCheckbox.parentNode.style.color = '#333';
            });
        }
    }

    // Validation tooltip functions
    function showValidationTooltip(element, message) {
        hideValidationTooltip(element); // Remove existing tooltip
        
        const tooltip = document.createElement('div');
        tooltip.className = 'validation-tooltip';
        tooltip.innerHTML = `<span class="tooltip-icon">!</span> ${message}`;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.zIndex = '1000';
        
        document.body.appendChild(tooltip);
        
        // Auto-hide after 5 seconds
        setTimeout(() => hideValidationTooltip(element), 5000);
    }

    function hideValidationTooltip(element) {
        const existingTooltips = document.querySelectorAll('.validation-tooltip');
        existingTooltips.forEach(tooltip => tooltip.remove());
    }

    // 3. Smart Interests with Tags - COMPLETELY FIXED
    function setupSmartInterests() {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'interest-tags';
        interestsInput.parentNode.appendChild(tagsContainer);

        let currentSuggestionIndex = -1;
        let suggestionsContainer = null;

        renderTags();

        function renderTags() {
            tagsContainer.innerHTML = selectedInterests.map(interest => `
                <span class="interest-tag">
                    ${interest}
                    <span class="remove-tag" data-interest="${interest}">×</span>
                </span>
            `).join('');

            // Remove valid class and its associated tick
            tagsContainer.classList.remove('valid');

            // Add remove handlers
            document.querySelectorAll('.remove-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedInterests = selectedInterests.filter(i => i !== btn.dataset.interest);
                    renderTags();
                });
            });

            // Update validation state
            updateInterestsValidation();
        }

        function updateInterestsValidation() {
            const isValid = selectedInterests.length > 0;
            
            // Clear any validation tooltips for interests
            hideValidationTooltip(interestsInput);
            
            // Set border color - green if valid, default if no selection yet
            if (selectedInterests.length > 0) {
                interestsInput.style.borderColor = '#4CAF50';
            } else {
                interestsInput.style.borderColor = '#ddd'; // Neutral state
            }
            
            return isValid;
        }

        function addInterest(interest) {
            const trimmedInterest = interest.trim();
            if (!trimmedInterest) return;

            const exists = selectedInterests.some(i => 
                i.toLowerCase() === trimmedInterest.toLowerCase()
            );

            if (!exists) {
                selectedInterests.push(trimmedInterest);
                renderTags();
            }

            interestsInput.value = '';
            if (suggestionsContainer) {
                suggestionsContainer.remove();
                suggestionsContainer = null;
            }
            currentSuggestionIndex = -1;
        }

        // Enhanced keyboard navigation
        interestsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                
                if (suggestionsContainer) {
                    const suggestions = Array.from(suggestionsContainer.querySelectorAll('.suggestion-item'));
                    if (currentSuggestionIndex >= 0 && suggestions[currentSuggestionIndex]) {
                        addInterest(suggestions[currentSuggestionIndex].textContent);
                        return;
                    }
                }
                
                // Add whatever is typed if no suggestion selected
                if (interestsInput.value.trim()) {
                    addInterest(interestsInput.value.trim());
                }
            }
            
            if (!suggestionsContainer) return;

            const suggestions = Array.from(suggestionsContainer.querySelectorAll('.suggestion-item'));
            if (suggestions.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentSuggestionIndex = (currentSuggestionIndex + 1) % suggestions.length;
                highlightSuggestion(suggestions, currentSuggestionIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentSuggestionIndex = (currentSuggestionIndex - 1 + suggestions.length) % suggestions.length;
                highlightSuggestion(suggestions, currentSuggestionIndex);
            } else if (e.key === 'Escape') {
                suggestionsContainer.remove();
                suggestionsContainer = null;
                currentSuggestionIndex = -1;
            }
        });

        function highlightSuggestion(suggestions, index) {
            suggestions.forEach((suggestion, i) => {
                suggestion.classList.toggle('highlighted', i === index);
                if (i === index) {
                    suggestion.scrollIntoView({ block: 'nearest' });
                }
            });
        }

        interestsInput.addEventListener('input', () => {
            const value = interestsInput.value.trim();
            currentSuggestionIndex = -1;
            
            if (value.length > 1) {
                const filtered = interestsDatabase.filter(item => 
                    item.toLowerCase().includes(value.toLowerCase()) &&
                    !selectedInterests.some(selected => selected.toLowerCase() === item.toLowerCase())
                );
                showSuggestions(interestsInput, filtered);
            } else if (suggestionsContainer) {
                suggestionsContainer.remove();
                suggestionsContainer = null;
            }
        });

        function showSuggestions(inputElement, suggestions) {
            if (suggestionsContainer) {
                suggestionsContainer.remove();
            }

            if (suggestions.length === 0) return;

            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'suggestions-container';

            const inputRect = inputElement.getBoundingClientRect();
            suggestionsContainer.style.position = 'absolute';
            suggestionsContainer.style.width = `${inputRect.width}px`;
            suggestionsContainer.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsContainer.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsContainer.style.zIndex = '1000';

            suggestions.slice(0, 5).forEach((suggestion, index) => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = suggestion;
                
                item.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    addInterest(suggestion);
                });
                
                suggestionsContainer.appendChild(item);
            });

            document.body.appendChild(suggestionsContainer);

            const clickHandler = (e) => {
                if (!suggestionsContainer?.contains(e.target) && e.target !== interestsInput) {
                    if (suggestionsContainer) {
                        suggestionsContainer.remove();
                        suggestionsContainer = null;
                    }
                    document.removeEventListener('click', clickHandler);
                }
            };
            
            document.addEventListener('click', clickHandler);
        }

        // Make the validation function available globally
        window.validateInterests = updateInterestsValidation;
    }

    // 4. Smart Location Detection
    async function setupSmartLocation() {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                
                locationInput.value = `${data.address.city || data.address.town}, ${data.address.state}`;
                showLocationPreview(data);
            } catch (error) {
                fallbackToIPLocation();
            }
        } else {
            fallbackToIPLocation();
        }

        locationInput.addEventListener('input', () => {
            const value = locationInput.value.trim();
            if (value.length > 1) {
                showSuggestions(locationInput, commonLocations.filter(item => 
                    item.toLowerCase().includes(value.toLowerCase())
                ));
            }
        });
    }

    // 5. Age Group Prediction
    function predictAgeGroup() {
        const emailDomain = emailInput.value.split('@')[1] || '';
        
        if (emailDomain.match(/\.edu$|\.ac\.|\.school\.|college|university/i)) {
            ageGroupSelect.value = '16-20';
            return;
        }
        
        if (emailDomain.match(/\.com$|\.org$|\.net$|\.io/i)) {
            ageGroupSelect.value = '21-25';
            return;
        }
        
        const stemInterests = ["Programming", "Math", "Physics", "Engineering", "Web Development"];
        if (selectedInterests.some(i => stemInterests.includes(i))) {
            ageGroupSelect.value = '21-25';
        }
    }

    // Helper Functions
    function showLocationPreview(locationData) {
        const preview = document.createElement('div');
        preview.className = 'location-preview';
        preview.innerHTML = `
            <p>Detected location: <strong>${locationInput.value}</strong></p>
            <button class="btn-confirm">Confirm</button>
            <button class="btn-change">Change</button>
        `;
        
        locationInput.parentNode.appendChild(preview);
        
        preview.querySelector('.btn-confirm').addEventListener('click', () => {
            preview.remove();
        });
        
        preview.querySelector('.btn-change').addEventListener('click', () => {
            locationInput.value = '';
            preview.remove();
        });
    }

    async function fallbackToIPLocation() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            locationInput.placeholder = `e.g., ${data.city}, ${data.region}`;
        } catch (error) {
            console.log('Could not determine location');
        }
    }

    // COMPLETELY FIXED Form Submission
    function setupFormSubmission() {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear any existing validation tooltips
            clearAllValidationErrors();
            
            if (validateForm()) {
                showLoadingState();
                
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    showSuccessMessage();
                    signupForm.reset();
                    selectedInterests = [];
                    document.querySelector('.interest-tags').innerHTML = '';
                } catch (error) {
                    showError("Submission failed. Please try again.");
                } finally {
                    hideLoadingState();
                }
            }
        });
    }

    // COMPLETELY FIXED Form Validation
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        // First Name
        if (!/^[a-zA-Z]{2,}$/.test(firstNameInput.value.trim())) {
            firstNameInput.style.borderColor = '#ff4444';
            if (!firstNameInput.value.trim()) {
                errors.push('First name is required');
            } else {
                errors.push('First name must contain only letters (2+ characters)');
            }
            isValid = false;
        } else {
            firstNameInput.style.borderColor = '#4CAF50';
        }
        
        // Last Name
        if (!/^[a-zA-Z]{2,}$/.test(lastNameInput.value.trim())) {
            lastNameInput.style.borderColor = '#ff4444';
            if (!lastNameInput.value.trim()) {
                errors.push('Last name is required');
            } else {
                errors.push('Last name must contain only letters (2+ characters)');
            }
            isValid = false;
        } else {
            lastNameInput.style.borderColor = '#4CAF50';
        }
        
        // Email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4444';
            errors.push('Please enter a valid email address');
            isValid = false;
        } else {
            emailInput.style.borderColor = '#4CAF50';
        }
        
        // Password
        if (passwordInput.value.length < 8) {
            passwordInput.style.borderColor = '#ff4444';
            errors.push('Password must be at least 8 characters long');
            isValid = false;
        } else {
            passwordInput.style.borderColor = '#4CAF50';
        }
        
        // Location
        if (locationInput.value.trim().length === 0) {
            locationInput.style.borderColor = '#ff4444';
            errors.push('Please enter your location');
            isValid = false;
        } else {
            locationInput.style.borderColor = '#4CAF50';
        }
        
        // Interests
        if (selectedInterests.length === 0) {
            interestsInput.style.borderColor = '#ff4444';
            showValidationTooltip(interestsInput, 'Please select at least one interest');
            errors.push('Please select at least one interest');
            isValid = false;
        } else {
            interestsInput.style.borderColor = '#4CAF50';
        }
        
        // Age Group
        if (ageGroupSelect.value === "" || ageGroupSelect.value === null) {
            ageGroupSelect.style.borderColor = '#ff4444';
            errors.push('Please select your age group');
            isValid = false;
        } else {
            ageGroupSelect.style.borderColor = '#4CAF50';
        }
        
        // Language
        const validLanguages = ['english', 'sinhala', 'tamil'];
        if (!validLanguages.includes(languageSelect.value)) {
            languageSelect.style.borderColor = '#ff4444';
            showValidationTooltip(languageSelect, 'Please select a valid language');
            errors.push('Please select a valid language');
            isValid = false;
        } else {
            languageSelect.style.borderColor = '#4CAF50';
            hideValidationTooltip(languageSelect);
        }
        
        // Terms checkbox
        if (!termsCheckbox.checked) {
            termsCheckbox.parentNode.style.color = '#ff4444';
            errors.push('Please accept the terms and conditions');
            isValid = false;
        } else {
            termsCheckbox.parentNode.style.color = '#333';
        }
        
        // Updates checkbox (optional)
        if (updatesCheckbox && !updatesCheckbox.checked) {
            updatesCheckbox.parentNode.style.color = '#333'; // Optional, no error
        }
        
        // Show errors if validation failed
        if (!isValid) {
            showError(`Please fix the following issues:\n• ${errors.join('\n• ')}`);
        }
        
        return isValid;
    }

    function showLoadingState() {
        const submitButton = signupForm.querySelector('.signup-btn');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Creating Account...';
    }

    function hideLoadingState() {
        const submitButton = signupForm.querySelector('.signup-btn');
        submitButton.disabled = false;
        submitButton.textContent = 'Create My Account';
    }

    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.innerHTML = `
            <h3>🎉 Welcome to SkillHub!</h3>
            <p>Your account has been created successfully.</p>
            <p>We've curated these learning paths for you:</p>
            <ul>
                ${selectedInterests.slice(0, 3).map(i => `<li>${i} Fundamentals</li>`).join('')}
            </ul>
        `;
        
        signupForm.parentNode.insertBefore(message, signupForm.nextSibling);
        setTimeout(() => message.remove(), 5000);
    }

    function showError(text) {
        const error = document.createElement('div');
        error.className = 'error-message-popup';
        error.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            white-space: pre-line;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        error.textContent = text;
        document.body.appendChild(error);
        setTimeout(() => error.remove(), 5000);
    }

    // Social Logins
    function setupSocialLogins() {
        const googleBtn = document.querySelector('.social-btn.google');
        const facebookBtn = document.querySelector('.social-btn.facebook');
        
        if (googleBtn) {
            googleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Google sign-up would be implemented here');
            });
        }

        if (facebookBtn) {
            facebookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Facebook sign-up would be implemented here');
            });
        }
    }

    // Initialize everything
    init();
});