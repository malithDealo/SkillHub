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
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function handleEventFormSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('eventName').value;
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;
    const eventType = document.getElementById('eventType').value;
    const category = document.getElementById('eventCategory').value;
    const time = document.getElementById('eventTime').value;
    const duration = document.getElementById('eventDuration').value;
    const maxParticipants = document.getElementById('maxParticipants').value;
    const location = document.getElementById('eventLocation').value;
    const fee = document.getElementById('eventFee').value;
    const targetGrades = Array.from(document.getElementById('targetGrades').selectedOptions).map(option => option.value);

    axios.post('/api/events', { 
        name, 
        date, 
        description,
        eventType,
        category,
        time,
        duration,
        maxParticipants,
        location,
        fee,
        targetGrades 
    })
        .then(response => {
            const event = response.data;
            const eventList = document.getElementById('event-list');
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-card';
            eventDiv.innerHTML = `
                <div class="event-content">
                    <div class="event-header">
                        <div>
                            <h3 class="event-title">${event.name}</h3>
                            <span class="event-status status-upcoming">Upcoming</span>
                        </div>
                        <div class="event-date">
                            <div>${new Date(event.date).toLocaleString('en-US', { month: 'short' })}</div>
                            <div>${new Date(event.date).getDate()}</div>
                        </div>
                    </div>
                    <div class="event-details">
                        <div class="event-detail-item"><i class="fas fa-clock"></i> ${event.time}</div>
                        <div class="event-detail-item"><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                        <div class="event-detail-item"><i class="fas fa-users"></i> Max ${event.maxParticipants} participants</div>
                        <div class="event-detail-item"><i class="fas fa-tag"></i> ${event.eventType} • Grades ${event.targetGrades.join(', ')}</div>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-stats">
                        <div class="event-stat"><div class="stat-number">0</div><div class="stat-label">Registered</div></div>
                        <div class="event-stat"><div class="stat-number">${event.maxParticipants}</div><div class="stat-label">Available</div></div>
                        <div class="event-stat"><div class="stat-number">$${event.fee}</div><div class="stat-label">Fee</div></div>
                    </div>
                    <div class="event-actions">
                        <button class="btn primary"><i class="fas fa-edit"></i> Edit Event</button>
                        <button class="btn btn-secondary"><i class="fas fa-users"></i> View Attendees</button>
                        <button class="btn btn-success"><i class="fas fa-envelope"></i> Send Update</button>
                    </div>
                </div>
            `;
            eventList.appendChild(eventDiv);
            closeModal('createEventModal');
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

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            if (this.tagName === 'BUTTON') {
                document.querySelectorAll('.filter-tab').forEach(t => {
                    if (t.tagName === 'BUTTON') t.classList.remove('active');
                });
                this.classList.add('active');
                // Implement event filtering logic here
            }
        });
    });

    // Close modal when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };

    // Set minimum date to today
    document.getElementById('eventDate').min = new Date().toISOString().split('T')[0];

    // Highlight current page in sidebar
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});