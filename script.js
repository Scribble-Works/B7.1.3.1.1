// Game Configuration
const MAX_QUESTIONS = 20;
let score = 0;
let questionNumber = 0;
let currentProblem = null;

// --- Mathematical Helper Functions (Unchanged) ---
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

/**
 * Simplifies an improper fraction (numerator/denominator) to a standardized string format.
 * Format: "W N/D" or "N/D" or "W" (e.g., "1 1/2", "3/4", "5")
 */
function simplifyFraction(n, d) {
    if (n === 0) return "0";
    
    const sign = n < 0 ? "-" : "";
    n = Math.abs(n);
    d = Math.abs(d);

    if (n % d === 0) {
        return sign + (n / d).toString(); // Whole number
    }

    const commonDivisor = gcd(n, d);
    const simplifiedN = n / commonDivisor;
    const simplifiedD = d / commonDivisor;

    const whole = Math.floor(simplifiedN / simplifiedD);
    const remainder = simplifiedN % simplifiedD;

    const fractionStr = `${remainder}/${simplifiedD}`;

    if (whole > 0) {
        return `${sign}${whole} ${fractionStr}`; // Mixed number
    } else {
        return `${sign}${fractionStr}`; // Proper fraction
    }
}

// Function used ONLY for display (uses HTML markup)
function formatFractionDisplay(n, d, whole = 0) {
    let sign = (n * d < 0) ? "-" : "";
    n = Math.abs(n);
    d = Math.abs(d);

    if (whole > 0 && n === 0) {
        return `${sign}<span class="whole-number">${whole}</span>`;
    }
    if (whole > 0) {
        return `${sign}<span class="whole-number">${whole}</span> <span class="fraction-line">${n} / ${d}</span>`;
    }
    return `${sign}<span class="fraction-line">${n} / ${d}</span>`;
}

function calculateResult(f1, op, f2) {
    // Core calculation logic remains the same
    const n1 = f1.n + f1.w * f1.d;
    const n2 = f2.n + f2.w * f2.d;
    const d1 = f1.d;
    const d2 = f2.d;
    const commonD = (d1 * d2) / gcd(d1, d2);
    const newN1 = n1 * (commonD / d1);
    const newN2 = n2 * (commonD / d2);

    let finalN;
    if (op === '+') {
        finalN = newN1 + newN2;
    } else {
        finalN = newN1 - newN2;
    }
    return simplifyFraction(finalN, commonD);
}

// Cleans user input to match the internal simplified format (e.g., "1  1 / 2 " -> "1 1/2")
function cleanUserInput(input) {
    let clean = input.trim().replace(/\s+/g, ' '); // Replace multiple spaces with single space
    clean = clean.replace(/\s*\/\s*/g, '/'); // Remove spaces around the slash
    return clean;
}

// --- PROBLEM DATA ---
const ALL_PROBLEMS = [
    [{w: 1, n: 1, d: 4}, '+', {w: 0, n: 2, d: 3}], // Answer: "1 11/12"
    [{w: 0, n: 3, d: 5}, '+', {w: 0, n: 1, d: 2}], // Answer: "1 1/10"
    [{w: 2, n: 1, d: 2}, '-', {w: 0, n: 1, d: 3}], // Answer: "2 1/6"
    [{w: 0, n: 7, d: 8}, '-', {w: 0, n: 1, d: 4}], // Answer: "5/8"
    [{w: 3, n: 1, d: 3}, '-', {w: 1, n: 1, d: 6}], // Answer: "2 1/6"
    [{w: 1, n: 5, d: 6}, '+', {w: 2, n: 3, d: 4}], // Answer: "4 7/12"
    [{w: 0, n: 5, d: 6}, '+', {w: 0, n: 7, d: 6}], // Answer: "2"
    [{w: 4, n: 1, d: 5}, '-', {w: 3, n: 1, d: 2}], // Answer: "7/10"
];

// --- DOM Elements ---
const problemDisplayEl = document.getElementById('fraction-problem');
const inputAreaEl = document.getElementById('answer-input-area');
const userAnswerInput = document.getElementById('user-answer');
const submitButton = document.getElementById('submit-button');
const feedbackArea = document.getElementById('feedback-area');
const startButton = document.getElementById('start-button');
const nextButton = document.getElementById('next-button');
const scoreTracker = document.getElementById('score-tracker');
const questionCounter = document.getElementById('question-counter');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const finalScoreDisplay = document.getElementById('final-score-display');
const celebrationMessage = document.getElementById('celebration-message');
const promptTextEl = document.getElementById('prompt-text');

// --- Core Game Functions ---

function endGame() {
    gameScreen.style.display = 'none';
    resultsScreen.style.display = 'block';

    finalScoreDisplay.textContent = `${score} / ${MAX_QUESTIONS}`;

    const percentage = (score / MAX_QUESTIONS) * 100;
    let message = '';
    
    if (percentage >= 90) {
        message = "👑 Phenomenal! You've mastered fraction operations!";
    } else if (percentage >= 70) {
        message = "🌟 Excellent! Your LCD and simplification skills are strong.";
    } else if (percentage >= 50) {
        message = "👍 Good effort! Focus on finding the LCD and converting mixed fractions.";
    } else {
        message = "Keep practicing! Review the steps: improper fractions, LCD, then calculation.";
    }

    celebrationMessage.textContent = message;
}

function loadNewProblem() {
    if (questionNumber >= MAX_QUESTIONS) {
        endGame();
        return;
    }
    
    questionNumber++;
    questionCounter.textContent = questionNumber;

    const problemIndex = Math.floor(Math.random() * ALL_PROBLEMS.length);
    const problem = ALL_PROBLEMS[problemIndex];
    const [f1, op, f2] = problem;
    
    // Calculate the simplified answer string (e.g., "1 11/12")
    const correctValueStr = calculateResult(f1, op, f2);
    
    // Format and display the problem
    const f1Display = formatFractionDisplay(f1.n, f1.d, f1.w);
    const f2Display = formatFractionDisplay(f2.n, f2.d, f2.w);
    problemDisplayEl.innerHTML = `${f1Display} ${op} ${f2Display} = ?`;

    // Reset UI for the new question
    userAnswerInput.value = '';
    userAnswerInput.disabled = false;
    submitButton.disabled = false;
    feedbackArea.textContent = 'Enter your simplified answer above.';
    feedbackArea.className = 'feedback';
    nextButton.style.display = 'none';
    
    currentProblem = {correct: correctValueStr}; // Store the answer for checking
}

function checkAnswer() {
    const userInput = cleanUserInput(userAnswerInput.value);
    const correctValue = currentProblem.correct;

    userAnswerInput.disabled = true;
    submitButton.disabled = true;

    if (userInput === correctValue) {
        feedbackArea.textContent = `🥳 Correct! The simplified answer is ${correctValue}. (+1)`;
        feedbackArea.className = 'feedback correct';
        score++;
        scoreTracker.textContent = score;
    } else {
        feedbackArea.textContent = `❌ Incorrect. Your answer was "${userInput}". The correct simplified answer is ${correctValue}.`;
        feedbackArea.className = 'feedback incorrect';
    }
    
    nextButton.style.display = 'block';
}

function startGame() {
    startButton.style.display = 'none';
    promptTextEl.style.display = 'none';
    inputAreaEl.style.display = 'flex'; // Show input area
    loadNewProblem();
}

// --- Event Listeners and Initial Load ---
startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', loadNewProblem);
submitButton.addEventListener('click', checkAnswer);

// Allow pressing Enter key to submit the answer
userAnswerInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !submitButton.disabled) {
        checkAnswer();
    }
});

// Initial setup
window.onload = () => {
    // Ensure problem display and input area are ready for the start button
    problemDisplayEl.innerHTML = '?';
    inputAreaEl.style.display = 'none';
    nextButton.style.display = 'none';
};