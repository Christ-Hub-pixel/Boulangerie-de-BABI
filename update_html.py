import os
import glob

# Get all html files
folder_path = r"c:\Users\user\Downloads\Boulangerie de BABI"
html_files = glob.glob(os.path.join(folder_path, "*.html"))

for file_path in html_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    changed = False

    # Check for Bootstrap CSS
    if "bootstrap.min.css" not in content:
        content = content.replace(
            '<link rel="stylesheet" href="style.css">',
            '<!-- Bootstrap 5 CSS -->\n    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">\n    <link rel="stylesheet" href="style.css">'
        )
        changed = True

    # Check for cart.js
    if "js/cart.js" not in content:
        content = content.replace(
            '<script src="js/script.js"></script>',
            '<script src="js/cart.js"></script>\n    <script src="js/script.js"></script>'
        )
        changed = True

    if changed:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file_path}")
    else:
        print(f"No changes needed for {file_path}")
