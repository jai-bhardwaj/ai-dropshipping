# Operations: how every order gets made

Personalized products need a small daily routine. Budget **~15 min per blanket order** and **~60–90 min per storybook order** (less once you've done 10).

## 1. Collecting the pet photo (free method)

Shopify's default theme can't take file uploads reliably without a paid app, so we collect photos **after checkout**:

1. **On the product page** (above the button): "After checkout, you'll get an email asking for your pet's photo (or reply with it anytime)."
2. **Pet details at checkout (free):** turn on the **cart note** (Online Store → Customize → Theme settings → Cart → "Show cart note") and change its label (Edit default theme content → search "note") to:
   > Your pet's name, dog or cat, and (storybook only) up to 3 family names + favorite treat
   If someone leaves it empty, ask in the photo-request email.
3. **Order confirmation email** (Settings → Notifications) adds:
   > 📸 **Next step: send us your pet's photo.** Reply to this email with 1–3 clear photos of [your pet]'s face (good light, eyes visible). We'll send you the artwork to approve within 24 hours.
4. **If no photo after 24h:** send a friendly reminder (template below). After 72h, a second reminder.
5. Once revenue allows, a photo-upload app (several have free tiers, e.g. upload fields in product-options apps) lets customers upload on the product page.

## 2. Making the artwork (blanket)

**Rule: woven blankets need bold, simple art.** Big flat color areas, thick outlines, plain background. Fine details (whiskers, watercolor textures, small text) blur in weaving.

**Tool:** any AI image tool that accepts a reference photo (Higgsfield / OpenArt / Runway are connected to this workspace; they use paid credits, so check the cost per image first).

**Prompt (pick one style, keep it consistent per order):**

*Style A: Bold pop portrait (default, weaves best)*
> Illustrated portrait of this exact [dog/cat] from the reference photo, keeping its exact markings, fur colors, ear shape and eye color. Bold flat colors, thick clean outlines, simple shapes, no fine fur texture, no whiskers detail, plain solid [terracotta / forest green / cream] background, centered head and shoulders, high contrast, poster style, no text.

*Style B: Christmas portrait*
> Illustrated portrait of this exact [dog/cat] from the reference photo, keeping its exact markings and colors, wearing a simple red knitted scarf, bold flat colors, thick outlines, plain deep green background with a few large simple snowflakes, high contrast, no text.

*Style C: Royal portrait (bold)*
> Illustrated portrait of this exact [dog/cat] as a regal king/queen with a simple gold crown and a red cape with white trim, keeping its exact markings and colors, bold flat colors, thick outlines, plain dark blue background, high contrast, no text.

**Quality check before sending to the customer:**
- [ ] Markings, colors and ear shape match the photo (compare side by side)
- [ ] No extra legs/eyes/odd anatomy
- [ ] Large flat color areas, nothing tiny
- [ ] Name (if requested) added afterwards in a big, simple font (in Canva, free), not by the AI

**Layout for Printify (52×37" landscape):** place the portrait centered, leave ~3" margin all around, optional name underneath in big letters. Export PNG at the size Printify's editor asks for (it shows the required pixels).

## 3. Proof approval (every order)

Email the customer (template):
> Subject: Meet the illustrated [PET NAME]! 🎨
>
> Hi [first name],
>
> Here's [PET NAME]'s artwork for your [blanket / storybook]. [Attach image]
>
> Reply **"Approved"** and we'll start making it, or tell us what to change (we include up to 2 rounds of changes).
>
> If we don't hear back within 48 hours, we'll go ahead with this version so it arrives on time.

Save the approval email. It protects you in PayPal disputes.

## 4. Placing the order in Printify

Because each order has unique art, create the order manually:
1. Printify → **Orders → Create order** (manual order) → choose the product (Woven Blanket 52×37, Artwork variant, **Printify Choice**) and/or Hardcover Photo Book 8×8 (**Printify Choice**).
2. Upload the approved artwork (blanket) / 24 pages + cover (book).
3. Copy the customer's shipping address from Shopify.
4. Pay (Printify charges your card/Printify balance; keep enough on your card for 2–3 orders).
5. When Printify ships, add the tracking number to the Shopify order (Fulfill → add tracking) so the shipping email goes out.

## 5. Storybook: the template story

**Title (cover):** *[PET NAME] and the Very Big Day*
**Subtitle:** A story starring [PET NAME], made for the [FAMILY NAME] family

**How to make it fast:**
1. Make one **character reference image** of the pet (Style A prompt, full body, standing, neutral pose).
2. For every page, use the same reference image + the scene prompt below + the same style line:
   > Children's picture book illustration, soft rounded shapes, bright warm colors, simple backgrounds, consistent character design matching the reference exactly, square 1:1 format, no text.
3. Add the page text in **Canva** (free), with a big, rounded font (e.g. "Baloo" or "Nunito"), bottom third of the page, on a light band so it's readable.
4. Export each page as a square PNG at Printify's requested size (8×8" with bleed).

**Placeholders:** [PET] = pet's name · [HE/SHE/THEY] · [HIS/HER/THEIR] · [FAMILY] = family names (e.g. "Mom, Dad and Lily") · [HOME] = "home" or city name · [SPECIES] = dog/cat · [TREAT] = favorite treat (ask in cart note; default "treats")

| Page | Text | Illustration (scene prompt) |
|---|---|---|
| Cover | *[PET] and the Very Big Day* | [PET] sitting proudly in front of a cozy house, big smile, sunrise |
| 1 | This is [PET]. [HE] is the best [SPECIES] in the whole wide world. Just ask [FAMILY]. | [PET] posing like a star with a little spotlight |
| 2 | Every morning, [PET] wakes up before everyone else. Today feels different. Today feels BIG. | [PET] in bed at sunrise, ears up, excited |
| 3 | [PET] does a big stretch. A big yawn. And a very big wiggle. | Three small poses: stretch, yawn, wiggle |
| 4 | "Something special is happening today," thinks [PET]. "I can smell it." | [PET] sniffing the air, curious, cartoon smell swirls |
| 5 | [PET] checks the kitchen. No surprise, just one crumb. [PET] eats the crumb, just to be sure. | [PET] in a kitchen, looking at a single crumb |
| 6 | [PET] checks the garden. A leaf! A bird! A very suspicious sock! | [PET] in a garden with a leaf, a bird and a sock |
| 7 | But still no big surprise. | [PET] sitting on the grass, thinking, head tilted |
| 8 | Then [PET] hears a sound. The jingle of a leash! | [PET] ears up, a leash hanging by the door |
| 9 | Off they go: [FAMILY] and [PET], out the door and down the road. | [PET] walking happily with a family (seen from behind, no faces needed) |
| 10 | [PET] says hello to every tree, every flower and every friendly face. | [PET] greeting flowers and a tree, cheerful street |
| 11 | At the park, [PET] runs so fast the wind can't keep up. | [PET] running through a park, motion lines |
| 12 | [PET] finds the best stick in the history of sticks. | [PET] proudly carrying a huge stick |
| 13 | [PET] splashes in a puddle. Twice. Okay, three times. | [PET] jumping in a puddle, joyful splashes |
| 14 | On the way home, [PET] feels tired, happy and a little bit muddy. | [PET] walking home, muddy paws, sunset |
| 15 | But when the door opens… | Front door opening, warm light from inside |
| 16 | SURPRISE! | Living room with balloons, a banner (no text), and [TREAT] |
| 17 | It's [PET]'s very own day, a day to say thank you. | [PET] amazed, surrounded by balloons |
| 18 | Thank you for the morning cuddles. | [PET] cuddling on a bed (family as soft shapes) |
| 19 | Thank you for the happy tail at the door. | [PET] wagging at the door, hearts around |
| 20 | Thank you for sitting close when someone feels sad. | [PET] resting a head on a lap, calm colors |
| 21 | Thank you for being [FAMILY]'s best friend. | [PET] in the center of a big heart shape |
| 22 | [PET] eats [HIS] [TREAT], very slowly, to make it last. | [PET] enjoying a treat |
| 23 | That night, [PET] curls up in [HIS] favorite spot. What a very big day. | [PET] curled up asleep on a blanket, moon through the window |
| 24 | The end. (But every day with [PET] is a big day.) | Close-up of sleeping [PET], stars |

**Cat version:** replace page 8–14 walk scenes with: chasing a sunbeam (8), climbing the bookshelf (9), a box adventure (10–11), batting a toy mouse (12), a window bird-watch (13), a nap in the laundry basket (14). Change "leash" to "the crinkle of a toy".

**Memorial version (on request):** pages 17–24 become: "[PET] will always be part of every big day" with soft, golden-light scenes. Offer it gently in the FAQ; don't advertise it with sad imagery.

## 6. Reminder and support templates

**Photo reminder (24h):**
> Hi [first name], just a reminder to reply with a photo of [PET NAME] so we can start on the artwork. Any clear photo of their face works; phone photos are perfect!

**Shipping delay (if Printify is late):**
> Hi [first name], quick update: [PET NAME]'s [blanket/book] is taking a little longer than usual in production because of holiday volume. It's now expected to ship by [date]. Thanks for your patience. If this doesn't work for you, just reply and we'll sort it out.

**Something wrong with the product:**
> I'm so sorry about that! Could you send a photo of the issue? We'll send a free replacement right away, no need to return anything.

## 7. Daily routine (once orders come in)

| When | What | Time |
|---|---|---|
| Morning | Check new orders → send photo request / proofs | 10 min |
| Morning | Make artwork for new photos, send proofs | 15 min per blanket, 60–90 min per book |
| Afternoon | Approved proofs → create Printify orders | 5 min per order |
| Evening | Add tracking numbers, reply to emails, log numbers in `TRACKER.xlsx` | 15 min |
