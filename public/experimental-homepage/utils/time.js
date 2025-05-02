/*
 * Time utility functions
 * Handles:
 * - Real-time clock display
 * - Formatted time output
 * - Time-based animations
 * - Date localization
 */

class Clock {
  constructor() {
    this.clockElement = null;
    this.interval = null;
  }

  init() {
    this.createClockElement();
    this.startClock();
  }

  createClockElement() {
    // Check if clock already exists
    if (document.getElementById('clock')) {
      this.clockElement = document.getElementById('clock');
      return;
    }

    // Create clock element
    this.clockElement = document.createElement('div');
    this.clockElement.id = 'clock';
    this.clockElement.className = 'clock';
    
    // Style the clock
    Object.assign(this.clockElement.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      fontFamily: 'monospace',
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.85)',
      zIndex: '10',
      userSelect: 'none',
      transition: 'color 0.3s ease'
    });

    // Add to DOM
    document.body.appendChild(this.clockElement);
  }

  startClock() {
    // Update immediately
    this.updateTime();
    
    // Set interval to update every second
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
    
    // Format as HH:MM:SS 
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Update clock text
    this.clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }

  // Update clock color based on theme
  updateTheme(isDark) {
    if (!this.clockElement) return;
    
    this.clockElement.style.color = isDark 
      ? 'rgba(255, 255, 255, 0.85)' 
      : 'rgba(30, 30, 30, 0.85)';
  }

  destroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

// Export for use in main script
if (typeof module !== 'undefined') {
  module.exports = { Clock };
} 