document.addEventListener('DOMContentLoaded', () => {
    // --- 1. AJOUT AU PANIER (Depuis produits.html et index.html) ---
    const addButtons = document.querySelectorAll('.btn-add');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Animation du bouton
            const originalText = btn.innerHTML;
            btn.innerHTML = 'AJOUTÉ <i class="fa-solid fa-check"></i>';
            btn.style.backgroundColor = 'var(--success)';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 1500);

            // Récupérer les infos du produit depuis le DOM
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
        
        // Petite notification flottante
        showNotification(product.title + " a été ajouté au panier !");
    }

    // --- 2. NOTIFICATION ---
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

    // --- 3. MISE À JOUR DU COMPTEUR (Dans l'en-tête) ---
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

    // --- 4. AFFICHAGE DU PANIER (Sur commander.html) ---
    if (window.location.pathname.includes('commander.html') || document.title.includes('Commander')) {
        renderCartPage();
    }

    function renderCartPage() {
        const cartList = document.querySelector('.cart-list');
        const summaryBox = document.querySelector('.summary-box');
        if (!cartList || !summaryBox) return;

        let cart = JSON.parse(localStorage.getItem('babi_cart')) || [];
        
        if (cart.length === 0) {
            cartList.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fa-solid fa-cart-shopping" style="font-size: 3rem; color: #ccc; margin-bottom: 20px;"></i><br><h3>Votre panier est vide</h3><p>Retournez à la boutique pour ajouter des produits.</p><br><a href="produits.html" class="btn btn-primary">Voir les produits</a></div>';
            summaryBox.style.display = 'none';
            return;
        }

        let html = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
            <div class="cart-item" data-index="${index}">
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

        cartList.innerHTML = html;
        summaryBox.style.display = 'block';

        // Update Totals
        const delivery = 500;
        const discount = 0; // 0 for now
        const total = subtotal + delivery - discount;

        summaryBox.innerHTML = `
            <h2><i class="fa-solid fa-bag-shopping"></i> Récapitulatif de la commande</h2>
            <div class="summary-line">
                <span>Sous-total (${cart.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                <span>${subtotal} FCFA</span>
            </div>
            <div class="summary-line">
                <span>Frais de livraison</span>
                <span>${delivery} FCFA</span>
            </div>
            <div class="summary-total">
                <span>TOTAL</span>
                <span class="total-amount">${total} FCFA</span>
            </div>
            
            <div class="payment-methods" style="margin-top: 20px;">
                <h4>Mode de paiement</h4>
                <label class="custom-radio">
                    <input type="radio" name="payment" checked>
                    <span class="radiomark"></span>
                    À la livraison (Espèces)
                </label>
                <label class="custom-radio">
                    <input type="radio" name="payment">
                    <span class="radiomark"></span>
                    Mobile Money
                </label>
            </div>

            <button class="btn btn-primary w-100" id="btn-validate-order" style="margin-top:20px;">VALIDER LA COMMANDE</button>
            <p class="secure-text" style="text-align:center; margin-top:10px; font-size:0.9em; color:#666;"><i class="fa-solid fa-lock"></i> Paiement 100% sécurisé</p>
        `;

        // Add event listeners to + / - / delete buttons
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

        const btnValidate = document.getElementById('btn-validate-order');
        if(btnValidate) {
            btnValidate.addEventListener('click', () => {
                const totalText = document.querySelector('.total-amount').innerText;
                alert("Félicitations ! Votre commande de " + totalText + " a bien été enregistrée. Nous vous contacterons bientôt.");
                localStorage.removeItem('babi_cart');
                window.location.href = 'index.html';
            });
        }
    }
});
