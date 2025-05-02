/*
 * Theme controller JavaScript
 * Handles:
 * - Theme toggle functionality
 * - User preference detection
 * - Local storage for theme preference
 * - Transition effects
 */

class ThemeController {
  constructor() {
    this.isDarkTheme = false;
    this.themeToggleButton = null;
  }

  init() {
    this.detectPreference();
    this.applyTheme();
  }

  detectPreference() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
      this.isDarkTheme = savedTheme === 'true';
      return;
    }
    
    // Check system preference as fallback
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkTheme = true;
    }
  }

  toggle() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.savePreference();
  }

  applyTheme() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  savePreference() {
    localStorage.setItem('darkTheme', this.isDarkTheme);
  }

  getCurrentTheme() {
    return this.isDarkTheme ? 'dark' : 'light';
  }
}

// Export for use in main script
if (typeof module !== 'undefined') {
  module.exports = { ThemeController };
} 