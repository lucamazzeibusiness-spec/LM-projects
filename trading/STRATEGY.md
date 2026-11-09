# Momentum Top 3 – live rules (MCP account ••••4866)

Started 2026-11-10. Replaces "Screen Picks Trend".
Backtest: `backtests/RESULTS.md`, sections 4–5.

## Universe
The S&P 100, listed in `momentum/sp100.txt` (101 symbols including share classes). Long only. No options, margin, shorting or crypto.

## Monthly rebalance
Runs on the first trading day of each month, at the 16:12 German time run (10:12 ET).

1. Download ~14 months of daily bars for the universe plus SPY with `get_equity_historicals`, in batches of 10.
2. Run `python3 momentum/rank.py <files>`. The signal date is the last trading day of the previous month.
   Momentum is the signal-date close divided by the close 252 trading days before, minus 1.
   The latest month is included ("12-0"), which tested better than skipping it (backtest section 6).
3. The **top 3** become the target holdings, each at ⅓ of total account value.
4. Sell every position that is not in the top 3 (all shares available for sale).
5. For stocks that stay in the top 3, adjust back to ⅓ only if a position is more than 10% away from target.
6. Buy new top-3 stocks with dollar-amount market orders. Never spend more than the cash or buying power available.

## Between rebalances
No trades: no stop-loss, no trend exits, no news buys. This matches the backtest.
The daily run only reports a status. The 14:45 news briefing is for information only.

## Logging
- Every fill goes into `trade_log.md`.
- Every rebalance goes into the rebalance table below.

## Rebalance history
| Date | Signal as of | Top 3 | Notes |
|---|---|---|---|
| 2026-11-10 | 2026-10-30 | AMD, TXN, COP (preview, 12-0) | First rebalance. Sells MSFT and DXCM |

## Expectations (backtest 2016–2026, 89 stocks, 12-0)
- About 23% per year vs the S&P 500's 13%. Expect less live.
- Worst drop −33%.
- Beat the S&P in 7 of 11 years.
- 2016–19 lagged the S&P badly (+19% vs +68%).
- Judge it after 12+ months.
