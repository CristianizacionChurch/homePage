# Eventos Section — Text Blocks Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the SVG images in the `#eventos` section with structured text blocks containing event information (date, time, location, dress code, schedule), and remove the now-unused lightbox.

**Architecture:** Single-file change to `page/Camp/code.html`. Remove image elements, lightbox HTML/JS, and replace with icon+text info blocks using existing Tailwind classes and the fire/rescue theme.

**Tech Stack:** HTML, Tailwind CSS (CDN), vanilla JS

---

## File Map

| Action | File | Lines |
|--------|------|-------|
| Modify | `page/Camp/code.html` | ~933-979 (eventos section HTML) |
| Modify | `page/Camp/code.html` | ~985-989 (lightbox HTML) |
| Modify | `page/Camp/code.html` | ~1222-1241 (lightbox JS) |
| Modify | `page/Camp/code.html` | ~227-233 (dress-code-item CSS) |

---

### Task 1: Replace Eventos section HTML with text blocks

**Files:**
- Modify: `page/Camp/code.html:933-979`

- [ ] **Step 1: Replace the two image-based cards with text-block cards**

Replace lines 933-979 (the two `grid md:grid-cols-2` cards) with:

```html
            <div class="grid md:grid-cols-2 gap-8">
                <!-- Card 1: Noche Especial -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-fire-500/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fire-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="material-icons-outlined text-fire-400 text-3xl">nightlife</span>
                        <h3 class="text-xl sm:text-2xl font-display text-white uppercase tracking-wider">Noche Especial</h3>
                    </div>
                    <p class="text-white/60 text-sm leading-relaxed mb-6">
                        Una velada única para cerrar el campamento con fuerza: adoración en vivo, testimonios que tocan el corazón, fuegos artificiales y la oportunidad de compartir con amigos y familias en un ambiente de gozo y gratitud.
                    </p>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">event</span>
                            <span class="text-white/80">15 de Agosto, 2026</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">schedule</span>
                            <span class="text-white/80">7:00 PM - 10:00 PM</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">location_on</span>
                            <span class="text-white/80">Campamento Villa Zoila</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">payments</span>
                            <span class="text-white/80">Incluido en el registro</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-3 mt-6">
                        <div class="inline-flex items-center gap-2 bg-fire-500/10 border border-fire-500/20 rounded-full px-4 py-2 text-xs text-fire-300 font-medium tracking-wide dress-code-item" style="animation-delay: 0s">
                            <span class="material-icons-outlined text-sm">checkroom</span>
                            Formal / Uniforme
                        </div>
                        <div class="inline-flex items-center gap-2 bg-fire-500/10 border border-fire-500/20 rounded-full px-4 py-2 text-xs text-fire-300 font-medium tracking-wide dress-code-item" style="animation-delay: 0.15s">
                            <span class="material-icons-outlined text-sm">palette</span>
                            Colores Oscuros
                        </div>
                    </div>
                </div>

                <!-- Card 2: Programa de la Noche -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-fire-500/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fire-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="material-icons-outlined text-fire-400 text-3xl">info</span>
                        <h3 class="text-xl sm:text-2xl font-display text-white uppercase tracking-wider">Programa</h3>
                    </div>
                    <p class="text-white/60 text-sm leading-relaxed mb-6">
                        Todo lo que necesitas saber para esta noche inolvidable: horario, código de vestimenta, ubicación y recomendaciones para disfrutar al máximo junto a tu comunidad.
                    </p>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">groups</span>
                            <span class="text-white/80">Abierto a todos los campistas y familias</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">restaurant</span>
                            <span class="text-white/80">Cena incluida</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">music_note</span>
                            <span class="text-white/80">Adoración en vivo con la banda del campamento</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">auto_awesome</span>
                            <span class="text-white/80">Fuegos artificiales de cierre</span>
                        </div>
                    </div>
                    <div class="flex flex-wrap gap-3 mt-6">
                        <div class="inline-flex items-center gap-2 bg-fire-500/10 border border-fire-500/20 rounded-full px-4 py-2 text-xs text-fire-300 font-medium tracking-wide dress-code-item" style="animation-delay: 0.3s">
                            <span class="material-icons-outlined text-sm">schedule</span>
                            7:00 PM
                        </div>
                        <div class="inline-flex items-center gap-2 bg-fire-500/10 border border-fire-500/20 rounded-full px-4 py-2 text-xs text-fire-300 font-medium tracking-wide dress-code-item" style="animation-delay: 0.45s">
                            <span class="material-icons-outlined text-sm">celebration</span>
                            Noche de cierre
                        </div>
                    </div>
                </div>
            </div>
```

- [ ] **Step 2: Verify in browser**

Open `page/Camp/code.html` in a browser, scroll to `#eventos`. Confirm:
- Two cards visible side-by-side on desktop, stacked on mobile
- Each card shows icon + title, description, info rows with icons, and badge pills
- Hover effect on cards shows top gradient line
- Dress code badges pulse gently

---

### Task 2: Remove lightbox HTML

**Files:**
- Modify: `page/Camp/code.html:985-991`

- [ ] **Step 1: Delete the lightbox div**

Delete these lines (the entire `eventLightbox` div):

```html
<div id="eventLightbox" class="fixed inset-0 z-[100] bg-black/95 hidden items-center justify-center" onclick="if(event.target===this)closeEventLightbox()">
    <button onclick="closeEventLightbox()" class="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white z-10 transition-colors" aria-label="Cerrar">
        <span class="material-icons-outlined text-4xl">close</span>
    </button>
    <img id="eventLightboxImg" class="max-w-[92vw] max-h-[90vh] object-contain rounded-lg shadow-2xl" src="" alt="Noche Especial — ampliada"/>
</div>
```

- [ ] **Step 2: Verify no broken references**

Open browser console on `code.html`. Confirm no errors related to `eventLightbox`, `openEventLightbox`, or `closeEventLightbox`.

---

### Task 3: Remove lightbox JS functions

**Files:**
- Modify: `page/Camp/code.html:1222-1241`

- [ ] **Step 1: Delete the three lightbox-related blocks**

Delete these functions and the keydown listener:

```javascript
function openEventLightbox(btn) {
    const img = btn.querySelector('img');
    if (!img) return;
    const lb = document.getElementById('eventLightbox');
    document.getElementById('eventLightboxImg').src = img.src;
    lb.classList.remove('hidden');
    lb.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeEventLightbox() {
    const lb = document.getElementById('eventLightbox');
    lb.classList.add('hidden');
    lb.classList.remove('flex');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeEventLightbox();
});
```

- [ ] **Step 2: Verify no console errors**

Reload `code.html` in browser. Confirm console is clean — no `openEventLightbox is not defined` or similar errors.

---

### Task 4: Verify & commit

- [ ] **Step 1: Visual check on desktop and mobile**

- Desktop: two-column layout, all text readable, badges visible
- Mobile: single-column stack, text wraps cleanly

- [ ] **Step 2: Commit**

```bash
git add page/Camp/code.html
git commit -m "feat(camp): replace eventos SVG images with text blocks, remove lightbox"
```

---

## Self-Review

1. **Spec coverage:** ✅ Images replaced with text blocks. ✅ Info includes date, time, location, cost, dress code, schedule. ✅ Lightbox removed (no images to enlarge).
2. **Placeholder scan:** ✅ No TBD/TODO. All content is concrete.
3. **Type consistency:** ✅ `dress-code-item` class retained for animation. All icon names are valid Material Icons.
