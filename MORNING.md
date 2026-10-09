# Morning checklist: what only you can do

Everything that doesn't need your logins, ID or card is done (see "Already done" below). Steps 1–6 make the store take real orders end to end.

| # | Step | Time | Where | Details |
|---|---|---|---|---|
| 1 | **Store emails** → `hello@woventails.com` | 2 min | Shopify → Settings → General → Store contact email + Sender email | Customer replies (with pet photos) then reach your iCloud instead of the Apple relay address |
| 2 | **Privacy policy (2 edits) + Contact information** | 5 min | Shopify → Settings → Policies | Exact text: `shopify/policies-paste.md`. Also: Terms of service → "Create from template", then paste the 4 Woven Tails paragraphs back at the end |
| 3 | **Payments: PayPal Business (India)**, purpose code **P0108** | 20 min | paypal.com/in, then Shopify → Settings → Payments → PayPal → Activate | `COMPLIANCE.md` section 3. Without this, nobody can pay |
| 4 | **Printify card on file** | 2 min | printify.com → Account → Payments | Orders are placed manually after the customer approves the art (`OPERATIONS.md`). Don't let Printify create duplicate products |
| 5 | **Order confirmation email asks for the photo** | 5 min | Settings → Notifications → Order confirmation | Text in `EMAILS.md` |
| 6 | **Remove the store password + test order** | 15 min | Online Store → Preferences → uncheck "Restrict access". Buy the $19 extra copy with WELCOME10, then refund it | Buy buttons on woventails.com already point to shop.woventails.com |
| 7 | **Theme look**: add the logo (`assets/logo/`) and brand colors (`BRAND.md`) | 15 min | Online Store → Themes → Customize | Menus are already set |
| 8 | **Bank forex-desk message** | 2 min | Your bank | `COMPLIANCE.md` section 4 |
| 9 | **Order the storybook sample** ($26.01 to India) | 5 min | Printify | `VERIFICATION.md` |
| 10 | **Instagram, Facebook Page, Pinterest, YouTube** | 20 min | each app | `SOCIAL.md`; images in `assets/social/`, videos in `assets/videos/` |

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
- **Menus:** main menu (Home, Woven Blanket, Storybook, Gift Set, FAQ, Contact); footer (About, FAQ, Contact, all 4 policies, Privacy choices, Search).
- **Domain:** `shop.woventails.com` is the store's primary domain, with HTTPS.
- **Store name** Woven Tails; refund, shipping and terms policies saved; Printify app connected.
- **Discount codes:** **WELCOME10** (10%) and **THANKYOU15** (15%). Each works once per customer and has no end date.

**Email:** `hello@woventails.com` (and anything @woventails.com) forwards to your iCloud. SPF and DMARC records are set.

**Content:** 11 videos with music and voiceover, 9 launch posts, highlights and pins (`assets/`). Also ready: product copy, ads plan (`ADS.md`), tracker, compliance and operations docs.

## Then: Meta ads
Read `ADS.md` (break-even CAC per product, targeting, stop/scale rules). The 3D reels in `assets/videos/` (`4A`–`4D`) and the UGC scripts in `SCRIPTS.md` are your first creatives. Install the Meta pixel through Shopify's **Facebook & Instagram** app before spending anything.
