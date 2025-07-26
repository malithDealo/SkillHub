// Sample teacher data
const teachersData = {
  Guitar: [
    {
      id: 1,
      name: "Kumara Deshan",
      avatar: "M",
      rating: 4.9,
      reviews: 47,
      distance: "0.8 miles away",
      description:
        "Passionate guitar teacher with 10+ years experience. I specialize in making guitar fun and accessible for all ages through immersive musical experiences.",
      skills: ["Guitar", "Flamenco Dance", "Music Theory"],
      price: "Rs.550/hour",
      availability: "Available today",
    },
    {
      id: 2,
      name: "Nandani Herath",
      avatar: "D",
      rating: 4.9,
      reviews: 47,
      distance: "0.8 miles away",
      description:
        "Professional guitarist with experience in rock, jazz, and classical music. Teaching beginners to advanced students for over 8 years.",
      skills: ["Guitar", "Bass Guitar", "Music Production"],
      price: "Rs.750/hour",
      availability: "Available today",
    },
    {
      id: 7,
      name: "Dhanuka Jayasekara",
      avatar: "A",
      rating: 4.7,
      reviews: 35,
      distance: "1.1 miles away",
      description:
        "Rock and metal guitarist with 12 years of stage experience. Specializes in electric guitar techniques, riffs, and performance skills for aspiring rock musicians.",
      skills: [
        "Electric Guitar",
        "Rock Music",
        "Stage Performance",
        "Songwriting",
      ],
      price: "Rs.200/hour",
      availability: "Available tomorrow",
    },
    {
      id: 8,
      name: "Chathuri Bandara",
      avatar: "S",
      rating: 4.8,
      reviews: 52,
      distance: "0.6 miles away",
      description:
        "Classical and fingerstyle guitarist with conservatory training. Perfect for students wanting to learn proper technique and classical repertoire.",
      skills: [
        "Classical Guitar",
        "Fingerstyle",
        "Music Reading",
        "Classical Repertoire",
      ],
      price: "Rs.100/hour",
      availability: "Available today",
    },
    {
      id: 9,
      name: "Asela Weerasinghe",
      avatar: "J",
      rating: 4.6,
      reviews: 28,
      distance: "1.5 miles away",
      description:
        "Blues and country guitarist with a soulful approach to teaching. Learn authentic blues techniques, country picking, and improvisation skills.",
      skills: [
        "Blues Guitar",
        "Country Guitar",
        "Slide Guitar",
        "Improvisation",
      ],
      price: "Rs.900/hour",
      availability: "Available today",
    },
    {
      id: 10,
      name: "Tharushi Gunawardena",
      avatar: "E",
      rating: 4.9,
      reviews: 43,
      distance: "0.9 miles away",
      description:
        "Acoustic guitarist and singer-songwriter with 8 years teaching experience. Focus on chord progressions, strumming patterns, and song accompaniment.",
      skills: [
        "Acoustic Guitar",
        "Singer-Songwriter",
        "Chord Progressions",
        "Vocal Harmony",
      ],
      price: "Rs.800/hour",
      availability: "Available tomorrow",
    },
    {
      id: 11,
      name: "Lakshmi Kuganesan",
      avatar: "C",
      rating: 5.0,
      reviews: 67,
      distance: "1.3 miles away",
      description:
        "Latin and Spanish guitar virtuoso with international performance experience. Teaches flamenco, bossa nova, and Latin jazz guitar styles.",
      skills: ["Flamenco Guitar", "Latin Jazz", "Bossa Nova", "Spanish Guitar"],
      price: "Rs.500/hour",
      availability: "Available today",
    },
    {
      id: 12,
      name: "Imran Rauf",
      avatar: "R",
      rating: 4.5,
      reviews: 31,
      distance: "2.0 miles away",
      description:
        "Modern guitarist specializing in contemporary styles. Teaches pop, indie, and alternative guitar techniques with focus on effects and modern sound.",
      skills: [
        "Pop Guitar",
        "Indie Rock",
        "Guitar Effects",
        "Modern Techniques",
      ],
      price: "Rs.1000/hour",
      availability: "Available tomorrow",
    },
    {
      id: 13,
      name: "Nishantha gunesekara",
      avatar: "L",
      rating: 4.8,
      reviews: 39,
      distance: "0.7 miles away",
      description:
        "Patient and encouraging guitar teacher perfect for beginners. Creates a comfortable learning environment and builds solid fundamentals step by step.",
      skills: [
        "Beginner Guitar",
        "Music Fundamentals",
        "Patient Teaching",
        "Kids Lessons",
      ],
      price: "Rs.800/hour",
      availability: "Available today",
    },
    {
      id: 14,
      name: "Dushanthi Karunarathna",
      avatar: "M",
      rating: 4.7,
      reviews: 45,
      distance: "1.8 miles away",
      description:
        "Jazz guitarist and music theory expert. Perfect for intermediate to advanced students wanting to explore jazz harmony, improvisation, and complex chord voicings.",
      skills: [
        "Jazz Guitar",
        "Music Theory",
        "Chord Voicings",
        "Jazz Improvisation",
      ],
      price: "Rs.1350/hour",
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

// Review system state
let currentRatings = {}; // Stores current rating for each teacher
let teacherReviews = JSON.parse(localStorage.getItem("teacherReviews")) || {}; // Persistent storage

// Wishlist functionality
function getWishlist() {
  const wishlist = localStorage.getItem("skillWishlist");
  return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("skillWishlist", JSON.stringify(wishlist));
}

function isInWishlist(skill) {
  const wishlist = getWishlist();
  return wishlist.some((item) => item.skillName === skill);
}

function addToWishlist() {
  if (!currentSkill) return;

  const wishlist = getWishlist();

  // Check if already in wishlist
  if (isInWishlist(currentSkill)) {
    showSuccessMessage(`${currentSkill} is already in your wishlist!`);
    return;
  }

  // Add to wishlist
  const wishlistItem = {
    skillName: currentSkill,
    courseIcon: getSkillIcon(currentSkill),
    availableTeachers: getAvailableTeachers(currentSkill),
    addedDate: new Date().toISOString(),
  };

  wishlist.push(wishlistItem);
  saveWishlist(wishlist);

  // Update button state
  updateWishlistButton(true);

  showSuccessMessage(
    `${currentSkill} added to your wishlist! Check it in your Dashboard > My Learning.`
  );
}

function updateWishlistButton(isAdded) {
  const btn = document.getElementById("wishlist-btn");
  const btnText = document.getElementById("wishlist-btn-text");

  if (isAdded) {
    btn.classList.add("added");
    btnText.textContent = "Added to Wishlist";
    btn.onclick = null; // Disable further clicks
  } else {
    btn.classList.remove("added");
    btnText.textContent = "Add to Wishlist";
    btn.onclick = addToWishlist;
  }
}

function getSkillIcon(skill) {
  const iconMap = {
    Guitar: "🎸",
    Piano: "🎹",
    Painting: "🎨",
    Cooking: "🍳",
    "Traditional Cuisines": "🍳",
    Photography: "📸",
    Drawing: "✏️",
    Pottery: "🏺",
    Singing: "🎤",
    Violin: "🎻",
    Drums: "🥁",
    "Public Speaking": "🎤",
    "Computer Basics": "💻",
    "Social Media": "📱",
    Gardening: "🌱",
    "Yoga Meditation": "🧘",
    Fitness: "💪",
    "Resume Writing": "📝",
    Leadership: "👨‍💼",
  };
  return iconMap[skill] || "📚";
}

function getAvailableTeachers(skill) {
  const teachers = teachersData[skill] || [];
  return teachers.length;
}

// Check if we need to auto-navigate to a specific skill from dashboard
function checkForExploreSkill() {
  const exploreSkill = localStorage.getItem("exploreSkill");
  if (exploreSkill) {
    // Clear the stored skill
    localStorage.removeItem("exploreSkill");

    // Show a notification that we're exploring the specific skill
    showSuccessMessage(
      `Exploring ${exploreSkill} teachers from your wishlist!`
    );

    // Auto-navigate to the skill after a short delay to ensure page is fully loaded
    setTimeout(() => {
      navigateToTeachers(exploreSkill);
    }, 800);
  }
}

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

  // Check if we need to auto-navigate to a specific skill from dashboard
  checkForExploreSkill();

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

  // Update wishlist section
  document.getElementById("current-skill-name").textContent = skill;
  updateWishlistButton(isInWishlist(skill));

  // Load teachers for this skill
  loadTeachers(skill);

  // Scroll to top
  window.scrollTo(0, 0);
}

// Show skill categories (back navigation)
function showSkillCategories() {
  document.getElementById("teachers-view").style.display = "none";
  document.getElementById("skill-categories-view").style.display = "block";
  currentSkill = "";
  window.scrollTo(0, 0);
}

// Load teachers for a specific skill
function loadTeachers(skill) {
  const teachersGrid = document.getElementById("teachers-grid");
  const teacherCount = document.getElementById("teacher-count");

  // Get teachers for this skill, fallback to Guitar teachers as sample
  let teachers = teachersData[skill] || [];

  // If no exact match, try to find similar skills or use sample data
  if (teachers.length === 0) {
    // Try to find teachers for similar skills
    for (const [key, value] of Object.entries(teachersData)) {
      if (
        key.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(key.toLowerCase())
      ) {
        teachers = value;
        break;
      }
    }

    // If still no match, create sample teacher data for the skill
    if (teachers.length === 0) {
      teachers = createSampleTeachersForSkill(skill);
    }
  }

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

  // Initialize review system after cards are created
  setTimeout(() => {
    initializeReviewSystem();
  }, 100);
}

// Create sample teachers for skills that don't have specific data
function createSampleTeachersForSkill(skill) {
  const sampleTeachers = [
    {
      id: Date.now() + 1,
      name: `Expert ${skill} Instructor`,
      avatar: skill.charAt(0).toUpperCase(),
      rating: 4.8,
      reviews: Math.floor(Math.random() * 50) + 20,
      distance: `${(Math.random() * 2 + 0.3).toFixed(1)} miles away`,
      description: `Professional ${skill} teacher with years of experience. Specializing in teaching ${skill} to students of all levels.`,
      skills: [skill, "Teaching", "Mentoring"],
      price: `Rs.${Math.floor(Math.random() * 1000) + 800}/hour`,
      availability: "Available today",
    },
    {
      id: Date.now() + 2,
      name: `${skill} Master`,
      avatar: skill.charAt(1)?.toUpperCase() || "T",
      rating: 4.9,
      reviews: Math.floor(Math.random() * 40) + 15,
      distance: `${(Math.random() * 1.5 + 0.5).toFixed(1)} miles away`,
      description: `Passionate ${skill} expert dedicated to helping students master ${skill} through personalized instruction.`,
      skills: [skill, "Advanced Techniques", "Beginner Friendly"],
      price: `Rs.${Math.floor(Math.random() * 800) + 1000}/hour`,
      availability: "Available tomorrow",
    },
  ];

  return sampleTeachers;
}

// Create a teacher card element with review system
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

    <!-- REVIEW SECTION -->
    <div class="teacher-review-section" data-teacher-id="${teacher.id}">
      <button class="review-form-toggle" onclick="toggleReviewForm(${
        teacher.id
      })">
        📝 Write a Review
      </button>

      <div class="review-form" id="review-form-${teacher.id}">
        <h4>Share Your Experience</h4>
        
        <div class="star-rating" id="star-rating-${teacher.id}">
          <span class="star" data-rating="1" onclick="setRating(${
            teacher.id
          }, 1)">★</span>
          <span class="star" data-rating="2" onclick="setRating(${
            teacher.id
          }, 2)">★</span>
          <span class="star" data-rating="3" onclick="setRating(${
            teacher.id
          }, 3)">★</span>
          <span class="star" data-rating="4" onclick="setRating(${
            teacher.id
          }, 4)">★</span>
          <span class="star" data-rating="5" onclick="setRating(${
            teacher.id
          }, 5)">★</span>
        </div>

        <textarea 
          class="review-textarea" 
          id="review-text-${teacher.id}" 
          placeholder="Tell others about your experience with this teacher..."
          rows="4"
        ></textarea>
        
        <div class="error-message" id="error-message-${teacher.id}">
          Please provide both a rating and review text.
        </div>

        <button class="review-submit-btn" onclick="submitReview(${teacher.id})">
          Submit Review
        </button>
        <button class="review-cancel-btn" onclick="cancelReview(${teacher.id})">
          Cancel
        </button>
      </div>

      <div class="reviews-display">
        <div class="rating-summary" id="rating-summary-${teacher.id}">
          <span class="average-rating">${teacher.rating}</span>
          <span class="rating-stars-display">${"★".repeat(
            Math.floor(teacher.rating)
          )}${"☆".repeat(5 - Math.floor(teacher.rating))}</span>
          <span class="total-reviews">(${teacher.reviews} reviews)</span>
        </div>

        <div class="reviews-header">
          <h4>Student Reviews</h4>
          <span class="reviews-count" id="reviews-count-${teacher.id}">${
    teacher.reviews
  } reviews</span>
        </div>
        
        <div class="reviews-list" id="reviews-list-${teacher.id}">
          <div class="no-reviews" id="no-reviews-${teacher.id}">
            No new reviews yet. Be the first to review this teacher!
          </div>
        </div>
      </div>
    </div>
  `;

  return card;
}

// REVIEW SYSTEM FUNCTIONS

// Toggle review form visibility
function toggleReviewForm(teacherId) {
  const form = document.getElementById(`review-form-${teacherId}`);
  const toggleBtn = form.previousElementSibling;

  if (form.classList.contains("active")) {
    form.classList.remove("active");
    toggleBtn.textContent = "📝 Write a Review";
  } else {
    form.classList.add("active");
    toggleBtn.textContent = "❌ Cancel Review";
    // Focus on the textarea
    setTimeout(() => {
      document.getElementById(`review-text-${teacherId}`).focus();
    }, 300);
  }
}

// Set star rating
function setRating(teacherId, rating) {
  currentRatings[teacherId] = rating;
  const stars = document.querySelectorAll(`#star-rating-${teacherId} .star`);

  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

// Initialize star hover effects
function initializeStarEffects() {
  const starRatings = document.querySelectorAll(".star-rating");

  starRatings.forEach((rating) => {
    const stars = rating.querySelectorAll(".star");

    stars.forEach((star, index) => {
      star.addEventListener("mouseenter", () => {
        stars.forEach((s, i) => {
          if (i <= index) {
            s.classList.add("hover-effect");
          } else {
            s.classList.remove("hover-effect");
          }
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach((s) => s.classList.remove("hover-effect"));
      });
    });
  });
}

// Submit review
function submitReview(teacherId) {
  const rating = currentRatings[teacherId];
  const reviewText = document
    .getElementById(`review-text-${teacherId}`)
    .value.trim();
  const errorMsg = document.getElementById(`error-message-${teacherId}`);
  const textarea = document.getElementById(`review-text-${teacherId}`);

  // Reset error states
  errorMsg.classList.remove("show");
  textarea.classList.remove("error");

  // Validation
  if (!rating || !reviewText) {
    errorMsg.textContent = "Please provide both a rating and review text.";
    errorMsg.classList.add("show");
    if (!reviewText) {
      textarea.classList.add("error");
    }
    return;
  }

  if (reviewText.length < 10) {
    errorMsg.textContent =
      "Please write a more detailed review (at least 10 characters).";
    errorMsg.classList.add("show");
    textarea.classList.add("error");
    return;
  }

  // Create review object
  const review = {
    id: Date.now(),
    rating: rating,
    text: reviewText,
    author: "You", // In real app, this would be the logged-in user
    date: new Date().toLocaleDateString(),
    timestamp: Date.now(),
  };

  // Store review
  if (!teacherReviews[teacherId]) {
    teacherReviews[teacherId] = [];
  }
  teacherReviews[teacherId].unshift(review); // Add to beginning

  // Save to localStorage
  localStorage.setItem("teacherReviews", JSON.stringify(teacherReviews));

  // Show success message
  showSuccessMessage(
    "✅ Thank you! Your review has been submitted successfully."
  );

  // Update UI
  addReviewToUI(teacherId, review);
  updateRatingSummary(teacherId);
  updateTeacherCardRating(teacherId);

  // Reset form
  resetReviewForm(teacherId);

  // Close form
  toggleReviewForm(teacherId);
}

// Cancel review
function cancelReview(teacherId) {
  resetReviewForm(teacherId);
  toggleReviewForm(teacherId);
}

// Reset review form
function resetReviewForm(teacherId) {
  // Reset rating
  currentRatings[teacherId] = 0;
  const stars = document.querySelectorAll(`#star-rating-${teacherId} .star`);
  stars.forEach((star) => star.classList.remove("active"));

  // Reset text
  document.getElementById(`review-text-${teacherId}`).value = "";

  // Reset error states
  document
    .getElementById(`error-message-${teacherId}`)
    .classList.remove("show");
  document.getElementById(`review-text-${teacherId}`).classList.remove("error");
}

// Add review to UI
function addReviewToUI(teacherId, review) {
  const reviewsList = document.getElementById(`reviews-list-${teacherId}`);
  const noReviews = document.getElementById(`no-reviews-${teacherId}`);

  // Hide "no reviews" message if it exists
  if (noReviews) {
    noReviews.style.display = "none";
  }

  const reviewElement = document.createElement("div");
  reviewElement.className = "review-item";
  reviewElement.innerHTML = `
    <div class="review-header">
      <span class="review-author">${review.author}</span>
      <span class="review-date">${review.date}</span>
    </div>
    <div class="review-rating-display">${"★".repeat(review.rating)}${"☆".repeat(
    5 - review.rating
  )}</div>
    <div class="review-text">${review.text}</div>
  `;

  // Add to beginning of reviews list
  reviewsList.insertBefore(reviewElement, reviewsList.firstChild);
}

// Update rating summary
function updateRatingSummary(teacherId) {
  const reviews = teacherReviews[teacherId] || [];

  // Get teacher's original data
  const teacherData = findTeacherById(teacherId);
  if (!teacherData) return;

  const originalReviews = teacherData.reviews;
  const originalRating = teacherData.rating;
  const totalReviews = reviews.length + originalReviews;

  if (reviews.length > 0) {
    const newReviewsSum = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const existingSum = originalReviews * originalRating;
    const newAverage = ((newReviewsSum + existingSum) / totalReviews).toFixed(
      1
    );

    // Update rating summary
    const ratingSummary = document.getElementById(
      `rating-summary-${teacherId}`
    );
    if (ratingSummary) {
      ratingSummary.innerHTML = `
        <span class="average-rating">${newAverage}</span>
        <span class="rating-stars-display">${"★".repeat(
          Math.floor(newAverage)
        )}${
        Math.floor(newAverage) < 5 ? "☆".repeat(5 - Math.floor(newAverage)) : ""
      }</span>
        <span class="total-reviews">(${totalReviews} reviews)</span>
      `;
    }

    // Update reviews count
    const reviewsCount = document.getElementById(`reviews-count-${teacherId}`);
    if (reviewsCount) {
      reviewsCount.textContent = `${totalReviews} reviews`;
    }
  }
}

// Update teacher card main rating (in the teacher header)
function updateTeacherCardRating(teacherId) {
  const reviews = teacherReviews[teacherId] || [];

  if (reviews.length > 0) {
    const teacherData = findTeacherById(teacherId);
    if (!teacherData) return;

    const originalReviews = teacherData.reviews;
    const originalRating = teacherData.rating;
    const totalReviews = reviews.length + originalReviews;

    const newReviewsSum = reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    const existingSum = originalReviews * originalRating;
    const newAverage = ((newReviewsSum + existingSum) / totalReviews).toFixed(
      1
    );

    // Update the main teacher card rating
    const teacherCard = document
      .querySelector(`[data-teacher-id="${teacherId}"]`)
      .closest(".teacher-card");
    if (teacherCard) {
      const ratingText = teacherCard.querySelector(".rating-text");
      if (ratingText) {
        ratingText.textContent = `${newAverage} (${totalReviews} reviews)`;
      }
    }
  }
}

// Find teacher by ID
function findTeacherById(teacherId) {
  // Search through all teacher data to find the teacher
  for (const skill in teachersData) {
    const teacher = teachersData[skill].find((t) => t.id == teacherId);
    if (teacher) return teacher;
  }
  return null;
}

// Load existing reviews for a teacher
function loadExistingReviews(teacherId) {
  const reviews = teacherReviews[teacherId] || [];

  reviews.forEach((review) => {
    addReviewToUI(teacherId, review);
  });

  if (reviews.length > 0) {
    updateRatingSummary(teacherId);
    updateTeacherCardRating(teacherId);
  }
}

// Initialize review system when teacher cards are loaded
function initializeReviewSystem() {
  // Initialize star hover effects
  initializeStarEffects();

  // Load existing reviews for all teachers
  Object.keys(teacherReviews).forEach((teacherId) => {
    loadExistingReviews(teacherId);
  });
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

// Chatbot Integration (from your original code)
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("skillhub-chatbot-container");
  if (!container) return;

  // Inject CSS styles
  const styles = `
    <style id="skillhub-chatbot-styles">
    .skillhub-chat-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1001;
        border: none;
    }

    .skillhub-chat-icon:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(76, 175, 80, 0.5);
    }

    .skillhub-chat-icon.pulsing {
        animation: skillhub-pulse 2s infinite;
    }

    @keyframes skillhub-pulse {
        0% { box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4); }
        50% { box-shadow: 0 4px 30px rgba(76, 175, 80, 0.8); }
        100% { box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4); }
    }

    .skillhub-chat-icon svg {
        width: 28px;
        height: 28px;
        fill: white;
    }

    .skillhub-chat-container {
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 400px;
        max-width: calc(100vw - 40px);
        height: 600px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
        animation: skillhub-slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes skillhub-slideUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .skillhub-chat-header {
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 20px;
        text-align: center;
        position: relative;
    }

    .skillhub-chat-header h3 {
        font-family: 'Arial', sans-serif;
        font-size: 18px;
        margin-bottom: 5px;
        margin: 0;
    }

    .skillhub-chat-header p {
        font-size: 14px;
        opacity: 0.9;
        margin: 5px 0 0 0;
    }

    .skillhub-close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
    }

    .skillhub-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 480px) {
        .skillhub-chat-container {
            width: calc(100vw - 20px);
            height: calc(100vh - 120px);
            right: 10px;
            bottom: 90px;
        }
        
        .skillhub-chat-icon {
            right: 15px;
            bottom: 15px;
        }
    }
    </style>
`;

  // Check if styles already exist
  if (!document.getElementById("skillhub-chatbot-styles")) {
    document.head.insertAdjacentHTML("beforeend", styles);
  }

  console.log("SkillHub Chatbot initialized successfully");
});

// Additional utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Enhanced search with debouncing
const debouncedSearch = debounce((query) => {
  if (query.length > 2) {
    // Perform search logic here
    console.log("Searching for:", query);
  }
}, 300);

// Add real-time search functionality
document.addEventListener("DOMContentLoaded", function () {
  const searchInputs = document.querySelectorAll(".search-input");

  searchInputs.forEach((input) => {
    input.addEventListener("input", function () {
      const query = this.value.trim();
      if (query.length > 0) {
        debouncedSearch(query);
      }
    });
  });
});

// Performance optimization - Lazy loading for images
function setupLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Error handling for API calls or external services
function handleApiError(error, context = "API") {
  console.error(`${context} Error:`, error);

  // Show user-friendly error message
  showSuccessMessage("⚠️ Something went wrong. Please try again later.");

  // Log error for debugging (in production, send to error tracking service)
  if (typeof window.errorTracker !== "undefined") {
    window.errorTracker.captureException(error);
  }
}

// Local storage wrapper with error handling
const StorageHelper = {
  set: function (key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error("Storage set error:", error);
      return false;
    }
  },

  get: function (key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Storage get error:", error);
      return defaultValue;
    }
  },

  remove: function (key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Storage remove error:", error);
      return false;
    }
  },
};

// Enhanced analytics tracking
function trackEvent(category, action, label = null, value = null) {
  // Google Analytics 4 tracking
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Custom analytics tracking
  console.log("Event tracked:", { category, action, label, value });
}

// Track user interactions
document.addEventListener("click", function (e) {
  const target = e.target;

  // Track button clicks
  if (target.matches(".view-btn")) {
    trackEvent(
      "Teacher",
      "view_profile",
      target.closest(".teacher-card")?.querySelector("h3")?.textContent
    );
  }

  // Track skill selections
  if (target.matches("[data-skill]")) {
    trackEvent("Skill", "select", target.getAttribute("data-skill"));
  }

  // Track review submissions
  if (target.matches(".review-submit-btn")) {
    trackEvent("Review", "submit");
  }
});

// Performance monitoring
function measurePerformance() {
  // Measure page load time
  window.addEventListener("load", function () {
    const loadTime =
      performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log("Page load time:", loadTime + "ms");

    // Track performance metrics
    trackEvent("Performance", "page_load_time", null, loadTime);
  });

  // Measure DOM content loaded time
  document.addEventListener("DOMContentLoaded", function () {
    const domLoadTime =
      performance.timing.domContentLoadedEventEnd -
      performance.timing.navigationStart;
    console.log("DOM load time:", domLoadTime + "ms");
  });
}

// Initialize performance monitoring
measurePerformance();

// Accessibility enhancements
function enhanceAccessibility() {
  // Add skip to main content link
  const skipLink = document.createElement("a");
  skipLink.href = "#main-content";
  skipLink.textContent = "Skip to main content";
  skipLink.className = "skip-link sr-only";
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #4CAF50;
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100000;
    border-radius: 4px;
  `;

  skipLink.addEventListener("focus", function () {
    this.style.top = "6px";
  });

  skipLink.addEventListener("blur", function () {
    this.style.top = "-40px";
  });

  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main content landmark
  const mainContent = document.querySelector(
    ".main-content, .teachers-content"
  );
  if (mainContent) {
    mainContent.id = "main-content";
    mainContent.setAttribute("role", "main");
  }
}

// Initialize accessibility enhancements
document.addEventListener("DOMContentLoaded", enhanceAccessibility);

// PWA support - Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("ServiceWorker registration successful");
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed: ", err);
      });
  });
}

// Export functions for testing (if in testing environment)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createTeacherCard,
    submitReview,
    updateRatingSummary,
    StorageHelper,
    trackEvent,
  };
}

console.log("🎓 SkillHub JavaScript loaded successfully! 🚀");
