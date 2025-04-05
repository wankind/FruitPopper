// Game variables
let currentPlayer = 1; // 1 or 2
let player1Score = 0;
let player2Score = 0;
let player1Name = "Player 1";
let player2Name = "Player 2";
let lives = 3;
let timeLeft = 30;
let gameInterval;
let fruitInterval;
let isGameRunning = false;
let fruitsPopped = 0;

// DOM elements
const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const turnTransition = document.getElementById('turn-transition');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const nextTurnButton = document.getElementById('next-turn-button');
const restartButton = document.getElementById('restart-button');
const scoreP1Element = document.getElementById('score-p1');
const scoreP2Element = document.getElementById('score-p2');
const livesElement = document.getElementById('lives');
const timeElement = document.getElementById('time');
const currentPlayerElement = document.getElementById('current-player');
const nextPlayerElement = document.getElementById('next-player-name');
const finalScoreP1Element = document.getElementById('final-score-p1');
const finalScoreP2Element = document.getElementById('final-score-p2');
const p1NameElement = document.getElementById('p1-name');
const p2NameElement = document.getElementById('p2-name');
const winnerElement = document.getElementById('winner-announcement');
const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');

// Fruit types with their properties
const fruitTypes = [
    { name: 'apple', points: 10, speed: 3, size: 60, color: '#ff0000', image: 'images/apple.svg' },
    { name: 'orange', points: 15, speed: 4, size: 65, color: '#ffa500', image: 'images/orange.svg' },
    { name: 'banana', points: 20, speed: 5, size: 70, color: '#ffff00', image: 'images/banana.svg' },
    { name: 'watermelon', points: 30, speed: 2, size: 80, color: '#00ff00', image: 'images/watermelon.svg' },
    { name: 'bomb', points: -50, speed: 6, size: 60, color: '#000000', image: 'images/bomb.svg' },
    { name: 'pear', points: 10, speed: 4, size: 50, color: '#00ff00', image: 'images/Pear_flat.svg' },
    { name: 'tomato', points: 10, speed: 6, size: 60, color: '#ff0000', image: 'images/tomato_flat.svg' }
];

// Event listeners
startButton.addEventListener('click', startGame);
nextTurnButton.addEventListener('click', startNextTurn);
restartButton.addEventListener('click', startGame);

// Initialize game
function startGame() {
    // Get player names from input fields
    player1Name = player1Input.value || "Player 1";
    player2Name = player2Input.value || "Player 2";
    
    // Reset game state
    currentPlayer = 1;
    player1Score = 0;
    player2Score = 0;
    lives = 3;
    timeLeft = 30;
    fruitsPopped = 0;
    isGameRunning = true;
    
    // Update UI
    scoreP1Element.textContent = player1Score;
    scoreP2Element.textContent = player2Score;
    livesElement.textContent = lives;
    timeElement.textContent = timeLeft;
    currentPlayerElement.textContent = player1Name;
    
    // Update player names in all places
    p1NameElement.textContent = player1Name;
    p2NameElement.textContent = player2Name;
    
    // Hide start/game over screens
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    turnTransition.classList.add('hidden');
    
    // Remove any existing fruits
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
    
    // Start game loops
    gameInterval = setInterval(updateGame, 1000);
    fruitInterval = setInterval(spawnFruit, 1000);
}

// Start the next player's turn
function startNextTurn() {
    // Switch to the next player
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    
    // Reset turn state
    lives = 3;
    timeLeft = 30;
    fruitsPopped = 0;
    isGameRunning = true;
    
    // Update UI
    livesElement.textContent = lives;
    timeElement.textContent = timeLeft;
    currentPlayerElement.textContent = currentPlayer === 1 ? player1Name : player2Name;
    
    // Hide transition screen
    turnTransition.classList.add('hidden');
    
    // Remove any existing fruits
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
    
    // Start game loops
    gameInterval = setInterval(updateGame, 1000);
    fruitInterval = setInterval(spawnFruit, 1000);
}

// Update game state (called every second)
function updateGame() {
    timeLeft--;
    timeElement.textContent = timeLeft;
    
    // Increase difficulty over time by spawning fruits more frequently
    if (timeLeft % 10 === 0 && timeLeft > 0) {
        clearInterval(fruitInterval);
        const newInterval = Math.max(300, 1000 - (30 - timeLeft) * 20);
        fruitInterval = setInterval(spawnFruit, newInterval);
    }
    
    // Check if turn is over
    if (timeLeft <= 0 || lives <= 0) {
        endTurn();
    }
}

// End the current player's turn
function endTurn() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(fruitInterval);
    
    // Remove any remaining fruits
    document.querySelectorAll('.fruit').forEach(fruit => fruit.remove());
    
    // If both players have had their turn, end the game
    if ((currentPlayer === 2) || (currentPlayer === 1 && player2Score > 0)) {
        endGame();
    } else {
        // Prepare for next player's turn
        nextPlayerElement.textContent = player2Name;
        turnTransition.classList.remove('hidden');
    }
}

// End the game and show results
function endGame() {
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
}

// Spawn a new fruit
function spawnFruit() {
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
    
    // Position fruit at random horizontal position at the bottom of the screen
    const gameAreaWidth = gameArea.clientWidth;
    const gameAreaHeight = gameArea.clientHeight;
    const randomX = Math.random() * (gameAreaWidth - fruitType.size);
    fruit.style.left = `${randomX}px`;
    fruit.style.bottom = '0px';
    
    // Add click event to pop the fruit
    fruit.addEventListener('click', () => {
        if (!fruit.classList.contains('popped')) {
            popFruit(fruit);
        }
    });
    
    // Add fruit to game area
    gameArea.appendChild(fruit);
    
    // Animate fruit moving upward
    const animationDuration = Math.random() * 2 + 2; // 2-4 seconds
    fruit.style.transition = `bottom ${animationDuration}s ease-out`;
    
    // Start animation in the next frame to ensure transition works
    requestAnimationFrame(() => {
        fruit.style.bottom = `${gameAreaHeight + fruitType.size}px`;
    });
    
    // Remove fruit after animation completes if not popped
    setTimeout(() => {
        if (gameArea.contains(fruit) && !fruit.classList.contains('popped')) {
            // If it was a regular fruit (not a bomb) and it wasn't popped, lose a life
            if (fruitType.name !== 'bomb') {
                decreaseLife();
            }
            fruit.remove();
        }
    }, animationDuration * 1000);
}

// Pop a fruit when clicked
function popFruit(fruit) {
    // Mark as popped to prevent multiple clicks
    fruit.classList.add('popped');
    
    // Get points and color from the fruit
    const points = parseInt(fruit.dataset.points);
    const fruitType = fruit.dataset.type;
    const fruitColor = fruit.dataset.color;
    
    // Get fruit position for explosion effect
    const fruitRect = fruit.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    const fruitX = fruitRect.left - gameAreaRect.left + fruitRect.width / 2;
    const fruitY = fruitRect.top - gameAreaRect.top + fruitRect.height / 2;
    
    // Create explosion effect
    createExplosion(fruitX, fruitY, fruitColor);
    
    // Update score for current player
    if (currentPlayer === 1) {
        player1Score += points;
        scoreP1Element.textContent = player1Score;
    } else {
        player2Score += points;
        scoreP2Element.textContent = player2Score;
    }
    
    // If it's a bomb, decrease life
    if (fruitType === 'bomb') {
        decreaseLife();
    } else {
        fruitsPopped++;
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
function createExplosion(x, y, color) {
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

// Decrease life when a fruit is missed or a bomb is clicked
function decreaseLife() {
    lives--;
    livesElement.textContent = lives;
    
    // Visual feedback for losing a life
    document.querySelector('.lives').classList.add('life-lost');
    setTimeout(() => {
        document.querySelector('.lives').classList.remove('life-lost');
    }, 500);
    
    // Check if turn is over
    if (lives <= 0) {
        endTurn();
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
