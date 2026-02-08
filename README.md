# My Astro Blog

A fast, content-focused blog built with Astro.

## Features

- 🚀 Built with Astro (latest version)
- ⚡ Minimal JavaScript by default
- 📝 Markdown content support
- 🔍 Searchable by tags
- 📱 Clean, semantic HTML
- 🚦 Fast page loads
- 📄 Static site generation

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

Open [http://localhost:4321](http://localhost:4321) in your browser to see the result.

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
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── robots.txt
│   └── site.webmanifest
├── src/
│   ├── content/
│   │   └── blog/          # Your blog posts (Markdown files)
│   ├── layouts/
│   │   └── BlogLayout.astro  # Main blog layout
│   └── pages/
│       ├── index.astro    # Homepage
│       ├── blog.astro     # Blog listing
│       ├── blog/
│       │   ├── [slug].astro    # Individual post
│       │   └── tag/
│       │       └── [tag].astro # Tag filtering
│       └── sitemap-index.xml.js
├── astro.config.mjs       # Astro configuration
├── package.json
└── tsconfig.json
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

## Adding Frameworks

Astro is framework-agnostic, but you can add frameworks like React, Vue, or Svelte:

```bash
npm runastro add react
npm runastro add tailwind
```

## License

MIT
