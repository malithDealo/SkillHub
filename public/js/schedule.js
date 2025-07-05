// Sample Data
const scheduleData = [
    { day: 'Sat', date: 'July 5', status: 'Available', time: '08:33 PM' },
    { day: 'Sun', date: 'July 6', status: 'Available', time: '09:00 AM' },
    { day: 'Mon', date: 'July 7', status: 'Available', time: '10:00 AM' },
    { day: 'Tue', date: 'July 8', status: '3 sessions', time: '' },
    { day: 'Wed', date: 'July 9', status: '2 sessions', time: '' },
    { day: 'Thu', date: 'July 10', status: 'Available', time: '2:00 PM' },
    { day: 'Fri', date: 'July 11', status: 'Available', time: '11:00 AM' }
];

// Initialize Schedule
document.addEventListener('DOMContentLoaded', () => {
    renderTimetable();
    setupEventListeners();
    updateDateRange();
});

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    document.getElementById('dashboardLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActivePage('Dashboard Overview', 'dashboard.html');
    });
    
    document.getElementById('scheduleLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActivePage('Schedule Management', 'schedule.html');
    });
    
    document.getElementById('studentsLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActivePage('Student Management', 'students.html');
    });
    
    document.getElementById('assignmentsLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActivePage('Assignment Center', 'assignments.html');
    });
    
    document.getElementById('analyticsLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActivePage('Analytics Dashboard', 'analytics.html');
    });
    
    document.getElementById('sponsorConnectLink').addEventListener('click', (e) => {
        e.preventDefault();
        setActivePage('Sponsor Connection', 'sponsor-connect.html');
        openModal('connectSponsorModal');
    });
    
    // Buttons
    document.getElementById('addScheduleBtn').addEventListener('click', () => openModal('scheduleSlotModal'));
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Forms
    document.getElementById('scheduleSlotForm').addEventListener('submit', handleScheduleSlotSubmit);
    
    // Interactive Elements
    document.querySelectorAll('.session-item').forEach(item => {
        item.addEventListener('click', handleSessionItemClick);
    });
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Modal Close Handlers
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

// Render Timetable
function renderTimetable() {
    const timetableGrid = document.getElementById('timetable-grid');
    timetableGrid.innerHTML = scheduleData.map(item => `
        <div class="timetable-card" data-day="${item.day}" data-date="${item.date}">
            <p class="font-semibold">${item.day}</p>
            <p class="text-sm">${item.date}</p>
            <p class="${item.status === 'Available' ? 'available' : 'sessions'}">${item.status}</p>
            ${item.time ? `<p class="text-xs mt-1">${item.time}</p>` : ''}
        </div>
    `).join('');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
    const form = document.getElementById(modalId)?.querySelector('form');
    if (form) form.reset();
}

// Form Handlers
function handleScheduleSlotSubmit(event) {
    event.preventDefault();
    const day = document.getElementById('slotDay').value;
    const date = document.getElementById('slotDate').value;
    const time = document.getElementById('slotTime').value;

    if (!day || !date || !time) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
    });

    const newSlot = {
        day: day.substring(0, 3),
        date: formattedDate,
        status: 'Available',
        time: formatTime(time)
    };

    scheduleData.push(newSlot);
    renderTimetable();
    closeModal('scheduleSlotModal');
    showNotification('Time slot added successfully', 'success');
}

function handleSessionItemClick(event) {
    if (event.target.closest('.session-action-btn')) return;
    
    const item = event.currentTarget;
    const sessionDetails = `
        <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-semibold">${item.querySelector('.font-semibold').textContent}</p>
            <p class="text-sm">${item.querySelectorAll('.text-sm')[0].textContent}</p>
            <p class="text-sm">${item.querySelectorAll('.text-sm')[1].textContent}</p>
        </div>
    `;
    
    document.getElementById('sessionDetailsModal').innerHTML = sessionDetails;
    document.getElementById('meetLink').href = item.dataset.meetLink;
    document.getElementById('meetLink').textContent = `Join Google Meet: ${item.dataset.meetLink}`;
    document.getElementById('sessionModal').dataset.sessionId = item.dataset.sessionId;
    openModal('sessionModal');
}

// Helper Functions
function applyFilters() {
    const showUpcoming = document.getElementById('filter-upcoming')?.checked;
    const showAvailable = document.getElementById('filter-available')?.checked;

    document.getElementById('sessionDetails')?.style.display = showUpcoming ? 'block' : 'none';
    
    document.querySelectorAll('.timetable-card').forEach(card => {
        if (card.querySelector('.available')) {
            card.style.display = showAvailable ? 'block' : 'none';
        }
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                        type === 'error' ? 'fa-exclamation-circle' : 
                        'fa-exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        notification.addEventListener('animationend', () => notification.remove());
    }, 3000);
}

function toggleMobileMenu() {
    document.querySelector('.sidebar').classList.toggle('active');
}

function setActivePage(title, url) {
    document.getElementById('pageTitle').textContent = title;
    updateActiveNavLink(url);
    showNotification(`Switched to ${title} page`, 'success');
}

function updateActiveNavLink(activeUrl) {
    document.querySelectorAll('.sidebar nav ul li a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeUrl) {
            link.classList.add('active');
        }
    });
}

function updateDateRange() {
    const startDate = new Date('2025-07-05T20:33:00+05:30'); // Updated to 08:33 PM
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('dateRange').textContent = 
        `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}