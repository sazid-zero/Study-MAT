document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');
  
  if (!searchInput) return;

  let searchIndex = [];

  // Fetch search index
  fetch('/Study-MAT/search.json')
    .then(response => response.json())
    .then(data => {
      searchIndex = data;
    })
    .catch(err => console.error('Error fetching search index:', err));

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    const results = searchIndex.filter(item => {
      return item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query);
    }).slice(0, 5); // Limit to 5 results

    displayResults(results);
  });

  function displayResults(results) {
    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-item">No results found</div>';
    } else {
      resultsContainer.innerHTML = results.map(item => `
        <a href="${item.url}" class="search-item">
          <div class="search-item-title">${item.title}</div>
          <div class="search-item-preview">${item.excerpt}</div>
        </a>
      `).join('');
    }
    resultsContainer.style.display = 'block';
  }

  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
      resultsContainer.style.display = 'none';
    }
  });
});
