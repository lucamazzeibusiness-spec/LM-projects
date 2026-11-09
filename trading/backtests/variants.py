"""Variant tests for the Screen Picks Trend strategy across several stock groups.

All variants: long only, signal at close -> fill next open, 0.05% slippage per fill,
equal-size slots (equity / slots), no adding to positions, 5-day re-entry cooldown.
"""
import json, sys

SLIP = 0.0005
data = json.load(open(sys.argv[1]))["data"]["results"]
bars = {r["symbol"]: r["bars"] for r in data}
dates = [b["begins_at"][:10] for b in bars["SPY"]]
col = {s: {f: [float(b[f]) for b in bars[s]] for f in ("open_price", "high_price", "low_price", "close_price")}
       for s in bars}

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
            g = (g * (n - 1) + up) / n; l = (l * (n - 1) + dn) / n
            out[i] = 100 - 100 / (1 + g / l) if l else 100
    return out

cache = {}
def ind(s, n):
    key = (s, n)
    if key not in cache:
        cache[key] = sma(col[s]["close_price"], n)
    return cache[key]
rsis = {s: rsi(col[s]["close_price"]) for s in bars}

START = 200  # same start for every variant (first day all 200-day averages exist)

def run(universe, fast=50, slow=200, entry="breakout", exit="trend", trail=0.15, stop=0.15, slots=3):
    cash, pos, last_sold, trades, curve = 100000.0, {}, {}, [], []
    pend_buy, pend_sell = [], []
    def eq(i, f="close_price"):
        return cash + sum(p["q"] * col[s][f][i] for s, p in pos.items())
    for i in range(START, len(dates)):
        for s in pend_sell:
            if s in pos:
                p = pos.pop(s); fill = col[s]["open_price"][i] * (1 - SLIP)
                cash += p["q"] * fill; trades.append(fill / p["e"] - 1); last_sold[s] = i
        for s in pend_buy:
            if len(pos) >= slots or s in pos: continue
            fill = col[s]["open_price"][i] * (1 + SLIP)
            size = min(cash, eq(i, "open_price") / slots)
            if size < 1: continue
            cash -= size; pos[s] = dict(q=size / fill, e=fill, hi=fill)
        pend_buy, pend_sell = [], []
        # intraday stops
        for s in list(pos):
            p = pos[s]
            lvl = p["e"] * (1 - stop)
            if exit == "trail":
                lvl = max(lvl, p["hi"] * (1 - trail))
            if col[s]["low_price"][i] <= lvl:
                fill = min(col[s]["open_price"][i], lvl) * (1 - SLIP)
                pos.pop(s); cash += p["q"] * fill; trades.append(fill / p["e"] - 1); last_sold[s] = i
            else:
                p["hi"] = max(p["hi"], col[s]["close_price"][i])
        # signals at close
        for s in pos:
            c, f, sl = col[s]["close_price"][i], ind(s, fast)[i], ind(s, slow)[i]
            if exit == "trend" and c < 0.97 * f: pend_sell.append(s)
            if exit == "slow" and c < sl: pend_sell.append(s)
        cands = []
        for s in universe:
            if s in pos or i - last_sold.get(s, -99) <= 5: continue
            c, f, sl, r = col[s]["close_price"][i], ind(s, fast)[i], ind(s, slow)[i], rsis[s][i]
            if f is None or sl is None or r is None: continue
            if entry == "breakout":
                ok = c > f and f > sl and r < 70
            else:  # pullback: uptrend, price pulled back near the fast average, not overbought
                ok = f > sl and c > sl and 0.97 * f <= c <= 1.02 * f and r < 55
            if ok: cands.append((c / sl, s))
        free = slots - len(pos) + len(pend_sell)
        pend_buy = [s for _, s in sorted(cands, reverse=True)[:max(free, 0)]]
        curve.append(eq(i))
    peak, mdd = curve[0], 0.0
    for v in curve:
        peak = max(peak, v); mdd = min(mdd, v / peak - 1)
    tot = curve[-1] / curve[0] - 1
    wins = sum(1 for t in trades if t > 0)
    return tot, mdd, len(trades), (wins / len(trades) if trades else 0)

def buy_hold(universe):
    per = 100000 / len(universe)
    q = {s: per / col[s]["close_price"][START] for s in universe}
    curve = [sum(q[s] * col[s]["close_price"][i] for s in universe) for i in range(START, len(dates))]
    peak, mdd = curve[0], 0.0
    for v in curve:
        peak = max(peak, v); mdd = min(mdd, v / peak - 1)
    return curve[-1] / curve[0] - 1, mdd

groups = {
    "A  2023 top-10": "AAPL,AMZN,GOOGL,META,TSLA,JPM,JNJ,XOM,UNH,V".split(","),
    "B  2023 next-10": "LLY,WMT,MA,PG,HD,CVX,MRK,ABBV,KO,PEP".split(","),
    "C  Up&Coming*": "MGNI,BOBS,ITRI,GWRE,BZ,EAT,WT,BPOP,FRPT,SHC,TRU,HQY".split(","),
    "D  ScreenPicks*": "NVDA,MSFT,TSM,MU,APH,KEYS,HOOD,DXCM".split(","),
}
variants = [
    ("V0 Baseline 50/200, exit 3% < 50d", {}),
    ("V1 Pullback entry (near 50d)", dict(entry="pullback")),
    ("V2 Faster MAs 20/100", dict(fast=20, slow=100)),
    ("V3 MAs 50/150", dict(fast=50, slow=150)),
    ("V4 Exit: 15% trailing stop", dict(exit="trail", trail=0.15)),
    ("V5 Exit: 10% trailing stop", dict(exit="trail", trail=0.10)),
    ("V6 Exit: close < 200d (slow)", dict(exit="slow")),
    ("V7 5 slots instead of 3", dict(slots=5)),
]

print(f"Period {dates[START]} -> {dates[-1]} ({(len(dates)-START)/252:.1f} yrs). SPY/URTH:",
      ", ".join(f"{s} {buy_hold([s])[0]*100:+.0f}% (DD {buy_hold([s])[1]*100:.0f}%)" for s in ("SPY", "URTH")))
for gname, uni in groups.items():
    bh, bdd = buy_hold(uni)
    print(f"\n=== {gname}  | buy&hold {bh*100:+.1f}%  maxDD {bdd*100:.1f}%")
    print(f"{'variant':38s} {'return':>8s} {'maxDD':>7s} {'trades':>6s} {'win%':>5s}")
    for vname, kw in variants:
        t, m, n, w = run(uni, **kw)
        print(f"{vname:38s} {t*100:+7.1f}% {m*100:6.1f}% {n:6d} {w*100:4.0f}%")
