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
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("contactForm");

  if (!form) {
    console.error("Form not found!");
    return;
  }

  form.addEventListener("submit", function (e) {
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
    .then(res => res.json())
    .then(() => {
      alert("Form submitted successfully!");
      form.reset();
    })
    .catch(err => {
      alert("Error submitting form");
      console.error(err);
    });

  });

});
