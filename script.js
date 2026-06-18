/* ==============================================
   PORTFOLIO WEBSITE — JAVASCRIPT
   ==============================================
   
   This file handles all interactive features:
   1. Typing animation effect
   2. Sticky navbar with scroll detection
   3. Mobile menu toggle
   4. Fade-in animations on scroll
   5. Skill progress bar animation
   6. Counter animation for stats
   7. Scroll-to-top button
   8. Active navigation link highlighting
   9. Contact form handling
   
============================================== */


// ==============================================
// Wait for the entire page to load before
// running any JavaScript code.
// ==============================================
document.addEventListener('DOMContentLoaded', function () {

    // ==========================================
    // 1. TYPING ANIMATION
    // ==========================================
    // This creates a typewriter effect that cycles
    // through different phrases, typing them out
    // one character at a time and then deleting.
    // ==========================================

    const typingElement = document.getElementById('typing-text');

    // Array of phrases to cycle through
    const phrases = [
        'an AI/ML Enthusiast',
        'a Creative Problem Solver',
        'a Future Entrepreneur',
        'a Web Developer in Training',
        'a Lifelong Learner',
        'a Tech Dreamer'
    ];

    let phraseIndex = 0;    // Which phrase we're currently on
    let charIndex = 0;      // Which character we're at in the phrase
    let isDeleting = false;  // Are we typing or deleting?
    let typingSpeed = 100;   // Milliseconds between each character

    function typeEffect() {
        // Get the current phrase
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            // DELETING: Remove one character at a time
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;  // Delete faster than typing
        } else {
            // TYPING: Add one character at a time
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Check if we've finished typing the entire phrase
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end of the phrase before deleting
            typingSpeed = 2000;
            isDeleting = true;
        }

        // Check if we've finished deleting the entire phrase
        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            // Move to the next phrase (loop back to 0 if at the end)
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;  // Small pause before typing next phrase
        }

        // Call this function again after 'typingSpeed' milliseconds
        setTimeout(typeEffect, typingSpeed);
    }

    // Start the typing animation
    typeEffect();


    // ==========================================
    // 2. STICKY NAVBAR
    // ==========================================
    // When the user scrolls down, add a background
    // and shadow to the navigation bar.
    // ==========================================

    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        // If scrolled more than 50 pixels, add the 'scrolled' class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Listen for scroll events
    window.addEventListener('scroll', handleNavbarScroll);


    // ==========================================
    // 3. MOBILE MENU TOGGLE
    // ==========================================
    // On small screens, clicking the hamburger
    // button opens/closes the navigation menu.
    // ==========================================

    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function () {
        // Toggle the 'active' class on both the button and menu
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close the mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = navToggle.contains(event.target);

        if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });


    // ==========================================
    // 4. FADE-IN ANIMATIONS ON SCROLL
    // ==========================================
    // Elements with the 'fade-in' class start
    // invisible and fade in when scrolled into view.
    // We use IntersectionObserver for performance.
    // ==========================================

    const fadeInElements = document.querySelectorAll('.fade-in');

    // Create an IntersectionObserver
    // It watches elements and tells us when they enter the viewport
    const fadeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Element is now visible — add the 'visible' class
                entry.target.classList.add('visible');
                // Stop observing this element (animation only happens once)
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        // Trigger when 15% of the element is visible
        threshold: 0.15,
        // Start observing a bit before the element enters the viewport
        rootMargin: '0px 0px -50px 0px'
    });

    // Start observing all fade-in elements
    fadeInElements.forEach(function (element) {
        fadeObserver.observe(element);
    });


    // ==========================================
    // 5. SKILL PROGRESS BAR ANIMATION
    // ==========================================
    // When skill cards scroll into view, their
    // progress bars fill up to the target width.
    // ==========================================

    const progressBars = document.querySelectorAll('.progress-fill');

    const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Get the target width from the data attribute
                const targetWidth = entry.target.getAttribute('data-width');
                // Set the width to trigger the CSS transition
                entry.target.style.width = targetWidth + '%';
                // Stop observing
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe each progress bar
    progressBars.forEach(function (bar) {
        skillObserver.observe(bar);
    });


    // ==========================================
    // 6. COUNTER ANIMATION FOR STATS
    // ==========================================
    // The numbers in the hero section count up
    // from 0 to their target value.
    // ==========================================

    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;  // 2 seconds for the animation
        const stepTime = 50;    // Update every 50 milliseconds
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(function () {
            current += increment;

            // Check if we've reached or exceeded the target
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);  // Stop the timer
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // Observe each stat number
    statNumbers.forEach(function (number) {
        counterObserver.observe(number);
    });


    // ==========================================
    // 7. SCROLL-TO-TOP BUTTON
    // ==========================================
    // A floating button that appears when you
    // scroll down. Clicking it scrolls to the top.
    // ==========================================

    const scrollTopBtn = document.getElementById('scroll-top-btn');

    function handleScrollTopVisibility() {
        // Show the button when scrolled down more than 500px
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScrollTopVisibility);

    scrollTopBtn.addEventListener('click', function () {
        // Smooth scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================
    // 8. ACTIVE NAVIGATION LINK HIGHLIGHTING
    // ==========================================
    // As the user scrolls, the nav link for the
    // currently visible section gets highlighted.
    // ==========================================

    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNavLink() {
        const scrollPosition = window.scrollY + 120;  // Offset for navbar height

        sections.forEach(function (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Check if the current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove 'active' from all nav links
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                });

                // Add 'active' to the matching nav link
                const activeLink = document.querySelector('.nav-link[href="#' + sectionId + '"]');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNavLink);


    // ==========================================
    // 9. CONTACT FORM HANDLING
    // ==========================================
    // Since this is a static website (no server),
    // we just show a success message when the
    // form is submitted. In a real project, you'd
    // send the data to a server or service like
    // Formspree or EmailJS.
    // ==========================================

    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', function (event) {
        // Prevent the default form submission (page reload)
        event.preventDefault();

        // Get form values
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Simple validation
        if (!name || !email || !message) {
            showFormFeedback('Please fill in all fields.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = document.getElementById('form-submit');
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate a network delay (1.5 seconds)
        setTimeout(function () {
            showFormFeedback('Message sent successfully! I\'ll get back to you soon. 🎉', 'success');
            contactForm.reset();  // Clear the form
            submitBtn.innerHTML = '<span>Send Message</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
            submitBtn.disabled = false;
        }, 1500);
    });

    // Function to display feedback message below the form
    function showFormFeedback(message, type) {
        // Remove any existing feedback message
        const existingFeedback = document.querySelector('.form-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Create a new feedback element
        const feedback = document.createElement('div');
        feedback.classList.add('form-feedback');
        feedback.textContent = message;

        // Style based on type (success or error)
        feedback.style.marginTop = '16px';
        feedback.style.padding = '14px 20px';
        feedback.style.borderRadius = '10px';
        feedback.style.fontSize = '0.9rem';
        feedback.style.fontWeight = '500';
        feedback.style.textAlign = 'center';
        feedback.style.animation = 'fadeInUp 0.4s ease-out';

        if (type === 'success') {
            feedback.style.background = 'rgba(34, 197, 94, 0.1)';
            feedback.style.color = '#16A34A';
            feedback.style.border = '1px solid rgba(34, 197, 94, 0.2)';
        } else {
            feedback.style.background = 'rgba(239, 68, 68, 0.1)';
            feedback.style.color = '#DC2626';
            feedback.style.border = '1px solid rgba(239, 68, 68, 0.2)';
        }

        // Add the feedback element after the form
        contactForm.appendChild(feedback);

        // Auto-remove after 5 seconds
        setTimeout(function () {
            if (feedback.parentNode) {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-10px)';
                feedback.style.transition = 'all 0.3s ease';
                setTimeout(function () {
                    feedback.remove();
                }, 300);
            }
        }, 5000);
    }


    // ==========================================
    // 10. STAGGERED ANIMATION DELAYS
    // ==========================================
    // Add slight delays to sibling elements so
    // they animate in one after another instead
    // of all at once.
    // ==========================================

    function addStaggeredDelay(containerSelector, childSelector) {
        const containers = document.querySelectorAll(containerSelector);
        containers.forEach(function (container) {
            const children = container.querySelectorAll(childSelector);
            children.forEach(function (child, index) {
                // Each child gets a slightly longer delay
                child.style.transitionDelay = (index * 0.08) + 's';
            });
        });
    }

    // Apply staggered delays to grid items
    addStaggeredDelay('.skills-grid', '.skill-card');
    addStaggeredDelay('.hobbies-grid', '.hobby-card');
    addStaggeredDelay('.funfacts-grid', '.funfact-card');
    addStaggeredDelay('.goals-grid', '.goal-card');


    // ==========================================
    // 11. SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ==========================================
    // This ensures clicking any link that starts
    // with '#' scrolls smoothly to that section.
    // (Backup for browsers where CSS smooth scroll
    // might not work perfectly.)
    // ==========================================

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================
    // 12. PARALLAX-LIKE EFFECT ON HERO SHAPES
    // ==========================================
    // The background shapes move slightly as you
    // scroll, creating a subtle parallax effect.
    // ==========================================

    function parallaxShapes() {
        const scrolled = window.scrollY;
        const shapes = document.querySelectorAll('.shape');

        shapes.forEach(function (shape, index) {
            // Each shape moves at a different speed
            const speed = (index + 1) * 0.03;
            const yOffset = scrolled * speed;
            shape.style.transform = 'translateY(' + yOffset + 'px)';
        });
    }

    window.addEventListener('scroll', parallaxShapes);


    // ==========================================
    // INITIALIZATION COMPLETE
    // ==========================================
    // Log a message to the console to confirm
    // everything loaded successfully.
    // ==========================================
    console.log('✨ Portfolio website loaded successfully!');
    console.log('📧 Feel free to explore the code and learn from it.');

});
