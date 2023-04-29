//Get all calculator buttons
const display = document.querySelector(".display");
const numberButtons = document.querySelectorAll(".number");
const operationButtons = document.querySelectorAll(".operation");
const clearButtons = document.querySelectorAll(".clear");
const memoryButtons = document.querySelectorAll(".memory");
const equalsButton = document.querySelector(".equal");
const postfixButton = document.getElementById("postfix");
const bedmasButton = document.getElementById("bedmas");
const downloadCSVButton = document.getElementById("downloadCSV");

//Initialize variables used for infix calculator
let currentValue = 0;
let storedValue = null;
let currentOperator = null;
let memoryValue = 0;
let replaceDisplay = false;

//CSV variables
let csvContent = "Iteration,Timestamp,Display Before,Key Pressed,Display After\n";
let iteration = 0;
let displayBefore;

//Function to update value displayed on calcualtor
const updateDisplay = (value) => {
    display.value = value;
};

//Function for CE button
const clearAll = () => {
    currentValue = 0;
    storedValue = null;
    currentOperator = null;
    replaceDisplay = false;
};

//Function for C button
const clearLast = () => {
    const displayValue = display.value;
    if (displayValue.length > 1) {
        updateDisplay(displayValue.slice(0, -1));
    } else {
        updateDisplay(0);
    }
};

//Function for M button
const storeToMemory = () => {
    memoryValue = parseFloat(display.value);
};

//Function for MR button
const recallMemory = () => {
    updateDisplay(memoryValue);
    replaceDisplay = true;
};

//Function for +, -, x, / buttons
const performOperation = () => {
    //If user presses an operation when there is no previous number or another operation is already there don't do anything
    if (storedValue === null || currentOperator === null) {
        return;
    }

    //Check for operaton
    switch (currentOperator) {
        case "+":
            currentValue = storedValue + currentValue;
            break;
        case "-":
            currentValue = storedValue - currentValue;
            break;
        case "x":
            currentValue = storedValue * currentValue;
            break;
        case "÷":
            currentValue = storedValue / currentValue;
            break;
    }
};

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

//call update display
updateDisplay(currentValue);

//Give buttons 0-9 an onclick event
numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        displayBefore = display.value;
        if (replaceDisplay) {
            updateDisplay(button.textContent);
            replaceDisplay = false;
        } else {
            updateDisplay(display.value === "0" ? button.textContent : display.value + button.textContent);
        }
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

//Give the buttons +, -, x, / an onclick event
operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        displayBefore = display.value;
        if (storedValue !== null && currentOperator !== null) {
            currentValue = parseFloat(display.value);
            performOperation();
            updateDisplay(currentValue);
        }

        storedValue = parseFloat(display.value);
        currentOperator = button.textContent;
        replaceDisplay = true;
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

//Give C and CE an onclick event
clearButtons.forEach((button) => {
    button.addEventListener("click", () => {
        displayBefore = display.value;
        if (button.textContent === "CE") {
            clearAll();
            updateDisplay(currentValue);
        } else if (button.textContent === "C") {
            clearLast();
        }
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

//Give M and MR an onclick event
memoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        displayBefore = display.value;
        if (button.textContent === "M") {
            storeToMemory();
        } else if (button.textContent === "MR") {
            recallMemory();
        }
        writeToCSV(button.textContent, displayBefore, display.value);
    });
});

//Give the = an onclick event
equalsButton.addEventListener("click", () => {
    displayBefore = display.value;
    currentValue = parseFloat(display.value);
    performOperation();
    updateDisplay(currentValue);
    storedValue = null;
    currentOperator = null;
    replaceDisplay = true;
    writeToCSV(equalsButton.textContent, displayBefore, display.value);
});

postfixButton.addEventListener("click", () => {
    window.location.href = "../postfixCalculator/calculator.html";
});

bedmasButton.addEventListener("click", () => {
    window.location.href = "../bedmasCalculator/calculator.html";
});

downloadCSVButton.addEventListener("click", () => {
    downloadCSV("results.csv");
});


