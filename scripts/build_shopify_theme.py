#!/usr/bin/env python3
"""Convert the static site (site/src/*.html) into Shopify theme files (shopify/theme/).

Output:
  layout/woven.liquid           site look (fonts, header, footer) around Shopify content
  sections/wt-page.liquid       one section that renders a page snippet (home / blanket / storybook / gift-set)
  snippets/wt-<page>.liquid     page body converted from site/src/<page>.html
  snippets/wt-buy.liquid        real Shopify product form (variant chips, personalization, checkout)
  templates/index.json, templates/product.wt-<page>.json
  assets/wt-site.css            site/css/site.css + store additions
Media (img/, tex/, video/) stays on the Vercel deployment (MEDIA below).
3D bundle: shopify/theme/assets/wt-scenes.js (esbuild of site/js/scenes.js).
"""
import json, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC, OUT = ROOT / "site" / "src", ROOT / "shopify" / "theme"
MEDIA = "https://woven-tails.vercel.app/"
# versioned so a new theme can ship new JS/CSS without changing the theme that is live right now
ASSET_VER = "v6"
ASSETS = MEDIA + f"theme-assets/{ASSET_VER}/"
HANDLES = {"blanket": "custom-pet-portrait-woven-blanket", "storybook": "personalized-pet-storybook", "gift-set": "pet-portrait-gift-set"}


def body_of(page):
    html = (SRC / f"{page}.html").read_text()
    main = re.search(r"<main>(.*?)</main>", html, re.S).group(1)
    buybar = re.search(r'(<div class="buybar">.*?</a></div>)', html, re.S)
    script = re.search(r'<script type="module">(.*?)</script>', html, re.S).group(1)
    return main, (buybar.group(1) if buybar else ""), script


def rewrite(s, page):
    s = re.sub(r'(src|poster)="(img|tex|video)/', lambda m: f'{m.group(1)}="{MEDIA}{m.group(2)}/', s)
    for p, h in HANDLES.items():
        own = (p == page)
        s = s.replace(f'href="https://shop.woventails.com/products/{h}"', 'href="#create"' if own else f'href="/products/{h}"')
        s = s.replace(f'href="/{p}#create"', 'href="#create"' if own else f'href="/products/{h}#create"')
        s = s.replace(f'href="/{p}"', 'href="#create"' if own else f'href="/products/{h}"')
    s = s.replace('href="https://shop.woventails.com/', 'href="/')
    return s


def page_script(script):
    script = script.replace('from "./js/scenes.js"', f'from "{ASSETS}wt-scenes.js"')
    script = re.sub(r'(init(?:Blanket|Book|Gift)\([^,]+,\s*\{)', lambda m: m.group(1) + f' base: "{MEDIA}tex/",', script)
    return script


# Copy that differs in the Shopify theme, where people upload and design on the page itself.
THEME_COPY = {
    "blanket": [
        ("After checkout we email you to send your pet's photo", "Upload your pet's photo above and design it live"),
        ("<h3>Order</h3><p class=\"muted\">Pick your art style and check out.</p>", "<h3>Design it</h3><p class=\"muted\">Upload a photo, pick a style, add names or a message.</p>"),
        ("<h3>Send a photo</h3><p class=\"muted\">Reply to our email with 1–3 clear photos of your pet's face. Phone photos are perfect.</p>", "<h3>We polish it</h3><p class=\"muted\">Our artist tidies the cut-out and checks it will weave well.</p>"),
        ("We send the illustration within 24 hours. Ask for up to 2 changes, free.", "We email your proof within 24 hours. Ask for up to 2 changes, free."),
        ("Add it in the order note and we'll place it under the portrait.", "Add it in the designer above: up to 3 lines of text, placed and angled anywhere."),
    ],
    "gift-set": [],
    "storybook": [
        ("Reply to our email with your pet's photo, up to 3 family names and their favorite treat.", "Upload your pet's photo and add up to 3 family names and their favorite treat above."),
    ],
}


def convert(page):
    main, buybar, script = body_of(page)
    main = rewrite(main, page)
    buybar = rewrite(buybar, page)
    script = page_script(script)
    if page in HANDLES:
        # hero buy area -> real product form
        main = re.sub(r'<div class="cta-row" data-buy-anchor>.*?</div>', "{% render 'wt-buy', product: product %}", main, count=1, flags=re.S)
        main = main.replace('<section class="wrap hero">', '<section class="wrap hero" id="create">')
        # the art-style chips are replaced by the variant chips in the form
        main = re.sub(r'\s*<div class="picker">\s*<span class="picker-label">Art style</span>.*?</div>\s*</div>', "", main, count=1, flags=re.S)
        for a, b in THEME_COPY.get(page, []):
            if a not in main:
                raise SystemExit(f"theme copy not found in {page}: {a!r}")
            main = main.replace(a, b)
        # the designer replaces the sample-pet chips and the tick list (trust row lives under the button)
        main = re.sub(r'\s*<div class="picker">\s*<span class="picker-label">Preview a sample pet</span>.*?</div>\s*</div>', "", main, count=1, flags=re.S)
        main = re.sub(r'(\{% render \'wt-buy\'[^%]*%\})\s*<ul class="ticks">.*?</ul>', r'\1', main, count=1, flags=re.S)
        script = script.replace('document.getElementById("styles").addEventListener("pick", (e) => { state.style = e.detail; apply(); });',
            'document.addEventListener("wt:style", (e) => { state.style = e.detail; if (!state.user) apply(); });\n    document.addEventListener("wt:art", (e) => { state.user = true; b.setArtURL(e.detail); });\n    document.addEventListener("wt:design", (e) => { state.user = true; b.setArtURL(e.detail, true); });\n    document.addEventListener("wt:theme", (e) => b.setFringe(e.detail.fringe));\n    document.getElementById("pets").addEventListener("pick", () => { state.user = false; });')
        script = script.replace('initGift(document.getElementById("gift-stage"),', 'const g = initGift(document.getElementById("gift-stage"),')
    script = script.replace('document.getElementById("pets").addEventListener', 'document.getElementById("pets")?.addEventListener')
    head = "{%- comment -%} Generated by scripts/build_shopify_theme.py from site/src/" + page + ".html. Edit the source, then re-run. {%- endcomment -%}\n"
    return head + "<main>" + main + "</main>\n" + buybar + '\n<script type="module">' + script + "</script>\n"


LAYOUT = """<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{{ page_title }}{% unless page_title contains shop.name %} · {{ shop.name }}{% endunless %}</title>
{%- assign wt_desc = page_description | default: 'Your dog or cat, cut out from your photo and woven into a 100% cotton blanket, or the hero of their own hardcover storybook. Design it yourself, approve a proof, free US shipping.' -%}
<meta name="description" content="{{ wt_desc | escape }}">
<link rel="canonical" href="{{ canonical_url }}">
{%- liquid
  assign og_image = '__MEDIA__img/og-home.jpg'
  if product
    case product.handle
      when 'custom-pet-portrait-woven-blanket'
        assign og_image = '__MEDIA__img/og-blanket.jpg'
      when 'personalized-pet-storybook'
        assign og_image = '__MEDIA__img/og-storybook.jpg'
      when 'pet-portrait-gift-set'
        assign og_image = '__MEDIA__img/og-gift-set.jpg'
    endcase
  endif
-%}
<meta property="og:site_name" content="{{ shop.name }}">
<meta property="og:title" content="{{ page_title | escape }}">
<meta property="og:description" content="{{ wt_desc | escape }}">
<meta property="og:url" content="{{ canonical_url }}">
<meta property="og:image" content="{{ og_image }}">
<meta property="og:type" content="{% if product %}product{% else %}website{% endif %}">
<meta name="twitter:card" content="summary_large_image">
{%- if settings.favicon != blank %}<link rel="icon" href="{{ settings.favicon | image_url: width: 64 }}">{% endif %}
<link rel="apple-touch-icon" href="__MEDIA__img/apple-touch-icon.png">
<meta name="theme-color" content="#1F3127">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,400..700,0..100,0..1;1,9..144,400..700,0..100,0..1&family=Nunito:wght@400;600;700;800&display=swap">
<link rel="stylesheet" href="__ASSETS__wt-site.css">
<script>document.documentElement.classList.add("js")</script>
{{ content_for_header }}
</head>
<body data-page="{% if product %}{{ product.handle }}{% else %}{{ template.name }}{% endif %}">
<a class="skip" href="#main">Skip to content</a>
<a class="announce" href="/discount/WELCOME10?redirect=%2Fproducts%2Fcustom-pet-portrait-woven-blanket">10% off your first order: <b>WELCOME10</b> (applied for you) · Free US shipping<span class="hide-sm"> · Order by Dec 10 for Christmas</span></a>
<header class="site-head">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Woven Tails home">
      <svg viewBox="0 0 40 40" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><ellipse cx="11" cy="13" rx="4" ry="5.5"/><ellipse cx="20" cy="9" rx="4" ry="5.5"/><ellipse cx="29" cy="13" rx="4" ry="5.5"/><path d="M12 29c0-6 4-10 8-10s8 4 8 10c0 4-4 6-8 6s-8-2-8-6z"/><path d="M15 27c3 2 7 2 10 0M15 31c3-2 7-2 10 0" stroke-width="1.8"/></g></svg>
      Woven Tails
    </a>
    <nav class="nav" aria-label="Main">
      <a href="/products/custom-pet-portrait-woven-blanket" data-nav="custom-pet-portrait-woven-blanket" class="hide-sm">Woven blanket</a>
      <a href="/products/personalized-pet-storybook" data-nav="personalized-pet-storybook" class="hide-sm">Storybook</a>
      <a href="/products/pet-portrait-gift-set" data-nav="pet-portrait-gift-set" class="hide-sm">Gift set</a>
      <a href="{{ routes.account_url }}" class="cart-link hide-sm" aria-label="{% if customer %}My orders{% else %}Sign in to see your orders{% endif %}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg></a>
      <a href="/cart" class="cart-link" aria-label="Cart, {{ cart.item_count }} items"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2.2 11h10.6L21 7H7"/><circle cx="9.5" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/></svg>{%- if cart.item_count > 0 -%}<span class="cart-count">{{ cart.item_count }}</span>{%- endif -%}</a>
      <details class="menu">
        <summary aria-label="Menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></summary>
        <div class="menu__panel">
          <a href="/products/custom-pet-portrait-woven-blanket">Woven blanket <span>$64</span></a>
          <a href="/products/personalized-pet-storybook">Storybook <span>$42</span></a>
          <a href="/products/pet-portrait-gift-set">Gift set <span>$99</span></a>
          <a href="{{ routes.account_url }}">My orders</a>
          <a href="/pages/faq">FAQ</a>
          <a href="/pages/contact">Contact</a>
        </div>
      </details>
      <a class="btn small" href="{% if product %}#create{% else %}/products/custom-pet-portrait-woven-blanket#create{% endif %}">Create yours</a>
    </nav>
  </div>
</header>
<div id="main">{{ content_for_layout }}</div>
<footer class="site-foot">
  <div class="wrap">
    <div class="stack">
      <a class="brand" href="/">Woven Tails</a>
      <p class="muted">Your pet, illustrated from your photo, woven into cotton or starring in their own book. Woven and printed to order in the USA.</p>
      <p class="disclose">Artwork is AI-assisted and checked by hand; you approve every design before it's made. Lifestyle images on this site are illustrations of the products.</p>
    </div>
    <div><h4>Shop</h4><ul><li><a href="/products/custom-pet-portrait-woven-blanket">Woven blanket · $64</a></li><li><a href="/products/personalized-pet-storybook">Storybook · $42</a></li><li><a href="/products/pet-portrait-gift-set">Gift set · $99</a></li></ul></div>
    <div><h4>Help</h4><ul><li><a href="{{ routes.account_url }}">My orders &amp; tracking</a></li><li><a href="/pages/send-your-photo">Send your pet's photo</a></li><li><a href="/policies/shipping-policy">Shipping</a></li><li><a href="/policies/refund-policy">Returns &amp; replacements</a></li><li><a href="/pages/faq">FAQ</a></li><li><a href="/pages/contact">Contact</a></li><li><a href="mailto:hello@woventails.com">hello@woventails.com</a></li></ul></div>
    <div><h4>Legal</h4><ul><li><a href="/policies/privacy-policy">Privacy</a></li><li><a href="/policies/terms-of-service">Terms</a></li><li><a href="/pages/data-sharing-opt-out">Your privacy choices</a></li></ul></div>
  </div>
</footer>
<script src="__ASSETS__wt-site.js" defer></script>
</body>
</html>
""".replace("__ASSETS__", ASSETS).replace("__MEDIA__", MEDIA)

BUY = (ROOT / "shopify" / "theme-src" / "wt-buy.liquid").read_text()

SECTION = """{%- liquid
  assign page = section.settings.page
-%}
{%- case page -%}
  {%- when 'home' -%}{% render 'wt-home' %}
  {%- when 'blanket' -%}{% render 'wt-blanket', product: product %}
  {%- when 'storybook' -%}{% render 'wt-storybook', product: product %}
  {%- when 'gift-set' -%}{% render 'wt-gift-set', product: product %}
{%- endcase -%}
{% schema %}
{
  "name": "Woven Tails page",
  "settings": [
    { "type": "select", "id": "page", "label": "Page", "default": "home",
      "options": [ { "value": "home", "label": "Home" }, { "value": "blanket", "label": "Blanket" }, { "value": "storybook", "label": "Storybook" }, { "value": "gift-set", "label": "Gift set" } ] }
  ],
  "presets": [ { "name": "Woven Tails page" } ]
}
{% endschema %}
"""

EXTRA_CSS = """
/* ---- Shopify store additions ---- */
.skip { position: absolute; left: -9999px; }
.skip:focus { left: 16px; top: 16px; z-index: 99; background: var(--raised); padding: 8px 12px; border-radius: 8px; }
a.announce { display: block; text-decoration: none; color: var(--bg); }
a.announce b { letter-spacing: .06em; }
.cart-link { position: relative; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; }
.cart-link svg, .menu summary svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.cart-count { position: absolute; top: 2px; right: 0; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px; background: var(--thread); color: var(--on-thread); font: 800 11px/18px var(--body); text-align: center; }
.menu { position: relative; display: none; }
.menu summary { list-style: none; display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; cursor: pointer; }
.menu summary::-webkit-details-marker { display: none; }
.menu[open] summary { background: var(--surface); }
.menu__panel { position: absolute; right: 0; top: calc(100% + 8px); z-index: 40; display: grid; min-width: 220px; padding: 8px; border: 1px solid var(--line); border-radius: 16px; background: var(--raised); box-shadow: var(--shadow); }
.menu__panel a { display: flex; justify-content: space-between; gap: 16px; padding: 12px 14px; border-radius: 10px; font-size: var(--step-0) !important; }
.menu__panel a:hover { background: var(--surface); }
.menu__panel span { color: var(--muted); font-weight: 600; }
.site-head .brand, .nav .btn { white-space: nowrap; }
@media (max-width: 720px) { .menu { display: block; } .nav { gap: 4px; flex-wrap: nowrap; } .site-head .brand { font-size: 1.05rem; gap: 8px; } .nav .btn.small { padding: .65em .95em; } .announce { font-size: .68rem; letter-spacing: .02em; } }
@media (max-width: 370px) { .site-head .brand { font-size: 0; gap: 0; } }
/* store pages */
.sr { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.wt-shell { display: grid; gap: clamp(20px, 3vw, 32px); padding-block: clamp(28px, 5vw, 64px) clamp(48px, 7vw, 96px); }
.wt-shell--center { justify-items: center; text-align: center; }
.wt-shell__head { display: grid; gap: 12px; max-width: 760px; }
.wt-shell h1 { font-size: var(--step-3); }
.lede { font-size: var(--step-1); line-height: 1.5; color: var(--muted); }
.rte { max-width: 70ch; display: grid; gap: 1em; }
.rte h2 { font-size: var(--step-2); margin-top: .6em; }
.rte h3 { font-size: var(--step-1); margin-top: .4em; }
.rte ul, .rte ol { margin: 0; padding-left: 1.3em; display: grid; gap: .35em; }
.rte a, .wt-help a { color: var(--thread); }
.rte table { border-collapse: collapse; width: 100%; }
.rte td, .rte th { border-bottom: 1px solid var(--line); padding: 10px 8px; text-align: left; vertical-align: top; }
.rte details { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: var(--raised); }
.rte summary { cursor: pointer; font-weight: 800; }
.shopify-policy__container { max-width: var(--max) !important; margin-inline: auto; padding: clamp(28px, 5vw, 64px) var(--gutter) clamp(48px, 7vw, 96px) !important; }
.shopify-policy__title h1 { font-size: var(--step-3); margin-bottom: 24px; text-align: left; }
.shopify-policy__body { max-width: 70ch; display: grid; gap: 1em; }
.shopify-policy__body a { color: var(--thread); }
.wt-help { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; padding: 20px; border-radius: 16px; background: var(--surface); max-width: 760px; }
.wt-help p { color: var(--muted); }
.wt-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.wt-list a { display: block; padding: 14px 16px; border: 1px solid var(--line); border-radius: 12px; background: var(--raised); text-decoration: none; font-weight: 700; }
.wt-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; width: 100%; text-align: left; }
@media (max-width: 760px) { .wt-grid { grid-template-columns: 1fr; } }
.wt-grid__card { display: grid; border-radius: 18px; overflow: hidden; background: var(--raised); border: 1px solid var(--line); text-decoration: none; transition: transform .2s; }
.wt-grid__card:hover { transform: translateY(-3px); }
.wt-grid__card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.wt-grid__body { display: flex; justify-content: space-between; gap: 12px; padding: 14px 16px; font-weight: 700; }
.wt-grid__body span { color: var(--muted); }
.wt-form { display: grid; gap: 14px; max-width: 640px; }
.wt-form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 560px) { .wt-form__row { grid-template-columns: 1fr; } }
.wt-form .btn { justify-self: start; }
.wt-alert { padding: 12px 14px; border-radius: 12px; background: #FBEFD9; color: #6B4A12; }
.wt-alert--ok { background: color-mix(in srgb, #2F7A4A 15%, var(--bg)); color: var(--fg); }
.wt-search { display: flex; gap: 10px; max-width: 640px; }
.wt-search input { flex: 1; min-width: 0; font: 600 16px var(--body); padding: 12px 14px; border: 1.5px solid var(--line); border-radius: 12px; background: var(--raised); color: var(--fg); }
.wt-cart { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: clamp(20px, 3vw, 40px); align-items: start; }
@media (max-width: 860px) { .wt-cart { grid-template-columns: 1fr; } }
.wt-cart__items { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.wt-cart__item { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto; gap: 16px; padding: 14px; border: 1px solid var(--line); border-radius: 16px; background: var(--raised); align-items: start; }
.wt-cart__img { width: 96px; height: 96px; object-fit: cover; border-radius: 12px; background: var(--surface); }
.wt-cart__info { display: grid; gap: 6px; min-width: 0; }
.wt-cart__title { font-weight: 800; text-decoration: none; line-height: 1.3; }
.wt-cart__meta, .wt-cart__props { font-size: 14px; color: var(--muted); }
.wt-cart__props { margin: 0; display: grid; gap: 2px; }
.wt-cart__props div { display: flex; gap: 6px; flex-wrap: wrap; }
.wt-cart__props dt { font-weight: 700; } .wt-cart__props dt::after { content: ":"; }
.wt-cart__props dd { margin: 0; overflow-wrap: anywhere; }
.wt-cart__row { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-top: 4px; }
.wt-cart__remove { font-size: 14px; color: var(--muted); }
.wt-cart__price { font-weight: 800; }
@media (max-width: 520px) { .wt-cart__item { grid-template-columns: 76px minmax(0, 1fr); } .wt-cart__img { width: 76px; height: 76px; } .wt-cart__price { grid-column: 2; } }
.wt-qty { display: inline-flex; align-items: center; border: 1.5px solid var(--line); border-radius: 999px; overflow: hidden; }
.wt-qty button { width: 38px; height: 38px; border: 0; background: transparent; color: var(--fg); font: 800 18px var(--body); cursor: pointer; }
.wt-qty input { width: 40px; border: 0; background: transparent; color: var(--fg); text-align: center; font: 800 15px var(--body); -moz-appearance: textfield; }
.wt-qty input::-webkit-inner-spin-button { -webkit-appearance: none; }
.wt-cart__sum { position: sticky; top: 88px; display: grid; gap: 12px; padding: 20px; border: 1px solid var(--line); border-radius: 18px; background: var(--raised); }
.wt-cart__line { display: flex; justify-content: space-between; font-size: var(--step-0); }
.wt-cart__go { width: 100%; min-height: 54px; }
.wt-simple { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(20px, 4vw, 56px); align-items: start; }
@media (max-width: 760px) { .wt-simple { grid-template-columns: 1fr; } }
.wt-simple__img { width: 100%; border-radius: 22px; aspect-ratio: 1; object-fit: cover; }
.wt-simple__copy { display: grid; gap: 16px; }
.wt-simple__form .btn { width: 100%; }
.wt-buy__form { display:grid; gap:14px; counter-reset:wtstep; }
.wt-card { display:grid; gap:12px; padding:16px; border:1px solid var(--line); border-radius:16px; background:var(--raised); }
.wt-card__h { display:flex; align-items:center; gap:10px; margin:0; font:800 17px/1.2 var(--body); letter-spacing:0; color:var(--fg); }
.wt-card__h em { font-style:normal; font-weight:600; font-size:14px; color:var(--muted); }
.wt-card__n { flex:none; display:grid; place-items:center; width:28px; height:28px; border-radius:50%; background:var(--fg); color:var(--bg); font-size:14px; }
.wt-seg { display:flex; flex-wrap:wrap; gap:8px; }
.wt-seg__opt { position:relative; }
.wt-seg__opt input { position:absolute; inset:0; opacity:0; cursor:pointer; margin:0; }
.wt-seg__opt span { display:inline-flex; align-items:center; min-height:44px; padding:8px 18px; border-radius:999px; border:1.5px solid var(--line); background:var(--bg); font:700 15px var(--body); cursor:pointer; }
.wt-seg__opt input:checked + span { background:var(--fg); color:var(--bg); border-color:var(--fg); }
.wt-seg__opt input:focus-visible + span { outline:3px solid var(--thread); outline-offset:2px; }
.wt-buy.has-editor .wt-card--options { display:none; }
.wt-buy__cta { display:grid; gap:14px; }
.wt-buy__btn { width:100%; min-height:56px; font-size:1.08rem; }
.wt-trust { list-style:none; margin:0; padding:0; display:grid; gap:10px; }
.wt-trust li { display:flex; gap:10px; align-items:flex-start; font-size:14px; line-height:1.4; color:var(--muted); }
.wt-trust b { color:var(--fg); }
.wt-trust svg { flex:none; width:22px; height:22px; fill:none; stroke:var(--thread); stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; }
.wt-buy__btn[disabled] { opacity: .6; cursor: progress; }
.wt-secure { display: flex; gap: 8px; align-items: center; justify-content: center; margin: -4px 0 0; font-size: 13px; color: var(--muted); text-align: center; }
.wt-secure svg { flex: none; width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.wt-buy .wt-personalize { margin: 0; background: var(--raised); border-color: var(--line); }
"""


def main():
    (OUT / "layout").mkdir(parents=True, exist_ok=True)
    for d in ("sections", "snippets", "templates", "assets"):
        (OUT / d).mkdir(parents=True, exist_ok=True)
    (OUT / "layout" / "woven.liquid").write_text(LAYOUT)
    (OUT / "sections" / "wt-page.liquid").write_text(SECTION)
    (OUT / "snippets" / "wt-buy.liquid").write_text(BUY)
    for page in ("index", "blanket", "storybook", "gift-set"):
        name = "home" if page == "index" else page
        (OUT / "snippets" / f"wt-{name}.liquid").write_text(convert(page))
    (OUT / "templates" / "index.json").write_text(json.dumps(
        {"layout": "woven", "sections": {"main": {"type": "wt-page", "settings": {"page": "home"}}}, "order": ["main"]}, indent=2))
    for page in HANDLES:
        (OUT / "templates" / f"product.wt-{page}.json").write_text(json.dumps(
            {"layout": "woven", "sections": {"main": {"type": "wt-page", "settings": {"page": page}}}, "order": ["main"]}, indent=2))
    src = ROOT / "shopify" / "theme-src"
    for d in ("sections", "snippets"):
        for f in (src / d).glob("*.liquid"):
            (OUT / d / f.name).write_text(f.read_text())
    (OUT / "layout" / "theme.liquid").write_text(LAYOUT)   # policies and any other page get the same look
    tpl = {"page": "wt-main-page", "page.contact": "wt-contact", "blog": "wt-main-page", "article": "wt-main-page",
           "cart": "wt-cart", "404": "wt-404", "search": "wt-search", "collection": "wt-collection",
           "list-collections": "wt-collection", "product": "wt-product"}
    for name, sec in tpl.items():
        (OUT / "templates" / f"{name}.json").write_text(json.dumps(
            {"layout": "woven", "sections": {"main": {"type": sec, "settings": {}}}, "order": ["main"]}, indent=2))
    (OUT / "assets" / "wt-site.css").write_text((ROOT / "site" / "css" / "site.css").read_text() + EXTRA_CSS)
    (OUT / "assets" / "wt-site.js").write_text((ROOT / "site" / "js" / "site.js").read_text())
    # mirror theme JS/CSS to the Vercel site so they can be updated without republishing the theme
    # (the live theme loads these, so only mirror them when the matching theme is being published)
    import sys
    if "--publish-assets" not in sys.argv:
        print("theme files written to", OUT, "(theme-assets on Vercel left as they are; pass --publish-assets to update them)")
        return
    pub = ROOT / "site" / "theme-assets" / ASSET_VER; pub.mkdir(parents=True, exist_ok=True)
    for f in ("wt-site.css", "wt-site.js", "wt-scenes.js", "wt-stylize.js", "wt-editor.js"):
        (pub / f).write_bytes((OUT / "assets" / f).read_bytes())
    print("theme files written to", OUT)


if __name__ == "__main__":
    main()
