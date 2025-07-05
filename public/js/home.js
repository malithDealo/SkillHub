// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only prevent default if it's an anchor link
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

  const dotsLayer = document.getElementById("dotsLayer");

  function createDot() {
    const dot = document.createElement("div");
    dot.classList.add("dot");

    const size = Math.random() * 4 + 2; // 2px to 6px
    const left = Math.random() * 100; // percentage
    const duration = Math.random() * 10 + 5; // 5s to 15s
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${left}%`;
    dot.style.bottom = `-10px`;
    dot.style.animationDuration = `${duration}s`;

    dotsLayer.appendChild(dot); // Remove dot after animation

    setTimeout(() => {
      dotsLayer.removeChild(dot);
    }, duration * 1000);
  }

  // Create dots continuously
  setInterval(createDot, 70);

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
  const statsSection = document.querySelector(".community-stats");
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

  // Animate feature cards on scroll
  const featureCards = document.querySelectorAll(".feature-card");
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

  featureCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    cardObserver.observe(card);
  });

  // Animate steps on scroll
  const steps = document.querySelectorAll(".step");
  const stepObserver = new IntersectionObserver(
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

  steps.forEach((step, index) => {
    step.style.opacity = "0";
    step.style.transform =
      index % 2 === 0 ? "translateX(-50px)" : "translateX(50px)";
    step.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    stepObserver.observe(step);
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

  // Mobile menu toggle (for future implementation)
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".nav-menu");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      navMenu.classList.toggle("active");
    });
  }

  // Add loading animation
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });

  // Parallax effect for hero section
  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector(".hand-illustration");
    if (heroImage) {
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Add click ripple effect to buttons
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Console log for developers
  console.log("🎓 SkillHub - Learn. Connect. Grow Together! 🚀");

  // Add CSS for ripple effect
  const style = document.createElement("style");
  style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .loaded {
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);

  // Add intersection observer for general animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe all sections for animations
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Add keyboard navigation support
  document.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      document.body.classList.add("keyboard-navigation");
    }
  });

  document.addEventListener("mousedown", function () {
    document.body.classList.remove("keyboard-navigation");
  });

  // Performance optimization - lazy load images if any
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });

  // Add smooth transitions for all interactive elements
  const interactiveElements = document.querySelectorAll(
    "button, a, .feature-card, .step"
  );
  interactiveElements.forEach((element) => {
    element.style.transition = "all 0.3s ease";
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

  // Initialize all features
  console.log("✅ All SkillHub features initialized successfully!");
});
