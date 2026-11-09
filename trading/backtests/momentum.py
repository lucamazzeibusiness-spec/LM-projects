"""Monthly momentum rotation vs SPY, same data/universe.
Each month-end: rank stocks by 12-month return skipping the last month (12-1 momentum),
hold the top N equally weighted from next open. Optional: only stocks above SMA200.
Optional: if SPY < SMA200 at month-end, hold SPY... (variant) . 0.05% slippage per trade."""
import random, sys, runpy, io, contextlib
sys.argv = ["x", "long.json"]
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("improve_test.py")
C, D, N, START, S200, BIG, stats = g["C"], g["D"], g["N"], g["START"], g["S200"], g["BIG"], g["stats"]
SLIP = 0.0005
month_ends = [i for i in range(START, N - 1) if D[i][5:7] != D[i + 1][5:7]]

def mom(universe, top=3, trend=False):
    val, hold, curve = 1e5, {}, []
    me = set(month_ends)
    for i in range(START, N):
        if i - 1 in me:                                   # rebalance at this open
            j = i - 1
            sc = [(C[s]["close"][j - 21] / C[s]["close"][j - 252] - 1, s) for s in universe
                  if j >= 252 and (not trend or C[s]["close"][j] > S200[s][j])]
            pick = [s for _, s in sorted(sc, reverse=True)[:top]]
            v = sum(q * C[s]["open"][i] for s, q in hold.items()) if hold else val
            turnover = set(hold) ^ set(pick)
            v *= 1 - SLIP * len(turnover) / max(top, 1)
            hold = {s: v / len(pick) / C[s]["open"][i] for s in pick} if pick else {}
            if not pick: val = v
        curve.append(sum(q * C[s]["close"][i] for s, q in hold.items()) if hold else val)
    return curve

spy = [C["SPY"]["close"][i] for i in range(START, N)]
def per(curve, a, b):
    idx = [k for k in range(len(curve)) if a <= D[START + k][:4] <= b]
    return curve[idx[-1]] / curve[idx[0]] - 1
def row(name, cv):
    t, c, m = stats(cv)
    print(f"{name:34s} {t*100:+7.0f}% {c*100:5.1f}% {m*100:6.1f}% | {per(cv,'2016','2019')*100:+5.0f}% {per(cv,'2020','2022')*100:+5.0f}% {per(cv,'2023','2026')*100:+5.0f}%")
print(f"{'strategy (28 stocks)':34s} {'total':>8s} {'CAGR':>6s} {'maxDD':>7s} | {'16-19':>6s} {'20-22':>6s} {'23-26':>6s}")
row("SPY buy & hold", spy)
for top in (3, 5):
    row(f"Momentum top {top}", mom(BIG, top))
    row(f"Momentum top {top} + above 200d", mom(BIG, top, trend=True))
random.seed(7)
groups = [random.sample(BIG, 10) for _ in range(40)]
spy_c = stats(spy)[1]
print("\nSame 40 random 10-stock groups as before:")
for top, tr in ((3, False), (3, True)):
    res = [stats(mom(u, top, tr)) for u in groups]
    print(f"  Momentum top {top}{' +200d' if tr else ''}: avg CAGR {sum(r[1] for r in res)/40*100:.1f}%, "
          f"avg maxDD {sum(r[2] for r in res)/40*100:.1f}%, beats SPY in {sum(r[1]>spy_c for r in res)}/40")
