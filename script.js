document.addEventListener('DOMContentLoaded', function() {
    // ── Slideshow Hero ─────────────────────────────────────
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if (slides.length > 1) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000); // cambia cada 5 segundos
    }

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

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });

    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksItems.forEach(item => item.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    const prayerForm = document.getElementById('prayer-form');
    
    if (prayerForm) {
        prayerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            const submitBtn = this.querySelector('button[type="submit"]');
            const message = textarea.value.trim();
            
            if (!message) {
                alert('Por favor, escribe tu petición de oración.');
                return;
            }

            // Deshabilitar botón mientras envía
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                const response = await fetch(this.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    body: JSON.stringify({ peticion: message })
                });

                if (response.ok) {
                    alert('¡Gracias por tu petición! Nuestro equipo de intercesión estará orando por ti.');
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

    const campamentoBtns = document.querySelectorAll('.card .btn-secondary');
    
    campamentoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cardTitle = this.closest('.card-content').querySelector('h3').textContent;
            alert(`¡Gracias por tu interés en el ${cardTitle}! Pronto nos pondremos en contacto contigo.`);
        });
    });

    const playButtons = document.querySelectorAll('.play-button, .play-button-large');
    
    playButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Reproductor de video - Aquí se reproduciría el video de la prédica o transmisión en vivo.');
        });
    });

    function animateOnScroll() {
        const elements = document.querySelectorAll('.card, .video-card, .team-member');
        
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }

    const cards = document.querySelectorAll('.card, .video-card, .team-member');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const liveViewers = document.querySelector('.viewers span');
    if (liveViewers) {
        let viewers = 234;
        setInterval(() => {
            const change = Math.floor(Math.random() * 10) - 5;
            viewers = Math.max(200, viewers + change);
            liveViewers.textContent = `${viewers} viendo ahora`;
        }, 5000);
    }

    // ── Versículo del Día (se actualiza a las 6 AM) ───────
    async function loadDailyVerse() {
        const verseContent = document.getElementById('verse-content');
        const verseReference = document.getElementById('verse-reference');

        if (!verseContent || !verseReference) return;

        // Calcular la clave de fecha con reset a las 6 AM
        function getDateKey() {
            const now = new Date();
            if (now.getHours() < 6) {
                now.setDate(now.getDate() - 1);
            }
            return now.toISOString().split('T')[0];
        }

        const dateKey = getDateKey();

        // Intentar leer del cache local primero
        try {
            const cached = JSON.parse(localStorage.getItem('dailyVerse'));
            if (cached && cached.date === dateKey) {
                verseContent.textContent = cached.content;
                verseContent.classList.remove('loading');
                verseReference.textContent = '— ' + cached.reference;
                scheduleNextRefresh();
                return;
            }
        } catch (e) { /* cache inválido, continuar */ }

        // Fetch desde nuestro servidor proxy (nunca expone la API key)
        verseContent.classList.add('loading');
        try {
            const response = await fetch('/api/daily-verse');
            if (!response.ok) throw new Error('Error en respuesta');

            const data = await response.json();

            verseContent.textContent = data.content;
            verseContent.classList.remove('loading');
            verseReference.textContent = '— ' + data.reference;

            // Guardar en localStorage
            localStorage.setItem('dailyVerse', JSON.stringify({
                content: data.content,
                reference: data.reference,
                date: data.date || dateKey
            }));
        } catch (error) {
            console.warn('No se pudo cargar el versículo:', error.message);

            // Fallback local si el servidor no está disponible
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

    // Programar recarga automática a las 6 AM
    function scheduleNextRefresh() {
        const now = new Date();
        const next6AM = new Date(now);
        next6AM.setHours(6, 0, 0, 0);

        // Si ya pasaron las 6 AM hoy, programar para mañana
        if (now >= next6AM) {
            next6AM.setDate(next6AM.getDate() + 1);
        }

        const msUntil6AM = next6AM - now;

        // Solo programar si la pestaña permanecerá abierta (máx 24h)
        if (msUntil6AM <= 86400000) {
            setTimeout(() => {
                localStorage.removeItem('dailyVerse');
                loadDailyVerse();
            }, msUntil6AM);
        }
    }

    loadDailyVerse();
});
