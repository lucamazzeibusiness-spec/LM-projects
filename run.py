"""Fetch today's top GTA clips and turn them into Shorts ready for review.

    python run.py                  # normal run, uses config.json
    python run.py --limit 3        # override clips_per_run
    python run.py --local file.mp4 # render a local video only (no Twitch), for testing
"""
import argparse
import csv
import json
import os
from datetime import date
from pathlib import Path

from dotenv import load_dotenv

from clipper import captions, render

ROOT = Path(__file__).parent
STATE = ROOT / "data" / "processed.json"


def load_state() -> set[str]:
    return set(json.loads(STATE.read_text())) if STATE.exists() else set()


def save_state(done: set[str]) -> None:
    STATE.parent.mkdir(exist_ok=True)
    STATE.write_text(json.dumps(sorted(done), indent=1))


def metadata(clip: dict, cfg: dict) -> dict:
    streamer = clip["broadcaster_name"]
    tags = " ".join(cfg["hashtags"])
    title = f"{clip['title'].strip()} | {streamer}"
    if len(title) > 100:
        title = title[:97].rstrip() + "..."
    description = (
        f"Credit: {streamer} - https://twitch.tv/{streamer.lower()}\n"
        f"Original clip: {clip['url']}\n\n"
        f"Go follow {streamer} for more!\n\n{tags}"
    )
    return {
        "title": title,
        "description": description,
        "tags": [t.lstrip("#") for t in cfg["hashtags"]] + [streamer],
        "streamer": streamer,
        "views": clip["view_count"],
        "source_url": clip["url"],
        "created_at": clip.get("created_at"),
    }


def process(src: Path, folder: Path, credit: str, cfg: dict) -> Path:
    ass = None
    if cfg["captions"]:
        words = captions.transcribe_words(src, cfg["whisper_model"], cfg.get("whisper_device", "cpu"))
        ass = folder / "captions.ass"
        captions.write_ass(ass, render.duration(src), credit, words)
    out = folder / "short.mp4"
    render.render(src, out, cfg["layout"], ass)
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int)
    ap.add_argument("--local", type=Path)
    args = ap.parse_args()

    cfg = json.loads((ROOT / "config.json").read_text())
    day_dir = ROOT / "output" / date.today().isoformat()
    day_dir.mkdir(parents=True, exist_ok=True)

    if args.local:
        folder = day_dir / ("local_" + args.local.stem)
        folder.mkdir(exist_ok=True)
        src = folder / ("source" + args.local.suffix)
        src.write_bytes(args.local.read_bytes())
        print("Rendered", process(src, folder, "twitch.tv/example", cfg))
        return

    from clipper.twitch import Twitch

    load_dotenv(ROOT / ".env")
    tw = Twitch(os.getenv("TWITCH_CLIENT_ID"), os.getenv("TWITCH_CLIENT_SECRET"))
    done = load_state()
    clips = [c for c in tw.top_clips(cfg) if c["id"] not in done]
    clips = clips[: args.limit or cfg["clips_per_run"]]
    print(f"{len(clips)} new clips to process")

    rows = []
    for i, clip in enumerate(clips, 1):
        print(f"[{i}/{len(clips)}] {clip['broadcaster_name']}: {clip['title']} ({clip['view_count']} views)")
        folder = day_dir / f"{clip['broadcaster_name']}_{clip['id'][:24]}"
        folder.mkdir(exist_ok=True)
        try:
            src = render.download(clip["url"], folder)
            out = process(src, folder, f"twitch.tv/{clip['broadcaster_name']}", cfg)
            src.unlink(missing_ok=True)
        except Exception as e:
            print("   failed:", e)
            continue
        meta = metadata(clip, cfg)
        (folder / "metadata.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
        rows.append({"approved": "", "file": str(out.relative_to(ROOT)), **{k: meta[k] for k in ("title", "streamer", "views", "source_url")}})
        done.add(clip["id"])
        save_state(done)

    sheet = day_dir / "review.csv"
    new = not sheet.exists()
    with sheet.open("a", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=["approved", "file", "title", "streamer", "views", "source_url"])
        if new:
            w.writeheader()
        w.writerows(rows)
    print(f"Done. Review {len(rows)} clips in {sheet}")


if __name__ == "__main__":
    main()
