
// ================================================================
// BABI CART SYSTEM — localStorage full product storage
// ================================================================

const CART_KEY = 'babi_cart_items'; // stores array of {id, name, price, image, qty}

// ---- CART DATA LAYER ----

function getCartItems() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCartItems(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function getCartCount() {
    return getCartItems().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
    return getCartItems().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function addToCart(product) {
    // product = { id, name, price, image }
    let items = getCartItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        items.push({ ...product, qty: 1 });
    }
    saveCartItems(items);
}

function removeFromCart(productId) {
    let items = getCartItems().filter(i => i.id !== productId);
    saveCartItems(items);
}

function updateQtyInCart(productId, newQty) {
    let items = getCartItems();
    const item = items.find(i => i.id === productId);
    if (item) {
        if (newQty <= 0) {
            items = items.filter(i => i.id !== productId);
        } else {
            item.qty = newQty;
        }
    }
    saveCartItems(items);
}

// ---- UI LAYER ----

function updateAllBadges() {
    const count = getCartCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
        badge.innerText = count;
        badge.style.display = count <= 0 ? 'none' : '';
        // pop animation
        badge.classList.remove('badge-pop');
        void badge.offsetWidth;
        badge.classList.add('badge-pop');
    });

    // Also update dropdown content
    renderCartDropdown();
}

function renderCartDropdown() {
    const items = getCartItems();
    const body = document.getElementById('cartDropdownBody');
    const footer = document.getElementById('cartDropdownFooter');
    const emptyMsg = document.getElementById('cartEmptyMsg');
    const totalEl = document.getElementById('dropdownTotal');

    if (!body) return;

    if (items.length === 0) {
        if (emptyMsg) emptyMsg.style.display = '';
        if (footer) footer.style.display = 'none';
        // Clear any product rows
        body.querySelectorAll('.dropdown-item-row').forEach(el => el.remove());
        return;
    }

    // Hide empty message
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (footer) footer.style.display = '';

    // Remove old rows
    body.querySelectorAll('.dropdown-item-row').forEach(el => el.remove());

    // Render up to 3 items
    items.slice(0, 3).forEach(item => {
        const row = document.createElement('div');
        row.className = 'dropdown-item-row d-flex align-items-center gap-2 py-2 border-bottom';
        row.innerHTML = `
            <img src="${item.image}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #eee;" alt="${item.name}" onerror="this.src='assets/product_baguette.png'">
            <div class="flex-grow-1 lh-sm">
                <div style="font-size:0.82rem;font-weight:600;" class="text-truncate" style="max-width:160px;">${item.name}</div>
                <div style="font-size:0.75rem;" class="text-muted">Qté: ${item.qty}</div>
            </div>
            <div style="font-size:0.85rem;font-weight:700;white-space:nowrap;" class="text-dark">${(item.price * item.qty).toLocaleString()} FCFA</div>
        `;
        body.appendChild(row);
    });

    if (items.length > 3) {
        const more = document.createElement('div');
        more.className = 'dropdown-item-row text-center text-muted py-1';
        more.style.fontSize = '0.75rem';
        more.innerText = `+ ${items.length - 3} autre(s) article(s)`;
        body.appendChild(more);
    }

    if (totalEl) totalEl.innerText = getCartTotal().toLocaleString() + ' FCFA';
}

// ---- TOAST ----
function showAddToCartToast(product) {
    const toastContainer = document.querySelector('.toast-container') || (() => {
        const tc = document.createElement('div');
        tc.className = 'toast-container';
        document.body.appendChild(tc);
        return tc;
    })();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `
        <img src="${product.image}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;margin-right:4px;" onerror="this.style.display='none'">
        <div class="toast-content">
            <h6 style="font-size:0.85rem;">✅ Ajouté au panier !</h6>
            <p style="font-size:0.77rem;margin:0;">${product.name} — ${product.price.toLocaleString()} FCFA</p>
        </div>
        <a href="cart.html" class="btn btn-sm btn-primary text-dark fw-bold ms-2" style="font-size:0.7rem;white-space:nowrap;">Voir →</a>
    `;
    toastContainer.appendChild(toast);
    toast.offsetHeight;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ---- WISHLIST TOGGLE ----
function setupWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            if (this.classList.contains('active')) {
                icon.className = 'fa-solid fa-heart';
                this.style.color = '#e74c3c';
            } else {
                icon.className = 'fa-regular fa-heart';
                this.style.color = '';
            }
        });
    });
}

// ---- SEARCH ----
function setupSearch() {
    document.querySelectorAll('nav .btn-primary, header .btn-primary').forEach(btn => {
        if (btn.innerText.toLowerCase().includes('chercher')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const input = btn.previousElementSibling;
                if (input && input.value.trim()) {
                    window.location.href = `produits.html?search=${encodeURIComponent(input.value.trim())}`;
                } else {
                    if (input) {
                        input.focus();
                        input.style.transition = 'all 0.2s';
                        input.style.transform = 'scale(1.03)';
                        setTimeout(() => { input.style.transform = 'scale(1)'; }, 200);
                    }
                }
            });
        }
    });
}

// ---- SCROLL ANIMATION ----
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(el => {
        el.classList.add('slide-up');
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

// ---- ADD TO CART BUTTONS ----
function setupAddToCartButtons() {
    document.querySelectorAll('button, a.btn').forEach(btn => {
        const text = btn.innerText.toLowerCase();
        const html = btn.innerHTML;
        if (text.includes('ajouter') || html.includes('fa-cart-plus')) {
            if (btn.dataset.cartSetup) return; // avoid duplicates
            btn.dataset.cartSetup = 'true';
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Find enclosing product card
                const card = this.closest('.card, .cart-item, [data-product]') || this.closest('[class*="col"]');

                // Extract data
                let name = 'Article';
                let price = 0;
                let image = 'assets/product_baguette.png';

                if (card) {
                    const nameEl = card.querySelector('.card-title, h5, h6');
                    if (nameEl) name = nameEl.innerText.trim();

                    const priceEl = card.querySelector('[data-price], .item-price');
                    if (priceEl && priceEl.dataset.price) {
                        price = parseInt(priceEl.dataset.price);
                    } else {
                        // Try to parse from text like "850 FCFA"
                        const priceText = card.querySelector('.fw-bold.text-dark, .fs-5.fw-bold, .fs-4.fw-bold');
                        if (priceText) {
                            const match = priceText.innerText.match(/[\d\s]+/);
                            if (match) price = parseInt(match[0].replace(/\s/g, '')) || 0;
                        }
                    }

                    const imgEl = card.querySelector('img');
                    if (imgEl) image = imgEl.src || imgEl.getAttribute('src') || image;
                }

                // Normalize the image path (strip origin for localStorage)
                try {
                    const url = new URL(image);
                    image = url.pathname.replace(/^\//, ''); // relative path
                } catch(err) {
                    // already relative
                }

                const product = {
                    id: name.toLowerCase().replace(/\s+/g, '_'),
                    name,
                    price,
                    image
                };

                addToCart(product);
                updateAllBadges();
                showAddToCartToast(product);
            });
        }
    });
}

// ================================================================
// INIT on DOM ready
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize badge and dropdown from stored cart
    updateAllBadges();

    setupAddToCartButtons();
    setupWishlist();
    setupSearch();
    setupScrollAnimations();

    // Toast container
    if (!document.querySelector('.toast-container')) {
        const tc = document.createElement('div');
        tc.className = 'toast-container';
        document.body.appendChild(tc);
    }
});
