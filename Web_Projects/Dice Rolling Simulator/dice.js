const rollBtn = document.getElementById('roll-btn');
const diceResult = document.getElementById('dice-result');

rollBtn.addEventListener('click', () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `You rolled a ${roll}! 🎲`;
});
