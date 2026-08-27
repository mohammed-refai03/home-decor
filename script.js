document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on page refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Preloader Dismissal (Minimum 3 seconds)
    const preloader = document.getElementById('pagePreloader');
    if (preloader) {
        const startTime = Date.now();
        const minDuration = 3000; // Minimum 3 seconds

        const dismissPreloader = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDuration - elapsed);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, remaining);
        };

        if (document.readyState === 'complete') {
            dismissPreloader();
        } else {
            window.addEventListener('load', dismissPreloader);
            setTimeout(dismissPreloader, 3500);
        }
    }

    // Initialize AOS (Animate On Scroll with Diversified Animations)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 850,
            easing: 'ease-out-cubic',
            once: true,
            offset: 40,
            delay: 0,
            anchorPlacement: 'top-bottom',
            disable: false
        });
    }

    // Initialize GSAP ScrollTrigger Entrance Effects (Safe reveal without opacity conflicts)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Mobile Navigation Drawer Functionality
    function initMobileNavigationDrawer() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        let drawer = document.getElementById('mobileDrawer');
        let overlay = document.getElementById('mobileDrawerOverlay');

        // Create Drawer elements dynamically if not already in DOM
        if (!drawer) {
            overlay = document.createElement('div');
            overlay.className = 'mobile-drawer-overlay';
            overlay.id = 'mobileDrawerOverlay';

            drawer = document.createElement('div');
            drawer.className = 'mobile-drawer';
            drawer.id = 'mobileDrawer';
            
            const currentPath = window.location.pathname;
            drawer.innerHTML = `
                <div class="mobile-drawer-header">
                    <a href="index.html" class="logo-brand">
                        <img src="assets/images/logo_0318.webp" alt="Stackly Logo" class="site-logo-img">
                    </a>
                    <button class="mobile-drawer-close" id="mobileDrawerClose" aria-label="Close Menu">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
                <div class="mobile-drawer-body">
                    <ul class="mobile-nav-links">
                        <li><a href="index.html" class="${currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/') ? 'active' : ''}"><i class="fa-solid fa-house"></i> Home</a></li>
                        <li><a href="products.html" class="${currentPath.endsWith('products.html') ? 'active' : ''}"><i class="fa-solid fa-couch"></i> Products</a></li>
                        <li><a href="about.html" class="${currentPath.endsWith('about.html') ? 'active' : ''}"><i class="fa-solid fa-circle-info"></i> About Us</a></li>
                        <li><a href="services.html" class="${currentPath.endsWith('services.html') ? 'active' : ''}"><i class="fa-solid fa-layer-group"></i> Services</a></li>
                        <li><a href="blog.html" class="${currentPath.endsWith('blog.html') ? 'active' : ''}"><i class="fa-solid fa-newspaper"></i> Blog</a></li>
                        <li><a href="contact.html" class="${currentPath.endsWith('contact.html') ? 'active' : ''}"><i class="fa-solid fa-envelope"></i> Contact</a></li>
                    </ul>
                    <div class="mobile-drawer-footer">
                        <a href="login.html" class="btn btn-primary"><i class="fa-solid fa-right-to-bracket"></i> Login</a>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(drawer);
        }

        const closeBtn = document.getElementById('mobileDrawerClose');
        let savedScrollY = 0;

        const openDrawer = () => {
            savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            drawer.classList.add('active');
            overlay.classList.add('active');
            document.body.classList.add('mobile-drawer-open');
        };

        const closeDrawer = () => {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('mobile-drawer-open');
            window.scrollTo({ top: savedScrollY, behavior: 'instant' });
        };

        if (mobileBtn) {
            mobileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                openDrawer();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeDrawer);
        }

        if (overlay) {
            overlay.addEventListener('click', closeDrawer);
        }

        // Close drawer when any nav link is clicked
        const links = drawer.querySelectorAll('.mobile-nav-links a, .mobile-drawer-footer a');
        links.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });
    }

    initMobileNavigationDrawer();

    // Home Hero Auto & Manual Multi-Content Slider
    const heroSection = document.getElementById('homeHeroSection');
    if (heroSection) {
        const heroSlides = heroSection.querySelectorAll('.hero-slide-item');
        const heroDots = heroSection.querySelectorAll('.hero-dot');
        const heroPrev = document.getElementById('heroPrevBtn');
        const heroNext = document.getElementById('heroNextBtn');

        let heroCurrentIdx = 0;
        let heroAutoTimer = null;
        const heroInterval = 5000;

        function showHeroSlide(index) {
            if (index < 0) index = heroSlides.length - 1;
            if (index >= heroSlides.length) index = 0;
            heroCurrentIdx = index;

            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === heroCurrentIdx);
            });

            heroDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === heroCurrentIdx);
            });
        }

        function startHeroAutoPlay() {
            stopHeroAutoPlay();
            heroAutoTimer = setInterval(() => {
                showHeroSlide(heroCurrentIdx + 1);
            }, heroInterval);
        }

        function stopHeroAutoPlay() {
            if (heroAutoTimer) clearInterval(heroAutoTimer);
        }

        // Dot click handlers
        heroDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const idx = parseInt(dot.getAttribute('data-index'));
                showHeroSlide(idx);
                startHeroAutoPlay();
            });
        });

        // Prev & Next arrow handlers
        if (heroPrev) {
            heroPrev.addEventListener('click', () => {
                showHeroSlide(heroCurrentIdx - 1);
                startHeroAutoPlay();
            });
        }

        if (heroNext) {
            heroNext.addEventListener('click', () => {
                showHeroSlide(heroCurrentIdx + 1);
                startHeroAutoPlay();
            });
        }

        // Pause on Hover
        heroSection.addEventListener('mouseenter', stopHeroAutoPlay);
        heroSection.addEventListener('mouseleave', startHeroAutoPlay);

        // Start Initial AutoPlay
        startHeroAutoPlay();
    }

    // Initialize Testimonial Swiper
    if (typeof Swiper !== 'undefined') {
        const testimonialSwiper = new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.testimonial-slider-wrapper .swiper-button-next',
                prevEl: '.testimonial-slider-wrapper .swiper-button-prev',
            },
            breakpoints: {
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 30
                },
                // when window width is >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    }

    // Wishlist Button Toggle
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = btn.querySelector('i');
            if (icon.classList.contains('fa-regular')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
                icon.style.color = '#f5b742'; // Accent yellow
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
                icon.style.color = '';
            }
        });
    });

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isActive = question.classList.contains('active');
            
            // Close all
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Open if wasn't active
            if (!isActive) {
                question.classList.add('active');
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // Before & After Slider
    const baSlider = document.getElementById('baSliderInput');
    const baAfter = document.getElementById('baAfterImage');
    const baLine = document.getElementById('baSliderLine');

    if (baSlider && baAfter && baLine) {
        baSlider.addEventListener('input', (e) => {
            const sliderPos = e.target.value;
            baAfter.style.clipPath = `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`;
            baLine.style.left = `${sliderPos}%`;
        });
    }

    // 3D Center Spotlight Avatar Stage Testimonial Slider
    const stageSection = document.getElementById('testiStageSection');
    if (stageSection) {
        const avatarChips = stageSection.querySelectorAll('.avatar-chip');
        const stageCards = stageSection.querySelectorAll('.stage-card');
        const prevBtn = document.getElementById('stagePrevBtn');
        const nextBtn = document.getElementById('stageNextBtn');
        const progressFill = document.getElementById('stageProgressFill');

        let currentIndex = 0;
        let autoPlayTimer = null;
        let progressTimer = null;
        let progressWidth = 0;
        const slideDuration = 5000;

        function showStage(index) {
            if (index < 0) index = stageCards.length - 1;
            if (index >= stageCards.length) index = 0;
            currentIndex = index;

            avatarChips.forEach((chip, i) => {
                chip.classList.toggle('active', i === currentIndex);
            });

            stageCards.forEach((card, i) => {
                card.classList.toggle('active', i === currentIndex);
            });

            resetProgressBar();
        }

        function resetProgressBar() {
            if (progressTimer) clearInterval(progressTimer);
            progressWidth = 0;
            if (progressFill) progressFill.style.width = '0%';

            progressTimer = setInterval(() => {
                progressWidth += 2;
                if (progressFill) progressFill.style.width = `${progressWidth}%`;
                if (progressWidth >= 100) {
                    clearInterval(progressTimer);
                }
            }, 100);
        }

        function startStageAutoPlay() {
            stopStageAutoPlay();
            resetProgressBar();
            autoPlayTimer = setInterval(() => {
                showStage(currentIndex + 1);
            }, slideDuration);
        }

        function stopStageAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            if (progressTimer) clearInterval(progressTimer);
        }

        // Avatar Chip Clicking
        avatarChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const idx = parseInt(chip.getAttribute('data-index'));
                showStage(idx);
                startStageAutoPlay();
            });
        });

        // Prev & Next Floating Arrow Buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showStage(currentIndex - 1);
                startStageAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showStage(currentIndex + 1);
                startStageAutoPlay();
            });
        }

        // Pause on Hover
        stageSection.addEventListener('mouseenter', stopStageAutoPlay);
        stageSection.addEventListener('mouseleave', startStageAutoPlay);

        // Initial Start
        startStageAutoPlay();
    }

    // Initialize Global Form Validations
    initProjectFormValidations();
});

// ==============================================================================
// Global Project Form Validation & 404 Redirection Manager
// ==============================================================================
function initProjectFormValidations() {
    const isNameInput = (input) => {
        if (!input) return false;
        const type = (input.type || '').toLowerCase();
        if (type !== 'text' && type !== 'search' && type !== '') return false;
        const attrStr = `${input.id} ${input.name} ${input.placeholder} ${input.className}`.toLowerCase();
        const labelText = input.labels ? Array.from(input.labels).map(l => l.textContent).join(' ').toLowerCase() : '';
        const parentText = input.parentElement ? input.parentElement.textContent.toLowerCase() : '';

        return attrStr.includes('fullname') || attrStr.includes('firstname') || attrStr.includes('lastname') ||
               attrStr.includes('name') || labelText.includes('name') || parentText.includes('name');
    };

    const isPhoneInput = (input) => {
        if (!input) return false;
        const type = (input.type || '').toLowerCase();
        if (type === 'tel') return true;
        const attrStr = `${input.id} ${input.name} ${input.placeholder} ${input.className}`.toLowerCase();
        const labelText = input.labels ? Array.from(input.labels).map(l => l.textContent).join(' ').toLowerCase() : '';
        const parentText = input.parentElement ? input.parentElement.textContent.toLowerCase() : '';

        return attrStr.includes('phone') || attrStr.includes('mobile') || attrStr.includes('contact') ||
               labelText.includes('phone') || parentText.includes('phone');
    };

    const isEmailInput = (input) => {
        if (!input) return false;
        const type = (input.type || '').toLowerCase();
        if (type === 'email') return true;
        const attrStr = `${input.id} ${input.name} ${input.placeholder}`.toLowerCase();
        return attrStr.includes('email') || attrStr.includes('mail');
    };

    // Attach real-time input enforcement and validation tooltips to all input fields
    document.querySelectorAll('input').forEach(input => {
        // Name field: ONLY alphabets and spaces
        if (isNameInput(input)) {
            const validateName = () => {
                const val = input.value;
                if (val.length > 0 && !/^[a-zA-Z\s]+$/.test(val)) {
                    input.setCustomValidity("Please enter alphabets only.");
                } else {
                    input.setCustomValidity("");
                }
            };

            input.addEventListener('input', validateName);
            input.addEventListener('blur', validateName);
        }

        // Phone field: ONLY numbers
        if (isPhoneInput(input)) {
            const validatePhone = () => {
                const val = input.value;
                if (val.length > 0 && !/^[0-9]+$/.test(val)) {
                    input.setCustomValidity("Please enter numbers only.");
                } else {
                    input.setCustomValidity("");
                }
            };

            input.addEventListener('input', validatePhone);
            input.addEventListener('blur', validatePhone);
        }

        // Email field: .com is MANDATORY to treat as valid email
        if (isEmailInput(input)) {
            const validateEmail = () => {
                const val = input.value.trim();
                if (val.length > 0) {
                    const endsWithCom = val.toLowerCase().endsWith('.com');
                    const isEmailPattern = /^[^\s@]+@[^\s@]+\.com$/i.test(val);

                    if (!endsWithCom || !isEmailPattern) {
                        input.setCustomValidity("Please enter a valid email address ending with .com");
                    } else {
                        input.setCustomValidity("");
                    }
                } else {
                    input.setCustomValidity("");
                }
            };

            input.addEventListener('input', validateEmail);
            input.addEventListener('change', validateEmail);
            input.addEventListener('blur', validateEmail);
        }
    });

    // Sync logged in email & role to profile display places
    syncUserProfileData();

    // Handle Form Submissions across all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            let firstInvalidInput = null;
            const inputs = form.querySelectorAll('input');

            inputs.forEach(input => {
                const val = input.value;
                if (isNameInput(input)) {
                    if (val.length > 0 && !/^[a-zA-Z\s]+$/.test(val)) {
                        input.setCustomValidity("Please enter alphabets only.");
                        if (!firstInvalidInput) firstInvalidInput = input;
                    } else {
                        input.setCustomValidity("");
                    }
                } else if (isPhoneInput(input)) {
                    if (val.length > 0 && !/^[0-9]+$/.test(val)) {
                        input.setCustomValidity("Please enter numbers only.");
                        if (!firstInvalidInput) firstInvalidInput = input;
                    } else {
                        input.setCustomValidity("");
                    }
                } else if (isEmailInput(input)) {
                    const trimmed = val.trim();
                    const endsWithCom = trimmed.toLowerCase().endsWith('.com');
                    const isEmailPattern = /^[^\s@]+@[^\s@]+\.com$/i.test(trimmed);

                    if (trimmed.length > 0 && (!endsWithCom || !isEmailPattern)) {
                        input.setCustomValidity("Please enter a valid email address ending with .com");
                        if (!firstInvalidInput) firstInvalidInput = input;
                    } else {
                        input.setCustomValidity("");
                    }
                }
            });

            if (!form.checkValidity() || firstInvalidInput) {
                e.preventDefault();
                if (firstInvalidInput) {
                    firstInvalidInput.reportValidity();
                } else {
                    form.reportValidity();
                }
                return false;
            }

            // Redirection logic according to page & form type
            const formId = form.id;
            const pathname = window.location.pathname.toLowerCase();
            const isLoginPage = formId === 'loginForm' || pathname.endsWith('login.html');
            const isSignupPage = formId === 'signupForm' || pathname.endsWith('signup.html');

            if (isLoginPage) {
                e.preventDefault();
                const emailInput = form.querySelector('input[type="email"], #loginEmail');
                const selectedRoleInput = form.querySelector('input[name="userRole"]:checked');
                const userEmail = emailInput ? emailInput.value.trim() : '';
                const selectedRole = selectedRoleInput ? selectedRoleInput.value : 'user';

                if (userEmail) {
                    localStorage.setItem('currentUserEmail', userEmail);
                    localStorage.setItem('currentUserRole', selectedRole);
                }

                if (selectedRole === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            } else if (isSignupPage) {
                e.preventDefault();
                window.location.href = 'login.html';
            } else {
                // ALL OTHER FORMS on home, about, services, products, blog, contact, user-dashboard, admin-dashboard -> redirect to 404.html
                e.preventDefault();
                window.location.href = '404.html';
            }
        });
    });
}

function syncUserProfileData() {
    const savedEmail = localStorage.getItem('currentUserEmail');
    const savedRole = localStorage.getItem('currentUserRole') || 'user';

    if (!savedEmail) return;

    const roleLabel = savedRole === 'admin' ? 'Administrator' : 'Customer Account';

    const sidebarEmailEl = document.querySelector('.sidebar-user-email');
    const sidebarNameEl = document.querySelector('.sidebar-user-name');
    if (sidebarEmailEl) sidebarEmailEl.textContent = savedEmail;
    if (sidebarNameEl) sidebarNameEl.textContent = roleLabel;

    const topbarEmailEl = document.querySelector('.topbar-user-text .email');
    const topbarNameEl = document.querySelector('.topbar-user-text .name');
    if (topbarEmailEl) topbarEmailEl.textContent = savedEmail;
    if (topbarNameEl) topbarNameEl.textContent = savedRole === 'admin' ? 'Admin Console' : 'Customer';

    const profileEmailInput = document.querySelector('input[type="email"].form-control, #profileEmail');
    if (profileEmailInput && savedEmail) {
        profileEmailInput.value = savedEmail;
    }
}

// Product Filtering
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

if (filterBtns.length > 0 && productCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const filter = btn.getAttribute("data-filter");
            
            productCards.forEach(card => {
                if (filter === "all") {
                    card.style.display = "block";
                    setTimeout(() => card.style.opacity = "1", 50);
                } else {
                    if (card.getAttribute("data-category") === filter) {
                        card.style.display = "block";
                        setTimeout(() => card.style.opacity = "1", 50);
                    } else {
                        card.style.opacity = "0";
                        setTimeout(() => card.style.display = "none", 300);
                    }
                }
            });
        });
    });
}

// Interactive Home Style Finder Quiz Switcher
const stylePills = document.querySelectorAll('.home-quiz-spotlight .quiz-pill');
const quizCard = document.querySelector('.home-quiz-spotlight .quiz-preview-card');

if (stylePills.length > 0 && quizCard) {
    const styleData = {
        japandi: {
            title: "Japandi Minimalist Sanctuary",
            score: "98% Style Match",
            desc: "Blends Japanese wabi-sabi principles with warm Scandinavian warmth. Features natural oak, low-profile sofas, and muted ceramic textures.",
            img: "assets/images/image_001.webp",
            swatches: [
                { color: "#203528", label: "Forest Green" },
                { color: "#e8ded1", label: "Soft Linen" },
                { color: "#f5b742", label: "Golden Brass" },
                { color: "#8b5a2b", label: "Warm Teak" }
            ]
        },
        botanical: {
            title: "Warm Botanical Living Oasis",
            score: "96% Style Match",
            desc: "Infuses rich leafy terracotta tones with lush indoor greenery, rattan textures, and warm earth-toned upholstery.",
            img: "assets/images/image_002.webp",
            swatches: [
                { color: "#2e4a38", label: "Lush Sage" },
                { color: "#c86d51", label: "Terracotta" },
                { color: "#d4a373", label: "Natural Rattan" },
                { color: "#f4f1de", label: "Warm Ivory" }
            ]
        },
        scandinavian: {
            title: "Modern Scandinavian Loft",
            score: "95% Style Match",
            desc: "Clean functional lines paired with cozy textiles, blonde wood accents, and bright open light for an airy modern home.",
            img: "assets/images/image_003.webp",
            swatches: [
                { color: "#4a5568", label: "Slate Grey" },
                { color: "#edf2f7", label: "Nordic White" },
                { color: "#e2e8f0", label: "Ash Wood" },
                { color: "#f6ad55", label: "Amber Light" }
            ]
        }
    };

    const cardImg = quizCard.querySelector('.quiz-img-holder img');
    const cardTitle = quizCard.querySelector('h3');
    const cardScore = quizCard.querySelector('.quiz-match-score');
    const cardDesc = quizCard.querySelector('.quiz-preview-desc');
    const swatchRow = quizCard.querySelector('.quiz-swatch-row');

    stylePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const styleKey = pill.getAttribute('data-style');
            const data = styleData[styleKey];

            if (!data) return;

            // Update active pill
            stylePills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            // Smooth fade transition
            quizCard.style.opacity = '0.5';
            quizCard.style.transform = 'translateY(6px)';

            setTimeout(() => {
                if (cardImg) cardImg.src = data.img;
                if (cardTitle) cardTitle.textContent = data.title;
                if (cardScore) cardScore.textContent = data.score;
                if (cardDesc) cardDesc.textContent = data.desc;

                if (swatchRow) {
                    swatchRow.innerHTML = '<span class="quiz-swatch-title">Palette:</span>' + 
                        data.swatches.map(s => `<span class="quiz-dot" style="background: ${s.color};" title="${s.label}"></span>`).join('');
                }

                quizCard.style.opacity = '1';
                quizCard.style.transform = 'translateY(0)';
            }, 180);
        });
    });
}

// Wishlist Heart Button Click Toggle Handler
document.addEventListener('click', (e) => {
    const wishlistBtn = e.target.closest('.wishlist-btn');
    if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        wishlistBtn.classList.toggle('active');
        const icon = wishlistBtn.querySelector('i');
        if (icon) {
            if (wishlistBtn.classList.contains('active')) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            } else {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        }
    }
});


