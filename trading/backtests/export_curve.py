# Exports the month-end growth-of-$1000 curve (live rules vs SPY) used by the Pocket Terminal chart.
# Usage: copy present.py + big_momentum.py next to big.json, then: python3 export_curve.py big.json
import sys, io, contextlib, runpy, json
sys.argv = ["present.py", sys.argv[1]]
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("present.py")
run, stats, POOL, spy, D = g["run"], g["stats"], g["POOL"], g["spy"], g.get("D")
cv = run(POOL, skip=0)
print(type(cv), len(cv) if hasattr(cv,'__len__') else '', type(spy), len(spy) if hasattr(spy,'__len__') else '')
print(repr(cv)[:200]); print(repr(spy)[:200]); print(stats(cv), stats(spy)); print(D[:2] if D else None, len(D) if D else None)
START = len(D) - len(cv)
pts = []
for i in range(len(cv)):
    d = D[START + i]
    nxt = D[START + i + 1] if START + i + 1 < len(D) else None
    if nxt is None or nxt[:7] != d[:7]:   # month-end
        pts.append([d[:7], round(cv[i] / cv[0] * 1000), round(spy[i] / spy[0] * 1000)])
json.dump({"from": D[START][:10], "to": D[-1][:10], "points": pts}, open("curve.json", "w"))
print(len(pts), pts[0], pts[-1])
