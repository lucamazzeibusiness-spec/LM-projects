# Backtest results – 2026-11-09

Data: Robinhood daily bars, Jan 2015 → Nov 6 2026 (testing starts Oct 2015 once the 200-day averages exist; that leaves 11.0 years).
Universe: 28 large US stocks picked by their **2015** size (not today's winners), plus SPY.
Costs: 0.05% slippage per fill.
Scripts: `merge.py` (data), `improve_test.py`, `robust.py`, `momentum.py`.

## 1. Current trend strategy + improvements (28 stocks)

| Variant | Total | CAGR | Max DD |
|---|---|---|---|
| SPY buy & hold | +262% | 12.4% | −34.1% |
| Live rules, 2015 top-10 stocks | +579% | 19.0% | −23.5% |
| A: 28 stocks | +254% | 12.1% | −24.7% |
| A+B: 1 per sector | +288% | 13.1% | −27.7% |
| A+C: exit at same-day close | +277% | 12.8% | −25.9% |
| A+D: no buys when SPY < 200d | +91% | 6.1% | −27.9% |
| A+P: park cash in SPY | +264% | 12.4% | −36.8% |
| All combined | +292% | 13.2% | −36.6% |

## 2. Robustness – 40 random 10-stock groups

| Change | Avg CAGR | Beats SPY | Better than base |
|---|---|---|---|
| Live rules | 10.1% | 6/40 | – |
| +B sector cap | 9.8% | 7/40 | 18/40 |
| +C exit at close | 10.0% | 8/40 | 14/40 |
| +D market filter | 7.9% | 1/40 | 3/40 |
| +P park cash | 9.7% | 7/40 | 11/40 |

**Conclusion:** the trend strategy only beats SPY with a lucky stock list. None of the changes reliably help. The market filter clearly hurts.

## 3. Monthly momentum rotation

Rule: buy the top N stocks by 12-month return (skipping the last month), equal weight, rebalanced monthly.

| Variant (28 stocks) | Total | CAGR | Max DD | 2016-19 | 2020-22 | 2023-26 |
|---|---|---|---|---|---|---|
| SPY | +262% | 12.4% | −34.1% | +60% | +18% | +93% |
| Momentum top 3 | +424% | 16.2% | −31.5% | +96% | +37% | +96% |
| Momentum top 5 | +421% | 16.1% | −31.6% | +77% | +31% | +123% |
| Momentum top 5, only above 200d | +404% | 15.8% | −29.4% | +57% | +43% | +123% |

Across the 40 random 10-stock groups, momentum top 3 averaged 12.5% CAGR and beat SPY in 18/40 (trend strategy: 6/40).
**Momentum needs a broad universe.** With only 10 stocks it roughly matches SPY.

Caveats:
- 28 stocks is still a small universe.
- Survivorship bias: all 28 still exist today.
- 11 years is one long bull market with three corrections.

## 4. Bigger pool: 89 stocks (≈ 2015 S&P 100), Jan 2016 → Nov 2026

| Strategy | Total | CAGR | Max DD | Years > SPY | Worst year vs SPY |
|---|---|---|---|---|---|
| SPY buy & hold | +283% | 13.3% | −34.1% | – | – |
| Momentum 12-1 top 3 | +460% | 17.3% | −37.7% | 5/11 | −18% (2023) |
| Momentum 12-1 top 5 | +393% | 15.9% | −32.3% | 5/11 | −18% (2016) |
| Momentum 12-1 top 10 | +260% | 12.6% | −30.8% | 2/11 | −18% (2016) |
| Top 5, only above 200d | +282% | 13.2% | −33.4% | 5/11 | −25% (2016) |
| Top 5, hold SPY when SPY < 200d | +264% | 12.7% | −34.8% | 4/11 | −14% (2026) |
| Momentum 6-1 top 5 | +241% | 12.0% | −37.3% | 5/11 | −27% (2026) |
| Momentum 9-1 top 5 | +314% | 14.1% | −33.1% | 5/11 | −19% (2023) |
| Momentum 3-1 top 5 | +112% | 7.2% | −53.0% | 4/11 | −32% (2020) |

**Rebalance day:** top 5 CAGR was 15.9% / 16.1% / 19.4% / 17.9% when rebalancing 0 / 5 / 10 / 15 days before month-end.

**Random 45-stock halves (40 draws):**
- Top 3: median 14.0% CAGR (range 4.3%–25.3%). Beats SPY in 23/40.
- Top 5: median 11.1% CAGR (range 8.4%–15.9%). Beats SPY in 9/40.

**Conclusion:** 12-1 momentum with a concentrated top 3 has the best odds of beating SPY, but it is fragile:
- It lagged SPY in more than half of the years.
- Results swing a lot with the settings (lookback, number of stocks, rebalance day).
- Most of the gain came in 2020–22.

None of the tested rules beats SPY reliably.
