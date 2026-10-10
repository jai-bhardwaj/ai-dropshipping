"""Render the social media kit (Instagram/Facebook/Pinterest) from brand assets.
Usage: python3 scripts/make_social.py   -> assets/social/
"""
import os, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

A = "assets/"
OUT = A + "social/"
os.makedirs(OUT, exist_ok=True)
CREAM, INK, MADDER, WELD, LINEN = (244, 238, 227), (31, 49, 39), (185, 88, 47), (201, 154, 52), (234, 225, 209)
NUN = A + "fonts/Nunito.ttf"
FRA = A + "fonts/Fraunces.ttf"

def font(path, px, weight):
    f = ImageFont.truetype(path, px)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f

def cover(img, w, h):
    im = Image.open(img).convert("RGB")
    s = max(w / im.width, h / im.height)
    im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
    l, t = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((l, t, l + w, t + h))

def warp(im, col=(31, 49, 39, 14)):
    d = ImageDraw.Draw(im, "RGBA")
    for x in range(0, im.width, 22):
        d.line([(x, 0), (x, im.height)], fill=col, width=1)

def weave_rule(d, x, y, w):
    for i in range(0, w, 20):
        d.rectangle([x + i, y, x + i + 9, y + 6], fill=MADDER)
        d.rectangle([x + i + 10, y + 7, x + i + 19, y + 13], fill=WELD)

def text_block(d, xy, txt, f, fill, width, lh=1.12, align="left", W=None):
    x, y = xy
    for ln in textwrap.wrap(txt, width):
        if align == "center":
            x = (W - d.textlength(ln, font=f)) / 2
        d.text((x, y), ln, font=f, fill=fill)
        y += int(f.size * lh)
    return y

def mono(px):
    return font(NUN, px, "Bold")

def save(im, name):
    im.save(OUT + name, quality=92)
    print("made", name)

# ---------- profile picture ----------
logo = Image.open(A + "logo/logo-option-1.jpg").convert("RGB")
pp = logo.crop((140, 60, logo.width - 140, logo.height - 220)).resize((1080, 1080), Image.LANCZOS)
save(pp, "profile-picture.jpg")

# ---------- highlight covers ----------
def highlight(label, kind, name):
    im = Image.new("RGB", (1080, 1920), INK)
    d = ImageDraw.Draw(im)
    cx, cy, r = 540, 960, 300
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=CREAM)
    if kind == "steps":
        for i, yy in enumerate((-110, 0, 110)):
            d.ellipse([cx - 150, cy + yy - 28, cx - 94, cy + yy + 28], fill=MADDER)
            d.text((cx - 122, cy + yy), str(i + 1), font=font(NUN, 40, "Black"), fill=CREAM, anchor="mm")
            d.rounded_rectangle([cx - 70, cy + yy - 14, cx + 150, cy + yy + 14], 14, fill=INK)
    elif kind == "blanket":
        d.rectangle([cx - 170, cy - 120, cx + 170, cy + 120], fill=MADDER)
        for x in range(cx - 170, cx + 171, 12):
            d.line([(x, cy - 150), (x, cy - 120)], fill=WELD, width=4)
            d.line([(x, cy + 120), (x, cy + 150)], fill=WELD, width=4)
        for yy in range(cy - 120, cy + 121, 16):
            d.line([(cx - 170, yy), (cx + 170, yy)], fill=(160, 72, 36), width=3)
    elif kind == "book":
        d.polygon([(cx, cy - 90), (cx - 190, cy - 130), (cx - 190, cy + 110), (cx, cy + 150)], fill=MADDER)
        d.polygon([(cx, cy - 90), (cx + 190, cy - 130), (cx + 190, cy + 110), (cx, cy + 150)], fill=WELD)
        d.line([(cx, cy - 90), (cx, cy + 150)], fill=INK, width=6)
    elif kind == "gift":
        d.rectangle([cx - 160, cy - 60, cx + 160, cy + 150], fill=WELD)
        d.rectangle([cx - 180, cy - 120, cx + 180, cy - 60], fill=MADDER)
        d.rectangle([cx - 22, cy - 120, cx + 22, cy + 150], fill=INK)
        d.ellipse([cx - 90, cy - 190, cx - 10, cy - 120], outline=INK, width=16)
        d.ellipse([cx + 10, cy - 190, cx + 90, cy - 120], outline=INK, width=16)
    elif kind == "faq":
        d.text((cx, cy - 10), "?", font=font(FRA, 300, "Bold"), fill=MADDER, anchor="mm")
    elif kind == "paw":
        for ox, oy in ((-110, -90), (0, -140), (110, -90)):
            d.ellipse([cx + ox - 45, cy + oy - 60, cx + ox + 45, cy + oy + 60], fill=MADDER)
        d.ellipse([cx - 120, cy - 20, cx + 120, cy + 170], fill=MADDER)
    f = font(NUN, 64, "ExtraBold")
    d.text((540, 1340), label.upper(), font=f, fill=CREAM, anchor="mm")
    save(im, f"highlight-{name}.jpg")

for label, kind, name in (("How it works", "steps", "how-it-works"), ("Blankets", "blanket", "blankets"),
                          ("Storybooks", "book", "storybooks"), ("Gift set", "gift", "gift-set"),
                          ("FAQ", "faq", "faq"), ("Your pets", "paw", "your-pets")):
    highlight(label, kind, name)

# ---------- Facebook cover (1640 x 624) ----------
fb = Image.new("RGB", (1640, 624), CREAM)
warp(fb)
art = [cover(A + f"blanket-art/{p}.jpg", 300, 300) for p in ("golden-pop", "tabby-royal", "collie-christmas", "frenchie-pop")]
for i, a in enumerate(art):
    fb.paste(a, (760 + i * 210 - (i % 2) * 0, 60 + (i % 2) * 220))
d = ImageDraw.Draw(fb)
d.text((80, 170), "Your pet,", font=font(FRA, 96, "SemiBold"), fill=INK)
d.text((80, 280), "woven.", font=font(FRA, 96, "SemiBold Italic") if False else font(FRA, 96, "SemiBold"), fill=MADDER)
d.text((84, 420), "Illustrated from your photo · 100% cotton · made in the USA", font=font(NUN, 30, "Bold"), fill=INK)
weave_rule(d, 84, 480, 520)
save(fb, "facebook-cover.jpg")

# ---------- feed posts (1080 x 1350) ----------
W, H = 1080, 1350

def slide_photo(img, title, kicker=None, foot=None, dark=True):
    im = cover(img, W, H)
    shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for y in range(H):
        a = int(225 * min(1, max(0, (y - H * 0.38) / (H * 0.42))))
        sd.line([(0, y), (W, y)], fill=(15, 22, 18, a))
    im = Image.alpha_composite(im.convert("RGBA"), shade).convert("RGB")
    d = ImageDraw.Draw(im)
    tf = font(FRA, 84, "SemiBold")
    lines = len(textwrap.wrap(title, 20))
    y = H - 170 - lines * int(84 * 1.12)
    if kicker:
        d.text((72, y - 60), kicker.upper(), font=mono(30), fill=WELD)
    text_block(d, (72, y), title, tf, CREAM, 20)
    if foot:
        d.text((72, H - 90), foot, font=font(NUN, 32, "Bold"), fill=CREAM)
    return im

def slide_text(title, body=None, kicker=None, bg=CREAM, fg=INK, accent=MADDER, n=None):
    im = Image.new("RGB", (W, H), bg)
    warp(im, (fg[0], fg[1], fg[2], 18))
    d = ImageDraw.Draw(im)
    if kicker:
        d.text((90, 140), kicker.upper(), font=mono(30), fill=accent)
    y = text_block(d, (90, 210), title, font(FRA, 96, "SemiBold"), fg, 17)
    weave_rule(d, 92, y + 30, 420)
    if body:
        text_block(d, (90, y + 100), body, font(NUN, 42, "SemiBold"), fg, 36, lh=1.35)
    if n:
        d.text((W - 90, H - 90), n, font=mono(30), fill=accent, anchor="rs")
    d.text((90, H - 90), "woventails.com", font=mono(30), fill=fg, anchor="ls")
    return im

def slide_image_card(img, caption, n=None, bg=CREAM):
    im = Image.new("RGB", (W, H), bg)
    warp(im)
    pic = cover(img, 900, 900)
    im.paste(pic, (90, 130))
    d = ImageDraw.Draw(im)
    text_block(d, (90, 1080), caption, font(FRA, 58, "SemiBold"), INK, 30)
    if n:
        d.text((W - 90, H - 70), n, font=mono(28), fill=MADDER, anchor="rs")
    return im

# Post 1: intro
save(slide_photo(A + "lifestyle/blanket-sofa-golden.jpg", "Your pet, woven into something you can hold.", "Meet Woven Tails", "Illustration of the product"), "post-01-intro.jpg")

# Post 2: how it works carousel
save(slide_text("How a photo becomes a blanket", "Swipe to see the 4 steps", "How it works", n="1/5"), "post-02-how-1.jpg")
save(slide_image_card(A + "pets/golden.jpg", "1 · Send us any clear photo of your pet's face", "2/5"), "post-02-how-2.jpg")
save(slide_image_card(A + "blanket-art/golden-pop.jpg", "2 · We illustrate it. You approve it (2 free changes)", "3/5"), "post-02-how-3.jpg")
save(slide_image_card(A + "lifestyle/blanket-weave-closeup.jpg", "3 · Woven into 100% cotton in the USA", "4/5"), "post-02-how-4.jpg")
save(slide_text("4 · Delivered in about 4–7 business days", "Order by Dec 10 for Christmas. $64, free US shipping. Link in bio.", "Then", bg=INK, fg=CREAM, accent=WELD, n="5/5"), "post-02-how-5.jpg")

# Post 3: pick a style carousel
save(slide_text("Which style would you pick?", "Comment 1, 2 or 3 below", "Same cat, three styles", n="1/4"), "post-03-style-1.jpg")
for i, (s, lab) in enumerate((("pop", "1 · Bold Pop"), ("christmas", "2 · Christmas scarf"), ("royal", "3 · Royal")), 2):
    save(slide_image_card(A + f"blanket-art/tabby-{s}.jpg", lab, f"{i}/4"), f"post-03-style-{i}.jpg")

# Post 4: woven vs printed
save(slide_text("Woven, not printed.", "On our blankets the picture is made of colored cotton threads, not ink on top.", "What makes it different", n="1/3"), "post-04-woven-1.jpg")
save(slide_image_card(A + "lifestyle/blanket-weave-closeup.jpg", "The loom builds the portrait thread by thread", "2/3"), "post-04-woven-2.jpg")
save(slide_text("Why we illustrate first", "Raw photos weave muddy. Bold, simple art weaves beautifully, so we draw your pet before it goes on the loom.", "The secret", bg=INK, fg=CREAM, accent=WELD, n="3/3"), "post-04-woven-3.jpg")

# Post 5: storybook sneak peek
save(slide_photo(A + "lifestyle/book-table.jpg", "Your pet is the hero of the story.", "New: the storybook", "Illustration of the product"), "post-05-book-1.jpg")
for i, p in enumerate(("11", "12", "13", "23"), 2):
    save(slide_image_card(A + f"storybook/pages/{p}.jpg", {"11": "A run in the park", "12": "The best stick in history", "13": "Puddles. Three times.", "23": "What a very big day."}[p], f"{i}/5"), f"post-05-book-{i}.jpg")

# Post 6: cat book
save(slide_photo(A + "lifestyle/book-bed-tabby.jpg", "Your cat already thinks they're the main character.", "For cat people", "Illustration of the product"), "post-06-cat-book.jpg")

# Post 7: gift guide
save(slide_photo(A + "lifestyle/bundle-giftbox.jpg", "One photo. Two gifts. $99.", "Gift set", "Illustration of the product"), "post-07-gift-set.jpg")

# Post 8: Christmas deadline
save(slide_text("Order by Dec 10 for Christmas.", "Art proof in 24 hours. Made in the USA. Delivered with tracking.", "Holiday deadline", bg=MADDER, fg=CREAM, accent=WELD), "post-08-deadline.jpg")

# Post 9: four pets grid
grid = Image.new("RGB", (W, H), CREAM)
for i, p in enumerate(("golden-pop", "tabby-royal", "collie-christmas", "frenchie-pop")):
    grid.paste(cover(A + f"blanket-art/{p}.jpg", 470, 470), (60 + (i % 2) * 490, 150 + (i // 2) * 490))
d = ImageDraw.Draw(grid)
d.text((W // 2, 80), "Every pet weaves differently", font=font(FRA, 56, "SemiBold"), fill=INK, anchor="mm")
d.text((W // 2, 1250), "Tag a pet who deserves a blanket", font=font(NUN, 40, "ExtraBold"), fill=MADDER, anchor="mm")
save(grid, "post-09-four-pets.jpg")

# ---------- Pinterest pins (1000 x 1500) ----------
def pin(img, title, sub, name):
    im = Image.new("RGB", (1000, 1500), CREAM)
    warp(im)
    im.paste(cover(img, 1000, 1050), (0, 450))
    d = ImageDraw.Draw(im)
    y = text_block(d, (60, 70), title, font(FRA, 72, "SemiBold"), INK, 22)
    d.text((60, y + 20), sub, font=font(NUN, 34, "Bold"), fill=MADDER)
    d.rectangle([0, 1420, 1000, 1500], fill=INK)
    d.text((500, 1460), "woventails.com", font=mono(32), fill=CREAM, anchor="mm")
    save(im, f"pin-{name}.jpg")

pin(A + "lifestyle/blanket-sofa-golden.jpg", "Custom Pet Portrait Blanket", "Woven from your photo · 100% cotton", "blanket-sofa")
pin(A + "lifestyle/blanket-tree-collie.jpg", "Christmas Gift for Dog Lovers", "Woven pet portrait blanket · $64", "christmas-dog")
pin(A + "lifestyle/blanket-bed-tabby.jpg", "Royal Cat Portrait Blanket", "Custom woven gift for cat lovers", "royal-cat")
pin(A + "lifestyle/book-table.jpg", "Storybook Starring Your Dog", "24-page hardcover from your photo", "dog-book")
pin(A + "lifestyle/book-bed-tabby.jpg", "A Book About Your Cat", "Personalized cat storybook · $42", "cat-book")
pin(A + "lifestyle/bundle-giftbox.jpg", "Pet Lover Gift Set", "Woven blanket + storybook · $99", "gift-set")
