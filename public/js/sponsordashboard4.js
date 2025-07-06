// Settings Page JavaScript (sponsordashboard4.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeSettings();
    setupEventListeners();
    loadUserSettings();
});

// Initialize Settings Page
function initializeSettings() {
    console.log('Settings page initialized');
    setupFormValidation();
    loadDefaultValues();
}

// Setup Event Listeners
function setupEventListeners() {
    // Settings form submission
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmission);
    }

    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', resetForm);
    }

    // Account management buttons
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', openPasswordModal);
    }

    const setup2FABtn = document.getElementById('setup2FABtn');
    if (setup2FABtn) {
        setup2FABtn.addEventListener('click', setup2FA);
    }

    const downloadDataBtn = document.getElementById('downloadDataBtn');
    if (downloadDataBtn) {
        downloadDataBtn.addEventListener('click', downloadUserData);
    }

    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', confirmDeleteAccount);
    }

    // Password form submission
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });

    // Real-time form validation
    const formInputs = document.querySelectorAll('#settingsForm input, #settingsForm select, #settingsForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Handle Settings Form Submission
function handleSettingsSubmission(e) {
    e.preventDefault();
    
    // Validate all fields
    if (!validateAllFields()) {
        showNotification('Please fix all errors before saving', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const settingsData = {
        companyName: formData.get('companyName'),
        contactName: formData.get('contactName'),
        phoneNumber: formData.get('phoneNumber'),
        industry: formData.get('industry'),
        emailAddress: formData.get('emailAddress'),
        monthlyBudget: formData.get('monthlyBudget'),
        description: formData.get('description'),
        notifications: {
            email: formData.has('emailNotifications'),
            sms: formData.has('smsNotifications'),
            weeklyReports: formData.has('weeklyReports'),
            marketingUpdates: formData.has('marketingUpdates')
        },
        privacy: {
            profileVisibility: formData.has('profileVisibility'),
            dataSharing: formData.has('dataSharing'),
            publicMetrics: formData.has('publicMetrics')
        },
        preferences: {
            timezone: formData.get('timezone'),
            currency: formData.get('currency')
        }
    };

    // Show loading state
    const submitBtn = e.target.querySelector('.save-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;
    
    // Add loading class to form
    e.target.classList.add('loading');

    // Simulate API call
    setTimeout(() => {
        // Save settings
        saveUserSettings(settingsData);
        
        // Reset button and form state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        e.target.classList.remove('loading');
        
        // Show success notification
        showNotification('Settings saved successfully!', 'success');
        
    }, 1500);
}

// Validate All Fields
function validateAllFields() {
    const requiredFields = document.querySelectorAll('#settingsForm [required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });

    return isValid;
}

// Validate Individual Field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Specific field validations
    if (value && field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    if (value && field.type === 'tel') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (value && field.type === 'number' && parseFloat(value) < 0) {
        isValid = false;
        errorMessage = 'Value must be positive';
    }

    // Show error if validation failed
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }

    return isValid;
}

// Clear Field Error
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Reset Form
function resetForm() {
    if (confirm('Are you sure you want to discard all changes?')) {
        const form = document.getElementById('settingsForm');
        form.reset();
        loadDefaultValues();
        
        // Clear all error states
        const errorFields = form.querySelectorAll('.error');
        const errorMessages = form.querySelectorAll('.error-message');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(message => message.remove());
        
        showNotification('Changes discarded', 'info');
    }
}

// Open Password Modal
function openPasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('currentPassword').focus();
    }, 100);
}

// Close Password Modal
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Clear form
    document.getElementById('passwordForm').reset();
    
    // Clear any error states
    const errorFields = modal.querySelectorAll('.error');
    const errorMessages = modal.querySelectorAll('.error-message');
    errorFields.forEach(field => field.classList.remove('error'));
    errorMessages.forEach(message => message.remove());
}

// Handle Password Change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate passwords
    if (newPassword.length < 8) {
        showNotification('New password must be at least 8 characters long', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.save-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;
    
    // Simulate password change
    setTimeout(() => {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and show success
        closePasswordModal();
        showNotification('Password updated successfully!', 'success');
    }, 1500);
}

// Setup 2FA
function setup2FA() {
    showNotification('Two-Factor Authentication setup coming soon!', 'info');
    // In a real app, this would open a 2FA setup wizard
}

// Download User Data
function downloadUserData() {
    showNotification('Preparing your data for download...', 'info');
    
    // Simulate data preparation
    setTimeout(() => {
        const userData = {
            profile: getCurrentFormData(),
            campaigns: JSON.parse(localStorage.getItem('skillhub_campaigns') || '[]'),
            analytics: JSON.parse(localStorage.getItem('skillhub_analytics') || '{}'),
            settings: JSON.parse(localStorage.getItem('skillhub_settings') || '{}')
        };
        
        // Create downloadable file
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'skillhub_user_data.json';
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Data downloaded successfully!', 'success');
    }, 2000);
}

// Confirm Delete Account
function confirmDeleteAccount() {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    
    if (confirmation === 'DELETE') {
        if (confirm('This action cannot be undone. Are you absolutely sure?')) {
            deleteAccount();
        }
    } else if (confirmation !== null) {
        showNotification('Account deletion cancelled - incorrect confirmation', 'error');
    }
}

// Delete Account
function deleteAccount() {
    showNotification('Deleting account...', 'info');
    
    // Simulate account deletion
    setTimeout(() => {
        // Clear all stored data
        localStorage.clear();
        
        showNotification('Account deleted successfully', 'success');
        
        // In a real app, redirect to login page
        setTimeout(() => {
            window.location.href = 'sponsordashboard1.html';
        }, 2000);
    }, 3000);
}

// Handle Sidebar Navigation
function handleSidebarNavigation(e) {
    e.preventDefault();
    
    const linkText = e.currentTarget.textContent.trim();
    
    switch(linkText) {
        case 'Overview':
            window.location.href = 'sponsordashboard1.html';
            break;
        case 'Campaigns':
            window.location.href = 'sponsordashboard2.html';
            break;
        case 'Analytics':
            window.location.href = 'sponsordashboard3.html';
            break;
        case 'Profile Setting':
            // Already on settings page
            break;
    }
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            localStorage.removeItem('skillhub_user_session');
            showNotification('Logged out successfully!', 'success');
        }, 1000);
    }
}

// Load User Settings
function loadUserSettings() {
    const savedSettings = localStorage.getItem('skillhub_settings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        populateFormWithSettings(settings);
        console.log('Loaded user settings:', settings);
    }
}

// Save User Settings
function saveUserSettings(settingsData) {
    localStorage.setItem('skillhub_settings', JSON.stringify(settingsData));
    console.log('Settings saved:', settingsData);
}

// Load Default Values
function loadDefaultValues() {
    // This function can be used to set default values if needed
    console.log('Default values loaded');
}

// Get Current Form Data
function getCurrentFormData() {
    const form = document.getElementById('settingsForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add checkbox values
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        data[checkbox.name] = checkbox.checked;
    });
    
    return data;
}

// Populate Form with Settings
function populateFormWithSettings(settings) {
    if (settings.companyName) {
        document.getElementById('companyName').value = settings.companyName;
    }
    if (settings.contactName) {
        document.getElementById('contactName').value = settings.contactName;
    }
    if (settings.phoneNumber) {
        document.getElementById('phoneNumber').value = settings.phoneNumber;
    }
    if (settings.industry) {
        document.getElementById('industry').value = settings.industry;
    }
    if (settings.emailAddress) {
        document.getElementById('emailAddress').value = settings.emailAddress;
    }
    if (settings.monthlyBudget) {
        document.getElementById('monthlyBudget').value = settings.monthlyBudget;
    }
    if (settings.description) {
        document.getElementById('description').value = settings.description;
    }
    
    // Populate checkboxes and selects
    if (settings.notifications) {
        Object.keys(settings.notifications).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settings.notifications[key];
            }
        });
    }
    
    if (settings.privacy) {
        Object.keys(settings.privacy).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settings.privacy[key];
            }
        });
    }
    
    if (settings.preferences) {
        if (settings.preferences.timezone) {
            document.getElementById('timezone').value = settings.preferences.timezone;
        }
        if (settings.preferences.currency) {
            document.getElementById('currency').value = settings.preferences.currency;
        }
    }
}

// Setup Form Validation
function setupFormValidation() {
    console.log('Form validation setup complete');
}

// Utility Functions

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1001',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Auto-save functionality
function startAutoSave() {
    const form = document.getElementById('settingsForm');
    let timeout;
    
    form.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const data = getCurrentFormData();
            localStorage.setItem('skillhub_settings_draft', JSON.stringify(data));
            console.log('Auto-saved draft');
        }, 2000);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('settingsForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.getElementById('passwordModal');
        if (modal.classList.contains('active')) {
            closePasswordModal();
        }
    }
});

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('passwordModal');
    if (modal.classList.contains('active') && e.target === modal) {
        closePasswordModal();
    }
});

// Start auto-save when page loads
setTimeout(startAutoSave, 1000);

console.log('Settings JavaScript (sponsordashboard4.js) loaded successfully!');