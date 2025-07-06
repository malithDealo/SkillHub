// Activity prompt text mapping (from activity.js)
const activityPrompts = {
  "Focus & Attention": "Play a game to focus! Match cards in a timed challenge and track your progress.",
  "Adaptive Reading": "Read a short story with pictures and sounds. Can you answer questions about it?",
  "Math with Manipulatives": "Use virtual blocks to solve a math problem. Count the blocks to find the answer!",
  "Creative Expression": "Draw or write about your favorite thing. Share it with your teacher!",
  "Time Management": "Follow a visual schedule to plan your day. Can you check off all tasks?",
  "Community Skills": "Practice crossing the street safely in a game. Look both ways first!",
  "Emotional Learning": "Look at a picture and name the emotion. Is it happy, sad, or angry?",
  "Adaptive Physical Education": "Try a modified game of catch. Can you toss the ball five times?",
  "Assistive Technology": "Use a virtual keyboard to type a short message. Can you send it?"
};

// Activity data for hero and accessibility (from servicess.js)
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

// Accessibility feature functions
function toggleHighContrast() {
  document.body.classList.toggle("high-contrast");
  localStorage.setItem("high-contrast", document.body.classList.contains("high-contrast"));
  alert("High Contrast mode toggled!");
}

function toggleLargeText() {
  document.body.classList.toggle("large-text");
  localStorage.setItem("large-text", document.body.classList.contains("large-text"));
  alert("Large Text mode toggled!");
}

function toggleAudioSupport() {
  alert("Audio Support activated! (This is a demo. Narration would play for page content.)");
}

function toggleSimpleMode() {
  document.body.classList.toggle("simple-mode");
  localStorage.setItem("simple-mode", document.body.classList.contains("simple-mode"));
  alert("Simple Mode toggled!");
}

function resetAll() {
  document.body.classList.remove("high-contrast", "large-text", "simple-mode");
  localStorage.removeItem("high-contrast");
  localStorage.removeItem("large-text");
  localStorage.removeItem("simple-mode");
  alert("All accessibility features reset!");
}

// Load activity details on page load
window.addEventListener("load", () => {
  // Get activity name from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const activity = urlParams.get("activity");
  const titleElement = document.getElementById("activity-title");
  const descriptionElement = document.getElementById("activity-description");
  const hero = document.querySelector(".hero");
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");

  // Set activity content
  if (activity && activityPrompts[activity]) {
    titleElement.textContent = activity;
    descriptionElement.textContent = activityPrompts[activity];
  } else {
    titleElement.textContent = "Skill Not Found";
    descriptionElement.textContent = "Sorry, the requested skill could not be found. Please return to the main page.";
  }

  // Set hero content
  if (activityData[activity]) {
    heroTitle.innerHTML = activityData[activity].heroTitle;
    heroSubtitle.textContent = activityData[activity].heroSubtitle;
    hero.style.background = activityData[activity].heroBackground;

    // Highlight recommended accessibility features
    document.querySelectorAll(".features button").forEach((btn) => {
      btn.classList.remove("recommended");
      if (activityData[activity].accessibilityFeatures.includes(btn.dataset.feature)) {
        btn.classList.add("recommended");
      }
    });
  } else {
    heroTitle.innerHTML = defaultHeroContent.heroTitle;
    heroSubtitle.textContent = defaultHeroContent.heroSubtitle;
    hero.style.background = defaultHeroContent.heroBackground;
    document.querySelectorAll(".features button").forEach((btn) => {
      btn.classList.remove("recommended");
    });
  }

  // Apply accessibility settings from localStorage
  if (localStorage.getItem("high-contrast") === "true") {
    document.body.classList.add("high-contrast");
  }
  if (localStorage.getItem("large-text") === "true") {
    document.body.classList.add("large-text");
  }
  if (localStorage.getItem("simple-mode") === "true") {
    document.body.classList.add("simple-mode");
  }

  // Accessibility button event listeners
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

  // Back button functionality
  document.querySelector(".back-button").addEventListener("click", () => {
    window.location.href = "servicess.html";
  });
});