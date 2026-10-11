# Domain setup: woventails.com (registered at Spaceship)

| Address | Goes to | Purpose |
|---|---|---|
| `woventails.com` | Shopify (primary domain) | The store: every page, cart and checkout |
| `www.woventails.com` | Shopify → redirects to `woventails.com` | |
| `shop.woventails.com` | Vercel → 308 redirect to `woventails.com` (keeps the path) | Old links keep working |
| `woven-tails.vercel.app` | Vercel | Theme JS/CSS (`/theme-assets/v6/`), images, 3D textures, the cut-out model, `/store-preview/` |

## DNS records at Spaceship
| Type | Host | Value |
|---|---|---|
| A | `@` | `23.227.38.65` (Shopify) |
| CNAME | `www` | `shops.myshopify.com` |
| CNAME | `shop` | `cname.vercel-dns.com` |

Shopify email authentication (Settings → Notifications → Email domain authentication): 6 CNAMEs `mailersfh`, `sfh._domainkey`, `sfh2._domainkey`, `mailerp76`, `pdk1._domainkey.mailerp76`, `pdk2._domainkey.mailerp76` → `*.email.myshopify.com` (exact values in Shopify).

Shopify set the `@` and `www` records itself when the domain was connected (Settings → Domains).

## Email
**Done:** `hello@woventails.com` (and any other address @woventails.com) forwards to your iCloud via Forward Email (free). Records: `MX @ mx1.forwardemail.net` and `MX @ mx2.forwardemail.net` (priority 10), a `TXT @ forward-email=...` rule (encrypted, so your iCloud address isn't public), and `TXT @ v=spf1 include:spf.forwardemail.net ~all`. To change the destination, generate a new encrypted value at forwardemail.net and replace that TXT record.
