# Itinerario Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-add the `#itinerario` section to `page/Camp/code.html` as an accordion of 3 days (Viernes/Sábado/Domingo); each day expands its itinerary + chapel program. Reuses the existing `<details>` accordion (`.instalacion-folder`), zero new JS.

**Architecture:** Single-file change to `page/Camp/code.html`. Insert a new `<section id="itinerario">` between the `</section>` of `#reglas` and the opening of `#eventos`. Add `Itinerario` nav links to desktop (line 518) and mobile (line 538) navs. The expand/collapse uses `<details class="instalacion-folder">` + `.instalacion-folder__body`, same pattern as Instalaciones — already styled in CSS.

**Tech Stack:** HTML, Tailwind CSS (CDN), CSS already present in file. Only reuse.

**Nav order:** Inicio · Info · Instalaciones · Reglas · **Itinerario** · Eventos · Registro · Trend

---

## File Map

| Action | File | Location |
|--------|------|----------|
| Modify | `page/Camp/code.html` | Desktop nav (line 518): add Itinerario link after Reglas |
| Modify | `page/Camp/code.html` | Mobile nav (line 538): add Itinerario link after Reglas |
| Modify | `page/Camp/code.html` | Between `</section>` of reglas (line ~1025) and `<section id="eventos">` (line ~1027): insert itinerario section |

---

### Task 1: Add nav links (desktop + mobile menu)

**Files:**
- Modify: `page/Camp/code.html:518` (desktop nav)
- Modify: `page/Camp/code.html:538` (mobile nav)

- [ ] **Step 1: Add "Itinerario" to the desktop nav**

Edit: replace
```
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="#reglas">Reglas</a>
```
with
```
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="#reglas">Reglas</a>
                <a class="hover:text-fire-400 transition-colors font-medium text-sm uppercase tracking-wider" href="#itinerario">Itinerario</a>
```

- [ ] **Step 2: Add "Itinerario" to the mobile nav**

Edit: replace
```
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="#reglas" onclick="closeMobileMenu()">Reglas</a>
```
with
```
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="#reglas" onclick="closeMobileMenu()">Reglas</a>
            <a class="block py-3 px-4 rounded-lg hover:bg-fire-500/10 text-white font-medium transition-colors" href="#itinerario" onclick="closeMobileMenu()">Itinerario</a>
```

- [ ] **Step 3: Commit**

```bash
git add page/Camp/code.html; git commit -m "feat: add itinerario nav links"
```

### Task 2: Insert section header + Viernes accordion

**Files:**
- Modify: `page/Camp/code.html` (between `</section>` de reglas y `<section id="eventos">`)

- [ ] **Step 1: Insert the full section opening + Viernes day accordion**

Edit: replace
```
            </div>
        </div>
    </div>
</section>

<section class="py-20 px-4 sm:px-6 lg:px-8 bg-rescue-900 relative overflow-hidden" id="eventos">
```
with
```
            </div>
        </div>
    </div>
</section>

<section class="py-20 px-4 sm:px-6 lg:px-8 bg-rescue-900 relative" id="itinerario">
    <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
            <span class="text-fire-400 font-bold tracking-[4px] uppercase text-sm">Programa</span>
            <h2 class="text-4xl md:text-6xl font-display mt-3 text-white">ITINERARIO</h2>
            <p class="text-white/50 mt-3 max-w-2xl mx-auto">Haz clic en cada día para desplegar su programa de actividades y el programa de capilla.</p>
            <div class="distress-underline mx-auto mt-4"></div>
        </div>

        <div class="max-w-4xl mx-auto space-y-4">

            <details class="instalacion-folder">
                <summary>
                    <span class="instalacion-folder__icon"><span class="material-icons-outlined text-fire-400">today</span></span>
                    <span class="flex flex-col leading-tight">
                        <span class="instalacion-folder__title">Viernes · Día 1</span>
                        <span class="instalacion-folder__count">Itinerario + Programa de Capilla</span>
                    </span>
                    <span class="instalacion-folder__chevron material-icons-outlined">expand_more</span>
                </summary>
                <div class="instalacion-folder__body">
                    <div class="p-6 sm:p-8">
                        <div class="flex items-start gap-3 mb-6">
                            <span class="material-icons-outlined text-fire-400">rocket_launch</span>
                            <p class="text-white/70 italic text-sm sm:text-base">Tema: <strong class="text-fire-400 not-italic">Dios nos elige para cumplir su misión</strong></p>
                        </div>
                        <h4 class="flex items-center gap-2 font-display text-white uppercase tracking-wider text-lg mb-4">
                            <span class="material-icons-outlined text-fire-400">schedule</span> Itinerario del Día
                        </h4>
                        <div class="grid gap-1.5 text-sm">
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">07:00 AM</span><span class="text-white/80">Registro de personal</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">09:30 AM</span><span class="text-white/80">Hora de salida</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">11:00 AM</span><span class="text-white/80">Hora de llegada</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">11:30 AM</span><span class="text-white/80">Colocación de distintivos (cintas)</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">12:00 PM</span><span class="text-white/80">Distribución de cuarteles (habitaciones)</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">01:00 PM</span><span class="text-white/80">Almuerzo de campaña</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">02:00 PM</span><span class="text-white/80">Operaciones de piscina</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">02:00 PM</span><span class="text-white/80">Competencia de tablero y dominó</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">02:30 PM</span><span class="text-white/80">Ensayos en capilla (Eliú: 1:00 hora | Equipos: 30 min.)</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">05:30 PM</span><span class="text-white/80">Cierre de piscina</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">06:00 PM</span><span class="text-white/80">Aseo personal</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">07:00 PM</span><span class="text-white/80">Cena</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">08:00 PM</span><span class="text-white/80">Servicio de apertura</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">10:30 PM</span><span class="text-white/80">Finalización de culto</span></div>
                            <div class="flex items-center gap-4 py-2"><span class="font-display text-fire-400 w-24 flex-shrink-0">11:00 PM</span><span class="text-white/80">Hora de ir a dormir</span></div>
                        </div>
                    </div>
                    <div class="border-t border-fire-700/15 p-6 sm:p-8">
                        <h4 class="flex items-center gap-2 font-display text-white uppercase tracking-wider text-lg mb-4">
                            <span class="material-icons-outlined text-fire-400">church</span> Programa de Capilla · 8:00 PM
                        </h4>
                        <div class="grid gap-1.5 text-sm">
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:00 PM</span><span class="text-white/80">Dirección y bienvenida: Gabriel Hernández y Ebenezer Medina</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:05 - 08:10 PM</span><span class="text-white/80">Oración y lectura: Braylin Santana</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:10 - 08:45 PM</span><span class="text-white/80">Adoración: MPS</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:45 - 09:30 PM</span><span class="text-white/80">Musical: Eliú</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:30 - 09:35 PM</span><span class="text-white/80">Presentación de equipos</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:35 - 09:45 PM</span><span class="text-white/80">Tiempo de expresión de campamento</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:45 - 10:15 PM</span><span class="text-white/80">Competencias (Danza y Voz)</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:15 PM</span><span class="text-white/80">Adoración: MPS / Oración por el predicador: Elvin Coronado</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:20 - 10:50 PM</span><span class="text-white/80">Mensaje / Presentación del Staff</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">11:00 PM</span><span class="text-white/80">Oración de despedida: Elvin Coronado</span></div>
                        </div>
                    </div>
                </div>
            </details>
```

- [ ] **Step 2: Commit**

```bash
git add page/Camp/code.html; git commit -m "feat: itinerario viernes accordion"
```

### Task 3: Add Sábado accordion

**Files:**
- Modify: `page/Camp/code.html` (insert after the Viernes `</details>`)

- [ ] **Step 1: Insert Sábado day accordion**

Insert this block directly after the Viernes `</details>` line:

```html

            <details class="instalacion-folder">
                <summary>
                    <span class="instalacion-folder__icon"><span class="material-icons-outlined text-fire-400">emoji_events</span></span>
                    <span class="flex flex-col leading-tight">
                        <span class="instalacion-folder__title">Sábado · Día 2</span>
                        <span class="instalacion-folder__count">Itinerario + Programa de Capilla</span>
                    </span>
                    <span class="instalacion-folder__chevron material-icons-outlined">expand_more</span>
                </summary>
                <div class="instalacion-folder__body">
                    <div class="p-6 sm:p-8">
                        <div class="flex items-start gap-3 mb-6">
                            <span class="material-icons-outlined text-fire-400">local_fire_department</span>
                            <p class="text-white/70 italic text-sm sm:text-base">Tema: <strong class="text-fire-400 not-italic">Rescate</strong></p>
                        </div>
                        <h4 class="flex items-center gap-2 font-display text-white uppercase tracking-wider text-lg mb-4">
                            <span class="material-icons-outlined text-fire-400">schedule</span> Itinerario del Día
                        </h4>
                        <div class="grid gap-1.5 text-sm">
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">06:00 AM</span><span class="text-white/80">Despertar / Toque de diana</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">06:30 AM</span><span class="text-white/80">Devocional matutino</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">07:30 AM</span><span class="text-white/80">Aseo personal</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">09:00 AM</span><span class="text-white/80">Desayuno</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">09:40 AM</span><span class="text-white/80">Juegos extremos</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">11:15 AM</span><span class="text-white/80">Actividad de niños</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">12:30 PM</span><span class="text-white/80">Almuerzo</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">02:00 PM</span><span class="text-white/80">Competencia deportiva (Voleibol y acuática)</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">03:30 PM</span><span class="text-white/80">Competencia acuática</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">03:30 PM</span><span class="text-white/80">Ensayos en capilla (Equipos: 30 min.)</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">05:00 PM</span><span class="text-white/80">Salida de piscina / Aseo personal</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">08:00 PM</span><span class="text-white/80">Cena y noche especial</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">08:00 PM</span><span class="text-white/80">Culto en capilla</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">10:30 PM</span><span class="text-white/80">Salida de capilla</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">11:00 PM</span><span class="text-white/80">Dominados / Tiempo libre</span></div>
                            <div class="flex items-center gap-4 py-2"><span class="font-display text-fire-400 w-24 flex-shrink-0">11:30 PM</span><span class="text-white/80">Hora de dormir</span></div>
                        </div>
                    </div>
                    <div class="border-t border-fire-700/15 p-6 sm:p-8">
                        <h4 class="flex items-center gap-2 font-display text-white uppercase tracking-wider text-lg mb-4">
                            <span class="material-icons-outlined text-fire-400">church</span> Programa de Capilla · 8:00 PM
                        </h4>
                        <div class="grid gap-1.5 text-sm">
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:00 PM</span><span class="text-white/80">Dirección y bienvenida: Ariel y Sarah</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:05 - 08:10 PM</span><span class="text-white/80">Oración y lectura: Maria Pérez</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:10 - 08:40 PM</span><span class="text-white/80">Adoración: MPS</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:40 - 08:45 PM</span><span class="text-white/80">Competencia (Teatro)</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:05 - 09:35 PM</span><span class="text-white/80">Competencia (Careo)</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:40 - 10:10 PM</span><span class="text-white/80">Adoración: MPS</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:10 PM</span><span class="text-white/80">Oración por el predicador: Sarah Calderón</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:15 - 10:45 PM</span><span class="text-white/80">Mensaje</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">11:50 PM</span><span class="text-white/80">Despedida: Sarah Calderón</span></div>
                        </div>
                    </div>
                </div>
            </details>
```

- [ ] **Step 2: Commit**

```bash
git add page/Camp/code.html; git commit -m "feat: itinerario sábado accordion"
```

### Task 4: Insert Domingo accordion + close section

**Files:**
- Modify: `page/Camp/code.html` (insert after the Sábado `</details>`, before the closing `</div></div></section>` of `#itinerario`)

- [ ] **Step 1: Insert Domingo day accordion + close section**

Append after the last `</details>`:

```html

            <details class="instalacion-folder">
                <summary>
                    <span class="instalacion-folder__icon"><span class="material-icons-outlined text-fire-400">celebration</span></span>
                    <span class="flex flex-col leading-tight">
                        <span class="instalacion-folder__title">Domingo · Día 3</span>
                        <span class="instalacion-folder__count">Itinerario + Programa de Capilla</span>
                    </span>
                    <span class="instalacion-folder__chevron material-icons-outlined">expand_more</span>
                </summary>
                <div class="instalacion-folder__body">
                    <div class="p-6 sm:p-8">
                        <div class="flex items-start gap-3 mb-6">
                            <span class="material-icons-outlined text-fire-400">volunteer_activism</span>
                            <p class="text-white/70 italic text-sm sm:text-base">Tema: <strong class="text-fire-400 not-italic">Los elegidos</strong><br/><span class="text-white/50 text-xs">"No me elegisteis vosotros a mí, sino que yo os elegí a vosotros." — Juan 15:16</span></p>
                        </div>
                        <h4 class="flex items-center gap-2 font-display text-white uppercase tracking-wider text-lg mb-4">
                            <span class="material-icons-outlined text-fire-400">schedule</span> Itinerario del Día
                        </h4>
                        <div class="grid gap-1.5 text-sm">
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">06:30 AM</span><span class="text-white/80">Despertar / Devocional</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">08:30 AM</span><span class="text-white/80">Desayuno</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">09:30 AM</span><span class="text-white/80">Intercesión en capilla</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">10:00 AM</span><span class="text-white/80">Servicio de clausura</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">01:00 PM</span><span class="text-white/80">Salida de capilla</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">01:00 PM</span><span class="text-white/80">Almuerzo de cierre</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">01:00 PM</span><span class="text-white/80">Acto de bautismo</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">03:00 PM</span><span class="text-white/80">Operaciones de piscina / Tarde de despedida</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">04:30 PM</span><span class="text-white/80">Salida de piscina</span></div>
                            <div class="flex items-center gap-4 py-2 border-b border-fire-700/10"><span class="font-display text-fire-400 w-24 flex-shrink-0">05:00 PM</span><span class="text-white/80">Entrega de llaves y limpieza general</span></div>
                            <div class="flex items-center gap-4 py-2"><span class="font-display text-fire-400 w-24 flex-shrink-0">05:30 PM</span><span class="text-white/80">Salida del campamento</span></div>
                        </div>
                    </div>
                    <div class="border-t border-fire-700/15 p-6 sm:p-8">
                        <h4 class="flex items-center gap-2 font-display text-white uppercase tracking-wider text-lg mb-4">
                            <span class="material-icons-outlined text-fire-400">church</span> Programa de Capilla · 8:50 AM
                        </h4>
                        <div class="grid gap-1.5 text-sm">
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">08:50 AM</span><span class="text-white/80">Inicio</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:00 - 09:05 AM</span><span class="text-white/80">Dirección y bienvenida: Karina Comprés y Marcos</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:05 - 09:10 AM</span><span class="text-white/80">Oración y lectura: Tommy Balbuena</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:10 - 09:20 AM</span><span class="text-white/80">Clamor 1: Yohanca | Clamor 2: Amanda</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">09:20 - 10:00 AM</span><span class="text-white/80">Adoración: MPS</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:00 - 10:15 AM</span><span class="text-white/80">Competencia (Coreografía)</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:10 - 10:15 AM</span><span class="text-white/80">Oración por el predicador: Braylin Santana</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">10:15 - 11:20 AM</span><span class="text-white/80">Mensaje</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">11:20 - 11:25 AM</span><span class="text-white/80">Tiempo de júbilo: MPS</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">11:25 - 11:55 AM</span><span class="text-white/80">Premiación con jurado general: Karina Comprés y Emilio de León</span></div>
                            <div class="flex items-start gap-3 py-1.5"><span class="font-display text-fire-400 w-40 flex-shrink-0">11:55 - 12:00 PM</span><span class="text-white/80">Despedida: Braylin Santana</span></div>
                        </div>
                    </div>
                </div>
            </details>

        </div>
    </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add page/Camp/code.html; git commit -m "feat: itinerario domingo section"
```

### Task 5: Final push

- [ ] **Step 1: Push to origin main**

```bash
git push origin main
```

- [ ] **Step 2: Verify in browser**

Open `page/Camp/code.html` in browser and confirm:
1. Nav shows `Itinerario` (desktop + mobile hamburger).
2. Clicking `Itinerario` scrolls to the section.
3. Each day expands on click; content shows both "Itinerario del Día" and "Programa de Capilla".
4. Accordions work independently (details/summary native behavior).
