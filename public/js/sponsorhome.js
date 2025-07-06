// SkillHub About Us JavaScript (sponsoraboutus.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutUsPage();
    setupEventListeners();
    setupScrollAnimations();
    setupCounterAnimations();
});

// Initialize About Us Page
function initializeAboutUsPage() {
    console.log('SkillHub About Us page initialized');
    
    // Add initial animations
    animateHeroElements();
    
    // Set up intersection observer for scroll animations
    setupIntersectionObserver();
    
    // Initialize page tracking
    trackPageVisit();
}

// Setup Event Listeners
function setupEventListeners() {
    // Get Started button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', handleGetStarted);
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }

    // Feature cards interaction
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.addEventListener('click', () => showFeatureDetails(card, index));
        card.addEventListener('mouseenter', () => animateFeatureCard(card));
        card.addEventListener('mouseleave', () => resetFeatureCard(card));
    });

    // Team member interactions
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('click', () => showTeamMemberDetails(member));
    });

    // Value cards interaction
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('click', () => highlightValue(card));
    });

    // Impact cards interaction
    const impactCards = document.querySelectorAll('.impact-card');
    impactCards.forEach(card => {
        card.addEventListener('click', () => showImpactDetails(card));
    });

    // Social media links
    const socialLinks = document.querySelectorAll('.member-social a');
    socialLinks.forEach(link => {
        link.addEventListener('click', handleSocialClick);
    });
}

// Animate Hero Elements
function animateHeroElements() {
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    // Animate hero text
    if (heroText) {
        heroText.style.opacity = '0';
        heroText.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            heroText.style.transition = 'all 1s ease-out';
            heroText.style.opacity = '1';
            heroText.style.transform = 'translateX(0)';
        }, 300);
    }
    
    // Animate hero image
    if (heroImage) {
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            heroImage.style.transition = 'all 1s ease-out 0.2s';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'translateX(0)';
        }, 500);
    }
}

// Setup Scroll Animations
function setupScrollAnimations() {
    window.addEventListener('scroll', handleScroll);
}

// Handle Scroll Events
function handleScroll() {
    const scrollPosition = window.pageYOffset;
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
    
    // Show/hide scroll to top button
    toggleScrollToTopButton(scrollPosition);
}

// Setup Intersection Observer for Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('feature-card') || 
                    entry.target.classList.contains('value-card') || 
                    entry.target.classList.contains('team-member') ||
                    entry.target.classList.contains('impact-card')) {
                    
                    const siblings = entry.target.parentNode.children;
                    const index = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('community-stats-section')) {
                    setTimeout(animateCounters, 500);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .step-item, .value-card, .team-member, .impact-card, .community-stats-section'
    );
    animateElements.forEach(el => observer.observe(el));
}

// Setup Counter Animations
function setupCounterAnimations() {
    // This will be triggered by the intersection observer
}

// Animate Counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Handle Get Started Button Click
function handleGetStarted() {
    console.log('Get Started button clicked');
    
    // Add click animation
    const button = document.getElementById('getStartedBtn');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // Show notification
    showNotification('Redirecting to get started...', 'info');
    
    // Simulate redirect
    setTimeout(() => {
        window.location.href = 'sponsordashboard1.html';
    }, 1500);
    
    // Track analytics
    trackUserAction('get_started_clicked', 'about_us_page');
}

// Handle Newsletter Submission
function handleNewsletterSubmission(e) {
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
    
    // Show loading state
    const submitBtn = e.target.querySelector('button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate subscription process
    setTimeout(() => {
        // Save subscription
        saveNewsletterSubscription(email);
        
        // Reset form
        emailInput.value = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Successfully subscribed to newsletter!', 'success');
        
        // Track subscription
        trackUserAction('newsletter_subscribed', email);
    }, 1500);
}

// Show Feature Details
function showFeatureDetails(card, index) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    
    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 150);
    
    // Show detailed modal
    showFeatureModal(title, description, index);
    
    // Track interaction
    trackUserAction('feature_clicked', title.toLowerCase().replace(/\s+/g, '_'));
}

// Show Feature Modal
function showFeatureModal(title, description, index) {
    const featureDetails = {
        0: {
            title: "Hyper-Local Learning",
            detail: "Connect with skilled neighbors within walking distance. Our platform uses advanced location matching to find the perfect learning partners in your immediate area, fostering real community connections."
        },
        1: {
            title: "Two-Way Exchange",
            detail: "Experience the joy of both teaching and learning. Our unique skill-swapping system lets you offer your expertise while learning new skills, creating a balanced learning ecosystem."
        },
        2: {
            title: "Verified & Safe",
            detail: "Comprehensive identity verification, background checks, and secure payment systems ensure every interaction is safe and trustworthy. Your peace of mind is our priority."
        },
        3: {
            title: "Inclusive Platform",
            detail: "Designed for everyone, regardless of age, background, or skill level. We believe diversity enriches learning and welcome all community members to share and grow together."
        }
    };
    
    const detail = featureDetails[index] || { title, detail: description };
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'feature-modal-overlay';
    modal.innerHTML = `
        <div class="feature-modal">
            <div class="feature-modal-header">
                <h3>${detail.title}</h3>
                <button class="feature-modal-close">&times;</button>
            </div>
            <div class="feature-modal-content">
                <p>${detail.detail}</p>
                <div class="feature-modal-actions">
                    <button class="feature-modal-learn-more">Learn More</button>
                    <button class="feature-modal-get-started">Get Started</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    addModalStyles();
    document.body.appendChild(modal);
    
    // Setup modal event listeners
    setupModalEventListeners(modal);
}

// Show Team Member Details
function showTeamMemberDetails(member) {
    const name = member.querySelector('h3').textContent;
    const role = member.querySelector('.member-role').textContent;
    const bio = member.querySelector('.member-bio').textContent;
    
    // Add click animation
    member.style.transform = 'scale(0.95)';
    setTimeout(() => {
        member.style.transform = 'scale(1)';
    }, 150);
    
    // Show notification with member info
    showNotification(`Learn more about ${name} - ${role}`, 'info');
    
    // Track interaction
    trackUserAction('team_member_clicked', name.toLowerCase().replace(/\s+/g, '_'));
}

// Highlight Value
function highlightValue(card) {
    const title = card.querySelector('h3').textContent;
    const icon = card.querySelector('.value-icon');
    
    // Add highlight animation
    icon.style.transform = 'scale(1.2) rotate(10deg)';
    icon.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
    
    // Reset after animation
    setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
        icon.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    }, 500);
    
    // Show value description
    showNotification(`${title} - Core to our mission!`, 'info');
    
    // Track interaction
    trackUserAction('value_highlighted', title.toLowerCase().replace(/\s+/g, '_'));
}

// Show Impact Details
function showImpactDetails(card) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    
    // Add pulse animation
    card.style.transform = 'scale(1.05)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 200);
    
    // Show impact notification
    showNotification(`${title}: ${description}`, 'info');
    
    // Track interaction
    trackUserAction('impact_viewed', title.toLowerCase().replace(/\s+/g, '_'));
}

// Animate Feature Card
function animateFeatureCard(card) {
    const icon = card.querySelector('.feature-icon');
    icon.style.transform = 'scale(1.1) rotate(5deg)';
}

// Reset Feature Card
function resetFeatureCard(card) {
    const icon = card.querySelector('.feature-icon');
    icon.style.transform = 'scale(1) rotate(0deg)';
}

// Handle Social Click
function handleSocialClick(e) {
    e.preventDefault();
    
    const platform = e.currentTarget.querySelector('i').className;
    const memberName = e.currentTarget.closest('.team-member').querySelector('h3').textContent;
    
    showNotification(`Opening ${platform} profile for ${memberName}`, 'info');
    
    // Track social click
    trackUserAction('social_clicked', { member: memberName, platform });
}

// Add Modal Styles
function addModalStyles() {
    if (document.querySelector('#modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .feature-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        }
        .feature-modal {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        .feature-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e9ecef;
        }
        .feature-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        .feature-modal-content {
            padding: 2rem;
        }
        .feature-modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .feature-modal-learn-more,
        .feature-modal-get-started {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        .feature-modal-learn-more {
            background: #6c757d;
            color: white;
        }
        .feature-modal-get-started {
            background: #28a745;
            color: white;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Setup Modal Event Listeners
function setupModalEventListeners(modal) {
    const closeBtn = modal.querySelector('.feature-modal-close');
    const learnMoreBtn = modal.querySelector('.feature-modal-learn-more');
    const getStartedBtn = modal.querySelector('.feature-modal-get-started');
    
    closeBtn.addEventListener('click', () => closeModal(modal));
    learnMoreBtn.addEventListener('click', () => {
        showNotification('Learn more feature coming soon!', 'info');
        closeModal(modal);
    });
    getStartedBtn.addEventListener('click', () => {
        handleGetStarted();
        closeModal(modal);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
}

// Close Modal
function closeModal(modal) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        if (modal.parentNode) {
            document.body.removeChild(modal);
        }
    }, 300);
}

// Toggle Scroll to Top Button
function toggleScrollToTopButton(scrollPosition) {
    let scrollBtn = document.querySelector('.scroll-to-top');
    
    if (!scrollBtn) {
        scrollBtn = createScrollToTopButton();
    }
    
    if (scrollPosition > 300) {
        scrollBtn.style.opacity = '1';
        scrollBtn.style.transform = 'scale(1)';
    } else {
        scrollBtn.style.opacity = '0';
        scrollBtn.style.transform = 'scale(0.8)';
    }
}

// Create Scroll to Top Button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #dc3545, #fd7e14);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    return scrollBtn;
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
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
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

// Save Newsletter Subscription
function saveNewsletterSubscription(email) {
    let subscriptions = JSON.parse(localStorage.getItem('skillhub_newsletter_subscriptions') || '[]');
    
    if (!subscriptions.includes(email)) {
        subscriptions.push(email);
        localStorage.setItem('skillhub_newsletter_subscriptions', JSON.stringify(subscriptions));
    }
}

// Track User Actions
function trackUserAction(action, details) {
    console.log(`User Action: ${action}`, details);
    
    const analyticsData = {
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        page: 'about_us',
        userAgent: navigator.userAgent
    };
    
    let analytics = JSON.parse(localStorage.getItem('skillhub_analytics_events') || '[]');
    analytics.push(analyticsData);
    localStorage.setItem('skillhub_analytics_events', JSON.stringify(analytics));
}

// Track Page Visit
function trackPageVisit() {
    trackUserAction('page_visited', {
        referrer: document.referrer,
        loadTime: performance.now()
    });
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.feature-modal-overlay');
        if (modal) {
            closeModal(modal);
        }
    }
    
    // Space or Enter to trigger Get Started
    if ((e.key === ' ' || e.key === 'Enter') && e.target === document.getElementById('getStartedBtn')) {
        e.preventDefault();
        handleGetStarted();
    }
});

// Page visibility change tracking
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        trackUserAction('page_hidden', new Date().toISOString());
    } else {
        trackUserAction('page_visible', new Date().toISOString());
    }
});

// Track page load time
window.addEventListener('load', function() {
    const loadTime = performance.now();
    trackUserAction('page_loaded', { loadTime: Math.round(loadTime) });
});

console.log('SkillHub About Us JavaScript (sponsoraboutus.js) loaded successfully!');