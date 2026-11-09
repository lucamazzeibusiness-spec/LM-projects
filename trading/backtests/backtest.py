"""Backtest of the "Screen Picks Trend" strategy on daily stock bars.

Rules (same as the live tasks):
  BUY  (signal at close, fill next open): close > SMA50, SMA50 > SMA200, RSI14 < 70,
       not held, < 3 positions, not sold in last 5 trading days.
       Size = min(cash, equity/3). Rank candidates by close/SMA200.
  SELL (signal at close, fill next open): close < 0.97 * SMA50
  STOP (intraday): low <= 0.85 * entry -> fill at min(open, stop).
"""
import json, sys
from collections import defaultdict

SLIP = 0.0005  # 0.05% per fill
path = sys.argv[1]
universe = sys.argv[2].split(",")
data = json.load(open(path))["data"]["results"]

bars = {r["symbol"]: r["bars"] for r in data}
dates = [b["begins_at"][:10] for b in bars[universe[0]]]
px = {s: {b["begins_at"][:10]: b for b in bars[s]} for s in bars}

def series(s, f):
    return [float(px[s][d][f]) for d in dates]

def sma(xs, n):
    out, run = [None] * len(xs), 0.0
    for i, x in enumerate(xs):
        run += x
        if i >= n:
            run -= xs[i - n]
        if i >= n - 1:
            out[i] = run / n
    return out

def rsi(xs, n=14):
    out = [None] * len(xs)
    gains = losses = 0.0
    for i in range(1, len(xs)):
        ch = xs[i] - xs[i - 1]
        g, l = max(ch, 0), max(-ch, 0)
        if i <= n:
            gains += g; losses += l
            if i == n:
                gains /= n; losses /= n
                out[i] = 100 - 100 / (1 + gains / losses) if losses else 100
        else:
            gains = (gains * (n - 1) + g) / n
            losses = (losses * (n - 1) + l) / n
            out[i] = 100 - 100 / (1 + gains / losses) if losses else 100
    return out

ind = {}
for s in universe:
    c = series(s, "close_price")
    ind[s] = dict(close=c, open=series(s, "open_price"), low=series(s, "low_price"),
                  s50=sma(c, 50), s200=sma(c, 200), rsi=rsi(c))

start = next(i for i in range(len(dates)) if all(ind[s]["s200"][i] for s in universe))
cash, pos, last_sold = 100000.0, {}, {}
trades, equity_curve = [], []
pending_buys, pending_sells = [], []

def equity(i, use="close"):
    return cash + sum(p["qty"] * ind[s][use][i] for s, p in pos.items())

for i in range(start, len(dates)):
    # 1) execute yesterday's signals at today's open
    for s in pending_sells:
        if s in pos:
            fill = ind[s]["open"][i] * (1 - SLIP)
            p = pos.pop(s); cash += p["qty"] * fill
            trades.append((s, p["date"], dates[i], p["entry"], fill, "trend exit"))
            last_sold[s] = i
    for s in pending_buys:
        slots = 3 - len(pos)
        if slots <= 0 or s in pos:
            continue
        fill = ind[s]["open"][i] * (1 + SLIP)
        size = min(cash, equity(i, "open") / 3)
        if size < 1:
            continue
        qty = size / fill; cash -= size
        pos[s] = dict(qty=qty, entry=fill, date=dates[i])
    pending_buys, pending_sells = [], []

    # 2) intraday 15% stop
    for s in list(pos):
        stop = pos[s]["entry"] * 0.85
        if ind[s]["low"][i] <= stop:
            fill = min(ind[s]["open"][i], stop) * (1 - SLIP)
            p = pos.pop(s); cash += p["qty"] * fill
            trades.append((s, p["date"], dates[i], p["entry"], fill, "15% stop"))
            last_sold[s] = i

    # 3) end-of-day signals
    for s in pos:
        if ind[s]["close"][i] < 0.97 * ind[s]["s50"][i]:
            pending_sells.append(s)
    cands = []
    for s in universe:
        if s in pos or i - last_sold.get(s, -99) <= 5:
            continue
        d = ind[s]
        if d["close"][i] > d["s50"][i] and d["s50"][i] > d["s200"][i] and d["rsi"][i] < 70:
            cands.append((d["close"][i] / d["s200"][i], s))
    free = 3 - len(pos) + len(pending_sells)
    pending_buys = [s for _, s in sorted(cands, reverse=True)[:max(free, 0)]]

    equity_curve.append((dates[i], equity(i)))

# close open positions at the end for stats (mark-to-market)
last = len(dates) - 1
for s, p in pos.items():
    trades.append((s, p["date"], dates[last] + " (open)", p["entry"], ind[s]["close"][last], "still held"))

def stats(curve):
    vals = [v for _, v in curve]
    peak, mdd = vals[0], 0.0
    for v in vals:
        peak = max(peak, v); mdd = min(mdd, v / peak - 1)
    yrs = len(vals) / 252
    tot = vals[-1] / vals[0] - 1
    return tot, (1 + tot) ** (1 / yrs) - 1, mdd

def bh_curve(syms):
    per = 100000 / len(syms)
    q = {s: per / ind_or_close(s)[start] for s in syms}
    return [(dates[i], sum(q[s] * ind_or_close(s)[i] for s in syms)) for i in range(start, len(dates))]

closes_all = {s: series(s, "close_price") for s in bars}
def ind_or_close(s):
    return closes_all[s]

print(f"Period: {dates[start]} -> {dates[-1]}  ({(len(dates)-start)/252:.1f} yrs)")
print(f"Universe: {','.join(universe)}")
for name, curve in [("STRATEGY", equity_curve),
                    ("Buy&hold same stocks (equal wt)", bh_curve(universe)),
                    ("SPY buy&hold", bh_curve(["SPY"])),
                    ("URTH buy&hold", bh_curve(["URTH"]))]:
    t, c, m = stats(curve)
    print(f"{name:34s} total {t*100:7.1f}%  CAGR {c*100:6.1f}%  maxDD {m*100:6.1f}%")

closed = [t for t in trades if t[5] != "still held"]
rets = [(t[4] / t[3] - 1) for t in closed]
wins = [r for r in rets if r > 0]; losses = [r for r in rets if r <= 0]
print(f"\nClosed trades: {len(closed)}  wins {len(wins)}  losses {len(losses)}  "
      f"win rate {len(wins)/max(len(closed),1)*100:.0f}%")
if wins: print(f"avg win {sum(wins)/len(wins)*100:.1f}%  best {max(rets)*100:.1f}%")
if losses: print(f"avg loss {sum(losses)/len(losses)*100:.1f}%  worst {min(rets)*100:.1f}%")
print(f"avg trade {sum(rets)/max(len(rets),1)*100:.2f}%")
stops = sum(1 for t in closed if t[5] == "15% stop")
print(f"exits: trend {len(closed)-stops}, 15% stop {stops}")
per_sym = defaultdict(list)
for t in closed: per_sym[t[0]].append(t[4] / t[3] - 1)
print("\nPer stock (closed trades): " + ", ".join(
    f"{s} {len(v)}x {sum(v)/len(v)*100:+.1f}%" for s, v in sorted(per_sym.items())))
held_days = sum(1 for _ in equity_curve)
print("\nYear by year (strategy vs SPY):")
spy = dict(bh_curve(["SPY"])); strat = dict(equity_curve)
years = sorted({d[:4] for d, _ in equity_curve})
for y in years:
    ds = [d for d, _ in equity_curve if d[:4] == y]
    print(f"  {y}: strategy {(strat[ds[-1]]/strat[ds[0]]-1)*100:+6.1f}%   SPY {(spy[ds[-1]]/spy[ds[0]]-1)*100:+6.1f}%")
print("\nStill held at end:", [t[0] for t in trades if t[5] == "still held"])
