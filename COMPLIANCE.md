# Compliance without a CA: what to do, step by step

Date: 2026-10-08 · For: individual in India, selling to US customers, Printify (US) ships directly to them, paid via PayPal.

**Disclaimer:** this is my best reading of the law and official guidance, not professional advice. The risk is low at small sales, but once you pass the triggers in section 6, pay for a one-time online CA consult (~₹500–1,500).

---

## 1. GST: **don't register (for now)**

**Why:** CGST Act Schedule III, para 7 says a supply of goods from one place outside India to another place outside India, *without the goods entering India*, is **neither a supply of goods nor services**. Printify (US) → your customer (US) is exactly that. Most practitioner sources say these sales don't count toward the ₹40 lakh / ₹20 lakh registration threshold.

**What you do:** nothing. Don't charge GST, don't register.

**Revisit if any of these happen:**
- You sell to customers **in India**
- Goods ever **enter India** (e.g. you stock inventory here)
- You earn **commission/service income** from Indian companies
- PayPal, your bank, or a marketplace **asks for a GSTIN**

## 2. IEC (Import Export Code): **not upfront; get it when asked**

**Why:** an IEC is required to import or export goods across India's border. Your goods never cross it, and sources disagree on whether merchanting needs one.
**Cost:** ₹500 government fee (correction: earlier files said "free"), online at dgft.gov.in, form ANF-2A, PAN + Aadhaar OTP, usually issued in 1–3 days. Your IEC number = your PAN. Update it on DGFT every April–June.

**What you do:** skip it at launch to protect the ₹5,000 budget. Get it **as soon as** PayPal or your bank asks for it, **or** once you've made ~₹5,000 profit, whichever comes first. It removes doubt for little money.

## 3. PayPal: set up correctly from day 1

1. Open a **PayPal Business** account as an **individual / sole proprietor** with your PAN (no company needed).
2. Business category: **Retail / Gifts** (or closest match). Describe the business truthfully: "online store selling personalized pet gifts to US customers, made and shipped by a US print partner".
3. **Purpose code: P0108**, "Goods sold under merchanting / receipt against export leg of merchanting trade". RBI's code list has no "dropshipping" code; your model (buy from a foreign supplier, sell to a foreign buyer, goods move directly) is merchanting. PayPal community reports show PayPal steering Indian dropshippers to P0108.
4. Link the **bank account in your own name**. PayPal India auto-withdraws to it in INR.
5. Download PayPal's **monthly statements** and keep the **FIRA/remittance advice** your bank gives for each credit (section 5).

## 4. Paying Printify: keep both money legs in one bank

RBI's merchanting rules expect the "buying" payment (to Printify) and the "selling" receipt (from PayPal) to go through **one authorized-dealer (AD) bank**.

**What you do:**
- Pay Printify with a **debit/international card from the same bank** that receives your PayPal withdrawals.
- Expect a forex markup (often 1–3.5%) on each Printify payment. It's already covered by the margin buffer; note it in `TRACKER.xlsx` if large.
- Overseas card spending under ₹10 lakh a year has no TCS; you're far below that.

### Free official answer: ask your bank's forex desk
Your bank **is** the authorized dealer, and confirming purpose codes and merchanting documentation is their job. It costs nothing. Send this from net-banking messages or email, or say it at the branch:

> Subject: Purpose code and documentation for merchanting trade receipts via PayPal
>
> Hello, I hold savings/current account no. [XXXX] with you. I run a small online store as an individual: customers in the USA pay me via PayPal, and a US supplier (Printify) makes and ships the goods directly to them; the goods never enter India. I pay the supplier with my [bank] debit card.
>
> 1. Is **P0108 (merchanting trade, export leg)** the correct purpose code for the PayPal credits?
> 2. Does paying the supplier by debit card from the same account satisfy the merchanting trade requirements, or is another route needed?
> 3. Do you need my IEC for these credits, or any other documents (invoices, supplier receipts)?
> 4. Will you issue a FIRA/advice for each PayPal credit?
>
> Thank you, [Name], [PAN last 4 digits only]

Save their reply in your records folder.

## 5. Income tax: simple and probably ₹0 this year

**Scheme:** presumptive taxation. **Section 58 of the Income-tax Act, 2025** (in force from 1 April 2026; it replaces old Section 44AD).
- Deemed profit = **6% of turnover** when receipts are digital (PayPal/bank), instead of keeping full accounts.
- Turnover limit: up to ₹2–3 crore (you're nowhere near).
- **Turnover = total sales received** (the INR amounts PayPal deposits, before Printify costs).

**Example:** ₹2,00,000 of sales in a year → deemed income ₹12,000. If your total income for the year (salary + this + everything else) stays under the new-regime limit where the rebate makes tax ₹0 (₹12 lakh total income from FY 2025-26), **no tax is due**, but **you still file a return**.

**What you do:**
- **Which year:** sales from Oct 2026 – Mar 2027 = tax year 2026-27 → return due **31 July 2027** (check the date that year).
- **Form:** ITR-4 (Sugam) is the usual form for presumptive business income; the e-filing portal (incometax.gov.in) picks the right one when you choose "business income – presumptive".
- **Advance tax:** only if your tax for the year would exceed ₹10,000; presumptive taxpayers then pay it all by **15 March**. Very unlikely at this scale.
- File yourself on incometax.gov.in (free), or pay ~₹500–1,000 for assisted filing next July.

## 6. When you DO need a professional (one-time online consult ~₹500–1,500)
Book one when any of these happens:
- Sales pass **₹10 lakh** in a year
- You start selling **in India** or hold stock in India
- PayPal **limits/holds** your account asking for compliance documents
- Your bank says the payment route doesn't work for merchanting
- Any **notice** from the Income Tax or GST department
- You want to form a company / LLP or hire people

Online options: various platforms offer chat/call consults with CAs starting around ₹499–1,500 (get a written quote first; consultant fees vary).

## 7. Records: one folder per month (Google Drive)
```
Woven Tails/Records/2026-10/
  Shopify-orders.csv          (Shopify → Orders → Export)
  PayPal-statement.pdf        (PayPal → Activity → Statements)
  Bank-statement.pdf          (with FIRA/advices for PayPal credits)
  Printify-invoices/          (Printify → Billing → download each)
  Meta-ads-invoices/          (Billing → Payment activity)
  Other-expenses/             (Shopify bill, domain, AI tools)
  Proof-approvals/            (customer "Approved" emails, for PayPal disputes)
```
10 minutes on the 1st of each month. This is what any CA (or tax officer) would ask for.

## 8. One-page summary
| Topic | Decision now | Trigger to revisit |
|---|---|---|
| GST | Don't register | Indian sales, goods into India, PayPal/bank asks |
| IEC | Skip at launch; ₹500 when asked or at ~₹5k profit | PayPal/bank asks |
| PayPal | Business, individual, **P0108** | PayPal rejects the code → ask bank forex desk |
| Paying Printify | Debit card from the same bank that gets PayPal money | Bank says otherwise |
| Income tax | Presumptive, 6% of turnover; file ITR by 31 Jul 2027 | Sales > ₹10 lakh, or a notice |
| Records | Monthly folder | n/a |

## Sources
- CGST Act Schedule III: taxinformation.cbic.gov.in; commentary: taxadda.com, taxwink.com, india-briefing.com
- Purpose code P0108 & merchanting: RBI A.P. (DIR) circular on merchanting trade (rbidocs.rbi.org.in), RBI Master Direction on Export of Goods & Services (rbi.org.in), razorpay.com/blog/p0108-purpose-code-merchanting-trade-rbi, ebrc.in/resources/dropshipping-purpose-code, paypal-community.com
- IEC fee/process: taxaj.com, incorpx.io, skydo.com, dgft.gov.in
- Income-tax Act 2025 / Section 58 presumptive: taxguru.in, dealplexus.com, drishtiias.com, incometaxindia.gov.in
- CA consult prices: taxfetchindia.com, indiafilings.com, refrens.com, taxaj.com
