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
  console.log('Fetching search index from:', `${baseUrl}/search.json`);
  
  fetch(`${baseUrl}/search.json`)
    .then(response => {
      console.log('Search response:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      searchIndex = data;
      console.log('Search index loaded successfully:', searchIndex.length, 'items');
      console.log('Sample item:', searchIndex[0]);
    })
    .catch(err => {
      console.error('Error fetching search index:', err);
      console.error('Tried to fetch from:', `${baseUrl}/search.json`);
    });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    console.log('Search query:', query);
    console.log('Search index length:', searchIndex.length);
    
    if (query.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    const results = searchIndex.filter(item => {
      const titleMatch = item.title && item.title.toLowerCase().includes(query);
      const contentMatch = item.content && item.content.toLowerCase().includes(query);
      return titleMatch || contentMatch;
    }).slice(0, 5); // Limit to 5 results

    console.log('Search results found:', results.length);
    console.log('Results:', results);
    
    displayResults(results, query);
  });

  function displayResults(results, query) {
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-item" style="cursor: default;"><div class="search-item-title">No results found</div><div class="search-item-preview">Try different keywords</div></div>';
    } else {
      resultsContainer.innerHTML = results.map(item => {
        const excerpt = item.excerpt || item.content?.substring(0, 150) || '';
        const itemUrl = item.url.startsWith('/') ? `${baseUrl}${item.url}` : item.url;
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
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(96, 165, 250, 0.3); color: var(--primary-light); padding: 0 2px; border-radius: 2px;">$1</mark>');
  }

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });

  // Show results on focus if there's a query
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      const query = searchInput.value.toLowerCase().trim();
      const results = searchIndex.filter(item => {
        return item.title.toLowerCase().includes(query) || 
               (item.content && item.content.toLowerCase().includes(query));
      }).slice(0, 5);
      if (results.length > 0) {
        displayResults(results, query);
      }
    }
  });
});
