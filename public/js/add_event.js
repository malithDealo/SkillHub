document.addEventListener('DOMContentLoaded', function() {
    const eventTypeBtns = document.querySelectorAll('.event-type-btn');
    eventTypeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            eventTypeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const skillLevelBtns = document.querySelectorAll('.skill-level-btn');
    skillLevelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            skillLevelBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const eventTitle = document.getElementById('event-title').value.trim();
        if (!eventTitle) {
            alert('Please enter an event title');
            return;
        }
        const formData = {
            title: eventTitle,
            category: document.getElementById('category').value,
            eventType: document.querySelector('.event-type-btn.active') ? document.querySelector('.event-type-btn.active').getAttribute('data-type') : '',
            description: document.getElementById('event-description').value,
            date: document.getElementById('event-date').value,
            startTime: document.getElementById('start-time').value,
            endTime: document.getElementById('end-time').value,
            location: document.getElementById('location').value,
            maxParticipants: document.getElementById('max-participants').value,
            cost: document.getElementById('cost').value,
            skillLevel: document.querySelector('.skill-level-btn.active') ? document.querySelector('.skill-level-btn.active').getAttribute('data-level') : '',
            tags: document.getElementById('event-tags').value,
            options: {
                requireAdvance: document.getElementById('require-advance').checked,
                allowWaitlist: document.getElementById('allow-waitlist').checked,
                sendReminders: document.getElementById('send-reminders').checked,
                recurring: document.getElementById('recurring').checked
            },
            contact: {
                email: document.getElementById('contact-email').value,
                phone: document.getElementById('contact-number').value
            }
        };
        console.log('Form data:', formData);
        alert('Event created successfully!');
        form.reset();
    });
    
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', function() {
        if(confirm('Are you sure you want to cancel? All changes will be lost.')) {
            form.reset();
        }
    });
    
    const closeIcon = document.querySelector('.close-icon');
    closeIcon.addEventListener('click', function() {
        if(form.elements.length > 0 && Array.from(form.elements).some(el => el.value && el.value.trim() !== '')) {
            if(confirm('You have unsaved changes. Are you sure you want to close?')) {
                closeForm();
            }
        } else {
            closeForm();
        }
    });
    
    let formState = {};
    form.addEventListener('change', function() {
        formState = Array.from(form.elements).reduce((acc, el) => {
            if (el.name) {
                acc[el.name] = el.value;
            }
            return acc;
        }, {});
    });
});

function closeForm() {
    window.location.href = '../public/learning_community.html';
}