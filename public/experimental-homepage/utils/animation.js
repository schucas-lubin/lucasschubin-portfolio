/*
 * Animation helper functions
 * Provides:
 * - Entrance/exit animations
 * - Element transitions
 * - Scroll-based triggers
 * - Performance optimizations
 */

class AnimationUtils {
  constructor() {
    this.animatingElements = new Set();
    this.observer = null;
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const options = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% visibility triggers callback
    };
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.dataset.animation;
          
          if (animationType) {
            this.triggerAnimation(element, animationType);
          }
          
          // Only observe once if data-animate-once is set
          if (element.dataset.animateOnce === 'true') {
            this.observer.unobserve(element);
          }
        } else if (element.dataset.animateOnce !== 'true') {
          // Remove animation class when out of view for repeatable animations
          this.removeAnimation(element);
        }
      });
    }, options);
  }

  observeElement(element, animationType, animateOnce = true) {
    if (!element || !animationType) return;
    
    element.dataset.animation = animationType;
    element.dataset.animateOnce = animateOnce.toString();
    this.observer.observe(element);
  }

  triggerAnimation(element, animationType) {
    if (!element || this.animatingElements.has(element)) return;
    
    // Mark as animating
    this.animatingElements.add(element);
    
    // Add animation class
    element.classList.add(`animate-${animationType}`);
    
    // Listen for animation end to clean up
    element.addEventListener('animationend', () => {
      // Keep the final state of the animation
      element.classList.remove(`animate-${animationType}`);
      element.classList.add(`animated-${animationType}`);
      this.animatingElements.delete(element);
    }, { once: true });
  }

  removeAnimation(element) {
    if (!element || !element.dataset.animation) return;
    
    const animationType = element.dataset.animation;
    element.classList.remove(`animate-${animationType}`);
    element.classList.remove(`animated-${animationType}`);
  }

  // Manual trigger for animations without IntersectionObserver
  animate(element, animationType, duration = 1000) {
    if (!element) return;
    
    // Apply animation
    element.style.animationDuration = `${duration}ms`;
    this.triggerAnimation(element, animationType);
  }

  // Utility for staggered animations on multiple elements
  stagger(elements, animationType, staggerDelay = 100, initialDelay = 0) {
    if (!elements || !elements.length) return;
    
    elements.forEach((element, index) => {
      const delay = initialDelay + (index * staggerDelay);
      setTimeout(() => {
        this.animate(element, animationType);
      }, delay);
    });
  }
}

// Export for use in main script
if (typeof module !== 'undefined') {
  module.exports = { AnimationUtils };
} 