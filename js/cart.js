document.addEventListener('DOMContentLoaded', () => {
    // --- 1. AJOUT AU PANIER (Depuis produits.html et index.html) ---
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

    // --- 4. AFFICHAGE DU PANIER (Sur checkout.html) ---
    if (window.location.pathname.includes('checkout.html') || document.title.includes('Checkout')) {
        renderCartPage();

        // Listen for delivery method changes
        const deliveryRadios = document.querySelectorAll('input[name="delivery_type"]');
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                // Update active class
                document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
                e.target.closest('.method-card').classList.add('active');
                renderCartPage(); // Re-render to update totals
            });
        });

        // Listen for payment method changes
        const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                // Update active class
                document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('active'));
                e.target.closest('.payment-card').classList.add('active');
            });
        });
    }

    function renderCartPage() {
        const cartList = document.querySelector('.cart-list');
        if (!cartList) return;

        let cart = JSON.parse(localStorage.getItem('babi_cart')) || [];
        
        if (cart.length === 0) {
            cartList.innerHTML = '<div style="text-align:center; padding: 20px;"><i class="fa-solid fa-cart-shopping" style="font-size: 2rem; color: #ccc; margin-bottom: 10px;"></i><br><h4>Votre panier est vide</h4><p style="font-size:0.9rem;">Ajoutez des produits pour continuer.</p></div>';
            document.getElementById('summary-items-count').innerText = "Sous-total (0 articles)";
            document.getElementById('summary-subtotal').innerText = "0 FCFA";
            document.getElementById('summary-delivery').innerText = "0 FCFA";
            document.getElementById('summary-total').innerText = "0 FCFA";
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
                <div class="item-details" style="flex: 1;">
                    <h4 style="margin: 0; font-size: 1rem;">${item.title}</h4>
                    <span style="color: #666; font-size: 0.9rem;">${item.price} FCFA</span>
                </div>
                <div class="item-qty" style="display: flex; gap: 5px; align-items: center; background: #f9f9f9; padding: 2px 8px; border-radius: 15px;">
                    <button class="qty-btn minus" data-index="${index}" style="border:none; background:none; color:var(--primary); cursor:pointer;"><i class="fa-solid fa-minus"></i></button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn plus" data-index="${index}" style="border:none; background:none; color:var(--primary); cursor:pointer;"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="item-total" style="font-weight:bold; margin-left:10px;">${itemTotal} FCFA</div>
                <button class="item-delete" data-index="${index}" style="background:none; border:none; color:var(--danger); cursor:pointer; margin-left:10px;"><i class="fa-regular fa-trash-can"></i></button>
            </div>`;
        });

        cartList.innerHTML = html;

        // Delivery Cost
        let deliveryCost = 1000;
        const activeDelivery = document.querySelector('input[name="delivery_type"]:checked');
        if (activeDelivery) {
            const card = activeDelivery.closest('.method-card');
            deliveryCost = parseInt(card.getAttribute('data-cost') || "1000");
        }

        const total = subtotal + deliveryCost;

        // Update DOM
        document.getElementById('summary-items-count').innerText = `Sous-total (${cart.reduce((s, i) => s + i.quantity, 0)} articles)`;
        document.getElementById('summary-subtotal').innerText = `${subtotal} FCFA`;
        document.getElementById('summary-delivery').innerText = `${deliveryCost === 0 ? 'Gratuit' : deliveryCost + ' FCFA'}`;
        document.getElementById('summary-total').innerText = `${total} FCFA`;

        // Add event listeners to buttons
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
    
    const btnValidate = document.getElementById('btn-validate-checkout');
    if(btnValidate) {
        btnValidate.addEventListener('click', () => {
            const totalText = document.getElementById('summary-total').innerText;
            const activePayment = document.querySelector('input[name="payment_method"]:checked');
            let paymentName = "votre moyen de paiement";
            if(activePayment) {
                if(activePayment.value === "wave") paymentName = "Wave";
                if(activePayment.value === "orange") paymentName = "Orange Money";
                if(activePayment.value === "mtn") paymentName = "MTN Money";
                if(activePayment.value === "cash") paymentName = "Paiement à la livraison";
            }
            alert(`Commande de ${totalText} via ${paymentName} validée avec succès ! Merci de votre confiance.`);
            localStorage.removeItem('babi_cart');
            window.location.href = 'index.html';
        });
    }
});
