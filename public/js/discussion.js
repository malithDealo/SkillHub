document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('.reply-box textarea');
    const postButton = document.querySelector('.post-reply');
    const likeBtn = document.querySelector('.like-btn');
    const shareBtn = document.querySelector('.share-btn');
    const reportBtn = document.querySelector('.report-btn');
    const likeCount = document.querySelector('.like-count');
    const shareCount = document.querySelector('.share-count');
    const reportCount = document.querySelector('.report-count');

    let likes = 0;
    let shares = 0;
    let reports = 0;

    const currentTime = new Date('2025-06-02T23:13:00+05:30');
    const timeString = currentTime.toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true });

    likeBtn.addEventListener('click', () => {
        likes++;
        likeCount.textContent = likes;
        alert(`Liked at ${timeString} - Total Likes: ${likes}`);
    });

    shareBtn.addEventListener('click', () => {
        shares++;
        shareCount.textContent = shares;
        alert(`Shared at ${timeString} - Total Shares: ${shares}`);
    });

    reportBtn.addEventListener('click', () => {
        reports++;
        reportCount.textContent = reports;
        alert(`Reported at ${timeString} - Total Reports: ${reports}`);
    });

    textarea.addEventListener('input', () => {
        postButton.disabled = textarea.value.trim() === '';
    });

    postButton.addEventListener('click', () => {
        if (textarea.value.trim()) {
            alert('Reply posted!');
            textarea.value = '';
            postButton.disabled = true;
        }
    });

    const cancelBtn = document.querySelector('.cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            if (textarea.value.trim() && confirm('Are you sure you want to cancel? Your reply will be lost.')) {
                textarea.value = '';
                postButton.disabled = true;
            }
        });
    }

    const closeIcon = document.querySelector('.close-icon');
    if (closeIcon) {
        closeIcon.addEventListener('click', function() {
            if (textarea.value.trim() && confirm('You have an unsaved reply. Are you sure you want to close?')) {
                window.location.href = '../public/learning_community.html';
            } else {
                window.location.href = '../public/learning_community.html';
            }
        });
    }
});