/*
 * Floating elements JavaScript
 * Handles:
 * - Position calculations
 * - Hover interactions
 * - Parallax effects
 * - Mouse tracking
 */

class FloatingElements {
  constructor() {
    this.container = null;
    this.tiles = [];
    this.tooltip = null;
    this.tileData = [
      { title: 'Project One', description: 'Interactive adventure game with stunning visuals' },
      { title: 'Puzzle Game', description: 'Brain-teasing puzzles with increasing difficulty' },
      { title: 'Web Tool', description: 'Productivity application for developers' },
      { title: 'Animation Demo', description: 'Showcase of advanced CSS and JS animations' },
      { title: 'Portfolio', description: 'Collection of my best creative work' },
      { title: 'Interactive Map', description: 'Geography learning game with global landmarks' },
      { title: 'Timer App', description: 'Customizable countdown tool with alerts' },
      { title: 'Photo Gallery', description: 'Dynamic image showcase with filters' }
    ];
    this.mousePosition = { x: 0, y: 0 };
  }

  init() {
    // Create container if it doesn't exist
    if (!document.querySelector('.floating-elements-container')) {
      this.createElements();
    } else {
      this.container = document.querySelector('.floating-elements-container');
      this.tiles = Array.from(document.querySelectorAll('.floating-tile'));
      this.tooltip = document.querySelector('.tooltip');
    }

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      
      if (this.tooltip) {
        // Add 15px offset to prevent flickering when hovering
        this.tooltip.style.left = `${this.mousePosition.x + 15}px`;
        this.tooltip.style.top = `${this.mousePosition.y + 15}px`;
      }
    });
  }

  createElements() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'floating-elements-container';
    
    // Create tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'tooltip';
    this.tooltip.innerHTML = '<h3></h3><p></p>';
    document.body.appendChild(this.tooltip);
    
    // Create floating tiles
    for (let i = 0; i < this.tileData.length; i++) {
      const tile = document.createElement('div');
      tile.className = 'floating-tile';
      
      const img = document.createElement('img');
      img.src = `assets/images/placeholder-${i + 1}.jpg`;
      img.alt = this.tileData[i].title;
      
      tile.appendChild(img);
      this.container.appendChild(tile);
      this.tiles.push(tile);
      
      // Add event listeners for tooltip
      tile.addEventListener('mouseenter', () => {
        this.showTooltip(i);
      });
      
      tile.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    }
    
    // Add to DOM
    document.body.appendChild(this.container);
  }
  
  showTooltip(index) {
    if (!this.tooltip) return;
    
    const titleElement = this.tooltip.querySelector('h3');
    const descElement = this.tooltip.querySelector('p');
    
    titleElement.textContent = this.tileData[index].title;
    descElement.textContent = this.tileData[index].description;
    
    this.tooltip.style.opacity = '1';
  }
  
  hideTooltip() {
    if (!this.tooltip) return;
    this.tooltip.style.opacity = '0';
  }
}

// Export for use in main script
if (typeof module !== 'undefined') {
  module.exports = { FloatingElements };
} 