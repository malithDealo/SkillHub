document.addEventListener('DOMContentLoaded', () => {
    const contactButtons = document.querySelectorAll('.contact-btn');
    const viewScheduleButton = document.querySelector('.btn-secondary');
    const quickActionButtons = document.querySelectorAll('.quick-actions button');
    const viewAllButton = document.querySelector('.view-all');
    const logoutButton = document.querySelector('.logout-btn');
    const modalSection = document.getElementById('modalSection');
    const availabilityDisplay = document.getElementById('availabilityDisplay');
    const skillsList = document.getElementById('skillsList');
    const resourcesList = document.getElementById('resourcesList');
    const contactMessages = document.getElementById('contactMessages');

    // Simulated storage for changes
    let dashboardData = {
        availability: { "Monday - Friday": "2:00 PM - 8:00 PM", "Saturday": "10:00 AM - 6:00 PM", "Sunday": "Not Available" },
        skills: [],
        resources: [],
        messages: []
    };

    // Load initial data if available
    const loadData = () => {
        availabilityDisplay.innerHTML = `
            <h4>Current Availability</h4>
            <p>Monday - Friday: ${dashboardData.availability["Monday - Friday"]}</p>
            <p>Saturday: ${dashboardData.availability["Saturday"]}</p>
            <p>Sunday: ${dashboardData.availability["Sunday"]}</p>
        `;
        skillsList.innerHTML = `<h4>Skills</h4>${dashboardData.skills.length ? dashboardData.skills.map(skill => `<p>${skill.name} - $${skill.price}/hour</p>`).join('') : '<p>No skills added yet.</p>'}`;
        resourcesList.innerHTML = `<h4>Resources</h4>${dashboardData.resources.length ? dashboardData.resources.map(resource => `<p>${resource}</p>`).join('') : '<p>No resources uploaded yet.</p>'}`;
        contactMessages.innerHTML = dashboardData.messages.map(msg => `<p>${msg}</p>`).join('');
    };
    loadData();

    // Highlight function
    const highlightElement = (element) => {
        document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        element.classList.add('highlight');
    };

    // Function to scroll to modal
    const scrollToModal = () => {
        modalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Contact Buttons
    contactButtons.forEach(button => {
        button.addEventListener('click', () => {
            highlightElement(button);
            const studentName = button.parentElement.querySelector('h4').textContent;
            modalSection.innerHTML = `
                <h2>Contact ${studentName}</h2>
                <button class="close-btn">Close</button>
                <form>
                    <input type="text" placeholder="Subject" required>
                    <textarea placeholder="Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            `;
            modalSection.classList.add('active');
            scrollToModal();

            document.querySelector('.close-btn').addEventListener('click', () => {
                modalSection.classList.remove('active');
                button.classList.remove('highlight');
            });

            const form = modalSection.querySelector('form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const subject = form.querySelector('input').value;
                const message = form.querySelector('textarea').value;
                dashboardData.messages.push(`Message sent to ${studentName}: ${subject} - ${message}`);
                loadData();
                modalSection.classList.remove('active');
                button.classList.remove('highlight');
            });
        });
    });

    // View Schedule Button
    if (viewScheduleButton) {
        viewScheduleButton.addEventListener('click', () => {
            highlightElement(viewScheduleButton);
            modalSection.innerHTML = `
                <h2>Full Schedule</h2>
                <button class="close-btn">Close</button>
                <p><strong>Mon, June 2:</strong> Available</p>
                <p><strong>Tue, June 3:</strong> 3 sessions (2:00 PM - 7:30 PM)</p>
                <p><strong>Wed, June 4:</strong> 2 sessions</p>
                <p><strong>Thu, June 5:</strong> Available</p>
                <p><strong>Fri, June 6:</strong> Available</p>
                <p><strong>Sat, June 7:</strong> Available</p>
                <p><strong>Sun, June 8:</strong> Available</p>
            `;
            modalSection.classList.add('active');
            scrollToModal();

            document.querySelector('.close-btn').addEventListener('click', () => {
                modalSection.classList.remove('active');
                viewScheduleButton.classList.remove('highlight');
            });
        });
    }

    // Quick Action Buttons
    quickActionButtons.forEach(button => {
        button.addEventListener('click', () => {
            highlightElement(button);
            const action = button.textContent;
            if (action === 'Update Availability') {
                modalSection.innerHTML = `
                    <h2>Update Availability</h2>
                    <button class="close-btn">Close</button>
                    <form>
                        <input type="text" placeholder="Monday - Friday (e.g., 2:00 PM - 8:00 PM)" value="${dashboardData.availability["Monday - Friday"]}" required>
                        <input type="text" placeholder="Saturday" value="${dashboardData.availability["Saturday"]}" required>
                        <input type="text" placeholder="Sunday" value="${dashboardData.availability["Sunday"]}" required>
                        <button type="submit">Save Availability</button>
                    </form>
                `;
                modalSection.classList.add('active');
                scrollToModal();

                document.querySelector('.close-btn').addEventListener('click', () => {
                    modalSection.classList.remove('active');
                    button.classList.remove('highlight');
                });

                const form = modalSection.querySelector('form');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    dashboardData.availability["Monday - Friday"] = form.querySelector('input:nth-child(1)').value;
                    dashboardData.availability["Saturday"] = form.querySelector('input:nth-child(2)').value;
                    dashboardData.availability["Sunday"] = form.querySelector('input:nth-child(3)').value;
                    loadData();
                    modalSection.classList.remove('active');
                    button.classList.remove('highlight');
                });
            } else if (action === 'Add New Skill') {
                modalSection.innerHTML = `
                    <h2>Add New Skill</h2>
                    <button class="close-btn">Close</button>
                    <form>
                        <input type="text" placeholder="Skill Name" required>
                        <input type="number" placeholder="Price ($/hour)" required>
                        <textarea placeholder="Description" required></textarea>
                        <button type="submit">Add Skill</button>
                    </form>
                `;
                modalSection.classList.add('active');
                scrollToModal();

                document.querySelector('.close-btn').addEventListener('click', () => {
                    modalSection.classList.remove('active');
                    button.classList.remove('highlight');
                });

                const form = modalSection.querySelector('form');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const skill = {
                        name: form.querySelector('input:nth-child(1)').value,
                        price: form.querySelector('input:nth-child(2)').value
                    };
                    dashboardData.skills.push(skill);
                    loadData();
                    modalSection.classList.remove('active');
                    button.classList.remove('highlight');
                });
            } else if (action === 'View Earning Report') {
                alert('Redirecting to Earnings & Analytics page...');
                button.classList.remove('highlight');
                // In a real app: window.location.href = 'earnings_analytics.html';
            } else if (action === 'Upload Resources') {
                modalSection.innerHTML = `
                    <h2>Upload Resources</h2>
                    <button class="close-btn">Close</button>
                    <form>
                        <input type="file" required>
                        <button type="submit">Upload</button>
                    </form>
                `;
                modalSection.classList.add('active');
                scrollToModal();

                document.querySelector('.close-btn').addEventListener('click', () => {
                    modalSection.classList.remove('active');
                    button.classList.remove('highlight');
                });

                const form = modalSection.querySelector('form');
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const fileInput = form.querySelector('input[type="file"]');
                    if (fileInput.files.length) {
                        dashboardData.resources.push(fileInput.files[0].name);
                        loadData();
                    }
                    modalSection.classList.remove('active');
                    button.classList.remove('highlight');
                });
            } else if (action === 'Edit Profile') {
                alert('Redirecting to Profile Setting page...');
                button.classList.remove('highlight');
                // In a real app: window.location.href = 'profile_setting.html';
            }
        });
    });

    // View All Button
    viewAllButton.addEventListener('click', () => {
        highlightElement(viewAllButton);
        modalSection.innerHTML = `
            <h2>All Students</h2>
            <button class="close-btn">Close</button>
            <p><strong>Sarah Johnson</strong> - Guitar Basics • 12 sessions</p>
            <p><strong>Mike Thompson</strong> - Advanced Guitar • 8 sessions</p>
            <p><strong>Emma Brown</strong> - Guitar Basics • 5 sessions</p>
            <p><strong>John Doe</strong> - Intermediate Guitar • 10 sessions</p>
            <p><strong>Jane Smith</strong> - Guitar Basics • 3 sessions</p>
        `;
        modalSection.classList.add('active');
        scrollToModal();

        document.querySelector('.close-btn').addEventListener('click', () => {
            modalSection.classList.remove('active');
            viewAllButton.classList.remove('highlight');
        });
    });

    // Logout Button
    logoutButton.addEventListener('click', () => {
        highlightElement(logoutButton);
        if (confirm('Are you sure you want to log out?')) {
            alert('Logging out...');
            logoutButton.classList.remove('highlight');
            // In a real app: window.location.href = 'login.html';
        } else {
            logoutButton.classList.remove('highlight');
        }
    });

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        if (!modalSection.contains(e.target) && !e.target.classList.contains('contact-btn') && !e.target.classList.contains('btn-secondary') && !e.target.classList.contains('quick-actions') && !e.target.closest('.quick-actions') && !e.target.classList.contains('view-all') && !e.target.classList.contains('logout-btn')) {
            modalSection.classList.remove('active');
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        }
    });
});