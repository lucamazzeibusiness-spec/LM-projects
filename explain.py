"""Make a narrated GTA explainer video: research -> script -> voiceover -> footage -> render.

    python explain.py "GTA 6 trailer 3 details you missed" --footage https://youtu.be/... --footage trailer2.mp4
    python explain.py "Every GTA 6 map leak so far" --format long --footage ...
    python explain.py --script-file my_script.json --footage trailer.mp4   # skip Claude, use your own script
    python explain.py --render-only output/explainers/<project>             # after editing script.json
    python explain.py --render-only output/explainers/<project> --revoice   # narration text changed too
"""
import argparse
import json
import re
from datetime import date
from pathlib import Path

from dotenv import load_dotenv

from clipper import assemble, tts

ROOT = Path(__file__).parent


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:50]


def voice_scenes(project: Path, script: dict, voice: str, force: bool) -> None:
    work = project / "work"
    work.mkdir(exist_ok=True)
    for i, scene in enumerate(script["scenes"]):
        out = work / f"voice_{i:03d}.mp3"
        if force or not out.exists():
            tts.speak(scene["narration"], out, voice)


def finish(project: Path, script: dict, cfg: dict, args) -> None:
    voice_scenes(project, script, args.voice or cfg.get("explainer_voice", tts.VOICES[0]), args.revoice)
    print("Rendering...")
    out = assemble.render(project, script, cfg, Path(args.music) if args.music else None)
    meta = {k: script[k] for k in ("title", "description", "tags")}
    (project / "metadata.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Done: {out}\nTitle: {meta['title']}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("topic", nargs="?")
    ap.add_argument("--footage", action="append", default=[], help="YouTube URL or local video; repeatable")
    ap.add_argument("--format", choices=["short", "long"], default="short")
    ap.add_argument("--notes", type=Path, help="text file of facts/angles to include")
    ap.add_argument("--script-file", type=Path, help="use this script instead of asking Claude")
    ap.add_argument("--voice", help=f"edge-tts voice, e.g. {', '.join(tts.VOICES)}")
    ap.add_argument("--music", help="background music file (mixed quietly under the voice)")
    ap.add_argument("--render-only", type=Path, metavar="PROJECT")
    ap.add_argument("--revoice", action="store_true", help="regenerate narration audio")
    args = ap.parse_args()

    load_dotenv(ROOT / ".env")
    cfg = json.loads((ROOT / "config.json").read_text())

    if args.render_only:
        project = args.render_only.resolve()
        script = json.loads((project / "script.json").read_text(encoding="utf-8"))
        return finish(project, script, cfg, args)

    if not args.footage:
        ap.error("give at least one --footage URL or file")

    if args.script_file:
        script = json.loads(args.script_file.read_text(encoding="utf-8"))
        name = script["title"]
    else:
        if not args.topic:
            ap.error("give a topic or --script-file")
        from clipper import writer

        name = args.topic
        print("Researching...")
        facts = writer.research(args.topic, args.notes.read_text(encoding="utf-8") if args.notes else "")
        print("Writing script...")
        script = writer.write_script(args.topic, facts, args.format).model_dump()

    project = ROOT / "output" / "explainers" / f"{date.today().isoformat()}_{slug(name)}"
    project.mkdir(parents=True, exist_ok=True)
    if not args.script_file:
        (project / "facts.md").write_text(facts, encoding="utf-8")
    script["format"] = args.format

    print("Getting footage...")
    footage = assemble.fetch_footage(args.footage, project / "footage")
    if all("start" in s for s in script["scenes"]):
        # Shots were picked by hand in the script file; just point them at the footage.
        for s in script["scenes"]:
            s.setdefault("source", str(footage[0]))
    else:
        assemble.plan_footage(script["scenes"], footage, project)
    (project / "script.json").write_text(json.dumps(script, indent=2), encoding="utf-8")
    print(f"Script saved to {project / 'script.json'}")

    finish(project, script, cfg, args)


if __name__ == "__main__":
    main()
