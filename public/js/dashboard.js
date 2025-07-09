// Add this code to: public/js/dashboard.js (for learners)
// Dashboard Profile Update Handler for Learners

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 Initializing learner dashboard profile handlers...');
  
  // Profile picture upload handler
  initializeProfilePictureUpload();
  
  // Profile form update handler
  initializeProfileFormUpdate();
  
  // File input for profile picture (if it doesn't exist)
  createProfilePictureInput();
});

function initializeProfilePictureUpload() {
  // Handle profile picture upload button click
  const uploadBtn = document.getElementById('uploadBtn');
  const profilePicture = document.getElementById('profilePicture');
  const profileImage = document.getElementById('profileImage');
  const profilePlaceholder = document.getElementById('profilePlaceholder');
  const removeBtn = document.getElementById('removeBtn');
  
  if (uploadBtn) {
      uploadBtn.addEventListener('click', () => {
          const fileInput = document.getElementById('fileInput') || createFileInput();
          fileInput.click();
      });
  }
  
  // Handle camera icon clicks on profile pictures
  const cameraIcons = document.querySelectorAll('.upload-btn, .avatar-upload');
  cameraIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
          e.preventDefault();
          const fileInput = document.getElementById('fileInput') || createFileInput();
          fileInput.click();
      });
  });
  
  // Handle remove button
  if (removeBtn) {
      removeBtn.addEventListener('click', async () => {
          await updateProfileImage(null);
          
          // Hide current image and show placeholder
          if (profileImage) {
              profileImage.style.display = 'none';
          }
          if (profilePlaceholder) {
              profilePlaceholder.style.display = 'flex';
          }
          if (removeBtn) {
              removeBtn.style.display = 'none';
          }
      });
  }
}

function createFileInput() {
  let fileInput = document.getElementById('fileInput');
  if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'fileInput';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
  }
  
  fileInput.addEventListener('change', handleFileSelection);
  return fileInput;
}

function createProfilePictureInput() {
  // Check if profile picture section exists but input doesn't
  const profileSection = document.querySelector('.profile-picture-group, .profile-avatar');
  if (profileSection && !document.getElementById('fileInput')) {
      createFileInput();
  }
}

async function handleFileSelection(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file.');
      return;
  }
  
  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
      showError('Image file must be less than 5MB.');
      return;
  }
  
  showSuccess('Uploading profile picture...');
  
  try {
      const reader = new FileReader();
      reader.onload = async (e) => {
          const imageData = e.target.result;
          
          // Update UI immediately
          updateProfileImageUI(imageData);
          
          // Update via API
          await updateProfileImage(imageData);
      };
      reader.readAsDataURL(file);
  } catch (error) {
      console.error('Error processing image:', error);
      showError('Failed to process image. Please try again.');
  }
  
  // Clear the input so the same file can be selected again
  e.target.value = '';
}

function updateProfileImageUI(imageData) {
  const profileImage = document.getElementById('profileImage');
  const profilePlaceholder = document.getElementById('profilePlaceholder');
  const removeBtn = document.getElementById('removeBtn');
  
  if (imageData) {
      // Show image
      if (profileImage) {
          profileImage.src = imageData;
          profileImage.style.display = 'block';
      }
      if (profilePlaceholder) {
          profilePlaceholder.style.display = 'none';
      }
      if (removeBtn) {
          removeBtn.style.display = 'inline-block';
      }
  } else {
      // Show placeholder
      if (profileImage) {
          profileImage.style.display = 'none';
      }
      if (profilePlaceholder) {
          profilePlaceholder.style.display = 'flex';
      }
      if (removeBtn) {
          removeBtn.style.display = 'none';
      }
  }
}

async function updateProfileImage(imageData) {
  try {
      const token = localStorage.getItem('skillhub_token');
      if (!token) {
          showError('Please log in again to update your profile.');
          return;
      }
      
      const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              profileImage: imageData
          })
      });
      
      const result = await response.json();
      
      if (result.success) {
          // Update local storage
          const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || '{}');
          currentUser.profileImage = imageData;
          localStorage.setItem('skillhub_user', JSON.stringify(currentUser));
          
          // Dispatch update event to update navbar
          if (window.dispatchProfileUpdate) {
              window.dispatchProfileUpdate({ profileImage: imageData });
          }
          
          showSuccess('Profile picture updated successfully!');
          console.log('✅ Profile picture updated successfully');
      } else {
          throw new Error(result.message || 'Failed to update profile picture');
      }
  } catch (error) {
      console.error('❌ Error updating profile picture:', error);
      showError('Failed to update profile picture. Please try again.');
  }
}

function initializeProfileFormUpdate() {
  // Handle profile form submissions
  const profileForms = document.querySelectorAll(
      'form[id*="profile"], .settings-form, .profile-form, #settingsForm'
  );
  
  profileForms.forEach(form => {
      form.addEventListener('submit', handleProfileFormSubmit);
  });
  
  // Handle individual input changes for real-time updates
  const profileInputs = document.querySelectorAll(
      'input[name*="Name"], input[name*="name"], input[id*="Name"], input[id*="name"]'
  );
  
  profileInputs.forEach(input => {
      input.addEventListener('blur', handleIndividualFieldUpdate);
  });
}

async function handleProfileFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  
  // Remove empty values
  Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] === null) {
          delete data[key];
      }
  });
  
  console.log('📝 Updating profile with data:', data);
  
  try {
      const token = localStorage.getItem('skillhub_token');
      if (!token) {
          showError('Please log in again to update your profile.');
          return;
      }
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"], .save-btn, .btn-primary');
      const originalText = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Updating...';
      }
      
      const response = await fetch('/api/auth/profile', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
          // Update local storage
          const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || '{}');
          const updatedUser = { ...currentUser, ...result.user };
          localStorage.setItem('skillhub_user', JSON.stringify(updatedUser));
          
          // Dispatch update event to update navbar
          if (window.dispatchProfileUpdate) {
              window.dispatchProfileUpdate(updatedUser);
          }
          
          showSuccess('Profile updated successfully!');
          console.log('✅ Profile updated successfully:', updatedUser);
      } else {
          throw new Error(result.message || 'Failed to update profile');
      }
      
      // Restore button state
      if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
      }
      
  } catch (error) {
      console.error('❌ Profile update error:', error);
      showError('Failed to update profile. Please try again.');
      
      // Restore button state
      const submitBtn = form.querySelector('button[type="submit"], .save-btn, .btn-primary');
      if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || 'Save Changes';
      }
  }
}

async function handleIndividualFieldUpdate(e) {
  const field = e.target;
  const fieldName = field.name || field.id;
  const fieldValue = field.value.trim();
  
  if (!fieldValue || !fieldName) return;
  
  // Only update name fields for real-time navbar updates
  if (fieldName.toLowerCase().includes('name')) {
      const updateData = {};
      updateData[fieldName] = fieldValue;
      
      try {
          const token = localStorage.getItem('skillhub_token');
          if (!token) return;
          
          const response = await fetch('/api/auth/profile', {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updateData)
          });
          
          const result = await response.json();
          
          if (result.success) {
              // Update local storage
              const currentUser = JSON.parse(localStorage.getItem('skillhub_user') || '{}');
              const updatedUser = { ...currentUser, ...result.user };
              localStorage.setItem('skillhub_user', JSON.stringify(updatedUser));
              
              // Dispatch update event to update navbar
              if (window.dispatchProfileUpdate) {
                  window.dispatchProfileUpdate(updatedUser);
              }
              
              console.log('✅ Field updated:', fieldName, fieldValue);
          }
      } catch (error) {
          console.error('❌ Error updating field:', error);
      }
  }
}

function showSuccess(message) {
  // Remove existing success messages
  const existing = document.querySelector('.success-message');
  if (existing) existing.remove();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
      animation: slideInRight 0.3s ease;
  `;
  successDiv.textContent = message;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
      successDiv.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => successDiv.remove(), 300);
  }, 3000);
}

function showError(message) {
  // Remove existing error messages
  const existing = document.querySelector('.error-message-fixed');
  if (existing) existing.remove();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message-fixed';
  errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 500;
      animation: slideInRight 0.3s ease;
  `;
  errorDiv.textContent = message;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
      errorDiv.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => errorDiv.remove(), 300);
  }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
      from {
          opacity: 0;
          transform: translateX(100%);
      }
      to {
          opacity: 1;
          transform: translateX(0);
      }
  }
  
  @keyframes slideOutRight {
      from {
          opacity: 1;
          transform: translateX(0);
      }
      to {
          opacity: 0;
          transform: translateX(100%);
      }
  }
`;
document.head.appendChild(style);

console.log('✅ Dashboard profile handlers loaded successfully');

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const pageContents = document.querySelectorAll(".page-content");
  const logoutBtn = document.querySelector(".logout-btn");

  // Profile picture elements
  const profilePicture = document.getElementById("profilePicture");
  const profileImage = document.getElementById("profileImage");
  const profilePlaceholder = document.getElementById("profilePlaceholder");
  const uploadBtn = document.getElementById("uploadBtn");
  const removeBtn = document.getElementById("removeBtn");
  const fileInput = document.getElementById("fileInput");

  // Navigation functionality
  function showPage(pageId) {
    // Hide all pages
    pageContents.forEach((page) => {
      page.classList.remove("active");
    });

    // Remove active class from all sidebar links
    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Add active class to clicked sidebar link
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  // Sidebar navigation click handlers
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      showPage(pageId);

      // Update URL hash
      window.location.hash = pageId;
    });
  });

  // Handle URL hash on page load
  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      showPage("overview"); // Default to overview page
    }
  }

  // Listen for hash changes
  window.addEventListener("hashchange", handleHashChange);

  // Initialize page based on current hash
  handleHashChange();

  // Profile Picture Upload Functionality
  function setupProfilePictureUpload() {
    // Upload button click handler
    uploadBtn.addEventListener("click", function () {
      fileInput.click();
    });

    // File input change handler
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    });

    // Remove button click handler
    removeBtn.addEventListener("click", function () {
      removeProfilePicture();
    });

    // Drag and drop functionality
    profilePicture.addEventListener("dragover", function (e) {
      e.preventDefault();
      this.classList.add("drag-over");
    });

    profilePicture.addEventListener("dragleave", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");
    });

    profilePicture.addEventListener("drop", function (e) {
      e.preventDefault();
      this.classList.remove("drag-over");

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          handleFileUpload(file);
        } else {
          showNotification("Please upload an image file.", "error");
        }
      }
    });
  }

  // Handle file upload
  function handleFileUpload(file) {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showNotification("File size should be less than 5MB.", "error");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("Please upload an image file.", "error");
      return;
    }

    // Read and display the file
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Update profile image
      profileImage.src = imageUrl;
      profileImage.style.display = "block";
      profilePlaceholder.style.display = "none";

      // Show remove button
      removeBtn.style.display = "flex";

      // Show success message
      showNotification("Profile picture updated successfully!", "success");

      // Store image in localStorage for persistence (in a real app, this would be uploaded to a server)
      localStorage.setItem("profileImage", imageUrl);
    };

    reader.onerror = function () {
      showNotification("Error reading file. Please try again.", "error");
    };

    reader.readAsDataURL(file);
  }

  // Remove profile picture
  function removeProfilePicture() {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      profileImage.style.display = "none";
      profilePlaceholder.style.display = "flex";
      removeBtn.style.display = "none";

      // Clear stored image
      localStorage.removeItem("profileImage");

      showNotification("Profile picture removed.", "success");
    }
  }

  // Load stored profile picture on page load
  function loadStoredProfilePicture() {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) {
      profileImage.src = storedImage;
      profileImage.style.display = "block";
      profilePlaceholder.style.display = "none";
      removeBtn.style.display = "flex";
    }
  }

  // Show notification
  function showNotification(message, type = "success") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".upload-success");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `upload-success ${type}`;
    notification.textContent = message;

    // Style for error messages
    if (type === "error") {
      notification.style.background = "#dc3545";
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Initialize profile picture functionality
  setupProfilePictureUpload();
  loadStoredProfilePicture();

  // Logout functionality
  logoutBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to log out?")) {
      // Clear stored data
      localStorage.removeItem("profileImage");
      alert("Logged out successfully!");
      // In real app, redirect to login page
      // window.location.href = 'login.html';
    }
  });

  // My Groups functionality
  const viewBtns = document.querySelectorAll(".btn-secondary");
  viewBtns.forEach((btn) => {
    if (btn.textContent === "View") {
      btn.addEventListener("click", function () {
        const groupItem = this.closest(".group-item");
        if (groupItem) {
          const groupName = groupItem.querySelector("h3").textContent;
          alert(`Viewing ${groupName} details...`);
        }
      });
    }
  });

  // Join group functionality
  const joinBtns = document.querySelectorAll(".btn-primary");
  joinBtns.forEach((btn) => {
    if (btn.textContent === "Join") {
      btn.addEventListener("click", function () {
        const groupItem = this.closest(".group-item");
        if (groupItem) {
          const groupName = groupItem.querySelector("h3").textContent;
          if (confirm(`Do you want to join ${groupName}?`)) {
            this.textContent = "Joined";
            this.style.background = "#28a745";
            this.disabled = true;
            alert(`Successfully joined ${groupName}!`);
          }
        }
      });
    }
  });

  // Create group functionality
  const createGroupBtn = document.querySelector(".btn-primary");
  if (createGroupBtn && createGroupBtn.textContent === "Create Group") {
    createGroupBtn.addEventListener("click", function () {
      const groupName = prompt("Enter group name:");
      if (groupName && groupName.trim()) {
        alert(`Creating group: ${groupName.trim()}`);
        // In real app, this would create a new group
      }
    });
  }

  // Session management functionality
  const rescheduleBtns = document.querySelectorAll(".btn-outline");
  rescheduleBtns.forEach((btn) => {
    if (btn.textContent === "Reschedule") {
      btn.addEventListener("click", function () {
        const sessionItem = this.closest(".session-item");
        if (sessionItem) {
          const sessionName = sessionItem.querySelector("h3").textContent;
          const newDate = prompt(
            `Reschedule ${sessionName}\nEnter new date and time:`
          );
          if (newDate && newDate.trim()) {
            alert(`${sessionName} rescheduled to: ${newDate.trim()}`);
            // Update the session details
            const detailsElement =
              sessionItem.querySelector(".session-details");
            if (detailsElement) {
              detailsElement.textContent = newDate.trim();
            }
          }
        }
      });
    }

    if (btn.textContent === "Cancel") {
      btn.addEventListener("click", function () {
        const sessionItem = this.closest(".session-item");
        if (sessionItem) {
          const sessionName = sessionItem.querySelector("h3").textContent;
          if (confirm(`Are you sure you want to cancel ${sessionName}?`)) {
            sessionItem.style.opacity = "0.5";
            sessionItem.style.textDecoration = "line-through";
            this.textContent = "Cancelled";
            this.disabled = true;
            alert(`${sessionName} has been cancelled.`);
          }
        }
      });
    }
  });

  // Explore wishlist functionality
  const exploreBtns = document.querySelectorAll(".btn-primary");
  exploreBtns.forEach((btn) => {
    if (btn.textContent === "Explore") {
      btn.addEventListener("click", function () {
        const courseItem = this.closest(".course-item");
        if (courseItem) {
          const courseName = courseItem.querySelector("h3").textContent;
          alert(`Exploring ${courseName}...`);
        }
      });
    }
  });

  // Profile editing functionality
  const editBtns = document.querySelectorAll(".btn-primary");
  editBtns.forEach((btn) => {
    if (btn.textContent === "Edit") {
      btn.addEventListener("click", function () {
        const section = this.closest(".content-section");
        const formGroups = section.querySelectorAll(
          ".form-group:not(.profile-picture-group)"
        );

        formGroups.forEach((group) => {
          const valueDiv = group.querySelector(".form-value");
          if (valueDiv) {
            const currentValue = valueDiv.textContent;
            const input = document.createElement("input");
            input.type = "text";
            input.value = currentValue;
            input.className = "form-input";
            input.style.padding = "8px";
            input.style.border = "1px solid #ddd";
            input.style.borderRadius = "4px";
            input.style.fontSize = "1rem";
            valueDiv.replaceWith(input);
          }
        });

        this.textContent = "Save";
        this.onclick = function () {
          // Save the edited values
          const inputs = section.querySelectorAll(".form-input");
          inputs.forEach((input) => {
            const valueDiv = document.createElement("div");
            valueDiv.className = "form-value";
            valueDiv.textContent = input.value;
            input.replaceWith(valueDiv);
          });

          this.textContent = "Edit";
          this.onclick = null;
          showNotification("Profile information updated successfully!");
        };
      });
    }

    if (btn.textContent === "Update") {
      btn.addEventListener("click", function () {
        showNotification("Learning preferences updated successfully!");
      });
    }
  });

  // Manage button functionality
  const manageBtns = document.querySelectorAll(".manage-btn");
  manageBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("Opening session management...");
    });
  });

  // Add hover effects to interactive elements
  document.querySelectorAll("button, .sidebar-link").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-1px)";
    });

    element.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Add scroll effect to header
  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (header) {
      if (window.scrollY > 50) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 2px 25px rgba(0, 0, 0, 0.15)";
      } else {
        header.style.background = "white";
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
      }
    }
  });

  

  // Progress bar animation for courses
  function animateProgressBars() {
    const progressTexts = document.querySelectorAll(".course-progress");
    progressTexts.forEach((text) => {
      if (text.textContent.includes("Progress: ")) {
        const progressMatch = text.textContent.match(/Progress: (\d+)%/);
        if (progressMatch) {
          const percentage = parseInt(progressMatch[1]);

          // Create visual progress bar
          const progressBar = document.createElement("div");
          progressBar.style.width = "100%";
          progressBar.style.height = "6px";
          progressBar.style.background = "#e9ecef";
          progressBar.style.borderRadius = "3px";
          progressBar.style.marginTop = "8px";
          progressBar.style.overflow = "hidden";

          const progressFill = document.createElement("div");
          progressFill.style.width = "0%";
          progressFill.style.height = "100%";
          progressFill.style.background = "#4CAF50";
          progressFill.style.borderRadius = "3px";
          progressFill.style.transition = "width 1s ease";

          progressBar.appendChild(progressFill);
          text.parentNode.appendChild(progressBar);

          // Animate progress fill
          setTimeout(() => {
            progressFill.style.width = percentage + "%";
          }, 500);
        }
      }
    });
  }

  // Initialize progress bars
  setTimeout(animateProgressBars, 1000);

  // Add animation to content sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe content sections for animation
  document.querySelectorAll(".content-section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Initialize page
  console.log("SkillHub Student Dashboard Loaded Successfully!");
  console.log("Profile picture upload functionality initialized!");
});
