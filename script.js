// 獲取DOM元素
const gradientBackground = document.getElementById('gradient-background');
const scrollContent = document.getElementById('scroll-content');

// 初始化漸層顏色
let hue = 0;
let scrollPosition = 0;
let isScrolling = false;

// 更新漸層背景函數
function updateGradient(x, y) {
    // 計算滑鼠位置相對於視窗的百分比
    const xPercent = Math.round((x / window.innerWidth) * 100);
    const yPercent = Math.round((y / window.innerHeight) * 100);

    // 根據滑鼠位置調整漸層角度
    const angle = Math.round((xPercent / 100) * 360);

    // 根據滑鼠位置和滾動位置調整顏色
    const hue1 = (hue + angle) % 360;
    const hue2 = (hue1 + 60) % 360;
    const hue3 = (hue2 + 60) % 360;

    // 設定漸層背景
    gradientBackground.style.background = `
        radial-gradient(
            circle at ${xPercent}% ${yPercent}%, 
            hsl(${hue1}, 80%, 60%) 0%, 
            hsl(${hue2}, 80%, 50%) 50%, 
            hsl(${hue3}, 80%, 40%) 100%
        )
    `;
}

// 滑鼠移動事件監聽
document.addEventListener('mousemove', function(event) {
    updateGradient(event.clientX, event.clientY);
});

// 填充內容函數，用於無限滾動
function populateContent() {
    for (let i = 0; i < 10; i++) {
        const element = document.createElement('div');
        element.className = 'scroll-item';
        element.innerHTML = `
            <h2>內容區塊 ${Math.floor(Math.random() * 1000)}</h2>
            <p>這是一個動態生成的內容區塊，滾動到底部時會自動生成更多內容。</p>
        `;
        element.style.padding = '20px';
        element.style.margin = '20px 0';
        element.style.background = `rgba(255, 255, 255, 0.1)`;
        element.style.borderRadius = '10px';
        scrollContent.appendChild(element);
    }
}

// 檢查滾動位置並加載更多內容
function checkScroll() {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // 當滾動到接近底部時
    if (scrollTop + clientHeight >= scrollHeight - 200) {
        // 增加更多內容
        populateContent();

        // 更新漸層顏色
        hue = (hue + 20) % 360;
    }

    // 更新滾動位置
    scrollPosition = scrollTop;
}

// 滾動事件監聽
window.addEventListener('scroll', function() {
    if (!isScrolling) {
        isScrolling = true;
        setTimeout(function() {
            checkScroll();
            isScrolling = false;
        }, 100);
    }
});

// 初始化頁面
function init() {
    // 設定初始漸層背景
    updateGradient(window.innerWidth / 2, window.innerHeight / 2);

    // 填充初始內容
    populateContent();
}

// 頁面載入完成後初始化
window.addEventListener('load', init);
