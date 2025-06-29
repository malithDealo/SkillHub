// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const pageContents = document.querySelectorAll(".page-content");
  const logoutBtn = document.querySelector(".logout-btn");

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

  // Logout functionality
  logoutBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to log out?")) {
      // Simulate logout
      alert("Logged out successfully!");
      // In real app, redirect to login page
      // window.location.href = 'login.html';
    }
  });

  // My Groups functionality
  const viewBtns = document.querySelectorAll(".view-btn");
  viewBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const groupItem = this.closest(".group-item");
      const groupName = groupItem.querySelector("h3").textContent;
      alert(`Viewing ${groupName} details...`);
    });
  });

  // Join group functionality
  const joinBtns = document.querySelectorAll(".join-btn");
  joinBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const groupItem = this.closest(".group-item");
      const groupName = groupItem.querySelector("h3").textContent;

      if (confirm(`Do you want to join ${groupName}?`)) {
        this.textContent = "Joined";
        this.style.background = "#28a745";
        this.disabled = true;
        alert(`Successfully joined ${groupName}!`);
      }
    });
  });

  // Create group functionality
  const createGroupBtn = document.querySelector(".create-group-btn");
  if (createGroupBtn) {
    createGroupBtn.addEventListener("click", function () {
      const groupName = prompt("Enter group name:");
      if (groupName && groupName.trim()) {
        alert(`Creating group: ${groupName.trim()}`);
        // In real app, this would create a new group
      }
    });
  }

  // Session management functionality
  const rescheduleBtns = document.querySelectorAll(".reschedule-btn");
  const cancelBtns = document.querySelectorAll(".cancel-btn");

  rescheduleBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const sessionItem = this.closest(".session-item");
      const sessionName = sessionItem.querySelector("h3").textContent;

      const newDate = prompt(
        `Reschedule ${sessionName}\nEnter new date and time:`
      );
      if (newDate && newDate.trim()) {
        alert(`${sessionName} rescheduled to: ${newDate.trim()}`);
        // Update the session details
        const detailsElement = sessionItem.querySelector(".session-details");
        detailsElement.textContent = newDate.trim();
      }
    });
  });

  cancelBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const sessionItem = this.closest(".session-item");
      const sessionName = sessionItem.querySelector("h3").textContent;

      if (confirm(`Are you sure you want to cancel ${sessionName}?`)) {
        sessionItem.style.opacity = "0.5";
        sessionItem.style.textDecoration = "line-through";
        this.textContent = "Cancelled";
        this.disabled = true;
        alert(`${sessionName} has been cancelled.`);
      }
    });
  });

  // Explore wishlist functionality
  const exploreBtns = document.querySelectorAll(".explore-btn");
  exploreBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const wishlistItem = this.closest(".wishlist-item");
      const courseName = wishlistItem.querySelector("h3").textContent;
      alert(`Exploring ${courseName}...`);
    });
  });

  // Profile editing functionality
  const editBtn = document.querySelector(".edit-btn");
  const updateBtn = document.querySelector(".update-btn");

  if (editBtn) {
    editBtn.addEventListener("click", function () {
      const formGroups = document.querySelectorAll(
        "#profile-setting .form-group"
      );
      formGroups.forEach((group) => {
        const valueDiv = group.querySelector(".form-value");
        const currentValue = valueDiv.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.value = currentValue;
        input.className = "form-input";
        valueDiv.replaceWith(input);
      });

      this.textContent = "Save";
      this.onclick = function () {
        // Save the edited values
        const inputs = document.querySelectorAll(
          "#profile-setting .form-input"
        );
        inputs.forEach((input) => {
          const valueDiv = document.createElement("div");
          valueDiv.className = "form-value";
          valueDiv.textContent = input.value;
          input.replaceWith(valueDiv);
        });

        this.textContent = "Edit";
        this.onclick = null;
        alert("Profile information updated successfully!");
      };
    });
  }

  if (updateBtn) {
    updateBtn.addEventListener("click", function () {
      alert("Learning preferences updated successfully!");
    });
  }

  // Booking functionality
  const bookSessionBtn = document.querySelector(".book-session-btn");
  if (bookSessionBtn) {
    bookSessionBtn.addEventListener("click", function () {
      const course = document.querySelector("#booking .form-select").value;
      const date = document.querySelector('#booking input[type="date"]').value;
      const time = document.querySelector('#booking input[type="time"]').value;

      if (course && date && time) {
        alert(
          `Session booked!\nCourse: ${course}\nDate: ${date}\nTime: ${time}`
        );

        // Clear form
        document.querySelector("#booking .form-select").value = "";
        document.querySelector('#booking input[type="date"]').value = "";
        document.querySelector('#booking input[type="time"]').value = "";
      } else {
        alert("Please fill in all fields to book a session.");
      }
    });
  }

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter");
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector(".email-input");
    const subscribeBtn = newsletterForm.querySelector(".btn");

    subscribeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email && isValidEmail(email)) {
        alert("Thank you for subscribing to our newsletter!");
        emailInput.value = "";
      } else {
        alert("Please enter a valid email address.");
      }
    });
  }

  // Email validation helper function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add scroll effect to navbar
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 25px rgba(0, 0, 0, 0.15)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    }
  });

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

  // Mobile menu toggle (for responsive design)
  function createMobileMenu() {
    const navContainer = document.querySelector(".nav-container");
    const mobileMenuBtn = document.createElement("button");
    mobileMenuBtn.className = "mobile-menu-btn";
    mobileMenuBtn.innerHTML = "☰";
    mobileMenuBtn.style.display = "none";
    mobileMenuBtn.style.background = "none";
    mobileMenuBtn.style.border = "none";
    mobileMenuBtn.style.fontSize = "1.5rem";
    mobileMenuBtn.style.cursor = "pointer";

    navContainer.appendChild(mobileMenuBtn);

    mobileMenuBtn.addEventListener("click", function () {
      const navMenu = document.querySelector(".nav-menu");
      navMenu.style.display =
        navMenu.style.display === "none" ? "flex" : "none";
    });
  }

  createMobileMenu();

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

  // Add hover effects to interactive elements
  document.querySelectorAll("button, .sidebar-link").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-1px)";
    });

    element.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Initialize page
  console.log("SkillHub Student Dashboard Loaded Successfully!");

  // Set default date for booking form
  const dateInput = document.querySelector('#booking input[type="date"]');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split("T")[0];
  }
});
