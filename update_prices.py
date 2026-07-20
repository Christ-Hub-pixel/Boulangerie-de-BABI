import os
import re

price_map = {
    "Baguette Tradition": 200,
    "Croissant au beurre": 400,
    "Pain au chocolat": 500,
    "Pain complet": 500,
    "Batard": 300,
    "Pain de mie": 1000
}

html_files = ["index.html", "produits.html"]

for html_file in html_files:
    if not os.path.exists(html_file):
        continue
        
    with open(html_file, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Update data-price attribute on Add to Cart buttons
    for prod_name, new_price in price_map.items():
        # match: data-name="Baguette Tradition" data-price="400"
        pattern = re.compile(rf'(data-name="{prod_name}"\s+data-price=")\d+(")', re.IGNORECASE)
        content = pattern.sub(rf'\g<1>{new_price}\g<2>', content)

    # 2. Update visible prices in cards
    # We look for the product name in an h6 tag, then look for the next digits before FCFA
    # Actually, let's just do a string replace for known blocks if possible.
    # Or, we just use re.sub with a lookbehind-like approach.
    for prod_name, new_price in price_map.items():
        # Match <h6 ...>Product Name</h6> ... <span class="...">400 FCFA</span>
        # or 400 <small>FCFA</small>
        pattern = re.compile(rf'(<h6[^>]*>\s*{re.escape(prod_name)}\s*</h6>.*?)(>)\s*\d+\s*(<small>FCFA</small>|FCFA)', re.IGNORECASE | re.DOTALL)
        # Wait, the `>` could be `class="fw-bold fs-5 text-dark">400 FCFA`
        # Let's replace the first digit sequence after the h6 that's followed by FCFA
        def replace_price(match):
            text = match.group(0)
            # Find the last digits in this matched string (which should be the price)
            return re.sub(r'\d+\s*(<small>FCFA</small>|FCFA)$', f'{new_price} \\1', text)
            
        content = pattern.sub(replace_price, content)

    # 3. Update the Promo Banner
    promo_pattern1 = re.compile(r'(<span class="new-price">)\s*\d+\s*FCFA', re.IGNORECASE)
    content = promo_pattern1.sub(r'\g<1>150 FCFA', content)
    
    promo_pattern2 = re.compile(r'(<span class="old-price">)\s*\d+\s*FCFA', re.IGNORECASE)
    content = promo_pattern2.sub(r'\g<1>200 FCFA', content)

    with open(html_file, "w", encoding="utf-8") as f:
        f.write(content)

print("Updated HTML files.")
