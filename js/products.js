
// Fetch and render products dynamically
let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        
        // If we are on index.html or produits.html, we render them
        const container = document.getElementById('product-grid');
        if(container) {
            renderProducts(allProducts);
            // Raccourci depuis l'accueil: Auto-filter if a category is passed in the URL
            const urlParams = new URLSearchParams(window.location.search);
            const cat = urlParams.get('cat');
            if (cat) {
                setTimeout(() => window.filterCat(cat), 50);
            }
        }
    } catch(err) {
        console.error("Erreur de chargement des produits", err);
    }
}

function renderProducts(productsList) {
    const container = document.getElementById('product-grid');
    if(!container) return;
    
    container.innerHTML = productsList.map(p => `
        <div class="col product-card-wrapper" data-category="${p.categorie}">
            <div class="product-card h-100">
                <img loading="lazy" src="${p.image}" alt="${p.nom}">
                <div class="product-info">
                    <h4>${p.nom}</h4>
                    <div class="price">${p.prix} FCFA</div>
                    <p class="product-desc">${p.description || ''}</p>
                    <div class="rating"><i class="fa-solid fa-star"></i> 4.8 <span>(120)</span></div>
                    <button class="btn-add add-to-cart-btn" onclick="addToCart('${p.nom}', ${p.prix}, '${p.image}')">AJOUTER <i class="fa-solid fa-cart-shopping"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

// Global category filter (overriding inline functions)
window.filterCat = function(term) {
    document.querySelectorAll('#visual-categories button').forEach(b => {
        b.classList.remove('bg-dark', 'text-white');
    });
    if(event) {
        event.currentTarget.classList.add('bg-dark', 'text-white');
    }
    
    const wrappers = document.querySelectorAll('.product-card-wrapper');
    wrappers.forEach(card => {
        const title = card.querySelector('.card-title').innerText.toLowerCase();
        const cat = card.getAttribute('data-category').toLowerCase();
        if(term === '' || title.includes(term.toLowerCase()) || cat.includes(term.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
