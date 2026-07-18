
// --- GLOBAL WORKFLOW ACTIONS ---

document.addEventListener('DOMContentLoaded', () => {
    
    // Add toast container to body
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    // Function to show toast
    window.showAddToCartToast = function(productName, price) {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fa-solid fa-circle-check"></i>
            </div>
            <div class="toast-content">
                <h6>Article ajouté avec succès</h6>
                <p>${productName} (${price}) est dans votre panier.</p>
            </div>
        `;
        toastContainer.appendChild(toast);
        
        // Trigger reflow
        toast.offsetHeight; 
        
        // Show
        toast.classList.add('show');
        
        // Update Cart Badges
        document.querySelectorAll('.badge.bg-danger').forEach(badge => {
            let current = parseInt(badge.innerText) || 0;
            badge.innerText = current + 1;
            // trigger pop animation
            badge.classList.remove('badge-pop');
            void badge.offsetWidth; // force reflow
            badge.classList.add('badge-pop');
        });

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 3000);
    };

    // Attach event listeners to all Add to cart buttons
    const addButtons = document.querySelectorAll('.btn-add-to-cart, .btn-primary:not(header .btn-primary):not(nav .btn-primary):not(.btn-pulse)');
    
    addButtons.forEach(btn => {
        // Only target buttons that look like add to cart (Ajouter au panier)
        if(btn.innerText.toLowerCase().includes('ajouter') || btn.innerHTML.includes('fa-cart-plus')) {
            btn.classList.add('btn-add-to-cart'); // Ensure class is present
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Find nearest product title and price
                let card = this.closest('.card') || this.closest('.row');
                let productName = card ? (card.querySelector('.card-title, h4, h5, h6')?.innerText || 'Article') : 'Article';
                let price = card ? (card.querySelector('.text-primary, .fs-5')?.innerText || '') : '';
                showAddToCartToast(productName, price);
            });
        }
    });

    // Make Search Button trigger a subtle animation
    const searchBtns = document.querySelectorAll('nav .btn-primary');
    searchBtns.forEach(btn => {
        if(btn.innerText.toLowerCase().includes('chercher')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let input = btn.previousElementSibling;
                if(input && input.value) {
                    window.location.href = `produits.html?search=${encodeURIComponent(input.value)}`;
                } else {
                    input.focus();
                    input.style.transition = "all 0.2s";
                    input.style.transform = "scale(1.02)";
                    setTimeout(()=> { input.style.transform = "scale(1)"; }, 200);
                }
            });
        }
    });
    
    // Animate elements with .slide-up on scroll
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
