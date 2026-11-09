"""Robustness: apply each change to 40 random 10-stock groups (from the 28), paired comparison vs baseline."""
import random, sys, runpy
sys.argv = ["x", "long.json"]
import io, contextlib
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("improve_test.py")
run, stats, BIG, spy_curve = g["run"], g["stats"], g["BIG"], g["spy_curve"]
spy_cagr = stats(spy_curve)[1]
random.seed(7)
groups = [random.sample(BIG, 10) for _ in range(40)]
tests = {
    "baseline (live rules)": {},
    "+B 1 per sector": dict(sector_cap=True),
    "+C exit at close": dict(exit_close=True),
    "+D SPY>200d filter": dict(mkt_filter=True),
    "+P park cash in SPY": dict(park=True),
    "+B+C": dict(sector_cap=True, exit_close=True),
    "+B+C+P": dict(sector_cap=True, exit_close=True, park=True),
}
base = [stats(run(universe=u)[0]) for u in groups]
print(f"40 random 10-stock groups, 2015-2026. SPY CAGR {spy_cagr*100:.1f}%\n")
print(f"{'change':24s} {'avg CAGR':>9s} {'avg maxDD':>9s} {'beats SPY':>9s} {'better than base (CAGR)':>24s}")
for name, kw in tests.items():
    res = base if not kw else [stats(run(universe=u, **kw)[0]) for u in groups]
    ac = sum(r[1] for r in res) / 40; am = sum(r[2] for r in res) / 40
    beat = sum(1 for r in res if r[1] > spy_cagr)
    better = sum(1 for r, b in zip(res, base) if r[1] > b[1] + 1e-9)
    print(f"{name:24s} {ac*100:8.1f}% {am*100:8.1f}% {beat:6d}/40 {('-' if not kw else f'{better}/40'):>24s}")
