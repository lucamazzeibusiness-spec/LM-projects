# GTA Clipper

Pulls the most-viewed GTA V Twitch clips from the last 24h, turns each into a
1080x1920 Short with burned-in captions and a streamer credit, and drops them
in `output/<date>/` with a `review.csv` for you to approve before uploading.

## Setup (once)

1. Create a Twitch app at https://dev.twitch.tv/console/apps and copy
   `.env.example` to `.env` with your Client ID and Secret.
2. Dependencies are already installed in `.venv`. On a fresh machine:
   `python -m venv .venv` then `.venv\Scripts\pip install -r requirements.txt`
   (needs FFmpeg on PATH).

## Daily use

    .venv\Scripts\python.exe run.py            # process clips_per_run clips
    .venv\Scripts\python.exe run.py --limit 3  # quick run

Open `output/<date>/review.csv`, watch each `short.mp4`, and mark `approved`.
Title, description (with credit + source link) and tags are in each folder's
`metadata.json`.

## Explainer videos (`explain.py`)

Narrated videos built from trailers or any other footage, e.g. "GTA 6 trailer 3
details you missed". Needs `ANTHROPIC_API_KEY` in `.env` (a few cents per video).

    .venv\Scripts\python.exe explain.py "GTA 6 trailer 3 details you missed" --footage https://youtu.be/XXXX
    .venv\Scripts\python.exe explain.py "Every GTA 6 leak so far" --format long --footage a.mp4 --footage b.mp4

What happens:
1. Claude researches the topic with web search (`facts.md`), then writes a
   scene-by-scene script (`script.json`).
2. Footage is downloaded, shot changes are detected, and each scene gets its own shot.
3. Each line is voiced with a free Edge neural voice (`--voice`, `explainer_voice`).
4. Shots + voice + captions are rendered to `video.mp4`; title/description/tags
   go in `metadata.json`. Output: `output/explainers/<date>_<topic>/`.

To fix a scene, edit `script.json` (`start` = seconds into `source`, or the
`narration` text) and re-render:

    .venv\Scripts\python.exe explain.py --render-only output\explainers\<project> [--revoice]

No API key? Write your own script JSON (`title`, `description`, `tags`,
`scenes: [{narration, visual}]`) and pass `--script-file`. `--music file.mp3`
adds quiet background music; only use music you have the rights to.

## Other tools

| Script | What it does |
| --- | --- |
| `clip_vod.py` | Twitch VOD (or local recording) to candidate Shorts. Scores loudness, German reaction words and chat; GPU transcription with CPU fallback. `--credit NAME` shows "CLIP VON NAME"; `--times 1:23:10-1:23:40,...` renders hand-picked ranges. |
| `footage_short.py` | Footage-led Shorts from a JSON plan: on-screen text, freeze-frame zoom, optional narrator voice with captions. |
| `meme.py` | Two-part meme Short: image or video on top, a clip with its sound below. |

## Branding (`branding/`)

| Script | Output (in `branding/out/`) |
| --- | --- |
| `make_branding.py` | YouTube banner (2560x1440) and the first profile picture |
| `make_pfp.py` | Profile picture concepts; `pfp_a_wanted.png` is the one in use |
| `make_twitch.py` | Twitch profile banner, offline screen and five info panels |

`branding/POSTING-KIT.md` has the channel description and upload texts. German texts
for the Twitch panels are in `docs/twitch-panel-texte.md`; the channel's content rules
are in `docs/RULES.md`.

## Config (`config.json`)

| key | meaning |
| --- | --- |
| `channel_allowlist` | Twitch logins to clip *only* from. **Strongly recommended**: fill this with streamers who allow clipping (many GTA RP streamers run clipper programs). Empty = all GTA clips. |
| `channel_blocklist` | Streamers to never clip (e.g. ones who have asked clippers to stop). |
| `min_views`, `lookback_hours`, `clips_per_run` | How picky / how many. |
| `layout` | `blur` (full frame over blurred background) or `crop` (centre crop). |
| `whisper_model` | `tiny` / `base` / `small` / `medium`. Bigger = better captions, slower. |

## Channel safety

Reuploading other people's streams is the main risk for this kind of channel:
- Streamers can file copyright claims; three strikes deletes the channel.
- YouTube's *inauthentic / reused content* policy can demonetize channels that
  post unedited clips. Captions help; adding your own hook, commentary or
  edits helps more.
- Always keep the credit and source link (the pipeline adds both).
