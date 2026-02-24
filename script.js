document.addEventListener('DOMContentLoaded', function() {
    // ── Slideshow Hero (solo anima opacity, GPU-friendly) ───
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    // ── Mobile Menu ─────────────────────────────────────────
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }

    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            navLinksItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ── Navbar Shadow on Scroll (passive + rAF debounce) ───
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar.style.boxShadow = window.scrollY > 50
                    ? '0 4px 20px rgba(0, 0, 0, 0.1)'
                    : '0 2px 10px rgba(0, 0, 0, 0.05)';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ── Active Nav Highlight (IntersectionObserver) ─────────
    const sections = document.querySelectorAll('section[id]');
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (navLink) {
                    navLinksItems.forEach(item => item.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-70px 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => navObserver.observe(section));

    // ── Scroll Reveal Animation (IntersectionObserver) ─────
    const revealElements = document.querySelectorAll(
        '.stat-card, .testimonial-card, .video-card, .team-member, .camp-gallery-item, .verse-card'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Prayer Form (Formspree via fetch) ──────────────────
    const prayerForm = document.getElementById('prayer-form');

    if (prayerForm) {
        prayerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nameInput = this.querySelector('input[name="nombre"]');
            const textarea = this.querySelector('textarea');
            const submitBtn = this.querySelector('button[type="submit"]');
            const name = nameInput.value.trim();
            const message = textarea.value.trim();

            if (!name) {
                alert('Por favor, escribe tu nombre.');
                return;
            }

            if (!message) {
                alert('Por favor, escribe tu petición de oración.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: name, peticion: message })
                });

                if (response.ok) {
                    alert('¡Gracias por tu petición! Nuestro equipo de intercesión estará orando por ti.');
                    nameInput.value = '';
                    textarea.value = '';
                } else {
                    alert('Hubo un error al enviar. Intenta de nuevo más tarde.');
                }
            } catch (error) {
                alert('No se pudo conectar. Verifica tu conexión a internet.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Petición';
            }
        });
    }

    // ── YouTube Facade (lite embed - no iframe until click) ─
    document.querySelectorAll('.youtube-facade').forEach(facade => {
        function activateVideo() {
            const videoId = facade.dataset.videoId;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            iframe.title = facade.getAttribute('aria-label') || 'Video';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0';
            facade.replaceWith(iframe);
        }

        facade.addEventListener('click', activateVideo);
        facade.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateVideo();
            }
        });
    });

    // ── Play Button Alerts ──────────────────────────────────
    const playButtons = document.querySelectorAll('.play-button, .play-button-large');
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Reproductor de video - Aquí se reproduciría el video de la prédica o transmisión en vivo.');
        });
    });

    // ── Live Viewers Counter ────────────────────────────────
    const liveViewers = document.querySelector('.viewers span');
    if (liveViewers) {
        let viewers = 234;
        setInterval(() => {
            const change = Math.floor(Math.random() * 10) - 5;
            viewers = Math.max(200, viewers + change);
            liveViewers.textContent = `${viewers} viendo ahora`;
        }, 5000);
    }

    // ── Smooth Scroll for Anchor Links ──────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ── Gallery Lightbox ────────────────────────────────────
    const galleryItems = document.querySelectorAll('.camp-gallery-item img');

    if (galleryItems.length > 0) {
        // Build lightbox DOM once
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Cerrar">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Anterior">&#8249;</button>
            <img src="" alt="Foto del campamento">
            <button class="lightbox-nav lightbox-next" aria-label="Siguiente">&#8250;</button>
        `;
        document.body.appendChild(lightbox);

        const lbImg = lightbox.querySelector('img');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const lbPrev = lightbox.querySelector('.lightbox-prev');
        const lbNext = lightbox.querySelector('.lightbox-next');
        let currentIdx = 0;
        const srcs = Array.from(galleryItems).map(img => img.src);

        function openLightbox(idx) {
            currentIdx = idx;
            lbImg.src = srcs[currentIdx];
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIdx = (currentIdx + dir + srcs.length) % srcs.length;
            lbImg.src = srcs[currentIdx];
        }

        galleryItems.forEach((img, idx) => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => openLightbox(idx));
        });

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
        lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        });
    }

    // ── Versículo del Día (se actualiza a las 6 AM) ────────
    async function loadDailyVerse() {
        const verseContent = document.getElementById('verse-content');
        const verseReference = document.getElementById('verse-reference');

        if (!verseContent || !verseReference) return;

        function getDateKey() {
            const now = new Date();
            if (now.getHours() < 6) {
                now.setDate(now.getDate() - 1);
            }
            return now.toISOString().split('T')[0];
        }

        const dateKey = getDateKey();

        // Cache local primero
        try {
            const cached = JSON.parse(localStorage.getItem('dailyVerse'));
            if (cached && cached.date === dateKey) {
                verseContent.textContent = cached.content;
                verseContent.classList.remove('loading');
                verseReference.textContent = '— ' + cached.reference;
                scheduleNextRefresh();
                return;
            }
        } catch (e) { /* cache inválido */ }

        verseContent.classList.add('loading');
        try {
            const response = await fetch('/api/daily-verse');
            if (!response.ok) throw new Error('Error en respuesta');

            const data = await response.json();

            verseContent.textContent = data.content;
            verseContent.classList.remove('loading');
            verseReference.textContent = '— ' + data.reference;

            localStorage.setItem('dailyVerse', JSON.stringify({
                content: data.content,
                reference: data.reference,
                date: data.date || dateKey
            }));
        } catch (error) {
            console.warn('No se pudo cargar el versículo:', error.message);

            const fallbacks = [
                { ref: 'Juan 3:16', text: 'Porque de tal manera amó Dios al mundo, que ha dado á su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.' },
                { ref: 'Salmos 23:1', text: 'Jehová es mi pastor; nada me faltará.' },
                { ref: 'Filipenses 4:13', text: 'Todo lo puedo en Cristo que me fortalece.' },
                { ref: 'Romanos 8:28', text: 'Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien.' },
                { ref: 'Isaías 41:10', text: 'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo.' }
            ];

            const dayIndex = new Date().getDate() % fallbacks.length;
            const fb = fallbacks[dayIndex];

            verseContent.textContent = fb.text;
            verseContent.classList.remove('loading');
            verseReference.textContent = '— ' + fb.ref;
        }

        scheduleNextRefresh();
    }

    function scheduleNextRefresh() {
        const now = new Date();
        const next6AM = new Date(now);
        next6AM.setHours(6, 0, 0, 0);

        if (now >= next6AM) {
            next6AM.setDate(next6AM.getDate() + 1);
        }

        const msUntil6AM = next6AM - now;

        if (msUntil6AM <= 86400000) {
            setTimeout(() => {
                localStorage.removeItem('dailyVerse');
                loadDailyVerse();
            }, msUntil6AM);
        }
    }

    loadDailyVerse();
});
