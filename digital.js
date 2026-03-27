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
// GOOGLE APPS SCRIPT URL
// =============================================
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzDPXiZ2neQiHXjni6UYkiqzO0I213m3cHrUXfn_SYqqbKWA4KHG1t0fntwmwxtDvaM/exec';
// =============================================

document.querySelector('.contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = document.querySelector('.btn-submit');
  const form = e.target;

  // Show loading state
  btn.textContent = 'SENDING...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  // Read values using name attributes (more reliable than placeholder selectors)
  const params = new URLSearchParams({
    name:    form.querySelector('[name="name"]').value,
    email:   form.querySelector('[name="email"]').value,
    company: form.querySelector('[name="company"]').value,
    website: form.querySelector('[name="website"]').value,
    message: form.querySelector('[name="message"]').value
  });

  try {
    await fetch(SHEET_URL + '?' + params.toString(), {
      method: 'GET',
      mode: 'no-cors'
    });

    // Success state
    btn.textContent = '✓ REQUEST SENT!';
    btn.style.background = '#22c55e';
    btn.style.opacity = '1';
    form.reset();

  } catch (error) {
    btn.textContent = '✕ SOMETHING WENT WRONG';
    btn.style.background = '#ef4444';
    btn.style.opacity = '1';
    console.error('Form error:', error);
  }

  // Reset button after 4 seconds
  setTimeout(() => {
    btn.textContent = 'SUBMIT →';
    btn.style.background = '';
    btn.style.opacity = '1';
    btn.disabled = false;
  }, 4000);
});
