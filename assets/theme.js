/**
 * Sahq Theme JavaScript
 * Main theme functionality including mobile menu and cart drawer
 */

(function() {
  'use strict';

  // ============================================
  // UTILITIES
  // ============================================

  const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Format money based on Shopify settings
    formatMoney(cents, format) {
      if (typeof cents === 'string') cents = cents.replace('.', '');
      const value = parseInt(cents, 10) || 0;
      const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      const formatString = format || window.Shopify?.money_format || '{{amount}} EUR';

      function formatWithDelimiters(number, precision = 2, thousands = ' ', decimal = ',') {
        if (isNaN(number) || number == null) return 0;
        const fixedNumber = (number / 100.0).toFixed(precision);
        const parts = fixedNumber.split('.');
        const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
        const cents = parts[1] ? decimal + parts[1] : '';
        return dollars + cents;
      }

      let formattedValue = '';
      switch (formatString.match(placeholderRegex)?.[1]) {
        case 'amount':
          formattedValue = formatWithDelimiters(value, 2);
          break;
        case 'amount_no_decimals':
          formattedValue = formatWithDelimiters(value, 0);
          break;
        case 'amount_with_comma_separator':
          formattedValue = formatWithDelimiters(value, 2, '.', ',');
          break;
        case 'amount_no_decimals_with_comma_separator':
          formattedValue = formatWithDelimiters(value, 0, '.', ',');
          break;
        default:
          formattedValue = formatWithDelimiters(value, 2);
      }

      return formatString.replace(placeholderRegex, formattedValue);
    },

    // Trap focus within element (for accessibility)
    trapFocus(container, firstElement, lastElement) {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  };

  // ============================================
  // MOBILE MENU
  // ============================================

  class MobileMenu {
    constructor() {
      this.menuToggle = document.querySelector('[data-mobile-menu-toggle]');
      this.menu = document.querySelector('[data-mobile-menu]');
      this.overlay = document.querySelector('[data-mobile-menu-overlay]');
      this.closeBtn = document.querySelector('[data-mobile-menu-close]');
      this.isOpen = false;

      if (this.menuToggle && this.menu) {
        this.init();
      }
    }

    init() {
      this.menuToggle.addEventListener('click', () => this.toggle());

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Close menu on resize to desktop
      window.addEventListener('resize', Utils.debounce(() => {
        if (window.innerWidth >= 768 && this.isOpen) {
          this.close();
        }
      }, 100));
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      this.menu.classList.add('is-open');
      this.menuToggle.classList.add('is-active');
      this.menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      if (this.overlay) {
        this.overlay.classList.add('is-visible');
      }

      // Focus first menu item
      const firstLink = this.menu.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    close() {
      this.isOpen = false;
      this.menu.classList.remove('is-open');
      this.menuToggle.classList.remove('is-active');
      this.menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';

      if (this.overlay) {
        this.overlay.classList.remove('is-visible');
      }

      this.menuToggle.focus();
    }
  }

  // ============================================
  // CART DRAWER
  // ============================================

  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector('[data-cart-drawer]');
      this.overlay = document.querySelector('[data-cart-drawer-overlay]');
      this.closeBtn = document.querySelector('[data-cart-drawer-close]');
      this.cartTriggers = document.querySelectorAll('[data-cart-trigger]');
      this.cartCount = document.querySelectorAll('[data-cart-count]');
      this.cartTotal = document.querySelector('[data-cart-total]');
      this.cartItems = document.querySelector('[data-cart-items]');
      this.isOpen = false;
      this.isUpdating = false;

      if (this.drawer) {
        this.init();
      }
    }

    init() {
      // Open cart drawer on trigger click
      this.cartTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      });

      // Close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      // Overlay click
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Intercept add-to-cart forms
      document.addEventListener('submit', (e) => {
        const form = e.target;
        if (form.matches('form[action*="/cart/add"]')) {
          e.preventDefault();
          this.addToCart(form);
        }
      });

      // Handle quantity changes and remove in drawer
      if (this.drawer) {
        this.drawer.addEventListener('click', (e) => {
          const target = e.target.closest('[data-action]');
          if (!target) return;

          const action = target.dataset.action;
          const key = target.dataset.key;

          if (action === 'increase' || action === 'decrease') {
            e.preventDefault();
            this.updateQuantity(key, action);
          } else if (action === 'remove') {
            e.preventDefault();
            this.removeItem(key);
          }
        });

        // Handle input change
        this.drawer.addEventListener('change', (e) => {
          if (e.target.matches('[data-quantity-input]')) {
            const key = e.target.dataset.key;
            const quantity = parseInt(e.target.value, 10);
            this.updateItemQuantity(key, quantity);
          }
        });
      }
    }

    async open() {
      this.isOpen = true;
      await this.refreshCart();
      this.drawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      if (this.overlay) {
        this.overlay.classList.add('is-visible');
      }

      // Focus close button
      if (this.closeBtn) {
        this.closeBtn.focus();
      }
    }

    close() {
      this.isOpen = false;
      this.drawer.classList.remove('is-open');
      document.body.style.overflow = '';

      if (this.overlay) {
        this.overlay.classList.remove('is-visible');
      }
    }

    async addToCart(form) {
      if (this.isUpdating) return;
      this.isUpdating = true;

      const formData = new FormData(form);
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn?.textContent;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Ajout...';
      }

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) throw new Error('Add to cart failed');

        await this.refreshCart();
        this.open();

      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Erreur lors de l\'ajout au panier');
      } finally {
        this.isUpdating = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    }

    async updateQuantity(key, action) {
      const input = this.drawer.querySelector(`[data-quantity-input][data-key="${key}"]`);
      if (!input) return;

      let quantity = parseInt(input.value, 10);
      quantity = action === 'increase' ? quantity + 1 : Math.max(0, quantity - 1);

      await this.updateItemQuantity(key, quantity);
    }

    async updateItemQuantity(key, quantity) {
      if (this.isUpdating) return;
      this.isUpdating = true;

      this.drawer.classList.add('is-updating');

      try {
        const response = await fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: key, quantity })
        });

        if (!response.ok) throw new Error('Update failed');

        await this.refreshCart();

      } catch (error) {
        console.error('Error updating cart:', error);
      } finally {
        this.isUpdating = false;
        this.drawer.classList.remove('is-updating');
      }
    }

    async removeItem(key) {
      await this.updateItemQuantity(key, 0);
    }

    async refreshCart() {
      try {
        const response = await fetch('/cart.js');
        const cart = await response.json();

        this.updateCartCount(cart.item_count);
        this.updateCartTotal(cart.total_price);
        this.renderCartItems(cart);

      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }

    updateCartCount(count) {
      this.cartCount.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? '' : 'none';
      });
    }

    updateCartTotal(total) {
      if (this.cartTotal) {
        this.cartTotal.textContent = Utils.formatMoney(total);
      }
    }

    renderCartItems(cart) {
      if (!this.cartItems) return;

      if (cart.item_count === 0) {
        this.cartItems.innerHTML = `
          <div class="cart-drawer__empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p>Votre panier est vide</p>
            <a href="/collections/all" class="btn btn--primary">Continuer les achats</a>
            <a href="/collections/all" style="margin-top: 10px" class="btn btn--primary">Process checkout</a>

          </div>
        `;
        return;
      }

      this.cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-drawer__item" data-key="${item.key}">
          <div class="cart-drawer__item-image">
            ${item.image ? `<img src="${item.image.replace(/(\.[^.]+)$/, '_120x120$1')}" alt="${item.title}" loading="lazy">` : ''}
          </div>
          <div class="cart-drawer__item-details">
            <h4 class="cart-drawer__item-title">
              <a href="${item.url}">${item.product_title}</a>
            </h4>
            ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-drawer__item-variant">${item.variant_title}</p>` : ''}
            <p class="cart-drawer__item-price">${Utils.formatMoney(item.final_line_price)}</p>
          </div>
          <div class="cart-drawer__item-quantity">
            <button type="button" class="qty-btn" data-action="decrease" data-key="${item.key}" aria-label="Diminuer">−</button>
            <input type="number" value="${item.quantity}" min="0" data-quantity-input data-key="${item.key}" aria-label="Quantite">
            <button type="button" class="qty-btn" data-action="increase" data-key="${item.key}" aria-label="Augmenter">+</button>
          </div>
          <button type="button" class="cart-drawer__item-remove" data-action="remove" data-key="${item.key}" aria-label="Supprimer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('');
    }
  }

  // ============================================
  // SEARCH
  // ============================================

  class SearchOverlay {
    constructor() {
      this.trigger = document.querySelector('[data-search-trigger]');
      this.overlay = document.querySelector('[data-search-overlay]');
      this.input = document.querySelector('[data-search-input]');
      this.results = document.querySelector('[data-search-results]');
      this.closeBtn = document.querySelector('[data-search-close]');
      this.isOpen = false;

      if (this.trigger && this.overlay) {
        this.init();
      }
    }

    init() {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.overlay?.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      if (this.input) {
        this.input.addEventListener('input', Utils.debounce(() => this.search(), 300));
      }
    }

    open() {
      this.isOpen = true;
      this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      if (this.input) this.input.focus();
    }

    close() {
      this.isOpen = false;
      this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      if (this.input) this.input.value = '';
      if (this.results) this.results.innerHTML = '';
    }

    async search() {
      const query = this.input?.value.trim();
      if (!query || query.length < 2) {
        if (this.results) this.results.innerHTML = '';
        return;
      }

      try {
        const response = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product,collection,page`);
        const data = await response.json();
        this.renderResults(data);
      } catch (error) {
        console.error('Search error:', error);
      }
    }

    renderResults(data) {
      if (!this.results) return;

      const products = data.resources?.results?.products || [];

      if (products.length === 0) {
        this.results.innerHTML = '<p class="search-no-results">Aucun resultat</p>';
        return;
      }

      this.results.innerHTML = products.slice(0, 6).map(product => `
        <a href="${product.url}" class="search-result-item">
          ${product.image ? `<img src="${product.image.replace(/(\.[^.]+)$/, '_80x80$1')}" alt="${product.title}">` : ''}
          <div>
            <h4>${product.title}</h4>
            <p>${product.price}</p>
          </div>
        </a>
      `).join('');
    }
  }

  // ============================================
  // INITIALIZE
  // ============================================

  function init() {
    new MobileMenu();
    new CartDrawer();
    new SearchOverlay();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities globally for other scripts
  window.SahqTheme = {
    Utils,
    MobileMenu,
    CartDrawer,
    SearchOverlay
  };

})();
