let a = 0, b = 0, c = 0;
const Smile = { HAPPY: 'images/happy.png', SAD: 'images/sad.png' };

async function start() {
    resetContent();
    inputVariables();
    const formulasCount = Number(document.getElementById("formulas-count-input").value);

    for (let i = 1; i <= formulasCount; i++) {
        await sleep(1000);
        if (i !== 1 && !confirm("Продолжить?")) return;
        displayFormulaResult(i, applyFormula(i));
    }
}

function resetContent() {
    document.querySelectorAll(".formula-result, .smile-img").forEach(el => {
        el.classList.remove('formula-result-visible');
        el.classList.add('formula-result-hidden');
    });
    document.querySelectorAll(".smile-img").forEach(el => el.remove());
}

function inputVariables() {
    a = Number(prompt("Введите значение переменной a"));
    b = Number(prompt("Введите значение переменной b"));
    c = Number(prompt("Введите значение переменной c"));
}

function applyFormula(index) {
    const formulas = [
        () => (Math.PI * Math.sqrt(a ** 2)) / (b ** 2 * c),
        () => (a + Math.sqrt(b)) ** 2 / c ** 3,
        () => Math.sqrt(a + b + Math.sqrt(c)) / (Math.PI * b)
    ];
    return formulas[index - 1]();
}

function displayFormulaResult(index, result) {
    const formulaBlock = document.getElementById(`formula-${index}`);
    formulaBlock.classList.remove('formula-result-hidden');
    formulaBlock.classList.add('formula-result-visible');
    document.getElementById(`formula-${index}-result-text`).textContent = result;
    formulaBlock.appendChild(getSmileElement(isNaN(result) ? Smile.SAD : Smile.HAPPY));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSmileElement(src) {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("smile-img");
    return img;
}
