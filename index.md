---
layout: page
title: Home
---

<div class="hero-section">
  <h1>🎓 CS Interview Prep Hub</h1>
  <p class="hero-subtitle">Master data structures, algorithms, and ace your technical interviews</p>
</div>

---

## 📚 Available Guides

<div class="guide-grid">

<div class="guide-card">

### [🔧 C++ STL Complete Guide]({{ '/stl-guide/' | relative_url }})

Master the Standard Template Library for competitive programming

**Topics Covered:**
- ✅ All containers (Vector, Map, Set, Stack, Queue)
- ✅ Iterators and their usage
- ✅ STL algorithms (sort, search, etc.)
- ✅ Time complexities
- ✅ Real-world examples & patterns
- ✅ Quick reference tables

<a href="{{ '/stl-guide/' | relative_url }}" class="btn-primary">Read STL Guide →</a>

</div>

<div class="guide-card">

### [💼 Junior SWE Assessment Prep]({{ '/junior-swe-prep/' | relative_url }})

Everything you need for entry-level software engineering assessments

**Topics Covered:**
- ✅ Core data structures & algorithms
- ✅ Problem-solving patterns
- ✅ Time & space complexity analysis
- ✅ System design basics
- ✅ Behavioral interview tips
- ✅ 4-week study plan

<a href="{{ '/junior-swe-prep/' | relative_url }}" class="btn-primary">Read SWE Prep →</a>

</div>

</div>

---

## 🚀 Quick Start

<div class="quick-start-grid">

<div class="start-card">
<h3>📖 For Beginners</h3>
<p>Start with fundamentals:</p>
<ol>
<li>Review <a href="{{ '/stl-guide/' | relative_url }}#-sequence-containers">basic containers</a></li>
<li>Learn <a href="{{ '/junior-swe-prep/' | relative_url }}#core-data-structures">core data structures</a></li>
<li>Practice easy problems on LeetCode</li>
</ol>
</div>

<div class="start-card">
<h3>⚡ For Interview Prep</h3>
<p>Focus on patterns:</p>
<ol>
<li>Master <a href="{{ '/junior-swe-prep/' | relative_url }}#-problem-solving-patterns">problem patterns</a></li>
<li>Study <a href="{{ '/junior-swe-prep/' | relative_url }}#time--space-complexity">complexity analysis</a></li>
<li>Review <a href="{{ '/junior-swe-prep/' | relative_url }}#-common-question-types">common questions</a></li>
</ol>
</div>

<div class="start-card">
<h3>🎯 For Competitive Programming</h3>
<p>Advanced techniques:</p>
<ol>
<li>Deep dive into <a href="{{ '/stl-guide/' | relative_url }}#-associative-containers-sorted">STL containers</a></li>
<li>Learn <a href="{{ '/stl-guide/' | relative_url }}#-algorithms">STL algorithms</a></li>
<li>Practice on Codeforces</li>
</ol>
</div>

</div>

---

## 💡 Study Tips

<div class="tips-section">

**✅ Understand, don't memorize** - Focus on concepts, not just solutions

**✅ Practice consistently** - 30 minutes daily beats 5 hours once a week  

**✅ Time yourself** - Simulate real interview conditions

**✅ Explain out loud** - If you can teach it, you understand it

**✅ Review mistakes** - Learn more from failures than successes

**✅ Build projects** - Apply concepts to real problems

</div>

---

## 🔗 External Resources

<div class="resources-grid">

<div class="resource-card">
<h4>🏆 Practice Platforms</h4>
<ul>
<li><a href="https://leetcode.com" target="_blank">LeetCode</a> - Interview questions</li>
<li><a href="https://codeforces.com" target="_blank">Codeforces</a> - Competitions</li>
<li><a href="https://hackerrank.com" target="_blank">HackerRank</a> - Skills tests</li>
<li><a href="https://atcoder.jp" target="_blank">AtCoder</a> - Algorithm contests</li>
</ul>
</div>

<div class="resource-card">
<h4>📚 Learning Resources</h4>
<ul>
<li><a href="https://cp-algorithms.com" target="_blank">CP-Algorithms</a> - Algorithm encyclopedia</li>
<li><a href="https://visualgo.net" target="_blank">VisuAlgo</a> - Algorithm visualizations</li>
<li><a href="https://neetcode.io" target="_blank">NeetCode</a> - Pattern-based learning</li>
<li><a href="https://leetcode.com/discuss/interview-question" target="_blank">Interview Experiences</a></li>
</ul>
</div>

</div>

---

## 📈 Coming Soon

We're constantly expanding! Here's what's in the pipeline:

- 🔄 **Graph Algorithms** - DFS, BFS, Dijkstra, Floyd-Warshall
- 🔄 **Dynamic Programming** - From basics to advanced patterns
- 🔄 **System Design** - Scalability and architecture
- 🔄 **Database Concepts** - SQL, indexing, normalization
- 🔄 **OOP Design Patterns** - SOLID principles
- 🔄 **Bit Manipulation** - Tricks and techniques

---

<div class="cta-section">

## 🎯 Ready to Start?

Pick a guide and begin your journey to mastering technical interviews!

<div class="cta-buttons">
<a href="{{ '/stl-guide/' | relative_url }}" class="btn-primary">Explore STL Guide</a>
<a href="{{ '/junior-swe-prep/' | relative_url }}" class="btn-secondary">Start Interview Prep</a>
</div>

</div>

<style>
.hero-section {
  text-align: center;
  padding: 3rem 0;
  margin-bottom: 2rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-top: 1rem;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.guide-card {
  background: rgba(19, 47, 76, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(51, 153, 255, 0.2);
  border-color: var(--accent);
}

.quick-start-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.start-card {
  background: rgba(19, 47, 76, 0.3);
  border-left: 4px solid var(--accent);
  padding: 1.5rem;
  border-radius: 8px;
}

.start-card h3 {
  margin-top: 0;
  color: var(--accent-hover);
}

.tips-section {
  background: rgba(51, 153, 255, 0.05);
  border-left: 4px solid var(--success);
  padding: 1.5rem 2rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.tips-section p {
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.resource-card {
  background: rgba(19, 47, 76, 0.3);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.resource-card h4 {
  margin-top: 0;
  color: var(--accent);
}

.cta-section {
  text-align: center;
  padding: 3rem 0;
  margin-top: 3rem;
  border-top: 1px solid var(--border-color);
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn-primary, .btn-secondary {
  display: inline-block;
  padding: 0.875rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #3399ff 0%, #0066cc 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(51, 153, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(51, 153, 255, 0.4);
  text-decoration: none;
}

.btn-secondary {
  background: transparent;
  color: var(--accent);
  border-color: var(--accent);
}

.btn-secondary:hover {
  background: rgba(51, 153, 255, 0.1);
  transform: translateY(-2px);
  text-decoration: none;
}

@media (max-width: 768px) {
  .guide-grid,
  .quick-start-grid,
  .resources-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
