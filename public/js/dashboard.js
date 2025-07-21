// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const pageContents = document.querySelectorAll(".page-content");
  const logoutBtn = document.querySelector(".logout-btn");

  // Profile picture elements
  const profilePicture = document.getElementById("profilePicture");
  const profileImage = document.getElementById("profileImage");
  const profilePlaceholder = document.getElementById("profilePlaceholder");
  const uploadBtn = document.getElementById("uploadBtn");
  const removeBtn = document.getElementById("removeBtn");
  const fileInput = document.getElementById("fileInput");

  // Club navigation mapping
  const clubMapping = {
    "Science club": "science",
    "Art club": "art",
    "Maths club": "maths",
    "Commerce club": "commerce",
  };

  // Wishlist functionality
  function loadWishlistItems() {
    const wishlist = localStorage.getItem("skillWishlist");
    const wishlistItems = wishlist ? JSON.parse(wishlist) : [];

    const wishlistSection = document.querySelector(
      "#my-learning .content-section:last-child"
    );
    const wishlistContainer =
      wishlistSection.querySelector(".course-item").parentNode;

    // Clear existing wishlist items (keep only the default one as template)
    const existingItems = wishlistContainer.querySelectorAll(".course-item");
    existingItems.forEach((item, index) => {
      if (index > 0) {
        // Keep first item as template, remove others
        item.remove();
      }
    });

    if (wishlistItems.length === 0) {
      // Hide the default item if no wishlist items
      existingItems[0].style.display = "none";
      const noItemsMessage = document.createElement("p");
      noItemsMessage.className = "no-wishlist-items";
      noItemsMessage.textContent =
        "No items in your wishlist yet. Add skills from Find Teachers page!";
      noItemsMessage.style.color = "#666";
      noItemsMessage.style.fontStyle = "italic";
      noItemsMessage.style.padding = "1rem 0";
      wishlistContainer.appendChild(noItemsMessage);
      return;
    }

    // Show the default item and update it with first wishlist item
    existingItems[0].style.display = "flex";
    updateWishlistItem(existingItems[0], wishlistItems[0]);

    // Add additional wishlist items
    for (let i = 1; i < wishlistItems.length; i++) {
      const wishlistItem = createWishlistItem(wishlistItems[i]);
      wishlistContainer.appendChild(wishlistItem);
    }
  }

  function updateWishlistItem(element, wishlistData) {
    const iconElement = element.querySelector(".course-icon");
    const nameElement = element.querySelector("h3");
    const progressElement = element.querySelector(".course-progress");
    const buttonElement = element.querySelector(".btn-primary");

    iconElement.textContent = wishlistData.courseIcon;
    nameElement.textContent = wishlistData.skillName;
    progressElement.textContent = `Saved for later • ${
      wishlistData.availableTeachers || 0
    } teachers available`;

    // Update button functionality
    buttonElement.textContent = "Explore";
    buttonElement.onclick = function () {
      exploreSkill(wishlistData.skillName);
    };

    // Add remove button
    addRemoveButton(element, wishlistData.skillName);
  }

  function createWishlistItem(wishlistData) {
    const courseItem = document.createElement("div");
    courseItem.className = "course-item";
    courseItem.innerHTML = `
      <div class="course-icon">${wishlistData.courseIcon}</div>
      <div class="course-info">
        <h3>${wishlistData.skillName}</h3>
        <p class="course-progress">
          Saved for later • ${
            wishlistData.availableTeachers || 0
          } teachers available
        </p>
      </div>
      <button class="btn-primary" onclick="exploreSkill('${
        wishlistData.skillName
      }')">Explore</button>
    `;

    addRemoveButton(courseItem, wishlistData.skillName);
    return courseItem;
  }

  function addRemoveButton(element, skillName) {
    const actionsContainer = document.createElement("div");
    actionsContainer.className = "wishlist-actions";
    actionsContainer.style.display = "flex";
    actionsContainer.style.gap = "0.5rem";
    actionsContainer.style.alignItems = "center";

    const exploreBtn = element.querySelector(".btn-primary");
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-outline remove-wishlist-btn";
    removeBtn.innerHTML = "🗑️";
    removeBtn.style.padding = "6px 8px";
    removeBtn.style.fontSize = "0.9rem";
    removeBtn.title = "Remove from wishlist";
    removeBtn.onclick = function (e) {
      e.stopPropagation();
      removeFromWishlist(skillName, element);
    };

    // Replace the button with actions container
    exploreBtn.parentNode.replaceChild(actionsContainer, exploreBtn);
    actionsContainer.appendChild(exploreBtn);
    actionsContainer.appendChild(removeBtn);
  }

  function removeFromWishlist(skillName, element) {
    if (confirm(`Remove ${skillName} from your wishlist?`)) {
      // Remove from localStorage
      const wishlist = localStorage.getItem("skillWishlist");
      const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
      const updatedWishlist = wishlistItems.filter(
        (item) => item.skillName !== skillName
      );
      localStorage.setItem("skillWishlist", JSON.stringify(updatedWishlist));

      // Remove from DOM
      element.remove();

      // Show success message
      showNotification(`${skillName} removed from your wishlist!`, "success");

      // Reload wishlist to handle empty state
      setTimeout(loadWishlistItems, 100);
    }
  }

  function exploreSkill(skillName) {
    // Store the skill to explore in localStorage for the services page
    localStorage.setItem("exploreSkill", skillName);

    // Navigate to Find Teachers page
    window.location.href = "services.html";
  }

  // Function to navigate to specific club in community page
  function navigateToClub(clubName) {
    const clubKey = clubMapping[clubName];
    if (clubKey) {
      // Store the target club in localStorage
      localStorage.setItem("targetClub", clubKey);
      // Navigate to community page
      window.location.href = "community.html";
    } else {
      console.error("Club mapping not found for:", clubName);
      // Fallback - just navigate to community page
      window.location.href = "community.html";
    }
  }

  // Navigation functionality
  function showPage(pageId) {
    // Hide all pages
    pageContents.forEach((page) => {
      page.classList.remove("active");
    });

    // Remove active class from all sidebar links
    sidebarLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Add active class to clicked sidebar link
    const activeLink = document.querySelector(`[data-page="${pageId}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }

    // Load wishlist when My Learning page is shown
    if (pageId === "my-learning") {
      setTimeout(loadWishlistItems, 100);
    }

    // Load clubs when Clubs page is shown
    if (pageId === "learning-group") {
      setTimeout(() => {
        loadJoinedClubs();
        updateDiscoverClubs();
      }, 100);
    }
  }

  // Sidebar navigation click handlers
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const pageId = this.dataset.page;
      showPage(pageId);

      // Update URL hash
      window.location.hash = pageId;
    });
  });

  // Handle URL hash on page load
  function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
      showPage(hash);
    } else {
      showPage("overview"); // Default to overview page
    }
  }

  // Listen for hash changes
  window.addEventListener("hashchange", handleHashChange);

  // Initialize page based on current hash
  handleHashChange();

  // Load clubs data on initial page load if on clubs page
  if (window.location.hash === "#learning-group") {
    setTimeout(() => {
      loadJoinedClubs();
      updateDiscoverClubs();
    }, 100);
  }

  // Profile Picture Upload Functionality
  function setupProfilePictureUpload() {
    if (!uploadBtn || !fileInput) return; // Safety check

    // Upload button click handler
    uploadBtn.addEventListener("click", function () {
      fileInput.click();
    });

    // File input change handler
    fileInput.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    });

    // Remove button click handler
    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        removeProfilePicture();
      });
    }

    // Drag and drop functionality
    if (profilePicture) {
      profilePicture.addEventListener("dragover", function (e) {
        e.preventDefault();
        this.classList.add("drag-over");
      });

      profilePicture.addEventListener("dragleave", function (e) {
        e.preventDefault();
        this.classList.remove("drag-over");
      });

      profilePicture.addEventListener("drop", function (e) {
        e.preventDefault();
        this.classList.remove("drag-over");

        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const file = files[0];
          if (file.type.startsWith("image/")) {
            handleFileUpload(file);
          } else {
            showNotification("Please upload an image file.", "error");
          }
        }
      });
    }
  }

  // Handle file upload
  function handleFileUpload(file) {
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      showNotification("File size should be less than 5MB.", "error");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification("Please upload an image file.", "error");
      return;
    }

    // Read and display the file
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Update profile image
      if (profileImage) {
        profileImage.src = imageUrl;
        profileImage.style.display = "block";
      }
      if (profilePlaceholder) {
        profilePlaceholder.style.display = "none";
      }

      // Show remove button
      if (removeBtn) {
        removeBtn.style.display = "flex";
      }

      // Show success message
      showNotification("Profile picture updated successfully!", "success");

      // Store image in localStorage for persistence (in a real app, this would be uploaded to a server)
      localStorage.setItem("profileImage", imageUrl);
    };

    reader.onerror = function () {
      showNotification("Error reading file. Please try again.", "error");
    };

    reader.readAsDataURL(file);
  }

  // Remove profile picture
  function removeProfilePicture() {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      if (profileImage) {
        profileImage.style.display = "none";
      }
      if (profilePlaceholder) {
        profilePlaceholder.style.display = "flex";
      }
      if (removeBtn) {
        removeBtn.style.display = "none";
      }

      // Clear stored image
      localStorage.removeItem("profileImage");

      showNotification("Profile picture removed.", "success");
    }
  }

  // Load stored profile picture on page load
  function loadStoredProfilePicture() {
    const storedImage = localStorage.getItem("profileImage");
    if (storedImage && profileImage && profilePlaceholder && removeBtn) {
      profileImage.src = storedImage;
      profileImage.style.display = "block";
      profilePlaceholder.style.display = "none";
      removeBtn.style.display = "flex";
    }
  }

  // Show notification
  function showNotification(message, type = "success") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".upload-success");
    existingNotifications.forEach((notification) => notification.remove());

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `upload-success ${type}`;
    notification.textContent = message;

    // Style for error messages
    if (type === "error") {
      notification.style.background = "#dc3545";
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Initialize profile picture functionality
  setupProfilePictureUpload();
  loadStoredProfilePicture();

  // Logout functionality
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to log out?")) {
        // Clear stored data
        localStorage.removeItem("profileImage");
        localStorage.removeItem("skillWishlist");
        alert("Logged out successfully!");
        // In real app, redirect to login page
        // window.location.href = 'login.html';
      }
    });
  }

  // Function to load and display joined clubs in My Clubs section
  function loadJoinedClubs() {
    const joinedClubs = JSON.parse(localStorage.getItem("joinedClubs") || "[]");
    const myClubsContainer = document.getElementById("myClubsContainer");

    if (!myClubsContainer) return;

    // Clear existing clubs
    myClubsContainer.innerHTML = "";

    if (joinedClubs.length === 0) {
      // Show message if no clubs joined
      const noClubsMessage = document.createElement("div");
      noClubsMessage.className = "no-clubs-message";
      noClubsMessage.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
          <h3 style="margin-bottom: 0.5rem; color: #333;">No Clubs Joined Yet</h3>
          <p style="margin-bottom: 1.5rem;">Discover amazing clubs in the Community section and start connecting with like-minded learners!</p>
          <button onclick="window.location.href='community.html'" style="background: #4caf50; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Explore Clubs
          </button>
        </div>
      `;
      myClubsContainer.appendChild(noClubsMessage);
      return;
    }

    // Add joined clubs to the section
    joinedClubs.forEach((club) => {
      const clubItem = createClubItem(club);
      myClubsContainer.appendChild(clubItem);
    });
  }

  // Create a club item element for My Clubs section
  function createClubItem(club) {
    const clubItem = document.createElement("div");
    clubItem.className = "group-item";

    // Get additional club details
    const clubDetails = getClubDetails(club.key);

    clubItem.innerHTML = `
      <div class="group-info">
        <h3>${club.title}</h3>
        <p class="group-details">${clubDetails.members} members • ${clubDetails.activity}</p>
      </div>
      <button class="btn-secondary view-club-btn">View</button>
    `;

    // Add click handler for the View button
    const viewBtn = clubItem.querySelector(".view-club-btn");
    viewBtn.addEventListener("click", function () {
      navigateToClub(club.title);
    });

    return clubItem;
  }

  // Get club details based on club key
  function getClubDetails(clubKey) {
    const clubDetailsMap = {
      science: { members: 156, activity: "Next meetup: Sunday 3PM" },
      art: { members: 78, activity: "Active discussions" },
      maths: { members: 89, activity: "Weekly problem sessions" },
      commerce: { members: 124, activity: "Business case discussions" },
    };

    return (
      clubDetailsMap[clubKey] || { members: 0, activity: "Active community" }
    );
  }

  // Update discover clubs section to show all clubs (user can join from community page)
  function updateDiscoverClubs() {
    const discoverClubsSection = document.querySelector(
      "#learning-group .content-section:last-child"
    );
    if (!discoverClubsSection) return;

    // Clear existing discover clubs
    const existingClubs = discoverClubsSection.querySelectorAll(".group-item");
    existingClubs.forEach((club) => club.remove());

    // Define all available clubs for discovery
    const allClubs = [
      {
        key: "science",
        title: "Science club",
        description:
          "Learn insights of Science and connect with fellow individuals",
      },
      {
        key: "art",
        title: "Art club",
        description: "Explore creativity and artistic expressions",
      },
      {
        key: "maths",
        title: "Maths club",
        description: "Weekly problem solving sessions",
      },
      {
        key: "commerce",
        title: "Commerce club",
        description: "Business case discussions",
      },
    ];

    // Add all clubs to discover section (joining happens in community page)
    allClubs.forEach((club) => {
      const clubDetails = getClubDetails(club.key);
      const clubItem = document.createElement("div");
      clubItem.className = "group-item discover-club-item";
      clubItem.innerHTML = `
        <div class="group-info">
          <h3>${club.title}</h3>
          <p class="group-details">${clubDetails.members} members • ${club.description}</p>
        </div>
      `;

      // Add click handler to navigate to club
      clubItem.style.cursor = "pointer";
      clubItem.addEventListener("click", function () {
        navigateToClub(club.title);
      });

      // Add hover effect
      clubItem.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 4px 12px rgba(76, 175, 80, 0.2)";
      });

      clubItem.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0)";
        this.style.boxShadow = "0 2px 8px rgba(76, 175, 80, 0.1)";
      });

      discoverClubsSection.appendChild(clubItem);
    });
  }

  // Session management functionality
  const rescheduleBtns = document.querySelectorAll(".btn-outline");
  rescheduleBtns.forEach((btn) => {
    if (btn.textContent === "Reschedule") {
      btn.addEventListener("click", function () {
        const sessionItem = this.closest(".session-item");
        if (sessionItem) {
          const sessionName = sessionItem.querySelector("h3").textContent;
          const newDate = prompt(
            `Reschedule ${sessionName}\nEnter new date and time:`
          );
          if (newDate && newDate.trim()) {
            alert(`${sessionName} rescheduled to: ${newDate.trim()}`);
            // Update the session details
            const detailsElement =
              sessionItem.querySelector(".session-details");
            if (detailsElement) {
              detailsElement.textContent = newDate.trim();
            }
          }
        }
      });
    }

    if (btn.textContent === "Cancel") {
      btn.addEventListener("click", function () {
        const sessionItem = this.closest(".session-item");
        if (sessionItem) {
          const sessionName = sessionItem.querySelector("h3").textContent;
          if (confirm(`Are you sure you want to cancel ${sessionName}?`)) {
            sessionItem.style.opacity = "0.5";
            sessionItem.style.textDecoration = "line-through";
            this.textContent = "Cancelled";
            this.disabled = true;
            alert(`${sessionName} has been cancelled.`);
          }
        }
      });
    }
  });

  // Profile editing functionality
  const editBtns = document.querySelectorAll(".btn-primary");
  editBtns.forEach((btn) => {
    if (btn.textContent === "Edit") {
      btn.addEventListener("click", function () {
        const section = this.closest(".content-section");
        const formGroups = section.querySelectorAll(
          ".form-group:not(.profile-picture-group)"
        );

        formGroups.forEach((group) => {
          const valueDiv = group.querySelector(".form-value");
          if (valueDiv) {
            const currentValue = valueDiv.textContent;
            const input = document.createElement("input");
            input.type = "text";
            input.value = currentValue;
            input.className = "form-input";
            input.style.padding = "8px";
            input.style.border = "1px solid #ddd";
            input.style.borderRadius = "4px";
            input.style.fontSize = "1rem";
            valueDiv.replaceWith(input);
          }
        });

        this.textContent = "Save";
        this.onclick = function () {
          // Save the edited values
          const inputs = section.querySelectorAll(".form-input");
          inputs.forEach((input) => {
            const valueDiv = document.createElement("div");
            valueDiv.className = "form-value";
            valueDiv.textContent = input.value;
            input.replaceWith(valueDiv);
          });

          this.textContent = "Edit";
          this.onclick = null;
          showNotification("Profile information updated successfully!");
        };
      });
    }

    if (btn.textContent === "Update") {
      btn.addEventListener("click", function () {
        showNotification("Learning preferences updated successfully!");
      });
    }
  });

  // Add hover effects to interactive elements
  document.querySelectorAll("button, .sidebar-link").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-1px)";
    });

    element.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Progress bar animation for courses
  function animateProgressBars() {
    const progressTexts = document.querySelectorAll(".course-progress");
    progressTexts.forEach((text) => {
      if (text.textContent.includes("Progress: ")) {
        const progressMatch = text.textContent.match(/Progress: (\d+)%/);
        if (progressMatch) {
          const percentage = parseInt(progressMatch[1]);

          // Create visual progress bar
          const progressBar = document.createElement("div");
          progressBar.style.width = "100%";
          progressBar.style.height = "6px";
          progressBar.style.background = "#e9ecef";
          progressBar.style.borderRadius = "3px";
          progressBar.style.marginTop = "8px";
          progressBar.style.overflow = "hidden";
        }
      }
    });
  }

  // Call progress bar animation on page load
  animateProgressBars();
});
