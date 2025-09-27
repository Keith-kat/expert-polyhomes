// script.js
// Expert Polyhomes - Complete JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initApp();
});

function initApp() {
    console.log('🚀 Initializing Expert Polyhomes App...');
    
    // Initialize components in order of priority
    initModals();
    initNavigation();
    initStickyBanner();
    initUtilityBar();
    initAnimations();

    // Initialize non-critical components after page load
    setTimeout(() => {
    initARMeasurement();
    initQuoteGenerator();
    initReviews();
    initBeforeAfterSlider();
    initDesignExplorer();
    initServiceMap();
    initFormValidation();
    initMpesaIntegration();
    initUserAuth();
    init3DModel();
    }, 1000);
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        navToggle.classList.remove('active');
                    }
                    
                    // Scroll to section
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Active section highlighting
    window.addEventListener('scroll', throttle(highlightActiveSection, 100));
}

// Modal management system
function initModals() {
    console.log('🔧 Initializing modals...');

    // All modals are hidden on startup
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });

    // Modal triggers mapping
    const modalTriggers = {
        'arView': 'arModal',
        'signInLink': 'signInModal',
        'showRegisterModal': 'registerModal',
        'showSignInModal': 'signInModal'
    };

    // Initialize modal triggers
    Object.keys(modalTriggers).forEach(triggerId => {
        const trigger = document.getElementById(triggerId);
        const modalId = modalTriggers[triggerId];
        
        if (trigger) {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                if (modalId) {
                    openModal(modalId);
                }
            });
        }
    });

    // Close modals 
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal.id));
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Escape key support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'flex') {
                    closeModal(modal.id);
                }
            });
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const focusableElements = modal.querySelectorAll('button, input, select, textarea, a');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// AR Measurement functionality
function initARMeasurement() {
    const arButton = document.getElementById('arView');
    const arModal = document.getElementById('arModal');
    const closeArModal = document.getElementById('closeArModal');
    const arCamera = document.getElementById('arCamera');
    const rulerOverlay = document.getElementById('rulerOverlay');
    const rulerLength = document.getElementById('rulerLength');
    const arDimensionForm = document.getElementById('arDimensionForm');

    if (!arButton) return;

    let stream = null;
    let isDragging = false;
    let rulerWidth = 60; // Initial width in pixels

    arButton.addEventListener('click', function() {
        openModal('arModal');
        initializeCamera();
    });

    // Ruler interaction
    if (rulerOverlay) {
        rulerOverlay.addEventListener('mousedown', startDragging);
        rulerOverlay.addEventListener('touchstart', startDragging);
        
        document.addEventListener('mousemove', dragRuler);
        document.addEventListener('touchmove', dragRuler);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);
    }

    function startDragging(e) {
        isDragging = true;
        e.preventDefault();
    }

    function dragRuler(e) {
        if (!isDragging) return;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const containerRect = rulerOverlay.parentElement.getBoundingClientRect();
        const newWidth = Math.max(30, Math.min(200, clientX - containerRect.left));
        
        rulerWidth = newWidth;
        rulerOverlay.style.width = rulerWidth + 'px';
        updateRulerLength();
    }

    function stopDragging() {
        isDragging = false;
    }

    function updateRulerLength() {
        // Assuming credit card width (8.5cm) as reference
        const cmPerPixel = 8.5 / rulerWidth;
        const lengthCm = (rulerWidth * cmPerPixel).toFixed(1);
        rulerLength.textContent = lengthCm + ' cm';
    }

    // Camera initialization
    async function initializeCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            arCamera.srcObject = stream;
        } catch (error) {
            console.error('Error accessing camera:', error);
            arCamera.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <p>Camera access required for AR measurement.</p>
                    <p>Please allow camera permissions and refresh.</p>
                </div>
            `;
        }
    }

    // Form submission
    if (arDimensionForm) {
        arDimensionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const width = document.getElementById('arWidth').value;
            const height = document.getElementById('arHeight').value;
            
            if (width && height) {
                // Pre-fill quote form with AR measurements
                const quoteModal = document.getElementById('quoteModal');
                if (quoteModal) {
                    const widthInput = document.getElementById('windowWidth');
                    const heightInput = document.getElementById('windowHeight');
                    
                    if (widthInput) widthInput.value = (width / 100).toFixed(2); // Convert cm to m
                    if (heightInput) heightInput.value = (height / 100).toFixed(2);
                    
                    closeModal('arModal');
                    openModal('quoteModal');
                }
                
                showNotification('Measurements added to quote!', 'success');
            }
        });
    }

    // Clean up camera stream when modal closes
    if (closeArModal) {
        closeArModal.addEventListener('click', function() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });
    }
}

// Quote Generator functionality
function initQuoteGenerator() {
    const quoteForm = document.getElementById('smartQuoteForm');
    const quoteSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const mpesaPayButton = document.getElementById('mpesapay');
    const detectLocationButton = document.getElementById('detectLocation');

    let currentStep = 1;
    let quoteData = {};

    // Step navigation
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            goToStep(currentStep - 1);
        });
    });

    // Location detection
    if (detectLocationButton) {
        detectLocationButton.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // Reverse geocoding would be implemented here
                        const locationInput = document.getElementById('installLocation');
                        locationInput.value = 'Location detected - please enter your address manually';
                        showNotification('Location detected! Please verify your address.', 'info');
                    },
                    function(error) {
                        showNotification('Unable to detect location. Please enter manually.', 'error');
                    }
                );
            }
        });
    }

    // M-Pesa payment
    if (mpesaPayButton) {
        mpesaPayButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateStep(3)) {
                calculateQuote();
                openModal('mpesaModal');
            }
        });
    }

    // Form submission
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateQuote();
            showNotification('Quote generated successfully!', 'success');
            
            // Simulate sending quote to email
            const email = document.getElementById('quoteEmail').value;
            if (email) {
                setTimeout(() => {
                    showNotification(`Quote sent to ${email}`, 'info');
                }, 1000);
            }
        });
    }

    function goToStep(step) {
        if (step < 1 || step > quoteSteps.length) return;
        
        // Hide current step
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        
        // Show new step
        document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
        currentStep = step;
    }

    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = 'var(--error)';
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
        }
        
        return isValid;
    }

    function calculateQuote() {
        const width = parseFloat(document.getElementById('windowWidth').value) || 1;
        const height = parseFloat(document.getElementById('windowHeight').value) || 1;
        const count = parseInt(document.getElementById('windowCount').value) || 1;
        const meshType = document.getElementById('meshType').value;
        const materialType = document.getElementById('materialType').value;
        
        // Price matrix (KES per m²)
        const priceMatrix = {
            'fixed': { 'fiberglass': 1500, 'polyester': 1800, 'stainless': 2200 },
            'roller': { 'fiberglass': 2800, 'polyester': 3200, 'stainless': 4500 },
            'slider': { 'fiberglass': 2600, 'polyester': 3000, 'stainless': 4200 },
            'magnetic': { 'fiberglass': 1800, 'polyester': 2000, 'stainless': 2500 }
        };
        
        const area = width * height;
        const unitPrice = priceMatrix[meshType]?.[materialType] || 2000;
        const total = area * unitPrice * count;
        
        quoteData = { width, height, count, meshType, materialType, area, unitPrice, total };
        
        // Update M-Pesa modal
        const mpesaTotal = document.getElementById('mpesaTotal');
        const mpesaDeposit = document.getElementById('mpesaDeposit');
        
        if (mpesaTotal && mpesaDeposit) {
            mpesaTotal.textContent = total.toLocaleString();
            mpesaDeposit.textContent = (total * 0.5).toLocaleString();
        }
        
        return total;
    }
}

// M-Pesa Integration
function initMpesaIntegration() {
    const confirmMpesa = document.getElementById('confirmMpesa');
    const cancelMpesa = document.getElementById('cancelMpesa');
    const mpesaPhone = document.getElementById('mpesaPhone');

    if (confirmMpesa) {
        confirmMpesa.addEventListener('click', function() {
            const phone = mpesaPhone.value.trim();
            
            if (!isValidKenyanPhone(phone)) {
                showNotification('Please enter a valid Kenyan phone number', 'error');
                return;
            }

            // Simulate M-Pesa payment process
            simulateMpesaPayment(phone);
        });
    }

    if (cancelMpesa) {
        cancelMpesa.addEventListener('click', function() {
            closeModal('mpesaModal');
        });
    }
}

function simulateMpesaPayment(phone) {
    showNotification('Initiating M-Pesa payment...', 'info');
    
    // Simulate API call delay
    setTimeout(() => {
        showNotification('M-Pesa prompt sent to your phone', 'info');
        
        // Simulate payment confirmation
        setTimeout(() => {
            closeModal('mpesaModal');
            closeModal('quoteModal');
            showNotification('Payment confirmed! Our team will contact you within 24 hours.', 'success');
            
            // Track conversion
            trackConversion('deposit_paid');
        }, 3000);
    }, 2000);
}

function isValidKenyanPhone(phone) {
    const regex = /^(07\d{8}|01\d{8}|\+2547\d{8})$/;
    return regex.test(phone.replace(/\s/g, ''));
}

// Reviews System
function initReviews() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    const reviewForm = document.getElementById('reviewForm');
    
    // Sample reviews data
    const sampleReviews = [
        { name: "Sarah K.", rating: 5, comment: "Professional installation and excellent quality nets. My home is now mosquito-free!", date: "2024-01-15" },
        { name: "James M.", rating: 5, comment: "Quick service and reasonable prices. The roller nets are perfect for our sliding doors.", date: "2024-01-10" },
        { name: "Grace W.", rating: 4, comment: "Good quality nets, installation was done professionally. Would recommend!", date: "2024-01-08" }
    ];

    // Load sample reviews
    if (reviewsContainer) {
        displayReviews(sampleReviews);
    }

    // Handle review submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rating = this.rating.value;
            const comment = this.comment.value.trim();
            
            if (!rating || !comment) {
                showNotification('Please provide both rating and comment', 'error');
                return;
            }
            
            const newReview = {
                name: "You",
                rating: parseInt(rating),
                comment: comment,
                date: new Date().toISOString().split('T')[0]
            };
            
            sampleReviews.unshift(newReview);
            displayReviews(sampleReviews);
            this.reset();
            
            showNotification('Thank you for your review!', 'success');
        });
    }

    function displayReviews(reviews) {
        reviewsContainer.innerHTML = reviews.map(review => `
            <div class="review-card" data-aos="fade-up">
                <div class="review-header">
                    <div class="reviewer">${review.name}</div>
                    <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <div class="review-comment">"${review.comment}"</div>
                <div class="review-date">${review.date}</div>
            </div>
        `).join('');
    }
}

// Before/After Slider
function initBeforeAfterSlider() {
    const slider = document.querySelector('.comparison-slider');
    if (!slider) return;

    const handle = slider.querySelector('.slider-handle');
    const before = slider.querySelector('.before');
    let isDragging = false;

    function updateSlider(clientX) {
        const rect = slider.getBoundingClientRect();
        const position = ((clientX - rect.left) / rect.width) * 100;
        const boundedPosition = Math.max(0, Math.min(100, position));
        
        before.style.width = boundedPosition + '%';
        handle.style.left = boundedPosition + '%';
    }

    handle.addEventListener('mousedown', function(e) {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Touch support
    handle.addEventListener('touchstart', function(e) {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
    });

    document.addEventListener('touchend', function() {
        isDragging = false;
    });
}

// Design Explorer Tabs
function initDesignExplorer() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.design-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update panels
            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('data-tab') === tabName) {
                    panel.classList.add('active');
                }
            });
        });
    });

    // Configurator forms
    const configuratorForms = document.querySelectorAll('.configurator-form');
    configuratorForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const type = this.getAttribute('data-type');
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} net added to quote!`, 'success');
        });
    });
}

// Service Map with Leaflet
function initServiceMap() {
    const serviceMap = document.getElementById('serviceMap');
    if (!serviceMap) return;

    // Initialize map centered on Nairobi
    const map = L.map('serviceMap').setView([-1.286389, 36.817223], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Service area polygon (simplified Nairobi area)
    const nairobiArea = L.polygon([
        [-1.20, 36.70],
        [-1.20, 36.95],
        [-1.40, 36.95],
        [-1.40, 36.70]
    ], {
        color: 'var(--primary-500)',
        fillColor: 'var(--primary-100)',
        fillOpacity: 0.3,
        weight: 2
    }).addTo(map);

    // Location search functionality
    const locationInput = document.getElementById('locationInput');
    const checkLocation = document.getElementById('checkLocation');
    const installTime = document.getElementById('installTime');

    if (checkLocation) {
        checkLocation.addEventListener('click', function() {
            const location = locationInput.value.trim();
            if (location) {
                // Simulate location check
                const responses = [
                    "Within 24 hours", 
                    "1-2 business days", 
                    "3-5 business days"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                installTime.textContent = randomResponse;
                showNotification(`Service available! ${randomResponse}`, 'success');
            } else {
                showNotification('Please enter a location', 'error');
            }
        });
    }
}

// Utility Bar Functions
function initUtilityBar() {
    updateLiveTime();
    updateWeather();
    updateUserGreeting();
    
    // Update time every minute
    setInterval(updateLiveTime, 60000);
}

function updateLiveTime() {
    const liveTime = document.getElementById('live-time');
    if (liveTime) {
        const now = new Date();
        liveTime.textContent = `Nairobi: ${now.toLocaleTimeString('en-KE', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'Africa/Nairobi'
        })}`;
    }
}

function updateWeather() {
    const weatherDisplay = document.getElementById('weather-display');
    if (weatherDisplay) {
        // Simulate weather data (would integrate with weather API)
        const weatherConditions = ['☀️ 24°C', '⛅ 22°C', '🌧️ 19°C'];
        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        weatherDisplay.textContent = randomWeather;
    }
}

function updateUserGreeting() {
    const userGreeting = document.getElementById('user-greeting');
    const signInLink = document.getElementById('signInLink');
    const dashboardLink = document.getElementById('dashboardLink');
    const logoutLink = document.getElementById('logoutLink');
    
    // Check if user is logged in (simulated)
    const user = JSON.parse(localStorage.getItem('expertPolyhomes_user'));
    
    if (user && userGreeting) {
        userGreeting.textContent = `Hello, ${user.name.split(' ')[0]}!`;
        if (signInLink) signInLink.style.display = 'none';
        if (dashboardLink) dashboardLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        if (userGreeting) userGreeting.textContent = '';
        if (signInLink) signInLink.style.display = 'inline';
        if (dashboardLink) dashboardLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Sticky Banner
function initStickyBanner() {
    const stickyBanner = document.getElementById('stickyBanner');
    
    if (stickyBanner) {
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 300) {
                stickyBanner.classList.add('show');
            } else {
                stickyBanner.classList.remove('show');
            }
        }, 100));
    }
}

// Animations
function initAnimations() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Animate counter numbers
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
        }, 16);
    });
}

// Form Validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Clear previous error
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validation rules
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        message = 'This field is required';
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
    } else if (field.type === 'tel' && value) {
        if (!isValidKenyanPhone(value)) {
            isValid = false;
            message = 'Please enter a valid Kenyan phone number';
        }
    }
    
    if (!isValid) {
        field.style.borderColor = 'var(--error)';
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'var(--error)';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}

// User Authentication
function initUserAuth() {
    const signInForm = document.getElementById('signInForm');
    const registerForm = document.getElementById('registerForm');
    const logoutLink = document.getElementById('logoutLink');
    
    // Sign In
    if (signInForm) {
        signInForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            
            // Simulate authentication
            const users = JSON.parse(localStorage.getItem('expertPolyhomes_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                localStorage.setItem('expertPolyhomes_user', JSON.stringify(user));
                updateUserGreeting();
                closeModal('signInModal');
                showNotification('Successfully signed in!', 'success');
            } else {
                showNotification('Invalid email or password', 'error');
            }
        });
    }
    
    // Registration
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            // Save user
            const users = JSON.parse(localStorage.getItem('expertPolyhomes_users')) || [];
            users.push({ name, email, password });
            localStorage.setItem('expertPolyhomes_users', JSON.stringify(users));
            
            // Auto sign in
            localStorage.setItem('expertPolyhomes_user', JSON.stringify({ name, email }));
            updateUserGreeting();
            closeModal('registerModal');
            showNotification('Account created successfully!', 'success');
        });
    }
    
    // Logout
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('expertPolyhomes_user');
            updateUserGreeting();
            showNotification('Successfully signed out', 'info');
        });
    }
}

// Utility Functions
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
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
        info: 'var(--info)'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function trackConversion(event) {
    // This would integrate with analytics (Google Analytics, Facebook Pixel, etc.)
    console.log(`Conversion tracked: ${event}`);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', event);
    }
}

// Quick order buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-order')) {
        e.preventDefault();
        const type = e.target.getAttribute('data-type');
        openModal('quoteModal');
        showNotification(`Quick order started for ${type} nets`, 'info');
    }
});

// Footer link handlers
document.addEventListener('click', function(e) {
    if (e.target.hasAttribute('data-tab')) {
        e.preventDefault();
        const tabName = e.target.getAttribute('data-tab');
        const designExplorer = document.getElementById('design-explorer');
        
        if (designExplorer) {
            designExplorer.scrollIntoView({ behavior: 'smooth' });
            
            // Activate the corresponding tab
            setTimeout(() => {
                const tabButton = document.querySelector(`[data-tab="${tabName}"]`);
                if (tabButton) tabButton.click();
            }, 500);
        }
    }
});

// Initialize 3D product visualization
function init3DVisualization() {
    const container = document.getElementById('product3d');
    if (!container || typeof THREE === 'undefined') return;

    // Basic Three.js setup 
    // 3D Model Loading and rendering
    function init3DModel(){
      const container = document.getElementById('product3d');
      if (!container) {
        console.error('3D container not found');
        return;
    }

    // To check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.warn('Three.js not loaded, showing fallback visualization');
        showFallbackVisualization(container);
        return; 
    }
        console.log('🎮 Initializing 3D model...');
    load3DModel(container);
}

function showFallbackVisualization(container) {
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #6b7280;">
            <div style="text-align: center;">
                <i class="fas fa-cube" style="font-size: 3rem; margin-bottom: 1rem;"></i>
          <p>3D Window Frames Preview</p>
                <small>Interactive net visualization</small>
                <div style="margin-top: 1rem;">
                    <button onclick="load3DModel(this.parentElement.parentElement.parentElement)" 
                            class="btn-primary" style="padding: 0.5rem 1rem;">
                        Try Loading Again
                    </button>
                </div>
            </div>
        </div>
    `;
    

    console.log('Initializing 3D model...');


    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance" 
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Clear existing content and append canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;    
    scene.add(directionalLight);

    // Camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;

    // Window frame geometry
    const createWindowFrame = (materialType) => {
        const group = new THREE.Group();
        
        // Window frame (aluminum)
        const geometry = new THREE.BoxGeometry(2, 3, 0.1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0xcccccc,
        wireframe: true 
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

       // Handle resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}


    let currentModel = null;

    // Load GLTF/GLB model function
    const loadGLTFModel = (modelPath, materialType) => {
        // Remove current model
        if (currentModel) {
            scene.remove(currentModel);
        }

        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'model-loading';
        loadingDiv.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Loading 3D Model...</p>
        `;
        container.appendChild(loadingDiv);

        // Load the GLB model

        const loader = new THREE.GLTFLoader();
        
        loader.load(
            modelPath,
            (gltf) => {

                console.log('GLTF model loaded:', gltf);
                // Remove loading indicator
                const loadingIndicator = container.querySelector('.model-loading');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }

                const model = gltf.scene;
                currentModel = model;
                
                // Scale and position model
                model.scale.set(1, 1, 1);
                model.position.set(0, 0, 0);
                
                // Enable shadows
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        console.log('Mesh found:',child.name);


                        
                        // Apply material based on selection
                        if (materialType) {
                            let newColor;
                            switch(materialType) {
                                case 'fiberglass':
                                    newColor = new THREE.Color(0xf0f0f0);
                                    break;
                                case 'polyester':
                                    newColor = new THREE.Color(0xe8e8e8);
                                    break;
                                case 'stainless':
                                    newColor = new THREE.Color(0xd0d0d0);
                                    break;
                            }
                            if (newColor && child.material) {
                                child.material.color = newColor;
                            }
                        }
                    }
                });

                scene.add(model);
                currentModel = model;
                
                // Update material info
                updateMaterialInfo(materialType);
            },
            (progress) => {
                // Loading progress (optional)
                const percent = 
                console.log(`Loading model: ${(progress.loaded / progress.total * 100)}%`);
            },
            (error) => {
                console.error('Error loading GLTF model:', error);
                
                // Fallback to generated model
                const loadingIndicator = container.querySelector('.model-loading');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
                
                const fallbackModel = createWindowFrame(materialType);
                scene.add(fallbackModel);
                currentModel = fallbackModel;
                updateMaterialInfo(materialType);
            }
        );
    };

    // Update material info display
    function updateMaterialInfo(materialType) {
        const materialInfo = document.getElementById('materialInfo');
        if (!materialInfo) return;

        const materials = {
            'fiberglass': {
                name: 'Fiberglass Mesh',
                description: 'Durable • Weather-resistant • 5-year warranty'
            },
            'polyester': {
                name: 'Polyester Mesh',
                description: 'Anti-dust • Easy cleaning • 8-year warranty'
            },
            'stainless': {
                name: 'Stainless Steel Mesh',
                description: 'Pet-resistant • Maximum durability • 10-year warranty'
            }
        };

        const material = materials[materialType] || materials['fiberglass'];
        materialInfo.innerHTML = `
            <h4>${material.name}</h4>
            <p>${material.description}</p>
        `;
    }

    // Initialize with default model
    // Replace with your actual GLB/GLTF file path
    const modelPath = 'Assets/3dmodels/window_frames2.glb'; // Update this path
    loadGLTFModel(modelPath, 'fiberglass');

    // Material selector interaction
    const materialRadios = document.querySelectorAll('input[name="material"]');
    materialRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const materialType = this.value;
            loadGLTFModel(modelPath, materialType);
        });
    });

    // Model controls
    let autoRotate = true;
    const rotateBtn = document.getElementById('rotateModel');
    const resetBtn = document.getElementById('resetModel');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');

    if (rotateBtn) {
        rotateBtn.addEventListener('click', function() {
            autoRotate = !autoRotate;
            controls.autoRotate = autoRotate;
            this.classList.toggle('active', autoRotate);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            controls.reset();
            camera.position.set(3, 2, 5);
            camera.lookAt(0, 0, 0);
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            controls.dollyIn(0.5);
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            controls.dollyOut(0.5);
        });
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotate && controls) {
            controls.update();
        }
        
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Add material info element if it doesn't exist
    if (!document.getElementById('materialInfo')) {
        const materialInfo = document.createElement('div');
        materialInfo.id = 'materialInfo';
        materialInfo.className = 'material-info';
        container.appendChild(materialInfo);
        updateMaterialInfo('fiberglass');
    }
}

    // This is a placeholder for 3D functionality
    container.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--gray-500);">
            <div style="text-align: center;">
                <i class="fas fa-cube" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>3D Product Visualization</p>
                <small>Interactive net preview</small>
            </div>
        </div>
    `;
}

// Material selector interaction
document.addEventListener('change', function(e) {
    if (e.target.name === 'material') {
        // Update product visualization based on material
        const material = e.target.value;
        showNotification(`Material changed to ${material}`, 'info');
    }
});

// Performance optimization: Lazy load non-critical resources
function lazyLoadResources() {
    // Lazy load maps when section is visible
    const mapSection = document.getElementById('contact');
    if (mapSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Load map resources here if needed
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(mapSection);
    }
}

// Initialize lazy loading
lazyLoadResources();

// Error handling for failed resources
window.addEventListener('error', function(e) {
    console.error('Script error:', e.error);
});

// Export functions for global access (if needed)
window.ExpertPolyhomes = {
    openModal,
    closeModal,
    showNotification,
    calculateQuote: function() {
        const quoteForm = document.getElementById('smartQuoteForm');
        if (quoteForm) {
            const event = new Event('submit');
            quoteForm.dispatchEvent(event);
        }
    }
};