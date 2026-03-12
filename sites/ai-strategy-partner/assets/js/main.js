// =========================================
// AI Strategy Partner - Main JavaScript
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

      // If it has href, navigate
      if (href && href.startsWith('http')) {
        window.open(href, '_blank');
        return;
      }

      // If it has onclick, it will be handled by onclick attr
      if (action) {
        return;
      }

      // Default: scroll to contact form
      if (!href || href === '#' || href === 'contact.html') {
        scrollToContact();
      }
    });
  });

  // Line button special handling
  const lineButton = document.querySelector('.line-button');
  if (lineButton) {
    lineButton.style.cursor = 'pointer';
  }
}

function scrollToContact() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('company').focus();
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

    // Validate required fields
    const company = document.getElementById('company').value.trim();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const privacy = document.querySelector('input[name="privacy"]:checked');

    if (!company || !name || !email || !message || !privacy) {
      alert('必須項目をすべてご入力ください。');
      return;
    }

    if (!validateEmail(email)) {
      alert('正しいメールアドレスを入力してください。');
      return;
    }

    // In a real implementation, this would send data to a server
    // For now, show success message
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
  message.textContent = 'お問い合わせありがとうございます。2営業日以内にご返信いたします。';
  message.style.cssText = `
    background: #06C755;
    color: white;
    padding: 16px;
    border-radius: 6px;
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
// Smooth Scroll for Anchor Links
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
// Scroll Animations (Fade-in on scroll)
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

  // Observe service cards, pricing cards, etc.
  const animatedElements = document.querySelectorAll(
    '.service-card, .pricing-card, .faq-item, .portfolio-item, .process-step, .testimonial-card'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';
    observer.observe(el);
  });
}

// =========================================
// FAQ Toggle (Optional - for collapsible FAQ)
// =========================================

function initializeFAQToggle() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('h4');
    const answer = item.querySelector('p');

    if (question && answer) {
      question.style.cursor = 'pointer';
      question.addEventListener('click', function() {
        const isHidden = answer.style.display === 'none';
        answer.style.display = isHidden ? 'block' : 'none';
        item.classList.toggle('active');
      });

      // Show all by default on page load
      answer.style.display = 'block';
    }
  });
}

// =========================================
// Mobile Menu Toggle (Future)
// =========================================

function initializeMobileMenu() {
  // This would be implemented when mobile menu is added
  // to the header for small screens
}

// =========================================
// Analytics & Tracking
// =========================================

function trackEvent(eventName, eventData) {
  if (window.gtag) {
    window.gtag('event', eventName, eventData);
  }

  // Log to console for debugging
  console.log('Event:', eventName, eventData);
}

// Track CTA clicks
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('cta-button') || e.target.classList.contains('cta-header')) {
    const text = e.target.textContent || e.target.innerText;
    trackEvent('cta_click', { button_text: text });
  }
});

// =========================================
// Performance: Lazy Load Images
// =========================================

function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

initializeLazyLoading();

// =========================================
// Export for external use
// =========================================

window.AIStrategyPartner = {
  scrollToContact,
  trackEvent
};
