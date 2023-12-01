document.getElementById('select-words').addEventListener('click', function() {
    const inputText = document.getElementById('input-words').value;

    const elements = disassembleText(inputText);
    console.log(elements);

    const associativeArray = createAssociativeArray(elements);
    console.log(associativeArray);

    addWordsToSection(associativeArray);
});

function createAssociativeArray(elements) {
    let words = [];
    let numbers = [];

    elements.forEach(element => isNaN(element) ? words.push(element) : numbers.push(parseInt(element, 10)));

    words.sort();
    numbers.sort((a, b) => a - b);

    let associativeArray = {};
    words.forEach((word, index) => {
        associativeArray[`a${index + 1}`] = word;
    });
    numbers.forEach((number, index) => {
        associativeArray[`n${index + 1}`] = number;
    });
    return associativeArray;
}

function addWordsToSection(associativeArray) {
    const section = document.getElementById('disassembled-words-header');

    section.innerHTML = '';

    for (let key in associativeArray) {
        if (associativeArray.hasOwnProperty(key)) {
            const div = document.createElement('div');
            div.className = 'word';
            const p = document.createElement('p');
            p.textContent = `${key} ${associativeArray[key]}`;
            div.appendChild(p);
            section.appendChild(div);
        }
    }
}

function disassembleText(text) {
    return text.split(/\s*-\s*/);
}
