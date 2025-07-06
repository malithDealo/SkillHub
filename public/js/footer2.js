class Footer2NewsletterManager {
  constructor() {
    this.form = document.querySelector('.subscription-form');
    this.emailInput = this.form?.querySelector('input[type="email"]');
    this.subscribeBtn = this.form?.querySelector('button[type="submit"]');
    
    // ✅ YOUR ACTUAL MAILCHIMP CONFIGURATION
    this.mailchimpConfig = {
      serverPrefix: 'us7',
      userId: 'dbd56b1871ae4b180a78e3962',
      listId: 'c9ed54479c',
      formAction: 'https://gmail.us7.list-manage.com/subscribe/post?u=dbd56b1871ae4b180a78e3962&id=c9ed54479c&f_id=006d5fe0f0',
      botField: 'b_dbd56b1871ae4b180a78e3962_c9ed54479c'
    };
    
    this.init();
  }
  
  init() {
    if (!this.form || !this.emailInput || !this.subscribeBtn) {
      console.error('❌ Footer2: Form, email input, or subscribe button not found');
      return;
    }
    this.createModal();
    this.bindEvents();
    this.loadSubscriptionStatus();
    console.log('📧 Footer2 Newsletter manager initialized with Mailchimp integration');
  }
  
  createModal() {
    const modalHTML = `
      <div class="modal-overlay" id="footer2Modal" style="display: none;">
        <div class="modal">
          <div class="modal-content">
            <div class="modal-icon" id="footer2ModalIcon"></div>
            <h3 id="footer2ModalTitle">Success!</h3>
            <p id="footer2ModalMessage">You've successfully subscribed to our newsletter.</p>
            <button class="modal-button" id="footer2ModalButton">Got it</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.addModalStyles();
    this.modal = document.getElementById('footer2Modal');
    if (!this.modal) {
      console.error('❌ Footer2: Modal element not found after creation');
    }
  }
  
  addModalStyles() {
    const styles = `
      <style>
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .modal-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          text-align: center;
          transform: scale(0.7);
          transition: transform 0.3s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-overlay.show .modal {
          transform: scale(1);
        }

        .modal-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .modal-icon.success {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }

        .modal-icon.error {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
        }

        .modal h3 {
          color: #333;
          margin-bottom: 0.8rem;
          font-size: 1.2rem;
        }

        .modal p {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.4;
          font-size: 0.9rem;
        }

        .modal-button {
          background: #4caf50;
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .modal-button:hover {
          background: #45a049;
          transform: translateY(-1px);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #f3f3f3;
          border-top: 2px solid #4caf50;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-left: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .subscription-status {
          margin-top: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .subscription-status.show {
          opacity: 1;
          transform: translateY(0);
        }

        .subscription-status.success {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        }

        .subscription-status.error {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }
      </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
  }
  
  bindEvents() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubscription();
    });
    
    this.emailInput.addEventListener('input', () => {
      this.clearStatus();
    });
    
    const modalButton = document.getElementById('footer2ModalButton');
    if (modalButton) {
      modalButton.addEventListener('click', () => {
        this.hideModal();
      });
    } else {
      console.error('❌ Footer2: Modal button not found');
    }
    
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.hideModal();
        }
      });
    }
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('show')) {
        this.hideModal();
      }
    });
  }
  
  async handleSubscription() {
    const email = this.emailInput.value.trim();
    
    if (!this.isValidEmail(email)) {
      this.showStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    if (this.isAlreadySubscribed(email)) {
      this.showStatus('You are already subscribed!', 'error');
      return;
    }
    
    this.setLoadingState(true);
    
    try {
      const result = await this.subscribeToMailchimp(email);
      
      if (result.success) {
        this.handleSuccessfulSubscription(email);
      } else {
        this.handleSubscriptionError(new Error(result.message || 'Subscription failed'));
      }
    } catch (error) {
      console.error('❌ Subscription error:', error);
      this.handleSubscriptionError(error);
    } finally {
      this.setLoadingState(false);
    }
  }
  
  async subscribeToMailchimp(email) {
    return new Promise((resolve) => {
      try {
        const callbackName = 'mailchimpCallback' + Date.now();
        
        window[callbackName] = (data) => {
          delete window[callbackName];
          if (script.parentNode) {
            document.head.removeChild(script);
          }
          
          console.log('📧 Mailchimp response:', data);
          
          if (data.result === 'success') {
            resolve({
              success: true,
              message: 'Successfully subscribed to SkillHub newsletter!'
            });
          } else {
            let errorMessage = 'Subscription failed. Please try again.';
            
            if (data.msg) {
              const msg = data.msg.toLowerCase();
              if (msg.includes('already subscribed')) {
                errorMessage = 'This email is already subscribed to our newsletter!';
              } else if (msg.includes('invalid email')) {
                errorMessage = 'Please enter a valid email address.';
              } else if (msg.includes('too many recent signup requests')) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
              } else if (msg.includes('banned')) {
                errorMessage = 'This email address cannot be subscribed.';
              } else {
                errorMessage = data.msg.replace(/0 - /, '').replace(/\d+ - /, '');
                errorMessage = errorMessage.replace(/<[^>]*>/g, '');
              }
            }
            
            resolve({
              success: false,
              message: errorMessage
            });
          }
        };
        
        const script = document.createElement('script');
        
        const params = new URLSearchParams({
          u: this.mailchimpConfig.userId,
          id: this.mailchimpConfig.listId,
          EMAIL: email,
          c: callbackName,
          subscribe: 'Subscribe',
          [this.mailchimpConfig.botField]: ''
        });
        
        script.src = `https://${this.mailchimpConfig.serverPrefix}.list-manage.com/subscribe/post-json?${params}`;
        
        console.log('🔗 Footer2 Subscription URL:', script.src.replace(/&c=.*$/, '&c=CALLBACK'));
        
        script.onerror = () => {
          console.error('❌ Failed to load Mailchimp script');
          delete window[callbackName];
          if (script.parentNode) {
            document.head.removeChild(script);
          }
          resolve({
            success: false,
            message: 'Network error. Please check your connection and try again.'
          });
        };
        
        document.head.appendChild(script);
        
        setTimeout(() => {
          if (window[callbackName]) {
            console.error('⏰ Mailchimp request timed out');
            delete window[callbackName];
            if (script.parentNode) {
              document.head.removeChild(script);
            }
            resolve({
              success: false,
              message: 'Request timed out. Please check your connection and try again.'
            });
          }
        }, 15000);
        
      } catch (error) {
        console.error('❌ Mailchimp JSONP setup error:', error);
        resolve({
          success: false,
          message: 'Technical error. Please try again later.'
        });
      }
    });
  }
  
  handleSuccessfulSubscription(email) {
    console.log('✅ Footer2: Successfully subscribed to SkillHub newsletter:', email);
    
    this.storeSubscriptionStatus(email);
    this.emailInput.value = '';
    
    // Show success status message near the form
    this.showStatus('Successfully subscribed!', 'success');
    
    // Show success modal
    this.showModal(
      'success',
      'Welcome to SkillHub! 🎉',
      'Thank you for subscribing to our newsletter! You\'ll receive updates on new skills, community events, and exciting platform features.'
    );
    
    this.trackSubscription(email);
  }
  
  handleSubscriptionError(error) {
    console.error('❌ Footer2: Newsletter subscription failed:', error.message);
    
    this.showModal(
      'error',
      'Subscription Failed',
      error.message || 'Something went wrong. Please try again later.'
    );
  }
  
  setLoadingState(isLoading) {
    if (isLoading) {
      this.subscribeBtn.innerHTML = 'Subscribing... <span class="loading-spinner"></span>';
      this.subscribeBtn.disabled = true;
      this.emailInput.disabled = true;
      console.log('⏳ Footer2: Processing subscription...');
    } else {
      this.subscribeBtn.innerHTML = 'Subscribe';
      this.subscribeBtn.disabled = false;
      this.emailInput.disabled = false;
    }
  }
  
  showStatus(message, type) {
    const existingStatus = this.form.querySelector('.subscription-status');
    if (existingStatus) {
      existingStatus.remove();
    }
    
    const statusDiv = document.createElement('div');
    statusDiv.className = `subscription-status ${type}`;
    statusDiv.textContent = message;
    
    this.form.appendChild(statusDiv);
    
    setTimeout(() => {
      statusDiv.classList.add('show');
      console.log(`📢 Footer2: Showing ${type} status message: ${message}`);
    }, 100);
    
    setTimeout(() => {
      this.clearStatus();
    }, 5000);
  }
  
  clearStatus() {
    const statusDiv = this.form.querySelector('.subscription-status');
    if (statusDiv) {
      statusDiv.classList.remove('show');
      setTimeout(() => {
        statusDiv.remove();
      }, 300);
    }
  }
  
  showModal(type, title, message) {
    const modalIcon = document.getElementById('footer2ModalIcon');
    const modalTitle = document.getElementById('footer2ModalTitle');
    const modalMessage = document.getElementById('footer2ModalMessage');
    
    if (!modalIcon || !modalTitle || !modalMessage || !this.modal) {
      console.error('❌ Footer2: Modal elements not found');
      return;
    }
    
    if (type === 'success') {
      modalIcon.innerHTML = '✓';
      modalIcon.className = 'modal-icon success';
    } else {
      modalIcon.innerHTML = '✕';
      modalIcon.className = 'modal-icon error';
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    this.modal.classList.add('show');
    console.log(`📢 Footer2: Showing ${type} modal: ${title} - ${message}`);
    
    setTimeout(() => {
      const modalButton = document.getElementById('footer2ModalButton');
      if (modalButton) {
        modalButton.focus();
      }
    }, 300);
  }
  
  hideModal() {
    if (this.modal) {
      this.modal.classList.remove('show');
      console.log('📢 Footer2: Modal hidden');
    }
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  
  isAlreadySubscribed(email) {
    const subscribedEmails = JSON.parse(localStorage.getItem('skillhub_newsletter_subscribers') || '[]');
    return subscribedEmails.includes(email.toLowerCase());
  }
  
  storeSubscriptionStatus(email) {
    const subscribedEmails = JSON.parse(localStorage.getItem('skillhub_newsletter_subscribers') || '[]');
    if (!subscribedEmails.includes(email.toLowerCase())) {
      subscribedEmails.push(email.toLowerCase());
      localStorage.setItem('skillhub_newsletter_subscribers', JSON.stringify(subscribedEmails));
      console.log('💾 Footer2: Subscription status saved locally');
    }
  }
  
  loadSubscriptionStatus() {
    const subscribedEmails = JSON.parse(localStorage.getItem('skillhub_newsletter_subscribers') || '[]');
    if (subscribedEmails.length > 0) {
      console.log('📊 Footer2: Found', subscribedEmails.length, 'local newsletter subscriptions');
    }
  }
  
  trackSubscription(email) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'newsletter_subscription', {
        'email_domain': email.split('@')[1],
        'source': 'footer2',
        'campaign': 'skillhub_newsletter'
      });
      console.log('📈 Footer2: Google Analytics event tracked');
    }
    
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Subscribe', {
        value: 1,
        currency: 'USD',
        source: 'newsletter_footer2'
      });
      console.log('📘 Footer2: Facebook Pixel event tracked');
    }
    
    console.log('📧 Footer2: Newsletter subscription analytics tracked for:', email.split('@')[1]);
  }
}

class Footer2Manager {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupSmoothScrolling();
    this.setupSocialMediaTracking();
    this.setupFooterLinkTracking();
  }
  
  setupSmoothScrolling() {
    document.querySelectorAll('.footer-column a').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
  
  setupSocialMediaTracking() {
    document.querySelectorAll('.social-icons a').forEach((link, index) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') {
          e.preventDefault();
        }
        
        const img = link.querySelector('img');
        const alt = img ? img.getAttribute('alt').toLowerCase() : '';
        
        let platform = 'unknown';
        if (alt.includes('facebook') || alt.includes('fb')) {
          platform = 'facebook';
        } else if (alt.includes('twitter')) {
          platform = 'twitter';
        } else if (alt.includes('instagram')) {
          platform = 'instagram';
        } else if (alt.includes('linkedin')) {
          platform = 'linkedin';
        }
        
        console.log('👥 Footer2: Social media click:', platform);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'social_media_click', {
            'platform': platform,
            'location': 'footer2'
          });
        }
      });
    });
  }
  
  setupFooterLinkTracking() {
    document.querySelectorAll('.footer-column a').forEach(link => {
      link.addEventListener('click', (e) => {
        const linkText = link.textContent.trim();
        const section = link.closest('.footer-column').querySelector('.footer-column-title').textContent.trim();
        
        console.log('🔗 Footer2: Link clicked:', linkText, 'in section:', section);
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'footer_link_click', {
            'link_text': linkText,
            'section': section,
            'footer_version': 'footer2'
          });
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing SkillHub Footer2...');
  
  const newsletter = new Footer2NewsletterManager();
  const footer = new Footer2Manager();
  
  console.log('✅ SkillHub Footer2 with Mailchimp integration is ready!');
  console.log('📧 Newsletter subscriptions will be sent to your us7 Mailchimp list');
});

window.addEventListener('online', () => {
  console.log('🌐 Footer2: Internet connection restored - Mailchimp integration available');
});

window.addEventListener('offline', () => {
  console.log('📴 Footer2: Internet connection lost - Newsletter subscriptions temporarily unavailable');
});

window.debugSkillHubFooter2Newsletter = () => {
  console.log('🐛 SkillHub Footer2 Newsletter Debug Info:');
  console.log('Server:', 'us7');
  console.log('User ID:', 'dbd56b1871ae4b180a78e3962');
  console.log('List ID:', 'c9ed54479c');
  console.log('Local subscriptions:', JSON.parse(localStorage.getItem('skillhub_newsletter_subscribers') || '[]'));
  console.log('Form element:', document.querySelector('.subscription-form'));
  console.log('Email input:', document.querySelector('.subscription-form input[type="email"]'));
};