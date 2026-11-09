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

## 5. Sector cap on momentum (89 stocks, 2016–2026)

| Variant | CAGR | Max DD | Years > SPY |
|---|---|---|---|
| SPY | 13.3% | −34.1% | – |
| Top 3, no cap | 17.3% | −37.7% | 5/11 |
| Top 3, max 1 per sector | 14.4% | −35.1% | 7/11 |
| Top 3, max 2 per sector | 17.3% | −37.7% | 5/11 |
| Top 5, no cap | 15.9% | −32.3% | 5/11 |
| Top 5, max 1 per sector | 15.3% | −28.2% | 7/11 |

**Random 45-stock halves, top 3:**
- No cap: median 14.0%, beats SPY in 23/40.
- Max 1 per sector: median 12.9%, beats SPY in 18/40.

**Decision (user, 2026-11-09):** pure top 3, no cap.

## 6. Making momentum react to the present (top 3, 89 stocks, 2016–2026)

| Variant | CAGR | Max DD | Years > SPY | Random pools: median / beats SPY / beats base |
|---|---|---|---|---|
| Base 12-1 (skip last month) | 17.3% | −37.7% | 5/11 | 14.0% / 23 / – |
| Include latest month (12-0) | **23.0%** | −33.3% | 7/11 | **16.9% / 28 / 33** |
| Only buy above 50d | 9.6% | −41.5% | 4/11 | 8.1% / 4 / 3 |
| Only buy above 200d | 15.6% | −33.7% | 5/11 | 11.9% / 16 / 2 |
| Skip if last month < −10% | 13.0% | −35.3% | 5/11 | 11.3% / 11 / 3 |
| 15% stop-loss | 12.7% | −33.7% | 4/11 | 9.8% / 9 / 0 |
| Sell below 50d mid-month | 4.7% | −34.6% | 4/11 | 2.5% / 0 / 0 |
| Rebalance twice a month | 14.9% | −36.9% | 5/11 | 14.5% / 24 / 28 |
| Rank by gain / volatility | 13.1% | −27.6% | 5/11 | 9.8% / 7 / 3 |

**How many recent days to skip:**

| Skip | CAGR | Max DD | Years > SPY | 2016–19 | 2020–22 | 2023–26 | Beats 12-1 (pools) |
|---|---|---|---|---|---|---|---|
| 0 days | 23.0% | −33.3% | 7/11 | +19% | +230% | +145% | 33/40 |
| 5 days | 20.3% | −34.6% | 6/11 | +10% | +223% | +112% | 29/40 |
| 10 days | 21.2% | −33.3% | 6/11 | +41% | +154% | +128% | 37/40 |
| 15 days | 18.8% | −39.3% | 6/11 | +36% | +174% | +78% | 36/40 |

**Conclusion:**
- Stops, trend exits and filters all hurt.
- Including more recent data helped consistently, across every skip setting and in the random pools.

**Caveats:**
- This contradicts the classic research, where skipping the last month helps.
- Most of the edge came in 2020–22.
- In 2016–19 the 0-day version lagged SPY badly: +19% vs +68%.
