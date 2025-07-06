// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Animated counter for community stats
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    const speed = 50;

    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      let count = 0;
      const increment = target / speed;

      const updateCounter = () => {
        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(updateCounter, 30);
        } else {
          counter.innerText = target;
        }
      };

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
          setTimeout(() => {
            animateCounters();
          }, 200);
          statsAnimated = true;
        }
      });
    },
    { threshold: 0.3 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // Club data
  const clubData = {
    science: {
      title: "Science Club",
      description:
        "Learn and gain insights of Science in the new world and connect with fellow individuals",
      members: 156,
      events: 12,
      discussions: 89,
      memberList: [
        { name: "John Smith", role: "Organizer", avatar: "J" },
        { name: "Sarah Johnson", role: "Member", avatar: "S" },
        { name: "Mike Wilson", role: "Member", avatar: "M" },
        { name: "Emma Davis", role: "Moderator", avatar: "E" },
        { name: "David Brown", role: "Member", avatar: "D" },
        { name: "Lisa Garcia", role: "Member", avatar: "L" },
        { name: "Tom Anderson", role: "Member", avatar: "T" },
        { name: "Amy Chen", role: "Member", avatar: "A" },
      ],
    },
    maths: {
      title: "Maths Club",
      description:
        "Learn and gain insights of Maths in the new world and connect with fellow individuals",
      members: 89,
      events: 8,
      discussions: 45,
      memberList: [
        { name: "Alex Turner", role: "Organizer", avatar: "A" },
        { name: "Maria Rodriguez", role: "Member", avatar: "M" },
        { name: "James Lee", role: "Member", avatar: "J" },
        { name: "Nina Patel", role: "Moderator", avatar: "N" },
        { name: "Robert Kim", role: "Member", avatar: "R" },
        { name: "Sophie White", role: "Member", avatar: "S" },
      ],
    },
    commerce: {
      title: "Commerce Club",
      description:
        "Learn and gain insights of commerce in the new world and connect with fellow individuals",
      members: 124,
      events: 15,
      discussions: 67,
      memberList: [
        { name: "Chris Evans", role: "Organizer", avatar: "C" },
        { name: "Jessica Park", role: "Member", avatar: "J" },
        { name: "Daniel Moore", role: "Member", avatar: "D" },
        { name: "Rachel Green", role: "Moderator", avatar: "R" },
        { name: "Kevin Zhang", role: "Member", avatar: "K" },
        { name: "Linda Taylor", role: "Member", avatar: "L" },
        { name: "Mark Thompson", role: "Member", avatar: "M" },
      ],
    },
    art: {
      title: "Art Club",
      description:
        "Learn and gain insights of art in the new world and connect with fellow individuals",
      members: 78,
      events: 6,
      discussions: 34,
      memberList: [
        { name: "Isabella Martinez", role: "Organizer", avatar: "I" },
        { name: "Vincent Price", role: "Member", avatar: "V" },
        { name: "Clara Bell", role: "Member", avatar: "C" },
        { name: "Pablo Santos", role: "Moderator", avatar: "P" },
        { name: "Grace Adams", role: "Member", avatar: "G" },
        { name: "Henry Foster", role: "Member", avatar: "H" },
      ],
    },
  };

  // Get elements
  const clubCards = document.querySelectorAll(".club-card");
  const clubDetailPage = document.getElementById("clubDetailPage");
  const closeClubBtn = document.getElementById("closeClubBtn");
  const chatModal = document.getElementById("chatModal");
  const closeChatBtn = document.getElementById("closeChatBtn");
  const eventModal = document.getElementById("eventModal");
  const closeEventModal = document.getElementById("closeEventModal");

  let currentClub = null;

  // Club card click handlers
  clubCards.forEach((card) => {
    const joinBtn = card.querySelector(".join-club-btn");

    // Join button
    joinBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (this.textContent === "Join") {
        this.textContent = "Joined";
        this.style.background = "#28a745";
        this.disabled = true;
        showNotification("Successfully joined the club!");
      }
    });

    // Card click (open club detail) - only if not clicking on join button
    card.addEventListener("click", function (e) {
      // Prevent opening club detail if clicking on join button
      if (e.target.classList.contains("join-club-btn")) {
        return;
      }

      const clubType = this.getAttribute("data-club");
      openClubDetail(clubType);
    });
  });

  // Open club detail page
  function openClubDetail(clubType) {
    currentClub = clubType;
    const club = clubData[clubType];

    document.getElementById("clubDetailTitle").textContent = club.title;
    document.getElementById("clubDetailDescription").textContent =
      club.description;
    document.getElementById("clubMemberCount").textContent = club.members;
    document.getElementById("clubEventCount").textContent = club.events;
    document.getElementById("clubDiscussionCount").textContent =
      club.discussions;

    // Populate members
    const membersGrid = document.getElementById("membersGrid");
    membersGrid.innerHTML = "";

    club.memberList.forEach((member) => {
      const memberCard = document.createElement("div");
      memberCard.className = "member-card";
      memberCard.innerHTML = `
            <div class="member-avatar">${member.avatar}</div>
            <div class="member-info">
              <div class="member-name">${member.name}</div>
              <div class="member-role">${member.role}</div>
            </div>
          `;
      membersGrid.appendChild(memberCard);
    });

    clubDetailPage.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close club detail page
  closeClubBtn.addEventListener("click", function () {
    clubDetailPage.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Club action handlers
  document
    .getElementById("addEventAction")
    .addEventListener("click", function () {
      openEventModal();
    });

  document
    .getElementById("groupChatAction")
    .addEventListener("click", function () {
      openChat(currentClub);
    });

  document
    .getElementById("viewEventsAction")
    .addEventListener("click", function () {
      showNotification("Events page would open here!");
    });

  // Open chat modal
  function openChat(clubType) {
    const club = clubData[clubType];
    document.getElementById("chatTitle").textContent = `${club.title} Chat`;
    chatModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close chat modal
  closeChatBtn.addEventListener("click", function () {
    chatModal.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  // Chat functionality
  const chatInputField = document.getElementById("chatInputField");
  const sendMessageBtn = document.getElementById("sendMessageBtn");
  const chatMessages = document.getElementById("chatMessages");

  function sendMessage() {
    const message = chatInputField.value.trim();
    if (message) {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message own";
      messageDiv.innerHTML = `
            <div class="message-avatar">Y</div>
            <div class="message-content">${message}</div>
          `;
      chatMessages.appendChild(messageDiv);
      chatInputField.value = "";
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  sendMessageBtn.addEventListener("click", sendMessage);
  chatInputField.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Event modal functionality
  function openEventModal() {
    eventModal.classList.add("active");
    // Don't hide club detail page - show modal on top

    // Set minimum date to today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("eventDate").min = today;
  }

  closeEventModal.addEventListener("click", function () {
    eventModal.classList.remove("active");
    // Don't restore overflow - keep club page open
  });

  document
    .getElementById("cancelEventBtn")
    .addEventListener("click", function () {
      eventModal.classList.remove("active");
      // Don't restore overflow - keep club page open
    });

  // Event form submission
  document.getElementById("eventForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const eventData = {};
    for (let [key, value] of formData.entries()) {
      eventData[key] = value;
    }

    // Add current club info to event data
    if (currentClub) {
      eventData.club = clubData[currentClub].title;
    }

    console.log("Event created:", eventData);
    showNotification(
      "Event created successfully for " + (eventData.club || "the club") + "!"
    );

    eventModal.classList.remove("active");
    // Don't restore overflow - keep club page open
    this.reset();
  });

  // Close modals when clicking outside
  chatModal.addEventListener("click", function (e) {
    if (e.target === chatModal) {
      chatModal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  eventModal.addEventListener("click", function (e) {
    if (e.target === eventModal) {
      eventModal.classList.remove("active");
      // Don't restore overflow - keep club page open
    }
  });

  // Close modals with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (chatModal.classList.contains("active")) {
        chatModal.classList.remove("active");
        document.body.style.overflow = "hidden"; // Keep club page overflow hidden
      }
      if (eventModal.classList.contains("active")) {
        eventModal.classList.remove("active");
        // Don't restore overflow - keep club page open
      }
      if (clubDetailPage.classList.contains("active")) {
        clubDetailPage.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    }
  });

  // Show notification
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #4CAF50;
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          z-index: 4000;
          font-weight: 600;
          box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
          animation: slideInRight 0.3s ease-out;
        `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Add animation CSS
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
      `;
  document.head.appendChild(style);

  // Event card interactions
  const eventCards = document.querySelectorAll(".event-card");
  eventCards.forEach((card) => {
    card.addEventListener("click", function () {
      const eventTitle = this.querySelector("h3").textContent;
      const eventDate = this.querySelector(".date-badge").textContent;
      showNotification(`Event: ${eventTitle} on ${eventDate}`);
    });

    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-5px)";
    });
  });

  // Newsletter subscription
  const newsletterForm = document.querySelector(".newsletter");
  if (newsletterForm) {
    const emailInput = newsletterForm.querySelector("input");
    const subscribeBtn = newsletterForm.querySelector("button");

    subscribeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (email && isValidEmail(email)) {
        showNotification("Thank you for subscribing!");
        emailInput.value = "";
      } else {
        showNotification("Please enter a valid email address.");
      }
    });
  }

  // Email validation function
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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

  console.log("🎓 SkillHub Community Page - Connect and Grow Together! 🚀");
  console.log("✅ All Community page features initialized successfully!");
});
