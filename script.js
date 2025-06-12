// Enhanced game data
const itemsData = [
    { name: 'apple', image: '🍎', colors: ['#ff6b6b', '#ff8e8e'], maxCount: 5, sound: 'crunch' },
    { name: 'banana', image: '🍌', colors: ['#ffe066', '#ffec99'], maxCount: 5, sound: 'peel' },
    { name: 'ball', image: '⚽', colors: ['#4d96ff', '#6bc5ff'], maxCount: 5, sound: 'bounce' },
    { name: 'star', image: '⭐', colors: ['#ffd43b', '#ffe066'], maxCount: 5, sound: 'twinkle' },
    { name: 'car', image: '🚗', colors: ['#ff6b6b', '#ff8e8e'], maxCount: 5, sound: 'vroom' },
    { name: 'duck', image: '🦆', colors: ['#ffd43b', '#ffe066'], maxCount: 5, sound: 'quack' },
    { name: 'flower', image: '🌸', colors: ['#ff6b6b', '#ff8e8e'], maxCount: 5, sound: 'rustle' },
    { name: 'bear', image: '🧸', colors: ['#d8b5ff', '#e9d8fd'], maxCount: 5, sound: 'growl' }
];

// Game state
let currentItems = [];
let correctAnswer = 0;
let isMuted = false;
let score = 0;
let incorrectAnswers = 0;
let correctAnswers = 0;
let currentStreak = 0;
const totalQuestions = 10;
let questionsAnswered = 0;
let sessionStartTime;
let currentConcept = 'counting';
let currentLevel = 1;
let currentPattern = [];
let firstNumber = 0;
let secondNumber = 0;

// Profile and Session Data
let profiles = [{ id: 'default', name: 'Default Profile' }];
let currentProfileId = 'default';
let sessionHistory = [];

// DOM elements
const itemsContainer = document.getElementById('itemsContainer');
const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const feedbackElement = document.getElementById('feedback');
const nextButton = document.getElementById('nextButton');
const progressBar = document.getElementById('progressBar');
const celebrationElement = document.getElementById('celebration');
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
const applauseSound = document.getElementById('applauseSound');
const questionSound = document.getElementById('questionSound');
const countSound = document.getElementById('countSound');
const hintSound = document.getElementById('hintSound');
const startButton = document.getElementById('startButton');
const settingsButton = document.getElementById('settingsButton');
const volumeControl = document.getElementById('volumeControl');
const settingsPanel = document.getElementById('settingsPanel');
const overlay = document.getElementById('overlay');
const closeSettings = document.getElementById('closeSettings');
const progressReport = document.getElementById('progressReport');
const closeProgress = document.getElementById('closeProgress');
const correctCountDisplay = document.getElementById('correctCount');
const incorrectCountDisplay = document.getElementById('incorrectCount');
const accuracyRateDisplay = document.getElementById('accuracyRate');
const questionsCompletedDisplay = document.getElementById('questionsCompleted');
const currentStreakDisplay = document.getElementById('currentStreak');
const totalQuestionsDisplay = document.getElementById('totalQuestions');
const currentConceptDisplay = document.getElementById('currentConcept');
const currentLevelDisplay = document.getElementById('currentLevel');
const conceptSelector = document.getElementById('conceptSelector');
const scaffoldingLevel = document.getElementById('scaffoldingLevel');
const numberLine = document.getElementById('numberLine');
const hintButton = document.getElementById('hintButton');
const rewardCountElement = document.getElementById('rewardCount');
const profileSelector = document.getElementById('profileSelector');
const currentProfileNameElement = document.getElementById('currentProfileName');
const profileDropdown = document.getElementById('profileDropdown');
const dashboardButton = document.getElementById('dashboardButton');
const therapistDashboard = document.getElementById('therapistDashboard');
const dashboardCloseButton = document.getElementById('dashboardClose');
const profileCardsContainer = document.getElementById('profileCards');
const sessionTableBody = document.getElementById('sessionTable').querySelector('tbody');
const rewardAnimationElement = document.getElementById('rewardAnimation');
const highContrastCheckbox = document.getElementById('highContrast');
const largeTargetsCheckbox = document.getElementById('largeTargets');
const reducedMotionCheckbox = document.getElementById('reducedMotion');
const showNumbersCheckbox = document.getElementById('showNumbers');
const enableVibrationCheckbox = document.getElementById('enableVibration');
const enableAudioCuesCheckbox = document.getElementById('enableAudioCues');
const enableTactileFeedbackCheckbox = document.getElementById('enableTactileFeedback');

// Initialize game
function initGame() {
    score = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    currentStreak = 0;
    questionsAnswered = 0;
    sessionStartTime = new Date();

    conceptSelector.style.display = 'block';
    scaffoldingLevel.style.display = 'block';

    startButton.style.display = 'none';
    itemsContainer.style.display = 'flex';
    questionElement.style.display = 'block';
    optionsElement.style.display = 'flex';
    document.querySelector('.progress-container').style.display = 'block';
    feedbackElement.style.display = 'block';
    hintButton.style.display = 'block';

    totalQuestionsDisplay.textContent = totalQuestions;
    updateProgressReport();

    generateQuestion();
    updateProgress();
}

// Generate a new question based on current concept and level
function generateQuestion() {
    itemsContainer.innerHTML = '';
    optionsElement.innerHTML = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback';
    nextButton.style.display = 'none';
    numberLine.innerHTML = '';
    numberLine.style.display = 'none';

    currentConceptDisplay.textContent = currentConcept.charAt(0).toUpperCase() + currentConcept.slice(1);
    currentLevelDisplay.textContent = currentLevel;

    switch(currentConcept) {
        case 'addition':
            generateAdditionQuestion();
            break;
        case 'subtraction':
            generateSubtractionQuestion();
            break;
        case 'patterns':
            generatePatternQuestion();
            break;
        case 'counting':
        default:
            generateCountingQuestion();
            break;
    }

    applyScaffolding();

    if (!isMuted && enableAudioCuesCheckbox.checked) {
        questionSound.currentTime = 0;
        questionSound.play();
    }
}

function generateCountingQuestion() {
    const itemType = itemsData[Math.floor(Math.random() * itemsData.length)];

    let maxCount = itemType.maxCount;
    if (currentLevel === 1) maxCount = 5;
    else if (currentLevel === 2) maxCount = 10;
    else if (currentLevel === 3) maxCount = 15;
     else maxCount = 5;

    correctAnswer = Math.floor(Math.random() * maxCount) + 1;

    currentItems = [];
    for (let i = 0; i < correctAnswer; i++) {
        currentItems.push({
            name: itemType.name,
            image: itemType.image,
            color: itemType.colors[i % itemType.colors.length],
            sound: itemType.sound
        });
    }

    displayItemsWithFeedback();

    questionElement.textContent = `How many ${itemType.name}${correctAnswer > 1 ? 's' : ''}?`;

    const options = [correctAnswer];
    const maxOption = Math.max(correctAnswer + 2, Math.min(correctAnswer + 5, maxCount + 2));
    while (options.length < 3) {
        const randomOption = Math.floor(Math.random() * maxOption) + 1;
         if (!options.includes(randomOption) && randomOption !== 0) {
            options.push(randomOption);
        }
    }
    shuffleArray(options);

    createOptionButtons(options);
}

function generateAdditionQuestion() {
    if (currentLevel === 1) {
        firstNumber = Math.floor(Math.random() * 5) + 1;
        secondNumber = Math.floor(Math.random() * (6 - firstNumber));
    } else if (currentLevel === 2) {
        firstNumber = Math.floor(Math.random() * 8) + 1;
        secondNumber = Math.floor(Math.random() * (11 - firstNumber));
    } else {
        firstNumber = Math.floor(Math.random() * 10) + 1;
        secondNumber = Math.floor(Math.random() * (16 - firstNumber));
    }

    correctAnswer = firstNumber + secondNumber;

    const itemType1 = itemsData[Math.floor(Math.random() * itemsData.length)];
    let itemType2 = itemType1;

    for (let i = 0; i < firstNumber; i++) {
        currentItems.push({
            name: itemType1.name,
            image: itemType1.image,
            color: itemType1.colors[i % itemType1.colors.length],
            sound: itemType1.sound
        });
    }

    itemsContainer.appendChild(createSeparator());

    for (let i = 0; i < secondNumber; i++) {
        currentItems.push({
            name: itemType2.name,
            image: itemType2.image,
            color: itemType2.colors[i % itemType2.colors.length],
            sound: itemType2.sound
        });
    }

    displayItemsWithFeedback();

    questionElement.textContent = `What is ${firstNumber} + ${secondNumber}?`;

    const options = [correctAnswer];
    const maxOption = Math.max(correctAnswer + 2, correctAnswer + 5);
     while (options.length < 3) {
        const randomOption = Math.floor(Math.random() * maxOption) + 1;
        if (!options.includes(randomOption) && randomOption !== 0) {
            options.push(randomOption);
        }
    }
    shuffleArray(options);

    createOptionButtons(options);
}

function generateSubtractionQuestion() {
    if (currentLevel === 1) {
        firstNumber = Math.floor(Math.random() * 5) + 1;
        secondNumber = Math.floor(Math.random() * firstNumber) + 1;
    } else if (currentLevel === 2) {
        firstNumber = Math.floor(Math.random() * 10) + 1;
        secondNumber = Math.floor(Math.random() * firstNumber) + 1;
    } else {
        firstNumber = Math.floor(Math.random() * 15) + 1;
        secondNumber = Math.floor(Math.random() * firstNumber) + 1;
    }

    correctAnswer = firstNumber - secondNumber;

    const itemType = itemsData[Math.floor(Math.random() * itemsData.length)];

    for (let i = 0; i < firstNumber; i++) {
        currentItems.push({
            name: itemType.name,
            image: itemType.image,
            color: itemType.colors[i % itemType.colors.length],
            sound: itemType.sound
        });
    }

    displayItemsWithFeedback();

    questionElement.textContent = `If you have ${firstNumber} ${itemType.name}${firstNumber > 1 ? 's' : ''} and take away ${secondNumber}, how many are left?`;

    const options = [correctAnswer];
     const maxOption = firstNumber;
    while (options.length < 3) {
        const randomOption = Math.floor(Math.random() * (maxOption + 1));
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    shuffleArray(options);

    createOptionButtons(options);
}

function generatePatternQuestion() {
    const patternLength = currentLevel + 2;

    currentPattern = [];
    const patternTypes = ['shape', 'color'];
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];

    const patternItems = [];
    while (patternItems.length < 2) {
         let randomItem;
        do {
            randomItem = itemsData[Math.floor(Math.random() * itemsData.length)];
        } while (patternItems.some(item => item.name === randomItem.name));
        patternItems.push(randomItem);
    }

    for (let i = 0; i < patternLength; i++) {
         const itemTemplate = patternItems[i % patternItems.length];
         const item = {
             name: itemTemplate.name,
             image: itemTemplate.image,
             color: patternType === 'color' ? itemTemplate.colors[i % itemTemplate.colors.length] : itemTemplate.colors[0],
             sound: itemTemplate.sound
         };
        currentPattern.push(item);
    }

    const missingIndex = Math.floor(Math.random() * patternLength);
     const missingItemTemplate = patternItems[missingIndex % patternItems.length];
     correctAnswer = patternItems.findIndex(item => item.name === missingItemTemplate.name) + 1;

    for (let i = 0; i < patternLength; i++) {
        if (i === missingIndex) {
            const missingItem = document.createElement('div');
            missingItem.className = 'item';
            missingItem.textContent = '?';
            missingItem.style.fontSize = '80px';
            missingItem.style.color = '#333';
             missingItem.style.backgroundColor = '#eee';
             missingItem.style.borderRadius = '10px';
            itemsContainer.appendChild(missingItem);
        } else {
            const item = currentPattern[i];
            const itemElement = document.createElement('div');
            itemElement.className = 'item tactile-item';
            itemElement.textContent = item.image;
            itemElement.style.fontSize = '80px';
            itemElement.style.color = item.color;

            if (enableTactileFeedbackCheckbox.checked) {
                itemElement.addEventListener('click', () => {
                    playItemSound(item.sound);
                     if (enableVibrationCheckbox.checked && navigator.vibrate) navigator.vibrate(50);
                    itemElement.style.transform = 'scale(0.9)';
                    setTimeout(() => { itemElement.style.transform = 'scale(1)'; }, 100);
                });
            }
            itemsContainer.appendChild(itemElement);
        }
    }

    questionElement.textContent = `What comes next in the pattern? (Choose based on its position in the pattern types)`;

    const options = [correctAnswer];
     while (options.length < 3) {
        const randomOption = Math.floor(Math.random() * patternItems.length) + 1;
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
     shuffleArray(options);

     optionsElement.innerHTML = '';
     options.forEach(optionValue => {
         const optionButton = document.createElement('button');
         optionButton.className = 'option';
         const correspondingItem = patternItems[optionValue - 1];
         optionButton.textContent = correspondingItem.image;
         optionButton.style.backgroundColor = correspondingItem.colors[0];
         optionButton.addEventListener('click', () => checkAnswer(optionValue));
         optionsElement.appendChild(optionButton);
     });
}

function displayItemsWithFeedback() {
    itemsContainer.innerHTML = '';
    currentItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item tactile-item';
        itemElement.textContent = item.image;
        itemElement.style.fontSize = '80px';
        itemElement.style.color = item.color;

         if (showNumbersCheckbox.checked && currentConcept === 'counting') {
             const numberLabel = document.createElement('span');
             numberLabel.textContent = index + 1;
             numberLabel.style.position = 'absolute';
             numberLabel.style.bottom = '5px';
             numberLabel.style.right = '5px';
             numberLabel.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
             numberLabel.style.borderRadius = '50%';
             numberLabel.style.padding = '2px 5px';
             numberLabel.style.fontSize = '0.8em';
             numberLabel.style.color = '#333';
             itemElement.appendChild(numberLabel);
         }

        if (enableTactileFeedbackCheckbox.checked) {
            itemElement.addEventListener('click', () => {
                playItemSound(item.sound);
                 if (enableVibrationCheckbox.checked && navigator.vibrate) navigator.vibrate(50);
                itemElement.style.transform = 'scale(0.9)';
                setTimeout(() => { itemElement.style.transform = 'scale(1)'; }, 100);
            });
        }
        itemsContainer.appendChild(itemElement);
    });
}

function createSeparator() {
     const separator = document.createElement('div');
     separator.style.width = '20px';
     separator.style.height = '100px';
     separator.style.margin = '0 10px';
     separator.style.display = 'flex';
     separator.alignItems = 'center';
     separator.justifyContent = 'center';
     separator.style.fontSize = '40px';
     separator.textContent = '+';
     separator.style.color = '#4d96ff';
     return separator;
}

function createOptionButtons(options) {
     optionsElement.innerHTML = '';
    options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.className = 'option';
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => checkAnswer(option));
        optionsElement.appendChild(optionButton);
    });
}

function checkAnswer(selectedAnswer) {
    const options = optionsElement.querySelectorAll('.option');
    options.forEach(option => option.disabled = true);

    questionsAnswered++;

    if (selectedAnswer === correctAnswer) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.className = 'feedback correct';
        score += 10;
        correctAnswers++;
        currentStreak++;
         playCorrectSound();

         if (!reducedMotionCheckbox.checked) {
             triggerCelebration();
         }

        if (correctAnswers % 3 === 0) {
            grantReward();
        }

    } else {
        feedbackElement.textContent = `Incorrect. The correct answer was ${correctAnswer}.`;
        feedbackElement.className = 'feedback incorrect';
        incorrectAnswers++;
        currentStreak = 0;
         playIncorrectSound();
    }

    updateProgress();
    updateProgressReport();
    nextButton.style.display = 'block';
     hintButton.style.display = 'none';
}

function updateProgress() {
    const progress = (questionsAnswered / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;

    if (questionsAnswered >= totalQuestions) {
        endSession();
    }
}

function endSession() {
    itemsContainer.style.display = 'none';
    questionElement.style.display = 'none';
    optionsElement.style.display = 'none';
    feedbackElement.style.display = 'none';
    nextButton.style.display = 'none';
    document.querySelector('.progress-container').style.display = 'none';
    conceptSelector.style.display = 'none';
    scaffoldingLevel.style.display = 'none';
    hintButton.style.display = 'none';

    questionElement.textContent = 'Session Complete!';
    questionElement.style.display = 'block';
    feedbackElement.textContent = `Your score: ${score}. Correct: ${correctAnswers}, Incorrect: ${incorrectAnswers}.`;
    feedbackElement.style.display = 'block';

    const accuracy = questionsAnswered > 0 ? ((correctAnswers / questionsAnswered) * 100).toFixed(0) : 0;

    sessionHistory.push({
        profileId: currentProfileId,
        date: new Date().toLocaleString(),
        concept: currentConcept,
        level: currentLevel,
        score: score,
        correct: correctAnswers,
        incorrect: incorrectAnswers,
        accuracy: `${accuracy}%`
    });

     saveData();

    const endSessionButton = document.createElement('button');
    endSessionButton.textContent = 'Start New Session';
    endSessionButton.className = 'start-button';
    endSessionButton.onclick = () => {
         itemsContainer.style.display = 'none';
         questionElement.style.display = 'none';
         optionsElement.style.display = 'none';
         feedbackElement.style.display = 'none';
         nextButton.style.display = 'none';
         document.querySelector('.progress-container').style.display = 'none';
         hintButton.style.display = 'none';

         startButton.style.display = 'block';
         questionElement.textContent = 'Enhanced Counting Fun!';
         feedbackElement.textContent = '';
         progressBar.style.width = '0%';

         conceptSelector.style.display = 'block';
         scaffoldingLevel.style.display = 'block';

         itemsContainer.innerHTML = '';
     };

    const viewReportButton = document.createElement('button');
    viewReportButton.textContent = 'View Report';
    viewReportButton.className = 'next-button';
    viewReportButton.onclick = () => showProgressReport();

     const existingButtons = document.querySelectorAll('.game-container button:not(#settingsButton):not(#volumeControl):not(#dashboardButton)');
     existingButtons.forEach(button => button.remove());

     document.querySelector('.game-container').appendChild(endSessionButton);
     document.querySelector('.game-container').appendChild(viewReportButton);

    if (!isMuted && enableAudioCuesCheckbox.checked) {
        applauseSound.currentTime = 0;
        applauseSound.play();
    }
}

function triggerCelebration() {
     if (reducedMotionCheckbox.checked) return;

    celebrationElement.style.display = 'block';
    celebrationElement.innerHTML = '';
    const numConfetti = 50;
    for (let i = 0; i < numConfetti; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
         const size = Math.random() * 10 + 5;
         confetti.style.width = `${size}px`;
         confetti.style.height = `${size}px`;

        celebrationElement.appendChild(confetti);
    }

    setTimeout(() => {
        celebrationElement.style.display = 'none';
         celebrationElement.innerHTML = '';
    }, 3000);
}

function playCorrectSound() {
     if (!isMuted && enableAudioCuesCheckbox.checked) {
         correctSound.currentTime = 0;
         correctSound.play();
    }
}

function playIncorrectSound() {
     if (!isMuted && enableAudioCuesCheckbox.checked) {
         incorrectSound.currentTime = 0;
         incorrectSound.play();
    }
}

 function playCountSound() {
     if (!isMuted && enableAudioCuesCheckbox.checked) {
        countSound.currentTime = 0;
        countSound.play();
    }
 }

 function playHintSound() {
     if (!isMuted && enableAudioCuesCheckbox.checked) {
         hintSound.currentTime = 0;
         hintSound.play();
     }
 }

function playItemSound(soundName) {
    // Placeholder for item-specific sounds
}

// Volume control toggle
volumeControl.addEventListener('click', () => {
    isMuted = !isMuted;
    volumeControl.textContent = isMuted ? ' mute' : '🔊';
});

// Start button event listener
startButton.addEventListener('click', initGame);

// Next button event listener
nextButton.addEventListener('click', generateQuestion);

// Settings Panel logic
settingsButton.addEventListener('click', () => {
    settingsPanel.style.display = 'block';
    overlay.style.display = 'block';
});

closeSettings.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
    overlay.style.display = 'none';
     applySettings();
});

function showProgressReport() {
     console.log("Showing progress report");
}

closeProgress.addEventListener('click', () => {
    progressReport.style.display = 'none';
    overlay.style.display = 'none';
});

function updateProgressReport() {
    correctCountDisplay.textContent = correctAnswers;
    incorrectCountDisplay.textContent = incorrectAnswers;
    const accuracy = questionsAnswered > 0 ? ((correctAnswers / questionsAnswered) * 100).toFixed(0) : 0;
    accuracyRateDisplay.textContent = `${accuracy}%`;
    questionsCompletedDisplay.textContent = questionsAnswered;
    currentStreakDisplay.textContent = currentStreak;
}

// Concept and Scaffolding Level selection
conceptSelector.addEventListener('click', (event) => {
    if (event.target.classList.contains('concept-button')) {
        conceptSelector.querySelectorAll('.concept-button').forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');
        currentConcept = event.target.dataset.concept;
        currentConceptDisplay.textContent = currentConcept.charAt(0).toUpperCase() + currentConcept.slice(1);
    }
});

scaffoldingLevel.addEventListener('click', (event) => {
    if (event.target.classList.contains('scaffolding-button')) {
        scaffoldingLevel.querySelectorAll('.scaffolding-button').forEach(button => {
            button.classList.remove('active');
        });
        event.target.classList.add('active');
        currentLevel = parseInt(event.target.dataset.level);
        currentLevelDisplay.textContent = currentLevel;
    }
});

function applyScaffolding() {
    numberLine.style.display = 'none';

     if (currentConcept === 'counting' && currentLevel >= 2) {
         numberLine.style.display = 'flex';
         numberLine.innerHTML = '';
         const maxNumber = currentLevel === 2 ? 10 : 15;
         for (let i = 1; i <= maxNumber; i++) {
             const point = document.createElement('div');
             point.className = 'number-line-point';
             point.textContent = i;
              if (i === correctAnswer && currentLevel === 3) {
                 point.classList.add('active');
             }
             point.addEventListener('click', () => {
                  playCountSound();
                  if (enableVibrationCheckbox.checked && navigator.vibrate) navigator.vibrate(30);
             });
             numberLine.appendChild(point);
         }
     } else if (currentConcept === 'addition' && currentLevel >= 2) {
         numberLine.style.display = 'flex';
         numberLine.innerHTML = '';
         const maxNumber = currentLevel === 2 ? 20 : 30;
         for (let i = 0; i <= maxNumber; i++) {
             const point = document.createElement('div');
             point.className = 'number-line-point';
             point.textContent = i;
              if (i === firstNumber || i === correctAnswer) {
                 point.classList.add('active');
             }
              point.addEventListener('click', () => {
                   playCountSound();
                    if (enableVibrationCheckbox.checked && navigator.vibrate) navigator.vibrate(30);
              });
             numberLine.appendChild(point);
         }
     } else if (currentConcept === 'subtraction' && currentLevel >= 2) {
         numberLine.style.display = 'flex';
         numberLine.innerHTML = '';
         const maxNumber = firstNumber;
         for (let i = 0; i <= maxNumber; i++) {
             const point = document.createElement('div');
             point.className = 'number-line-point';
             point.textContent = i;
             if (i === firstNumber || i === correctAnswer) {
                point.classList.add('active');
            }
             point.addEventListener('click', () => {
                  playCountSound();
                   if (enableVibrationCheckbox.checked && navigator.vibrate) navigator.vibrate(30);
             });
            numberLine.appendChild(point);
         }
     }

     if (largeTargetsCheckbox.checked) {
        optionsElement.classList.add('large-targets');
     } else {
         optionsElement.classList.remove('large-targets');
     }

      if (highContrastCheckbox.checked) {
          document.body.classList.add('high-contrast');
      } else {
          document.body.classList.remove('high-contrast');
      }
}

// Hint button logic
hintButton.addEventListener('click', () => {
    playHintSound();
     if (enableVibrationCheckbox.checked && navigator.vibrate) navigator.vibrate(100);

     let hintText = "Think carefully!";
     if (currentConcept === 'counting') {
         if (currentLevel === 1) {
             hintText = "Count the items one by one.";
         } else if (currentLevel === 2) {
             hintText = "You can touch each item as you count.";
         } else {
             hintText = "Look at the number line to help you count.";
             numberLine.style.display = 'flex';
         }
     } else if (currentConcept === 'addition') {
          if (currentLevel === 1 || currentLevel === 2) {
              hintText = `Start with ${firstNumber} and count up ${secondNumber} more.`;
          } else {
               hintText = `Use the number line. Start at ${firstNumber} and hop forward ${secondNumber} times.`;
               numberLine.style.display = 'flex';
          }
     } else if (currentConcept === 'subtraction') {
         if (currentLevel === 1 || currentLevel === 2) {
              hintText = `Start with ${firstNumber} and count back ${secondNumber}.`;
         } else {
              hintText = `Use the number line. Start at ${firstNumber} and hop backward ${secondNumber} times.`;
               numberLine.style.display = 'flex';
         }
     } else if (currentConcept === 'patterns') {
         hintText = "Look at the order of the shapes or colors. What comes next?";
     }

    feedbackElement.textContent = hintText;
    feedbackElement.className = 'feedback';
    feedbackElement.style.display = 'block';
});

function applySettings() {
     applyScaffolding();
}

// Reward System
let rewardCount = 0;

function grantReward() {
    rewardCount++;
    rewardCountElement.textContent = rewardCount;
     saveData();
    triggerRewardAnimation();
}

function triggerRewardAnimation() {
     if (reducedMotionCheckbox.checked) return;

    rewardAnimationElement.style.display = 'block';
    rewardAnimationElement.classList.remove('pop-and-fade');
    void rewardAnimationElement.offsetWidth;
    rewardAnimationElement.classList.add('pop-and-fade');

    setTimeout(() => {
        rewardAnimationElement.style.display = 'none';
    }, 1000);
}

// Profile Management
let currentProfile = { id: 'default', name: 'Default Profile' };

function renderProfiles() {
    profileDropdown.innerHTML = '';

    profiles.forEach(profile => {
        const option = document.createElement('div');
        option.className = 'profile-option';
        option.dataset.id = profile.id;
        option.textContent = profile.name;
         if (profile.id === currentProfile.id) {
             option.style.fontWeight = 'bold';
         }
        option.addEventListener('click', () => selectProfile(profile.id));
        profileDropdown.appendChild(option);
    });

    const addOption = document.createElement('div');
    addOption.className = 'profile-option add-profile';
    addOption.textContent = '+ Add New Profile';
    addOption.addEventListener('click', addNewProfile);
    profileDropdown.appendChild(addOption);

    currentProfileNameElement.textContent = currentProfile.name;
}

function selectProfile(profileId) {
    currentProfile = profiles.find(p => p.id === profileId);
    currentProfileNameElement.textContent = currentProfile.name;
    profileDropdown.style.display = 'none';
    loadData();
    renderDashboard();
}

function addNewProfile() {
    const profileName = prompt("Enter new profile name:");
    if (profileName && profileName.trim() !== '') {
        const newProfile = {
            id: Date.now().toString(),
            name: profileName.trim()
        };
        profiles.push(newProfile);
         saveData();
        renderProfiles();
        selectProfile(newProfile.id);
    }
    profileDropdown.style.display = 'none';
}

profileSelector.addEventListener('click', (event) => {
     if (!profileDropdown.contains(event.target)) {
         profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
     }
});

document.addEventListener('click', (event) => {
    if (!profileSelector.contains(event.target) && !therapistDashboard.contains(event.target)) {
         profileDropdown.style.display = 'none';
    }
});

// Therapist Dashboard Logic
dashboardButton.addEventListener('click', () => {
    renderDashboard();
    therapistDashboard.style.display = 'flex';
});

dashboardCloseButton.addEventListener('click', () => {
    therapistDashboard.style.display = 'none';
});

function renderDashboard() {
    profileCardsContainer.innerHTML = '';
    sessionTableBody.innerHTML = '';

    profiles.forEach(profile => {
        const profileCard = document.createElement('div');
        profileCard.className = 'profile-card';
        profileCard.innerHTML = `
            <h4>${profile.name}</h4>
            <p>Total Sessions: ${sessionHistory.filter(s => s.profileId === profile.id).length}</p>
            <p>Total Rewards: ${localStorage.getItem(`rewards_${profile.id}`) || 0}</p>
             `;
        profileCardsContainer.appendChild(profileCard);
    });

    const currentProfileSessions = sessionHistory.filter(s => s.profileId === currentProfile.id);

    if (currentProfileSessions.length === 0) {
         sessionTableBody.innerHTML = '<tr><td colspan="8">No session history for this profile yet.</td></tr>';
    } else {
        currentProfileSessions.forEach(session => {
            const row = sessionTableBody.insertRow();
            row.innerHTML = `
                <td>${session.date}</td>
                <td>${profiles.find(p => p.id === session.profileId)?.name || 'Unknown Profile'}</td>
                <td>${session.concept}</td>
                <td>${session.level}</td>
                <td>${session.score}</td>
                <td>${session.correct}</td>
                <td>${session.incorrect}</td>
                <td>${session.accuracy}</td>
            `;
        });
    }
}

// Local Storage for Data Persistence
function saveData() {
    localStorage.setItem('profiles', JSON.stringify(profiles));
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
     localStorage.setItem(`rewards_${currentProfile.id}`, rewardCount);
}

function loadData() {
    const savedProfiles = localStorage.getItem('profiles');
    const savedHistory = localStorage.getItem('sessionHistory');
     const savedRewards = localStorage.getItem(`rewards_${currentProfile.id}`);

    if (savedProfiles) {
        profiles = JSON.parse(savedProfiles);
         if (!profiles.find(p => p.id === 'default')) {
             profiles.unshift({ id: 'default', name: 'Default Profile' });
         }
    } else {
        profiles = [{ id: 'default', name: 'Default Profile' }];
    }

    if (savedHistory) {
        sessionHistory = JSON.parse(savedHistory);
    } else {
        sessionHistory = [];
    }

     if (savedRewards) {
         rewardCount = parseInt(savedRewards, 10) || 0;
         rewardCountElement.textContent = rewardCount;
     } else {
         rewardCount = 0;
         rewardCountElement.textContent = rewardCount;
     }

    const lastProfileId = localStorage.getItem('lastProfileId');
    if (lastProfileId) {
         currentProfile = profiles.find(p => p.id === lastProfileId) || profiles.find(p => p.id === 'default');
    } else {
         currentProfile = profiles.find(p => p.id === 'default');
    }

    renderProfiles();
}

 window.addEventListener('beforeunload', () => {
     localStorage.setItem('lastProfileId', currentProfile.id);
     saveData();
 });

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadSettings() {
    highContrastCheckbox.checked = localStorage.getItem('highContrast') === 'true';
    largeTargetsCheckbox.checked = localStorage.getItem('largeTargets') === 'true';
    reducedMotionCheckbox.checked = localStorage.getItem('reducedMotion') === 'true';
    showNumbersCheckbox.checked = localStorage.getItem('showNumbers') !== 'false';
    enableVibrationCheckbox.checked = localStorage.getItem('enableVibration') !== 'false';
    enableAudioCuesCheckbox.checked = localStorage.getItem('enableAudioCues') !== 'false';
    enableTactileFeedbackCheckbox.checked = localStorage.getItem('enableTactileFeedback') !== 'false';

    applySettings();
}

highContrastCheckbox.addEventListener('change', () => {
    localStorage.setItem('highContrast', highContrastCheckbox.checked);
     applySettings();
});
largeTargetsCheckbox.addEventListener('change', () => {
    localStorage.setItem('largeTargets', largeTargetsCheckbox.checked);
    applySettings();
});
reducedMotionCheckbox.addEventListener('change', () => {
    localStorage.setItem('reducedMotion', reducedMotionCheckbox.checked);
    applySettings();
});
showNumbersCheckbox.addEventListener('change', () => {
    localStorage.setItem('showNumbers', showNumbersCheckbox.checked);
    applySettings();
});
enableVibrationCheckbox.addEventListener('change', () => {
    localStorage.setItem('enableVibration', enableVibrationCheckbox.checked);
});
enableAudioCuesCheckbox.addEventListener('change', () => {
    localStorage.setItem('enableAudioCues', enableAudioCuesCheckbox.checked);
});
enableTactileFeedbackCheckbox.addEventListener('change', () => {
    localStorage.setItem('enableTactileFeedback', enableTactileFeedbackCheckbox.checked);
});

loadSettings();