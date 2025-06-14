document.addEventListener('DOMContentLoaded', function() {
    const addEventBtn = document.querySelector('.events-section .add-btn');
    const addQuestionBtn = document.querySelector('.discussions-section .add-btn');
    const replyBtns = document.querySelectorAll('.reply-btn');
    const actionBtns = document.querySelectorAll('.action-btn');
    const subscribeBtn = document.querySelector('.subscribe-form button');
    const getStartedBtn = document.querySelector('.get-started-btn');

    if (addEventBtn) {
        addEventBtn.addEventListener('click', function() {
            window.location.href = '../public/add_event.html';
        });
    }

    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', function() {
            window.location.href = '../public/add_question.html';
        });
    }

    replyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const discussionTitle = this.closest('.discussion-card').querySelector('h3').textContent;
            window.location.href = '../public/discussion.html?title=' + encodeURIComponent(discussionTitle);
        });
    });

    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('i').className.includes('reply') ? 'Answer' : 'Share';
            const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
            alert(`${action} for event: "${eventTitle}"`);
        });
    });

    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const emailInput = this.closest('.subscribe-form').querySelector('input');
            if (emailInput.value && emailInput.value.includes('@')) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', function() {
            window.location.href = '../public/signup.html';
        });
    }
});