/*
 * Grid component JavaScript
 * Handles:
 * - Grid cell animations
 * - Responsive behaviors
 * - Interactive effects
 */

class Grid {
  constructor() {
    this.container = null;
    this.grid = null;
    this.cells = [];
    this.mousePosition = { x: 0, y: 0 };
  }

  init() {
    // Create grid container if it doesn't exist
    if (!document.querySelector('.grid-container')) {
      this.createGridElements();
    } else {
      this.container = document.querySelector('.grid-container');
      this.grid = document.querySelector('.grid');
      this.cells = Array.from(document.querySelectorAll('.grid-cell'));
    }

    // Initialize grid size based on viewport
    this.updateGridSize();
    
    // Add resize listener
    window.addEventListener('resize', () => this.updateGridSize());
  }

  createGridElements() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'grid-container';
    
    // Create grid
    this.grid = document.createElement('div');
    this.grid.className = 'grid';
    
    // Append grid to container
    this.container.appendChild(this.grid);
    
    // Add to DOM
    document.body.appendChild(this.container);
    
    // Generate cells
    this.generateCells();
  }

  generateCells() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    const columns = Math.ceil(viewportWidth / 40) + 1;
    const rows = Math.ceil(viewportHeight / 40) + 1;
    
    this.grid.innerHTML = '';
    this.cells = [];
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        this.grid.appendChild(cell);
        this.cells.push(cell);
      }
    }
  }

  updateGridSize() {
    this.generateCells();
  }
}

// Export for use in main script
if (typeof module !== 'undefined') {
  module.exports = { Grid };
} 