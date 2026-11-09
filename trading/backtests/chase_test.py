"""Test the anti-chase thresholds.

TEST 1 – trend strategy (current live rules, close-based signals) with an anti-chase filter:
         skip the buy if the next day's OPEN is more than X% above the signal-day CLOSE.
TEST 2 – news-gap proxy: in an uptrend (SMA50 > SMA200, RSI < 70), when a stock gaps up
         at least 2% at the open (usually news-driven), buy at the open IF the gap is <= X%.
         Exits: 5-day grace, then close < 0.97*SMA50; 15% stop always. One position per stock.
Stock groups A and B are the "fair" groups (chosen by 2023 size, not hindsight).
"""
import json, sys
SLIP = 0.0005
data = json.load(open(sys.argv[1]))["data"]["results"]
B = {r["symbol"]: r["bars"] for r in data}
N = len(B["SPY"])
C = {s: {k: [float(b[k + "_price"]) for b in B[s]] for k in ("open", "low", "close")} for s in B}

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
            g = (g * 13 + up) / 14; l = (l * 13 + dn) / 14
            out[i] = 100 - 100 / (1 + g / l) if l else 100
    return out

S50 = {s: sma(C[s]["close"], 50) for s in B}
S200 = {s: sma(C[s]["close"], 200) for s in B}
R = {s: rsi(C[s]["close"]) for s in B}
START = 200

def trend(universe, chase=None, slots=3):
    """Live rules: signal on close, buy next open; optional anti-chase on the opening gap."""
    cash, pos, last, trades, curve, pend, sells = 1e5, {}, {}, [], [], [], []
    for i in range(START, N):
        for s in sells:
            if s in pos:
                p = pos.pop(s); f = C[s]["open"][i] * (1 - SLIP)
                cash += p["q"] * f; trades.append(f / p["e"] - 1); last[s] = i
        eq_open = cash + sum(p["q"] * C[s]["open"][i] for s, p in pos.items())
        for s in pend:
            if len(pos) >= slots or s in pos: continue
            gap = C[s]["open"][i] / C[s]["close"][i - 1] - 1
            if chase is not None and gap > chase: continue          # ANTI-CHASE
            f = C[s]["open"][i] * (1 + SLIP); size = min(cash, eq_open / slots)
            if size < 1: continue
            cash -= size; pos[s] = dict(q=size / f, e=f)
        pend, sells = [], []
        for s in list(pos):                                          # 15% stop
            p = pos[s]; lvl = p["e"] * 0.85
            if C[s]["low"][i] <= lvl:
                f = min(C[s]["open"][i], lvl) * (1 - SLIP)
                pos.pop(s); cash += p["q"] * f; trades.append(f / p["e"] - 1); last[s] = i
        for s in pos:
            if C[s]["close"][i] < 0.97 * S50[s][i]: sells.append(s)
        cands = [(C[s]["close"][i] / S200[s][i], s) for s in universe
                 if s not in pos and i - last.get(s, -99) > 5
                 and C[s]["close"][i] > S50[s][i] > S200[s][i] and R[s][i] < 70]
        free = slots - len(pos) + len(sells)
        pend = [s for _, s in sorted(cands, reverse=True)[:max(free, 0)]]
        curve.append(cash + sum(p["q"] * C[s]["close"][i] for s, p in pos.items()))
    peak, mdd = curve[0], 0
    for v in curve: peak = max(peak, v); mdd = min(mdd, v / peak - 1)
    return curve[-1] / curve[0] - 1, mdd, trades

def gap_proxy(universe, max_gap, min_gap=0.02):
    """News proxy: buy at the open of a gap-up day (min_gap..max_gap) in an uptrend."""
    trades = []
    for s in universe:
        i = START
        while i < N - 1:
            gap = C[s]["open"][i] / C[s]["close"][i - 1] - 1
            ok = (S50[s][i - 1] and S50[s][i - 1] > S200[s][i - 1] and R[s][i - 1] < 70
                  and gap >= min_gap and (max_gap is None or gap <= max_gap))
            if not ok: i += 1; continue
            e = C[s]["open"][i] * (1 + SLIP); j = i; exitp = None
            while j < N - 1:
                if C[s]["low"][j] <= e * 0.85:
                    exitp = min(C[s]["open"][j], e * 0.85); break
                if j - i >= 5 and C[s]["close"][j] < 0.97 * S50[s][j]:
                    exitp = C[s]["open"][j + 1]; j += 1; break
                j += 1
            if exitp is None: exitp = C[s]["close"][N - 1]
            trades.append(exitp * (1 - SLIP) / e - 1)
            i = j + 6                                                # cooldown
    return trades

def fmt(t):
    if not t: return "   0 trades"
    w = sum(1 for x in t if x > 0)
    return f"{len(t):4d} trades  win {w/len(t)*100:3.0f}%  avg {sum(t)/len(t)*100:+5.1f}%/trade"

groups = {"A 2023 top-10": "AAPL,AMZN,GOOGL,META,TSLA,JPM,JNJ,XOM,UNH,V".split(","),
          "B 2023 next-10": "LLY,WMT,MA,PG,HD,CVX,MRK,ABBV,KO,PEP".split(",")}

print("TEST 1 – trend strategy, anti-chase on the opening gap")
for g, u in groups.items():
    print(f"\n  {g}")
    for x in (None, 0.01, 0.02, 0.03, 0.04, 0.06):
        tot, mdd, t = trend(u, chase=x)
        lbl = "no filter" if x is None else f"skip gap >{x*100:.0f}%"
        print(f"    {lbl:14s} return {tot*100:+6.1f}%  maxDD {mdd*100:6.1f}%  {fmt(t)}")

print("\nTEST 2 – news-gap proxy (buy gap-ups of 2%..X% in an uptrend)")
for g, u in groups.items():
    print(f"\n  {g}")
    for x in (0.03, 0.04, 0.06, 0.08, None):
        lbl = "2%+ (no cap)" if x is None else f"2%..{x*100:.0f}%"
        print(f"    {lbl:14s} {fmt(gap_proxy(u, x))}")
