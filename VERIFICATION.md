# Pre-launch checks: results (2026-10-08)

## 1. Printify prices: ✅ confirmed (live public catalog data)

Pulled from Printify's own catalog data today (the same numbers the catalog pages and the free-plan editor use). Printify Choice = provider ID 99.

| Item | Base cost (free plan) | US shipping first / additional | Production | US delivery |
|---|---|---|---|---|
| Woven blanket 52×37", Artwork (blueprint 1626) | **$28.85** | **$10.39** / $4.99 | 1.2 days avg | 2–5 business days |
| Hardcover book 8×8", glossy or matte (blueprint 2737) | **$11.42** | **$6.19** / $2.40 | 1.5 days avg | 2–5 business days |

All numbers used in `PRODUCTS.md`, `ADS.md` and `TRACKER.xlsx` match. (Printify Premium, $39/month, would cut the blanket to $21.86 and the book to $8.42. Worth it later, once you sell ~10+ items/month.)

Note: your account may show prices in another currency, or add tax at checkout. The USD base prices are the same.

## 2. Sample shipping to India: ✅ found

Printify has no India-specific rate; India falls under **"Rest of the World"**:

| Sample | Product | Shipping to India | Total | ≈ INR (at ~₹88/$) | Delivery |
|---|---|---|---|---|---|
| **Storybook 8×8** | $11.42 | **$14.59** | **$26.01** | **~₹2,300** | **10–30 business days** |
| Woven blanket 52×37 | $28.85 | $20.79 | $49.64 | ~₹4,400 | 10–30 business days |

What this changes:
- The **storybook sample fits the budget** (~₹2,300). The blanket sample doesn't; launch it with mockups as planned.
- **The sample arrives late Oct to mid-Nov**, so launch with mockups and AI-made sample pages; use the real book for videos once it arrives.
- **Indian customs:** printed books are generally duty-free into India, but couriers sometimes add a small handling fee. Budget ~₹200–500 extra. Blankets would attract import duty (another reason to skip that sample).
- ₹/$ rate is approximate; your card's actual rate + any forex markup (often 1–3.5%) applies.

## 3. Amazon "Tidal Colors" $23.45 blanket: ✅ not a real competitor

- The listing is a **"Custom Picnic Blanket, Personalized Waterproof Outdoor Blanket"** (50×60), not a jacquard-woven cotton throw.
- Tidal Colors' own site says all its blankets (fleece, sherpa, chenille, "woven", etc.) are **printed with dye sublimation**, i.e. the image is printed on top, not woven in.
- The genuine cotton jacquard competitor remains **Pure Country Weavers** ("Traditionally Woven, Not Printed", 100% cotton, Made in USA) at ~$57+ for a larger size.
- **Result: the blanket passes the price check. Keep it as the hero product.**
- Use it in marketing honestly: "woven, not printed" is a real difference, and many "woven" listings on Amazon are printed (say it generally; don't name competitors in ads).

## 4. US trademark search "Woven Tails": ✅ no conflicts found

Searched the USPTO trademark database (tmsearch.uspto.gov backend) today:

| Search | Results |
|---|---|
| Wordmark "woven tails" (exact) | 0 |
| Wordmark "woventails" | 0 |
| Wordmark containing "woven" + "tail…" | 0 |
| Wordmark containing "woven" + "tales" | 0 |

(Search confirmed working: "nike" returned 170 records.)

- This is a **knockout search**, not a legal clearance opinion. It doesn't cover unregistered (common-law) use or similar-sounding marks in other words. A web search also found no store/brand named "Woven Tails".
- Registering your own US trademark later costs ~$350 per class (USPTO fee; current fee schedule applies). Not needed to start.

## 5. Accountant questions: research answers (confirm with a CA)

I can't act as your accountant, but here's what the law and published guidance say for **this exact model** (US printer → US customer, goods never enter India). Take this page to the CA so the consultation is quick.

### GST
- **Sales are outside GST.** CGST Act **Schedule III, para 7**: "supply of goods from a place in the non-taxable territory to another place in the non-taxable territory without such goods entering into India" is **neither a supply of goods nor services**. Printify (US) → customer (US) fits this exactly.
- **Registration:** several practitioner sources say these sales are not part of aggregate turnover, so **registration is likely not required** if this is your only business. One source disagrees (not clearly about pure third-country sales). **Ask the CA to confirm.**
- **Ad spend:** Meta bills Indian advertisers with 18% GST. Without registration you can't claim it back (already included in `ADS.md` math).

### IEC (Import Export Code)
- An IEC is required to import or export goods across India's border. **Your goods never cross it**, so many sources say an IEC isn't needed; generic guides say "all dropshippers need IEC".
- **Not settled.** IEC is free and quick on the DGFT website. Ask the CA (or your bank) whether your bank/PayPal will want it for merchanting receipts. If in doubt, getting it costs nothing.

### PayPal purpose code
- RBI has no "dropshipping" code. Your model (buy from a foreign supplier, sell to a foreign buyer, goods move directly between them) is **merchanting trade**.
- Code: **P0108**, "Goods sold under merchanting / receipt against export leg of merchanting trade". PayPal community reports show PayPal steering Indian dropshippers to P0108.
- **Merchanting rules (RBI Master Direction on Export of Goods and Services, merchanting section, from the Jan 2020 circular):** you must be a genuine trader with confirmed orders; each trade should be profitable; goods must be legal to import/export under India's Foreign Trade Policy; the trade completes within the set time limits; payments go through one authorized dealer bank. An RBI 2024 draft proposed relaxing some of these; **check the current version with the CA**.
- **Practical issue to raise with the CA:** you pay Printify with an Indian card (import leg) and receive through PayPal (export leg). Ask if that satisfies the "single AD bank" condition, or whether you should pay Printify from the same bank that receives PayPal withdrawals.

### Income tax
- Profit is taxable in India as business income. Keep every invoice (Printify, Shopify, Meta, domain, AI tools) and PayPal reports from day 1.
- At small scale, presumptive taxation (Section 44AD) is often used; ask the CA if it fits.

### The 5 questions to ask the CA (updated)
1. My sales are US-to-US (Printify → customer). Schedule III para 7 makes them non-supply. Do I need GST registration at all?
2. Do I need an IEC for merchanting-type receipts via PayPal, or is it optional?
3. Is P0108 the right PayPal purpose code, and how do I meet the RBI merchanting conditions (single AD bank, timing, documents)?
4. Is paying Printify by Indian card OK under merchanting rules, or should I route payments differently?
5. How do I report this income (44AD or regular books), and what records should I keep?

## Sources
- Printify catalog data: printify.com/product-catalog-service/api/v2/blueprints/1626 and /2737 (print-providers, variants, shipping), retrieved 2026-10-08
- Tidal Colors: amazon.com/dp/B0H5R1SWJZ (listing title), tidalcolors.com/pages/blanket (printing method); Pure Country Weavers: amazon.com/dp/B0753GLVW3
- USPTO: tmsearch.uspto.gov (searches run 2026-10-08)
- GST: CBIC CGST Act Schedule III (taxinformation.cbic.gov.in); taxadda.com, taxwink.com, india-briefing.com
- Purpose codes / merchanting: rbidocs.rbi.org.in (A.P. DIR circular, merchanting), razorpay.com/blog/p0108…, skydo.com/rbi-purpose-codes/P0108…, ebrc.in/resources/dropshipping-purpose-code, paypal-community.com (purpose code for dropshipping), rbi.org.in Master Direction on Export of Goods and Services
- IEC: cleartax.in/s/import-export-code, incorpx.io, ciim.in
