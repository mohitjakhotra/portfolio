/* ============================================================
   MAIN.JS — Code × Music | Boot Sequence, Nav, Theme
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBootSequence();
  initCustomCursor();
  initThemeToggle();
  initNavigation();
  initScrollReveal();
  initMobileMenu();
  initContactForm();

  // Effects from effects.js (loaded before this)
  setTimeout(() => {
    Effects.initCounters();
    Effects.initWaveform();
    Effects.initGuitarStrings();
  }, 100);
});

/* ============================================================
   BOOT SEQUENCE (CRT TURN-ON + LOADER + SIGNAL)
   ============================================================ */
function initBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  if (!bootScreen) return;

  const percentEl = document.getElementById('loader-percent');
  const fillEl = document.getElementById('loader-fill');
  const staticEl = document.getElementById('signal-static');
  const scanlinesEl = document.getElementById('signal-scanlines');

  // Block scroll during boot
  document.body.style.overflow = 'hidden';

  let progress = 0;

  // ---- PHASE 1: Progress bar fills with glitchy stuttering ----
  function updateProgress() {
    const increment = Math.floor(Math.random() * 12) + 2;
    progress += increment;
    if (progress > 100) progress = 100;

    if (percentEl) percentEl.textContent = progress;
    if (fillEl) fillEl.style.width = progress + '%';

    if (progress < 100) {
      const delay = Math.floor(Math.random() * 200) + 80;
      setTimeout(updateProgress, delay);
    } else {
      // Progress done — start signal phase after a beat
      setTimeout(startSignalPhase, 500);
    }
  }

  // ---- PHASE 2: Poor signal — gentle static, scanlines, slight wobble ----
  function startSignalPhase() {
    // Make background transparent so page shows through the noise
    bootScreen.style.backgroundColor = 'transparent';

    // Activate the static noise and scanlines
    if (staticEl) staticEl.classList.add('active');
    if (scanlinesEl) scanlinesEl.classList.add('active');

    // Add gentle wobble + flicker to the overlay
    bootScreen.classList.add('signal-phase');

    // Let the poor signal play for a moment, then start clearing
    setTimeout(startSignalClearing, 1200);
  }

  // ---- PHASE 3: Signal gradually clears up ----
  function startSignalClearing() {
    bootScreen.classList.remove('signal-phase');
    bootScreen.classList.add('signal-clearing');

    // Transition static and scanlines to weakening (smooth fade)
    if (staticEl) {
      staticEl.classList.remove('active');
      staticEl.classList.add('weakening');
    }
    if (scanlinesEl) {
      scanlinesEl.classList.remove('active');
      scanlinesEl.classList.add('weakening');
    }

    // Start hero animations while signal is still fading
    setTimeout(animateHero, 600);

    // After fade-out completes, clean up the overlay
    setTimeout(() => {
      bootScreen.classList.add('done');
    }, 2800);
  }

  // Start it all
  setTimeout(updateProgress, 300);
}

function animateHero() {
  document.body.style.overflow = '';

  const greeting = document.querySelector('.hero-greeting');
  const name = document.querySelector('.hero-name');
  const tagline = document.querySelector('.hero-tagline');
  const subtitle = document.querySelector('.hero-subtitle');
  const actions = document.querySelector('.hero-actions');

  const elements = [greeting, name, tagline, subtitle, actions].filter(Boolean);

  elements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.animation = `fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards`;
    }, i * 200);
  });

  // Start typewriter after subtitle appears
  setTimeout(() => {
    const subtitleEl = document.getElementById('typed-subtitle');
    if (subtitleEl) {
      Effects.initTypewriter(subtitleEl, [
        'Full Stack Software Engineer',
        'System Architect',
        'Creative Coder',
        'Audio/Visual Explorer'
      ], 70, 35, 2200);
    }
  }, 1000);
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth follow with lerp — use transform for GPU-accelerated positioning
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  const interactives = document.querySelectorAll('a, button, .nav-link, .project-card, .skill-chip, .social-link, .btn-primary, .btn-secondary, .string-divider');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

/* ============================================================
   THEME TOGGLE
   ============================================================ */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  // Check saved preference
  const savedTheme = localStorage.getItem('portfolio-theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon(false);
  } else {
    updateThemeIcon(true);
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    updateThemeIcon(!isDark);
  });
}

function updateThemeIcon(isLight) {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;
  icon.className = isLight ? 'bx bx-moon' : 'bx bx-sun';
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 100) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }

    lastScroll = currentScroll;
    updateActiveNav();
  });
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

/* ============================================================
   CONTACT FORM (AJAX Submission)
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // IMPORTANT: Replace this with your Web3Forms access key
  // You can get one for free in 10 seconds at https://web3forms.com/
  const WEB3FORMS_ACCESS_KEY = "e4ec6749-45d7-4156-a85f-8a9f94522239";

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const btn = this.querySelector('.form-submit');
    const originalText = btn.innerHTML;

    // Disable button and show loading state
    btn.disabled = true;
    btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Transmitting...`;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name,
          email: email,
          message: message,
          subject: 'New message from Portfolio: ' + name
        })
      });

      const result = await response.json();

      if (response.status === 200) {
        // Success
        btn.innerHTML = `<i class='bx bx-check'></i> Signal Transmitted!`;
        form.reset();
      } else {
        // Error from API
        console.error(result);
        btn.innerHTML = `<i class='bx bx-error'></i> Signal Failed`;
      }
    } catch (error) {
      // Network error
      console.error(error);
      btn.innerHTML = `<i class='bx bx-wifi-off'></i> Connection Error`;
    }

    // Reset button after 3 seconds
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 3000);
  });
}

/* ============================================================
   SCROLL REVEAL (Intersection Observer)
   ============================================================ */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
