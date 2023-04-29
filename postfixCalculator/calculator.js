//Get all buttons
const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".calc-button.number");
const operationButtons = document.querySelectorAll(".calc-button.operation");
const clearButton = document.querySelector(".calc-button.clear");
const ceButton = document.querySelector(".calc-button.double-width");
const enterButton = document.getElementById("enter");
const popButton = document.getElementById("pop");
const memoryButton = document.querySelector(".calc-button.memory");
const memoryRecallButton = document.querySelector(".calc-button.memory + .calc-button.memory");
const downloadCSVButton = document.getElementById("downloadCSV");
const infixButton = document.getElementById("infix");
const bedmasButton = document.getElementById("bedmas");

//Variables used for calculator and csv
let stack = [];
let memory = 0;
let csvContent = "Iteration,Timestamp,Display Before,Stack,Key Pressed,Display After\n";
let iteration = 0;
let displayBefore;

//Functions to update, clear, pop, push, clear and do calculations

function updateDisplay(value) {
    display.value = value;
}

function clearDisplay() {
    updateDisplay(0);
}

function pushToStack(value) {
    stack.push(value);
}

function popFromStack() {
    return stack.pop();
}

function clearStack() {
    stack = [];
}

function performOperation(operator) {
    if (stack.length < 1) {
        return;
    }

    const b = popFromStack();
    const a = parseFloat(display.value);

    let result;

    switch (operator) {
        case "+":
            result = a + b;
            break;
        case "-":
            result = b - a;
            break;
        case "x":
            result = a * b;
            break;
        case "÷":
            if (a === 0) {
                updateDisplay("Error");
                return;
            }
            result = b / a;
            break;
        default:
            return;
    }

    updateDisplay(result);
}

//Writes to csv file
function writeToCSV(keyPressed, displayBefore, displayAfter) {
    const timestamp = new Date().toISOString();
    const stackString = stack.join("-");
    const row = `${iteration},${timestamp},${displayBefore},${stackString},${keyPressed},${displayAfter}\n`;
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

//Give every button an event listener as well as one of the functions they need above

numberButtons.forEach((button) => {
    button.addEventListener("click", function () {
        displayBefore = display.value;
        if (display.value === "0" || display.value === "Error") {
            updateDisplay(this.textContent);
        } else {
            updateDisplay(display.value + this.textContent);
        }
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

operationButtons.forEach((button) => {
    button.addEventListener("click", function () {
        displayBefore = display.value;
        performOperation(this.textContent);
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

clearButton.addEventListener("click", function () {
    displayBefore = display.value;
    clearDisplay();
    writeToCSV(clearButton.textContent, displayBefore, display.value);
});

ceButton.addEventListener("click", function () {
    displayBefore = display.value;
    clearDisplay();
    clearStack();
    writeToCSV(ceButton.textContent, displayBefore, display.value);
});

enterButton.addEventListener("click", function () {
    displayBefore = display.value;
    const value = parseFloat(display.value);
    if (!isNaN(value)) {
        pushToStack(value);
    }
    writeToCSV(enterButton.textContent, displayBefore, display.value);
});

popButton.addEventListener("click", function (button) {
    displayBefore = display.value;
    if (stack.length > 0) {
        updateDisplay(popFromStack());
    }
    writeToCSV(popButton.textContent, displayBefore, display.value);
});

memoryButton.addEventListener("click", function () {
    displayBefore = display.value;
    memory = parseFloat(display.value);
    writeToCSV(memoryButton.textContent, displayBefore, display.value);
});

memoryRecallButton.addEventListener("click", function () {
    displayBefore = display.value;
    if (memory !== undefined) {
        updateDisplay(memory);
    }
    writeToCSV(memoryRecallButton.textContent, displayBefore, display.value);
});

downloadCSVButton.addEventListener("click", () => {
    downloadCSV("results.csv");
});

//Relocation buttons

infixButton.addEventListener("click", () => {
    window.location.href = "../infixCalculator/calculator.html";
});

bedmasButton.addEventListener("click", () => {
    window.location.href = "../bedmasCalculator/calculator.html";
});

clearDisplay();

