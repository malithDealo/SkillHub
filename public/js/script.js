function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.getElementById(modalId).querySelector('form').reset();
}

function handleAdFormSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('adTitle').value;
    const description = document.getElementById('adDescription').value;
    const image = document.getElementById('adImage').value;

    axios.post('/api/advertisements', { title, description, image })
        .then(response => {
            const ad = response.data;
            const adList = document.getElementById('ad-list');
            const adDiv = document.createElement('div');
            adDiv.className = 'ad-preview';
            adDiv.innerHTML = `
                <h4 class="font-semibold">${ad.title}</h4>
                <p>${ad.description}</p>
                ${ad.image ? `<img src="${ad.image}" alt="${ad.title}" class="w-full h-32 object-cover rounded mt-2">` : ''}
            `;
            adList.appendChild(adDiv);
            closeModal('adModal');
        })
        .catch(error => {
            console.error('Error creating advertisement:', error);
            alert('Failed to create advertisement. Please try again.');
        });
}

function handleCommunityPostFormSubmit(event) {
    event.preventDefault();
    const content = event.target.querySelector('textarea').value;

    axios.post('/api/community/teacher/posts', { content })
        .then(response => {
            const post = response.data;
            const postsDiv = document.getElementById('community-posts');
            const postDiv = document.createElement('div');
            postDiv.className = 'community-post';
            postDiv.innerHTML = `
                <p class="font-semibold">You</p>
                <p>${post.content}</p>
                <p class="text-sm text-gray-600">Just now</p>
            `;
            postsDiv.prepend(postDiv);
            event.target.reset();
        })
        .catch(error => {
            console.error('Error posting to community:', error);
            alert('Failed to post. Please try again.');
        });
}

function handleEventFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;

    axios.post('/api/events', { name, date, description })
        .then(response => {
            const event = response.data;
            const eventList = document.getElementById('event-list');
            const eventDiv = document.createElement('div');
            eventDiv.className = 'border-b pb-2';
            eventDiv.innerHTML = `
                <p class="font-semibold">${event.name}</p>
                <p class="text-sm text-gray-600">${event.date}</p>
                <p>${event.description}</p>
            `;
            eventList.appendChild(eventDiv);
            event.target.reset();
        })
        .catch(error => {
            console.error('Error creating event:', error);
            alert('Failed to create event. Please try again.');
        });
}

function handleSponsorRequestFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('sponsorName').value;
    const message = document.getElementById('sponsorMessage').value;

    axios.post('/api/sponsor/requests', { name, message })
        .then(response => {
            const request = response.data;
            const conversationsDiv = document.getElementById('sponsor-conversations');
            const requestDiv = document.createElement('div');
            requestDiv.className = 'border-b pb-2';
            requestDiv.innerHTML = `
                <p class="font-semibold">${request.name}</p>
                <p class="text-sm text-gray-600">Last message: "${request.message}"</p>
                <a href="#" class="text-blue-500">Reply</a>
            `;
            conversationsDiv.appendChild(requestDiv);
            closeModal('sponsorRequestModal');
        })
        .catch(error => {
            console.error('Error sending sponsor request:', error);
            alert('Failed to send sponsor request. Please try again.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    // Advertisement Modal
    const adForm = document.getElementById('adForm');
    if (adForm) adForm.addEventListener('submit', handleAdFormSubmit);

    // Community Post Form
    const communityPostForm = document.getElementById('communityPostForm');
    if (communityPostForm) communityPostForm.addEventListener('submit', handleCommunityPostFormSubmit);

    // Event Form
    const eventForm = document.getElementById('eventForm');
    if (eventForm) eventForm.addEventListener('submit', handleEventFormSubmit);

    // Sponsor Request Form
    const sponsorRequestForm = document.getElementById('sponsorRequestForm');
    if (sponsorRequestForm) sponsorRequestForm.addEventListener('submit', handleSponsorRequestFormSubmit);

    // Filter Functionality
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log('Filter applied:', checkbox.id);
            // Implement filter logic here
        });
    });

    // Set active sidebar link
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});