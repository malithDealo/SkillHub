// Global variables
let currentFilter = 'all';
let currentSearch = '';

// Modal functions
function openAddSponsorModal() {
    console.log('Opening modal');
    const modal = document.getElementById('addSponsorModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeAddSponsorModal() {
    console.log('Closing modal');
    const modal = document.getElementById('addSponsorModal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
    
    // Reset form
    document.getElementById('sponsorForm').reset();
}

// Form submission
function submitSponsorForm(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    const form = document.getElementById('sponsorForm');
    const formData = new FormData(form);
    const data = {};
    
    // Get all form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    console.log('Form data:', data);
    
    // Validate required fields
    const requiredFields = ['companyName', 'contactPerson', 'emailAddress', 'phoneNumber', 'location', 'category', 'sponsorshipBudget', 'sponsorshipInterests'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
        alert('Please fill in all required fields: ' + missingFields.join(', '));
        return;
    }
    
    if (!data.agreeTerms) {
        alert('Please agree to the guidelines.');
        return;
    }
    
    // Create new sponsor card
    addNewSponsorCard(data);
    
    // Close modal and show success
    closeAddSponsorModal();
    showSuccessMessage();
}

// Add new sponsor card
function addNewSponsorCard(data) {
    console.log('Adding new sponsor card for:', data.companyName);
    
    const sponsorsGrid = document.getElementById('sponsorsGrid');
    const avatar = data.companyName.charAt(0).toUpperCase();
    const colors = ['', 'green', 'blue', 'orange', 'purple', 'teal'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const budgetMap = {
        '1000-5000': '$1,000 - $5,000',
        '5000-15000': '$5,000 - $15,000',
        '15000-50000': '$15,000 - $50,000',
        '50000+': '$50,000+'
    };
    
    const newCardHTML = `
        <div class="sponsor-card" data-category="${data.category}" data-name="${data.companyName.toLowerCase()}" data-location="${data.location.toLowerCase()}">
            <div class="sponsor-header">
                <div class="sponsor-avatar ${randomColor}">
                    <span>${avatar}</span>
                </div>
                <div class="sponsor-status">
                    <span class="status-badge verified">Verified</span>
                </div>
            </div>
            <div class="sponsor-info">
                <h3>${data.companyName}</h3>
                <div class="sponsor-details">
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${data.location}</p>
                    <p class="contact"><i class="fas fa-envelope"></i> ${data.emailAddress}</p>
                    ${data.companyWebsite ? `<p class="website"><i class="fas fa-globe"></i> ${data.companyWebsite}</p>` : ''}
                    <p class="interests"><i class="fas fa-heart"></i> ${data.sponsorshipInterests}</p>
                </div>
                <div class="sponsor-budget">
                    <span class="budget-label">Budget:</span>
                    <span class="budget-amount">${budgetMap[data.sponsorshipBudget] || data.sponsorshipBudget}</span>
                </div>
                <button class="contact-sponsor-btn" onclick="contactSponsor('${data.companyName}', '${data.emailAddress}')">
                    <i class="fas fa-handshake"></i>
                    Contact Sponsor
                </button>
            </div>
        </div>
    `;
    
    sponsorsGrid.insertAdjacentHTML('beforeend', newCardHTML);
    
    // Apply current filters to show/hide the new card
    applyFilters();
}

// Filter by category
function filterByCategory(category) {
    console.log('Filtering by category:', category);
    currentFilter = category;
    
    // Update button states
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find and activate the clicked button
    filterBtns.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(category) || 
            (category === 'all' && btn.textContent.toLowerCase().includes('all'))) {
            btn.classList.add('active');
        }
    });
    
    applyFilters();
}

// Search function
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    currentSearch = searchInput.value.toLowerCase().trim();
    console.log('Searching for:', currentSearch);
    applyFilters();
}

// Apply filters (both category and search)
function applyFilters() {
    const sponsorCards = document.querySelectorAll('.sponsor-card');
    const noResults = document.getElementById('noResults');
    let visibleCount = 0;
    
    sponsorCards.forEach(card => {
        let shouldShow = true;
        
        // Category filter
        if (currentFilter !== 'all') {
            const cardCategory = card.getAttribute('data-category');
            if (cardCategory !== currentFilter) {
                shouldShow = false;
            }
        }
        
        // Search filter
        if (currentSearch && shouldShow) {
            const cardName = card.getAttribute('data-name') || '';
            const cardLocation = card.getAttribute('data-location') || '';
            const cardCategory = card.getAttribute('data-category') || '';
            const searchText = `${cardName} ${cardLocation} ${cardCategory}`;
            
            if (!searchText.includes(currentSearch)) {
                shouldShow = false;
            }
        }
        
        // Show or hide card
        if (shouldShow) {
            card.style.display = 'block';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
    }
    
    console.log(`Showing ${visibleCount} sponsors`);
}

// Clear all filters
function clearAllFilters() {
    console.log('Clearing all filters');
    currentFilter = 'all';
    currentSearch = '';
    
    // Reset search input
    document.getElementById('searchInput').value = '';
    
    // Reset filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase().includes('all')) {
            btn.classList.add('active');
        }
    });
    
    // Show all cards
    applyFilters();
}

// Contact sponsor
function contactSponsor(name, email) {
    console.log('Contacting sponsor:', name, email);
    
    const subject = encodeURIComponent(`Partnership Opportunity - ${name}`);
    const body = encodeURIComponent(`Hello,\n\nI am interested in discussing a potential sponsorship opportunity with ${name}. I would like to explore how we can work together for mutual benefit.\n\nBest regards`);
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    
    try {
        window.location.href = mailtoLink;
    } catch (error) {
        alert(`Contact Information:\n\nCompany: ${name}\nEmail: ${email}\n\nPlease copy this email address to contact the sponsor.`);
    }
}

// Show success message
function showSuccessMessage() {
    console.log('Showing success message');
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 2000;
        font-weight: 600;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        Sponsor profile added successfully!
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 300);
        }
    }, 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
    
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('addSponsorModal');
        if (event.target === modal) {
            closeAddSponsorModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modal = document.getElementById('addSponsorModal');
            if (modal.classList.contains('show')) {
                closeAddSponsorModal();
            }
        }
    });
    
    // Focus search with Ctrl+K
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            document.getElementById('searchInput').focus();
        }
    });
    
    console.log('All functionality initialized!');
});