class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        console.log('Calculator 초기화:', { 
            previous: previousOperandTextElement, 
            current: currentOperandTextElement 
        })
        
        if (!previousOperandTextElement || !currentOperandTextElement) {
            throw new Error('필수 DOM 요소가 누락되었습니다!')
        }

        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.isComputationComplete = false
        this.clear()
        this.memoryValue = 0
        this.hasMemory = false
        this.updateMemoryButtons()
        
        // 붙여넣기 이벤트 리스너
        this.currentOperandTextElement.addEventListener('paste', (e) => {
            e.preventDefault()
            const text = (e.originalEvent || e).clipboardData.getData('text/plain')
            console.log('붙여넣기 실행:', text)
            
            const cleanText = text.replace(/[,\s]/g, '')
            const numbers = cleanText.replace(/[^0-9.]/g, '')
            const cleanedNumbers = numbers.replace(/(\..*)\./g, '$1')
            
            console.log('붙여넣기 처리 과정:', {
                원본: text,
                콤마제거: cleanText,
                숫자만: numbers,
                최종: cleanedNumbers
            })
            
            if (cleanedNumbers) {
                const numericValue = parseFloat(cleanedNumbers)
                if (!isNaN(numericValue)) {
                    this.currentOperand = numericValue.toString()
                    console.log('붙여넣기 완료:', this.currentOperand)
                    this.updateDisplay()
                }
            }
        })

        // 입력 이벤트 리스너 수정
        this.currentOperandTextElement.addEventListener('input', (e) => {
            if (e.inputType === 'insertFromPaste') {
                const text = this.currentOperandTextElement.innerText
                // 콤마와 공백 제거
                const cleanText = text.replace(/[,\s]/g, '')
                // 숫자와 소수점만 추출
                const numbers = cleanText.replace(/[^0-9.]/g, '')
                // 소수점이 여러 개인 경우 첫 번째 소수점만 유지
                const cleanedNumbers = numbers.replace(/(\..*)\./g, '$1')
                
                if (cleanedNumbers) {
                    const numericValue = parseFloat(cleanedNumbers)
                    if (!isNaN(numericValue)) {
                        alert(`원본 값: ${text}\n변환된 값: ${numericValue.toLocaleString('en-US')}`)
                        this.currentOperand = numericValue.toString()
                        this.updateDisplay()
                    }
                }
            }
        })
    }

    clear() {
        console.log('C 버튼 실행 - 모든 값 초기화')
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    clearEntry() {
        console.log('CE 버튼 실행 - 현재 입력값만 초기화')
        this.currentOperand = ''
    }

    delete() {
        console.log('delete 실행:', this.currentOperand)
        // 현재 입력 중인 숫자가 있을 때만 동작
        if (this.currentOperand.toString().length > 0) {
            const oldLength = this.currentOperand.toString().length
            
            // 계산 완료 상태일 때는 현재 값만 초기화
            if (this.isComputationComplete) {
                this.currentOperand = ''
                this.isComputationComplete = false
            } else {
                // 현재 입력 중인 숫자의 마지막 자리만 삭제
                this.currentOperand = this.currentOperand.toString().slice(0, -1)
            }
            
            console.log(`delete 후: ${oldLength}자리 -> ${this.currentOperand.toString().length}자리, 값: ${this.currentOperand}`)
        }
    }

    appendNumber(number) {
        console.log('숫자 입력:', number)
        // 새로운 숫자 입력 시 계산 완료 상태 해제
        if (this.isComputationComplete) {
            this.currentOperand = ''
            this.isComputationComplete = false
        }
        if (number === '.' && this.currentOperand.includes('.')) {
            console.log('소수점 중복 방지')
            return
        }
        this.currentOperand = this.currentOperand.toString() + number
        console.log('현재 입력값:', this.currentOperand)
    }

    chooseOperation(operation) {
        console.log('연산자 선택:', operation)
        
        // C와 CE 버튼 처리
        if (operation === 'C') {
            this.clear()
            return
        }
        if (operation === 'CE') {
            this.clearEntry()
            return
        }

        // 고급 연산 처리
        if (['%', '√', 'x²', '1/x'].includes(operation)) {
            if (this.currentOperand === '') {
                console.log('현재 입력값이 없음')
                return
            }

            const current = parseFloat(this.currentOperand.toString().replace(/[,\s]/g, ''))
            let result

            switch (operation) {
                case '%':
                    // 퍼센트 계산 (현재 값 / 100)
                    result = current / 100
                    break
                case '√':
                    // 제곱근 계산
                    if (current < 0) {
                        alert('음수의 제곱근은 계산할 수 없습니다')
                        return
                    }
                    result = Math.sqrt(current)
                    break
                case 'x²':
                    // 제곱 계산
                    result = current * current
                    break
                case '1/x':
                    // 역수 계산
                    if (current === 0) {
                        alert('0으로 나눌 수 없습니다')
                        return
                    }
                    result = 1 / current
                    break
            }

            // 계산 과정을 이전 값으로 표시
            this.previousOperand = `${operation}(${this.getDisplayNumber(current)})`
            this.currentOperand = result.toString()
            this.operation = undefined
            return
        }
        
        if (this.currentOperand === '') {
            console.log('현재 입력값이 없음')
            return
        }
        if (this.previousOperand !== '') {
            console.log('이전 계산 실행')
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand.toString().replace(/[,\s]/g, '')
        console.log('연산 준비:', {
            현재값: this.currentOperand,
            이전값: this.previousOperand,
            연산자: this.operation
        })
        this.currentOperand = ''
    }

    compute() {
        console.log('계산 시작')
        let computation
        const prev = parseFloat(this.previousOperand.toString().replace(/[,\s]/g, ''))
        const current = parseFloat(this.currentOperand.toString().replace(/[,\s]/g, ''))
        
        console.log('계산 값:', {
            이전값: prev,
            현재값: current,
            연산자: this.operation
        })
        
        if (isNaN(prev) || isNaN(current)) {
            console.log('유효하지 않은 숫자')
            return
        }
        
        // 계산 과정을 이전 값으로 저장 (= 포함)
        const calculationProcess = `${this.getDisplayNumber(prev)} ${this.operation} ${this.getDisplayNumber(current)} =`
        
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '×':
                computation = prev * current
                break
            case '÷':
                if (current === 0) {
                    console.log('0으로 나누기 시도')
                    alert('0으로 나눌 수 없습니다')
                    return
                }
                computation = prev / current
                break
            default:
                console.log('알 수 없는 연산자')
                return
        }
        
        console.log('계산 결과:', computation)
        this.currentOperand = computation.toString()
        // 계산 과정을 이전 값으로 표시
        this.previousOperand = calculationProcess
        this.operation = undefined
        // 계산 완료 상태 설정
        this.isComputationComplete = true
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        
        let integerDisplay
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            // 천단위 구분자 추가
            integerDisplay = integerDigits.toLocaleString('en-US')
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    updateDisplay() {
        const displayValue = this.getDisplayNumber(this.currentOperand)
        console.log('화면 업데이트:', {
            현재값: displayValue,
            이전값: this.previousOperand,
            연산자: this.operation
        })
        
        if (displayValue.length > 12) {
            this.currentOperandTextElement.style.fontSize = '2rem'
        } else if (displayValue.length > 9) {
            this.currentOperandTextElement.style.fontSize = '2.5rem'
        } else {
            this.currentOperandTextElement.style.fontSize = '3rem'
        }
        
        this.currentOperandTextElement.innerText = displayValue
        // 이전 값 표시 방식 수정
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            // 계산 과정이나 이전 값이 있으면 표시
            this.previousOperandTextElement.innerText = this.previousOperand || ''
        }
    }

    // 메모리 관련 메서드 추가
    clearMemory() {
        console.log('MC 실행 - 메모리 초기화')
        this.memoryValue = 0
        this.hasMemory = false
        this.updateMemoryButtons()
    }

    recallMemory() {
        console.log('MR 실행 - 메모리 값 불러오기:', this.memoryValue)
        if (this.hasMemory) {
            // 계산 완료 상태 초기화
            this.isComputationComplete = false
            this.currentOperand = this.memoryValue.toString()
            this.updateDisplay()
        }
    }

    addToMemory() {
        console.log('M+ 실행')
        const current = parseFloat(this.currentOperand) || 0
        this.memoryValue += current
        this.hasMemory = true
        console.log('메모리 값 업데이트:', this.memoryValue)
        // M+ 클릭 후 화면 초기화
        this.currentOperand = ''
        this.updateDisplay()
        this.updateMemoryButtons()
    }

    subtractFromMemory() {
        console.log('M- 실행')
        const current = parseFloat(this.currentOperand) || 0
        this.memoryValue -= current
        this.hasMemory = true
        console.log('메모리 값 업데이트:', this.memoryValue)
        // M- 클릭 후 화면 초기화
        this.currentOperand = ''
        this.updateDisplay()
        this.updateMemoryButtons()
    }

    storeInMemory() {
        console.log('MS 실행')
        this.memoryValue = parseFloat(this.currentOperand) || 0
        this.hasMemory = true
        console.log('메모리에 저장된 값:', this.memoryValue)
        // MS 클릭 후 화면 초기화
        this.currentOperand = ''
        this.updateDisplay()
        this.updateMemoryButtons()
    }

    updateMemoryButtons() {
        // MC와 MR 버튼 활성화/비활성화
        const mcButton = document.querySelector('.memory:nth-child(1)')  // MC
        const mrButton = document.querySelector('.memory:nth-child(2)')  // MR
        
        console.log('메모리 버튼 상태 업데이트:', {
            hasMemory: this.hasMemory,
            mcButton: mcButton,
            mrButton: mrButton
        })
        
        if (mcButton) {
            mcButton.disabled = !this.hasMemory
            console.log('MC 버튼 상태:', mcButton.disabled ? '비활성화' : '활성화')
        }
        if (mrButton) {
            mrButton.disabled = !this.hasMemory
            console.log('MR 버튼 상태:', mrButton.disabled ? '비활성화' : '활성화')
        }
    }

    // 부호 변경 메서드 추가
    toggleSign() {
        console.log('부호 변경 실행:', this.currentOperand)
        if (this.currentOperand === '') return
        
        const current = parseFloat(this.currentOperand)
        if (current === 0) return // 0은 부호 변경하지 않음
        
        this.currentOperand = (-current).toString()
        console.log('부호 변경 후:', this.currentOperand)
    }
}

// Calculator 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드됨')
    const previousOperandElement = document.querySelector('.previous-operand')
    const currentOperandElement = document.querySelector('.current-operand')
    
    console.log('DOM 요소 선택:', {
        이전값_요소: previousOperandElement,
        현재값_요소: currentOperandElement
    })
    
    if (!previousOperandElement || !currentOperandElement) {
        console.error('계산기 디스플레이 요소를 찾을 수 없습니다!')
        return
    }

    const calculator = new Calculator(previousOperandElement, currentOperandElement)
    console.log('계산기 인스턴스 생성 완료')

    try {
        // 숫자 버튼 이벤트 리스너
        const numberButtons = document.querySelectorAll('.number')
        console.log('숫자 버튼 개수:', numberButtons.length)
        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('숫자 버튼 클릭:', button.innerText)
                calculator.appendNumber(button.innerText)
                calculator.updateDisplay()
            })
        })

        // 연산자 버튼 이벤트 리스너
        const operationButtons = document.querySelectorAll('.operation:not(.backspace):not([data-action="toggle-sign"])')
        console.log('연산자 버튼 개수:', operationButtons.length)
        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('연산자 버튼 클릭:', button.innerText)
                calculator.chooseOperation(button.innerText)
                calculator.updateDisplay()
            })
        })

        // 등호 버튼 이벤트 리스너
        const equalsButton = document.querySelector('.equals')
        if (equalsButton) {
            equalsButton.addEventListener('click', () => {
                console.log('= 버튼 클릭')
                calculator.compute()
                calculator.updateDisplay()
            })
        }

        // C 버튼 이벤트 리스너 수정
        const clearButton = document.querySelector('.operation')
        if (clearButton && clearButton.innerText === 'C') {
            clearButton.addEventListener('click', () => {
                console.log('C 버튼 클릭 - 모든 값 초기화')
                calculator.clear()
                calculator.updateDisplay()
            })
        }

        // 백스페이스 버튼 이벤트 리스너
        const deleteButton = document.querySelector('.operation.backspace')
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                console.log('백스페이스 버튼 클릭')
                calculator.delete()
                calculator.updateDisplay()
            })
        }

        // ± 버튼 이벤트 리스너 수정
        const toggleSignButton = document.querySelector('[data-action="toggle-sign"]')
        if (toggleSignButton) {
            toggleSignButton.addEventListener('click', () => {
                console.log('± 버튼 클릭')
                calculator.toggleSign()
                calculator.updateDisplay()
            })
        }

        // 메모리 버튼 이벤트 리스너
        const memoryButtons = document.querySelectorAll('.memory')
        console.log('메모리 버튼 개수:', memoryButtons.length)
        memoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                console.log('메모리 버튼 클릭:', button.innerText)
                switch (button.innerText) {
                    case 'MC':
                        calculator.clearMemory()
                        break
                    case 'MR':
                        calculator.recallMemory()
                        break
                    case 'M+':
                        calculator.addToMemory()
                        break
                    case 'M-':
                        calculator.subtractFromMemory()
                        break
                    case 'MS':
                        calculator.storeInMemory()
                        break
                }
            })
        })

        console.log('모든 이벤트 리스너 설정 완료')
    } catch (error) {
        console.error('이벤트 리스너 설정 중 오류 발생:', error)
    }
}) 