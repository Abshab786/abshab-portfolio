/**
 * AB SHAB Portfolio - Optimized Performance Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('preloader');
    const splashShown = sessionStorage.getItem('splashShown');

    // 1. IMMEDIATE ACTIONS (Theme & Layout)
    initTheme();
    initMobileMenu();

    // 2. SPLASH SCREEN CONTROL
    if (splashShown) {
        if (splash) splash.remove(); // Remove from DOM completely to save memory
        document.body.style.overflow = 'auto';
        initScrollEffects();
    } else {
        document.body.style.overflow = 'hidden';
        runPremiumSplash();
    }

    // --- Core Functions ---

    function initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark-mode');
        }
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('dark-mode');
                localStorage.setItem('theme', document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
            });
        }
    }

    function initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (!menuBtn || !navLinks) return;

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const icon = menuBtn.querySelector('i');
            icon.setAttribute('data-lucide', navLinks.classList.contains('active') ? 'x' : 'menu');
            lucide.createIcons();
        });

        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    }

    function runPremiumSplash() {
        const typewriter = document.getElementById('code-typing-engine');
        const bar = document.getElementById('progress-fill-premium');
        const pct = document.getElementById('pct-counter-ui');
        const statusText = document.getElementById('loading-msg-ui');

        const code = `object Abshab {
    val brand = "AB SHAB"
    val mission = "High Quality Digital Solutions"
    val expertise = listOf("Android", "Web", "Software")
    val status = "Ready to Launch"
}
Brand.initialize()`;

        let charIdx = 0;
        let progress = 0;

        // Optimized Typing & Progress
        const timer = setInterval(() => {
            if (charIdx < code.length) {
                typewriter.textContent += code.charAt(charIdx);
                charIdx++;
            }

            if (progress < 100) {
                progress += (charIdx / code.length) > (progress/100) ? 1.5 : 0.5;
                const p = Math.floor(Math.min(progress, 100));
                if (bar) bar.style.width = `${p}%`;
                if (pct) pct.textContent = `${p}%`;
                if (p > 80 && statusText) statusText.textContent = "Launching...";
            }

            if (charIdx >= code.length && progress >= 100) {
                clearInterval(timer);
                setTimeout(exitSplash, 500);
            }
        }, 20);

        initCanvas(); // Run particles only during splash
    }

    function exitSplash() {
        sessionStorage.setItem('splashShown', 'true');
        splash.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.remove();
            document.body.style.overflow = 'auto';
            initScrollEffects();
        }, 600);
    }

    function initScrollEffects() {
        // Intersection Observer for Reveal (Butter Smooth)
        const observerOptions = { threshold: 0.15 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (entry.target.classList.contains('stats')) animateCounters(entry.target);
                    observer.unobserve(entry.target); // Run once for performance
                }
            });
        }, observerOptions);

        document.querySelectorAll('section, .reveal, .skill-card, .project-card, .service-card, .bento-card-wrapper, .glass-card, .footer').forEach(el => {
            observer.observe(el);
        });

        // Scroll Progress & Back to Top
        const scrollBar = document.getElementById('scrollBar');
        const btt = document.getElementById('backToTop');

        window.addEventListener('scroll', () => {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollBar) scrollBar.style.width = (winScroll / height * 100) + "%";
            if (btt) btt.classList.toggle('visible', winScroll > 600);
        }, { passive: true }); // Optimized scroll listener

        if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    function animateCounters(container) {
        container.querySelectorAll('.count:not(.counted)').forEach(count => {
            count.classList.add('counted');
            const target = +count.getAttribute('data-target');
            let current = 0;
            const step = target / 50;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    count.innerText = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    count.innerText = Math.floor(current).toLocaleString();
                }
            }, 30);
        });
    }

    function initCanvas() {
        const canvas = document.getElementById('particle-canvas-new');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        for(let i=0; i<30; i++) particles.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, v: Math.random()*0.5+0.2, s: Math.random()*2 });

        function anim() {
            if (!document.getElementById('preloader')) return; // Stop if splash is gone
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "rgba(139, 92, 246, 0.2)";
            particles.forEach(p => {
                p.y -= p.v; if(p.y < 0) p.y = canvas.height;
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill();
            });
            requestAnimationFrame(anim);
        }
        anim();
    }

    // Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.innerText = "Sending...";
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(new FormData(contactForm)))
            }).then(() => {
                document.getElementById('formStatus').innerText = "Message Sent!";
                contactForm.reset();
            }).finally(() => {
                btn.disabled = false;
                btn.innerText = "Send Transmission";
            });
        });
    }
});
