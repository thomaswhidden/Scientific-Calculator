let expression = '';

function appendToExpr(value) {
  // Auto-close parentheses for functions
  if (value === '(') {
    expression += '(';
  } else {
    expression += value;
  }
  updateDisplay();
}

function updateDisplay() {
  // Show a readable version of the expression
  let readable = expression
    .replace(/Math\.sin\(/g, 'sin(')
    .replace(/Math\.cos\(/g, 'cos(')
    .replace(/Math\.tan\(/g, 'tan(')
    .replace(/Math\.log10\(/g, 'log(')
    .replace(/Math\.log\(/g, 'ln(')
    .replace(/Math\.sqrt\(/g, '√(')
    .replace(/Math\.PI/g, 'π')
    .replace(/Math\.E/g, 'e')
    .replace(/\*\*/g, '^')
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');

  document.getElementById('expression').textContent = readable;
}

function clearAll() {
  expression = '';
  document.getElementById('expression').textContent = '';
  document.getElementById('result').textContent = '0';
}

function deleteLast() {
  // Handle multi-char tokens like Math.sin(
  const tokens = [
    'Math.sin(', 'Math.cos(', 'Math.tan(',
    'Math.log10(', 'Math.log(', 'Math.sqrt(',
    'Math.PI', 'Math.E', '**'
  ];
  for (const token of tokens) {
    if (expression.endsWith(token)) {
      expression = expression.slice(0, -token.length);
      updateDisplay();
      return;
    }
  }
  expression = expression.slice(0, -1);
  updateDisplay();
}

function calculate() {
  if (!expression) return;
  try {
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!isFinite(result)) {
      document.getElementById('result').textContent = 'Error';
    } else {
      document.getElementById('result').textContent = parseFloat(result.toFixed(10));
    }
    updateDisplay();
    document.getElementById('expression').textContent =
      document.getElementById('expression').textContent + ' =';
    expression = String(result);
  } catch {
    document.getElementById('result').textContent = 'Error';
    expression = '';
  }
}

document.addEventListener('keydown', (e) => {
  if ('0123456789.+-*/%()'.includes(e.key)) appendToExpr(e.key);
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Backspace') deleteLast();
  else if (e.key === 'Escape') clearAll();
});
