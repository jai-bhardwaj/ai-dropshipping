"""Compose and synthesize original, royalty-free background music for the videos.

Everything here is generated from scratch (no samples, no AI model), so Woven Tails owns it outright.
Two tracks:
  cozy.wav      - warm holiday lo-fi: electric piano, bass, soft drums, sleigh bells (blanket + gift videos)
  storybook.wav - gentle music-box / plucked strings bedtime feel (storybook videos)

Usage: python3 scripts/make_music.py   (needs numpy + scipy)  -> assets/audio/music/
"""
import os
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

SR = 44100
OUT = "assets/audio/music/"
rng = np.random.default_rng(7)


def hz(note):
    """MIDI note number -> frequency."""
    return 440.0 * 2 ** ((note - 69) / 12)


def env_adsr(n, a=0.01, d=0.2, s=0.6, r=0.3):
    t = np.arange(n) / SR
    dur = n / SR
    e = np.where(t < a, t / a, np.where(t < a + d, 1 - (1 - s) * (t - a) / d, s))
    rel = np.clip((dur - t) / r, 0, 1)
    return e * rel


def lowpass(x, f, order=2):
    return sosfilt(butter(order, f, "low", fs=SR, output="sos"), x)


def highpass(x, f, order=2):
    return sosfilt(butter(order, f, "high", fs=SR, output="sos"), x)


def bandpass(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def epiano(f, dur, vel=0.5):
    """FM electric piano (Rhodes-like): bell-ish attack that mellows."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    idx = 1.8 * np.exp(-t * 3.5) + 0.25
    mod = np.sin(2 * np.pi * f * t) * idx
    tone = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 6)
    tremolo = 1 + 0.06 * np.sin(2 * np.pi * 4.5 * t)
    return tone * env_adsr(n, 0.004, 0.9, 0.35, 0.25) * tremolo * vel


def pluck(f, dur, vel=0.5, bright=0.5):
    """Karplus-Strong plucked string."""
    n = int(dur * SR)
    period = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, period) * vel
    buf = lowpass(np.concatenate([buf, buf]), 2000 + 6000 * bright)[:period]
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % period]
        buf[i % period] = 0.5 * (buf[i % period] + buf[(i + 1) % period]) * 0.996
    return out * env_adsr(n, 0.001, 0.05, 1, 0.08)


def musicbox(f, dur, vel=0.4):
    """Music box / celesta: inharmonic sine partials with fast decay."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = (np.sin(2 * np.pi * f * t) * np.exp(-t * 2.2)
            + 0.45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 5)
            + 0.2 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 9))
    return tone * vel * env_adsr(n, 0.002, 0.1, 1, 0.1)


def bass(f, dur, vel=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    tone = np.tanh(1.6 * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)))
    return lowpass(tone, 600) * env_adsr(n, 0.01, 0.3, 0.7, 0.12) * vel


def kick(vel=0.8):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 110 * np.exp(-t * 18) + 45
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 9) * vel


def brush(vel=0.25, length=0.12):
    n = int(length * SR)
    t = np.arange(n) / SR
    return bandpass(rng.normal(0, 1, n), 3000, 9000) * np.exp(-t * 30) * vel


def sleigh(vel=0.18):
    """Sleigh-bell jingle: cluster of high detuned partials with fast tremolo."""
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in (5100, 5870, 6620, 7400, 8150))
    s = s * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 26 * t))) + bandpass(rng.normal(0, 1, n), 6000, 12000) * 0.5
    return s * np.exp(-t * 11) * vel / 5


def place(track, sound, at):
    i = int(at * SR)
    end = min(len(track), i + len(sound))
    if i < len(track):
        track[i:end] += sound[: end - i]


def reverb(x, seconds=1.8, mix=0.22):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    ir = rng.normal(0, 1, n) * np.exp(-t * 3.2)
    ir = lowpass(ir, 5000)
    wet = fftconvolve(x, ir)[: len(x)]
    wet /= np.max(np.abs(wet)) + 1e-9
    return (1 - mix) * x + mix * wet * np.max(np.abs(x))


def master(x, fade_in=0.4, fade_out=2.5):
    x = highpass(x, 35)
    x = np.tanh(x * 1.2)
    n = len(x)
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    x[:fi] *= np.linspace(0, 1, fi)
    x[-fo:] *= np.linspace(1, 0, fo)
    return x / (np.max(np.abs(x)) + 1e-9) * 0.89


def chord_notes(root, kind):
    shapes = {"maj7": (0, 4, 7, 11), "m7": (0, 3, 7, 10), "7sus": (0, 5, 7, 10), "maj9": (0, 4, 7, 14), "add9": (0, 4, 7, 14), "6": (0, 4, 7, 9)}
    return [root + i for i in shapes[kind]]


def cozy(length=24.0):
    bpm = 84
    beat = 60 / bpm
    bar = 4 * beat
    prog = [(53, "maj7"), (50, "m7"), (58, "maj7"), (48, "7sus")]  # Fmaj7 Dm7 Bbmaj7 C7sus
    keys, low, drums, bells, mel = (np.zeros(int(length * SR)) for _ in range(5))
    melody = [72, 69, 67, 65, 67, 69, 72, 74, 72, 69, 67, 69, 65, 67, 69, 65]  # F major pentatonic phrase
    b = 0
    while b * bar < length:
        root, kind = prog[b % 4]
        t0 = b * bar
        for k, beat_at in enumerate((0, 1.5, 2, 3.5)):
            for j, nt in enumerate(chord_notes(root + 12, kind)):
                place(keys, epiano(hz(nt), beat * 1.6, 0.18 if k % 2 == 0 else 0.11), t0 + beat_at * beat + j * 0.012)
        place(low, bass(hz(root - 12), beat * 1.8), t0)
        place(low, bass(hz(root - 5), beat * 0.9, 0.45), t0 + 2.5 * beat)
        if b >= 1:
            for q in range(4):
                if q in (0, 2):
                    place(drums, kick(0.55), t0 + q * beat)
                place(drums, brush(0.22), t0 + q * beat + beat / 2)
                place(drums, brush(0.12, 0.08), t0 + q * beat)
            for q in range(8):
                place(bells, sleigh(0.16 if q % 2 else 0.1), t0 + q * beat / 2)
        if b >= 2:
            for q in range(4):
                nt = melody[(b * 4 + q) % len(melody)]
                place(mel, musicbox(hz(nt), beat * 1.2, 0.16), t0 + q * beat + (0.5 * beat if q % 2 else 0))
        b += 1
    vinyl = lowpass(rng.normal(0, 1, len(keys)), 3000) * 0.006
    mix = 1.0 * lowpass(keys, 4500) + 0.9 * low + 0.5 * lowpass(drums, 8000) + 0.28 * lowpass(bells, 9000) + 0.6 * mel + vinyl
    return master(lowpass(reverb(mix, 2.0, 0.25), 11000))


def storybook(length=24.0):
    bpm = 92
    beat = 60 / bpm
    bar = 4 * beat
    prog = [(60, "add9"), (57, "m7"), (53, "maj7"), (55, "6")]  # Cadd9 Am7 Fmaj7 G6
    tune = [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 84, 81, 79, 76, 74, 72]  # C major lullaby line
    pl, box, low, pad = (np.zeros(int(length * SR)) for _ in range(4))
    b = 0
    while b * bar < length:
        root, kind = prog[b % 4]
        t0 = b * bar
        notes = chord_notes(root, kind)
        arp = notes + [notes[1] + 12, notes[2] + 12, notes[1] + 12, notes[2]]
        for q in range(8):
            place(pl, pluck(hz(arp[q % len(arp)]), beat * 0.9, 0.3, 0.4), t0 + q * beat / 2)
        place(low, bass(hz(root - 24), bar * 0.95, 0.4), t0)
        n = int(bar * SR)
        t = np.arange(n) / SR
        place(pad, sum(np.sin(2 * np.pi * hz(x) * t) for x in notes) * env_adsr(n, 0.6, 0.5, 0.8, 0.8) * 0.03, t0)
        if b >= 1:
            for q in range(4):
                place(box, musicbox(hz(tune[(b * 4 + q) % len(tune)]), beat * 1.4, 0.2), t0 + q * beat)
        b += 1
    mix = 0.8 * lowpass(pl, 6000) + 0.85 * box + 0.6 * low + pad
    return master(reverb(mix, 2.4, 0.3))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in (("cozy", cozy), ("storybook", storybook)):
        x = fn()
        stereo = np.stack([x, np.roll(x, int(0.012 * SR))], axis=1)  # slight width
        wavfile.write(OUT + f"{name}.wav", SR, (stereo * 32767).astype(np.int16))
        print("made", name)
