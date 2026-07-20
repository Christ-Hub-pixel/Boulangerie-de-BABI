import json

with open("data/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

for p in products:
    if p["name"] == "Pain Viennois":
        p["image"] = "assets/🍫 Pain viennois (aux pépites de chocolat ou nature).png"

with open("data/products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)

print("Pain viennois image updated!")
