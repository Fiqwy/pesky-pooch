/* ==========================================
   PESKY POOCH — Premium Script
   Dog Training & Pet Care, Gold Coast
   GSAP ScrollTrigger + Carousel + CRO
   ========================================== */

document.addEventListener('DOMContentLoaded', function () {

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Header Scroll Effect ----------
    var header = document.getElementById('header');
    var hero = document.getElementById('hero');
    var floatingPhone = document.getElementById('floating-phone');
    var mobileCta = document.getElementById('mobile-cta-bar');

    function handleScroll() {
        var scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (hero) {
            var heroBottom = hero.offsetTop + hero.offsetHeight;
            if (floatingPhone) {
                if (scrollY > heroBottom - 200) {
                    floatingPhone.classList.add('visible');
                } else {
                    floatingPhone.classList.remove('visible');
                }
            }
            if (mobileCta) {
                if (scrollY > heroBottom - 200) {
                    mobileCta.classList.add('visible');
                } else {
                    mobileCta.classList.remove('visible');
                }
            }
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ---------- Mobile Menu ----------
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            var isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ---------- Smooth Scroll ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header.offsetHeight;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // ---------- Active Nav Highlighting (Scroll Spy) ----------
    var sections = document.querySelectorAll('section[id]');
    var navItems = document.querySelectorAll('.nav-links a');
    var scrollSpyTicking = false;

    function updateActiveNav() {
        var scrollPosition = window.scrollY + header.offsetHeight + 100;

        sections.forEach(function (section) {
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(function (item) {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
        scrollSpyTicking = false;
    }

    window.addEventListener('scroll', function () {
        if (!scrollSpyTicking) {
            requestAnimationFrame(updateActiveNav);
            scrollSpyTicking = true;
        }
    }, { passive: true });

    // ---------- FAQ Accordion ----------
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');

        question.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                var answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ---------- GSAP Animations ----------
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        initGSAPAnimations();
    } else {
        // Fallback: show everything immediately
        document.querySelectorAll('[data-reveal], [data-hero-reveal]').forEach(function (el) {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    function initGSAPAnimations() {
        // Refresh after images/fonts load
        window.addEventListener('load', function () { ScrollTrigger.refresh(); });

        if (prefersReducedMotion) {
            // Show everything without animation
            gsap.set('[data-reveal], [data-hero-reveal]', { opacity: 1, y: 0 });
            return;
        }

        // --- Scroll Progress Bar ---
        var scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            gsap.to(scrollProgress, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.3
                }
            });
        }

        // --- Hero Staggered Reveal ---
        var heroElements = document.querySelectorAll('[data-hero-reveal]');
        if (heroElements.length) {
            gsap.set(heroElements, { opacity: 0, y: 40 });
            var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            heroElements.forEach(function (el, i) {
                heroTl.to(el, { opacity: 1, y: 0, duration: 0.8 }, i * 0.15);
            });
        }

        // --- Hero Parallax ---
        var heroBg = document.querySelector('.hero-bg-pattern');
        if (heroBg) {
            gsap.to(heroBg, {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }

        // --- Scroll Reveals (all data-reveal elements) ---
        ScrollTrigger.batch('[data-reveal]', {
            onEnter: function (elements) {
                gsap.fromTo(elements,
                    { opacity: 0, y: 60 },
                    { opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power2.out' }
                );
            },
            once: true,
            start: 'top 85%'
        });

        // --- Counter Animation via ScrollTrigger ---
        document.querySelectorAll('[data-count]').forEach(function (el) {
            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: function () {
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    animateCounter(el, target);
                }
            });
        });
    }

    // ---------- Failsafe: Force-show all animated elements after 4s ----------
    setTimeout(function() {
        document.querySelectorAll('[data-reveal], [data-hero-reveal]').forEach(function(el) {
            if (getComputedStyle(el).opacity === '0') {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }
        });
    }, 4000);

    // ---------- Counter Animation ----------
    function animateCounter(element, target) {
        var suffix = element.getAttribute('data-suffix') || '';
        if (prefersReducedMotion) {
            element.textContent = target + suffix;
            return;
        }

        var duration = 1800;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var easeOut = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(easeOut * target);
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = target + suffix;
            }
        }

        requestAnimationFrame(step);
    }

    // ---------- Marquee Reduced Motion ----------
    if (prefersReducedMotion) {
        var marqueeTrack = document.querySelector('.marquee-track');
        if (marqueeTrack) marqueeTrack.style.animationPlayState = 'paused';
    }

    // ---------- Contact Form ----------
    var contactForm = document.getElementById('contact-form');
    var formSuccess = document.getElementById('form-success');

    if (contactForm) {
        var formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(function (input) {
            if (input.value) {
                input.classList.add('has-value');
            }

            input.addEventListener('focus', function () {
                this.closest('.form-group').classList.add('focused');
            });

            input.addEventListener('blur', function () {
                this.closest('.form-group').classList.remove('focused');
                if (this.value) {
                    this.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                }
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            contactForm.querySelectorAll('.form-group').forEach(function (group) {
                group.classList.remove('error');
            });

            var isValid = true;

            var nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Please enter your name');
                isValid = false;
            }

            var phoneInput = document.getElementById('phone');
            if (!phoneInput.value.trim()) {
                showError(phoneInput, 'Please enter your phone number');
                isValid = false;
            }

            var serviceSelect = document.getElementById('service');
            if (!serviceSelect.value) {
                showError(serviceSelect, 'Please select a service');
                isValid = false;
            }

            if (isValid) {
                var submitBtn = contactForm.querySelector('button[type="submit"]');
                var originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                var leadData = {
                    name: document.getElementById('name').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    message: 'Service: ' + document.getElementById('service').value,
                    source: 'web_form'
                };

                fetch('https://appliedintelligence.biz/api/webhook/lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'd21d8bacb2a48cb5681fa7b559320222e62a2b31a0aa3d50b184e5cc5f98452d'
                    },
                    body: JSON.stringify(leadData)
                }).then(function (response) {
                    if (response.ok) {
                        showFormSuccess();
                    } else {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalText;
                        alert('Something went wrong. Please try calling Nikki directly on 0416 346 553.');
                    }
                }).catch(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    alert('Connection error. Please try calling Nikki directly on 0416 346 553.');
                });
            }
        });

        function showFormSuccess() {
            var formElements = contactForm.querySelectorAll('.form-group, .btn, .form-note, h3');
            formElements.forEach(function (el) {
                el.style.display = 'none';
            });
            formSuccess.classList.add('visible');
        }
    }

    function showError(input, message) {
        var group = input.closest('.form-group');
        group.classList.add('error');
        var errorEl = group.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

});
