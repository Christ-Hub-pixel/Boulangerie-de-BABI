import json

with open("data/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

for p in products:
    if p["id"] == "1":
        p["image"] = "assets/Baguettetraditionnel.png"
    elif p["id"] == "2":
        p["image"] = "assets/Baguette classiquestandard.png"

# Add Ciabatta
ciabatta = {
    "id": "41",
    "name": "Pain Ciabatta",
    "price": 600,
    "description": "Pain italien à la mie très alvéolée et croûte croustillante.",
    "image": "assets/La ciabatta.png",
    "rating": 4.8,
    "reviews": 34,
    "category": "Pains",
    "badge": "NOUVEAU"
}
products.insert(2, ciabatta) # insert after the baguettes

with open("data/products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print("Images updated in catalog!")
