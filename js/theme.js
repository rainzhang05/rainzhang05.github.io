/**
 * Theme Toggle - Dark/Light Mode
 * Simple toggle between dark (default) and light mode
 */

(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'portfolio-color-scheme';

  /**
   * Get stored theme from localStorage
   * @returns {string} 'dark' or 'light'
   */
  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {
      // localStorage blocked
    }
    return 'dark'; // Default to dark theme
  }

  /**
   * Store theme preference
   * @param {string} theme - 'dark' or 'light'
   */
  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      // localStorage blocked
    }
  }

  /**
   * Apply theme to body
   * @param {string} theme - 'dark' or 'light'
   */
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
    updateToggleUI(theme);
  }

  /**
   * Update toggle button UI
   * @param {string} theme - Current theme
   */
  function updateToggleUI(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const sunIcon = toggle.querySelector('.sun-icon');
    const moonIcon = toggle.querySelector('.moon-icon');

    if (sunIcon && moonIcon) {
      if (theme === 'light') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }

    toggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
  }

  /**
   * Toggle between themes
   */
  function toggleTheme() {
    const currentTheme = getStoredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  }

  /**
   * Initialize theme toggle
   */
  function initThemeToggle() {
    // Apply stored theme on load
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);

    // Set up toggle button
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (!stored) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }

  // Export for external use
  window.toggleTheme = toggleTheme;
  window.applyTheme = applyTheme;
})();
