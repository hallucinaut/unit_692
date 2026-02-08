# UNIT_692

A fast, content-focused blog built with Astro, inspired by quantum computing concepts.

## Features

- **Built with Astro** - Modern web framework for content websites
- **Minimal JavaScript** - Static generation with almost zero client-side JS
- **Markdown Content** - Write posts in Markdown
- **Tag System** - Filter and search posts by tags
- **SEO Optimized** - Semantic HTML, sitemaps, robots.txt
- **Type Safe** - Content validation with TypeScript
- **Content Collection** - Organized blog posts with schema

## Getting Started

### Installation

```bash
cd blog
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
blog/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── content/
│   │   └── blog/          # Blog posts (Markdown files)
│   ├── layouts/           # Layout components
│   │   ├── BaseLayout.astro
│   │   └── BlogLayout.astro
│   ├── lib/               # Utilities
│   │   └── date.ts        # Date formatting
│   ├── components/        # Reusable components
│   │   └── layout/
│   │       └── Header.astro
│   ├── pages/             # Route pages
│   │   ├── index.astro    # Homepage
│   │   ├── blog.astro     # Blog listing
│   │   ├── blog/
│   │   │   ├── [slug].astro
│   │   │   └── tag/
│   │   │       └── [tag].astro
│   │   └── sitemap-index.xml.js
│   ├── styles/            # CSS files (ready)
│   └── content.config.ts  # Content collection schema
├── astro.config.mjs
├── package.json
└── README.md
```

## Creating Blog Posts

Create new blog posts in `src/content/blog/`:

```markdown
---
title: 'Your Post Title'
date: '2026-02-08'
author: 'Your Name'
excerpt: 'A brief description of your post'
tags: ['astro', 'web-dev']
---

## Your Content Here

Your markdown content goes here.
```

## Content Schema

The blog collection supports the following frontmatter:

- `title` (required) - Post title
- `date` (required) - Publication date (YYYY-MM-DD format)
- `author` (optional) - Post author
- `excerpt` (optional) - Brief description of the post
- `tags` (optional) - Array of tags for filtering

## Adding CSS

To add styles to your blog, create CSS files in `src/styles/`:

```css
/* src/styles/globals.css */
main {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}
```

## Adding Frameworks

Astro is framework-agnostic, but you can add frameworks like React, Vue, or Svelte:

```bash
npm run astro add react
npm run astro add vue
npm run astro add tailwindcss
```

## License

MIT

