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
    btn.textContent = 'SUBMIT →';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    company: this.company.value,
    website: this.website.value,
    message: this.message.value
  };

  fetch("https://script.google.com/macros/s/AKfycbzjP5WIeMV7-efKUdZV2dd4p5mgYolA0IqinM1bpSoJWlZpJAuRuEGzp4RqTg5Rjr2b/exec", {
    method: "POST",
    body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
    alert("Form submitted successfully!");
    document.getElementById("contactForm").reset();
  })
  .catch(error => {
    alert("Something went wrong!");
    console.error(error);
  });
});
