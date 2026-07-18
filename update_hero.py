import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update hero buttons layout
old_buttons = '''<div class="hero-buttons">
                <a href="#" class="btn btn-primary"><i class="fa-solid fa-basket-shopping"></i> COMMANDER MAINTENANT</a>
                <a href="#" class="btn btn-outline">VOIR NOS PRODUITS</a>
            </div>'''
            
new_buttons = '''<div class="hero-buttons d-flex flex-column flex-sm-row justify-content-center gap-3">
                <a href="checkout.html" class="btn btn-primary"><i class="fa-solid fa-basket-shopping"></i> COMMANDER MAINTENANT</a>
                <a href="produits.html" class="btn btn-outline">VOIR NOS PRODUITS</a>
            </div>'''

if old_buttons in html:
    html = html.replace(old_buttons, new_buttons)

# Also update the newsletter layout in index.html to use d-flex
old_newsletter = '''<form class="newsletter-form">
                <input type="email" placeholder="Votre adresse email" required>
                <button type="submit" class="btn btn-primary">S'ABONNER</button>
            </form>'''

new_newsletter = '''<form class="newsletter-form d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <input type="email" placeholder="Votre adresse email" required class="form-control" style="max-width: 300px;">
                <button type="submit" class="btn btn-primary">S'ABONNER</button>
            </form>'''

if old_newsletter in html:
    html = html.replace(old_newsletter, new_newsletter)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
