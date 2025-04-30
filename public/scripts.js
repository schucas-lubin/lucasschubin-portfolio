document.addEventListener('DOMContentLoaded', () => {
    // Initialize intersection observers for reveal animations
    initRevealAnimations();
    
    // Initialize code typing effect for tiles
    initCodeTypingEffect();

    // Initialize code typing effect for CTA buttons
    initCtaButtonsTypingEffect();
    
    // Set up smooth scrolling for navigation links
    initSmoothScrolling();

    // Initialize background animation
    initBackgroundAnimation();
});

// Reveal animations when elements enter viewport
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal-element');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Special observer for tiles to trigger code typing when scrolled into view
    const tilesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const tile = entry.target;
                
                // Add a small delay for visual interest
                setTimeout(() => {
                    animateTileWithCodeTyping(tile);
                }, 100 + Math.random() * 200); // Reduced delay between 100-300ms
                
                tilesObserver.unobserve(tile);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all tiles for scrolling animation
    document.querySelectorAll('.tile, .gallery-item:not(.coming-soon)').forEach(tile => {
        tilesObserver.observe(tile);
    });
}

// Animate a tile with code typing effect when scrolled into view
function animateTileWithCodeTyping(tile) {
    // Create or get the code reveal element
    let codeReveal = tile.querySelector('.code-reveal');
    
    if (!codeReveal) {
        codeReveal = document.createElement('div');
        codeReveal.classList.add('code-reveal');
        tile.appendChild(codeReveal);
    }
    
    // Make sure it's not already animated
    if (!codeReveal.classList.contains('animated')) {
        codeReveal.classList.add('animated');
        
        // Generate fake code based on tile's data attributes or text content
        const title = tile.getAttribute('data-title') || tile.querySelector('h3')?.textContent || 'Element';
        const fakeCode = generateFakeCode(title);
        
        // Set up code typing animation
        codeReveal.style.opacity = '1';
        codeReveal.style.zIndex = '5';
        
        // Apply a slight initial blur
        tile.style.filter = 'blur(2px)';
        
        typeCode(codeReveal, fakeCode, () => {
            // Once typing is done, fade out code reveal and fade in the tile
            setTimeout(() => {
                codeReveal.style.opacity = '0';
                codeReveal.style.zIndex = '-1';
                tile.style.filter = 'none';
                tile.style.opacity = '1';
                tile.classList.add('visible');
            }, 150); // Reduced from 200ms
        });
    }
}

// Apply typing effect to CTA buttons on page load
function initCtaButtonsTypingEffect() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    if (ctaButtons.length === 0) return;
    
    // Hide the buttons initially
    ctaButtons.forEach(button => {
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
    });
    
    // Create a container for the typing effect
    const typingContainer = document.createElement('div');
    typingContainer.classList.add('cta-typing-container');
    ctaButtons[0].parentNode.insertBefore(typingContainer, ctaButtons[0]);
    
    // Generate and type code for the buttons
    const buttonCode = generateButtonsCode(ctaButtons);
    
    setTimeout(() => {
        typeCode(typingContainer, buttonCode, () => {
            // Once typing is done, show the real buttons and remove the typing container
            setTimeout(() => {
                ctaButtons.forEach((button, index) => {
                    setTimeout(() => {
                        button.style.visibility = 'visible';
                        button.style.opacity = '1';
                    }, index * 100); // Reduced from 150ms
                });
                
                setTimeout(() => {
                    typingContainer.remove();
                }, ctaButtons.length * 100 + 150); // Reduced from 200ms
            }, 200); // Reduced from 300ms
        });
    }, 300); // Reduced from 500ms
}

// Generate code for buttons
function generateButtonsCode(buttons) {
    const lines = [
        `<div class="cta-buttons">`,
    ];
    
    buttons.forEach(button => {
        const text = button.textContent.trim();
        const isSecondary = button.classList.contains('secondary');
        const className = isSecondary ? 'secondary' : 'primary';
        const href = button.getAttribute('href');
        
        lines.push(`  <a href="${href}" class="cta-button ${className}">`);
        lines.push(`    ${text}`);
        lines.push(`  </a>`);
    });
    
    lines.push(`</div>`);
    
    return lines;
}

// Code typing effect for project tiles (on hover, still used as fallback)
function initCodeTypingEffect() {
    const tiles = document.querySelectorAll('.tile');
    
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            const codeReveal = tile.querySelector('.code-reveal');
            
            if (codeReveal && !codeReveal.classList.contains('animated')) {
                codeReveal.classList.add('animated');
                
                // Generate fake code based on tile's data attributes
                const title = tile.getAttribute('data-title') || 'Project';
                const fakeCode = generateFakeCode(title);
                
                // Set up code typing animation
                codeReveal.style.opacity = '1';
                codeReveal.style.zIndex = '5';
                
                typeCode(codeReveal, fakeCode, () => {
                    // Once typing is done, fade out code reveal
                    setTimeout(() => {
                        codeReveal.style.opacity = '0';
                        codeReveal.style.zIndex = '-1';
                    }, 200); // Reduced from 300ms
                });
            }
        });
    });
}

// Generate fake code snippets based on project title
function generateFakeCode(title) {
    const codeStyles = [
        // HTML/CSS style
        [
            `<div class="project">`,
            `  <h2>${title}</h2>`,
            `  <style>`,
            `    .${title.toLowerCase().replace(/\s+/g, '-')} {`,
            `      display: flex;`,
            `      background: var(--accent-color);`,
            `    }`,
            `  </style>`,
            `</div>`
        ],
        // JavaScript style
        [
            `class ${title.replace(/\s+/g, '')} {`,
            `  constructor() {`,
            `    this.name = "${title}";`,
            `    this.active = true;`,
            `  }`,
            `  initialize() {`,
            `    console.log("Loading ${title}...");`,
            `  }`,
            `}`
        ],
        // React component style
        [
            `function ${title.replace(/\s+/g, '')}() {`,
            `  const [isActive, setActive] = useState(true);`,
            `  return (`,
            `    <div className="${title.toLowerCase().replace(/\s+/g, '-')}">`,
            `      <h2>${title}</h2>`,
            `      <button onClick={() => setActive(!isActive)}>`,
            `        {isActive ? "Pause" : "Start"}`,
            `      </button>`,
            `    </div>`,
            `  );`,
            `}`
        ]
    ];
    
    // Randomly select a code style
    return codeStyles[Math.floor(Math.random() * codeStyles.length)];
}

// Typing animation for code
function typeCode(element, codeLines, callback) {
    element.innerHTML = '';
    const codeContainer = document.createElement('pre');
    codeContainer.classList.add('code-container');
    element.appendChild(codeContainer);
    
    let lineIndex = 0;
    let charIndex = 0;
    
    function typeLine() {
        if (lineIndex >= codeLines.length) {
            if (callback) callback();
            return;
        }
        
        const currentLine = codeLines[lineIndex];
        const lineElement = document.createElement('div');
        lineElement.classList.add('code-line');
        codeContainer.appendChild(lineElement);
        
        function typeChar() {
            if (charIndex < currentLine.length) {
                lineElement.textContent += currentLine.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 1 + Math.random() * 3); // Reduced from 5-15ms to 1-4ms
            } else {
                charIndex = 0;
                lineIndex++;
                setTimeout(typeLine, 20); // Reduced from 50ms to 20ms
            }
        }
        
        typeChar();
    }
    
    typeLine();
}

// Initialize background animation
function initBackgroundAnimation() {
    const body = document.body;
    
    // Create background container
    const bgContainer = document.createElement('div');
    bgContainer.classList.add('background-animation');
    body.insertBefore(bgContainer, body.firstChild);
    
    // Create grid cells
    const cellCount = 50; // Adjust as needed for performance
    
    for (let i = 0; i < cellCount; i++) {
        const cell = document.createElement('div');
        cell.classList.add('bg-cell');
        
        // Assign a random position
        cell.style.left = `${Math.random() * 100}%`;
        cell.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = 20 + Math.random() * 150;
        cell.style.width = `${size}px`;
        cell.style.height = `${size * (0.5 + Math.random() * 0.8)}px`;

        // Random rotation
        cell.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
        
        // Random opacity
        cell.style.opacity = (0.02 + Math.random() * 0.08).toString();
        
        // Add special effects to some cells
        if (Math.random() < 0.15) {
            cell.classList.add('interactive');
            
            // 3D effect for some interactive cells
            if (Math.random() < 0.3) {
                cell.classList.add('panel-3d');
            }
        }
        
        bgContainer.appendChild(cell);
    }
    
    // Add mouse move event listener for parallax and glow effects
    let isThrottled = false;
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        if (isThrottled) return;
        isThrottled = true;
        
        setTimeout(() => {
            isThrottled = false;
        }, 30); // Throttle rate in ms
        
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        const cells = document.querySelectorAll('.bg-cell');
        const interactiveCells = document.querySelectorAll('.bg-cell.interactive');
        
        // Update position of all cells for subtle parallax
        cells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const cellX = rect.left + rect.width / 2;
            const cellY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to cell center
            const distX = mouseX - cellX;
            const distY = mouseY - cellY;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            // Only apply effects to nearby cells for performance
            if (distance < 300) {
                const moveX = distX * 0.02;
                const moveY = distY * 0.02;
                cell.style.transform = `rotate(${Math.random() * 30 - 15}deg) translate(${-moveX}px, ${-moveY}px)`;
                
                // Randomly trigger glow effect on cells when mouse moves nearby
                if (Math.random() < 0.05) {
                    pulseCell(cell);
                }
            }
        });
        
        // Special effects for interactive cells that are close to the mouse
        interactiveCells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const cellX = rect.left + rect.width / 2;
            const cellY = rect.top + rect.height / 2;
            
            // Calculate distance from mouse to cell center
            const distance = Math.sqrt(
                Math.pow(mouseX - cellX, 2) + 
                Math.pow(mouseY - cellY, 2)
            );
            
            // Apply glow effect when mouse is close
            if (distance < 150) {
                pulseCell(cell);
                
                // 3D tilt effect for panel cells
                if (cell.classList.contains('panel-3d')) {
                    const rotateY = (mouseX - cellX) / 20;
                    const rotateX = (cellY - mouseY) / 20;
                    cell.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            }
        });
    });
    
    // Random pulse for background effect
    setInterval(() => {
        const randomCell = document.querySelectorAll('.bg-cell')[
            Math.floor(Math.random() * cellCount)
        ];
        
        if (randomCell) {
            pulseCell(randomCell);
        }
    }, 2000);
}

// Function to create color pulse effect on a cell
function pulseCell(cell) {
    // Predefined palette of neon/pastel highlight colors
    const colors = [
        'rgba(255, 43, 119, 0.5)',   // Pink neon
        'rgba(45, 212, 191, 0.5)',    // Cyan neon
        'rgba(138, 58, 185, 0.5)',    // Purple neon
        'rgba(255, 107, 0, 0.5)',     // Orange neon
        'rgba(45, 255, 138, 0.5)',    // Green neon
        'rgba(255, 236, 61, 0.5)'     // Yellow neon
    ];
    
    // Select a random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create glow overlay
    const glow = document.createElement('div');
    glow.classList.add('cell-glow');
    glow.style.backgroundColor = color;
    cell.appendChild(glow);
    
    // Trigger animation
    setTimeout(() => {
        glow.style.opacity = '0.7';
    }, 10);
    
    // Remove after animation completes
    setTimeout(() => {
        glow.style.opacity = '0';
        setTimeout(() => {
            glow.remove();
        }, 350); // Reduced from 500ms
    }, 300); // Reduced from 400ms
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only handle same-page links
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Update navigation active state based on scroll position
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
}); 