import re

with open("produits.html", "r", encoding="utf-8") as f:
    content = f.read()

# We want to replace everything between <!-- Product Grid --> and <!-- Pagination -->
# Let's find those two markers.
start_marker = "<!-- Product Grid -->"
end_marker = "<!-- Pagination -->"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_grid_html = """<!-- Product Grid -->
                <div class="bg-white rounded shadow-sm p-3">
                    <div id="product-grid" class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
                        <!-- Products will be dynamically generated here by JS -->
                    </div>
                </div>

                """
    
    new_content = content[:start_idx] + new_grid_html + content[end_idx:]
    with open("produits.html", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Fixed!")
else:
    print("Markers not found!")
