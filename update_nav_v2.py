import glob
import re

new_navbar = '''    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top py-2" style="background: rgba(43, 22, 12, 0.9); backdrop-filter: blur(10px);">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center text-decoration-none" href="index.html">
                <i class="fa-solid fa-wheat-awn text-primary fs-2 me-2"></i>
                <div class="d-flex flex-column lh-1">
                    <span class="fw-bold text-white" style="font-size: clamp(1.2rem, 3vw, 1.6rem); font-family: 'Inter', sans-serif;">Boulangerie</span>
                    <span class="text-primary" style="font-size: clamp(1.5rem, 4vw, 2.2rem); font-family: 'Great Vibes', cursive; margin-top: -5px;">de Babi</span>
                </div>
            </a>
            
            <div class="d-flex align-items-center d-lg-none gap-3 ms-auto me-3">
                <a href="checkout.html" class="position-relative text-white text-decoration-none">
                    <i class="fa-solid fa-cart-shopping fs-4"></i>
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7em;">3</span>
                </a>
            </div>

            <button class="navbar-toggler border-0 px-1" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fa-solid fa-bars fs-2 text-white"></i>
            </button>
            
            <div class="collapse navbar-collapse" id="mainNav">
                <ul class="navbar-nav mx-auto mb-2 mb-lg-0 fw-semibold text-center mt-3 mt-lg-0" style="font-family: 'Inter', sans-serif;">
                    <li class="nav-item"><a class="nav-link text-white px-3" href="index.html">ACCUEIL</a></li>
                    <li class="nav-item"><a class="nav-link text-white px-3" href="apropos.html">À PROPOS</a></li>
                    <li class="nav-item"><a class="nav-link text-white px-3" href="produits.html">PRODUITS <i class="fa-solid fa-chevron-down ms-1" style="font-size:0.8em"></i></a></li>
                    <li class="nav-item"><a class="nav-link text-white px-3" href="checkout.html">COMMANDER</a></li>
                    <li class="nav-item"><a class="nav-link text-white px-3" href="fidelite.html">FIDÉLITÉ</a></li>
                    <li class="nav-item"><a class="nav-link text-white px-3" href="contact.html">CONTACT</a></li>
                </ul>
                
                <div class="d-flex align-items-center justify-content-center gap-3 mt-3 mt-lg-0">
                    <a href="checkout.html" class="position-relative text-white text-decoration-none d-none d-lg-block">
                        <i class="fa-solid fa-cart-shopping fs-5"></i>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 0.7em;">3</span>
                    </a>
                    <a href="connexion.html" class="btn btn-primary fw-bold text-dark d-flex align-items-center justify-content-center gap-2 px-4 py-2"><i class="fa-regular fa-user"></i> <span class="d-none d-sm-inline">MON COMPTE</span></a>
                </div>
            </div>
        </div>
    </nav>'''

for file in glob.glob('*.html'):
    with open(file, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Use regex to find the current navbar block
    html = re.sub(r'<!-- Navbar -->\s*<nav class="navbar(?:[^"]*)".*?</nav>', new_navbar, html, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(html)
