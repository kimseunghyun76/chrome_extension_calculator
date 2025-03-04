class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.memory = 0;
        
        this.initializeElements(previousOperandElement, currentOperandElement);
        this.addEventListeners();
    }

    initializeElements(previousOperandElement, currentOperandElement) {
        this.currentOperandElement = currentOperandElement;
        this.previousOperandElement = previousOperandElement;
        this.numberButtons = document.querySelectorAll('.number');
        this.operationButtons = document.querySelectorAll('.operation');
        this.equalsButton = document.querySelector('.equals');
        this.memoryButtons = document.querySelectorAll('.memory');
    }

    addEventListeners() {
        this.numberButtons.forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.innerText));
        });

        this.operationButtons.forEach(button => {
            button.addEventListener('click', () => this.handleOperation(button.innerText));
        });

        this.equalsButton.addEventListener('click', () => this.calculate());

        this.memoryButtons.forEach(button => {
            button.addEventListener('click', () => this.handleMemory(button.innerText));
        });
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (number === '±') {
            this.currentOperand = (-parseFloat(this.currentOperand)).toString();
        } else {
            this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        }
        this.updateDisplay();
    }

    handleOperation(operation) {
        if (this.currentOperand === '') return;

        switch(operation) {
            case 'C':
                this.clear();
                return;
            case 'CE':
                this.currentOperand = '0';
                this.updateDisplay();
                return;
            case '⌫':
                this.currentOperand = this.currentOperand.slice(0, -1) || '0';
                this.updateDisplay();
                return;
            case 'x²':
                this.currentOperand = Math.pow(parseFloat(this.currentOperand), 2).toString();
                break;
            case '√':
                if (parseFloat(this.currentOperand) < 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                this.currentOperand = Math.sqrt(parseFloat(this.currentOperand)).toString();
                break;
            case '1/x':
                this.currentOperand = (1 / parseFloat(this.currentOperand)).toString();
                break;
            case '%':
                this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
                break;
            default:
                if (this.operation !== undefined) {
                    this.calculate();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
        }
        this.updateDisplay();
    }

    handleMemory(action) {
        const current = parseFloat(this.currentOperand);
        switch(action) {
            case 'MC':
                this.memory = 0;
                break;
            case 'MR':
                this.currentOperand = this.memory.toString();
                break;
            case 'M+':
                this.memory += current;
                break;
            case 'M-':
                this.memory -= current;
                break;
            case 'MS':
                this.memory = current;
                break;
        }
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation) {
            this.previousOperandElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }
}

// 계산기 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.querySelector('.previous-operand');
    const currentOperandElement = document.querySelector('.current-operand');
    if (previousOperandElement && currentOperandElement) {
        new Calculator(previousOperandElement, currentOperandElement);
    } else {
        console.error('계산기 디스플레이 요소를 찾을 수 없습니다!');
    }
}); 