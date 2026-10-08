"""Assemble vertical (1080x1920) short videos from stills + AI clips with on-screen text.

Usage: python3 scripts/make_videos.py [video-name ...]   (needs ffmpeg; clips in assets/clips/)
Output: assets/videos/*.mp4 (silent: add a trending sound inside Instagram/YouTube when posting)
"""
import os, subprocess, sys, tempfile, textwrap
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
A = "assets/"
FONT = A + "fonts/Nunito.ttf"
TMP = tempfile.mkdtemp()
GREEN, CREAM, TERRA = (47, 74, 58), (246, 240, 230), (200, 103, 62)

def font(px, weight="Black"):
    f = ImageFont.truetype(FONT, px)
    f.set_variation_by_name(weight)
    return f

def text_png(text, pos="top", size=78):
    """Transparent overlay with big centered caption (white text, dark stroke)."""
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if not text:
        p = f"{TMP}/blank.png"; im.save(p); return p
    d = ImageDraw.Draw(im)
    f = font(size)
    lines = textwrap.wrap(text, 20)
    lh = int(size * 1.2)
    y = {"top": 260, "middle": H // 2 - lh * len(lines) // 2, "bottom": H - 420 - lh * len(lines)}[pos]
    for ln in lines:
        w = d.textlength(ln, font=f)
        d.text(((W - w) / 2, y), ln, font=f, fill="white", stroke_width=9, stroke_fill=(20, 20, 20))
        y += lh
    p = f"{TMP}/t{abs(hash((text, pos, size)))}.png"; im.save(p); return p

def fit(src, out):
    """Fit a still to 1080x1920: vertical images are cover-cropped; square/wide ones
    are shown whole on a blurred, darkened copy of themselves."""
    im = Image.open(src).convert("RGB")
    if im.width / im.height > 0.7:
        from PIL import ImageFilter, ImageEnhance
        bg = im.resize((int(H * im.width / im.height), H), Image.LANCZOS)
        l = (bg.width - W) // 2
        bg = ImageEnhance.Brightness(bg.crop((l, 0, l + W, H)).filter(ImageFilter.GaussianBlur(40))).enhance(0.7)
        fg = im.resize((W, int(W * im.height / im.width)), Image.LANCZOS)
        bg.paste(fg, (0, (H - fg.height) // 2))
        bg.save(out, quality=95)
        return out
    s = max(W / im.width, H / im.height)
    im = im.resize((int(im.width * s) + 1, int(im.height * s) + 1), Image.LANCZOS)
    l, t = (im.width - W) // 2, (im.height - H) // 2
    im.crop((l, t, l + W, t + H)).save(out, quality=95)
    return out

def end_card(line1, line2):
    logo = Image.open(A + "logo/logo-option-1.jpg").convert("RGB").resize((760, 760))
    im = Image.new("RGB", (W, H), logo.getpixel((5, 5)))
    im.paste(logo, ((W - 760) // 2, 330))
    d = ImageDraw.Draw(im)
    y = 1180
    for txt, px, col in ((line1, 74, GREEN), (line2, 62, TERRA), ("woventails.com", 58, GREEN)):
        f = font(px, "ExtraBold")
        for ln in textwrap.wrap(txt, 24):
            w = d.textlength(ln, font=f)
            d.text(((W - w) / 2, y), ln, font=f, fill=col)
            y += int(px * 1.25)
        y += 40
    p = f"{TMP}/end{abs(hash(line1+line2))}.jpg"; im.save(p, quality=95); return p

def run(cmd):
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def seg(kind, src, dur, text="", pos="top", size=78, src2=None):
    """Render one segment to mp4. kind: img (slow zoom), vid (AI clip), xfade (img -> img2 dissolve)."""
    out = f"{TMP}/seg{len(os.listdir(TMP))}.mp4"
    ov = text_png(text, pos, size)
    n = int(dur * FPS)
    if kind == "img":
        a = fit(src, f"{TMP}/f{abs(hash(src))}.jpg")
        vf = (f"[0:v]scale={W*2}:{H*2},zoompan=z='1+0.06*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
              f":d={n}:s={W}x{H}:fps={FPS}[b];[b][1:v]overlay=0:0,format=yuv420p")
        run(["ffmpeg", "-y", "-loop", "1", "-i", a, "-i", ov, "-filter_complex", vf, "-t", str(dur), "-r", str(FPS), "-c:v", "libx264", "-crf", "20", out])
    elif kind == "xfade":
        a, b = fit(src, f"{TMP}/a{abs(hash(src))}.jpg"), fit(src2, f"{TMP}/b{abs(hash(src2))}.jpg")
        half = dur / 2
        vf = (f"[0:v]fps={FPS},format=yuv420p[a];[1:v]fps={FPS},format=yuv420p[b];"
              f"[a][b]xfade=transition=fade:duration=0.6:offset={half-0.3}[x];[x][2:v]overlay=0:0,format=yuv420p")
        run(["ffmpeg", "-y", "-loop", "1", "-t", str(half + 0.3), "-i", a, "-loop", "1", "-t", str(half + 0.3), "-i", b, "-i", ov,
             "-filter_complex", vf, "-t", str(dur), "-c:v", "libx264", "-crf", "20", out])
    elif kind == "vid":
        ss = "0"
        if "@" in src:
            src, ss = src.split("@")
        vf = (f"[0:v]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps={FPS}[v];"
              f"[v][1:v]overlay=0:0,format=yuv420p")
        run(["ffmpeg", "-y", "-ss", ss, "-i", src, "-i", ov, "-filter_complex", vf, "-t", str(dur), "-an", "-c:v", "libx264", "-crf", "20", out])
    return out

ONLY = sys.argv[1:]  # optional: build only these video names

def video(name, segments):
    if ONLY and name not in ONLY:
        return
    files = [seg("img", end_card(*s[1:3]), s[3]) if s[0] == "end" else seg(*s) for s in segments]
    lst = f"{TMP}/{name}.txt"
    open(lst, "w").write("".join(f"file '{f}'\n" for f in files))
    os.makedirs(A + "videos", exist_ok=True)
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
         "-shortest", "-c:v", "libx264", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-movflags", "+faststart", A + f"videos/{name}.mp4"])
    print("made", name)

def end(l1, l2, dur=2.5):
    return ("end", l1, l2, dur)

P, ART, L, C, BK = A + "pets/", A + "blanket-art/", A + "lifestyle/", A + "clips/", A + "storybook/pages/"
XMAS = "Order by Dec 10 for Christmas"

if __name__ == "__main__":
    video("1A-photo-to-blanket", [
        ("img", P + "golden.jpg", 1.6, "Send us your dog's photo"),
        ("xfade", P + "golden.jpg", 2.0, "We illustrate it...", "top", 78, ART + "golden-pop.jpg"),
        ("vid", C + "blanket-sofa.mp4", 3.5, "...and WEAVE it into a cotton blanket"),
        ("vid", C + "weave-closeup.mp4", 3.0, "Woven, not printed"),
        ("vid", C + "presenter-blanket.mp4", 3.0, "You approve the art first"),
        end("Custom pet portrait woven blanket", XMAS)])
    video("1B-dog-mom-gift", [
        ("vid", C + "presenter-blanket.mp4", 2.5, "The gift for the person who shows you 400 dog photos"),
        ("xfade", P + "collie.jpg", 1.8, "1 photo...", "top", 78, ART + "collie-pop.jpg"),
        ("xfade", P + "frenchie.jpg", 1.8, "...becomes art...", "top", 78, ART + "frenchie-pop.jpg"),
        ("img", L + "blanket-tree-collie.jpg", 2.5, "...woven into 100% cotton"),
        ("vid", C + "blanket-sofa.mp4", 3.0, "Their real face. Their real markings."),
        end("Gift for the dog mom", XMAS)])
    video("1C-pick-a-style", [
        ("img", P + "tabby.jpg", 1.5, "Which style would you pick?"),
        ("img", ART + "tabby-pop.jpg", 1.7, "1. Bold Pop", "bottom", 96),
        ("img", ART + "tabby-christmas.jpg", 1.7, "2. Christmas", "bottom", 96),
        ("img", ART + "tabby-royal.jpg", 1.7, "3. Royal", "bottom", 96),
        ("vid", C + "blanket-bed-tabby.mp4", 3.5, "Then we weave it into a cotton blanket"),
        end("Comment 1, 2 or 3 below", XMAS)])
    video("2A-storybook-hero", [
        ("xfade", P + "golden.jpg", 2.2, "What if your dog was the hero of a book?", "top", 74, BK + "00-cover.jpg"),
        ("vid", C + "book-table.mp4", 3.0, "Illustrated from YOUR photo"),
        ("img", BK + "11.jpg", 1.4, "on every page", "top", 84),
        ("img", BK + "12.jpg", 1.4, "", "top"),
        ("img", BK + "13.jpg", 1.4, "", "top"),
        ("img", BK + "16.jpg", 1.4, "", "top"),
        ("vid", C + "presenter-book.mp4", 3.0, "24-page hardcover, with your family's names"),
        end("Personalized pet storybook", XMAS)])
    video("2B-bedtime-story", [
        ("vid", C + "presenter-book.mp4", 3.0, "The bedtime story kids ask for every night"),
        ("img", BK + "01.jpg", 2.0, "starring the family dog", "top"),
        ("img", BK + "12.jpg", 1.6, "", "top"),
        ("img", BK + "23.jpg", 2.4, "drawn from your photo", "top"),
        ("vid", C + "book-table.mp4", 3.0, "Hardcover · 24 pages · made in the USA"),
        end("Personalized pet storybook", XMAS)])
    BC = A + "storybook/pages-cat/"
    video("2C-cat-main-character", [
        ("img", P + "tabby.jpg", 1.8, "Your cat already thinks they're the main character"),
        ("xfade", P + "tabby.jpg", 2.0, "So we made it official", "top", 78, BC + "00-cover.jpg"),
        ("img", BC + "10.jpg", 1.5, "", "top"),
        ("img", BC + "13.jpg", 1.5, "", "top"),
        ("img", BC + "23.jpg", 1.7, "", "top"),
        (("vid", C + "book-bed-tabby.mp4") if os.path.exists(C + "book-bed-tabby.mp4") else ("img", L + "book-bed-tabby.jpg"))
        + (3.5, "A hardcover storybook illustrated from YOUR photo"),
        end("Personalized cat storybook", XMAS)])
    video("4A-3d-blanket", [
        ("vid", C + "3d-blanket.mp4@0", 4.4, "Your pet, woven into 100% cotton"),
        ("vid", C + "3d-blanket.mp4@4.4", 4.4, "Bold Pop, Christmas or Royal"),
        ("vid", C + "3d-blanket.mp4@8.8", 4.4, "Made from YOUR photo"),
        end("Custom pet portrait woven blanket", XMAS)])
    video("4B-3d-storybook-dog", [
        ("vid", C + "3d-book.mp4@0", 4.5, "A storybook starring your dog"),
        ("vid", C + "3d-book.mp4@4.5", 4.5, "Your real pet on every page"),
        ("vid", C + "3d-book.mp4@9", 4.5, "24 pages · hardcover · $42"),
        end("Personalized pet storybook", XMAS)])
    video("4C-3d-storybook-cat", [
        ("vid", C + "3d-bookcat.mp4@0", 4.3, "A storybook starring your cat"),
        ("vid", C + "3d-bookcat.mp4@4.3", 4.3, "Sunbeams, boxes and naps"),
        ("vid", C + "3d-bookcat.mp4@8.6", 4.2, "Illustrated from YOUR photo"),
        end("Personalized cat storybook", XMAS)])
    video("4D-3d-gift-set", [
        ("vid", C + "3d-gift.mp4@0", 4.2, "One photo of your pet..."),
        ("vid", C + "3d-gift.mp4@4.2", 4.6, "...two gifts: blanket + storybook"),
        end("Blanket + storybook gift set $99", XMAS)])
    video("3A-gift-set", [
        ("img", P + "golden.jpg", 1.5, "One photo of your pet..."),
        ("vid", C + "bundle-giftbox.mp4", 3.5, "...two gifts"),
        ("vid", C + "blanket-sofa.mp4", 2.5, "A woven cotton blanket"),
        ("vid", C + "book-table.mp4", 2.5, "+ a storybook starring them"),
        end("Blanket + storybook gift set $99", XMAS)])
