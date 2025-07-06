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
