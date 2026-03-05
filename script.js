import { Calculator } from './calculator.js';
import { history } from './history.js';

let calc = new Calculator();
history.renderHistory();

function setDisplay(val) {
    const num = parseFloat(val);
    if (calc.feMode && !isNaN(num) && isFinite(num)) {
        const exp = num.toExponential();
        document.getElementById("main-display").textContent = exp;
    } else {
        document.getElementById("main-display").textContent = val;
    }
}
function setExpr(val) {
    document.getElementById("expr-display").textContent = val;
}
function showError(msg) {
    setDisplay("Error: " + msg);
    setExpr("");
    calc.clear();
}

document.querySelectorAll("[data-value]").forEach(button => {
    button.addEventListener("click", () => {
        handleInput(button.getAttribute("data-value"));
    });
});

document.addEventListener("keydown", (e) => {
    handleInput(e.key);
});

document.getElementById("toggleHistory").addEventListener("click", () => history.toggleHistory());
document.getElementById("clearHistory").addEventListener("click", () => history.clearHistory());

document.getElementById("btn-deg").addEventListener("click", () => {
    if (calc.angleMode === "deg") {
        calc.angleMode = "rad";
        document.getElementById("btn-deg").textContent = "RAD";
    } else {
        calc.angleMode = "deg";
        document.getElementById("btn-deg").textContent = "DEG";
    }
});

document.getElementById("btn-fe").addEventListener("click", () => {
    calc.feMode = !calc.feMode;
    document.getElementById("btn-fe").classList.toggle("active", calc.feMode);
    const current = parseFloat(document.getElementById("main-display").textContent);
    if (!isNaN(current)) {
        setDisplay(current);
    }
});

function handleInput(value) {
    if (!value) return;

    // numbers and decimal
    if (!isNaN(value) || value === ".") {
        handleNumber(value);
    }
    // basic operators
    else if (["+", "-", "*", "/", "%", "mod", "^"].includes(value)) {
        handleOperator(value);
    }
    // constants
    else if (value === "pi" || value === "e") {
        handleConstant(value);
    }
    // parentheses
    else if (value === "(" || value === ")") {
        calc.append(value);
        setDisplay(calc.expression);
    }
    // math functions (sin, cos, sqrt, etc.)
    else if (calc.isMathFunction(value)) {
        handleUnaryFunction(value);
    }
    // controls (C/Escape, backspace, =)
    else if (value === "C" || value === "Escape") {
        clearAll();
    }
    else if (value === "Backspace") {
        calc.expression = calc.expression.slice(0, -1);
        setDisplay(calc.expression || "0");
    }
    else if (value === "=" || value === "Enter") {
        calculate();
    }
    else if (value === "±") {
        calc.expression = calc.expression.startsWith("-")
            ? calc.expression.slice(1)
            : "-" + calc.expression;
        calc.justEvaluated = false;
        setDisplay(calc.expression);
    }
}

function handleNumber(value) {
    if (calc.justEvaluated) {
        calc.clear();
        calc.justEvaluated = false;
    }

    if (value === "0" && calc.expression === "0") return;
    if (value !== "." && calc.expression === "0") {
        calc.clear();
    }

    // prevent double decimal in same number
    if (value === ".") {
        const lastNumber = calc.expression.split(/[+\-*/%()]/).pop();
        if (lastNumber && lastNumber.includes(".")) return;
    }

    calc.append(value);
    setDisplay(calc.expression);
}

function handleOperator(value) {
    calc.justEvaluated = false;

    // prevent consecutive operators
    const lastChar = calc.expression[calc.expression.length - 1];
    if (["+", "-", "*", "/", "%"].includes(lastChar)) return;

    if (value === "mod") calc.append("%");
    else if (value === "^") calc.append("**");
    else calc.append(value);

    setDisplay(calc.expression);
}

function handleConstant(value) {
    if (/[0-9)]$/.test(calc.expression)) {
        calc.append("*");
    }
    const constant = value === "pi" ? Math.PI : Math.E;
    calc.append(String(calc.round(constant)));
    setDisplay(calc.expression);
}

function handleUnaryFunction(value) {
    try {
        const result = calc.applyFunction(value);
        calc.set(String(result));
        setDisplay(result);
        calc.justEvaluated = true;
    } catch (err) {
        showError(err.message);
    }
}

function calculate() {
    try {
        const result = calc.evaluate();

        setExpr(calc.expression + " =");
        setDisplay(result);
        history.addHistory(calc.expression, result);
        calc.set(String(result));
        calc.justEvaluated = true;
    } catch (err) {
        showError(err.message);
    }
}

function clearAll() {
    calc.clear();
    setDisplay("0");
    setExpr("");
}

// memory buttons
function getMemoryValue() {
    try {
        const result = calc.evaluate();
        return typeof result === "number" ? result : parseFloat(calc.expression);
    } catch {
        return parseFloat(calc.expression);
    }
}

document.getElementById("M+").addEventListener("click", () => {
    const value = getMemoryValue();
    if (isNaN(value)) return showError("Invalid Number");
    calc.addMemory(value);
});

document.getElementById("M-").addEventListener("click", () => {
    const value = getMemoryValue();
    if (isNaN(value)) return showError("Invalid Number");
    calc.subMemory(value);
});

document.getElementById("MR").addEventListener("click", () => {
    calc.set(String(calc.getMemory()));
    setDisplay(calc.expression);
});

document.getElementById("MS").addEventListener("click", () => {
    const value = getMemoryValue();
    if (isNaN(value)) return showError("Invalid Number");
    calc.setMemory(value);
});

document.getElementById("MC").addEventListener("click", () => {
    calc.clearMemory();
});

// dark mode toggle
const darkToggle = document.getElementById("darkToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        
    } else {
        localStorage.setItem("theme", "light");
    }
});