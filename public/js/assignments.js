// Sample Data
const assignmentData = [
    { id: '1', title: 'Math Homework', dueDate: 'Tue, July 8 - 11:59 PM', status: 'Pending' },
    { id: '2', title: 'Physics Project', dueDate: 'Wed, July 9 - 11:59 PM', status: 'Submitted' }
];

// Initialize Assignments
document.addEventListener('DOMContentLoaded', () => {
    renderAssignmentList();
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
    document.getElementById('createAssignmentBtn').addEventListener('click', () => openModal('createAssignmentModal'));
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Forms
    document.getElementById('createAssignmentForm').addEventListener('submit', handleCreateAssignmentSubmit);
    
    // Interactive Elements
    document.querySelectorAll('.student-item').forEach(item => {
        item.addEventListener('click', handleAssignmentItemClick);
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

// Render Assignment List
function renderAssignmentList() {
    const assignmentList = document.getElementById('assignmentList');
    assignmentList.innerHTML = assignmentData.map(assignment => `
        <div class="student-item" data-assignment-id="${assignment.id}">
            <div>
                <p class="font-semibold">${assignment.title}</p>
                <p class="text-sm">${assignment.dueDate}</p>
                <p class="text-sm">${assignment.status}</p>
            </div>
            <button class="session-action-btn"><i class="fas fa-ellipsis-v"></i></button>
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
function handleCreateAssignmentSubmit(event) {
    event.preventDefault();
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDescription').value;
    const dueDate = document.getElementById('assignmentDueDate').value;
    const dueTime = document.getElementById('assignmentDueTime').value;

    if (!title || !description || !dueDate || !dueTime) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    const dueDateTime = new Date(`${dueDate}T${dueTime}:00+05:30`);
    const formattedDueDate = dueDateTime.toLocaleString('en-US', {
        weekday: 'short', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    }).replace(' at', ' -');

    const newAssignment = {
        id: Date.now().toString(),
        title,
        dueDate: formattedDueDate,
        status: 'Pending'
    };

    assignmentData.push(newAssignment);
    renderAssignmentList();
    closeModal('createAssignmentModal');
    showNotification(`Assignment "${title}" created successfully`, 'success');
}

function handleAssignmentItemClick(event) {
    if (event.target.closest('.session-action-btn')) return;
    
    const item = event.currentTarget;
    const assignment = assignmentData.find(a => a.id === item.dataset.assignmentId);
    const details = `
        <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-semibold">Title: ${assignment.title}</p>
            <p class="text-sm">Due: ${assignment.dueDate}</p>
            <p class="text-sm">Status: ${assignment.status}</p>
        </div>
    `;
    
    document.getElementById('assignmentDetailsContent').innerHTML = details;
    document.getElementById('assignmentDetailsModal').dataset.assignmentId = assignment.id;
    openModal('assignmentDetailsModal');
}

// Helper Functions
function applyFilters() {
    const showPending = document.getElementById('filter-pending')?.checked;
    const showSubmitted = document.getElementById('filter-submitted')?.checked;

    document.querySelectorAll('.student-item').forEach(item => {
        const status = item.querySelectorAll('.text-sm')[1].textContent;
        item.style.display = (status === 'Pending' && showPending) || (status === 'Submitted' && showSubmitted) ? 'flex' : 'none';
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