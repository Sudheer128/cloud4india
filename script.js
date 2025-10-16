// Cloud4India Website - Exact AWS Clone JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCarousel();
    initMobileNavigation();
    initDropdownMenus();
    initSmoothScrolling();
    initScrollAnimations();
    initFeedbackButtons();
    initShowMoreButtons();
    initBackToTop();
    
    // Performance monitoring
    logPagePerformance();
});

// Hero Carousel Implementation (Exact AWS behavior)
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const slideCounter = document.querySelector('.slide-counter');
    
    if (!slides.length || !indicators.length) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    const autoAdvanceInterval = 6000; // 6 seconds like AWS
    let autoAdvanceTimer;
    
    function updateSlideCounter() {
        if (slideCounter) {
            slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }
    }
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        updateSlideCounter();
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }
    
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }
    
    function startAutoAdvance() {
        autoAdvanceTimer = setInterval(nextSlide, autoAdvanceInterval);
    }
    
    function stopAutoAdvance() {
        clearInterval(autoAdvanceTimer);
    }
    
    function resetAutoAdvance() {
        stopAutoAdvance();
        startAutoAdvance();
    }
    
    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
            resetAutoAdvance();
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carouselSection = document.querySelector('.hero-carousel-section');
        if (!carouselSection) return;
        
        const rect = carouselSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoAdvance();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoAdvance();
            }
        }
    });
    
    // Pause on hover/focus
    const carouselContainer = document.querySelector('.hero-carousel-section');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoAdvance);
        carouselContainer.addEventListener('mouseleave', startAutoAdvance);
        carouselContainer.addEventListener('focusin', stopAutoAdvance);
        carouselContainer.addEventListener('focusout', startAutoAdvance);
    }
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            resetAutoAdvance();
        }
    }
    
    // Initialize carousel
    showSlide(0);
    startAutoAdvance();
}

// Dropdown Navigation Menus
function initDropdownMenus() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');
    let activeDropdown = null;
    
    dropdownItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const menu = item.querySelector('.dropdown-menu');
        
        if (!link || !menu) return;
        
        // Mouse enter - show dropdown
        item.addEventListener('mouseenter', () => {
            // Hide any other open dropdown
            if (activeDropdown && activeDropdown !== item) {
                const activeMenu = activeDropdown.querySelector('.dropdown-menu');
                if (activeMenu) {
                    activeMenu.style.opacity = '0';
                    activeMenu.style.visibility = 'hidden';
                    activeMenu.style.transform = 'translateY(-10px)';
                }
            }
            
            // Show current dropdown
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateY(0)';
            activeDropdown = item;
            
            // Add active class to link
            link.classList.add('active');
        });
        
        // Mouse leave - hide dropdown
        item.addEventListener('mouseleave', () => {
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
            menu.style.transform = 'translateY(-10px)';
            link.classList.remove('active');
            
            if (activeDropdown === item) {
                activeDropdown = null;
            }
        });
        
        // Keyboard navigation
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                if (menu.style.visibility === 'visible') {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                    link.classList.remove('active');
                } else {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                    link.classList.add('active');
                    
                    // Focus first item in dropdown
                    const firstItem = menu.querySelector('a');
                    if (firstItem) {
                        firstItem.focus();
                    }
                }
            }
        });
        
        // Handle dropdown item clicks
        const dropdownLinks = menu.querySelectorAll('a');
        dropdownLinks.forEach(dropdownLink => {
            dropdownLink.addEventListener('click', (e) => {
                // You can add actual navigation logic here
                console.log('Navigating to:', dropdownLink.textContent);
                
                // Close dropdown
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                link.classList.remove('active');
            });
            
            // Keyboard navigation within dropdown
            dropdownLink.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                    link.classList.remove('active');
                    link.focus();
                }
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-item-dropdown')) {
            dropdownItems.forEach(item => {
                const menu = item.querySelector('.dropdown-menu');
                const link = item.querySelector('.nav-link');
                if (menu && link) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                    link.classList.remove('active');
                }
            });
            activeDropdown = null;
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && activeDropdown) {
            const menu = activeDropdown.querySelector('.dropdown-menu');
            const link = activeDropdown.querySelector('.nav-link');
            if (menu && link) {
                menu.style.opacity = '0';
                menu.style.visibility = 'hidden';
                menu.style.transform = 'translateY(-10px)';
                link.classList.remove('active');
                link.focus();
            }
            activeDropdown = null;
        }
    });
}

// Mobile Navigation
function initMobileNavigation() {
    const headerContainer = document.querySelector('.header-container');
    const mainNav = document.querySelector('.main-nav');
    
    if (!headerContainer || !mainNav) return;
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = `
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
    `;
    mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    
    // Add mobile menu styles
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            flex-direction: column;
            gap: 4px;
            padding: 8px;
            cursor: pointer;
        }
        
        .hamburger-line {
            width: 24px;
            height: 2px;
            background-color: #ffffff;
            transition: all 0.3s ease;
        }
        
        .mobile-menu-btn.active .hamburger-line:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .mobile-menu-btn.active .hamburger-line:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active .hamburger-line:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-btn {
                display: flex;
            }
            
            .main-nav {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: #232f3e;
                flex-direction: column;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 1000;
            }
            
            .main-nav.mobile-open {
                display: flex;
            }
            
            .nav-link {
                padding: 12px 0;
                border-bottom: 1px solid #3c4757;
                text-align: center;
            }
            
            .nav-link:last-child {
                border-bottom: none;
            }
        }
    `;
    document.head.appendChild(mobileStyles);
    
    // Insert mobile button
    headerContainer.insertBefore(mobileMenuBtn, headerContainer.firstChild);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mainNav.classList.contains('mobile-open');
        mainNav.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!headerContainer.contains(e.target)) {
            mainNav.classList.remove('mobile-open');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mainNav.classList.remove('mobile-open');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(`
        .feature-card,
        .solution-item,
        .product-item,
        .training-item,
        .next-step-item,
        .ai-highlight
    `);
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Feedback Buttons
function initFeedbackButtons() {
    const feedbackButtons = document.querySelectorAll('.feedback-btn');
    
    feedbackButtons.forEach(button => {
        button.addEventListener('click', () => {
            const feedback = button.classList.contains('yes') ? 'positive' : 'negative';
            
            // Simulate feedback submission
            button.style.backgroundColor = '#7aa116';
            button.style.color = '#ffffff';
            button.style.borderColor = '#7aa116';
            button.textContent = 'Thanks!';
            button.disabled = true;
            
            // Reset other button
            const otherButton = button.classList.contains('yes') 
                ? document.querySelector('.feedback-btn.no')
                : document.querySelector('.feedback-btn.yes');
            
            if (otherButton) {
                otherButton.disabled = true;
                otherButton.style.opacity = '0.5';
            }
            
            console.log(`Feedback submitted: ${feedback}`);
        });
    });
}

// Show More Buttons
function initShowMoreButtons() {
    const showMoreButtons = document.querySelectorAll('.show-more-btn');
    
    showMoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Simulate loading more content
            button.textContent = 'Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Show less';
                button.disabled = false;
                
                // You can add logic here to actually show/hide content
                console.log('Loading more content...');
            }, 1000);
        });
    });
}

// Back to Top
function initBackToTop() {
    const backToTopLink = document.querySelector('.back-to-top a');
    
    if (backToTopLink) {
        backToTopLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Performance Monitoring
function logPagePerformance() {
    if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigationTiming = performance.getEntriesByType('navigation')[0];
                const paintTiming = performance.getEntriesByType('paint');
                
                console.log('Performance Metrics:');
                console.log(`DOM Content Loaded: ${navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart}ms`);
                console.log(`Page Load: ${navigationTiming.loadEventEnd - navigationTiming.loadEventStart}ms`);
                
                if (paintTiming.length > 0) {
                    const firstPaint = paintTiming.find(entry => entry.name === 'first-paint');
                    const firstContentfulPaint = paintTiming.find(entry => entry.name === 'first-contentful-paint');
                    
                    if (firstPaint) {
                        console.log(`First Paint: ${firstPaint.startTime}ms`);
                    }
                    
                    if (firstContentfulPaint) {
                        console.log(`First Contentful Paint: ${firstContentfulPaint.startTime}ms`);
                    }
                }
            }, 0);
        });
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Search Functionality Placeholder
function initSearch() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce((e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                console.log(`Search query: ${query}`);
                // Implement actual search logic here
            }
        }, 300));
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize additional features on load
window.addEventListener('load', () => {
    initLazyLoading();
    initSearch();
});

// Error handling for missing elements
window.addEventListener('error', (e) => {
    console.warn('JavaScript error caught:', e.error);
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCarousel,
        initMobileNavigation,
        initSmoothScrolling,
        initScrollAnimations,
        debounce,
        throttle
    };
}