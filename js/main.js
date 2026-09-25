document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavigation();
  initContactForm();
  initScrollReveal();
});

function initThemeToggle() {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('portfolio-theme', isDark ? 'dark' : 'light');
    });
  });
}

function initNavigation() {
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const desktopQuery = window.matchMedia('(min-width: 901px)');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  links.forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  desktopQuery.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  const byId = new Map(links.map((link) => [link.getAttribute('href').slice(1), link]));
  const sections = [...byId.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;

    links.forEach((link) => link.removeAttribute('aria-current'));
    const current = byId.get(visible.target.id);
    if (current) current.setAttribute('aria-current', 'true');
  }, { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5] });

  sections.forEach((section) => observer.observe(section));
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WEB3FORMS_ACCESS_KEY = 'e4ec6749-45d7-4156-a85f-8a9f94522239';
  const statusEl = document.getElementById('form-status');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;
    const btn = form.querySelector('.form-submit');

    btn.disabled = true;
    statusEl.hidden = true;
    statusEl.classList.remove('error');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name,
          email,
          message,
          subject: 'New message from Portfolio: ' + name
        })
      });

      if (response.ok) {
        statusEl.textContent = 'Message sent.';
        form.reset();
      } else {
        statusEl.textContent = 'Could not send the message. Try email instead.';
        statusEl.classList.add('error');
      }
    } catch {
      statusEl.textContent = 'Could not send the message. Try email instead.';
      statusEl.classList.add('error');
    }

    statusEl.hidden = false;
    btn.disabled = false;
  });
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach((el) => observer.observe(el));
}
