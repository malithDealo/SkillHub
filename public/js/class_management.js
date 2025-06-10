document.addEventListener('DOMContentLoaded', () => {
    const sendMessageBtn = document.querySelector('.send-message-btn');
    const replyButtons = document.querySelectorAll('.reply-btn');
    const addNoteBtn = document.querySelector('.add-note-btn');
    const editNoteButtons = document.querySelectorAll('.edit-note-btn');
    const uploadBtn = document.querySelector('.upload-btn');
    const shareButtons = document.querySelectorAll('.share-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    const modalSection = document.getElementById('modalSection');

    // Simulated data storage
    let classData = {
        messages: [],
        notes: [
            { id: '0', student: 'Sarah Johnson', course: 'Guitar Basics', date: 'Dec 18, 2024', type: 'text', content: 'Worked on chord transitions. Great progress!' },
            { id: '1', student: 'Mike Thompson', course: 'Advanced Guitar', date: 'Dec 17, 2024', type: 'text', content: 'Fingerpicking techniques. Needs more practice.' }
        ],
        resources: [
            { id: '0', name: 'Guitar Chord Charts.pdf', date: 'Dec 15, 2024', size: '2.3 MB' },
            { id: '1', name: 'Practice Songs.mp3', date: 'Dec 10, 2024', size: '5.1 MB' }
        ]
    };

    // Function to scroll to modal
    const scrollToModal = () => {
        modalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // Function to attach click handlers to note content links
    const attachNoteContentListeners = () => {
        document.querySelectorAll('.note-content a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const noteId = link.closest('.note-entry').getAttribute('data-note-id');
                const note = classData.notes.find(n => n.id === noteId);
                modalSection.innerHTML = `
                    <h2>View Document</h2>
                    <button class="close-btn">Close</button>
                    <p><strong>File:</strong> ${note.content}</p>
                    <p><strong>Uploaded:</strong> ${note.date}</p>
                    <p>(In a real app, you could download or view this file.)</p>
                `;
                modalSection.classList.add('active');
                scrollToModal();

                document.querySelector('.close-btn').addEventListener('click', () => {
                    modalSection.classList.remove('active');
                });
            });
        });
    };

    // Send Message Button
    sendMessageBtn.addEventListener('click', () => {
        modalSection.innerHTML = `
            <h2>Send Message</h2>
            <button class="close-btn">Close</button>
            <form>
                <select name="student" required>
                    <option value="" disabled selected>Select a student</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                </select>
                <input type="text" placeholder="Subject" required>
                <textarea placeholder="Message" required></textarea>
                <button type="submit">Send</button>
            </form>
        `;
        modalSection.classList.add('active');
        scrollToModal();

        document.querySelector('.close-btn').addEventListener('click', () => {
            modalSection.classList.remove('active');
        });

        const form = modalSection.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const student = form.querySelector('select').value;
            const subject = form.querySelector('input').value;
            const message = form.querySelector('textarea').value;
            alert(`Message sent to ${student}: ${subject} - ${message}`);
            modalSection.classList.remove('active');
        });
    });

    // Reply Buttons
    replyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const student = btn.getAttribute('data-student');
            modalSection.innerHTML = `
                <h2>Reply to ${student}</h2>
                <button class="close-btn">Close</button>
                <form>
                    <input type="text" placeholder="Subject" required>
                    <textarea placeholder="Message" required></textarea>
                    <button type="submit">Send Reply</button>
                </form>
            `;
            modalSection.classList.add('active');
            scrollToModal();

            document.querySelector('.close-btn').addEventListener('click', () => {
                modalSection.classList.remove('active');
            });

            const form = modalSection.querySelector('form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const subject = form.querySelector('input').value;
                const message = form.querySelector('textarea').value;
                alert(`Reply sent to ${student}: ${subject} - ${message}`);
                modalSection.classList.remove('active');
            });
        });
    });

    // Add Note Button
    addNoteBtn.addEventListener('click', () => {
        modalSection.innerHTML = `
            <h2>Add Session Note</h2>
            <button class="close-btn">Close</button>
            <form>
                <select name="student" required>
                    <option value="" disabled selected>Select a student</option>
                    <option value="Sarah Johnson">Sarah Johnson</option>
                    <option value="Mike Thompson">Mike Thompson</option>
                </select>
                <input type="text" placeholder="Course (e.g., Guitar Basics)" required>
                <input type="date" required>
                <div class="note-type">
                    <label><input type="radio" name="noteType" value="text" checked> Type Note</label>
                    <label><input type="radio" name="noteType" value="document"> Upload Document</label>
                </div>
                <div class="note-input text-input active">
                    <textarea placeholder="Note" required></textarea>
                </div>
                <div class="note-input document-input">
                    <input type="file" accept=".doc,.docx,.pdf,.txt">
                </div>
                <button type="submit">Add Note</button>
            </form>
        `;
        modalSection.classList.add('active');
        scrollToModal();

        // Toggle between text and document input
        const noteTypeRadios = modalSection.querySelectorAll('input[name="noteType"]');
        const textInput = modalSection.querySelector('.text-input');
        const documentInput = modalSection.querySelector('.document-input');
        noteTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'text') {
                    textInput.classList.add('active');
                    documentInput.classList.remove('active');
                    textInput.querySelector('textarea').setAttribute('required', 'required');
                    documentInput.querySelector('input[type="file"]').removeAttribute('required');
                } else {
                    textInput.classList.remove('active');
                    documentInput.classList.add('active');
                    textInput.querySelector('textarea').removeAttribute('required');
                    documentInput.querySelector('input[type="file"]').setAttribute('required', 'required');
                }
            });
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            modalSection.classList.remove('active');
        });

        const form = modalSection.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const student = form.querySelector('select').value;
            const course = form.querySelector('input[type="text"]').value;
            const date = form.querySelector('input[type="date"]').value;
            const noteType = form.querySelector('input[name="noteType"]:checked').value;
            let content;
            if (noteType === 'text') {
                content = form.querySelector('textarea').value;
            } else {
                const fileInput = form.querySelector('input[type="file"]');
                content = fileInput.files.length ? fileInput.files[0].name : null;
            }
            if (!content) return;

            const newNote = { id: classData.notes.length.toString(), student, course, date, type: noteType, content };
            classData.notes.push(newNote);
            const notesSection = addNoteBtn.parentElement.parentElement;
            const newNoteElement = document.createElement('div');
            newNoteElement.classList.add('note-entry');
            newNoteElement.setAttribute('data-note-id', newNote.id);
            newNoteElement.innerHTML = `
                <div>
                    <h4>${student} - ${course}</h4>
                    <div class="note-date">${new Date(date).toLocaleDateString()}</div>
                    <p class="note-content">${noteType === 'text' ? content : `<a href="#">${content}</a>`}</p>
                </div>
                <button class="btn-secondary edit-note-btn">Edit</button>
            `;
            notesSection.appendChild(newNoteElement);
            modalSection.classList.remove('active');

            // Reattach event listeners
            document.querySelectorAll('.edit-note-btn').forEach(btn => btn.removeEventListener('click', editNoteHandler));
            attachEditNoteListeners();
            attachNoteContentListeners();
        });
    });

    // Edit Note Buttons
    const editNoteHandler = (btn) => {
        const noteEntry = btn.parentElement;
        const noteId = noteEntry.getAttribute('data-note-id');
        const note = classData.notes.find(n => n.id === noteId);
        modalSection.innerHTML = `
            <h2>Edit Session Note</h2>
            <button class="close-btn">Close</button>
            <form>
                <select name="student" required>
                    <option value="Sarah Johnson" ${note.student === 'Sarah Johnson' ? 'selected' : ''}>Sarah Johnson</option>
                    <option value="Mike Thompson" ${note.student === 'Mike Thompson' ? 'selected' : ''}>Mike Thompson</option>
                </select>
                <input type="text" value="${note.course}" placeholder="Course" required>
                <input type="date" value="${note.date}" required>
                <div class="note-type">
                    <label><input type="radio" name="noteType" value="text" ${note.type === 'text' ? 'checked' : ''}> Type Note</label>
                    <label><input type="radio" name="noteType" value="document" ${note.type === 'document' ? 'checked' : ''}> Upload Document</label>
                </div>
                <div class="note-input text-input ${note.type === 'text' ? 'active' : ''}">
                    <textarea placeholder="Note" ${note.type === 'text' ? 'required' : ''}>${note.type === 'text' ? note.content : ''}</textarea>
                </div>
                <div class="note-input document-input ${note.type === 'document' ? 'active' : ''}">
                    ${note.type === 'document' ? `<p>Current File: ${note.content}</p>` : ''}
                    <input type="file" accept=".doc,.docx,.pdf,.txt" ${note.type === 'document' ? 'required' : ''}>
                </div>
                <button type="submit">Save Note</button>
            </form>
        `;
        modalSection.classList.add('active');
        scrollToModal();

        // Toggle between text and document input
        const noteTypeRadios = modalSection.querySelectorAll('input[name="noteType"]');
        const textInput = modalSection.querySelector('.text-input');
        const documentInput = modalSection.querySelector('.document-input');
        noteTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'text') {
                    textInput.classList.add('active');
                    documentInput.classList.remove('active');
                    textInput.querySelector('textarea').setAttribute('required', 'required');
                    documentInput.querySelector('input[type="file"]').removeAttribute('required');
                } else {
                    textInput.classList.remove('active');
                    documentInput.classList.add('active');
                    textInput.querySelector('textarea').removeAttribute('required');
                    documentInput.querySelector('input[type="file"]').setAttribute('required', 'required');
                }
            });
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            modalSection.classList.remove('active');
        });

        const form = modalSection.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            note.student = form.querySelector('select').value;
            note.course = form.querySelector('input[type="text"]').value;
            note.date = form.querySelector('input[type="date"]').value;
            const noteType = form.querySelector('input[name="noteType"]:checked').value;
            if (noteType === 'text') {
                note.type = 'text';
                note.content = form.querySelector('textarea').value;
            } else {
                const fileInput = form.querySelector('input[type="file"]');
                if (fileInput.files.length) {
                    note.type = 'document';
                    note.content = fileInput.files[0].name;
                }
            }
            noteEntry.querySelector('h4').textContent = `${note.student} - ${note.course}`;
            noteEntry.querySelector('.note-date').textContent = new Date(note.date).toLocaleDateString();
            noteEntry.querySelector('.note-content').innerHTML = note.type === 'text' ? note.content : `<a href="#">${note.content}</a>`;
            modalSection.classList.remove('active');
            attachNoteContentListeners();
        });
    };

    const attachEditNoteListeners = () => {
        document.querySelectorAll('.edit-note-btn').forEach(btn => {
            btn.addEventListener('click', () => editNoteHandler(btn));
        });
    };
    attachEditNoteListeners();

    // Upload Button
    uploadBtn.addEventListener('click', () => {
        modalSection.innerHTML = `
            <h2>Upload Resource</h2>
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
        });

        const form = modalSection.querySelector('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fileInput = form.querySelector('input[type="file"]');
            if (fileInput.files.length) {
                const file = fileInput.files[0];
                const newResource = { id: classData.resources.length.toString(), name: file.name, date: new Date().toLocaleDateString(), size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` };
                classData.resources.push(newResource);
                const resourcesSection = uploadBtn.parentElement.parentElement;
                const newResourceElement = document.createElement('div');
                newResourceElement.classList.add('resource-entry');
                newResourceElement.setAttribute('data-resource-id', newResource.id);
                newResourceElement.innerHTML = `
                    <div>
                        <h4>${newResource.name}</h4>
                        <div class="note-date">Uploaded ${newResource.date} • ${newResource.size}</div>
                    </div>
                    <button class="btn-secondary share-btn">Share</button>
                `;
                resourcesSection.appendChild(newResourceElement);
                modalSection.classList.remove('active');

                // Reattach event listeners to new share buttons
                document.querySelectorAll('.share-btn').forEach(btn => btn.removeEventListener('click', shareHandler));
                attachShareListeners();
            }
        });
    });

    // Share Buttons
    const shareHandler = (btn) => {
        const resourceEntry = btn.parentElement;
        const resourceId = resourceEntry.getAttribute('data-resource-id');
        const resource = classData.resources.find(r => r.id === resourceId);
        modalSection.innerHTML = `
            <h2>Share Resource</h2>
            <button class="close-btn">Close</button>
            <p><strong>${resource.name}</strong></p>
            <p>Shareable Link: <em>https://skillhub.com/resources/${resource.id}</em></p>
            <p>(In a real app, this link would be functional.)</p>
        `;
        modalSection.classList.add('active');
        scrollToModal();

        document.querySelector('.close-btn').addEventListener('click', () => {
            modalSection.classList.remove('active');
        });
    };

    const attachShareListeners = () => {
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', () => shareHandler(btn));
        });
    };
    attachShareListeners();

    // Logout Button
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            alert('Logging out...');
            // In a real app: window.location.href = 'login.html';
        }
    });

    // Close modal when clicking outside (only add if not already added)
    if (!document.body.dataset.modalListenerAdded) {
        document.addEventListener('click', (e) => {
            if (!modalSection.contains(e.target) && !e.target.classList.contains('send-message-btn') && !e.target.classList.contains('reply-btn') && !e.target.classList.contains('add-note-btn') && !e.target.classList.contains('edit-note-btn') && !e.target.classList.contains('upload-btn') && !e.target.classList.contains('share-btn') && !e.target.classList.contains('logout-btn') && !e.target.closest('.note-content')) {
                modalSection.classList.remove('active');
            }
        });
        document.body.dataset.modalListenerAdded = 'true';
    }

    // Initial attachment of note content listeners
    attachNoteContentListeners();
});