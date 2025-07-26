// sponsors.js

// Search Function for Real-Time Suggestions
function searchSponsors() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const companyName = card.querySelector('h3').textContent.toLowerCase();
        const sponsorInitial = card.querySelector('.icon').textContent.toLowerCase();
        const category = card.querySelector('.category-tag').textContent.toLowerCase();
        const location = card.querySelector('p:nth-child(2)').textContent.toLowerCase();

        if (
            companyName.includes(searchInput) ||
            sponsorInitial.includes(searchInput) ||
            category.includes(searchInput) ||
            location.includes(searchInput)
        ) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Contact Sponsor Function - Opens Outlook with pre-filled email
function contactSponsor(companyName, email) {
    console.log('Contacting sponsor:', companyName, email);
    
    const subject = encodeURIComponent(`Partnership Opportunity - ${companyName}`);
    const body = encodeURIComponent(`Hello ${companyName} Team,

I hope this email finds you well. I am reaching out from SkillHub, a neighborhood-based skill exchange platform that connects teachers and learners in local communities.

I am interested in discussing a potential sponsorship opportunity with ${companyName}. Our platform focuses on building meaningful educational connections within communities, and I believe there could be excellent partnership possibilities that would benefit both our platform users and your organization.

I would love to explore how we can work together to create value for our shared communities. Some potential collaboration areas could include:

• Educational workshop sponsorships
• Community event partnerships  
• Skill development program support
• Local learning initiative backing

Would you be available for a brief call or meeting to discuss this opportunity further? I'm excited to learn more about ${companyName}'s community involvement goals and how SkillHub might align with your objectives.

Thank you for your time and consideration. I look forward to hearing from you soon.

Best regards,
[Your Name]
[Your Title] - SkillHub Teacher
[Your Contact Information]

---
This message was sent through SkillHub's sponsor contact system.`);
    
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;
    
    try {
        window.location.href = mailtoLink;
    } catch (error) {
        console.error('Error opening email client:', error);
        alert(`Contact Information:\n\nCompany: ${companyName}\nEmail: ${email}\n\nPlease copy this email address to contact the sponsor manually.`);
    }
}

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Real-Time Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchSponsors);
    }

    // Contact Sponsor Button Functionality
    const contactButtons = document.querySelectorAll('.contact-btn');
    contactButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Find the parent card to get sponsor information
            const card = button.closest('.card');
            const companyName = card.querySelector('h3').textContent;
            const contactEmailElement = card.querySelector('a[href^="mailto:"]');
            
            if (contactEmailElement) {
                // Extract email from mailto link
                const contactEmail = contactEmailElement.getAttribute('href').replace('mailto:', '');
                
                // Call the contact sponsor function
                contactSponsor(companyName, contactEmail);
            } else {
                // Fallback if email link structure is different
                const contactEmail = card.querySelector('a').textContent;
                contactSponsor(companyName, contactEmail);
            }
        });
    });

    // Show success message when user returns from email client
    let emailOpened = false;
    window.addEventListener('focus', () => {
        if (emailOpened) {
            showEmailSuccessMessage();
            emailOpened = false;
        }
    });

    // Track when email client is opened
    const originalContactSponsor = window.contactSponsor;
    window.contactSponsor = function(companyName, email) {
        emailOpened = true;
        setTimeout(() => {
            emailOpened = false; // Reset after 3 seconds
        }, 3000);
        return originalContactSponsor ? originalContactSponsor(companyName, email) : contactSponsor(companyName, email);
    };
});

// Show success message after email client interaction
function showEmailSuccessMessage() {
    // Check if notification already exists
    if (document.querySelector('.email-success-notification')) {
        return;
    }

    const notification = document.createElement('div');
    notification.className = 'email-success-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(40, 167, 69, 0.4);
        z-index: 2000;
        font-weight: 600;
        font-family: Arial, sans-serif;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C2.89,4 2,4.89 2,4Z"/>
        </svg>
        Email client opened successfully!
    `;
    
    // Add animation styles if not already present
    if (!document.getElementById('email-success-styles')) {
        const style = document.createElement('style');
        style.id = 'email-success-styles';
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
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 4000);
}