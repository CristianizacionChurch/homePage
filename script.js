document.addEventListener('DOMContentLoaded', function() {
    // ── Slideshow Hero con controles ────────────────────────
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const dots = document.querySelectorAll('.slideshow-dot');
    let currentSlide = 0;
    let slideshowInterval;
    let slideshowPaused = false;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlideshow() {
        if (slides.length > 1) {
            slideshowInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopSlideshow() {
        clearInterval(slideshowInterval);
    }

    if (slides.length > 1 && dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                stopSlideshow();
                goToSlide(index);
                startSlideshow();
            });
        });

        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', function() {
                slideshowPaused = true;
                stopSlideshow();
            });
            heroSection.addEventListener('mouseleave', function() {
                slideshowPaused = false;
                startSlideshow();
            });
        }

        startSlideshow();
    }

    // ── Mobile Menu ─────────────────────────────────────────
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
        });
    }

    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            navLinksItems.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // ── Navbar Shadow on Scroll ─────────────────────────────
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

    // ── Active Nav Highlight ────────────────────────────────
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

    // ── Scroll Reveal Animation ─────────────────────────────
    const revealElements = document.querySelectorAll(
        '.stat-card, .testimonial-card, .video-card, .team-member, .camp-gallery-item, .verse-card, .event-card'
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

    // ── Dark Mode Toggle ────────────────────────────────────
    const themeToggle = document.querySelector('.theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const html = document.documentElement;

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    function setTheme(theme) {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ── Prayer Form (proxy server-side) ─────────────────────
    const prayerForm = document.getElementById('prayer-form');
    const prayerSuccess = document.getElementById('prayer-success');
    const prayerError = document.getElementById('prayer-error');

    if (prayerForm) {
        prayerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const nameInput = this.querySelector('input[name="nombre"]');
            const textarea = this.querySelector('textarea');
            const submitBtn = this.querySelector('button[type="submit"]');
            const name = nameInput.value.trim();
            const message = textarea.value.trim();

            if (!name || name.length > 100) {
                prayerError.textContent = 'Por favor, escribe tu nombre (máximo 100 caracteres).';
                prayerError.classList.add('visible');
                prayerSuccess.classList.remove('visible');
                return;
            }

            if (!message || message.length > 1000) {
                prayerError.textContent = 'Por favor, escribe tu petición de oración (máximo 1000 caracteres).';
                prayerError.classList.add('visible');
                prayerSuccess.classList.remove('visible');
                return;
            }

            const sanitize = (str) => str.replace(/[<>]/g, '');
            const safeName = sanitize(name);
            const safeMessage = sanitize(message);

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            prayerError.classList.remove('visible');
            prayerSuccess.classList.remove('visible');

            try {
                const response = await fetch('/api/prayer-request', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre: safeName, peticion: safeMessage })
                });

                if (response.ok) {
                    prayerSuccess.classList.add('visible');
                    nameInput.value = '';
                    textarea.value = '';
                } else {
                    prayerError.textContent = 'Hubo un error al enviar. Intenta de nuevo más tarde.';
                    prayerError.classList.add('visible');
                }
            } catch (error) {
                prayerError.textContent = 'No se pudo conectar. Verifica tu conexión a internet.';
                prayerError.classList.add('visible');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Petición';
            }
        });
    }

    // ── Newsletter Form ─────────────────────────────────────
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Por favor, ingresa un correo electrónico válido.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Suscribiendo...';

            try {
                const response = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    alert('¡Gracias por suscribirte! Recibirás nuestro boletín semanal.');
                    emailInput.value = '';
                } else {
                    alert('Hubo un error al suscribirte. Intenta de nuevo más tarde.');
                }
            } catch (error) {
                alert('No se pudo conectar. Verifica tu conexión a internet.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Suscribirse';
            }
        });
    }

    // ── YouTube Facade ─────────────────────────────────────
    document.querySelectorAll('.youtube-facade').forEach(facade => {
        function activateVideo() {
            const videoId = facade.dataset.videoId;
            const iframe = document.createElement('iframe');
            const safeVideoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
            iframe.src = `https://www.youtube.com/embed/${safeVideoId}?autoplay=1&rel=0`;
            iframe.title = facade.getAttribute('aria-label') || 'Video';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
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

    // ── Live YouTube Player ─────────────────────────────────
    const playLiveBtn = document.getElementById('play-live');
    const livePlayer = document.getElementById('live-player');

    if (playLiveBtn && livePlayer) {
        playLiveBtn.addEventListener('click', function() {
            const iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube.com/embed/live_stream?channel=UCxxxxxxxxxxxxxxxxxxxxxxx&autoplay=1';
            iframe.title = 'Transmisión en vivo - Iglesia Comunitaria de la Cristianización';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0';
            livePlayer.innerHTML = '';
            livePlayer.appendChild(iframe);
        });

        playLiveBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playLiveBtn.click();
            }
        });
    }

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

    // ── Smooth Scroll ───────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!/^#[a-zA-Z][a-zA-Z0-9_-]*$/.test(href)) return;
            const target = document.querySelector(href);
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
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Visor de imágenes del campamento');
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
        const alts = Array.from(galleryItems).map(img => img.alt);

        function openLightbox(idx) {
            currentIdx = idx;
            lbImg.src = srcs[currentIdx];
            lbImg.alt = alts[currentIdx] || 'Foto del campamento';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            lbClose.focus();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function navigate(dir) {
            currentIdx = (currentIdx + dir + srcs.length) % srcs.length;
            lbImg.src = srcs[currentIdx];
            lbImg.alt = alts[currentIdx] || 'Foto del campamento';
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

    // ── Versículo del Día ───────────────────────────────────
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

    // ── Compartir Versículo ─────────────────────────────────
    const shareVerseBtn = document.getElementById('share-verse');
    const copyVerseBtn = document.getElementById('copy-verse');

    if (shareVerseBtn) {
        shareVerseBtn.addEventListener('click', async function() {
            const verseContent = document.getElementById('verse-content');
            const verseReference = document.getElementById('verse-reference');
            if (!verseContent || !verseReference) return;

            const text = `"${verseContent.textContent}" — ${verseReference.textContent.replace('— ', '')}`;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Versículo del Día',
                        text: text,
                        url: window.location.href
                    });
                } catch (e) {
                    if (e.name !== 'AbortError') {
                        copyToClipboard(text);
                    }
                }
            } else {
                copyToClipboard(text);
            }
        });
    }

    if (copyVerseBtn) {
        copyVerseBtn.addEventListener('click', function() {
            const verseContent = document.getElementById('verse-content');
            const verseReference = document.getElementById('verse-reference');
            if (!verseContent || !verseReference) return;

            const text = `"${verseContent.textContent}" — ${verseReference.textContent.replace('— ', '')}`;
            copyToClipboard(text);
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                alert('¡Versículo copiado al portapapeles!');
            }).catch(() => {
                fallbackCopy(text);
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('¡Versículo copiado al portapapeles!');
        } catch (e) {
            alert('No se pudo copiar el versículo.');
        }
        document.body.removeChild(textarea);
    }

    // ── Service Worker Registration ─────────────────────────
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js').catch(function(error) {
                console.log('Service Worker registration failed:', error);
            });
        });
    }
});
