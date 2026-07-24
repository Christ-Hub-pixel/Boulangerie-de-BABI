// Fetch and render products dynamically with local fail-proof image fallback

const defaultCategoryImages = {
    pain: "assets/processed_products/baguette_150.jpg",
    viennoiserie: "assets/processed_products/biscottes.jpg",
    patisserie: "assets/processed_products/gateau1.jpg",
    jus: "assets/processed_products/jus_de_passion.jpg",
    boisson: "assets/processed_products/chill.jpg",
    cafe: "assets/processed_products/youki_moka_cafe.jpg",
    glace: "assets/processed_products/jus_de_passion.jpg",
    snack: "assets/processed_products/marbre.jpg"
};

const svgPlaceholder = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%232b160c'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23fb923c'>Boulangerie de BABI</text></svg>";

const FALLBACK_PRODUCTS = [
    // === BOISSONS ===
    { id: 1, nom: "Chill", prix: 700, categorie: "boisson", image: "assets/processed_products/chill.jpg" },
    { id: 2, nom: "Youyou", prix: 500, categorie: "boisson", image: "assets/processed_products/youzou.jpg" },
    { id: 3, nom: "Word Cola", prix: 500, categorie: "boisson", image: "assets/processed_products/world_cola.jpg" },
    { id: 4, nom: "Youki Orange", prix: 500, categorie: "boisson", image: "assets/processed_products/youki_moka_cafe.jpg" },
    { id: 5, nom: "Youki Pomme", prix: 500, categorie: "boisson", image: "assets/processed_products/youki_pomme.jpg" },
    { id: 6, nom: "Jus Naturel (Petit)", prix: 300, categorie: "jus", image: "assets/processed_products/jus_de_baobab_petit.jpg" },
    { id: 7, nom: "Jus Naturel (Moyen)", prix: 500, categorie: "jus", image: "assets/processed_products/jus_de_baobab.jpg" },
    { id: 8, nom: "Jus Naturel (Grand)", prix: 2000, categorie: "jus", image: "assets/processed_products/jus_de_passion.jpg" },
    { id: 9, nom: "Orangina", prix: 500, categorie: "boisson", image: "assets/processed_products/youki_moka_cafe.jpg" },
    { id: 10, nom: "Sprite", prix: 500, categorie: "boisson", image: "assets/processed_products/youzou.jpg" },
    { id: 11, nom: "Énergie Malt", prix: 700, categorie: "boisson", image: "assets/processed_products/youki_moka_cafe.jpg" },
    { id: 12, nom: "Eau Minérale (Petite)", prix: 200, categorie: "boisson", image: "assets/processed_products/bouteille_celeste.jpg" },
    { id: 13, nom: "Eau Minérale (Grande)", prix: 1000, categorie: "boisson", image: "assets/processed_products/bouteille_celeste.jpg" },
    { id: 14, nom: "Dégué", prix: 500, categorie: "boisson", image: "assets/processed_products/jus_de_bissap.jpg" },
    { id: 15, nom: "Lait", prix: 500, categorie: "boisson", image: "assets/processed_products/youzou.jpg" },
    { id: 16, nom: "Passion (Grand Format)", prix: 3000, categorie: "jus", image: "assets/processed_products/jus_de_passion.jpg" },
    { id: 17, nom: "Passion (Petite Bouteille)", prix: 700, categorie: "jus", image: "assets/processed_products/jus_de_passion.jpg" },
    { id: 18, nom: "Baobab", prix: 500, categorie: "jus", image: "assets/processed_products/jus_de_baobab.jpg" },
    { id: 19, nom: "Bissap", prix: 2000, categorie: "jus", image: "assets/processed_products/jus_de_bissap.jpg" },
    { id: 20, nom: "Gingembre", prix: 3000, categorie: "jus", image: "assets/processed_products/jus_de_gingembre.jpg" },
    { id: 21, nom: "Tamarin", prix: 2000, categorie: "jus", image: "assets/processed_products/jus_de_tamari.jpg" },
    { id: 22, nom: "Cocktail", prix: 3000, categorie: "jus", image: "assets/processed_products/cocktail.jpg" },
    { id: 23, nom: "Citron", prix: 2000, categorie: "jus", image: "assets/processed_products/jus_de_citron.jpg" },
    { id: 24, nom: "Chocolat Chaud", prix: 3000, categorie: "cafe", image: "assets/processed_products/youki_moka_cafe.jpg" },

    // === BOULANGERIE ===
    { id: 25, nom: "Baguette 150", prix: 150, categorie: "pain", image: "assets/processed_products/baguette_150.jpg" },
    { id: 26, nom: "Baguette 200", prix: 200, categorie: "pain", image: "assets/processed_products/baguette_150.jpg" },
    { id: 27, nom: "Ficelle", prix: 500, categorie: "pain", image: "assets/processed_products/baguette_150.jpg" },
    { id: 28, nom: "Pain Complet (Grand)", prix: 1000, categorie: "pain", image: "assets/processed_products/pain_complet.jpg" },
    { id: 29, nom: "Pain Complet (Petit)", prix: 500, categorie: "pain", image: "assets/processed_products/pain_complet_2.jpg" },
    { id: 30, nom: "Pain Sans Sel", prix: 150, categorie: "pain", image: "assets/processed_products/baguette_150.jpg" },
    { id: 31, nom: "Panini", prix: 100, categorie: "snack", image: "assets/processed_products/marbre.jpg" },
    { id: 32, nom: "Petit Pain (50F)", prix: 50, categorie: "pain", image: "assets/processed_products/pain_individuel.jpg" },
    { id: 33, nom: "Petit Pain (100F)", prix: 100, categorie: "pain", image: "assets/processed_products/pain_individuel.jpg" },

    // === PIZZA ===
    { id: 34, nom: "Mini Pizza", prix: 1000, categorie: "snack", image: "assets/processed_products/marbre1.jpg" },
    { id: 35, nom: "Petit Pizza", prix: 5000, categorie: "snack", image: "assets/processed_products/marbre1.1.jpg" },
    { id: 36, nom: "Grande Pizza", prix: 10000, categorie: "snack", image: "assets/processed_products/marbre.jpg" },

    // === VIENNOISERIES ===
    { id: 37, nom: "Américain", prix: 700, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 38, nom: "Biscotte", prix: 1000, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 39, nom: "Charaphe au Raisin", prix: 700, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 40, nom: "Chausson aux Pommes", prix: 1000, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 41, nom: "Choco Suisse", prix: 800, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 42, nom: "Cookies (l'unité)", prix: 200, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 43, nom: "Croissant", prix: 500, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 44, nom: "Escargots", prix: 700, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 45, nom: "Flan", prix: 1000, categorie: "patisserie", image: "assets/processed_products/gateau1.jpg" },
    { id: 46, nom: "Quiche", prix: 500, categorie: "snack", image: "assets/processed_products/marbre.jpg" },
    { id: 47, nom: "Lot de Cookies", prix: 1000, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 48, nom: "Pain au Chocolat", prix: 500, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 49, nom: "Pain au Lait", prix: 200, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 50, nom: "Pain aux Raisins", prix: 700, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 51, nom: "Pain Évêque", prix: 800, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 52, nom: "Pain Suisse", prix: 800, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 53, nom: "Palmiers", prix: 200, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 54, nom: "Star Suisse", prix: 800, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 55, nom: "Torsade", prix: 800, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 56, nom: "Croque-Monsieur", prix: 800, categorie: "snack", image: "assets/processed_products/marbre1.jpg" },
    { id: 57, nom: "Madeleines (l'unité)", prix: 100, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },

    // === GATEAU & CAKE ===
    { id: 58, nom: "Gâteau (10 000F)", prix: 10000, categorie: "patisserie", image: "assets/processed_products/gateau1.jpg" },
    { id: 59, nom: "Gâteau (15 000F)", prix: 15000, categorie: "patisserie", image: "assets/processed_products/gateau1.1.jpg" },
    { id: 60, nom: "Gâteau (20 000F)", prix: 20000, categorie: "patisserie", image: "assets/processed_products/gateau1.2.jpg" },
    { id: 61, nom: "Gâteau (25 000F)", prix: 25000, categorie: "patisserie", image: "assets/processed_products/gateau2.jpg" },
    { id: 62, nom: "Bûche de Noël (7000F)", prix: 7000, categorie: "patisserie", image: "assets/processed_products/gateau1.jpg" },
    { id: 63, nom: "Bûche de Noël (5000F)", prix: 5000, categorie: "patisserie", image: "assets/processed_products/gateau1.1.jpg" },
    { id: 64, nom: "Moka", prix: 1500, categorie: "patisserie", image: "assets/processed_products/moka1.jpg" },
    { id: 65, nom: "Lot de Madeleines", prix: 500, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 66, nom: "Madeleine", prix: 100, categorie: "viennoiserie", image: "assets/processed_products/biscottes.jpg" },
    { id: 67, nom: "Cup Cake", prix: 500, categorie: "patisserie", image: "assets/processed_products/moka1.1.jpg" },
    { id: 68, nom: "Cake (300F)", prix: 300, categorie: "patisserie", image: "assets/processed_products/cake.jpg" },
    { id: 69, nom: "Cake (700F)", prix: 700, categorie: "patisserie", image: "assets/processed_products/cake1.jpg" },

    // === DESSERT ===
    { id: 70, nom: "Crêpe au Nutella", prix: 2000, categorie: "patisserie", image: "assets/processed_products/moka1.jpg" },
    { id: 71, nom: "Crêpe à la Vanille", prix: 1500, categorie: "patisserie", image: "assets/processed_products/moka1.1.jpg" },
    { id: 72, nom: "Crêpe Suzette", prix: 1500, categorie: "patisserie", image: "assets/processed_products/moka1.2.jpg" },
    { id: 73, nom: "Fondant au Chocolat", prix: 1000, categorie: "patisserie", image: "assets/processed_products/gateau1.jpg" },
    { id: 74, nom: "Glace", prix: 1000, categorie: "glace", image: "assets/processed_products/jus_de_passion.jpg" },

    // === PAINS SPECIAUX ===
    { id: 75, nom: "Pain Cabré", prix: 700, categorie: "pain", image: "assets/processed_products/marbre.jpg" },
    { id: 76, nom: "Pain Breton", prix: 700, categorie: "pain", image: "assets/processed_products/marbre1.jpg" },
    { id: 77, nom: "Pain Délice", prix: 700, categorie: "pain", image: "assets/processed_products/marbre1.1.jpg" },
    { id: 78, nom: "Pain Marbré", prix: 500, categorie: "pain", image: "assets/processed_products/marbre.jpg" },
    { id: 79, nom: "Pain Amour", prix: 1000, categorie: "pain", image: "assets/processed_products/pain_complet.jpg" },
    { id: 80, nom: "Pain Canadien", prix: 700, categorie: "pain", image: "assets/processed_products/pain_complet_3.jpg" },
    { id: 81, nom: "Pain de Mie", prix: 2000, categorie: "pain", image: "assets/processed_products/pain_de_mie.jpg" },
    { id: 82, nom: "Pain Parisien", prix: 300, categorie: "pain", image: "assets/processed_products/baguette_150.jpg" },
    { id: 83, nom: "Pain Viennois (500F)", prix: 500, categorie: "pain", image: "assets/processed_products/marbre.jpg" },
    { id: 84, nom: "Pain Viennois (700F)", prix: 700, categorie: "pain", image: "assets/processed_products/marbre1.jpg" },
    { id: 85, nom: "Suzette", prix: 300, categorie: "pain", image: "assets/processed_products/pain_individuel.jpg" },
    { id: 86, nom: "Brioche à la Viande", prix: 800, categorie: "snack", image: "assets/processed_products/marbre.jpg" },
    { id: 87, nom: "Feuilleté", prix: 800, categorie: "snack", image: "assets/processed_products/marbre1.jpg" }
];

let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (response.ok) {
            allProducts = await response.json();
        } else {
            throw new Error("API status not ok");
        }
    } catch(err) {
        console.warn("Utilisation de la liste des produits statiques locaux :", err);
        allProducts = FALLBACK_PRODUCTS;
    }
    
    const container = document.getElementById('product-grid');
    if(container) {
        renderProducts(allProducts);
        
        const countEl = document.querySelector('.products-count');
        if(countEl) countEl.innerText = `(${allProducts.length} produits)`;
        
        const urlParams = new URLSearchParams(window.location.search);
        const cat = urlParams.get('cat');
        if (cat) {
            setTimeout(() => filterCat(cat), 100);
        }
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
    
    container.innerHTML = productsList.map(p => {
        const fallbackImg = defaultCategoryImages[p.categorie] || defaultCategoryImages['pain'];
        const imgSrc = p.image || fallbackImg;
        return `
        <div class="col product-card-wrapper" data-category="${p.categorie}" data-name="${(p.nom || '').toLowerCase()}">
            <div class="card premium-product-card h-100 border-0 shadow-sm position-relative overflow-hidden">
                <div class="position-relative overflow-hidden">
                    <img loading="lazy" src="${imgSrc}" class="card-img-top product-img" alt="${p.nom}" 
                        style="height:160px;object-fit:cover;transition:transform 0.4s ease;"
                        onerror="this.onerror=function(){this.src='${svgPlaceholder}';}; this.src='${fallbackImg}';">
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
                        <span class="text-muted" style="font-size:0.7rem;">(${Math.floor(Math.random()*150)+20})</span>
                    </div>
                    <div class="d-flex align-items-baseline gap-2 mb-2">
                        <span class="fw-bold text-dark" style="font-size:1rem;">${(p.prix || 0).toLocaleString()} <small>FCFA</small></span>
                    </div>
                    <button class="btn btn-primary btn-sm w-100 fw-bold text-dark mt-auto add-to-cart-btn"
                        style="font-size:0.78rem;" onclick="addToCart('${p.nom.replace(/'/g, "\\'")}', ${p.prix}, '${imgSrc}')">
                        <i class="fa-solid fa-cart-plus me-1"></i>AJOUTER
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
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
    document.querySelectorAll('input[name="catFilter"]').forEach(r => {
        r.checked = (r.value === term);
    });

    if(term === '') {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.categorie.toLowerCase() === term.toLowerCase());
        renderProducts(filtered);
    }
    
    const countEl = document.querySelector('.products-count');
    if(countEl) {
        const count = term === '' ? allProducts.length : allProducts.filter(p => p.categorie.toLowerCase() === term.toLowerCase()).length;
        countEl.innerText = `(${count} produits)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
