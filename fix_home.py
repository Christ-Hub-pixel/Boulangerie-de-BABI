import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hero Content -> Add Container
html = html.replace('<div class="hero-content">', '<div class="container text-center hero-content position-relative z-1">')

# 2. Features -> Wrap in Container and Row
old_features = '''<section class="features">
        <div class="feature-item">'''
new_features = '''<section class="features py-4 bg-light border-bottom">
        <div class="container">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 justify-content-center">
                <div class="col">
                    <div class="feature-item">'''
html = html.replace(old_features, new_features)

html = html.replace('''</div>
    </section>''', '''</div>
                </div>
            </div>
        </div>
    </section>''')
# Fix closing divs: there were 4 feature-items.
html = re.sub(r'(<div class="feature-item">.*?)</div>\s*<div class="feature-item">', r'\1</div>\n                </div>\n                <div class="col">\n                    <div class="feature-item">', html, flags=re.DOTALL)

# 3. Delices -> Add Container
html = html.replace('<section class="delices">', '<section class="delices py-5">\n        <div class="container">')
# Close Delices container
html = html.replace('''<div class="text-center mt-4">
            <button class="btn btn-dark">VOIR TOUS NOS PRODUITS</button>
        </div>
    </section>''', '''<div class="text-center mt-4">
            <button class="btn btn-dark">VOIR TOUS NOS PRODUITS</button>
        </div>
        </div>
    </section>''')

# Add flex-wrap to filters
html = html.replace('<div class="filters">', '<div class="filters d-flex flex-wrap justify-content-center gap-2 mb-4">')

# 4. Info Cards -> Wrap in container and row
old_info_cards = '''<section class="info-cards">
        <div class="info-card dark">'''
new_info_cards = '''<section class="info-cards my-5">
        <div class="container">
            <div class="row row-cols-1 row-cols-lg-3 g-4">
                <div class="col">
                    <div class="info-card dark h-100">'''
html = html.replace(old_info_cards, new_info_cards)

html = html.replace('''<div class="info-card yellow">''', '''</div>\n                </div>\n                <div class="col">\n                    <div class="info-card yellow h-100">''')
html = html.replace('''<div class="info-card dark">''', '''</div>\n                </div>\n                <div class="col">\n                    <div class="info-card dark h-100">''')

html = html.replace('''</div>
    </section>

    <!-- Process Timeline -->''', '''</div>\n                </div>\n            </div>\n        </div>\n    </section>\n\n    <!-- Process Timeline -->''')


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
