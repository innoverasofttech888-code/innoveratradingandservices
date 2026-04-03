// ============================================================
// Innovera Trading & Services — clothing.js
// Enhanced with soft animations and improved functionality
// FIXED: Scroll disappearing images + Google Sheet intact
// ============================================================

// ⚠️  PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
const SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwb6AvvotS3wdNGOjD0UMx4AAj3Y9xcvff45bzQYmnbUNXWwuA4hSlakaRFjLTh1WI/exec";

// ============================================================
// Side Panel
// ============================================================
const body = document.body;
const header = document.getElementById('site-header');
const sidePanel = document.getElementById('side-panel');
const overlay = document.getElementById('overlay');
const menuTriggers = [document.getElementById('menu-trigger')].filter(Boolean);
const panelClose = document.getElementById('panel-close');

function openPanel() {
  sidePanel.classList.add('open');
  overlay.classList.add('open');
  body.style.overflow = 'hidden';
  
  // Add soft animation
  sidePanel.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  overlay.style.transition = 'all 0.3s ease';
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
  }, 6000); // Increased timing for better UX
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showSlide(Number(dot.dataset.slide));
    startSlider();
  });
});

// Auto-advance on hover pause
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
  heroSlider.addEventListener('mouseenter', () => clearInterval(slideTimer));
  heroSlider.addEventListener('mouseleave', startSlider);
}

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

  const params = new URLSearchParams({ email });

  try {
    // ✅ GET request with URL params — same reliable method as your working site
    await fetch(SHEET_SCRIPT_URL + '?' + params.toString(), {
      method: 'GET',
      mode: 'no-cors',
    });

    newsletterEmail.value = '';
    button.textContent = 'Subscribed ✓';
    showFormMessage('success', '🎉 You\'re subscribed! Welcome to the Innovera network.');

    setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
    }, 2500);

  } catch (err) {
    console.error('Newsletter error:', err);
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
    color: ${type === 'success' ? '#34C759' : '#FF3B30'};
    font-weight: 500;
    text-align: center;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  `;
  newsletterForm.insertAdjacentElement('afterend', msg);
}

function clearFormMessage() {
  document.getElementById('form-message')?.remove();
}

// Form validation enhancement
newsletterEmail?.addEventListener('input', function() {
  const email = this.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email && !emailRegex.test(email)) {
    this.setCustomValidity('Please enter a valid email address');
  } else {
    this.setCustomValidity('');
  }
});

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

const revealTargets = document.querySelectorAll('.product-card, .service-card, .feature-item, .story-media, .story-copy, .service-card-large, .highlight-item, .contact-method');
revealTargets.forEach(item => {
  // Skipping hero items so they don't hide
  if (!item.closest('.hero')) {
    item.style.opacity = '0';
    observer.observe(item);
  }
});

// ============================================================
// Additional Interactive Features
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.cta-button, .tab-btn, .form-group button');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add CSS for ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
    
    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Parallax effect to hero images
  const heroImages = document.querySelectorAll('.hero-image img');
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    heroImages.forEach(img => {
      const speed = 0.3;
      img.style.transform = `translateY(${scrolled * speed}px)`;
    });
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  
  // Add loading states for buttons
  const submitButtons = document.querySelectorAll('button[type="submit"]');
  submitButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.form && this.form.checkValidity()) {
        this.classList.add('loading');
      }
    });
  });
  
  // Keyboard navigation support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidePanel.classList.contains('open')) {
      closePanel();
    }
    
    if (e.key === 'ArrowLeft') {
      showSlide(currentSlide - 1);
      startSlider();
    } else if (e.key === 'ArrowRight') {
      showSlide(currentSlide + 1);
      startSlider();
    }
  });
  
  // ✅ FIXED: Image Load Logic (Removed broken observer that was hiding images on scroll)
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Basic fallback for broken links
    img.addEventListener('error', () => {
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.src = 'assets/images/fallback-generic.svg';
      }
    }, { once: true });

    // Safe fade-in only if the image hasn't loaded yet
    if (!img.complete) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s ease';
      img.onload = () => {
        img.style.opacity = '1';
      };
    }
  });
  
  // Touch support for mobile swipe
  let touchStartX = 0;
  let touchEndX = 0;
  
  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(currentSlide - 1);
      }
      startSlider();
    }
  }
  
  // Intersection observer for statistics counter
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        let current = 0;
        const increment = target / 100;
        
        const updateCounter = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
});

// Add CSS for form validation states
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    input:invalid {
      border-color: #FF3B30;
    }
    
    input:valid {
      border-color: #34C759;
    }
    
    input:focus:invalid {
      box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.2);
    }
    
    .loading {
      opacity: 0.6;
      pointer-events: none;
    }
    
    .success-message {
      background: rgba(52, 199, 89, 0.1);
      color: #34C759;
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
      font-size: 0.9rem;
      text-align: center;
    }
    
    .error-message {
      background: rgba(255, 59, 48, 0.1);
      color: #FF3B30;
      padding: 1rem;
      border-radius: 12px;
      margin-top: 1rem;
      font-size: 0.9rem;
      text-align: center;
    }
  `;
  document.head.appendChild(style);
});
