document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.querySelector('.download-btn');
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    const viewTrendBtn = document.querySelector('.view-trend-btn');
    const detailsSection = document.getElementById('detailsSection');

    // Download Report action
    downloadBtn.addEventListener('click', function() {
        alert('Downloading report...');
        // In a real application, this would trigger a file download
    });

    // View Details action for each payment
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = this.parentElement.parentElement.getAttribute('data-payment-id');
            const paymentDetails = [
                { id: '0', description: 'Guitar Session Package - Sarah J.', date: 'Dec 18, 2024', amount: '$140.00', student: 'Sarah J.', duration: '2 hours' },
                { id: '1', description: 'Advanced Guitar - Mike T.', date: 'Dec 17, 2024', amount: '$90.00', student: 'Mike T.', duration: '1 hour' },
                { id: '2', description: 'Group Session - 4 Students', date: 'Dec 16, 2024', amount: '$200.00', student: '4 Students', duration: '3 hours' }
            ];
            const details = paymentDetails.find(item => item.id === paymentId);
            detailsSection.innerHTML = `
                <h2>Payment Details</h2>
                <button class="close-btn">Close</button>
                <p><strong>Description:</strong> ${details.description}</p>
                <p><strong>Date:</strong> ${details.date}</p>
                <p><strong>Amount:</strong> ${details.amount}</p>
                <p><strong>Student(s):</strong> ${details.student}</p>
                <p><strong>Duration:</strong> ${details.duration}</p>
            `;
            detailsSection.classList.add('active');

            // Close button action
            document.querySelector('.close-btn').addEventListener('click', function() {
                detailsSection.classList.remove('active');
            });
        });
    });

    // View Trend Chart action
    viewTrendBtn.addEventListener('click', function() {
        detailsSection.innerHTML = `
            <h2>Monthly Trends Chart</h2>
            <button class="close-btn">Close</button>
            <p>Trend Data for December 2024: $1,240 (+15%)</p>
            <p>Trend Data for November 2024: $1,080</p>
            <p>Trend Data for October 2024: $1,360</p>
            <p>Average Growth: +8% per month</p>
            <p><em>In a real application, this would display a chart.</em></p>
        `;
        detailsSection.classList.add('active');

        // Close button action
        document.querySelector('.close-btn').addEventListener('click', function() {
            detailsSection.classList.remove('active');
        });
    });

    // Close details section when clicking outside (only add if not already added)
    if (!document.body.dataset.modalListenerAdded) {
        document.addEventListener('click', function(e) {
            if (!detailsSection.contains(e.target) && !e.target.classList.contains('view-details-btn') && !e.target.classList.contains('view-trend-btn')) {
                detailsSection.classList.remove('active');
            }
        });
        document.body.dataset.modalListenerAdded = 'true';
    }
});