# Audio

| Folder | What | License |
|---|---|---|
| `music/cozy.wav` | Warm holiday lo-fi bed: electric piano, bass, soft drums, sleigh bells. Used on blanket + gift-set videos | Original: composed and synthesized from scratch by `scripts/make_music.py` (no samples, no AI model). Woven Tails owns it |
| `music/storybook.wav` | Gentle music-box + plucked-string lullaby. Used on storybook videos | Same as above |
| `vo/*.wav` | One voiceover track per video (voice "af_heart") | Generated with **Kokoro-82M** (open-source TTS, Apache-2.0: commercial use allowed) via `scripts/make_voiceover.py` |

Every video in `assets/videos/` is mixed with `scripts/make_videos.py`: the music ducks under the voice and the result is normalized to **-14 LUFS** (Instagram/YouTube loudness target).

**Change a line:** edit `SCRIPT` in `scripts/make_voiceover.py`, rerun it for that video, then `python3 scripts/make_videos.py <video-name>`.
**Change the voice:** set `VOICE` (e.g. `af_bella`, `af_nicole`, `am_michael` for male, `bf_emma` for British).
**Change the music:** tweak tempo, chords or instruments in `scripts/make_music.py` and rerun it.

You can still add a trending sound in Instagram on top (set the original audio volume to keep the voice clear), but the videos are complete as they are.
