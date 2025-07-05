// Quick Actions Card Functions
// Add these functions to your existing dashboard_overview.js file

// Quick Actions functionality
function initializeQuickActions() {
    // Get quick action buttons
    const createAssignmentBtn = document.getElementById('createAssignmentBtn');
    const messageStudentsBtn = document.getElementById('messageStudentsBtn');
    const viewReportsBtn = document.getElementById('viewReportsBtn');
    const managePaymentsBtn = document.getElementById('managePaymentsBtn');

    // Add event listeners
    if (createAssignmentBtn) {
        createAssignmentBtn.addEventListener('click', openAssignmentModal);
    }
    if (messageStudentsBtn) {
        messageStudentsBtn.addEventListener('click', openMessageModal);
    }
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', openReportsModal);
    }
    if (managePaymentsBtn) {
        managePaymentsBtn.addEventListener('click', openPaymentsModal);
    }
}

// Create Assignment Modal
function openAssignmentModal() {
    showModal('assignmentModal');
}

// Message Students Modal
function openMessageModal() {
    showModal('messageModal');
}

// View Reports Modal
function openReportsModal() {
    showModal('reportsModal');
}

// Manage Payments Modal
function openPaymentsModal() {
    showModal('paymentsModal');
}

// Assignment form submission
function handleAssignmentSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const assignmentData = {
        title: formData.get('assignmentTitle'),
        description: formData.get('assignmentDescription'),
        class: formData.get('assignmentClass'),
        dueDate: formData.get('assignmentDueDate'),
        points: formData.get('assignmentPoints'),
        type: formData.get('assignmentType')
    };
    
    // Add assignment to data
    if (!window.dashboardData.assignments) {
        window.dashboardData.assignments = [];
    }
    
    const newAssignment = {
        id: Date.now(),
        ...assignmentData,
        dateCreated: new Date().toISOString(),
        status: 'active'
    };
    
    window.dashboardData.assignments.push(newAssignment);
    
    // Close modal and reset form
    closeModal('assignmentModal');
    event.target.reset();
    
    // Show success message
    showNotification('Assignment created successfully!', 'success');
    
    // Update UI if needed
    updateAssignmentsList();
}

// Message form submission
function handleMessageSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const messageData = {
        recipients: formData.get('messageRecipients'),
        subject: formData.get('messageSubject'),
        message: formData.get('messageText'),
        priority: formData.get('messagePriority')
    };
    
    // Add message to data
    if (!window.dashboardData.messages) {
        window.dashboardData.messages = [];
    }
    
    const newMessage = {
        id: Date.now(),
        ...messageData,
        dateSent: new Date().toISOString(),
        status: 'sent'
    };
    
    window.dashboardData.messages.push(newMessage);
    
    // Close modal and reset form
    closeModal('messageModal');
    event.target.reset();
    
    // Show success message
    showNotification('Message sent successfully!', 'success');
}

// Payment form submission
function handlePaymentSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const paymentData = {
        student: formData.get('paymentStudent'),
        amount: formData.get('paymentAmount'),
        method: formData.get('paymentMethod'),
        description: formData.get('paymentDescription')
    };
    
    // Add payment to data
    if (!window.dashboardData.payments) {
        window.dashboardData.payments = [];
    }
    
    const newPayment = {
        id: Date.now(),
        ...paymentData,
        dateProcessed: new Date().toISOString(),
        status: 'completed'
    };
    
    window.dashboardData.payments.push(newPayment);
    
    // Close modal and reset form
    closeModal('paymentsModal');
    event.target.reset();
    
    // Show success message
    showNotification('Payment recorded successfully!', 'success');
    
    // Update payments list
    updatePaymentsList();
}

// Generate reports
function generateReports() {
    const reportType = document.getElementById('reportType').value;
    const reportPeriod = document.getElementById('reportPeriod').value;
    
    if (!reportType || !reportPeriod) {
        showNotification('Please select report type and period', 'error');
        return;
    }
    
    // Generate mock report data
    const reportData = generateMockReportData(reportType, reportPeriod);
    
    // Display report
    displayReport(reportData, reportType);
    
    showNotification('Report generated successfully!', 'success');
}

// Mock report data generator
function generateMockReportData(type, period) {
    const baseData = {
        period: period,
        generated: new Date().toISOString(),
        type: type
    };
    
    switch (type) {
        case 'earnings':
            return {
                ...baseData,
                totalEarnings: Math.floor(Math.random() * 5000) + 1000,
                sessionsCompleted: Math.floor(Math.random() * 50) + 10,
                averageRating: (Math.random() * 2 + 3).toFixed(1),
                newStudents: Math.floor(Math.random() * 20) + 5
            };
        case 'attendance':
            return {
                ...baseData,
                totalSessions: Math.floor(Math.random() * 60) + 20,
                attendanceRate: (Math.random() * 20 + 80).toFixed(1),
                cancelledSessions: Math.floor(Math.random() * 5) + 1,
                makeupSessions: Math.floor(Math.random() * 8) + 2
            };
        case 'performance':
            return {
                ...baseData,
                averageGrade: (Math.random() * 30 + 70).toFixed(1),
                assignmentsGraded: Math.floor(Math.random() * 100) + 20,
                studentProgress: (Math.random() * 20 + 75).toFixed(1),
                feedback: Math.floor(Math.random() * 50) + 10
            };
        default:
            return baseData;
    }
}

// Display report in modal
function displayReport(data, type) {
    const reportContent = document.getElementById('reportContent');
    
    let html = `
        <div class="report-header">
            <h4>${type.charAt(0).toUpperCase() + type.slice(1)} Report</h4>
            <p class="report-period">Period: ${data.period}</p>
            <p class="report-date">Generated: ${new Date(data.generated).toLocaleDateString()}</p>
        </div>
        <div class="report-body">
    `;
    
    switch (type) {
        case 'earnings':
            html += `
                <div class="report-metric">
                    <span class="metric-label">Total Earnings:</span>
                    <span class="metric-value">$${data.totalEarnings}</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Sessions Completed:</span>
                    <span class="metric-value">${data.sessionsCompleted}</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Average Rating:</span>
                    <span class="metric-value">${data.averageRating}/5</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">New Students:</span>
                    <span class="metric-value">${data.newStudents}</span>
                </div>
            `;
            break;
        case 'attendance':
            html += `
                <div class="report-metric">
                    <span class="metric-label">Total Sessions:</span>
                    <span class="metric-value">${data.totalSessions}</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Attendance Rate:</span>
                    <span class="metric-value">${data.attendanceRate}%</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Cancelled Sessions:</span>
                    <span class="metric-value">${data.cancelledSessions}</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Makeup Sessions:</span>
                    <span class="metric-value">${data.makeupSessions}</span>
                </div>
            `;
            break;
        case 'performance':
            html += `
                <div class="report-metric">
                    <span class="metric-label">Average Grade:</span>
                    <span class="metric-value">${data.averageGrade}%</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Assignments Graded:</span>
                    <span class="metric-value">${data.assignmentsGraded}</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Student Progress:</span>
                    <span class="metric-value">${data.studentProgress}%</span>
                </div>
                <div class="report-metric">
                    <span class="metric-label">Feedback Given:</span>
                    <span class="metric-value">${data.feedback}</span>
                </div>
            `;
            break;
    }
    
    html += '</div>';
    reportContent.innerHTML = html;
}

// Update assignments list (if you have an assignments section)
function updateAssignmentsList() {
    // Implementation depends on your assignments UI structure
    console.log('Assignments list updated');
}

// Update payments list (if you have a payments section)
function updatePaymentsList() {
    // Implementation depends on your payments UI structure
    console.log('Payments list updated');
}

// Get available classes for dropdowns
function getAvailableClasses() {
    const classes = window.dashboardData.classes || [];
    return classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        subject: cls.subject
    }));
}

// Get enrolled students for messaging
function getEnrolledStudents() {
    const students = window.dashboardData.students || [];
    return students.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email
    }));
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize quick actions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeQuickActions();
    
    // Add form event listeners for quick action modals
    const assignmentForm = document.getElementById('assignmentForm');
    const messageForm = document.getElementById('messageForm');
    const paymentForm = document.getElementById('paymentForm');
    
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', handleAssignmentSubmit);
    }
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
});

// Export functions for use in other modules
window.quickActions = {
    openAssignmentModal,
    openMessageModal,
    openReportsModal,
    openPaymentsModal,
    generateReports,
    showNotification
};