# Trading Assistant – Context File (for NotebookLM)

*As of: Nov 11, 2026. Written by Claude (Claude Code, Anthropic). Account numbers are masked. No passwords or personal data.*

This file describes how I (Claude) currently work with the user on stocks and crypto via Robinhood.
**Goal:** the user develops instructions, preferences and data with NotebookLM, then brings them back to Claude.

---

## 1. Who the user is and how they like to work

- **Location / time zone:** Germany. Always state times in **German time first**, then US Eastern if useful.
- **Language:** English by default. German when asked.
- **Goal:** **beat the S&P 500**. Accepts losses and swings along the way. Investing aggressively and concentrated.
- **Index funds:** OK to park idle money in an index fund. Doesn't want to trade ETFs actively.
- **Preferences for Claude:**
  - After every recommendation or judgment, a short **"🔍 Bias check"** (Claude reflects on its own biases).
  - **Show code** while working.
  - **No favorites:** every stock is judged by the same rules.
  - **No chasing:** doesn't want to buy after big price jumps.
  - Push notification after every trade.
  - Account numbers masked (last 4 digits only).
- **Plans:** wants to add more money later, but test the strategy first.

## 2. Accounts (Robinhood)

| Account | Purpose | Who trades |
|---|---|---|
| ••••4866 "MCP" | Automated strategy (~$585) | **Claude trades automatically**, only under the rules below |
| ••••4781 (main, margin) | Main account (~$16,800): TGTX, URTH, BTC, NEAR, cash | **The user trades himself.** Claude can only read it |
| ••••2098 (cash account) | Currently empty | – |

## 3. Active strategy in the MCP account: "Momentum Top 3" (since Nov 10, 2026)

**Rules:**
1. **Universe:** the S&P 100 (~100 largest US stocks). Long only. No options, margin, shorting or crypto.
2. **Monthly** on the first trading day (16:12 German time), every stock is ranked by its **12-month gain** (price at month-end ÷ price 252 trading days earlier). The latest month is included.
3. The **3 strongest stocks** are bought, each with **⅓ of the account**. Stocks that drop out of the top 3 are sold.
4. **No trades between rebalances.** No stop-loss, no news trades.

**Current holdings (bought Nov 10):** AMD, TXN (Texas Instruments), COP (ConocoPhillips), ~$188 each.
**Next rebalance:** Monday, Dec 1, 2026.

**Backtest (2016–2026, 89 large US stocks, 0.05% slippage):**

| Version | Yearly return | Worst drop | Years beating the S&P |
|---|---|---|---|
| S&P 500 | 13.3% | −34% | – |
| Momentum Top 3, latest month included (live version) | ~23% | −33% | 7 of 11 |
| Momentum Top 3, latest month skipped (classic) | 17.3% | −38% | 5 of 11 |

**What did NOT help in the tests:** stop-losses, trend filters (50/200-day), market filters, rebalancing twice a month, ranking by gain ÷ volatility.
**Caveats:**
- The backtest pool only contains companies that still exist today, which flatters the results.
- Most of the outperformance came in 2020–22.
- Real results will likely be lower. Judge after 12+ months.

**Previous strategy (until Nov 9): "Screen Picks Trend"**
- Buy when price > 50-day average > 200-day average and RSI < 70. Sell 3% below the 50-day average or on a 15% stop.
- Live result: 3 closed trades (APH −12%, MSFT +5.2%, DXCM −8.4%), −$30 in total.
- In backtests it beat the S&P in only 6 of 40 random stock groups, so it was replaced.

## 4. Main account (user decides himself)

- **TGTX (TG Therapeutics):** 107 shares, average cost $48.57, now ~$64 (+33%). **~41% of the account.**
  - **Q3 2026:** Briumvi sales $232.6M (+52% vs a year ago). 2026 forecast raised to $915–920M. Total revenue ~$1B.
  - **Upcoming:** Phase 3 results for the under-the-skin Briumvi at year-end 2026 / Q1 2027 (binary event). Q4 results ~late February 2027.
  - **User's position:** holding, no trim for now, hoping for more good news early 2027.
- **URTH** (MSCI World ETF): ~22.9 shares.
- **Crypto:** BTC ~0.056, NEAR ~118.5 (open limit sell: 59 NEAR at $5).
- **Open order:** buy 5 **ANT** (Anthropic IPO) at a limit of $93.60, good until cancelled. IPO range $70–78, expected trading start Nov 19, 2026.
  - *Note: Claude is made by Anthropic and gives no recommendation on ANT.*

## 5. Automatic tasks (Claude)

| Time (German) | Task |
|---|---|
| Mon–Fri 14:45 | News briefing on the MCP stocks (information only) |
| Mon–Fri 16:12 | Momentum run: rebalance on the 1st trading day of the month, otherwise a status |
| Sun 21:52 | Refresh of the "Up & Coming" watchlist (ideas for the user) |

Trade log, rules and backtests are in the GitHub repo `lucamazzeibusiness-spec/LM-projects`, branch `claude/robinhood-trading-mcp-a5xxno`, folder `trading/`.

## 6. What Claude can and can't do

**Can:**
- Read Robinhood data (prices, history, fundamentals, analyst ratings, positions, orders, watchlists, scans).
- Trade in the MCP account.
- Search the web, run backtests in Python, set alerts and reminders.

**Can't:**
- Trade the main account (read only).
- Listen to audio or earnings calls.
- Get past paywalls or bot checks.
- **Learn permanently.** Claude doesn't remember anything between separate conversations. What should persist must go into a file (e.g. in the repo) or the scheduled task instructions.

---

## 7. ✍️ Template: please fill in with NotebookLM and bring back

Answer as concretely as possible (numbers instead of "a lot / a little"):

**A. Goals and risk**
- Time horizon for the MCP strategy (months/years):
- Maximum drop I can stomach (e.g. −30%):
- When is the strategy a "failure" for me (e.g. after 12 months behind the S&P by more than X%)?
- Planned deposits (amount, rhythm):

**B. Rules I want to change or add**
- Number of stocks (3 / 5 / other):
- Excluded sectors or stocks:
- Earnings dates / news: ignore or take into account?
- Parking idle cash in an index fund (which one?):

**C. Main account**
- TGTX: target weight in the account, exit plan (when would I sell?):
- ANT / IPOs: rules for new positions:
- Crypto: target weight, plans:

**D. Communication with Claude**
- Report format (short/detailed, table/text):
- Push notifications: when yes, when no:
- Daily report: yes/no, what time:
- Language:

**E. Data I'm bringing** (e.g. CSV exports, research notes, watchlists, analysis from NotebookLM):
-

**Tip:** once you've worked these out, I'll save your answers as `trading/USER_PREFERENCES.md` in the repo and build them into the automatic tasks, so they stay in effect permanently.
