let questions = [];
let currentQuestionIndex = 0;
let correctAnswer = '';
let totalScore = 0; 
const maxQuestions = 3;

// Replace with your actual Google Sheets ID and API key
const sheetId = '1X0_04SY_e10QLTiCqZUx8zJN9IeonnZowtxL5gBj1xw';
const apiKey = 'AIzaSyAE0CbVBC2H8PRBAFSArFCsrHlj6BnIO5c';
const range = 'Sheet1!B2:G4';

const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

console.log('API URL:', apiUrl);

// Fisher-Yates Shuffle Algorithm to randomize the questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Fetch questions from Google Sheets
async function fetchQuestions() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        // Convert fetched data into questions
        questions = data.values.map(row => ({
            question: row[0],
            options: [row[1], row[2], row[3], row[4]],
            correctAnswer: row[5]
        }));

        // Shuffle the questions
        questions = shuffleArray(questions);

        // Display only the first 3 questions
        questions = questions.slice(0, maxQuestions);

        displayQuestion();
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        alert('There was an issue fetching quiz data. Please try again later.');
    }
}

// Display a single question at a time
function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const quizContainer = document.getElementById('quiz-container');
        const questionData = questions[currentQuestionIndex];
        correctAnswer = questionData.correctAnswer;

        // Create the question and options UI
        quizContainer.innerHTML = `
            <p>${questionData.question}</p>
            ${questionData.options.map((option, index) => `
                <input type="radio" name="option" value="${option}" id="option${index}">
                <label for="option${index}">${option}</label><br>
            `).join('')}
        `;
        document.getElementById('submit-btn').style.display = 'block';
    } else {

        document.getElementById('quiz-container').innerHTML = `<p style="color: #fff; font-size: 25px;text-align:center;margin-top:70px"> Quiz Finished!<br><br> Your total Discount Amount is <p class="blinking-text" style="color: red; font-size: 60px;text-align:center;">$${totalScore}</p>`;
        document.getElementById('submit-btn').style.display = 'none';
        document.querySelector('h2').style.display='none';
    }
}

// Check the answer and display the result
function checkAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const resultElement = document.getElementById('result');
        if (selectedOption.value === correctAnswer) {
            resultElement.innerHTML = `<p style="color: red;font-size: 21px;text-align:center;">Correct! You got <p style="color: red;font-size: 40px;text-align:center;line-height:.8">$10</p></p>`;
            totalScore += 10; 
        } else {
            resultElement.innerHTML = `<p style="color: red;font-size: 21px;text-align:center;">Incorrect!<br> The correct answer is ${correctAnswer}.</p>`;
        }

        // Hide submit button and move to the next question after a short delay
        document.getElementById('submit-btn').style.display = 'none';
        setTimeout(() => {
            currentQuestionIndex++;
            resultElement.innerText = '';
            displayQuestion();
        }, 5000);
    } else {
        alert('Please select an answer!');
    }
}

// Function to start the quiz
function startQuiz() {
    document.querySelector('.play').style.display = 'none';

    document.querySelector('.quiz').style.display = 'block';

    fetchQuestions();
}

