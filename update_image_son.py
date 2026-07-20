import json

with open("data/products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

# The user list had "Pain au son / Pain au seigle". 
# Did I add it in the first generate script? Let's check.
found = False
for p in products:
    if "son" in p["name"].lower() or "seigle" in p["name"].lower():
        p["image"] = "assets/painauson.png"
        found = True
        break

if not found:
    # Let's just create it and add it to Pains
    new_product = {
        "id": str(len(products) + 2), # Unique ID
        "name": "Pain au Son",
        "price": 600,
        "description": "Pain rustique, riche en fibres pour une digestion légère.",
        "image": "assets/painauson.png",
        "rating": 4.7,
        "reviews": 40,
        "category": "Pains"
    }
    products.insert(4, new_product)
    print("Created Pain au Son and added image.")
else:
    print("Updated existing Pain au Son image.")

with open("data/products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=4, ensure_ascii=False)
