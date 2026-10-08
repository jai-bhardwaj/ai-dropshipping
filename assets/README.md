# Woven Tails: sample media

All images and clips were generated with AI (Higgsfield: GPT Image 2.5 for images, Seedance 2.5 for clips) on 2026-10-08. The pets are **AI-generated sample pets** (not real customers' pets), so you can use them freely in ads and on the store.

## Folders

| Folder | What | Use it for |
|---|---|---|
| `pets/` | 4 sample "phone photos": golden retriever ("Sunny"), orange tabby, border collie, French bulldog | "Before" shots in videos and product pages |
| `blanket-art/` | Each pet in the 3 blanket styles: Bold Pop, Christmas Scarf, Royal (12 illustrations) | Product page style picker, Printify mockups, Pinterest, "pick a style" posts |
| `lifestyle/` | Product-in-use scenes: blanket on sofa/bed/under tree, weave close-up, presenter with blanket/book, book on table, gift box | Product page gallery, homepage hero, Pinterest pins, video frames |
| `storybook/pages/` | Dog sample book: cover + 6 finished pages (1, 11, 12, 13, 16, 23) of *Sunny and the Very Big Day* with text | Product page gallery, storybook videos; template for real orders |
| `storybook/pages-cat/` | Cat sample book: cover + 5 finished pages of *Mango and the Very Big Day* (cat version) | Cat storybook gallery + video |
| `storybook/raw/`, `storybook/raw-cat/` | The same pages without text | Re-use with other text |
| `logo/` | 2 logo options (option 1 = woven paw, used in the videos) | Shopify logo, social profile pictures |
| `clips/` | 8 AI-animated 5-second clips + 4 rendered 3D clips (`3d-*.mp4`, from `scripts/record_3d.mjs`) | Building new video edits |
| `videos/` | **11 finished vertical videos (1080×1920)**, incl. 4 rendered 3D reels, ready to post | Reels, Shorts, Facebook Reels, Pinterest video pins, later Meta ads |
| `social/` | Profile picture, 6 highlight covers, Facebook cover, 9 launch posts (incl. 4 carousels), 6 Pinterest pins; made by `scripts/make_social.py` | See `SOCIAL.md` |
| `audio/` | Original music beds + Kokoro voiceovers (see `audio/README.md`) | Already mixed into the videos |
| `fonts/` | Nunito + Fraunces (SIL Open Font License, free for commercial use) | Book text, videos, brand |

## The 11 videos

| File | Script (`SCRIPTS.md`) | Length | Hook |
|---|---|---|---|
| `1A-photo-to-blanket.mp4` | 1A | ~15 s | "Send us your dog's photo…" → illustrated → woven |
| `1B-dog-mom-gift.mp4` | 1B | ~14 s | "The gift for the person who shows you 400 dog photos" |
| `1C-pick-a-style.mp4` | 1C | ~13 s | "Which style would you pick?" (built for comments) |
| `2A-storybook-hero.mp4` | 2A | ~17 s | "What if your dog was the hero of a book?" |
| `2B-bedtime-story.mp4` | 2B | ~14 s | "The bedtime story kids ask for every night" |
| `2C-cat-main-character.mp4` | 2C | ~14 s | "Your cat already thinks they're the main character" |
| `3A-gift-set.mp4` | 3A | ~13 s | "One photo of your pet… two gifts" |
| `4A-3d-blanket.mp4` | 3D | ~16 s | Rendered 3D woven blanket cycling through pets and styles |
| `4B-3d-storybook-dog.mp4` | 3D | ~16 s | Rendered 3D book turning its pages (dog) |
| `4C-3d-storybook-cat.mp4` | 3D | ~15 s | Rendered 3D book turning its pages (cat) |
| `4D-3d-gift-set.mp4` | 3D | ~11 s | Rendered 3D gift box opening |

**Before posting:**
1. **Sound is built in:** each video has an original music bed + a voiceover (see `audio/README.md`). Optional: add a trending sound in the app at low volume.
2. **Turn on the AI label** ("AI info" on Instagram/Facebook, "Altered or synthetic content" on YouTube). The presenter and pets are AI-generated.
3. Caption: one line + price + "link in bio". Example: *Your dog, illustrated from your photo and woven into a 100% cotton blanket. $64 · order by Dec 10 for Christmas · link in bio.*
4. **Once your real storybook sample arrives**, film 2–3 real clips of it (flipping pages, close-ups) and swap them into the storybook videos (see below).

## Important honesty notes
- Lifestyle images show **what the products look like**; they're AI renders, not photos of a manufactured product. On the store, label them "illustration of the product" (as `PRODUCT_PAGES.md` says) until you have real photos.
- The woven texture in the renders is a good guide, but **real jacquard weaving simplifies fine detail** (whiskers, fur strands). Keep customer art bold and simple (`OPERATIONS.md`).
- Never present the AI presenter as a real customer.

## Remaking or editing the videos
Everything is reproducible:
```bash
python3 scripts/make_videos.py              # rebuilds all 7 videos from assets/ (needs ffmpeg + Pillow)
python3 scripts/make_videos.py 1A-photo-to-blanket   # rebuild just one
python3 scripts/make_book_pages.py    # re-renders storybook pages with text
```
To change a caption, edit the text in the `video(...)` lists at the bottom of `scripts/make_videos.py` and run it again.

## Credits used
~390 Higgsfield credits (40 images ≈ 110 + 8 clips ≈ 280); balance 2,063 → ~1,670. Per new customer order: 1 illustration ≈ 2.75 credits; a full 24-page book ≈ 70 credits.
