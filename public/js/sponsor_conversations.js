const scheduleData = [
    { day: 'Mon', date: 'June 2', status: 'Available' },
    { day: 'Tue', date: 'June 3', status: '3 sessions' },
    { day: 'Wed', date: 'June 4', status: '2 sessions' },
    { day: 'Thu', date: 'June 5', status: 'Available' },
    { day: 'Fri', date: 'June 6', status: 'Available' },
    { day: 'Sat', date: 'June 7', status: 'Available' },
    { day: 'Sun', date: 'June 8', status: 'Available' }
];

function renderTimetable() {
    const timetableContainers = document.querySelectorAll('.timetable');
    timetableContainers.forEach(container => {
        container.innerHTML = `
            <h3>Weekly Schedule</h3>
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${scheduleData.map(item => `
                        <tr>
                            <td>${item.day}</td>
                            <td>${item.date}</td>
                            <td class="${item.status === 'Available' ? 'available' : 'sessions'}">${item.status}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    const form = document.getElementById(modalId)?.querySelector('form');
    if (form) form.reset();
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
            requestDiv.className = 'community-post';
            requestDiv.innerHTML = `
                <p class="font-semibold">${request.name}</p>
                <p class="text-sm">Last message: "${request.message}"</p>
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
    renderTimetable();

    const sponsorRequestForm = document.getElementById('sponsorRequestForm');
    if (sponsorRequestForm) sponsorRequestForm.addEventListener('submit', handleSponsorRequestFormSubmit);

    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            console.log('Filter applied:', checkbox.id);
            // Implement filter logic here
        });
    });

    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});