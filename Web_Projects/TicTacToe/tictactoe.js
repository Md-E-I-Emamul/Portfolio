const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart');

const xScoreEl = document.getElementById('x-score');
const oScoreEl = document.getElementById('o-score');
const drawScoreEl = document.getElementById('draw-score');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

// Score counters
let xScore = 0, oScore = 0, drawScore = 0;

// Winning combinations
const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Handle cell click
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        const index = cell.dataset.index;
        if(board[index] !== '' || !gameActive) return;

        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('taken', currentPlayer.toLowerCase());

        if(checkWin()) {
            gameActive = false;
            if(currentPlayer === 'X') xScore++;
            else oScore++;
            updateScore();
            setTimeout(() => alert(`${currentPlayer} Wins!`), 100);
        } else if(board.every(cell => cell !== '')) {
            gameActive = false;
            drawScore++;
            updateScore();
            setTimeout(() => alert("It's a Draw!"), 100);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        }
    });
});

// Check for win
function checkWin() {
    return winningCombos.some(combo => {
        return combo.every(index => board[index] === currentPlayer);
    });
}

// Restart game
restartBtn.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'x', 'o');
    });
});

// Update scoreboard
function updateScore() {
    xScoreEl.textContent = xScore;
    oScoreEl.textContent = oScore;
    drawScoreEl.textContent = drawScore;
}
