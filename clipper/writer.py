"""Research a topic with web search, then write a scene-by-scene video script with Claude."""
import anthropic
from pydantic import BaseModel, Field

# Sonnet costs half of Opus per token; switch to "claude-opus-5-5" for sharper scripts.
MODEL = "claude-sonnet-5-5"
# Re-run a refused request on a suitable fallback model instead of stopping.
BETAS = ["server-side-fallback-2026-07-01"]

SYSTEM = """You write scripts for a GTA YouTube channel (GTA V, GTA Online, GTA RP, GTA 6 news).
Hook the viewer in the first sentence, keep sentences short and spoken, and end with a reason to follow.
Accuracy matters more than hype: state confirmed facts plainly, label rumours and leaks as unconfirmed,
and never invent details, dates or quotes. Titles can be punchy but must match what the video delivers."""

LENGTHS = {
    "short": "a YouTube Short of 40-55 seconds (about 110-140 spoken words, 6-10 scenes)",
    "long": "a YouTube video of 6-9 minutes (about 900-1300 spoken words, 30-60 scenes)",
}


class Scene(BaseModel):
    narration: str = Field(description="What the narrator says over this shot, 1-2 sentences")
    visual: str = Field(description="What footage should be on screen, e.g. 'Vice City beach at sunset'")


class Script(BaseModel):
    title: str = Field(description="YouTube title, at most 90 characters")
    description: str = Field(description="YouTube description, 2-4 short lines")
    tags: list[str]
    scenes: list[Scene]


def _client() -> anthropic.Anthropic:
    try:
        return anthropic.Anthropic()
    except anthropic.AnthropicError:
        raise SystemExit("Set ANTHROPIC_API_KEY in .env (create one at console.anthropic.com)")


def _check(resp) -> None:
    if resp.stop_reason == "refusal":
        raise SystemExit(f"Claude declined this topic: {getattr(resp.stop_details, 'explanation', '')}")


def research(topic: str, notes: str = "") -> str:
    """Collect up-to-date facts on the topic using Claude's web search tool."""
    client = _client()
    messages = [{
        "role": "user",
        "content": (
            f"Research this GTA video topic and write factual notes for a scriptwriter: {topic}\n"
            "Prefer official Rockstar sources and reputable outlets. Separate confirmed facts from "
            "rumours, and include dates. Bullet points only."
            + (f"\n\nExtra notes from the channel owner:\n{notes}" if notes else "")
        ),
    }]
    for _ in range(5):
        resp = client.beta.messages.create(
            model=MODEL,
            max_tokens=16000,
            system=SYSTEM,
            messages=messages,
            tools=[{"type": "web_search_20260209", "name": "web_search", "max_uses": 5}],
            output_config={"effort": "medium"},
            betas=BETAS,
            fallbacks="default",
        )
        _check(resp)
        if resp.stop_reason != "pause_turn":
            break
        # Long server-tool turns pause; send the partial turn back to let it continue.
        messages.append({"role": "assistant", "content": resp.content})
    return "\n".join(b.text for b in resp.content if b.type == "text").strip()


def write_script(topic: str, facts: str, length: str) -> Script:
    resp = _client().beta.messages.parse(
        model=MODEL,
        max_tokens=16000,
        system=SYSTEM,
        messages=[{
            "role": "user",
            "content": (
                f"Write {LENGTHS[length]} on: {topic}\n\n"
                f"Use only these researched facts:\n{facts}"
            ),
        }],
        output_format=Script,
        output_config={"effort": "medium"},
        betas=BETAS,
        fallbacks="default",
    )
    _check(resp)
    return resp.parsed_output
