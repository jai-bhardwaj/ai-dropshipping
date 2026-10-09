# Morning checklist: what only you can do

Everything that doesn't need your logins, ID or card is done (see "Already done" below). These steps are in order. Steps 1–7 make the store take real orders end to end.

| # | Step | Time | Where | Details |
|---|---|---|---|---|
| 1 | **Rename the store to "Woven Tails"** and set the sender email to your Gmail | 2 min | Shopify → Settings → General → Store name / Store email + Sender email | The connector can't rename the store. Until you do, the checkout, emails and privacy policy say "My Store" |
| 2 | ~~Email forwarding~~ **Done:** `hello@woventails.com` forwards to your iCloud (Forward Email, set up via the Spaceship connector). Now set Shopify → Settings → General → Store contact email + Sender email to `hello@woventails.com` | 2 min | Shopify | |
| 3 | **Connect shop.woventails.com** | 5 min | Spaceship DNS: add `CNAME` · host `shop` · value `shops.myshopify.com`. Then Shopify → Settings → Domains → Connect existing domain → `shop.woventails.com` → set as primary | Makes every buy button on woventails.com work. See `DOMAIN.md` |
| 4 | **Payments: PayPal Business (India)**, purpose code **P0108** | 20 min | paypal.com/in, then Shopify → Settings → Payments → PayPal → Activate | `COMPLIANCE.md` section 3 |
| 5 | **Paste the policies** | 5 min | Shopify → Settings → Policies | Already filled in, copy-paste only: `shopify/policies-paste.md` |
| 6 | **Printify**: create an account, connect it to Shopify, put a card on file | 15 min | printify.com → Manual store or the Shopify app | Orders are placed manually after the customer approves the art (`OPERATIONS.md`). **Don't** let Printify create duplicate products; the 4 products already exist |
| 7 | **Remove the store password + test order** | 15 min | Online Store → Preferences → uncheck "Restrict access". Then buy the $19 extra copy with WELCOME10, then refund it | `SETUP_CHECKLIST.md`, "Day 2, afternoon" |
| 8 | **Theme**: pick Dawn (free), add the logo `assets/logo/`, colors from `BRAND.md`, and add About / FAQ / Contact to the footer menu | 20 min | Online Store → Themes → Customize; Navigation | The pages already exist |
| 9 | **Bank forex-desk message** (free official check) | 2 min | Your bank's net banking / email | Copy-paste text in `COMPLIANCE.md` section 4 |
| 10 | **Order the storybook sample** ($26.01 to India) | 5 min | Printify | `VERIFICATION.md` |
| 11 | **Instagram, Facebook Page, Pinterest, YouTube** | 20 min | each app | `SOCIAL.md`; images in `assets/social/`, videos in `assets/videos/` |
| 12 | **Emails**: order confirmation must ask for the photo | 15 min | Settings → Notifications → Order confirmation | Text in `EMAILS.md` |

## Already done
**Website (Vercel):** live at **https://woventails.com** with HTTPS. `www` redirects to it. The home page and 3 product pages have live 3D. Also done: share previews, sitemap, a 404 page, and clean URLs (`/blanket`, `/storybook`, `/gift-set`).

**Shopify store** (`x0e02x-4x.myshopify.com`, USD), set up through the connector:
- **4 products, active and on the Online Store**, each with copy, SEO, variants, weights and 17 images:
  - Blanket $64 (Bold Pop / Christmas Scarf / Royal)
  - Storybook $42 (Dog / Cat / Memorial)
  - Gift set $99 (compare-at $106)
  - Extra copy $19
- Inventory isn't tracked because everything is made to order.
- **Collection:** "Pet Portrait Gifts".
- **Pages:** About us (`/pages/about`), FAQ (`/pages/faq`), Contact (`/pages/contact`).
- **Shipping:** one zone, United States, **free standard shipping**. The old India and international ₹ rates are removed.
- **Markets:** a **United States** market is added and active, in USD.
- **Discount codes:** **WELCOME10** (10%) and **THANKYOU15** (15%). Each works once per customer and has no end date.

**Content:** 11 videos with music and voiceover, 9 launch posts, highlights and pins (`assets/`). Also ready: product copy, ads plan (`ADS.md`), tracker, compliance and operations docs.

## Then: Meta ads
Read `ADS.md` (break-even CAC per product, targeting, stop/scale rules). The 3D reels in `assets/videos/` (`4A`–`4D`) and the UGC scripts in `SCRIPTS.md` are your first creatives. Install the Meta pixel through Shopify's **Facebook & Instagram** app before spending anything.
