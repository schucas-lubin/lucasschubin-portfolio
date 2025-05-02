/*
 * Mouse tracking utilities
 * Handles:
 * - Cursor position tracking
 * - Movement calculations
 * - Grid cell highlighting
 * - Interactive element behaviors
 */

class MouseTracker {
  constructor() {
    this.position = { x: 0, y: 0 };
    this.prevPosition = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.isTracking = false;
    this.callbacks = [];
  }

  init() {
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseenter', () => { this.isTracking = true; });
    document.addEventListener('mouseleave', () => { this.isTracking = false; });
  }

  handleMouseMove(e) {
    // Store previous position
    this.prevPosition = { ...this.position };
    
    // Update current position
    this.position.x = e.clientX;
    this.position.y = e.clientY;
    
    // Calculate velocity
    this.velocity.x = this.position.x - this.prevPosition.x;
    this.velocity.y = this.position.y - this.prevPosition.y;
    
    // Notify subscribers
    this.notifyCallbacks();
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
      return this.callbacks.length - 1; // Return index for unsubscribe
    }
    return -1;
  }

  unsubscribe(index) {
    if (index >= 0 && index < this.callbacks.length) {
      this.callbacks.splice(index, 1);
      return true;
    }
    return false;
  }

  notifyCallbacks() {
    const data = {
      position: this.position,
      prevPosition: this.prevPosition,
      velocity: this.velocity,
      isTracking: this.isTracking
    };
    
    this.callbacks.forEach(callback => callback(data));
  }

  getPosition() {
    return { ...this.position };
  }

  getVelocity() {
    return { ...this.velocity };
  }
}

// Export for use in main script
if (typeof module !== 'undefined') {
  module.exports = { MouseTracker };
} 