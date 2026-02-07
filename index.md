---
layout: home
title: Home
---

<div class="hero-section minimal-hero">
  <div class="hero-content">
    <h1>CS Prep Hub</h1>
    <p class="hero-subtitle">Master Data Structures, Algorithms, and System Design.</p>
    
    <div class="hero-actions">
      <a href="{{ '/junior-swe-prep/' | relative_url }}" class="btn-primary btn-large">
        <i class="fas fa-play"></i> Start Learning
      </a>
    </div>
  </div>
</div>

<style>
/* Local override for minimal home if needed, though main CSS handles most */
.minimal-hero {
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}
.hero-content {
  text-align: center;
  max-width: 800px;
}
.btn-large {
  font-size: 1.25rem;
  padding: 1rem 3rem;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
