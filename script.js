document.addEventListener('DOMContentLoaded', () => {
    // 獲取DOM元素
    const mouseFollower = document.querySelector('.mouse-follower');
    const gradientContainer = document.getElementById('gradient-container');
    const circles = document.querySelectorAll('.gradient-circle:not(.mouse-follower)');
    const particlesContainer = document.querySelector('.particles-container');
    const mouseXDisplay = document.getElementById('mouseX');
    const mouseYDisplay = document.getElementById('mouseY');
    const changeModeBtn = document.getElementById('changeMode');
    const addEffectBtn = document.getElementById('addEffect');
    const resetEffectsBtn = document.getElementById('resetEffects');
    const floatingElements = document.querySelectorAll('.floating-element');

    // 顏色陣列，用於動態變換顏色
    const colors = [
        'rgba(255, 0, 128, 0.8)',
        'rgba(0, 128, 255, 0.8)',
        'rgba(255, 215, 0, 0.8)',
        'rgba(128, 0, 255, 0.8)',
        'rgba(0, 255, 128, 0.8)',
        'rgba(255, 0, 0, 0.8)',
        'rgba(0, 255, 255, 0.8)',
        'rgba(255, 165, 0, 0.8)',
        'rgba(138, 43, 226, 0.8)',
        'rgba(0, 191, 255, 0.8)'
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

    // 互動模式
    let currentMode = 0;
    const modes = ['normal', 'reactive', 'pulse', 'rainbow'];

    // 特效設置
    let settings = {
        particlesEnabled: false,
        pulseEffect: false,
        colorShiftSpeed: 2000,
        mouseFollowerSize: 400,
        blurAmount: 80,
        particleCount: 0,
        maxParticles: 100
    };

    // 初始化頁面
    initPage();

    // 監聽滑鼠移動事件
    document.addEventListener('mousemove', (e) => {
        // 更新目標位置
        targetX = e.clientX;
        targetY = e.clientY;

        // 更新座標顯示
        mouseXDisplay.textContent = Math.round(e.clientX);
        mouseYDisplay.textContent = Math.round(e.clientY);

        // 根據滑鼠位置調整其他圓形的位置和旋轉
        updateCirclesBasedOnMouse(e.clientX, e.clientY);

        // 根據當前模式執行不同的效果
        handleModeEffects(e);

        // 定期變換顏色
        if (Date.now() - lastColorChange > settings.colorShiftSpeed) {
            colorIndex = (colorIndex + 1) % colors.length;
            updateFollowerColor();
            lastColorChange = Date.now();
        }

        // 如果啟用了粒子效果，則創建粒子
        if (settings.particlesEnabled && Math.random() > 0.7) {
            createParticle(e.clientX, e.clientY);
        }
    });

    // 監聽點擊事件
    document.addEventListener('click', (e) => {
        // 點擊時創建爆發效果
        createExplosion(e.clientX, e.clientY);

        // 點擊時讓浮動元素朝點擊位置移動
        animateFloatingElementsToPoint(e.clientX, e.clientY);
    });

    // 監聽滾輪事件來調整跟隨圓的大小
    document.addEventListener('wheel', (e) => {
        if (e.deltaY < 0) {
            // 向上滾動，增加大小
            settings.mouseFollowerSize = Math.min(settings.mouseFollowerSize + 20, 600);
        } else {
            // 向下滾動，減小大小
            settings.mouseFollowerSize = Math.max(settings.mouseFollowerSize - 20, 200);
        }

        mouseFollower.style.width = `${settings.mouseFollowerSize}px`;
        mouseFollower.style.height = `${settings.mouseFollowerSize}px`;
    });

    // 切換模式按鈕
    changeModeBtn.addEventListener('click', () => {
        currentMode = (currentMode + 1) % modes.length;
        showNotification(`模式已切換為: ${modes[currentMode]}`);

        // 根據模式調整設置
        switch(modes[currentMode]) {
            case 'reactive':
                settings.colorShiftSpeed = 1000;
                settings.mouseFollowerSize = 300;
                break;
            case 'pulse':
                settings.pulseEffect = true;
                settings.colorShiftSpeed = 3000;
                startPulseEffect();
                break;
            case 'rainbow':
                settings.colorShiftSpeed = 500;
                settings.mouseFollowerSize = 450;
                break;
            default:
                settings.colorShiftSpeed = 2000;
                settings.mouseFollowerSize = 400;
                settings.pulseEffect = false;
                break;
        }

        // 更新跟隨圓大小
        mouseFollower.style.width = `${settings.mouseFollowerSize}px`;
        mouseFollower.style.height = `${settings.mouseFollowerSize}px`;
    });

    // 添加效果按鈕
    addEffectBtn.addEventListener('click', () => {
        if (!settings.particlesEnabled) {
            settings.particlesEnabled = true;
            showNotification("粒子效果已啟用");
        } else if (settings.blurAmount < 120) {
            settings.blurAmount += 20;
            updateBlurEffect();
            showNotification(`模糊效果增強: ${settings.blurAmount}px`);
        } else {
            // 隨機改變所有圓形的顏色
            randomizeAllColors();
            showNotification("顏色已隨機化");
        }
    });

    // 重置效果按鈕
    resetEffectsBtn.addEventListener('click', () => {
        settings = {
            particlesEnabled: false,
            pulseEffect: false,
            colorShiftSpeed: 2000,
            mouseFollowerSize: 400,
            blurAmount: 80,
            particleCount: 0,
            maxParticles: 100
        };

        currentMode = 0;
        updateBlurEffect();
        clearParticles();
        resetCircleColors();

        mouseFollower.style.width = `${settings.mouseFollowerSize}px`;
        mouseFollower.style.height = `${settings.mouseFollowerSize}px`;

        showNotification("所有效果已重置");
    });

    // 初始化頁面
    function initPage() {
        // 設置初始跟隨圓大小
        mouseFollower.style.width = `${settings.mouseFollowerSize}px`;
        mouseFollower.style.height = `${settings.mouseFollowerSize}px`;

        // 初始化跟隨滑鼠的漸層圓形顏色
        updateFollowerColor();

        // 開始動畫
        animateMouseFollower();

        // 初始化模糊效果
        updateBlurEffect();
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
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

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

            // 根據當前模式調整效果
            let scale = 1;
            if (modes[currentMode] === 'reactive') {
                // 在reactive模式下，圓形會根據與滑鼠的距離縮放
                const circleRect = circle.getBoundingClientRect();
                const circleX = circleRect.left + circleRect.width / 2;
                const circleY = circleRect.top + circleRect.height / 2;
                const distance = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2));
                const maxDistance = Math.sqrt(Math.pow(containerWidth, 2) + Math.pow(containerHeight, 2)) / 2;
                scale = 1 + (1 - Math.min(distance / maxDistance, 1)) * 0.3;
            }

            // 應用變換
            circle.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotationDegree}deg) scale(${scale})`;
        });
    }

    // 根據當前模式執行不同的效果
    function handleModeEffects(e) {
        switch(modes[currentMode]) {
            case 'reactive':
                // 在reactive模式下，滑鼠跟隨圓會根據移動速度變化大小
                const speed = Math.sqrt(Math.pow(e.movementX, 2) + Math.pow(e.movementY, 2));
                const dynamicSize = settings.mouseFollowerSize - speed * 2;
                mouseFollower.style.width = `${Math.max(dynamicSize, 200)}px`;
                mouseFollower.style.height = `${Math.max(dynamicSize, 200)}px`;
                break;

            case 'rainbow':
                // 在rainbow模式下，快速變換顏色
                if (Math.random() > 0.5) {
                    colorIndex = Math.floor(Math.random() * colors.length);
                    updateFollowerColor();
                }
                break;
        }
    }

    // 更新跟隨滑鼠的漸層圓形顏色
    function updateFollowerColor() {
        const color = colors[colorIndex];
        const transparentColor = color.replace(/[\d.]+\)$/, '0)');
        mouseFollower.style.background = `radial-gradient(circle, ${color}, ${transparentColor})`;
    }

    // 創建粒子效果
    function createParticle(x, y) {
        if (settings.particleCount >= settings.maxParticles) return;

        const particle = document.createElement('div');
        particle.className = 'particle';

        // 隨機大小和顏色
        const size = Math.random() * 8 + 2;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = randomColor;

        // 隨機位置偏移
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;

        particle.style.left = `${x + offsetX}px`;
        particle.style.top = `${y + offsetY}px`;

        particlesContainer.appendChild(particle);
        settings.particleCount++;

        // 粒子動畫結束後移除
        setTimeout(() => {
            particlesContainer.removeChild(particle);
            settings.particleCount--;
        }, 3000);
    }

    // 創建爆發效果
    function createExplosion(x, y) {
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // 隨機大小
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // 隨機顏色
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = randomColor;

            // 初始位置
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;

            // 隨機方向和速度
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 100 + 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            particlesContainer.appendChild(particle);

            // 使用CSS動畫和JS動畫結合
            gsap.to(particle, {
                x: vx,
                y: vy,
                opacity: 0,
                scale: 0,
                duration: 1 + Math.random(),
                ease: "power2.out",
                onComplete: () => {
                    particlesContainer.removeChild(particle);
                }
            });
        }
    }

    // 清除所有粒子
    function clearParticles() {
        particlesContainer.innerHTML = '';
        settings.particleCount = 0;
    }

    // 更新模糊效果
    function updateBlurEffect() {
        circles.forEach(circle => {
            circle.style.filter = `blur(${settings.blurAmount}px)`;
        });
        mouseFollower.style.filter = `blur(${settings.blurAmount}px)`;
    }

    // 開始脈衝效果
    function startPulseEffect() {
        if (!settings.pulseEffect) return;

        // 使用GSAP創建脈衝動畫
        gsap.to(mouseFollower, {
            width: settings.mouseFollowerSize * 1.3,
            height: settings.mouseFollowerSize * 1.3,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    // 隨機化所有圓形的顏色
    function randomizeAllColors() {
        circles.forEach(circle => {
            const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
            const randomColor2 = randomColor1.replace(/[\d.]+\)$/, '0)');
            circle.style.background = `radial-gradient(circle, ${randomColor1}, ${randomColor2})`;
        });
    }

    // 重置圓形顏色
    function resetCircleColors() {
        const defaultColors = [
            'radial-gradient(circle, rgba(255, 0, 128, 0.8), rgba(255, 0, 128, 0))',
            'radial-gradient(circle, rgba(0, 128, 255, 0.8), rgba(0, 128, 255, 0))',
            'radial-gradient(circle, rgba(255, 215, 0, 0.8), rgba(255, 215, 0, 0))',
            'radial-gradient(circle, rgba(0, 255, 128, 0.8), rgba(0, 255, 128, 0))',
            'radial-gradient(circle, rgba(255, 0, 255, 0.8), rgba(255, 0, 255, 0))'
        ];

        circles.forEach((circle, index) => {
            if (index < defaultColors.length) {
                circle.style.background = defaultColors[index];
            }
        });
    }

    // 顯示通知
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '20px';
        notification.style.zIndex = '1000';
        notification.style.fontFamily = "'Poppins', sans-serif";

        document.body.appendChild(notification);

        // 淡出動畫
        gsap.to(notification, {
            opacity: 0,
            y: -20,
            duration: 1.5,
            delay: 1.5,
            onComplete: () => {
                document.body.removeChild(notification);
            }
        });
    }

    // 讓浮動元素朝向點擊位置移動
    function animateFloatingElementsToPoint(x, y) {
        floatingElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementX = rect.left + rect.width / 2;
            const elementY = rect.top + rect.height / 2;

            // 計算方向向量
            const dirX = x - elementX;
            const dirY = y - elementY;

            // 使用GSAP創建動畫
            gsap.to(element, {
                x: `+=${dirX * 0.1}`,
                y: `+=${dirY * 0.1}`,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    // 動畫完成後恢復原來的動畫
                    gsap.to(element, {
                        x: 0,
                        y: 0,
                        duration: 2,
                        ease: "elastic.out(1, 0.3)"
                    });
                }
            });
        });
    }

    // 模擬GSAP庫的簡單實現
    // 在實際項目中，您應該引入真正的GSAP庫
    const gsap = {
        to: (element, options) => {
            const {x, y, opacity, scale, duration, delay = 0, ease, repeat, yoyo, onComplete} = options;

            setTimeout(() => {
                if (x !== undefined) element.style.transform = `translateX(${x}px)`;
                if (y !== undefined) element.style.transform = `translateY(${y}px)`;
                if (x !== undefined && y !== undefined) element.style.transform = `translate(${x}px, ${y}px)`;
                if (scale !== undefined) element.style.transform += ` scale(${scale})`;
                if (opacity !== undefined) element.style.opacity = opacity;

                element.style.transition = `all ${duration}s ${ease || 'ease'}`;

                if (onComplete) {
                    setTimeout(onComplete, duration * 1000);
                }
            }, delay * 1000);
        }
    };
});
