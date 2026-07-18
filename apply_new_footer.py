import glob
import re

bootstrap_footer_html = """    <footer>
        <div class="container footer-fade-in">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-4">
                <div class="col footer-col">
                    <div class="logo">
                        <div class="logo-text">
                            <span class="logo-title">Boulangerie</span>
                            <span class="logo-subtitle">de Babi</span>
                        </div>
                    </div>
                    <p class="footer-desc">Le goût authentique, la fraîcheur au quotidien. Pains, viennoiseries, pâtisseries et boissons. Faits avec amour et passion.</p>
                    <div class="social-icons">
                        <a href="#" class="facebook"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#" class="instagram"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#" class="whatsapp"><i class="fa-brands fa-whatsapp"></i></a>
                    </div>
                </div>
                <div class="col footer-col">
                    <h4>LIENS UTILES</h4>
                    <ul>
                        <li><a href="index.html">Accueil</a></li>
                        <li><a href="apropos.html">À propos</a></li>
                        <li><a href="produits.html">Produits</a></li>
                        <li><a href="checkout.html">Commander</a></li>
                        <li><a href="fidelite.html">Fidélité</a></li>
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                <div class="col footer-col">
                    <h4>CATÉGORIES</h4>
                    <ul>
                        <li><a href="produits.html">Pains</a></li>
                        <li><a href="produits.html">Viennoiseries</a></li>
                        <li><a href="produits.html">Pâtisseries</a></li>
                        <li><a href="produits.html">Jus naturels</a></li>
                        <li><a href="produits.html">Boissons</a></li>
                        <li><a href="produits.html">Glaces</a></li>
                    </ul>
                </div>
                <div class="col footer-col">
                    <h4>HEURES D'OUVERTURE</h4>
                    <p>Lundi - Samedi : 06h00 - 20h00</p>
                    <p>Dimanche : 07h00 - 18h00</p>
                    <p class="mt-2">Nous sommes à votre service<br>chaque jour !</p>
                </div>
                <div class="col footer-col">
                    <h4>CONTACTEZ-NOUS</h4>
                    <p><i class="fa-solid fa-phone"></i> +225 07 00 00 00 00</p>
                    <p><i class="fa-solid fa-envelope"></i> contact@boulangeriedebabi.ci</p>
                    <p><i class="fa-solid fa-location-dot"></i> Marcory, Abidjan - Côte d'Ivoire</p>
                    <a href="#" class="btn-whatsapp w-100"><i class="fa-brands fa-whatsapp"></i> WHATSAPP</a>
                </div>
            </div>
            <div class="footer-bottom mt-5 border-top pt-4">
                <p>&copy; 2026 Boulangerie de Babi. Tous droits réservés.</p>
                <div>
                    <a href="#">Mentions légales</a> | 
                    <a href="#">Politique de confidentialité</a> |
                    <a href="#">Conditions générales</a>
                </div>
            </div>
        </div>
    </footer>"""

for filepath in glob.glob("*.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    new_content = re.sub(r'<footer>.*?</footer>', bootstrap_footer_html, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {filepath} with Bootstrap footer")
