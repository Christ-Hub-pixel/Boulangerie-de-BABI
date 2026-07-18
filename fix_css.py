import re

with open('css/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Fix the weird literal \n at the start
if css.startswith('img {\\n'):
    css = css.replace('img {\\n    width: 100%;\\n    height: auto;\\n    object-fit: cover;\\n}\\n\\n', '')

if 'img {' not in css:
    css = 'img {\n    width: 100%;\n    height: auto;\n    object-fit: cover;\n}\n\n' + css

# Fix the mobile btn
mobile_btn = """    .nav-actions .btn {
        padding: 8px 10px;
        font-size: 0;
        min-height: 44px;
    }"""

# find the bad nav-actions .btn replacement and replace it
bad_btn = """.nav-actions .btn {
    padding: 10px 24px;
    border-radius: 5px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
}"""

if bad_btn in css:
    css = css.replace(bad_btn, mobile_btn)

with open('css/global.css', 'w', encoding='utf-8') as f:
    f.write(css)

# Let's also check index.css to make sure nothing weird happened.
