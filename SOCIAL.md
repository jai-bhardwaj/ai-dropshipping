# Social page kit: Instagram + Facebook (+ Pinterest)

All images are in `assets/social/`, videos in `assets/videos/`. Everything uses AI-generated sample pets, so it's safe to post.

## 1. Profile setup

| Field | Instagram (`@woventails`) | Facebook Page |
|---|---|---|
| Profile picture | `profile-picture.jpg` | same |
| Name | Woven Tails · Custom Pet Portraits | Woven Tails |
| Category | Shopping & retail | Shopping & retail |
| Cover | n/a | `facebook-cover.jpg` (1640×624) |
| Link | woventails.com | woventails.com |
| Action button | n/a | "Shop now" → woventails.com |

**Bio (Instagram, 150 characters max):**
> Your pet, illustrated from your photo 🐾
> Woven into 100% cotton or starring in their own book
> Made in the USA · Order by Dec 10 for Christmas ⬇️

**Facebook "About":** Woven Tails turns your pet's photo into an illustrated portrait, woven into a 100% cotton jacquard blanket or printed as a 24-page hardcover storybook starring them. You approve the art before anything is made. Made to order in the USA.

## 2. Story highlights (covers in `assets/social/highlight-*.jpg`)

| Highlight | Cover | What to put in it |
|---|---|---|
| How it works | `highlight-how-it-works.jpg` | The 5 slides of post 2 as stories |
| Blankets | `highlight-blankets.jpg` | Videos 1A, 1C, 4A (3D) + the 3 style images |
| Storybooks | `highlight-storybooks.jpg` | Videos 2A, 2C, 4B + sample pages |
| Gift set | `highlight-gift-set.jpg` | Video 3A, 4D + post 7 |
| Your pets | `highlight-your-pets.jpg` | Real customer photos (only with their permission), once you have them |
| FAQ | `highlight-faq.jpg` | Screenshots of FAQ answers from the product pages |

## 3. Launch grid: post these first (oldest first, so the grid reads well)

Instagram shows the newest post top-left. Posting in this order makes the first 9 tiles look planned.

| Day | Post | Files | Type |
|---|---|---|---|
| 1 | Intro | `post-01-intro.jpg` | Photo |
| 1 | How it works | `post-02-how-1..5.jpg` | Carousel (5) |
| 2 | Reel: photo → blanket | `videos/1A-photo-to-blanket.mp4` | Reel |
| 2 | Pick a style | `post-03-style-1..4.jpg` | Carousel (4) |
| 3 | Reel: 3D blanket styles | `videos/4A-3d-blanket.mp4` | Reel |
| 3 | Woven vs printed | `post-04-woven-1..3.jpg` | Carousel (3) |
| 4 | Storybook sneak peek | `post-05-book-1..5.jpg` | Carousel (5) |
| 4 | Reel: storybook | `videos/2A-storybook-hero.mp4` | Reel |
| 5 | Cat book | `post-06-cat-book.jpg` + `videos/2C-cat-main-character.mp4` | Photo + Reel |
| 6 | Gift set | `post-07-gift-set.jpg` + `videos/4D-3d-gift.mp4` | Photo + Reel |
| 7 | Every pet weaves differently | `post-09-four-pets.jpg` | Photo |
| From Dec 1 | Christmas deadline | `post-08-deadline.jpg` | Photo (pin it to the top of your profile) |

After day 7: 2 reels/day (rotate all 11 videos, new hooks weekly with `scripts/make_videos.py`), 1 carousel every 2–3 days.

**Pin to profile:** post 2 (how it works), the best-performing reel, and from Dec 1 the deadline post.

## 4. Captions (copy-paste)

Rules: first line is the hook (it shows before "more"); price + "link in bio" in every post; 5–8 hashtags at the end. Turn on the **AI label** for every post with AI-generated pets/people.

**Post 1, intro**
> Your pet, woven into something you can hold. 🧶
> Send us one photo. We illustrate your dog or cat, you approve the art, and we weave it into a 100% cotton blanket, or make them the hero of their own storybook.
> Made to order in the USA. Link in bio.
> #custompetportrait #petportrait #doglovers #catlovers #petgifts #wovenblanket

**Post 2, how it works (carousel)**
> How one phone photo becomes a woven blanket 👇 (swipe)
> 1. Send any clear photo of your pet's face
> 2. We illustrate it. You approve it (2 free changes)
> 3. It's woven into 100% cotton in the USA
> 4. Delivered in about 4–7 business days
> $64 · free US shipping · order by Dec 10 for Christmas. Link in bio.
> #custompetportrait #petgifts #dogmom #catdad #giftideas

**Post 3, pick a style (carousel)**
> Same cat. Three styles. Which one would you pick? Comment 1, 2 or 3 👇
> Bold Pop, Christmas scarf or Royal. All woven into a 100% cotton blanket from your own pet's photo. Link in bio.
> #catsofinstagram #catlovers #custompetportrait #petportrait #christmasgifts

**Post 4, woven vs printed (carousel)**
> Woven, not printed. Here's the difference 🧵
> On our blankets the picture is made of colored cotton threads, not ink on top. That's also why we illustrate your photo first: bold art weaves beautifully. Link in bio.
> #wovenblanket #jacquard #petportrait #handmadegifts #doglovers

**Post 5, storybook (carousel)**
> What if your dog was the hero of a book? 📖
> "Sunny and the Very Big Day": 24 illustrated pages, drawn from your photo, with your family's names in the story. Hardcover, printed in the USA. $42. Link in bio.
> #personalizedbook #doglovers #kidsbooks #petgifts #bedtimestory

**Post 6, cat book**
> Your cat already thinks they're the main character. We just made it official. 😼
> A 24-page storybook starring your cat, illustrated from your photo. $42. Link in bio.
> #catsofinstagram #catlovers #personalizedgifts #catmom #kidsbooks

**Post 7, gift set**
> One photo. Two gifts. $99. 🎁
> The woven portrait blanket + the storybook starring their pet. Approved once, shipped together. Order by Dec 10 for Christmas. Link in bio.
> #giftsforher #petgifts #christmasgiftideas #dogmom #giftguide

**Post 8, deadline (from Dec 1)**
> Order by Dec 10 for Christmas delivery 🎄
> Art proof in 24 hours, made in the USA, delivered with tracking. Link in bio.
> #christmasgifts #lastminutegifts #petgifts #custompetportrait

**Post 9, four pets**
> Every pet weaves differently. Tag someone whose pet deserves a blanket 👇
> #doglovers #catlovers #petportrait #custompetportrait

**Reels** (short caption + hashtags):
- 1A: "Send us your dog's photo. We'll weave it. 🧶 $64 · link in bio"
- 1B: "For the person who shows you 400 dog photos 📱🐶 Link in bio"
- 1C: "Comment 1, 2 or 3 👇 Which style?"
- 2A: "What if your dog was the hero of a book? 📖 $42 · link in bio"
- 2B: "The bedtime story kids ask for every night 🌙"
- 2C: "Main character energy. Now in print. 😼"
- 3A: "One photo. Two gifts. 🎁 $99"
- 4A: "Spin it around: your pet, woven in 3D 🧶 Bold Pop, Christmas or Royal"
- 4B / 4C: "Flip through a book starring your dog / cat 📖"
- 4D: "Unboxing the gift set 🎁 blanket + storybook from one photo"

## 5. Replies (comments & DMs)

| They say | You reply |
|---|---|
| "How much?" / "Price?" | "$64 for the woven blanket, $42 for the storybook, $99 for both. Free US shipping. Link in our bio 🐾" |
| "Is this AI?" | "We use AI-assisted illustration, then check every portrait by hand against your photo. You approve it before anything is made." |
| "Do you ship to [country]?" | "Right now we ship to the US only. We'll announce new countries here first!" |
| "Will it arrive by Christmas?" | "Yes if you order by Dec 10 (US standard shipping)." |
| "Can you do two pets?" | "Not yet, one pet per piece for now. Want us to message you when two-pet blankets launch?" |
| Complaint | "So sorry about that! Please DM us your order number and a photo, and we'll make it right." (Move to DM/email, never argue in comments.) |

## 6. Pinterest
Upload `assets/social/pin-*.jpg` (6 pins, 1000×1500) with the titles and descriptions in `PINTEREST.md`. Link each pin to its product page.

## 7. Rules
- Label AI content (Instagram/Facebook "AI info", YouTube "altered or synthetic content").
- Never present AI people or pets as real customers. Real customer photos only with written permission.
- No fake reviews, follower counts or "sold out" claims.
- Videos already have music + voiceover; optionally add a trending sound at low volume in the app.
