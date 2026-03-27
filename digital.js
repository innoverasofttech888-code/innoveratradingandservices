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

// =============================================
// PASTE YOUR GOOGLE APPS SCRIPT URL BELOW 👇
// =============================================
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbznhiwA6s8z1iLwdIZnaQOgtVLlkeMHHG1YmvEtAThxyjpNTeh2lmVVeehy_j4B6ZAH/exec';
// =============================================

document.querySelector('.contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.querySelector('.btn-submit');
  const form = e.target;

  // Collect form data
  const data = {
    name:    form.querySelector('input[placeholder="Your Name"]').value,
    email:   form.querySelector('input[placeholder="Email Address"]').value,
    company: form.querySelector('input[placeholder="Company Name"]').value,
    website: form.querySelector('input[placeholder="Website URL"]').value,
    message: form.querySelector('textarea').value
  };

  // Show loading state
  btn.textContent = 'SENDING...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  try {
    await fetch(SHEET_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Google Apps Script
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Success state
    btn.textContent = '✓ REQUEST SENT!';
    btn.style.background = '#22c55e';
    btn.style.opacity = '1';
    form.reset();

  } catch (error) {
    // Error state
    btn.textContent = '✕ SOMETHING WENT WRONG';
    btn.style.background = '#ef4444';
    btn.style.opacity = '1';
    console.error('Form error:', error);
  }

  // Reset button after 4 seconds
  setTimeout(() => {
    btn.textContent = 'GET MY FREE AUDIT →';
    btn.style.background = '';
    btn.style.opacity = '1';
    btn.disabled = false;
  }, 4000);
});
