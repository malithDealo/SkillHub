function onSignIn(googleUser) {
    // Get user info from Google
    const profile = googleUser.getBasicProfile();
    const firstName = profile.getGivenName();
    const lastName = profile.getFamilyName();
    const email = profile.getEmail();

    // Put the info into your form
    document.getElementById('first-name').value = firstName || '';
    document.getElementById('last-name').value = lastName || '';
    document.getElementById('email').value = email || '';

    // Show a message (you can change this to redirect or save)
    alert('Signed up with Google! Please fill the remaining fields.');
}

// Initialize Google Sign-In
window.onGoogleLibraryLoad = function() {
    google.accounts.id.initialize({
        client_id: '928244016011-mpju3m1mdqjkhntbngabieokkfmm6h3e.apps.googleusercontent.com',
        callback: onSignIn
    });
    google.accounts.id.renderButton(
        document.querySelector('.g_id_signin'),
        { theme: 'outline', size: 'large', text: 'signup_with', shape: 'rectangular' }
    );
};
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
    const mapContainer = document.getElementById('map-container');
    let selectedInterests = [];
    let map, marker;

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
        document.querySelectorAll('.validation-tooltip').forEach(tooltip => tooltip.remove());
        const allInputs = document.querySelectorAll('input, select');
        allInputs.forEach(input => input.style.borderColor = '#ddd');
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

        ageGroupSelect.addEventListener('change', () => {
            const isValid = ageGroupSelect.value !== "" && ageGroupSelect.value !== null;
            ageGroupSelect.style.borderColor = isValid ? '#4CAF50' : '#ddd';
        });

        languageSelect.addEventListener('change', () => {
            const validLanguages = ['english', 'sinhala', 'tamil'];
            const isValid = validLanguages.includes(languageSelect.value);
            languageSelect.style.borderColor = isValid ? '#4CAF50' : '#ddd';
        });

        const validLanguages = ['english', 'sinhala', 'tamil'];
        if (validLanguages.includes(languageSelect.value)) {
            languageSelect.style.borderColor = '#4CAF50';
        }

        termsCheckbox.addEventListener('change', () => {
            const isValid = termsCheckbox.checked;
            termsCheckbox.parentNode.style.color = isValid ? '#333' : '#ff4444';
        });

        if (updatesCheckbox) {
            updatesCheckbox.addEventListener('change', () => {
                updatesCheckbox.parentNode.style.color = '#333';
            });
        }
    }

    function showValidationTooltip(element, message) {
        hideValidationTooltip(element);
        const tooltip = document.createElement('div');
        tooltip.className = 'validation-tooltip';
        tooltip.innerHTML = `<span class="tooltip-icon">!</span> ${message}`;
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.zIndex = '1000';
        document.body.appendChild(tooltip);
        setTimeout(() => hideValidationTooltip(element), 5000);
    }

    function hideValidationTooltip(element) {
        document.querySelectorAll('.validation-tooltip').forEach(tooltip => tooltip.remove());
    }

    function setupSmartInterests() {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'interest-tags';
        interestsInput.parentNode.appendChild(tagsContainer);

        let currentSuggestionIndex = -1;
        let suggestionsContainer = null;

        function renderTags() {
            tagsContainer.innerHTML = selectedInterests.map(interest => `
                <span class="interest-tag">
                    ${interest}
                    <span class="remove-tag" data-interest="${interest}">×</span>
                </span>
            `).join('');
            tagsContainer.classList.remove('valid');
            document.querySelectorAll('.remove-tag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectedInterests = selectedInterests.filter(i => i !== btn.dataset.interest);
                    renderTags();
                });
            });
            updateInterestsValidation();
        }

        function updateInterestsValidation() {
            const isValid = selectedInterests.length > 0;
            hideValidationTooltip(interestsInput);
            interestsInput.style.borderColor = selectedInterests.length > 0 ? '#4CAF50' : '#ddd';
            return isValid;
        }

        function addInterest(interest) {
            const trimmedInterest = interest.trim();
            if (!trimmedInterest) return;
            if (!selectedInterests.some(i => i.toLowerCase() === trimmedInterest.toLowerCase())) {
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
                if (interestsInput.value.trim()) addInterest(interestsInput.value.trim());
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
                if (i === index) suggestion.scrollIntoView({ block: 'nearest' });
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
            if (suggestionsContainer) suggestionsContainer.remove();
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
            document.addEventListener('click', (e) => {
                if (!suggestionsContainer?.contains(e.target) && e.target !== interestsInput) {
                    if (suggestionsContainer) {
                        suggestionsContainer.remove();
                        suggestionsContainer = null;
                    }
                    document.removeEventListener('click', arguments.callee);
                }
            });
        }

        window.validateInterests = updateInterestsValidation;
    }

    async function setupSmartLocation() {
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await response.json();
                const city = data.address.city || data.address.town || data.address.village;
                const state = data.address.state;
                const location = city ? `${city}, ${state}` : `undefined, ${state}`;
                locationInput.value = location;

                // Show map if city/town is undefined or user wants to refine
                if (!city) {
                    showMapForSelection(latitude, longitude, true);
                } else {
                    showLocationPreview(data, latitude, longitude);
                }
            } catch (error) {
                console.log('Geolocation error:', error);
                fallbackToIPLocation();
                showMapForSelection(); // Show map as fallback
            }
        } else {
            fallbackToIPLocation();
            showMapForSelection(); // Show map if geolocation is not supported
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

    function showMapForSelection(initialLat = 6.9271, initialLon = 79.8612, isInitial = false) {
        mapContainer.style.display = 'block';
        mapContainer.style.width = '100%';
        mapContainer.style.height = '300px';

        if (map) map.remove(); // Remove existing map if it exists
        map = L.map(mapContainer).setView([initialLat, initialLon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if (marker) map.removeLayer(marker); // Remove existing marker
        marker = L.marker([initialLat, initialLon], { draggable: true }).addTo(map);
        marker.bindPopup("Drag me to your exact location or click the map to set it.").openPopup();

        map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            updateLocationFromCoordinates(lat, lng);
        });

        marker.on('dragend', async (e) => {
            const { lat, lng } = marker.getLatLng();
            updateLocationFromCoordinates(lat, lng);
        });

        const controlContainer = L.control({ position: 'topright' });
        controlContainer.onAdd = function () {
            const div = L.DomUtil.create('div', 'map-controls');
            div.innerHTML = `
                <button id="confirm-location">Confirm Location</button>
                ${isInitial ? '' : '<button id="change-location">Change Location</button>'}
            `;
            return div;
        };
        controlContainer.addTo(map);

        document.getElementById('confirm-location').addEventListener('click', () => {
            mapContainer.style.display = 'none';
        });

        if (!isInitial) {
            document.getElementById('change-location').addEventListener('click', () => {
                showMapForSelection(initialLat, initialLon); // Reopen map to change
            });
        }
    }

    async function updateLocationFromCoordinates(lat, lng) {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
        const state = data.address.state;
        const detailedLocation = city ? `${city}, ${state}` : `Near ${data.address.state}`;
        locationInput.value = detailedLocation;
    }

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

    function showLocationPreview(locationData, lat, lon) {
        const preview = document.createElement('div');
        preview.className = 'location-preview';
        preview.innerHTML = `
            <p>Detected location: <strong>${locationInput.value}</strong></p>
            <button class="btn-confirm">Confirm</button>
            <button class="btn-change">Change on Map</button>
        `;
        locationInput.parentNode.appendChild(preview);
        
        preview.querySelector('.btn-confirm').addEventListener('click', () => preview.remove());
        preview.querySelector('.btn-change').addEventListener('click', () => {
            preview.remove();
            showMapForSelection(lat || 6.9271, lon || 79.8612);
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

    function setupFormSubmission() {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
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

    function validateForm() {
        let isValid = true;
        const errors = [];
        if (!/^[a-zA-Z]{2,}$/.test(firstNameInput.value.trim())) {
            firstNameInput.style.borderColor = '#ff4444';
            if (!firstNameInput.value.trim()) errors.push('First name is required');
            else errors.push('First name must contain only letters (2+ characters)');
            isValid = false;
        } else firstNameInput.style.borderColor = '#4CAF50';
        if (!/^[a-zA-Z]{2,}$/.test(lastNameInput.value.trim())) {
            lastNameInput.style.borderColor = '#ff4444';
            if (!lastNameInput.value.trim()) errors.push('Last name is required');
            else errors.push('Last name must contain only letters (2+ characters)');
            isValid = false;
        } else lastNameInput.style.borderColor = '#4CAF50';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            emailInput.style.borderColor = '#ff4444';
            errors.push('Please enter a valid email address');
            isValid = false;
        } else emailInput.style.borderColor = '#4CAF50';
        if (passwordInput.value.length < 8) {
            passwordInput.style.borderColor = '#ff4444';
            errors.push('Password must be at least 8 characters long');
            isValid = false;
        } else passwordInput.style.borderColor = '#4CAF50';
        if (locationInput.value.trim().length === 0) {
            locationInput.style.borderColor = '#ff4444';
            errors.push('Please enter your location');
            isValid = false;
        } else locationInput.style.borderColor = '#4CAF50';
        if (selectedInterests.length === 0) {
            interestsInput.style.borderColor = '#ff4444';
            showValidationTooltip(interestsInput, 'Please select at least one interest');
            errors.push('Please select at least one interest');
            isValid = false;
        } else interestsInput.style.borderColor = '#4CAF50';
        if (ageGroupSelect.value === "" || ageGroupSelect.value === null) {
            ageGroupSelect.style.borderColor = '#ff4444';
            errors.push('Please select your age group');
            isValid = false;
        } else ageGroupSelect.style.borderColor = '#4CAF50';
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
        if (!termsCheckbox.checked) {
            termsCheckbox.parentNode.style.color = '#ff4444';
            errors.push('Please accept the terms and conditions');
            isValid = false;
        } else termsCheckbox.parentNode.style.color = '#333';
        if (updatesCheckbox && !updatesCheckbox.checked) updatesCheckbox.parentNode.style.color = '#333';
        if (!isValid) showError(`Please fix the following issues:\n• ${errors.join('\n• ')}`);
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

    
    init();
});