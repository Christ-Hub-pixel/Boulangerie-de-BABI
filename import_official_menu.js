const { initDB } = require('./db.js');

const defaultImages = {
    pain: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    viennoiserie: "https://images.unsplash.com/photo-1555507036-ab1e4006aaeb?auto=format&fit=crop&w=400&q=80",
    patisserie: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    jus: "https://images.unsplash.com/photo-1622597467836-f38240662f53?auto=format&fit=crop&w=400&q=80",
    boisson: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80",
    cafe: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    glace: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    snack: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80"
};

const menuItems = [
    // === BOISSONS ===
    { nom: "Chill", prix: 700, categorie: "boisson" },
    { nom: "Youyou", prix: 500, categorie: "boisson" },
    { nom: "Word Cola", prix: 500, categorie: "boisson" },
    { nom: "Youki Orange", prix: 500, categorie: "boisson" },
    { nom: "Youki Pomme", prix: 500, categorie: "boisson" },
    { nom: "Jus Naturel (Petit)", prix: 300, categorie: "jus" },
    { nom: "Jus Naturel (Moyen)", prix: 500, categorie: "jus" },
    { nom: "Jus Naturel (Grand)", prix: 2000, categorie: "jus" },
    { nom: "Orangina", prix: 500, categorie: "boisson" },
    { nom: "Sprite", prix: 500, categorie: "boisson" },
    { nom: "Énergie Malt", prix: 700, categorie: "boisson" },
    { nom: "Eau Minérale (Petite)", prix: 200, categorie: "boisson" },
    { nom: "Eau Minérale (Grande)", prix: 1000, categorie: "boisson" },
    { nom: "Dégué", prix: 500, categorie: "boisson" },
    { nom: "Lait", prix: 500, categorie: "boisson" },
    { nom: "Passion (Grand Format)", prix: 3000, categorie: "jus" },
    { nom: "Passion (Petite Bouteille)", prix: 700, categorie: "jus" },
    { nom: "Baobab", prix: 500, categorie: "jus" },
    { nom: "Bissap", prix: 2000, categorie: "jus" },
    { nom: "Gingembre", prix: 3000, categorie: "jus" },
    { nom: "Tamarin", prix: 2000, categorie: "jus" },
    { nom: "Cocktail", prix: 3000, categorie: "jus" },
    { nom: "Citron", prix: 2000, categorie: "jus" },
    { nom: "Chocolat Chaud", prix: 3000, categorie: "cafe" },

    // === BOULANGERIE ===
    { nom: "Baguette 150", prix: 150, categorie: "pain" },
    { nom: "Baguette 200", prix: 200, categorie: "pain" },
    { nom: "Ficelle", prix: 500, categorie: "pain" },
    { nom: "Pain Complet (Grand)", prix: 1000, categorie: "pain" },
    { nom: "Pain Complet (Petit)", prix: 500, categorie: "pain" },
    { nom: "Pain Sans Sel", prix: 150, categorie: "pain" },
    { nom: "Panini", prix: 100, categorie: "snack" },
    { nom: "Petit Pain (50F)", prix: 50, categorie: "pain" },
    { nom: "Petit Pain (100F)", prix: 100, categorie: "pain" },

    // === PIZZA ===
    { nom: "Mini Pizza", prix: 1000, categorie: "snack" },
    { nom: "Petit Pizza", prix: 5000, categorie: "snack" },
    { nom: "Grande Pizza", prix: 10000, categorie: "snack" },

    // === VIENNOISERIES ===
    { nom: "Américain", prix: 700, categorie: "viennoiserie" },
    { nom: "Biscotte", prix: 1000, categorie: "viennoiserie" },
    { nom: "Charaphe au Raisin", prix: 700, categorie: "viennoiserie" },
    { nom: "Chausson aux Pommes", prix: 1000, categorie: "viennoiserie" },
    { nom: "Choco Suisse", prix: 800, categorie: "viennoiserie" },
    { nom: "Cookies (l'unité)", prix: 200, categorie: "viennoiserie" },
    { nom: "Croissant", prix: 500, categorie: "viennoiserie" },
    { nom: "Escargots", prix: 700, categorie: "viennoiserie" },
    { nom: "Flan", prix: 1000, categorie: "patisserie" },
    { nom: "Quiche", prix: 500, categorie: "snack" },
    { nom: "Lot de Cookies", prix: 1000, categorie: "viennoiserie" },
    { nom: "Pain au Chocolat", prix: 500, categorie: "viennoiserie" },
    { nom: "Pain au Lait", prix: 200, categorie: "viennoiserie" },
    { nom: "Pain aux Raisins", prix: 700, categorie: "viennoiserie" },
    { nom: "Pain Évêque", prix: 800, categorie: "viennoiserie" },
    { nom: "Pain Suisse", prix: 800, categorie: "viennoiserie" },
    { nom: "Palmiers", prix: 200, categorie: "viennoiserie" },
    { nom: "Star Suisse", prix: 800, categorie: "viennoiserie" },
    { nom: "Torsade", prix: 800, categorie: "viennoiserie" },
    { nom: "Croque-Monsieur", prix: 800, categorie: "snack" },
    { nom: "Madeleines (l'unité)", prix: 100, categorie: "viennoiserie" },

    // === GATEAU & CAKE ===
    { nom: "Gâteau (10 000F)", prix: 10000, categorie: "patisserie" },
    { nom: "Gâteau (15 000F)", prix: 15000, categorie: "patisserie" },
    { nom: "Gâteau (20 000F)", prix: 20000, categorie: "patisserie" },
    { nom: "Gâteau (25 000F)", prix: 25000, categorie: "patisserie" },
    { nom: "Bûche de Noël (7000F)", prix: 7000, categorie: "patisserie" },
    { nom: "Bûche de Noël (5000F)", prix: 5000, categorie: "patisserie" },
    { nom: "Moka", prix: 1500, categorie: "patisserie" },
    { nom: "Lot de Madeleines", prix: 500, categorie: "viennoiserie" },
    { nom: "Madeleine", prix: 100, categorie: "viennoiserie" },
    { nom: "Cup Cake", prix: 500, categorie: "patisserie" },
    { nom: "Cake (300F)", prix: 300, categorie: "patisserie" },
    { nom: "Cake (700F)", prix: 700, categorie: "patisserie" },

    // === DESSERT ===
    { nom: "Crêpe au Nutella", prix: 2000, categorie: "patisserie" },
    { nom: "Crêpe à la Vanille", prix: 1500, categorie: "patisserie" },
    { nom: "Crêpe Suzette", prix: 1500, categorie: "patisserie" },
    { nom: "Fondant au Chocolat", prix: 1000, categorie: "patisserie" },
    { nom: "Glace", prix: 1000, categorie: "glace" },

    // === PAINS SPECIAUX ===
    { nom: "Pain Cabré", prix: 700, categorie: "pain" },
    { nom: "Pain Breton", prix: 700, categorie: "pain" },
    { nom: "Pain Délice", prix: 700, categorie: "pain" },
    { nom: "Pain Marbré", prix: 500, categorie: "pain" },
    { nom: "Pain Amour", prix: 1000, categorie: "pain" },
    { nom: "Pain Canadien", prix: 700, categorie: "pain" },
    { nom: "Pain de Mie", prix: 2000, categorie: "pain" },
    { nom: "Pain Parisien", prix: 300, categorie: "pain" },
    { nom: "Pain Viennois (500F)", prix: 500, categorie: "pain" },
    { nom: "Pain Viennois (700F)", prix: 700, categorie: "pain" },
    { nom: "Suzette", prix: 300, categorie: "pain" },
    { nom: "Brioche à la Viande", prix: 800, categorie: "snack" },
    { nom: "Feuilleté", prix: 800, categorie: "snack" }
];

async function updateDatabase() {
    try {
        const db = await initDB();
        await db.run("DELETE FROM products");

        for (let p of menuItems) {
            const img = p.image || defaultImages[p.categorie] || defaultImages['pain'];
            await db.run(
                "INSERT INTO products (nom, prix, categorie, image) VALUES (?, ?, ?, ?)",
                [p.nom, p.prix, p.categorie, img]
            );
        }
        console.log(`${menuItems.length} produits importés avec des images haute qualité !`);
    } catch (err) {
        console.error("Erreur :", err);
    }
}

updateDatabase();
