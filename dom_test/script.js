const quizData = [
    {
        q: "А когда с человеком может произойти дрожемент?",
        a: ["Когда он влюбляется", "Когда он идет шопиться", "Когда он слышит смешную шутку", "Когда он боится, пугается"],
        c: 3,
        e: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»."
    },
    {
        q: "Говорят, Антон заовнил всех. Это еще как понимать?",
        a: ["Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", "Антон очень надоедливый и въедливый человек, всех задолбал", "Молодец, Антон, всех победил!", "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей"],
        c: 2,
        e: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»"
    },
    {
        q: "А фразу «заскамить мамонта» как понимать?",
        a: ["Разозлить кого-то из родителей", "Увлекаться археологией", "Развести недотепу на деньги", "Оскорбить пожилого человека"],
        c: 2,
        e: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца."
    },
    {
        q: "Кто такие бефефе?",
        a: ["Вши?", "Милые котики, такие милые, что бефефе", "Лучшие друзья", "Люди, которые не держат слово"],
        c: 2,
        e: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever."
    },
];

let answered = {};
let qNum = 0;
let correctNum = 0;

function displayQuestion() {
    if (quizData.length === 0) {
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('result').textContent = `Вопросы закончились. Правильных ответов: ${correctNum} из ${qNum}`;
        let qElements = document.querySelectorAll('.question');
        for (let qElement of qElements) {
            qElement.classList.add('selectable');
        }
        showResultChart(correctNum, qNum);
        return;
    }
    qNum++;
    let { qBlock, aBlock } = createQBlock();
    let randomIdx = Math.floor(Math.random() * quizData.length);
    let currentQ = quizData.splice(randomIdx, 1)[0];
    let correctA = currentQ.a[currentQ.c];
    shuffle(currentQ.a);
    let newCorrectIdx = currentQ.a.findIndex(answer => answer === correctA);
    qBlock.innerHTML = `<div class="questionHeader">Вопрос ${qNum}</div> <div class="question">${currentQ.q}</div>`;
    aBlock.innerHTML = "";
    currentQ.a.forEach((answer, index) => {
        let aElement = document.createElement('div');
        aElement.classList.add('answer', 'selectable');
        aElement.textContent = answer;
        aElement.onclick = function () {
            if (this.classList.contains('disabled')) {
                return;
            }
            let isCorrect = index === newCorrectIdx;
            aElement.classList.add('disabled');
            aElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            answered[currentQ.q] = { answer: currentQ.a[currentQ.c], explanation: currentQ.e };
            let allAnswers = this.parentElement.querySelectorAll('.answer');
            allAnswers.forEach(el => {
                el.classList.add('disabled');
                el.classList.remove('selectable');
            });
            if (isCorrect) {
                correctNum++;
                let correctAElement = document.createElement('div');
                correctAElement.classList.add('correct-answer');
                correctAElement.innerHTML = "<small>" + currentQ.e + "</small>";
                aBlock.appendChild(correctAElement);
            }
            setTimeout(() => {
                aBlock.classList.add('slide-out');
                aBlock.addEventListener('animationend', () => {
                    displayQuestion();
                    aBlock.classList.add('hidden');
                    let qElement = qBlock.querySelector('.question');
                    qElement.classList.add(isCorrect ? 'correct-question' : 'incorrect-question');
                }, { once: true });
            }, 2000);
        };
        aBlock.appendChild(aElement);
    });
}

function createQBlock() {
    let qBlock = document.createElement('div');
    qBlock.classList.add('question-block');
    let aBlock = document.createElement('div');
    aBlock.classList.add('answer-block');
    let quizContainer = document.getElementById('quiz-container');
    quizContainer.appendChild(qBlock);
    quizContainer.appendChild(aBlock);
    qBlock.onclick = function () {
        let qElement = qBlock.querySelector('.question');
        if (!qElement.classList.contains('selectable')) {
            return;
        }
        let qText = qElement.textContent;
        if (answered[qText]) {
            displayCorrectAnswer(qText, answered[qText].answer, answered[qText].explanation);
            qElement.classList.remove('selectable');
        }
    };
    return { qBlock, aBlock };
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayCorrectAnswer(qText, correctA, explanation) {
    let qBlocks = document.querySelectorAll('.question-block');
    for (let qBlock of qBlocks) {
        if (qBlock.querySelector('.question').textContent === qText) {
            let correctAElement = document.createElement('div');
            correctAElement.classList.add('correct-answer');
            correctAElement.innerHTML = "Правильный ответ: " + correctA + "<br><small>" + explanation + "</small>";
            qBlock.appendChild(correctAElement);
            break;
        }
    }
}

function showResultChart(correct, total) {
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