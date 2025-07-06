function sortTeachers() {
    const sortValue = document.getElementById('sortFilter').value;
    const teacherGrid = document.getElementById('teacherGrid');
    const cards = Array.from(teacherGrid.getElementsByClassName('teacher-card'));

    cards.sort((a, b) => {
        if (sortValue === 'Alphabetical') {
            return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        } else if (sortValue === 'Most Popular') {
            return parseInt(b.querySelector('p:nth-child(3)').textContent) - parseInt(a.querySelector('p:nth-child(3)').textContent);
        } else if (sortValue === 'Price: Low to High') {
            return (parseInt(a.getAttribute('data-price')) || 0) - (parseInt(b.getAttribute('data-price')) || 0);
        } else if (sortValue === 'Price: High to Low') {
            return (parseInt(b.getAttribute('data-price')) || 0) - (parseInt(a.getAttribute('data-price')) || 0);
        } else {
            return 0;
        }
    });

    cards.forEach(card => teacherGrid.appendChild(card));
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
    document.querySelectorAll('.teacher-card').forEach(card => {
        card.style.display = 'block';
    });
    document.querySelector('.teachers-count').textContent = '150 teachers available in your area';
    sortTeachers();
}

function viewTeacherProfile(teacher) {
    window.location.href = `../public/teachers_profile.html?teacher=${encodeURIComponent(teacher)}`;
}

function searchTeachers() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
    const locationFilter = document.getElementById('locationFilter').value;
    const priceMin = parseInt(document.getElementById('priceFilterMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceFilterMax').value) || 9999;
    const availabilityFilter = document.getElementById('availabilityFilter').value;
    const levelFilters = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(input => input.value);
    const lessonFilters = Array.from(document.querySelectorAll('input[name="lesson"]:checked')).map(input => input.value);
    const teacherGrid = document.getElementById('teacherGrid');
    const cards = Array.from(teacherGrid.getElementsByClassName('teacher-card'));
    let visibleCount = 0;

    cards.forEach(card => {
        const teacherName = card.getAttribute('data-name').toLowerCase();
        const skills = card.querySelector('.skills').textContent.toLowerCase();
        const cardLocation = card.getAttribute('data-location');
        const cardPrice = parseInt(card.getAttribute('data-price')) || 0;
        const cardAvailability = card.getAttribute('data-availability').split(',');
        const cardLevels = card.getAttribute('data-level').split(',');
        const cardLessons = card.getAttribute('data-lesson').split(',');

        const textMatch = searchValue === '' || teacherName.includes(searchValue) || skills.includes(searchValue);
        const locationMatch = locationFilter === 'all' || cardLocation === locationFilter;
        const priceMatch = cardPrice >= priceMin && cardPrice <= priceMax;
        const availabilityMatch = availabilityFilter === 'all' || cardAvailability.includes(availabilityFilter);
        const levelMatch = levelFilters.length === 0 || levelFilters.some(level => cardLevels.includes(level));
        const lessonMatch = lessonFilters.length === 0 || lessonFilters.some(lesson => cardLessons.includes(lesson));

        if (textMatch && locationMatch && priceMatch && availabilityMatch && levelMatch && lessonMatch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const countText = visibleCount === 1 ? 'teacher' : 'teachers';
    document.querySelector('.teachers-count').textContent = `${visibleCount} ${countText} available in your area`;
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.teacher-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-profile-btn')) {
                viewTeacherProfile(card.getAttribute('data-name'));
            }
        });
    });

    const teacherButton = document.querySelector('.role-btn[data-role="teachers"]');
    if (teacherButton) {
        teacherButton.classList.add('active');
    }

    const debouncedSearch = debounce(searchTeachers, 300);
    document.getElementById('searchInput').addEventListener('input', debouncedSearch);
    document.getElementById('locationFilter').addEventListener('change', debouncedSearch);
    document.getElementById('priceFilterMin').addEventListener('change', debouncedSearch);
    document.getElementById('priceFilterMax').addEventListener('change', debouncedSearch);
    document.getElementById('availabilityFilter').addEventListener('change', debouncedSearch);
    document.querySelectorAll('input[name="level"]').forEach(checkbox => {
        checkbox.addEventListener('change', debouncedSearch);
    });
    document.querySelectorAll('input[name="lesson"]').forEach(checkbox => {
        checkbox.addEventListener('change', debouncedSearch);
    });
    document.getElementById('clearFilters.datepicker: Sunday, July 06, 2025 10:02 PM +0530Filters').addEventListener('click', clearFilters);
    document.querySelector('.filter-search-btn').addEventListener('click', searchTeachers);
    document.getElementById('sortFilter').addEventListener('change', sortTeachers);
});