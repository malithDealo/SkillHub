document.addEventListener('DOMContentLoaded', function() {
    const weeklySchedule = document.getElementById('weeklySchedule');
    const availabilitySettings = document.getElementById('availabilitySettings');
    const days = weeklySchedule.getElementsByClassName('day');
    const settingsRows = availabilitySettings.getElementsByClassName('setting-row');
    const editScheduleBtn = document.getElementById('editScheduleBtn');
    const updateAvailabilityBtn = document.getElementById('updateAvailabilityBtn');
    const updateSection = document.getElementById('updateSection');

    // Balance the content height
    function balanceHeights() {
        let maxHeight = 0;
        Array.from(days).forEach(day => {
            day.style.height = 'auto';
            if (day.offsetHeight > maxHeight) maxHeight = day.offsetHeight;
        });
        Array.from(days).forEach(day => day.style.height = maxHeight + 'px');

        maxHeight = 0;
        Array.from(settingsRows).forEach(row => {
            row.style.height = 'auto';
            if (row.offsetHeight > maxHeight) maxHeight = row.offsetHeight;
        });
        Array.from(settingsRows).forEach(row => row.style.height = maxHeight + 'px');
    }

    // Function to scroll to modal
    const scrollToModal = () => {
        updateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Apply balancing on load and resize
    balanceHeights();
    window.addEventListener('resize', balanceHeights);

    // Handle Edit Schedule button click
    editScheduleBtn.addEventListener('click', function() {
        const scheduleData = Array.from(days).map(day => {
            const spans = day.querySelectorAll('span');
            return {
                day: spans[0].textContent,
                date: spans[1].textContent,
                status: spans[2].textContent
            };
        });
        updateSection.innerHTML = `
            <h2>Edit Weekly Schedule</h2>
            <form id="editScheduleForm">
                ${scheduleData.map((item, index) => `
                    <div>
                        <label>${item.day} (${item.date})</label>
                        <input type="text" name="status-${index}" value="${item.status}" required>
                    </div>
                `).join('')}
                <button type="submit">Save Schedule</button>
            </form>
        `;
        updateSection.classList.add('active');
        scrollToModal();

        const form = document.getElementById('editScheduleForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const newSchedule = Array.from(form.querySelectorAll('input')).map(input => input.value);
            Array.from(days).forEach((day, index) => {
                const spans = day.querySelectorAll('span');
                spans[2].textContent = newSchedule[index];
            });
            updateSection.classList.remove('active');
            balanceHeights();
        });
    });

    // Handle Update Availability button click
    updateAvailabilityBtn.addEventListener('click', function() {
        const availabilityData = Array.from(settingsRows).map(row => ({
            label: row.querySelector('span:first-child').textContent,
            value: row.querySelector('span:last-child').textContent
        }));
        updateSection.innerHTML = `
            <h2>Edit Availability Settings</h2>
            <form id="editAvailabilityForm">
                ${availabilityData.map((item, index) => `
                    <div>
                        <label>${item.label}</label>
                        <input type="text" name="value-${index}" value="${item.value}" required>
                    </div>
                `).join('')}
                <button type="submit">Save Settings</button>
            </form>
        `;
        updateSection.classList.add('active');
        scrollToModal();

        const form = document.getElementById('editAvailabilityForm');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const newSettings = Array.from(form.querySelectorAll('input')).map(input => input.value);
            Array.from(settingsRows).forEach((row, index) => {
                row.querySelector('span:last-child').textContent = newSettings[index];
            });
            updateSection.classList.remove('active');
            balanceHeights();
        });
    });

    // Close update section when clicking outside (only add if not already added)
    if (!document.body.dataset.modalListenerAdded) {
        document.addEventListener('click', function(e) {
            if (!updateSection.contains(e.target) && !e.target.classList.contains('edit-btn') && !e.target.classList.contains('update-btn')) {
                updateSection.classList.remove('active');
            }
        });
        document.body.dataset.modalListenerAdded = 'true';
    }
});