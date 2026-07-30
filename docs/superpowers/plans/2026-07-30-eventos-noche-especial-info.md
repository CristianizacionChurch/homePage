# Noche Especial — Event Info Update Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the `#eventos` section with correct event information and organize dress code into three military branches (Fuerza Terrestre, Fuerza Aérea, Fuerza Naval).

**Architecture:** Single-file change to `page/Camp/code.html`. Replace existing eventos section content with accurate event details and a 3-column dress code grid.

**Tech Stack:** HTML, Tailwind CSS (CDN), vanilla JS

---

## File Map

| Action | File | Lines |
|--------|------|-------|
| Modify | `page/Camp/code.html` | ~924-1013 (eventos section) |

---

### Task 1: Update eventos section header and Card 1

**Files:**
- Modify: `page/Camp/code.html:924-971`

- [ ] **Step 1: Replace the section header and Card 1 with correct event info**

Replace lines 924-971 (from `<div class="text-center mb-16">` through the closing of Card 1) with:

```html
        <div class="text-center mb-16">
            <span class="text-fire-400 font-bold tracking-[4px] uppercase text-sm">Lucas 19:10</span>
            <h2 class="text-4xl md:text-6xl font-display mt-3 text-white">NOCHE ESPECIAL</h2>
            <p class="text-white/50 mt-3 max-w-2xl mx-auto italic">"Vestíos de toda la armadura de Dios, para que podáis estar firmes contra las asechanzas del diablo." — Efesios 6:11</p>
            <div class="distress-underline mx-auto mt-4"></div>
        </div>

        <div class="max-w-5xl mx-auto">
            <div class="grid md:grid-cols-2 gap-8 mb-12">
                <!-- Card 1: Info del Evento -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-fire-500/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fire-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="material-icons-outlined text-fire-400 text-3xl">nightlife</span>
                        <h3 class="text-xl sm:text-2xl font-display text-white uppercase tracking-wider">MAYDAY: Misión Rescate</h3>
                    </div>
                    <p class="text-white/60 text-sm leading-relaxed mb-6">
                        Una noche especial de adoración, testimonios y comunidad. Vestidos con propósito, uniformes en la misión y un corazón dispuesto a servir.
                    </p>
                    <div class="space-y-3">
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">event</span>
                            <span class="text-white/80">15 de Agosto, 2026</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">schedule</span>
                            <span class="text-white/80">6:30 PM</span>
                        </div>
                        <div class="flex items-center gap-3 text-sm">
                            <span class="material-icons-outlined text-fire-400 text-lg">location_on</span>
                            <span class="text-white/80">Villa Zoila — Área del Comedor, Campamento MAYDAY</span>
                        </div>
                    </div>
                </div>

                <!-- Card 2: Lema -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden group hover:border-fire-500/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fire-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="material-icons-outlined text-fire-400 text-3xl">shield</span>
                        <h3 class="text-xl sm:text-2xl font-display text-white uppercase tracking-wider">Vístete con Propósito</h3>
                    </div>
                    <p class="text-white/60 text-sm leading-relaxed mb-6">
                        Cada rama militar tiene su identidad. Elige la tuya y représentala con orgullo esta noche especial.
                    </p>
                    <div class="flex items-center gap-3 text-sm">
                        <span class="material-icons-outlined text-fire-400 text-lg">groups</span>
                        <span class="text-white/80">Abierto a todos los campistas y familias</span>
                    </div>
                </div>
            </div>
```

- [ ] **Step 2: Verify in browser**

Open `page/Camp/code.html`, scroll to `#eventos`. Confirm header shows "Lucas 19:10" subtitle, "NOCHE ESPECIAL" title, and Efesios 6:11 quote. Card 1 shows correct date/time/location. Card 2 shows "Vístete con Propósito".

---

### Task 2: Add dress code section with 3 military branches

**Files:**
- Modify: `page/Camp/code.html` (after Card 2 closing, before `</div>` max-w-5xl)

- [ ] **Step 1: Add the 3-column dress code grid**

Insert after the Card 2 closing `</div>` and before the `</div>` that closes `max-w-5xl`:

```html
            <!-- Vestimenta -->
            <div class="text-center mb-8">
                <span class="material-icons-outlined text-fire-400 text-4xl mb-3">checkroom</span>
                <h3 class="text-2xl sm:text-3xl font-display text-white uppercase tracking-wider mb-2">Código de Vestimenta</h3>
                <p class="text-white/50 text-sm">Elige tu rama y vístete con propósito</p>
            </div>

            <div class="grid md:grid-cols-3 gap-6">
                <!-- Fuerza Terrestre -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 text-center relative overflow-hidden group hover:border-green-500/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span class="material-icons-outlined text-green-400 text-3xl mb-3">terrain</span>
                    <h4 class="text-lg font-display text-white uppercase tracking-wider mb-3">Fuerza Terrestre</h4>
                    <p class="text-white/50 text-xs leading-relaxed mb-4">
                        Verde militar, negro, beige o camuflaje.
                    </p>
                    <div class="space-y-2 text-left">
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-green-400 text-sm">check</span>
                            Gorra militar
                        </div>
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-green-400 text-sm">check</span>
                            Placa de identificación
                        </div>
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-green-400 text-sm">check</span>
                            Pañuelo o cinturón táctico
                        </div>
                    </div>
                </div>

                <!-- Fuerza Aérea -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 text-center relative overflow-hidden group hover:border-blue-400/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span class="material-icons-outlined text-blue-400 text-3xl mb-3">flight</span>
                    <h4 class="text-lg font-display text-white uppercase tracking-wider mb-3">Fuerza Aérea</h4>
                    <p class="text-white/50 text-xs leading-relaxed mb-4">
                        Azul marino, azul claro, gris o blanco.
                    </p>
                    <div class="space-y-2 text-left">
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-blue-400 text-sm">check</span>
                            Gorra estilo aviador
                        </div>
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-blue-400 text-sm">check</span>
                            Gafas de sol
                        </div>
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-blue-400 text-sm">check</span>
                            Insignias decorativas o pañuelo
                        </div>
                    </div>
                </div>

                <!-- Fuerza Naval -->
                <div class="bg-rescue-800/50 border border-fire-700/20 rounded-2xl p-6 text-center relative overflow-hidden group hover:border-white/30 transition-colors duration-500">
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span class="material-icons-outlined text-white/70 text-3xl mb-3">sailing</span>
                    <h4 class="text-lg font-display text-white uppercase tracking-wider mb-3">Fuerza Naval</h4>
                    <p class="text-white/50 text-xs leading-relaxed mb-4">
                        Blanco, azul marino o negro.
                    </p>
                    <div class="space-y-2 text-left">
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-white/50 text-sm">check</span>
                            Gorra marinera
                        </div>
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-white/50 text-sm">check</span>
                            Pañuelo azul
                        </div>
                        <div class="flex items-center gap-2 text-xs text-white/60">
                            <span class="material-icons-outlined text-white/50 text-sm">check</span>
                            Detalles de ancla o botones dorados
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer quote -->
            <div class="text-center mt-10">
                <p class="text-fire-300/80 text-sm italic font-medium tracking-wide">
                    "Vistámonos con propósito, uniformes en la misión y un corazón dispuesto a servir."
                </p>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Remove old dress code badges from Card 1**

The old Card 1 had dress code badges (`Formal / Uniforme`, `Colores Oscuros`). These are now replaced by the full 3-column dress code section. Verify no leftover `<div class="flex flex-wrap gap-3 mt-6">` blocks remain in the eventos section.

- [ ] **Step 3: Verify in browser**

Confirm:
- 3-column grid visible on desktop (Terrestre / Aérea / Naval)
- Each card shows: icon, branch name, colors, 3 accessories with checkmarks
- Hover on each card shows colored top line (green/blue/white)
- Footer quote visible at bottom
- Mobile: cards stack vertically

---

### Task 3: Verify & commit

- [ ] **Step 1: Visual check**

- Desktop: header with Efesios quote, 2 info cards, 3 dress code cards, footer quote
- Mobile: stacked layout, all text readable

- [ ] **Step 2: Commit**

```bash
git add page/Camp/code.html
git commit -m "feat(camp): update noche especial info with correct details and 3-branch dress code"
```

---

## Self-Review

1. **Spec coverage:** ✅ Event name (MAYDAY: Misión Rescate). ✅ Bible reference (Lucas 19:10, Efesios 6:11). ✅ Date (15 de Agosto). ✅ Time (6:30 PM). ✅ Location (Villa Zoila, Área del Comedor). ✅ Dress code split into 3 branches with colors and accessories. ✅ Footer quote.
2. **Placeholder scan:** ✅ No TBD/TODO. All content is concrete.
3. **Type consistency:** ✅ All icon names are valid Material Icons. ✅ Color scheme consistent (green for Terrestre, blue for Aérea, white for Naval).
