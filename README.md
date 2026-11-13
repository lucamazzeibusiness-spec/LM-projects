# gta-clipper

Tools for the **GTA Deutschland** YouTube Shorts channel: turn Twitch streams into vertical Shorts, build two-part memes, and render the channel branding.

Nothing here uploads anything. Every clip is reviewed and posted by hand.

## Setup

Needs Python 3.10+ and [ffmpeg](https://ffmpeg.org/) on the PATH.

```
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt        # Windows
# .venv/bin/pip install -r requirements.txt          # Linux/macOS
```

For fast transcription on an NVIDIA card, also install the CUDA runtime:
`pip install nvidia-cublas-cu12 "nvidia-cudnn-cu12==9.*"`. Without it, use `--device cpu`.

## clip_vod.py: Twitch VOD → Shorts

```
python clip_vod.py https://www.twitch.tv/videos/<id> --model medium
python clip_vod.py recording.mp4 --chat chat.json
python clip_vod.py --captures <folder of clips>
```

It scores every moment of the stream on three signals: loudness spikes, German reaction words in the transcript (faster-whisper), and Twitch chat spikes. The best moments become 1080×1920 clips of 12–45 seconds with word-by-word captions, written to `output/vods/<date>/<id>/clips/` together with a `CANDIDATES.md` review sheet.

Useful options: `--top 12` (number of clips), `--zoom 1.3` (gameplay zoom in the vertical frame), `--font`, `--no-transcript`.

Tested on a synthetic stream. The Twitch download, chat replay and transcription of a real stream are only tested on the PC copy of this tool.

## meme.py: two-part meme Short

Image with caption and emoji on top, a video clip with its sound on the bottom.

```
python meme.py --top map.png --bottom "https://www.youtube.com/watch?v=..." \
  --caption "\"You've completed the tutorial. Now it's time to explore the world on your own\"" \
  --icon 👠 --icon-pos 0.55,0.7 --out meme.mp4
```

## branding/

| Script | Output (in `branding/out/`) |
|---|---|
| `make_branding.py` | YouTube banner (2560×1440) and the first profile picture |
| `make_pfp.py` | Profile picture concepts; `pfp_a_wanted.png` is the one in use |
| `make_twitch.py` | Twitch profile banner, offline screen and five info panels |

The scripts use Impact and Arial on Windows and fall back to Inter on Linux, so text looks slightly different between the two.

German texts for the Twitch panels are in `docs/twitch-panel-texte.md`. The channel's content rules are in `docs/RULES.md`.

## Content rules in short

Only use sources you're allowed to use: streamers who gave written permission (always credited), official Rockstar videos, and your own graphics. No leaked material, no AI voice, no invented facts.
