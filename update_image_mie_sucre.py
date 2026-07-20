import json

with open("data/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

for p in products:
    if p["name"] == "Pain de Mie":
        p["image"] = "assets/paindemie.png"
    elif p["name"] == "Pain Sucré":
        p["image"] = "assets/painsucre.png"

with open("data/products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print("Pain de Mie and Pain Sucré images updated!")
