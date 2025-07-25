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

  // Zoom session configurations
  const zoomSessions = {
    "guitar-practice": {
      meetingId: "123-456-789",
      passcode: "music123",
      url: "https://zoom.us/j/123456789?pwd=music123",
      directUrl: "https://us05web.zoom.us/j/123456789?pwd=music123",
    },
    "cooking-pasta": {
      meetingId: "987-654-321",
      passcode: "pasta456",
      url: "https://zoom.us/j/987654321?pwd=pasta456",
      directUrl: "https://us05web.zoom.us/j/987654321?pwd=pasta456",
    },
    "code-review": {
      meetingId: "456-789-123",
      passcode: "code789",
      url: "https://zoom.us/j/456789123?pwd=code789",
      directUrl: "https://us05web.zoom.us/j/456789123?pwd=code789",
    },
  };

  // Initialize Join Zoom functionality
  function initializeZoomButtons() {
    const zoomButtons = document.querySelectorAll(".join-zoom-btn");

    zoomButtons.forEach(function (button) {
      // Add click event listener
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const sessionId = this.dataset.session;
        const zoomId = this.dataset.zoomId;
        handleZoomJoin(sessionId, zoomId, this);
      });

      // Make sure all buttons are active and clickable
      button.disabled = false;
      button.classList.remove("loading");
      button.innerHTML = '<span class="zoom-icon">🎥</span>Join Zoom';
    });
  }

  // Handle Zoom join functionality
  function handleZoomJoin(sessionId, zoomId, buttonElement) {
    const sessionConfig = zoomSessions[sessionId];

    if (!sessionConfig) {
      showNotification("Session configuration not found.", "error");
      return;
    }

    // Show loading state
    buttonElement.classList.add("loading");
    buttonElement.innerHTML = '<span class="zoom-icon">⏳</span>Connecting...';

    // Simulate brief loading, then open Zoom
    setTimeout(function () {
      // Remove loading state
      buttonElement.classList.remove("loading");
      buttonElement.innerHTML = '<span class="zoom-icon">🎥</span>Join Zoom';

      // Try multiple methods to open Zoom
      joinZoomSession(sessionConfig);

      // Track join attempt
      trackZoomJoin(sessionId);
    }, 800); // Brief loading time
  }

  // Function to join Zoom session with multiple fallback methods
  function joinZoomSession(sessionConfig) {
    // Method 1: Try direct Zoom app protocol
    const zoomAppUrl = `zoommtg://zoom.us/join?confno=${sessionConfig.meetingId.replace(
      /-/g,
      ""
    )}&pwd=${sessionConfig.passcode}`;

    // Method 2: Web browser Zoom URL
    const webZoomUrl = sessionConfig.directUrl;

    // Method 3: Main Zoom URL
    const mainZoomUrl = sessionConfig.url;

    // Show options modal instead of auto-opening
    showZoomJoinModal(sessionConfig, zoomAppUrl, webZoomUrl, mainZoomUrl);
  }

  // Show Join Options Modal
  function showZoomJoinModal(
    sessionConfig,
    zoomAppUrl,
    webZoomUrl,
    mainZoomUrl
  ) {
    const modal = createZoomJoinModal(
      sessionConfig,
      zoomAppUrl,
      webZoomUrl,
      mainZoomUrl
    );
    document.body.appendChild(modal);

    // Show modal with animation
    setTimeout(function () {
      modal.style.display = "flex";
      modal.classList.add("show");
    }, 10);
  }

  // Create Zoom join options modal
  function createZoomJoinModal(
    sessionConfig,
    zoomAppUrl,
    webZoomUrl,
    mainZoomUrl
  ) {
    const modal = document.createElement("div");
    modal.className = "zoom-modal";
    modal.innerHTML = `
      <div class="zoom-modal-content">
        <div class="zoom-modal-header">
          <h3>🎥 Join Zoom Meeting</h3>
          <button class="zoom-close-btn">&times;</button>
        </div>
        <div class="zoom-modal-body">
          <div class="zoom-info">
            <div class="zoom-detail">
              <label>Meeting ID:</label>
              <div class="zoom-id-container">
                <span class="zoom-id">${sessionConfig.meetingId}</span>
                <button class="copy-btn" data-copy="${sessionConfig.meetingId}">📋</button>
              </div>
            </div>
            <div class="zoom-detail">
              <label>Passcode:</label>
              <div class="zoom-id-container">
                <span class="zoom-passcode">${sessionConfig.passcode}</span>
                <button class="copy-btn" data-copy="${sessionConfig.passcode}">📋</button>
              </div>
            </div>
          </div>
          
          <div class="zoom-join-options">
            <h4>Choose how to join:</h4>
            <div class="join-option">
              <button class="btn-primary zoom-app-btn" data-url="${zoomAppUrl}">
                <span class="option-icon">📱</span>
                <div class="option-text">
                  <strong>Open Zoom App</strong>
                  <small>Recommended - Opens in Zoom application</small>
                </div>
              </button>
            </div>
            <div class="join-option">
              <button class="btn-outline zoom-web-btn" data-url="${webZoomUrl}">
                <span class="option-icon">🌐</span>
                <div class="option-text">
                  <strong>Join via Browser</strong>
                  <small>Opens in web browser</small>
                </div>
              </button>
            </div>
            <div class="join-option">
              <button class="btn-outline zoom-main-btn" data-url="${mainZoomUrl}">
                <span class="option-icon">🔗</span>
                <div class="option-text">
                  <strong>Zoom Website</strong>
                  <small>Go to zoom.us</small>
                </div>
              </button>
            </div>
          </div>
          
          <div class="zoom-instructions">
            <h4>Manual Join Instructions:</h4>
            <ol>
              <li>Open your Zoom application</li>
              <li>Click "Join a Meeting"</li>
              <li>Enter Meeting ID: <strong>${sessionConfig.meetingId}</strong></li>
              <li>Enter Passcode: <strong>${sessionConfig.passcode}</strong></li>
            </ol>
          </div>
        </div>
        <div class="zoom-modal-footer">
          <button class="btn-outline zoom-cancel">Close</button>
        </div>
      </div>
    `;

    // Add event listeners
    const closeBtn = modal.querySelector(".zoom-close-btn");
    const cancelBtn = modal.querySelector(".zoom-cancel");
    const zoomAppBtn = modal.querySelector(".zoom-app-btn");
    const zoomWebBtn = modal.querySelector(".zoom-web-btn");
    const zoomMainBtn = modal.querySelector(".zoom-main-btn");
    const copyBtns = modal.querySelectorAll(".copy-btn");

    closeBtn.addEventListener("click", () => closeZoomModal(modal));
    cancelBtn.addEventListener("click", () => closeZoomModal(modal));

    // Join via Zoom App
    zoomAppBtn.addEventListener("click", function () {
      const url = this.dataset.url;
      window.location.href = url;
      showNotification("Opening Zoom app...", "success");
      closeZoomModal(modal);
    });

    // Join via Web Browser
    zoomWebBtn.addEventListener("click", function () {
      const url = this.dataset.url;
      window.open(url, "_blank");
      showNotification("Opening Zoom in browser...", "success");
      closeZoomModal(modal);
    });

    // Join via Main Zoom Site
    zoomMainBtn.addEventListener("click", function () {
      const url = this.dataset.url;
      window.open(url, "_blank");
      showNotification("Opening Zoom website...", "success");
      closeZoomModal(modal);
    });

    // Copy functionality
    copyBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const textToCopy = this.dataset.copy;
        copyToClipboard(textToCopy);
        this.innerHTML = "✅";
        setTimeout(() => {
          this.innerHTML = "📋";
        }, 2000);
      });
    });

    // Close on backdrop click
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeZoomModal(modal);
      }
    });

    return modal;
  }

  // Close Zoom modal
  function closeZoomModal(modal) {
    modal.classList.remove("show");
    setTimeout(function () {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 300);
  }

  // Copy to clipboard function
  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(function () {
          showNotification("Copied to clipboard!", "success");
        })
        .catch(function (err) {
          fallbackCopyTextToClipboard(text);
        });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  }

  // Fallback copy function for older browsers
  function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      showNotification("Copied to clipboard!", "success");
    } catch (err) {
      showNotification("Failed to copy. Please copy manually.", "error");
    }

    document.body.removeChild(textArea);
  }

  // Track Zoom join attempts (for analytics)
  function trackZoomJoin(sessionId) {
    const joinAttempts = JSON.parse(
      localStorage.getItem("zoomJoinAttempts") || "{}"
    );
    const today = new Date().toISOString().split("T")[0];

    if (!joinAttempts[today]) {
      joinAttempts[today] = {};
    }

    joinAttempts[today][sessionId] = (joinAttempts[today][sessionId] || 0) + 1;
    localStorage.setItem("zoomJoinAttempts", JSON.stringify(joinAttempts));
  }

  // Add Zoom modal styles
  function addZoomModalStyles() {
    if (document.getElementById("zoom-modal-styles")) return;

    const styles = document.createElement("style");
    styles.id = "zoom-modal-styles";
    styles.textContent = `
      .zoom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
      }

      .zoom-modal.show {
        opacity: 1;
      }

      .zoom-modal-content {
        background: white;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: translateY(50px) scale(0.95);
        transition: transform 0.3s ease;
      }

      .zoom-modal.show .zoom-modal-content {
        transform: translateY(0) scale(1);
      }

      .zoom-modal-header {
        background: linear-gradient(135deg, #007acc, #0066a3);
        color: white;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .zoom-modal-header h3 {
        margin: 0;
        font-size: 1.2rem;
      }

      .zoom-close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      }

      .zoom-close-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .zoom-modal-body {
        padding: 2rem;
        max-height: 60vh;
        overflow-y: auto;
      }

      .zoom-info {
        margin-bottom: 2rem;
      }

      .zoom-detail {
        margin-bottom: 1rem;
      }

      .zoom-detail label {
        display: block;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .zoom-id-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #f8f9fa;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid #e9ecef;
      }

      .zoom-id, .zoom-passcode {
        font-family: 'Courier New', monospace;
        font-weight: 600;
        color: #007acc;
        flex: 1;
      }

      .copy-btn {
        background: #007acc;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background 0.2s ease;
      }

      .copy-btn:hover {
        background: #0066a3;
      }

      .zoom-join-options {
        margin-bottom: 2rem;
      }

      .zoom-join-options h4 {
        margin: 0 0 1rem 0;
        color: #333;
      }

      .join-option {
        margin-bottom: 1rem;
      }

      .join-option button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        text-align: left;
        border-radius: 8px;
        transition: all 0.3s ease;
        font-size: 1rem;
      }

      .join-option button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
      }

      .option-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }

      .option-text {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .option-text strong {
        font-weight: 600;
      }

      .option-text small {
        color: #666;
        font-size: 0.85rem;
      }

      .zoom-instructions {
        background: #e3f2fd;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid #007acc;
      }

      .zoom-instructions h4 {
        margin: 0 0 0.5rem 0;
        color: #0066a3;
      }

      .zoom-instructions ol {
        margin: 0;
        padding-left: 1.2rem;
      }

      .zoom-instructions li {
        margin-bottom: 0.3rem;
        color: #1976d2;
      }

      .zoom-instructions strong {
        color: #007acc;
        font-family: 'Courier New', monospace;
      }

      .zoom-modal-footer {
        background: #f8f9fa;
        padding: 1rem 2rem;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        border-top: 1px solid #e9ecef;
      }

      @media (max-width: 480px) {
        .zoom-modal-content {
          width: 95%;
          margin: 1rem;
        }

        .zoom-modal-header,
        .zoom-modal-body,
        .zoom-modal-footer {
          padding: 1rem;
        }

        .zoom-modal-footer {
          flex-direction: column;
        }

        .zoom-id-container {
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }

        .join-option button {
          padding: 0.8rem;
          gap: 0.8rem;
        }

        .option-icon {
          font-size: 1.2rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Wishlist functionality
  function loadWishlistItems() {
    const wishlist = localStorage.getItem("skillWishlist");
    const wishlistItems = wishlist ? JSON.parse(wishlist) : [];

    const wishlistSection = document.querySelector(
      "#my-learning .content-section:last-child"
    );
    if (!wishlistSection) return;

    const wishlistContainer =
      wishlistSection.querySelector(".course-item")?.parentNode;
    if (!wishlistContainer) return;

    // Clear existing wishlist items (keep only the default one as template)
    const existingItems = wishlistContainer.querySelectorAll(".course-item");
    existingItems.forEach(function (item, index) {
      if (index > 0) {
        // Keep first item as template, remove others
        item.remove();
      }
    });

    if (wishlistItems.length === 0) {
      // Hide the default item if no wishlist items
      if (existingItems[0]) {
        existingItems[0].style.display = "none";
      }
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
    if (existingItems[0]) {
      existingItems[0].style.display = "flex";
      updateWishlistItem(existingItems[0], wishlistItems[0]);
    }

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

    if (iconElement) iconElement.textContent = wishlistData.courseIcon;
    if (nameElement) nameElement.textContent = wishlistData.skillName;
    if (progressElement) {
      progressElement.textContent =
        "Saved for later • " +
        (wishlistData.availableTeachers || 0) +
        " teachers available";
    }

    // Update button functionality
    if (buttonElement) {
      buttonElement.textContent = "Explore";
      buttonElement.onclick = function () {
        exploreSkill(wishlistData.skillName);
      };
    }

    // Add remove button
    addRemoveButton(element, wishlistData.skillName);
  }

  function createWishlistItem(wishlistData) {
    const courseItem = document.createElement("div");
    courseItem.className = "course-item";
    courseItem.innerHTML =
      '<div class="course-icon">' +
      wishlistData.courseIcon +
      "</div>" +
      '<div class="course-info">' +
      "<h3>" +
      wishlistData.skillName +
      "</h3>" +
      '<p class="course-progress">Saved for later • ' +
      (wishlistData.availableTeachers || 0) +
      " teachers available</p>" +
      "</div>" +
      '<button class="btn-primary" onclick="exploreSkill(\'' +
      wishlistData.skillName +
      "')\">Explore</button>";

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

    if (exploreBtn) {
      // Replace the button with actions container
      exploreBtn.parentNode.replaceChild(actionsContainer, exploreBtn);
      actionsContainer.appendChild(exploreBtn);
      actionsContainer.appendChild(removeBtn);
    }
  }

  function removeFromWishlist(skillName, element) {
    if (confirm("Remove " + skillName + " from your wishlist?")) {
      // Remove from localStorage
      const wishlist = localStorage.getItem("skillWishlist");
      const wishlistItems = wishlist ? JSON.parse(wishlist) : [];
      const updatedWishlist = wishlistItems.filter(function (item) {
        return item.skillName !== skillName;
      });
      localStorage.setItem("skillWishlist", JSON.stringify(updatedWishlist));

      // Remove from DOM
      element.remove();

      // Show success message
      showNotification(skillName + " removed from your wishlist!", "success");

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
    pageContents.forEach(function (page) {
      page.classList.remove("active");
    });

    // Remove active class from all sidebar links
    sidebarLinks.forEach(function (link) {
      link.classList.remove("active");
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    // Add active class to clicked sidebar link
    const activeLink = document.querySelector('[data-page="' + pageId + '"]');
    if (activeLink) {
      activeLink.classList.add("active");
    }

    // Load wishlist when My Learning page is shown
    if (pageId === "my-learning") {
      setTimeout(loadWishlistItems, 100);
    }

    // Load clubs when Clubs page is shown
    if (pageId === "learning-group") {
      setTimeout(function () {
        loadJoinedClubs();
        updateDiscoverClubs();
      }, 100);
    }

    // Load recordings when Missed Sessions page is shown
    if (pageId === "recordings") {
      setTimeout(function () {
        initializeRecordingsSection();
        loadRecordingProgress();
        enhancedRecordingsInit();
        updateExpiryBadges();
      }, 100);
    }
  }

  // Sidebar navigation click handlers
  sidebarLinks.forEach(function (link) {
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

      // Store image in localStorage for persistence
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
  function showNotification(message, type) {
    type = type || "success";

    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".upload-success");
    existingNotifications.forEach(function (notification) {
      notification.remove();
    });

    // Create notification element
    const notification = document.createElement("div");
    notification.className = "upload-success " + type;
    notification.textContent = message;

    // Style for error messages
    if (type === "error") {
      notification.style.background = "#dc3545";
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(function () {
      notification.classList.add("show");
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(function () {
      notification.classList.remove("show");
      setTimeout(function () {
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
        localStorage.removeItem("recordingProgress");
        localStorage.removeItem("zoomJoinAttempts");
        alert("Logged out successfully!");
      }
    });
  }

  // Function to load and display joined clubs
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
      noClubsMessage.innerHTML =
        '<div style="text-align: center; padding: 2rem; color: #666;">' +
        '<div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>' +
        '<h3 style="margin-bottom: 0.5rem; color: #333;">No Clubs Joined Yet</h3>' +
        '<p style="margin-bottom: 1.5rem;">Discover amazing clubs in the Community section!</p>' +
        '<button onclick="window.location.href=\'community.html\'" style="background: #4caf50; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">Explore Clubs</button>' +
        "</div>";
      myClubsContainer.appendChild(noClubsMessage);
      return;
    }

    // Add joined clubs to the section
    joinedClubs.forEach(function (club) {
      const clubItem = createClubItem(club);
      myClubsContainer.appendChild(clubItem);
    });
  }

  // Create a club item element
  function createClubItem(club) {
    const clubItem = document.createElement("div");
    clubItem.className = "group-item";

    // Get additional club details
    const clubDetails = getClubDetails(club.key);

    clubItem.innerHTML =
      '<div class="group-info">' +
      "<h3>" +
      club.title +
      "</h3>" +
      '<p class="group-details">' +
      clubDetails.members +
      " members • " +
      clubDetails.activity +
      "</p>" +
      "</div>" +
      '<button class="btn-secondary view-club-btn">View</button>';

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

  // Update discover clubs section
  function updateDiscoverClubs() {
    const discoverClubsSection = document.querySelector(
      "#learning-group .content-section:last-child"
    );
    if (!discoverClubsSection) return;

    // Clear existing discover clubs
    const existingClubs = discoverClubsSection.querySelectorAll(".group-item");
    existingClubs.forEach(function (club) {
      club.remove();
    });

    // Define all available clubs for discovery
    const allClubs = [
      {
        key: "science",
        title: "Science club",
        description: "Learn insights of Science",
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

    // Add all clubs to discover section
    allClubs.forEach(function (club) {
      const clubDetails = getClubDetails(club.key);
      const clubItem = document.createElement("div");
      clubItem.className = "group-item discover-club-item";
      clubItem.innerHTML =
        '<div class="group-info">' +
        "<h3>" +
        club.title +
        "</h3>" +
        '<p class="group-details">' +
        clubDetails.members +
        " members • " +
        club.description +
        "</p>" +
        "</div>";

      // Add click handler to navigate to club
      clubItem.style.cursor = "pointer";
      clubItem.addEventListener("click", function () {
        navigateToClub(club.title);
      });

      discoverClubsSection.appendChild(clubItem);
    });
  }

  // RECORDINGS FUNCTIONALITY

  // Initialize recordings section
  function initializeRecordingsSection() {
    // Course filter functionality
    const courseFilter = document.getElementById("courseFilter");
    if (courseFilter) {
      courseFilter.addEventListener("change", function () {
        filterRecordings(this.value);
      });
    }

    // Play button functionality
    const playButtons = document.querySelectorAll(".play-btn");
    playButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const recordingId = this.dataset.recording;
        playRecording(recordingId, this);
      });
    });

    // Download button functionality (disabled)
    const downloadButtons = document.querySelectorAll(".download-btn");
    downloadButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        if (this.disabled) {
          showNotification(
            "Downloads are disabled for privacy and security reasons.",
            "error"
          );
          return;
        }
        const recordingId = this.dataset.recording;
        downloadRecording(recordingId);
      });
    });

    // Video modal functionality
    initializeVideoModal();

    // Initialize additional features
    initializeRecordingSearch();
    initializeRecordingSorting();
    initializeRecordingKeyboardShortcuts();
  }

  // Filter recordings by course
  function filterRecordings(courseFilter) {
    const recordingItems = document.querySelectorAll(".recording-item");

    recordingItems.forEach(function (item) {
      const title = item.querySelector("h3").textContent.toLowerCase();
      let shouldShow = true;

      if (courseFilter !== "all") {
        switch (courseFilter) {
          case "guitar":
            shouldShow = title.includes("guitar");
            break;
          case "cooking":
            shouldShow = title.includes("cooking") || title.includes("pasta");
            break;
          case "code":
            shouldShow = title.includes("code");
            break;
          default:
            shouldShow = true;
        }
      }

      item.style.display = shouldShow ? "flex" : "none";
    });

    showFilterResults(courseFilter);
  }

  // Show filter results message
  function showFilterResults(filter) {
    const container = document.getElementById("recordingsContainer");
    if (!container) return;

    const visibleItems = container.querySelectorAll(
      '.recording-item:not([style*="none"])'
    );

    // Remove existing no results message
    const existingMessage = container.querySelector(".no-recordings");
    if (existingMessage) {
      existingMessage.remove();
    }

    if (visibleItems.length === 0) {
      const noResultsMessage = document.createElement("div");
      noResultsMessage.className = "no-recordings";
      noResultsMessage.innerHTML =
        '<div class="no-recordings-icon">🎥</div>' +
        "<h3>No recordings found</h3>" +
        "<p>No recordings available for the selected course filter.</p>";
      container.appendChild(noResultsMessage);
    }
  }

  // Play recording function
  function playRecording(recordingId, buttonElement) {
    // Add loading state
    const recordingItem = buttonElement.closest(".recording-item");
    recordingItem.classList.add("loading");

    // Simulate loading time
    setTimeout(function () {
      recordingItem.classList.remove("loading");

      // Get recording details
      const recordingTitle = recordingItem.querySelector("h3").textContent;
      const recordingDetails =
        recordingItem.querySelector(".recording-details").textContent;

      // Open video modal
      openVideoModal(recordingId, recordingTitle, recordingDetails);

      // Update button text and progress
      updateRecordingProgress(recordingId, buttonElement);
    }, 1000);
  }

  // Download recording function (disabled)
  function downloadRecording(recordingId) {
    // Show disabled notification
    showNotification(
      "Downloads are not available for privacy and security reasons. Please watch recordings online.",
      "error"
    );
    console.log(
      "Download attempted for recording: " + recordingId + " - Access denied"
    );
  }

  // Initialize video modal
  function initializeVideoModal() {
    const modal = document.getElementById("videoModal");
    const closeBtn = document.getElementById("closeVideoModal");
    const downloadBtn = document.getElementById("downloadVideo");
    const markCompleteBtn = document.getElementById("markComplete");

    if (!modal) return;

    // Close modal handlers
    if (closeBtn) {
      closeBtn.addEventListener("click", closeVideoModal);
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeVideoModal();
      }
    });

    // Keyboard escape handler
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeVideoModal();
      }
    });

    // Download button in modal
    if (downloadBtn) {
      downloadBtn.addEventListener("click", function () {
        const recordingId = this.dataset.recording;
        downloadRecording(recordingId);
      });
    }

    // Mark complete button
    if (markCompleteBtn) {
      markCompleteBtn.addEventListener("click", function () {
        const recordingId = this.dataset.recording;
        markRecordingComplete(recordingId);
      });
    }
  }

  // Open video modal
  function openVideoModal(recordingId, title, details) {
    const modal = document.getElementById("videoModal");
    const videoTitle = document.getElementById("videoTitle");
    const videoDetails = document.getElementById("videoDetails");
    const video = document.getElementById("recordingVideo");
    const downloadBtn = document.getElementById("downloadVideo");
    const markCompleteBtn = document.getElementById("markComplete");

    if (!modal) return;

    // Set modal content
    if (videoTitle) videoTitle.textContent = title;
    if (videoDetails) videoDetails.textContent = details;

    // Set video source (in real app, this would be the actual video URL)
    if (video)
      video.src = "https://example.com/recordings/" + recordingId + ".mp4";

    // Set button data attributes
    if (downloadBtn) downloadBtn.dataset.recording = recordingId;
    if (markCompleteBtn) markCompleteBtn.dataset.recording = recordingId;

    // Show modal
    modal.style.display = "flex";
    modal.classList.add("show");

    // Track video progress
    if (video) trackVideoProgress(recordingId, video);

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  // Close video modal
  function closeVideoModal() {
    const modal = document.getElementById("videoModal");
    const video = document.getElementById("recordingVideo");

    if (!modal) return;

    // Hide modal
    modal.style.display = "none";
    modal.classList.remove("show");

    // Pause and reset video
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    // Restore body scroll
    document.body.style.overflow = "auto";
  }

  // Track video progress
  function trackVideoProgress(recordingId, video) {
    video.addEventListener("timeupdate", function () {
      const progress = (video.currentTime / video.duration) * 100;
      saveVideoProgress(recordingId, progress, video.currentTime);
    });

    video.addEventListener("ended", function () {
      markRecordingComplete(recordingId);
    });
  }

  // Save video progress to localStorage
  function saveVideoProgress(recordingId, progressPercentage, currentTime) {
    const progress = JSON.parse(
      localStorage.getItem("recordingProgress") || "{}"
    );
    progress[recordingId] = {
      percentage: Math.round(progressPercentage),
      currentTime: currentTime,
      lastWatched: new Date().toISOString(),
    };
    localStorage.setItem("recordingProgress", JSON.stringify(progress));
  }

  // Load recording progress from localStorage
  function loadRecordingProgress() {
    const progress = JSON.parse(
      localStorage.getItem("recordingProgress") || "{}"
    );

    Object.keys(progress).forEach(function (recordingId) {
      const progressData = progress[recordingId];
      const recordingElement = document.querySelector(
        '[data-recording="' + recordingId + '"]'
      );
      const recordingItem = recordingElement
        ? recordingElement.closest(".recording-item")
        : null;

      if (recordingItem) {
        updateRecordingUI(recordingItem, progressData);
      }
    });
  }

  // Update recording UI based on progress
  function updateRecordingUI(recordingElement, progressData) {
    const progressBar = recordingElement.querySelector(".progress-fill");
    const progressText = recordingElement.querySelector(".progress-text");
    const playButton = recordingElement.querySelector(".play-btn");

    if (progressBar) {
      progressBar.style.width = progressData.percentage + "%";
    }

    if (progressText && playButton) {
      if (progressData.percentage >= 100) {
        progressText.textContent = "Completed";
        playButton.innerHTML = '<span class="btn-icon">🔄</span>Rewatch';
      } else if (progressData.percentage > 0) {
        progressText.textContent = progressData.percentage + "% watched";
        playButton.innerHTML = '<span class="btn-icon">▶️</span>Continue';
      } else {
        progressText.textContent = "Not watched";
        playButton.innerHTML = '<span class="btn-icon">▶️</span>Play';
      }
    }
  }

  // Update recording progress when playing
  function updateRecordingProgress(recordingId, buttonElement) {
    const recordingItem = buttonElement.closest(".recording-item");
    const progressData = {
      percentage: 0,
      currentTime: 0,
      lastWatched: new Date().toISOString(),
    };

    // Save initial progress
    saveVideoProgress(recordingId, 0, 0);

    // Update UI
    updateRecordingUI(recordingItem, progressData);
  }

  // Mark recording as complete
  function markRecordingComplete(recordingId) {
    const progressData = {
      percentage: 100,
      currentTime: 0,
      lastWatched: new Date().toISOString(),
      completed: true,
    };

    // Save completion status
    const progress = JSON.parse(
      localStorage.getItem("recordingProgress") || "{}"
    );
    progress[recordingId] = progressData;
    localStorage.setItem("recordingProgress", JSON.stringify(progress));

    // Update UI
    const recordingElement = document.querySelector(
      '[data-recording="' + recordingId + '"]'
    );
    const recordingItem = recordingElement
      ? recordingElement.closest(".recording-item")
      : null;
    if (recordingItem) {
      updateRecordingUI(recordingItem, progressData);
    }

    // Show completion notification
    const recordingTitle = recordingItem
      ? recordingItem.querySelector("h3").textContent
      : "Recording";
    showNotification(recordingTitle + " marked as completed!", "success");

    // Close modal if open
    closeVideoModal();
  }

  // Search recordings functionality
  function initializeRecordingSearch() {
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search recordings...";
    searchInput.className = "recording-search";
    searchInput.style.cssText =
      "padding: 8px 12px; border: 1px solid #e9ecef; border-radius: 6px; font-size: 0.9rem; width: 200px; margin-left: 10px;";

    // Add search input to recordings filter section
    const filterSection = document.querySelector(".recordings-filter");
    if (filterSection) {
      filterSection.appendChild(searchInput);
    }
  }

  // Enhanced recordings initialization
  function enhancedRecordingsInit() {
    // This function can be expanded for additional recording features
    console.log("Enhanced recordings features initialized");
  }

  // Update expiry badges
  function updateExpiryBadges() {
    const expiryBadges = document.querySelectorAll(".expiry-badge");
    expiryBadges.forEach(function (badge) {
      const text = badge.textContent.toLowerCase();
      if (text.includes("1 day") || text.includes("6 hours")) {
        badge.classList.add("urgent");
      }
    });
  }

  // Recording sorting functionality
  function initializeRecordingSorting() {
    // Placeholder for sorting functionality
    console.log("Recording sorting initialized");
  }

  // Recording keyboard shortcuts
  function initializeRecordingKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
      // ESC to close video modal
      if (e.key === "Escape") {
        const videoModal = document.getElementById("videoModal");
        if (videoModal && videoModal.style.display === "flex") {
          closeVideoModal();
        }

        // ESC to close zoom modal
        const zoomModals = document.querySelectorAll(".zoom-modal.show");
        zoomModals.forEach(function (modal) {
          closeZoomModal(modal);
        });
      }
    });
  }

  // Initialize all functionalities
  function initializeApp() {
    // Add Zoom modal styles
    addZoomModalStyles();

    // Initialize Zoom buttons
    initializeZoomButtons();

    // Initialize other features
    setupProfilePictureUpload();
    loadStoredProfilePicture();

    console.log("SkillHub Dashboard initialized successfully");
    console.log("Join Zoom functionality is ready!");
  }

  // Initialize the app
  initializeApp();
}); // End of DOMContentLoaded event listener
