"""Momentum Top 3 ranking.

Usage: python3 rank.py <historicals JSON files...>
Input: Robinhood get_equity_historicals outputs (daily bars, ~14 months, must include SPY).
Signal: as of the last trading day of the PREVIOUS month (month-end close),
        momentum = month-end close / close 252 trading days before - 1 (12-0: latest month INCLUDED,
        changed 2026-11-09 after backtest section 6).
Prints the ranking, the top 3, and the dates used.
"""
import json, sys, datetime, os
HERE = os.path.dirname(os.path.abspath(__file__))
UNIVERSE = open(os.path.join(HERE, "sp100.txt")).read().split()
closes = {}
for f in sys.argv[1:]:
    data = json.load(open(f))
    data = data.get("data", data)
    for r in data["results"]:
        closes.setdefault(r["symbol"], {}).update(
            {b["begins_at"][:10]: float(b["close_price"]) for b in r["bars"] if not b.get("interpolated")})
days = sorted(closes["SPY"])
first_of_month = datetime.date.today().replace(day=1).isoformat()
asof = max(d for d in days if d < first_of_month)
j = days.index(asof)
if j < 252: sys.exit(f"ERROR: need >=253 SPY bars before {asof}, have {j+1}")
SKIP = 0   # trading days skipped at the end; 0 = include the latest month
d21, d252 = days[j - SKIP], days[j - 252]
rows, missing = [], []
for s in UNIVERSE:
    c = closes.get(s, {})
    if d21 in c and d252 in c: rows.append((c[d21] / c[d252] - 1, s))
    else: missing.append(s)
rows.sort(reverse=True)
print(f"Signal as of {asof} (month-end). Momentum = close {d21} / close {d252} - 1. Ranked {len(rows)}, missing {missing}")
for k, (m, s) in enumerate(rows[:10], 1):
    print(f"{k:2d}. {s:6s} {m*100:+7.1f}%")
print("TOP3=" + ",".join(s for _, s in rows[:3]))
