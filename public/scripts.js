document.addEventListener('DOMContentLoaded', () => {
    // Initialize intersection observers for reveal animations
    initRevealAnimations();
    
    // Initialize code typing effect for tiles
    initCodeTypingEffect();
    
    // Set up smooth scrolling for navigation links
    initSmoothScrolling();
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
}

// Code typing effect for project tiles
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
                    }, 300);
                });
            }
        });
    });
}

// Generate fake code snippets based on project title
function generateFakeCode(title) {
    const snippets = [
        `<div class="project">`,
        `  <h2>${title}</h2>`,
        `  <style>`,
        `    .${title.toLowerCase().replace(/\s+/g, '-')} {`,
        `      display: flex;`,
        `      background: var(--accent-color);`,
        `    }`,
        `  </style>`,
        `</div>`
    ];
    
    return snippets;
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
                setTimeout(typeChar, 5 + Math.random() * 10);
            } else {
                charIndex = 0;
                lineIndex++;
                setTimeout(typeLine, 50);
            }
        }
        
        typeChar();
    }
    
    typeLine();
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