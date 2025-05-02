<a href="https://alfo0924.github.io/InfiniteGradientFlow/">InfiniteGradient Flow</a>

# 互動式漸層背景網站解析

## 網站特點與特色

這個網站展示了一個現代化的互動式漸層背景設計，具有以下特點：

1. **動態漸層背景**：背景不是靜態的，而是會根據使用者滑鼠位置實時變化的漸層色彩。

2. **流暢的色彩過渡**：利用 CSS 的 transition 屬性，確保顏色變化平滑而不突兀，創造出柔和的視覺體驗。

3. **多維度互動**：不僅顏色會變化，漸層的角度也會隨著滑鼠位置調整，增加了互動的層次感。

4. **簡約而現代的設計**：網站結構簡單，只有一個中央文字區域和互動背景，體現了現代網頁設計的「少即是多」理念。

5. **全螢幕沉浸式體驗**：背景覆蓋整個視窗，創造出沉浸式的視覺效果。

## 優點

1. **高效能實現**：使用簡單的 DOM 結構和 CSS 過渡效果，而非複雜的 Canvas 或 WebGL，確保在各種裝置上都能流暢運行。

2. **低資源消耗**：僅修改 body 的背景屬性，避免了頻繁操作 DOM 元素，減少了瀏覽器重繪的負擔。

3. **響應式設計**：自動適應不同螢幕尺寸，並在視窗大小變化時重新計算參數。

4. **直覺的視覺反饋**：使用者移動滑鼠時能立即看到背景變化，提供了良好的互動反饋。

5. **易於擴展**：代碼結構清晰，易於添加更多互動元素或效果。

## 視覺效果

當使用者移動滑鼠時，會看到：

1. **色彩變化**：背景顏色會根據滑鼠位置平滑地在不同色調間過渡。
    - 水平移動主要影響色相 (Hue)
    - 垂直移動影響飽和度 (Saturation) 和亮度 (Lightness)

2. **漸層角度變化**：漸層的方向會隨著滑鼠的水平位置從 0 度旋轉到 180 度。

3. **平滑過渡**：所有變化都有 0.5 秒的過渡時間，使用 ease-out 緩動函數，創造出流暢的視覺體驗。

## 程式碼邏輯與原理

### HTML 結構
HTML 結構非常簡潔，只包含一個內容區塊和必要的腳本/樣式連結。這種簡約設計確保了頁面載入速度快，並將焦點放在互動效果上。

### CSS 原理
1. **初始漸層設定**：
   ```css
   background: linear-gradient(45deg, hsl(200, 80%, 60%), hsl(300, 80%, 60%));
   ```
   使用 HSL 顏色模型設定初始漸層，HSL 比 RGB 更直觀地表示顏色變化。

2. **平滑過渡機制**：
   ```css
   transition: background 0.5s ease-out;
   ```
   這是整個效果的關鍵 - 當 JavaScript 更新背景屬性時，CSS transition 會自動創建從舊值到新值的平滑動畫，持續 0.5 秒。

3. **內容區塊處理**：
   ```css
   pointer-events: none;
   ```
   確保中央文字不會阻擋滑鼠事件傳遞到 body 元素，使整個頁面都能響應滑鼠移動。

### JavaScript 邏輯
1. **座標標準化**：
   ```javascript
   const normalizedX = mouseX / windowWidth;
   const normalizedY = mouseY / windowHeight;
   ```
   將滑鼠座標轉換為 0-1 範圍的值，使計算與螢幕尺寸無關。

2. **HSL 顏色計算**：
   ```javascript
   const hue1 = normalizedX * 360;
   const saturation1 = 70 + normalizedY * 30;
   const lightness1 = 50 + normalizedY * 15;
   ```
    - 水平位置 (X) 決定色相，從 0 到 360 度
    - 垂直位置 (Y) 微調飽和度和亮度，創造更豐富的變化

3. **互補色計算**：
   ```javascript
   const hue2 = (hue1 + 100) % 360;
   ```
   第二個顏色的色相偏移 100 度，創造出和諧的互補色效果。

4. **漸層角度動態調整**：
   ```javascript
   const gradientAngle = 180 * normalizedX;
   ```
   漸層角度根據滑鼠水平位置從 0 度變化到 180 度，增加視覺變化。

5. **動態樣式應用**：
   ```javascript
   const backgroundStyle = `linear-gradient(${gradientAngle}deg, hsl(${hue1}, ${saturation1}%, ${lightness1}%), hsl(${hue2}, ${saturation2}%, ${lightness2}%))`;
   body.style.background = backgroundStyle;
   ```
   構建完整的 CSS 漸層字串並應用到 body 元素，CSS transition 會處理平滑過渡。

6. **響應式適配**：
   ```javascript
   window.addEventListener('resize', () => {
       windowWidth = window.innerWidth;
       windowHeight = window.innerHeight;
   });
   ```
   監聽視窗大小變化，確保在不同裝置和調整視窗大小後效果依然準確。

## 總結

這個網站展示了如何用最少的代碼實現引人入勝的互動效果。它巧妙地結合了 CSS 的過渡能力和 JavaScript 的互動處理，創造出既美觀又高效的視覺體驗。HSL 顏色模型的使用使得顏色變化更加自然和協調，而簡潔的程式結構也使這個效果易於理解和擴展。

---
