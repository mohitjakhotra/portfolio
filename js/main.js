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

  // Effects from effects.js (loaded before this)
  setTimeout(() => {
    Effects.initCounters();
    Effects.initWaveform();
    Effects.initGuitarStrings();
  }, 100);
});

/* ============================================================
   BOOT SEQUENCE (SOUNDCHECK)
   ============================================================ */
function initBootSequence() {
  const bootScreen = document.getElementById('boot-screen');
  if (!bootScreen) return;

  const lines = bootScreen.querySelectorAll('.boot-line');
  const progressFill = bootScreen.querySelector('.boot-progress-fill');
  const vuMeter = document.getElementById('boot-vu');
  const totalLines = lines.length;
  let currentLine = 0;
  const lineDelay = 400; // ms between lines

  if (vuMeter) {
    for (let i = 0; i < 20; i++) {
      const bar = document.createElement('div');
      bar.className = 'boot-vu-bar';
      const delay = Math.random() * 0.8;
      const duration = 0.5 + Math.random() * 0.5;
      bar.style.animationDelay = `${delay}s`;
      bar.style.animationDuration = `${duration}s`;
      vuMeter.appendChild(bar);
    }
  }

  function showNextLine() {
    if (currentLine < totalLines) {
      lines[currentLine].classList.add('visible');

      // Update progress bar
      const progress = ((currentLine + 1) / totalLines) * 100;
      if (progressFill) {
        progressFill.style.width = progress + '%';
      }

      // VU meter is now animated smoothly via CSS keyframes

      currentLine++;
      setTimeout(showNextLine, lineDelay);
    } else {
      // All lines shown — wait a beat then hide boot screen
      setTimeout(() => {
        bootScreen.classList.add('hide');
        setTimeout(animateHero, 300);
      }, 600);
    }
  }

  // Block scroll during boot
  document.body.style.overflow = 'hidden';

  // Start the sequence
  setTimeout(showNextLine, 400);
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

  // Smooth follow with lerp
  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
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
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    updateThemeIcon(true);
  }

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-mode');
    localStorage.setItem('portfolio-theme', isLight ? 'light' : 'dark');
    updateThemeIcon(isLight);
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
