import glob
import re

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Replace <div class="footer-grid"> with <div class="container"><div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
    if '<div class="footer-grid">' in html:
        html = html.replace('<div class="footer-grid">', '<div class="container"><div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">')
        
        # Replace <div class="footer-col"> with <div class="col footer-col">
        html = html.replace('<div class="footer-col">', '<div class="col footer-col">')
        
        # Since we added an extra wrapper <div class="container">, we need to add an extra </div> before <div class="footer-bottom">
        html = html.replace('<div class="footer-bottom">', '</div>\n        <div class="footer-bottom">')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
