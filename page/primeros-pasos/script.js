document.addEventListener('DOMContentLoaded', function() {
    const STORAGE_KEY = 'primerosPasos';
    const TOTAL_LESSONS = 12;
    
    function getProgress() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return { completedLessons: [], lastAccessed: null };
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed.completedLessons)) {
                return { completedLessons: [], lastAccessed: null };
            }
            return parsed;
        } catch (e) {
            console.warn('Error reading progress:', e);
            return { completedLessons: [], lastAccessed: null };
        }
    }
    
    function saveProgress(progress) {
        try {
            progress.lastAccessed = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
            return true;
        } catch (e) {
            console.warn('Error saving progress:', e);
            return false;
        }
    }
    
    function updateProgressBar() {
        const progress = getProgress();
        const uniqueLessons = [...new Set(progress.completedLessons)];
        const completedCount = uniqueLessons.length;
        const percentage = Math.round((completedCount / TOTAL_LESSONS) * 100);
        
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
            progressFill.setAttribute('aria-valuenow', percentage);
        }
        
        if (progressText) {
            progressText.textContent = `${completedCount} de ${TOTAL_LESSONS} lecciones completadas (${percentage}%)`;
        }
        
        if (completedCount === TOTAL_LESSONS) {
            const completionMessage = document.getElementById('completion-message');
            if (completionMessage) {
                completionMessage.style.display = 'block';
            }
        }
    }
    
    function initLessonCards() {
        const progress = getProgress();
        const lessonCards = document.querySelectorAll('.lesson-card');
        
        lessonCards.forEach(card => {
            const lessonId = parseInt(card.dataset.lessonId);
            
            if (progress.completedLessons.includes(lessonId)) {
                card.classList.add('completed');
            }
            
            const completeBtn = card.querySelector('.btn-complete');
            if (completeBtn) {
                completeBtn.addEventListener('click', function() {
                    toggleLesson(lessonId, card);
                });
            }
        });
    }
    
    function toggleLesson(lessonId, card) {
        const progress = getProgress();
        const index = progress.completedLessons.indexOf(lessonId);
        
        if (index === -1) {
            progress.completedLessons.push(lessonId);
            card.classList.add('completed');
        } else {
            progress.completedLessons.splice(index, 1);
            card.classList.remove('completed');
        }
        
        saveProgress(progress);
        updateProgressBar();
    }
    
    function initVideoModal() {
        const modal = document.getElementById('video-modal');
        const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
        const modalClose = modal ? modal.querySelector('.modal-close') : null;
        const videoContainer = modal ? modal.querySelector('.video-container') : null;
        
        if (!modal || !videoContainer) return;
        
        const videoThumbnails = document.querySelectorAll('.video-thumbnail');
        
        videoThumbnails.forEach(thumbnail => {
            function openVideo() {
                const videoId = thumbnail.dataset.videoId;
                if (!videoId || !/^[a-zA-Z0-9_-]+$/.test(videoId)) return;
                
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
                iframe.title = thumbnail.getAttribute('aria-label') || 'Video';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.referrerPolicy = 'strict-origin-when-cross-origin';
                iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups');
                
                videoContainer.innerHTML = '';
                videoContainer.appendChild(iframe);
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                if (modalClose) modalClose.focus();
            }
            
            thumbnail.addEventListener('click', openVideo);
            thumbnail.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openVideo();
                }
            });
        });
        
        function closeModal() {
            modal.style.display = 'none';
            videoContainer.innerHTML = '';
            document.body.style.overflow = '';
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });
    }
    
    function initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        const html = document.documentElement;
        
        if (!themeToggle) return;
        
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
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme') || 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }
    
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (!mobileMenuBtn || !navLinks) return;
        
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
        });
        
        const navLinksItems = document.querySelectorAll('.nav-links a');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
    
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.lesson-card');
        
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
    }
    
    initLessonCards();
    updateProgressBar();
    initVideoModal();
    initThemeToggle();
    initMobileMenu();
    initScrollReveal();
});
