import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hero Content -> Add Container
html = html.replace('<div class="hero-content">', '<div class="container text-center hero-content position-relative z-1">')

# 2. Features -> Wrap in Container and Row
# It currently is:
# <section class="features">
#     <div class="feature-item">...</div>
#     <div class="feature-item">...</div>
#     <div class="feature-item">...</div>
#     <div class="feature-item">...</div>
# </section>
def replace_features(match):
    content = match.group(1)
    # Replace feature-item with col > feature-item
    content = content.replace('<div class="feature-item">', '<div class="col"><div class="feature-item">')
    # Replace </div> for feature-item with </div></div>
    content = re.sub(r'(<div class="feature-item">.*?</div>\s*</div>)', r'\1</div>', content, flags=re.DOTALL) 
    # Actually simpler:
    content = re.sub(r'<div class="feature-item">(.*?)</div>\s*(?=<div class="feature-item"|</section>)', r'<div class="col"><div class="feature-item d-flex align-items-center gap-3">\g<1></div></div>\n        ', content, flags=re.DOTALL)
    
    return f'<section class="features py-4 bg-light border-bottom">\n    <div class="container">\n        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 justify-content-center">\n            {content}\n        </div>\n    </div>\n</section>'

html = re.sub(r'<section class="features">(.*?)</section>', replace_features, html, flags=re.DOTALL)

# 3. Delices -> Add Container
html = html.replace('<section class="delices">', '<section class="delices py-5">\n        <div class="container">')
html = html.replace('<!-- Info Cards -->', '</div>\n\n    <!-- Info Cards -->')
html = html.replace('<div class="filters">', '<div class="filters d-flex flex-wrap justify-content-center gap-2 mb-4">')

# 4. Info Cards -> Wrap in container and row
def replace_info_cards(match):
    content = match.group(1)
    content = re.sub(r'<div class="info-card (.*?)">(.*?)</div>\s*(?=<div class="info-card|</section>)', r'<div class="col"><div class="info-card \g<1> h-100">\g<2></div></div>\n        ', content, flags=re.DOTALL)
    return f'<section class="info-cards my-5">\n    <div class="container">\n        <div class="row row-cols-1 row-cols-lg-3 g-4">\n            {content}\n        </div>\n    </div>\n</section>'

html = re.sub(r'<section class="info-cards">(.*?)</section>', replace_info_cards, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
