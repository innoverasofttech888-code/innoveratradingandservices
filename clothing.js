// ============================================================
// Innovera Trading & Services — clothing.js
// ============================================================

// ⚠️  PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvpaibDhvfH-r7F0gKaLPb2GlYpbGC0U8ooMFsxRV0SkEASnNKSa2l_K3G2MRMpypT/exec";

// ============================================================
// Side Panel
// ============================================================
const body = document.body;
const header = document.getElementById('site-header');
const sidePanel = document.getElementById('side-panel');
const overlay = document.getElementById('overlay');
const menuTriggers = [document.getElementById('menu-trigger'), document.getElementById('mobile-menu-trigger')].filter(Boolean);
const panelClose = document.getElementById('panel-close');

function openPanel() {
  sidePanel.classList.add('open');
  overlay.classList.add('open');
  body.style.overflow = 'hidden';
}

function closePanel() {
  sidePanel.classList.remove('open');
  overlay.classList.remove('open');
  body.style.overflow = '';
}

menuTriggers.forEach(btn => btn.addEventListener('click', openPanel));
panelClose?.addEventListener('click', closePanel);
overlay?.addEventListener('click', closePanel);
document.querySelectorAll('.panel-nav a').forEach(link => link.addEventListener('click', closePanel));

// ============================================================
// Sticky Header
// ============================================================
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 14);
}, { passive: true });

// ============================================================
// Hero Slider
// ============================================================
const slides = Array.from(document.querySelectorAll('.hero-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentSlide));
}

function startSlider() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.slide));
    startSlider();
  });
});

showSlide(0);
startSlider();

// ============================================================
// Tabs
// ============================================================
const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;
    tabButtons.forEach(btn => btn.classList.toggle('is-active', btn === button));
    tabPanels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.panel === target));
  });
});

// ============================================================
// Newsletter Form → Google Sheets
// ============================================================
const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');

newsletterForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = newsletterEmail.value.trim();
  if (!email) return;

  const button = newsletterForm.querySelector('button');
  const originalLabel = button.textContent;

  button.textContent = 'Subscribing…';
  button.disabled = true;
  clearFormMessage();

  try {
    await fetch(SHEET_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // required for Google Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    // no-cors means we can't read the response — optimistically show success
    newsletterEmail.value = '';
    button.textContent = 'Subscribed ✓';
    showFormMessage('success', '🎉 You\'re subscribed! Welcome to the Innovera network.');

    setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
    }, 2200);

  } catch (err) {
    console.error('Newsletter submission error:', err);
    showFormMessage('error', 'Something went wrong. Please try again.');
    button.textContent = originalLabel;
    button.disabled = false;
  }
});

function showFormMessage(type, text) {
  clearFormMessage();
  const msg = document.createElement('p');
  msg.id = 'form-message';
  msg.textContent = text;
  msg.style.cssText = `
    margin-top: 0.75rem;
    font-size: 0.875rem;
    color: ${type === 'success' ? '#2d6a4f' : '#c0392b'};
    font-weight: 500;
    text-align: center;
  `;
  newsletterForm.insertAdjacentElement('afterend', msg);
}

function clearFormMessage() {
  document.getElementById('form-message')?.remove();
}

// ============================================================
// Smooth Scroll
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    const offset = header.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================================================
// Scroll Reveal Animations
// ============================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.animate([
        { opacity: 0, transform: 'translateY(28px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 700,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

const revealTargets = document.querySelectorAll('.category-card, .brand-card, .product-card, .journal-card, .story-media, .story-copy');
revealTargets.forEach(item => {
  item.style.opacity = '0';
  observer.observe(item);
});
