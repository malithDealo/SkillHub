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

document.addEventListener('DOMContentLoaded', () => {
    renderTimetable();

    const eventForm = document.getElementById('eventForm');
    if (eventForm) eventForm.addEventListener('submit', handleEventFormSubmit);

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