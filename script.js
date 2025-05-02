document.addEventListener('DOMContentLoaded', () => {
    // 主要元素
    const mouseFollower = document.querySelector('.mouse-follower');
    const gradientContainer = document.getElementById('gradient-container');
    const circles = document.querySelectorAll('.gradient-circle:not(.mouse-follower)');
    const body = document.body;
    const blurSlider = document.getElementById('blur-slider');
    const toggleAnimationBtn = document.getElementById('toggle-animation');
    const changeThemeBtn = document.getElementById('change-theme');
    const particlesContainer = document.querySelector('.particles');

    // 主題配色方案
    const themes = [
        // 默認主題 - 鮮豔色彩
        {
            background: '#050510',
            colors: [
                'rgba(255, 0, 128, 0.8)',
                'rgba(0, 128, 255, 0.8)',
                'rgba(255, 215, 0, 0.8)',
                'rgba(0, 255, 128, 0.8)',
                'rgba(128, 0, 255, 0.8)'
            ]
        },
        // 海洋主題
        {
            background: '#041530',
            colors: [
                'rgba(0, 119, 182, 0.8)',
                'rgba(0, 180, 216, 0.8)',
                'rgba(72, 202, 228, 0.8)',
                'rgba(144, 224, 239, 0.8)',
                'rgba(173, 232, 244, 0.8)'
            ]
        },
        // 日落主題
        {
            background: '#1a0d00',
            colors: [
                'rgba(255, 111, 0, 0.8)',
                'rgba(255, 149, 0, 0.8)',
                'rgba(255, 195, 0, 0.8)',
                'rgba(232, 93, 4, 0.8)',
                'rgba(255, 63, 0, 0.8)'
            ]
        },
        // 北極光主題
        {
            background: '#0a0a18',
            colors: [
                'rgba(0, 204, 150, 0.8)',
                'rgba(0, 153, 168, 0.8)',
                'rgba(0, 92, 151, 0.8)',
                'rgba(142, 45, 226, 0.8)',
                'rgba(74, 0, 224, 0.8)'
            ]
        }
    ];

    // 狀態變數
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let colorIndex = 0;
    let lastColorChange = Date.now();
    let currentTheme = 0;
    let isAnimationPaused = false;
    let lastClick = Date.now();
    let particles = [];

    // 初始化
    function init() {
        createParticles();
        applyTheme(currentTheme);
        setupEventListeners();
        animateMouseFollower();
        animateParticles();
    }

    // 創建背景粒子
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // 隨機大小、位置和透明度
            const size = Math.random() * 3 + 1;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const opacity = Math.random() * 0.5 + 0.1;

            // 設定粒子樣式
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.opacity = opacity;

            // 儲存粒子數據
            particles.push({
                element: particle,
                x,
                y,
                speedX: Math.random() * 0.2 - 0.1,
                speedY: Math.random() * 0.2 - 0.1
            });

            particlesContainer.appendChild(particle);
        }
    }

    // 動畫粒子
    function animateParticles() {
        particles.forEach(particle => {
            // 更新位置
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // 邊界檢查
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;

            // 更新DOM元素位置
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
        });

        requestAnimationFrame(animateParticles);
    }

    // 設置事件監聽器
    function setupEventListeners() {
        // 滑鼠移動事件
        document.addEventListener('mousemove', handleMouseMove);

        // 點擊事件 - 創建漣漪效果
        document.addEventListener('click', createRippleEffect);

        // 調整模糊度
        blurSlider.addEventListener('input', () => {
            const blurValue = blurSlider.value;
            document.querySelectorAll('.gradient-circle').forEach(circle => {
                circle.style.filter = `blur(${blurValue}px)`;
            });
        });

        // 切換動畫暫停/播放
        toggleAnimationBtn.addEventListener('click', () => {
            isAnimationPaused = !isAnimationPaused;
            if (isAnimationPaused) {
                gradientContainer.classList.add('paused');
                toggleAnimationBtn.textContent = 'Resume Animation';
            } else {
                gradientContainer.classList.remove('paused');
                toggleAnimationBtn.textContent = 'Pause Animation';
            }
        });

        // 切換主題
        changeThemeBtn.addEventListener('click', () => {
            currentTheme = (currentTheme + 1) % themes.length;
            applyTheme(currentTheme);
        });

        // 空格鍵切換全屏
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                toggleFullscreen();
                e.preventDefault();
            }
        });

        // 窗口大小改變
        window.addEventListener('resize', handleResize);
    }

    // 處理滑鼠移動
    function handleMouseMove(e) {
        // 更新目標位置
        targetX = e.clientX;
        targetY = e.clientY;

        // 根據滑鼠位置調整其他圓形
        updateCirclesBasedOnMouse(e.clientX, e.clientY);

        // 定期變換顏色
        if (Date.now() - lastColorChange > 3000) { // 每3秒變換一次顏色
            colorIndex = (colorIndex + 1) % themes[currentTheme].colors.length;
            updateFollowerColor();
            lastColorChange = Date.now();
        }
    }

    // 創建漣漪效果
    function createRippleEffect(e) {
        // 限制點擊頻率
        if (Date.now() - lastClick < 300) return;
        lastClick = Date.now();

        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;

        document.body.appendChild(ripple);

        // 動畫結束後移除元素
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    // 切換全屏
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // 處理窗口大小改變
    function handleResize() {
        // 更新粒子容器大小
        particles.forEach(particle => {
            if (particle.x > window.innerWidth) particle.x = window.innerWidth;
            if (particle.y > window.innerHeight) particle.y = window.innerHeight;
        });
    }

    // 平滑跟隨滑鼠的動畫
    function animateMouseFollower() {
        // 平滑過渡到目標位置
        mouseX += (targetX - mouseX) * 0.08;
        mouseY += (targetY - mouseY) * 0.08;

        // 更新跟隨滑鼠的漸層圓形位置
        mouseFollower.style.left = `${mouseX}px`;
        mouseFollower.style.top = `${mouseY}px`;

        // 添加輕微的呼吸效果
        const breatheScale = 1 + 0.03 * Math.sin(Date.now() / 1000);
        mouseFollower.style.transform = `translate(-50%, -50%) scale(${breatheScale})`;

        // 繼續動畫
        requestAnimationFrame(animateMouseFollower);
    }

    // 根據滑鼠位置調整其他圓形
    function updateCirclesBasedOnMouse(x, y) {
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        // 計算滑鼠在容器中的相對位置 (0-1)
        const relativeX = x / containerWidth;
        const relativeY = y / containerHeight;

        // 對每個圓形進行微調
        circles.forEach((circle, index) => {
            if (isAnimationPaused) return;

            // 根據滑鼠位置調整旋轉角度和移動
            const rotationDegree = (relativeX * 60 - 30) + (relativeY * 60 - 30);
            const translateX = (relativeX - 0.5) * 70 * (index + 1);
            const translateY = (relativeY - 0.5) * 70 * (index + 1);

            // 獲取當前transform
            const currentTransform = window.getComputedStyle(circle).transform;
            const matrix = new DOMMatrix(currentTransform);

            // 提取當前旋轉和縮放
            let currentRotation = 0;
            let currentScale = 1;

            if (matrix.a !== 1 || matrix.b !== 0) {
                currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
                currentScale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
            }

            // 合併當前動畫和滑鼠互動效果
            circle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${currentRotation + rotationDegree * 0.1}deg) scale(${currentScale})`;
        });
    }

    // 更新跟隨滑鼠的漸層圓形顏色
    function updateFollowerColor() {
        const color = themes[currentTheme].colors[colorIndex];
        const transparentColor = color.replace(/[\d.]+\)$/, '0)');
        mouseFollower.style.background = `radial-gradient(circle, ${color}, ${transparentColor})`;
    }

    // 應用主題
    function applyTheme(themeIndex) {
        const theme = themes[themeIndex];

        // 設置背景色
        body.style.backgroundColor = theme.background;

        // 更新圓形顏色
        circles.forEach((circle, index) => {
            const color = theme.colors[index % theme.colors.length];
            const transparentColor = color.replace(/[\d.]+\)$/, '0)');
            circle.style.background = `radial-gradient(circle, ${color}, ${transparentColor})`;
        });

        // 更新跟隨滑鼠的圓形顏色
        colorIndex = 0;
        updateFollowerColor();
    }

    // 初始化應用
    init();
});
