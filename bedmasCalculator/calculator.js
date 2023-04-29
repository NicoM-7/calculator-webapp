//variables used for calculator
const display = document.querySelector('.display');
display.value = 0;
let expression = '';
let memory = 0;

//CSV variables
let csvContent = "Iteration,Timestamp,Display Before,Key Pressed,Display After\n";
let iteration = 0;
let displayBefore;

//Function to append to an expression
function addToExpression(value) {
    expression += value;
    display.value = expression;
}

//Function to clear the entire expression and initialize calculator back to 0
function clearAll() {
    displayBefore = display.value;
    expression = '';
    display.value = '0';
    writeToCSV("CE", displayBefore, display.value);
}

//Function to clear the last iput the user did
function clearLast() {
    displayBefore = display.value;
    expression = expression.slice(0, -1);
    display.value = expression || '0';
    writeToCSV("C", displayBefore, display.value);
}

//Function called after equals button is bressed
function calculate() {
    displayBefore = display.value;
    try {   //If it can evaluate the expression using eval display the result, if not go in catch block and put Error on the screen
        const result = eval(expression.replace(/[x÷]/g, (match) => (match === "x" ? "*" : "/")));   //Change all occurences of x and ÷ to * and / since javascript cant understand x and ÷
        memory = result;
        expression = result.toString();
        display.value = result;
    } catch {
        display.value = 'Error';
    }
    writeToCSV("=", displayBefore, display.value);
}

//Function called after M is pressed
function storeInMemory() {
    displayBefore = display.value;
    memory = eval(expression);
    writeToCSV("M", displayBefore, display.value);
}

//Function called after MR is pressed
function recallMemory() {
    displayBefore = display.value;
    expression += memory;
    display.value = expression;
    writeToCSV("MR", displayBefore, display.value);
}

//Writes to csv file
function writeToCSV(keyPressed, displayBefore, displayAfter) {
    const timestamp = new Date().toISOString();
    const row = `${iteration},${timestamp},${displayBefore},${keyPressed},${displayAfter}\n`;
    csvContent += row;
    iteration++;
}

//Lets user download csv file
function downloadCSV(filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//Give buttons 0-9 and the '(', ')' on click events
const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach((button) => {
    button.addEventListener('click', () => {
        displayBefore = display.value;
        addToExpression(button.textContent);
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

//Give buttons +. -, x, / on click events
const operationButtons = document.querySelectorAll('.operation');
operationButtons.forEach((button) => {
    button.addEventListener('click', () => {
        displayBefore = display.value;
        addToExpression(button.textContent);
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

const infixButton = document.getElementById("infix");
const postfixButton = document.getElementById("postfix");
const downloadCSVButton = document.getElementById("downloadCSV");

infixButton.addEventListener("click", () => {
    window.location.href = "../infixCalculator/calculator.html";
});

postfixButton.addEventListener("click", () => {
    window.location.href = "../postfixCalculator/calculator.html";
});

downloadCSVButton.addEventListener("click", () => {
    downloadCSV("results.csv");
});

//Give buttons event listeners by passing in functions
document.querySelector('.equal').addEventListener('click', calculate);

document.querySelector('.clear').addEventListener('click', clearLast);

document.querySelector('.double-width').addEventListener('click', clearAll);

document.querySelector('.memory').addEventListener('click', storeInMemory);

document.querySelector('.memory:nth-child(2)').addEventListener('click', recallMemory);
