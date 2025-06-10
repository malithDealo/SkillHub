document.addEventListener('DOMContentLoaded', function() {
    const addSkillBtn = document.querySelector('.add-skill-btn');
    const editBtns = document.querySelectorAll('.edit-btn');
    const updateSection = document.getElementById('updateSection');
    const skillsSection = document.querySelector('.skills-section');

    // Simulated skill data
    let skills = [
        { name: 'Guitar - Beginner', price: '$35/hour', details: '4.9★ rating • 45 students taught' },
        { name: 'Guitar - Intermediate', price: '$45/hour', details: '4.8★ rating • 28 students taught' },
        { name: 'Guitar - Advanced', price: '$60/hour', details: '5.0★ rating • 12 students taught' }
    ];

    // Function to scroll to modal
    const scrollToModal = () => {
        updateSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Add New Skill
    addSkillBtn.addEventListener('click', function() {
        updateSection.innerHTML = `
            <h2>Add New Skill</h2>
            <button class="close-btn">Close</button>
            <form>
                <input type="text" placeholder="Skill Name" required>
                <input type="number" placeholder="Price ($/hour)" required>
                <textarea placeholder="Details (e.g., rating, students taught)" required></textarea>
                <button type="submit">Save Skill</button>
            </form>
        `;
        updateSection.classList.add('active');
        scrollToModal();

        const form = updateSection.querySelector('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = form.querySelector('input[type="text"]').value;
            const price = `$${form.querySelector('input[type="number"]').value}/hour`;
            const details = form.querySelector('textarea').value;
            skills.push({ name, price, details });
            const newSkillEntry = document.createElement('div');
            newSkillEntry.classList.add('skill-entry');
            newSkillEntry.innerHTML = `
                <div>
                    <h4>${name}</h4>
                    <p>${price} • ${details}</p>
                </div>
                <button class="btn-secondary edit-btn" data-section="skill-${skills.length - 1}">Edit</button>
            `;
            skillsSection.appendChild(newSkillEntry);
            updateSection.classList.remove('active');
            attachEditListeners();
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            updateSection.classList.remove('active');
        });
    });

    // Edit Buttons
    const attachEditListeners = () => {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.removeEventListener('click', editHandler); // Prevent duplicate listeners
            btn.addEventListener('click', editHandler);
        });
    };

    const editHandler = function() {
        const section = this.getAttribute('data-section');
        let content = '';
        if (section === 'portfolio') {
            content = `
                <h2>Edit Portfolio & Bio</h2>
                <button class="close-btn">Close</button>
                <form>
                    <input type="text" placeholder="Teaching Experience" value="8 years" required>
                    <input type="text" placeholder="Certifications" value="Music Theory, Performance" required>
                    <input type="text" placeholder="Languages" value="English, Sinhala" required>
                    <input type="number" placeholder="Portfolio Videos" value="3" required>
                    <button type="submit">Save Changes</button>
                </form>
            `;
            updateSection.innerHTML = content;
            updateSection.classList.add('active');
            scrollToModal();

            const form = updateSection.querySelector('form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const experience = form.querySelector('input:nth-child(1)').value;
                const certifications = form.querySelector('input:nth-child(2)').value;
                const languages = form.querySelector('input:nth-child(3)').value;
                const videos = form.querySelector('input:nth-child(4)').value;
                document.querySelector('.portfolio-entry:nth-child(1) p').textContent = experience;
                document.querySelector('.portfolio-entry:nth-child(2) p').textContent = certifications;
                document.querySelector('.portfolio-entry:nth-child(3) p').textContent = languages;
                document.querySelector('.portfolio-entry:nth-child(4) p').textContent = `${videos} uploaded`;
                updateSection.classList.remove('active');
            });
        } else {
            const skillIndex = parseInt(section.split('-')[1]);
            const skill = skills[skillIndex];
            content = `
                <h2>Edit Skill</h2>
                <button class="close-btn">Close</button>
                <form>
                    <input type="text" placeholder="Skill Name" value="${skill.name}" required>
                    <input type="number" placeholder="Price ($/hour)" value="${skill.price.replace('$', '').replace('/hour', '')}" required>
                    <textarea placeholder="Details" required>${skill.details}</textarea>
                    <button type="submit">Save Changes</button>
                </form>
            `;
            updateSection.innerHTML = content;
            updateSection.classList.add('active');
            scrollToModal();

            const form = updateSection.querySelector('form');
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = form.querySelector('input[type="text"]').value;
                const price = `$${form.querySelector('input[type="number"]').value}/hour`;
                const details = form.querySelector('textarea').value;
                skills[skillIndex] = { name, price, details };
                const skillEntry = document.querySelectorAll('.skill-entry')[skillIndex];
                skillEntry.querySelector('h4').textContent = name;
                skillEntry.querySelector('p').textContent = `${price} • ${details}`;
                updateSection.classList.remove('active');
            });
        }

        document.querySelector('.close-btn').addEventListener('click', () => {
            updateSection.classList.remove('active');
        });
    };

    attachEditListeners();

    // Close update section when clicking outside (only add if not already added)
    if (!document.body.dataset.modalListenerAdded) {
        document.addEventListener('click', function(e) {
            if (!updateSection.contains(e.target) && !e.target.classList.contains('add-skill-btn') && !e.target.classList.contains('edit-btn')) {
                updateSection.classList.remove('active');
            }
        });
        document.body.dataset.modalListenerAdded = 'true';
    }
});