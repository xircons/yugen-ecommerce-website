document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 3000; // animation speed

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
        'images/project/Atelier_Rampazzi/2.jpg',
        'images/project/WOJR/15.jpg',
        'images/project/Anya_Moryoussef/1.jpg',
        'images/project/Bureau_Tempo/3.jpg',
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

// Notification
class NotificationManager {
    constructor() {
        this.createNotificationContainer();
        this.injectStyles();
    }

    createNotificationContainer() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    injectStyles() {
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification-container {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                }

                .notification {
                    background: #fff;
                    color: rgba(6, 29, 27, 1);
                    padding: 16px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(6, 29, 27, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 12px;
                    font-family: "Karla", sans-serif;
                    font-size: 14px;
                    font-weight: 400;
                    min-width: 280px;
                    border: 1px solid rgba(6, 29, 27, 0.1);
                    pointer-events: auto;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: translateX(100%);
                    opacity: 0;
                }

                .notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }

                .notification.hide {
                    transform: translateX(100%);
                    opacity: 0;
                }

                .notification:hover {
                    transform: translateX(-2px);
                    box-shadow: 0 6px 25px rgba(6, 29, 27, 0.15);
                }

                .notification-icon {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-title {
                    font-weight: 500;
                    margin-bottom: 2px;
                    font-size: 14px;
                    color: rgba(6, 29, 27, 1);
                }

                .notification-message {
                    color: rgba(6, 29, 27, 0.7);
                    font-size: 13px;
                    line-height: 1.4;
                }

                .notification-close {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: rgba(6, 29, 27, 0.1);
                    border: none;
                    color: rgba(6, 29, 27, 0.6);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    transition: background 0.2s ease;
                    flex-shrink: 0;
                }

                .notification-close:hover {
                    background: rgba(6, 29, 27, 0.15);
                    color: rgba(6, 29, 27, 0.8);
                }

                .progress-bar {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 2px;
                    background: rgba(6, 29, 27, 0.2);
                    border-radius: 0 0 8px 8px;
                    animation: progress 4s linear forwards;
                }

                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }

                @keyframes checkmark {
                    0% { transform: scale(0) rotate(-45deg); }
                    50% { transform: scale(1.2) rotate(-45deg); }
                    100% { transform: scale(1) rotate(-45deg); }
                }

                .checkmark {
                    width: 10px;
                    height: 5px;
                    border-left: 2px solid rgba(6, 29, 27, 0.8);
                    border-bottom: 2px solid rgba(6, 29, 27, 0.8);
                    transform: rotate(-45deg);
                    animation: checkmark 0.6s ease-out;
                }

                /* Confetti Animation */
                .confetti {
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: #f0f0f0;
                    z-index: 9999;
                    pointer-events: none;
                }

                .confetti-piece {
                    animation: confetti-fall 3s ease-out forwards;
                }

                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }

                /* Error notification styles */
                .notification.error {
                    border-left: 3px solid #dc3545;
                }

                /* Warning notification styles */
                .notification.warning {
                    border-left: 3px solid #ffc107;
                }

                /* Success notification styles */
                .notification.success {
                    border-left: 3px solid #28a745;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    showNotification(options = {}) {
        const {
            type = 'success',
            title = 'Success!',
            message = 'Your request has been processed successfully.',
            duration = 4000,
            showConfetti = false
        } = options;

        const notification = this.createNotificationElement(type, title, message);
        const container = document.getElementById('notification-container');
        
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        if (type === 'success' && showConfetti) {
            this.showConfetti();
        }

        const hideTimeout = setTimeout(() => {
            this.hideNotification(notification);
        }, duration);

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(hideTimeout);
            this.hideNotification(notification);
        });

        return notification;
    }

    createNotificationElement(type, title, message) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <div class="notification-icon">
                ${icon}
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
            <div class="progress-bar"></div>
        `;

        return notification;
    }

    getIcon(type) {
        switch (type) {
            case 'success':
                return '<div class="checkmark"></div>';
            case 'error':
                return '⚠';
            case 'warning':
                return '⚠';
            default:
                return '✓';
        }
    }

    hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    showConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti confetti-piece';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                document.body.appendChild(confetti);

                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 4000);
            }, i * 20);
        }
    }

    // Quick methods for different notification types
    success(title, message, showConfetti = true) {
        return this.showNotification({
            type: 'success',
            title,
            message,
            showConfetti
        });
    }

    error(title, message) {
        return this.showNotification({
            type: 'error',
            title,
            message,
            duration: 4000
        });
    }

    warning(title, message) {
        return this.showNotification({
            type: 'warning',
            title,
            message,
            duration: 4000
        });
    }
}

const notify = new NotificationManager();

// Enhanced form submission with better animations
function enhanceContactForm() {
    if (window.contactFormEnhanced) return;
    window.contactFormEnhanced = true;
    
    const submitButton = document.getElementById('submit-contact');
    
    if (submitButton) {
        const newSubmitButton = submitButton.cloneNode(true);
        submitButton.parentNode.replaceChild(newSubmitButton, submitButton);
        
        const originalText = newSubmitButton.textContent;
        
        newSubmitButton.addEventListener('click', async (e) => {
            const formInputs = {
                fullName: document.getElementById('full-name'),
                phone: document.getElementById('phone'),
                email: document.getElementById('email'),
                message: document.getElementById('message')
            };

            if (!formInputs.fullName.value || !formInputs.phone.value || !formInputs.email.value || !formInputs.message.value) {
                notify.warning('Missing Information', 'Please fill all fields before submitting.');
                return;
            }

            // Show loading state
            newSubmitButton.disabled = true;
            newSubmitButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite; margin-right: 8px;">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Sending...
            `;

            const data = {
                full_name: formInputs.fullName.value,
                phone: formInputs.phone.value,
                email: formInputs.email.value,
                message: formInputs.message.value
            };

            try {
                const response = await fetch('http://localhost:3000/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    // Show success notification
                    notify.success(
                        'Message Sent!', 
                        'We\'ll get back to you soon.'
                    );
                    
                    Object.values(formInputs).forEach(input => {
                        input.value = '';
                    });
                } else {
                    notify.error('Submission Failed', result.error || 'Failed to send your message. Please try again.');
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                notify.error('Connection Error', 'Unable to send your message. Please check your connection and try again. :)');
            } finally {
                // Reset button
                setTimeout(() => {
                    newSubmitButton.disabled = false;
                    newSubmitButton.textContent = originalText;
                }, 1000);
            }
        });
    }
}

const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceContactForm);
} else {
    enhanceContactForm();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationManager, notify };
}