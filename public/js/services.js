// Sample teacher data
const teachersData = {
  Guitar: [
    {
      id: 1,
      name: "Maria Rodriguez",
      avatar: "M",
      rating: 4.9,
      reviews: 47,
      distance: "0.8 miles away",
      description:
        "Passionate language teacher with 10+ years experience. I specialize in making Spanish fun and accessible for all ages through immersive cultural experiences.",
      skills: ["Guitar", "Flamenco Dance", "Music Theory"],
      price: "Rs.1000/hour",
      availability: "Available today",
    },
    {
      id: 2,
      name: "David Johnson",
      avatar: "D",
      rating: 4.9,
      reviews: 47,
      distance: "0.8 miles away",
      description:
        "Professional guitarist with experience in rock, jazz, and classical music. Teaching beginners to advanced students for over 8 years.",
      skills: ["Guitar", "Bass Guitar", "Music Production"],
      price: "Rs.1200/hour",
      availability: "Available today",
    },
  ],
  Piano: [
    {
      id: 3,
      name: "Sarah Chen",
      avatar: "S",
      rating: 4.8,
      reviews: 32,
      distance: "1.2 miles away",
      description:
        "Classical pianist with conservatory training. Specializes in teaching proper technique and music theory for all skill levels.",
      skills: ["Piano", "Music Theory", "Composition"],
      price: "Rs.1500/hour",
      availability: "Available tomorrow",
    },
    {
      id: 4,
      name: "Michael Brown",
      avatar: "M",
      rating: 4.7,
      reviews: 28,
      distance: "0.5 miles away",
      description:
        "Jazz pianist and composer with 15+ years teaching experience. Focus on improvisation and contemporary styles.",
      skills: ["Piano", "Jazz Theory", "Improvisation"],
      price: "Rs.1300/hour",
      availability: "Available today",
    },
  ],
  Painting: [
    {
      id: 5,
      name: "Elena Vasquez",
      avatar: "E",
      rating: 4.9,
      reviews: 53,
      distance: "0.3 miles away",
      description:
        "Professional artist with gallery exhibitions worldwide. Teaching watercolor, oil, and acrylic painting techniques.",
      skills: ["Watercolor", "Oil Painting", "Acrylic", "Color Theory"],
      price: "Rs.1400/hour",
      availability: "Available today",
    },
  ],
  Cooking: [
    {
      id: 6,
      name: "Chef Antonio",
      avatar: "A",
      rating: 5.0,
      reviews: 42,
      distance: "1.0 miles away",
      description:
        "Professional chef with 20+ years experience in Italian cuisine. Teaching authentic recipes and techniques.",
      skills: ["Italian Cuisine", "Pasta Making", "Wine Pairing"],
      price: "Rs.1800/hour",
      availability: "Available tomorrow",
    },
  ],
};

// Global variables
let currentSkill = "";
let selectedTeacher = null;

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  setupSearchFunctionality();
  setupSkillNavigation();
  setupCategoryInteractions();
  setupScrollEffects();
  setupKeyboardNavigation();
  setupResponsiveHandlers();

  console.log("🎓 SkillHub - Discover Skills Near You! 🚀");
  console.log("✅ All features initialized successfully!");
}

// Search functionality
function setupSearchFunctionality() {
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  function performSearch() {
    const query = searchInput.value.trim();
    if (query) {
      console.log("Searching for:", query);

      // Check if we're on the skills page
      if (
        document.getElementById("skill-categories-view").style.display !==
        "none"
      ) {
        filterCategories(query);
      } else {
        filterTeachers(query);
      }
    }
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", performSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  }
}

// Skill navigation setup
function setupSkillNavigation() {
  const skillItems = document.querySelectorAll(
    ".category-skills li[data-skill]"
  );

  skillItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.stopPropagation();
      const skill = this.getAttribute("data-skill");
      navigateToTeachers(skill);
    });

    // Make items focusable for keyboard navigation
    item.setAttribute("tabindex", "0");

    item.addEventListener("keypress", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const skill = this.getAttribute("data-skill");
        navigateToTeachers(skill);
      }
    });
  });
}

// Navigate to teachers view
function navigateToTeachers(skill) {
  currentSkill = skill;
  console.log("Selected skill:", skill);

  // Hide skill categories view
  document.getElementById("skill-categories-view").style.display = "none";

  // Show teachers view
  document.getElementById("teachers-view").style.display = "block";

  // Update the subtitle
  const subtitle = document.getElementById("skill-subtitle");
  subtitle.textContent = `Find expert ${skill} teachers in your neighborhood`;

  // Load teachers for this skill
  loadTeachers(skill);

  // Scroll to top
  window.scrollTo(0, 0);
}

// Show skill categories (back navigation)
function showSkillCategories() {
  document.getElementById("teachers-view").style.display = "none";
  document.getElementById("skill-categories-view").style.display = "block";
  window.scrollTo(0, 0);
}

// Load teachers for a specific skill
function loadTeachers(skill) {
  const teachersGrid = document.getElementById("teachers-grid");
  const teacherCount = document.getElementById("teacher-count");

  // Get teachers for this skill, fallback to Guitar teachers as sample
  const teachers = teachersData[skill] || teachersData["Guitar"] || [];

  // Update teacher count
  teacherCount.textContent = `${teachers.length} teachers found`;

  // Clear existing content
  teachersGrid.innerHTML = "";

  if (teachers.length === 0) {
    teachersGrid.innerHTML = `
      <div class="no-teachers">
        <p>No teachers found for ${skill}. Try searching for other skills!</p>
      </div>
    `;
    return;
  }

  // Create teacher cards
  teachers.forEach((teacher) => {
    const teacherCard = createTeacherCard(teacher);
    teachersGrid.appendChild(teacherCard);
  });
}

// Create a teacher card element
function createTeacherCard(teacher) {
  const card = document.createElement("div");
  card.className = "teacher-card";

  const stars =
    "★".repeat(Math.floor(teacher.rating)) +
    "☆".repeat(5 - Math.floor(teacher.rating));

  card.innerHTML = `
    <div class="teacher-header">
      <div class="teacher-avatar">
        <span>${teacher.avatar}</span>
      </div>
      <div class="teacher-info">
        <h3>${teacher.name}</h3>
        <div class="teacher-rating">
          <span class="stars">${stars}</span>
          <span class="rating-text">${teacher.rating} (${
    teacher.reviews
  } reviews)</span>
        </div>
        <div class="teacher-distance">${teacher.distance}</div>
      </div>
    </div>
    
    <div class="teacher-description">
      <p>${teacher.description}</p>
    </div>
    
    <div class="skills-offered">
      <h4>Skills Offered:</h4>
      <div class="skills-tags">
        ${teacher.skills
          .map((skill) => `<span class="skill-tag">${skill}</span>`)
          .join("")}
      </div>
    </div>
    
    <div class="teacher-footer">
      <div class="price-info">
        <span class="price">${teacher.price}</span>
        <span class="availability available">● ${teacher.availability}</span>
      </div>
      <button class="view-btn" onclick="openTeacherPopup(${
        teacher.id
      })">View</button>
    </div>
  `;

  return card;
}

// Open teacher detail popup
function openTeacherPopup(teacherId) {
  // Find teacher in current skill data
  const teachers = teachersData[currentSkill] || teachersData["Guitar"] || [];
  const teacher = teachers.find((t) => t.id === teacherId);

  if (!teacher) return;

  selectedTeacher = teacher;

  // Populate popup with teacher data
  document.getElementById("popup-avatar").textContent = teacher.avatar;
  document.getElementById("popup-name").textContent = teacher.name;

  const stars =
    "★".repeat(Math.floor(teacher.rating)) +
    "☆".repeat(5 - Math.floor(teacher.rating));
  document.getElementById(
    "popup-rating"
  ).innerHTML = `<span class="stars">${stars}</span> ${teacher.rating}`;
  document.getElementById(
    "popup-reviews"
  ).textContent = `(${teacher.reviews} reviews)`;
  document.getElementById("popup-distance").textContent = teacher.distance;
  document.getElementById("popup-description").textContent =
    teacher.description;
  document.getElementById("popup-price").textContent = teacher.price;
  document.getElementById(
    "popup-availability"
  ).innerHTML = `● ${teacher.availability}`;

  // Populate skills
  const skillsContainer = document.getElementById("popup-skills");
  skillsContainer.innerHTML = teacher.skills
    .map((skill) => `<span class="skill-tag">${skill}</span>`)
    .join("");

  // Show popup
  document.getElementById("teacher-popup").style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Close teacher popup
function closeTeacherPopup() {
  document.getElementById("teacher-popup").style.display = "none";
  document.body.style.overflow = "auto";
  selectedTeacher = null;
}

// Connect with teacher
function connectWithTeacher() {
  if (!selectedTeacher) return;

  // Update modal with teacher name
  document.getElementById("connect-teacher-name").textContent =
    selectedTeacher.name;

  // Show confirmation modal
  document.getElementById("connect-modal").style.display = "flex";
}

// Close connect modal
function closeConnectModal() {
  document.getElementById("connect-modal").style.display = "none";
}

// Confirm connection
function confirmConnection() {
  if (!selectedTeacher) return;

  // Close modals
  closeConnectModal();
  closeTeacherPopup();

  // Show success message
  showSuccessMessage(
    `Successfully connected with ${selectedTeacher.name}! They will contact you soon.`
  );

  console.log(`Connected with teacher: ${selectedTeacher.name}`);
}

// Show success message
function showSuccessMessage(message) {
  // Remove existing success message if any
  const existing = document.querySelector(".success-message");
  if (existing) {
    existing.remove();
  }

  // Create new success message
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.textContent = message;

  document.body.appendChild(successDiv);

  // Show with animation
  setTimeout(() => {
    successDiv.classList.add("show");
  }, 100);

  // Hide after 4 seconds
  setTimeout(() => {
    successDiv.classList.remove("show");
    setTimeout(() => {
      successDiv.remove();
    }, 300);
  }, 4000);
}

// Category interactions
function setupCategoryInteractions() {
  const categoryCards = document.querySelectorAll(".category-section");

  categoryCards.forEach((card) => {
    // Add hover effect
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
      this.style.cursor = "pointer";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-5px)";
    });
  });
}

// Filter categories based on search query
function filterCategories(query) {
  const categories = document.querySelectorAll(".category-section");
  query = query.toLowerCase();

  categories.forEach((category) => {
    const categoryName = category.querySelector("h3").textContent.toLowerCase();
    const categorySkills = Array.from(
      category.querySelectorAll(".category-skills li")
    )
      .map((li) => li.textContent.toLowerCase())
      .join(" ");

    if (categoryName.includes(query) || categorySkills.includes(query)) {
      category.style.display = "block";
      category.style.animation = "fadeIn 0.5s ease-out";
    } else {
      category.style.display = "none";
    }
  });
}

// Filter teachers based on search query
function filterTeachers(query) {
  const teacherCards = document.querySelectorAll(".teacher-card");
  query = query.toLowerCase();

  teacherCards.forEach((card) => {
    const teacherName = card.querySelector("h3").textContent.toLowerCase();
    const teacherSkills = Array.from(card.querySelectorAll(".skill-tag"))
      .map((tag) => tag.textContent.toLowerCase())
      .join(" ");
    const teacherDescription = card
      .querySelector(".teacher-description p")
      .textContent.toLowerCase();

    if (
      teacherName.includes(query) ||
      teacherSkills.includes(query) ||
      teacherDescription.includes(query)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// Setup scroll effects
function setupScrollEffects() {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (
        this.getAttribute("href") &&
        this.getAttribute("href").startsWith("#")
      ) {
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
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 30px rgba(0, 0, 0, 0.15)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
      }
    }
  });

  // Animate category cards on scroll
  const cardObserver = new IntersectionObserver(
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

  // Observe category cards
  const categoryCards = document.querySelectorAll(".category-section");
  categoryCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    cardObserver.observe(card);
  });

  // Parallax effect for hero circles
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const heroCircles = document.querySelectorAll(".hero-circle");

    heroCircles.forEach((circle, index) => {
      const speed = 0.02 + index * 0.01;
      const yPos = scrolled * speed;
      circle.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }

    // Escape key to close popups
    if (e.key === "Escape") {
      if (document.getElementById("teacher-popup").style.display === "flex") {
        closeTeacherPopup();
      }
      if (document.getElementById("connect-modal").style.display === "flex") {
        closeConnectModal();
      }
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-navigation");
  });
}

// Setup responsive handlers
function setupResponsiveHandlers() {
  // Handle window resize for responsive adjustments
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      console.log("Window resized, adjusting layouts...");
      // Add any responsive adjustments here
    }, 250);
  });
}

// Sort teachers functionality
function setupSortFunctionality() {
  const sortSelect = document.getElementById("sort-select");
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const sortBy = this.value;
      sortTeachers(sortBy);
    });
  }
}

function sortTeachers(sortBy) {
  const teachersGrid = document.getElementById("teachers-grid");
  const cards = Array.from(teachersGrid.querySelectorAll(".teacher-card"));

  cards.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        const ratingA = parseFloat(a.querySelector(".rating-text").textContent);
        const ratingB = parseFloat(b.querySelector(".rating-text").textContent);
        return ratingB - ratingA;

      case "price":
        const priceA = parseInt(
          a.querySelector(".price").textContent.replace(/[^\d]/g, "")
        );
        const priceB = parseInt(
          b.querySelector(".price").textContent.replace(/[^\d]/g, "")
        );
        return priceA - priceB;

      case "distance":
        const distA = parseFloat(
          a.querySelector(".teacher-distance").textContent
        );
        const distB = parseFloat(
          b.querySelector(".teacher-distance").textContent
        );
        return distA - distB;

      default:
        return 0;
    }
  });

  // Re-append sorted cards
  cards.forEach((card) => teachersGrid.appendChild(card));
}

// Initialize sort functionality when teachers view is shown
document.addEventListener("DOMContentLoaded", function () {
  setupSortFunctionality();
});

// Handle popup clicks outside content
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("popup-overlay")) {
    closeTeacherPopup();
  }
  if (e.target.classList.contains("modal-overlay")) {
    closeConnectModal();
  }
});
