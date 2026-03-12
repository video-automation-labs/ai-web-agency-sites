// =========================================
// Motto Custom Motors - Main JavaScript
// =========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeCTA();
  initializeFormValidation();
  initializeSmoothScroll();
  initializeScrollAnimations();
});

// =========================================
// CTA Button Interactions
// =========================================

function initializeCTA() {
  const ctaButtons = document.querySelectorAll('.cta-header, .cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const href = this.getAttribute('href');
      const action = this.getAttribute('onclick');

      if (href && href.startsWith('http')) {
        window.open(href, '_blank');
        return;
      }

      if (action) {
        return;
      }

      if (!href || href === '#' || href === 'contact.html') {
        scrollToContact();
      }
    });
  });

  const lineButton = document.querySelector('.line-button');
  if (lineButton) {
    lineButton.style.cursor = 'pointer';
  }
}

function scrollToContact() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('name').focus();
  } else {
    window.location.href = '/contact.html';
  }
}

// =========================================
// Form Validation
// =========================================

function initializeFormValidation() {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const privacy = document.querySelector('input[name="privacy"]:checked');

    if (!name || !email || !message || !privacy) {
      alert('必須項目をすべてご入力ください。');
      return;
    }

    if (!validateEmail(email)) {
      alert('正しいメールアドレスを入力してください。');
      return;
    }

    showFormSuccess();
    contactForm.reset();
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFormSuccess() {
  const message = document.createElement('div');
  message.className = 'form-success-message';
  message.textContent = 'お問い合わせありがとうございます。3営業日以内にご返信いたします。';
  message.style.cssText = `
    background: #e53935;
    color: white;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 600;
  `;

  const form = document.getElementById('contactForm');
  form.parentNode.insertBefore(message, form);

  setTimeout(() => {
    message.remove();
  }, 5000);
}

// =========================================
// Smooth Scroll
// =========================================

function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// =========================================
// Scroll Animations
// =========================================

function initializeScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll(
    '.service-card, .about-card, .team-member, .value-card, .gallery-item, .testimonial-card, .faq-item, .pricing-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
    observer.observe(el);
  });
}

// =========================================
// Analytics
// =========================================

function trackEvent(eventName, eventData) {
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  console.log('Event:', eventName, eventData);
}

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('cta-button') || e.target.classList.contains('cta-header')) {
    const text = e.target.textContent || e.target.innerText;
    trackEvent('cta_click', { button_text: text });
  }
});

// =========================================
// Export
// =========================================

window.MottoCustomMotors = {
  scrollToContact,
  trackEvent
};
