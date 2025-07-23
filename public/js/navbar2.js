// navbar-profile-dropdown.js - Profile Dropdown for Dynamic Navbars
// This script handles profile dropdown functionality for dynamically loaded navbars

// Global function to initialize profile dropdown
function initializeProfileDropdown(container = document) {
    console.log('🔧 Initializing profile dropdown...');
    
    // Find the user profile element
    const userProfile = container.querySelector('.user-profile');
    const profileDropdown = container.querySelector('.profile-dropdown');
    const profileIcon = container.querySelector('.profile-icon');
    
    if (!userProfile || !profileDropdown || !profileIcon) {
        console.log('⚠️ Profile dropdown elements not found');
        return;
    }
    
    // Remove any existing event listeners to prevent duplicates
    const existingHandlers = userProfile.getAttribute('data-dropdown-initialized');
    if (existingHandlers === 'true') {
        console.log('✅ Profile dropdown already initialized');
        return;
    }
    
    // Mark as initialized
    userProfile.setAttribute('data-dropdown-initialized', 'true');
    
    let isDropdownVisible = false;
    let hoverTimeout;
    
    // Add CSS styles dynamically
    addProfileDropdownStyles();
    
    // Show dropdown on hover
    function showDropdown() {
        clearTimeout(hoverTimeout);
        profileDropdown.classList.add('show');
        isDropdownVisible = true;
        console.log('📂 Profile dropdown shown');
    }
    
    // Hide dropdown
    function hideDropdown() {
        hoverTimeout = setTimeout(() => {
            profileDropdown.classList.remove('show');
            isDropdownVisible = false;
            console.log('📁 Profile dropdown hidden');
        }, 200); // Small delay to prevent flickering
    }
    
    // Event listeners for profile icon hover
    profileIcon.addEventListener('mouseenter', showDropdown);
    userProfile.addEventListener('mouseenter', showDropdown);
    userProfile.addEventListener('mouseleave', hideDropdown);
    
    // Keep dropdown open when hovering over dropdown itself
    profileDropdown.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
    });
    
    profileDropdown.addEventListener('mouseleave', hideDropdown);
    
    // Handle dropdown link clicks
    const dropdownLinks = profileDropdown.querySelectorAll('.profile-dropdown-link');
    dropdownLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log(`🔗 Dropdown link clicked: ${link.textContent}`);
            
            // Handle sign out specifically
            if (link.classList.contains('logout') || link.getAttribute('data-action') === 'signout') {
                e.preventDefault();
                handleSignOut();
                return;
            }
            
            // For other links, let them navigate normally but hide dropdown
            hideDropdown();
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userProfile.contains(e.target) && isDropdownVisible) {
            hideDropdown();
        }
    });
    
    // Close dropdown with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isDropdownVisible) {
            hideDropdown();
        }
    });
    
    console.log('✅ Profile dropdown initialized successfully');
}

// Add CSS styles for profile dropdown
function addProfileDropdownStyles() {
    // Check if styles already added
    if (document.getElementById('profile-dropdown-styles')) {
        return;
    }
    
    const styles = document.createElement('style');
    styles.id = 'profile-dropdown-styles';
    styles.textContent = `
        .user-profile {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }
        
        .user-name {
            font-weight: 500;
            color: #495057;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .profile-icon {
            position: relative;
        }
        
        .profile-dropdown {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border-radius: 8px;
            padding: 0.5rem 0;
            min-width: 180px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1001;
            border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .profile-dropdown.show {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .profile-dropdown-link {
            display: block;
            padding: 0.75rem 1rem;
            color: #495057;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 0.95rem;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            border-bottom: 1px solid #f8f9fa;
        }
        
        .profile-dropdown-link:last-child {
            border-bottom: none;
        }
        
        .profile-dropdown-link:hover {
            background-color: rgba(40, 167, 69, 0.1);
            color: #28a745;
        }
        
        .profile-dropdown-link.logout:hover {
            background-color: rgba(220, 53, 69, 0.1);
            color: #dc3545;
        }
        
        /* Small arrow pointing up */
        .profile-dropdown::before {
            content: '';
            position: absolute;
            top: -6px;
            right: 15px;
            width: 12px;
            height: 12px;
            background: white;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-bottom: none;
            border-right: none;
            transform: rotate(45deg);
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
            .profile-dropdown {
                right: -10px;
                min-width: 160px;
            }
            
            .user-name {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(styles);
}

// Handle sign out functionality
function handleSignOut() {
    console.log('🚪 Handling sign out...');
    
    if (confirm('Are you sure you want to sign out?')) {
        // Clear user data
        localStorage.removeItem('skillhub_user');
        localStorage.removeItem('skillhub_auth_token');
        
        // Clear any other stored data
        sessionStorage.clear();
        
        console.log('✅ User signed out successfully');
        
        // Redirect to home page
        window.location.href = 'home.html';
    }
}

// Override the existing initializeNavbar function to include profile dropdown
const originalInitializeNavbar = window.initializeNavbar;

// Enhanced navbar initialization that includes profile dropdown
function enhancedInitializeNavbar(container) {
    console.log('🔧 Enhanced navbar initialization...');
    
    // Call original function if it exists
    if (typeof originalInitializeNavbar === 'function') {
        originalInitializeNavbar(container);
    }
    
    // Initialize profile dropdown
    setTimeout(() => {
        initializeProfileDropdown(container);
    }, 100);
}

// Replace the global initializeNavbar function
window.initializeNavbar = enhancedInitializeNavbar;

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Profile dropdown system ready');
    
    // Initialize for any existing navbars
    setTimeout(() => {
        initializeProfileDropdown();
    }, 500);
});

// Listen for navbar loading events
document.addEventListener('navbarLoaded', (e) => {
    console.log('📡 Navbar loaded event detected');
    initializeProfileDropdown(e.detail.container);
});

// Mutation observer to catch dynamically added navbars
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
                // Check if the added node contains a navbar
                const navbar = node.querySelector ? node.querySelector('.navbar-top') : null;
                if (navbar || node.classList?.contains('navbar-top')) {
                    console.log('🔍 New navbar detected via mutation observer');
                    setTimeout(() => {
                        initializeProfileDropdown(node);
                    }, 100);
                }
            }
        });
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Export for global access
window.ProfileDropdown = {
    init: initializeProfileDropdown,
    handleSignOut: handleSignOut
};

console.log('✅ Profile Dropdown System Loaded');