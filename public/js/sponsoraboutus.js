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
    // Join Community button
    const joinBtn = document.getElementById('joinCommunityBtn');
    if (joinBtn) {
        joinBtn.addEventListener('click', handleJoinCommunity);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
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
        member.addEventListener('mouseenter', () => animateTeamMember(member));
        member.addEventListener('mouseleave', () => resetTeamMember(member));
    });

    // Value cards interaction
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('click', () => highlightValue(card));
    });

    // Mission icon interaction
    const missionIcon = document.querySelector('.mission-icon');
    if (missionIcon) {
        missionIcon.addEventListener('click', () => showMissionDetails());
    }
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
    window.addEventListener('scroll', handleScroll);
}

// Handle Scroll Events
function handleScroll() {
    const scrollPosition = window.pageYOffset;
    
    // Add parallax effect to hero background elements
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        const speed = 0.3 + (index * 0.1);
        circle.style.transform = `translateY(${scrollPosition * speed}px)`;
    });
    
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
                    entry.target.classList.contains('team-member')) {
                    
                    const siblings = entry.target.parentNode.children;
                    const index = Array.from(siblings).indexOf(entry.target);
                    
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('impact-section')) {
                    setTimeout(animateCounters, 500);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animateElements = document.querySelectorAll(
        '.feature-card, .value-card, .team-member, .impact-section'
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
            
            // Add special formatting for percentage
            if (counter.parentNode.querySelector('.stat-label').textContent.includes('Rate')) {
                counter.textContent = Math.floor(current) + '%';
            } else {
                counter.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Handle Join Community Button Click
function handleJoinCommunity() {
    console.log('Join Community button clicked');
    
    // Add click animation
    const button = document.getElementById('joinCommunityBtn');
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
    
    // Show notification
    showNotification('Redirecting to join our community...', 'info');
    
    // Simulate redirect
    setTimeout(() => {
        window.location.href = 'sponsordashboard1.html';
    }, 1500);
    
    // Track analytics
    trackUserAction('join_community_clicked', 'about_us_page');
}

// Handle Contact Form Submission
function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('name') || e.target.querySelector('input[placeholder="Your Name"]').value,
        email: formData.get('email') || e.target.querySelector('input[placeholder="Your Email"]').value,
        message: formData.get('message') || e.target.querySelector('textarea').value
    };
    
    // Validate form data
    if (!validateContactData(contactData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // Save contact submission
        saveContactSubmission(contactData);
        
        // Reset form
        e.target.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Track submission
        trackUserAction('contact_form_submitted', contactData.email);
    }, 2000);
}

// Validate Contact Data
function validateContactData(data) {
    if (!data.name || data.name.trim().length < 2) {
        showNotification('Please enter a valid name', 'error');
        return false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showNotification('Please enter a message with at least 10 characters', 'error');
        return false;
    }
    
    return true;
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
    
    // Show detailed information
    const featureDetails = {
        0: "Our community-first approach ensures that every interaction builds meaningful relationships that extend beyond just skill sharing.",
        1: "The skill exchange economy creates a sustainable learning ecosystem where everyone can participate regardless of their financial situation.",
        2: "Comprehensive safety measures including identity verification, background checks, and secure meeting protocols protect all community members.",
        3: "Our inclusive design welcomes people of all backgrounds, ages, and abilities, celebrating the diversity that makes communities stronger."
    };
    
    const detail = featureDetails[index] || description;
    showNotification(detail, 'info');
    
    // Track interaction
    trackUserAction('feature_clicked', title.toLowerCase().replace(/\s+/g, '_'));
}

// Show Team Member Details
function showTeamMemberDetails(member) {
    const name = member.querySelector('h3').textContent;
    const role = member.querySelector('.member-role').textContent;
    const bio = member.querySelector('.member-bio').textContent;
    
    // Add click animation
    member.style.transform = 'scale(0.98)';
    setTimeout(() => {
        member.style.transform = 'scale(1)';
    }, 150);
    
    // Show member details modal
    showMemberModal(name, role, bio);
    
    // Track interaction
    trackUserAction('team_member_clicked', name.toLowerCase().replace(/\s+/g, '_'));
}

// Show Member Modal
function showMemberModal(name, role, bio) {
    const modal = document.createElement('div');
    modal.className = 'member-modal-overlay';
    modal.innerHTML = `
        <div class="member-modal">
            <div class="member-modal-header">
                <h3>${name}</h3>
                <button class="member-modal-close">&times;</button>
            </div>
            <div class="member-modal-content">
                <p class="modal-role">${role}</p>
                <p class="modal-bio">${bio}</p>
                <p class="modal-extra">Connect with ${name.split(' ')[0]} to learn more about their vision for building stronger communities through shared learning.</p>
            </div>
        </div>
    `;
    
    // Add modal styles
    addMemberModalStyles();
    document.body.appendChild(modal);
    
    // Setup modal event listeners
    const closeBtn = modal.querySelector('.member-modal-close');
    closeBtn.addEventListener('click', () => closeMemberModal(modal));
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMemberModal(modal);
        }
    });
}

// Show Mission Details
function showMissionDetails() {
    const missionIcon = document.querySelector('.mission-icon');
    
    // Add pulse animation
    missionIcon.style.transform = 'scale(1.2)';
    missionIcon.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    setTimeout(() => {
        missionIcon.style.transform = 'scale(1)';
        missionIcon.style.background = 'linear-gradient(135deg, #dc3545, #fd7e14)';
    }, 300);
    
    showNotification('Our mission drives everything we do - building stronger communities through shared learning!', 'info');
    trackUserAction('mission_icon_clicked', 'about_us_page');
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
    showNotification(`${title} - A core value that guides our community!`, 'info');
    
    // Track interaction
    trackUserAction('value_highlighted', title.toLowerCase().replace(/\s+/g, '_'));
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

// Animate Team Member
function animateTeamMember(member) {
    const avatar = member.querySelector('.avatar-placeholder');
    avatar.style.transform = 'scale(1.1)';
    avatar.style.background = 'rgba(255, 255, 255, 0.3)';
}

// Reset Team Member
function resetTeamMember(member) {
    const avatar = member.querySelector('.avatar-placeholder');
    avatar.style.transform = 'scale(1)';
    avatar.style.background = 'rgba(255, 255, 255, 0.2)';
}

// Add Member Modal Styles
function addMemberModalStyles() {
    if (document.querySelector('#member-modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'member-modal-styles';
    style.textContent = `
        .member-modal-overlay {
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
        .member-modal {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        .member-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e9ecef;
            background: linear-gradient(135deg, #dc3545, #fd7e14);
            color: white;
            border-radius: 12px 12px 0 0;
        }
        .member-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: white;
        }
        .member-modal-content {
            padding: 2rem;
        }
        .modal-role {
            color: #dc3545;
            font-weight: 600;
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        .modal-bio {
            margin-bottom: 1.5rem;
            line-height: 1.6;
            color: #666;
        }
        .modal-extra {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            color: #555;
            line-height: 1.6;
            border-left: 4px solid #dc3545;
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

// Close Member Modal
function closeMemberModal(modal) {
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
    
    // Auto remove after 4 seconds for longer messages
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Save Contact Submission
function saveContactSubmission(contactData) {
    let submissions = JSON.parse(localStorage.getItem('skillhub_contact_submissions') || '[]');
    
    const submission = {
        ...contactData,
        timestamp: new Date().toISOString(),
        id: Date.now()
    };
    
    submissions.push(submission);
    localStorage.setItem('skillhub_contact_submissions', JSON.stringify(submissions));
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
        const modal = document.querySelector('.member-modal-overlay');
        if (modal) {
            closeMemberModal(modal);
        }
    }
    
    // Space or Enter to trigger Join Community
    if ((e.key === ' ' || e.key === 'Enter') && e.target === document.getElementById('joinCommunityBtn')) {
        e.preventDefault();
        handleJoinCommunity();
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