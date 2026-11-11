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
