// home.js - Enhanced with authentication integration
document.addEventListener('DOMContentLoaded', () => {
  console.log('🏠 Home page JavaScript loaded');

  // Wait for auth system to initialize
  setTimeout(() => {
      initializePage();
  }, 300);
});

function initializePage() {
  // Initialize page features
  initializeDotsAnimation();
  initializeStatsAnimation();
  setupButtonHandlers();
  updateUIBasedOnAuth();
  
  console.log('✅ Home page initialized');
}

// Initialize animated dots background
function initializeDotsAnimation() {
  const dotsLayer = document.getElementById('dotsLayer');
  if (!dotsLayer) return;

  // Create animated dots
  for (let i = 0; i < 30; i++) {
      const dot = document.createElement('div');
      dot.className = 'animated-dot';
      dot.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
      `;
      dotsLayer.appendChild(dot);
  }

  // Add floating animation CSS if not already added
  if (!document.getElementById('floating-animation')) {
      const style = document.createElement('style');
      style.id = 'floating-animation';
      style.textContent = `
          @keyframes float {
              0%, 100% { transform: translateY(0px); opacity: 0.6; }
              50% { transform: translateY(-20px); opacity: 1; }
          }
      `;
      document.head.appendChild(style);
  }
}

// Initialize stats counter animation
function initializeStatsAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const observerOptions = {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const target = parseInt(entry.target.getAttribute('data-target'));
              animateCounter(entry.target, target);
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);

  statNumbers.forEach(number => {
      observer.observe(number);
  });
}

// Animate counter from 0 to target
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 60; // Complete in roughly 1 second (60fps)
  
  const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
          element.textContent = target.toLocaleString();
          clearInterval(timer);
      } else {
          element.textContent = Math.floor(current).toLocaleString();
      }
  }, 16); // ~60fps
}

// Setup button click handlers
function setupButtonHandlers() {
  // Find Teachers Near Me button
  const findTeachersBtn = document.getElementById('findTeachersBtn');
  if (findTeachersBtn) {
      findTeachersBtn.addEventListener('click', handleFindTeachers);
  }

  // Start Teaching Today button
  const startTeachingBtn = document.getElementById('startTeachingBtn');
  if (startTeachingBtn) {
      startTeachingBtn.addEventListener('click', handleStartTeaching);
  }

  // Get Started Today button
  const getStartedBtn = document.getElementById('getStartedBtn');
  if (getStartedBtn) {
      getStartedBtn.addEventListener('click', handleGetStarted);
  }

  console.log('✅ Button handlers setup complete');
}

// Handle "Find Teachers Near Me" button click
function handleFindTeachers(e) {
  e.preventDefault();
  console.log('🔍 Find Teachers button clicked');

  // Check if user is authenticated
  if (window.SkillHubAuth && window.SkillHubAuth.isUserAuthenticated()) {
      const user = window.SkillHubAuth.getCurrentUser();
      console.log('User is authenticated, redirecting to appropriate dashboard');
      
      // Redirect to appropriate dashboard
      const redirectMap = {
          learner: 'dashboard.html',
          teacher: 'profile_settings.html',
          sponsor: 'sponsordashboard1.html'
      };
      
      const redirectUrl = redirectMap[user.type] || 'dashboard.html';
      window.location.href = redirectUrl;
  } else {
      // Show sign up modal with learner pre-selected
      console.log('User not authenticated, showing signup options');
      if (window.SkillHubAuth) {
          window.SkillHubAuth.showSignUpOptions();
      } else {
          // Fallback: direct to learner signup
          window.location.href = 'signup-learner.html';
      }
  }
}

// Handle "Start Teaching Today" button click
function handleStartTeaching(e) {
  e.preventDefault();
  console.log('🎓 Start Teaching button clicked');

  // Check if user is authenticated
  if (window.SkillHubAuth && window.SkillHubAuth.isUserAuthenticated()) {
      const user = window.SkillHubAuth.getCurrentUser();
      console.log('User is authenticated, checking user type');
      
      if (user.type === 'teacher') {
          // User is already a teacher, go to dashboard
          window.location.href = 'profile_settings.html';
      } else {
          // User is not a teacher, suggest creating teacher account
          if (confirm('You need a teacher account to start teaching. Would you like to create one?')) {
              window.location.href = 'signup-teacher.html';
          }
      }
  } else {
      // Show teacher signup
      console.log('User not authenticated, redirecting to teacher signup');
      window.location.href = 'signup-teacher.html';
  }
}

// Handle "Get Started Today" button click
function handleGetStarted(e) {
  e.preventDefault();
  console.log('🚀 Get Started button clicked');

  // Check if user is authenticated
  if (window.SkillHubAuth && window.SkillHubAuth.isUserAuthenticated()) {
      const user = window.SkillHubAuth.getCurrentUser();
      console.log('User is authenticated, redirecting to dashboard');
      
      // Redirect to appropriate dashboard
      const redirectMap = {
          learner: 'dashboard.html',
          teacher: 'profile_settings.html',
          sponsor: 'sponsordashboard1.html'
      };
      
      const redirectUrl = redirectMap[user.type] || 'dashboard.html';
      window.location.href = redirectUrl;
  } else {
      // Show sign up options
      console.log('User not authenticated, showing signup options');
      if (window.SkillHubAuth) {
          window.SkillHubAuth.showSignUpOptions();
      } else {
          // Fallback: direct to learner signup
          window.location.href = 'signup-learner.html';
      }
  }
}

// Update UI based on authentication status
function updateUIBasedOnAuth() {
  // Wait a moment for auth system to initialize
  setTimeout(() => {
      if (window.SkillHubAuth && window.SkillHubAuth.isUserAuthenticated()) {
          const user = window.SkillHubAuth.getCurrentUser();
          console.log('✅ User is authenticated, customizing experience for:', user.type);
          
          // Update button text based on user type
          const findTeachersBtn = document.getElementById('findTeachersBtn');
          const startTeachingBtn = document.getElementById('startTeachingBtn');
          const getStartedBtn = document.getElementById('getStartedBtn');
          
          if (user.type === 'learner') {
              if (findTeachersBtn) findTeachersBtn.innerHTML = 'Go to My Dashboard <span class="btn-arrow">→</span>';
              if (getStartedBtn) getStartedBtn.textContent = 'Go to Dashboard';
          } else if (user.type === 'teacher') {
              if (findTeachersBtn) findTeachersBtn.innerHTML = 'Go to My Dashboard <span class="btn-arrow">→</span>';
              if (startTeachingBtn) startTeachingBtn.innerHTML = 'Go to Teaching Dashboard <span class="btn-arrow">→</span>';
              if (getStartedBtn) getStartedBtn.textContent = 'Go to Dashboard';
          } else if (user.type === 'sponsor') {
              if (findTeachersBtn) findTeachersBtn.innerHTML = 'Go to My Dashboard <span class="btn-arrow">→</span>';
              if (startTeachingBtn) startTeachingBtn.innerHTML = 'Explore Teaching Opportunities <span class="btn-arrow">→</span>';
              if (getStartedBtn) getStartedBtn.textContent = 'Go to Dashboard';
          }
      } else {
          console.log('❌ User not authenticated, showing default experience');
      }
  }, 100);
}

// Initialize smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
          target.scrollIntoView({
              behavior: 'smooth'
          });
      }
  });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector('.hero-bg-image');
  if (heroBackground) {
      heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Ensure navbar loads properly when page becomes visible
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
      // Page became visible, check if navbar is loaded
      const navbarContainer = document.getElementById('navbar-container');
      if (navbarContainer && navbarContainer.innerHTML.trim() === '') {
          console.log('🔄 Page visible but navbar empty, forcing reload');
          if (window.SkillHubAuth) {
              window.SkillHubAuth.refreshAuthState();
          }
      }
  }
});

console.log('✅ Home page script loaded');