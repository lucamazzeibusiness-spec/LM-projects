"""Test strategy improvements A-D on 11.8 years of daily data (2015-2026).

Universe: large US stocks chosen by 2015 size (not today's winners -> less hindsight bias).
Base rules (live): BUY close>SMA50>SMA200 & RSI<70, signal at close -> fill next open,
SELL close<0.97*SMA50 -> fill next open, 15% stop intraday, 5-day cooldown,
3 equal slots, top-ups ignored, 0.05% slippage per fill.

Variants:
  A  bigger universe (28 stocks instead of 10)
  B  max 1 position per sector
  C  trend exit filled at the SAME day's close (live: 21:15 run) instead of next open
  D  market filter: no new buys while SPY close < SPY SMA200
  P  park idle cash in SPY (index fund) instead of holding cash
"""
import json, sys

SLIP = 0.0005
B = json.load(open(sys.argv[1]))
N = len(B["SPY"])
D = [b["begins_at"][:10] for b in B["SPY"]]
C = {s: {k: [float(b[k + "_price"]) for b in B[s]] for k in ("open", "low", "close")} for s in B}

def sma(xs, n):
    out, run = [None] * len(xs), 0.0
    for i, x in enumerate(xs):
        run += x
        if i >= n: run -= xs[i - n]
        if i >= n - 1: out[i] = run / n
    return out

def rsi(xs, n=14):
    out, g, l = [None] * len(xs), 0.0, 0.0
    for i in range(1, len(xs)):
        ch = xs[i] - xs[i - 1]; up, dn = max(ch, 0), max(-ch, 0)
        if i <= n:
            g += up; l += dn
            if i == n: g /= n; l /= n; out[i] = 100 - 100 / (1 + g / l) if l else 100
        else:
            g = (g * 13 + up) / 14; l = (l * 13 + dn) / 14
            out[i] = 100 - 100 / (1 + g / l) if l else 100
    return out

S50 = {s: sma(C[s]["close"], 50) for s in B}
S200 = {s: sma(C[s]["close"], 200) for s in B}
R = {s: rsi(C[s]["close"]) for s in B}
START = 200

SECTOR = {"AAPL": "tech", "MSFT": "tech", "ORCL": "tech", "INTC": "tech", "CSCO": "tech",
          "AMZN": "consumer", "HD": "consumer", "DIS": "media", "CMCSA": "media",
          "GOOGL": "media", "META": "media", "VZ": "telecom", "T": "telecom",
          "JPM": "finance", "WFC": "finance", "BAC": "finance", "V": "finance",
          "JNJ": "health", "PFE": "health", "MRK": "health", "UNH": "health",
          "XOM": "energy", "CVX": "energy", "GE": "industrial",
          "PG": "staples", "WMT": "staples", "KO": "staples", "PEP": "staples"}
SMALL = ["AAPL", "GOOGL", "MSFT", "XOM", "JNJ", "WFC", "GE", "AMZN", "META", "JPM"]  # 2015 top-10
BIG = list(SECTOR)                                                                    # 28 stocks

def run(universe, sector_cap=False, exit_close=False, mkt_filter=False, park=False, slots=3):
    cash, pq, pos, last, trades, curve, pend, sells = 1e5, 0.0, {}, {}, [], [], [], []
    spy = C["SPY"]
    for i in range(START, N):
        if park and pq:                                   # un-park at the open
            cash += pq * spy["open"][i] * (1 - SLIP); pq = 0.0
        for s in sells:                                   # trend exits (next-open mode)
            if s in pos:
                p = pos.pop(s); f = C[s]["open"][i] * (1 - SLIP)
                cash += p["q"] * f; trades.append(f / p["e"] - 1); last[s] = i
        eq_open = cash + sum(p["q"] * C[s]["open"][i] for s, p in pos.items())
        for s in pend:                                    # buys at the open
            if len(pos) >= slots or s in pos: continue
            if sector_cap and any(SECTOR[h] == SECTOR[s] for h in pos): continue
            f = C[s]["open"][i] * (1 + SLIP); size = min(cash, eq_open / slots)
            if size < 1: continue
            cash -= size; pos[s] = dict(q=size / f, e=f)
        pend, sells = [], []
        if park and cash > 1:                             # park leftover cash at the open
            pq = cash * (1 - SLIP) / spy["open"][i]; cash = 0.0
        for s in list(pos):                               # 15% stop (intraday)
            p = pos[s]; lvl = p["e"] * 0.85
            if C[s]["low"][i] <= lvl:
                f = min(C[s]["open"][i], lvl) * (1 - SLIP)
                pos.pop(s); cash += p["q"] * f; trades.append(f / p["e"] - 1); last[s] = i
        for s in list(pos):                               # trend exit signal at the close
            if C[s]["close"][i] < 0.97 * S50[s][i]:
                if exit_close:
                    p = pos.pop(s); f = C[s]["close"][i] * (1 - SLIP)
                    cash += p["q"] * f; trades.append(f / p["e"] - 1); last[s] = i
                else:
                    sells.append(s)
        market_ok = (not mkt_filter) or spy["close"][i] > S200["SPY"][i]
        cands = []
        if market_ok:
            cands = sorted(((C[s]["close"][i] / S200[s][i], s) for s in universe
                            if s not in pos and i - last.get(s, -99) > 5
                            and C[s]["close"][i] > S50[s][i] > S200[s][i] and R[s][i] < 70),
                           reverse=True)
        free = slots - len(pos) + len(sells)
        chosen, secs = [], {SECTOR[h] for h in pos if h not in sells}
        for _, s in cands:
            if len(chosen) >= max(free, 0): break
            if sector_cap and SECTOR[s] in secs: continue
            chosen.append(s); secs.add(SECTOR[s])
        pend = chosen
        curve.append(cash + pq * spy["close"][i] + sum(p["q"] * C[s]["close"][i] for s, p in pos.items()))
    return curve, trades

def stats(curve):
    peak, mdd = curve[0], 0.0
    for v in curve: peak = max(peak, v); mdd = min(mdd, v / peak - 1)
    yrs = len(curve) / 252
    return curve[-1] / curve[0] - 1, (curve[-1] / curve[0]) ** (1 / yrs) - 1, mdd

def period(curve, a, b):
    idx = [k for k in range(len(curve)) if a <= D[START + k][:4] <= b]
    return curve[idx[-1]] / curve[idx[0]] - 1

spy_curve = [C["SPY"]["close"][i] for i in range(START, N)]
variants = [
    ("V0  Live rules, 10 stocks",           dict(universe=SMALL)),
    ("A   28 stocks",                       dict(universe=BIG)),
    ("A+B 28 stocks, 1 per sector",         dict(universe=BIG, sector_cap=True)),
    ("A+C 28 stocks, exit at close",        dict(universe=BIG, exit_close=True)),
    ("A+D 28 stocks, SPY>200d filter",      dict(universe=BIG, mkt_filter=True)),
    ("A+P 28 stocks, park cash in SPY",     dict(universe=BIG, park=True)),
    ("ALL A+B+C+D+P",                       dict(universe=BIG, sector_cap=True, exit_close=True, mkt_filter=True, park=True)),
    ("ALL, 5 slots",                        dict(universe=BIG, sector_cap=True, exit_close=True, mkt_filter=True, park=True, slots=5)),
    ("A+B+C+P (no mkt filter)",             dict(universe=BIG, sector_cap=True, exit_close=True, park=True)),
]
print(f"Period {D[START]} -> {D[-1]} ({(N-START)/252:.1f} yrs)\n")
hdr = f"{'variant':36s} {'total':>8s} {'CAGR':>6s} {'maxDD':>7s} {'trades':>6s} {'win%':>5s} | {'16-19':>6s} {'20-22':>6s} {'23-26':>6s}"
print(hdr); print("-" * len(hdr))
t, c, m = stats(spy_curve)
print(f"{'SPY buy & hold (benchmark)':36s} {t*100:+7.0f}% {c*100:5.1f}% {m*100:6.1f}% {'':>6s} {'':>5s} | "
      f"{period(spy_curve,'2016','2019')*100:+5.0f}% {period(spy_curve,'2020','2022')*100:+5.0f}% {period(spy_curve,'2023','2026')*100:+5.0f}%")
for name, kw in variants:
    curve, tr = run(**kw)
    t, c, m = stats(curve)
    w = sum(1 for x in tr if x > 0) / max(len(tr), 1)
    print(f"{name:36s} {t*100:+7.0f}% {c*100:5.1f}% {m*100:6.1f}% {len(tr):6d} {w*100:4.0f}% | "
          f"{period(curve,'2016','2019')*100:+5.0f}% {period(curve,'2020','2022')*100:+5.0f}% {period(curve,'2023','2026')*100:+5.0f}%")
