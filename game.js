let currentPlayer = 1;
let gameActive = false;
let gameState = ['', '', '', '', '', '', '', '', ''];
let player1Wins = 0;
let player2Wins = 0;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const statusDisplay = document.getElementById('status');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const newGameBtn = document.getElementById('newGameBtn');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const winSound = new Audio('win1.wav');
//const drawSound = new Audio('draw.wav');
const clickSound = new Audio('select1.wav');

// Configure audio elements
winSound.preload = 'auto';
//drawSound.preload = 'auto';
clickSound.preload = 'auto';

// Function to ensure audio is loaded
function ensureAudioLoaded(audio) {
    return new Promise((resolve, reject) => {
        if (audio.readyState >= 2) {
            resolve();
        } else {
            audio.addEventListener('canplay', () => resolve());
            audio.addEventListener('error', (e) => reject(e));
            audio.load();
        }
    });
}

// Load audio files
Promise.all([ensureAudioLoaded(winSound), ensureAudioLoaded(clickSound)])
    .catch(error => console.error('Error loading audio:', error));

function stopAllSounds() {
    winSound.pause();
    winSound.currentTime = 0;
    //drawSound.pause();
    //drawSound.currentTime = 0;
    clickSound.pause();
    clickSound.currentTime = 0;
}

function playSound(sound) {
    return ensureAudioLoaded(sound)
        .then(() => {
            sound.currentTime = 0;
            sound.play();
            setTimeout(() => {
                sound.pause();
                sound.currentTime = 0;
            }, 4000);
        })
        .catch(error => {
            console.error('Error playing sound:', error);
        });
}

function initializeCounters() {
    player1Wins = 0;
    player2Wins = 0;
    document.getElementById('player1-wins').textContent = '0';
    document.getElementById('player2-wins').textContent = '0';
}

function startGame() {
    stopAllSounds();
    gameActive = true;
    currentPlayer = 1;
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusDisplay.textContent = 'دور عزام';
    cells.forEach(cell => {
        cell.innerHTML = '';
        cell.style.cursor = 'pointer';
    });
    updatePlayerIndicator();
}

function resetGame() {
    stopAllSounds();
    statusDisplay.classList.remove('winner-animation');
    startGame();
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Update sound playing in handleCellClick
    if (gameState[clickedCellIndex] !== '' || !gameActive) return;

    playSound(clickSound);

    gameState[clickedCellIndex] = currentPlayer;
    const img = document.createElement('img');
    img.src = currentPlayer === 1 ? 'azzam.jpg' : 'baba.jpg';
    clickedCell.innerHTML = '';
    clickedCell.appendChild(img);

    if (checkWin()) {
        playSound(winSound);
        if (currentPlayer === 1) {
            player1Wins++;
            document.getElementById('player1-wins').textContent = player1Wins;
        } else {
            player2Wins++;
            document.getElementById('player2-wins').textContent = player2Wins;
        }
        statusDisplay.textContent = `الفائز هو ${currentPlayer === 1 ? 'عزام' : 'بابا'}!`;
        statusDisplay.classList.add('winner-animation');
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        //playSound(drawSound);
        statusDisplay.textContent = 'تعادل!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    statusDisplay.textContent = currentPlayer === 1 ? 'دور عزام' : 'دور بابا';
    updatePlayerIndicator();
}

function updatePlayerIndicator() {
    player1.classList.toggle('active', currentPlayer === 1);
    player2.classList.toggle('active', currentPlayer === 2);
}

function checkWin() {
    const hasWon = winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === currentPlayer;
        });
    });
    
    if (hasWon) {
        // Add winning animation to all winning player's images
        const winningSymbol = currentPlayer === 1 ? 'azzam.jpg' : 'baba.jpg';
        cells.forEach(cell => {
            const img = cell.querySelector('img');
            if (img && img.src.includes(winningSymbol)) {
                img.style.animation = 'winner 1s ease infinite';
            }
        });
    }
    return hasWon;
}

function checkDraw() {
    return gameState.every(cell => cell !== '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
startBtn.addEventListener('click', startGame);
retryBtn.addEventListener('click', resetGame);
newGameBtn.addEventListener('click', () => {
    initializeCounters();
    startGame();
});

// Initialize the game and counters
initializeCounters();
startGame();
