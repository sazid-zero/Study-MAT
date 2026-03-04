document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  if (!searchInput || !resultsContainer) return;

  let sectionIndex = []; // Section-level search index
  let rawPages = [];

  // Fetch search index
  const baseUrl = window.location.pathname.includes('/Study-MAT') ? '/Study-MAT' : '';
  const timestamp = new Date().getTime();
  const possiblePaths = [
    `${baseUrl}/search.json?v=${timestamp}`,
    `/Study-MAT/search.json?v=${timestamp}`,
    `/search.json?v=${timestamp}`
  ];

  const fetchIndex = async () => {
    for (const path of possiblePaths) {
      try {
        const response = await fetch(path);
        if (response.ok) {
          rawPages = await response.json();
          sectionIndex = buildSectionIndex(rawPages);
          console.log('✅ Search index loaded:', sectionIndex.length, 'sections from', rawPages.length, 'pages');
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch from:', path, err);
      }
    }
    console.error('❌ Failed to load search index from all paths');
  };

  fetchIndex();

  // ── Build section-level index from HTML content ──
  function buildSectionIndex(pages) {
    const sections = [];
    const parser = new DOMParser();

    pages.forEach(page => {
      // If no HTML, create one section from stripped content
      if (!page.html) {
        sections.push({
          pageTitle: page.title || '',
          sectionTitle: page.title || '',
          sectionId: '',
          content: page.content || '',
          url: page.url
        });
        return;
      }

      const doc = parser.parseFromString('<div>' + page.html + '</div>', 'text/html');
      const container = doc.body.firstChild;
      if (!container) return;

      const children = Array.from(container.children);
      let currentSection = {
        pageTitle: page.title || '',
        sectionTitle: page.title || '',
        sectionId: '',
        content: '',
        url: page.url
      };

      children.forEach(child => {
        if (/^H[1-6]$/.test(child.tagName)) {
          // Save previous section if it has content
          if (currentSection.content.trim()) {
            sections.push({ ...currentSection, content: currentSection.content.trim() });
          }
          // Start new section
          currentSection = {
            pageTitle: page.title || '',
            sectionTitle: child.textContent.trim(),
            sectionId: child.id || generateId(child.textContent),
            content: '',
            url: page.url
          };
        } else {
          currentSection.content += child.textContent + ' ';
        }
      });

      // Push last section
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection, content: currentSection.content.trim() });
      }
    });

    return sections;
  }

  // Generate heading ID (matches kramdown's algorithm)
  function generateId(text) {
    return text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ── Search logic ──
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (query.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    if (sectionIndex.length === 0) {
      resultsContainer.innerHTML = '<div class="search-item"><div class="search-item-title">Loading search index...</div></div>';
      resultsContainer.style.display = 'block';
      if (!window.searchRetrying) {
        window.searchRetrying = true;
        fetchIndex();
      }
      return;
    }

    // Score and rank results
    const scored = sectionIndex
      .map(section => {
        const titleLower = section.sectionTitle.toLowerCase();
        const contentLower = section.content.toLowerCase();
        let score = 0;

        if (titleLower.includes(query)) score += 10;
        if (contentLower.includes(query)) {
          score += 3;
          // Bonus for more occurrences (up to 5)
          const matches = contentLower.split(query).length - 1;
          score += Math.min(matches, 5);
        }

        return { ...section, score };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    displayResults(scored, query);
  });

  // ── Display results ──
  function displayResults(results, query) {
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-item" style="cursor: default;">
          <div class="search-item-title">No results found</div>
          <div class="search-item-preview">Try "containers", "algorithms", "database"...</div>
        </div>`;
    } else {
      resultsContainer.innerHTML = results.map(item => {
        // Build URL with query param and section anchor
        // URL format: /page/?q=query#section-id  (fragment must be last)
        let targetUrl = item.url;
        const qParam = 'q=' + encodeURIComponent(query);
        const sep = targetUrl.includes('?') ? '&' : '?';
        targetUrl += sep + qParam;
        if (item.sectionId) {
          targetUrl += '#' + item.sectionId;
        }

        // Build display title: "Page › Section" or just "Page"
        let displayTitle = item.pageTitle;
        if (item.sectionTitle && item.sectionTitle !== item.pageTitle) {
          displayTitle = item.pageTitle + ' <span class="search-breadcrumb">›</span> ' + item.sectionTitle;
        }

        // Get context snippet around the match
        const snippet = getContextSnippet(item.content, query, 140);

        return `
          <a href="${targetUrl}" class="search-item">
            <div class="search-item-title">${highlightText(displayTitle, query)}</div>
            <div class="search-item-preview">${highlightText(snippet, query)}</div>
          </a>
        `;
      }).join('');
    }
    resultsContainer.style.display = 'block';
  }

  // ── Helpers ──

  // Extract a text snippet centered around the first match
  function getContextSnippet(content, query, maxLen) {
    if (!content) return '...';
    const lower = content.toLowerCase();
    const idx = lower.indexOf(query.toLowerCase());

    if (idx === -1) return content.substring(0, maxLen) + (content.length > maxLen ? '...' : '');

    const padding = Math.floor((maxLen - query.length) / 2);
    const start = Math.max(0, idx - padding);
    const end = Math.min(content.length, idx + query.length + padding);

    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet += '...';

    return snippet;
  }

  function highlightText(text, query) {
    if (!text) return '';
    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      return text.replace(regex, '<mark class="search-mark">$1</mark>');
    } catch (e) {
      return text;
    }
  }

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });

  // Show results on focus if there's a query
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2 && sectionIndex.length > 0) {
      searchInput.dispatchEvent(new Event('input'));
    }
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', (e) => {
    const items = resultsContainer.querySelectorAll('a.search-item');
    if (!items.length) return;

    const active = resultsContainer.querySelector('.search-item.kb-active');
    let idx = Array.from(items).indexOf(active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (active) active.classList.remove('kb-active');
      idx = (idx + 1) % items.length;
      items[idx].classList.add('kb-active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (active) active.classList.remove('kb-active');
      idx = idx <= 0 ? items.length - 1 : idx - 1;
      items[idx].classList.add('kb-active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && active) {
      e.preventDefault();
      active.click();
    } else if (e.key === 'Escape') {
      resultsContainer.style.display = 'none';
      searchInput.blur();
    }
  });
});
