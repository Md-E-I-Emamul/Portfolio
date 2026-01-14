const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-btn');
const diceResult = document.getElementById('dice-result');
const guessInput = document.getElementById('guess-input');
const winCountEl = document.getElementById('win-count');
const missCountEl = document.getElementById('miss-count');

let wins = 0;
let misses = 0;

rollBtn.addEventListener('click', () => {
    const userGuess = Number(guessInput.value);

    if (userGuess < 1 || userGuess > 6) {
        diceResult.textContent = "Please enter a number between 1 and 6.";
        return;
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;

    if (userGuess === diceRoll) {
        wins++;
        diceResult.textContent = `🎉 You guessed ${userGuess} and rolled ${diceRoll}. You WIN!`;
        winCountEl.textContent = wins;
    } else {
        misses++;
        diceResult.textContent = `❌ You guessed ${userGuess}, but rolled ${diceRoll}. Try again!`;
        missCountEl.textContent = misses;
    }

    guessInput.value = '';
});

resetBtn.addEventListener('click', () => {
    wins = 0;
    misses = 0;
    winCountEl.textContent = 0;
    missCountEl.textContent = 0;
    diceResult.textContent = "Game reset. Make a new guess!";
    guessInput.value = '';
});
