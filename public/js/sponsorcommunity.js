// SkillHub Community JavaScript (sponsorcommunity.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityPage();
    setupEventListeners();
    setupScrollAnimations();
    loadCommunityData();
});

// Initialize Community Page
function initializeCommunityPage() {
    console.log('SkillHub Community page initialized');
    
    // Add initial animations
    animateHeroElements();
    
    // Set up intersection observer for scroll animations
    setupIntersectionObserver();
    
    // Initialize page tracking
    trackPageVisit();
}

// Setup Event Listeners
function setupEventListeners() {
    // Add Event button
    const addEventBtn = document.getElementById('addEventBtn');
    if (addEventBtn) {
        addEventBtn.addEventListener('click', openCreateEventModal);
    }

    // Add Question button
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', openCreateDiscussionModal);
    }

    // Event form submission
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventSubmission);
    }

    // Discussion form submission
    const discussionForm = document.getElementById('discussionForm');
    if (discussionForm) {
        discussionForm.addEventListener('submit', handleDiscussionSubmission);
    }

    // Discussion items click
    const discussionItems = document.querySelectorAll('.discussion-item');
    discussionItems.forEach(item => {
        item.addEventListener('click', (e) => openViewDiscussionModal(e.currentTarget));
    });

    // Modal close buttons
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Modal overlay click to close
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });

    // Reply action buttons
    setupReplyActionListeners();

    // Event cards interaction
    const eventCards = document.querySelectorAll('.event-card');
    eventCards.forEach(card => {
        card.addEventListener('click', () => showEventDetails(card));
    });
}

// Open Create Event Modal
function openCreateEventModal() {
    console.log('Opening create event modal');
    
    const modal = document.getElementById('createEventModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
    
    trackUserAction('create_event_modal_opened', 'community_page');
}

// Open Create Discussion Modal
function openCreateDiscussionModal() {
    console.log('Opening create discussion modal');
    
    const modal = document.getElementById('createDiscussionModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on first input
    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }, 300);
    
    trackUserAction('create_discussion_modal_opened', 'community_page');
}

// Open View Discussion Modal
function openViewDiscussionModal(discussionElement) {
    console.log('Opening view discussion modal');
    
    const title = discussionElement.querySelector('h3').textContent;
    const modal = document.getElementById('viewDiscussionModal');
    const modalTitle = document.getElementById('discussionModalTitle');
    
    modalTitle.textContent = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    trackUserAction('view_discussion_modal_opened', title);
}

// Close Modal
function closeModal() {
    const modals = document.querySelectorAll('.modal.active');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
    
    // Clear forms
    const forms = document.querySelectorAll('.modal form');
    forms.forEach(form => {
        form.reset();
        clearFormErrors(form);
    });
}

// Handle Event Form Submission
function handleEventSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        title: formData.get('eventTitle') || document.getElementById('eventTitle').value,
        date: formData.get('eventDate') || document.getElementById('eventDate').value,
        category: formData.get('eventCategory') || document.getElementById('eventCategory').value,
        description: formData.get('eventDescription') || document.getElementById('eventDescription').value,
        location: formData.get('eventLocation') || document.getElementById('eventLocation').value,
        time: formData.get('eventTime') || document.getElementById('eventTime').value,
        maxAttendees: formData.get('maxAttendees') || document.getElementById('maxAttendees').value,
        id: Date.now()
    };
    
    // Validate event data
    if (!validateEventData(eventData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating...';
    submitBtn.disabled = true;
    
    // Simulate event creation
    setTimeout(() => {
        // Add event to display
        addEventToGrid(eventData);
        
        // Reset form and button
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and show success
        closeModal();
        showNotification('Event created successfully!', 'success');
        
        // Save to localStorage
        saveEventData(eventData);
        
        // Track creation
        trackUserAction('event_created', eventData.title);
    }, 1500);
}

// Handle Discussion Form Submission
function handleDiscussionSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const discussionData = {
        title: formData.get('discussionTitle') || document.getElementById('discussionTitle').value,
        category: formData.get('discussionCategory') || document.getElementById('discussionCategory').value,
        description: formData.get('discussionDescription') || document.getElementById('discussionDescription').value,
        tags: formData.get('discussionTags') || document.getElementById('discussionTags').value,
        author: 'You',
        time: 'Just now',
        replies: 0,
        id: Date.now()
    };
    
    // Validate discussion data
    if (!validateDiscussionData(discussionData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Posting...';
    submitBtn.disabled = true;
    
    // Simulate discussion creation
    setTimeout(() => {
        // Add discussion to display
        addDiscussionToList(discussionData);
        
        // Reset form and button
        e.target.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Close modal and show success
        closeModal();
        showNotification('Discussion posted successfully!', 'success');
        
        // Save to localStorage
        saveDiscussionData(discussionData);
        
        // Track creation
        trackUserAction('discussion_created', discussionData.title);
    }, 1500);
}

// Validate Event Data
function validateEventData(data) {
    if (!data.title || data.title.trim().length < 3) {
        showNotification('Event title must be at least 3 characters long', 'error');
        return false;
    }
    
    if (!data.date) {
        showNotification('Please select an event date', 'error');
        return false;
    }
    
    if (!data.category) {
        showNotification('Please select a category', 'error');
        return false;
    }
    
    if (!data.description || data.description.trim().length < 10) {
        showNotification('Description must be at least 10 characters long', 'error');
        return false;
    }
    
    if (!data.location || data.location.trim().length < 3) {
        showNotification('Please provide a valid location', 'error');
        return false;
    }
    
    if (!data.time) {
        showNotification('Please select an event time', 'error');
        return false;
    }
    
    return true;
}

// Validate Discussion Data
function validateDiscussionData(data) {
    if (!data.title || data.title.trim().length < 5) {
        showNotification('Question title must be at least 5 characters long', 'error');
        return false;
    }
    
    if (!data.category) {
        showNotification('Please select a category', 'error');
        return false;
    }
    
    if (!data.description || data.description.trim().length < 10) {
        showNotification('Description must be at least 10 characters long', 'error');
        return false;
    }
    
    return true;
}

// Add Event to Grid
function addEventToGrid(eventData) {
    const eventsGrid = document.querySelector('.events-grid');
    if (!eventsGrid) return;
    
    const eventDate = new Date(eventData.date);
    const day = eventDate.getDate();
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
    
    const eventHTML = `
        <div class="event-card animate">
            <div class="event-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <div class="event-info">
                <h3>${eventData.title}</h3>
                <p>${eventData.description}</p>
                <div class="event-meta">
                    <span><i class="fas fa-clock"></i> ${eventData.time}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${eventData.location}</span>
                </div>
            </div>
            <div class="event-attendees">
                <span class="attendee-count">1 attending</span>
            </div>
        </div>
    `;
    
    eventsGrid.insertAdjacentHTML('afterbegin', eventHTML);
    
    // Add click listener to new event
    const newEvent = eventsGrid.firstElementChild;
    newEvent.addEventListener('click', () => showEventDetails(newEvent));
}

// Add Discussion to List
function addDiscussionToList(discussionData) {
    const discussionsList = document.querySelector('.discussions-list');
    if (!discussionsList) return;
    
    const discussionHTML = `
        <div class="discussion-item animate" data-discussion="${discussionData.id}">
            <div class="discussion-content">
                <h3>${discussionData.title}</h3>
                <p>${discussionData.description.substring(0, 100)}...</p>
                <div class="discussion-meta">
                    <span class="author">${discussionData.author}</span>
                    <span class="time">${discussionData.time}</span>
                </div>
            </div>
            <div class="discussion-stats">
                <span class="replies">${discussionData.replies} Replies</span>
            </div>
        </div>
    `;
    
    discussionsList.insertAdjacentHTML('afterbegin', discussionHTML);
    
    // Add click listener to new discussion
    const newDiscussion = discussionsList.firstElementChild;
    newDiscussion.addEventListener('click', (e) => openViewDiscussionModal(e.currentTarget));
}

// Show Event Details
function showEventDetails(eventCard) {
    const title = eventCard.querySelector('h3').textContent;
    const description = eventCard.querySelector('p').textContent;
    
    // Add visual feedback
    eventCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        eventCard.style.transform = 'scale(1)';
    }, 150);
    
    showNotification(`Event: ${title}`, 'info');
    trackUserAction('event_clicked', title);
}

// Setup Reply Action Listeners
function setupReplyActionListeners() {
    // Reply action buttons
    const replyActionBtns = document.querySelectorAll('.reply-action-btn');
    replyActionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.textContent.toLowerCase();
            handleReplyAction(action, btn);
        });
    });
    
    // Add reply form submission
    const replyForm = document.querySelector('.add-reply-section');
    if (replyForm) {
        const submitBtn = replyForm.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', handleReplySubmission);
        }
    }
}

// Handle Reply Action
function handleReplyAction(action, button) {
    const replyItem = button.closest('.reply-item');
    const author = replyItem.querySelector('.reply-author').textContent;
    
    switch(action) {
        case 'like':
            button.style.color = '#dc3545';
            button.innerHTML = '<i class="fas fa-heart"></i> Liked';
            showNotification(`Liked ${author}'s reply`, 'success');
            break;
        case 'share':
            showNotification(`Shared ${author}'s reply`, 'info');
            break;
        case 'report':
            if (confirm(`Report ${author}'s reply for inappropriate content?`)) {
                showNotification('Reply reported. Thank you for keeping our community safe.', 'info');
            }
            break;
    }
    
    trackUserAction('reply_action', { action, author });
}

// Handle Reply Submission
function handleReplySubmission() {
    const textarea = document.getElementById('replyText');
    const replyText = textarea.value.trim();
    
    if (!replyText || replyText.length < 5) {
        showNotification('Reply must be at least 5 characters long', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('.add-reply-section .submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Posting...';
    submitBtn.disabled = true;
    
    // Simulate reply submission
    setTimeout(() => {
        // Add reply to discussion
        addReplyToDiscussion(replyText);
        
        // Reset form and button
        textarea.value = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success
        showNotification('Reply posted successfully!', 'success');
        
        // Track reply
        trackUserAction('reply_posted', replyText.substring(0, 50));
    }, 1000);
}

// Add Reply to Discussion
function addReplyToDiscussion(replyText) {
    const repliesContainer = document.querySelector('.discussion-replies');
    if (!repliesContainer) return;
    
    const replyHTML = `
        <div class="reply-item">
            <div class="reply-avatar">
                <span>Y</span>
            </div>
            <div class="reply-content">
                <div class="reply-author">You</div>
                <div class="reply-text">${replyText}</div>
                <div class="reply-actions">
                    <button class="reply-action-btn">Like</button>
                    <button class="reply-action-btn">Share</button>
                    <button class="reply-action-btn">Report</button>
                </div>
            </div>
        </div>
    `;
    
    repliesContainer.insertAdjacentHTML('beforeend', replyHTML);
    
    // Setup listeners for new reply actions
    const newReply = repliesContainer.lastElementChild;
    const actionBtns = newReply.querySelectorAll('.reply-action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = btn.textContent.toLowerCase();
            handleReplyAction(action, btn);
        });
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
                if (entry.target.classList.contains('event-card') || 
                    entry.target.classList.contains('discussion-item') ||
                    entry.target.classList.contains('stat-card')) {
                    
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
    const animateElements = document.querySelectorAll(
        '.event-card, .discussion-item, .stat-card'
    );
    animateElements.forEach(el => observer.observe(el));
}

// Load Community Data
function loadCommunityData() {
    // Load saved events and discussions from localStorage
    const savedEvents = localStorage.getItem('skillhub_events');
    const savedDiscussions = localStorage.getItem('skillhub_discussions');
    
    if (savedEvents) {
        try {
            const events = JSON.parse(savedEvents);
            console.log('Loaded events:', events);
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }
    
    if (savedDiscussions) {
        try {
            const discussions = JSON.parse(savedDiscussions);
            console.log('Loaded discussions:', discussions);
        } catch (error) {
            console.error('Error loading discussions:', error);
        }
    }
}

// Save Event Data
function saveEventData(eventData) {
    try {
        let events = [];
        const saved = localStorage.getItem('skillhub_events');
        if (saved) {
            events = JSON.parse(saved);
        }
        
        events.push(eventData);
        localStorage.setItem('skillhub_events', JSON.stringify(events));
        console.log('Event saved to storage');
    } catch (error) {
        console.error('Error saving event:', error);
    }
}

// Save Discussion Data
function saveDiscussionData(discussionData) {
    try {
        let discussions = [];
        const saved = localStorage.getItem('skillhub_discussions');
        if (saved) {
            discussions = JSON.parse(saved);
        }
        
        discussions.push(discussionData);
        localStorage.setItem('skillhub_discussions', JSON.stringify(discussions));
        console.log('Discussion saved to storage');
    } catch (error) {
        console.error('Error saving discussion:', error);
    }
}

// Clear Form Errors
function clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorElements.forEach(el => el.classList.remove('error'));
    errorMessages.forEach(msg => msg.remove());
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

// Track User Actions
function trackUserAction(action, details) {
    console.log(`User Action: ${action}`, details);
    
    const analyticsData = {
        action: action,
        details: details,
        timestamp: new Date().toISOString(),
        page: 'community',
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

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Format Time
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Generate Avatar Letter
function generateAvatarLetter(name) {
    return name.charAt(0).toUpperCase();
}

// Truncate Text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Search Functionality (for future enhancement)
function searchEvents(query) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const isVisible = title.includes(query.toLowerCase()) || 
                         description.includes(query.toLowerCase());
        
        card.style.display = isVisible ? 'flex' : 'none';
    });
}

// Search Discussions
function searchDiscussions(query) {
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    discussionItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        const isVisible = title.includes(query.toLowerCase()) || 
                         description.includes(query.toLowerCase());
        
        item.style.display = isVisible ? 'flex' : 'none';
    });
}

// Filter Events by Category
function filterEventsByCategory(category) {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        const isVisible = category === 'all' || 
                         card.dataset.category === category;
        
        card.style.display = isVisible ? 'flex' : 'none';
    });
}

// Filter Discussions by Category
function filterDiscussionsByCategory(category) {
    const discussionItems = document.querySelectorAll('.discussion-item');
    
    discussionItems.forEach(item => {
        const isVisible = category === 'all' || 
                         item.dataset.category === category;
        
        item.style.display = isVisible ? 'flex' : 'none';
    });
}

// Export Community Data (for future enhancement)
function exportCommunityData() {
    const events = JSON.parse(localStorage.getItem('skillhub_events') || '[]');
    const discussions = JSON.parse(localStorage.getItem('skillhub_discussions') || '[]');
    
    const communityData = {
        events: events,
        discussions: discussions,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(communityData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skillhub_community_data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Community data exported successfully!', 'success');
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + N for new event
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openCreateEventModal();
    }
    
    // Ctrl/Cmd + Q for new question
    if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        openCreateDiscussionModal();
    }
    
    // Enter to submit forms when focused on submit button
    if (e.key === 'Enter' && e.target.classList.contains('submit-btn')) {
        e.target.click();
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    // Adjust modal positioning if needed
    const activeModals = document.querySelectorAll('.modal.active');
    activeModals.forEach(modal => {
        // Ensure modal is properly centered
        modal.style.display = 'flex';
    });
});

// Auto-save form data (for better UX)
function setupAutoSave() {
    const forms = document.querySelectorAll('.modal form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                // Save form data to sessionStorage
                const formId = form.id;
                const formData = new FormData(form);
                const data = {};
                
                for (let [key, value] of formData.entries()) {
                    data[key] = value;
                }
                
                sessionStorage.setItem(`skillhub_form_${formId}`, JSON.stringify(data));
            });
        });
    });
}

// Restore auto-saved form data
function restoreAutoSavedData() {
    const forms = document.querySelectorAll('.modal form');
    
    forms.forEach(form => {
        const formId = form.id;
        const savedData = sessionStorage.getItem(`skillhub_form_${formId}`);
        
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                });
            } catch (error) {
                console.error('Error restoring form data:', error);
            }
        }
    });
}

// Clear auto-saved data when form is submitted successfully
function clearAutoSavedData(formId) {
    sessionStorage.removeItem(`skillhub_form_${formId}`);
}

// Initialize auto-save functionality
setTimeout(() => {
    setupAutoSave();
    restoreAutoSavedData();
}, 1000);

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

// Handle form validation in real-time
function setupRealTimeValidation() {
    const forms = document.querySelectorAll('.modal form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => clearInputError(input));
        });
    });
}

// Validate Individual Input
function validateInput(input) {
    const value = input.value.trim();
    const isValid = value.length > 0;
    
    if (!isValid) {
        input.classList.add('error');
        showInputError(input, 'This field is required');
    } else {
        input.classList.remove('error');
        clearInputError(input);
    }
    
    return isValid;
}

// Show Input Error
function showInputError(input, message) {
    // Remove existing error message
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.3rem';
    
    input.parentNode.appendChild(errorElement);
}

// Clear Input Error
function clearInputError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Initialize real-time validation
setTimeout(setupRealTimeValidation, 1000);

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('You are back online!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.', 'info');
});

// Initialize scroll to top button
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
setTimeout(addScrollToTopButton, 2000);

console.log('SkillHub Community JavaScript (sponsorcommunity.js) loaded successfully!');