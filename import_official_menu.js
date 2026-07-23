const fs = require('fs');
const path = require('path');
const { initDB } = require('./db.js');

const menuItems = [
    // BOISSONS
    { nom: "Chill", prix: 700, categorie: "boisson", image: "assets/processed_products/IMG20260722121307.jpg" },
    { nom: "Youyou", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Word Cola", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Youki Orange", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Youki Pomme", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Jus Naturel (Petit / Moyen / Grand)", prix: 500, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Orangina", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Sprite", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Énergie Malt", prix: 700, categorie: "boisson", image: "assets/product_cappuccino.png" },
    { nom: "Eau Minérale", prix: 500, categorie: "boisson", image: "assets/product_jus_orange.png" },
    { nom: "Dégué", prix: 500, categorie: "boisson", image: "assets/product_jus_bissap.png" },
    { nom: "Lait", prix: 500, categorie: "boisson", image: "assets/product_cappuccino.png" },
    { nom: "Jus de Passion (Grand format)", prix: 3000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Jus de Passion (Petite bouteille)", prix: 700, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Jus de Baobab", prix: 500, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Jus de Bissap", prix: 2000, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Jus de Gingembre", prix: 3000, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Jus de Tamarin", prix: 2000, categorie: "jus", image: "assets/product_jus_bissap.png" },
    { nom: "Cocktail de Jus", prix: 3000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Jus de Citron", prix: 2000, categorie: "jus", image: "assets/product_jus_ananas.png" },
    { nom: "Chocolat Chaud", prix: 3000, categorie: "cafe", image: "assets/product_chocolat.png" },

    // BOULANGERIE
    { nom: "Baguette Standard", prix: 150, categorie: "pain", image: "assets/Baguette classiquestandard.png" },
    { nom: "Baguette Traditionnelle", prix: 200, categorie: "pain", image: "assets/Baguettetraditionnel.png" },
    { nom: "Ficelle", prix: 500, categorie: "pain", image: "assets/product_batard.png" },
    { nom: "Pain Complet (Grand)", prix: 1000, categorie: "pain", image: "assets/product_complet.png" },
    { nom: "Pain Complet (Petit)", prix: 500, categorie: "pain", image: "assets/product_complet.png" },
    { nom: "Pain Sans Sel", prix: 150, categorie: "pain", image: "assets/product_baguette.png" },
    { nom: "Panini", prix: 100, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Petit Pain", prix: 100, categorie: "pain", image: "assets/product_baguette.png" },

    // PIZZA
    { nom: "Mini Pizza", prix: 1000, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Petit Pizza", prix: 5000, categorie: "snack", image: "assets/product_sandwich.png" },
    { nom: "Grande Pizza", prix: 10000, categorie: "snack", image: "assets/product_sandwich.png" },

    // VIENNOISERIES
    { nom: "Américain", prix: 700, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Biscotte", prix: 1000, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Charaphe au Raisin", prix: 700, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Chausson aux Pommes", prix: 1000, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Choco Suisse", prix: 800, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Cookies (l'unité)", prix: 200, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Croissant au Beurre", prix: 500, categorie: "viennoiserie", image: "assets/product_croissant.png" },
    { nom: "Escargots", prix: 700, categorie: "viennoiserie", image: "assets/product_pain_choc.png" },
    { nom: "Flan Pâtissier", prix: 1000, categorie: "patisserie", image: "assets/product_tarte_fraises.png" },
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
    { nom: "Madeleines (l'unité)", prix: 100, categorie: "viennoiserie", image: "assets/product_brioche.png" },

    // GÂTEAU & CAKE
    { nom: "Gâteau (10 Personnes)", prix: 10000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Gâteau (15 Personnes)", prix: 15000, categorie: "patisserie", image: "assets/product_entremet.png" },
    { nom: "Gâteau (20 Personnes)", prix: 20000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Gâteau (25 Personnes)", prix: 25000, categorie: "patisserie", image: "assets/product_entremet.png" },
    { nom: "Bûche de Noël", prix: 7000, categorie: "patisserie", image: "assets/product_foret_noire.png" },
    { nom: "Moka", prix: 1500, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Lot de Madeleines", prix: 500, categorie: "viennoiserie", image: "assets/product_brioche.png" },
    { nom: "Cup Cake", prix: 500, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Cake", prix: 700, categorie: "patisserie", image: "assets/product_brioche.png" },

    // DESSERT
    { nom: "Crêpe au Nutella", prix: 2000, categorie: "patisserie", image: "assets/product_mille_feuille.png" },
    { nom: "Fondant au Chocolat", prix: 1000, categorie: "patisserie", image: "assets/product_chocolat.png" },
    { nom: "Glace Artisanale", prix: 1000, categorie: "glace", image: "assets/product_glace.png" },

    // PAINS SPÉCIAUX
    { nom: "Pain Cabre", prix: 700, categorie: "pain", image: "assets/paindecampagne.png" },
    { nom: "Pain Breton", prix: 700, categorie: "pain", image: "assets/paindecampagne.png" },
    { nom: "Pain Délice", prix: 700, categorie: "pain", image: "assets/product_campagne.png" },
    { nom: "Pain Marbré", prix: 500, categorie: "pain", image: "assets/product_cereal.png" },
    { nom: "Pain Amour", prix: 1000, categorie: "pain", image: "assets/paindecampagne.png" },
    { nom: "Pain Canadien", prix: 700, categorie: "pain", image: "assets/product_cereal.png" },
    { nom: "Pain de Mie", prix: 2000, categorie: "pain", image: "assets/paindemie.png" },
    { nom: "Pain Parisien", prix: 300, categorie: "pain", image: "assets/Baguette classiquestandard.png" },
    { nom: "Pain Viennois", prix: 700, categorie: "pain", image: "assets/🍫 Pain viennois (aux pépites de chocolat ou nature).png" },
    { nom: "Pain Suzette", prix: 300, categorie: "pain", image: "assets/painsucre.png" }
];

async function updateDatabase() {
    try {
        const db = await initDB();
        await db.run("DELETE FROM products");
        console.log("Anciens produits nettoyés.");

        for (let p of menuItems) {
            await db.run("INSERT INTO products (nom, prix, categorie, image) VALUES (?, ?, ?, ?)", [p.nom, p.prix, p.categorie, p.image]);
        }
        console.log(`Initialisé ${menuItems.length} produits du Menu Officiel dans la base de données SQLite avec succès !`);
    } catch (err) {
        console.error("Erreur lors de l'importation du menu :", err);
    }
}

updateDatabase();
