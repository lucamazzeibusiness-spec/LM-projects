# Pocket Terminal

Private claude.ai app page: https://claude.ai/artifact/9ikXP6uDGNmMPA6mVrhvqo (owner only).

- **MCP tab:** live Momentum Top 3 account (Robinhood, read only): value, holdings, vs S&P since start, drawdown vs peak, rules.
- **Personal tab:** main account, stocks + crypto + open orders (read only).
- **Trades:** live filled MCP orders, closed trades, rebalance history.
- **Backtests:** key results from `backtests/RESULTS.md`.
- **News:** the 14:45 CET pre-market briefings.
- **Chat:** asks Claude with the page's data plus live quotes. It can't place orders or browse the web.

**Data:** live numbers come from the Robinhood connector (read-only tools only). Strategy, trade log, backtests and briefings live in the artifact's database, written by Claude's scheduled tasks (14:45 briefing, 16:12 run).
**Source:** `pocket-terminal.html`. Republish it from a Claude session with the same artifact URL.

## Design (2026-11-11)
Split-flap departure board (Solari style): every figure is built from flap cells that spin into place, accounts are numbered enamel "track" plates, drawdown is a row of 35 signal lamps (1 lamp = 1% below peak, red from −25%), the chat is an "information desk" with announcement-style replies. Fonts: Barlow Condensed / Barlow. Reduced-motion turns off the flap spin.

### Phone pass (2026-11-11)
Track plates moved to a fixed bottom thumb bar; tables replaced by one "departure row" per item (20px tiles for name and key figure, plain 15px text for details); labels 13px; 16px chat input (no iOS zoom); 44px touch targets; shorter flap spin (2–4 flips).

### Charts (2026-11-11)
- Track 1: MCP vs S&P 500, % since start, from db `terminal/history` (daily closes appended by the 16:12 CET run) plus a live "Now" point.
- Holdings (MCP and private): tap a row → price chart with 1M/3M/1Y and a dashed average-cost line (`get_equity_historicals`, read-only; added to the page's tool list).
- Track 4: growth of $1,000, 2016–2026, momentum (live rules) vs SPY, from db `terminal/backtests.curve` (source: trading/backtests/curve_momentum_vs_spy.json, export_curve.py), plus a year-end table.
- Hand-drawn SVG, no chart library. Colors: strategy #c98500, S&P #3987e5 (validated for colorblind separation and contrast on the board surface). Touch-and-slide crosshair tooltip; arrow keys work too.
