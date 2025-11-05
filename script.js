// Get the display element from the HTML
const display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

// Initialize display
display.innerText = currentInput;

// This function adds a character (number or operator) to the display
function appendCharacter(char) {
    if (shouldResetDisplay) {
        currentInput = char;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && char !== '.') {
            currentInput = char;
        } else {
            // Prevent multiple decimal points in a number
            if (char === '.') {
                const parts = currentInput.split(/[\+\-\*\/]/);
                const lastPart = parts[parts.length - 1];
                if (lastPart.includes('.')) {
                    return; // Don't add another decimal point
                }
            }
            
            // Prevent multiple operators in a row
            const lastChar = currentInput.slice(-1);
            const operators = ['+', '-', '*', '/'];
            
            if (operators.includes(lastChar) && operators.includes(char)) {
                // Replace the last operator with new one
                currentInput = currentInput.slice(0, -1) + char;
            } else {
                currentInput += char;
            }
        }
    }
    updateDisplay();
}

// This function clears the display and resets it to '0'
function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

// This function removes the last character from the display
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// This function calculates the result of the expression in the display
function calculateResult() {
    try {
        // Basic validation to prevent unsafe eval
        const expression = currentInput;
        
        // Check for empty expression or invalid endings
        if (!expression || /[\+\-\*\/]$/.test(expression)) {
            throw new Error('Invalid expression');
        }
        
        // Check for invalid characters
        if (/[^0-9+\-*/.()]/.test(expression)) {
            throw new Error('Invalid characters');
        }
        
        // Use Function constructor instead of eval for better security
        const result = new Function('return ' + expression)();
        
        // Handle division by zero and other math errors
        if (!isFinite(result)) {
            throw new Error('Math error');
        }
        
        // Format the result to avoid long decimal numbers
        currentInput = parseFloat(result.toPrecision(12)).toString();
        shouldResetDisplay = true;
        updateDisplay();
        
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
        
        // Reset after error display
        setTimeout(() => {
            currentInput = '0';
            shouldResetDisplay = false;
            updateDisplay();
        }, 1500);
    }
}

// Update the display with current input
function updateDisplay() {
    // Format the display for better readability
    let displayText = currentInput
        .replace(/\*/g, '×')
        .replace(/\//g, '÷');
    
    // Limit display length to prevent overflow
    if (displayText.length > 12) {
        displayText = displayText.substring(0, 12);
    }
    
    display.innerText = displayText;
}

// Keyboard support for better accessibility
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendCharacter(key);
    } else if (key === '.') {
        appendCharacter('.');
    } else if (key === '+') {
        appendCharacter('+');
    } else if (key === '-') {
        appendCharacter('-');
    } else if (key === '*') {
        appendCharacter('*');
    } else if (key === '/') {
        event.preventDefault();
        appendCharacter('/');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Escape' || key === 'Delete') {
        clearDisplay();
    } else if (key === 'Backspace') {
        deleteLast();
    }
});