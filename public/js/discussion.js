document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('.reply-box textarea');
    const postButton = document.querySelector('.post-reply');
    const likeBtn = document.querySelector('.like-btn');
    const shareBtn = document.querySelector('.share-btn');
    const reportBtn = document.querySelector('.report-btn');
    const likeCount = document.querySelector('.like-count');
    const shareCount = document.querySelector('.share-count');
    const reportCount = document.querySelector('.report-count');
    const closeIcon = document.querySelector('.close-icon');
    const cancelBtn = document.querySelector('.cancel');

    let likes = 0;
    let shares = 0;
    let reports = 0;

    const currentTime = new Date();
    const timeString = currentTime.toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });

    // Like button functionality
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            likes++;
            likeCount.textContent = likes;
            alert(`Liked at ${timeString} - Total Likes: ${likes}`);
        });
    }

    // Share button functionality
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            shares++;
            shareCount.textContent = shares;
            alert(`Shared at ${timeString} - Total Shares: ${shares}`);
        });
    }

    // Report button functionality
    if (reportBtn) {
        reportBtn.addEventListener('click', () => {
            reports++;
            reportCount.textContent = reports;
            alert(`Reported at ${timeString} - Total Reports: ${reports}`);
        });
    }

    // Enable/disable post button based on textarea input
    if (textarea && postButton) {
        textarea.addEventListener('input', () => {
            postButton.disabled = textarea.value.trim() === '';
        });

        // Post reply functionality
        postButton.addEventListener('click', () => {
            if (textarea.value.trim()) {
                alert('Reply posted!');
                textarea.value = '';
                postButton.disabled = true;
            }
        });
    }

    // Cancel button functionality
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            if (textarea.value.trim() && confirm('Are you sure you want to cancel? Your reply will be lost.')) {
                textarea.value = '';
                postButton.disabled = true;
            }
        });
    }

    // Close icon functionality
    if (closeIcon) {
        closeIcon.addEventListener('click', () => {
            console.log('Close icon clicked'); // Debugging
            if (textarea.value.trim() && !confirm('You have an unsaved reply. Are you sure you want to close?')) {
                return; // Stop if user clicks Cancel
            }
            console.log('Redirecting to learning_community.html'); // Debugging
            window.location.href = '../public/learning_community.html';
        });
    } else {
        console.log('Close icon not found'); // Debugging
    }
});