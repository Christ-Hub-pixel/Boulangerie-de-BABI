import glob

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    html = html.replace('<img src="assets/product_', '<img loading="lazy" src="assets/product_')
    html = html.replace('<img src="assets/icon_', '<img loading="lazy" src="assets/icon_')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
