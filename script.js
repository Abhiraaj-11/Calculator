let expression = '';
let lastAnswer = 0;

const display = {
    expression: document.querySelector('.expression'),
    result: document.querySelector('.result')
};

document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => handleButton(button.textContent));
});

function handleButton(value) {
    switch(value) {
        case 'clear':
            clear();
            break;
        case 'del':
            deleteLast();
            break;
        case 'ENTER':
            calculate();
            break;
        case 'ans':
            appendToExpression(lastAnswer.toString());
            break;
        case '±':
            toggleSign();
            break;
        case '√':
            appendToExpression('sqrt(');
            break;
        case '×':
            appendToExpression('*');
            break;
        case '÷':
            appendToExpression('/');
            break;
        case '−':
            appendToExpression('-');
            break;
        default:
            appendToExpression(value);
    }
    updateDisplay();
}

function clear() {
    expression = '';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function appendToExpression(value) {
    expression += value;
    updateDisplay();
}

function toggleSign() {
    if (expression) {
        if (expression.startsWith('-')) {
            expression = expression.slice(1);
        } else {
            expression = '-' + expression;
        }
        updateDisplay();
    }
}

function updateDisplay() {
    let displayExpression = expression
        .replace(/\*/g, '×')
        .replace(/\//g, '÷')
        .replace(/sqrt/g, '√');
    
    display.expression.textContent = displayExpression;
    
    try {
        if (expression) {
            let evalExpression = expression
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/([0-9.]+)%/g, '($1/100)');
            
            const result = eval(evalExpression);
            display.result.textContent = Number.isInteger(result) ? 
                result.toString() : 
                parseFloat(result.toFixed(4)).toString();
        } else {
            display.result.textContent = '0';
        }
    } catch (error) {
        display.result.textContent = displayExpression || '0';
    }
}

function calculate() {
    if (!expression) return;

    try {
        let evalExpression = expression
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/([0-9.]+)%/g, '($1/100)');
        
        const result = eval(evalExpression);
        lastAnswer = result;
        
        display.result.textContent = Number.isInteger(result) ? 
            result.toString() : 
            parseFloat(result.toFixed(4)).toString();

        expression = result.toString();
        display.expression.textContent = '';
    } catch (error) {
        display.result.textContent = 'Error';
        expression = '';
        display.expression.textContent = '';
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.' || key === '+' || 
        key === '-' || key === '*' || key === '/' || 
        key === '(' || key === ')' || key === '%') {
        handleButton(key);
    } else if (key === 'Enter') {
        handleButton('ENTER');
    } else if (key === 'Backspace') {
        handleButton('del');
    } else if (key === 'Escape') {
        handleButton('clear');
    }
});