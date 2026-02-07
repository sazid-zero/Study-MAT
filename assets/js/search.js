document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  
  if (!searchInput || !resultsContainer) {
    console.log('Search elements not found');
    return;
  }

  let searchIndex = [];

  // Fetch search index - use relative path
  const baseUrl = window.location.pathname.includes('/Study-MAT') ? '/Study-MAT' : '';
  console.log('Base URL:', baseUrl);
  // Robust fetch logic for search index with cache busting
  const timestamp = new Date().getTime();
  const possiblePaths = [
    `${baseUrl}/search.json?v=${timestamp}`,
    `/Study-MAT/search.json?v=${timestamp}`,
    `/search.json?v=${timestamp}`
  ];
  
  // Try paths sequentially
  const fetchIndex = async () => {
    for (const path of possiblePaths) {
      try {
        console.log('Trying to fetch search index from:', path);
        const response = await fetch(path);
        if (response.ok) {
          const data = await response.json();
          searchIndex = data;
          console.log('✅ Search index loaded from:', path, 'Items:', searchIndex.length);
          return; // Success
        }
      } catch (err) {
        console.warn('Failed to fetch from:', path, err);
      }
    }
    console.error('❌ Failed to load search index from all paths');
  };
  
  fetchIndex();

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    // Show loading if index not ready
    if (searchIndex.length === 0) {
      resultsContainer.innerHTML = '<div class="search-item"><div class="search-item-title">Loading search index...</div></div>';
      resultsContainer.style.display = 'block';
      // Try fetching again if empty
      if (!window.searchRetrying) {
        window.searchRetrying = true;
        fetchIndex();
      }
      return;
    }

    const results = searchIndex.filter(item => {
      // Safety check for null fields
      const title = item.title ? item.title.toLowerCase() : '';
      const content = item.content ? item.content.toLowerCase() : '';
      return title.includes(query) || content.includes(query);
    }).slice(0, 8); // Increased limit

    displayResults(results, query);
  });

  function displayResults(results, query) {
    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="search-item" style="cursor: default;">
          <div class="search-item-title">No results found</div>
          <div class="search-item-preview">Try "containers", "algorithms", "database"...</div>
        </div>`;
    } else {
      resultsContainer.innerHTML = results.map(item => {
        // item.url already contains baseurl from Jekyll's relative_url filter
        // Just ensure it's clean
        const itemUrl = item.url;
        const excerpt = item.excerpt || (item.content ? item.content.substring(0, 100) : '') || '...';
        
        return `
          <a href="${itemUrl}" class="search-item">
            <div class="search-item-title">${highlightText(item.title, query)}</div>
            <div class="search-item-preview">${excerpt}...</div>
          </a>
        `;
      }).join('');
    }
    resultsContainer.style.display = 'block';
  }

  function highlightText(text, query) {
    if (!text) return '';
    try {
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark style="background: rgba(96, 165, 250, 0.3); color: var(--primary-light); padding: 0 2px; border-radius: 2px;">$1</mark>');
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
    if (searchInput.value.trim().length >= 2 && searchIndex.length > 0) {
      const query = searchInput.value.toLowerCase().trim();
      // Re-run filter logic
      const results = searchIndex.filter(item => {
        const title = item.title ? item.title.toLowerCase() : '';
        const content = item.content ? item.content.toLowerCase() : '';
        return title.includes(query) || content.includes(query);
      }).slice(0, 8);
      
      if (results.length > 0) {
        displayResults(results, query);
      }
    }
  });
});
