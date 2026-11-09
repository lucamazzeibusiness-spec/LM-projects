import sys, io, contextlib, runpy, random
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("present.py")
run, stats, POOL, spy, pools, yrs, per = (g[k] for k in ("run","stats","POOL","spy","pools","yrs","per"))
sc = stats(spy)[1]
base = [stats(run(p))[1] for p in pools]
print(f"{'skip last N days (12-mo lookback)':36s} {'CAGR':>6s} {'maxDD':>7s} {'yrs>SPY':>7s} {'16-19':>6s} {'20-22':>6s} {'23-26':>6s} | pools median, beats SPY, beats 12-1")
for skip in (0, 5, 10, 15, 21):
    cv = run(POOL, skip=skip); t, c, m = stats(cv); res = [stats(run(p, skip=skip))[1] for p in pools]
    print(f"{'skip '+str(skip):36s} {c*100:5.1f}% {m*100:6.1f}% {yrs(cv):4d}/11 {per(cv,'2016','2019')*100:+5.0f}% {per(cv,'2020','2022')*100:+5.0f}% {per(cv,'2023','2026')*100:+5.0f}% | "
          f"{sorted(res)[20]*100:5.1f}% {sum(r>sc for r in res):3d}/40 {sum(r>b for r,b in zip(res,base)):3d}/40")
cv = run(POOL, skip=0, top=5); print(f"{'skip 0, top 5':36s} {stats(cv)[1]*100:5.1f}% {stats(cv)[2]*100:6.1f}% {yrs(cv):4d}/11")
cv = run(POOL, skip=0, biweekly=True); print(f"{'skip 0, twice a month':36s} {stats(cv)[1]*100:5.1f}% {stats(cv)[2]*100:6.1f}% {yrs(cv):4d}/11")
