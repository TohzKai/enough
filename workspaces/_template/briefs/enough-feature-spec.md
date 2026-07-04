# Enough — Feature Specification (6 Features for 6 Retiree Needs)

_Compiled 2026-06-27. Companion to `retiree-needs-research.md`. For the MBA
"Financial Analytics and Innovation" group project on Enough (CPF-calibrated
retirement decumulation app)._

> Status: RECOMMENDATION, derived from the research-backed 6 needs + the
> floor-and-gap / confidence-engine direction confirmed in session notes.
> NOT yet confirmed against the team's original six features. Treat as a
> strong proposed starting point. Cross-check against Outside/Zikai.pptx.

## Design principle

Build ONE spine -- the Confidence Engine -- with six features hanging off it.
The spine answers: "Are you on track, and how much can you safely spend?"
Each feature either feeds that number or helps the user act on it. One
coherent product, not a calculator with six tabs.

## The 6 features (one per need)

### Feature 1 -- The Floor  (Need 1: reliable income floor)
User: tags spending into essentials vs lifestyle; sees a guarantee line --
"Your essentials are 100% covered for life by CPF LIFE + safe withdrawals."
Powered by: Funded-ratio/LDI model + CPF-LIFE PV model.

### Feature 2 -- Will-It-Last Dial  (Need 2: longevity protection)
User: sees a confidence reading -- "94% chance your money lasts to age 95+"
-- with a slider to test living to 90, 95, 100.
Powered by: Monte Carlo engine + Lee-Carter cohort mortality.

### Feature 3 -- Health-Shock Buffer  (Need 3: healthcare costs)
User: toggles "what if a major health event hits at 75?" and sees how the
plan absorbs it, plus a recommended buffer / insurance gap.
Powered by: Stress-testing + Monte Carlo.

### Feature 4 -- Real-Money View  (Need 4: inflation)
User: a toggle flips every figure between "today's dollars" and "future
dollars," making 30-year inflation tangible.
Powered by: Return modeling (regime-switching) + backtest.

### Feature 5 -- Your Monthly Paycheck  (Need 5: spending confidence) [HERO]
User: sees one number -- "You can safely spend $4,200 this month" -- that
updates as markets move, with gentle guardrails ("markets are up -- you
could safely raise this to $4,500").
Powered by: Risk-based guardrails + Attribution layer (explains the number).
Why hero: the wedge no incumbent owns. CPF / banks / advisers tell you how to
SAVE; none give a neutral, trustworthy permission to SPEND.

### Feature 6 -- Freedom & Legacy Planner  (Need 6: flexibility & legacy)
User: earmarks one-off goals (a trip, helping a child, a bequest) and sees
the cost to their confidence -- "funding this trip drops confidence 94% -> 91%."
Powered by: Funded-ratio model + guardrails.

## How to add them -- three-wave rollout (sequenced by user value)

Wave 1 -- The core promise (build first): Feature 1 (The Floor) + Feature 5
(Your Monthly Paycheck). Together they deliver the whole value proposition and
the differentiating wedge. The one thing to demo if you demo only one.

Wave 2 -- The credibility layer: Features 2 (Will-It-Last) + 3 (Health-Shock)
+ 4 (Real-Money). These make the confidence number believable -- the "live too
long / get sick / inflation" objections answered visibly.

Wave 3 -- The delight layer: Feature 6 (Freedom & Legacy). The emotional
payoff; lands only once the engine is already trusted.

Cross-cutting: the glass-box explanation layer (Attribution model) gives every
number in every feature a plain-English "why." Not a wave item -- the texture
of the whole app, and the "trust is the product" differentiator.

## Open product decision
Six distinct features tells a richer story to graders; alternatively collapse
2/3/4 into a single "Stress Test" feature with three scenarios (cleaner to
build and explain). Decision pending.

## Feature -> Need -> Model map
| Feature | Need | Models |
|---------|------|--------|
| 1 The Floor | Income floor | Funded-ratio/LDI, CPF-LIFE PV |
| 2 Will-It-Last Dial | Longevity | Monte Carlo, Lee-Carter |
| 3 Health-Shock Buffer | Healthcare | Stress test, Monte Carlo |
| 4 Real-Money View | Inflation | Return modeling, Backtest |
| 5 Your Monthly Paycheck | Spending confidence | Guardrails, Attribution |
| 6 Freedom & Legacy Planner | Flexibility & legacy | Funded-ratio, Guardrails |
