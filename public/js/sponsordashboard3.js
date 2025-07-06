// Analytics & Reports JavaScript (sponsordashboard3.js)

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    setupEventListeners();
    animateCharts();
    animateMetrics();
});

// Initialize Analytics Page
function initializeAnalytics() {
    console.log('Analytics & Reports page initialized');
    loadAnalyticsData();
    setupChartData();
    calculateROI();
}

// Setup Event Listeners
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAnalytics);
    }

    // Export button
    const exportBtn = document.getElementById('exportAnalyticsBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAnalyticsData);
    }

    // Chart period selector
    const chartPeriod = document.getElementById('chartPeriod');
    if (chartPeriod) {
        chartPeriod.addEventListener('change', updateChartPeriod);
    }

    // ROI period selector
    const roiPeriod = document.getElementById('roiPeriod');
    if (roiPeriod) {
        roiPeriod.addEventListener('change', updateROIPeriod);
    }

    // Budget details button
    const budgetDetailsBtn = document.getElementById('budgetDetailsBtn');
    if (budgetDetailsBtn) {
        budgetDetailsBtn.addEventListener('click', showBudgetDetails);
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
}

// Animate Metrics
function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach((metric, index) => {
        const finalValue = metric.textContent;
        const isMonetary = finalValue.includes('$');
        const isPercentage = finalValue.includes('%');
        const numericValue = parseFloat(finalValue.replace(/[$,%]/g, ''));
        
        // Animate from 0 to final value
        let currentValue = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            
            if (isMonetary) {
                displayValue = '$' + displayValue.toFixed(2);
            } else if (isPercentage) {
                displayValue = displayValue.toFixed(1) + '%';
            } else {
                displayValue = displayValue.toLocaleString();
            }
            
            metric.textContent = displayValue;
        }, 50 + (index * 10));
    });
}

// Animate Charts
function animateCharts() {
    // Animate bar chart
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach((bar, index) => {
        const height = bar.dataset.height + '%';
        const fill = bar.querySelector('.bar-fill');
        
        setTimeout(() => {
            fill.style.height = height;
        }, 500 + (index * 100));
    });

    // Animate progress bar
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const progress = progressBar.dataset.progress + '%';
        setTimeout(() => {
            progressBar.style.width = progress;
        }, 1000);
    }
}

// Setup Chart Data
function setupChartData() {
    const chartData = {
        3: [
            { month: 'JAN', value: 85 },
            { month: 'FEB', value: 65 },
            { month: 'MAR', value: 75 }
        ],
        6: [
            { month: 'JAN', value: 85 },
            { month: 'FEB', value: 65 },
            { month: 'MAR', value: 75 },
            { month: 'APR', value: 90 },
            { month: 'MAY', value: 70 },
            { month: 'JUN', value: 80 }
        ],
        12: [
            { month: 'JAN', value: 85 },
            { month: 'FEB', value: 65 },
            { month: 'MAR', value: 75 },
            { month: 'APR', value: 90 },
            { month: 'MAY', value: 70 },
            { month: 'JUN', value: 80 },
            { month: 'JUL', value: 88 },
            { month: 'AUG', value: 95 },
            { month: 'SEP', value: 78 },
            { month: 'OCT', value: 82 },
            { month: 'NOV', value: 91 },
            { month: 'DEC', value: 87 }
        ]
    };

    // Store chart data globally
    window.chartData = chartData;
}

// Update Chart Period
function updateChartPeriod(e) {
    const period = e.target.value;
    const data = window.chartData[period];
    
    if (!data) return;

    // Clear existing chart
    const chartWrapper = document.querySelector('.chart-wrapper');
    chartWrapper.innerHTML = '';

    // Create new chart bars
    data.forEach((item, index) => {
        const chartMonth = document.createElement('div');
        chartMonth.className = 'chart-month';
        chartMonth.innerHTML = `
            <div class="chart-bar" data-height="${item.value}">
                <div class="bar-fill"></div>
            </div>
            <div class="month-label">${item.month}</div>
        `;
        chartWrapper.appendChild(chartMonth);
    });

    // Animate new bars
    setTimeout(() => {
        const newBars = chartWrapper.querySelectorAll('.chart-bar');
        newBars.forEach((bar, index) => {
            const height = bar.dataset.height + '%';
            const fill = bar.querySelector('.bar-fill');
            setTimeout(() => {
                fill.style.height = height;
            }, index * 100);
        });
    }, 100);

    showNotification(`Chart updated to show last ${period} months`, 'info');
}

// Refresh Analytics
function refreshAnalytics() {
    showNotification('Refreshing analytics data...', 'info');
    
    // Show loading state
    const refreshBtn = document.getElementById('refreshBtn');
    const originalText = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;

    // Simulate data refresh
    setTimeout(() => {
        // Update metrics with slight variations
        updateMetricsWithRandomVariation();
        
        // Re-animate charts
        animateCharts();
        
        // Reset button
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
        
        showNotification('Analytics data refreshed!', 'success');
    }, 2000);
}

// Update Metrics with Random Variation
function updateMetricsWithRandomVariation() {
    const metrics = [
        { element: document.querySelectorAll('.metric-value')[0], base: 2847, variance: 50 },
        { element: document.querySelectorAll('.metric-value')[1], base: 12.5, variance: 0.5, isPercentage: true },
        { element: document.querySelectorAll('.metric-value')[2], base: 8.3, variance: 0.3, isPercentage: true },
        { element: document.querySelectorAll('.metric-value')[3], base: 2.45, variance: 0.1, isMonetary: true }
    ];

    metrics.forEach(metric => {
        const variation = (Math.random() - 0.5) * metric.variance * 2;
        const newValue = metric.base + variation;
        
        let displayValue;
        if (metric.isMonetary) {
            displayValue = '$' + newValue.toFixed(2);
        } else if (metric.isPercentage) {
            displayValue = newValue.toFixed(1) + '%';
        } else {
            displayValue = Math.round(newValue).toLocaleString();
        }
        
        metric.element.textContent = displayValue;
    });
}

// Export Analytics Data
function exportAnalyticsData() {
    const analyticsData = {
        metrics: {
            totalImpressions: document.querySelectorAll('.metric-value')[0].textContent,
            clickRate: document.querySelectorAll('.metric-value')[1].textContent,
            conversionRate: document.querySelectorAll('.metric-value')[2].textContent,
            costPerLead: document.querySelectorAll('.metric-value')[3].textContent
        },
        campaigns: [],
        monthlyTrends: []
    };

    // Extract campaign data
    const campaignRows = document.querySelectorAll('#analysisTableBody tr');
    campaignRows.forEach(row => {
        const cells = row.children;
        analyticsData.campaigns.push({
            name: cells[0].textContent,
            investment: cells[1].textContent,
            returns: cells[2].textContent,
            status: cells[3].querySelector('.status-badge').textContent
        });
    });

    // Extract chart data
    const chartBars = document.querySelectorAll('.chart-bar');
    const monthLabels = document.querySelectorAll('.month-label');
    chartBars.forEach((bar, index) => {
        analyticsData.monthlyTrends.push({
            month: monthLabels[index].textContent,
            performance: bar.dataset.height + '%'
        });
    });

    // Create CSV content
    const csvContent = createAnalyticsCSV(analyticsData);
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Analytics report exported successfully!', 'success');
}

// Create Analytics CSV
function createAnalyticsCSV(data) {
    let csv = 'Analytics Report\n\n';
    
    // Metrics section
    csv += 'Key Metrics\n';
    csv += 'Metric,Value\n';
    csv += `Total Impressions,${data.metrics.totalImpressions}\n`;
    csv += `Click Rate,${data.metrics.clickRate}\n`;
    csv += `Conversion Rate,${data.metrics.conversionRate}\n`;
    csv += `Cost per Lead,${data.metrics.costPerLead}\n\n`;
    
    // Campaigns section
    csv += 'Campaign Analysis\n';
    csv += 'Campaign,Investment,Returns,Status\n';
    data.campaigns.forEach(campaign => {
        csv += `${campaign.name},${campaign.investment},${campaign.returns},${campaign.status}\n`;
    });
    
    csv += '\nMonthly Performance Trends\n';
    csv += 'Month,Performance\n';
    data.monthlyTrends.forEach(trend => {
        csv += `${trend.month},${trend.performance}\n`;
    });
    
    return csv;
}

// Update ROI Period
function updateROIPeriod(e) {
    const period = e.target.value;
    
    // ROI data for different periods
    const roiData = {
        month: {
            averageROI: '245%',
            bestPerforming: 'Web Dev Bootcamp',
            bestROI: '345%',
            totalRevenue: '$97,717',
            growth: '+28%'
        },
        quarter: {
            averageROI: '268%',
            bestPerforming: 'AI/ML Certification',
            bestROI: '389%',
            totalRevenue: '$284,320',
            growth: '+34%'
        },
        year: {
            averageROI: '312%',
            bestPerforming: 'Data Science Program',
            bestROI: '445%',
            totalRevenue: '$1,127,890',
            growth: '+42%'
        }
    };

    const data = roiData[period];
    if (!data) return;

    // Update ROI cards
    const roiCards = document.querySelectorAll('.roi-card');
    
    // Average ROI
    roiCards[0].querySelector('.roi-value').textContent = data.averageROI;
    roiCards[0].querySelector('.roi-change').innerHTML = `<i class="fas fa-arrow-up"></i> ${data.growth} from last period`;
    
    // Best Performing
    roiCards[1].querySelector('.roi-value').textContent = data.bestPerforming;
    roiCards[1].querySelector('.roi-change').innerHTML = `<i class="fas fa-trophy"></i> ${data.bestROI} ROI`;
    
    // Total Revenue
    roiCards[2].querySelector('.roi-value').textContent = data.totalRevenue;
    roiCards[2].querySelector('.roi-change').innerHTML = `<i class="fas fa-arrow-up"></i> ${data.growth} growth`;

    showNotification(`ROI analysis updated for ${period}`, 'info');
}

// Show Budget Details
function showBudgetDetails() {
    const budgetDetails = {
        totalBudget: 45000,
        activeSpend: 31250,
        pendingAllocations: 8750,
        reserves: 5000,
        campaigns: [
            { name: 'Web Development Bootcamp', allocated: 12000, spent: 10500 },
            { name: 'AI/ML Certification', allocated: 8500, spent: 7200 },
            { name: 'Data Science Program', allocated: 9800, spent: 9800 },
            { name: 'Mobile App Development', allocated: 8000, spent: 3750 }
        ]
    };

    let detailsHTML = '<div class="budget-details-modal">';
    detailsHTML += '<h3>Detailed Budget Breakdown</h3>';
    detailsHTML += '<div class="budget-summary-details">';
    detailsHTML += `<p><strong>Total Budget:</strong> $${budgetDetails.totalBudget.toLocaleString()}</p>`;
    detailsHTML += `<p><strong>Active Spend:</strong> $${budgetDetails.activeSpend.toLocaleString()}</p>`;
    detailsHTML += `<p><strong>Pending Allocations:</strong> $${budgetDetails.pendingAllocations.toLocaleString()}</p>`;
    detailsHTML += `<p><strong>Reserves:</strong> $${budgetDetails.reserves.toLocaleString()}</p>`;
    detailsHTML += '</div>';
    detailsHTML += '<h4>Campaign Breakdown</h4>';
    detailsHTML += '<table class="budget-details-table">';
    detailsHTML += '<tr><th>Campaign</th><th>Allocated</th><th>Spent</th><th>Remaining</th></tr>';
    
    budgetDetails.campaigns.forEach(campaign => {
        const remaining = campaign.allocated - campaign.spent;
        detailsHTML += `<tr>
            <td>${campaign.name}</td>
            <td>$${campaign.allocated.toLocaleString()}</td>
            <td>$${campaign.spent.toLocaleString()}</td>
            <td>$${remaining.toLocaleString()}</td>
        </tr>`;
    });
    
    detailsHTML += '</table>';
    detailsHTML += '<button onclick="closeBudgetDetails()" class="close-details-btn">Close</button>';
    detailsHTML += '</div>';

    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'budget-modal-overlay';
    overlay.innerHTML = detailsHTML;
    document.body.appendChild(overlay);
    
    // Style the modal
    const style = document.createElement('style');
    style.textContent = `
        .budget-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .budget-details-modal {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .budget-details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }
        .budget-details-table th,
        .budget-details-table td {
            padding: 0.5rem;
            border: 1px solid #ddd;
            text-align: left;
        }
        .budget-details-table th {
            background: #f8f9fa;
        }
        .close-details-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(style);
}

// Close Budget Details
function closeBudgetDetails() {
    const overlay = document.querySelector('.budget-modal-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Calculate ROI
function calculateROI() {
    const campaigns = document.querySelectorAll('#analysisTableBody tr');
    let totalInvestment = 0;
    let totalReturns = 0;

    campaigns.forEach(row => {
        const investment = parseFloat(row.children[1].textContent.replace(/[$,]/g, ''));
        const returns = parseFloat(row.children[2].textContent.replace(/[$,]/g, ''));
        
        totalInvestment += investment;
        totalReturns += returns;
    });

    const overallROI = ((totalReturns - totalInvestment) / totalInvestment * 100).toFixed(1);
    console.log(`Overall ROI: ${overallROI}%`);
    
    return overallROI;
}

// Handle Sidebar Navigation
function handleSidebarNavigation(e) {
    e.preventDefault();
    
    const linkText = e.currentTarget.textContent.trim();
    
    switch(linkText) {
        case 'Overview':
            window.location.href = 'sponsordashboard1.html';
            break;
        case 'Campaigns':
            window.location.href = 'sponsordashboard2.html';
            break;
        case 'Analytics':
            // Already on analytics page
            break;
        case 'Profile Setting':
            window.location.href = 'sponsordashboard4.html';
            break;
    }
}

// Handle Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            localStorage.removeItem('skillhub_analytics');
            showNotification('Logged out successfully!', 'success');
        }, 1000);
    }
}

// Load Analytics Data
function loadAnalyticsData() {
    const savedAnalytics = localStorage.getItem('skillhub_analytics');
    if (savedAnalytics) {
        const analytics = JSON.parse(savedAnalytics);
        console.log('Loaded analytics:', analytics);
        // Apply saved data if needed
    }
}

// Save Analytics Data
function saveAnalyticsData() {
    const analyticsData = {
        lastUpdated: new Date().toISOString(),
        metrics: {
            totalImpressions: document.querySelectorAll('.metric-value')[0].textContent,
            clickRate: document.querySelectorAll('.metric-value')[1].textContent,
            conversionRate: document.querySelectorAll('.metric-value')[2].textContent,
            costPerLead: document.querySelectorAll('.metric-value')[3].textContent
        }
    };
    
    localStorage.setItem('skillhub_analytics', JSON.stringify(analyticsData));
}

// Utility Functions

// Show Notification
function showNotification(message, type = 'info') {
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

// Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Format Percentage
function formatPercentage(value) {
    return value.toFixed(1) + '%';
}

// Generate Random Data (for demo purposes)
function generateRandomData(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Auto-refresh functionality
function startAutoRefresh() {
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            updateMetricsWithRandomVariation();
            console.log('Auto-refreshed analytics data');
        }
    }, 30000); // Refresh every 30 seconds
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // R for refresh
    if (e.key === 'r' || e.key === 'R') {
        if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            refreshAnalytics();
        }
    }
    
    // E for export
    if (e.key === 'e' || e.key === 'E') {
        if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            exportAnalyticsData();
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeBudgetDetails();
    }
});

// Start auto-refresh when page loads
setTimeout(startAutoRefresh, 5000);

// Save data before page unload
window.addEventListener('beforeunload', saveAnalyticsData);

console.log('Analytics & Reports JavaScript (sponsordashboard3.js) loaded successfully!');