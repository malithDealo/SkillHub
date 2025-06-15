function sortTeachers() {
    const sortValue = document.getElementById('sortFilter').value;
    const categoryGrid = document.getElementById('categoryGrid');
    const cards = Array.from(categoryGrid.getElementsByClassName('category-card'));

    cards.sort((a, b) => {
        if (sortValue === 'Alphabetical') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        } else {
            return b.getAttribute('data-popularity') - a.getAttribute('data-popularity');
        }
    });

    cards.forEach(card => categoryGrid.appendChild(card));
}

function clearFilters() {
    document.getElementById('locationFilter').value = 'Within 1 mile';
    document.getElementById('priceFilterMax').value = 1000;
    document.getElementById('priceFilterMin').value = 0;
    document.getElementById('availabilityFilter').value = 'Any time';
    document.getElementById('languageFilter').value = 'All languages';
    document.getElementById('ratingFilter').value = 'All ratings';
    document.getElementById('skillFilter').value = 'All skills';
    sortTeachers();
}

// Set "Teachers" as active by default
document.addEventListener('DOMContentLoaded', () => {
    const teacherButton = document.querySelector('.role-btn[data-role="teachers"]');
    teacherButton.classList.add('active');
});