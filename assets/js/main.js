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

  // ===== Header Shadow + Auto-hide on Scroll (with Hover Pin) =====
  const header = document.querySelector('.header');
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    let hideTimer = null;
    let isHovered = false;
    const IDLE_MS = 1500;

    function scheduleHide() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function() {
        if (isHovered) return; // Hovering: skip auto-hide
        if (window.scrollY > 100) header.classList.add('nav-hidden');
      }, IDLE_MS);
    }

    function pinHeader() {
      isHovered = true;
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      header.classList.remove('nav-hidden');
    }

    function unpinHeader() {
      isHovered = false;
      // Resume auto-hide only if user has scrolled past the top
      if (window.scrollY > 100) scheduleHide();
    }

    function update() {
      const y = window.scrollY;

      // Shadow toggle
      if (y > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');

      // Direction-based show/hide (skip when hovering)
      if (isHovered) {
        // keep header visible
      } else if (y < 10) {
        header.classList.remove('nav-hidden');
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      } else if (y > lastY) {
        header.classList.add('nav-hidden');
      } else if (y < lastY) {
        header.classList.remove('nav-hidden');
      }

      lastY = y;
      if (!isHovered) scheduleHide();
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    // Hover pins the header in view; leave resumes auto-hide
    header.addEventListener('mouseenter', pinHeader);
    header.addEventListener('mouseleave', unpinHeader);
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

  // ===== Cookie Consent Banner (GDPR / CCPA) =====
  (function initCookieConsent() {
    const banner = document.getElementById('wyCookieBanner');
    if (!banner) return;

    const KEY = 'wy_cookie_consent_v1';
    let decided = false;
    try { decided = localStorage.getItem(KEY) !== null; } catch (e) {}
    if (decided) return;

    const acceptBtn = document.getElementById('wyCookieAcceptAll');
    const rejectBtn = document.getElementById('wyCookieReject');

    banner.hidden = false;

    function dismiss(choice) {
      try { localStorage.setItem(KEY, choice); } catch (e) {}
      banner.hidden = true;
    }

    if (acceptBtn) acceptBtn.addEventListener('click', function() { dismiss('all'); });
    if (rejectBtn) rejectBtn.addEventListener('click', function() { dismiss('essential'); });
  })();

  // ===== Back to Top Button =====
  (function initBackToTop() {
    const btn = document.querySelector('.wy-back-to-top');
    if (!btn) return;

    const TOP_THRESHOLD = 10;
    const BOTTOM_THRESHOLD = 80;
    const IDLE_MS = 1500;

    let hideTimer = null;

    function isAtBottom() {
      return window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
    }

    function clearHideTimer() {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    }

    function scheduleHide() {
      clearHideTimer();
      hideTimer = setTimeout(function() {
        if (isAtBottom()) return; // pin mode keeps it visible
        btn.classList.remove('is-visible', 'is-pinned');
      }, IDLE_MS);
    }

    function hideBtn() {
      clearHideTimer();
      btn.classList.remove('is-visible', 'is-pinned');
    }

    function showTranslucent() {
      btn.classList.add('is-visible');
      btn.classList.remove('is-pinned');
      scheduleHide();
    }

    function showPinned() {
      btn.classList.add('is-visible', 'is-pinned');
      clearHideTimer();
    }

    // Click: smooth scroll to top
    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Visibility state machine
    function update() {
      const y = window.scrollY;
      if (y < TOP_THRESHOLD) {
        // At page top -> never show
        hideBtn();
      } else if (isAtBottom()) {
        // At page bottom -> pin fully opaque
        showPinned();
      } else {
        // Mid-page while scrolling -> translucent, auto-hide after idle
        showTranslucent();
      }
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', update);
    update();
  })();

})();
