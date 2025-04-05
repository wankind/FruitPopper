// Game variables
let player1Score = 0;
let player2Score = 0;
let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Lives = 3;
let player2Lives = 3;
let timeLeft = 30;
let gameInterval;
let fruitIntervalP1;
let fruitIntervalP2;
let isGameRunning = false;

// DOM elements
const gameAreaP1 = document.getElementById('game-area-p1');
const gameAreaP2 = document.getElementById('game-area-p2');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreP1Element = document.getElementById('score-p1');
const scoreP2Element = document.getElementById('score-p2');
const livesP1Element = document.getElementById('lives-p1');
const livesP2Element = document.getElementById('lives-p2');
const timeElement = document.getElementById('time');
const finalScoreP1Element = document.getElementById('final-score-p1');
const finalScoreP2Element = document.getElementById('final-score-p2');
const p1NameElement = document.getElementById('p1-name');
const p2NameElement = document.getElementById('p2-name');
const winnerElement = document.getElementById('winner-announcement');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');

// Fruit types with their properties
const fruitTypes = [
    // { name: 'apple', points: 10, speed: 3, size: 60, color: '#ff0000', image: 'images/apple.svg' },
    // { name: 'orange', points: 15, speed: 4, size: 65, color: '#ffa500', image: 'images/orange.svg' },
    // { name: 'banana', points: 20, speed: 5, size: 70, color: '#ffff00', image: 'images/banana.svg' },
    // { name: 'watermelon', points: 30, speed: 2, size: 80, color: '#00ff00', image: 'images/watermelon.svg' },
    // { name: 'pear', points: 10, speed: 4, size: 50, color: '#00ff00', image: 'images/Pear_flat.svg' },
    { name: 'bomb', points: -50, speed: 6, size: 60, color: '#000000', image: 'images/bomb.svg' },
    { name: 'tomato', points: 10, speed: 6, size: 60, color: '#ff0000', image: 'images/tomato_flat.svg' }
];

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Initialize game
function startGame() {
    // Get player names from input fields
    player1Name = player1Input.value || "Player 1";
    player2Name = player2Input.value || "Player 2";
    
    // Reset game state
    player1Score = 0;
    player2Score = 0;
    player1Lives = 3;
    player2Lives = 3;
    timeLeft = 30;
    isGameRunning = true;
    
    // Update UI
    scoreP1Element.textContent = player1Score;
    scoreP2Element.textContent = player2Score;
    livesP1Element.textContent = player1Lives;
    livesP2Element.textContent = player2Lives;
    timeElement.textContent = timeLeft;
    
    // Update player names in all places
    p1NameElement.textContent = player1Name;
    p2NameElement.textContent = player2Name;
    
    // Hide start/game over screens
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    
    // Remove any existing fruits, "OUT!" labels, and overlays
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
    document.querySelectorAll('.game-over-text').forEach(text => text.remove());
    document.querySelectorAll('.player-out-overlay').forEach(overlay => overlay.remove());
    
    // Start game loops
    gameInterval = setInterval(updateGame, 1000);
    
    // Start spawning fruits for both players
    const baseInterval = 1000;
    fruitIntervalP1 = setInterval(() => spawnFruit(gameAreaP1, 1), baseInterval);
    fruitIntervalP2 = setInterval(() => spawnFruit(gameAreaP2, 2), baseInterval);
}

// Update game state (called every second)
function updateGame() {
    timeLeft--;
    timeElement.textContent = timeLeft;
    
    // Increase difficulty over time by spawning fruits more frequently
    if (timeLeft % 10 === 0 && timeLeft > 0) {
        // Increase spawn rate for both players
        const newInterval = Math.max(300, 1000 - (30 - timeLeft) * 20);
        
        clearInterval(fruitIntervalP1);
        clearInterval(fruitIntervalP2);
        
        fruitIntervalP1 = setInterval(() => spawnFruit(gameAreaP1, 1), newInterval);
        fruitIntervalP2 = setInterval(() => spawnFruit(gameAreaP2, 2), newInterval);
    }
    
    // Check if game is over
    if (timeLeft <= 0 || (player1Lives <= 0 && player2Lives <= 0)) {
        endGame();
    }
}

// End the game and show results
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(fruitIntervalP1);
    clearInterval(fruitIntervalP2);
    
    // Update final scores
    finalScoreP1Element.textContent = player1Score;
    finalScoreP2Element.textContent = player2Score;
    
    // Determine winner
    if (player1Score > player2Score) {
        winnerElement.textContent = `${player1Name} Wins!`;
    } else if (player2Score > player1Score) {
        winnerElement.textContent = `${player2Name} Wins!`;
    } else {
        winnerElement.textContent = "It's a Tie!";
    }
    
    // Show game over screen
    gameOverScreen.classList.remove('hidden');
    
    // Remove any remaining fruits
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
}

// Spawn a new fruit in the specified game area for the specified player
function spawnFruit(gameArea, playerNumber) {
    if (!isGameRunning) return;
    
    // Select random fruit type (10% chance for a bomb)
    const isBomb = Math.random() < 0.1;
    const bombIndex = fruitTypes.findIndex(fruit => fruit.name === 'bomb');
    
    // If bomb, use the bomb; otherwise select from non-bomb fruits
    let fruitType;
    if (isBomb) {
        fruitType = fruitTypes[bombIndex];
    } else {
        // Create array of non-bomb fruits
        const regularFruits = fruitTypes.filter(fruit => fruit.name !== 'bomb');
        fruitType = regularFruits[Math.floor(Math.random() * regularFruits.length)];
    }
    
    // Create fruit element
    const fruit = document.createElement('div');
    fruit.className = 'fruit';
    fruit.dataset.type = fruitType.name;
    fruit.dataset.points = fruitType.points;
    fruit.dataset.color = fruitType.color;
    fruit.dataset.player = playerNumber;
    
    // Set fruit appearance
    fruit.style.width = `${fruitType.size}px`;
    fruit.style.height = `${fruitType.size}px`;
    fruit.style.borderRadius = '50%';
    
    // Try to load image, fallback to colored circle if image fails
    const img = document.createElement('img');
    img.src = fruitType.image;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.onerror = () => {
        img.style.display = 'none';
        fruit.style.backgroundColor = fruitType.color;
    };
    fruit.appendChild(img);
    
    // Position fruit at random horizontal position at the top of the screen
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;
    const randomX = Math.random() * (gameAreaWidth - fruitType.size);
    fruit.style.left = `${randomX}px`;
    fruit.style.top = '0px';
    
    // Add click event to pop the fruit
    fruit.addEventListener('click', () => {
        if (!fruit.classList.contains('popped')) {
            popFruit(fruit, gameArea);
        }
    });
    
    // Add fruit to game area
    gameArea.appendChild(fruit);
    
    // Animate fruit falling downward
    const animationDuration = Math.random() * 2 + 2; // 2-4 seconds
    fruit.style.transition = `top ${animationDuration}s linear`;
    
    // Start animation in the next frame to ensure transition works
    requestAnimationFrame(() => {
        fruit.style.top = `${gameAreaHeight}px`;
    });
    
    // Remove fruit after animation completes if not popped
    setTimeout(() => {
        if (gameArea.contains(fruit) && !fruit.classList.contains('popped')) {
            // If it was a regular fruit (not a bomb) and it wasn't popped, lose a life
            if (fruitType.name !== 'bomb') {
                decreaseLife(playerNumber);
            }
            fruit.remove();
        }
    }, animationDuration * 1000);
}

// Pop a fruit when clicked
function popFruit(fruit, gameArea) {
    // Mark as popped to prevent multiple clicks
    fruit.classList.add('popped');
    
    // Get points, color, and player from the fruit
    const points = parseInt(fruit.dataset.points);
    const fruitType = fruit.dataset.type;
    const fruitColor = fruit.dataset.color;
    const playerNumber = parseInt(fruit.dataset.player);
    
    // Get fruit position for explosion effect
    const fruitRect = fruit.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    const fruitX = fruitRect.left - gameAreaRect.left + fruitRect.width / 2;
    const fruitY = fruitRect.top - gameAreaRect.top + fruitRect.height / 2;
    
    // Create explosion effect
    createExplosion(fruitX, fruitY, fruitColor, gameArea);
    
    // Update score for the player
    if (playerNumber === 1) {
        player1Score += points;
        scoreP1Element.textContent = player1Score;
    } else {
        player2Score += points;
        scoreP2Element.textContent = player2Score;
    }
    
    // If it's a bomb, decrease life
    if (fruitType === 'bomb') {
        decreaseLife(playerNumber);
    }
    
    // Show points animation
    const pointsAnimation = document.createElement('div');
    pointsAnimation.textContent = points > 0 ? `+${points}` : points;
    pointsAnimation.style.position = 'absolute';
    pointsAnimation.style.left = `${fruitX}px`;
    pointsAnimation.style.top = `${fruitY}px`;
    pointsAnimation.style.color = points > 0 ? '#00ff00' : '#ff0000';
    pointsAnimation.style.fontSize = '24px';
    pointsAnimation.style.fontWeight = 'bold';
    pointsAnimation.style.zIndex = '100';
    pointsAnimation.style.pointerEvents = 'none';
    pointsAnimation.style.animation = 'fadeUp 1s forwards';
    gameArea.appendChild(pointsAnimation);
    
    // Remove points animation after it completes
    setTimeout(() => {
        pointsAnimation.remove();
    }, 1000);
    
    // Remove fruit after pop animation
    setTimeout(() => {
        fruit.remove();
    }, 300);
}

// Create explosion effect
function createExplosion(x, y, color, gameArea) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameArea.appendChild(explosion);
    
    // Create multiple particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.backgroundColor = color;
        
        // Random direction for each particle
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 80;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        // Set custom properties for the animation
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        
        explosion.appendChild(particle);
    }
    
    // Remove explosion after animation completes
    setTimeout(() => {
        explosion.remove();
    }, 500);
}

// Decrease life for the specified player
function decreaseLife(playerNumber) {
    if (playerNumber === 1) {
        player1Lives--;
        livesP1Element.textContent = player1Lives;
        
        // Visual feedback for losing a life
        const livesElement = document.querySelector('.player1-side .lives');
        livesElement.classList.add('life-lost');
        setTimeout(() => {
            livesElement.classList.remove('life-lost');
        }, 500);
        
        // Check if player is out
        if (player1Lives <= 0) {
            // Stop spawning fruits for this player
            clearInterval(fruitIntervalP1);
            
            // Remove all fruits for this player
            gameAreaP1.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
            
            // Add "Game Over" text for this player
            const gameOverText = document.createElement('div');
            gameOverText.textContent = "OUT!";
            gameOverText.className = "game-over-text";
            gameOverText.style.position = 'absolute';
            gameOverText.style.top = '50%';
            gameOverText.style.left = '50%';
            gameOverText.style.transform = 'translate(-50%, -50%)';
            gameOverText.style.color = 'white';
            gameOverText.style.fontSize = '3rem';
            gameOverText.style.fontWeight = 'bold';
            gameOverText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            gameAreaP1.appendChild(gameOverText);
            
            // Add a transparent overlay to prevent clicking in this area
            const overlay = document.createElement('div');
            overlay.className = "player-out-overlay";
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '5';
            gameAreaP1.appendChild(overlay);
            
            // Check if both players are out
            if (player2Lives <= 0) {
                endGame();
            }
        }
    } else {
        player2Lives--;
        livesP2Element.textContent = player2Lives;
        
        // Visual feedback for losing a life
        const livesElement = document.querySelector('.player2-side .lives');
        livesElement.classList.add('life-lost');
        setTimeout(() => {
            livesElement.classList.remove('life-lost');
        }, 500);
        
        // Check if player is out
        if (player2Lives <= 0) {
            // Stop spawning fruits for this player
            clearInterval(fruitIntervalP2);
            
            // Remove all fruits for this player
            gameAreaP2.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
            
            // Add "Game Over" text for this player
            const gameOverText = document.createElement('div');
            gameOverText.textContent = "OUT!";
            gameOverText.className = "game-over-text";
            gameOverText.style.position = 'absolute';
            gameOverText.style.top = '50%';
            gameOverText.style.left = '50%';
            gameOverText.style.transform = 'translate(-50%, -50%)';
            gameOverText.style.color = 'white';
            gameOverText.style.fontSize = '3rem';
            gameOverText.style.fontWeight = 'bold';
            gameOverText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
            gameAreaP2.appendChild(gameOverText);
            
            // Add a transparent overlay to prevent clicking in this area
            const overlay = document.createElement('div');
            overlay.className = "player-out-overlay";
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '5';
            gameAreaP2.appendChild(overlay);
            
            // Check if both players are out
            if (player1Lives <= 0) {
                endGame();
            }
        }
    }
}

// Add CSS for the points animation and life lost effect
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-50px);
            opacity: 0;
        }
    }
    
    .life-lost {
        animation: flash 0.5s;
    }
    
    @keyframes flash {
        0%, 100% {
            background-color: rgba(255, 255, 255, 0.2);
        }
        50% {
            background-color: rgba(255, 0, 0, 0.7);
        }
    }
`;
document.head.appendChild(style);
