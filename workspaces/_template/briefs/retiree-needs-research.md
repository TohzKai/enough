# Top Financial Needs & Concerns of Retirees — Research Foundation for "Enough"

_Compiled 2026-06-27. For the MBA "Financial Analytics and Innovation" group project on **Enough** (CPF-calibrated retirement decumulation app)._

> **Status:** Research-grounded reconstruction of the "6 needs → 6 features" foundation. The original six were never saved to file; these six are rebuilt from 2024–2025 market research and map cleanly onto the product. Confirm they match the original intent before they enter the deck.

## The 6 top financial needs / concerns of retirees

**1. A reliable income floor — "Will my basics always be covered?"**
Essential spending guaranteed, not at the mercy of markets. In Singapore nearly half of older adults have incomes below what's needed for basic needs; CPF Retirement Sums are reviewed to keep payouts realistic for daily expenses, healthcare and basic lifestyle. The bedrock — the *floor* half of the floor-and-gap thesis.

**2. Longevity protection — "What if I live longer than my money?"**
The most-cited fear. Globally 67% of investors are more worried about outliving savings than about dying; ~58% believe they actually will. Retirement can last 30+ years.

**3. Healthcare & long-term-care costs — "What happens when I get sick or frail?"**
The big unpredictable expense. In Singapore 56% of retirees cite healthcare costs. Globally a healthy 65-year-old couple's annual healthcare cost rises from ~$17k to ~$55k by age 85.

**4. Inflation / rising cost of living — "Will my money still buy what it does today?"**
Top concern overall — ~90% of retirees worry inflation will erode assets. In Singapore 75% name high cost of living, with 57% already forced to cut spending.

**5. Spending confidence — "How much can I actually spend without fear?" (behavioral)**
Most central to Enough. One-third of retirees still had 100%+ of their savings in their mid-80s — unnecessary underspending from anxiety, not math. Those with a decumulation plan: 57% high confidence vs 26% without; confident retirees are 5× more likely to find spending empowering. The product's wedge.

**6. Flexibility & legacy — "Can I handle surprises, and leave something behind?"**
Liquidity for emergencies/one-off wishes, and for many a bequest. The *discretionary* half of the stacked-bar visual.

## Mapping: 6 needs → 8 models → features

| # | Need | Models | Feature |
|---|------|--------|---------|
| 1 | Income floor | #4 Funded-ratio/LDI · #7 CPF-LIFE PV/ERS | Floor-vs-gap gauge; CPF top-up advisor
| 2 | Longevity | #3 Lee-Carter · #1 Monte Carlo | "Will I be okay to 95+?" confidence reading |
| 3 | Healthcare | #6 Stress testing · #1 Monte Carlo | "What if a big health bill hits?" scenario |
| 4 | Inflation | #2 Return modeling · #6 Backtest | Realistic, inflation-aware projections |
| 5 | Spending confidence | #5 Guardrails · #8 Attribution | "How much can I spend?" + plain-English wh
| 6 | Flexibility & legacy | #5 Guardrails · #4 Funded-ratio | Discretionary stacked-bar; spend-more-in-good-times |

The 8 models: 1 Monte Carlo engine · 2 Return modeling (bootstrap + regime-switching) · 3 Lee-Carter cohort mortality · 4 Funded-ratio/LDI spine · 5 Risk-based guardrails · 6 Backtest + stress · 7 CPF-LIFE PV/ERS trade-off · 8 Attribution layer.

Strategic notes: Need #5 is the wedge (CPF/banks/advisers serve 1–4, none solve behavioral paralysis); ce-backed need ("rigorous reasoning"); design is glass-box — AI only in the explanation layer (#8).

## Sources
- CBS News — 5 biggest financial concerns for retirees
- Goldman Sachs AM — Retirement Survey & Insights 2025
- Fidelity — Five Key Risks of Retirement
- Kiplinger — How Inflation Is Impacting Retirees
- Sun Life Singapore — Inflation challenges for retirees (2024)
- CPF Board — Retirement and Health Study
- Center for Retirement Research — Half of Retirees Afraid to Use Savings
- Morningstar — Psychology of Retirement Income
- InvestmentNews — Why retirees struggle to spend their savings   
