import os
import glob
import re
from html.parser import HTMLParser

class AssetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.links = []
        self.has_doctype = False
        self.has_meta_charset = False
        self.has_meta_viewport = False
        self.html_tag_attrs = []
        self.has_head = False

    def handle_decl(self, decl):
        if decl.lower() == "doctype html":
            self.has_doctype = True

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "html":
            self.html_tag_attrs = attrs
        elif tag == "head":
            self.has_head = True
        elif tag == "meta":
            if "charset" in attr_dict:
                self.has_meta_charset = True
            if attr_dict.get("name", "").lower() == "viewport":
                self.has_meta_viewport = True
        elif tag in ["img", "script", "source"]:
            src = attr_dict.get("src")
            if src and not src.startswith("http") and not src.startswith("data:"):
                self.assets.append(src)
        elif tag == "link":
            href = attr_dict.get("href")
            if href and not href.startswith("http") and not href.startswith("data:"):
                self.assets.append(href)
        elif tag == "a":
            href = attr_dict.get("href")
            if href and not href.startswith("http") and not href.startswith("mailto:") and not href.startswith("tel:") and not href.startswith("#"):
                self.links.append(href)

def check_broken_links(directory="."):
    html_files = glob.glob(os.path.join(directory, "*.html"))
    broken_links = []
    broken_assets = []
    referenced_assets = set()
    
    for file in html_files:
        with open(file, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        
        parser = AssetParser()
        parser.feed(content)
        
        for link in parser.links:
            # removing query string or hash
            clean_link = link.split("#")[0].split("?")[0]
            if clean_link and not os.path.exists(os.path.join(directory, clean_link)):
                broken_links.append((file, link))
                
        for asset in parser.assets:
            clean_asset = asset.split("#")[0].split("?")[0]
            referenced_assets.add(clean_asset)
            if clean_asset and not os.path.exists(os.path.join(directory, clean_asset)):
                broken_assets.append((file, asset))
                
    return broken_links, broken_assets, referenced_assets

def auto_fix_html_structure(directory="."):
    html_files = glob.glob(os.path.join(directory, "*.html"))
    fixed_files = 0
    
    for file in html_files:
        with open(file, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            
        parser = AssetParser()
        parser.feed(content)
        
        new_content = content
        fixed = False
        
        if not parser.has_doctype:
            new_content = "<!DOCTYPE html>\n" + new_content
            fixed = True
            
        # Add lang="fr" to html if not present
        if "lang" not in dict(parser.html_tag_attrs):
            new_content = re.sub(r'<html([^>]*)>', r'<html\1 lang="fr">', new_content, count=1, flags=re.IGNORECASE)
            fixed = True
            
        # Add missing meta tags to <head>
        missing_metas = []
        if not parser.has_meta_charset:
            missing_metas.append('<meta charset="UTF-8">')
        if not parser.has_meta_viewport:
            missing_metas.append('<meta name="viewport" content="width=device-width, initial-scale=1.0">')
            
        if missing_metas and parser.has_head:
            head_content = "\n    " + "\n    ".join(missing_metas)
            new_content = re.sub(r'(<head[^>]*>)', r'\1' + head_content, new_content, count=1, flags=re.IGNORECASE)
            fixed = True
            
        if fixed:
            with open(file, "w", encoding="utf-8") as f:
                f.write(new_content)
            fixed_files += 1
            
    return fixed_files

def find_orphaned_assets(directory, referenced_assets):
    # Find all actual assets
    asset_types = ["*.css", "*.js", "*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.webp"]
    all_assets = []
    for asset_type in asset_types:
        all_assets.extend(glob.glob(os.path.join(directory, "**", asset_type), recursive=True))
        
    orphans = []
    # Normalize paths for comparison
    ref_norm = {os.path.normpath(os.path.join(directory, r)) for r in referenced_assets}
    
    for asset in all_assets:
        norm_asset = os.path.normpath(asset)
        # Skip some dirs if needed, or if it is exactly what we are checking
        if norm_asset not in ref_norm:
            # Optional: filter out node_modules, .git, etc
            if "node_modules" not in norm_asset and ".git" not in norm_asset:
                orphans.append(asset)
                
    return orphans

if __name__ == "__main__":
    print("==============================================")
    print("    SITE AUDITOR & AUTO-FIXER REPORT          ")
    print("==============================================\n")
    
    # 1. Auto-Fix Structure
    fixed_count = auto_fix_html_structure()
    print(f"[+] Structure HTML : {fixed_count} fichiers modifiés pour ajouter les balises de base (DOCTYPE, meta charset, viewport, lang='fr').")
    
    # 2. Link & Asset Validation
    broken_links, broken_assets, referenced_assets = check_broken_links()
    print(f"\n[+] Validation des Liens : {len(broken_links)} liens morts trouvés.")
    for file, link in broken_links:
        print(f"  -> ERREUR: {file} a un lien mort vers '{link}'")
        
    print(f"\n[+] Validation des Ressources : {len(broken_assets)} ressources manquantes.")
    for file, asset in broken_assets:
        print(f"  -> ERREUR: {file} charge une ressource introuvable '{asset}'")
        
    # 3. Orphaned Assets
    orphans = find_orphaned_assets(".", referenced_assets)
    # We only show top 10 to not clutter
    print(f"\n[+] Fichiers Orphelins : {len(orphans)} fichiers potentiellement inutilisés.")
    for orphan in orphans[:10]:
        print(f"  -> {orphan}")
    if len(orphans) > 10:
        print(f"  -> ... et {len(orphans) - 10} autres.")
        
    print("\n==============================================")
    print("    AUDIT TERMINÉ                             ")
    print("==============================================")
