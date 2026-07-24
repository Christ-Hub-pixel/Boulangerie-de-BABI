
// Fetch and render products dynamically
let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        
        const container = document.getElementById('product-grid');
        if(container) {
            renderProducts(allProducts);
            
            // Update product count
            const countEl = document.querySelector('.products-count');
            if(countEl) countEl.innerText = `(${allProducts.length} produits)`;
            
            // Auto-filter if a category is passed in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('cat');
            if (cat) {
                setTimeout(() => filterCat(cat), 100);
            }
        }
    } catch(err) {
        console.error("Erreur de chargement des produits", err);
    }
}

function renderProducts(productsList) {
    const container = document.getElementById('product-grid');
    if(!container) return;
    
    if(productsList.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5">
            <i class="fa-solid fa-search text-muted" style="font-size:3rem;"></i>
            <p class="text-muted mt-3">Aucun produit trouvé dans cette catégorie.</p>
        </div>`;
        return;
    }
    
    container.innerHTML = productsList.map(p => `
        <div class="col product-card-wrapper" data-category="${p.categorie}" data-name="${p.nom.toLowerCase()}">
            <div class="card premium-product-card h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div class="position-relative overflow-hidden">
                    <img loading="lazy" src="${p.image}" class="card-img-top product-img" alt="${p.nom}" 
                        style="height:160px;object-fit:cover;transition:transform 0.4s ease;"
                        onerror="this.src='https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&w=400&q=80'">
                    <button class="wishlist-btn position-absolute top-0 end-0 m-2 btn btn-sm bg-white rounded-circle shadow-sm border-0 text-danger"
                        title="Ajouter aux favoris" style="width:32px;height:32px;padding:0;">
                        <i class="fa-regular fa-heart"></i>
                    </button>
                    <span class="badge position-absolute top-0 start-0 m-2" style="background:rgba(43,22,12,0.85);font-size:0.65rem;">${getCatLabel(p.categorie)}</span>
                </div>
                <div class="card-body p-2 d-flex flex-column">
                    <h6 class="card-title fw-semibold mb-1" style="font-size:0.85rem;">${p.nom}</h6>
                    <div class="d-flex align-items-center gap-1 mb-2">
                        <span class="text-warning" style="font-size:0.65rem;">★★★★<span class="text-muted">★</span></span>
                        <span class="text-muted" style="font-size:0.7rem;">(${Math.floor(Math.random()*200)+10})</span>
                    </div>
                    <div class="d-flex align-items-baseline gap-2 mb-2">
                        <span class="fw-bold text-dark" style="font-size:1rem;">${p.prix.toLocaleString()} <small>FCFA</small></span>
                    </div>
                    <button class="btn btn-primary btn-sm w-100 fw-bold text-dark mt-auto add-to-cart-btn"
                        style="font-size:0.78rem;" onclick="addToCart('${p.nom.replace(/'/g, "\\'")}', ${p.prix}, '${p.image}')">
                        <i class="fa-solid fa-cart-plus me-1"></i>AJOUTER
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getCatLabel(cat) {
    const labels = {
        'pain': '🥖 Pain',
        'viennoiserie': '🥐 Viennoiserie',
        'patisserie': '🍰 Pâtisserie',
        'cafe': '☕ Café',
        'jus': '🥤 Jus',
        'glace': '🍨 Glace',
        'boisson': '🥤 Boisson',
        'snack': '🍕 Snack / Pizza'
    };
    return labels[cat] || cat;
}

// Category filter function
window.filterCat = function(term) {
    // Update radio buttons
    document.querySelectorAll('input[name="catFilter"]').forEach(r => {
        r.checked = (r.value === term);
    });

    // Filter products
    if(term === '') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.categorie.toLowerCase() === term.toLowerCase());
        renderProducts(filtered);
    }
    
    // Update count
    const countEl = document.querySelector('.products-count');
    if(countEl) {
        const count = term === '' ? allProducts.length : allProducts.filter(p => p.categorie.toLowerCase() === term.toLowerCase()).length;
        countEl.innerText = `(${count} produits)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
