// Sample Data
const studentData = [
    { id: '1', name: 'John Smith', grade: 'Grade 10 - Mathematics', status: 'Active' },
    { id: '2', name: 'Mary Johnson', grade: 'Grade 11 - Physics', status: 'Active' }
];

// Initialize Students
document.addEventListener('DOMContentLoaded', () => {
    renderStudentList();
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
    document.getElementById('addStudentBtn').addEventListener('click', () => openModal('addStudentModal'));
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    
    // Forms
    document.getElementById('addStudentForm').addEventListener('submit', handleAddStudentSubmit);
    
    // Interactive Elements
    document.querySelectorAll('.student-item').forEach(item => {
        item.addEventListener('click', handleStudentItemClick);
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

// Render Student List
function renderStudentList() {
    const studentList = document.getElementById('studentList');
    studentList.innerHTML = studentData.map(student => `
        <div class="student-item" data-student-id="${student.id}">
            <div class="student-avatar">${student.name.split(' ').map(n => n[0]).join('')}</div>
            <div>
                <p class="font-semibold">${student.name}</p>
                <p class="text-sm">${student.grade}</p>
                <p class="text-sm">${student.status}</p>
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
function handleAddStudentSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('studentName').value;
    const grade = document.getElementById('studentGrade').value;
    const status = document.getElementById('studentStatus').value;

    if (!name || !grade || !status) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    const newStudent = {
        id: Date.now().toString(),
        name,
        grade,
        status
    };

    studentData.push(newStudent);
    renderStudentList();
    closeModal('addStudentModal');
    showNotification(`Student ${name} added successfully`, 'success');
}

function handleStudentItemClick(event) {
    if (event.target.closest('.session-action-btn')) return;
    
    const item = event.currentTarget;
    const student = studentData.find(s => s.id === item.dataset.studentId);
    const details = `
        <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-semibold">Name: ${student.name}</p>
            <p class="text-sm">Grade: ${student.grade}</p>
            <p class="text-sm">Status: ${student.status}</p>
        </div>
    `;
    
    document.getElementById('studentDetailsContent').innerHTML = details;
    document.getElementById('studentDetailsModal').dataset.studentId = student.id;
    openModal('studentDetailsModal');
}

// Helper Functions
function applyFilters() {
    const showActive = document.getElementById('filter-active')?.checked;
    const showInactive = document.getElementById('filter-inactive')?.checked;

    document.querySelectorAll('.student-item').forEach(item => {
        const status = item.querySelectorAll('.text-sm')[1].textContent;
        item.style.display = (status === 'Active' && showActive) || (status === 'Inactive' && showInactive) ? 'flex' : 'none';
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