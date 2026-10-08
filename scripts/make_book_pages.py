"""Add story text to storybook page illustrations (8x8in print pages)."""
import sys, textwrap
from PIL import Image, ImageDraw, ImageFont

FONT = "assets/fonts/Nunito.ttf"
SIZE = 2475  # 8.25in at 300dpi (8in + 0.125in bleed each side)

def font(px, weight="ExtraBold"):
    f = ImageFont.truetype(FONT, px)
    try: f.set_variation_by_name(weight)
    except Exception: pass
    return f

def page(src, text, out):
    im = Image.open(src).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    d = ImageDraw.Draw(im, "RGBA")
    f = font(92)
    lines = textwrap.wrap(text, 34)
    lh = 120
    h = lh * len(lines) + 140
    top = SIZE - h - 170
    d.rounded_rectangle([170, top, SIZE - 170, top + h], 60, fill=(246, 240, 230, 225))
    y = top + 70
    for ln in lines:
        w = d.textlength(ln, font=f)
        d.text(((SIZE - w) / 2, y), ln, font=f, fill=(47, 74, 58))
        y += lh
    im.save(out, quality=95)

def cover(src, title1, title2, sub, out):
    im = Image.open(src).convert("RGB").resize((SIZE, SIZE), Image.LANCZOS)
    d = ImageDraw.Draw(im)
    for txt, px, y in ((title1, 260, 190), (title2, 170, 470)):
        f = font(px, "Black")
        w = d.textlength(txt, font=f)
        d.text(((SIZE - w) / 2, y), txt, font=f, fill=(200, 103, 62), stroke_width=18, stroke_fill=(255, 255, 255))
    f = font(70, "Bold")
    w = d.textlength(sub, font=f)
    d.text(((SIZE - w) / 2, SIZE - 230), sub, font=f, fill=(47, 74, 58), stroke_width=8, stroke_fill=(255, 255, 255))
    im.save(out, quality=95)

if __name__ == "__main__":
    R, O = "assets/storybook/raw/", "assets/storybook/pages/"
    cover(R + "cover.jpg", "Sunny", "and the Very Big Day", "A story starring Sunny, made for Mom, Dad and Lily", O + "00-cover.jpg")
    P = [("p01-star.jpg", "This is Sunny. He is the best dog in the whole wide world. Just ask Mom, Dad and Lily.", "01.jpg"),
         ("p11-park.jpg", "At the park, Sunny runs so fast the wind can't keep up.", "11.jpg"),
         ("p12-stick.jpg", "Sunny finds the best stick in the history of sticks.", "12.jpg"),
         ("p13-puddle.jpg", "Sunny splashes in a puddle. Twice. Okay, three times.", "13.jpg"),
         ("p16-surprise.jpg", "SURPRISE!", "16.jpg"),
         ("p23-sleep.jpg", "That night, Sunny curls up in his favorite spot. What a very big day.", "23.jpg")]
    for s, t, o in P: page(R + s, t, O + o)
