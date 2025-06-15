function sortCategories() {
    const sortValue = document.getElementById('sortFilter').value;
    const categoryGrid = document.getElementById('categoryGrid');
    const cards = Array.from(categoryGrid.getElementsByClassName('category-card'));

    cards.sort((a, b) => {
        if (sortValue === 'alphabetical') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        } else {
            return b.getAttribute('data-teachers') - a.getAttribute('data-teachers');
        }
    });

    cards.forEach(card => categoryGrid.appendChild(card));
}

function clearFilters() {
    document.getElementById('locationFilter').value = 'Within 1 mile';
    document.getElementById('priceFilterMax').value = 100;
    document.getElementById('priceFilterMin').value = 0;
    document.getElementById('availabilityFilter').value = 'Any time';
    document.getElementById('languageFilter').value = 'Any language';
    document.getElementById('beginner').checked = false;
    document.getElementById('intermediate').checked = false;
    document.getElementById('advanced').checked = false;
    document.getElementById('professional').checked = false;
    document.getElementById('individual').checked = false;
    document.getElementById('group').checked = false;
    document.getElementById('workshops').checked = false;
    sortCategories();
}