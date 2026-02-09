// Cursor trail effect
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.8) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        document.body.appendChild(trail);

        setTimeout(() => {
            trail.remove();
        }, 1000);
    }
});

// Theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-toggle .label');

const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark';
};

const applyTheme = (theme) => {
    document.body.classList.toggle('theme-light', theme === 'light');
    if (themeLabel) {
        themeLabel.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
    }
};

const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('theme-light') ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Experience tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanels = document.querySelectorAll('.tab-panel');

const setActiveTab = (targetId) => {
    tabButtons.forEach((btn) => {
        const isActive = btn.dataset.target === targetId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    tabPanels.forEach((panel) => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('active', isActive);
        panel.toggleAttribute('hidden', !isActive);
    });
};

tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        setActiveTab(btn.dataset.target);
    });
});

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.project-card');
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.setProperty('--parallax-offset', `${scrolled * speed * 0.05}px`);
    });
});

// Scroll reveal for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card) => card.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

projectCards.forEach((card) => revealObserver.observe(card));

// Hover tilt + glow tracking
const handleTilt = (card, event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `translateY(calc(var(--parallax-offset, 0px) - 10px)) scale(1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    card.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
};

projectCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => handleTilt(card, event));
    card.addEventListener('mouseleave', () => {
        card.style.transform = `translateY(calc(var(--parallax-offset, 0px) - 10px)) scale(1.02)`;
    });
});
