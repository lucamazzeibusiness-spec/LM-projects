"""Ways to make momentum top 3 react to the present. Same 89-stock pool, 2016-2026."""
import sys, io, contextlib, runpy, random, math
sys.argv = ["x", "big.json"]
with contextlib.redirect_stdout(io.StringIO()):
    g = runpy.run_path("big_momentum.py")
C, D, N, START, POOL, stats, per, SLIP, sma = (g[k] for k in ("C","D","N","START","POOL","stats","per","SLIP","sma"))
S50 = {s: sma(C[s]["close"], 50) for s in C}; S200 = g["S200"]
ends = [i for i in range(START, N - 1) if D[i][5:7] != D[i + 1][5:7]]
mids = [i for i in range(START, N - 1) if D[i][8:10] >= "15" and D[i - 1][8:10] < "15"]
VOL = {}
def vol(s, j):
    k = (s, j)
    if k not in VOL:
        c = C[s]["close"]; r = [math.log(c[t] / c[t-1]) for t in range(j-251, j+1)]
        m = sum(r) / len(r); VOL[k] = math.sqrt(sum((x-m)**2 for x in r) / len(r))
    return VOL[k]

def run(universe, top=3, skip=21, filt=None, stop=None, exit50=False, voladj=False, biweekly=False, recent=None):
    reb = set(ends) | (set(mids) if biweekly else set())
    cash, hold, entry, curve = 1e5, {}, {}, []
    for i in range(START, N):
        if i - 1 in reb:
            j = i - 1
            cash += sum(q * C[s]["open"][i] for s, q in hold.items())
            def score(s):
                m = C[s]["close"][j - skip] / C[s]["close"][j - 252] - 1
                return m / vol(s, j) if voladj else m
            ranked = sorted(((score(s), s) for s in universe), reverse=True)
            pick = []
            for _, s in ranked:
                c = C[s]["close"][j]
                if filt == "50" and c < S50[s][j]: continue
                if filt == "200" and c < S200[s][j]: continue
                if recent is not None and c / C[s]["close"][j - 21] - 1 < recent: continue
                pick.append(s)
                if len(pick) == top: break
            old = set(hold); n_chg = len(old ^ set(pick))
            cash *= 1 - SLIP * n_chg / top
            hold = {s: cash / top / C[s]["open"][i] for s in pick}
            entry = {s: C[s]["open"][i] for s in pick}
            cash -= sum(q * C[s]["open"][i] for s, q in hold.items())
        for s in list(hold):                         # between rebalances
            if stop and C[s]["low"][i] <= entry[s] * (1 - stop):
                cash += hold.pop(s) * min(C[s]["open"][i], entry[s] * (1 - stop)) * (1 - SLIP)
            elif exit50 and C[s]["close"][i] < S50[s][i]:
                cash += hold.pop(s) * C[s]["close"][i] * (1 - SLIP)
        curve.append(cash + sum(q * C[s]["close"][i] for s, q in hold.items()))
    return curve

spy = [C["SPY"]["close"][i] for i in range(START, N)]; sc = stats(spy)[1]
def yrs(cv):
    ys = sorted({d[:4] for d in D[START:]} - {"2015"})
    return sum(per(cv, y, y) > per(spy, y, y) for y in ys)
V = [("Base: 12-1, monthly (current)", {}),
     ("1 Use latest month too (12-0)", dict(skip=0)),
     ("2 Only buy if above 50-day avg", dict(filt="50")),
     ("3 Only buy if above 200-day avg", dict(filt="200")),
     ("4 Skip if last month < -10%", dict(recent=-0.10)),
     ("5 Stop-loss 15% from entry", dict(stop=0.15)),
     ("6 Sell if closes below 50-day avg", dict(exit50=True)),
     ("7 Rebalance twice a month", dict(biweekly=True)),
     ("8 Rank by gain / volatility", dict(voladj=True))]
random.seed(11); pools = [random.sample(POOL, 45) for _ in range(40)]
base = None
print(f"{'variant (top 3, 89 stocks)':36s} {'CAGR':>6s} {'maxDD':>7s} {'yrs>SPY':>7s} | random 45-stock pools: {'median':>6s} {'beats SPY':>9s} {'beats base':>10s}")
print(f"{'SPY':36s} {sc*100:5.1f}% {stats(spy)[2]*100:6.1f}%")
for name, kw in V:
    cv = run(POOL, **kw); t, c, m = stats(cv)
    res = [stats(run(p, **kw))[1] for p in pools]
    if base is None: base = res
    med = sorted(res)[20]
    bb = "-" if res is base else f"{sum(r > b for r, b in zip(res, base))}/40"
    print(f"{name:36s} {c*100:5.1f}% {m*100:6.1f}% {yrs(cv):4d}/11 | {'':23s}{med*100:5.1f}% {sum(r > sc for r in res):6d}/40 {bb:>10s}")
