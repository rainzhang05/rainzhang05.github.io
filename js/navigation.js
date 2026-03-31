/**
 * Navigation - Smooth scrolling and mobile menu
 */

(function() {
  'use strict';

  /**
   * Get current scroll position
   * @returns {number} Current scroll Y position
   */
  function getScrollTop() {
    return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  /**
   * Smooth scroll to target element
   * @param {HTMLElement} targetElement - Element to scroll to
   */
  function scrollToElement(targetElement) {
    const rect = targetElement.getBoundingClientRect();
    const scrollMargin = parseFloat(getComputedStyle(targetElement).scrollMarginTop) || 0;
    const targetY = rect.top + getScrollTop() - scrollMargin - 20; // Extra offset for visual comfort
    
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }

  /**
   * Setup smooth scrolling for hash links
   */
  function setupHashLinkBehavior() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          scrollToElement(targetElement);
          
          // Update URL without jumping
          history.pushState(null, '', `#${targetId}`);
          
          // Close mobile menu if open
          closeMobileMenu();
        }
      });
    });
  }

  /**
   * Close mobile navigation menu
   */
  function closeMobileMenu() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    
    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('active');
      document.body.classList.remove('mobile-menu-open');
    }
  }

  /**
   * Handle keyboard navigation
   */
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Close mobile menu on Escape
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }

  /**
   * Handle initial hash in URL
   */
  function handleInitialHash() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Wait for page to fully load
        setTimeout(() => {
          scrollToElement(targetElement);
        }, 100);
      }
    }
  }

  /**
   * Initialize navigation
   */
  function init() {
    setupHashLinkBehavior();
    setupKeyboardNavigation();
    handleInitialHash();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.scrollToElement = scrollToElement;
  window.closeMobileMenu = closeMobileMenu;
})();
