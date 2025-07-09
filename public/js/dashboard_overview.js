// Add this code to: public/js/dashboard_overview.js (for teachers)
// Teacher Dashboard Profile Update Handler

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Initializing teacher dashboard profile handlers...');
    
    // Initialize profile handlers
    initializeTeacherProfileHandlers();
});

function initializeTeacherProfileHandlers() {
    // Profile picture upload (avatar upload button)
    const avatarUploadBtn = document.querySelector('.avatar-upload');
    if (avatarUploadBtn) {
        avatarUploadBtn.addEventListener('click', handleAvatarUpload);
    }
    
    // Settings form submissions
    const settingsForms = document.querySelectorAll('form, .settings-form');
    settingsForms.forEach(form => {
        if (form.id !== 'passwordForm') { // Exclude password form
            form.addEventListener('submit', handleTeacherProfileUpdate);
        }
    });
    
    // Tab switching for profile settings
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.textContent.toLowerCase().replace(' ', '-');
            if (tabName.includes('personal') || tabName.includes('professional')) {
                // These tabs have profile forms
                setTimeout(initializeTeacherProfileHandlers, 100);
            }
        });
    });
    
    // Real-time name updates
    const nameInputs = document.querySelectorAll('#firstName, #lastName, input[name="firstName"], input[name="lastName"]');
    nameInputs.forEach(input => {
        input.addEventListener('blur', handleTeacherNameUpdate);
    });
}

function handleAvatarUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleTeacherImageUpload(file);
        }
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

async function handleTeacherImageUpload(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        showTeacherError('Please select a valid image file.');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showTeacherError('Image file must be less than 5MB.');
        return;
    }
    
    showTeacherSuccess('Uploading profile picture...');
    
    try {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const imageData = e.target.result;
            
            // Update avatar image immediately
            const avatarImg = document.querySelector('.avatar-img');
            if (avatarImg) {
                avatarImg.src = imageData;
            }
            
            // Update via API
            await updateTeacherProfile({ profileImage: imageData });
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('Error processing teacher image:', error);
        showTeacherError('Failed to process image. Please try again.');
    }
}

async function handleTeacherProfileUpdate(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Remove empty values
    Object.keys(data).forEach(key => {
        if (data[key] === '' || data[key] === null) {
            delete data[key];
        }
    });
    
    // Convert skills to array if it's a string
    if (data.subjects && typeof data.subjects === 'string') {
        data.skills = data.subjects.split(',').map(s => s.trim());
        delete data.subjects;
    }
    
    console.log('📝 Updating teacher profile with data:', data);
    
    try {
        const submitBtn = form.querySelector('button[type="submit"], .btn-primary');
        const originalText = submitBtn ? submitBtn.textContent : '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Updating...';
        }
        
        await updateTeacherProfile(data);
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
        
    } catch (error) {
        const submitBtn = form.querySelector('button[type="submit"], .btn-primary');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
    }
}

async function handleTeacherNameUpdate(e) {
    const field = e.target;
    const fieldName = field.name || field.id;
    const fieldValue = field.value.trim();
    
    if (!fieldValue || !fieldName) return;
    
    // Update name fields for real-time navbar updates
    if (fieldName.toLowerCase().includes('name')) {
        const updateData = {};
        updateData[fieldName] = fieldValue;
        
        try {
            await updateTeacherProfile(updateData, false); // Silent update
            console.log('✅ Teacher name field updated:', fieldName, fieldValue);
        } catch (error) {
            console.error('❌ Error updating teacher name field:', error);
        }
    }
}

async function updateTeacherProfile(data, showMessage = true) {
    try {
        const token = localStorage.getItem('skillhub_token');
        if (!token) {
            showTeacherError('Please log in again to update your profile.');
            return;
        }
        
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local storage
            const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || '{}');
            const updatedUser = { ...currentUser, ...result.user };
            localStorage.setItem('skillhub_user', JSON.stringify(updatedUser));
            
            // Dispatch update event to update navbar
            if (window.dispatchProfileUpdate) {
                window.dispatchProfileUpdate(updatedUser);
            }
            
            if (showMessage) {
                showTeacherSuccess('Profile updated successfully!');
            }
            console.log('✅ Teacher profile updated successfully:', updatedUser);
        } else {
            throw new Error(result.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('❌ Teacher profile update error:', error);
        if (showMessage) {
            showTeacherError('Failed to update profile. Please try again.');
        }
        throw error;
    }
}

function showTeacherSuccess(message) {
    // Remove existing messages
    const existing = document.querySelector('.teacher-success-message');
    if (existing) existing.remove();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'teacher-success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        z-index: 10001;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        min-width: 250px;
        text-align: center;
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">✅</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 3000);
}

function showTeacherError(message) {
    // Remove existing messages
    const existing = document.querySelector('.teacher-error-message');
    if (existing) existing.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'teacher-error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(231, 76, 60, 0.3);
        z-index: 10001;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        min-width: 250px;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.2rem;">❌</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Add teacher-specific styles if not already present
if (!document.querySelector('#teacher-profile-styles')) {
    const style = document.createElement('style');
    style.id = 'teacher-profile-styles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100%);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100%);
            }
        }
        
        .avatar-upload {
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .avatar-upload:hover {
            transform: scale(1.1);
            background: rgba(102, 126, 234, 0.1);
        }
    `;
    document.head.appendChild(style);
}

console.log('✅ Teacher dashboard profile handlers loaded successfully');



// Enhanced Dashboard JavaScript
class TeacherDashboard {
    constructor() {
        this.currentSection = 'overview';
        this.scheduleData = [];
        this.sessionsData = [];
        this.adsData = [];
        this.classesData = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMockData();
        this.renderDashboard();
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 60000); // Update every minute
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.switchSection(section);
            });
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('mobile-visible');
            });
        }

        // Modal triggers
        document.getElementById('addScheduleBtn')?.addEventListener('click', () => {
            this.openModal('scheduleModal');
        });

        document.getElementById('addAdBtn')?.addEventListener('click', () => {
            this.openModal('adModal');
        });

        document.getElementById('connectSponsorBtn')?.addEventListener('click', () => {
            this.openModal('connectSponsorModal');
        });

        document.getElementById('scheduleSessionBtn')?.addEventListener('click', () => {
            this.openModal('sessionModal');
        });

        document.getElementById('addClassBtn')?.addEventListener('click', () => {
            this.openModal('classModal');
        });

        document.getElementById('addAvailabilityBtn')?.addEventListener('click', () => {
            this.openModal('scheduleModal');
        });

        // Form submissions
        document.getElementById('scheduleForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleScheduleSubmit();
        });

        document.getElementById('adForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdSubmit();
        });

        document.getElementById('connectSponsorForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSponsorConnect();
        });

        document.getElementById('taskForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskSubmit();
        });

        document.getElementById('classForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleClassSubmit();
        });

        // Quick actions
        document.getElementById('createAssignmentBtn')?.addEventListener('click', () => {
            this.showMessage('Assignment creation feature coming soon!', 'success');
        });

        document.getElementById('messageStudentsBtn')?.addEventListener('click', () => {
            this.showMessage('Student messaging feature coming soon!', 'success');
        });

        document.getElementById('viewReportsBtn')?.addEventListener('click', () => {
            this.showMessage('Reports feature coming soon!', 'success');
        });

        document.getElementById('managePaymentsBtn')?.addEventListener('click', () => {
            this.showMessage('Payment management feature coming soon!', 'success');
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                this.showMessage('Logging out...', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });

        // Filters
        document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    loadMockData() {
        // Mock schedule data
        this.scheduleData = [
            {
                id: 4,
                day: 'Wednesday',
                date: '2025-07-09',
                time: '10:00',
                duration: 90,
                subject: 'Biology',
                status: 'available'
            },
            {
                id: 5,
                day: 'Thursday',
                date: '2025-07-10',
                time: '15:00',
                duration: 60,
                subject: 'Mathematics',
                status: 'booked'
            }
        ];

        // Mock sessions data
        this.sessionsData = [
            {
                id: 1,
                title: 'Advanced Calculus',
                student: 'John Smith',
                date: '2025-07-07',
                time: '09:00',
                duration: 60,
                subject: 'Mathematics',
                status: 'scheduled'
            },
            {
                id: 2,
                title: 'Quantum Physics Basics',
                student: 'Emma Johnson',
                date: '2025-07-08',
                time: '14:00',
                duration: 45,
                subject: 'Physics',
                status: 'scheduled'
            },
            {
                id: 3,
                title: 'Organic Chemistry Review',
                student: 'Michael Brown',
                date: '2025-07-09',
                time: '11:00',
                duration: 60,
                subject: 'Chemistry',
                status: 'completed'
            }
        ];

        // Mock ads data
        this.adsData = [
            {
                id: 1,
                title: 'Premium Learning Tools',
                description: 'Enhance your teaching with our advanced educational platform',
                sponsor: 'EduTech Solutions',
                image: 'https://via.placeholder.com/60x60/667eea/ffffff?text=AD',
                budget: 500,
                status: 'active'
            },
            {
                id: 2,
                title: 'Scientific Calculator App',
                description: 'Professional calculator for advanced mathematics',
                sponsor: 'MathCorp',
                image: 'https://via.placeholder.com/60x60/ff6b6b/ffffff?text=AD',
                budget: 300,
                status: 'active'
            },
            {
                id: 3,
                title: 'Virtual Lab Equipment',
                description: 'Simulate real laboratory experiments online',
                sponsor: 'LabSim Inc',
                image: 'https://via.placeholder.com/60x60/2ecc71/ffffff?text=AD',
                budget: 750,
                status: 'paused'
            }
        ];

        // Mock classes data
        this.classesData = [
            {
                id: 1,
                name: 'Advanced Mathematics',
                subject: 'Mathematics',
                grade: '12',
                capacity: 20,
                enrolled: 15,
                price: 50,
                sessions: 24,
                rating: 4.8
            },
            {
                id: 2,
                name: 'Physics Fundamentals',
                subject: 'Physics',
                grade: '11',
                capacity: 15,
                enrolled: 12,
                price: 45,
                sessions: 18,
                rating: 4.6
            },
            {
                id: 3,
                name: 'Chemistry Basics',
                subject: 'Chemistry',
                grade: '10',
                capacity: 18,
                enrolled: 16,
                price: 40,
                sessions: 20,
                rating: 4.7
            }
        ];
    }

    renderDashboard() {
        this.renderSchedule();
        this.renderSessions();
        this.renderAds();
        this.renderClasses();
    }

    renderSchedule() {
        const scheduleGrid = document.getElementById('scheduleGrid');
        if (!scheduleGrid) return;

        scheduleGrid.innerHTML = '';
        
        this.scheduleData.forEach(slot => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            scheduleItem.innerHTML = `
                <div class="schedule-info">
                    <div class="schedule-time">${slot.time}</div>
                    <div class="schedule-subject">${slot.subject} - ${slot.day}</div>
                </div>
                <div class="schedule-status ${slot.status}">${slot.status}</div>
            `;
            scheduleGrid.appendChild(scheduleItem);
        });
    }

    renderSessions() {
        const sessionsList = document.getElementById('sessionsList');
        if (!sessionsList) return;

        sessionsList.innerHTML = '';
        
        this.sessionsData.forEach(session => {
            const sessionItem = document.createElement('div');
            sessionItem.className = 'session-item';
            sessionItem.innerHTML = `
                <div class="session-info">
                    <h4>${session.title}</h4>
                    <p>Student: ${session.student}</p>
                    <p>${session.date} at ${session.time} (${session.duration} mins)</p>
                </div>
                <div class="session-actions">
                    <button class="btn-edit" onclick="dashboard.viewSession(${session.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" onclick="dashboard.editSession(${session.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="dashboard.deleteSession(${session.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            sessionsList.appendChild(sessionItem);
        });
    }

    renderAds() {
        const adsList = document.getElementById('adsList');
        if (!adsList) return;

        adsList.innerHTML = '';
        
        this.adsData.forEach(ad => {
            const adItem = document.createElement('div');
            adItem.className = 'ad-item';
            adItem.innerHTML = `
                <img src="${ad.image}" alt="${ad.title}" class="ad-image">
                <div class="ad-content">
                    <h4>${ad.title}</h4>
                    <p>${ad.description}</p>
                    <div class="ad-sponsor">Sponsor: ${ad.sponsor}</div>
                </div>
                <div class="ad-actions">
                    <button class="btn-edit" onclick="dashboard.editAd(${ad.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="dashboard.deleteAd(${ad.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            adsList.appendChild(adItem);
        });
    }

    renderClasses() {
        const classesGrid = document.getElementById('classesGrid');
        if (!classesGrid) return;

        classesGrid.innerHTML = '';
        
        this.classesData.forEach(classData => {
            const classCard = document.createElement('div');
            classCard.className = 'class-card';
            classCard.innerHTML = `
                <h3>${classData.name}</h3>
                <p>${classData.subject} - Grade ${classData.grade}</p>
                <div class="class-stats">
                    <div class="stat-item">
                        <div class="stat-value">${classData.enrolled}/${classData.capacity}</div>
                        <div class="stat-label">Students</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${classData.price}</div>
                        <div class="stat-label">Per Session</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${classData.rating}</div>
                        <div class="stat-label">Rating</div>
                    </div>
                </div>
                <div class="form-actions">
                    <button class="btn-secondary" onclick="dashboard.viewClass(${classData.id})">View Details</button>
                    <button class="btn-primary" onclick="dashboard.editClass(${classData.id})">Edit Class</button>
                </div>
            `;
            classesGrid.appendChild(classCard);
        });
    }

    switchSection(section) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Show selected section
        document.getElementById(`${section}-section`).classList.add('active');

        // Update page title
        const titles = {
            overview: 'Dashboard Overview',
            classes: 'Class Management',
            schedule: 'Schedule & Availability',
            earnings: 'Earnings & Analytics',
            profile: 'Profile Settings',
            community: 'Teacher Community',
            students: 'Student Management',
            events: 'Event Organization',
            sponsors: 'Sponsor Management'
        };

        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
        this.currentSection = section;
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) {
                form.reset();
            }
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

    handleScheduleSubmit() {
        const form = document.getElementById('scheduleForm');
        const formData = new FormData(form);
        
        const newSlot = {
            id: this.scheduleData.length + 1,
            day: formData.get('scheduleDay') || document.getElementById('scheduleDay').value,
            date: formData.get('scheduleDate') || document.getElementById('scheduleDate').value,
            time: formData.get('scheduleTime') || document.getElementById('scheduleTime').value,
            duration: parseInt(formData.get('scheduleDuration') || document.getElementById('scheduleDuration').value),
            subject: 'Available Slot',
            status: 'available'
        };

        this.scheduleData.push(newSlot);
        this.renderSchedule();
        this.closeModal('scheduleModal');
        this.showMessage('Schedule slot added successfully!', 'success');
    }

    handleAdSubmit() {
        const form = document.getElementById('adForm');
        const formData = new FormData(form);
        
        const newAd = {
            id: this.adsData.length + 1,
            title: formData.get('adTitle') || document.getElementById('adTitle').value,
            description: formData.get('adDescription') || document.getElementById('adDescription').value,
            sponsor: formData.get('adSponsor') || document.getElementById('adSponsor').value,
            image: formData.get('adImage') || document.getElementById('adImage').value || 'https://via.placeholder.com/60x60/667eea/ffffff?text=AD',
            budget: parseFloat(formData.get('adBudget') || document.getElementById('adBudget').value) || 0,
            status: 'active'
        };

        this.adsData.push(newAd);
        this.renderAds();
        this.closeModal('adModal');
        this.showMessage('Advertisement created successfully!', 'success');
    }

    handleSponsorConnect() {
        const form = document.getElementById('connectSponsorForm');
        this.closeModal('connectSponsorModal');
        this.showMessage('Sponsor connection established successfully!', 'success');
    }

    handleTaskSubmit() {
        const form = document.getElementById('taskForm');
        this.closeModal('sessionModal');
        this.showMessage('Task assigned successfully!', 'success');
    }

    handleClassSubmit() {
        const form = document.getElementById('classForm');
        const formData = new FormData(form);
        
        const newClass = {
            id: this.classesData.length + 1,
            name: formData.get('className') || document.getElementById('className').value,
            subject: formData.get('classSubject') || document.getElementById('classSubject').value,
            grade: formData.get('classGrade') || document.getElementById('classGrade').value,
            capacity: parseInt(formData.get('classCapacity') || document.getElementById('classCapacity').value),
            enrolled: 0,
            price: parseFloat(formData.get('classPrice') || document.getElementById('classPrice').value),
            sessions: 0,
            rating: 0
        };

        this.classesData.push(newClass);
        this.renderClasses();
        this.closeModal('classModal');
        this.showMessage('Class created successfully!', 'success');
    }

    viewSession(sessionId) {
        const session = this.sessionsData.find(s => s.id === sessionId);
        if (session) {
            const sessionDetails = document.getElementById('sessionDetails');
            sessionDetails.innerHTML = `
                <h4>Session Details</h4>
                <p><strong>Title:</strong> ${session.title}</p>
                <p><strong>Student:</strong> ${session.student}</p>
                <p><strong>Date:</strong> ${session.date}</p>
                <p><strong>Time:</strong> ${session.time}</p>
                <p><strong>Duration:</strong> ${session.duration} minutes</p>
                <p><strong>Subject:</strong> ${session.subject}</p>
                <p><strong>Status:</strong> ${session.status}</p>
            `;
            this.openModal('sessionModal');
        }
    }

    editSession(sessionId) {
        this.showMessage('Edit session feature coming soon!', 'success');
    }

    deleteSession(sessionId) {
        if (confirm('Are you sure you want to delete this session?')) {
            this.sessionsData = this.sessionsData.filter(s => s.id !== sessionId);
            this.renderSessions();
            this.showMessage('Session deleted successfully!', 'success');
        }
    }

    editAd(adId) {
        this.showMessage('Edit advertisement feature coming soon!', 'success');
    }

    deleteAd(adId) {
        if (confirm('Are you sure you want to delete this advertisement?')) {
            this.adsData = this.adsData.filter(ad => ad.id !== adId);
            this.renderAds();
            this.showMessage('Advertisement deleted successfully!', 'success');
        }
    }

    viewClass(classId) {
        this.showMessage('View class details feature coming soon!', 'success');
    }

    editClass(classId) {
        this.showMessage('Edit class feature coming soon!', 'success');
    }

    applyFilters() {
        const upcomingFilter = document.getElementById('filter-upcoming').checked;
        const availableFilter = document.getElementById('filter-available').checked;
        const adsFilter = document.getElementById('filter-ads').checked;

        // Apply filters to displayed data
        this.renderDashboard();
        this.showMessage('Filters applied!', 'success');
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        
        const dateRange = document.getElementById('dateRange');
        if (dateRange) {
            const startDate = new Date(now);
            const endDate = new Date(now);
            endDate.setDate(endDate.getDate() + 6);
            
            const startStr = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const endStr = endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            
            dateRange.textContent = `${startStr} - ${endStr}`;
        }
    }

    showMessage(message, type = 'success') {
        // Create message element if it doesn't exist
        let messageEl = document.querySelector('.message');
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.className = 'message';
            document.querySelector('.main-content').prepend(messageEl);
        }

        messageEl.textContent = message;
        messageEl.className = `message ${type} show`;

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 3000);
    }

    // Calendar functionality
    renderCalendar() {
        const calendar = document.getElementById('scheduleCalendar');
        if (!calendar) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        calendar.innerHTML = `
            <div class="calendar-header">
                <h3>${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                <div class="calendar-nav">
                    <button onclick="dashboard.previousMonth()">Previous</button>
                    <button onclick="dashboard.nextMonth()">Next</button>
                </div>
            </div>
            <div class="calendar-grid">
                ${this.generateCalendarDays(year, month)}
            </div>
        `;
    }

    generateCalendarDays(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDayOfWeek = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        let html = '';
        
        // Day headers
        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            html += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const hasSchedule = this.scheduleData.some(slot => slot.date === dateStr);
            const isAvailable = this.scheduleData.some(slot => slot.date === dateStr && slot.status === 'available');
            
            let className = 'calendar-day';
            if (hasSchedule) {
                className += isAvailable ? ' available' : ' booked';
            }
            
            html += `<div class="${className}" onclick="dashboard.selectDate('${dateStr}')">${day}</div>`;
        }

        return html;
    }

    selectDate(dateStr) {
        document.querySelectorAll('.calendar-day').forEach(day => {
            day.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        const scheduleForDate = this.scheduleData.filter(slot => slot.date === dateStr);
        if (scheduleForDate.length > 0) {
            this.showMessage(`Found ${scheduleForDate.length} schedule(s) for this date`, 'success');
        } else {
            this.showMessage('No schedules found for this date', 'success');
        }
    }

    previousMonth() {
        // Calendar navigation logic
        this.showMessage('Previous month navigation coming soon!', 'success');
    }

    nextMonth() {
        // Calendar navigation logic
        this.showMessage('Next month navigation coming soon!', 'success');
    }

    // Search functionality
    searchContent(query) {
        const results = [];
        
        // Search in sessions
        this.sessionsData.forEach(session => {
            if (session.title.toLowerCase().includes(query.toLowerCase()) ||
                session.student.toLowerCase().includes(query.toLowerCase()) ||
                session.subject.toLowerCase().includes(query.toLowerCase())) {
                results.push({ type: 'session', data: session });
            }
        });

        // Search in classes
        this.classesData.forEach(classData => {
            if (classData.name.toLowerCase().includes(query.toLowerCase()) ||
                classData.subject.toLowerCase().includes(query.toLowerCase())) {
                results.push({ type: 'class', data: classData });
            }
        });

        return results;
    }

    // Export functionality
    exportData(type) {
        let data;
        let filename;

        switch (type) {
            case 'schedule':
                data = this.scheduleData;
                filename = 'schedule_export.json';
                break;
            case 'sessions':
                data = this.sessionsData;
                filename = 'sessions_export.json';
                break;
            case 'classes':
                data = this.classesData;
                filename = 'classes_export.json';
                break;
            default:
                data = {
                    schedule: this.scheduleData,
                    sessions: this.sessionsData,
                    classes: this.classesData,
                    ads: this.adsData
                };
                filename = 'dashboard_export.json';
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        this.showMessage(`Data exported as ${filename}`, 'success');
    }

    // Statistics calculation
    calculateStats() {
        const stats = {
            totalSessions: this.sessionsData.length,
            completedSessions: this.sessionsData.filter(s => s.status === 'completed').length,
            totalClasses: this.classesData.length,
            totalStudents: this.classesData.reduce((sum, c) => sum + c.enrolled, 0),
            totalEarnings: this.classesData.reduce((sum, c) => sum + (c.price * c.enrolled), 0),
            averageRating: this.classesData.reduce((sum, c) => sum + c.rating, 0) / this.classesData.length
        };

        return stats;
    }

    // Theme switching
    switchTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('dashboard-theme', theme);
        this.showMessage(`Theme switched to ${theme}`, 'success');
    }

    // Load saved theme
    loadTheme() {
        const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
        this.switchTheme(savedTheme);
    }

    // Notification system
    showNotification(title, message, type = 'info') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico'
            });
        } else {
            this.showMessage(`${title}: ${message}`, type);
        }
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    this.showMessage('Notifications enabled!', 'success');
                }
            });
        }
    }
}

// Global functions for onclick handlers
function closeModal(modalId) {
    dashboard.closeModal(modalId);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.dashboard = new TeacherDashboard();
    
    // Request notification permission
    dashboard.requestNotificationPermission();
    
    // Load saved theme
    dashboard.loadTheme();
    
    // Set up periodic data refresh
    setInterval(() => {
        dashboard.updateDateTime();
    }, 60000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    dashboard.openModal('scheduleModal');
                    break;
                case 's':
                    e.preventDefault();
                    dashboard.exportData();
                    break;
                case 'f':
                    e.preventDefault();
                    document.querySelector('.search-input')?.focus();
                    break;
            }
        }
    });
}); 