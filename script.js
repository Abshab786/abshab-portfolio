/**
 * AB SHAB Portfolio Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. WORLD-CLASS PREMIUM SPLASH SCREEN LOGIC
    const typewriter = document.getElementById('code-typing-engine');
    const bar = document.getElementById('progress-fill-premium');
    const pct = document.getElementById('pct-counter-ui');
    const statusText = document.getElementById('loading-msg-ui');
    const splash = document.getElementById('preloader');

    // Ensure body is not scrollable during splash
    document.body.style.overflow = 'hidden';

    const codeSnippet = `object Abshab {
    val name = "AB SHAB"
    val role = "Founder & Lead Android Developer"
    val mission = "Building Beautiful Android Experiences"
    val stack = listOf(
        "Kotlin", "Jetpack Compose",
        "Firebase", "MVVM", "REST API"
    )
}
Portfolio.launch()`;

    const loadingPhases = [
        "Initializing Portfolio...",
        "Loading Android Stack...",
        "Loading Components...",
        "Compiling Creativity...",
        "Optimizing Performance...",
        "Launching Portfolio..."
    ];

    let charIdx = 0;
    let progress = 0;
    let isTypingDone = false;

    function startPremiumSplash() {
        const typeInterval = setInterval(() => {
            if (typewriter && charIdx < codeSnippet.length) {
                typewriter.textContent += codeSnippet.charAt(charIdx);
                charIdx++;
            } else {
                clearInterval(typeInterval);
                isTypingDone = true;
            }
        }, 15);
    }

    // Sync progress with typing and time
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            // Calculate typing progress
            let typingProgress = (charIdx / codeSnippet.length) * 100;

            // Advance progress bar
            if (progress < typingProgress) {
                progress += 1.2;
            } else {
                progress += 0.3;
            }

            if (progress > 100) progress = 100;

            const p = Math.floor(progress);
            if (bar) bar.style.width = `${p}%`;
            if (pct) pct.textContent = `${p}%`;

            // Update status messages
            const phaseIdx = Math.min(Math.floor(p / 17), loadingPhases.length - 1);
            if (statusText && statusText.textContent !== loadingPhases[phaseIdx]) {
                statusText.style.opacity = 0;
                setTimeout(() => {
                    statusText.textContent = loadingPhases[phaseIdx];
                    statusText.style.opacity = 1;
                }, 200);
            }
        }

        // Check if finished
        if (isTypingDone && progress >= 100) {
            clearInterval(progressInterval);
            finishPremiumSplash();
        }
    }, 30);

    function finishPremiumSplash() {
        setTimeout(() => {
            const logoText = document.querySelector('.splash-logo-text');
            if(logoText) {
                logoText.style.color = "#8B5CF6";
                logoText.style.textShadow = "0 0 40px rgba(139, 92, 246, 0.6)";
            }

            // Fade out icons
            document.querySelectorAll('.f-icon-item').forEach((icon, i) => {
                setTimeout(() => {
                    icon.style.transition = 'opacity 0.5s ease';
                    icon.style.opacity = 0;
                }, i * 50);
            });

            // Final transition to main website
            setTimeout(() => {
                if (splash) {
                    splash.style.transition = 'opacity 1s ease, filter 1s ease';
                    splash.style.filter = "blur(50px)";
                    splash.style.opacity = "0";

                    setTimeout(() => {
                        splash.style.display = "none";
                        document.body.style.overflow = "auto";
                        // Trigger reveal for homepage elements
                        handleReveal();
                    }, 1000);
                }
            }, 800);
        }, 500);
    }

    // Canvas Background logic
    const canvas = document.getElementById('particle-canvas-new');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.v = Math.random() * 0.4 + 0.1;
                this.s = Math.random() * 2;
            }
            update() { this.y -= this.v; if(this.y < 0) this.y = canvas.height; }
            draw() { ctx.fillStyle = "rgba(139, 92, 246, 0.15)"; ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fill(); }
        }
        for(let i=0; i<40; i++) particles.push(new Particle());
        function anim() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            particles.forEach(p=>{p.update(); p.draw();});
            requestAnimationFrame(anim);
        }
        anim();
    }

    // Fail-safe: Force hide splash if it takes too long (10 seconds)
    setTimeout(() => {
        if (splash && splash.style.display !== 'none') {
            console.log('Splash Screen Failsafe Triggered');
            finishPremiumSplash();
        }
    }, 10000);

    // Start the splash logic
    setTimeout(startPremiumSplash, 800);

    // 2. Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.classList.toggle('dark-mode', currentTheme === 'dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark-mode');
            const theme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });
    }

    // 3. Scroll Progress Bar & Reveal on Scroll
    const scrollBar = document.getElementById('scrollBar');
    const backToTop = document.getElementById('backToTop');

    const handleScroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollBar) scrollBar.style.width = scrolled + "%";

        if (backToTop) {
            if (winScroll > 500) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }

        handleReveal();
    };

    window.addEventListener('scroll', handleScroll);

    // 4. Back to Top Smooth Scroll
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 5. Dynamic Copyright Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 6. Reveal Animation Logic
    const revealElements = document.querySelectorAll('section, .skill-card, .project-card, .upcoming-card, .glass-card, .team-card, .service-card, .bento-card-wrapper');

    function handleReveal() {
        const triggerBottom = window.innerHeight * 0.9;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add('active');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                if (el.classList.contains('stats')) {
                    animateCounters(el);
                }
            }
        });
    }

    // 7. Animated Statistics Counter
    function animateCounters(container) {
        const counts = container.querySelectorAll('.count:not(.counted)');
        const duration = 2000;

        counts.forEach(count => {
            count.classList.add('counted');
            const target = +count.getAttribute('data-target');
            const decimals = parseInt(count.getAttribute('data-decimal')) || 0;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                const current = easeProgress * target;

                count.innerText = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString();

                if (progress < 1) requestAnimationFrame(updateCount);
                else count.innerText = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
            };
            requestAnimationFrame(updateCount);
        });
    }

    // 8. Contact Form Integration (Web3Forms)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitBtn.classList.add('form-loading');
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);

            if (formStatus) {
                formStatus.textContent = 'Sending transmission...';
                formStatus.className = 'form-status status-info';
                formStatus.style.display = 'block';
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(object)
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    showStatus('Transmission received! I will contact you soon.', 'success');
                    contactForm.reset();
                } else {
                    showStatus(res.message || 'Something went wrong.', 'error');
                }
            })
            .catch(() => {
                showStatus('Network error.', 'error');
            })
            .finally(() => {
                submitBtn.classList.remove('form-loading');
                submitBtn.disabled = false;
            });
        });
    }

    function showStatus(message, type) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = 'form-status status-' + type;
            formStatus.style.display = 'block';
        }
    }

    // 9. Ambient Glow Interaction
    const glowTop = document.querySelector('.bg-glow-top');
    const glowBottom = document.querySelector('.bg-glow-bottom');
    if (glowTop && glowBottom) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 30;
            const y = (e.clientY / window.innerHeight - 0.5) * 30;
            glowTop.style.transform = `translate(${x}px, ${y}px)`;
            glowBottom.style.transform = `translate(${-x}px, ${-y}px)`;
        });
    }
});
