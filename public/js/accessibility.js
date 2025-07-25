// Accessibility Toolbar JavaScript - FIXED VERSION
class AccessibilityManager {
    constructor() {
        this.settings = {
            textSize: 0,
            grayscale: false,
            highContrast: false,
            negativeContrast: false,
            lightBackground: false,
            linksUnderline: false,
            readableFont: false
        };
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.applySettings();
        this.updateToggles();
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('accessibilityPanel');
            const toggle = document.querySelector('.accessibility-toggle');
            
            if (panel && toggle && !panel.contains(e.target) && !toggle.contains(e.target)) {
                panel.classList.remove('show');
            }
        });
    }
    
    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            } catch (e) {
                console.warn('Failed to parse accessibility settings:', e);
            }
        }
    }
    
    saveSettings() {
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
    }
    
    applySettings() {
        const body = document.body;
        
        // Remove all existing accessibility classes
        body.className = body.className.replace(/\b(text-increase-\d|text-decrease-\d|grayscale|high-contrast|negative-contrast|light-background|links-underline|readable-font)\b/g, '');
        
        // Apply text size - FIXED LOGIC
        if (this.settings.textSize > 0) {
            body.classList.add(`text-increase-${this.settings.textSize}`);
        } else if (this.settings.textSize < 0) {
            body.classList.add(`text-decrease-${Math.abs(this.settings.textSize)}`);
        }
        
        // Apply other settings
        Object.keys(this.settings).forEach(key => {
            if (key !== 'textSize' && this.settings[key]) {
                body.classList.add(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            }
        });
        
        // Debug logging
        console.log('Applied text size:', this.settings.textSize);
        console.log('Body classes:', body.className);
    }
    
    updateToggles() {
        Object.keys(this.settings).forEach(key => {
            if (key !== 'textSize') {
                const toggle = document.getElementById(`toggle-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
                if (toggle) {
                    toggle.classList.toggle('active', this.settings[key]);
                }
            }
        });
    }
    
    toggleFeature(feature) {
        const camelCase = feature.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        this.settings[camelCase] = !this.settings[camelCase];
        this.saveSettings();
        this.applySettings();
        this.updateToggles();
    }
    
    increaseText() {
        if (this.settings.textSize < 5) {
            this.settings.textSize++;
            console.log('Increasing text to level:', this.settings.textSize);
            this.saveSettings();
            this.applySettings();
            this.showTextSizeIndicator(`Text size increased to ${this.settings.textSize + 100}%`);
        } else {
            this.showTextSizeIndicator('Maximum text size reached (150%)');
        }
    }
    
    decreaseText() {
        if (this.settings.textSize > -3) {
            this.settings.textSize--;
            console.log('Decreasing text to level:', this.settings.textSize);
            this.saveSettings();
            this.applySettings();
            this.showTextSizeIndicator(`Text size decreased to ${100 + (this.settings.textSize * 10)}%`);
        } else {
            this.showTextSizeIndicator('Minimum text size reached (70%)');
        }
    }
    
    showTextSizeIndicator(message) {
        // Remove any existing indicator
        const existingIndicator = document.querySelector('.text-size-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create and show new indicator
        const indicator = document.createElement('div');
        indicator.className = 'text-size-indicator';
        indicator.textContent = message;
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 123, 255, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10002;
            box-shadow: 0 4px 20px rgba(0, 123, 255, 0.3);
            animation: textSizeIndicatorShow 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.style.animation = 'textSizeIndicatorHide 0.3s ease';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.remove();
                    }
                }, 300);
            }
        }, 2000);
    }
    
    reset() {
        this.settings = {
            textSize: 0,
            grayscale: false,
            highContrast: false,
            negativeContrast: false,
            lightBackground: false,
            linksUnderline: false,
            readableFont: false
        };
        this.saveSettings();
        this.applySettings();
        this.updateToggles();
        this.showTextSizeIndicator('All accessibility settings reset');
    }
}

// Initialize accessibility manager when DOM is ready
let accessibilityManager;

function initAccessibility() {
    accessibilityManager = new AccessibilityManager();
    
    // Add CSS animations for text size indicator
    if (!document.getElementById('text-size-indicator-styles')) {
        const style = document.createElement('style');
        style.id = 'text-size-indicator-styles';
        style.textContent = `
            @keyframes textSizeIndicatorShow {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            
            @keyframes textSizeIndicatorHide {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Global functions for onclick handlers
function toggleAccessibilityPanel() {
    const panel = document.getElementById('accessibilityPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function toggleFeature(feature) {
    if (accessibilityManager) {
        accessibilityManager.toggleFeature(feature);
    }
}

function increaseText() {
    if (accessibilityManager) {
        accessibilityManager.increaseText();
    }
}

function decreaseText() {
    if (accessibilityManager) {
        accessibilityManager.decreaseText();
    }
}

function resetAccessibility() {
    if (accessibilityManager) {
        accessibilityManager.reset();
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
    initAccessibility();
}