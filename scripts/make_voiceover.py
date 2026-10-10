"""Generate voiceovers for every video with Kokoro (open-source TTS, Apache-2.0, runs on CPU).

Setup (once):
  python3 -m venv .venv-audio && .venv-audio/bin/pip install kokoro-onnx soundfile numpy scipy
  mkdir -p models/kokoro && cd models/kokoro
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
  curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
Usage: KOKORO_DIR=models/kokoro .venv-audio/bin/python scripts/make_voiceover.py [video ...]
Output: assets/audio/vo/<video>.wav  (one track per video, lines placed at their start times)
"""
import os
import sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

VOICE = "af_heart"  # warm US-English female voice
SPEED = 1.05
SR = 24000
OUT = "assets/audio/vo/"

# (start second, line). Lines follow the on-screen captions; numbers are spelled out so they're read naturally.
SCRIPT = {
    "1A-photo-to-blanket": [(0.2, "Send us a photo of your dog."), (2.0, "We illustrate it, and weave it into a one hundred percent cotton blanket."),
                            (7.3, "Woven, not printed."), (10.0, "And you approve the art first."), (13.2, "Order by December tenth for Christmas.")],
    "1B-dog-mom-gift": [(0.2, "For the friend who shows you four hundred dog photos."), (3.1, "One photo becomes art,"),
                        (5.2, "woven into soft cotton."), (8.9, "Their real face. Their real markings."), (11.8, "The gift for the dog mom.")],
    "1C-pick-a-style": [(0.2, "Which style would you pick?"), (1.7, "One. Bold Pop."), (3.4, "Two. Christmas."), (5.1, "Three. Royal."),
                        (6.9, "Then we weave it into a cotton blanket."), (10.3, "Comment one, two, or three.")],
    "2A-storybook-hero": [(0.2, "What if your dog was the hero of a book?"), (2.6, "We illustrate them from your photo, on every page."),
                          (5.7, "Park days, giant sticks, and puddles,"), (8.3, "and one big surprise."),
                          (11.0, "A twenty-four page hardcover, with your family's names."), (14.2, "Woven Tails storybooks.")],
    "2B-bedtime-story": [(0.2, "The bedtime story kids ask for every night,"), (3.2, "starring the family dog,"),
                         (6.9, "drawn from your own photo."), (9.0, "Hardcover, twenty-four pages, made in the USA."), (12.3, "Order by December tenth.")],
    "2C-cat-main-character": [(0.2, "Your cat already thinks they're the main character."), (3.7, "So we made it official."),
                              (5.6, "Boxes. Birds. Naps on the clean laundry."), (8.8, "A hardcover storybook, illustrated from your photo."), (12.3, "Woven Tails.")],
    "3A-gift-set": [(0.2, "One photo of your pet,"), (1.8, "two gifts."), (5.1, "A woven cotton blanket,"),
                    (7.6, "plus a storybook starring them."), (10.2, "The gift set. Ninety-nine dollars.")],
    "4A-3d-blanket": [(0.3, "Your pet, woven into one hundred percent cotton."), (4.7, "Choose Bold Pop, Christmas, or Royal."),
                      (9.1, "Every blanket is made from your own photo."), (13.4, "Order by December tenth.")],
    "4B-3d-storybook-dog": [(0.3, "A storybook starring your dog."), (4.8, "Your real pet, on every single page."),
                            (9.3, "Twenty-four pages. Hardcover. Forty-two dollars."), (13.8, "Woven Tails.")],
    "4C-3d-storybook-cat": [(0.3, "A storybook starring your cat."), (4.6, "Sunbeams, boxes, and long naps."),
                            (8.9, "All illustrated from your photo."), (13.1, "Woven Tails.")],
    "4D-3d-gift-set": [(0.3, "One photo of your pet"), (2.3, "opens up to two gifts."),
                       (4.6, "A woven blanket, and a storybook starring them."), (9.0, "Ninety-nine dollars.")],
}


def render(k, lines, total):
    track = np.zeros(int(total * SR), dtype=np.float32)
    for i, (start, text) in enumerate(lines):
        nxt = lines[i + 1][0] if i + 1 < len(lines) else total - 0.2
        room = nxt - start - 0.15
        speed = SPEED
        audio, sr = k.create(text, voice=VOICE, speed=speed, lang="en-us")
        while len(audio) / sr > room and speed < 1.45:  # speed up a line only if it would overlap the next one
            speed += 0.07
            audio, sr = k.create(text, voice=VOICE, speed=speed, lang="en-us")
        a = int(start * SR)
        audio = audio[: max(0, len(track) - a)]
        track[a:a + len(audio)] += audio
        print(f"  {start:5.1f}s  {len(audio)/sr:4.1f}s  x{speed:.2f}  {text}")
    return track


if __name__ == "__main__":
    import subprocess
    k = Kokoro(os.path.join(os.environ.get("KOKORO_DIR", "models/kokoro"), "kokoro-v1.0.onnx"),
               os.path.join(os.environ.get("KOKORO_DIR", "models/kokoro"), "voices-v1.0.bin"))
    os.makedirs(OUT, exist_ok=True)
    for name, lines in SCRIPT.items():
        if sys.argv[1:] and name not in sys.argv[1:]:
            continue
        dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0",
                                    f"assets/videos/{name}.mp4"], capture_output=True, text=True).stdout or 16)
        print(name, f"({dur:.1f}s)")
        sf.write(OUT + f"{name}.wav", render(k, lines, dur), SR)
