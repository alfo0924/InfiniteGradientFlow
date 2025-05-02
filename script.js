document.addEventListener('DOMContentLoaded', () => {
    const mouseFollower = document.querySelector('.mouse-follower');
    const gradientContainer = document.getElementById('gradient-container');
    const circles = document.querySelectorAll('.gradient-circle:not(.mouse-follower)');

    // 豐富的顏色陣列，用於動態變換顏色
    const colors = [
        // 鮮豔色系
        'rgba(255, 61, 127, 0.8)',  // 亮粉紅
        'rgba(61, 178, 255, 0.8)',  // 亮藍
        'rgba(255, 190, 11, 0.8)',  // 金黃
        'rgba(0, 245, 212, 0.8)',   // 薄荷綠
        'rgba(251, 86, 7, 0.8)',    // 橙紅
        'rgba(161, 55, 255, 0.8)',  // 紫色
        'rgba(131, 56, 236, 0.8)',  // 紫羅蘭
        'rgba(255, 0, 110, 0.8)',   // 桃紅

        // 霓虹色系
        'rgba(255, 0, 153, 0.8)',   // 霓虹粉
        'rgba(0, 255, 204, 0.8)',   // 霓虹綠
        'rgba(255, 102, 0, 0.8)',   // 霓虹橙
        'rgba(0, 204, 255, 0.8)',   // 霓虹藍

        // 漸變組合（使用徑向漸變）
        'radial-gradient(circle, rgba(255, 61, 127, 0.8), rgba(161, 55, 255, 0.8))',
        'radial-gradient(circle, rgba(61, 178, 255, 0.8), rgba(0, 245, 212, 0.8))',
        'radial-gradient(circle, rgba(255, 190, 11, 0.8), rgba(251, 86, 7, 0.8))',
        'radial-gradient(circle, rgba(131, 56, 236, 0.8), rgba(255, 0, 110, 0.8))'
    ];

    // 目前滑鼠位置
    let mouseX = 0;
    let mouseY = 0;

    // 目標位置 (用於平滑過渡)
    let targetX = 0;
    let targetY = 0;

    // 跟隨滑鼠的漸層圓形顏色索引
    let colorIndex = 0;
    let lastColorChange = Date.now();

    // 初始化圓形顏色
    function initializeCircleColors() {
        // 為每個圓形設置不同的初始顏色
        circles.forEach((circle, index) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            if (randomColor.startsWith('radial-gradient')) {
                circle.style.background = randomColor;
            } else {
                const transparentColor = randomColor.replace(/[\d.]+\)$/, '0)');
                circle.style.background = `radial-gradient(circle, ${randomColor}, ${transparentColor})`;
            }
        });
    }

    // 監聽滑鼠移動事件
    document.addEventListener('mousemove', (e) => {
        // 更新目標位置
        targetX = e.clientX;
        targetY = e.clientY;

        // 根據滑鼠位置調整其他圓形的位置和旋轉
        updateCirclesBasedOnMouse(e.clientX, e.clientY);

        // 定期變換顏色
        if (Date.now() - lastColorChange > 1500) { // 每1.5秒變換一次顏色
            colorIndex = (colorIndex + 1) % colors.length;
            updateFollowerColor();

            // 隨機選擇一個圓形也更新顏色
            const randomCircleIndex = Math.floor(Math.random() * circles.length);
            updateRandomCircleColor(randomCircleIndex);

            lastColorChange = Date.now();
        }
    });

    // 更新隨機圓形的顏色
    function updateRandomCircleColor(index) {
        const circle = circles[index];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        if (randomColor.startsWith('radial-gradient')) {
            circle.style.background = randomColor;
        } else {
            const transparentColor = randomColor.replace(/[\d.]+\)$/, '0)');
            circle.style.background = `radial-gradient(circle, ${randomColor}, ${transparentColor})`;
        }
    }

    // 平滑跟隨滑鼠的動畫
    function animateMouseFollower() {
        // 平滑過渡到目標位置
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        // 更新跟隨滑鼠的漸層圓形位置
        mouseFollower.style.left = `${mouseX}px`;
        mouseFollower.style.top = `${mouseY}px`;

        // 繼續動畫
        requestAnimationFrame(animateMouseFollower);
    }

    // 根據滑鼠位置調整其他圓形
    function updateCirclesBasedOnMouse(x, y) {
        const containerWidth = gradientContainer.clientWidth;
        const containerHeight = gradientContainer.clientHeight;

        // 計算滑鼠在容器中的相對位置 (0-1)
        const relativeX = x / containerWidth;
        const relativeY = y / containerHeight;

        // 對每個圓形進行微調
        circles.forEach((circle, index) => {
            // 根據滑鼠位置調整旋轉角度
            const rotationDegree = (relativeX * 60 - 30) + (relativeY * 60 - 30);

            // 根據滑鼠位置輕微移動圓形
            const translateX = (relativeX - 0.5) * 70 * (index + 1);
            const translateY = (relativeY - 0.5) * 70 * (index + 1);

            // 根據滑鼠位置調整圓形大小
            const scaleValue = 1 + (Math.sin(Date.now() / 2000 + index) * 0.1);

            // 應用變換
            circle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotationDegree}deg) scale(${scaleValue})`;
        });
    }

    // 更新跟隨滑鼠的漸層圓形顏色
    function updateFollowerColor() {
        const color = colors[colorIndex];

        if (color.startsWith('radial-gradient')) {
            mouseFollower.style.background = color;
        } else {
            const transparentColor = color.replace(/[\d.]+\)$/, '0)');
            mouseFollower.style.background = `radial-gradient(circle, ${color}, ${transparentColor})`;
        }
    }

    // 創建背景色彩變化動畫
    function animateBackgroundColors() {
        circles.forEach((circle, index) => {
            // 每隔一段時間隨機更新一個圓形的顏色
            if (Math.random() < 0.01) { // 每幀有1%的機率更新顏色
                updateRandomCircleColor(index);
            }
        });

        requestAnimationFrame(animateBackgroundColors);
    }

    // 初始化圓形顏色
    initializeCircleColors();

    // 初始化跟隨滑鼠的漸層圓形顏色
    updateFollowerColor();

    // 開始動畫
    animateMouseFollower();
    animateBackgroundColors();
});
