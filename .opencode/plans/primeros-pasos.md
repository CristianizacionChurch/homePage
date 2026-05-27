# Plan: Módulo "Primeros Pasos en el Cristianismo"

## Contexto Teológico - Iglesia Comunitaria de la Cristianización

**Misión:** Cumplir la gran comisión de Jesucristo, llevando el evangelio a toda la comunidad, haciendo discípulos, fortaleciendo los valores cristianos, equipando a las personas para que impacten positivamente su entorno y mejoren su calidad de vida socio-espiritual. (Mateo 28:19-20)

**¿Qué es la Cristianización?** El plan supremo de Dios de sujetar todas las cosas al señorío de Jesucristo. (1 Corintios 15:25-28)

**Visión:** Ser una iglesia que, a través del evangelio de Jesucristo, impacte positivamente a las familias de la comunidad, transformándolas y capacitándolas para mejorar su calidad de vida socio-espiritual. (Efesios 4:11-16)

---

## Resumen
Implementar un módulo de aprendizaje con estructura teórica, videos de YouTube (canales conocidos en español), lecturas bíblicas específicas y preguntas de reflexión, disponible tanto como sección destacada en la página principal como página dedicada completa, con seguimiento de progreso local (localStorage).

---

## Arquitectura

### 1. Sección Destacada en index.html
- Ubicación: Nueva sección entre las existentes
- Contenido: Preview con lecciones destacadas + CTA "Ver curso completo"
- Diseño: Cards con icono + título + descripción breve

### 2. Página Dedicada Completa
- Ruta: `page/primeros-pasos/index.html`
- Estructura: Lista completa de módulos/lecciones con videos
- Funcionalidad: Sistema de progreso con localStorage

---

## Estructura de Contenido

### Módulo 1: Fundamentos de la Fe
1. **¿Quién es Jesús?** - La persona y obra de Cristo
   - Lectura: Juan 1:1-18, Filipenses 2:5-11
   - Video: Canal conocido en español
   
2. **La Biblia** - La Palabra de Dios para nosotros
   - Lectura: 2 Timoteo 3:16-17, Salmo 119:105
   - Video: Canal conocido en español
   
3. **El Pecado y la Gracia** - Nuestra necesidad de salvación
   - Lectura: Romanos 3:23, Romanos 6:23, Efesios 2:8-9
   - Video: Canal conocido en español

### Módulo 2: La Salvación
4. **El Plan de Salvación** - Cómo recibir a Cristo
   - Lectura: Juan 3:16, Romanos 10:9-10, Apocalipsis 3:20
   - Video: Canal conocido en español
   
5. **Arrepentimiento y Fe** - Los dos pilares de la conversión
   - Lectura: Hechos 3:19, Hebreos 11:1, Santiago 2:17
   - Video: Canal conocido en español
   
6. **Seguridad de la Salvación** - Certeza bíblica
   - Lectura: 1 Juan 5:13, Romanos 8:38-39, Juan 10:28-29
   - Video: Canal conocido en español

### Módulo 3: Vida Cristiana Básica
7. **El Bautismo** - Obediencia y testimonio público
   - Lectura: Mateo 28:19, Hechos 2:38, Romanos 6:3-4
   - Video: Canal conocido en español
   
8. **La Oración** - Comunicación con Dios
   - Lectura: Mateo 6:5-13, Filipenses 4:6-7, 1 Tesalonicenses 5:17
   - Video: Canal conocido en español
   
9. **La Lectura Bíblica** - Alimentación espiritual diaria
   - Lectura: Josué 1:8, Salmo 1:1-3, Hebreos 4:12
   - Video: Canal conocido en español

### Módulo 4: Crecimiento y Comunidad
10. **El Espíritu Santo** - Nuestro ayudador y guía
    - Lectura: Juan 14:16-17, Hechos 1:8, Gálatas 5:22-23
    - Video: Canal conocido en español
    
11. **La Iglesia** - El cuerpo de Cristo
    - Lectura: 1 Corintios 12:12-27, Hebreos 10:24-25, Efesios 4:11-16
    - Video: Canal conocido en español
    
12. **Discipulado** - Crecer y multiplicarse (La Gran Comisión)
    - Lectura: Mateo 28:19-20, 2 Timoteo 2:2, Hechos 1:8
    - Video: Canal conocido en español

---

## Preguntas de Reflexión (Ejemplos)

### Lección 1: ¿Quién es Jesús?
1. ¿Cómo cambió tu comprensión de quién es Jesús después de esta lección?
2. ¿Qué aspecto del carácter de Jesús te impacta más y por qué?
3. ¿Cómo puedes aplicar el ejemplo de Jesús en tu vida diaria esta semana?

### Lección 12: Discipulado
1. ¿Quién en tu vida necesita escuchar el mensaje de Cristo?
2. ¿Cómo puedes cumplir la Gran Comisión en tu comunidad esta semana?
3. ¿Qué pasos concretos darás para ayudar a otros a crecer en su fe?

---

## Archivos a Crear/Modificar

### Nuevos
```
page/primeros-pasos/
├── index.html          (página completa del módulo)
├── styles.css          (estilos específicos)
└── script.js           (lógica de progreso y UI)
```

### Modificaciones
```
index.html              (nueva sección destacada + link en navegación)
styles.css              (estilos para sección preview)
script.js               (navegación activa para nueva sección)
```

---

## Especificaciones Técnicas

### Datos en localStorage
```json
{
  "primerosPasos": {
    "completedLessons": [1, 3, 5],
    "lastAccessed": "2026-05-27T10:30:00Z",
    "progress": 25
  }
}
```

### Card de Lección
- Thumbnail de YouTube + overlay de play
- Título y descripción
- Duración estimada (video + lectura)
- Botón "Marcar como completada" (toggle)
- Indicador visual de estado (checkmark verde)

### Barra de Progreso
- Visual: barra con porcentaje de avance
- Texto: "X de 12 lecciones completadas (Y%)"
- Animación suave al actualizar

### Modal de Video
- Iframe de YouTube al hacer click en thumbnail
- Overlay oscuro de fondo
- Botón cerrar (X) y tecla Escape
- Auto-focus al abrir

---

## Diseño Visual

### Colores (consistente con sitio actual)
- Azul primario: `#000080`
- Verde éxito: `#28a745` (completado)
- Gris: `#6c757d` (pendiente)
- Fondo cards: blanco / `#1a1a1a` (dark mode)

### Responsive
- Mobile (<768px): 1 columna, cards apiladas
- Tablet (768-1024px): 2 columnas
- Desktop (>1024px): 3 columnas

### Accesibilidad
- ARIA labels en botones
- `role="progressbar"` en barra
- Focus visible en teclado
- Contraste WCAG AA
- Estructura semántica HTML5

---

## Plan de Implementación

### Fase 1: Página Dedicada
1. Crear `page/primeros-pasos/index.html` con estructura semántica
2. Crear `page/primeros-pasos/styles.css` con estilos
3. Crear `page/primeros-pasos/script.js` con lógica de progreso
4. Implementar 12 lecciones con videos de YouTube

### Fase 2: Integración en Principal
5. Agregar sección preview en `index.html`
6. Agregar link "Primeros Pasos" en navegación
7. Agregar estilos para preview en `styles.css` global

### Fase 3: Testing
8. Probar responsive (mobile/tablet/desktop)
9. Verificar dark mode
10. Probar progreso localStorage
11. Validar accesibilidad

---

## Preguntas Pendientes

1. **¿Videos de YouTube específicos?**
   - Opción A: Canales conocidos en español (Paul Washer, John Piper, etc.)
   - Opción B: Videos propios de la iglesia
   - Opción C: Mezcla de ambos

2. **¿Incluir lecturas bíblicas específicas por lección?**

3. **¿Incluir preguntas de reflexión al final de cada lección?**

4. **¿Certificado descargable al completar todas las lecciones?**
