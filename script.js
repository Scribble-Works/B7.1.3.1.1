// Benchmark fractions quiz questions
const questions = [
    {
        text: "What is 1/2 as a decimal and percentage?",
        options: ["0.25 and 25%", "0.5 and 50%", "0.75 and 75%", "0.33 and 33%"],
        correct: 1
    },
    {
        text: "What is 1/4 as a decimal and percentage?",
        options: ["0.25 and 25%", "0.5 and 50%", "0.75 and 75%", "0.33 and 33%"],
        correct: 0
    },
    {
        text: "What is 3/4 as a decimal and percentage?",
        options: ["0.25 and 25%", "0.5 and 50%", "0.75 and 75%", "0.33 and 33%"],
        correct: 2
    },
    {
        text: "What is 1/3 as a decimal (rounded to 2 decimal places) and percentage?",
        options: ["0.30 and 30%", "0.33 and 33%", "0.67 and 67%", "0.40 and 40%"],
        correct: 1
    },
    {
        text: "What is 2/3 as a decimal (rounded to 2 decimal places) and percentage?",
        options: ["0.30 and 30%", "0.33 and 33%", "0.67 and 67%", "0.40 and 40%"],
        correct: 2
    },
    {
        text: "What is 1/5 as a decimal and percentage?",
        options: ["0.1 and 10%", "0.2 and 20%", "0.5 and 50%", "0.25 and 25%"],
        correct: 1
    },
    {
        text: "What is 2/5 as a decimal and percentage?",
        options: ["0.1 and 10%", "0.2 and 20%", "0.4 and 40%", "0.6 and 60%"],
        correct: 2
    },
    {
        text: "Which is greater: 3/5 or 2/3?",
        options: ["3/5", "2/3", "They are equal", "Cannot be determined"],
        correct: 1
    },
    {
        text: "Which is greater: 7/10 or 3/4?",
        options: ["7/10", "3/4", "They are equal", "Cannot be determined"],
        correct: 1
    },
    {
        text: "Arrange these fractions from smallest to largest: 1/3, 2/5, 1/2, 3/4",
        options: ["1/3, 2/5, 1/2, 3/4", "2/5, 1/3, 1/2, 3/4", "1/3, 1/2, 2/5, 3/4", "3/4, 1/2, 2/5, 1/3"],
        correct: 0
    }
];

// DOM elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const questionCount = document.getElementById('question-count');
const scoreElement = document.getElementById('score');
const feedbackMessage = document.getElementById('feedback-message');
const optionButtons = document.querySelectorAll('.option-btn');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');

// Game state
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;

// Initialize game
function initGame() {
    currentQuestionIndex = 0;
    score = 0;
    showStartScreen();
}

// Show start screen
function showStartScreen() {
    startScreen.classList.remove('hidden');
    quizScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    resetButtons();
}

// Start the game
function startGame() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    loadQuestion();
}

// Load current question
function loadQuestion() {
    resetButtons();
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.text;
    questionCount.textContent = currentQuestionIndex + 1;
    
    // Set option buttons text
    currentQuestion.options.forEach((option, index) => {
        optionButtons[index].textContent = option;
    });
}

// Reset option buttons
function resetButtons() {
    optionButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
    });
    selectedAnswer = null;
}

// Play sound safely
function playSound(audioElement) {
    audioElement.currentTime = 0;
    audioElement.play().catch(e => {
        console.log("Audio play prevented:", e);
        // Audio play was prevented (common in some browsers)
        // This is normal and doesn't affect functionality
    });
}

// Handle answer selection
function selectAnswer(choiceIndex) {
    if (selectedAnswer) return;
    
    selectedAnswer = choiceIndex;
    
    // Highlight selected button
    optionButtons[choiceIndex].classList.add('selected');
    
    // Disable all buttons
    optionButtons.forEach(btn => btn.disabled = true);
    
    // Check answer
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = choiceIndex === currentQuestion.correct;
    
    // Update score and play sound
    if (isCorrect) {
        score++;
        playSound(correctSound);
    } else {
        playSound(incorrectSound);
    }
    
    // Move to next question or end game
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            endGame();
        }
    }, 1500);
}

// End the game
function endGame() {
    quizScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    
    // Update score
    scoreElement.textContent = score;
    
    // Provide feedback based on score
    let feedback = '';
    let feedbackClass = '';
    
    if (score >= 9) {
        feedback = "Excellent! You've mastered benchmark fractions!";
        feedbackClass = 'excellent';
    } else if (score >= 7) {
        feedback = "Great job! You understand benchmark fractions well!";
        feedbackClass = 'good';
    } else if (score >= 5) {
        feedback = "Good effort! Review benchmark fractions to improve.";
        feedbackClass = 'practice';
    } else {
        feedback = "Keep practicing! Benchmark fractions are essential for math success.";
        feedbackClass = 'practice';
    }
    
    feedbackMessage.textContent = feedback;
    feedbackMessage.className = `feedback ${feedbackClass}`;
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', initGame);

optionButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        selectAnswer(index);
    });
});

// Initialize the game
initGame();