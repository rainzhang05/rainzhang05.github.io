/**
 * Modal Management
 * Handles opening/closing modals with scroll lock and animations
 */

(function() {
  'use strict';

  // State
  const state = {
    locked: false,
    previousPaddingRight: '',
    activeModal: null
  };

  /**
   * Apply scroll lock when modal is open
   */
  function applyScrollLock() {
    if (state.locked) return;

    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    state.previousPaddingRight = document.documentElement.style.paddingRight;

    if (scrollbarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    state.locked = true;
  }

  /**
   * Release scroll lock when modal closes
   */
  function releaseScrollLock() {
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
    document.documentElement.style.paddingRight = state.previousPaddingRight;
    
    state.locked = false;
    state.previousPaddingRight = '';
  }

  /**
   * Open modal
   * @param {string} modalId - ID of the modal to open
   */
  function openModal(modalId) {
    const overlay = document.getElementById('modal-overlay');
    const modal = document.getElementById(modalId);
    
    if (!overlay || !modal) return;

    state.activeModal = modal;
    
    applyScrollLock();
    overlay.classList.add('active');
    modal.classList.add('active');
    
    // Focus trap - move focus to close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }
  }

  /**
   * Close currently active modal
   */
  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    
    if (!overlay || !state.activeModal) return;

    overlay.classList.remove('active');
    state.activeModal.classList.remove('active');
    
    releaseScrollLock();
    state.activeModal = null;
  }

  /**
   * Initialize modal functionality
   */
  function init() {
    // Close button handler
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Close on overlay click
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          closeModal();
        }
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.activeModal) {
        closeModal();
      }
    });

    // Project card click handlers
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't open modal if clicking a link
        if (e.target.closest('a')) return;
        
        const projectId = card.getAttribute('data-project-id');
        // TODO: Load project details into modal content
        openModal('project-modal');
      });
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for external use
  window.openModal = openModal;
  window.closeModal = closeModal;
})();
