# AI Dropshipping: plan for the first $100k (60 days)

Start: 2026-10-08 · Target date: 2026-12-07 (this window covers Black Friday / Cyber Monday and the Q4 gifting season)

## 0. Reality check (read this first)

- **The $100k goal is revenue, not profit.** A healthy dropshipping store keeps roughly 10–25% of revenue as net profit. $100k in sales is about **$10k–25k profit** if things go well.
- **Most new stores never reach $100k, and very few reach it in 60 days.** To have a chance, we need a winning product and paid ads that turn a profit, and we need to scale hard during BFCM. The plan below gives us the best odds. It is not a guarantee.
- **It takes cash before it makes cash.** With a 2.5x return on ad spend (ROAS), $100k of revenue needs about **$40k of ad spend**. Payment processors also hold payouts for a while. You need **at least $3–5k** to test products, and scaling depends on putting the profit back into ads (or on a credit line).
- **Rules we never bend:** no fake reviews, no counterfeit or trademarked products, no health claims, and honest shipping times. Breaking these gets ad accounts and Stripe/Shopify Payments accounts banned, and a ban ends the plan.

## 1. Who does what

| Me (Claude, with the tools connected to this session) | You (needs a human, an identity or money) |
|---|---|
| Product research and competitor ad teardowns (web search) | Register the business, bank account, payment processor |
| Store copy, product pages, FAQ, policies, email flows | Shopify account + payment setup, and approving spend |
| AI ad creatives: product images (Higgsfield / OpenArt / Runway), UGC-style video ads, hooks, scripts | Ad accounts (Meta, TikTok), adding the card, final launch clicks |
| Landing pages / advertorials (Vercel), domain search | Ordering samples, checking supplier quality |
| Scheduling organic social posts (SocialAPI) | Customer-service escalations, refunds, chargebacks |
| Daily KPI review: kill / keep / scale decisions | Final say on anything that spends money or posts publicly |

I will ask before anything that spends money, publishes publicly or sends email.

## 2. The model

- **Store:** a one-product (or one-niche) branded Shopify store, not a general store. Branded stores convert better and survive ad-account reviews.
- **Product criteria:** costs ≤ 1/3 of the sale price, sells for $35–80, has a visual "wow" that shows in 3 seconds of video, solves a problem or makes a strong gift, ships in < 10 days (US/EU warehouse preferred: CJ, Zendrop, AutoDS, Spocket), isn't sold at Walmart or Amazon for less, can be bundled to raise order value.
- **Q4 angle:** focus on giftable items (cozy/home, pet, kitchen gadgets, self-care, car accessories, kids' learning toys).
- **Traffic:** Meta ads (main channel) + TikTok ads, with organic TikTok/Reels made from the same AI creatives as a free extra.
- **Unit economics target (example):** price $49.99, product + shipping cost $14, payment fees ~$2, so gross margin is about $34 (68%). **Breakeven ROAS is about 1.5x.** We aim for 2.5x or better.

## 3. Revenue math backwards from $100k

| Phase | Dates | Daily ad spend | Target ROAS | Revenue |
|---|---|---|---|---|
| Build | Oct 8–14 | $0 | — | $0 |
| Test | Oct 15–28 | $100–200 | find ≥ 2.0 | ~$4k |
| Validate + early scale | Oct 29–Nov 11 | $300–700 | 2.2–2.5 | ~$15k |
| Aggressive scale + BFCM | Nov 12–Dec 1 | $1k–3k | 2.0–2.5 | ~$65k |
| Cyber Week tail / gifting | Dec 2–7 | $1k–2k | 2.0 | ~$16k |
| **Total** | | **≈ $40k** | | **≈ $100k** |

At about $50 per order (AOV), that is roughly 2,000 orders. Customer service, fulfillment and cash flow all need to handle that volume.

## 4. Week-by-week execution

### Week 1 (Oct 8–14): foundation
1. **You:** pick the business entity and set up the bank account, Shopify (Basic), Shopify Payments + PayPal, a Meta Business Manager + ad account, a TikTok Ads account and a store email.
2. **Me:** run product research and produce a **shortlist of 10 products** with ad evidence (TikTok Creative Center, Meta Ad Library, AliExpress/CJ order velocity), price and margin math, and supplier options. We narrow it to **3 to test**.
3. **You:** order samples of the top 3 (for real footage and a quality check).
4. **Me:** write the brand name options, store copy, product pages, policies (shipping/returns/privacy/terms), FAQ, and the about page. Pick a theme and plan a conversion layout (sticky add-to-cart, bundles, reviews section that is empty until real reviews come in, trust badges that are true).
5. **Me:** set up Klaviyo email flows (welcome, abandoned cart, abandoned checkout, post-purchase, review request).
6. **Both:** set up the pixel and Conversions API (Meta), the TikTok pixel and GA4. Place a test order end to end.

### Week 2 (Oct 15–21): creative + launch testing
1. **Me:** make **5 ad creatives per product** with AI tools (15 total): 3 UGC-style video ads with different hooks (problem → solution, "TikTok made me buy it", gift angle), 1 product demo and 1 static. AI-generated people get labeled where the platform requires it.
2. **Launch:** one ad-budget-optimized test campaign per product, about $50/day each, broad targeting, 3–5 creatives each.
3. **Kill rules:** shut down any ad that spends 1.5× the target cost per purchase with 0 sales; any ad with click-through rate under 1% after $30; any product with ROAS under 1.2 after $150–200.

### Week 3 (Oct 22–28): find the winner
1. Every day: I read the metrics you export (or share from ad tools) and give kill / keep / scale decisions.
2. Make 5–10 **new hooks** on whatever is working (creative is the main lever, not targeting).
3. Raise average order value: 2-pack/3-pack bundles, a post-purchase upsell, and a free-shipping threshold.
4. **Decision gate (Oct 28):** if one product has ROAS ≥ 2.0 at a CPA ≤ breakeven over 3 days, go all-in on it. If nothing works, test 3 new products in week 4 (budget: another ~$1.5k).

### Weeks 4–5 (Oct 29–Nov 11): validate + early scale
1. Raise budgets 20–30% every 48h on winning ad sets. Duplicate winners into a scaling campaign (Advantage+ Shopping).
2. Add TikTok ads with the best performing creatives.
3. Creative output: **10 new creatives per week** (AI video variations, real footage from samples, testimonials only from real customers).
4. Lock in fulfillment: move to a private agent or US warehouse for faster shipping; negotiate volume pricing.
5. Build the BFCM offer (e.g. tiered "Buy 2, get 1 free" + gift wrap / gift message), plus the email/SMS list sequences.

### Weeks 6–8 (Nov 12–Dec 1): BFCM scale
1. Pre-BFCM: grow the email list with early-access signups from Nov 12.
2. BFCM (Nov 27–Dec 1): spend peaks at $2–3k/day if ROAS holds; tighten kill rules hourly; launch fresh creatives daily.
3. Customer service: macro replies, tracking emails, a helpdesk (Gorgias/Shopify Inbox); you or a VA handle tickets daily.
4. Watch cash: make sure the card limit and payouts cover ad spend at peak.

### Week 9 (Dec 2–7): Cyber week tail + gifting
1. "Order by X for Christmas delivery" urgency (true dates only).
2. Retargeting + email campaigns to past buyers.
3. Review the 60 days: profit and loss, what to keep, and the Q1 plan (second product, more channels).

## 5. Daily operating rhythm (about 30 min of your time + my work)

1. Morning: you share ad + Shopify numbers → I return the kill/keep/scale list and new creative briefs.
2. I produce the creatives and copy → you approve → you (or I, once approved) upload.
3. Evening: check customer service, fulfillment issues and supplier tracking numbers.

**KPIs to track:** spend, revenue, ROAS, CPA vs breakeven CPA, CTR, cost per click, add-to-cart rate, conversion rate (target 2–3%+), AOV, refund/chargeback rate (< 1%), shipping time.

## 6. Budget

| Item | Est. cost |
|---|---|
| Shopify + apps (reviews, upsells, Klaviyo) | ~$150/mo |
| Samples | $100–200 |
| AI creative tools (credits) | $50–150/mo |
| Domain | ~$15 |
| Product testing ad spend | $2–4k |
| Scaling ad spend | funded from revenue (plus a buffer for payout holds) |

## 7. Main risks and how we handle them

| Risk | Mitigation |
|---|---|
| No winning product | Test new products in batches of 3; budget for 2–3 rounds |
| Ad account banned | Branded store, honest claims, verified business, a backup ad account, no policy-borderline products |
| Payout holds / cash crunch | Start with savings or a credit line; scale only as fast as cash allows |
| Slow shipping → chargebacks | US/EU warehouse suppliers, clear shipping times, send tracking quickly |
| Creative fatigue at scale | AI-assisted creative pipeline: 10+ new ads per week |
| Customer-service overload at BFCM | Macro replies, FAQ, hire a VA before Nov 20 |

## 8. What I need from you to start

1. **Budget:** how much can you put into testing + scaling?
2. **Country** you are selling from and to (US? UK? India? EU?). This changes suppliers, payments and ad costs.
3. **Hours per day** you can give to the business.
4. **Niche preferences**, or anything you won't sell.
5. Do you already have Shopify / Meta ad accounts?

Once I have these, step one is the 10-product shortlist (Week 1, item 2).
