
// ================================================================
// BABI CART SYSTEM — localStorage full product storage
// ================================================================
const CART_KEY = 'babi_cart_items';

function getCartItems() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}
function saveCartItems(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function getCartCount() {
    return getCartItems().reduce((s, i) => s + i.qty, 0);
}
function getCartTotal() {
    return getCartItems().reduce((s, i) => s + i.price * i.qty, 0);
}
function addToCart(product) {
    let items = getCartItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) { existing.qty++; }
    else { items.push({...product, qty: 1}); }
    saveCartItems(items);
}
function removeFromCart(productId) {
    saveCartItems(getCartItems().filter(i => i.id !== productId));
}
function updateQtyInCart(productId, newQty) {
    let items = getCartItems();
    const item = items.find(i => i.id === productId);
    if (item) {
        if (newQty <= 0) items = items.filter(i => i.id !== productId);
        else item.qty = newQty;
    }
    saveCartItems(items);
}

// ---- Badge & Dropdown ----
function updateAllBadges() {
    const count = getCartCount();
    // Support both old and new badge selectors
    document.querySelectorAll('.cart-badge, .badge.bg-danger').forEach(badge => {
        badge.innerText = count;
        badge.style.display = count <= 0 ? 'none' : '';
        if (count > 0) {
            badge.classList.remove('badge-pop');
            void badge.offsetWidth;
            badge.classList.add('badge-pop');
        }
    });
    renderCartDropdown();
}

function renderCartDropdown() {
    const items = getCartItems();
    const body = document.getElementById('cartDropdownBody');
    const footer = document.getElementById('cartDropdownFooter');
    const emptyMsg = document.getElementById('cartEmptyMsg');
    const totalEl = document.getElementById('dropdownTotal');
    if (!body) return;

    body.querySelectorAll('.dropdown-item-row').forEach(el => el.remove());

    if (items.length === 0) {
        if (emptyMsg) emptyMsg.style.display = '';
        if (footer) footer.style.display = 'none';
        return;
    }
    if (emptyMsg) emptyMsg.style.display = 'none';
    if (footer) footer.style.display = '';

    items.slice(0, 3).forEach(item => {
        const row = document.createElement('div');
        row.className = 'dropdown-item-row d-flex align-items-center gap-2 py-2 border-bottom';
        row.innerHTML = `
            <img src="${item.image}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;border:1px solid #eee;" onerror="this.src='assets/product_baguette.png'" alt="${item.name}">
            <div class="flex-grow-1 lh-sm">
                <div style="font-size:0.82rem;font-weight:600;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${item.name}</div>
                <div style="font-size:0.75rem;color:#666;">Qté: ${item.qty}</div>
            </div>
            <div style="font-size:0.85rem;font-weight:700;white-space:nowrap;">${(item.price * item.qty).toLocaleString()} FCFA</div>
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

// ---- Toast ----
function showAddToCartToast(product) {
    let tc = document.querySelector('.toast-container');
    if (!tc) {
        tc = document.createElement('div');
        tc.className = 'toast-container';
        document.body.appendChild(tc);
    }
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.cssText = 'display:flex;align-items:center;gap:10px;';
    toast.innerHTML = `
        <img src="${product.image}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0;" onerror="this.style.display='none'" alt="">
        <div style="flex:1;">
            <div style="font-size:0.85rem;font-weight:700;">✅ Ajouté au panier !</div>
            <div style="font-size:0.77rem;color:#555;">${product.name} — ${product.price.toLocaleString()} FCFA</div>
        </div>
        <a href="cart.html" class="btn btn-sm btn-primary text-dark fw-bold" style="font-size:0.72rem;white-space:nowrap;flex-shrink:0;">Voir →</a>
    `;
    tc.appendChild(toast);
    toast.offsetHeight;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ---- Setup Add-to-Cart buttons ----
function setupAddToCartButtons() {
    document.querySelectorAll('button, a.btn').forEach(btn => {
        if (btn.dataset.cartSetup) return;
        btn.dataset.cartSetup = 'true';

        const text = btn.innerText.trim().toLowerCase();
        const hasIcon = btn.innerHTML.includes('fa-cart-plus');

        if (!text.includes('ajouter') && !hasIcon) return;

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            // Priority 1: use data attributes on the button itself
            let name = this.dataset.name;
            let price = parseInt(this.dataset.price);
            let image = this.dataset.image || 'assets/product_baguette.png';

            // Priority 2: read from parent card if no data attributes
            if (!name || !price) {
                const card = this.closest('.card, [class*="col"]');
                if (card) {
                    if (!name) {
                        const nameEl = card.querySelector('.card-title, h5, h6');
                        name = nameEl ? nameEl.innerText.trim() : 'Article';
                    }
                    if (!price) {
                        const priceEl = card.querySelector('.fw-bold.text-dark, .fs-5.fw-bold, .fs-4.fw-bold, [data-price]');
                        if (priceEl && priceEl.dataset.price) {
                            price = parseInt(priceEl.dataset.price);
                        } else if (priceEl) {
                            const m = priceEl.innerText.match(/[\d\s]+/);
                            price = m ? parseInt(m[0].replace(/\s/g, '')) : 0;
                        }
                    }
                    if (!image || image === 'assets/product_baguette.png') {
                        const imgEl = card.querySelector('img');
                        if (imgEl) {
                            const src = imgEl.getAttribute('src') || '';
                            image = src.startsWith('http') ? (new URL(src)).pathname.replace(/^\//, '') : src;
                        }
                    }
                }
            }

            name = name || 'Article';
            price = price || 0;

            const product = {
                id: name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
                name, price, image
            };

            addToCart(product);
            updateAllBadges();
            showAddToCartToast(product);
        });
    });
}

// ---- Wishlist ----
function setupWishlist() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        if (btn.dataset.wishlistSetup) return;
        btn.dataset.wishlistSetup = 'true';
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); e.preventDefault();
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

// ---- Search ----
function setupSearch() {
    document.querySelectorAll('nav .btn-primary, header .btn-primary').forEach(btn => {
        if (btn.dataset.searchSetup) return;
        if (!btn.innerText.toLowerCase().includes('chercher')) return;
        btn.dataset.searchSetup = 'true';
        btn.addEventListener('click', e => {
            e.preventDefault();
            const input = btn.previousElementSibling;
            if (input && input.value.trim()) {
                window.location.href = `produits.html?search=${encodeURIComponent(input.value.trim())}`;
            } else if (input) {
                input.focus();
                input.style.transition = 'all 0.2s';
                input.style.transform = 'scale(1.03)';
                setTimeout(() => { input.style.transform = 'scale(1)'; }, 200);
            }
        });
    });
}

// ---- Scroll Animations ----
function setupScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(el => {
        if (!el.classList.contains('slide-up')) {
            el.classList.add('slide-up');
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        }
    });
}

// ================================================================
// INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.toast-container')) {
        const tc = document.createElement('div');
        tc.className = 'toast-container';
        document.body.appendChild(tc);
    }
    updateAllBadges();
    setupAddToCartButtons();
    setupWishlist();
    setupSearch();
    setupScrollAnimations();
});
