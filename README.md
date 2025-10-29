# 구면삼각법 & 태양계 3D 시각화 앱 / Spherical Trigonometry & Solar System 3D Visualization App

이 앱은 구면삼각법(Spherical Trigonometry)과 태양계를 3D로 시각화하여 이해를 돕는 인터랙티브 웹 애플리케이션입니다.

This is an interactive web application that helps understand Spherical Trigonometry and Solar System through 3D visualization.

## 기능 / Features

### 🌐 3D 구면 시각화 / 3D Spherical Visualization
- 투명한 구면과 좌표계 표시 / Transparent sphere with coordinate system display
- 자오선과 적도선 표시 / Meridian and equator lines display
- 실시간 회전 및 인터랙티브 조작 / Real-time rotation and interactive controls

### 📐 구면삼각형 생성 / Spherical Triangle Creation
- 세 점의 위치를 슬라이더로 조정 가능 / Adjustable three points position via sliders
- 점들은 대원(Great Circle) 호로 연결 / Points connected by Great Circle arcs
- 실시간으로 삼각형 모양 변경 / Real-time triangle shape modification

### 🪐 태양계 시각화 / Solar System Visualization
- 태양과 행성들의 3D 시각화 / 3D visualization of Sun and planets
- 실제 비율을 조정한 궤도 애니메이션 / Orbit animation with adjusted real proportions
- 행성 속도 조절 및 궤도 표시 토글 / Planet speed control and orbit display toggle

### 📊 구면삼각법 계산 / Spherical Trigonometry Calculations
- 변의 길이 (중심각) 계산 / Side length (central angle) calculations
- 내각 계산 / Interior angle calculations
- 구면삼각법 공식 적용 / Application of spherical trigonometry formulas

### 🌏 다국어 지원 / Multi-language Support
- 한국어/영어 언어 전환 / Korean/English language switching
- 실시간 UI 번역 / Real-time UI translation

## 구면삼각법이란? / What is Spherical Trigonometry?

구면삼각법은 구면 위에 그려진 삼각형의 변과 각도 사이의 관계를 다루는 수학 분야입니다.

Spherical trigonometry is a branch of mathematics that deals with the relationships between the sides and angles of triangles drawn on a sphere.

### 주요 개념 / Key Concepts

1. **대원 (Great Circle)**: 구의 중심을 지나는 평면이 구면과 만나는 원
   **Great Circle**: A circle formed by the intersection of a sphere and a plane passing through the center of the sphere

2. **구면삼각형 (Spherical Triangle)**: 세 개의 대원 호로 이루어진 삼각형
   **Spherical Triangle**: A triangle formed by three great circle arcs

3. **중심각 (Central Angle)**: 구의 중심에서 보는 각도
   **Central Angle**: The angle viewed from the center of the sphere

### 구면삼각법의 코사인 법칙 / Spherical Law of Cosines

```
cos c = cos a cos b + sin a sin b cos C
```

여기서 / Where:
- a, b, c는 삼각형의 변 (중심각) / a, b, c are the sides of the triangle (central angles)
- A, B, C는 삼각형의 내각 / A, B, C are the interior angles of the triangle

## 사용법 / How to Use

### 모드 선택 / Mode Selection
- **구면삼각법 모드 / Spherical Trigonometry Mode**: 단위구면상의 삼각형 시각화
- **태양계 모드 / Solar System Mode**: 태양계 시각화 및 행성 궤도 애니메이션

### 구면삼각법 모드 컨트롤 / Spherical Trigonometry Mode Controls
- **점 A, B, C 위치 / Point A, B, C Position**: 각 점의 경도를 0°~360° 범위에서 조정 / Adjust longitude of each point from 0° to 360°
- **위도 / Latitude**: 모든 점의 위도를 10°~80° 범위에서 조정 / Adjust latitude of all points from 10° to 80°
- **삼각형 초기화 / Reset Triangle**: 기본 설정으로 돌아가기 / Return to default settings
- **회전 토글 / Toggle Rotation**: 자동 회전 켜기/끄기 / Turn automatic rotation on/off
- **좌표계 토글 / Toggle Coordinates**: 3D 좌표축 표시/숨김 / Show/hide 3D coordinate axes

### 태양계 모드 컨트롤 / Solar System Mode Controls
- **행성 속도 / Planet Speed**: 행성 공전 속도 조절 (0.1x ~ 5.0x) / Control planet orbital speed (0.1x ~ 5.0x)
- **궤도 표시 / Show Orbits**: 행성 궤도 표시/숨김 / Show/hide planet orbits
- **뷰 초기화 / Reset View**: 카메라 위치 초기화 / Reset camera position

### 마우스 조작 / Mouse Controls
- **좌클릭 + 드래그 / Left Click + Drag**: 구면 회전 / Rotate view
- **휠 / Wheel**: 줌 인/아웃 / Zoom in/out
- **우클릭 + 드래그 / Right Click + Drag**: 패닝 / Pan view

## 실습 예제 / Practice Examples

### 1. 정삼각형 만들기 / Creating an Equilateral Triangle
1. 점 A: 0°, 점 B: 120°, 점 C: 240°로 설정 / Set Point A: 0°, Point B: 120°, Point C: 240°
2. 위도를 45°로 설정 / Set latitude to 45°
3. 각 변의 길이와 내각이 모두 같아지는 것을 확인 / Verify that all side lengths and interior angles are equal

### 2. 극지방 삼각형 / Polar Triangle
1. 위도를 80°로 높게 설정 / Set latitude high to 80°
2. 경도 차이를 크게 하여 변화 관찰 / Observe changes with large longitude differences
3. 일반 삼각형과의 차이점 비교 / Compare differences with regular triangles

### 3. 적도 근처 삼각형 / Equatorial Triangle
1. 위도를 10°로 낮게 설정 / Set latitude low to 10°
2. 평면삼각법과의 유사성 확인 / Check similarity with plane trigonometry

### 4. 태양계 탐험 / Solar System Exploration
1. 태양계 모드로 전환 / Switch to Solar System mode
2. 행성 속도를 조절하여 궤도 관찰 / Adjust planet speed to observe orbits
3. 궤도 표시를 토글하여 경로 확인 / Toggle orbit display to see paths

## 천문학에서의 응용 / Applications in Astronomy

구면삼각법은 천문학에서 매우 중요합니다:

Spherical trigonometry is very important in astronomy:

- **천체 위치 계산 / Celestial Position Calculation**: 별의 좌표 변환 / Coordinate transformation of stars
- **항해술 / Navigation**: 위도와 경도 계산 / Latitude and longitude calculations
- **시간 계산 / Time Calculation**: 일출/일몰 시간 계산 / Sunrise/sunset time calculations
- **위성 궤도 / Satellite Orbits**: 궤도 계산 및 추적 / Orbit calculation and tracking

## 기술 스택 / Technology Stack

- **Three.js**: 3D 그래픽 렌더링 / 3D graphics rendering
- **HTML/CSS**: 사용자 인터페이스 / User interface
- **JavaScript**: 계산 및 인터랙션 / Calculations and interactions

## 파일 구조 / File Structure

```
astronomy-app/
├── index.html      # 메인 HTML 파일 / Main HTML file
├── app.js          # 메인 JavaScript 코드 / Main JavaScript code
└── README.md       # 이 파일 / This file
```

## 실행 방법 / How to Run

1. 웹 브라우저에서 `index.html` 파일을 열어주세요 / Open the `index.html` file in a web browser
2. 모든 기능이 즉시 사용 가능합니다 / All features are immediately available
3. 인터넷 연결이 필요합니다 (Three.js CDN 사용) / Internet connection required (uses Three.js CDN)

## 학습 목표 / Learning Objectives

이 앱을 통해 다음을 학습할 수 있습니다:

Through this app, you can learn:

1. 구면과 평면의 기하학적 차이점 / Geometric differences between spheres and planes
2. 구면삼각법의 기본 공식과 개념 / Basic formulas and concepts of spherical trigonometry
3. 3D 공간에서의 시각화 능력 / Visualization skills in 3D space
4. 천문학과 항해술의 기초 원리 / Basic principles of astronomy and navigation
5. 태양계의 구조와 행성 운동 / Structure of the solar system and planetary motion
6. 직교좌표와 구면좌표의 관계 / Relationship between Cartesian and spherical coordinates

## 추가 기능 아이디어 / Additional Feature Ideas

- 구면삼각형의 넓이 계산 / Spherical triangle area calculation
- 다양한 투영법 비교 / Comparison of various projection methods
- 애니메이션을 통한 공식 유도 과정 / Formula derivation process through animation
- 실제 천체 데이터를 활용한 예제 / Examples using real celestial data
- 행성 클릭 시 상세 정보 표시 / Detailed information display when clicking planets
- 케플러 법칙 시연 / Demonstration of Kepler's laws