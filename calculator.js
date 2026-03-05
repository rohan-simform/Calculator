export class Calculator {
	constructor() {
		this.expression = "";
		this.justEvaluated = false;
		this.memory = 0;
		this.angleMode = "deg";
		this.feMode = false;
	}

	round(num) {
		return parseFloat(Number(num).toFixed(10));
	}

	clear() {
		this.expression = "";
	}

	append(value) {
		this.expression += value;
	}

	set(value) {
		this.expression = value;
	}

	evaluate(expr = null) {
		let expression = expr !== null ? expr : this.expression;
		if (!expression) return "";

		// auto-close any unclosed parentheses to prevent syntax errors
		const open = (expression.match(/\(/g) || []).length;
		const close = (expression.match(/\)/g) || []).length;
		for (let i = 0; i < open - close; i++) expression += ")";

		const result = eval(expression);

		if (typeof result !== "number" || isNaN(result)) {
			throw new Error("Invalid Expression");
		}

		if (!isFinite(result)) {
			throw new Error("Cannot divide by zero");
		}

		return this.round(result);
	}

	applyFunction(value) {
		if (this.expression === "") throw new Error("No input");
		const current = parseFloat(this.expression);
		if (isNaN(current)) throw new Error("Invalid input");

		const toRad = this.angleMode === "deg" ? current * (Math.PI / 180) : current;
		let result;

		switch (value) {
			case "sin":    result = Math.sin(toRad);           break;
			case "cos":    result = Math.cos(toRad);           break;
			case "tan":    result = Math.tan(toRad);           break;
			case "sec":    result = 1 / Math.cos(toRad);       break;
			case "csc":    result = 1 / Math.sin(toRad);       break;
			case "cot":    result = 1 / Math.tan(toRad);       break;
			case "sqrt":   result = Math.sqrt(current);        break;
			case "abs":    result = Math.abs(current);         break;
			case "log":    result = Math.log10(current);       break;
			case "ln":     result = Math.log(current);         break;
			case "inv":    result = 1 / current;               break;
			case "exp":    result = Math.exp(current);         break;
			case "fact":   result = this.factorial(current);   break;
			case "pow":    result = Math.pow(current, 2);      break;
			case "tenpow": result = Math.pow(10, current);     break;
			case "cube":   result = Math.pow(current, 3);      break;
			case "floor":  result = Math.floor(current);       break;
			case "ceil":   result = Math.ceil(current);        break;
			case "round":  result = Math.round(current);       break;
			default: throw new Error("Unknown Function");
		}
		if (!isFinite(result)) {
			throw new Error("Cannot divide by zero");
		}
		return this.round(result);
	}

	isMathFunction(value) {
		const fns = ["sin", "cos", "tan", "sec", "csc", "cot", "sqrt", "abs", "inv", "log",
			"ln", "exp", "fact", "pow", "tenpow", "cube", "floor", "ceil", "round"];
		return fns.includes(value);
	}

	factorial(n) {
		if (n < 0) throw new Error("Invalid Factorial");
		if (!Number.isInteger(n)) throw new Error("Factorial requires a whole number");
		if (n === 0 || n === 1) return 1;
		let result = 1;
		for (let i = 2; i <= n; i++) {
			result *= i;
		}
		return result;
	}

	addMemory(value) {
		this.memory += value;
	}
	subMemory(value) {
		this.memory -= value;
	}
	getMemory() {
		return this.memory;
	}
	setMemory(value) {
		this.memory = value;
	}
	clearMemory() {
		this.memory = 0;
	}
}