// SkillHub How It Works JavaScript (sponsorhowitworks.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeHowItWorksPage();
    setupEventListeners();
    setupScrollAnimations();
    setupFAQAccordion();
});

// Initialize How It Works Page
function initializeHowItWorksPage() {
    console.log('SkillHub How It Works page initialized');
    
    // Add initial animations
    animateHeroElements();
    
    // Set up intersection observer for scroll animations
    setupIntersectionObserver();
}

// Setup Event Listeners
function setupEventListeners() {
    // Get Started button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', handleGetStarted);
    }

    // Step cards hover effects
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => animateStepCard(card, index));
        card.addEventListener('mouseleave', () => resetStepCard(card));
    });

    // Safety cards interaction
    const safetyCards = document.querySelectorAll('.safety-card');
    safetyCards.forEach(card => {
        card.addEventListener('click', () => highlightSafetyFeature(card));
    });

    // Feature cards interaction
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', () => showFeatureDetails(card));
    });

    // Smooth scrolling for any anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Animate Hero Elements
function animateHeroElements() {
    const heroContent = document.querySelector('.hero-content');
    const circles = document.querySelectorAll('.circle');
    
    // Animate hero content
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Animate background circles
    circles.forEach((circle, index) => {
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0)';
        
        setTimeout(() => {
            circle.style.transition = 'all 0.8s ease-out';
            circle.style.opacity = '1';
            circle.style.transform = 'scale(1)';
        }, 500 + (index * 200));
    });
}

// Setup Scroll Animations
function setupScrollAnimations() {
    // Add scroll event listener for navbar effects if needed
    window.addEventListener('scroll', handleScroll);
}

// Handle Scroll Events
function handleScroll() {
    const scrollPosition = window.pageYOffset;
    
    // Add parallax effect to hero background elements
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        const speed = 0.5 + (index * 0.1);
        circle.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
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
                if (entry.target.classList.contains('step-card') || 
                    entry.target.classList.contains('safety-card') || 
                    entry.target.classList.contains('feature-card')) {
                    
                    const siblings = entry.target.parentNode.children;
                    const index = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animateElements = document.querySelectorAll('.step-card, .safety-card, .feature-card, .faq-item');
    animateElements.forEach(el => observer.observe(el));
}

// Setup FAQ Accordion
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
            
            // Analytics tracking
            trackFAQInteraction(question.querySelector('h3').textContent, !isActive);
        });
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
    showNotification('Redirecting to registration...', 'info');
    
    // Simulate redirect to dashboard or registration
    setTimeout(() => {
        // In a real application, this would redirect to the appropriate page
        window.location.href = 'sponsordashboard1.html';
    }, 1500);
    
    // Track analytics
    trackUserAction('get_started_clicked', 'how_it_works_page');
}

// Animate Step Card on Hover
function animateStepCard(card, index) {
    const stepNumber = card.querySelector('.step-number');
    const stepContent = card.querySelector('.step-content');
    
    // Animate step number
    stepNumber.style.transform = 'scale(1.1) rotate(5deg)';
    stepNumber.style.background = 'linear-gradient(135deg, #28a745, #17a2b8)';
    
    // Animate content
    stepContent.style.transform = 'translateY(-5px)';
    
    // Add pulse effect
    card.style.boxShadow = '0 15px 40px rgba(220, 53, 69, 0.2)';
}

// Reset Step Card Animation
function resetStepCard(card) {
    const stepNumber = card.querySelector('.step-number');
    const stepContent = card.querySelector('.step-content');
    
    stepNumber.style.transform = 'scale(1) rotate(0deg)';
    stepNumber.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
    stepContent.style.transform = 'translateY(0)';
    card.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
}

// Highlight Safety Feature
function highlightSafetyFeature(card) {
    const icon = card.querySelector('.safety-icon');
    const title = card.querySelector('h3').textContent;
    
    // Add highlight animation
    icon.style.transform = 'scale(1.2)';
    icon.style.background = 'linear-gradient(135deg, #28a745, #17a2b8)';
    
    // Reset after animation
    setTimeout(() => {
        icon.style.transform = 'scale(1)';
        icon.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
    }, 300);
    
    // Show notification with safety feature info
    showNotification(`${title} - Learn more about our safety measures!`, 'info');
    
    // Track interaction
    trackUserAction('safety_feature_clicked', title.toLowerCase().replace(/\s+/g, '_'));
}

// Show Feature Details
function showFeatureDetails(card) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    
    // Add click animation
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.style.transform = 'scale(1)';
    }, 150);
    
    // Show detailed information
    showFeatureModal(title, description);
    
    // Track interaction
    trackUserAction('feature_clicked', title.toLowerCase().replace(/\s+/g, '_'));
}

// Show Feature Modal
function showFeatureModal(title, description) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'feature-modal-overlay';
    modal.innerHTML = `
        <div class="feature-modal">
            <div class="feature-modal-header">
                <h3>${title}</h3>
                <button class="feature-modal-close">&times;</button>
            </div>
            <div class="feature-modal-content">
                <p>${description}</p>
                <div class="feature-modal-actions">
                    <button class="feature-modal-learn-more">Learn More</button>
                    <button class="feature-modal-get-started">Get Started</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
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
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.feature-modal-close');
    const learnMoreBtn = modal.querySelector('.feature-modal-learn-more');
    const getStartedBtn = modal.querySelector('.feature-modal-get-started');
    
    closeBtn.addEventListener('click', () => closeFeatureModal(modal, style));
    learnMoreBtn.addEventListener('click', () => {
        showNotification('Learn more feature coming soon!', 'info');
        closeFeatureModal(modal, style);
    });
    getStartedBtn.addEventListener('click', () => {
        handleGetStarted();
        closeFeatureModal(modal, style);
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFeatureModal(modal, style);
        }
    });
}

// Close Feature Modal
function closeFeatureModal(modal, style) {
    modal.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    }, 300);
}

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

// Track User Actions (Analytics)
function trackUserAction(action, details) {
    console.log(`User Action: ${action}`, details);
    
    // In a real application, this would send data to analytics service
    const analyticsData = {
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        page: 'how_it_works',
        userAgent: navigator.userAgent
    };
    
    // Store in localStorage for demo purposes
    let analytics = JSON.parse(localStorage.getItem('skillhub_analytics_events') || '[]');
    analytics.push(analyticsData);
    localStorage.setItem('skillhub_analytics_events', JSON.stringify(analytics));
}

// Track FAQ Interactions
function trackFAQInteraction(question, opened) {
    const action = opened ? 'faq_opened' : 'faq_closed';
    trackUserAction(action, question);
}

// Scroll to Top Function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #dc3545;
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
    
    scrollBtn.addEventListener('click', scrollToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.transform = 'scale(1)';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.transform = 'scale(0.8)';
        }
    });
}

// Initialize scroll to top button
setTimeout(addScrollToTopButton, 1000);

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        const modal = document.querySelector('.feature-modal-overlay');
        if (modal) {
            const style = document.querySelector('style[data-modal="feature"]');
            closeFeatureModal(modal, style);
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

// Smooth scroll behavior for better UX
function initSmoothScrolling() {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize smooth scrolling
initSmoothScrolling();

// Add loading animation
function showPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-spinner">
            <i class="fas fa-graduation-cap"></i>
        </div>
    `;
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        opacity: 1;
        transition: opacity 0.5s ease;
    `;
    
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .loader-spinner i {
            font-size: 3rem;
            color: #dc3545;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(spinnerStyle);
    document.body.appendChild(loader);
    
    // Hide loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    document.body.removeChild(loader);
                    document.head.removeChild(spinnerStyle);
                }
            }, 500);
        }, 500);
    });
}

// Initialize page loader
showPageLoader();

console.log('SkillHub How It Works JavaScript (sponsorhowitworks.js) loaded successfully!');