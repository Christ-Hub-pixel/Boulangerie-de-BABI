import glob

for file in ['connexion.html', 'inscription.html']:
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()

    html = html.replace('<div class="login-wrapper">', '<div class="login-wrapper container-fluid d-flex align-items-center justify-content-center min-vh-100 py-5 mt-5 bg-light">')
    html = html.replace('<div class="login-container">', '<div class="login-container row w-100 bg-white rounded-4 shadow overflow-hidden" style="max-width:1200px; margin: 0 auto;">')
    html = html.replace('<div class="login-left">', '<div class="col-12 col-lg-6 login-left position-relative p-0">')
    html = html.replace('<div class="login-right">', '<div class="col-12 col-lg-6 login-right p-4 p-md-5 d-flex align-items-center justify-content-center">')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
