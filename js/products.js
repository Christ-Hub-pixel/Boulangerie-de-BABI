// Fetch and render products dynamically with clean no-broken-image fallback

const realProductImages = {
    "Chill": "assets/chill.png",
    "Youyou": "assets/youzou.png",
    "Word Cola": "assets/world cola.png",
    "Youki Orange": "assets/youki moka cafe.png",
    "Youki Pomme": "assets/youki pomme.png",
    "Jus Naturel (Petit)": "assets/jus de baobab petit.png",
    "Jus Naturel (Moyen)": "assets/jus de baobab.png",
    "Jus Naturel (Grand)": "assets/jus de passion.png",
    "Eau Minérale (Petite)": "assets/bouteille celeste.png",
    "Eau Minérale (Grande)": "assets/bouteille celeste.png",
    "Dégué": "assets/jus de bissap.png",
    "Passion (Grand Format)": "assets/jus de passion.png",
    "Passion (Petite Bouteille)": "assets/jus de passion.png",
    "Baobab": "assets/jus de baobab.png",
    "Bissap": "assets/jus de bissap.png",
    "Gingembre": "assets/jus de gingembre.png",
    "Tamarin": "assets/jus de tamari.png",
    "Cocktail": "assets/cocktail.png",
    "Citron": "assets/jus de citron.png",
    "Baguette 150": "assets/baguette 150.png",
    "Baguette 200": "assets/baguette 150.png",
    "Ficelle": "assets/baguette 150.png",
    "Pain Complet (Grand)": "assets/pain complet.png",
    "Pain Complet (Petit)": "assets/pain complet 2.png",
    "Pain Sans Sel": "assets/baguette 150.png",
    "Petit Pain (50F)": "assets/pain individuel.png",
    "Petit Pain (100F)": "assets/pain individuel.png",
    "Biscotte": "assets/biscottes.png",
    "Gâteau (10 000F)": "assets/Gateau1.png",
    "Gâteau (15 000F)": "assets/Gateau1.1.png",
    "Gâteau (20 000F)": "assets/Gateau1.2.png",
    "Gâteau (25 000F)": "assets/gateau2.png",
    "Moka": "assets/moka1.png",
    "Cup Cake": "assets/moka1.1.png",
    "Cake (300F)": "assets/cake.png",
    "Cake (700F)": "assets/cake1.png",
    "Pain Cabré": "assets/marbre.png",
    "Pain Breton": "assets/marbre1.png",
    "Pain Délice": "assets/marbre1.1.png",
    "Pain Marbré": "assets/marbre.png",
    "Pain de Mie": "assets/pain de mie.png"
};

const catIcons = {
    'pain': '🥖',
    'viennoiserie': '🥐',
    'patisserie': '🍰',
    'cafe': '☕',
    'jus': '🥤',
    'glace': '🍨',
    'boisson': '🥤',
    'snack': '🍕'
};

const FALLBACK_PRODUCTS = [
    // === BOISSONS ===
    { id: 1, nom: "Chill", prix: 700, categorie: "boisson" },
    { id: 2, nom: "Youyou", prix: 500, categorie: "boisson" },
    { id: 3, nom: "Word Cola", prix: 500, categorie: "boisson" },
    { id: 4, nom: "Youki Orange", prix: 500, categorie: "boisson" },
    { id: 5, nom: "Youki Pomme", prix: 500, categorie: "boisson" },
    { id: 6, nom: "Jus Naturel (Petit)", prix: 300, categorie: "jus" },
    { id: 7, nom: "Jus Naturel (Moyen)", prix: 500, categorie: "jus" },
    { id: 8, nom: "Jus Naturel (Grand)", prix: 2000, categorie: "jus" },
    { id: 9, nom: "Orangina", prix: 500, categorie: "boisson" },
    { id: 10, nom: "Sprite", prix: 500, categorie: "boisson" },
    { id: 11, nom: "Énergie Malt", prix: 700, categorie: "boisson" },
    { id: 12, nom: "Eau Minérale (Petite)", prix: 200, categorie: "boisson" },
    { id: 13, nom: "Eau Minérale (Grande)", prix: 1000, categorie: "boisson" },
    { id: 14, nom: "Dégué", prix: 500, categorie: "boisson" },
    { id: 15, nom: "Lait", prix: 500, categorie: "boisson" },
    { id: 16, nom: "Passion (Grand Format)", prix: 3000, categorie: "jus" },
    { id: 17, nom: "Passion (Petite Bouteille)", prix: 700, categorie: "jus" },
    { id: 18, nom: "Baobab", prix: 500, categorie: "jus" },
    { id: 19, nom: "Bissap", prix: 2000, categorie: "jus" },
    { id: 20, nom: "Gingembre", prix: 3000, categorie: "jus" },
    { id: 21, nom: "Tamarin", prix: 2000, categorie: "jus" },
    { id: 22, nom: "Cocktail", prix: 3000, categorie: "jus" },
    { id: 23, nom: "Citron", prix: 2000, categorie: "jus" },
    { id: 24, nom: "Chocolat Chaud", prix: 3000, categorie: "cafe" },

    // === BOULANGERIE ===
    { id: 25, nom: "Baguette 150", prix: 150, categorie: "pain" },
    { id: 26, nom: "Baguette 200", prix: 200, categorie: "pain" },
    { id: 27, nom: "Ficelle", prix: 500, categorie: "pain" },
    { id: 28, nom: "Pain Complet (Grand)", prix: 1000, categorie: "pain" },
    { id: 29, nom: "Pain Complet (Petit)", prix: 500, categorie: "pain" },
    { id: 30, nom: "Pain Sans Sel", prix: 150, categorie: "pain" },
    { id: 31, nom: "Panini", prix: 100, categorie: "snack" },
    { id: 32, nom: "Petit Pain (50F)", prix: 50, categorie: "pain" },
    { id: 33, nom: "Petit Pain (100F)", prix: 100, categorie: "pain" },

    // === PIZZA ===
    { id: 34, nom: "Mini Pizza", prix: 1000, categorie: "snack" },
    { id: 35, nom: "Petit Pizza", prix: 5000, categorie: "snack" },
    { id: 36, nom: "Grande Pizza", prix: 10000, categorie: "snack" },

    // === VIENNOISERIES ===
    { id: 37, nom: "Américain", prix: 700, categorie: "viennoiserie" },
    { id: 38, nom: "Biscotte", prix: 1000, categorie: "viennoiserie" },
    { id: 39, nom: "Charaphe au Raisin", prix: 700, categorie: "viennoiserie" },
    { id: 40, nom: "Chausson aux Pommes", prix: 1000, categorie: "viennoiserie" },
    { id: 41, nom: "Choco Suisse", prix: 800, categorie: "viennoiserie" },
    { id: 42, nom: "Cookies (l'unité)", prix: 200, categorie: "viennoiserie" },
    { id: 43, nom: "Croissant", prix: 500, categorie: "viennoiserie" },
    { id: 44, nom: "Escargots", prix: 700, categorie: "viennoiserie" },
    { id: 45, nom: "Flan", prix: 1000, categorie: "patisserie" },
    { id: 46, nom: "Quiche", prix: 500, categorie: "snack" },
    { id: 47, nom: "Lot de Cookies", prix: 1000, categorie: "viennoiserie" },
    { id: 48, nom: "Pain au Chocolat", prix: 500, categorie: "viennoiserie" },
    { id: 49, nom: "Pain au Lait", prix: 200, categorie: "viennoiserie" },
    { id: 50, nom: "Pain aux Raisins", prix: 700, categorie: "viennoiserie" },
    { id: 51, nom: "Pain Évêque", prix: 800, categorie: "viennoiserie" },
    { id: 52, nom: "Pain Suisse", prix: 800, categorie: "viennoiserie" },
    { id: 53, nom: "Palmiers", prix: 200, categorie: "viennoiserie" },
    { id: 54, nom: "Star Suisse", prix: 800, categorie: "viennoiserie" },
    { id: 55, nom: "Torsade", prix: 800, categorie: "viennoiserie" },
    { id: 56, nom: "Croque-Monsieur", prix: 800, categorie: "snack" },
    { id: 57, nom: "Madeleines (l'unité)", prix: 100, categorie: "viennoiserie" },

    // === GATEAU & CAKE ===
    { id: 58, nom: "Gâteau (10 000F)", prix: 10000, categorie: "patisserie" },
    { id: 59, nom: "Gâteau (15 000F)", prix: 15000, categorie: "patisserie" },
    { id: 60, nom: "Gâteau (20 000F)", prix: 20000, categorie: "patisserie" },
    { id: 61, nom: "Gâteau (25 000F)", prix: 25000, categorie: "patisserie" },
    { id: 62, nom: "Bûche de Noël (7000F)", prix: 7000, categorie: "patisserie" },
    { id: 63, nom: "Bûche de Noël (5000F)", prix: 5000, categorie: "patisserie" },
    { id: 64, nom: "Moka", prix: 1500, categorie: "patisserie" },
    { id: 65, nom: "Lot de Madeleines", prix: 500, categorie: "viennoiserie" },
    { id: 66, nom: "Madeleine", prix: 100, categorie: "viennoiserie" },
    { id: 67, nom: "Cup Cake", prix: 500, categorie: "patisserie" },
    { id: 68, nom: "Cake (300F)", prix: 300, categorie: "patisserie" },
    { id: 69, nom: "Cake (700F)", prix: 700, categorie: "patisserie" },

    // === DESSERT ===
    { id: 70, nom: "Crêpe au Nutella", prix: 2000, categorie: "patisserie" },
    { id: 71, nom: "Crêpe à la Vanille", prix: 1500, categorie: "patisserie" },
    { id: 72, nom: "Crêpe Suzette", prix: 1500, categorie: "patisserie" },
    { id: 73, nom: "Fondant au Chocolat", prix: 1000, categorie: "patisserie" },
    { id: 74, nom: "Glace", prix: 1000, categorie: "glace" },

    // === PAINS SPECIAUX ===
    { id: 75, nom: "Pain Cabré", prix: 700, categorie: "pain" },
    { id: 76, nom: "Pain Breton", prix: 700, categorie: "pain" },
    { id: 77, nom: "Pain Délice", prix: 700, categorie: "pain" },
    { id: 78, nom: "Pain Marbré", prix: 500, categorie: "pain" },
    { id: 79, nom: "Pain Amour", prix: 1000, categorie: "pain" },
    { id: 80, nom: "Pain Canadien", prix: 700, categorie: "pain" },
    { id: 81, nom: "Pain de Mie", prix: 2000, categorie: "pain" },
    { id: 82, nom: "Pain Parisien", prix: 300, categorie: "pain" },
    { id: 83, nom: "Pain Viennois (500F)", prix: 500, categorie: "pain" },
    { id: 84, nom: "Pain Viennois (700F)", prix: 700, categorie: "pain" },
    { id: 85, nom: "Suzette", prix: 300, categorie: "pain" },
    { id: 86, nom: "Brioche à la Viande", prix: 800, categorie: "snack" },
    { id: 87, nom: "Feuilleté", prix: 800, categorie: "snack" }
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
        const hasRealImage = realProductImages[p.nom] || (p.image && p.image.includes('assets/'));
        const imgSrc = realProductImages[p.nom] || p.image;
        
        const imageHeaderHTML = hasRealImage ? `
            <div class="position-relative overflow-hidden product-img-container" style="height:160px;background:#f8fafc;">
                <img loading="lazy" src="${imgSrc}" class="card-img-top product-img" alt="${p.nom}" 
                    style="height:160px;width:100%;object-fit:cover;transition:transform 0.4s ease;"
                    onerror="handleImgError(this, '${p.categorie}')">
                <button class="wishlist-btn position-absolute top-0 end-0 m-2 btn btn-sm bg-white rounded-circle shadow-sm border-0 text-danger"
                    title="Ajouter aux favoris" style="width:32px;height:32px;padding:0;">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <span class="badge position-absolute top-0 start-0 m-2" style="background:rgba(43,22,12,0.85);font-size:0.65rem;">${getCatLabel(p.categorie)}</span>
            </div>
        ` : `
            <div class="position-relative overflow-hidden product-img-container d-flex align-items-center justify-content-center" 
                style="height:110px; background: linear-gradient(135deg, #2b160c 0%, #4a2818 100%);">
                <span style="font-size:2.8rem;">${catIcons[p.categorie] || '🍞'}</span>
                <button class="wishlist-btn position-absolute top-0 end-0 m-2 btn btn-sm bg-white rounded-circle shadow-sm border-0 text-danger"
                    title="Ajouter aux favoris" style="width:32px;height:32px;padding:0;">
                    <i class="fa-regular fa-heart"></i>
                </button>
                <span class="badge position-absolute top-0 start-0 m-2" style="background:rgba(251,146,60,0.9);color:#2b160c;font-size:0.65rem;font-weight:bold;">${getCatLabel(p.categorie)}</span>
            </div>
        `;

        return `
        <div class="col product-card-wrapper" data-category="${p.categorie}" data-name="${(p.nom || '').toLowerCase()}">
            <div class="card premium-product-card h-100 border-0 shadow-sm position-relative overflow-hidden" style="border-radius:12px;">
                ${imageHeaderHTML}
                <div class="card-body p-2 d-flex flex-column">
                    <h6 class="card-title fw-semibold mb-1" style="font-size:0.85rem;color:#2b160c;">${p.nom}</h6>
                    <div class="d-flex align-items-center gap-1 mb-2">
                        <span class="text-warning" style="font-size:0.65rem;">★★★★<span class="text-muted">★</span></span>
                        <span class="text-muted" style="font-size:0.7rem;">(${Math.floor(Math.random()*150)+20})</span>
                    </div>
                    <div class="d-flex align-items-baseline gap-2 mb-2">
                        <span class="fw-bold text-dark" style="font-size:1rem;">${(p.prix || 0).toLocaleString()} <small>FCFA</small></span>
                    </div>
                    <button class="btn btn-primary btn-sm w-100 fw-bold text-dark mt-auto add-to-cart-btn"
                        style="font-size:0.78rem;" onclick="addToCart('${p.nom.replace(/'/g, "\\'")}', ${p.prix}, '${imgSrc || ''}')">
                        <i class="fa-solid fa-cart-plus me-1"></i>AJOUTER
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

window.handleImgError = function(img, cat) {
    const parent = img.closest('.product-img-container');
    if (parent) {
        img.style.display = 'none';
        parent.style.background = 'linear-gradient(135deg, #2b160c 0%, #4a2818 100%)';
        parent.style.height = '110px';
        parent.classList.add('d-flex', 'align-items-center', 'justify-content-center');
        if (!parent.querySelector('.cat-fallback-icon')) {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'cat-fallback-icon text-center text-white';
            iconDiv.innerHTML = `<span style="font-size:2.8rem;">${catIcons[cat] || '🍞'}</span>`;
            parent.appendChild(iconDiv);
        }
    }
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
