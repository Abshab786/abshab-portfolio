// Animated Statistics Counter
function animateCounters() {
    const counts = document.querySelectorAll('.count');
    const speed = 200;

    counts.forEach(count => {
        const target = +count.getAttribute('data-target');
        const decimals = count.getAttribute('data-decimal') || 0;
        const inc = target / speed;
        let current = 0;

        const updateCount = () => {
            if (current < target) {
                current += inc;
                if (decimals > 0) {
                    count.innerText = current.toFixed(decimals);
                } else {
                    count.innerText = Math.ceil(current);
                }
                setTimeout(updateCount, 10);
            } else {
                count.innerText = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
            }
        };
        updateCount();
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Track items for reveal
document.querySelectorAll('section, .skill-card, .timeline-item, .upcoming-card, .glass-card, .team-card').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
    observer.observe(item);
});

// Dynamic reveal styles
const style = document.createElement('style');
style.textContent = `
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Smooth Mouse-based ambient glow
document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.querySelector('.bg-glow-top').style.transform = `translate(${x * 50}px, ${y * 50}px)`;
    document.querySelector('.bg-glow-bottom').style.transform = `translate(${-x * 50}px, ${-y * 50}px)`;
});

// Contact Form Redirect Logic
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const desc = document.getElementById('projectDesc').value;

        const submitBtn = contactForm.querySelector('button');
        const originalText = submitBtn.innerText;

        submitBtn.innerText = 'PREPARING...';
        submitBtn.disabled = true;

        // Construct the message
        const message = `*New Project Transmission*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Description:* ${desc}`;

        // WhatsApp Redirect
        const whatsappUrl = `https://wa.me/918012677770?text=${message}`;

        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            submitBtn.innerText = 'TRANSMITTED';
            submitBtn.style.background = '#10B981';

            setTimeout(() => {
                contactForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = 'var(--primary)';
            }, 3000);
        }, 1000);
    });
}
