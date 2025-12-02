// ========================================
// Galaxy Switzerland - Interactive Features
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
    initParallaxEffect();
});

// ========================================
// Scroll Animations with Intersection Observer
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');

                // Add staggered animation for grid items
                if (entry.target.classList.contains('feature-card') ||
                    entry.target.classList.contains('community-card')) {
                    const delay = Array.from(entry.target.parentElement.children)
                        .indexOf(entry.target) * 100;
                    entry.target.style.animationDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const elementsToAnimate = document.querySelectorAll(
        '.about, .features, .community, .feature-card, .community-card, .stat-item'
    );

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            navbar.style.background = 'rgba(15, 15, 30, 0.95)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(15, 15, 30, 0.8)';
        }

        lastScroll = currentScroll;
    });
}

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Only handle internal links
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar height

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========================================
// Parallax Effect for Hero Section
// ========================================
function initParallaxEffect() {
    const hero = document.getElementById('hero');
    const heroContent = document.querySelector('.hero-content');
    const floatingCards = document.querySelectorAll('.floating-card');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;

        // Only apply parallax when hero is visible
        if (scrolled < heroHeight) {
            // Parallax for hero content
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrolled / heroHeight) * 0.8;
            }

            // Parallax for floating cards with different speeds
            floatingCards.forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                card.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });
}

// ========================================
// Feature Card Interactions
// ========================================
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        // Add subtle tilt effect
        this.style.transform = 'translateY(-10px) rotateX(5deg)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) rotateX(0)';
    });

    // Add ripple effect on click
    card.addEventListener('click', function (e) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(220, 20, 60, 0.5)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.left = e.offsetX + 'px';
        ripple.style.top = e.offsetY + 'px';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Scroll Indicator Hide on Scroll
// ========================================
const scrollIndicator = document.getElementById('scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (scrolled > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

// ========================================
// Stats Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Observe stats and trigger counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.dataset.animated) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));

                if (!isNaN(number)) {
                    statNumber.dataset.animated = 'true';
                    statNumber.textContent = '0';

                    setTimeout(() => {
                        animateCounter(statNumber, number);
                        // Add back any suffix
                        setTimeout(() => {
                            statNumber.textContent = text;
                        }, 2000);
                    }, 200);
                }
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// Dynamic Background Gradient
// ========================================
function initDynamicGradient() {
    const heroBackground = document.querySelector('.hero-background');

    if (heroBackground) {
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;

            const gradient = `
                radial-gradient(circle at ${mouseX * 100}% ${mouseY * 100}%,
                rgba(220, 20, 60, 0.3) 0%, transparent 50%),
                radial-gradient(circle at ${(1 - mouseX) * 100}% ${(1 - mouseY) * 100}%,
                rgba(160, 13, 42, 0.3) 0%, transparent 50%)
            `;

            heroBackground.style.backgroundImage = gradient;
        });
    }
}

initDynamicGradient();

// ========================================
// Button Hover Effects
// ========================================
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--mouse-x', x + 'px');
        this.style.setProperty('--mouse-y', y + 'px');
    });
});

// ========================================
// Performance Optimization: Debounce Scroll Events
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedParallax = debounce(() => {
    // Parallax updates are already handled in initParallaxEffect
}, 10);

window.addEventListener('scroll', debouncedParallax);

// ========================================
// Console Welcome Message
// ========================================
console.log(
    '%c🌌 Galaxy Switzerland',
    'font-size: 24px; font-weight: bold; color: #DC143C;'
);
console.log(
    '%cWelcome to Galaxy Switzerland! Empowering computational research.',
    'font-size: 14px; color: #b4b9d0;'
);
console.log(
    '%cVisit https://galaxyproject.org to learn more about the Galaxy Project.',
    'font-size: 12px; color: #7a7f9a;'
);
