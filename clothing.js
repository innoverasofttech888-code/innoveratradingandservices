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

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 14);
}, { passive: true });

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

const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.tab;
    tabButtons.forEach(btn => btn.classList.toggle('is-active', btn === button));
    tabPanels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.panel === target));
  });
});

const newsletterForm = document.getElementById('newsletter-form');
const newsletterEmail = document.getElementById('newsletter-email');

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = newsletterEmail.value.trim();
  if (!value) return;

  const button = newsletterForm.querySelector('button');
  const originalLabel = button.textContent;
  button.textContent = 'Subscribed';
  button.disabled = true;
  newsletterEmail.value = '';

  setTimeout(() => {
    button.textContent = originalLabel;
    button.disabled = false;
  }, 2200);
});

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