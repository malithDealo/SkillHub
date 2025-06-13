// Activity data for Featured Adaptive Skills
const activityData = {
  "Focus & Attention": {
    heroTitle: "Explore Focus & Attention Training",
    heroSubtitle: "Engage in interactive games designed to enhance concentration and track progress.",
    accessibilityFeatures: ["large-text", "audio-support"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Adaptive Reading": {
    heroTitle: "Discover Adaptive Reading",
    heroSubtitle: "Multi-sensory reading programs with audio, visuals, and personalized levels.",
    accessibilityFeatures: ["audio-support", "large-text", "high-contrast"],
    heroBackground: "linear-gradient(to bottom, #1A3C47, #3A8AA3)"
  },
  "Math with Manipulatives": {
    heroTitle: "Learn Math with Manipulatives",
    heroSubtitle: "Visual and tactile math learning using manipulatives and real-world problems.",
    accessibilityFeatures: ["large-text", "simple-mode"],
    heroBackground: "linear-gradient(to bottom, #472E1A, #A35A3A)"
  },
  "Creative Expression": {
    heroTitle: "Unleash Creative Expression",
    heroSubtitle: "Art, music, and creative writing adapted to various preferences.",
    accessibilityFeatures: ["simple-mode", "audio-support"],
    heroBackground: "linear-gradient(to bottom, #1A472E, #3AA35A)"
  },
  "Time Management": {
    heroTitle: "Master Time Management",
    heroSubtitle: "Visual schedules and reminders to build time awareness.",
    accessibilityFeatures: ["simple-mode", "large-text"],
    heroBackground: "linear-gradient(to bottom, #471A3C, #A33A8A)"
  },
  "Community Skills": {
    heroTitle: "Build Community Skills",
    heroSubtitle: "Learn safety awareness, money management, and participation skills.",
    accessibilityFeatures: ["simple-mode", "audio-support"],
    heroBackground: "linear-gradient(to bottom, #3C471A, #8AA33A)"
  },
  "Emotional Learning": {
    heroTitle: "Grow with Emotional Learning",
    heroSubtitle: "Develop emotion recognition and coping strategies.",
    accessibilityFeatures: ["audio-support", "large-text"],
    heroBackground: "linear-gradient(to bottom, #1A3C47, #3A8AA3)"
  },
  "Adaptive Physical Education": {
    heroTitle: "Enjoy Adaptive Physical Education",
    heroSubtitle: "Modified sports and movement activities tailored to abilities.",
    accessibilityFeatures: ["simple-mode"],
    heroBackground: "linear-gradient(to bottom, #472E1A, #A35A3A)"
  },
  "Assistive Technology": {
    heroTitle: "Empower with Assistive Technology",
    heroSubtitle: "Use devices and tools to foster independence.",
    accessibilityFeatures: ["audio-support", "high-contrast"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  }
};

// Default hero content
const defaultHeroContent = {
  heroTitle: '<span class="about-text">Welcome to</span> <span class="skillhub-text">Inclusive Learning</span>',
  heroSubtitle: "Empowering every child with personalized, accessible education tailored to unique abilities",
  heroBackground: "linear-gradient(to bottom, #3B2A6B, #6A5ACD)"
};

// Accessibility feature implementation
document.querySelectorAll(".features button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const feature = btn.dataset.feature;

    switch (feature) {
      case "high-contrast":
        toggleHighContrast();
        break;
      case "large-text":
        toggleLargeText();
        break;
      case "audio-support":
        toggleAudioSupport();
        break;
      case "simple-mode":
        toggleSimpleMode();
        break;
      case "reset-all":
        resetAll();
        break;
    }
  });
});

// High Contrast Mode
function toggleHighContrast() {
  document.body.classList.toggle("high-contrast");
  localStorage.setItem("high-contrast", document.body.classList.contains("high-contrast"));
  alert("High Contrast mode toggled!");
}

// Large Text Mode
function toggleLargeText() {
  document.body.classList.toggle("large-text");
  localStorage.setItem("large-text", document.body.classList.contains("large-text"));
  alert("Large Text mode toggled!");
}

// Audio Support (Simulated)
function toggleAudioSupport() {
  alert("Audio Support activated! (This is a demo. Narration would play for page content.)");
}

// Simple Mode
function toggleSimpleMode() {
  document.body.classList.toggle("simple-mode");
  localStorage.setItem("simple-mode", document.body.classList.contains("simple-mode"));
  alert("Simple Mode toggled!");
}

// Reset All Accessibility Features
function resetAll() {
  document.body.classList.remove("high-contrast", "large-text", "simple-mode");
  localStorage.removeItem("high-contrast");
  localStorage.removeItem("large-text");
  localStorage.removeItem("simple-mode");
  alert("All accessibility features reset!");
  resetHeroAndAccessibility(); // Reset hero and accessibility sections
}

// Basic search simulation
document.querySelector(".search-bar button")?.addEventListener("click", () => {
  const query = document.querySelector(".search-bar input")?.value;
  if (query) {
    alert(`Searching for "${query}"... (This is a demo search.)`);
  } else {
    alert("Please enter a search term.");
  }
});

// Handle icon load errors
document.querySelectorAll(".card img").forEach((img) => {
  img.addEventListener("error", () => {
    img.src = "https://cdn-icons-png.flaticon.com/512/3659/3659895.png"; // Fallback icon
    img.alt = "Fallback Icon";
  });
});

// Activity button action (navigate to activity.html)
document.querySelectorAll(".activity-button").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    let activity;
    
    // For cards in skills-grid, use the data-activity attribute
    if (btn.closest(".skills-grid .card")) {
      activity = btn.closest(".card").dataset.activity;
    } 
    // For other cards, use the button text
    else {
      activity = btn.textContent.replace("Try ", "");
    }
    
    window.location.href = `activity.html?activity=${encodeURIComponent(activity)}`;
  });
});

// Card selection for updating hero and accessibility sections
document.querySelectorAll(".skills-grid .card").forEach((card) => {
  card.addEventListener("click", () => {
    const activity = card.dataset.activity;

    // Remove selected class from all cards
    document.querySelectorAll(".skills-grid .card").forEach((c) => c.classList.remove("selected"));
    // Add selected class to clicked card
    card.classList.add("selected");

    // Update hero section
    const hero = document.querySelector(".hero");
    const heroTitle = document.querySelector(".hero h1");
    const heroSubtitle = document.querySelector(".hero .subtitle");

    if (activityData[activity]) {
      heroTitle.innerHTML = activityData[activity].heroTitle;
      heroSubtitle.textContent = activityData[activity].heroSubtitle;
      hero.style.background = activityData[activity].heroBackground;
    } else {
      resetHeroAndAccessibility();
    }

    // Update accessibility features
    document.querySelectorAll(".features button").forEach((btn) => {
      btn.classList.remove("recommended");
      if (activityData[activity] && activityData[activity].accessibilityFeatures.includes(btn.dataset.feature)) {
        btn.classList.add("recommended");
      } else {
        btn.classList.remove("recommended");
      }
    });
  });
});

// Reset hero and accessibility sections to default
function resetHeroAndAccessibility() {
  const hero = document.querySelector(".hero");
  const heroTitle = document.querySelector(".hero h1");
  const heroSubtitle = document.querySelector(".hero .subtitle");

  heroTitle.innerHTML = defaultHeroContent.heroTitle;
  heroSubtitle.textContent = defaultHeroContent.heroSubtitle;
  hero.style.background = defaultHeroContent.heroBackground;

  document.querySelectorAll(".features button").forEach((btn) => {
    btn.classList.remove("recommended");
  });
  document.querySelectorAll(".skills-grid .card").forEach((c) => c.classList.remove("selected"));
}

// Apply accessibility settings on page load
window.addEventListener("load", () => {
  if (localStorage.getItem("high-contrast") === "true") {
    document.body.classList.add("high-contrast");
  }
  if (localStorage.getItem("large-text") === "true") {
    document.body.classList.add("large-text");
  }
  if (localStorage.getItem("simple-mode") === "true") {
    document.body.classList.add("simple-mode");
  }
});