# Setup checklist: everything you do once, in order

Total time: about 1–2 days. Total cost: about ₹1,000 (Shopify offer + domain). Tick each box as you go.

Rules for the whole setup:
- Use **one email** for everything business-related (create a new Gmail, e.g. `[storename].store@gmail.com`).
- Use your **real name, address and PAN/ID** everywhere. Fake details get PayPal and Meta accounts frozen, often with money inside.
- Save every login in a password manager (Google Password Manager is fine). Turn on 2-step verification everywhere.

---

## Day 1, morning: legal and money

- [ ] **Business email:** new Gmail account for the store.
- [ ] **CA consultation (₹1,000–2,000, or a friend who's a CA).** Ask these 4 questions:
  1. Do I need GST registration to sell goods to US customers through a foreign supplier (goods never enter India)? If yes, should I file a LUT?
  2. Do I need an IEC (Import Export Code) for this?
  3. Which PayPal purpose code should I use?
  4. How do I report this income in my income tax return?
- [ ] **IEC (if the CA says yes):** free, online at the DGFT website, takes ~1 day. Needs PAN, Aadhaar, bank details.
- [ ] **PayPal Business account (India)**
  1. Sign up for a **Business** account (not Personal).
  2. Add PAN, bank account, business details.
  3. Set the **purpose code** for your sales (as advised by your CA; for goods sales it's usually a goods-export code).
  4. Verify the bank account (small test deposits).
  5. Note: PayPal India withdraws to your bank in INR automatically. Keep the FIRC/advice records PayPal provides for taxes.

## Day 1, afternoon: store

- [ ] **Shopify account:** sign up at shopify.com (India) → 3-day trial → choose the ₹20/month for 3 months offer on the Basic plan (check it's offered at checkout).
  - Store name: (picked in `BRAND.md` once products are final)
  - Store currency: **USD** (Settings → Store details → Store currency). **Set this before adding products**; changing it later is painful.
  - Billing currency stays INR; that's fine.
- [ ] **Theme:** Online Store → Themes → use **Dawn** (free) or **Refresh** (free). No paid theme needed.
- [ ] **Domain:** Settings → Domains → Buy a `.com` (~₹900/yr). Pick from the names in `BRAND.md`.
- [ ] **Payments:** Settings → Payments → add **PayPal** (connect your PayPal Business account). Shopify Payments is not available in India; that's expected.
- [ ] **Markets:** Settings → Markets → primary market **United States**. Turn off India as a selling market for this store.
- [ ] **Shipping:** Settings → Shipping and delivery → create "United States" zone:
  - Standard shipping: Free over $50, $4.99 under $50 (adjust per `PRODUCT_PAGES.md` pricing).
- [ ] **Taxes:** Settings → Taxes and duties → United States. Ask your CA about US sales tax; most small foreign sellers start without US sales tax registration, but confirm.
- [ ] **Policies:** Settings → Policies → paste from `POLICIES.md` (fill the brackets first).
- [ ] **Checkout:** Settings → Checkout →
  - Customer contact: **email**
  - Turn on: "Show a sign-up option at checkout" (email marketing)
  - Tipping: off
- [ ] **Notifications:** Settings → Notifications → customize the order confirmation + shipping confirmation with your logo (texts in `EMAILS.md`).

## Day 1, evening: apps (all free plans)

- [ ] **Supplier app:** CJdropshipping (for CJ products) and/or **Printify** (for print-on-demand products). Connect, then import the chosen products.
  - In CJ, only choose variants **shipped from the US warehouse**.
  - Turn on **automatic order fulfillment** only after your first 5 manual orders go fine.
- [ ] **Reviews:** **Judge.me** (free). Turn on automatic review request emails ~7 days after delivery. **No imported/fake reviews.**
- [ ] **Email marketing:** **Shopify Email** (free up to 10,000 emails/month) or Klaviyo (free up to 250 contacts). Set up flows from `EMAILS.md`.
- [ ] **Facebook & Instagram app** (by Meta): connect the Meta Business account (next section). This installs the **Meta Pixel + Conversions API** in one go; choose data sharing **"Maximum"**.
- [ ] **Pinterest app:** connect Pinterest Business; installs the Pinterest tag and syncs products as catalog pins.
- [ ] **Google & YouTube app:** connect for Google Merchant Center (free listings on Google Shopping) and YouTube.

## Day 2, morning: social accounts

- [ ] **Instagram:** new account with the store name → switch to **Professional → Business**. Bio: one-line promise + link to the store.
- [ ] **Facebook Page:** create a Page with the store name (needed for ads), link the Instagram account.
- [ ] **Meta Business Suite / Business Manager:** business.facebook.com → create a business → add the Page + Instagram + an **ad account** (currency **USD**, time zone **America/New_York**; currency can't be changed later).
  - Add payment method (Indian card works; Meta adds 18% GST to the bill).
  - Verify the domain in Business settings → Brand safety → Domains.
- [ ] **YouTube channel:** on the business Gmail, channel name = store name.
- [ ] **Pinterest Business:** create, claim your domain, create 5 boards (names in `PINTEREST.md` once products are final).
- [ ] **WhatsApp Business (optional):** for customer support only; US customers mostly prefer email.

## Day 2, afternoon: test everything

- [ ] **Place a real test order** on your own store with PayPal (buy the cheapest item, then refund yourself). Check:
  - [ ] Order confirmation email arrives and looks right
  - [ ] Order shows up in the supplier app (CJ/Printify)
  - [ ] **Meta Events Manager** shows PageView, ViewContent, AddToCart, InitiateCheckout, **Purchase** (use the "Test events" tab)
  - [ ] Pinterest tag shows checkout event
- [ ] **Mobile check:** open the store on your phone; product page loads in under 3 seconds, the add-to-cart button is visible without scrolling.
- [ ] **Remove the password page:** Online Store → Preferences → turn off password protection (only once everything above works).

## Before the first ad (later, week 5)

- [ ] At least 1 product with organic signal (see `PLAN.md`)
- [ ] Pixel shows Purchase events correctly
- [ ] Policies live, contact email working, refund process clear
- [ ] Ad account has spent $0 so far without warnings (check Account Quality)
