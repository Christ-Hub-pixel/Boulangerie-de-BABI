// ================================================================
// BABI CHECKOUT & ORDER SUBMISSION CONTROLLER
// ================================================================

document.addEventListener('DOMContentLoaded', () => {
    initCheckoutPage();
});

function initCheckoutPage() {
    const items = typeof getCartItems === 'function' ? getCartItems() : JSON.parse(localStorage.getItem('babi_cart') || '[]');

    if (!items || items.length === 0) {
        alert('Votre panier est vide. Vous allez être redirigé vers le catalogue.');
        window.location.href = 'produits.html';
        return;
    }

    renderCheckoutSummary();
    setupCheckoutFormEvents();
}

function getSelectedDeliveryCost() {
    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    if (deliveryRadio && (deliveryRadio.id === 'd2' || deliveryRadio.value === 'pickup')) {
        return 0; // Retrait gratuit
    }
    return 1000; // Express 1000 FCFA
}

function renderCheckoutSummary() {
    const items = typeof getCartItems === 'function' ? getCartItems() : [];
    const subtotal = typeof getCartTotal === 'function' ? getCartTotal() : 0;
    const deliveryCost = getSelectedDeliveryCost();
    const grandTotal = subtotal + deliveryCost;

    const summaryBox = document.querySelector('.col-lg-4 .bg-white');
    if (!summaryBox) return;

    let itemsHtml = items.map(item => `
        <div class="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
            <div class="d-flex align-items-center gap-2">
                <img src="${item.image || item.img}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;" onerror="this.src='assets/product_baguette.png'">
                <div>
                    <div class="fw-bold small text-truncate" style="max-width:140px;">${item.name || item.title}</div>
                    <small class="text-muted">Qté: ${item.qty || item.quantity || 1}</small>
                </div>
            </div>
            <div class="fw-bold small">${((item.price || item.prix || 0) * (item.qty || item.quantity || 1)).toLocaleString()} FCFA</div>
        </div>
    `).join('');

    summaryBox.innerHTML = `
        <h6 class="fw-bold border-bottom pb-2 mb-3" style="color:#2b160c;">
            <i class="fa-solid fa-receipt me-1 text-warning"></i> RÉSUMÉ DE LA COMMANDE
        </h6>
        
        <div class="items-list mb-3" style="max-height: 220px; overflow-y: auto;">
            ${itemsHtml}
        </div>
        
        <div class="d-flex justify-content-between mb-2 fs-sm text-muted">
            <span>Sous-total (${items.reduce((s,i) => s+(i.qty||1), 0)} articles)</span>
            <span class="fw-bold text-dark">${subtotal.toLocaleString()} FCFA</span>
        </div>
        <div class="d-flex justify-content-between mb-3 fs-sm text-muted border-bottom pb-3">
            <span>Frais de livraison</span>
            <span class="fw-bold ${deliveryCost === 0 ? 'text-success' : 'text-dark'}">${deliveryCost === 0 ? 'Gratuit' : deliveryCost.toLocaleString() + ' FCFA'}</span>
        </div>
        
        <div class="d-flex justify-content-between mb-4">
            <span class="fw-bold fs-5" style="color:#2b160c;">Total</span>
            <span class="fw-bold fs-5 text-primary" style="color:#fb923c !important;">${grandTotal.toLocaleString()} FCFA</span>
        </div>
        
        <button type="button" class="btn btn-warning w-100 fw-bold text-dark shadow-sm py-3 fs-6 rounded-3" 
            style="background:#fb923c; border:none;" id="placeOrderBtn" onclick="submitBabiOrder()">
            <i class="fa-solid fa-check-circle me-2"></i>CONFIRMER LA COMMANDE (${grandTotal.toLocaleString()} FCFA)
        </button>
    `;

    // Also update main payment submit button inside accordion if present
    const accordionSubmitBtn = document.querySelector('#collapseThree button');
    if (accordionSubmitBtn) {
        accordionSubmitBtn.innerText = `CONFIRMER LA COMMANDE (${grandTotal.toLocaleString()} FCFA)`;
        accordionSubmitBtn.onclick = submitBabiOrder;
    }
}

function setupCheckoutFormEvents() {
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', () => {
            renderCheckoutSummary();
        });
    });
}

function submitBabiOrder() {
    const items = typeof getCartItems === 'function' ? getCartItems() : [];
    if (!items || items.length === 0) {
        alert('Votre panier est vide.');
        return;
    }

    // Read form inputs
    const inputs = document.querySelectorAll('#collapseOne input, #collapseOne select');
    const fullName = inputs[0] ? inputs[0].value.trim() : 'Jean Dupont';
    const phone = inputs[1] ? inputs[1].value.trim() : '07 04 38 92 01';
    const communeSelect = document.querySelector('#collapseOne select');
    const commune = communeSelect ? communeSelect.value : 'Cocody';
    const address = inputs[2] ? inputs[2].value.trim() : 'Riviera 2, Abidjan';

    const deliveryRadio = document.querySelector('input[name="delivery"]:checked');
    const deliveryMethod = deliveryRadio && deliveryRadio.id === 'd2' ? 'Retrait en Boutique' : 'Livraison à Domicile (Express)';
    const deliveryCost = getSelectedDeliveryCost();

    const paymentRadio = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentRadio && paymentRadio.id === 'p_cash' ? 'Paiement à la livraison' : 'Mobile Money (Wave / OM / MTN)';

    const subtotal = typeof getCartTotal === 'function' ? getCartTotal() : 0;
    const grandTotal = subtotal + deliveryCost;

    const orderId = 'BABI-CMD-' + Math.floor(100000 + Math.random() * 900000);
    const confCode = Math.floor(1000 + Math.random() * 9000);

    const newOrder = {
        id: orderId,
        clientName: fullName || 'Client BABI',
        phone: phone || '07 04 38 92 01',
        commune: commune,
        address: address,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        items: items,
        itemsSummary: items.map(i => `${i.name || i.title} (x${i.qty || i.quantity || 1})`).join(', '),
        subtotal: subtotal,
        delivery_cost: deliveryCost,
        total_price: grandTotal,
        status: 'Nouveau',
        confCode: confCode,
        createdAt: new Date().toISOString()
    };

    // 1. Save current active order for tracking page
    localStorage.setItem('babi_current_order', JSON.stringify(newOrder));

    // 2. Append to order history
    try {
        let history = JSON.parse(localStorage.getItem('babi_orders_history')) || [];
        history.unshift(newOrder);
        localStorage.setItem('babi_orders_history', JSON.stringify(history));
    } catch(e) {}

    // 3. Clear cart
    if (typeof clearCart === 'function') {
        clearCart();
    } else {
        localStorage.removeItem('babi_cart_items');
        localStorage.removeItem('babi_cart');
    }

    // 4. Toast notification and redirect to order tracking page
    alert(`🎉 Commande #${orderId} enregistrée avec succès !\n\nVous allez être redirigé vers le suivi de livraison en temps réel.`);
    window.location.href = `suivi.html?orderId=${orderId}`;
}
