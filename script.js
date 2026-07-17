/**
 * AB SHAB Portfolio Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Logic (2.5 - 3 seconds as requested)
    const preloader = document.getElementById('preloader');

    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                // Trigger reveal for elements already in view after loader disappears
                handleReveal();
            }, 800);
        }
    };

    // Forced display for 2.5s for premium feel
    setTimeout(hidePreloader, 2500);

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

        // Back to Top Visibility
        if (backToTop) {
            if (winScroll > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        handleReveal();
    };

    window.addEventListener('scroll', handleScroll);

    // 4. Back to Top Smooth Scroll
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Dynamic Copyright Year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 6. Reveal Animation Logic (Robust Implementation)
    const revealElements = document.querySelectorAll('section, .skill-card, .project-card, .upcoming-card, .glass-card, .team-card, .service-card');

    // Add initial reveal class
    revealElements.forEach(el => el.classList.add('reveal'));

    function handleReveal() {
        const triggerBottom = window.innerHeight * 0.9;

        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add('active');
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
            count.classList.add('counted'); // Prevent re-animation
            const target = +count.getAttribute('data-target');
            const decimals = parseInt(count.getAttribute('data-decimal')) || 0;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 4); // Quart easing
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

            const email = document.getElementById('userEmail').value;
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            submitBtn.classList.add('form-loading');
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            showStatus('Sending transmission...', 'info');

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    showStatus('Transmission received! I will contact you soon.', 'success');
                    contactForm.reset();
                } else {
                    showStatus(res.message || 'Something went wrong. Please try again.', 'error');
                }
            })
            .catch(() => {
                showStatus('Network error. Please check your connection.', 'error');
            })
            .then(() => {
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

    // Initialize state
    handleScroll();
});
