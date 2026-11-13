"""Find top GTA clips through the Twitch Helix API."""
from datetime import datetime, timedelta, timezone

import requests

HELIX = "https://api.twitch.tv/helix"


class Twitch:
    def __init__(self, client_id: str, client_secret: str):
        if not client_id or not client_secret:
            raise SystemExit("Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in .env")
        r = requests.post(
            "https://id.twitch.tv/oauth2/token",
            params={
                "client_id": client_id,
                "client_secret": client_secret,
                "grant_type": "client_credentials",
            },
            timeout=20,
        )
        r.raise_for_status()
        self.headers = {
            "Client-Id": client_id,
            "Authorization": f"Bearer {r.json()['access_token']}",
        }

    def _get(self, path: str, params) -> dict:
        r = requests.get(f"{HELIX}/{path}", headers=self.headers, params=params, timeout=20)
        r.raise_for_status()
        return r.json()

    def game_id(self, name: str) -> str:
        data = self._get("games", {"name": name})["data"]
        if not data:
            raise SystemExit(f"Twitch has no game named {name!r}")
        return data[0]["id"]

    def user_ids(self, logins: list[str]) -> dict[str, str]:
        ids = {}
        for i in range(0, len(logins), 100):
            batch = [("login", l.lower()) for l in logins[i : i + 100]]
            for u in self._get("users", batch)["data"]:
                ids[u["id"]] = u["login"]
        return ids

    def _clips(self, params: dict, pages: int = 3) -> list[dict]:
        clips, cursor = [], None
        for _ in range(pages):
            p = dict(params, first=100)
            if cursor:
                p["after"] = cursor
            resp = self._get("clips", p)
            clips += resp["data"]
            cursor = resp.get("pagination", {}).get("cursor")
            if not cursor:
                break
        return clips

    def top_clips(self, cfg: dict) -> list[dict]:
        end = datetime.now(timezone.utc)
        window = {
            "started_at": (end - timedelta(hours=cfg["lookback_hours"])).isoformat(),
            "ended_at": end.isoformat(),
        }
        game = self.game_id(cfg["game_name"])

        if cfg["channel_allowlist"]:
            clips = []
            for bid in self.user_ids(cfg["channel_allowlist"]):
                clips += self._clips({**window, "broadcaster_id": bid}, pages=1)
            clips = [c for c in clips if c["game_id"] == game]
        else:
            clips = self._clips({**window, "game_id": game})

        blocked = {b.lower() for b in cfg["channel_blocklist"]}
        langs = set(cfg["languages"])
        keep = [
            c
            for c in clips
            if c["view_count"] >= cfg["min_views"]
            and cfg["min_duration_sec"] <= c["duration"] <= cfg["max_duration_sec"]
            and (not langs or c["language"] in langs)
            and c["broadcaster_name"].lower() not in blocked
        ]
        return sorted(keep, key=lambda c: c["view_count"], reverse=True)
