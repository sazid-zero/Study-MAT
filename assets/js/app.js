document.addEventListener('DOMContentLoaded', () => {
  // Initialize Barba for smooth page transitions
  barba.init({
    prevent: ({ el, href }) => {
      // Get href attribute
      const linkHref = el.getAttribute('href');
      if (!linkHref) return false;
      
      // Prevent Barba from handling pure anchor links
      if (linkHref.startsWith('#')) {
        return true;
      }
      
      // Prevent Barba from handling same-page anchor navigation
      try {
        const url = new URL(linkHref, window.location.origin);
        const currentPath = window.location.pathname;
        
        // If it's the same page with just a hash change, let normal navigation handle it
        if (url.pathname === currentPath && url.hash) {
          return true;
        }
      } catch (e) {
        // If URL parsing fails, just continue
      }
      
      // Prevent Barba for external links or special classes
      return el.classList && el.classList.contains('no-barba');
    },
    transitions: [{
      name: 'instant-transition',
      async leave(data) {
        // Quick fade out
        await gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.15,
          ease: 'power1.inOut'
        });
      },
      async enter(data) {
        // Scroll to top immediately
        window.scrollTo(0, 0);
        // Quick fade in
        gsap.fromTo(data.next.container, 
          { opacity: 0 },
          { opacity: 1, duration: 0.15, ease: 'power1.inOut' }
        );
      },
      async once(data) {
        // Initial page load - no animation
        gsap.set(data.next.container, { opacity: 1 });
      }
    }],
    views: [{
      namespace: 'home',
      beforeEnter(data) {
        updateBodyClass('home');
      }
    }, {
      namespace: 'docs',
      beforeEnter(data) {
        updateBodyClass('docs');
      }
    }, {
      namespace: 'page',
      beforeEnter(data) {
        updateBodyClass('page');
      }
    }]
  });
  
  // Helper to manage body classes
  function updateBodyClass(layout) {
    document.body.classList.remove('layout-home', 'layout-docs', 'layout-page');
    document.body.classList.add(`layout-${layout}`);
  }
  
  // Set initial body class based on current page
  const initialLayout = document.querySelector('[data-barba="container"]')?.dataset?.barbaNamespace || 'page';
  updateBodyClass(initialLayout);
  
  // Initialize components
  initSidebar();
  enhanceCodeBlocks();
  generateTOC();
  initScrollSpy();
  highlightCurrentPage();
  setupSmoothScroll();
  
  // Re-initialize components after page transition
  barba.hooks.after(() => {
    initSidebar();
    enhanceCodeBlocks();
    generateTOC();
    initScrollSpy();
    highlightCurrentPage();
    setupSmoothScroll();
  });
});

// Sidebar Mobile Toggle
function initSidebar() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const closeBtn = document.querySelector('.close-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  // Remove any existing event listeners by cloning elements
  if (closeBtn) {
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
  }
  
  // Close sidebar function
  const closeSidebar = () => {
    console.log('Closing sidebar');
    if (sidebar) {
      sidebar.classList.remove('active');
      console.log('Sidebar active removed');
    }
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  // Open sidebar
  if (toggleBtn) {
    toggleBtn.onclick = (e) => {
      e.stopPropagation();
      console.log('Opening sidebar');
      if (sidebar) sidebar.classList.add('active');
      if (overlay) overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
  }
  
  // Close sidebar button - use the newly cloned button
  const newCloseBtn = document.querySelector('.close-sidebar');
  if (newCloseBtn) {
    newCloseBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Close button clicked');
      closeSidebar();
    };
  }
  
  // Close on overlay click
  if (overlay) {
    overlay.onclick = (e) => {
      e.stopPropagation();
      closeSidebar();
    };
  }
  
  // Close sidebar on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
      closeSidebar();
    }
  });
  
  // Close sidebar when clicking a link on mobile
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
}

// Highlight current page and section in sidebar
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const currentHash = window.location.hash;
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    
    const linkPath = new URL(link.href).pathname;
    const linkHash = new URL(link.href).hash;
    
    // Exact match for current page + hash
    if (currentPath === linkPath && currentHash === linkHash && linkHash !== '') {
      link.classList.add('active');
    }
    // Match current page for main links (no hash)
    else if (currentPath === linkPath && !linkHash && !currentHash) {
      link.classList.add('active');
    }
    // Partial match for current page (useful for main nav items)
    else if (currentPath.startsWith(linkPath) && linkPath !== '/' && link.classList.contains('main-link')) {
      link.classList.add('active');
    }
  });
}

// Generate Table of Contents
function generateTOC() {
  const tocNav = document.getElementById('toc-nav');
  const content = document.querySelector('.docs-content');
  
  if (!tocNav || !content) return;
  
  tocNav.innerHTML = '';
  const headings = content.querySelectorAll('h2, h3');
  
  if (headings.length === 0) return;
  
  const ul = document.createElement('ul');
  
  headings.forEach(heading => {
    // Generate ID if missing
    if (!heading.id) {
      heading.id = heading.textContent
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    const li = document.createElement('li');
    li.className = heading.tagName.toLowerCase();
    
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    
    // Smooth scroll with offset
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const headerOffset = 100; // Account for fixed header
      const elementPosition = heading.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update URL
      history.pushState(null, null, `#${heading.id}`);
      
      // Update TOC active state
      document.querySelectorAll('#toc-nav a').forEach(link => link.classList.remove('active'));
      a.classList.add('active');
    });
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  
  tocNav.appendChild(ul);
}

// Enhanced Code Block Styling
function enhanceCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre.highlight, figure.highlight, pre > code, .highlighter-rouge');
  
  codeBlocks.forEach(block => {
    // Skip if already enhanced
    if (block.closest('.code-window')) return;
    
    // Find the actual pre element
    let preElement = block.tagName === 'PRE' ? block : block.querySelector('pre');
    if (!preElement && block.parentElement?.tagName === 'PRE') {
      preElement = block.parentElement;
    }
    if (!preElement) return;
    
    // Detect language
    let lang = 'code';
    const codeElement = preElement.querySelector('code');
    
    // Try various methods to detect language
    if (codeElement) {
      // Check data-lang attribute
      if (codeElement.dataset.lang) {
        lang = codeElement.dataset.lang;
      }
      // Check class names
      else {
        const classes = Array.from(codeElement.classList);
        const langClass = classes.find(cls => 
          cls.startsWith('language-') || 
          cls.startsWith('lang-')
        );
        if (langClass) {
          lang = langClass.replace(/^(language-|lang-)/, '');
        }
      }
    }
    
    // Check parent classes
    if (lang === 'code') {
      const parentClasses = Array.from(preElement.classList);
      const langClass = parentClasses.find(cls => 
        cls.startsWith('language-') || 
        cls.startsWith('lang-') ||
        cls.match(/^(cpp|python|javascript|java|c|bash|sql|html|css)$/)
      );
      if (langClass) {
        lang = langClass.replace(/^(language-|lang-)/, '');
      }
    }
    
    // Create Window Wrapper
    const windowWrapper = document.createElement('div');
    windowWrapper.className = 'code-window';
    
    // Create Header with Mac-style Controls
    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `
      <div class="window-controls">
        <span class="control red"></span>
        <span class="control yellow"></span>
        <span class="control green"></span>
      </div>
      <div class="window-title">${lang}</div>
    `;
    
    // Wrap the code block
    preElement.parentNode.insertBefore(windowWrapper, preElement);
    const contentDiv = document.createElement('div');
    contentDiv.className = 'code-window-content';
    contentDiv.appendChild(preElement);
    
    windowWrapper.appendChild(header);
    windowWrapper.appendChild(contentDiv);
  });
}

// Scroll Spy for Sidebar Navigation
function initScrollSpy() {
  const sections = document.querySelectorAll('.docs-content h2[id], .docs-content h3[id]');
  const sidebarLinks = document.querySelectorAll('.nav-subitems a');
  
  if (sections.length === 0 || sidebarLinks.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -60% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  };

  let activeSection = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        activeSection = entry.target;
        updateActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  function updateActiveLink(sectionId) {
    // Remove active from all sidebar sub-links
    sidebarLinks.forEach(link => link.classList.remove('active'));
    
    // Add active to matching link
    if (sectionId) {
      const activeLink = document.querySelector(
        `.nav-subitems a[href*="#${sectionId}"], .nav-subitems a[href$="#${sectionId}"]`
      );
      if (activeLink) {
        activeLink.classList.add('active');
        
        // Scroll sidebar to show active link
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && activeLink) {
          const linkRect = activeLink.getBoundingClientRect();
          const sidebarRect = sidebar.getBoundingClientRect();
          
          if (linkRect.top < sidebarRect.top || linkRect.bottom > sidebarRect.bottom) {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }
    }
  }

  sections.forEach(section => observer.observe(section));
  
  // Also update on hash change
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      updateActiveLink(hash);
    }
  });
  
  // Initial highlight based on current hash
  if (window.location.hash) {
    const initialHash = window.location.hash.substring(1);
    updateActiveLink(initialHash);
  }
}

// Setup smooth scrolling for all anchor links
function setupSmoothScroll() {
  // Handle pure anchor links (#id)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL
        history.pushState(null, null, href);
      }
    });
  });
  
  // Handle links with same page + anchor (e.g., /stl-guide/#section)
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      
      const url = new URL(href, window.location.origin);
      const currentPath = window.location.pathname;
      
      // Check if it's the same page
      if (url.pathname === currentPath && url.hash) {
        e.preventDefault();
        const targetId = url.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update URL
          history.pushState(null, null, url.hash);
          
          // Update active state in sidebar
          document.querySelectorAll('.nav-subitems a').forEach(link => link.classList.remove('active'));
          anchor.classList.add('active');
        }
      }
    });
  });
}
