// Add this code to: public/js/sponsordashboard4.js (for sponsors)
// Sponsor Dashboard Profile Update Handler

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing sponsor dashboard profile handlers...');
    
    // Initialize sponsor profile handlers
    initializeSponsorProfileHandlers();
});

function initializeSponsorProfileHandlers() {
    // Settings form submission
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSponsorSettingsUpdate);
    }
    
    // Handle all forms that might contain profile data
    const profileForms = document.querySelectorAll('form:not(#passwordForm):not(#deleteAccountForm)');
    profileForms.forEach(form => {
        if (form.id !== 'passwordForm') {
            form.addEventListener('submit', handleSponsorProfileUpdate);
        }
    });
    
    // Real-time company name and contact name updates
    const nameInputs = document.querySelectorAll('#companyName, #contactName, input[name="companyName"], input[name="contactName"]');
    nameInputs.forEach(input => {
        input.addEventListener('blur', handleSponsorNameUpdate);
    });
    
    // Handle profile picture upload if element exists
    const profileUploadElements = document.querySelectorAll('.profile-picture-upload, .avatar-upload, .upload-profile');
    profileUploadElements.forEach(element => {
        element.addEventListener('click', handleSponsorProfilePictureUpload);
    });
    
    // Cancel button handlers
    const cancelBtns = document.querySelectorAll('.cancel-btn, #cancelBtn');
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', handleSponsorCancel);
    });
}

async function handleSponsorSettingsUpdate(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Process checkboxes and special fields
    const processedData = processSponsorFormData(data, form);
    
    console.log('📝 Updating sponsor settings with data:', processedData);
    
    try {
        const submitBtn = form.querySelector('.save-btn, button[type="submit"]');
        const originalText = submitBtn ? submitBtn.textContent : '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
        }
        
        await updateSponsorProfile(processedData);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
    } catch (error) {
        const submitBtn = form.querySelector('.save-btn, button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
    }
}

async function handleSponsorProfileUpdate(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Remove empty values
    Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null) {
            delete data[key];
        }
    });
    
    console.log('📝 Updating sponsor profile with data:', data);
    
    try {
        const submitBtn = form.querySelector('button[type="submit"], .save-btn, .btn-primary');
        const originalText = submitBtn ? submitBtn.textContent : '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';
        }
        
        await updateSponsorProfile(data);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
    } catch (error) {
        const submitBtn = form.querySelector('button[type="submit"], .save-btn, .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
    }
}

async function handleSponsorNameUpdate(e) {
    const field = e.target;
    const fieldName = field.name || field.id;
    const fieldValue = field.value.trim();
    
    if (!fieldValue || !fieldName) return;
    
    // Update name fields for real-time navbar updates
    if (fieldName.toLowerCase().includes('name')) {
        const updateData = {};
        
        // Map form fields to API fields
        if (fieldName === 'companyName') {
            updateData.companyName = fieldValue;
        } else if (fieldName === 'contactName') {
            updateData.firstName = fieldValue.split(' ')[0];
            updateData.lastName = fieldValue.split(' ').slice(1).join(' ') || '';
        } else {
            updateData[fieldName] = fieldValue;
        }
        
        try {
            await updateSponsorProfile(updateData, false); // Silent update
            console.log('✅ Sponsor name field updated:', fieldName, fieldValue);
        } catch (error) {
            console.error('❌ Error updating sponsor name field:', error);
        }
    }
}

function processSponsorFormData(data, form) {
    const processedData = { ...data };
    
    // Handle checkboxes that might not be in FormData if unchecked
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (!processedData.hasOwnProperty(checkbox.name)) {
            processedData[checkbox.name] = false;
        } else {
            processedData[checkbox.name] = true;
        }
    });
    
    // Handle numeric fields
    if (processedData.monthlyBudget) {
        processedData.budget = parseInt(processedData.monthlyBudget);
        delete processedData.monthlyBudget;
    }
    
    // Handle contact name splitting
    if (processedData.contactName) {
        const nameParts = processedData.contactName.split(' ');
        processedData.firstName = nameParts[0] || '';
        processedData.lastName = nameParts.slice(1).join(' ') || '';
        delete processedData.contactName;
    }
    
    // Handle industry and other select fields
    if (processedData.industry) {
        processedData.sponsorshipInterests = [processedData.industry];
    }
    
    return processedData;
}

function handleSponsorProfilePictureUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleSponsorImageUpload(file);
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

async function handleSponsorImageUpload(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        showSponsorError('Please select a valid image file.');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showSponsorError('Image file must be less than 5MB.');
        return;
    }
    
    showSponsorSuccess('Uploading profile picture...');
    
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target.result;
            
            // Update any profile images on the page
            const profileImages = document.querySelectorAll('.profile-image, .avatar-img, .sponsor-avatar');
            profileImages.forEach(img => {
                img.src = imageData;
            });
            
            // Update via API
            await updateSponsorProfile({ profileImage: imageData });
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error processing sponsor image:', error);
        showSponsorError('Failed to process image. Please try again.');
    }
}

function handleSponsorCancel(e) {
    e.preventDefault();
    
    // Reset form to original values
    const form = e.target.closest('form');
    if (form) {
        form.reset();
        showSponsorSuccess('Changes cancelled');
    }
}

async function updateSponsorProfile(data, showMessage = true) {
    try {
        const token = localStorage.getItem('skillhub_token');
        if (!token) {
            showSponsorError('Please log in again to update your profile.');
            return;
        }
        
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
            
            // Dispatch update event to update navbar
            if (window.dispatchProfileUpdate) {
                window.dispatchProfileUpdate(updatedUser);
            }
            
            if (showMessage) {
                showSponsorSuccess('Profile updated successfully!');
            }
            console.log('✅ Sponsor profile updated successfully:', updatedUser);
        } else {
            throw new Error(result.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('❌ Sponsor profile update error:', error);
        if (showMessage) {
            showSponsorError('Failed to update profile. Please try again.');
        }
        throw error;
    }
}

function showSponsorSuccess(message) {
    // Remove existing messages
    const existing = document.querySelector('.sponsor-success-message');
    if (existing) existing.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'sponsor-success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #F4A261, #E76F51);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(244, 162, 97, 0.3);
        z-index: 10001;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        min-width: 250px;
        text-align: center;
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✅</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

function showSponsorError(message) {
    // Remove existing messages
    const existing = document.querySelector('.sponsor-error-message');
    if (existing) existing.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'sponsor-error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #E63946, #D62828);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(230, 57, 70, 0.3);
        z-index: 10001;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        min-width: 250px;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">❌</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Add sponsor-specific styles if not already present
if (!document.querySelector('#sponsor-profile-styles')) {
    const style = document.createElement('style');
    style.id = 'sponsor-profile-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .profile-picture-upload,
        .avatar-upload,
        .upload-profile {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .profile-picture-upload:hover,
        .avatar-upload:hover,
        .upload-profile:hover {
            transform: scale(1.05);
            background: rgba(244, 162, 97, 0.1);
        }
        
        .save-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .cancel-btn:hover {
            background: #6c757d !important;
        }
        
        /* Enhanced form styling */
        .settings-form input:focus,
        .settings-form select:focus,
        .settings-form textarea:focus {
            border-color: #F4A261;
            box-shadow: 0 0 0 0.2rem rgba(244, 162, 97, 0.25);
        }
        
        .checkbox-label:hover {
            background: rgba(244, 162, 97, 0.05);
        }
        
        .action-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);
}

// Additional sponsor-specific functionality
function initializeSponsorSpecificFeatures() {
    // Handle two-factor authentication setup
    const setup2FABtn = document.getElementById('setup2FABtn');
    if (setup2FABtn) {
        setup2FABtn.addEventListener('click', handleSetup2FA);
    }
    
    // Handle password change
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', showPasswordChangeModal);
    }
    
    // Handle data download
    const downloadDataBtn = document.getElementById('downloadDataBtn');
    if (downloadDataBtn) {
        downloadDataBtn.addEventListener('click', handleDataDownload);
    }
    
    // Handle account deletion
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', handleAccountDeletion);
    }
}

function handleSetup2FA() {
    showSponsorSuccess('2FA setup feature coming soon!');
}

function showPasswordChangeModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

async function handleDataDownload() {
    try {
        showSponsorSuccess('Preparing your data for download...');
        
        const token = localStorage.getItem('skillhub_token');
        const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || '{}');
        
        // Create downloadable data
        const userData = {
            profile: currentUser,
            exportDate: new Date().toISOString(),
            dataType: 'Sponsor Account Data'
        };
        
        const dataStr = JSON.stringify(userData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `skillhub_sponsor_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showSponsorSuccess('Data downloaded successfully!');
    } catch (error) {
        console.error('Error downloading data:', error);
        showSponsorError('Failed to download data. Please try again.');
    }
}

function handleAccountDeletion() {
    const confirmed = confirm(
        'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.'
    );
    
    if (confirmed) {
        const password = prompt('Please enter your password to confirm account deletion:');
        if (password) {
            deleteSponsorAccount(password);
        }
    }
}

async function deleteSponsorAccount(password) {
    try {
        const token = localStorage.getItem('skillhub_token');
        
        const response = await fetch('/api/auth/profile', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSponsorSuccess('Account deleted successfully. Redirecting...');
            
            // Clear all data and redirect
            localStorage.clear();
            setTimeout(() => {
                window.location.href = 'sponsorhome.html';
            }, 2000);
        } else {
            showSponsorError(result.message || 'Failed to delete account');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showSponsorError('Failed to delete account. Please try again.');
    }
}

// Initialize additional features when DOM is ready
setTimeout(initializeSponsorSpecificFeatures, 500);

console.log('✅ Sponsor dashboard profile handlers loaded successfully');



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