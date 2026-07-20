import json

with open("data/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

for p in products:
    if p["name"] == "Pain de Campagne":
        p["image"] = "assets/paindecampagne.png"
        print("Updated Pain de Campagne image.")
        break

with open("data/products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)
