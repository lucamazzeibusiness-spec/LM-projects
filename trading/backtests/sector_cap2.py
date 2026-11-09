import sys, io, contextlib, runpy, random
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("sector_cap.py")
mom, stats, POOL, spy = g["mom"], g["stats"], g["POOL"], g["spy"]
sc = stats(spy)[1]
random.seed(11)
pools = [random.sample(POOL, 45) for _ in range(40)]
base = [stats(mom(p, 5))[1:] for p in pools]
for cap in (None, 1):
    res = base if cap is None else [stats(mom(p, 5, cap))[1:] for p in pools]
    cs = sorted(r[0] for r in res)
    extra = "" if cap is None else f", better CAGR than no-cap {sum(r[0]>b[0] for r,b in zip(res,base))}/40, smaller maxDD {sum(r[1]>b[1] for r,b in zip(res,base))}/40"
    print(f"top 5 {'no cap' if cap is None else 'max 1/sector'}: median CAGR {cs[20]*100:.1f}% (worst {cs[0]*100:.1f}%, best {cs[-1]*100:.1f}%), avg maxDD {sum(r[1] for r in res)/40*100:.1f}%, beats SPY {sum(c>sc for c in cs)}/40{extra}")
