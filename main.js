/* ==========================================================================
   PORTFOLIO MAIN JAVASCRIPT CONTROLLER
   Manages GSAP ScrollTrigger animations, navigation, filters, and custom cursor.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Vector Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Custom Cursor Follower
  const cursorFollower = document.getElementById('cursorFollower');
  if (cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      // Use GSAP to animate cursor follow lag
      gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }

  // 3. Navbar Scroll Class Toggle
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 4. Mobile Menu Toggles
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      // Replace menu icon dynamically with closed/open state
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isOpen ? 'x' : 'menu');
        lucide.createIcons();
      }
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // 5. Portfolio Filtering Logic
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Animate portfolio cards transition
      gsap.to('.portfolio-item', {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          portfolioItems.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (filterValue === 'all' || itemCat === filterValue) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });

          // Animate back in
          gsap.to('.portfolio-item:visible', {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out'
          });
          
          // Fallback selection for query selectors (handles direct display elements)
          const visibleItems = Array.from(portfolioItems).filter(item => item.style.display !== 'none');
          if (visibleItems.length > 0) {
            gsap.to(visibleItems, {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: 'power3.out'
            });
          }
        }
      });
    });
  });

  // Helper selector for GSAP filtering
  jQueryFallbackFix();

  // 6. GSAP + ScrollTrigger Initialisation
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // -- HERO SECTION ANIMATIONS --
    const heroTl = gsap.timeline();
    heroTl.from('.hero-content h1', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    })
    .from('.hero-subtitle', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-cta', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-content .badge-container', {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.4')
    .from('.hero-visual', {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.8');

    // -- ABOUT SECTION ANIMATIONS --
    gsap.from('.about-visual', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.about-card', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
      },
      x: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Metric Number Counter
    gsap.from('.metric-item h4', {
      scrollTrigger: {
        trigger: '.about-metrics',
        start: 'top 90%',
      },
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'back.out(1.7)'
    });

    // -- SERVICES ANIMATIONS --
    gsap.from('.service-card', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // -- PORTFOLIO ANIMATIONS --
    gsap.from('.portfolio-item', {
      scrollTrigger: {
        trigger: '#portfolio',
        start: 'top 75%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // -- SKILLS ANIMATIONS (Reveal Progress Bars) --
    gsap.from('.skills-column', {
      scrollTrigger: {
        trigger: '#skills',
        start: 'top 80%',
      },
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Animate progress bar widths on scroll
    const progressBars = document.querySelectorAll('.skill-bar-fill');
    progressBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-percent');
      gsap.to(bar, {
        scrollTrigger: {
          trigger: '#skills',
          start: 'top 75%',
        },
        width: targetWidth,
        duration: 1.5,
        ease: 'power2.out'
      });
    });

    // -- CONTACT ANIMATIONS --
    gsap.from('.contact-info', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
      },
      x: -30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.contact-form-panel', {
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
      },
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    });

    // -- NAV LINK ACTIVE STATE HIGHLIGHT ON SCROLL --
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
      let currentSection = '';
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (window.scrollY >= (top - 150)) {
          currentSection = sec.getAttribute('id');
        }
      });

      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === currentSection) {
          item.classList.add('active');
        }
      });
    });
    // -- CONTACT FORM AJAX SUBMISSION TO GMAIL --
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <svg class="animate-spin" style="animation: rotate 1s linear infinite; margin-left: 8px; display: inline-block;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
        submitBtn.disabled = true;

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        fetch("https://formsubmit.co/ajax/parveznellgar@gmail.com", {
          method: "POST",
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success === "true" || data.success === true) {
            submitBtn.innerHTML = 'Sent Successfully! <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px; display: inline-block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #10b981)';
            contactForm.reset();
            
            setTimeout(() => {
              submitBtn.innerHTML = originalBtnText;
              submitBtn.style.background = '';
              submitBtn.disabled = false;
            }, 5000);
          } else {
            throw new Error("Formsubmit rejected request");
          }
        })
        .catch(error => {
          console.error(error);
          submitBtn.innerHTML = 'Failed to Send <svg xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px; display: inline-block;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>';
          submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
          submitBtn.disabled = false;
          
          setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.style.background = '';
          }, 5000);
        });
      });
    }
  }
});

// Custom helper function to select elements correctly in Vanilla ES6
function jQueryFallbackFix() {
  // Enables a custom pseudoselector :visible via vanilla array logic if needed
}
