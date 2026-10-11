"""Render the Shopify theme (shopify/theme) into a clickable static preview at site/store-preview/.

Uses sample data for products and the cart, and the pages' real text. Checkout is replaced by a
"this is a preview" page. Run after scripts/build_shopify_theme.py:

    python3 scripts/build_shopify_theme.py && python3 scripts/build_store_preview.py
"""
import json
import pathlib
import re
import shutil

from liquid import Environment, FileSystemLoader

ROOT = pathlib.Path(__file__).resolve().parents[1]
THEME = ROOT / "shopify" / "theme"
OUT = ROOT / "site" / "store-preview"
BASE = "/store-preview/"
MEDIA = "https://woven-tails.vercel.app/"


class ThemeLoader(FileSystemLoader):
    """Strips Shopify-only tags python-liquid doesn't know ({% form %}, {% schema %})."""

    def get_source(self, env, template_name, **kw):
        src = super().get_source(env, template_name, **kw)
        return src._replace(text=shopify_tags(src.text))


def shopify_tags(t):
    t = re.sub(r"\{%-?\s*schema\s*-?%\}.*?\{%-?\s*endschema\s*-?%\}", "", t, flags=re.S)
    def form(m):
        args = m.group(1)
        kind = re.match(r"\s*'(\w+)'", args).group(1)
        attrs = dict(re.findall(r"(\w+):\s*'([^']*)'", args))
        action = {"product": "/cart/add", "contact": "/contact"}.get(kind, "#")
        extra = "".join(f' {k}="{v}"' for k, v in attrs.items())
        return f'<form method="post" action="{action}" enctype="multipart/form-data"{extra}>'
    t = re.sub(r"\{%-?\s*form\s+(.*?)-?%\}", form, t, flags=re.S)
    return re.sub(r"\{%-?\s*endform\s*-?%\}", "</form>", t)


def money(cents):
    v = cents / 100
    return f"${v:,.0f}" if v == int(v) else f"${v:,.2f}"


env = Environment(loader=ThemeLoader([THEME / "snippets", THEME / "sections"], ext=".liquid"))
env.filters["money_without_trailing_zeros"] = money
env.filters["money"] = money
env.filters["json"] = lambda v: json.dumps(v)
env.filters["image_url"] = lambda v, width=None, **_: (v.get("src") if isinstance(v, dict) else v) or ""
env.filters["default_errors"] = lambda v: str(v)


def variant(vid, title, price, options):
    return {"id": vid, "title": title, "price": price, "available": True, "options": options}


def product(handle, title, price, option, values, image, ids, desc=""):
    vs = [variant(i, v, price, [v]) for i, v in zip(ids, values)] if option else [variant(ids[0], "Default Title", price, ["Default Title"])]
    return {
        "id": ids[0], "handle": handle, "title": title, "price": price, "url": f"/products/{handle}",
        "description": desc, "featured_image": {"src": MEDIA + "img/" + image, "alt": title},
        "has_only_default_variant": not option, "variants": vs, "selected_or_first_available_variant": vs[0],
        "options_with_values": [{"name": option, "values": values, "selected_value": values[0]}] if option else [],
    }


STYLES = ["Bold Pop", "Christmas Scarf", "Royal", "Memorial"]
PRODUCTS = {
    "custom-pet-portrait-woven-blanket": product("custom-pet-portrait-woven-blanket", "Custom Pet Portrait Woven Blanket, Illustrated from Your Photo", 6400, "Art style", STYLES, "blanket-sofa-golden.jpg", [11, 12, 13, 14]),
    "personalized-pet-storybook": product("personalized-pet-storybook", "Personalized Pet Storybook, Starring Your Dog or Cat", 4200, "Version", ["Dog", "Cat", "Memorial"], "book-table.jpg", [21, 22, 23]),
    "pet-portrait-gift-set": product("pet-portrait-gift-set", "The Woven Tails Gift Set: Pet Portrait Blanket + Storybook", 9900, "Art style", STYLES, "bundle-giftbox.jpg", [31, 32, 33, 34]),
    "extra-storybook-copy": product("extra-storybook-copy", "Extra Copy of Your Pet Storybook (One for Grandma)", 1900, None, [], "book-table.jpg", [41], "<p>A second copy of your personalized storybook, printed with your order. Perfect for grandparents.</p>"),
}
SAMPLE_CART = {
    "item_count": 1, "total_price": 6400,
    "items": [{
        "product": PRODUCTS["custom-pet-portrait-woven-blanket"], "variant": {"title": "Bold Pop"}, "quantity": 1,
        "url": "/products/custom-pet-portrait-woven-blanket", "url_to_remove": "#", "final_line_price": 6400,
        "image": {"src": MEDIA + "img/art-golden-pop.jpg"},
        "properties": {"Design": MEDIA + "img/art-golden-pop.jpg", "Pet photo 1": "file", "Pets in design": "1", "Text on blanket": "Biscuit (Classic)", "Pet's name": "Biscuit", "_Design data": "{}"},
    }],
}
POLICY_TEXT = {
    "shipping.html": "<p><strong>Where we ship</strong> We ship to addresses in the United States.</p><p><strong>Shipping cost</strong> Free standard shipping on every US order.</p><ul><li>Art proof: emailed within 24 hours of your order.</li><li>Production: 1–3 business days after you approve.</li><li>Delivery: usually 2–5 business days after production.</li></ul><p><strong>Christmas deadline</strong> Order by December 10 and approve your proof within 24 hours.</p>",
    "returns.html": "<p><strong>Personalized items</strong> Every blanket and storybook is made to order, so we can't accept change-of-mind returns.</p><p><strong>If something's wrong, we fix it</strong> Email hello@woventails.com within 30 days of delivery with a photo, and we'll send a free replacement or a full refund. You won't need to send the item back.</p><p><strong>Cancellations</strong> Cancel for a full refund until you approve your artwork proof.</p>",
}
EMPTY_CART = {"item_count": 0, "total_price": 0, "items": []}

LINKS = {
    "/products/custom-pet-portrait-woven-blanket": "blanket.html", "/products/personalized-pet-storybook": "storybook.html",
    "/products/pet-portrait-gift-set": "gift-set.html", "/products/extra-storybook-copy": "extra-copy.html",
    "/cart": "cart.html", "/pages/faq": "faq.html", "/pages/contact": "contact.html", "/pages/about": "about.html",
    "/pages/send-your-photo": "send-your-photo.html", "/pages/data-sharing-opt-out": "privacy-choices.html",
    "/collections/all": "shop.html", "/search": "search.html",
    "/policies/privacy-policy": "privacy.html", "/policies/terms-of-service": "terms.html",
    "/policies/shipping-policy": "shipping.html", "/policies/refund-policy": "returns.html", "/": "index.html",
}

BANNER = """<div style="position:sticky;top:0;z-index:60;background:#1F3127;color:#F4EEE3;font:700 13px/1.3 Nunito,system-ui,sans-serif;padding:8px 16px;text-align:center">Preview of the new store design · checkout is turned off here</div>"""
PREVIEW_JS = """<script>
// preview only: pretend the cart accepts the design, then show the checkout stand-in
(function(){var f=window.fetch;window.fetch=function(u,o){if(String(u).indexOf('/cart/add')===0){return Promise.resolve(new Response(JSON.stringify({ok:true}),{status:200,headers:{'Content-Type':'application/json'}}));}return f.apply(this,arguments);};
document.addEventListener('submit',function(e){var a=e.target.getAttribute('action')||'';if(!e.defaultPrevented&&/cart|contact/.test(a)){e.preventDefault();location.href='/store-preview/checkout';}});})();
</script>"""


def links(html):
    def fix(m):
        url = m.group(2)
        path, _, frag = url.partition("#")
        if path in LINKS:
            return f'{m.group(1)}="{BASE}{LINKS[path].replace(".html", "").replace("index", "")}{"#" + frag if frag else ""}"'
        if path.startswith("/policies/") or path.startswith("/pages/") or path.startswith("/products/") or path.startswith("/collections/"):
            return f'{m.group(1)}="{BASE}404"'
        return m.group(0)
    html = re.sub(r'(href|action)="(/[^"]*)"', fix, html)
    html = html.replace(MEDIA + "theme-assets/wt-editor.js", BASE + "assets/wt-editor.js").replace(MEDIA + "theme-assets/wt-site.css", BASE + "assets/wt-site.css").replace(MEDIA + "theme-assets/wt-site.js", BASE + "assets/wt-site.js")
    html = re.sub(r"(<body[^>]*>)", r"\1" + BANNER, html, count=1)
    return html.replace("</head>", PREVIEW_JS + "\n</head>", 1)


def render(name, body_tpl, ctx):
    layout = shopify_tags((THEME / "layout" / "woven.liquid").read_text())
    content = env.from_string(shopify_tags(body_tpl)).render(**ctx)
    page = env.from_string(layout).render(content_for_layout=content, content_for_header='<meta name="robots" content="noindex">', **ctx)
    (OUT / name).write_text(links(page))


def main():
    pages = json.loads((ROOT / "shopify" / "pages-content.json").read_text())
    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "assets").mkdir(parents=True)
    for f in ("wt-editor.js", "wt-site.css", "wt-site.js"):
        shutil.copy(THEME / "assets" / f, OUT / "assets" / f)
    ed = OUT / "assets" / "wt-editor.js"
    ed.write_text(ed.read_text().replace("location.href = '/checkout'", "location.href = '/store-preview/checkout'"))

    base = {"shop": {"name": "Woven Tails"}, "request": {"locale": {"iso_code": "en"}}, "settings": {}, "canonical_url": "",
            "routes": {"cart_url": "/cart", "search_url": "/search"}, "all_products": PRODUCTS, "cart": EMPTY_CART}

    def ctx(**kw):
        c = dict(base); c.update(kw); return c

    render("index.html", "{% render 'wt-home' %}", ctx(page_title="Woven Tails", template={"name": "index"}))
    for file, page, handle in (("blanket.html", "blanket", "custom-pet-portrait-woven-blanket"), ("storybook.html", "storybook", "personalized-pet-storybook"), ("gift-set.html", "gift-set", "pet-portrait-gift-set")):
        p = PRODUCTS[handle]
        render(file, f"{{% render 'wt-{page}', product: product %}}", ctx(product=p, page_title=p["title"], template={"name": "product"}))
    p = PRODUCTS["extra-storybook-copy"]
    render("extra-copy.html", (THEME / "sections" / "wt-product.liquid").read_text(), ctx(product=p, page_title=p["title"], template={"name": "product"}))
    render("cart.html", (THEME / "sections" / "wt-cart.liquid").read_text(), ctx(cart=SAMPLE_CART, page_title="Your cart", template={"name": "cart"}))
    render("cart-empty.html", (THEME / "sections" / "wt-cart.liquid").read_text(), ctx(page_title="Your cart", template={"name": "cart"}))
    render("shop.html", (THEME / "sections" / "wt-collection.liquid").read_text(), ctx(collection={"handle": "all"}, page_title="Shop", template={"name": "collection"}))
    render("search.html", (THEME / "sections" / "wt-search.liquid").read_text(), ctx(search={"performed": False, "terms": ""}, page_title="Search", template={"name": "search"}))
    render("404.html", (THEME / "sections" / "wt-404.liquid").read_text(), ctx(page_title="Page not found", template={"name": "404"}))
    for file, handle in (("faq.html", "faq"), ("about.html", "about"), ("send-your-photo.html", "send-your-photo"), ("privacy-choices.html", "data-sharing-opt-out")):
        pg = pages[handle]
        render(file, (THEME / "sections" / "wt-main-page.liquid").read_text(), ctx(page=pg, page_title=pg["title"], template={"name": "page"}))
    pg = pages["contact"]
    render("contact.html", (THEME / "sections" / "wt-contact.liquid").read_text(), ctx(page=pg, page_title=pg["title"], form={}, template={"name": "page"}))
    for file, src, title in (("privacy.html", "privacy-policy.html", "Privacy policy"), ("terms.html", "terms-of-service.html", "Terms of service"),
                             ("shipping.html", None, "Shipping policy"), ("returns.html", None, "Refund policy")):
        body = (ROOT / "shopify" / src).read_text() if src else POLICY_TEXT[file]
        policy = f'<div class="shopify-policy__container"><div class="shopify-policy__title"><h1>{title}</h1></div><div class="shopify-policy__body"><div class="rte">{body}</div></div></div>'
        render(file, policy, ctx(page_title=title, template={"name": "policy"}))
    render("checkout.html", """<main class="wrap wt-shell wt-shell--center"><span class="eyebrow">Preview</span><h1>Here the live store opens <em>Shopify checkout.</em></h1>
      <p class="lede">Your design, photos and text are saved on the order. In this preview nothing is sent or charged.</p>
      <a class="btn" href="/store-preview/blanket">Back to the blanket</a></main>""", ctx(page_title="Checkout", template={"name": "page"}))
    print("preview written to", OUT, "pages:", len(list(OUT.glob("*.html"))))


if __name__ == "__main__":
    main()
