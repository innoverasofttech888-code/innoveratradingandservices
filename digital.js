// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section > *').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// Nav active link highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? '#fff' : '';
  });
});

// Contact form submit
document.querySelector('.contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.querySelector('.btn-submit');
  btn.textContent = '✓ REQUEST SENT!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = 'GET MY FREE AUDIT →';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});
