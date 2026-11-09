import json, glob, sys
bars = {}
for f in sys.argv[1:]:
    for r in json.load(open(f))["data"]["results"]:
        for b in r["bars"]:
            bars.setdefault(r["symbol"], {})[b["begins_at"][:10]] = b
out = {s: [v[d] for d in sorted(v)] for s, v in bars.items()}
json.dump(out, open("long.json", "w"))
spy = out["SPY"]; print(len(out), "symbols;", "SPY bars", len(spy), spy[0]["begins_at"][:10], "->", spy[-1]["begins_at"][:10])
for s, v in sorted(out.items()):
    if len(v) != len(spy): print("  mismatch", s, len(v), v[0]["begins_at"][:10])
