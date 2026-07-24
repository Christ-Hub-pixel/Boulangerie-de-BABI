const { initDB } = require('./db.js');

const defaultImages = {
    pain: "assets/baguette 150.png",
    viennoiserie: "assets/biscottes.png",
    patisserie: "assets/Gateau1.png",
    jus: "assets/jus de passion.png",
    boisson: "assets/chill.png",
    cafe: "assets/youki moka cafe.png",
    glace: "assets/jus de passion.png",
    snack: "assets/marbre.png"
};

const menuItems = [
    // === BOISSONS ===
    { nom: "Chill", prix: 700, categorie: "boisson", image: "assets/chill.png" },
    { nom: "Youyou", prix: 500, categorie: "boisson", image: "assets/youzou.png" },
    { nom: "Word Cola", prix: 500, categorie: "boisson", image: "assets/world cola.png" },
    { nom: "Youki Orange", prix: 500, categorie: "boisson", image: "assets/youki moka cafe.png" },
    { nom: "Youki Pomme", prix: 500, categorie: "boisson", image: "assets/youki pomme.png" },
    { nom: "Jus Naturel (Petit)", prix: 300, categorie: "jus", image: "assets/jus de baobab petit.png" },
    { nom: "Jus Naturel (Moyen)", prix: 500, categorie: "jus", image: "assets/jus de baobab.png" },
    { nom: "Jus Naturel (Grand)", prix: 2000, categorie: "jus", image: "assets/jus de passion.png" },
    { nom: "Orangina", prix: 500, categorie: "boisson", image: "assets/youki moka cafe.png" },
    { nom: "Sprite", prix: 500, categorie: "boisson", image: "assets/youzou.png" },
    { nom: "Énergie Malt", prix: 700, categorie: "boisson", image: "assets/youki moka cafe.png" },
    { nom: "Eau Minérale (Petite)", prix: 200, categorie: "boisson", image: "assets/bouteille celeste.png" },
    { nom: "Eau Minérale (Grande)", prix: 1000, categorie: "boisson", image: "assets/bouteille celeste.png" },
    { nom: "Dégué", prix: 500, categorie: "boisson", image: "assets/jus de bissap.png" },
    { nom: "Lait", prix: 500, categorie: "boisson", image: "assets/youzou.png" },
    { nom: "Passion (Grand Format)", prix: 3000, categorie: "jus", image: "assets/jus de passion.png" },
    { nom: "Passion (Petite Bouteille)", prix: 700, categorie: "jus", image: "assets/jus de passion.png" },
    { nom: "Baobab", prix: 500, categorie: "jus", image: "assets/jus de baobab.png" },
    { nom: "Bissap", prix: 2000, categorie: "jus", image: "assets/jus de bissap.png" },
    { nom: "Gingembre", prix: 3000, categorie: "jus", image: "assets/jus de gingembre.png" },
    { nom: "Tamarin", prix: 2000, categorie: "jus", image: "assets/jus de tamari.png" },
    { nom: "Cocktail", prix: 3000, categorie: "jus", image: "assets/cocktail.png" },
    { nom: "Citron", prix: 2000, categorie: "jus", image: "assets/jus de citron.png" },
    { nom: "Chocolat Chaud", prix: 3000, categorie: "cafe", image: "assets/youki moka cafe.png" },

    // === BOULANGERIE ===
    { nom: "Baguette 150", prix: 150, categorie: "pain", image: "assets/baguette 150.png" },
    { nom: "Baguette 200", prix: 200, categorie: "pain", image: "assets/baguette 150.png" },
    { nom: "Ficelle", prix: 500, categorie: "pain", image: "assets/baguette 150.png" },
    { nom: "Pain Complet (Grand)", prix: 1000, categorie: "pain", image: "assets/pain complet.png" },
    { nom: "Pain Complet (Petit)", prix: 500, categorie: "pain", image: "assets/pain complet 2.png" },
    { nom: "Pain Sans Sel", prix: 150, categorie: "pain", image: "assets/baguette 150.png" },
    { nom: "Panini", prix: 100, categorie: "snack", image: "assets/marbre.png" },
    { nom: "Petit Pain (50F)", prix: 50, categorie: "pain", image: "assets/pain individuel.png" },
    { nom: "Petit Pain (100F)", prix: 100, categorie: "pain", image: "assets/pain individuel.png" },

    // === PIZZA ===
    { nom: "Mini Pizza", prix: 1000, categorie: "snack", image: "assets/marbre1.png" },
    { nom: "Petit Pizza", prix: 5000, categorie: "snack", image: "assets/marbre1.1.png" },
    { nom: "Grande Pizza", prix: 10000, categorie: "snack", image: "assets/marbre.png" },

    // === VIENNOISERIES ===
    { nom: "Américain", prix: 700, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Biscotte", prix: 1000, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Charaphe au Raisin", prix: 700, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Chausson aux Pommes", prix: 1000, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Choco Suisse", prix: 800, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Cookies (l'unité)", prix: 200, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Croissant", prix: 500, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Escargots", prix: 700, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Flan", prix: 1000, categorie: "patisserie", image: "assets/Gateau1.png" },
    { nom: "Quiche", prix: 500, categorie: "snack", image: "assets/marbre.png" },
    { nom: "Lot de Cookies", prix: 1000, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Pain au Chocolat", prix: 500, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Pain au Lait", prix: 200, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Pain aux Raisins", prix: 700, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Pain Évêque", prix: 800, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Pain Suisse", prix: 800, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Palmiers", prix: 200, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Star Suisse", prix: 800, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Torsade", prix: 800, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Croque-Monsieur", prix: 800, categorie: "snack", image: "assets/marbre1.png" },
    { nom: "Madeleines (l'unité)", prix: 100, categorie: "viennoiserie", image: "assets/biscottes.png" },

    // === GATEAU & CAKE ===
    { nom: "Gâteau (10 000F)", prix: 10000, categorie: "patisserie", image: "assets/Gateau1.png" },
    { nom: "Gâteau (15 000F)", prix: 15000, categorie: "patisserie", image: "assets/Gateau1.1.png" },
    { nom: "Gâteau (20 000F)", prix: 20000, categorie: "patisserie", image: "assets/Gateau1.2.png" },
    { nom: "Gâteau (25 000F)", prix: 25000, categorie: "patisserie", image: "assets/gateau2.png" },
    { nom: "Bûche de Noël (7000F)", prix: 7000, categorie: "patisserie", image: "assets/Gateau1.png" },
    { nom: "Bûche de Noël (5000F)", prix: 5000, categorie: "patisserie", image: "assets/Gateau1.1.png" },
    { nom: "Moka", prix: 1500, categorie: "patisserie", image: "assets/moka1.png" },
    { nom: "Lot de Madeleines", prix: 500, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Madeleine", prix: 100, categorie: "viennoiserie", image: "assets/biscottes.png" },
    { nom: "Cup Cake", prix: 500, categorie: "patisserie", image: "assets/moka1.1.png" },
    { nom: "Cake (300F)", prix: 300, categorie: "patisserie", image: "assets/cake.png" },
    { nom: "Cake (700F)", prix: 700, categorie: "patisserie", image: "assets/cake1.png" },

    // === DESSERT ===
    { nom: "Crêpe au Nutella", prix: 2000, categorie: "patisserie", image: "assets/moka1.png" },
    { nom: "Crêpe à la Vanille", prix: 1500, categorie: "patisserie", image: "assets/moka1.1.png" },
    { nom: "Crêpe Suzette", prix: 1500, categorie: "patisserie", image: "assets/moka1.2.png" },
    { nom: "Fondant au Chocolat", prix: 1000, categorie: "patisserie", image: "assets/Gateau1.png" },
    { nom: "Glace", prix: 1000, categorie: "glace", image: "assets/jus de passion.png" },

    // === PAINS SPECIAUX ===
    { nom: "Pain Cabré", prix: 700, categorie: "pain", image: "assets/marbre.png" },
    { nom: "Pain Breton", prix: 700, categorie: "pain", image: "assets/marbre1.png" },
    { nom: "Pain Délice", prix: 700, categorie: "pain", image: "assets/marbre1.1.png" },
    { nom: "Pain Marbré", prix: 500, categorie: "pain", image: "assets/marbre.png" },
    { nom: "Pain Amour", prix: 1000, categorie: "pain", image: "assets/pain complet.png" },
    { nom: "Pain Canadien", prix: 700, categorie: "pain", image: "assets/pain complet 3.png" },
    { nom: "Pain de Mie", prix: 2000, categorie: "pain", image: "assets/pain de mie.png" },
    { nom: "Pain Parisien", prix: 300, categorie: "pain", image: "assets/baguette 150.png" },
    { nom: "Pain Viennois (500F)", prix: 500, categorie: "pain", image: "assets/marbre.png" },
    { nom: "Pain Viennois (700F)", prix: 700, categorie: "pain", image: "assets/marbre1.png" },
    { nom: "Suzette", prix: 300, categorie: "pain", image: "assets/pain individuel.png" },
    { nom: "Brioche à la Viande", prix: 800, categorie: "snack", image: "assets/marbre.png" },
    { nom: "Feuilleté", prix: 800, categorie: "snack", image: "assets/marbre1.png" }
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
        console.log(`${menuItems.length} produits importés avec les images DIRECTES du dossier assets/ dans SQLite !`);
    } catch (err) {
        console.error("Erreur :", err);
    }
}

updateDatabase();
