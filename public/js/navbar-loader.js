// navbar-loader.js - Dynamic Navbar Loading System
// This script automatically loads navbars based on div classes

// Navbar configuration mapping
const NAVBAR_CONFIG = {
    'navbar-container': 'components/navbar1.html',      // Default/Guest navbar
    'navbar-learner': 'components/navbar2.html',        // Learner navbar
    'navbar-teacher': 'components/navbar3.html',        // Teacher navbar
    'navbar-sponsor': 'components/navbar4.html'         // Sponsor navbar
};

// Main navbar loader function
async function loadNavbar(containerElement, navbarFile) {
    try {
        console.log(`Loading navbar: ${navbarFile}`);
        
        // Fetch the navbar HTML content
        const response = await fetch(navbarFile);
        if (!response.ok) {
            throw new Error(`Failed to load navbar: ${response.status} ${response.statusText}`);
        }
        
        const navbarHTML = await response.text();
        
        // Parse the HTML and extract only the navbar content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = navbarHTML;
        
        // Find the navbar element (nav.navbar-top)
        const navbarElement = tempDiv.querySelector('nav.navbar-top');
        if (!navbarElement) {
            throw new Error('Navbar element not found in the loaded HTML');
        }
        
        // Insert the navbar into the container
        containerElement.innerHTML = navbarElement.outerHTML;
        
        console.log(`✅ Navbar loaded successfully: ${navbarFile}`);
        
        // Initialize navbar functionality after loading
        initializeNavbar(containerElement);
        
    } catch (error) {
        console.error('❌ Error loading navbar:', error);
        
        // Fallback: Show basic navbar structure
        containerElement.innerHTML = `
            <nav class="navbar-top">
                <div class="navbar-container">
                    <div class="navbar-brand">
                        <img src="images/SkillHub LOGO 3.png" alt="SkillHub Logo" class="logo">
                        <span class="brand-text">SkillHub</span>
                    </div>
                    <div class="navbar-actions">
                        <span style="color: red;">Navbar loading error</span>
                    </div>
                </div>
            </nav>
        `;
    }
}

// Initialize navbar functionality after loading
function initializeNavbar(container) {
    // Setup profile dropdown functionality
    const userProfile = container.querySelector('.user-profile');
    const profileDropdown = container.querySelector('.profile-dropdown');
    
    if (userProfile && profileDropdown) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            profileDropdown.classList.remove('show');
        });
    }
    
    // Setup logout functionality
    const logoutButtons = container.querySelectorAll('.logout, [data-action="signout"]');
    logoutButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof handleLogout === 'function') {
                handleLogout();
            } else {
                console.warn('handleLogout function not found. Make sure login-integration.js is loaded.');
                // Fallback logout
                localStorage.clear();
                window.location.href = 'home.html';
            }
        });
    });
    
    // Setup sign in/sign up buttons
    const signInButtons = container.querySelectorAll('[data-action="signin"]');
    const signUpButtons = container.querySelectorAll('[data-action="signup"]');
    
    signInButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'home.html'; // Redirect to home with login options
        });
    });
    
    signUpButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'home.html'; // Redirect to home with signup options
        });
    });
    
    // Update user information if logged in
    updateUserInfo(container);
}

// Update user information in the navbar
function updateUserInfo(container) {
    const userString = localStorage.getItem('skillhub_user');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            
            // Update user name
            const userNameElement = container.querySelector('.user-name');
            if (userNameElement) {
                const displayName = user.name || 
                                  `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                                  user.email || 
                                  'User';
                userNameElement.textContent = displayName;
            }
            
            // Update profile image
            const profileImage = container.querySelector('.profile-icon img');
            if (profileImage && user.profileImage) {
                profileImage.src = user.profileImage;
            }
            
        } catch (error) {
            console.error('Error updating user info:', error);
        }
    }
}

// Auto-detect and load appropriate navbar based on user type and page
function autoLoadNavbar() {
    // Find all navbar containers
    const navbarContainers = document.querySelectorAll('[class*="navbar"]');
    
    navbarContainers.forEach(container => {
        let navbarFile = null;
        
        // Check each class to find matching navbar
        for (const className of container.classList) {
            if (NAVBAR_CONFIG[className]) {
                navbarFile = NAVBAR_CONFIG[className];
                break;
            }
        }
        
        // If no specific navbar found, try to auto-detect based on user type
        if (!navbarFile) {
            const userString = localStorage.getItem('skillhub_user');
            if (userString) {
                try {
                    const user = JSON.parse(userString);
                    const userTypeNavbar = {
                        'learner': 'components/navbar2.html',
                        'teacher': 'components/navbar3.html',
                        'sponsor': 'components/navbar4.html'
                    };
                    navbarFile = userTypeNavbar[user.type] || 'components/navbar1.html';
                } catch (error) {
                    navbarFile = 'components/navbar1.html'; // Default to guest navbar
                }
            } else {
                navbarFile = 'components/navbar1.html'; // Default to guest navbar
            }
        }
        
        // Load the appropriate navbar
        if (navbarFile) {
            loadNavbar(container, navbarFile);
        }
    });
}

// Manual loading function for specific cases
window.loadSpecificNavbar = function(containerSelector, navbarType) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container not found: ${containerSelector}`);
        return;
    }
    
    const navbarFile = NAVBAR_CONFIG[navbarType];
    if (!navbarFile) {
        console.error(`Unknown navbar type: ${navbarType}`);
        return;
    }
    
    loadNavbar(container, navbarFile);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Navbar Loader initialized');
    
    // Small delay to ensure other scripts are loaded
    setTimeout(() => {
        autoLoadNavbar();
    }, 100);
});

// Export for global use
window.NavbarLoader = {
    loadNavbar,
    autoLoadNavbar,
    loadSpecificNavbar: window.loadSpecificNavbar
};

console.log('✅ Navbar Loader System Ready');