/* ==========================================================================
   Portfolio — Premium JavaScript
   Production-ready · Performant · Accessible
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------
     Global: Reduced Motion Preference
  ------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Utility: Debounce
  ------------------------------------------------------------ */
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ------------------------------------------------------------
     Utility: Throttle via requestAnimationFrame
  ------------------------------------------------------------ */
  function rafThrottle(fn) {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
    };
  }

  /* ------------------------------------------------------------
     Utility: Easing — easeOutQuad
  ------------------------------------------------------------ */
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  /* ============================================================
     1. PRELOADER
  ============================================================ */
  ;(() => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.remove();
        }, 600);
      }, 800);
    });
  })();

  /* ============================================================
     2. PARTICLE CANVAS — Constellation Effect
  ============================================================ */
  ;(() => {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const PARTICLE_COUNT = 80;
    const CONNECTION_DIST = 150;
    let particles = [];
    let animId = null;

    function resize() {
      // Read dimensions once to avoid layout thrashing
      const rect = canvas.parentElement
        ? canvas.parentElement.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    function createParticle() {
      const isGold = Math.random() < 0.3;
      const opacity = 0.2 + Math.random() * 0.4;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 1 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * (0.3 + Math.random() * 0.2),
        vy: (Math.random() - 0.5) * (0.3 + Math.random() * 0.2),
        opacity,
        color: isGold
          ? `rgba(212,160,83,${opacity})`
          : `rgba(255,255,255,${opacity})`,
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const lineOpacity = (1 - dist / CONNECTION_DIST) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,255,255,${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
    }

    function updateParticles() {
      const w = canvas.width;
      const h = canvas.height;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Clamp inside bounds
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }
    }

    function animate() {
      updateParticles();
      drawParticles();
      animId = requestAnimationFrame(animate);
    }

    // Init
    resize();
    initParticles();

    if (prefersReducedMotion) {
      // Static render only — no animation loop
      drawParticles();
    } else {
      animate();
    }

    // Debounced resize
    window.addEventListener('resize', debounce(() => {
      resize();
      // Re-clamp particles to new bounds
      for (const p of particles) {
        p.x = Math.min(p.x, canvas.width);
        p.y = Math.min(p.y, canvas.height);
      }
      if (prefersReducedMotion) drawParticles();
    }, 200), { passive: true });
  })();

  /* ============================================================
     3. NAVIGATION — Scroll Class + Smooth Scroll
  ============================================================ */
  ;(() => {
    const nav = document.querySelector('.nav');
    const navLinksAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const navLinksContainer = document.querySelector('.nav-links');
    const navToggle = document.querySelector('.nav-toggle');

    // Scrolled class with rAF throttle
    if (nav) {
      const updateNavScroll = rafThrottle(() => {
        if (window.scrollY > 80) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      });
      window.addEventListener('scroll', updateNavScroll, { passive: true });
      // Run once on load
      updateNavScroll();
    }

    // Smooth scroll for nav links
    navLinksAnchors.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        // Close mobile nav after clicking a link
        if (navLinksContainer && navLinksContainer.classList.contains('active')) {
          navLinksContainer.classList.remove('active');
          if (navToggle) navToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  })();

  /* ============================================================
     4. MOBILE NAV TOGGLE
  ============================================================ */
  ;(() => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
      const isActive = navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  })();

  /* ============================================================
     5. CATEGORY FILTERING
  ============================================================ */
  ;(() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        let visibleIndex = 0;

        projectCards.forEach(card => {
          const category = card.dataset.category;
          const isVisible = filter === 'all' || category === filter;

          if (isVisible) {
            card.classList.remove('hide');
            card.classList.add('show');
            const delay = visibleIndex * 50;
            card.style.animationDelay = `${delay}ms`;
            visibleIndex++;

            // Clear delay after animation completes
            setTimeout(() => {
              card.style.animationDelay = '';
            }, delay + 300);
          } else {
            card.classList.add('hide');
            card.classList.remove('show');
            card.style.animationDelay = '';
          }
        });
      });
    });
  })();

  /* ============================================================
     6. SCROLL REVEAL — Intersection Observer
  ============================================================ */
  ;(() => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (prefersReducedMotion) {
      reveals.forEach(el => el.classList.add('active'));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    reveals.forEach(el => revealObserver.observe(el));
  })();

  /* ============================================================
     7. 3D TILT ON PROJECT CARDS
  ============================================================ */
  ;(() => {
    if (prefersReducedMotion) return;
    if ('ontouchstart' in window) return;

    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize position to -1..1
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        // Max 3 degrees
        const rotateY = x * 3;
        const rotateX = -y * 3;

        card.style.transform =
          `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.3s ease-out';
        card.style.transform =
          'perspective(800px) rotateX(0deg) rotateY(0deg)';
        // Remove inline transition after it completes so it doesn't interfere
        setTimeout(() => {
          card.style.transition = '';
        }, 300);
      });
    });
  })();

  /* ============================================================
     8. CURSOR GLOW
  ============================================================ */
  ;(() => {
    if (prefersReducedMotion) return;
    if (window.innerWidth <= 1024) return;

    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    let mouseX = 0;
    let mouseY = 0;
    let rafScheduled = false;

    function updateGlow() {
      glow.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      rafScheduled = false;
    }

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(updateGlow);
      }
    }, { passive: true });

    document.addEventListener('mouseenter', () => {
      glow.classList.add('active');
    });

    document.addEventListener('mouseleave', () => {
      glow.classList.remove('active');
    });
  })();

  /* ============================================================
     9. LIGHTBOX WITH NAVIGATION
  ============================================================ */
  ;(() => {
    const lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    const lightboxImg = lightbox.querySelector('img');
    const lightboxTitle = lightbox.querySelector('h3');
    const lightboxCategory = lightbox.querySelector('p');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');

    let currentCards = [];
    let currentIndex = 0;

    function getVisibleCards() {
      // Return cards that are currently visible (not hidden by filter)
      return Array.from(
        document.querySelectorAll('.project-card')
      ).filter(card => !card.classList.contains('hide'));
    }

    function showCard(index) {
      if (index < 0 || index >= currentCards.length) return;
      currentIndex = index;

      const card = currentCards[currentIndex];
      const img = card.querySelector('img');
      const title = card.dataset.title || '';
      const categoryLabel = card.dataset.categoryLabel || '';

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxCategory) lightboxCategory.textContent = categoryLabel;
    }

    function openLightbox(card) {
      currentCards = getVisibleCards();
      currentIndex = currentCards.indexOf(card);
      if (currentIndex === -1) currentIndex = 0;

      showCard(currentIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function navigatePrev() {
      if (currentCards.length === 0) return;
      const newIndex = (currentIndex - 1 + currentCards.length) % currentCards.length;
      showCard(newIndex);
    }

    function navigateNext() {
      if (currentCards.length === 0) return;
      const newIndex = (currentIndex + 1) % currentCards.length;
      showCard(newIndex);
    }

    // Open on card click
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', () => openLightbox(card));
    });

    // Close
    if (btnClose) btnClose.addEventListener('click', closeLightbox);

    // Close on background click (outside image area)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Prev / Next buttons
    if (btnPrev) btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigatePrev();
    });

    if (btnNext) btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateNext();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigatePrev();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
      }
    });
  })();

  /* ============================================================
     10. STAT COUNTER ANIMATION
  ============================================================ */
  ;(() => {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    if (!statNumbers.length) return;

    function animateCounter(el) {
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) return;

      const duration = 2000;
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const current = Math.round(easedProgress * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target + '+';
        }
      }

      requestAnimationFrame(tick);
    }

    if (prefersReducedMotion) {
      statNumbers.forEach(el => {
        el.textContent = el.dataset.count + '+';
      });
      return;
    }

    const statObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    statNumbers.forEach(el => statObserver.observe(el));
  })();

  /* ============================================================
     11. SMOOTH PARALLAX (Subtle)
  ============================================================ */
  ;(() => {
    if (prefersReducedMotion) return;

    const parallaxEls = document.querySelectorAll('[data-speed]');
    if (!parallaxEls.length) return;

    const updateParallax = rafThrottle(() => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0;
        el.style.transform = `translateY(${scrollY * speed * 0.1}px)`;
      });
    });

    window.addEventListener('scroll', updateParallax, { passive: true });
  })();

  /* ============================================================
     12. CONTACT FORM
  ============================================================ */
  ;(() => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      form.classList.add('submitted');

      // Show inline success feedback
      let feedback = form.querySelector('.form-feedback');
      if (!feedback) {
        feedback = document.createElement('div');
        feedback.classList.add('form-feedback');
        feedback.textContent = 'Message sent successfully!';
        form.appendChild(feedback);
      }
      feedback.classList.add('visible');

      // Reset after 3s
      setTimeout(() => {
        form.reset();
        form.classList.remove('submitted');
        feedback.classList.remove('visible');
      }, 3000);
    });
  })();

  /* ============================================================
     13. ACTIVE NAV HIGHLIGHT — Intersection Observer
  ============================================================ */
  ;(() => {
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !navAnchors.length) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navAnchors.forEach(a => {
              if (a.getAttribute('href') === `#${id}`) {
                a.classList.add('active');
              } else {
                a.classList.remove('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -40% 0px',
      }
    );

    sections.forEach(section => sectionObserver.observe(section));
  })();
});
