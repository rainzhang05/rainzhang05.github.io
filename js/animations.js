/**
 * Scroll Animations using Intersection Observer
 * Handles reveal animations for sections and staggered children
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    rootMargin: '-50px 0px',
    threshold: 0.1
  };

  /**
   * Initialize scroll reveal animations
   */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const staggerElements = document.querySelectorAll('.stagger-children');
    
    if (!revealElements.length && !staggerElements.length) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Immediately reveal all elements without animation
      revealElements.forEach(el => el.classList.add('revealed'));
      staggerElements.forEach(el => el.classList.add('revealed'));
      return;
    }
    
    // Create observer for reveal elements
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, config);
    
    // Observe all reveal elements
    revealElements.forEach(el => revealObserver.observe(el));
    staggerElements.forEach(el => revealObserver.observe(el));
  }

  /**
   * Initialize navigation highlighting based on scroll position
   */
  function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    
    if (!sections.length || !navItems.length) return;
    
    const observerOptions = {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };
    
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          updateActiveNavItem(id);
        }
      });
    }, observerOptions);
    
    sections.forEach(section => navObserver.observe(section));
  }

  /**
   * Update active navigation item
   * @param {string} activeId - The ID of the active section
   */
  function updateActiveNavItem(activeId) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const sectionId = item.getAttribute('data-section') || item.getAttribute('href')?.replace('#', '');
      
      if (sectionId === activeId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Smooth scroll to section when clicking navigation
   */
  function initSmoothScrollNavigation() {
    const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (!targetId) return;
        
        const targetSection = document.getElementById(targetId);
        if (!targetSection) return;
        
        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, '', `#${targetId}`);
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-nav-menu');
        const mobileToggle = document.getElementById('mobile-nav-toggle');
        if (mobileMenu?.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          mobileToggle?.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('mobile-menu-open');
        }
      });
    });
  }

  /**
   * Initialize page load animations
   */
  function initPageLoadAnimations() {
    // Remove loading gate after page loads
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Trigger initial reveal for elements in viewport
      setTimeout(() => {
        const firstSection = document.querySelector('.section.reveal');
        if (firstSection) {
          firstSection.classList.add('revealed');
        }
      }, 100);
    });
  }

  /**
   * Initialize all animations
   */
  function init() {
    initPageLoadAnimations();
    initScrollReveal();
    initNavigationHighlight();
    initSmoothScrollNavigation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
