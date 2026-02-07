document.addEventListener('DOMContentLoaded', () => {
  // Initialize Barba
  barba.init({
    transitions: [{
      name: 'opacity-transition',
      leave(data) {
        return gsap.to(data.current.container, {
          opacity: 0,
          duration: 0.3
        });
      },
      enter(data) {
        return gsap.from(data.next.container, {
          opacity: 0,
          duration: 0.3
        });
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
  
  // Initial Sidebar & TOC Logic
  initSidebar();
  generateTOC();
  
  // Re-init components after transition
  barba.hooks.after(() => {
    initSidebar();
    generateTOC();
    // Re-highlight code if needed, etc.
  });
});

function initSidebar() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const closeBtn = document.querySelector('.close-sidebar');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (toggleBtn) {
    toggleBtn.onclick = () => {
      sidebar.classList.add('active');
      overlay.classList.add('active');
    };
  }
  
  if (closeBtn) {
    closeBtn.onclick = () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    };
  }
  
  if (overlay) {
    overlay.onclick = () => {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
    };
  }
}

function generateTOC() {
  const tocNav = document.getElementById('toc-nav');
  const content = document.querySelector('.docs-content');
  
  if (!tocNav || !content) return;
  
  tocNav.innerHTML = '';
  const headings = content.querySelectorAll('h2, h3');
  
  if (headings.length === 0) return;
  
  const ul = document.createElement('ul');
  
  headings.forEach(heading => {
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    
    const li = document.createElement('li');
    li.className = heading.tagName.toLowerCase();
    
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    
    // Smooth scroll (Barba handles links, need to prevent full reload for anchors)
    a.addEventListener('click', (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: 'smooth' });
      // Update history
      history.pushState(null, null, `#${heading.id}`);
    });
    
    li.appendChild(a);
    ul.appendChild(li);
  });
  
  tocNav.appendChild(ul);
}
