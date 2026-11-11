# Product Requirements Document: Momentum Top 3 Automated Quant Trading Copilot

*Created by the user with NotebookLM (10 sources), checked and corrected by Claude on 2026-11-11.*
*Authority: `STRATEGY.md` is authoritative for trading rules, `COPILOT_CONTEXT.md` for role, format and guardrails. This PRD describes the system; if it disagrees with those two files, they win.*

## 1. Executive scope & system identity

A rules-based, autonomous financial assistant that runs a systematic momentum equity strategy, monitors portfolio risk and provides unvarnished investment research. Two accounts: automated trading in a small dedicated account, strict read-only coverage of the larger main account.

| Attribute | Specification |
|---|---|
| System name | Momentum Top 3 Quant Trading Copilot |
| Primary objective | Outperform the S&P 500 over a 12+ month evaluation horizon |
| Execution horizon | Monthly systematic rebalancing |
| Primary user role | System supervisor / portfolio overseer |
| Agent persona | Disciplined quantitative research & execution analyst |
| Core integration | Claude, Robinhood MCP connector, GitHub repo (`LM-projects/trading/`) |

## 2. Product vision

Bring institutional-grade execution discipline to personal portfolio management. The copilot separates trade generation and execution from emotion. It plans, verifies and executes trades only on scheduled rebalance dates, under backtested rules.

**Operating philosophy:** data over narrative, rules over intuition, discipline over hype. No intervention during intra-month volatility.

## 3. Roles & account topology

```
USER (SUPERVISOR)
    │
    ▼
MOMENTUM TOP 3 COPILOT
    ├── full execution authority ──► MCP ACCOUNT ••••4866 (~$585)
    │                                Top 3 S&P 100 momentum, automated monthly rebalance
    └── read-only analysis ────────► MAIN ACCOUNT ••••4781 (~$16.8k)
                                     TGTX, URTH, BTC, NEAR – trading STRICTLY PROHIBITED
```

**MCP account ••••4866:**
- Full execution authority via the Robinhood MCP connector, only for symbols in the universe.
- Runs only the long-only "Momentum Top 3" model.
- Orders never exceed available cash or buying power.
- No shorting, margin, options or crypto.

**Main account ••••4781:**
- Strictly read-only. No orders, cancellations or changes.
- Coverage is research, risk monitoring, earnings analysis and allocation reporting only.
- Also blocked technically: the Robinhood connector only allows agent trading in the MCP account.

## 4. Execution engine & strategy rules

### 4.1 Universe
- S&P 100 constituents, from `momentum/sp100.txt` (101 symbols including dual share classes).
- Long-only US common stocks.
- Excluded: options, leveraged ETFs, margin, shorts, crypto.

### 4.2 Momentum score ("12-0", latest month included)
`M = Close_signal / Close_(signal − 252 trading days) − 1`

The signal date is the last trading day of the previous month. In the backtest, including the latest month (12-0) beat skipping it (12-1) in 33 of 40 random pools.

### 4.3 Rebalance schedule & execution
1. **Timing:** first US trading day of each month, 16:12 German time (10:12 ET).
2. **Data:** ~14 months of daily bars (`get_equity_historicals`) for all universe symbols plus SPY, in batches of 10.
3. **Ranking:** `python3 momentum/rank.py <files>`, sorted by M from highest to lowest.
4. **Target:** the top 3, each at ⅓ (33.3%) of total account value.
5. **Sell:** full market sell for every position no longer in the top 3.
6. **Drift band:** for stocks that stay in the top 3, adjust only if the position is **more than 10% away from its target value**. With a target of 33.3% of the account, that means outside **30.0%–36.7%** (10% *relative*, not 10 percentage points).
7. **Buy:** dollar-amount market orders for new top-3 stocks, min(target, remaining cash), rounded down to the cent. Every order is reviewed first.

### 4.4 No intervention between rebalances
- No stop-loss, trailing stop, volatility exit or news trades. Stops made results worse in testing (RESULTS.md section 6).
- The daily 16:12 run reports a status only.
- The 14:45 news briefing is information only and never triggers trades.

## 5. Technical architecture

```
GITHUB REPO (LM-projects/trading/)
  STRATEGY.md (trading rules) · COPILOT_CONTEXT.md (role/format) · momentum/rank.py · momentum/sp100.txt
  trade_log.md · backtests/RESULTS.md · CONTEXT_FOR_NOTEBOOKLM.md · PRD.md
        │
        ▼
CLAUDE COPILOT (scheduled tasks: 14:45 briefing, 16:12 run)
  rule logic · Python ranking (rank.py) · 3-part Bias check
        │
        ▼
ROBINHOOD MCP CONNECTOR
  live prices & balances · order placement (MCP ••••4866 only)
```

## 6. Guardrails & risk matrix

| Risk | Guardrail | Enforcement |
|---|---|---|
| Privacy | Mask account numbers, tokens and credentials | Account numbers shown as ••••4866 etc. |
| Conflict of interest | Neutral on Anthropic (ANT): no recommendations or buy/sell signals | Rule in COPILOT_CONTEXT.md, conflict flagged every time |
| Account separation | No orders in the main account | Rule plus a technical block: the connector only allows agent trades in the MCP account |
| Emotional trading | No trades on price spikes, hype or fear | Rule: trades only on rebalance days (not a technical lock) |
| Calculation errors | No made-up prices, returns or order sizes | Ranking via rank.py, live prices from Robinhood, sources for every number |

### 6.1 Bias check (3 parts, one line each)
1. **Confirmation bias:** were risks or counter-arguments overlooked?
2. **Drift from the rules:** does the action follow `STRATEGY.md` exactly?
3. **Concentration / conflicts:** concentration risk within the MCP account only, and Anthropic neutrality. The main account (incl. TGTX) is personal and is never part of MCP strategy analysis.

## 7. Logging & audit

### 7.1 Artifacts
1. **`trade_log.md`:** every fill with time (CET), ticker, BUY/SELL, shares, fill price, dollar amount. Closed trades include P/L.
2. **Rebalance history:** a table in `STRATEGY.md` (date, signal date, top 3, notes).

### 7.2 Baseline (start)

| Rebalance date | Signal as of | Top 3 | Notes |
|---|---|---|---|
| 2026-11-10 | 2026-10-30 | AMD, TXN, COP | Done at 16:20 CET. Sold MSFT and DXCM. Bought $187.97 each. Cash left $0.02. Starting value $564.14 |

## 8. KPIs & backtest baseline

Backtest 2016–2026, 89 large US stocks with full history, 12-0 window, 0.05% slippage [Source: `backtests/RESULTS.md`].

| Metric | Backtest | Live target (12+ months) |
|---|---|---|
| Yearly return (CAGR) | **23.0%** | Beat the S&P 500 |
| S&P 500 CAGR (same period) | **13.3%** | Benchmark |
| Worst drop (max drawdown) | **−33.3%** | Within −35% (watch level, see 8.2) |
| Years beating the S&P | 7 of 11 | Positive excess return over 12 months |
| Weak period | 2016–19: +19% vs S&P +68% | Expect years of lagging |

### 8.2 Evaluation rules
1. **Horizon:** judge only after 12+ months of continuous live running.
2. **Friction:** expect live returns somewhat below the backtest (spreads, slippage, rounding, and survivor bias in the backtest).
3. **No changes during weak phases:** don't change the strategy just because it's lagging.
4. **−35% alert (user decision, 2026-11-11):** a drawdown of −35% or worse below the peak account value triggers a **push alert only**. No automatic stop; the user decides. Tracked in `momentum/monitor.json`.
5. **12-month review on 2027-11-10 (user decision):** the first full evaluation, account vs S&P 500 since the start.
