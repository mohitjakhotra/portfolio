/* ============================================================
   EFFECTS.JS — Typing, Glitch, Counter Animations
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

  // Create cursor element
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

    // Update text (keep cursor)
    element.textContent = currentString.substring(0, charIndex);
    element.appendChild(cursor);

    let nextDelay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentString.length) {
      // Finished typing — pause then delete
      nextDelay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting — move to next string
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

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/**
 * Initialize all counters when they scroll into view
 */
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

/* ============================================================
   EXPORTS / INIT
   ============================================================ */
window.Effects = {
  initTypewriter,
  animateCounter,
  initCounters
};
