# Trend Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone Trend page that lets users upload a photo, composite it inside a circular mask with the camp's SVG template overlay, and download the 1080x1080 PNG result.

**Architecture:** Three files — `trend.html` (page structure + nav), `trend.css` (camp theme styles), `trend.js` (canvas compositing logic). The canvas draws the user photo clipped to a circle, then overlays the SVG template as a frame. Uses `ctx.clip()` for circular masking and `canvas.toBlob()` for high-quality PNG export.

**Tech Stack:** HTML5 Canvas API, Vanilla JS, Tailwind CSS (CDN), Google Fonts (Anton, Poppins), Material Icons.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `page/Camp/trend.html` | Page structure, nav, canvas element, upload/download UI |
| `page/Camp/trend.css` | Custom styles (button styles, canvas wrapper, responsive tweaks) |
| `page/Camp/trend.js` | Image loading, canvas compositing, circular mask, PNG export |

---

### Task 1: Create `trend.html` with nav and canvas structure

**Files:**
- Create: `page/Camp/trend.html`

- [ ] **Step 1: Write the HTML file**

```html
<!DOCTYPE html>
<html lang="es" class="dark">
<head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Trend - MAYDAY: Misión Rescate 2026</title>
<script>
window.tailwind = window.tailwind || {};
window.tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                fire: {
                    50: "#FFF7ED", 100: "#FFEDD5", 200: "#FED7AA", 300: "#FDBA74",
                    400: "#FB923C", 500: "#F97316", 600: "#EA580C", 700: "#C2410C",
                    800: "#9A3412", 900: "#7C2D12",
                },
                rescue: {
                    900: "#0C0A09", 800: "#1C1917", 700: "#292524", 600: "#44403C",
                    950: "#070605",
                },
                alert: { DEFAULT: "#DC2626", dark: "#991B1B", light: "#FCA5A5" }
            },
            fontFamily: {
                display: ["Anton", "sans-serif"],
                body: ["Poppins", "sans-serif"],
            },
        },
    },
};
</script>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Poppins:wght@300;400;600;700;900&display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet"/>
<link href="trend.css" rel="stylesheet"/>
</head>
<body>
<!-- Background layers (identical to code.html) -->
<div id="camp-bg" aria-hidden="true">
    <div class="bg-layer bg-grid"></div>
    <div class="bg-layer bg-crosshairs"></div>
    <div class="bg-layer bg-compass"></div>
    <div class="bg-layer bg-topo"></div>
    <div class="bg-deco bg-helicopter"></div>
    <div class="bg-deco bg-rescue-cross"></div>
    <div class="bg-deco bg-dogtag"></div>
    <div class="bg-deco bg-helicopter-2"></div>
</div>

<!-- Navigation (matches code.html nav exactly) -->
<nav class="fixed w-full z-50 bg-rescue-900/80 backdrop-blur-md border-b border-fire-700/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 sm:h-20 items-center">
            <div class="flex items-center space-x-3 min-w-0">
                <img src="logotransparete.png" alt="MAYDAY Misión Rescate" class="h-12 sm:h-14 w-auto drop-shadow-md flex-shrink-0" />
                <div class="flex flex-col leading-tight">
                    <span class="font-display text-lg sm:text-2xl tracking-wider uppercase text-white truncate">MAYDAY 2026</span>
                    <span class="text-[10px] sm:text-xs text-fire-400 tracking-widest uppercase">Misión Rescate</span>
                </div>
            </div>
            <div class="hidden md:flex space-x-8 items-center">
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="code.html">Inicio</a>
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="code.html#info">Info</a>
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="code.html#instalaciones">Instalaciones</a>
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="code.html#registro">Registro</a>
                <a class="text-fire-400 font-medium text-sm uppercase tracking-wider border-b-2 border-fire-400 pb-1" href="trend.html">Trend</a>
                <a href="code.html#registro" class="bg-alert hover:bg-alert-dark text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wider transition-all hover:shadow-lg hover:shadow-alert/30">
                    ¡Reserva tu lugar!
                </a>
            </div>
            <div class="md:hidden flex items-center">
                <button id="mobileMenuBtn" class="text-white hover:text-fire-400 p-2 -mr-2" aria-label="Abrir menú">
                    <span id="menuIcon" class="material-icons-outlined text-3xl">menu</span>
                </button>
            </div>
        </div>
    </div>
    <div id="mobileMenu" class="hidden md:hidden bg-rescue-900/95 backdrop-blur-md border-t border-fire-700/20">
        <div class="px-4 py-4 space-y-1">
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="code.html">Inicio</a>
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="code.html#info">Info del Evento</a>
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="code.html#instalaciones">Instalaciones</a>
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="code.html#registro">Registro</a>
            <a class="block py-3 px-4 rounded-lg bg-fire-500/10 text-fire-400 font-medium transition-colors" href="trend.html">Trend</a>
        </div>
    </div>
</nav>

<!-- Main Content -->
<main class="min-h-screen pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
            <span class="text-fire-400 font-bold tracking-[4px] uppercase text-sm">Generador</span>
            <h1 class="text-4xl md:text-6xl font-display mt-3 text-white">TREND</h1>
            <p class="text-white/50 mt-3 max-w-xl mx-auto">Sube tu foto y crea tu imagen personalizada para compartir en redes sociales.</p>
            <div class="distress-underline mx-auto mt-4"></div>
        </div>

        <!-- Canvas Preview -->
        <div class="canvas-wrapper mb-8">
            <canvas id="trendCanvas" width="1080" height="1080"></canvas>
        </div>

        <!-- Controls -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label for="photoUpload" class="fire-btn px-8 py-4 rounded-full font-bold text-base tracking-wider flex items-center gap-2 cursor-pointer">
                <span class="material-icons-outlined">add_a_photo</span>
                Subir Foto
            </label>
            <input type="file" id="photoUpload" accept="image/*" class="hidden" />
            <button id="downloadBtn" class="bg-rescue-700 hover:bg-rescue-600 text-white px-8 py-4 rounded-full font-bold text-base tracking-wider flex items-center gap-2 transition-all border border-fire-700/30 hover:border-fire-500/50" disabled>
                <span class="material-icons-outlined">download</span>
                Descargar Foto
            </button>
        </div>

        <!-- Template Selector -->
        <div class="mt-8 text-center">
            <p class="text-white/40 text-sm mb-3">Plantilla:</p>
            <div class="flex justify-center gap-3" id="templateOptions">
                <button class="template-btn active" data-template="fuerza-aerea.svg">Fuerza Aérea</button>
                <button class="template-btn" data-template="Fuerza-naval.svg">Fuerza Naval</button>
                <button class="template-btn" data-template="fuerza-terrestre.svg">Fuerza Terrestre</button>
            </div>
        </div>
    </div>
</main>

<!-- Footer (simplified) -->
<footer class="bg-black pt-8 pb-6 border-t border-fire-700/10 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-white/30 text-xs">© 2026 Ministerio Juvenil Ungidos al Extremo.</p>
        <p class="text-white/20 text-xs mt-1">Lucas 19:10 · 🚨 MAYDAY</p>
    </div>
</footer>

<script src="trend.js"></script>
<script>
// Mobile menu (same as code.html)
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('menuIcon');
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) { menu.classList.remove('hidden'); icon.textContent = 'close'; }
    else { menu.classList.add('hidden'); icon.textContent = 'menu'; }
}
document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
window.addEventListener('resize', function() { if (window.innerWidth >= 768) { document.getElementById('mobileMenu').classList.add('hidden'); document.getElementById('menuIcon').textContent = 'menu'; } });
</script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML loads correctly**

Open `page/Camp/trend.html` in a browser. Nav should show with "Inicio" and "Trend" links. Canvas placeholder and buttons should be visible. No JS errors in console.

- [ ] **Step 3: Commit**

```bash
git add page/Camp/trend.html
git commit -m "feat(camp): add trend.html page structure with nav and canvas"
```

---

### Task 2: Create `trend.css` with camp theme styles

**Files:**
- Create: `page/Camp/trend.css`

- [ ] **Step 1: Write the CSS file**

```css
/* Background layers — cloned from code.html */
* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { background: #0C0A09; color: #E5E5E5; font-family: "Poppins", sans-serif; overflow-x: hidden; }

#camp-bg { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
.bg-layer { position: absolute; inset: 0; background-repeat: repeat; background-size: 200px 200px; opacity: 0.04; }
.bg-grid {
    background-image: linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px);
    background-size: 60px 60px; opacity: 0.06;
}
.bg-crosshairs {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='20' fill='none' stroke='%23F97316' stroke-width='0.5'/%3E%3Ccircle cx='60' cy='60' r='8' fill='none' stroke='%23DC2626' stroke-width='0.5'/%3E%3Cline x1='60' y1='30' x2='60' y2='50' stroke='%23F97316' stroke-width='0.5'/%3E%3Cline x1='60' y1='70' x2='60' y2='90' stroke='%23F97316' stroke-width='0.5'/%3E%3Cline x1='30' y1='60' x2='50' y2='60' stroke='%23F97316' stroke-width='0.5'/%3E%3Cline x1='70' y1='60' x2='90' y2='60' stroke='%23F97316' stroke-width='0.5'/%3E%3C/svg%3E");
    background-size: 240px 240px; opacity: 0.05;
}
.bg-compass {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ccircle cx='100' cy='100' r='80' fill='none' stroke='%23F97316' stroke-width='0.5'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='%23F97316' stroke-width='0.3'/%3E%3Cpolygon points='100,30 105,95 100,90 95,95' fill='%23DC2626' opacity='0.5'/%3E%3Cpolygon points='100,170 105,105 100,110 95,105' fill='%23F97316' opacity='0.3'/%3E%3Cpolygon points='30,100 95,95 90,100 95,105' fill='%23F97316' opacity='0.3'/%3E%3Cpolygon points='170,100 105,95 110,100 105,105' fill='%23F97316' opacity='0.3'/%3E%3Ctext x='100' y='25' text-anchor='middle' fill='%23F97316' font-size='10' font-family='sans-serif' opacity='0.6'%3EN%3C/text%3E%3Ctext x='100' y='190' text-anchor='middle' fill='%23F97316' font-size='10' font-family='sans-serif' opacity='0.4'%3ES%3C/text%3E%3Ctext x='15' y='104' text-anchor='middle' fill='%23F97316' font-size='10' font-family='sans-serif' opacity='0.4'%3EW%3C/text%3E%3Ctext x='185' y='104' text-anchor='middle' fill='%23F97316' font-size='10' font-family='sans-serif' opacity='0.4'%3EE%3C/text%3E%3C/svg%3E");
    background-size: 400px 400px; opacity: 0.03;
    animation: compassRotate 120s linear infinite;
}
@keyframes compassRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.bg-topo {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Cpath d='M0 150 Q75 100 150 150 Q225 200 300 150' fill='none' stroke='%23F97316' stroke-width='0.5' opacity='0.5'/%3E%3Cpath d='M0 100 Q75 50 150 100 Q225 150 300 100' fill='none' stroke='%23F97316' stroke-width='0.3' opacity='0.3'/%3E%3Cpath d='M0 200 Q75 150 150 200 Q225 250 300 200' fill='none' stroke='%23F97316' stroke-width='0.3' opacity='0.3'/%3E%3C/svg%3E");
    background-size: 300px 300px; opacity: 0.04;
}
.bg-deco { position: absolute; opacity: 0.04; pointer-events: none; }
.bg-helicopter {
    top: 10%; right: 5%; width: 200px; height: 200px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cellipse cx='100' cy='120' rx='50' ry='20' fill='%23F97316'/%3E%3Crect x='40' y='115' width='120' height='10' rx='5' fill='%23F97316'/%3E%3Cpath d='M100 100 L100 60' stroke='%23F97316' stroke-width='3'/%3E%3Cline x1='60' y1='60' x2='140' y2='60' stroke='%23F97316' stroke-width='2'/%3E%3Cpath d='M160 120 L190 110 L190 130 Z' fill='%23F97316'/%3E%3Cline x1='100' y1='140' x2='80' y2='170' stroke='%23F97316' stroke-width='2'/%3E%3Cline x1='100' y1='140' x2='120' y2='170' stroke='%23F97316' stroke-width='2'/%3E%3Ccircle cx='80' cy='170' r='5' fill='none' stroke='%23F97316' stroke-width='1.5'/%3E%3Ccircle cx='120' cy='170' r='5' fill='none' stroke='%23F97316' stroke-width='1.5'/%3E%3C/svg%3E");
    background-size: contain; background-repeat: no-repeat;
    animation: heliFloat 20s ease-in-out infinite;
}
@keyframes heliFloat {
    0%, 100% { transform: translate(0, 0) rotate(-5deg); }
    25% { transform: translate(-20px, 15px) rotate(0deg); }
    50% { transform: translate(10px, -10px) rotate(5deg); }
    75% { transform: translate(-15px, 5px) rotate(-3deg); }
}
.bg-helicopter-2 {
    bottom: 20%; left: 3%; width: 150px; height: 150px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cellipse cx='100' cy='120' rx='50' ry='20' fill='%23DC2626'/%3E%3Crect x='40' y='115' width='120' height='10' rx='5' fill='%23DC2626'/%3E%3Cpath d='M100 100 L100 60' stroke='%23DC2626' stroke-width='3'/%3E%3Cline x1='60' y1='60' x2='140' y2='60' stroke='%23DC2626' stroke-width='2'/%3E%3Cpath d='M160 120 L190 110 L190 130 Z' fill='%23DC2626'/%3E%3Cline x1='100' y1='140' x2='80' y2='170' stroke='%23DC2626' stroke-width='2'/%3E%3Cline x1='100' y1='140' x2='120' y2='170' stroke='%23DC2626' stroke-width='2'/%3E%3Ccircle cx='80' cy='170' r='5' fill='none' stroke='%23DC2626' stroke-width='1.5'/%3E%3Ccircle cx='120' cy='170' r='5' fill='none' stroke='%23DC2626' stroke-width='1.5'/%3E%3C/svg%3E");
    background-size: contain; background-repeat: no-repeat; opacity: 0.03;
    animation: heliFloat2 25s ease-in-out infinite;
}
@keyframes heliFloat2 {
    0%, 100% { transform: translate(0, 0) rotate(3deg); }
    33% { transform: translate(25px, -20px) rotate(-2deg); }
    66% { transform: translate(-10px, 10px) rotate(4deg); }
}
.bg-rescue-cross {
    top: 40%; left: 8%; width: 120px; height: 120px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Crect x='45' y='20' width='30' height='80' rx='4' fill='%23DC2626'/%3E%3Crect x='20' y='45' width='80' height='30' rx='4' fill='%23DC2626'/%3E%3C/svg%3E");
    background-size: contain; background-repeat: no-repeat;
    animation: crossPulse 8s ease-in-out infinite;
}
@keyframes crossPulse { 0%, 100% { opacity: 0.04; transform: scale(1); } 50% { opacity: 0.07; transform: scale(1.05); } }
.bg-dogtag {
    bottom: 15%; right: 10%; width: 100px; height: 140px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 140'%3E%3Cpath d='M50 10 C30 10 20 25 20 45 L20 110 C20 125 35 130 50 130 C65 130 80 125 80 110 L80 45 C80 25 70 10 50 10 Z' fill='none' stroke='%23F97316' stroke-width='2'/%3E%3Ccircle cx='50' cy='10' r='6' fill='none' stroke='%23F97316' stroke-width='2'/%3E%3Cline x1='35' y1='50' x2='65' y2='50' stroke='%23F97316' stroke-width='1.5'/%3E%3Cline x1='35' y1='65' x2='65' y2='65' stroke='%23F97316' stroke-width='1.5'/%3E%3Cline x1='35' y1='80' x2='55' y2='80' stroke='%23F97316' stroke-width='1.5'/%3E%3C/svg%3E");
    background-size: contain; background-repeat: no-repeat;
    animation: tagSwing 15s ease-in-out infinite;
}
@keyframes tagSwing { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }

/* Trend page specifics */
.distress-underline {
    background: linear-gradient(90deg, #DC2626, #F97316);
    height: 3px; width: 100px;
}
.fire-btn {
    background: linear-gradient(135deg, #DC2626, #EA580C);
    color: white; transition: all 0.3s ease; border: none;
}
.fire-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(220,38,38,0.4); }
.fire-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

.canvas-wrapper {
    display: flex; justify-content: center; align-items: center;
}
#trendCanvas {
    width: 100%; max-width: 540px;
    border-radius: 16px;
    border: 2px solid rgba(249,115,22,0.3);
    box-shadow: 0 0 30px rgba(249,115,22,0.1);
    background: #1C1917;
}
@media (max-width: 640px) {
    #trendCanvas { max-width: 100%; border-radius: 12px; }
}

.template-btn {
    padding: 8px 16px; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;
    letter-spacing: 0.05em; text-transform: uppercase;
    background: rgba(28,25,23,0.6); color: rgba(255,255,255,0.5);
    border: 1px solid rgba(249,115,22,0.2); cursor: pointer;
    transition: all 0.3s ease;
}
.template-btn:hover { color: white; border-color: rgba(249,115,22,0.5); }
.template-btn.active {
    background: rgba(249,115,22,0.15); color: #F97316;
    border-color: rgba(249,115,22,0.6);
}

@media (max-width: 768px) {
    .bg-helicopter, .bg-helicopter-2 { width: 100px; height: 100px; }
    .bg-rescue-cross { width: 80px; height: 80px; }
    .bg-dogtag { width: 60px; height: 84px; }
    .bg-compass { background-size: 250px 250px; }
}
```

- [ ] **Step 2: Verify styles load**

Refresh `trend.html` — background patterns, nav styling, and canvas border should match the camp theme.

- [ ] **Step 3: Commit**

```bash
git add page/Camp/trend.css
git commit -m "feat(camp): add trend.css with camp theme styles"
```

---

### Task 3: Create `trend.js` with canvas compositing logic

**Files:**
- Create: `page/Camp/trend.js`

- [ ] **Step 1: Write the JS file**

```javascript
(function () {
    'use strict';

    const CANVAS_SIZE = 1080;
    const CIRCLE_RADIUS = 340;
    const CIRCLE_CENTER = CANVAS_SIZE / 2;

    const canvas = document.getElementById('trendCanvas');
    const ctx = canvas.getContext('2d');
    const uploadInput = document.getElementById('photoUpload');
    const downloadBtn = document.getElementById('downloadBtn');
    const templateBtns = document.querySelectorAll('.template-btn');

    let userImage = null;
    let currentTemplate = 'fuerza-aerea.svg';

    // Draw initial placeholder
    function drawPlaceholder() {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        ctx.fillStyle = '#1C1917';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Circle outline
        ctx.beginPath();
        ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(249,115,22,0.3)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 10]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Placeholder text
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.font = '600 24px Poppins, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Sube una foto para comenzar', CIRCLE_CENTER, CIRCLE_CENTER);
    }

    // Cover-fit calculation: returns {sx, sy, sw, sh} for drawing image to fill a circle
    function coverFit(imgW, imgH, diam) {
        const imgRatio = imgW / imgH;
        const boxRatio = diam / diam; // 1:1 circle
        let sw, sh, sx, sy;
        if (imgRatio > boxRatio) {
            sh = imgH;
            sw = imgH * boxRatio;
            sx = (imgW - sw) / 2;
            sy = 0;
        } else {
            sw = imgW;
            sh = imgW / boxRatio;
            sx = 0;
            sy = (imgH - sh) / 2;
        }
        return { sx, sy, sw, sh };
    }

    // Render the full composition
    function render() {
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Dark background
        ctx.fillStyle = '#1C1917';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        if (!userImage) {
            drawPlaceholder();
            return;
        }

        const diam = CIRCLE_RADIUS * 2;
        const fit = coverFit(userImage.naturalWidth, userImage.naturalHeight, diam);

        // Clip to circle and draw user photo
        ctx.save();
        ctx.beginPath();
        ctx.arc(CIRCLE_CENTER, CIRCLE_CENTER, CIRCLE_RADIUS, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(
            userImage,
            fit.sx, fit.sy, fit.sw, fit.sh,
            CIRCLE_CENTER - CIRCLE_RADIUS, CIRCLE_CENTER - CIRCLE_RADIUS,
            diam, diam
        );
        ctx.restore();

        // Draw SVG template overlay if already cached
        if (templateCache[currentTemplate]) {
            ctx.drawImage(templateCache[currentTemplate], 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }

        // Load template async — re-render once ready so overlay appears
        if (!templateCache[currentTemplate]) {
            loadTemplateImage(currentTemplate, function (tplImg) {
                if (tplImg && userImage) render();
            });
        }
    }

    // Load an SVG as an Image (with cache)
    const templateCache = {};
    function loadTemplateImage(name, callback) {
        if (templateCache[name]) {
            callback(templateCache[name]);
            return;
        }
        const img = new Image();
        img.onload = function () {
            templateCache[name] = img;
            callback(img);
        };
        img.onerror = function () {
            callback(null);
        };
        img.src = name;
    }

    // Handle file upload
    uploadInput.addEventListener('change', function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (ev) {
            const img = new Image();
            img.onload = function () {
                userImage = img;
                downloadBtn.disabled = false;
                render();
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Handle download
    downloadBtn.addEventListener('click', function () {
        if (!userImage) return;

        // Re-render at full 1080x1080 for export
        render();

        canvas.toBlob(function (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mayday-trend-2026.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
    });

    // Template selector
    templateBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            templateBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentTemplate = btn.dataset.template;
            render();
        });
    });

    // Initial draw
    drawPlaceholder();
})();
```

- [ ] **Step 2: Test upload flow**

Open `trend.html`, click "Subir Foto", select any image. The photo should appear clipped inside a circle in the canvas. The SVG template should overlay on top. Click "Descargar Foto" — a PNG should download.

- [ ] **Step 3: Test template switching**

Click each template button. The SVG overlay on the canvas should change.

- [ ] **Step 4: Commit**

```bash
git add page/Camp/trend.js
git commit -m "feat(camp): add trend.js with canvas compositing and download"
```

---

### Task 4: Final verification and polish

**Files:**
- Modify: `page/Camp/trend.html` (if needed)
- Modify: `page/Camp/trend.css` (if needed)
- Modify: `page/Camp/trend.js` (if needed)

- [ ] **Step 1: Test responsive layout**

Resize browser to mobile width. Canvas should scale down. Nav should collapse to hamburger menu. Buttons should stack vertically.

- [ ] **Step 2: Test edge cases**

- Upload a very small image (should scale up to fill circle).
- Upload a wide panorama (should center-crop horizontally).
- Upload a tall portrait (should center-crop vertically).
- Try download without uploading first (button should be disabled).

- [ ] **Step 3: Verify nav links**

- "Inicio" link goes to `code.html`.
- "Trend" link is active (highlighted).
- Mobile menu works.

- [ ] **Step 4: Final commit**

```bash
git add page/Camp/
git commit -m "feat(camp): trend page complete — upload, composite, download"
```
