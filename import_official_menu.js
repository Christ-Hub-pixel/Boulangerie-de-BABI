const { initDB } = require('./db.js');

const menuItems = [
    // === BOISSONS ===
    { nom: "Chill", prix: 700, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Youyou", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Word Cola", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Youki Orange", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Youki Pomme", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Jus Naturel (Petit)", prix: 300, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Jus Naturel (Moyen)", prix: 500, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Jus Naturel (Grand)", prix: 2000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Orangina", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Sprite", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Énergie Malt", prix: 700, categorie: "boisson", image: "assets/product_cappuccino.png" },
    { nom: "Eau Minérale (Petite)", prix: 200, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Eau Minérale (Grande)", prix: 1000, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Dégué", prix: 500, categorie: "boisson", image: "assets/product_jus_bissap.png" },
    { nom: "Lait", prix: 500, categorie: "boisson", image: "assets/product_cappuccino.png" },
    { nom: "Passion (Grand Format)", prix: 3000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Passion (Petite Bouteille)", prix: 700, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Baobab", prix: 500, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Bissap", prix: 2000, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Gingembre", prix: 3000, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Tamarin", prix: 2000, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Cocktail", prix: 3000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Citron", prix: 2000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Chocolat Chaud", prix: 3000, categorie: "cafe", image: "assets/product_chocolat.png" },

    // === BOULANGERIE ===
    { nom: "Baguette 150", prix: 150, categorie: "pain", image: "assets/Baguette classiquestandard.png" },
    { nom: "Baguette 200", prix: 200, categorie: "pain", image: "assets/Baguettetraditionnel.png" },
    { nom: "Ficelle", prix: 500, categorie: "pain", image: "assets/product_batard.png" },
    { nom: "Pain Complet (Grand)", prix: 1000, categorie: "pain", image: "assets/product_complet.png" },
    { nom: "Pain Complet (Petit)", prix: 500, categorie: "pain", image: "assets/product_complet.png" },
    { nom: "Pain Sans Sel", prix: 150, categorie: "pain", image: "assets/product_baguette.png" },
    { nom: "Panini", prix: 100, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Petit Pain (50F)", prix: 50, categorie: "pain", image: "assets/product_baguette.png" },
    { nom: "Petit Pain (100F)", prix: 100, categorie: "pain", image: "assets/product_baguette.png" },

    // === PIZZA ===
    { nom: "Mini Pizza", prix: 1000, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Petit Pizza", prix: 5000, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Grande Pizza", prix: 10000, categorie: "snack", image: "assets/product_sandwich.png" },

    // === VIENNOISERIES ===
    { nom: "Américain", prix: 700, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Biscotte", prix: 1000, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Charaphe au Raisin", prix: 700, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Chausson aux Pommes", prix: 1000, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Choco Suisse", prix: 800, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Cookies (l'unité)", prix: 200, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Croissant", prix: 500, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Escargots", prix: 700, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Flan", prix: 1000, categorie: "patisserie", image: "assets/product_tarte_fraises.png" },
    { nom: "Quiche", prix: 500, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Lot de Cookies", prix: 1000, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Pain au Chocolat", prix: 500, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Pain au Lait", prix: 200, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Pain aux Raisins", prix: 700, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Pain Évêque", prix: 800, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Pain Suisse", prix: 800, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Palmiers", prix: 200, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Star Suisse", prix: 800, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Torsade", prix: 800, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Croque-Monsieur", prix: 800, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Madeleines (l'unité)", prix: 100, categorie: "viennoiserie", image: "assets/product_brioche.png" },

    // === GATEAU & CAKE ===
    { nom: "Gâteau (10 000F)", prix: 10000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Gâteau (15 000F)", prix: 15000, categorie: "patisserie", image: "assets/product_entremet.png" },
    { nom: "Gâteau (20 000F)", prix: 20000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Gâteau (25 000F)", prix: 25000, categorie: "patisserie", image: "assets/product_entremet.png" },
    { nom: "Bûche de Noël (7000F)", prix: 7000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Bûche de Noël (5000F)", prix: 5000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Moka", prix: 1500, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Lot de Madeleines", prix: 500, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Madeleine", prix: 100, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Cup Cake", prix: 500, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Cake (300F)", prix: 300, categorie: "patisserie", image: "assets/product_brioche.png" },
    { nom: "Cake (700F)", prix: 700, categorie: "patisserie", image: "assets/product_brioche.png" },

    // === DESSERT ===
    { nom: "Crêpe au Nutella", prix: 2000, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Crêpe à la Vanille", prix: 1500, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Crêpe Suzette", prix: 1500, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Fondant au Chocolat", prix: 1000, categorie: "patisserie", image: "assets/product_chocolat.png" },
    { nom: "Glace", prix: 1000, categorie: "glace", image: "assets/product_glace.png" },

    // === PAINS SPECIAUX ===
    { nom: "Pain Cabré", prix: 700, categorie: "pain", image: "assets/paindecampagne.png" },
    { nom: "Pain Breton", prix: 700, categorie: "pain", image: "assets/paindecampagne.png" },
    { nom: "Pain Délice", prix: 700, categorie: "pain", image: "assets/product_campagne.png" },
    { nom: "Pain Marbré", prix: 500, categorie: "pain", image: "assets/product_cereal.png" },
    { nom: "Pain Amour", prix: 1000, categorie: "pain", image: "assets/paindecampagne.png" },
    { nom: "Pain Canadien", prix: 700, categorie: "pain", image: "assets/product_cereal.png" },
    { nom: "Pain de Mie", prix: 2000, categorie: "pain", image: "assets/paindemie.png" },
    { nom: "Pain Parisien", prix: 300, categorie: "pain", image: "assets/Baguette classiquestandard.png" },
    { nom: "Pain Viennois (500F)", prix: 500, categorie: "pain", image: "assets/product_brioche.png" },
    { nom: "Pain Viennois (700F)", prix: 700, categorie: "pain", image: "assets/product_brioche.png" },
    { nom: "Suzette", prix: 300, categorie: "pain", image: "assets/painsucre.png" },
    { nom: "Brioche à la Viande", prix: 800, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Feuilleté", prix: 800, categorie: "snack", image: "assets/product_sandwich.png" }
];

async function updateDatabase() {
    try {
        const db = await initDB();
        await db.run("DELETE FROM products");
        console.log("Anciens produits supprimés.");

        for (let p of menuItems) {
            await db.run(
                "INSERT INTO products (nom, prix, categorie, image) VALUES (?, ?, ?, ?)",
                [p.nom, p.prix, p.categorie, p.image]
            );
        }
        console.log(`${menuItems.length} produits du menu officiel importés avec succès !`);
    } catch (err) {
        console.error("Erreur :", err);
    }
}

updateDatabase();
