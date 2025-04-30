/**
 * Geography Sprint Game
 * A country-naming challenge against the clock
 */

import countriesByLetter from './countriesByLetter.js';

document.addEventListener('DOMContentLoaded', () => {
    // Current game state
    const gameState = {
        currentLetter: 'A',
        countriesForLetter: [],
        namedCountries: [],
        timeLeft: 0,
        baseTime: 0,
        timerInterval: null,
        gameActive: false,
        hintsShown: false,
        earthColors: generateEarthColors() // Store current earth colors
    };

    // DOM Elements
    const elements = {
        currentLetterEl: document.getElementById('current-letter'),
        timerValueEl: document.getElementById('timer-value'),
        timerProgressBar: document.querySelector('.timer-progress-bar'),
        countriesCounterEl: document.getElementById('countries-counter'),
        namedCountriesListEl: document.getElementById('named-countries'),
        countryForm: document.getElementById('country-form'),
        countryInput: document.getElementById('country-input'),
        decreaseTimeBtn: document.querySelector('.decrease-time'),
        increaseTimeBtn: document.querySelector('.increase-time'),
        gameResults: document.getElementById('game-results'),
        resultsMessage: document.getElementById('results-message'),
        missedCountries: document.getElementById('missed-countries'),
        playAgainButton: document.getElementById('play-again-button'),
        countryHints: document.getElementById('country-hints'),
        randomLetterBtn: document.getElementById('random-letter-btn'),
        timerRingFill: document.querySelector('.timer-ring-fill'),
        gameContainer: document.querySelector('.geo-game-container'),
        earthPixel: document.querySelector('.earth-pixel'),
        timerDisplay: document.querySelector('.timer-display')
    };

    // Generate random colors for Earth land masses
    function generateEarthColors() {
        // Generate colors in green/teal spectrum for land masses
        const baseHue = 120 + Math.floor(Math.random() * 60); // 120-180 (green to teal)
        const saturation = 50 + Math.floor(Math.random() * 30); // 50-80%
        const lightness = 30 + Math.floor(Math.random() * 20); // 30-50%

        return {
            primary: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
            secondary: `hsl(${baseHue + 10}, ${saturation - 10}%, ${lightness + 10}%)`,
            tertiary: `hsl(${baseHue - 10}, ${saturation + 5}%, ${lightness - 5}%)`
        };
    }

    // Apply Earth colors and add clouds/poles
    function updateEarthAppearance() {
        const colors = gameState.earthColors;
        let style = `
            .earth-pixel::before {
                background-image: 
                    /* Americas */
                    radial-gradient(circle at 25% 40%, ${colors.primary} 0%, ${colors.primary} 8%, transparent 8.5%),
                    /* Europe/Africa */
                    radial-gradient(circle at 55% 40%, ${colors.secondary} 0%, ${colors.secondary} 8%, transparent 8.5%),
                    /* Asia/Australia */
                    radial-gradient(circle at 75% 50%, ${colors.tertiary} 0%, ${colors.tertiary} 7%, transparent 7.5%),
                    /* North pole */
                    radial-gradient(circle at 50% 15%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 10%, transparent 10.5%),
                    /* South pole */
                    radial-gradient(circle at 50% 85%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 8%, transparent 8.5%);
            }
            
            /* Add clouds */
            .earth-pixel::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    /* Pixel grid */
                    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                    /* Cloud 1 */
                    radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.4) 3%, transparent 3.5%),
                    /* Cloud 2 */
                    radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 4%, transparent 4.5%),
                    /* Cloud 3 */
                    radial-gradient(circle at ${20 + Math.random() * 60}% ${20 + Math.random() * 60}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.35) 2.5%, transparent 3%);
                background-size: var(--pixel-size) var(--pixel-size), var(--pixel-size) var(--pixel-size), auto, auto, auto;
            }
        `;
        
        // Create or update the style element
        let styleEl = document.getElementById('earth-dynamic-style');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'earth-dynamic-style';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = style;
    }

    // Create time penalty particle effect
    function createTimePenaltyEffect() {
        const penaltyEl = document.createElement('div');
        penaltyEl.classList.add('time-penalty');
        penaltyEl.textContent = '-2';
        
        // Position next to timer
        const timerRect = elements.timerDisplay.getBoundingClientRect();
        const containerRect = elements.gameContainer.getBoundingClientRect();
        
        penaltyEl.style.left = `${timerRect.right - containerRect.left + 5}px`;
        penaltyEl.style.top = `${timerRect.top - containerRect.top}px`;
        
        elements.gameContainer.appendChild(penaltyEl);
        
        // Remove after animation completes
        setTimeout(() => {
            penaltyEl.remove();
        }, 1500);
    }

    // Initialize game with selected letter
    function initGame(letter = 'A') {
        gameState.currentLetter = letter;
        gameState.countriesForLetter = countriesByLetter[letter] || [];
        gameState.namedCountries = [];
        gameState.hintsShown = false;
        
        // Generate new earth colors if this was triggered by random letter button
        if (letter !== 'A' || !document.getElementById('earth-dynamic-style')) {
            gameState.earthColors = generateEarthColors();
            updateEarthAppearance();
        }
        
        // Update UI
        elements.currentLetterEl.textContent = letter;
        elements.namedCountriesListEl.innerHTML = '';
        
        // Calculate base time: 5 seconds per country, capped at 75 seconds
        gameState.baseTime = Math.min(gameState.countriesForLetter.length * 5, 75);
        gameState.timeLeft = gameState.baseTime;
        updateTimerDisplay();
        
        // Update counter
        updateCountriesCounter();
        
        // Hide results
        elements.gameResults.classList.remove('visible');
        
        // Clear any existing hints
        elements.countryHints.innerHTML = '';
        
        // Reset timer ring color and size
        elements.timerRingFill.style.padding = '8px'; // Initial ring size
        updateTimerRing();
        
        // Focus the input field
        elements.countryInput.focus();
    }

    // Get a random letter that has countries
    function getRandomLetter() {
        const availableLetters = Object.keys(countriesByLetter).filter(
            letter => countriesByLetter[letter].length > 0
        );
        
        const randomIndex = Math.floor(Math.random() * availableLetters.length);
        return availableLetters[randomIndex];
    }

    // Start the game
    function startGame() {
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        gameState.gameActive = true;
        
        // Start the timer
        gameState.timerInterval = setInterval(() => {
            gameState.timeLeft--;
            updateTimerDisplay();
            updateTimerRing();
            
            // Show hints halfway through the time if many countries
            if (!gameState.hintsShown && 
                gameState.countriesForLetter.length > 7 && 
                gameState.timeLeft <= gameState.baseTime / 2) {
                showCountryHints();
                gameState.hintsShown = true;
            }
            
            // Check if time is up
            if (gameState.timeLeft <= 0) {
                endGame(false);
            }
        }, 1000);
    }

    // Update the timer ring based on time remaining
    function updateTimerRing() {
        const timePercentage = gameState.timeLeft / gameState.baseTime;
        
        // Shrink the ring as time decreases - from 8px to 2px
        const ringSize = Math.max(2, Math.round(8 * timePercentage));
        elements.timerRingFill.style.padding = `${ringSize}px`;
        
        // Change timer ring color based on time percentage
        if (timePercentage <= 0.25) {
            elements.timerRingFill.style.background = 'linear-gradient(to right, #ef4444, #f59e0b)';
            // Pulse animation for urgency when time is low
            if (!elements.timerRingFill.classList.contains('urgent')) {
                elements.timerRingFill.classList.add('urgent');
            }
        } else if (timePercentage <= 0.5) {
            elements.timerRingFill.style.background = 'linear-gradient(to right, #f59e0b, #10b981)';
            elements.timerRingFill.classList.remove('urgent');
        } else {
            elements.timerRingFill.style.background = 'linear-gradient(to right, #10b981, #22d3ee)';
            elements.timerRingFill.classList.remove('urgent');
        }
    }

    // Flash timer for wrong answer
    function flashTimerPenalty() {
        elements.timerDisplay.classList.add('penalty-flash');
        setTimeout(() => {
            elements.timerDisplay.classList.remove('penalty-flash');
        }, 800);
    }

    // Show a pulse effect for wrong answers
    function showErrorPulse() {
        elements.gameContainer.classList.add('error-pulse');
        setTimeout(() => {
            elements.gameContainer.classList.remove('error-pulse');
        }, 800);
    }

    // Apply a time penalty
    function applyTimePenalty() {
        gameState.timeLeft = Math.max(1, gameState.timeLeft - 2);
        updateTimerDisplay();
        updateTimerRing();
        flashTimerPenalty();
        createTimePenaltyEffect();
    }

    // Update the timer display
    function updateTimerDisplay() {
        elements.timerValueEl.textContent = gameState.timeLeft;
        
        // Update progress bar
        const progressPercentage = (gameState.timeLeft / gameState.baseTime) * 100;
        elements.timerProgressBar.style.width = `${progressPercentage}%`;
        
        // Change color as time decreases
        if (gameState.timeLeft <= gameState.baseTime * 0.25) {
            elements.timerProgressBar.style.background = 'linear-gradient(to right, #ef4444, #f59e0b)';
        } else if (gameState.timeLeft <= gameState.baseTime * 0.5) {
            elements.timerProgressBar.style.background = 'linear-gradient(to right, #f59e0b, #10b981)';
        } else {
            elements.timerProgressBar.style.background = 'linear-gradient(to right, #10b981, #22d3ee)';
        }
    }

    // Update the countries counter
    function updateCountriesCounter() {
        elements.countriesCounterEl.textContent = `${gameState.namedCountries.length}/${gameState.countriesForLetter.length}`;
    }

    // End the game
    function endGame(completed = false) {
        clearInterval(gameState.timerInterval);
        gameState.gameActive = false;
        
        // Prepare results
        const namedCount = gameState.namedCountries.length;
        const totalCount = gameState.countriesForLetter.length;
        
        // Show different messages based on completion
        let resultMessage = '';
        if (completed) {
            resultMessage = `Congratulations! You named all ${totalCount} countries for the letter ${gameState.currentLetter}.`;
        } else {
            resultMessage = `You named ${namedCount} out of ${totalCount} countries for the letter ${gameState.currentLetter}.`;
        }
        
        elements.resultsMessage.textContent = resultMessage;
        
        // Show missed countries if any
        elements.missedCountries.innerHTML = '';
        if (namedCount < totalCount) {
            const missedCountries = gameState.countriesForLetter.filter(
                country => !gameState.namedCountries.includes(country)
            );
            
            elements.missedCountries.innerHTML = '<h3>You missed:</h3>';
            
            missedCountries.forEach(country => {
                const missedEl = document.createElement('span');
                missedEl.classList.add('missed-country');
                missedEl.textContent = country;
                elements.missedCountries.appendChild(missedEl);
            });
        } else {
            elements.missedCountries.innerHTML = '<h3>Perfect score!</h3>';
        }
        
        // Show results
        elements.gameResults.classList.add('visible');
    }

    // Show floating country hints in the background
    function showCountryHints() {
        // Get countries that haven't been named yet
        const remainingCountries = gameState.countriesForLetter.filter(
            country => !gameState.namedCountries.includes(country)
        );
        
        // Show hints for remaining countries
        remainingCountries.forEach(country => {
            const hintEl = document.createElement('div');
            hintEl.classList.add('hint-country');
            hintEl.textContent = country;
            
            // Random position
            hintEl.style.left = `${Math.random() * 90}%`;
            hintEl.style.top = `${Math.random() * 90}%`;
            
            // Random delay and duration for animation
            hintEl.style.animationDelay = `${Math.random() * 10}s`;
            hintEl.style.animationDuration = `${10 + Math.random() * 15}s`;
            
            elements.countryHints.appendChild(hintEl);
        });
    }

    // Check a submitted country name
    function checkCountry(countryName) {
        // Normalize input for case-insensitive comparison
        const normalizedInput = countryName.trim().toLowerCase();
        
        // Check if it's valid and not already entered
        const isValid = gameState.countriesForLetter.some(country => 
            country.toLowerCase() === normalizedInput
        );
        
        const isAlreadyEntered = gameState.namedCountries.some(country => 
            country.toLowerCase() === normalizedInput
        );
        
        if (isValid && !isAlreadyEntered) {
            // Find the actual country with proper case
            const actualCountry = gameState.countriesForLetter.find(country => 
                country.toLowerCase() === normalizedInput
            );
            
            // Add to named countries
            gameState.namedCountries.push(actualCountry);
            
            // Add to the UI list
            const countryElement = document.createElement('li');
            countryElement.textContent = actualCountry;
            elements.namedCountriesListEl.appendChild(countryElement);
            
            // Clear input field
            elements.countryInput.value = '';
            
            // Update counter
            updateCountriesCounter();
            
            // Check if all countries are named
            if (gameState.namedCountries.length === gameState.countriesForLetter.length) {
                endGame(true);
            }
            
            return true;
        } else if (isAlreadyEntered) {
            // Show error indication for already entered
            elements.countryInput.classList.add('error');
            setTimeout(() => {
                elements.countryInput.classList.remove('error');
            }, 500);
            return false;
        } else {
            // Wrong answer - show error and apply time penalty
            elements.countryInput.classList.add('error');
            setTimeout(() => {
                elements.countryInput.classList.remove('error');
            }, 500);
            
            // Show error pulse
            showErrorPulse();
            
            // Apply time penalty
            applyTimePenalty();
            
            return false;
        }
    }

    // Event Listeners
    elements.countryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!gameState.gameActive) {
            startGame();
        }
        
        const countryName = elements.countryInput.value;
        if (countryName.trim()) {
            if (checkCountry(countryName)) {
                // Correct answer, do nothing special
            } else {
                // Error handled in checkCountry function
            }
        }
    });
    
    // Timer controls
    elements.decreaseTimeBtn.addEventListener('click', () => {
        if (!gameState.gameActive) {
            gameState.baseTime = Math.max(gameState.baseTime - 5, 15);
            gameState.timeLeft = gameState.baseTime;
            updateTimerDisplay();
            updateTimerRing();
        }
    });
    
    elements.increaseTimeBtn.addEventListener('click', () => {
        if (!gameState.gameActive) {
            gameState.baseTime = Math.min(gameState.baseTime + 5, 120);
            gameState.timeLeft = gameState.baseTime;
            updateTimerDisplay();
            updateTimerRing();
        }
    });
    
    // Random letter button
    elements.randomLetterBtn.addEventListener('click', () => {
        if (!gameState.gameActive) {
            const randomLetter = getRandomLetter();
            
            // Add visual feedback when changing letter
            elements.currentLetterEl.parentElement.classList.add('changing');
            setTimeout(() => {
                elements.currentLetterEl.parentElement.classList.remove('changing');
            }, 500);
            
            initGame(randomLetter);
        } else {
            // If game is active, provide visual feedback that user needs to finish current game
            elements.randomLetterBtn.classList.add('disabled');
            setTimeout(() => {
                elements.randomLetterBtn.classList.remove('disabled');
            }, 400);
        }
    });
    
    // Play again button
    elements.playAgainButton.addEventListener('click', () => {
        initGame(gameState.currentLetter);
    });
    
    // Auto-start when typing
    elements.countryInput.addEventListener('input', () => {
        if (!gameState.gameActive && elements.countryInput.value.trim()) {
            startGame();
        }
    });

    // Initialize the game
    initGame('A');
});
