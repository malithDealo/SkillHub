document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value;
    const notify = document.getElementById('notify').checked;
    const guideline = document.getElementById('guideline').checked;

    if (!title) {
        alert('Please enter a question title.');
        return;
    }
    if (guideline) {
        alert(`Question Posted!\nTitle: ${title}\nCategory: ${category}\nDescription: ${description}\nTags: ${tags}\nNotify: ${notify}`);
        this.reset();
    } else {
        alert('Please agree to the Community Guideline.');
    }
});

document.getElementById('tags').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let tags = this.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        this.value = tags.join(', ');
    }
});

const closeIcon = document.querySelector('.close-icon');
if (closeIcon) {
    closeIcon.addEventListener('click', function() {
        const form = document.getElementById('eventForm');
        if (form.elements.length > 0 && Array.from(form.elements).some(el => el.value && el.value.trim() !== '')) {
            if (confirm('You have unsaved changes. Are you sure you want to close?')) {
                closeForm();
            }
        } else {
            closeForm();
        }
    });
}

function closeForm() {
    window.location.href = '../public/learning_community.html';
}

document.querySelector('.cancel').addEventListener('click', closeForm);