# Domain setup: woventails.com (registered at Spaceship)

| Address | Goes to | Purpose |
|---|---|---|
| `woventails.com` | Vercel (project `woven-tails`) | 3D landing pages, ad traffic |
| `www.woventails.com` | Vercel → redirects to `woventails.com` | |
| `shop.woventails.com` | Shopify | Product pages, cart, checkout, policies |

The site's buy buttons and policy links already point to `shop.woventails.com/products/...` and `/policies/...`.

## DNS records to add at Spaceship
Spaceship → **Launchpad → Domain manager → woventails.com → Advanced DNS** (DNS records).

1. **Delete** the existing parking records for `@` (A records pointing to 34.216.117.25 and 54.149.79.189) and any `www` parking record.
2. **Add:**

| Type | Host | Value | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | Auto / 1 hour |
| CNAME | `www` | `cname.vercel-dns.com` | Auto / 1 hour |
| CNAME | `shop` | `shops.myshopify.com` | Auto / 1 hour (add once the Shopify store exists) |

3. Wait 5–60 minutes. Vercel issues the HTTPS certificate automatically once DNS points to it.

## Shopify side (after creating the store)
Shopify admin → **Settings → Domains → Connect existing domain** → enter `shop.woventails.com` → verify → set it as the **primary domain**.

## Email
**Done:** `hello@woventails.com` (and any other address @woventails.com) forwards to your iCloud via Forward Email (free). Records: `MX @ mx1.forwardemail.net` and `MX @ mx2.forwardemail.net` (priority 10), a `TXT @ forward-email=...` rule (encrypted, so your iCloud address isn't public), and `TXT @ v=spf1 include:spf.forwardemail.net ~all`. To change the destination, generate a new encrypted value at forwardemail.net and replace that TXT record.
