// Form submission handler (unchanged)
document.getElementById('eventForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value;
    const notify = document.getElementById('notify').checked;
    const guideline = document.getElementById('guideline').checked;

    if (guideline) {
        alert(`Question Posted!\nTitle: ${title}\nCategory: ${category}\nDescription: ${description}\nTags: ${tags}\nNotify: ${notify}`);
        this.reset();
    } else {
        alert('Please agree to the Community Guideline.');
    }
});

// Tags input handler (unchanged)
document.getElementById('tags').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let tags = this.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        this.value = tags.join(', ');
    }
});

// Close form function - Now redirects to learning_community.html
function closeForm() {
    window.location.href = '../learning_community/learning_community.html';
}

// Add event listener to Cancel button
document.querySelector('.cancel').addEventListener('click', closeForm);