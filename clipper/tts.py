"""Narration with Microsoft Edge's free neural voices (edge-tts), with an offline fallback."""
import asyncio
import subprocess
import time
from pathlib import Path

import edge_tts

# A few voices that suit gaming content. List them all with: edge-tts --list-voices
VOICES = ["en-US-AndrewNeural", "en-US-GuyNeural", "en-US-ChristopherNeural", "en-GB-RyanNeural"]


async def _speak(text: str, out: Path, voice: str, rate: str) -> None:
    # The websocket can hang without ever erroring, so bound each attempt.
    await asyncio.wait_for(edge_tts.Communicate(text, voice, rate=rate).save(str(out)), timeout=45)


def _windows_voice(text: str, out: Path) -> None:
    """Built-in Windows speech: robotic but offline, used only if Edge keeps failing."""
    wav = out.with_suffix(".wav")
    script = (
        "Add-Type -AssemblyName System.Speech;"
        "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer;"
        f"$s.SetOutputToWaveFile('{wav}'); $s.Speak($input | Out-String); $s.Dispose()"
    )
    subprocess.run(["powershell", "-NoProfile", "-Command", script], input=text, text=True, check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), str(out)], check=True)
    wav.unlink()


def speak(text: str, out: Path, voice: str = VOICES[0], rate: str = "+8%", tries: int = 5) -> Path:
    # The free Edge service throttles bursts of requests and answers with no audio
    # or a stalled connection; backing off for a while gets it working again.
    # Write to a temp name so a failed attempt never leaves a broken file behind.
    part = out.with_suffix(".part")
    for attempt in range(tries):
        try:
            asyncio.run(_speak(text, part, voice, rate))
            part.replace(out)
            return out
        except (edge_tts.exceptions.EdgeTTSException, asyncio.TimeoutError, OSError):
            time.sleep(3 * 2**attempt)
    part.unlink(missing_ok=True)
    print(f"   Edge TTS unavailable, using the Windows voice for {out.name}")
    _windows_voice(text, out)
    return out
