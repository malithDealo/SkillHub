// Campaign Management JavaScript (sponsordashboard2.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeCampaignPage();
    setupEventListeners();
    loadCampaigns();
});

// Initialize Campaign Page
function initializeCampaignPage() {
    console.log('Campaign Management page initialized');
    setupFormValidation();
    loadDefaultCampaignData();
}

// Setup Event Listeners
function setupEventListeners() {
    // Campaign form submission
    const campaignForm = document.getElementById('campaignForm');
    if (campaignForm) {
        campaignForm.addEventListener('submit', handleCampaignSubmission);
    }

    // Filter button
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn) {
        filterBtn.addEventListener('click', toggleFilterPanel);
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCampaigns);
    }

    // Filter actions
    const applyFilterBtn = document.getElementById('applyFilter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }

    const clearFilterBtn = document.getElementById('clearFilter');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', clearFilters);
    }

    // Edit form submission
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditSubmission);
    }

    // Logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleSidebarNavigation);
    });

    // Edit buttons - Add event listeners to existing edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            editCampaign(this);
        });
    });

    // View buttons - Add event listeners to existing view buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewCampaign(this);
        });
    });
}

// Handle Campaign Form Submission
function handleCampaignSubmission(e) {
    e.preventDefault();
    
    console.log('Campaign form submitted');
    
    const formData = new FormData(e.target);
    const campaignData = {
        name: formData.get('campaignName'),
        target: parseInt(formData.get('targetStudents')),
        budget: parseInt(formData.get('budget')),
        duration: formData.get('duration'),
        description: formData.get('description'),
        status: 'pending',
        enrolled: 0,
        id: Date.now()
    };

    console.log('Campaign data:', campaignData);

    // Validate form data
    if (!validateCampaignData(campaignData)) {
        return;
    }

    // Show loading state
    const submitBtn = e.target.querySelector('.launch-btn');
    if (!submitBtn) {
        console.error('Launch button not found');
        return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Launching...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        try {
            // Add campaign to table
            addCampaignToTable(campaignData);
            
            // Reset form
            e.target.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success notification
            showNotification('Campaign launched successfully!', 'success');
            
            // Save to localStorage
            saveCampaignData(campaignData);
            
        } catch (error) {
            console.error('Error adding campaign:', error);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showNotification('Error launching campaign', 'error');
        }
    }, 1500);
}

// Validate Campaign Data
function validateCampaignData(data) {
    console.log('Validating campaign data:', data);
    
    if (!data.name || data.name.trim().length < 3) {
        showNotification('Campaign name must be at least 3 characters long', 'error');
        return false;
    }
    
    if (!data.target || data.target < 1) {
        showNotification('Target students must be at least 1', 'error');
        return false;
    }
    
    if (!data.budget || data.budget < 100) {
        showNotification('Budget must be at least $100', 'error');
        return false;
    }
    
    if (!data.duration) {
        showNotification('Please select a duration', 'error');
        return false;
    }
    
    return true;
}

// Add Campaign to Table
function addCampaignToTable(campaignData) {
    console.log('Adding campaign to table:', campaignData);
    
    const tableBody = document.getElementById('campaignsTableBody');
    if (!tableBody) {
        console.error('Table body not found');
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="campaign-cell">
                <div class="campaign-icon"></div>
                <span>${campaignData.name}</span>
            </div>
        </td>
        <td>${campaignData.target}</td>
        <td>${campaignData.enrolled}</td>
        <td>$${campaignData.budget.toLocaleString()}</td>
        <td><span class="status-badge ${campaignData.status}">${campaignData.status.charAt(0).toUpperCase() + campaignData.status.slice(1)}</span></td>
        <td>
            <button class="action-btn edit-btn">Edit</button>
        </td>
    `;

    // Add event listener to the new edit button
    const editBtn = row.querySelector('.edit-btn');
    editBtn.addEventListener('click', function() {
        editCampaign(this);
    });

    // Add animation
    row.style.opacity = '0';
    row.style.transform = 'translateY(20px)';
    tableBody.insertBefore(row, tableBody.firstChild);
    
    // Animate in
    setTimeout(() => {
        row.style.transition = 'all 0.3s ease';
        row.style.opacity = '1';
        row.style.transform = 'translateY(0)';
    }, 100);

    console.log('Campaign added to table successfully');
}

// Toggle Filter Panel
function toggleFilterPanel() {
    console.log('Toggling filter panel');
    
    const filterPanel = document.getElementById('filterPanel');
    if (!filterPanel) {
        console.error('Filter panel not found');
        return;
    }

    filterPanel.classList.toggle('active');
    
    const filterBtn = document.getElementById('filterBtn');
    const icon = filterBtn.querySelector('i');
    
    if (filterPanel.classList.contains('active')) {
        icon.className = 'fas fa-times';
    } else {
        icon.className = 'fas fa-filter';
    }
}

// Apply Filters
function applyFilters() {
    console.log('Applying filters');
    
    const statusFilter = document.getElementById('statusFilter');
    const budgetFilter = document.getElementById('budgetFilter');
    
    if (!statusFilter || !budgetFilter) {
        console.error('Filter elements not found');
        return;
    }

    const statusValue = statusFilter.value;
    const budgetValue = budgetFilter.value;
    
    const rows = document.querySelectorAll('#campaignsTableBody tr');
    
    rows.forEach(row => {
        let showRow = true;
        
        // Status filter
        if (statusValue) {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge && !statusBadge.classList.contains(statusValue)) {
                showRow = false;
            }
        }
        
        // Budget filter
        if (budgetValue && showRow) {
            const budgetCell = row.children[3].textContent;
            const budget = parseInt(budgetCell.replace(/[$,]/g, ''));
            if (budget < parseInt(budgetValue)) {
                showRow = false;
            }
        }
        
        row.style.display = showRow ? '' : 'none';
    });
    
    showNotification('Filters applied', 'info');
}

// Clear Filters
function clearFilters() {
    console.log('Clearing filters');
    
    const statusFilter = document.getElementById('statusFilter');
    const budgetFilter = document.getElementById('budgetFilter');
    
    if (statusFilter) statusFilter.value = '';
    if (budgetFilter) budgetFilter.value = '';
    
    const rows = document.querySelectorAll('#campaignsTableBody tr');
    rows.forEach(row => {
        row.style.display = '';
    });
    
    showNotification('Filters cleared', 'info');
}

// Export Campaigns
function exportCampaigns() {
    console.log('Exporting campaigns');
    
    const campaigns = [];
    const rows = document.querySelectorAll('#campaignsTableBody tr');
    
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const cells = row.children;
            campaigns.push({
                name: cells[0].querySelector('span').textContent,
                target: cells[1].textContent,
                enrolled: cells[2].textContent,
                budget: cells[3].textContent,
                status: cells[4].querySelector('.status-badge').textContent
            });
        }
    });
    
    // Create CSV content
    const csvContent = [
        ['Campaign Name', 'Target', 'Enrolled', 'Budget', 'Status'],
        ...campaigns.map(c => [c.name, c.target, c.enrolled, c.budget, c.status])
    ].map(row => row.join(',')).join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Campaigns exported successfully!', 'success');
}

// Edit Campaign
function editCampaign(button) {
    console.log('Editing campaign');
    
    const row = button.closest('tr');
    if (!row) {
        console.error('Row not found');
        return;
    }

    const cells = row.children;
    
    // Extract data from row
    const campaignName = cells[0].querySelector('span').textContent;
    const target = cells[1].textContent;
    const budget = cells[3].textContent.replace(/[$,]/g, '');
    const statusBadge = cells[4].querySelector('.status-badge');
    const status = statusBadge.classList.contains('active') ? 'active' : 
                   statusBadge.classList.contains('pending') ? 'pending' : 'completed';
    
    // Populate edit form
    const editCampaignName = document.getElementById('editCampaignName');
    const editTargetStudents = document.getElementById('editTargetStudents');
    const editBudget = document.getElementById('editBudget');
    const editStatus = document.getElementById('editStatus');

    if (editCampaignName) editCampaignName.value = campaignName;
    if (editTargetStudents) editTargetStudents.value = target;
    if (editBudget) editBudget.value = budget;
    if (editStatus) editStatus.value = status;
    
    // Store row reference for updating
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.dataset.editingRow = Array.from(row.parentNode.children).indexOf(row);
    }
    
    // Show modal
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// View Campaign (for completed campaigns)
function viewCampaign(button) {
    console.log('Viewing campaign');
    
    const row = button.closest('tr');
    if (!row) return;
    
    const campaignName = row.querySelector('span').textContent;
    showNotification(`Viewing details for ${campaignName}`, 'info');
}

// Handle Edit Form Submission
function handleEditSubmission(e) {
    e.preventDefault();
    console.log('Edit form submitted');
    
    const formData = new FormData(e.target);
    const rowIndex = parseInt(e.target.dataset.editingRow);
    const tableBody = document.getElementById('campaignsTableBody');
    
    if (!tableBody || isNaN(rowIndex)) {
        showNotification('Error updating campaign', 'error');
        return;
    }

    const row = tableBody.children[rowIndex];
    if (!row) {
        showNotification('Error updating campaign', 'error');
        return;
    }
    
    // Update row data
    const cells = row.children;
    cells[0].querySelector('span').textContent = formData.get('campaignName');
    cells[1].textContent = formData.get('targetStudents');
    cells[3].textContent = '$' + parseInt(formData.get('budget')).toLocaleString();
    
    const statusBadge = cells[4].querySelector('.status-badge');
    const newStatus = formData.get('status');
    statusBadge.className = `status-badge ${newStatus}`;
    statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    
    // Update action button for completed campaigns
    const actionBtn = cells[5].querySelector('.action-btn');
    if (newStatus === 'completed') {
        actionBtn.textContent = 'View';
        actionBtn.className = 'action-btn view-btn';
        actionBtn.onclick = function() { viewCampaign(this); };
    } else {
        actionBtn.textContent = 'Edit';
        actionBtn.className = 'action-btn edit-btn';
        actionBtn.onclick = function() { editCampaign(this); };
    }
    
    // Close modal
    closeModal();
    
    // Show success notification
    showNotification('Campaign updated successfully!', 'success');
    
    // Add visual feedback
    row.style.backgroundColor = '#d4edda';
    setTimeout(() => {
        row.style.backgroundColor = '';
    }, 1000);
}

// Close Modal
function closeModal() {
    console.log('Closing modal');
    
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Clear form
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.reset();
        delete editForm.dataset.editingRow;
    }
}

// Handle Sidebar Navigation
function handleSidebarNavigation(e) {
    e.preventDefault();
    
    const linkText = e.currentTarget.textContent.trim();
    console.log('Navigating to:', linkText);
    
    switch(linkText) {
        case 'Overview':
            window.location.href = 'sponsordashboard1.html';
            break;
        case 'Campaigns':
            // Already on campaigns page
            console.log('Already on campaigns page');
            break;
        case 'Analytics':
            window.location.href = 'sponsordashboard3.html';
            break;
        case 'Profile Setting':
            window.location.href = 'sponsordashboard4.html';
            break;
        default:
            console.log('Unknown navigation:', linkText);
    }
}

// Handle Logout
function handleLogout() {
    console.log('Logout clicked');
    
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            localStorage.clear();
            showNotification('Logged out successfully!', 'success');
            // In real app, redirect to login
        }, 1000);
    }
}

// Load Campaigns from localStorage
function loadCampaigns() {
    const savedCampaigns = localStorage.getItem('skillhub_campaigns');
    if (savedCampaigns) {
        try {
            const campaigns = JSON.parse(savedCampaigns);
            console.log('Loaded campaigns from storage:', campaigns);
        } catch (error) {
            console.error('Error loading campaigns:', error);
        }
    }
}

// Save Campaign Data
function saveCampaignData(campaignData) {
    try {
        let campaigns = [];
        const saved = localStorage.getItem('skillhub_campaigns');
        if (saved) {
            campaigns = JSON.parse(saved);
        }
        
        campaigns.push(campaignData);
        localStorage.setItem('skillhub_campaigns', JSON.stringify(campaigns));
        console.log('Campaign saved to storage');
    } catch (error) {
        console.error('Error saving campaign:', error);
    }
}

// Load Default Campaign Data
function loadDefaultCampaignData() {
    console.log('Loading default campaign data');
    // Any default data loading can happen here
}

// Setup Form Validation
function setupFormValidation() {
    console.log('Setting up form validation');
    
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Validate Individual Field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error styling
    field.classList.remove('error');
    
    if (!value) {
        field.classList.add('error');
        return false;
    }
    
    // Specific validations
    if (field.type === 'number' && parseInt(value) <= 0) {
        field.classList.add('error');
        return false;
    }
    
    if (field.name === 'campaignName' && value.length < 3) {
        field.classList.add('error');
        return false;
    }
    
    return true;
}

// Clear Field Error
function clearFieldError(e) {
    e.target.classList.remove('error');
}

// Show Notification
function showNotification(message, type = 'info') {
    console.log('Notification:', message, type);
    
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1001',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Handle keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('editModal');
        if (modal && modal.classList.contains('active')) {
            closeModal();
        }
        
        const filterPanel = document.getElementById('filterPanel');
        if (filterPanel && filterPanel.classList.contains('active')) {
            toggleFilterPanel();
        }
    }
    
    // Ctrl/Cmd + N for new campaign
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        const campaignNameField = document.getElementById('campaignName');
        if (campaignNameField) {
            campaignNameField.focus();
        }
    }
});

// Click outside modal to close
document.addEventListener('click', function(e) {
    const modal = document.getElementById('editModal');
    if (modal && modal.classList.contains('active') && e.target === modal) {
        closeModal();
    }
});

// Make functions globally available for onclick handlers
window.editCampaign = editCampaign;
window.viewCampaign = viewCampaign;
window.closeModal = closeModal;

console.log('Campaign Management JavaScript (sponsordashboard2.js) loaded successfully!');