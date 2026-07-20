import json
import os

catalog = [
    # 1. Pains
    {"id": "1", "name": "Baguette Tradition", "price": 200, "description": "Pain croustillant à l'extérieur et moelleux à l'intérieur.", "image": "assets/product_baguette.png", "rating": 4.8, "reviews": 120, "category": "Pains", "badge": "-20%"},
    {"id": "2", "name": "Baguette Classique", "price": 150, "description": "La baguette de tous les jours.", "image": "assets/product_baguette.png", "rating": 4.5, "reviews": 340, "category": "Pains"},
    {"id": "3", "name": "Batard", "price": 300, "description": "Pain français à mie alvéolée et croûte dorée.", "image": "assets/product_batard.png", "rating": 4.6, "reviews": 52, "category": "Pains"},
    {"id": "4", "name": "Pain de Campagne", "price": 500, "description": "Pain rustique au levain naturel.", "image": "assets/product_campagne.png", "rating": 4.7, "reviews": 45, "category": "Pains"},
    {"id": "5", "name": "Pain Complet", "price": 500, "description": "Riche en fibres et en goût pour votre bien-être.", "image": "assets/product_complet.png", "rating": 4.6, "reviews": 64, "category": "Pains"},
    {"id": "6", "name": "Pain de Mie", "price": 1000, "description": "Moelleux et parfait pour vos petits-déjeuners.", "image": "assets/product_pain_mie.png", "rating": 4.8, "reviews": 110, "category": "Pains"},
    {"id": "7", "name": "Pain Sucré", "price": 200, "description": "Le fameux pain sucré ivoirien, doux et brioché.", "image": "assets/logo.png", "rating": 4.9, "reviews": 500, "category": "Pains", "badge": "POPULAIRE"},
    {"id": "8", "name": "Pain Viennois", "price": 400, "description": "Pain moelleux aux pépites de chocolat.", "image": "assets/product_brioche.png", "rating": 4.5, "reviews": 75, "category": "Pains"},
    {"id": "9", "name": "Pain Hamburger (x4)", "price": 1000, "description": "Pains ronds extra moelleux pour vos burgers.", "image": "assets/logo.png", "rating": 4.4, "reviews": 30, "category": "Pains"},
    {"id": "10", "name": "Fougasse aux Olives", "price": 600, "description": "Pain plat parfumé à l'huile d'olive et garni.", "image": "assets/logo.png", "rating": 4.3, "reviews": 22, "category": "Pains"},
    
    # 2. Viennoiseries
    {"id": "11", "name": "Croissant au beurre", "price": 400, "description": "Croissant pur beurre doré et feuilleté.", "image": "assets/product_croissant.png", "rating": 4.9, "reviews": 98, "category": "Viennoiseries"},
    {"id": "12", "name": "Pain au Chocolat", "price": 500, "description": "Feuilleté au beurre avec chocolat fondant.", "image": "assets/product_pain_choc.png", "rating": 4.7, "reviews": 86, "category": "Viennoiseries"},
    {"id": "13", "name": "Pain aux Raisins", "price": 500, "description": "Escargot brioché à la crème pâtissière et raisins secs.", "image": "assets/logo.png", "rating": 4.6, "reviews": 40, "category": "Viennoiseries"},
    {"id": "14", "name": "Chausson aux Pommes", "price": 500, "description": "Pâte feuilletée fourrée à la compote de pommes.", "image": "assets/logo.png", "rating": 4.8, "reviews": 55, "category": "Viennoiseries"},
    {"id": "15", "name": "Brioche Tressée", "price": 1500, "description": "Grande brioche moelleuse familiale.", "image": "assets/product_brioche.png", "rating": 4.7, "reviews": 60, "category": "Viennoiseries"},
    {"id": "16", "name": "Croissant aux Amandes", "price": 600, "description": "Garni de crème d'amande fondante.", "image": "assets/product_croissant.png", "rating": 4.9, "reviews": 112, "category": "Viennoiseries", "badge": "FAVORI"},
    {"id": "17", "name": "Pain au Lait", "price": 150, "description": "Petit pain au lait doux et moelleux.", "image": "assets/logo.png", "rating": 4.5, "reviews": 80, "category": "Viennoiseries"},
    
    # 3. Pâtisseries
    {"id": "18", "name": "Mille-Feuille", "price": 1500, "description": "Trois couches de pâte feuilletée et crème pâtissière.", "image": "assets/product_mille_feuille.png", "rating": 4.8, "reviews": 70, "category": "Pâtisseries"},
    {"id": "19", "name": "Éclair au Chocolat", "price": 1000, "description": "Pâte à choux fondante et glaçage brillant.", "image": "assets/product_eclair_chocolat.png", "rating": 4.7, "reviews": 90, "category": "Pâtisseries"},
    {"id": "20", "name": "Tartelette aux Fraises", "price": 1200, "description": "Pâte sablée, crème légère et fraises fraîches.", "image": "assets/product_tarte_fraises.png", "rating": 4.9, "reviews": 150, "category": "Pâtisseries"},
    {"id": "21", "name": "Forêt Noire (Part)", "price": 1500, "description": "Génoise cacao, chantilly et cerises.", "image": "assets/product_foret_noire.png", "rating": 4.8, "reviews": 85, "category": "Pâtisseries"},
    {"id": "22", "name": "Entremet Chocolat Caramel", "price": 2700, "description": "Mousse légère et cœur coulant caramel.", "image": "assets/product_entremet.png", "rating": 5.0, "reviews": 45, "category": "Pâtisseries", "badge": "NOUVEAU"},
    {"id": "23", "name": "Macarons (Boîte de 6)", "price": 4000, "description": "Assortiment de macarons parfumés.", "image": "assets/logo.png", "rating": 4.7, "reviews": 110, "category": "Pâtisseries"},
    {"id": "24", "name": "Flan Pâtissier", "price": 1000, "description": "Délicieux flan à la vanille bourbon.", "image": "assets/logo.png", "rating": 4.6, "reviews": 65, "category": "Pâtisseries"},
    
    # 4. Traiteur / Salé
    {"id": "25", "name": "Croque-Monsieur", "price": 1200, "description": "Pain de mie, jambon de dinde, fromage gratiné.", "image": "assets/logo.png", "rating": 4.5, "reviews": 55, "category": "Traiteur"},
    {"id": "26", "name": "Friand à la Viande", "price": 700, "description": "Feuilleté garni de viande hachée assaisonnée.", "image": "assets/logo.png", "rating": 4.8, "reviews": 200, "category": "Traiteur"},
    {"id": "27", "name": "Pâté Ivoirien Viande", "price": 500, "description": "Le fameux pâté cuit au four, croquant et épicé.", "image": "assets/logo.png", "rating": 4.9, "reviews": 320, "category": "Traiteur", "badge": "POPULAIRE"},
    {"id": "28", "name": "Quiche Lorraine", "price": 1500, "description": "Tarte salée savoureuse.", "image": "assets/logo.png", "rating": 4.6, "reviews": 40, "category": "Traiteur"},
    {"id": "29", "name": "Sandwich Poulet Mayo", "price": 1500, "description": "Demi-baguette, poulet effiloché, mayonnaise, crudités.", "image": "assets/product_sandwich.png", "rating": 4.8, "reviews": 130, "category": "Traiteur"},
    {"id": "30", "name": "Shawarma Viande", "price": 2000, "description": "Pain libanais garni de viande grillée et de légumes.", "image": "assets/logo.png", "rating": 4.7, "reviews": 90, "category": "Traiteur"},
    {"id": "31", "name": "Mini-Pizza", "price": 800, "description": "Pizza individuelle fromage, jambon, olives.", "image": "assets/logo.png", "rating": 4.5, "reviews": 115, "category": "Traiteur"},
    
    # 5. Boissons (Jus Locaux & Chaudes)
    {"id": "32", "name": "Jus de Bissap (0.5L)", "price": 500, "description": "Jus d'hibiscus rafraîchissant, sucré et parfumé.", "image": "assets/product_jus_bissap.png", "rating": 4.9, "reviews": 400, "category": "Boissons"},
    {"id": "33", "name": "Gnamakoudji (0.5L)", "price": 500, "description": "Jus de gingembre tonifiant.", "image": "assets/logo.png", "rating": 4.8, "reviews": 250, "category": "Boissons"},
    {"id": "34", "name": "Jus de Passion (0.5L)", "price": 1000, "description": "Jus naturel de fruits de la passion.", "image": "assets/logo.png", "rating": 4.7, "reviews": 120, "category": "Boissons"},
    {"id": "35", "name": "Jus de Baobab", "price": 800, "description": "Jus onctueux au pain de singe.", "image": "assets/logo.png", "rating": 4.6, "reviews": 90, "category": "Boissons"},
    {"id": "36", "name": "Jus d'Ananas Pressé", "price": 1000, "description": "100% pur jus d'ananas frais.", "image": "assets/product_jus_ananas.png", "rating": 4.9, "reviews": 130, "category": "Boissons"},
    {"id": "37", "name": "Jus d'Orange Frais", "price": 1200, "description": "Oranges pressées sur place.", "image": "assets/product_jus_orange.png", "rating": 4.8, "reviews": 95, "category": "Boissons"},
    {"id": "38", "name": "Café Expresso", "price": 500, "description": "Un shot de café intense.", "image": "assets/product_cafe_expresso.png", "rating": 4.7, "reviews": 180, "category": "Boissons"},
    {"id": "39", "name": "Cappuccino", "price": 1500, "description": "Espresso, lait chaud et mousse onctueuse.", "image": "assets/product_cappuccino.png", "rating": 4.9, "reviews": 110, "category": "Boissons"},
    {"id": "40", "name": "Chocolat Chaud", "price": 1500, "description": "Chocolat au lait riche et réconfortant.", "image": "assets/logo.png", "rating": 4.8, "reviews": 140, "category": "Boissons"}
]

json_path = "data/products.json"
os.makedirs("data", exist_ok=True)
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=4, ensure_ascii=False)
print("products.json updated with 40 products!")
