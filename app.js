// 구면삼각법 3D 시각화 앱
// 다국어 텍스트 정의
const translations = {
    ko: {
        title: "구면삼각법",
        pointALabel: "점 A 위치 (경도)",
        pointBLabel: "점 B 위치 (경도)",
        pointCLabel: "점 C 위치 (경도)",
        latitudeLabel: "위도",
        longitude: "경도",
        latitude: "위도",
        sphericalCoords: "구면좌표",
        resetButton: "삼각형 초기화",
        rotationToggle: "회전 토글",
        coordinateToggle: "좌표계 토글",
        cartesianCoords: "직교좌표 (단위구면)",
        pointPositions: "점의 위치",
        sphericalTrigFormula: "구면삼각법 공식",
        cosineLaw: "코사인 법칙:",
        cosineFormula: "cos c = cos a cos b + sin a sin b cos C",
        side: "변",
        angle: "각",
        solarSystem: "태양계",
        sphericalTrig: "구면삼각법",
        planetInfo: "행성 정보",
        distanceFromSun: "태양으로부터의 거리",
        orbitalPeriod: "공전주기",
        diameter: "지름",
        planetSpeed: "행성 속도",
        showOrbits: "궤도 표시",
        resetView: "뷰 초기화"
    },
    en: {
        title: "Spherical Trigonometry",
        pointALabel: "Point A Position (Longitude)",
        pointBLabel: "Point B Position (Longitude)",
        pointCLabel: "Point C Position (Longitude)",
        latitudeLabel: "Latitude",
        longitude: "Longitude",
        latitude: "Latitude",
        sphericalCoords: "Spherical Coords",
        resetButton: "Reset Triangle",
        rotationToggle: "Toggle Rotation",
        coordinateToggle: "Toggle Coordinates",
        cartesianCoords: "Cartesian Coordinates (Unit Sphere)",
        pointPositions: "Point Positions",
        sphericalTrigFormula: "Spherical Trigonometry Formula",
        cosineLaw: "Cosine Law:",
        cosineFormula: "cos c = cos a cos b + sin a sin b cos C",
        side: "Side",
        angle: "Angle",
        solarSystem: "Solar System",
        sphericalTrig: "Spherical Trigonometry",
        planetInfo: "Planet Information",
        distanceFromSun: "Distance from Sun",
        orbitalPeriod: "Orbital Period",
        diameter: "Diameter",
        planetSpeed: "Planet Speed",
        showOrbits: "Show Orbits",
        resetView: "Reset View"
    }
};

let currentLanguage = 'ko';
let currentMode = 'spherical'; // 'spherical' or 'solar'

// 태양계 데이터 (실제 비율을 조정하여 시각화에 적합하게)
const solarSystemData = {
    sun: { 
        name: { ko: "태양", en: "Sun" },
        radius: 0.2, 
        color: 0xffff00,
        distance: 0
    },
    mercury: { 
        name: { ko: "수성", en: "Mercury" },
        radius: 0.04, 
        color: 0x8c6239,
        distance: 2,
        period: 2,
        info: { 
            ko: { distance: "5790만 km", period: "88일", diameter: "4879 km" },
            en: { distance: "57.9M km", period: "88 days", diameter: "4879 km" }
        }
    },
    venus: { 
        name: { ko: "금성", en: "Venus" },
        radius: 0.06, 
        color: 0xffc649,
        distance: 3,
        period: 3,
        info: { 
            ko: { distance: "1억 820만 km", period: "225일", diameter: "12104 km" },
            en: { distance: "108.2M km", period: "225 days", diameter: "12104 km" }
        }
    },
    earth: { 
        name: { ko: "지구", en: "Earth" },
        radius: 0.06, 
        color: 0x6b93d6,
        distance: 4,
        period: 4,
        info: { 
            ko: { distance: "1억 4960만 km", period: "365일", diameter: "12756 km" },
            en: { distance: "149.6M km", period: "365 days", diameter: "12756 km" }
        }
    },
    mars: { 
        name: { ko: "화성", en: "Mars" },
        radius: 0.05, 
        color: 0xc1440e,
        distance: 5.5,
        period: 6,
        info: { 
            ko: { distance: "2억 2790만 km", period: "687일", diameter: "6792 km" },
            en: { distance: "227.9M km", period: "687 days", diameter: "6792 km" }
        }
    },
    jupiter: { 
        name: { ko: "목성", en: "Jupiter" },
        radius: 0.15, 
        color: 0xd8ca9d,
        distance: 8,
        period: 12,
        info: { 
            ko: { distance: "7억 7850만 km", period: "12년", diameter: "142984 km" },
            en: { distance: "778.5M km", period: "12 years", diameter: "142984 km" }
        }
    },
    saturn: { 
        name: { ko: "토성", en: "Saturn" },
        radius: 0.13, 
        color: 0xfad5a5,
        distance: 12,
        period: 20,
        info: { 
            ko: { distance: "14억 2940만 km", period: "29년", diameter: "120536 km" },
            en: { distance: "1429.4M km", period: "29 years", diameter: "120536 km" }
        }
    }
};

class SphericalTriangleApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.sphere = null;
        this.triangle = null;
        this.points = [];
        this.arcs = [];
        this.coordinateAxes = null;
        this.isRotating = true;
        this.showCoordinates = true;
        
        // 태양계 관련 변수들
        this.solarSystem = {
            planets: [],
            orbits: [],
            sun: null,
            showOrbits: true,
            planetSpeed: 1
        };
        
        this.init();
        this.setupUI();
        this.animate();
    }
    
    init() {
        // 씬 생성
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);
        
        // 카메라 설정
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 5);
        
        // 렌더러 설정
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // 궤도 컨트롤
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // 조명 설정
        this.setupLighting();
        
        // 구 생성
        this.createSphere();
        
        // 좌표계 표시
        this.createCoordinateSystem();
        
        // 3D 좌표축 표시
        this.createCoordinateAxes();
        
        // UI 생성
        this.createUI();
        
        // 초기 삼각형 생성 (UI 생성 후에)
        if (currentMode === 'spherical') {
            this.updateTriangle();
        }
        
        // 윈도우 리사이즈 핸들러
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    setupLighting() {
        // 환경광
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        
        // 방향광
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // 포인트 라이트
        const pointLight = new THREE.PointLight(0x88ccff, 0.5);
        pointLight.position.set(-5, -5, 5);
        this.scene.add(pointLight);
    }
    
    createSphere() {
        // 구 지오메트리
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        
        // 투명한 재질
        const material = new THREE.MeshPhongMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        
        // 와이어프레임 구
        const wireframe = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ 
            color: 0x88ccff, 
            transparent: true, 
            opacity: 0.5 
        });
        this.sphereWireframe = new THREE.LineSegments(wireframe, wireframeMaterial);
        this.scene.add(this.sphereWireframe);
    }
    
    createCoordinateSystem() {
        this.sphereCoordinates = []; // 좌표계 요소들을 저장할 배열
        
        // 적도 표시
        const equatorGeometry = new THREE.RingGeometry(1.99, 2.01, 64);
        const equatorMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x00ff00, 
            transparent: true, 
            opacity: 0.7 
        });
        const equator = new THREE.Mesh(equatorGeometry, equatorMaterial);
        equator.rotation.x = Math.PI / 2;
        this.scene.add(equator);
        this.sphereCoordinates.push(equator);
        
        // 자오선들
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const meridianGeometry = new THREE.BufferGeometry();
            const meridianPoints = [];
            
            for (let j = 0; j <= 32; j++) {
                const phi = (j / 32) * Math.PI;
                const x = 2 * Math.sin(phi) * Math.cos(angle);
                const y = 2 * Math.cos(phi);
                const z = 2 * Math.sin(phi) * Math.sin(angle);
                meridianPoints.push(new THREE.Vector3(x, y, z));
            }
            
            meridianGeometry.setFromPoints(meridianPoints);
            const meridianMaterial = new THREE.LineBasicMaterial({ 
                color: 0x444444, 
                transparent: true, 
                opacity: 0.3 
            });
            const meridian = new THREE.Line(meridianGeometry, meridianMaterial);
            this.scene.add(meridian);
            this.sphereCoordinates.push(meridian);
        }
    }
    
    createCoordinateAxes() {
        this.coordinateAxes = new THREE.Group();
        
        // X축 (빨간색)
        const xGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 0, 0)
        ]);
        const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
        const xAxis = new THREE.Line(xGeometry, xMaterial);
        this.coordinateAxes.add(xAxis);
        
        // Y축 (초록색)
        const yGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 3, 0)
        ]);
        const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
        const yAxis = new THREE.Line(yGeometry, yMaterial);
        this.coordinateAxes.add(yAxis);
        
        // Z축 (파란색)
        const zGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 3)
        ]);
        const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
        const zAxis = new THREE.Line(zGeometry, zMaterial);
        this.coordinateAxes.add(zAxis);
        
        // 축 라벨 생성
        this.createAxisLabels();
        
        this.scene.add(this.coordinateAxes);
    }
    
    createAxisLabels() {
        // X, Y, Z 라벨 생성
        const labels = [
            { text: 'X', position: new THREE.Vector3(3.2, 0, 0), color: 0xff0000 },
            { text: 'Y', position: new THREE.Vector3(0, 3.2, 0), color: 0x00ff00 },
            { text: 'Z', position: new THREE.Vector3(0, 0, 3.2), color: 0x0000ff }
        ];
        
        labels.forEach(label => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 64;
            canvas.height = 64;
            context.fillStyle = `#${label.color.toString(16).padStart(6, '0')}`;
            context.font = 'bold 32px Arial';
            context.textAlign = 'center';
            context.fillText(label.text, 32, 40);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.copy(label.position);
            sprite.scale.set(0.3, 0.3, 1);
            this.coordinateAxes.add(sprite);
        });
    }
    
    sphericalToCartesian(longitude, latitude, radius = 1) {
        const lonRad = longitude * Math.PI / 180;
        const latRad = latitude * Math.PI / 180;
        
        const x = radius * Math.cos(latRad) * Math.cos(lonRad);
        const z = radius * Math.cos(latRad) * Math.sin(lonRad);
        const y = radius * Math.sin(latRad);
        
        return new THREE.Vector3(x, y, z);
    }
    
    createGreatCircleArc(point1, point2, segments = 64) {
        const points = [];
        
        // 두 점을 정규화
        const p1 = point1.clone().normalize();
        const p2 = point2.clone().normalize();
        
        // 두 점 사이의 각도 계산
        const angle = p1.angleTo(p2);
        
        // 회전축 계산
        const axis = new THREE.Vector3().crossVectors(p1, p2).normalize();
        
        // 대원 호 생성
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const currentAngle = angle * t;
            
            const rotatedPoint = p1.clone();
            rotatedPoint.applyAxisAngle(axis, currentAngle);
            rotatedPoint.multiplyScalar(2); // 구의 반지름
            
            points.push(rotatedPoint);
        }
        
        return points;
    }
    
    updateTriangle() {
        // 현재 모드가 구면삼각법이 아니면 실행하지 않음
        if (currentMode !== 'spherical') return;
        
        // 기존 삼각형 요소들 제거
        this.clearTriangle();
        
        // UI에서 값 가져오기 - 요소가 없으면 기본값 사용
        const pointAElement = document.getElementById('pointA');
        const pointBElement = document.getElementById('pointB');
        const pointCElement = document.getElementById('pointC');
        const latitudeElement = document.getElementById('latitude');
        
        if (!pointAElement || !pointBElement || !pointCElement || !latitudeElement) {
            // 요소가 없으면 기본값으로 삼각형 생성
            const lonA = 30;
            const lonB = 120;
            const lonC = 240;
            const lat = 45;
            this.createTriangleWithValues(lonA, lonB, lonC, lat);
            return;
        }
        
        const lonA = parseFloat(pointAElement.value);
        const lonB = parseFloat(pointBElement.value);
        const lonC = parseFloat(pointCElement.value);
        const lat = parseFloat(latitudeElement.value);
        
        this.createTriangleWithValues(lonA, lonB, lonC, lat);
    }
    
    createTriangleWithValues(lonA, lonB, lonC, lat) {
        // 구면 좌표를 직교 좌표로 변환 (단위구면용)
        const pointA = this.sphericalToCartesian(lonA, lat);
        const pointB = this.sphericalToCartesian(lonB, lat);
        const pointC = this.sphericalToCartesian(lonC, lat);
        
        // 렌더링용으로 크기 조정 (반지름 2)
        const pointA_render = pointA.clone().multiplyScalar(2);
        const pointB_render = pointB.clone().multiplyScalar(2);
        const pointC_render = pointC.clone().multiplyScalar(2);
        
        // 점들 생성 (렌더링용 좌표 사용)
        this.createPoint(pointA_render, 0xff0000, 'A');
        this.createPoint(pointB_render, 0x00ff00, 'B');
        this.createPoint(pointC_render, 0x0000ff, 'C');
        
        // 대원 호들 생성 (렌더링용 좌표 사용)
        this.createArc(pointA_render, pointB_render, 0xffff00);
        this.createArc(pointB_render, pointC_render, 0xff00ff);
        this.createArc(pointC_render, pointA_render, 0x00ffff);
        
        // 직교좌표 표시 (단위구면 좌표 사용)
        this.displayCartesianCoordinates(pointA, pointB, pointC, lonA, lonB, lonC, lat);
        
        // 측정값 계산 및 표시 (단위구면 좌표 사용)
        this.calculateAndDisplayMeasurements(pointA, pointB, pointC);
    }
    
    createPoint(position, color, label) {
        // 점 생성
        const geometry = new THREE.SphereGeometry(0.08, 16, 16);
        const material = new THREE.MeshPhongMaterial({ color: color });
        const point = new THREE.Mesh(geometry, material);
        point.position.copy(position);
        this.scene.add(point);
        this.points.push(point);
        
        // 라벨 생성
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 64;
        canvas.height = 64;
        context.fillStyle = 'white';
        context.font = '32px Arial';
        context.textAlign = 'center';
        context.fillText(label, 32, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.copy(position);
        sprite.position.multiplyScalar(1.2);
        sprite.scale.set(0.3, 0.3, 1);
        this.scene.add(sprite);
        this.points.push(sprite);
    }
    
    createArc(point1, point2, color) {
        const arcPoints = this.createGreatCircleArc(point1, point2);
        const geometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const material = new THREE.LineBasicMaterial({ 
            color: color, 
            linewidth: 3 
        });
        const arc = new THREE.Line(geometry, material);
        this.scene.add(arc);
        this.arcs.push(arc);
    }
    
    clearTriangle() {
        // 점들 제거
        this.points.forEach(point => {
            this.scene.remove(point);
        });
        this.points = [];
        
        // 호들 제거
        this.arcs.forEach(arc => {
            this.scene.remove(arc);
        });
        this.arcs = [];
    }
    
    displayCartesianCoordinates(pointA, pointB, pointC, lonA, lonB, lonC, lat) {
        // 요소가 존재하는지 확인하고 업데이트
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        // 점 A의 직교좌표 표시
        updateElement('coord-ax', pointA.x.toFixed(3));
        updateElement('coord-ay', pointA.y.toFixed(3));
        updateElement('coord-az', pointA.z.toFixed(3));
        
        // 점 B의 직교좌표 표시
        updateElement('coord-bx', pointB.x.toFixed(3));
        updateElement('coord-by', pointB.y.toFixed(3));
        updateElement('coord-bz', pointB.z.toFixed(3));
        
        // 점 C의 직교좌표 표시
        updateElement('coord-cx', pointC.x.toFixed(3));
        updateElement('coord-cy', pointC.y.toFixed(3));
        updateElement('coord-cz', pointC.z.toFixed(3));
        
        // 구면좌표 표시 업데이트
        updateElement('pointA-lon', lonA + '°');
        updateElement('pointA-lat', lat + '°');
        updateElement('pointB-lon', lonB + '°');
        updateElement('pointB-lat', lat + '°');
        updateElement('pointC-lon', lonC + '°');
        updateElement('pointC-lat', lat + '°');
    }
    
    calculateAndDisplayMeasurements(pointA, pointB, pointC) {
        // 단위 벡터로 정규화
        const a = pointA.clone().normalize();
        const b = pointB.clone().normalize();
        const c = pointC.clone().normalize();
        
        // 변의 길이 (중심각, 라디안)
        const sideA = b.angleTo(c); // BC
        const sideB = a.angleTo(c); // AC
        const sideC = a.angleTo(b); // AB
        
        // 구면삼각법 공식을 사용한 각도 계산
        const angleA = this.calculateSphericalAngle(sideB, sideC, sideA);
        const angleB = this.calculateSphericalAngle(sideA, sideC, sideB);
        const angleC = this.calculateSphericalAngle(sideA, sideB, sideC);
        
        // 요소가 존재하는지 확인하고 업데이트
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        // 도 단위로 변환하여 표시
        updateElement('side-a', (sideA * 180 / Math.PI).toFixed(1) + '°');
        updateElement('side-b', (sideB * 180 / Math.PI).toFixed(1) + '°');
        updateElement('side-c', (sideC * 180 / Math.PI).toFixed(1) + '°');
        updateElement('angle-A', (angleA * 180 / Math.PI).toFixed(1) + '°');
        updateElement('angle-B', (angleB * 180 / Math.PI).toFixed(1) + '°');
        updateElement('angle-C', (angleC * 180 / Math.PI).toFixed(1) + '°');
    }
    
    calculateSphericalAngle(a, b, c) {
        // 구면삼각법 코사인 법칙을 사용한 각도 계산
        const cosAngle = (Math.cos(c) - Math.cos(a) * Math.cos(b)) / (Math.sin(a) * Math.sin(b));
        return Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    }
    
    setupUI() {
        if (currentMode === 'spherical') {
            this.setupSphericalUI();
        } else {
            this.setupSolarUI();
        }
    }
    
    setupSphericalUI() {
        // 슬라이더 이벤트 리스너
        ['pointA', 'pointB', 'pointC'].forEach(id => {
            const slider = document.getElementById(id);
            const valueDisplay = document.getElementById(id + '-value');
            const lonDisplay = document.getElementById(id + '-lon');
            
            if (slider) {
                slider.addEventListener('input', (e) => {
                    valueDisplay.textContent = e.target.value + '°';
                    lonDisplay.textContent = e.target.value + '°';
                    this.updateTriangle();
                });
            }
        });
        
        // 위도 슬라이더
        const latSlider = document.getElementById('latitude');
        const latValueDisplay = document.getElementById('latitude-value');
        
        if (latSlider) {
            latSlider.addEventListener('input', (e) => {
                latValueDisplay.textContent = e.target.value + '°';
                // 모든 점의 위도 표시 업데이트
                ['pointA-lat', 'pointB-lat', 'pointC-lat'].forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.textContent = e.target.value + '°';
                    }
                });
                this.updateTriangle();
            });
        }
    }
    
    setupSolarUI() {
        // 행성 속도 슬라이더
        const speedSlider = document.getElementById('planetSpeed');
        const speedValue = document.getElementById('speed-value');
        
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.solarSystem.planetSpeed = parseFloat(e.target.value);
                speedValue.textContent = e.target.value + 'x';
            });
        }
        
        // 궤도 표시 체크박스
        const orbitCheckbox = document.getElementById('showOrbits');
        if (orbitCheckbox) {
            orbitCheckbox.addEventListener('change', (e) => {
                this.solarSystem.showOrbits = e.target.checked;
                this.solarSystem.orbits.forEach(orbit => {
                    orbit.visible = this.solarSystem.showOrbits;
                });
            });
        }
        
        // 라벨 표시 체크박스
        const labelCheckbox = document.getElementById('showLabels');
        if (labelCheckbox) {
            labelCheckbox.addEventListener('change', (e) => {
                const showLabels = e.target.checked;
                this.solarSystem.planets.forEach(object => {
                    if (object instanceof THREE.Sprite) {
                        object.visible = showLabels;
                    }
                });
            });
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (currentMode === 'solar') {
            this.updateSolarSystem();
        }
        
        // 자동 회전
        if (this.isRotating && currentMode === 'spherical') {
            this.sphere.rotation.y += 0.005;
            this.points.forEach(point => {
                if (point.rotation) {
                    point.rotation.y += 0.005;
                }
            });
            this.arcs.forEach(arc => {
                arc.rotation.y += 0.005;
            });
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    createUI() {
        this.updateUIText();
    }
    
    updateUIText() {
        const t = translations[currentLanguage];
        
        if (currentMode === 'spherical') {
            this.createSphericalUI(t);
        } else {
            this.createSolarUI(t);
        }
        
        // 이벤트 리스너 재설정
        this.setupUI();
    }
    
    createSphericalUI(t) {
        // UI 패널 생성
        document.getElementById('ui').innerHTML = `
            <h1>${t.title}</h1>
            
            <div class="control-group">
                <label for="pointA">${t.pointALabel}</label>
                <input type="range" id="pointA" min="0" max="360" value="30" step="1">
                <div class="value-display">
                    ${t.longitude}: <span id="pointA-value">30°</span><br>
                    <small>${t.sphericalCoords}: (λ=<span id="pointA-lon">30°</span>, φ=<span id="pointA-lat">45°</span>)</small>
                </div>
            </div>
            
            <div class="control-group">
                <label for="pointB">${t.pointBLabel}</label>
                <input type="range" id="pointB" min="0" max="360" value="120" step="1">
                <div class="value-display">
                    ${t.longitude}: <span id="pointB-value">120°</span><br>
                    <small>${t.sphericalCoords}: (λ=<span id="pointB-lon">120°</span>, φ=<span id="pointB-lat">45°</span>)</small>
                </div>
            </div>
            
            <div class="control-group">
                <label for="pointC">${t.pointCLabel}</label>
                <input type="range" id="pointC" min="0" max="360" value="240" step="1">
                <div class="value-display">
                    ${t.longitude}: <span id="pointC-value">240°</span><br>
                    <small>${t.sphericalCoords}: (λ=<span id="pointC-lon">240°</span>, φ=<span id="pointC-lat">45°</span>)</small>
                </div>
            </div>
            
            <div class="control-group">
                <label for="latitude">${t.latitudeLabel}</label>
                <input type="range" id="latitude" min="10" max="80" value="45" step="1">
                <div class="value-display">${t.latitude}: <span id="latitude-value">45°</span></div>
            </div>
            
            <button onclick="resetTriangle()">${t.resetButton}</button>
            <button onclick="toggleRotation()">${t.rotationToggle}</button>
            <button onclick="toggleCoordinateSystem()">${t.coordinateToggle}</button>
        `;
        
        // 정보 패널 생성
        document.getElementById('info').innerHTML = `
            <h3>${t.cartesianCoords}</h3>
            <div class="coordinates">
                <div class="coord-header">${t.pointPositions}</div>
                <div class="coord-point point-a">
                    A: (<span id="coord-ax">0.000</span>, <span id="coord-ay">0.000</span>, <span id="coord-az">0.000</span>)
                </div>
                <div class="coord-point point-b">
                    B: (<span id="coord-bx">0.000</span>, <span id="coord-by">0.000</span>, <span id="coord-bz">0.000</span>)
                </div>
                <div class="coord-point point-c">
                    C: (<span id="coord-cx">0.000</span>, <span id="coord-cy">0.000</span>, <span id="coord-cz">0.000</span>)
                </div>
            </div>
            
            <h3>${t.sphericalTrigFormula}</h3>
            <div class="formula">
                ${t.cosineLaw}<br>
                ${t.cosineFormula}
            </div>
            <div id="measurements">
                <div>${t.side} a: <span id="side-a">-</span></div>
                <div>${t.side} b: <span id="side-b">-</span></div>
                <div>${t.side} c: <span id="side-c">-</span></div>
                <div>${t.angle} A: <span id="angle-A">-</span></div>
                <div>${t.angle} B: <span id="angle-B">-</span></div>
                <div>${t.angle} C: <span id="angle-C">-</span></div>
            </div>
        `;
    }
    
    createSolarUI(t) {
        // 태양계 UI 패널 생성
        document.getElementById('ui').innerHTML = `
            <h1>${t.solarSystem}</h1>
            
            <div class="control-group">
                <label for="planetSpeed">${t.planetSpeed}</label>
                <input type="range" id="planetSpeed" min="0.1" max="5" value="1" step="0.1">
                <div class="value-display">속도: <span id="speed-value">1.0x</span></div>
            </div>
            
            <div class="control-group">
                <input type="checkbox" id="showOrbits" checked>
                <label for="showOrbits">${t.showOrbits}</label>
            </div>
            
            <div class="control-group">
                <input type="checkbox" id="showLabels" checked>
                <label for="showLabels">라벨 표시</label>
            </div>
            
            <button onclick="resetSolarView()">${t.resetView}</button>
            <button onclick="toggleRotation()">${t.rotationToggle}</button>
        `;
        
        // 태양계 정보 패널 생성
        document.getElementById('info').innerHTML = `
            <h3>${t.planetInfo}</h3>
            <div id="planet-details">
                <div class="coord-header">태양계 개요</div>
                <div class="coord-point">
                    <strong>태양:</strong> 중심별<br>
                    <strong>행성:</strong> 6개 (수성~토성)<br>
                    <strong>스케일:</strong> 시각화용으로 조정됨
                </div>
                <div style="margin-top: 10px; font-size: 12px; color: #aaa;">
                    💡 행성을 클릭하면 상세 정보를 볼 수 있습니다
                </div>
            </div>
        `;
    }
    
    createSolarSystem() {
        this.clearSolarSystem();
        
        // 태양 생성 (중심에 위치)
        const sunGeometry = new THREE.SphereGeometry(solarSystemData.sun.radius, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ 
            color: solarSystemData.sun.color,
            emissive: solarSystemData.sun.color,
            emissiveIntensity: 0.3
        });
        this.solarSystem.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.solarSystem.sun.position.set(0, 0, 0); // 태양을 정확히 중심에
        this.scene.add(this.solarSystem.sun);
        
        // 태양 라벨 생성 (더 크고 명확하게)
        const sunCanvas = document.createElement('canvas');
        const sunContext = sunCanvas.getContext('2d');
        sunCanvas.width = 256;
        sunCanvas.height = 80;
        
        // 배경 그리기 (반투명 오렌지)
        sunContext.fillStyle = 'rgba(255, 140, 0, 0.8)';
        sunContext.fillRect(0, 0, sunCanvas.width, sunCanvas.height);
        
        // 테두리 그리기
        sunContext.strokeStyle = 'yellow';
        sunContext.lineWidth = 3;
        sunContext.strokeRect(3, 3, sunCanvas.width - 6, sunCanvas.height - 6);
        
        // 텍스트 그리기
        sunContext.fillStyle = 'white';
        sunContext.font = 'bold 24px Arial';
        sunContext.textAlign = 'center';
        sunContext.textBaseline = 'middle';
        sunContext.fillText(solarSystemData.sun.name[currentLanguage], sunCanvas.width / 2, sunCanvas.height / 2);
        
        const sunTexture = new THREE.CanvasTexture(sunCanvas);
        const sunSpriteMaterial = new THREE.SpriteMaterial({ 
            map: sunTexture,
            transparent: true,
            alphaTest: 0.1
        });
        const sunSprite = new THREE.Sprite(sunSpriteMaterial);
        sunSprite.position.set(0, solarSystemData.sun.radius + 0.8, 0);
        sunSprite.scale.set(2, 0.8, 1);
        this.scene.add(sunSprite);
        this.solarSystem.planets.push(sunSprite);
        
        // 행성들과 궤도 생성
        Object.keys(solarSystemData).forEach(planetKey => {
            if (planetKey === 'sun') return;
            
            const planetData = solarSystemData[planetKey];
            
            // 행성 생성
            const planetGeometry = new THREE.SphereGeometry(planetData.radius, 16, 16);
            const planetMaterial = new THREE.MeshPhongMaterial({ color: planetData.color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            
            // 초기 위치 설정 (태양을 중심으로 하는 궤도)
            const initialAngle = Math.random() * Math.PI * 2;
            planet.position.set(
                Math.cos(initialAngle) * planetData.distance, 
                0, 
                Math.sin(initialAngle) * planetData.distance
            );
            planet.userData = {
                distance: planetData.distance,
                period: planetData.period,
                angle: initialAngle,
                name: planetData.name,
                info: planetData.info
            };
            
            this.scene.add(planet);
            this.solarSystem.planets.push(planet);
            
            // 행성 라벨 생성 (더 크고 명확하게)
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 80;
            
            // 배경 그리기 (반투명 검은색)
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            // 테두리 그리기
            context.strokeStyle = 'white';
            context.lineWidth = 2;
            context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
            
            // 텍스트 그리기
            context.fillStyle = 'white';
            context.font = 'bold 20px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(planetData.name[currentLanguage], canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true,
                alphaTest: 0.1
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.copy(planet.position);
            sprite.position.y += planetData.radius + 0.5; // 행성 위에 더 높게 라벨 배치
            sprite.scale.set(1.5, 0.6, 1); // 더 크게 설정
            sprite.userData = { 
                isPlanetLabel: true, 
                planetName: planetKey,
                offset: planetData.radius + 0.5
            };
            
            // 라벨도 planet userData에 저장하여 함께 움직이도록
            planet.userData.label = sprite;
            this.scene.add(sprite);
            this.solarSystem.planets.push(sprite); // 라벨도 planets 배열에 추가
            this.solarSystem.planets.push(sprite);
            
            // 궤도 생성
            const orbitGeometry = new THREE.RingGeometry(
                planetData.distance - 0.01, 
                planetData.distance + 0.01, 
                64
            );
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x444444, 
                transparent: true, 
                opacity: 0.3,
                side: THREE.DoubleSide
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            
            this.scene.add(orbit);
            this.solarSystem.orbits.push(orbit);
        });
    }
    
    clearSolarSystem() {
        // 기존 태양계 요소들 제거
        if (this.solarSystem.sun) {
            this.scene.remove(this.solarSystem.sun);
            this.solarSystem.sun = null;
        }
        
        this.solarSystem.planets.forEach(planet => {
            this.scene.remove(planet);
        });
        this.solarSystem.planets = [];
        
        this.solarSystem.orbits.forEach(orbit => {
            this.scene.remove(orbit);
        });
        this.solarSystem.orbits = [];
    }
    
    updateSolarSystem() {
        // 행성들의 공전 애니메이션
        this.solarSystem.planets.forEach(object => {
            // 라벨(스프라이트)은 건너뛰기
            if (object instanceof THREE.Sprite) return;
            
            // 행성이 아닌 객체는 건너뛰기
            if (!object.userData || !object.userData.distance) return;
            
            const userData = object.userData;
            userData.angle += (0.01 * this.solarSystem.planetSpeed) / userData.period;
            
            object.position.x = Math.cos(userData.angle) * userData.distance;
            object.position.z = Math.sin(userData.angle) * userData.distance;
            
            // 해당 행성의 라벨도 함께 업데이트
            if (userData.label) {
                userData.label.position.x = object.position.x;
                userData.label.position.z = object.position.z;
                userData.label.position.y = object.position.y + userData.label.userData.offset;
            }
        });
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// 전역 함수들
let app;

function changeLanguage() {
    const select = document.getElementById('languageSelect');
    currentLanguage = select.value;
    
    // 모드 탭 텍스트 업데이트
    updateModeTabText();
    
    if (app) {
        app.updateUIText();
        // 삼각형 업데이트하여 좌표값들도 새로고침
        if (currentMode === 'spherical') {
            app.updateTriangle();
        } else if (currentMode === 'solar') {
            // 태양계 모드에서는 라벨 언어만 업데이트
            app.createSolarSystem();
        }
    }
}

function updateModeTabText() {
    const tabs = document.querySelectorAll('.mode-tab');
    const t = translations[currentLanguage];
    
    if (tabs.length >= 2) {
        tabs[0].textContent = t.sphericalTrig;
        tabs[1].textContent = t.solarSystem;
    }
}

function switchMode(mode) {
    currentMode = mode;
    
    // 탭 활성화 상태 업데이트
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (mode === 'spherical') {
        document.querySelectorAll('.mode-tab')[0].classList.add('active');
        // 구면삼각법 요소 표시, 태양계 숨김
        app.clearSolarSystem();
        app.sphere.visible = true;
        if (app.sphereWireframe) app.sphereWireframe.visible = true;
        if (app.sphereCoordinates) {
            app.sphereCoordinates.forEach(coord => coord.visible = true);
        }
        if (app.coordinateAxes) app.coordinateAxes.visible = app.showCoordinates;
        app.updateTriangle();
        app.camera.position.set(0, 0, 5);
    } else {
        document.querySelectorAll('.mode-tab')[1].classList.add('active');
        // 태양계 요소 표시, 구면삼각법 숨김
        app.clearTriangle();
        app.sphere.visible = false;
        if (app.sphereWireframe) app.sphereWireframe.visible = false;
        if (app.sphereCoordinates) {
            app.sphereCoordinates.forEach(coord => coord.visible = false);
        }
        if (app.coordinateAxes) app.coordinateAxes.visible = false;
        app.createSolarSystem();
        app.camera.position.set(0, 8, 20); // 태양계를 더 잘 보이도록 조정
        app.controls.target.set(0, 0, 0); // 카메라가 태양 중심을 바라보도록
    }
    
    app.updateUIText();
}

function resetSolarView() {
    if (app) {
        app.camera.position.set(0, 8, 20);
        app.controls.target.set(0, 0, 0);
    }
}

function resetTriangle() {
    document.getElementById('pointA').value = 30;
    document.getElementById('pointB').value = 120;
    document.getElementById('pointC').value = 240;
    document.getElementById('latitude').value = 45;
    
    document.getElementById('pointA-value').textContent = '30°';
    document.getElementById('pointB-value').textContent = '120°';
    document.getElementById('pointC-value').textContent = '240°';
    document.getElementById('latitude-value').textContent = '45°';
    
    // 구면좌표 표시도 업데이트
    document.getElementById('pointA-lon').textContent = '30°';
    document.getElementById('pointA-lat').textContent = '45°';
    document.getElementById('pointB-lon').textContent = '120°';
    document.getElementById('pointB-lat').textContent = '45°';
    document.getElementById('pointC-lon').textContent = '240°';
    document.getElementById('pointC-lat').textContent = '45°';
    
    app.updateTriangle();
}

function toggleRotation() {
    app.isRotating = !app.isRotating;
}

function toggleCoordinateSystem() {
    app.showCoordinates = !app.showCoordinates;
    if (app.coordinateAxes) {
        app.coordinateAxes.visible = app.showCoordinates;
    }
}

// 앱 시작
window.addEventListener('load', () => {
    app = new SphericalTriangleApp();
    // 초기 모드 탭 텍스트 설정
    updateModeTabText();
    // 초기 좌표 표시 설정
    if (currentMode === 'spherical') {
        resetTriangle();
    }
});