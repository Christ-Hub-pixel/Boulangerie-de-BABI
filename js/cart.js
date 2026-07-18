document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const originalText = btn.innerHTML;
            btn.innerHTML = 'AJOUTÉ <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = 'var(--success)';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1500);

            const card = e.target.closest('.product-card');
            if (card) {
                const title = card.querySelector('h4').innerText;
                const priceText = card.querySelector('.price').innerText;
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                const img = card.querySelector('img').src;
                
                addToCart({ title, price, img, quantity: 1 });
            }
        });
    });

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('babi_cart')) || [];
        const existing = cart.find(p => p.title === product.title);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(product);
        }
        localStorage.setItem('babi_cart', JSON.stringify(cart));
        updateCartCount();
        showNotification(product.title + " a été ajouté au panier !");
    }

    function showNotification(msg) {
        let notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '20px';
        notif.style.right = '20px';
        notif.style.backgroundColor = 'var(--primary)';
        notif.style.color = 'var(--dark)';
        notif.style.padding = '15px 25px';
        notif.style.borderRadius = '5px';
        notif.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notif.style.zIndex = '9999';
        notif.style.fontWeight = 'bold';
        notif.innerText = msg;
        document.body.appendChild(notif);

        setTimeout(() => {
            notif.style.opacity = '0';
            notif.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }

    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('babi_cart')) || [];
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        const countBadges = document.querySelectorAll('.cart-count');
        countBadges.forEach(badge => {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    updateCartCount();

    if (window.location.pathname.includes('checkout.html') || document.title.includes('Checkout')) {
        renderCartPage();

        const deliveryRadios = document.querySelectorAll('input[name="delivery_method"]');
        deliveryRadios.forEach((radio, idx) => {
            radio.addEventListener('change', (e) => {
                document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
                e.target.closest('.method-card').classList.add('active');
                renderCartPage();
            });
        });

        const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
                e.target.closest('.payment-card').classList.add('active');
            });
        });
    }

    function renderCartPage() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        let cart = JSON.parse(localStorage.getItem('babi_cart')) || [];
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div style="text-align:center; padding: 20px;"><h4>Votre panier est vide</h4><p>Ajoutez des produits pour continuer.</p></div>';
            updateSummary(0, 0, 0);
            return;
        }

        let html = '';
        let subtotal = 0;
        let totalItems = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;
            html += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.title}">
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <span>${item.price} FCFA</span>
                </div>
                <div class="item-qty">
                    <button class="qty-btn minus" data-index="${index}"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="item-total">${itemTotal} FCFA</div>
                <button class="item-delete" data-index="${index}"><i class="fa-regular fa-trash-can"></i></button>
            </div>`;
        });

        cartItemsContainer.innerHTML = html;

        let deliveryCost = 0;
        const activeDelivery = document.querySelector('input[name="delivery_method"]:checked');
        if (activeDelivery) {
            const title = activeDelivery.closest('.method-card').querySelector('h4').innerText;
            if (title.includes('domicile')) deliveryCost = 1000;
        }

        updateSummary(totalItems, subtotal, deliveryCost);

        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnEl = e.target.closest('.qty-btn');
                const index = btnEl.getAttribute('data-index');
                if(btnEl.classList.contains('plus')) {
                    cart[index].quantity += 1;
                } else if(btnEl.classList.contains('minus')) {
                    cart[index].quantity -= 1;
                    if(cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
                localStorage.setItem('babi_cart', JSON.stringify(cart));
                renderCartPage();
                updateCartCount();
            });
        });

        document.querySelectorAll('.item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const btnEl = e.target.closest('.item-delete');
                const index = btnEl.getAttribute('data-index');
                cart.splice(index, 1);
                localStorage.setItem('babi_cart', JSON.stringify(cart));
                renderCartPage();
                updateCartCount();
            });
        });
    }
    
    function updateSummary(totalItems, subtotal, deliveryCost) {
        const summaryBox = document.querySelector('.summary-box');
        if(!summaryBox) return;
        
        let discount = 250; // Juste pour l'affichage de la fidélité
        if (subtotal === 0) discount = 0;
        const total = subtotal + deliveryCost - discount;

        summaryBox.innerHTML = `
            <h2><i class="fa-solid fa-bag-shopping"></i> Récapitulatif de la commande</h2>
            
            <div class="summary-line">
                <span>Sous-total (${totalItems} articles)</span>
                <span>${subtotal} FCFA</span>
            </div>
            <div class="summary-line">
                <span>Frais de livraison</span>
                <span>${deliveryCost === 0 ? 'Gratuit' : deliveryCost + ' FCFA'}</span>
            </div>
            <div class="summary-line discount">
                <span>Réduction (points fidélité)</span>
                <span>- ${discount} FCFA</span>
            </div>
            
            <div class="summary-total">
                <span>Total à payer</span>
                <span class="total-price">${total > 0 ? total : 0} FCFA</span>
            </div>

            <div class="points-earned">
                <i class="fa-brands fa-pagelines"></i>
                <div>
                    <strong>Vous gagnez 27 points fidélité</strong>
                    <p>Cette commande vous rapporte 27 points.</p>
                </div>
            </div>
        `;
    }

    const btnValidate = document.querySelector('.btn-primary.w-100');
    if(btnValidate && window.location.pathname.includes('checkout.html')) {
        // Find it below the payment section, actually in the design it's inside form or somewhere.
        // Let's bind it correctly if it exists.
    }
    // Wait, in commander.html the validate button is at the bottom: 
    // <button class="btn btn-primary btn-large w-100 mt-4">CONFIRMER ET PAYER <i class="fa-solid fa-check"></i></button>
    // Let's attach an event listener to it globally in checkout.html
    document.addEventListener('click', (e) => {
        if(e.target.closest('.btn-large.w-100') && e.target.innerText.includes('CONFIRMER')) {
            e.preventDefault();
            const totalText = document.querySelector('.total-price') ? document.querySelector('.total-price').innerText : '0 FCFA';
            alert(`Commande de ${totalText} validée avec succès !`);
            localStorage.removeItem('babi_cart');
            window.location.href = 'index.html';
        }
    });

});
