"""Assemble site/*.html from site/src/ templates (shared head, header, footer)."""
from pathlib import Path
root = Path(__file__).parent
parts = {k: (root / f"src/_{k.lower()}.html").read_text() for k in ("HEAD", "HEADER", "FOOTER")}
for src in (root / "src").glob("[!_]*.html"):
    html = src.read_text()
    for k, v in parts.items():
        html = html.replace("{{%s}}" % k, v)
    (root / src.name).write_text(html)
    print("built", src.name)
