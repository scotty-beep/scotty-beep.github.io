(function () {
  'use strict';

  var menuToggle = document.getElementById('menuToggle');
  var mobileDrawer = document.getElementById('mobileDrawer');
  var mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  var navLinks = document.querySelectorAll('.nav-link');
  var allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  var sections = document.querySelectorAll('section[id]');
  var jobTabs = document.querySelectorAll('.job-tab');
  var jobPanels = document.querySelectorAll('.job-panel');

  /* Mobile menu */
  function closeMobileMenu() {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  menuToggle.addEventListener('click', function () {
    if (mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  /* Experience tabs */
  function activateTab(index) {
    if (window.innerWidth <= 768) return;

    jobTabs.forEach(function (tab, i) {
      var isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive);
    });

    jobPanels.forEach(function (panel, i) {
      panel.classList.toggle('hidden', i !== index);
    });
  }

  jobTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activateTab(index);
    });

    tab.addEventListener('mouseenter', function () {
      activateTab(index);
    });
  });

  /* Active nav on scroll */
  function updateActiveNav() {
    var scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        allNavLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  /* Smooth scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* Fade-in on scroll */
  var fadeElements = document.querySelectorAll('.section, .hero > *');
  fadeElements.forEach(function (el) {
    el.classList.add('fade-up');
  });

  var fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  fadeElements.forEach(function (el, index) {
    el.style.transitionDelay = (index % 5) * 0.08 + 's';
    fadeObserver.observe(el);
  });

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  function handleResize() {
    if (window.innerWidth > 1080) {
      closeMobileMenu();
    }

    if (window.innerWidth <= 768) {
      jobPanels.forEach(function (panel) {
        panel.classList.remove('hidden');
      });
    } else {
      var activeIndex = Array.from(jobTabs).findIndex(function (tab) {
        return tab.classList.contains('active');
      });
      activateTab(activeIndex >= 0 ? activeIndex : 0);
    }
  }

  window.addEventListener('resize', handleResize);

  updateActiveNav();
  activateTab(0);
  handleResize();
})();
