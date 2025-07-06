// Simple footer loader for SkillHub
// Place this in js/footer-loader.js

async function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    try {
        const response = await fetch('components/footer2.html');
        if (response.ok) {
            const footerHTML = await response.text();
            // Extract only the footer content
            const parser = new DOMParser();
            const doc = parser.parseFromString(footerHTML, 'text/html');
            const footerElement = doc.querySelector('footer');
            
            if (footerElement) {
                footerContainer.innerHTML = footerElement.outerHTML;
            }
        } else {
            console.error('Failed to load footer');
        }
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load footer when page loads
document.addEventListener('DOMContentLoaded', loadFooter);