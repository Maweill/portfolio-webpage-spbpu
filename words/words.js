watchInputField();

document.getElementById('select-words').addEventListener('click', function() {
    clearFields();

    const inputText = document.getElementById('input-words').value;

    const elements = disassembleText(inputText);
    console.log(elements);

    const associativeArray = createAssociativeArray(elements);
    console.log(associativeArray);

    addWordsToHeader(associativeArray);
});

const dragAndDropField = document.getElementById('drag-and-drop-field');
document.addEventListener('dragstart', function(event) {
    if (!event.target.className.includes('word')) {
        return;
    }
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.setData('offsetX', event.offsetX.toString());
    event.dataTransfer.setData('offsetY', event.offsetY.toString());
});
dragAndDropField.addEventListener('dragover', function(event) {
    event.preventDefault();
});
dragAndDropField.addEventListener('drop', function(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text');
    const offsetX = parseInt(event.dataTransfer.getData('offsetX'));
    const offsetY = parseInt(event.dataTransfer.getData('offsetY'));
    let draggableElement = document.getElementById(data);

    const rect = dragAndDropField.getBoundingClientRect();
    let x = event.clientX - rect.left - offsetX;
    let y = event.clientY - rect.top - offsetY;

    if (x < 0
        || y < 0
        || x + draggableElement.offsetWidth > rect.width
        || y + draggableElement.offsetHeight > rect.height) {
        return;
    }

    if (draggableElement.parentNode.id !== 'drag-and-drop-field') {
        draggableElement.style.visibility = 'hidden';
        draggableElement = draggableElement.cloneNode(true);
        appendWordElementToDragAndDropField(draggableElement, data);

        const wordText = draggableElement.textContent.split(' ')[1];
        addToSelectedWords(wordText);
    }

    draggableElement.style.left = `${x}px`;
    draggableElement.style.top = `${y}px`;
});

function watchInputField() {
    const inputField = document.getElementById('input-words');
    const submitButton = document.getElementById('select-words');
    function updateButtonState() {
        submitButton.disabled = inputField.value.trim() === '';
    }
    inputField.addEventListener('input', updateButtonState);
    updateButtonState();
}

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

function disassembleText(text) {
    return text.split(/\s*-\s*/);
}

function addWordsToHeader(associativeArray) {
    const section = document.getElementById('disassembled-words-header');
    section.innerHTML = '';

    for (let key in associativeArray) {
        if (associativeArray.hasOwnProperty(key)) {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word';
            wordDiv.setAttribute('draggable', 'true');
            wordDiv.id = `drag-${key}`;

            const p = document.createElement('p');
            p.textContent = `${key} ${associativeArray[key]}`;
            wordDiv.appendChild(p);
            section.appendChild(wordDiv);

            wordDiv.addEventListener('click', function() {
                moveWordToDragAndDropField(wordDiv.id, associativeArray[key]);
            });
        }
    }
}

function moveWordToDragAndDropField(wordId, wordText) {
    const draggableElement = document.getElementById(wordId);
    const dragAndDropField = document.getElementById('drag-and-drop-field');

    draggableElement.style.visibility = 'hidden';

    const clonedElement = draggableElement.cloneNode(true);
    appendWordElementToDragAndDropField(clonedElement, wordId);

    const clonedElementWidth = clonedElement.offsetWidth;
    const clonedElementHeight = clonedElement.offsetHeight;
    const dropFieldRect = dragAndDropField.getBoundingClientRect();

    let x = Math.random() * (dropFieldRect.width - clonedElementWidth);
    let y = Math.random() * (dropFieldRect.height - clonedElementHeight);

    x = Math.max(0, x);
    y = Math.max(0, y);

    clonedElement.style.left = `${x}px`;
    clonedElement.style.top = `${y}px`;

    addToSelectedWords(wordText);
}

function appendWordElementToDragAndDropField(element, wordId) {
    element.id = `moved-${wordId}`;
    element.style.visibility = 'visible';
    element.style.position = 'absolute';
    dragAndDropField.appendChild(element);
}

function addToSelectedWords(word) {
    const selectedWordsTextarea = document.getElementById('selected-words');
    selectedWordsTextarea.value += selectedWordsTextarea.value ? ` ${word}` : word;
    selectedWordsTextarea.style.height = 'auto';
    selectedWordsTextarea.style.height = selectedWordsTextarea.scrollHeight + 'px';
}

function clearFields() {
    const dragAndDropField = document.getElementById('drag-and-drop-field');
    const disassembledWordsHeader = document.getElementById('disassembled-words-header');
    const selectedWordsTextarea = document.getElementById('selected-words');

    dragAndDropField.innerHTML = '';
    disassembledWordsHeader.innerHTML = '';
    selectedWordsTextarea.value = '';
}
