# Favicon + Logo Oficial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use `img/favicon.svg` as the camp page favicon and official logo in code.html and trend.html, making the nav logo clickable to top.

**Architecture:** Single-file edits. Reuse `img/favicon.svg` (relative path `../../img/favicon.svg` from `page/Camp/`). Wrap nav logos in `<a href="#inicio">`.

**Tech Stack:** HTML, SVG, Tailwind.

**Note:** NO commit/push until user says so.

---

## File Map

| Action | File | Location |
|--------|------|----------|
| Modify | `page/Camp/code.html` | Head: ~line 6 (favicon link) |
| Modify | `page/Camp/code.html` | Nav ~line 508 (logo) |
| Modify | `page/Camp/code.html` | Footer ~line 1502 (logo) |
| Modify | `page/Camp/trend.html` | Head (favicon) + Nav ~line 88 (logo) |

---

### Task 1: Favicon + nav logo + footer logo in code.html

**Files:** `page/Camp/code.html`

- [ ] **Step 1: Add favicon link in head**

After `<title>MAYDAY: Misión Rescate - Campamento Juvenil 2026</title>`, add:
```html
<link rel="icon" type="image/svg+xml" href="../../img/favicon.svg"/>
```

- [ ] **Step 2: Replace nav logo with clickable link to #inicio**

Find the nav logo (line 508):
```
                <img src="logotransparete.png" alt="MAYDAY Misión Rescate" class="h-12 sm:h-14 w-auto drop-shadow-md flex-shrink-0" />
```
Replace with:
```
                <a href="#inicio" aria-label="Ir al inicio" class="flex-shrink-0">
                    <img src="../../img/favicon.svg" alt="MAYDAY Misión Rescate" class="h-12 sm:h-14 w-auto object-contain" />
                </a>
```

- [ ] **Step 3: Replace footer logo (remove brightness filter)**

Find the footer logo (line 1502):
```
                    <img src="logotransparete.png" alt="MAYDAY" class="h-12 w-auto brightness-200" style="filter: brightness(10);" />
```
Replace with:
```
                    <img src="../../img/favicon.svg" alt="MAYDAY 2026" class="h-12 w-auto" />
```

---

### Task 2: Favicon + nav logo in trend.html

**Files:** `page/Camp/trend.html`

- [ ] **Step 1: Add favicon link in head**

After `<title>TREND - Generador | MAYDAY: Misión Rescate 2026</title>`, add:
```html
<link rel="icon" type="image/svg+xml" href="../../img/favicon.svg"/>
```

- [ ] **Step 2: Replace nav logo with clickable link to code.html**

Find the nav logo (line 88):
```
                <img src="logotransparete.png" alt="MAYDAY Misión Rescate" class="h-12 sm:h-14 w-auto drop-shadow-md flex-shrink-0" />
```
Replace with:
```
                <a href="code.html" aria-label="Ir al campamento" class="flex-shrink-0">
                    <img src="../../img/favicon.svg" alt="MAYDAY Misión Rescate" class="h-12 sm:h-14 w-auto object-contain" />
                </a>
```

---

### Task 3: Verify in browser

- [ ] Open `page/Camp/code.html` and confirm:
  1. Favicon appears in browser tab
  2. Nav shows new logo
  3. Clicking nav logo scrolls to top (#inicio)
  4. Footer shows full-color logo (no white filter)
  5. `trend.html` has favicon and clicking logo goes to code.html
