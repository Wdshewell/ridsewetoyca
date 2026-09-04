/* ============================================
   Jiaxing Weeyuan Kids Toy Cars
   Main JavaScript - Interactions
   ============================================ */

(function() {
  'use strict';

  // ===== Mobile Menu Toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ===== Header Shadow on Scroll =====
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ===== FAQ Accordion =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        faqItems.forEach(function(otherItem) {
          otherItem.classList.remove('active');
        });
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ===== Product Filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      productCards.forEach(function(card) {
        if (category === 'all' || card.getAttribute('data-category') === category) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== Contact Form (Static - no backend) =====
  const CONTACT_EMAIL = 'business@weeyuantoys.cn';
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const form = e.target;
      const inquiryType = form.subject && form.subject.options
        ? form.subject.options[form.subject.selectedIndex].text
        : 'Website Inquiry';

      const body = [
        'First Name: ' + form.firstName.value.trim(),
        'Last Name: ' + form.lastName.value.trim(),
        'Email: ' + form.email.value.trim(),
        'Phone / WhatsApp: ' + (form.phone.value.trim() || '-'),
        'Company Name: ' + (form.company.value.trim() || '-'),
        'Country: ' + form.country.value.trim(),
        'Inquiry Type: ' + inquiryType,
        '',
        'Message:',
        form.message.value.trim()
      ].join('\n');

      const mailto = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('Website Inquiry - ' + inquiryType) +
        '&body=' + encodeURIComponent(body);

      window.location.href = mailto;

      const successMsg = document.querySelector('.form-success');
      if (successMsg) {
        successMsg.classList.add('show');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      contactForm.reset();
      setTimeout(function() {
        if (successMsg) successMsg.classList.remove('show');
      }, 6000);
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ===== Scroll Reveal Animation =====
  const revealElements = document.querySelectorAll('.feature-card, .product-card, .cert-item, .process-step, .stat-item, .contact-info-item');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function(el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease ' + (index % 4 * 0.1) + 's, transform 0.6s ease ' + (index % 4 * 0.1) + 's';
      observer.observe(el);
    });
  }

  // ===== Google Translate Language Switcher =====
  const LANG_NAMES = {
    en: 'English',
    ar: 'Arabic',
    de: 'German',
    fr: 'French',
    pt: 'Portuguese',
    es: 'Spanish',
    it: 'Italian'
  };

  function getCurrentLang() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : 'en';
  }

  function setLanguageCookie(langCode) {
    if (langCode === 'en') {
      document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } else {
      const d = new Date();
      d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
      document.cookie = 'googtrans=/en/' + langCode + '; path=/; expires=' + d.toUTCString();
    }
    location.reload();
  }

  const langWrap = document.querySelector('.nav-lang');
  const langBtn = document.querySelector('.lang-btn');
  const langCurrent = document.querySelector('.lang-current');
  const langOptions = document.querySelectorAll('.lang-option');

  // Reflect the currently active language on load
  const activeLang = getCurrentLang();
  if (langCurrent) {
    langCurrent.textContent = LANG_NAMES[activeLang] || 'English';
  }
  langOptions.forEach(function(opt) {
    opt.classList.toggle('active', opt.getAttribute('data-lang') === activeLang);
  });

  if (langBtn && langWrap) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = langWrap.classList.toggle('open');
      langBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', function(e) {
      if (!langWrap.contains(e.target)) {
        langWrap.classList.remove('open');
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    langOptions.forEach(function(opt) {
      opt.addEventListener('click', function(e) {
        e.preventDefault();
        setLanguageCookie(opt.getAttribute('data-lang'));
      });
    });
  }

  // Load Google Translate engine (hidden widget; translation is driven by cookie)
  function initGoogleTranslate() {
    const container = document.createElement('div');
    container.id = 'google_translate_element';
    container.setAttribute('aria-hidden', 'true');
    container.style.display = 'none';
    document.body.appendChild(container);

    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,ar,fr,pt,es,it',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
      }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }

  if (document.body) {
    initGoogleTranslate();
  } else {
    document.addEventListener('DOMContentLoaded', initGoogleTranslate);
  }

  // ===== Update Footer Year =====
  const yearEl = document.querySelector('#currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
