document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 2000; // animation speed

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.getAttribute('data-target'));
            const count = parseInt(counter.innerText);
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };

        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counter.classList.contains('counted')) {
                        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                            counter.classList.add('counted');
                            updateCount();
                        } else {
                            counter.innerText = counter.getAttribute('data-target');
                        }
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(counter.parentElement);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const factorySections = document.querySelectorAll('.factory-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    factorySections.forEach(section => {
        observer.observe(section);
    });
});

// Existing scroll listener for overview-section
document.addEventListener("scroll", () => {
    const section = document.querySelector(".overview-section");
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight) {
        section.classList.add("in-viewport");
    }
});

// New Intersection Observer for featured-products-section
document.addEventListener('DOMContentLoaded', () => {
    const featuredSections = document.querySelectorAll('.featured-products-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is in view
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-viewport');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    featuredSections.forEach(section => {
        observer.observe(section);
    });
}); 

document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image');
    const styleTitles = document.querySelectorAll('.style-title');
    const navItems = document.querySelectorAll('.nav-item-project');
    let currentIndex = 0;
    let isScrolling = false;
    let touchStartY = 0;
    
    // Preload images - Update with your actual image paths
    const imageUrls = [
        'images/project/1.jpg',
        'images/project/1.jpg',
        'images/project/1.jpg',
        'images/project/1.jpg'
    ];
    
    function preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    preloadImages(imageUrls);
    
    updateActiveClasses(currentIndex);
    
    document.querySelector('.project-container').addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollCooldown = 1200; // ms between scroll events
    
    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        
        const now = Date.now();
        if (isScrolling || now - lastScrollTime < scrollCooldown) return;
        
        lastScrollTime = now;
        isScrolling = true;
        
        if (e.deltaY > 0) {
            goToSlide((currentIndex + 1) % projectImages.length);
        } else {
            goToSlide((currentIndex - 1 + projectImages.length) % projectImages.length);
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    }, { passive: false });
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.project-container')) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;
        
        if (Math.abs(touchDiff) < 50) return;
        
        isScrolling = true;
        
        if (touchDiff > 0) {
            goToSlide((currentIndex + 1) % projectImages.length);
        } else {
            goToSlide((currentIndex - 1 + projectImages.length) % projectImages.length);
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, scrollCooldown);
    });
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (isScrolling) return;
            
            const newIndex = parseInt(this.getAttribute('data-index'));
            if (newIndex === currentIndex) return;
            
            goToSlide(newIndex);
        });
    });
    
    styleTitles.forEach(title => {
        title.addEventListener('click', function() {
            if (isScrolling) return;
            
            const newIndex = parseInt(this.getAttribute('data-index'));
            if (newIndex === currentIndex) return;
            
            goToSlide(newIndex);
        });
    });
    
    // Auto-scroll feature for infinite loop
    let autoScrollInterval;
    
    function startAutoScroll() {
        return setInterval(function() {
            if (!isScrolling) {
                goToSlide((currentIndex + 1) % projectImages.length);
            }
        }, 8000); // slide every 8 seconds
    }
    
    autoScrollInterval = startAutoScroll();
    
    document.querySelector('.project-container').addEventListener('mouseenter', function() {
        clearInterval(autoScrollInterval);
    });
    
    document.querySelector('.project-container').addEventListener('mouseleave', function() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = startAutoScroll();
    });
    
    function goToSlide(newIndex) {
        isScrolling = true;
        const prevIndex = currentIndex;
        currentIndex = newIndex;
        
        updateActiveClasses(currentIndex, prevIndex);
        
        setTimeout(() => {
            isScrolling = false;
        }, 1000); // transition time
    }
    
    function updateActiveClasses(index, prevIndex) {
        const direction = prevIndex !== undefined ? 
            (index > prevIndex || (index === 0 && prevIndex === projectImages.length - 1)) ? 'down' : 'up' : 'none';
        
        projectImages.forEach((img, i) => {
            img.classList.remove('active', 'prev', 'next');
            
            if (i === index) {
                img.classList.add('active');
                img.style.visibility = 'visible';
                img.style.zIndex = '2';
                img.style.opacity = '1';
                img.style.transform = 'translateY(0)';
                img.style.marginTop = '0';
                img.style.marginBottom = '0';
            } 
            else if (i === (index + 1) % projectImages.length) {
                img.classList.add('next');
                img.style.visibility = 'visible';
                img.style.zIndex = '1';
                img.style.opacity = '0.5';
                img.style.transform = 'translateY(100%)';
                img.style.marginTop = '1rem'; // Margin-top for lower image
                img.style.marginBottom = '0';
            }
            else if (i === (index - 1 + projectImages.length) % projectImages.length) {
                img.classList.add('prev');
                img.style.visibility = 'visible';
                img.style.zIndex = '1';
                img.style.opacity = '0.5';
                img.style.transform = 'translateY(-100%)';
                img.style.marginTop = '0';
                img.style.marginBottom = '1rem'; // Margin-bottom for upper image
            }
            else {
                img.style.visibility = 'hidden';
                img.style.zIndex = '0';
                img.style.opacity = '0';
                img.style.marginTop = '0';
                img.style.marginBottom = '0';
                
                const diff = (i - index + projectImages.length) % projectImages.length;
                if (diff < projectImages.length / 2) {
                    img.style.transform = 'translateY(-200%)';
                } else {
                    img.style.transform = 'translateY(200%)';
                }
            }
        });
        
        styleTitles.forEach((title, i) => {
            title.classList.remove('active');
            if (i === index) {
                title.classList.add('active');
            }
        });
        
        navItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
        
        projectImages.forEach((img, i) => {
            if (imageUrls[i] && !img.src.includes(imageUrls[i])) {
                img.src = imageUrls[i];
            }
        });
    }
});