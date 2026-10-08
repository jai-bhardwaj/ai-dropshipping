# Woven Tails website (landing pages with live 3D)

Static site: home page + 3 product landing pages, each with an interactive 3D scene (three.js r160).

| Page | 3D scene | Buy button goes to |
|---|---|---|
| `index.html` | Woven blanket that ripples like cloth; try 4 sample pets | product pages |
| `blanket.html` | Same blanket with pet + style picker (12 combinations) | `woventails.com/products/custom-pet-portrait-woven-blanket` |
| `storybook.html` | Hardcover book that turns its own pages; dog/cat toggle, prev/next | `woventails.com/products/personalized-pet-storybook` |
| `gift-set.html` | Gift box that opens and lifts out the blanket and book | `woventails.com/products/pet-portrait-gift-set` |

Buy buttons point at the Shopify product URLs from `PRODUCT_PAGES.md`. They work once those products exist in Shopify with exactly these handles.

## How the 3D works
- `js/scenes.js`: the three scenes. The blanket face is generated in the browser from the artwork: limited yarn palette + over/under thread shading + a bump map for texture, fringe on both ends, cloth waves. Drag to orbit; the scenes pause when off-screen and respect "reduce motion".
- If WebGL isn't available, a still image shows instead (`.fallback`).
- `render.html` is a full-screen stage only used to export 3D video clips (`scripts/record_3d.mjs`).

## Editing
Pages are built from `src/` (shared head/header/footer in `src/_*.html`):
```bash
cd site && python3 build.py      # rebuilds index.html, blanket.html, storybook.html, gift-set.html
python3 -m http.server 8765      # preview at http://localhost:8765
```

## Going live: pick one
1. **Recommended: use these as ad landing pages on a subdomain** (e.g. `get.woventails.com`), and keep checkout on Shopify.
   - Free hosting: Vercel or Netlify. Drag the `site/` folder into Netlify Drop, or import the repo in Vercel with root directory `site/`.
   - In Shopify → Settings → Domains, keep `woventails.com` on Shopify; add `get.woventails.com` as a CNAME to the host.
2. **Inside Shopify:** add a "Custom Liquid" section to the product template, paste a stage `<div>` plus the `<script type="importmap">` and module script, and upload `js/scenes.js` + `tex/` images to Shopify Files (then change the `base` path in the script to the Files URL). This puts the 3D preview right on the Shopify product page.

## Size
~12 MB total (images and textures ~9 MB, 5 compressed videos ~4 MB). Images are lazy-loaded; videos only play when visible.
