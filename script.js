document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // 獲取視窗的寬度和高度
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // 監聽滑鼠移動事件
    document.addEventListener('mousemove', (event) => {
        // 獲取滑鼠的 X 和 Y 座標
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // 將滑鼠座標標準化到 0 到 1 的範圍
        const normalizedX = mouseX / windowWidth;
        const normalizedY = mouseY / windowHeight;

        // --- 顏色計算 ---
        // 使用 HSL 顏色模型進行平滑變換
        // H (色相): 根據 X 座標在 0 到 360 度之間變化
        const hue1 = normalizedX * 360;
        // S (飽和度): 可以固定，或根據 Y 座標微調 (例如 70% 到 100%)
        const saturation1 = 70 + normalizedY * 30;
        // L (亮度): 可以固定，或根據 Y 座標微調 (例如 50% 到 70%)
        const lightness1 = 50 + normalizedY * 15;

        // 計算第二個顏色，可以與第一個顏色有一定偏移
        const hue2 = (hue1 + 100) % 360; // 色相偏移 100 度
        const saturation2 = 80; // 固定飽和度
        const lightness2 = 60; // 固定亮度

        // --- 漸層角度計算 (可選) ---
        // 讓漸層角度也隨著滑鼠 X 座標變化
        const gradientAngle = 180 * normalizedX; // 角度從 0 變化到 180 度

        // --- 構造背景樣式字串 ---
        // 使用計算出的顏色和角度來定義線性漸層
        const backgroundStyle = `linear-gradient(${gradientAngle}deg, hsl(${hue1}, ${saturation1}%, ${lightness1}%), hsl(${hue2}, ${saturation2}%, ${lightness2}%))`;

        // --- 更新背景樣式 ---
        // 直接更新 body 的 background 樣式
        // CSS 中的 transition 會處理平滑的視覺變化
        body.style.background = backgroundStyle;
    });

    // 監聽視窗大小變化事件，更新視窗尺寸
    window.addEventListener('resize', () => {
        windowWidth = window.innerWidth;
        windowHeight = window.innerHeight;
    });
});
