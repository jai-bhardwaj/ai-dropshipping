# Pricing research: top 3 products (real market numbers)

Date: 2026-10-08

## What I could and couldn't get

- **CJ Dropshipping exact costs: not reachable.** CJ's website blocks automated access with a bot-check page, and its API needs an access token from a CJ account. I didn't try to get around either.
- **What I used instead:** public US retail prices (Amazon/Walmart deal posts), wholesale listings, and spec sheets for the same product types. CJ costs are usually close to or below these US retail lows for generic items.

## Results

### 1. Rechargeable magnetic hand warmers (2-pack)

| Source | Price |
|---|---|
| Amazon 2-packs (Bearwind, JIJ 4000mAh, Beyyon, Nhpoi), 2026 deal posts | **$8.87–9.99** with coupons, listed $14–20 |
| Walmart 2-pack (4000mAh, 3 heat levels, 10.5 hrs) | $18.99 |
| US wholesale (UCHANGE, MOQ 5) | $41 at 5 units → $12.22 at 5,000 |
| OCOOPA MagTwins (premium brand, UK) | £25.59 |

**Typical specs:** 3–4 heat levels, 113–145 °F, 3000–10000 mAh, "up to 10–20 hrs" (manufacturer claims), magnetic split, USB-C.

### 2. Mini pocket photo printer (thermal)

| Source | Price |
|---|---|
| Phomemo M02 (the known brand), resellers | **$28.99–37.29**, often with 3 rolls |
| Generic thermal pocket printers, Walmart / eBay | **$16.95–21.95** |
| Alibaba 58 mm Bluetooth printer sample | $13.99 (MOQ 500) |
| Paper rolls (57 mm), retail | $0.96–3.30 per roll |

**Typical specs:** **black-and-white thermal only**, 200–300 dpi, ~50–57 mm paper, 1000–1200 mAh, app-based (e.g. "Fun Print"), iOS + Android.

### 3. Motion-sensor LED cabinet lights (3-pack)

| Source | Price |
|---|---|
| Amazon Olalits 7.8" 3-pack (4.4★, 3,542 reviews) | **$8.49–9.99** |
| Amazon Diomart 11.5" 3-pack / RUIKORING 8.5" 3-pack | $12.99 / $13.49 |
| Walmart single light (500 mAh, USB-C) | $7.14 + $3.99 shipping |
| eBay China seller, single strip | $4.37 + $8.70 shipping |

**Typical specs:** PIR sensor ~10 ft / 120°, auto-off ~20 s, 1000–2000 mAh, charges in 2–3 hrs, 1–3 weeks per charge in sensor mode, magnetic strip + adhesive.

## The problem this shows

| Product | Our planned price | Same thing on Amazon | We'd charge |
|---|---|---|---|
| Hand warmers 2-pack | $34.99 | ~$9–20 | **2–4× Amazon** |
| Mini photo printer | $44.99 | $17–37 | **1.2–2.6× Amazon** |
| Motion lights 3-pack | $32.99 | ~$8.50–13.50 | **2.5–4× Amazon** |

- My shortlist rule was "not sold for less on Amazon/Walmart". **All 3 break that rule.** I picked them on trend + video appeal and didn't check Amazon prices first. That was my mistake.
- US shoppers check Amazon. Charging 2–4× Amazon means lower conversion, more refunds/chargebacks, and angry comments under ads.
- If we price near Amazon instead, the margin is ~$3–8 per order, and the ad cost per sale (realistically $15–40) is far above that. **We'd lose money on every order.**
- The **motion lights** are the worst case (Amazon $8.49 with 3,500+ reviews, Prime delivery).
- The **photo printer** is the least bad: a $34.99 bundle (printer + 3–5 rolls) sits in the same range as Phomemo, but the margin is thin.

## Decision

1. **Pause all 3 products for paid ads.** The scripts and pages stay in the repo; parts of them are reusable.
2. **Redo the shortlist with a hard Amazon price check:** our price must be **≤ 1.3× the cheapest similar Amazon listing** *and* leave **≥ $20 margin**. That points to:
   - **Personalized products** (can't be compared on Amazon: custom name/photo/pet items), or
   - **Bundles/kits Amazon doesn't sell as one item**, or
   - **Products not yet on Amazon in volume** (new on TikTok Shop/CJ).
3. **Personalized pet ornaments look crowded too:** Etsy sells them at $10–25, and Printify's ceramic ornament costs $9.79 + $5.89 shipping. So "personalized" alone doesn't fix it; the margin math has to work per product.

## Getting exact CJ costs

To pull real CJ prices, stock and US-warehouse availability myself, I need a CJ API key:
1. Create a free CJ Dropshipping account and generate an API key (in the CJ account settings, under API).
2. Add it to this cloud environment's settings (environment menu in the session title bar → Edit → environment variables / secrets) as **`CJ_API_KEY`**.
3. Start a new session. I'll read it from there.

Don't paste the key into the chat.

## Sources

- Hand warmers: slickdeals.net deal posts (Bearwind, JIJ, Beyyon, Nhpoi), walmart.com/ip/8555750181, uchangepromo.com, latestdeals.co.uk (OCOOPA), amazonseo.ai
- Photo printer: walmart.com/c/kp/pocket-thermal-printer, ebay.com/itm/405044594158, ubbcentral.com, Phomemo M02 reseller listings, alibaba.com/product-detail/_62141659948.html, typecast.munk.org (paper economics)
- Motion lights: slickdeals.net (Olalits, Diomart), dealmoon.com (RUIKORING), walmart.com/ip/17538912591, vxb.com, ebay.de
- Ornaments: printify.com/app/products/1599, podvector.ai, findniche.com, etsy.com listings
