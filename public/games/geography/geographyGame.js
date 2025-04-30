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
        hintsShown: false
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
        countryHints: document.getElementById('country-hints')
    };

    // Initialize game with selected letter
    function initGame(letter = 'A') {
        gameState.currentLetter = letter;
        gameState.countriesForLetter = countriesByLetter[letter] || [];
        gameState.namedCountries = [];
        gameState.hintsShown = false;
        
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
        
        // Focus the input field
        elements.countryInput.focus();
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
            checkCountry(countryName);
        }
    });
    
    // Timer controls
    elements.decreaseTimeBtn.addEventListener('click', () => {
        if (!gameState.gameActive) {
            gameState.baseTime = Math.max(gameState.baseTime - 5, 15);
            gameState.timeLeft = gameState.baseTime;
            updateTimerDisplay();
        }
    });
    
    elements.increaseTimeBtn.addEventListener('click', () => {
        if (!gameState.gameActive) {
            gameState.baseTime = Math.min(gameState.baseTime + 5, 120);
            gameState.timeLeft = gameState.baseTime;
            updateTimerDisplay();
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
