# 🚀 GitHub Pages Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `cs-interview-prep` (or your choice)
3. Choose **Public**
4. Don't initialize with README (we already have files)
5. Click **Create repository**

### Step 2: Push Your Code

Open terminal in this directory and run:

```bash
# Navigate to docs folder
cd docs

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Interview prep guides"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/cs-interview-prep.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Scroll down and click **Pages** (left sidebar)
4. Under **Source**:
   - Branch: Select `main`
   - Folder: Select `/ (root)`
5. Click **Save**
6. Wait 1-2 minutes for deployment

### Step 4: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/cs-interview-prep/
```

---

## Customization Checklist

Before deploying, update these files:

### 1. Edit `_config.yml`
```yaml
title: Your Name's CS Notes          # Change this
description: My interview prep        # Change this
author: Your Name                     # Change this
email: your.email@example.com        # Change this
```

### 2. Edit `README.md`
- Replace `YOUR_USERNAME` with your GitHub username (3 places)
- Update contact email
- Add your own description

### 3. Test Locally (Optional)
```bash
# Install Jekyll
gem install jekyll bundler

# In docs folder
bundle install
bundle exec jekyll serve

# Open http://localhost:4000
```

---

## Adding New Topics

### Create New Page

1. Create `docs/my-topic.md`:
```markdown
---
layout: page
title: My Topic
permalink: /my-topic/
---

# My Topic Content

Your content here...
```

2. Add to navigation in `_config.yml`:
```yaml
header_pages:
  - stl-guide.md
  - junior-swe-prep.md
  - my-topic.md        # Add this
```

3. Link from `index.md`:
```markdown
### [📘 My Topic](/my-topic)
Description of your topic
```

4. Push changes:
```bash
git add .
git commit -m "Add new topic: My Topic"
git push
```

---

## Troubleshooting

### Site not showing?
- Wait 2-3 minutes after enabling Pages
- Check Actions tab for build status
- Ensure files are in the correct location

### 404 errors?
- Verify `permalink` in frontmatter
- Check file paths in `_config.yml`
- Make sure files have `.md` extension

### Styling broken?
- Check `theme` in `_config.yml`
- Verify Gemfile has theme gem
- Try different theme

---

## Popular Themes

Change in `_config.yml`:

```yaml
# Clean and minimal
theme: minima

# Modern with gradient
theme: jekyll-theme-cayman

# Ultra simple
theme: jekyll-theme-minimal

# Dark theme
theme: jekyll-theme-slate
```

---

## Need Help?

- [Jekyll Docs](https://jekyllrb.com/docs/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Markdown Guide](https://www.markdownguide.org/)

---

**Good luck with your site! 🎉**
