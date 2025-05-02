/*
 * Main JavaScript file for experimental homepage
 * Will handle:
 * - Initialization
 * - Event listeners
 * - Navigation logic
 * - Component loading
 */

// Main App class to initialize and control all components
class App {
  constructor() {
    this.grid = null;
    this.floatingElements = null;
    this.clock = null;
    this.isDarkTheme = false;
    this.dockContainer = null;
    this.dockIcons = [
      { id: 'github', url: 'https://github.com/lucasschubin' },
      { id: 'theme', icon: 'moon', action: this.toggleTheme.bind(this) },
      { id: 'games', icon: 'game', url: '/games/index.html' },
      { id: 'user', icon: 'user', url: '/about' },
      { id: 'tools', icon: 'tools', url: '/projects/index.html' },
      { id: 'home', icon: 'home', url: '/index.html' }
    ];
  }

  init() {
    // Check for saved theme preference
    this.loadThemePreference();
    
    // Initialize grid
    this.initGrid();
    
    // Initialize floating elements
    this.initFloatingElements();
    
    // Initialize clock
    this.initClock();
    
    // Initialize dock
    this.initDock();
    
    // Add window event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  initGrid() {
    try {
      this.grid = new Grid();
      this.grid.init();
    } catch (error) {
      console.error('Error initializing grid:', error);
    }
  }

  initFloatingElements() {
    try {
      this.floatingElements = new FloatingElements();
      this.floatingElements.init();
    } catch (error) {
      console.error('Error initializing floating elements:', error);
    }
  }

  initClock() {
    try {
      this.clock = new Clock();
      this.clock.init();
    } catch (error) {
      console.error('Error initializing clock:', error);
    }
  }

  initDock() {
    this.dockContainer = document.querySelector('.dock-container');
    if (!this.dockContainer) return;
    
    // Create dock icons
    this.dockIcons.forEach(icon => {
      const iconElement = document.createElement('div');
      iconElement.className = 'dock-icon';
      iconElement.setAttribute('data-id', icon.id);
      
      // Set icon SVG
      const iconId = icon.icon || icon.id;
      iconElement.innerHTML = DOCK_ICONS[iconId];
      
      // Add click event
      iconElement.addEventListener('click', (e) => {
        if (icon.action) {
          icon.action(e);
        } else if (icon.url) {
          window.location.href = icon.url;
        }
      });
      
      // Add to dock
      this.dockContainer.appendChild(iconElement);
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    
    // Save theme preference
    localStorage.setItem('darkTheme', this.isDarkTheme);
    
    // Update theme icon
    const themeIcon = document.querySelector('.dock-icon[data-id="theme"]');
    if (themeIcon) {
      themeIcon.innerHTML = this.isDarkTheme ? DOCK_ICONS.sun : DOCK_ICONS.moon;
    }
    
    // Update clock color
    if (this.clock) {
      this.clock.updateTheme(this.isDarkTheme);
    }
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      this.isDarkTheme = true;
      document.body.classList.add('dark-theme');
    }
  }

  handleResize() {
    // Resize grid if needed
    if (this.grid) {
      this.grid.updateGridSize();
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
}); 