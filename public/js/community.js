// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Animated counter for community stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    const speed = 50; // Animation speed (lower = faster)

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      let count = 0;
      const increment = target / speed;

      const updateCounter = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCounter, 30); // Update every 30ms for smooth animation
        } else {
          counter.innerText = target; // Ensure we end at exact target
        }
      };

      // Reset counter to 0 before starting animation
      counter.innerText = "0";
      updateCounter();
    });
  }

  // Intersection Observer for stats animation
  const statsSection = document.querySelector(".community-stats-section");
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsAnimated) {
          // Add a small delay for better visual effect
          setTimeout(() => {
            animateCounters();
          }, 200);
          statsAnimated = true;
        }
      });
    },
    {
      threshold: 0.3, // Trigger when 30% of the section is visible
    }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Event card interactions
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card) => {
    card.addEventListener("click", function () {
      const eventTitle = this.querySelector("h3").textContent;
      const eventDate = this.querySelector(".date-badge").textContent;
      console.log("Selected event:", eventTitle, "on", eventDate);

      // Here you would navigate to event details page
      // window.location.href = `event-details.html?event=${encodeURIComponent(eventTitle)}`;

      // For now, show an alert
      alert(
        `You clicked on: ${eventTitle}\nDate: ${eventDate}\n\nEvent details page would open here.`
      );
    });

    // Add hover effect
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-5px)";
    });
  });

  // Discussion item interactions
  const discussionItems = document.querySelectorAll(".discussion-item");
  discussionItems.forEach((item) => {
    item.addEventListener("click", function () {
      const discussionTitle = this.querySelector("h4").textContent;
      const author = this.querySelector(".author").textContent;
      console.log("Selected discussion:", discussionTitle, "by", author);

      // Navigate to discussion thread page
      window.location.href = `../discussion-thread/discussion.html?topic=${encodeURIComponent(
        discussionTitle
      )}&author=${encodeURIComponent(author)}`;
    });

    // Add hover effect
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // Add Event button functionality
  const addEventBtn = document.querySelector(".add-event-btn");
  addEventBtn.addEventListener("click", function () {
    console.log("Add Event clicked");
    // Here you would open a modal or navigate to add event page
    const eventModal = document.getElementById("eventModal");
    if (eventModal) {
      eventModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Set minimum date to today
      const today = new Date().toISOString().split("T")[0];
      const dateInput = document.getElementById("eventDate");
      if (dateInput) {
        dateInput.min = today;
      }
    } else {
      // Fallback if modal not found
      alert(
        "Event creation form would open here.\n\nPlease make sure the event modal HTML is included in the page."
      );
    }
  });

  // Add Question button functionality
  const addQuestionBtn = document.querySelector(".add-question-btn");
  addQuestionBtn.addEventListener("click", function () {
    console.log("Add Question clicked");
    // Here you would open a modal or navigate to add question page
    const discussionModal = document.getElementById("discussionModal");
    if (discussionModal) {
      discussionModal.classList.add("active");
      document.body.style.overflow = "hidden";

      // Focus on the title input
      const titleInput = document.getElementById("questionTitle");
      if (titleInput) {
        setTimeout(() => titleInput.focus(), 100);
      }
    } else {
      // Fallback if modal not found
      alert(
        "Discussion creation form would open here.\n\nPlease make sure the discussion modal HTML is included in the page."
      );
    }
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Add scroll effect to navbar
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)";
      navbar.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)";
      navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    }
  });

  // Animate event cards on scroll
  const eventCardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  eventCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    eventCardObserver.observe(card);
  });

  // Animate discussion items on scroll
  const discussionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  discussionItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateX(-30px)";
    item.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    discussionObserver.observe(item);
  });

  // Button hover effects
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter");
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector(".email-input");
    const subscribeBtn = newsletterForm.querySelector(".btn");

    subscribeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email && isValidEmail(email)) {
        // Simulate subscription
        this.textContent = "Subscribed!";
        this.style.background = "#45a049";
        emailInput.value = "";

        setTimeout(() => {
          this.textContent = "Subscribe";
          this.style.background = "#4CAF50";
        }, 2000);
      } else {
        emailInput.style.border = "2px solid #f44336";
        setTimeout(() => {
          emailInput.style.border = "1px solid #555";
        }, 2000);
      }
    });
  }

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Add loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });

  // Parallax effect for hero circles
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const heroCircles = document.querySelectorAll(".hero-circle");

    heroCircles.forEach((circle, index) => {
      const speed = 0.05 + index * 0.02;
      const yPos = scrolled * speed;
      circle.style.transform = `translateY(${yPos}px)`;
    });
  });

  // Add dynamic content updates (simulate real-time updates)
  function updateCommunityStats() {
    const learners = document.querySelector('[data-target="1234"]');
    const teachers = document.querySelector('[data-target="567"]');
    const skills = document.querySelector('[data-target="472"]');
    const events = document.querySelector('[data-target="30"]');

    // Simulate small increases
    if (Math.random() > 0.7) {
      // 30% chance to update
      const currentLearners = parseInt(learners.textContent);
      learners.textContent = currentLearners + Math.floor(Math.random() * 3);
    }
  }

  // Update stats occasionally (every 30 seconds)
  setInterval(updateCommunityStats, 30000);

  // Add search/filter functionality for discussions
  function addDiscussionFilters() {
    const filterContainer = document.createElement("div");
    filterContainer.className = "discussion-filters";
    filterContainer.innerHTML = `
            <input type="text" placeholder="Search discussions..." class="discussion-search">
            <select class="discussion-sort">
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="unanswered">Unanswered</option>
            </select>
        `;

    const discussionsHeader = document.querySelector(
      ".discussions-section .section-header"
    );
    discussionsHeader.appendChild(filterContainer);

    // Add search functionality
    const searchInput = filterContainer.querySelector(".discussion-search");
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      discussionItems.forEach((item) => {
        const title = item.querySelector("h4").textContent.toLowerCase();
        const content = item.querySelector("p").textContent.toLowerCase();

        if (title.includes(query) || content.includes(query)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  }

  // Initialize discussion filters
  // addDiscussionFilters(); // Uncomment to enable

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-navigation");
  });

  // Add accessibility improvements
  const focusableElements = document.querySelectorAll(
    "button, a, input, [tabindex]"
  );
  focusableElements.forEach((element) => {
    element.addEventListener("focus", function () {
      this.style.outline = "2px solid #4CAF50";
      this.style.outlineOffset = "2px";
    });

    element.addEventListener("blur", function () {
      this.style.outline = "none";
    });
  });

  // Handle window resize for responsive adjustments
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Recalculate layouts if needed
      console.log("Window resized, adjusting layouts...");
    }, 250);
  });

  // Add smooth transitions for all interactive elements
  const interactiveElements = document.querySelectorAll(
    "button, a, .event-card, .discussion-item"
  );
  interactiveElements.forEach((element) => {
    element.style.transition = "all 0.3s ease";
  });

  // Console log for developers
  console.log("🎓 SkillHub Community Page - Connect and Grow Together! 🚀");
  console.log("✅ All Community page features initialized successfully!");
});

// Add this to community-script.js or create a separate file

// Event Creation Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const modal = document.getElementById("eventModal");
  const addEventBtn = document.querySelector(".add-event-btn");
  const closeModalBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelEvent");
  const postBtn = document.getElementById("postEvent");
  const eventForm = document.getElementById("eventForm");

  // Event type selection
  const eventTypeOptions = document.querySelectorAll(".event-type-option");
  const eventTypeInput = document.getElementById("eventType");

  // Skill level selection
  const skillLevelOptions = document.querySelectorAll(".skill-option");
  const skillLevelInput = document.getElementById("skillLevel");

  // Cost input handling
  const currencySelect = document.getElementById("currency");
  const customCostInput = document.getElementById("customCost");

  // Tags functionality
  const tagsInput = document.getElementById("eventTags");
  const tagsContainer = document.getElementById("tagsContainer");
  let selectedTags = [];

  // Open modal
  addEventBtn.addEventListener("click", function () {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("eventDate").min = today;
  });

  // Close modal function
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    resetForm();
  }

  // Close modal events
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Event type selection
  eventTypeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      eventTypeOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Set hidden input value
      eventTypeInput.value = this.dataset.type;

      // Update form validation
      validateForm();
    });
  });

  // Skill level selection
  skillLevelOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      skillLevelOptions.forEach((opt) => opt.classList.remove("selected"));

      // Add selected class to clicked option
      this.classList.add("selected");

      // Set hidden input value
      skillLevelInput.value = this.dataset.level;
    });
  });

  // Cost input handling
  currencySelect.addEventListener("change", function () {
    if (this.value === "custom") {
      customCostInput.style.display = "block";
      customCostInput.required = true;
    } else {
      customCostInput.style.display = "none";
      customCostInput.required = false;
      customCostInput.value = "";
    }
  });

  // Tags functionality
  tagsInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(this.value.trim());
      this.value = "";
    }
  });

  function addTag(tagText) {
    if (
      tagText &&
      !selectedTags.includes(tagText) &&
      selectedTags.length < 10
    ) {
      selectedTags.push(tagText);
      renderTags();
    }
  }

  function removeTag(tagText) {
    selectedTags = selectedTags.filter((tag) => tag !== tagText);
    renderTags();
  }

  function renderTags() {
    tagsContainer.innerHTML = "";
    selectedTags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag-item";
      tagElement.innerHTML = `
                ${tag}
                <button type="button" class="tag-remove" onclick="removeTag('${tag}')">×</button>
            `;
      tagsContainer.appendChild(tagElement);
    });
  }

  // Make removeTag globally accessible
  window.removeTag = removeTag;

  // Form validation
  function validateForm() {
    const requiredFields = eventForm.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
      }
    });

    // Check if event type is selected
    if (!eventTypeInput.value) {
      isValid = false;
    }

    postBtn.disabled = !isValid;
    postBtn.style.opacity = isValid ? "1" : "0.6";
  }

  // Add validation listeners to required fields
  const requiredInputs = eventForm.querySelectorAll("[required]");
  requiredInputs.forEach((input) => {
    input.addEventListener("input", validateForm);
    input.addEventListener("change", validateForm);
  });

  // Form submission
  eventForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (postBtn.disabled) return;

    // Collect form data
    const formData = new FormData(eventForm);
    const eventData = {};

    // Get regular form fields
    for (let [key, value] of formData.entries()) {
      eventData[key] = value;
    }

    // Add selected event type and skill level
    eventData.eventType = eventTypeInput.value;
    eventData.skillLevel = skillLevelInput.value;

    // Add tags
    eventData.tags = selectedTags;

    // Add cost (handle custom cost)
    if (currencySelect.value === "custom") {
      eventData.cost = customCostInput.value;
    } else {
      eventData.cost = currencySelect.value;
    }

    // Get checkbox values
    const checkboxes = eventForm.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      eventData[checkbox.name] = checkbox.checked;
    });

    console.log("Event Data:", eventData);

    // Show loading state
    postBtn.textContent = "Creating Event...";
    postBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Create new event card
      createEventCard(eventData);

      // Show success message
      showSuccessMessage("Event created successfully!");

      // Close modal
      closeModal();

      // Reset button
      postBtn.textContent = "Post Event";
      postBtn.disabled = false;
    }, 1500);
  });

  // Create event card and add to events grid
  function createEventCard(eventData) {
    const eventsGrid = document.querySelector(".events-grid");

    const eventCard = document.createElement("div");
    eventCard.className = "event-card";
    eventCard.style.animation = "fadeIn 0.5s ease-out";

    // Format date
    const eventDate = new Date(eventData.eventDate);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Determine cost display
    let costDisplay = eventData.cost === "0" ? "Free" : `Rs. ${eventData.cost}`;

    eventCard.innerHTML = `
            <div class="event-date">
                <span class="date-badge">${formattedDate}</span>
            </div>
            <div class="event-content">
                <h3>${eventData.eventTitle}</h3>
                <p>${eventData.eventDescription}</p>
                <div class="event-meta">
                    <span class="event-location">📍 ${eventData.eventLocation}</span>
                    <span class="event-attendees">👥 0/${eventData.maxParticipants} participants</span>
                </div>
                <div class="event-cost">💰 ${costDisplay}</div>
            </div>
        `;

    // Add click handler
    eventCard.addEventListener("click", function () {
      alert(
        `Event: ${eventData.eventTitle}\nDate: ${formattedDate}\nLocation: ${eventData.eventLocation}`
      );
    });

    // Add hover effects
    eventCard.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    eventCard.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });

    // Insert at the beginning of events grid
    eventsGrid.insertBefore(eventCard, eventsGrid.firstChild);
  }

  // Show success message
  function showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1001;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => successDiv.remove(), 300);
    }, 3000);
  }

  // Reset form
  function resetForm() {
    eventForm.reset();

    // Reset event type selection
    eventTypeOptions.forEach((opt) => opt.classList.remove("selected"));
    eventTypeInput.value = "";

    // Reset skill level selection
    skillLevelOptions.forEach((opt) => opt.classList.remove("selected"));
    skillLevelInput.value = "all";
    document.querySelector('[data-level="all"]').classList.add("selected");

    // Reset custom cost input
    customCostInput.style.display = "none";
    customCostInput.required = false;

    // Reset tags
    selectedTags = [];
    renderTags();

    // Reset form validation
    validateForm();
  }

  // Auto-resize textarea
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    textarea.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 150) + "px";
    });
  });

  // Character counter for description
  const descriptionTextarea = document.getElementById("eventDescription");
  const counterDiv = document.createElement("div");
  counterDiv.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: #666;
        margin-top: 0.5rem;
    `;
  descriptionTextarea.parentNode.appendChild(counterDiv);

  descriptionTextarea.addEventListener("input", function () {
    const length = this.value.length;
    const maxLength = 500;
    counterDiv.textContent = `${length}/${maxLength} characters`;

    if (length > maxLength) {
      counterDiv.style.color = "#ff6b6b";
      this.style.borderColor = "#ff6b6b";
    } else {
      counterDiv.style.color = "#666";
      this.style.borderColor = "#e9ecef";
    }
  });

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (modal.classList.contains("active")) {
      // Ctrl/Cmd + Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!postBtn.disabled) {
          eventForm.dispatchEvent(new Event("submit"));
        }
      }
    }
  });

  // Add input validation helpers
  function addInputValidation() {
    // Email validation
    const emailInput = document.getElementById("contactEmail");
    emailInput.addEventListener("blur", function () {
      const email = this.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email && !emailRegex.test(email)) {
        this.style.borderColor = "#ff6b6b";
        this.setCustomValidity("Please enter a valid email address");
      } else {
        this.style.borderColor = "#e9ecef";
        this.setCustomValidity("");
      }
    });

    // Phone number validation
    const phoneInput = document.getElementById("contactNumber");
    phoneInput.addEventListener("input", function () {
      // Remove non-numeric characters except +, -, space, ()
      this.value = this.value.replace(/[^\d+\-\s()]/g, "");
    });

    // Max participants validation
    const maxParticipantsInput = document.getElementById("maxParticipants");
    maxParticipantsInput.addEventListener("input", function () {
      const value = parseInt(this.value);
      if (value > 100) {
        this.value = 100;
      } else if (value < 1) {
        this.value = 1;
      }
    });
  }

  // Add animations CSS
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .event-cost {
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #4CAF50;
            font-weight: 600;
        }
        
        .modal-container::-webkit-scrollbar {
            width: 8px;
        }
        
        .modal-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }
        
        .modal-container::-webkit-scrollbar-thumb {
            background: #4CAF50;
            border-radius: 4px;
        }
        
        .modal-container::-webkit-scrollbar-thumb:hover {
            background: #45a049;
        }
    `;
  document.head.appendChild(style);

  // Initialize form
  validateForm();
  addInputValidation();

  // Set default skill level
  if (document.querySelector('[data-level="all"]')) {
    document.querySelector('[data-level="all"]').classList.add("selected");
  }

  console.log("✅ Event creation modal initialized successfully!");
});

// Add this to community-script.js or create a separate file

// Discussion Creation Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Modal elements
  const discussionModal = document.getElementById("discussionModal");
  const addQuestionBtn = document.querySelector(".add-question-btn");
  const closeDiscussionModalBtn = document.getElementById(
    "closeDiscussionModal"
  );
  const cancelDiscussionBtn = document.getElementById("cancelDiscussion");
  const postQuestionBtn = document.getElementById("postQuestion");
  const discussionForm = document.getElementById("discussionForm");

  // Form elements
  const questionTitle = document.getElementById("questionTitle");
  const questionCategory = document.getElementById("questionCategory");
  const questionDescription = document.getElementById("questionDescription");
  const questionTags = document.getElementById("questionTags");
  const questionTagsContainer = document.getElementById(
    "questionTagsContainer"
  );
  const notifyReplies = document.getElementById("notifyReplies");
  const agreeGuidelines = document.getElementById("agreeGuidelines");

  // Tags functionality
  let selectedQuestionTags = [];

  // Open discussion modal
  addQuestionBtn.addEventListener("click", function () {
    discussionModal.classList.add("active");
    document.body.style.overflow = "hidden";
    questionTitle.focus();
  });

  // Close modal function
  function closeDiscussionModal() {
    discussionModal.classList.remove("active");
    document.body.style.overflow = "auto";
    resetDiscussionForm();
  }

  // Close modal events
  closeDiscussionModalBtn.addEventListener("click", closeDiscussionModal);
  cancelDiscussionBtn.addEventListener("click", closeDiscussionModal);

  // Close modal when clicking outside
  discussionModal.addEventListener("click", function (e) {
    if (e.target === discussionModal) {
      closeDiscussionModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && discussionModal.classList.contains("active")) {
      closeDiscussionModal();
    }
  });

  // Tags functionality
  questionTags.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addQuestionTag(this.value.trim());
      this.value = "";
    }
  });

  function addQuestionTag(tagText) {
    if (
      tagText &&
      !selectedQuestionTags.includes(tagText) &&
      selectedQuestionTags.length < 8
    ) {
      selectedQuestionTags.push(tagText);
      renderQuestionTags();
    }
  }

  function removeQuestionTag(tagText) {
    selectedQuestionTags = selectedQuestionTags.filter(
      (tag) => tag !== tagText
    );
    renderQuestionTags();
  }

  function renderQuestionTags() {
    questionTagsContainer.innerHTML = "";
    selectedQuestionTags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag-item";
      tagElement.innerHTML = `
                ${tag}
                <button type="button" class="tag-remove" onclick="removeQuestionTag('${tag}')">×</button>
            `;
      questionTagsContainer.appendChild(tagElement);
    });
  }

  // Make removeQuestionTag globally accessible
  window.removeQuestionTag = removeQuestionTag;

  // Character counter for description
  const descriptionCounter = document.createElement("div");
  descriptionCounter.className = "character-counter";
  questionDescription.parentNode.appendChild(descriptionCounter);

  questionDescription.addEventListener("input", function () {
    const length = this.value.length;
    const maxLength = 1000;
    const remaining = maxLength - length;

    descriptionCounter.textContent = `${length}/${maxLength} characters`;

    if (remaining < 50) {
      descriptionCounter.className = "character-counter error";
      this.style.borderColor = "#f44336";
    } else if (remaining < 100) {
      descriptionCounter.className = "character-counter warning";
      this.style.borderColor = "#ff9800";
    } else {
      descriptionCounter.className = "character-counter";
      this.style.borderColor = "#e9ecef";
    }

    // Prevent typing beyond limit
    if (length > maxLength) {
      this.value = this.value.substring(0, maxLength);
    }

    validateDiscussionForm();
  });

  // Auto-resize textarea
  questionDescription.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 200) + "px";
  });

  // Form validation
  function validateDiscussionForm() {
    const title = questionTitle.value.trim();
    const category = questionCategory.value;
    const description = questionDescription.value.trim();
    const guidelines = agreeGuidelines.checked;

    let isValid = true;

    // Validate title (minimum 10 characters)
    if (title.length < 10) {
      isValid = false;
      questionTitle.classList.add("invalid");
    } else {
      questionTitle.classList.remove("invalid");
      questionTitle.classList.add("valid");
    }

    // Validate category
    if (!category) {
      isValid = false;
      questionCategory.classList.add("invalid");
    } else {
      questionCategory.classList.remove("invalid");
      questionCategory.classList.add("valid");
    }

    // Validate description (minimum 20 characters)
    if (description.length < 20) {
      isValid = false;
      questionDescription.classList.add("invalid");
    } else {
      questionDescription.classList.remove("invalid");
      questionDescription.classList.add("valid");
    }

    // Validate guidelines agreement
    if (!guidelines) {
      isValid = false;
    }

    postQuestionBtn.disabled = !isValid;
    postQuestionBtn.style.opacity = isValid ? "1" : "0.6";
  }

  // Add validation listeners
  questionTitle.addEventListener("input", validateDiscussionForm);
  questionCategory.addEventListener("change", validateDiscussionForm);
  questionDescription.addEventListener("input", validateDiscussionForm);
  agreeGuidelines.addEventListener("change", validateDiscussionForm);

  // Form submission
  discussionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (postQuestionBtn.disabled) return;

    // Collect form data
    const discussionData = {
      title: questionTitle.value.trim(),
      category: questionCategory.value,
      description: questionDescription.value.trim(),
      tags: selectedQuestionTags,
      notifyReplies: notifyReplies.checked,
      agreeGuidelines: agreeGuidelines.checked,
      timestamp: new Date(),
    };

    console.log("Discussion Data:", discussionData);

    // Show loading state
    const originalText = postQuestionBtn.textContent;
    postQuestionBtn.innerHTML = `
            <span class="loading-text">
                <span class="loading-spinner"></span>
                Posting Question...
            </span>
        `;
    postQuestionBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Create new discussion item
      createDiscussionItem(discussionData);

      // Show success message
      showDiscussionSuccessMessage("Question posted successfully!");

      // Close modal
      closeDiscussionModal();

      // Reset button
      postQuestionBtn.textContent = originalText;
      postQuestionBtn.disabled = false;
    }, 1500);
  });

  // Create discussion item and add to discussions list
  function createDiscussionItem(discussionData) {
    const discussionsList = document.querySelector(".discussions-list");

    const discussionItem = document.createElement("div");
    discussionItem.className = "discussion-item";
    discussionItem.style.animation = "fadeIn 0.5s ease-out";

    // Format timestamp
    const timeAgo = "Just now";

    // Get category display name
    const categoryMap = {
      "arts-crafts": "Arts & Crafts",
      "music-performance": "Music & Performance",
      languages: "Languages",
      technology: "Technology",
      "cooking-culinary": "Cooking & Culinary",
      "home-garden": "Home & Garden",
      "health-wellness": "Health & Wellness",
      "professional-skills": "Professional Skills",
      "traditional-crafts": "Traditional Crafts",
      general: "General",
    };

    const categoryDisplay = categoryMap[discussionData.category] || "General";

    discussionItem.innerHTML = `
            <div class="discussion-content">
                <h4>${discussionData.title}</h4>
                <div class="discussion-meta">
                    <span class="author">Posted by You</span>
                    <span class="time">• ${timeAgo}</span>
                    <span class="category">• ${categoryDisplay}</span>
                </div>
                <p>${discussionData.description}</p>
                ${
                  discussionData.tags.length > 0
                    ? `
                    <div class="discussion-tags">
                        ${discussionData.tags
                          .map(
                            (tag) =>
                              `<span class="discussion-tag">${tag}</span>`
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
            <div class="discussion-stats">
                <span class="reply-count">0 replies</span>
            </div>
        `;

    // Add click handler
    discussionItem.addEventListener("click", function () {
      // Navigate to discussion thread
      window.location.href = `../discussion-thread/discussion.html?topic=${encodeURIComponent(
        discussionData.title
      )}&author=You`;
    });

    // Add hover effects
    discussionItem.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
    });

    discussionItem.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });

    // Insert at the beginning of discussions list
    discussionsList.insertBefore(discussionItem, discussionsList.firstChild);
  }

  // Show success message
  function showDiscussionSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1001;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            animation: slideInRight 0.3s ease-out;
        `;
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => successDiv.remove(), 300);
    }, 3000);
  }

  // Reset form
  function resetDiscussionForm() {
    discussionForm.reset();

    // Reset tags
    selectedQuestionTags = [];
    renderQuestionTags();

    // Reset validation classes
    const inputs = discussionForm.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.classList.remove("valid", "invalid");
    });

    // Reset textarea height
    questionDescription.style.height = "auto";

    // Reset character counter
    if (descriptionCounter) {
      descriptionCounter.textContent = "0/1000 characters";
      descriptionCounter.className = "character-counter";
    }

    // Reset form validation
    validateDiscussionForm();
  }

  // Community Guidelines link
  const guidelinesLink = document.querySelector(".community-guidelines-link");
  guidelinesLink.addEventListener("click", function (e) {
    e.preventDefault();
    alert(
      "Community Guidelines:\n\n• Be respectful and kind to all members\n• Stay on topic and provide helpful content\n• No spam, self-promotion, or inappropriate content\n• Respect privacy and confidentiality\n• Use appropriate language and tone\n• Help create a positive learning environment"
    );
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    if (discussionModal.classList.contains("active")) {
      // Ctrl/Cmd + Enter to submit form
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!postQuestionBtn.disabled) {
          discussionForm.dispatchEvent(new Event("submit"));
        }
      }
    }
  });

  // Add CSS for discussion tags and meta
  const style = document.createElement("style");
  style.textContent = `
        .discussion-tags {
            margin-top: 0.8rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.3rem;
        }
        
        .discussion-tag {
            background: #e8f5e8;
            color: #4CAF50;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 0.7rem;
            font-weight: 500;
        }
        
        .discussion-meta .category {
            color: #4CAF50;
            font-weight: 600;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Initialize form
  validateDiscussionForm();

  console.log("✅ Discussion creation modal initialized successfully!");
});
