# 🎓 CS Interview Prep Hub

> Your comprehensive resource for competitive programming and technical interview preparation

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://your-username.github.io/cs-interview-prep/)
[![Made with Jekyll](https://img.shields.io/badge/Made%20with-Jekyll-1f425f.svg)](https://jekyllrb.com/)

---

## 📚 What's Inside

This repository contains beautifully formatted guides for:

- **[C++ STL Complete Guide](docs/stl-guide.md)** - Master containers, iterators, and algorithms
- **[Junior SWE Assessment Prep](docs/junior-swe-prep.md)** - Everything for entry-level technical assessments
- More guides coming soon: Graph Algorithms, Dynamic Programming, System Design...

---

## 🚀 Quick Start with GitHub Pages

### Option 1: Deploy Your Own (Recommended)

1. **Fork or Create Repository**
   ```bash
   git init cs-interview-prep
   cd cs-interview-prep
   ```

2. **Copy Files**
   - Copy the `docs/` folder to your repository root
   - Make sure you have:
     - `docs/_config.yml`
     - `docs/index.md`
     - `docs/stl-guide.md`
     - `docs/junior-swe-prep.md`

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Interview prep guides"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cs-interview-prep.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select:
     - Branch: `main`
     - Folder: `/docs`
   - Click **Save**

5. **Access Your Site**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/cs-interview-prep/`
   - Wait 1-2 minutes for the first build

### Option 2: Local Preview

Want to preview before deploying?

1. **Install Jekyll** (requires Ruby)
   ```bash
   gem install jekyll bundler
   ```

2. **Navigate to docs folder**
   ```bash
   cd docs
   ```

3. **Create Gemfile**
   ```ruby
   source "https://rubygems.org"
   gem "jekyll", "~> 4.3"
   gem "minima", "~> 2.5"
   gem "jekyll-feed"
   gem "jekyll-seo-tag"
   ```

4. **Install and serve**
   ```bash
   bundle install
   bundle exec jekyll serve
   ```

5. **Open browser**
   - Visit `http://localhost:4000`

---

## 📁 Repository Structure

```
cs-interview-prep/
├── docs/                          # GitHub Pages source
│   ├── _config.yml               # Jekyll configuration
│   ├── index.md                  # Home page
│   ├── stl-guide.md             # C++ STL guide
│   ├── junior-swe-prep.md       # SWE assessment prep
│   └── (future pages)            # More guides...
├── README.md                     # This file
└── (your other files)            # Keep your existing files
```

---

## ✏️ Customization

### Update Site Info

Edit `docs/_config.yml`:

```yaml
title: Your Site Title
description: Your description
author: Your Name
email: your.email@example.com
```

### Change Theme

GitHub Pages supports these themes out of the box:
- `minima` (default, clean)
- `jekyll-theme-cayman` (modern, gradient)
- `jekyll-theme-minimal` (ultra-simple)
- `jekyll-theme-slate` (dark)

Update in `_config.yml`:
```yaml
theme: jekyll-theme-cayman
```

### Add New Pages

1. Create `docs/your-topic.md`:
   ```markdown
   ---
   layout: page
   title: Your Topic
   permalink: /your-topic/
   ---

   # Your Content Here
   ```

2. Add to navigation in `_config.yml`:
   ```yaml
   header_pages:
     - stl-guide.md
     - junior-swe-prep.md
     - your-topic.md
   ```

---

## 🎨 Features

- ✅ **Responsive Design** - Works on mobile, tablet, desktop
- ✅ **Syntax Highlighting** - Beautiful code blocks with colors
- ✅ **Fast Loading** - Optimized static pages
- ✅ **SEO Friendly** - Proper meta tags and structure
- ✅ **No Backend Needed** - Pure static site
- ✅ **Free Hosting** - GitHub Pages at no cost

---

## 🔗 External Resources

### For Beginners
- [Markdown Guide](https://www.markdownguide.org/) - Learn markdown syntax
- [Jekyll Documentation](https://jekyllrb.com/docs/) - Customize your site
- [GitHub Pages Guide](https://pages.github.com/) - Official guide

### For Practice
- [LeetCode](https://leetcode.com) - Coding problems
- [HackerRank](https://hackerrank.com) - Interview prep
- [Codeforces](https://codeforces.com) - Competitive programming

---

## 📝 Content Roadmap

### Current
- ✅ C++ STL Complete Guide
- ✅ Junior SWE Assessment Prep

### Coming Soon
- 🔄 Graph Algorithms (DFS, BFS, Dijkstra)
- 🔄 Dynamic Programming Patterns
- 🔄 System Design Fundamentals
- 🔄 Database Concepts (SQL/NoSQL)
- 🔄 Object-Oriented Design Patterns
- 🔄 Bit Manipulation Tricks
- 🔄 Math for Programmers

---

## 🤝 Contributing

Want to improve the guides?

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit (`git commit -m "Add improvement"`)
5. Push (`git push origin feature/improvement`)
6. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

Feel free to use these guides for:
- Personal study
- Sharing with friends
- Teaching/mentoring
- Your own GitHub Pages site

---

## 💬 Feedback

Found an error? Have suggestions? Want to add a topic?

- Open an [Issue](https://github.com/YOUR_USERNAME/cs-interview-prep/issues)
- Submit a [Pull Request](https://github.com/YOUR_USERNAME/cs-interview-prep/pulls)
- Contact me at your.email@example.com

---

## 🌟 Star This Repo

If you find these guides helpful, consider giving the repository a star ⭐

It helps others discover these resources too!

---

## 💡 Tips for Using This Site

1. **Bookmark pages** you refer to frequently
2. **Use Ctrl+F** to search within pages
3. **Test code examples** in your IDE
4. **Take notes** in your own markdown files
5. **Practice daily** - consistency is key!

---

**Happy Coding! 🚀**

*Built with ❤️ for the programming community*

---

## Quick Deploy Checklist

- [ ] Create GitHub repository
- [ ] Copy `docs/` folder
- [ ] Update `_config.yml` with your info
- [ ] Push to GitHub
- [ ] Enable GitHub Pages in Settings
- [ ] Wait 1-2 minutes
- [ ] Visit your site!
- [ ] Share with friends 🎉
