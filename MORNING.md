# Morning checklist: what only you can do

Everything that doesn't need your logins, ID or card is done. These steps are in order; each has the exact instructions linked.

| # | Step | Time | Where | Details |
|---|---|---|---|---|
| 1 | **Point woventails.com to the website** | 5 min | Spaceship → Domain manager → woventails.com → DNS records | Delete the 2 parking A records, add `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`. See `DOMAIN.md` |
| 2 | **Create the Shopify store** (₹20/month offer), set currency to **USD** before anything else | 15 min | shopify.com | `SETUP_CHECKLIST.md`, "Day 1, afternoon" |
| 3 | **Import the 4 products** | 2 min | Shopify → Products → Import → `shopify/products_import.csv` | Imports as drafts; review, then set Active. See `shopify/README.md` |
| 4 | **Connect shop.woventails.com to Shopify** | 5 min | Spaceship: `CNAME shop shops.myshopify.com`; Shopify → Settings → Domains → Connect existing domain | Makes the website's buy buttons work. See `DOMAIN.md` |
| 5 | **PayPal Business (India)**, purpose code **P0108** | 20 min | paypal.com/in | `COMPLIANCE.md` section 3 |
| 6 | **Bank forex-desk message** (free official check) | 2 min | Your bank's net banking / email | Copy-paste text in `COMPLIANCE.md` section 4 |
| 7 | **Policies + emails** into Shopify | 20 min | Settings → Policies; Notifications | `POLICIES.md` (fill brackets), `EMAILS.md` |
| 8 | **Printify account**, card on file, order the storybook sample ($26.01 to India) | 15 min | printify.com | `OPERATIONS.md`, `VERIFICATION.md` |
| 9 | **Instagram, Facebook Page, Pinterest, YouTube** accounts | 20 min | each app | Profile, bio, highlights, launch grid and captions in `SOCIAL.md`; images in `assets/social/` |
| 10 | **Test order** with PayPal, then refund yourself | 10 min | your store | `SETUP_CHECKLIST.md`, "Day 2, afternoon" |

## Optional but useful
- **Connect Shopify to Claude** (claude.ai → Settings → Connectors → Shopify), then start a new session: I can then manage products, pages and orders directly.
- **Email:** forward `hello@woventails.com` to your Gmail with Spaceship's free email forwarding (`DOMAIN.md`).

## Already done (for reference)
- Website live with 3D product previews: https://woven-tails-sujalsharmas-projects.vercel.app (moves to https://woventails.com after step 1)
- Share previews (WhatsApp/Instagram/Facebook link cards), favicon, sitemap, robots.txt, 404 page, clean URLs (`/blanket`, `/storybook`, `/gift-set`)
- 11 videos with music + voiceover, 9 launch posts, highlights, pins: `assets/`
- Product copy, Shopify import file, ads plan, tracker, compliance, operations
