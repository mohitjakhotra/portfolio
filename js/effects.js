/* ============================================================
   EFFECTS.JS — Code × Music | Typing, Counters, Waveform Canvas
   ============================================================ */

/**
 * Typewriter effect — types text character by character
 * @param {HTMLElement} element - Target element
 * @param {string[]} strings - Array of strings to cycle through
 * @param {number} typeSpeed - ms per character
 * @param {number} deleteSpeed - ms per character when deleting
 * @param {number} pauseTime - ms to pause after typing
 */
function initTypewriter(element, strings, typeSpeed = 60, deleteSpeed = 30, pauseTime = 2000) {
  if (!element) return;

  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const cursor = document.createElement('span');
  cursor.className = 'typed-cursor';
  element.appendChild(cursor);

  function type() {
    const currentString = strings[stringIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    element.textContent = currentString.substring(0, charIndex);
    element.appendChild(cursor);

    let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentString.length) {
      nextDelay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      nextDelay = 400;
    }

    setTimeout(type, nextDelay);
  }

  type();
}

/**
 * Animated counter — counts from 0 to target
 * @param {HTMLElement} element - Target element
 * @param {number} target - Final number
 * @param {number} duration - Animation duration in ms
 * @param {string} suffix - Text after number (e.g., '+')
 */
function animateCounter(element, target, duration = 1500, suffix = '') {
  if (!element) return;

  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateCounter(el, target, 1500, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/**
 * Waveform Canvas Animation
 */
function initWaveform() {
  const canvas = document.getElementById('waveform-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let time = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.getElementById('hero').offsetHeight || window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function drawWaveform() {
    ctx.clearRect(0, 0, width, height);

    // Get color from CSS variables (depends on theme)
    const computedStyle = getComputedStyle(document.body);
    const fillColor = computedStyle.getPropertyValue('--waveform-color').trim() || 'rgba(0, 255, 136, 0.1)';
    const strokeColor = computedStyle.getPropertyValue('--waveform-stroke').trim() || 'rgba(0, 255, 136, 0.3)';

    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let x = 0; x < width; x++) {
      // Complex waveform math (combining multiple sine waves for a musical feel)
      const y1 = Math.sin(x * 0.005 + time) * 50;
      const y2 = Math.sin(x * 0.01 + time * 1.5) * 20;
      const y3 = Math.sin(x * 0.02 + time * 0.5) * 10;
      
      const y = height / 2 + y1 + y2 + y3;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();
    
    ctx.lineWidth = 2;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();

    // Draw a second complementary wave
    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    for (let x = 0; x < width; x++) {
      const y1 = Math.cos(x * 0.004 + time * 1.2) * 60;
      const y2 = Math.cos(x * 0.015 - time) * 15;
      
      const y = height / 2 + y1 + y2;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();

    time += 0.02;
    
    if (isVisible) {
      requestAnimationFrame(drawWaveform);
    }
  }

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible) {
      drawWaveform();
    }
  });
  
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    observer.observe(heroSection);
  } else {
    drawWaveform();
  }
}

/**
 * Guitar String Animation on Hover
 */
function initGuitarStrings() {
  const strings = document.querySelectorAll('.string-divider');
  strings.forEach(string => {
    string.addEventListener('mouseenter', () => {
      const path = string.querySelector('path');
      if (path) {
        // Trigger animation by resetting and applying class
        path.style.animation = 'none';
        void path.offsetWidth; // trigger reflow
        path.style.animation = 'string-vibrate 0.6s ease-out forwards';
      }
    });
  });
}


/* ============================================================
   EXPORTS / INIT
   ============================================================ */
window.Effects = {
  initTypewriter,
  animateCounter,
  initCounters,
  initWaveform,
  initGuitarStrings
};
