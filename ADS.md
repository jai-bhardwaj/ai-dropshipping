# Meta ads plan: customer acquisition cost (CAC) + targeting, Woven Tails

Date: 2026-10-08 · Ads market: **United States** (Printify ships from US providers)

## 1. The honest headline

- Across e-commerce on Meta in 2026, the **typical cost per purchase (CPA) is ~$39** (Triple Whale median: CPM ~$15, conversion ~1.5%).
- Our margins are **~$20–21 per single item** and **~$39 per bundle**. So **average ads lose money**; we need better-than-average ads (**CPA under ~$17–22** depending on product) and **bundle upgrades**.
- Personalized, emotional gifts usually convert better than generic gadgets, and the photo→art transformation is a strong hook, but that's a hope until our own data shows it.
- **That's why organic (Reels/Shorts/Pinterest) is the main channel**, and ads start only on a video that already proved itself for free.
- **Black Friday week:** ad prices (CPM) rise ~8–36% vs October.

## 2. How CAC is calculated
```
CPA = CPM ÷ (1,000 × CTR × conversion rate)
```
| Scenario | CPM | Link CTR | Store conversion | CPA |
|---|---|---|---|---|
| Bad ad | $18 | 1.0% | 1.0% | $180 |
| Average | $15 | 1.5% | 1.5% | ~$67 |
| Good ad | $15 | 2.0% | 2.5% | $30 |
| **Target** | $13 | 2.5% | 3.5% | **~$15** |

**Indian advertiser note:** Meta charges **18% GST** on ad spend billed in India ($10 → ~$11.80; claimable only if GST-registered). All break-even numbers below include it.

## 3. Break-even per product

Fees ≈ 6.5% + $0.30 per order (PayPal + Shopify third-party fee). Costs from Printify (Printify Choice, live 2026-10-08).

| | Blanket page | Storybook page | Bundle (direct) |
|---|---|---|---|
| Price | $64 (30% upgrade to $99 bundle, assumed) | $42 (20% add 2nd copy +$19, assumed) | $99 |
| Margin per order (blended) | ~$25.97 | ~$22.09 | ~$39.20 |
| Average order value | ~$74.50 | ~$45.80 | $99 |
| **Break-even CPA** (Meta, pre-GST) | **~$22.00** | **~$18.70** | **~$33.20** |
| **Target CPA** (~$6 profit/order) | **≤ $16.90** | **≤ $13.60** | **≤ $28.10** |
| Break-even ROAS | ~3.4 | ~2.4 | ~3.0 |
| Target ROAS | ≥ 4.4 | ≥ 3.4 | ≥ 3.5 |

The bundle-upgrade shares (30% / 20%) are assumptions. Replace them with real numbers in `TRACKER.xlsx` after the first 20 orders.

**What this means:** the blanket needs a very strong ad (ROAS 3.4+ just to break even). The **storybook has the easier break-even ROAS (~2.4)**, so if both get organic traction, test the book first in ads.

## 4. Who to target

### How Meta targeting works now (2026)
- Interests (and age/gender when Advantage+ Audience is on) are **suggestions**; Meta's AI finds buyers. The only hard controls: **country** and **minimum age**.
- **The creative is the targeting:** a dog in the video finds dog people; a Christmas tree finds gift buyers.
- **One campaign, one ad set, 3 ads.** Don't split a $5–8/day budget.

### Woven blanket
| | |
|---|---|
| Main buyer | Women 25–55 who are dog/cat owners, buying for themselves or as a gift |
| Second buyer | Gift buyers for parents/grandparents ("grand-dog"), partners; pet-memorial gifts |
| Age setting | Min 25; suggestion 25–55 |
| Gender | Suggest women; let Meta expand |
| Interest suggestions | Dog lovers, cat lovers, pet adoption, dog moms, Christmas gifts |
| Lead creative | 1A (transformation), then 1B (dog mom gift) from mid-Nov |

### Storybook
| | |
|---|---|
| Main buyer | Parents 25–45 with young kids and a family pet (mostly moms) |
| Second buyer | Grandparents 50–65; adult pet owners without kids (cat version, humor) |
| Age setting | Min 25; suggestion 25–45 (test 50–65 separately later) |
| Interest suggestions | Dog lovers, cat lovers, children's books, parenting, bedtime stories |
| Lead creative | 2A (your dog is the hero), 2B (bedtime) for parents |

### Ad copy rules (Meta policy)
- Don't assert personal attributes: avoid "Lost your dog?" or "Grieving your cat?". Use "A gentle way to remember a beloved pet."
- No identifiable children's faces in ads.
- No "#1", "bestselling", or fake reviews; "Made in the USA" only for the Printify US providers (true for Printify Choice; recheck if you switch provider).

**Buyer profiles are educated guesses.** Ads Manager breakdowns (age, gender, region) after the first ~$20–30 show who actually buys; follow the data.

## 5. Budget reality
- With ₹5,000 total and a sample to buy, **there's little or nothing left for ads at launch** (see `PLAN.md`). Ads start from **organic profit**.
- A fair ad test needs **2–3× break-even CPA per product: ~$40–60**. That's the first ~2–3 organic orders' profit.

### Test campaign setup
| Setting | Choice |
|---|---|
| Objective | Sales |
| Conversion event | Purchase (Pixel + Conversions API via the Facebook & Instagram Shopify app, tested first) |
| Budget | $5–8/day, campaign level |
| Audience | Advantage+ Audience, US, min age 25, suggestions above |
| Placements | Advantage+ (mostly Reels/Stories for vertical video) |
| Ads | The 3 best-performing organic videos for that product |
| Don't touch | First 3–4 days (learning phase) |

### Stop / keep / scale rules
| Signal | Action |
|---|---|
| $8 spent, link CTR < 1% | Stop that ad |
| 1× break-even CPA spent, 0 add-to-carts | Stop that ad |
| 2× break-even CPA spent, 0 purchases | Stop that ad |
| CPA below break-even for 3 days | Keep, add 3 new hooks |
| CPA below target for 3 days | +20–30% budget every 2 days |
| CPA above break-even 2 days after scaling | Back to last good budget |

## 6. Sources
- Meta e-commerce benchmarks 2026 (Triple Whale data): coupler.io, fibbler.co, digitalapplied.com, mhigrowthengine.com, rule1.ai
- Meta targeting changes 2025–26: conversios.io, thoughtmetric.io, webtonic.io, 1clickreport.com
- BFCM 2025 ad costs: ppc.land (Billy Grace), enhencer.com, insense.pro
- Product costs: Printify catalog (blueprints 1626, 2737), retrieved 2026-10-08
