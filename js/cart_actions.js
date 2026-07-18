
// --- GLOBAL CART ACTIONS with localStorage persistence ---

// Cart count key in localStorage
const CART_COUNT_KEY = 'babi_cart_count';

function getCartCount() {
    return parseInt(localStorage.getItem(CART_COUNT_KEY)) || 0;
}

function setCartCount(count) {
    localStorage.setItem(CART_COUNT_KEY, count);
}

function updateAllBadges(count) {
    document.querySelectorAll('.badge.bg-danger').forEach(badge => {
        badge.innerText = count;
        // Show or hide badge depending on count
        if (count <= 0) {
            badge.style.display = 'none';
        } else {
            badge.style.display = '';
            badge.classList.remove('badge-pop');
            void badge.offsetWidth; // force reflow for animation restart
            badge.classList.add('badge-pop');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // Initialize badge from localStorage
    updateAllBadges(getCartCount());

    // Add toast container to body
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    // Function to show toast and update cart
    window.showAddToCartToast = function(productName, price) {
        // Increment cart count
        let newCount = getCartCount() + 1;
        setCartCount(newCount);
        updateAllBadges(newCount);

        // Create toast
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="toast-content">
                <h6>Article ajouté avec succès !</h6>
                <p>${productName}${price ? ' (' + price + ')' : ''} est dans votre panier.</p>
            </div>
        `;
        toastContainer.appendChild(toast);

        // Trigger reflow then show
        toast.offsetHeight;
        toast.classList.add('show');

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    };

    // Attach event listeners to "Ajouter au panier" buttons
    document.querySelectorAll('button, a.btn').forEach(btn => {
        if (btn.innerText.toLowerCase().includes('ajouter') || btn.innerHTML.includes('fa-cart-plus')) {
            btn.classList.add('btn-add-to-cart');
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                let card = this.closest('.card') || this.closest('[class*="col"]');
                let productName = card ? (card.querySelector('.card-title, h5, h6')?.innerText?.trim() || 'Article') : 'Article';
                let priceEl = card ? card.querySelector('.text-primary.fw-bold, .fs-5.fw-bold, .fs-4.fw-bold') : null;
                let price = priceEl ? priceEl.innerText.trim() : '';
                showAddToCartToast(productName, price);
            });
        }
    });

    // Search button — redirect to products page with search query
    document.querySelectorAll('nav .btn-primary, header .btn-primary').forEach(btn => {
        if (btn.innerText.toLowerCase().includes('chercher')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let input = btn.previousElementSibling;
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

    // Scroll-triggered slide-up for cards
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
});

