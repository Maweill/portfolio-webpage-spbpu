const questions = [
    { question: "А когда с человеком может произойти дрожемент?", answers: ["Когда он влюбляется", "Когда он идет шопиться", "Когда он слышит смешную шутку", "Когда он боится, пугается"], correct: 3, explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»." },
    { question: "Говорят, Антон заовнил всех. Это еще как понимать?", answers: ["Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", "Антон очень надоедливый и въедливый человек, всех задолбал", "Молодец, Антон, всех победил!", "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей"], correct: 2, explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»" },
    { question: "А фразу «заскамить мамонта» как понимать?", answers: ["Разозлить кого-то из родителей", "Увлекаться археологией", "Развести недотепу на деньги", "Оскорбить пожилого человека"], correct: 2, explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца." },
    { question: "Кто такие бефефе?", answers: ["Вши?", "Милые котики, такие милые, что бефефе", "Лучшие друзья", "Люди, которые не держат слово"], correct: 2, explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever." },
];

let answeredQuestions = {};
let questionNumber = 0;
let correctAnswers = 0;

function displayCorrectAnswer(questionText, correctAnswer, explanation) {
    let questionBlocks = document.querySelectorAll('.question-block');
    for (let questionBlock of questionBlocks) {
        if (questionBlock.querySelector('.question').textContent === questionText) {
            let correctAnswerElement = document.createElement('div');
            correctAnswerElement.classList.add('correct-answer');
            correctAnswerElement.innerHTML = "Правильный ответ: " + correctAnswer + "<br><small>" + explanation + "</small>";
            questionBlock.appendChild(correctAnswerElement);
            break;
        }
    }
}

function createQuestionBlock() {
    let questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block');

    let answerBlock = document.createElement('div');
    answerBlock.classList.add('answer-block');

    let quizContainer = document.getElementById('quiz-container');
    quizContainer.appendChild(questionBlock);
    quizContainer.appendChild(answerBlock);

    questionBlock.onclick = function () {
        let questionElement = questionBlock.querySelector('.question');
        if (!questionElement.classList.contains('selectable')) {
            return;
        }

        let questionText = questionElement.textContent;
        if (answeredQuestions[questionText]) {
            displayCorrectAnswer(questionText, answeredQuestions[questionText].answer, answeredQuestions[questionText].explanation);
            questionElement.classList.remove('selectable');
        }
    };

    return { questionBlock, answerBlock };
}

function displayQuestion() {
    if (questions.length === 0) {
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('result').textContent = `Вопросы закончились. Правильных ответов: ${correctAnswers} из ${questionNumber}`;

        let questionElements = document.querySelectorAll('.question');
        for (let questionElement of questionElements) {
            questionElement.classList.add('selectable');
        }
        displayResultChart(correctAnswers, questionNumber);
        return;
    }

    questionNumber++;
    let { questionBlock, answerBlock } = createQuestionBlock();

    let randomIndex = Math.floor(Math.random() * questions.length);
    let currentQuestion = questions.splice(randomIndex, 1)[0];
    let correctAnswer = currentQuestion.answers[currentQuestion.correct];

    shuffleArray(currentQuestion.answers);

    let newCorrectIndex = currentQuestion.answers.findIndex(answer => answer === correctAnswer);

    questionBlock.innerHTML = `<div class="questionHeader">Вопрос ${questionNumber}</div> <div class="question">${currentQuestion.question}</div>`;
    answerBlock.innerHTML = "";

    currentQuestion.answers.forEach((answer, index) => {
        let answerElement = document.createElement('div');
        answerElement.classList.add('answer', 'selectable');
        answerElement.textContent = answer;
        answerElement.onclick = function () {
            if (this.classList.contains('disabled')) {
                return;
            }

            let isCorrect = index === newCorrectIndex;
            answerElement.classList.add('disabled');
            answerElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            answeredQuestions[currentQuestion.question] = { answer: currentQuestion.answers[currentQuestion.correct], explanation: currentQuestion.explanation };

            // Выключаем все ответы после выбора одного
            let allAnswers = this.parentElement.querySelectorAll('.answer');
            allAnswers.forEach(el => {
                el.classList.add('disabled');
                el.classList.remove('selectable');
            });

            if (isCorrect) {
                correctAnswers++;
                let correctAnswerElement = document.createElement('div');
                correctAnswerElement.classList.add('correct-answer');
                correctAnswerElement.innerHTML = "<small>" + currentQuestion.explanation + "</small>";
                answerBlock.appendChild(correctAnswerElement);
            }

            setTimeout(() => {
                answerBlock.classList.add('slide-out');
                answerBlock.addEventListener('animationend', () => {
                    displayQuestion();
                    answerBlock.classList.add('hidden');
                    let questionElement = questionBlock.querySelector('.question');
                    questionElement.classList.add(isCorrect ? 'correct-question' : 'incorrect-question');
                }, { once: true });
            }, 2000);
        };

        answerBlock.appendChild(answerElement);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayResultChart(correct, total) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Правильные', 'Неправильные'],
            datasets: [{
                label: 'Результаты викторины',
                data: [correct, total - correct],
                backgroundColor: ['green', 'red'],
                hoverOffset: 4
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Результаты викторины'
                }
            }
        }
    });
}


displayQuestion();
