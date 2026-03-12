// ===========================
// Navbar Scroll Effect
// ===========================

const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===========================
// Mobile Menu Toggle
// ===========================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ===========================
// Scroll Animations (Intersection Observer)
// ===========================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a staggered delay for multiple elements
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            
            // Optional: Stop observing after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach(el => observer.observe(el));

// ===========================
// Smooth Scroll for Anchor Links
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for actual anchor links, not just "#"
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===========================
// Add active class to current page nav link
// ===========================

const currentPage = window.location.pathname.split('/').pop();
navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    }
});

// ===========================
// Reviews Carousel
// ===========================

const carousel = document.querySelector('[data-carousel]');

if (carousel) {
    const track = carousel.querySelector('.testimonial-track');
    const viewport = carousel.querySelector('.testimonial-viewport');
    const slides = Array.from(track.children);
    const prevButton = document.querySelector('[data-carousel-prev]');
    const nextButton = document.querySelector('[data-carousel-next]');
    const dotsContainer = carousel.querySelector('[data-carousel-dots]');
    let currentIndex = 0;
    let slidesPerView = getSlidesPerView();
    let maxIndex = getMaxIndex();

    function getSlidesPerView() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, slides.length - slidesPerView);
    }

    function buildDots() {
        dotsContainer.innerHTML = '';

        for (let index = 0; index <= maxIndex; index += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'testimonial-dot';
            dot.setAttribute('aria-label', `Go to review set ${index + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const trackStyles = window.getComputedStyle(track);
        const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0');
        const offset = currentIndex * (slideWidth + gap);

        track.style.transform = `translateX(-${offset}px)`;

        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === maxIndex;
        updateViewportHeight();
    }

    function updateViewportHeight() {
        const visibleSlides = slides.slice(currentIndex, currentIndex + slidesPerView);
        const tallestVisibleSlide = visibleSlides.reduce((maxHeight, slide) => {
            return Math.max(maxHeight, slide.offsetHeight);
        }, 0);

        viewport.style.height = `${tallestVisibleSlide}px`;
    }

    function refreshCarousel() {
        slidesPerView = getSlidesPerView();
        maxIndex = getMaxIndex();
        currentIndex = Math.min(currentIndex, maxIndex);
        buildDots();
        updateCarousel();
    }

    prevButton.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = Math.min(maxIndex, currentIndex + 1);
        updateCarousel();
    });

    window.addEventListener('resize', refreshCarousel);
    buildDots();
    updateCarousel();
}

// ===========================
// Preload hero images for better performance
// ===========================

window.addEventListener('load', () => {
    const heroImages = document.querySelectorAll('.hero-image img');
    heroImages.forEach(img => {
        const src = img.getAttribute('src');
        const preloadImage = new Image();
        preloadImage.src = src;
    });
});
