import re
import glob

def process_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replace grid container
    html = html.replace('<div class="products-grid">', '<div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-4">')
    
    lines = html.split('\n')
    new_lines = []
    in_product_card = False
    div_depth = 0
    
    for line in lines:
        if '<div class="product-card">' in line:
            new_lines.append(line.replace('<div class="product-card">', '<div class="col">\n<div class="product-card h-100">'))
            in_product_card = True
            div_depth = 1 # We are inside product-card
            continue
            
        if in_product_card:
            # count divs
            div_depth += line.count('<div')
            div_depth -= line.count('</div')
            
            if div_depth == 0:
                # This line closes the product card
                new_lines.append(line + '\n</div> <!-- col -->')
                in_product_card = False
                continue
        
        new_lines.append(line)
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))

for f in ['index.html', 'produits.html']:
    process_file(f)

# Also update global.css for img and btn
with open('css/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

if 'img {' not in css:
    css += '\n\nimg {\n    width: 100%;\n    height: auto;\n    object-fit: cover;\n}\n'

# Clamp typography
css = css.replace('font-size: 1rem;', 'font-size: clamp(0.9rem, 1.5vw, 1rem);')
css = css.replace('font-size: 1.1rem;', 'font-size: clamp(1rem, 2vw, 1.1rem);')
css = css.replace('font-size: 1.2rem;', 'font-size: clamp(1.1rem, 2vw, 1.2rem);')
css = css.replace('font-size: 1.4rem;', 'font-size: clamp(1.2rem, 3vw, 1.4rem);')
css = css.replace('font-size: 1.5rem;', 'font-size: clamp(1.3rem, 3vw, 1.5rem);')
css = css.replace('font-size: 1.8rem;', 'font-size: clamp(1.5rem, 4vw, 1.8rem);')
css = css.replace('font-size: 2rem;', 'font-size: clamp(1.8rem, 5vw, 2rem);')
css = css.replace('font-size: 2.2rem;', 'font-size: clamp(1.8rem, 5vw, 2.2rem);')
css = css.replace('font-size: 2.5rem;', 'font-size: clamp(2rem, 6vw, 2.5rem);')
css = css.replace('font-size: 3rem;', 'font-size: clamp(2.2rem, 7vw, 3rem);')
css = css.replace('font-size: 3.5rem;', 'font-size: clamp(2.5rem, 8vw, 3.5rem);')
css = css.replace('font-size: 4rem;', 'font-size: clamp(3rem, 9vw, 4rem);')
css = css.replace('font-size: 5.5rem;', 'font-size: clamp(3.5rem, 10vw, 5.5rem);')

with open('css/global.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Update index.css
with open('css/index.css', 'r', encoding='utf-8') as f:
    index_css = f.read()
    
index_css = index_css.replace('font-size: 5.5rem;', 'font-size: clamp(3.5rem, 10vw, 5.5rem);')
index_css = index_css.replace('font-size: 2.2rem;', 'font-size: clamp(1.8rem, 5vw, 2.2rem);')

with open('css/index.css', 'w', encoding='utf-8') as f:
    f.write(index_css)
