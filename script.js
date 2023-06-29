// Get the calculator elements
const result = document.getElementById('result');
const buttons = document.querySelectorAll('.buttons button');
const clearButton = document.getElementById('clear');
const equalButton = document.getElementById('equal');

// Add click event listeners to buttons
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const buttonText = button.textContent;
    result.value += buttonText;
  });
});

// Add click event listener to clear button
clearButton.addEventListener('click', () => {
  result.value = '';
});

// Add click event listener to equal button
equalButton.addEventListener('click', () => {
  try {
    const calculation = evaluateExpression(result.value);
    result.value = calculation;
  } catch (error) {
    result.value = 'Error';
  }
});

// Add click event listeners to scientific buttons
const scientificButtons = document.querySelectorAll('.scientific');
scientificButtons.forEach(button => {
  button.addEventListener('click', () => {
    const scientificFunction = button.textContent;
    result.value += scientificFunction + '(';
  });
});

// Function to evaluate the mathematical expression
function evaluateExpression(expression) {
  // Remove any whitespace from the expression
  const sanitizedExpression = expression.replace(/\s/g, '');

  // Evaluate the expression using custom logic
  const result = evaluate(sanitizedExpression);
  return result;
}

// Object to define operators and their precedence
const operators = {
  '+': { precedence: 1, numOperands: 2 },
  '-': { precedence: 1, numOperands: 2 },
  '*': { precedence: 2, numOperands: 2 },
  '/': { precedence: 2, numOperands: 2 },
  '^': { precedence: 3, numOperands: 2 },
  sqrt: { precedence: 4, numOperands: 1 },
  sin: { precedence: 4, numOperands: 1 },
  cos: { precedence: 4, numOperands: 1 },
  tan: { precedence: 4, numOperands: 1 },
  log: { precedence: 4, numOperands: 1 },
};

// Function to evaluate the mathematical expression
function evaluate(expression) {
  const valueStack = [];
  const operatorStack = [];

  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const token = expression[i];

    if (!isNaN(token) || token === '.') {
      // Numeric or decimal point token
      currentNumber += token;
    } else if (token in operators) {
      // Operator token
      const operator = operators[token];

      if (currentNumber !== '') {
        // Push the current number onto the value stack
        valueStack.push(parseFloat(currentNumber));
        currentNumber = '';
      }

      while (
        operatorStack.length > 0 &&
        operators[operatorStack[operatorStack.length - 1]].precedence >= operator.precedence
      ) {
        const topOperator = operatorStack.pop();
        const numOperands = operators[topOperator].numOperands;
        const operands = [];

        for (let j = 0; j < numOperands; j++) {
          const operand = valueStack.pop();
          if (operand === undefined) {
            throw new Error('Invalid expression');
          }
          operands.unshift(operand);
        }

        const result = evaluateOperator(topOperator, operands);
        valueStack.push(result);
      }

      operatorStack.push(token);
    } else if (token === '(') {
      // Opening parenthesis token
      operatorStack.push(token);
    } else if (token === ')') {
      // Closing parenthesis token
      if (currentNumber !== '') {
        // Push the current number onto the value stack
        valueStack.push(parseFloat(currentNumber));
        currentNumber = '';
      }

      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        const topOperator = operatorStack.pop();
        const numOperands = operators[topOperator].numOperands;
        const operands = [];

        for (let j = 0; j < numOperands; j++) {
          const operand = valueStack.pop();
          if (operand === undefined) {
            throw new Error('Invalid expression');
          }
          operands.unshift(operand);
        }

        const result = evaluateOperator(topOperator, operands);
        valueStack.push(result);
      }

      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] === '(') {
        operatorStack.pop(); // Remove the opening parenthesis
      } else {
        throw new Error('Invalid expression');
      }
    }
  }

  if (currentNumber !== '') {
    // Push the current number onto the value stack
    valueStack.push(parseFloat(currentNumber));
  }

  while (operatorStack.length > 0) {
    const topOperator = operatorStack.pop();
    const numOperands = operators[topOperator].numOperands;
    const operands = [];

    for (let i = 0; i < numOperands; i++) {
      const operand = valueStack.pop();
      if (operand === undefined) {
        throw new Error('Invalid expression');
      }
      operands.unshift(operand);
    }

    const result = evaluateOperator(topOperator, operands);
    valueStack.push(result);
  }

  if (valueStack.length !== 1 || operatorStack.length !== 0) {
    throw new Error('Invalid expression');
  }

  return valueStack[0];
}

// Function to evaluate an operator with the given operands
function evaluateOperator(operator, operands) {
  switch (operator) {
    case '+':
      return operands[0] + operands[1];
    case '-':
      return operands[0] - operands[1];
    case '*':
      return operands[0] * operands[1];
    case '/':
      return operands[0] / operands[1];
    case '^':
      return Math.pow(operands[0], operands[1]);
    case 'sqrt':
      return Math.sqrt(operands[0]);
    case 'sin':
      return Math.sin(operands[0]);
    case 'cos':
      return Math.cos(operands[0]);
    case 'tan':
      return Math.tan(operands[0]);
    case 'log':
      return Math.log10(operands[0]);
    default:
      throw new Error('Invalid operator');
  }
}
