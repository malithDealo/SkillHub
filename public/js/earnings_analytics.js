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

document.addEventListener('DOMContentLoaded', () => {
    renderTimetable();

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