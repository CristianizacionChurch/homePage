document.addEventListener('DOMContentLoaded', function() {
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
        prayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('textarea');
            const message = textarea.value.trim();
            
            if (message) {
                alert('¡Gracias por tu petición! Nuestro equipo de intercesión estará orando por ti.');
                textarea.value = '';
            } else {
                alert('Por favor, escribe tu petición de oración.');
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
});
