// SkillHub Dashboard JavaScript (sponsordashboard1.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    animateStats();
});

// Initialize Dashboard
function initializeDashboard() {
    console.log('SkillHub Dashboard initialized');
    
    // Set current date
    updateLastActive();
    
    // Initialize progress bars
    animateProgressBars();
    
    // Load user preferences
    loadUserPreferences();
}

// Setup Event Listeners
function setupEventListeners() {
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });
    
    // Create New Campaign button
    const createBtn = document.querySelector('.create-btn');
    if (createBtn) {
        createBtn.addEventListener('click', createNewCampaign);
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Campaign items
    const campaignItems = document.querySelectorAll('.campaign-item');
    campaignItems.forEach(item => {
        item.addEventListener('click', viewCampaignDetails);
    });
    
    // Student items
    const studentItems = document.querySelectorAll('.student-item');
    studentItems.forEach(item => {
        item.addEventListener('click', viewStudentProfile);
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubscription);
    }
    
    // Profile icon
    const profileIcon = document.querySelector('.profile-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', toggleProfileMenu);
    }
}

// Handle Sidebar Navigation
function handleSidebarNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all links
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    e.currentTarget.classList.add('active');
    
    // Get the navigation target
    const linkText = e.currentTarget.textContent.trim();
    
    // Handle different navigation options
    switch(linkText) {
        case 'Overview':
            showOverview();
            break;
        case 'Campaigns':
            window.location.href = 'sponsordashboard2.html';
            break;
        case 'Analytics':
            window.location.href = 'sponsordashboard3.html';
            break;
        case 'Profile Setting':
            window.location.href = 'sponsordashboard4.html';
            break;
        default:
            console.log(`Navigation to ${linkText} not implemented`);
    }
}

// Show Overview Section
function showOverview() {
    console.log('Showing Overview');
    // Reset any filtered views
    showAllSections();
}

// Show All Sections
function showAllSections() {
    const sections = document.querySelectorAll('.section, .stats-grid');
    sections.forEach(section => {
        section.style.display = 'block';
    });
}

// Create New Campaign
function createNewCampaign() {
    console.log('Creating new campaign');
    showNotification('Redirecting to campaign creation...', 'info');
    
    // Redirect to campaigns page
    setTimeout(() => {
        window.location.href = 'sponsordashboard2.html';
    }, 1000);
}

// Add New Campaign to List
function addNewCampaignToList(campaignData) {
    const campaignsList = document.querySelector('.campaigns-list');
    if (!campaignsList) return;
    
    const campaignHTML = `
        <div class="campaign-item" onclick="viewCampaignDetails(event)">
            <div class="campaign-icon red"></div>
            <div class="campaign-info">
                <h3>${campaignData.name}</h3>
                <p>Target: ${campaignData.target} students • Budget: $${campaignData.budget.toLocaleString()}</p>
            </div>
            <span class="status-badge ${campaignData.status}">${campaignData.status.charAt(0).toUpperCase() + campaignData.status.slice(1)}</span>
        </div>
    `;
    
    campaignsList.insertAdjacentHTML('afterbegin', campaignHTML);
    
    // Update active campaigns count
    updateActiveCampaignsCount();
}

// Handle Logout
function handleLogout() {
    console.log('Logging out');
    
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        
        // Simulate logout process
        setTimeout(() => {
            // Clear user data
            localStorage.removeItem('skillhub_user_preferences');
            
            // Redirect to login page (simulated)
            showNotification('Logged out successfully!', 'success');
        }, 1000);
    }
}

// View Campaign Details
function viewCampaignDetails(e) {
    e.preventDefault();
    
    const campaignName = e.currentTarget.querySelector('h3').textContent;
    console.log(`Viewing details for: ${campaignName}`);
    
    showNotification(`Opening details for ${campaignName}`, 'info');
    
    // Redirect to campaigns page
    setTimeout(() => {
        window.location.href = 'sponsordashboard2.html';
    }, 1000);
    
    // Add visual feedback
    e.currentTarget.style.transform = 'scale(0.98)';
    setTimeout(() => {
        e.currentTarget.style.transform = 'scale(1)';
    }, 150);
}

// View Student Profile
function viewStudentProfile(e) {
    e.preventDefault();
    
    const studentName = e.currentTarget.querySelector('h4').textContent;
    console.log(`Viewing profile for: ${studentName}`);
    
    showNotification(`Opening profile for ${studentName}`, 'info');
    
    // Add visual feedback
    e.currentTarget.style.transform = 'scale(0.98)';
    setTimeout(() => {
        e.currentTarget.style.transform = 'scale(1)';
    }, 150);
}

// Handle Newsletter Subscription
function handleNewsletterSubscription(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email format', 'error');
        return;
    }
    
    console.log(`Newsletter subscription for: ${email}`);
    showNotification('Successfully subscribed to newsletter!', 'success');
    
    // Clear the input
    emailInput.value = '';
}

// Toggle Profile Menu
function toggleProfileMenu() {
    console.log('Toggling profile menu');
    
    // Check if menu already exists
    let existingMenu = document.querySelector('.profile-dropdown');
    
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'profile-dropdown';
    dropdown.innerHTML = `
        <div class="profile-menu">
            <a href="#" onclick="editProfile()">Edit Profile</a>
            <a href="#" onclick="viewSettings()">Settings</a>
            <a href="#" onclick="viewNotifications()">Notifications</a>
            <hr>
            <a href="#" onclick="handleLogout()">Logout</a>
        </div>
    `;
    
    // Position and show dropdown
    const profileIcon = document.querySelector('.profile-icon');
    profileIcon.style.position = 'relative';
    profileIcon.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!profileIcon.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

// Animate Statistics
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat, index) => {
        const finalValue = stat.textContent;
        const isMonetary = finalValue.includes('$');
        const isPercentage = finalValue.includes('%');
        const numericValue = parseFloat(finalValue.replace(/[$,%]/g, ''));
        
        // Animate from 0 to final value
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            
            if (isMonetary) {
                displayValue = '$' + displayValue.toLocaleString();
            } else if (isPercentage) {
                displayValue = displayValue.toFixed(1) + '%';
            } else {
                displayValue = displayValue.toLocaleString();
            }
            
            stat.textContent = displayValue;
        }, 50 + (index * 10));
    });
}

// Animate Progress Bars
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 500);
    });
}

// Update Last Active
function updateLastActive() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Store last active time
    localStorage.setItem('skillhub_last_active', now.toISOString());
    
    console.log(`Last active: ${timeString}`);
}

// Load User Preferences
function loadUserPreferences() {
    const preferences = localStorage.getItem('skillhub_user_preferences');
    
    if (preferences) {
        const prefs = JSON.parse(preferences);
        console.log('Loaded user preferences:', prefs);
        
        // Apply preferences
        if (prefs.theme) {
            document.body.setAttribute('data-theme', prefs.theme);
        }
    } else {
        // Set default preferences
        const defaultPrefs = {
            theme: 'light',
            notifications: true,
            language: 'en'
        };
        
        localStorage.setItem('skillhub_user_preferences', JSON.stringify(defaultPrefs));
    }
}

// Update Active Campaigns Count
function updateActiveCampaignsCount() {
    const activeCampaigns = document.querySelectorAll('.status-badge.active').length;
    const activeCampaignsCard = document.querySelectorAll('.stat-value')[3];
    
    if (activeCampaignsCard) {
        activeCampaignsCard.textContent = activeCampaigns;
    }
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
    notification.className = `notification notification-${type}`;
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
        zIndex: '1000',
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
    
    // Animate in
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

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format Number
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Get Random Color
function getRandomColor() {
    const colors = ['#dc3545', '#28a745', '#ffc107', '#17a2b8', '#6f42c1'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Profile Menu Functions
function editProfile() {
    showNotification('Redirecting to profile settings...', 'info');
    setTimeout(() => {
        window.location.href = 'sponsordashboard4.html';
    }, 1000);
}

function viewSettings() {
    showNotification('Redirecting to settings...', 'info');
    setTimeout(() => {
        window.location.href = 'sponsordashboard4.html';
    }, 1000);
}

function viewNotifications() {
    showNotification('Notifications center coming soon!', 'info');
}

// Search Functionality (for future implementation)
function searchCampaigns(query) {
    const campaigns = document.querySelectorAll('.campaign-item');
    
    campaigns.forEach(campaign => {
        const campaignName = campaign.querySelector('h3').textContent.toLowerCase();
        const isVisible = campaignName.includes(query.toLowerCase());
        
        campaign.style.display = isVisible ? 'flex' : 'none';
    });
}

// Filter Campaigns by Status
function filterCampaignsByStatus(status) {
    const campaigns = document.querySelectorAll('.campaign-item');
    
    campaigns.forEach(campaign => {
        const campaignStatus = campaign.querySelector('.status-badge').classList;
        const isVisible = status === 'all' || campaignStatus.contains(status);
        
        campaign.style.display = isVisible ? 'flex' : 'none';
    });
}

// Export Data (for future implementation)
function exportCampaignData() {
    const campaigns = [];
    
    document.querySelectorAll('.campaign-item').forEach(item => {
        const name = item.querySelector('h3').textContent;
        const details = item.querySelector('p').textContent;
        const status = item.querySelector('.status-badge').textContent;
        
        campaigns.push({ name, details, status });
    });
    
    console.log('Campaign data:', campaigns);
    showNotification('Export functionality coming soon!', 'info');
}

// Refresh Dashboard Data
function refreshDashboard() {
    showNotification('Refreshing dashboard...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        animateStats();
        animateProgressBars();
        showNotification('Dashboard refreshed!', 'success');
    }, 1000);
}

// Handle Window Resize
window.addEventListener('resize', function() {
    // Adjust layout for responsive design
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        sidebar.style.width = '100%';
        if (mainContent) {
            mainContent.style.marginLeft = '0';
        }
    } else {
        sidebar.style.width = '250px';
        if (mainContent) {
            mainContent.style.marginLeft = '250px';
        }
    }
});

// Handle Before Unload
window.addEventListener('beforeunload', function() {
    // Save any unsaved data
    updateLastActive();
});

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        refreshDashboard();
    }
    
    // Escape to close modals/dropdowns
    if (e.key === 'Escape') {
        const dropdown = document.querySelector('.profile-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }
});

console.log('SkillHub Dashboard JavaScript (sponsordashboard1.js) loaded successfully!');