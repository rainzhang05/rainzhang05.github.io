/**
 * Contact Form Handler
 * Manages form submission with validation and feedback
 */

(function() {
  'use strict';

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  /**
   * Show field error
   * @param {HTMLElement} field - Input field
   * @param {string} message - Error message
   */
  function showError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentElement.querySelector('.form-error');
    if (existingError) existingError.remove();
    
    // Add new error message
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    field.parentElement.appendChild(errorEl);
  }

  /**
   * Clear field error
   * @param {HTMLElement} field - Input field
   */
  function clearError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.remove();
  }

  /**
   * Validate form
   * @param {HTMLFormElement} form - Form to validate
   * @returns {boolean} True if valid
   */
  function validateForm(form) {
    let isValid = true;
    
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const message = form.querySelector('#message');
    
    // Clear previous errors
    [name, email, message].forEach(clearError);
    
    // Validate name
    if (!name.value.trim()) {
      showError(name, 'Please enter your name');
      isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
      showError(email, 'Please enter your email');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
      showError(message, 'Please enter a message');
      isValid = false;
    }
    
    return isValid;
  }

  /**
   * Initialize contact form
   */
  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Clear errors on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => clearError(field));
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!validateForm(form)) return;
      
      const submitBtn = form.querySelector('.form-submit');
      const originalContent = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = `
        <span>Sending...</span>
        <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      `;
      submitBtn.disabled = true;

      try {
        // If form has an action, submit to it
        if (form.action && form.action !== window.location.href) {
          const formData = new FormData(form);
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (!response.ok) throw new Error('Submission failed');
        } else {
          // Simulate submission
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        // Success
        submitBtn.innerHTML = `
          <span>Message Sent!</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
        }, 3000);
        
      } catch (error) {
        console.error('Form submission error:', error);
        
        submitBtn.innerHTML = `
          <span>Failed to send</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        `;
        
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
