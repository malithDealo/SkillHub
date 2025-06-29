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

  // Animate sections on scroll
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

  // Animate difference cards on scroll
  const differenceCards = document.querySelectorAll(".difference-card");
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

  differenceCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
    cardObserver.observe(card);
  });

  // Animate team members on scroll
  const teamMembers = document.querySelectorAll(".team-member");
  const teamObserver = new IntersectionObserver(
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

  teamMembers.forEach((member, index) => {
    member.style.opacity = "0";
    member.style.transform = "translateY(40px)";
    member.style.transition = `opacity 0.8s ease ${
      index * 0.2
    }s, transform 0.8s ease ${index * 0.2}s`;
    teamObserver.observe(member);
  });

  // Mission icon animation
  const missionIcon = document.querySelector(".mission-icon");
  const missionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iconCircle = entry.target.querySelector(".icon-circle");
          iconCircle.style.transform = "scale(1.1)";
          iconCircle.style.animation = "pulse 2s infinite";
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  if (missionIcon) {
    missionObserver.observe(missionIcon);
  }

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

  // Add CSS for animations
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
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1.1);
            }
            50% {
                transform: scale(1.2);
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
        
        .animate-in {
            animation: slideInUp 0.8s ease-out;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
  document.head.appendChild(style);

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
    "button, a, .difference-card, .team-member"
  );
  interactiveElements.forEach((element) => {
    element.style.transition = "all 0.3s ease";
  });

  // Console log for developers
  console.log("🎓 SkillHub About Page - Learn. Connect. Grow Together! 🚀");
  console.log("✅ All About page features initialized successfully!");
});
