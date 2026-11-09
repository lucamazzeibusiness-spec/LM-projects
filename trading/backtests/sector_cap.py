"""Does a sector cap help momentum top-N? Same 89-stock pool, 2016-2026, paired random-pool test."""
import sys, io, contextlib, runpy, random
sys.argv = ["x", "big.json"]
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("big_momentum.py")
C, D, N, START, POOL, stats, per, month_ends, SLIP = (g[k] for k in
    ("C", "D", "N", "START", "POOL", "stats", "per", "month_ends", "SLIP"))
SEC = {}
for sec, names in {
    "tech": "AAPL MSFT ORCL INTC CSCO ACN IBM HPQ QCOM TXN", "comm": "GOOGL META DIS CMCSA VZ T",
    "discr": "AMZN HD LOW MCD NKE SBUX TGT EBAY F GM", "staples": "PG WMT KO PEP COST CL MDLZ MO PM",
    "health": "JNJ PFE MRK UNH ABBV ABT AMGN BAX BIIB BMY CVS GILD LLY MDT",
    "fin": "JPM WFC BAC V MA AIG ALL AXP C COF GS MET MS USB", "energy": "XOM CVX APA COP DVN HAL KMI OXY SLB",
    "indu": "GE BA CAT EMR FDX GD HON LMT MMM NSC RTX UNP UPS", "other": "FCX EXC SO SPG"}.items():
    for s in names.split(): SEC[s] = sec if sec != "other" else s
assert set(POOL) <= set(SEC), set(POOL) - set(SEC)

def mom(universe, top=3, cap=None):
    me, hold, curve = month_ends(0), {}, []
    for i in range(START, N):
        if i - 1 in me:
            j = i - 1
            v = sum(q * C[s]["open"][i] for s, q in hold.items()) if hold else 1e5
            ranked = sorted(((C[s]["close"][j-21] / C[s]["close"][j-252] - 1, s) for s in universe), reverse=True)
            pick, cnt = [], {}
            for _, s in ranked:
                if cap and cnt.get(SEC[s], 0) >= cap: continue
                pick.append(s); cnt[SEC[s]] = cnt.get(SEC[s], 0) + 1
                if len(pick) == top: break
            v *= 1 - SLIP * len(set(hold) ^ set(pick)) / top
            hold = {s: v / top / C[s]["open"][i] for s in pick}
        curve.append(sum(q * C[s]["close"][i] for s, q in hold.items()) if hold else 1e5)
    return curve

spy = [C["SPY"]["close"][i] for i in range(START, N)]
sc = stats(spy)[1]
def yrs_beat(cv):
    ys = sorted({d[:4] for d in D[START:]} - {"2015"})
    return sum(per(cv, y, y) > per(spy, y, y) for y in ys), len(ys)
print(f"{'variant (89 stocks)':30s} {'CAGR':>6s} {'maxDD':>7s} {'yrs>SPY':>8s} | 16-19  20-22  23-26")
print(f"{'SPY':30s} {sc*100:5.1f}% {stats(spy)[2]*100:6.1f}%          | {per(spy,'2016','2019')*100:+4.0f}% {per(spy,'2020','2022')*100:+5.0f}% {per(spy,'2023','2026')*100:+5.0f}%")
for top, cap in ((3, None), (3, 1), (3, 2), (5, None), (5, 1), (5, 2)):
    cv = mom(POOL, top, cap); t, c, m = stats(cv); w, n = yrs_beat(cv)
    print(f"{'top '+str(top)+(', max '+str(cap)+'/sector' if cap else ', no cap'):30s} {c*100:5.1f}% {m*100:6.1f}% {w:4d}/{n:<3d} | "
          f"{per(cv,'2016','2019')*100:+4.0f}% {per(cv,'2020','2022')*100:+5.0f}% {per(cv,'2023','2026')*100:+5.0f}%")
random.seed(11)
pools = [random.sample(POOL, 45) for _ in range(40)]
base = [stats(mom(p, 3))[1:] for p in pools]
print("\nRandom 45-stock halves (same 40 pools), top 3:")
for cap in (None, 1, 2):
    res = base if cap is None else [stats(mom(p, 3, cap))[1:] for p in pools]
    cs = sorted(r[0] for r in res)
    better = "" if cap is None else f", better than no-cap in {sum(r[0] > b[0] for r, b in zip(res, base))}/40, smaller maxDD in {sum(r[1] > b[1] for r, b in zip(res, base))}/40"
    print(f"  {'no cap' if cap is None else 'max '+str(cap)+'/sector':14s} median CAGR {cs[20]*100:.1f}% (worst {cs[0]*100:.1f}%), "
          f"avg maxDD {sum(r[1] for r in res)/40*100:.1f}%, beats SPY {sum(c > sc for c in cs)}/40{better}")
