/**
 * Main Entry Point
 * Initializes all components after DOM is ready
 */

(function() {
  'use strict';

  /**
   * Initialize all components
   */
  function init() {
    // Load projects data and render cards
    loadProjects();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize contact form
    initContactForm();
    
    // Remove loading gate
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 300);
  }

  /**
   * Load and render project cards
   */
  function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    // Sample projects data - this would typically come from a JSON file or API
    const projects = [
      {
        id: 'crypto-vault',
        title: 'Crypto Vault',
        description: 'A secure password manager with end-to-end encryption using AES-256 and Argon2 key derivation. Features zero-knowledge architecture.',
        tech: ['Python', 'Cryptography', 'SQLite', 'Flask'],
        github: 'https://github.com/rainzhang05/crypto-vault',
        external: null,
        featured: true
      },
      {
        id: 'portfolio',
        title: 'Portfolio Website',
        description: 'This responsive portfolio website built with vanilla HTML, CSS, and JavaScript. Features smooth animations and dark mode.',
        tech: ['HTML', 'CSS', 'JavaScript'],
        github: 'https://github.com/rainzhang05/rainzhang05.github.io',
        external: 'https://rainzhang05.github.io',
        featured: false
      },
      {
        id: 'secure-chat',
        title: 'Secure Chat App',
        description: 'Real-time encrypted messaging application with E2E encryption, perfect forward secrecy, and secure key exchange protocols.',
        tech: ['React', 'Node.js', 'WebSocket', 'Signal Protocol'],
        github: 'https://github.com/rainzhang05/secure-chat',
        external: null,
        featured: true
      },
      {
        id: 'auth-system',
        title: 'Authentication System',
        description: 'Modern authentication system with OAuth 2.0, JWT tokens, MFA support, and secure session management.',
        tech: ['TypeScript', 'Express', 'PostgreSQL', 'Redis'],
        github: 'https://github.com/rainzhang05/auth-system',
        external: null,
        featured: false
      }
    ];

    // Render project cards
    projects.forEach(project => {
      const card = createProjectCard(project);
      projectsGrid.appendChild(card);
    });
  }

  /**
   * Create a project card element
   * @param {Object} project - Project data
   * @returns {HTMLElement} Project card element
   */
  function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-project-id', project.id);
    
    card.innerHTML = `
      <div class="project-card-header">
        <div class="project-folder-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
          </svg>
        </div>
        <div class="project-links">
          ${project.github ? `
            <a href="${project.github}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          ` : ''}
          ${project.external ? `
            <a href="${project.external}" class="project-link" target="_blank" rel="noopener noreferrer" aria-label="View live site">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          ` : ''}
        </div>
      </div>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-description">${project.description}</p>
      <ul class="project-tech">
        ${project.tech.map(t => `<li>${t}</li>`).join('')}
      </ul>
    `;
    
    return card;
  }

  /**
   * Initialize mobile navigation
   */
  function initMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const menu = document.getElementById('mobile-nav-menu');
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      
      toggle.setAttribute('aria-expanded', !isOpen);
      menu.classList.toggle('active', !isOpen);
      document.body.classList.toggle('mobile-menu-open', !isOpen);
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
        toggle.focus();
      }
    });
  }

  /**
   * Initialize contact form
   */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      
      // Show loading state
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;
      
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      submitBtn.innerHTML = 'Message Sent!';
      form.reset();
      
      // Reset button after delay
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
