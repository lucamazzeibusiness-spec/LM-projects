"""Momentum rotation on the bigger pool (~89 large US stocks by 2015 size), 2015-2026.

Rule: every month-end rank stocks by return over `look` months skipping the last month,
buy the top N equally weighted at the next open. 0.05% slippage per trade.
Options: trend = only stocks above their SMA200; regime = if SPY < SMA200 at month-end hold SPY instead.
Robustness: different lookbacks, top-N, rebalance day offsets, random 45-stock halves of the pool.
Also: the current trend strategy on the same big pool, for comparison.
"""
import json, sys, random

SLIP = 0.0005
B = json.load(open(sys.argv[1]))
EXCLUDE = {"SPY", "NVDA", "BRK.B"}      # NVDA was not a 2015 large cap; BRK.B data incomplete
POOL = sorted(s for s in B if s not in EXCLUDE and len(B[s]) == len(B["SPY"]))
N = len(B["SPY"])
D = [b["begins_at"][:10] for b in B["SPY"]]
C = {s: {k: [float(b[k + "_price"]) for b in B[s]] for k in ("open", "low", "close")} for s in B if len(B[s]) == N}

def sma(xs, n):
    out, run = [None] * len(xs), 0.0
    for i, x in enumerate(xs):
        run += x
        if i >= n: run -= xs[i - n]
        if i >= n - 1: out[i] = run / n
    return out

S200 = {s: sma(C[s]["close"], 200) for s in C}
START = 260                                 # first date with 12 months of history

def month_ends(offset=0):
    ends = [i for i in range(START, N - 1) if D[i][5:7] != D[i + 1][5:7]]
    return {max(START, e - offset) for e in ends}

def momentum(universe, top=5, look=12, trend=False, regime=False, offset=0):
    me, val, hold, curve, n_trades = month_ends(offset), 1e5, {}, [], 0
    L = look * 21
    for i in range(START, N):
        if i - 1 in me:
            j = i - 1
            v = sum(q * C[s]["open"][i] for s, q in hold.items()) if hold else val
            if regime and C["SPY"]["close"][j] < S200["SPY"][j]:
                pick = ["SPY"]
            else:
                sc = [(C[s]["close"][j - 21] / C[s]["close"][j - L] - 1, s) for s in universe
                      if not trend or C[s]["close"][j] > S200[s][j]]
                pick = [s for _, s in sorted(sc, reverse=True)[:top]] or ["SPY"]
            changed = len(set(hold) ^ set(pick)); n_trades += changed
            v *= 1 - SLIP * changed / max(len(pick), 1)
            hold = {s: v / len(pick) / C[s]["open"][i] for s in pick}
        curve.append(sum(q * C[s]["close"][i] for s, q in hold.items()) if hold else val)
    return curve, n_trades

def stats(curve):
    peak, mdd = curve[0], 0.0
    for v in curve: peak = max(peak, v); mdd = min(mdd, v / peak - 1)
    yrs = len(curve) / 252
    return curve[-1] / curve[0] - 1, (curve[-1] / curve[0]) ** (1 / yrs) - 1, mdd

def per(curve, a, b):
    idx = [k for k in range(len(curve)) if a <= D[START + k][:4] <= b]
    return curve[idx[-1]] / curve[idx[0]] - 1

def worst_year_vs_spy(curve, spy):
    out = []
    for y in sorted({d[:4] for d in D[START:]}):
        if y in ("2015",): continue
        out.append((per(curve, y, y) - per(spy, y, y), y))
    return min(out), sum(1 for d, _ in out if d > 0), len(out)

spy = [C["SPY"]["close"][i] for i in range(START, N)]
print(f"Pool: {len(POOL)} stocks. Period {D[START]} -> {D[-1]} ({(N-START)/252:.1f} yrs)\n")
H = f"{'strategy':40s} {'total':>7s} {'CAGR':>6s} {'maxDD':>7s} {'yrs>SPY':>7s} {'worst yr vs SPY':>16s} | {'16-19':>5s} {'20-22':>5s} {'23-26':>5s}"
print(H); print("-" * len(H))
def row(name, cv):
    t, c, m = stats(cv); (wd, wy), wins, n = worst_year_vs_spy(cv, spy)
    print(f"{name:40s} {t*100:+6.0f}% {c*100:5.1f}% {m*100:6.1f}% {wins:3d}/{n:<3d} {wd*100:+8.0f}% ({wy}) | "
          f"{per(cv,'2016','2019')*100:+4.0f}% {per(cv,'2020','2022')*100:+4.0f}% {per(cv,'2023','2026')*100:+4.0f}%")
row("SPY buy & hold", spy)
for top in (3, 5, 10):
    row(f"Momentum 12-1, top {top}", momentum(POOL, top)[0])
row("Momentum 12-1, top 5, only above 200d", momentum(POOL, 5, trend=True)[0])
row("Momentum 12-1, top 5, SPY<200d -> hold SPY", momentum(POOL, 5, regime=True)[0])
row("Momentum 6-1, top 5", momentum(POOL, 5, look=6)[0])
row("Momentum 9-1, top 5", momentum(POOL, 5, look=9)[0])
row("Momentum 3-1, top 5", momentum(POOL, 5, look=3)[0])

spy_c = stats(spy)[1]
print("\nRebalance-day sensitivity (top 5, 12-1): CAGR by days before month-end:",
      ", ".join(f"{o}d {stats(momentum(POOL, 5, offset=o)[0])[1]*100:.1f}%" for o in (0, 5, 10, 15)))
random.seed(11)
for top in (3, 5):
    res = [stats(momentum(random.sample(POOL, 45), top)[0]) for _ in range(40)]
    cs = sorted(r[1] for r in res)
    print(f"Random 45-stock halves, top {top}: median CAGR {cs[20]*100:.1f}% (worst {cs[0]*100:.1f}%, best {cs[-1]*100:.1f}%), "
          f"avg maxDD {sum(r[2] for r in res)/40*100:.1f}%, beats SPY in {sum(c > spy_c for c in cs)}/40")
c5, n5 = momentum(POOL, 5)
print(f"\nTrades (top 5): {n5} position changes in {(N-START)/252:.1f} yrs = ~{n5/((N-START)/252):.0f}/yr")
