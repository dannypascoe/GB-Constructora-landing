(function () {
  'use strict';

  /* ---------- Header: transparent over the hero, solid once scrolled or menu open ---------- */
  var header = document.getElementById('site-header');
  var menuToggle = document.getElementById('menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  var HEADER_SOLID_THRESHOLD = 48;

  function updateHeaderState() {
    var menuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    header.classList.toggle('is-scrolled', window.scrollY > HEADER_SOLID_THRESHOLD || menuOpen);
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---------- Mobile menu ---------- */
  var MOBILE_MENU_TRANSITION_MS = 220;
  var mobileMenuCloseTimer = null;

  function closeMobileMenu() {
    clearTimeout(mobileMenuCloseTimer);
    mobileMenu.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
    mobileMenuCloseTimer = window.setTimeout(function () {
      mobileMenu.classList.add('hidden');
    }, MOBILE_MENU_TRANSITION_MS);
    updateHeaderState();
  }

  function openMobileMenu() {
    clearTimeout(mobileMenuCloseTimer);
    mobileMenu.classList.remove('hidden');
    // Force a reflow so the browser picks up the "closed" starting state
    // before the "is-open" class is added, letting the transition run.
    void mobileMenu.offsetHeight;
    mobileMenu.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
    updateHeaderState();
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileMenu.querySelectorAll('[data-nav]').forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  /* ---------- Scrollspy: highlight active nav link ---------- */
  var sections = ['inicio', 'nosotros', 'servicios', 'proyectos', 'contacto']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var navLinks = document.querySelectorAll('.nav-link[data-nav]');

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isMatch = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in-view'); });
  }

  /* ---------- Animated stat counters ---------- */
  var countEls = document.querySelectorAll('[data-count-target]');
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setFinalValue(el) {
    var target = parseInt(el.getAttribute('data-count-target'), 10);
    var prefix = el.getAttribute('data-count-prefix') || '';
    el.textContent = prefix + target.toLocaleString('es-MX');
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count-target'), 10);
    var prefix = el.getAttribute('data-count-prefix') || '';
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(eased * target).toLocaleString('es-MX');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setFinalValue(el);
      }
    }
    window.requestAnimationFrame(step);
  }

  if (prefersReducedMotion) {
    countEls.forEach(setFinalValue);
  } else if ('IntersectionObserver' in window && countEls.length) {
    var countObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(function (el) { countObserver.observe(el); });
  } else {
    countEls.forEach(setFinalValue);
  }

  /* ---------- Project galleries ---------- */
  var galleries = {
    garvi: {
      name: 'GARVI SANTA ANITA',
      photos: [
        { src: 'brand_assets/photos/GARVI SANTA ANITA_1.jpg', alt: 'Fachada de vivienda en construcción del desarrollo GARVI SANTA ANITA, vista en ángulo contra el cielo' },
        { src: 'brand_assets/photos/GARVI SANTA ANITA_2.jpg', alt: 'Avance de obra en el desarrollo de vivienda en serie GARVI SANTA ANITA' },
        { src: 'brand_assets/photos/GARVI SANTA ANITA_3.jpg', alt: 'Detalle constructivo de una vivienda del desarrollo GARVI SANTA ANITA' }
      ]
    },
    f10: {
      name: 'Casa F10',
      photos: [
        { src: 'brand_assets/photos/Casa F10_1.jpg', alt: 'Vestíbulo interior de Casa F10 con tragaluces, muro de piedra y puerta principal de madera' },
        { src: 'brand_assets/photos/Casa F10_2.jpg', alt: 'Interior de Casa F10 mostrando acabados y carpintería a medida' },
        { src: 'brand_assets/photos/Casa F10_3.jpg', alt: 'Detalle de instalaciones y diseño de muebles fijos en Casa F10' },
        { src: 'brand_assets/photos/Casa F10_4.jpg', alt: 'Espacio residencial terminado en Casa F10 con domótica integrada' }
      ]
    },
    terraza: {
      name: 'Terraza Colinas',
      photos: [
        { src: 'brand_assets/photos/Terraza Colinas_1.jpg', alt: 'Cocina exterior de Terraza Colinas con barra de concreto y paneles de madera' },
        { src: 'brand_assets/photos/Terraza Colinas_2.jpg', alt: 'Acabados arquitectónicos de la terraza en el proyecto Terraza Colinas' }
      ]
    },
    cabana: {
      name: 'Cabaña MJ',
      photos: [
        { src: 'brand_assets/photos/cabana_MJ_1.jpg', alt: 'Cabaña MJ en Tapalpa, Jalisco, con fachada de piedra y estuco entre los árboles del bosque' },
        { src: 'brand_assets/photos/cabana_MJ_2.jpg', alt: 'Vista exterior de la Cabaña MJ mostrando el proyecto estructural y de acabados' },
        { src: 'brand_assets/photos/cabana_MJ_3.jpg', alt: 'Detalle constructivo de la Cabaña MJ con instalaciones diseñadas con ecotecnologías' },
        { src: 'brand_assets/photos/cabana_MJ_4.jpg', alt: 'Interior o acceso de la Cabaña MJ terminada en Tapalpa, Jalisco' }
      ]
    }
  };

  var lightbox = document.getElementById('lightbox');
  var lightboxImage = document.getElementById('lightbox-image');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var currentGallery = null;
  var currentIndex = 0;
  var lastFocusedElement = null;

  function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
  }

  function showPhoto(index) {
    if (!currentGallery) return;
    var total = currentGallery.photos.length;
    currentIndex = (index + total) % total;
    var photo = currentGallery.photos[currentIndex];
    lightboxImage.src = encodePath(photo.src);
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = currentGallery.name + ' — foto ' + (currentIndex + 1) + ' de ' + total;
    lightboxImage.style.animation = 'none';
    void lightboxImage.offsetWidth;
    lightboxImage.style.animation = '';
  }

  var LIGHTBOX_TRANSITION_MS = 220;
  var lightboxCloseTimer = null;

  function openGallery(key, startIndex) {
    var gallery = galleries[key];
    if (!gallery) return;
    clearTimeout(lightboxCloseTimer);
    currentGallery = gallery;
    lastFocusedElement = document.activeElement;
    showPhoto(startIndex || 0);
    lightbox.classList.remove('hidden');
    // Force a reflow so the "closed" starting state is picked up before
    // "is-open" is added, letting the fade/scale transition run.
    void lightbox.offsetHeight;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lightbox-close').focus();
  }

  function closeGallery() {
    clearTimeout(lightboxCloseTimer);
    lightbox.classList.remove('is-open');
    lightboxCloseTimer = window.setTimeout(function () {
      lightbox.classList.add('hidden');
    }, LIGHTBOX_TRANSITION_MS);
    document.body.style.overflow = '';
    currentGallery = null;
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll('[data-open-gallery]').forEach(function (button) {
    button.addEventListener('click', function () {
      openGallery(button.getAttribute('data-open-gallery'), 0);
    });
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach(function (el) {
    el.addEventListener('click', closeGallery);
  });

  lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', function () {
    showPhoto(currentIndex - 1);
  });

  lightbox.querySelector('[data-lightbox-next]').addEventListener('click', function () {
    showPhoto(currentIndex + 1);
  });

  document.addEventListener('keydown', function (e) {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });

  /* ---------- Contact form: compose a mailto with the entered details ---------- */
  var contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('name').value.trim();
    var replyTo = document.getElementById('reply-to').value.trim();
    var message = document.getElementById('message').value.trim();

    var subject = 'Solicitud de cotización — ' + name;
    var body = 'Nombre: ' + name + '\nContacto: ' + replyTo + '\n\n' + message;

    var mailtoUrl = 'mailto:gbconstructora.gdl@gmail.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    window.location.href = mailtoUrl;
  });

})();
