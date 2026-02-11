/**
 * InfiniteScrollManager - Manages infinite scroll for blog posts and skills
 */

// Store active instances to prevent duplicates
const activeInstances = new Map();

export class InfiniteScrollManager {
  constructor(config) {
    this.apiEndpoint = config.apiEndpoint;
    this.contentType = config.contentType; // 'blog' or 'skill'
    this.containerSelector = config.containerSelector;
    this.shownIds = new Set(config.initialIds || []);
    this.isLoading = false;
    this.hasMoreContent = true;
    this.container = null;
    this.footer = null;
    this.observer = null;
    this.instanceKey = config.containerSelector;
    this.itemsPerLoad = config.itemsPerLoad || 3; // Load 3 items per trigger
    this.allContent = null; // Cache for all content from static JSON
    this.availableContent = []; // Filtered available content

    // Clean up any existing instance for this container
    if (activeInstances.has(this.instanceKey)) {
      activeInstances.get(this.instanceKey).destroy();
    }
    activeInstances.set(this.instanceKey, this);

    this.init();
  }

  init() {
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) {
      console.error(`[InfiniteScroll] Container not found: ${this.containerSelector}`);
      return;
    }

    // Find the footer element
    this.footer = document.querySelector('footer');
    if (!this.footer) {
      console.error('[InfiniteScroll] Footer element not found');
      return;
    }

    console.log(`[InfiniteScroll] Initialized for ${this.contentType}`, {
      container: this.containerSelector,
      initialIds: this.shownIds.size,
      footer: this.footer
    });

    // Set up Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('[InfiniteScroll] Observer triggered:', {
            isIntersecting: entry.isIntersecting,
            isLoading: this.isLoading,
            hasMoreContent: this.hasMoreContent
          });

          if (entry.isIntersecting && !this.isLoading && this.hasMoreContent) {
            console.log('[InfiniteScroll] Loading more content...');
            this.loadMoreContent();
          }
        });
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0
      }
    );

    this.observer.observe(this.footer);
    console.log('[InfiniteScroll] Observer attached to footer');
  }

  async loadMoreContent() {
    if (this.isLoading || !this.hasMoreContent) {
      console.log('[InfiniteScroll] Load blocked:', { isLoading: this.isLoading, hasMoreContent: this.hasMoreContent });
      return;
    }

    this.isLoading = true;
    this.showLoader();
    console.log('[InfiniteScroll] Starting to load content...');

    try {
      // Fetch all content if not cached (static JSON file)
      if (!this.allContent) {
        console.log('[InfiniteScroll] Fetching static JSON:', this.apiEndpoint);
        const response = await fetch(this.apiEndpoint);
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.status}`);
        }
        this.allContent = await response.json();
        console.log('[InfiniteScroll] Cached all content:', this.allContent.length, 'items');
      }

      // Filter out already shown content
      this.availableContent = this.allContent.filter(item => !this.shownIds.has(item.id));

      console.log('[InfiniteScroll] Available content:', this.availableContent.length);

      // Remove loader
      this.hideLoader();

      if (this.availableContent.length === 0) {
        // No more content available
        console.log('[InfiniteScroll] No more content available');
        this.hasMoreContent = false;
        this.showEndMessage();
        this.observer.disconnect();
        return;
      }

      // Select random items (up to itemsPerLoad)
      const itemsToLoad = Math.min(this.itemsPerLoad, this.availableContent.length);
      const selectedItems = [];

      for (let i = 0; i < itemsToLoad; i++) {
        const randomIndex = Math.floor(Math.random() * this.availableContent.length);
        const item = this.availableContent.splice(randomIndex, 1)[0];
        selectedItems.push(item);
        this.shownIds.add(item.id);
      }

      console.log('[InfiniteScroll] Selected items:', selectedItems.length);

      // Create and append cards with staggered animation
      selectedItems.forEach((data, index) => {
        const card = this.contentType === 'blog'
          ? this.createBlogCard(data)
          : this.createSkillCard(data);

        this.container.appendChild(card);

        // Staggered animation
        requestAnimationFrame(() => {
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }, index * 100);
        });
      });

      console.log('[InfiniteScroll] Cards appended, total shown:', this.shownIds.size);

      // After adding content, check if footer is still visible and load more if needed
      this.isLoading = false;
      console.log('[InfiniteScroll] Loading complete, checking if more content needed...');

      requestAnimationFrame(() => {
        this.checkAndLoadMore();
      });

    } catch (error) {
      console.error('[InfiniteScroll] Error loading content:', error);
      this.hideLoader();
      this.showErrorMessage();
      this.hasMoreContent = false;
      this.isLoading = false;
    }
  }

  checkAndLoadMore() {
    if (!this.footer || !this.hasMoreContent || this.isLoading) return;

    // Check if footer is currently in viewport (with margin)
    const rect = this.footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const margin = 200; // Same as rootMargin

    const isFooterVisible = rect.top <= (viewportHeight + margin);

    console.log('[InfiniteScroll] Footer check:', {
      footerTop: rect.top,
      viewportHeight: viewportHeight,
      isVisible: isFooterVisible
    });

    if (isFooterVisible) {
      console.log('[InfiniteScroll] Footer still visible, loading more content...');
      this.loadMoreContent();
    }
  }

  createBlogCard(data) {
    const article = document.createElement('article');
    article.className = 'blog-card hover-blink';
    article.style.opacity = '0';

    article.innerHTML = `
      <div class="card-decoration top-left"></div>
      <div class="card-decoration bottom-right"></div>

      <div class="card-content">
        <div class="meta-line">
          <span class="indicator blink-target">></span>
          <time datetime="${data.date}" class="card-date">[${data.formattedDate}]</time>
        </div>

        <h3 class="card-title">
          <a href="${data.url}">${data.title}</a>
        </h3>
        <p class="card-desc">${data.excerpt}</p>

        <div class="card-footer">
          <a href="${data.url}" class="read-more view-all">ACCÈS_DONNÉES__</a>
        </div>
      </div>
    `;

    return article;
  }

  createSkillCard(data) {
    const div = document.createElement('div');
    div.className = 'skill-card hover-blink';
    div.style.opacity = '0';

    div.innerHTML = `
      <div class="card-header">
        <span class="category">${data.category.toUpperCase()}</span>
      </div>
      <h3 class="skill-title">${data.title}</h3>
      <p class="skill-desc">${data.description}</p>
      <a href="${data.url}" class="access-btn">
        EXÉCUTER <span class="blink-target">_</span>
      </a>
    `;

    return div;
  }

  showLoader() {
    // Remove any existing loader
    this.hideLoader();

    const loader = document.createElement('div');
    loader.className = 'infinite-scroll-loader';
    loader.innerHTML = `
      <div class="loader-content">
        <span>[CHARGEMENT]</span>
        <span class="loader-dots">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </span>
      </div>
    `;

    this.container.parentElement.appendChild(loader);
  }

  hideLoader() {
    const loader = document.querySelector('.infinite-scroll-loader');
    if (loader) {
      loader.remove();
    }
  }

  showEndMessage() {
    // Check if message already exists
    const existing = this.container.parentElement.querySelector('.infinite-scroll-end');
    if (existing) return;

    const message = document.createElement('div');
    message.className = 'infinite-scroll-end';
    message.innerHTML = `
      <div class="end-content">
        <span class="end-bracket">[</span>
        <span class="end-text">FIN_DE_LA_BASE_DE_DONNÉES</span>
        <span class="end-bracket">]</span>
      </div>
    `;

    this.container.parentElement.appendChild(message);
  }

  showErrorMessage() {
    // Check if message already exists
    const existing = this.container.parentElement.querySelector('.infinite-scroll-error');
    if (existing) return;

    const message = document.createElement('div');
    message.className = 'infinite-scroll-error';
    message.innerHTML = `
      <div class="error-content">
        <span class="error-bracket">[</span>
        <span class="error-text">ERREUR_CONNEXION</span>
        <span class="error-bracket">]</span>
      </div>
    `;

    this.container.parentElement.appendChild(message);
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.hideLoader();

    // Remove from active instances
    if (activeInstances.get(this.instanceKey) === this) {
      activeInstances.delete(this.instanceKey);
    }
  }
}
