let selectedLevel = null;
let currentLevel = 1;
let score = 0;
const targetScore = 5; // Antal rätt för att vinna nivån
let currentAnswer = 0;

// Element
const answerInput = document.getElementById('answer-input');
const questionElement = document.getElementById('question');
const feedbackElement = document.getElementById('feedback');
const levelIndicator = document.getElementById('level-indicator');
const startGameBtn = document.getElementById('start-game-btn');
const progressBar = document.getElementById('progress-bar');
const gameCard = document.getElementById('game-card');

// Smooth skärmväxlare
function goToScreen(screenId) {
    const activeScreen = document.querySelector('.screen.active');
    const targetScreen = document.getElementById(screenId);
    
    if (activeScreen) {
        activeScreen.classList.remove('active');
        setTimeout(() => {
            activeScreen.style.display = 'none';
            targetScreen.style.display = 'flex';
            setTimeout(() => targetScreen.classList.add('active'), 50);
        }, 400); // Matchar CSS transition tid
    } else {
        targetScreen.style.display = 'flex';
        targetScreen.classList.add('active');
    }
}

function selectLevel(levelNumber) {
    selectedLevel = levelNumber;
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`lvl-btn-${levelNumber}`).classList.add('selected');
    startGameBtn.disabled = false;
}

function startGame() {
    if (selectedLevel === null) return;
    currentLevel = selectedLevel;
    score = 0;
    updateProgressBar();
    levelIndicator.textContent = `Nivå ${currentLevel}`;
    goToScreen('game-screen');
    generateQuestion();
}

// GUI: Uppdatera progress bar
function updateProgressBar() {
    const percentage = (score / targetScore) * 100;
    progressBar.style.width = `${percentage}%`;
}

// Logik för de 6 olika nivåerna
function generateQuestion() {
    let num1, num2;
    feedbackElement.textContent = "";
    answerInput.value = "";
    answerInput.focus();

    switch(currentLevel) {
        case 1: // Addition
            num1 = Math.floor(Math.random() * 12) + 2;
            num2 = Math.floor(Math.random() * 12) + 2;
            currentAnswer = num1 + num2;
            questionElement.textContent = `${num1} + ${num2}`;
            break;
        case 2: // Subtraktion
            num1 = Math.floor(Math.random() * 20) + 10;
            num2 = Math.floor(Math.random() * 9) + 2;
            currentAnswer = num1 - num2;
            questionElement.textContent = `${num1} - ${num2}`;
            break;
        case 3: // Multiplikation
            num1 = Math.floor(Math.random() * 8) + 2;
            num2 = Math.floor(Math.random() * 8) + 2;
            currentAnswer = num1 * num2;
            questionElement.textContent = `${num1} × ${num2}`;
            break;
        case 4: // Division (Heltal)
            num2 = Math.floor(Math.random() * 7) + 2; 
            currentAnswer = Math.floor(Math.random() * 7) + 2;
            num1 = num2 * currentAnswer; // Säkerställer jämna tal
            questionElement.textContent = `${num1} ÷ ${num2}`;
            break;
        case 5: // Potenser (X²)
            num1 = Math.floor(Math.random() * 11) + 2; // 2 till 12
            currentAnswer = num1 * num1;
            questionElement.textContent = `${num1}²`;
            break;
        case 6: // Kaosläget (Blandat och svårare)
            const modes = ['+', '-', '×'];
            const randomMode = modes[Math.floor(Math.random() * modes.length)];
            num1 = Math.floor(Math.random() * 30) + 5;
            num2 = Math.floor(Math.random() * 15) + 2;
            if (randomMode === '+') currentAnswer = num1 + num2;
            if (randomMode === '-') currentAnswer = num1 - num2;
            if (randomMode === '×') { num1 = Math.floor(num1/2); currentAnswer = num1 * num2; }
            questionElement.textContent = `${num1} ${randomMode} ${num2}`;
            break;
    }
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    if (isNaN(userAnswer)) return;

    if (userAnswer === currentAnswer) {
        score++;
        updateProgressBar();
        feedbackElement.textContent = "Helt rätt! ⚡";
        feedbackElement.className = "feedback correct";
        
        if (score >= targetScore) {
            setTimeout(() => {
                document.getElementById('victory-text').textContent = `Du klarade just utmaningen på Nivå ${currentLevel}!`;
                goToScreen('victory-screen');
            }, 600);
        } else {
            setTimeout(generateQuestion, 800);
        }
    } else {
        // Triggade skakeffekt vid fel svar
        feedbackElement.textContent = "Fel svar, försök igen!";
        feedbackElement.className = "feedback wrong";
        gameCard.classList.add('shake');
        setTimeout(() => gameCard.classList.remove('shake'), 400);
        answerInput.value = "";
        answerInput.focus();
    }
}

function resetAndGoBack() {
    selectedLevel = null;
    startGameBtn.disabled = true;
    document.querySelectorAll('.level-btn').forEach(btn => btn.classList.remove('selected'));
    goToScreen('level-screen');
}

// Event listeners
document.getElementById('submit-btn').addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkAnswer();
});
