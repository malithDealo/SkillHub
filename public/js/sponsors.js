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
        button.addEventListener('click', () => {
            // Find the parent card to get the contact email
            const card = button.closest('.card');
            const contactEmail = card.querySelector('a').textContent;

            // Example action: Show an alert with the contact email
            alert(`Contacting sponsor at: ${contactEmail}`);
            
            // Alternative actions (uncomment to use):
            // Open email client:
            // window.location.href = `mailto:${contactEmail}`;
            
            // Redirect to a contact form:
            // window.location.href = `/contact-form?email=${contactEmail}`;
            
            // Send data to an API:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: contactEmail })
            })
            .then(response => response.json())
            .then(data => alert('Contact request sent!'))
            .catch(error => alert('Error sending contact request.'));
            */
        });
    });
});