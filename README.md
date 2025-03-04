# Chrome Extension Calculator

크롬 확장 프로그램으로 제작된 계산기입니다. Windows 계산기와 유사한 디자인과 기능을 제공합니다.

## 주요 기능

- 기본 사칙연산 (덧셈, 뺄셈, 곱셈, 나눗셈)
- 고급 연산 기능
  - 제곱 (x²)
  - 제곱근 (√)
  - 역수 (1/x)
  - 퍼센트 (%)
  - 부호 변경 (±)
- 메모리 기능
  - MC (Memory Clear): 메모리 값 초기화
  - MR (Memory Recall): 메모리에 저장된 값 불러오기
  - M+ (Memory Add): 현재 값을 메모리에 더하기
  - M- (Memory Subtract): 현재 값을 메모리에서 빼기
  - MS (Memory Store): 현재 값을 메모리에 저장

## 설치 방법

1. 이 저장소를 클론하거나 다운로드합니다.
```bash
git clone https://github.com/kimseunghyun76/chrome_extension_calculator.git
```

2. Chrome 브라우저에서 `chrome://extensions`로 이동합니다.
3. 우측 상단의 "개발자 모드"를 활성화합니다.
4. "압축해제된 확장 프로그램을 로드합니다" 버튼을 클릭합니다.
5. 다운로드 받은 폴더를 선택합니다.

## 사용 방법

1. Chrome 브라우저 우측 상단의 확장 프로그램 아이콘을 클릭합니다.
2. 계산기 아이콘을 클릭하면 팝업 창이 열립니다.
3. 마우스 클릭이나 키보드로 계산기를 사용할 수 있습니다.

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- Chrome Extension API

## 개발자

- Dennis Kim (김승현)

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 크레딧

- 아이콘: [Icons8](https://icons8.com) 

예시 동작:
1) 일반 입력:
   123 입력 → ± 클릭 → -123 표시
   -123 상태에서 → ± 클릭 → 123 표시

2) 계산 중 사용:
   5 입력 → + 클릭 → 3 입력 → ± 클릭 → -3 표시
   = 클릭 → 5 + (-3) = 2 계산됨

3) 계산 결과에 사용:
   5 + 3 = 8 계산 후
   ± 클릭 → -8 표시 