function sortCategories() {
    const sortValue = document.getElementById('sortFilter').value;
    const categoryGrid = document.getElementById('categoryGrid');
    const cards = Array.from(categoryGrid.getElementsByClassName('category-card'));

    cards.sort((a, b) => {
        if (sortValue === 'Alphabetical') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        } else if (sortValue === 'Most Popular') {
            return b.getAttribute('data-teachers') - a.getAttribute('data-teachers');
        } else if (sortValue === 'Price: Low to High') {
            return a.getAttribute('data-price') - b.getAttribute('data-price');
        } else if (sortValue === 'Price: High to Low') {
            return b.getAttribute('data-price') - a.getAttribute('data-price');
        } else {
            return 0;
        }
    });

    cards.forEach(card => categoryGrid.appendChild(card));
}

function clearFilters() {
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('priceFilterMax').value = '9999';
    document.getElementById('priceFilterMin').value = '0';
    document.getElementById('availabilityFilter').value = 'all';
    document.getElementById('beginner').checked = false;
    document.getElementById('intermediate').checked = false;
    document.getElementById('advanced').checked = false;
    document.getElementById('professional').checked = false;
    document.getElementById('individual').checked = false;
    document.getElementById('group').checked = false;
    document.getElementById('workshops').checked = false;
    document.getElementById('searchInput').value = '';
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
        card.querySelector('.sub-subjects').style.display = 'none';
        card.style.display = 'block';
    });
    document.querySelector('.skills-count').textContent = '1,247 skills available in your area';
    sortCategories();
}

function toggleSubSubjects(card) {
    const subSubjects = card.querySelector('.sub-subjects');
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.category-card').forEach(c => {
        c.classList.remove('active');
        c.querySelector('.sub-subjects').style.display = 'none';
    });
    if (!isActive) {
        card.classList.add('active');
        subSubjects.style.display = 'block';
    }
}

function viewTeachers(category) {
    window.location.href = `../public/skills_teachers.html?category=${encodeURIComponent(category)}`;
}

function searchCategories() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
    const locationFilter = document.getElementById('locationFilter').value;
    const priceMin = parseInt(document.getElementById('priceFilterMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceFilterMax').value) || 9999;
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    const levelFilters = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(input => input.value);
    const lessonFilters = Array.from(document.querySelectorAll('input[name="lesson"]:checked')).map(input => input.value);
    const categoryGrid = document.getElementById('categoryGrid');
    const cards = Array.from(categoryGrid.getElementsByClassName('category-card'));
    let visibleCount = 0;

    cards.forEach(card => {
        const categoryName = card.getAttribute('data-name').toLowerCase();
        const subSubjects = card.querySelector('.sub-subjects p').textContent.toLowerCase();
        const cardLocation = card.getAttribute('data-location');
        const cardPrice = parseInt(card.getAttribute('data-price')) || 0;
        const cardAvailability = card.getAttribute('data-availability').split(',');
        const cardLevels = card.getAttribute('data-level').split(',');
        const cardLessons = card.getAttribute('data-lesson').split(',');

        // Search text filter
        const textMatch = searchValue === '' || categoryName.includes(searchValue) || subSubjects.includes(searchValue);

        // Location filter
        const locationMatch = locationFilter === 'all' || cardLocation === locationFilter;

        // Price filter
        const priceMatch = cardPrice >= priceMin && cardPrice <= priceMax;

        // Availability filter
        const availabilityMatch = availabilityFilter === 'all' || cardAvailability.includes(availabilityFilter);

        // Teacher level filter
        const levelMatch = levelFilters.length === 0 || levelFilters.some(level => cardLevels.includes(level));

        // Lesson type filter
        const lessonMatch = lessonFilters.length === 0 || lessonFilters.some(lesson => cardLessons.includes(lesson));

        // Combine all filters
        if (textMatch && locationMatch && priceMatch && availabilityMatch && levelMatch && lessonMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.remove('active');
            card.querySelector('.sub-subjects').style.display = 'none';
        }
    });

    const countText = visibleCount === 1 ? 'skill' : 'skills';
    document.querySelector('.skills-count').textContent = `${visibleCount} ${countText} available in your area`;
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // Add click event for category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('view-teachers-btn')) {
                toggleSubSubjects(card);
            }
        });
    });

    // Set categories button as active
    const categoryButton = document.querySelector('.role-btn[data-role="categories"]');
    categoryButton.classList.add('active');

    // Add event listeners for filters
    const debouncedSearch = debounce(searchCategories, 300);
    document.getElementById('searchInput').addEventListener('input', debouncedSearch);
    document.getElementById('searchButton').addEventListener('click', searchCategories);
    document.getElementById('locationFilter').addEventListener('change', debouncedSearch);
    document.getElementById('priceFilterMin').addEventListener('change', debouncedSearch);
    document.getElementById('priceFilterMax').addEventListener('change', debouncedSearch);
    document.getElementById('availabilityFilter').addEventListener('change', debouncedSearch);
    document.querySelectorAll('input[name="level"]').forEach(input => {
        input.addEventListener('change', debouncedSearch);
    });
    document.querySelectorAll('input[name="lesson"]').forEach(input => {
        input.addEventListener('change', debouncedSearch);
    });
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    document.getElementById('sortFilter').addEventListener('change', sortCategories);
});