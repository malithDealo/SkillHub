// Activity prompt text mapping (unchanged)
const activityPrompts = {
  "Memory Match": "Can you find two cards that match? Look at the pictures of animals or shapes and try to pair them up!",
  "Puzzle Time": "Put together a colorful jigsaw puzzle! Start with the corners and find where each piece fits.",
  "Pattern Play": "Look at the sequence: red, blue, red, blue. Can you add the next color in the pattern?",
  "Sound Safari": "Listen carefully! Match the animal sound to the right picture. Is that a lion roaring or a bird chirping?",
  "Texture Touch": "Feel different textures! Touch soft fur, bumpy stones, or smooth silk. Which one do you like best?",
  "Light Chase": "Follow the moving light on the screen with your eyes. Can you keep up as it moves faster?",
  "Story Circle": "Let’s tell a story! Pick a picture card and add one sentence to make a fun story with your friends.",
  "Sign Song": "Learn a sign for 'hello' or 'friend' while singing a fun song. Can you copy the signs?",
  "Emotion Talk": "Look at the faces! Can you match the happy, sad, or surprised face to the right emotion?",
  "Friendship Game": "Pretend you’re sharing your favorite toy! Take turns with a friend and say something kind.",
  "Emotion Charades": "Act out a feeling like happy or sad without words. Can your friend guess what you’re showing?",
  "Group Story": "Add one sentence to a story with your friends. What happens next in your adventure?",
  "Morning Routine": "Let’s get ready for the day! Follow the checklist: brush your teeth, wash your face, and put on your shoes.",
  "Cooking Fun": "Make a simple sandwich! Spread peanut butter on bread and add some jelly. Yum!",
  "Tidy Time": "Sort your toys into colorful bins. Can you put all the red toys in one bin?",
  "Draw & Trace": "Draw a big circle or trace a star shape with your finger or a crayon. Can you make it smooth?",
  "Ball Toss": "Throw a soft ball to a friend and try to catch it when they throw it back. How many catches can you do?",
  "Obstacle Course": "Crawl under a table or jump over a pillow. Can you finish the obstacle course without stopping?",
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

// Activity data for hero and accessibility (from servicess.js, duplicated for Featured Adaptive Skills)
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
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Math with Manipulatives": {
    heroTitle: "Learn Math with Manipulatives",
    heroSubtitle: "Visual and tactile math learning using manipulatives and real-world problems.",
    accessibilityFeatures: ["large-text", "simple-mode"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Creative Expression": {
    heroTitle: "Unleash Creative Expression",
    heroSubtitle: "Art, music, and creative writing adapted to various preferences.",
    accessibilityFeatures: ["simple-mode", "audio-support"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Time Management": {
    heroTitle: "Master Time Management",
    heroSubtitle: "Visual schedules and reminders to build time awareness.",
    accessibilityFeatures: ["simple-mode", "large-text"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Community Skills": {
    heroTitle: "Build Community Skills",
    heroSubtitle: "Learn safety awareness, money management, and participation skills.",
    accessibilityFeatures: ["simple-mode", "audio-support"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Emotional Learning": {
    heroTitle: "Grow with Emotional Learning",
    heroSubtitle: "Develop emotion recognition and coping strategies.",
    accessibilityFeatures: ["audio-support", "large-text"],
    heroBackground: "linear-gradient(to bottom, #2E1A47, #5A3AA3)"
  },
  "Adaptive Physical Education": {
    heroTitle: "Enjoy Adaptive Physical Education",
    heroSubtitle: "Modified sports and movement activities tailored to abilities.",
    accessibilityFeatures: ["simple-mode"],
    heroBackground: "linear-gradient(to bottom, #2E1A47,rgb(58, 163, 112))"
  },
  "Assistive Technology": {
    heroTitle: "Empower with Assistive Technology",
    heroSubtitle: "Use devices and tools to foster independence.",
    accessibilityFeatures: ["audio-support", "high-contrast"],
   heroBackground: "linear-gradient(to bottom, #2E1A47,rgb(58, 163, 70))"
  }
};

// Default hero content for non-featured activities
const defaultHeroContent = {
  heroTitle: '<span class="about-text">Welcome to</span> <span class="skillhub-text">Inclusive Learning</span>',
  heroSubtitle: "Empowering every child with personalized, accessible education tailored to unique abilities",
  heroBackground: "linear-gradient(to bottom, #3B2A6B,rgb(90, 205, 117))"
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
    titleElement.textContent = "Activity Not Found";
    descriptionElement.textContent = "Sorry, the requested activity could not be found. Please return to the main page.";
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
  
  // Add this at the top of activity.js with the other constants
  const DEFAULT_TIMER_DURATION = 15 * 60; // 15 minutes in seconds

  // Add this at the end of the window.addEventListener("load", () => { ... }); in activity.js
    // Timer functionality
    const timerContainer = document.getElementById("timer-container");
    const timerDisplay = document.getElementById("timer");
    const startButton = document.getElementById("start-timer");
    const pauseButton = document.getElementById("pause-timer");
    const resetButton = document.getElementById("reset-timer");
    
    let timerInterval;
    let secondsRemaining = DEFAULT_TIMER_DURATION;
    let isRunning = false;
    
    // Show timer only for featured activities
    if (activityData[activity]) {
      timerContainer.style.display = "block";
    }
    
    // Format time as MM:SS
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }
    
    // Update the timer display
    function updateTimerDisplay() {
      timerDisplay.textContent = formatTime(secondsRemaining);
    }
    
    // Start the timer
    function startTimer() {
      if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
          if (secondsRemaining > 0) {
            secondsRemaining--;
            updateTimerDisplay();
          } else {
            clearInterval(timerInterval);
            isRunning = false;
            alert("Time's up! Great job completing the activity!");
          }
        }, 1000);
      }
    }
    
    // Pause the timer
    function pauseTimer() {
      clearInterval(timerInterval);
      isRunning = false;
    }
    
    // Reset the timer
    function resetTimer() {
      pauseTimer();
      secondsRemaining = DEFAULT_TIMER_DURATION;
      updateTimerDisplay();
    }
    
    // Event listeners for timer controls
    startButton.addEventListener("click", startTimer);
    pauseButton.addEventListener("click", pauseTimer);
    resetButton.addEventListener("click", resetTimer);
    
    // Initialize timer display
    updateTimerDisplay();
    
  // Back button functionality
  document.querySelector(".back-button").addEventListener("click", () => {
    window.location.href = "servicess.html";
  });
});