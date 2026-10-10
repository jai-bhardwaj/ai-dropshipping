# Shopify paste-ready product content

> **Status: done.** All 4 products, the collection, pages, free US shipping, the US market and discount codes were created directly in the store through the Shopify connector. You don't need the import below unless you rebuild the store. Policies still need pasting: `policies-paste.md`.

## Fastest way: import all products in one go
1. In Shopify admin: **Products → Import → Add file** → choose `products_import.csv` → **Upload and preview** → **Import products**.
2. This creates 4 products as **drafts** (nothing is visible to shoppers yet):
   - Custom Pet Portrait Woven Blanket: $64, styles Bold Pop / Christmas Scarf / Royal, 7 images
   - Personalized Pet Storybook: $42, versions Dog / Cat / Memorial, 6 images
   - Gift Set (blanket + storybook): $99 (compare-at $106), 3 styles, 3 images
   - Extra Copy of Your Pet Storybook: $19 add-on
   Descriptions, SEO titles, alt text, SKUs and URL handles are all filled in. Images load from the live site (woven-tails…vercel.app).

**Domain:** connect the store as `shop.woventails.com` (see `DOMAIN.md`); the website's buy buttons point there.
3. Inventory is not tracked and "continue selling when out of stock" is on (everything is made to order). Fulfillment is manual: you place each order in Printify after the customer approves the art (`OPERATIONS.md`).
4. Check each product, then set **Status: Active** to publish.

The handles match the buy buttons on the website, so those start working as soon as the products are active on `woventails.com`.

## Manual way (field by field)

For each product in Shopify (Products → Add product), fill in:

| Field | Blanket | Storybook | Gift set |
|---|---|---|---|
| Title | Custom Pet Portrait Woven Blanket, Illustrated from Your Photo | Personalized Pet Storybook, Starring Your Dog or Cat | The Woven Tails Gift Set: Pet Portrait Blanket + Storybook |
| Description (click `<>` "Show HTML", paste) | `blanket-description.html` | `storybook-description.html` | `gift-set-description.html` |
| Price | $64.00 | $42.00 | $99.00 |
| Compare-at price | leave empty | leave empty | $106.00 (true sum of both) |
| Variants | Art style: Bold Pop / Christmas Scarf / Royal | Version: Dog / Cat / Memorial; add-on "2nd copy" as a separate $19 product | Art style: Bold Pop / Christmas Scarf / Royal |
| URL handle | `custom-pet-portrait-woven-blanket` | `personalized-pet-storybook` | `pet-portrait-gift-set` |
| SEO title | Custom Pet Portrait Woven Blanket \| 100% Cotton, From Your Photo | Personalized Pet Storybook \| Your Real Pet Illustrated \| Hardcover | Pet Portrait Gift Set \| Woven Blanket + Storybook |
| SEO description | Your dog or cat, illustrated from your photo and woven into a 100% cotton blanket with fringe. You approve the art first. Made in the USA. | A 24-page hardcover picture book starring your own dog or cat, illustrated from your photo on every page. Made in the USA. | A woven pet portrait blanket and a storybook starring their pet, from one photo, shipped together. $99. |
| Images (in order) | `site/img/blanket-sofa-golden.jpg`, `art-golden-pop.jpg` (+ the other styles), `blanket-weave-closeup.jpg`, `blanket-tree-collie.jpg`, `blanket-bed-tabby.jpg` | `site/img/book-table.jpg`, `site/tex/dog-12.jpg`, `dog-16.jpg`, `cat-10.jpg`, `book-bed-tabby.jpg`, `presenter-book.jpg` | `site/img/bundle-giftbox.jpg`, `blanket-sofa-golden.jpg`, `book-table.jpg` |
| Image alt text | "Woven pet portrait blanket (illustration of the product)" etc.; say "illustration of the product" until you have real photos | | |
| Product video | `assets/videos/1A-photo-to-blanket.mp4` | `assets/videos/2A-storybook-hero.mp4` | `assets/videos/3A-gift-set.mp4` |
| Shipping | Physical product, weight from Printify | same | same |
| Track quantity | Off (made to order) | Off | Off |

The full long-form copy (gallery plan, FAQ, extra notes) is in `PRODUCT_PAGES.md`; the 3D landing pages are in `site/`.

**FAQ on Shopify:** add the FAQ from `PRODUCT_PAGES.md` with the theme's "Collapsible content" block on the product template (Online Store → Customize → Products → Default product → Add block).
