document.addEventListener('DOMContentLoaded', () => {
    const mouseFollower = document.querySelector('.mouse-follower');
    const gradientContainer = document.getElementById('gradient-container');
    const circles = document.querySelectorAll('.gradient-circle:not(.mouse-follower)');

    // 顏色陣列，用於動態變換顏色
    const colors = [
        'rgba(255, 0, 128, 0.8)',
        'rgba(0, 128, 255, 0.8)',
        'rgba(255, 215, 0, 0.8)',
        'rgba(128, 0, 255, 0.8)',
        'rgba(0, 255, 128, 0.8)',
        'rgba(255, 0, 0, 0.8)',
        'rgba(0, 255, 255, 0.8)'
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

    // 監聽滑鼠移動事件
    document.addEventListener('mousemove', (e) => {
        // 更新目標位置
        targetX = e.clientX;
        targetY = e.clientY;

        // 根據滑鼠位置調整其他圓形的位置和旋轉
        updateCirclesBasedOnMouse(e.clientX, e.clientY);

        // 定期變換顏色
        if (Date.now() - lastColorChange > 2000) { // 每2秒變換一次顏色
            colorIndex = (colorIndex + 1) % colors.length;
            updateFollowerColor();
            lastColorChange = Date.now();
        }
    });

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
            const translateX = (relativeX - 0.5) * 50 * (index + 1);
            const translateY = (relativeY - 0.5) * 50 * (index + 1);

            // 應用變換
            circle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotationDegree}deg)`;
        });
    }

    // 更新跟隨滑鼠的漸層圓形顏色
    function updateFollowerColor() {
        const color = colors[colorIndex];
        const transparentColor = color.replace(/[\d.]+\)$/, '0)');
        mouseFollower.style.background = `radial-gradient(circle, ${color}, ${transparentColor})`;
    }

    // 初始化跟隨滑鼠的漸層圓形顏色
    updateFollowerColor();

    // 開始動畫
    animateMouseFollower();
});
