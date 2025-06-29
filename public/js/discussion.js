// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get URL parameters to customize content
  const urlParams = new URLSearchParams(window.location.search);
  const discussionTopic =
    urlParams.get("topic") || "Best places to practice guitar in Kandy?";
  const category = urlParams.get("category") || "Music & Learning";

  // Update page title and header if parameters exist
  if (urlParams.get("topic")) {
    document.querySelector(".header-info h1").textContent = discussionTopic;
    document.title = `${discussionTopic} - SkillHub`;
  }

  // Like button functionality
  const likeBtn = document.querySelector(".like-btn");
  let isLiked = false;
  let likeCount = 0;

  likeBtn.addEventListener("click", function () {
    isLiked = !isLiked;

    if (isLiked) {
      likeCount++;
      this.style.background = "#e8f5e8";
      this.style.borderColor = "#4CAF50";
      this.style.color = "#4CAF50";
      this.querySelector(".btn-icon").textContent = "👍";
    } else {
      likeCount--;
      this.style.background = "white";
      this.style.borderColor = "#ddd";
      this.style.color = "#333";
      this.querySelector(".btn-icon").textContent = "👍";
    }

    // Update like text if count > 0
    const btnText = this.querySelector(".btn-text");
    btnText.textContent = likeCount > 0 ? `Like (${likeCount})` : "Like";
  });

  // Share button functionality
  const shareBtn = document.querySelector(".share-btn");
  shareBtn.addEventListener("click", function () {
    if (navigator.share) {
      navigator.share({
        title: discussionTopic,
        text: "Check out this discussion on SkillHub",
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        // Show temporary feedback
        const originalText = this.querySelector(".btn-text").textContent;
        this.querySelector(".btn-text").textContent = "Copied!";
        this.style.background = "#e8f5e8";
        this.style.borderColor = "#4CAF50";

        setTimeout(() => {
          this.querySelector(".btn-text").textContent = originalText;
          this.style.background = "white";
          this.style.borderColor = "#ddd";
        }, 2000);
      });
    }
  });

  // Report button functionality
  const reportBtn = document.querySelector(".report-btn");
  reportBtn.addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to report this discussion? This will notify our moderation team."
      )
    ) {
      alert(
        "Thank you for your report. Our moderation team will review this content."
      );
      this.querySelector(".btn-text").textContent = "Reported";
      this.style.background = "#ffe8e8";
      this.style.borderColor = "#ff6b6b";
      this.style.color = "#ff6b6b";
      this.disabled = true;
    }
  });

  // Reply form functionality
  const replyTextarea = document.querySelector(".reply-textarea");
  const postBtn = document.querySelector(".post-btn");
  const cancelBtn = document.querySelector(".cancel-btn");

  // Enable/disable post button based on textarea content
  replyTextarea.addEventListener("input", function () {
    const hasContent = this.value.trim().length > 0;
    postBtn.disabled = !hasContent;
    postBtn.style.opacity = hasContent ? "1" : "0.6";
    postBtn.style.cursor = hasContent ? "pointer" : "not-allowed";
  });

  // Post reply functionality
  postBtn.addEventListener("click", function () {
    const replyText = replyTextarea.value.trim();

    if (replyText.length < 10) {
      alert("Please write a more detailed reply (at least 10 characters).");
      return;
    }

    // Create new reply element
    const newReply = createReplyElement(replyText);

    // Add to replies section
    const repliesSection = document.querySelector(".replies-section");
    repliesSection.appendChild(newReply);

    // Clear form
    replyTextarea.value = "";
    postBtn.disabled = true;
    postBtn.style.opacity = "0.6";

    // Show success message
    showSuccessMessage("Your reply has been posted successfully!");

    // Scroll to new reply
    newReply.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // Cancel reply functionality
  cancelBtn.addEventListener("click", function () {
    if (replyTextarea.value.trim().length > 0) {
      if (
        confirm("Are you sure you want to cancel? Your reply will be lost.")
      ) {
        replyTextarea.value = "";
        postBtn.disabled = true;
        postBtn.style.opacity = "0.6";
      }
    } else {
      replyTextarea.value = "";
    }
  });

  // Create reply element
  function createReplyElement(replyText) {
    const replyDiv = document.createElement("div");
    replyDiv.className = "reply-item";
    replyDiv.style.animation = "fadeIn 0.5s ease-out";

    const currentTime = new Date();
    const timeString = "Just now";

    replyDiv.innerHTML = `
            <div class="reply-header">
                <div class="user-avatar">Y</div>
                <div class="user-info">
                    <h4>You</h4>
                    <span class="reply-time">${timeString}</span>
                </div>
            </div>
            <div class="reply-content">
                <p>${replyText}</p>
            </div>
        `;

    return replyDiv;
  }

  // Show success message
  function showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  // Related discussions functionality
  const relatedItems = document.querySelectorAll(".related-item");
  relatedItems.forEach((item) => {
    item.addEventListener("click", function () {
      const title = this.querySelector("h4").textContent;
      const category = this.querySelector(".related-category").textContent;

      // Navigate to the related discussion
      window.location.href = `../discussion-thread/discussion.html?topic=${encodeURIComponent(
        title
      )}&category=${encodeURIComponent(category)}`;
    });

    // Add hover effect
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateX(5px)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateX(0)";
    });
  });

  // Auto-resize textarea
  replyTextarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 200) + "px";
  });

  // Add character counter
  function addCharacterCounter() {
    const counter = document.createElement("div");
    counter.className = "character-counter";
    counter.style.cssText = `
            text-align: right;
            font-size: 0.85rem;
            color: #666;
            margin-top: 0.5rem;
        `;

    replyTextarea.parentNode.insertBefore(counter, replyTextarea.nextSibling);

    replyTextarea.addEventListener("input", function () {
      const length = this.value.length;
      counter.textContent = `${length}/1000 characters`;

      if (length > 1000) {
        counter.style.color = "#ff6b6b";
        this.style.borderColor = "#ff6b6b";
      } else {
        counter.style.color = "#666";
        this.style.borderColor = "#e9ecef";
      }
    });
  }

  // Initialize character counter
  addCharacterCounter();

  // Add keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + Enter to post reply
    if (
      (e.ctrlKey || e.metaKey) &&
      e.key === "Enter" &&
      document.activeElement === replyTextarea
    ) {
      e.preventDefault();
      if (!postBtn.disabled) {
        postBtn.click();
      }
    }

    // Escape to cancel reply
    if (e.key === "Escape" && document.activeElement === replyTextarea) {
      cancelBtn.click();
    }
  });

  // Add scroll-to-top functionality
  let scrollToTopBtn;

  function createScrollToTopButton() {
    scrollToTopBtn = document.createElement("button");
    scrollToTopBtn.innerHTML = "↑";
    scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #4CAF50;
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 999;
        `;

    scrollToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(scrollToTopBtn);
  }

  // Show/hide scroll to top button
  window.addEventListener("scroll", function () {
    if (!scrollToTopBtn) createScrollToTopButton();

    if (window.scrollY > 300) {
      scrollToTopBtn.style.opacity = "1";
      scrollToTopBtn.style.transform = "translateY(0)";
    } else {
      scrollToTopBtn.style.opacity = "0";
      scrollToTopBtn.style.transform = "translateY(10px)";
    }
  });

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .character-counter {
            transition: color 0.3s ease;
        }
        
        .reply-item:hover {
            transform: translateX(5px);
        }
        
        .action-btn:active {
            transform: scale(0.95);
        }
        
        .btn:active {
            transform: translateY(0);
        }
    `;
  document.head.appendChild(style);

  // Initialize page
  postBtn.disabled = true;
  postBtn.style.opacity = "0.6";

  // Add focus effect to textarea
  replyTextarea.addEventListener("focus", function () {
    this.parentElement.style.boxShadow = "0 0 0 2px rgba(76, 175, 80, 0.2)";
  });

  replyTextarea.addEventListener("blur", function () {
    this.parentElement.style.boxShadow = "none";
  });

  // Console log for developers
  console.log("🎓 SkillHub Discussion Thread - Join the Conversation! 💬");
  console.log("✅ All Discussion Thread features initialized successfully!");
  console.log("Discussion Topic:", discussionTopic);
  console.log("Category:", category);
});
