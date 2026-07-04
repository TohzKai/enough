# Enough -- Fintech Proposal
## "How much can I really spend?" -- a CPF-calibrated retirement decumulation app for Singapore

_Compiled 2026-06-27. Synthesis of all sessions. Companion to
retiree-needs-research.md and enough-feature-spec.md. Dollar figures are
illustrative (from the current deck) and pending CPF verification._

## 1. Executive summary
Enough answers the one question existing retirement tools ignore: not how much
you have saved, but how much you can safely spend each month without outliving
your money -- while still funding the lifestyle you actually want. It is built
around CPF LIFE, powered by a Monte Carlo engine calibrated to Singapore
(longevity, healthcare inflation, local spending), and designed for the family.
Its wedge is SPENDING CONFIDENCE -- a neutral, trustworthy "permission to spend"
that CPF, banks, and advisers structurally cannot give.

## 2. The problem
- 1 in 4 Singaporeans will be over 65 by 2030; most do not know if their savings
  will last.
- Existing tools explain CPF or sell investment/wealth products. None tell a
  retiree how much they can safely spend right now.
- Behavioural trap: even well-funded retirees underspend out of fear (a third
  still hold 100%+ of savings into their mid-80s). The cost is a smaller, more
  anxious retirement than they could afford.

## 3. CPF LIFE vs Enough -- complementary, not competing
Both share the same objective: ensure Singaporeans do not outlive their savings.
But they are different kinds of thing.

CPF LIFE is a national annuity (a PRODUCT): you commit your Retirement Account
savings and receive a guaranteed monthly payout for life. It solves longevity
risk for that one slice -- the payout never runs out.

What CPF LIFE does NOT do:
- It only annuitises your CPF Retirement Account -- it ignores the rest of your
  wealth (cash, SRS, investments, property), often the larger part.
- Its payout is set by formula (Standard or Escalating), not matched to the
  lifestyle you actually want.
- It tells you nothing about how much of your OTHER savings you can safely spend
  -- which is the real decumulation question.
- It does not adapt to markets, health, family, or discretionary goals.
- For most people the payout covers only the basics (the floor); it is not
  enough for the lifestyle they want.

Enough is a PLAN, not a product. It treats CPF LIFE as the guaranteed floor and
then optimises the safe drawdown of everything else to fund the lifestyle gap,
at a stated confidence level, updating with markets.
- CPF LIFE answers: "you will always receive $X."
- Enough answers: "given that $X floor, here is how much MORE you can safely
  spend each month to live the life you want -- and how confident we are."

So CPF LIFE is an INPUT into Enough, not a rival. Enough makes CPF LIFE more
useful by showing how it fits the whole retirement-spending decision.

## 4. The six retiree needs (research foundation)
1. Reliable income floor -- essentials guaranteed for life.
2. Longevity protection -- not outliving your money (67% fear this more than death).
3. Healthcare and long-term-care costs -- 56% of SG retirees' top concern.
4. Inflation protection -- ~90% worry inflation erodes savings; 75% of SG
   retirees cite cost of living.
5. Spending confidence (the wedge) -- planning lifts confidence 26% -> 57%.
6. Flexibility and legacy -- handle surprises and leave something behind.

## 5. Basic vs discretionary -- funding the lifestyle they want
Enough splits desired spending into two layers and plans each differently.

BASIC / ESSENTIAL spending (the floor): housing, food, utilities, healthcare,
transport -- the non-negotiables. Enough's job: guarantee these for life
(CPF LIFE + a conservative safe-withdrawal slice). Funded with high certainty;
security is paramount.

DISCRETIONARY spending (the lifestyle layer): travel, dining, hobbies, gifts to
family, experiences -- what makes retirement worth it. Funded from the "gap"
above the floor. Flexible: flexes up in good markets, trims in bad, via
guardrails.

How Enough takes the intended lifestyle into account: the user tells Enough the
lifestyle they want -- their desired total spend, split into basics and
discretionary. Enough then:
- locks and guarantees the basics (the floor),
- calculates how much discretionary spend is safely sustainable for that
  person's wealth and horizon, at a stated confidence,
- shows the trade-offs: "you want $X of lifestyle; $Y is safe at 90%
  confidence; funding the full $X drops confidence to Z% -- here is what closes
  the gap (spend a little less, work one more year, top up CPF, adjust the
  legacy target)."

The reframe: Enough is not just "will I run out?" (fear-avoidance). It is "how
do I fund the lifestyle I actually want, safely?" The floor protects the
downside; the discretionary layer enables the upside -- and fixes the
underspending paradox, where many can safely afford MORE lifestyle than they
dare to spend.

## 6. The product -- six features for six needs
| Feature | Need served | What the user does |
|---|---|---|
| The Floor | Income floor | Sees essentials guaranteed for life by CPF LIFE + safe withdrawals |
| Will-It-Last Dial | Longevity | Confidence reading ("94% chance money lasts to 95+") with a lifespan slider |
| Health-Shock Buffer | Healthcare | Tests a major health event and sees the plan absorb it |
| Real-Money View | Inflation | Toggles today's vs future dollars to feel inflation |
| Your Monthly Paycheck (HERO) | Spending confidence | One number -- "you can safely spend $X this month" -- moving with markets |
| Freedom and Legacy Planner | Flexibility and legacy | Earmarks trips/bequests and sees the cost to their confidence |

Cutting across all six: a glass-box explanation layer -- every number comes with
a plain-English "why." "Trust is the product" made tangible.

## 7. The Enough Engine and the 8 analytical models
Five-stage pipeline, fully glass-box -- AI is used only to EXPLAIN, never to
CALCULATE:
INPUT (CPF LIFE, SRS, investments, expenses, family) -> SIMULATE (Monte Carlo,
~10,000 paths over 30 years) -> SG-CALIBRATE (CPF LIFE floor, SG longevity,
healthcare inflation, local spending) -> OPTIMISE (bucket strategy + withdrawal
sequencing + spending hedge) -> DELIVER (a safer monthly spend number + a plan
that updates with markets).

The eight models beneath it:

1. Monte Carlo simulation engine
   How it works: plays out retirement across thousands of possible futures
   (good decades, early crashes) and counts how many succeed.
   Value to user: an honest probability ("9 in 10 futures your money lasts to
   95") instead of a single false-precise number.
   Feature: Your Monthly Paycheck; Will-It-Last Dial.

2. Return modelling (bootstrapped + regime-switching)
   How it works: builds the futures from real historical market behaviour and
   switches between calm and turbulent market "moods," instead of a tidy average.
   Value to user: the plan is stress-tested against realistic bad luck,
   including the early-retirement crash that wrecks real retirees.
   Feature: Real-Money View; underpins the confidence number.

3. Cohort mortality (Lee-Carter)
   How it works: projects longer, generation-specific life expectancy instead
   of a fixed life table.
   Value to user: protects against the biggest risk -- outliving your money
   because the plan assumed you would die earlier than you likely will.
   Feature: Will-It-Last Dial (sets the horizon for every projection).

4. Funded-ratio / LDI spine
   How it works: treats future spending as a liability (a bill you owe yourself)
   and tracks savings divided by the cost of that bill.
   Value to user: turns "do I have enough?" into a clear gauge -- "you are 110%
   funded" or "85% funded, here is the gap." This is the floor-and-gap thesis as
   math.
   Feature: The Floor; Freedom and Legacy Planner.

5. Risk-based guardrails
   How it works: pre-agreed rules that trim spending if the portfolio drops
   below a line and raise it if it grows past one; the lines come from the
   simulation, not gut feel.
   Value to user: a living plan with a steering wheel -- no panic in downturns,
   and permission to safely spend MORE in good times.
   Feature: Your Monthly Paycheck; Freedom and Legacy Planner.

6. Backtest + stress testing
   How it works: checks the plan against real history (1973, 2000, 2008) and
   against deliberately brutal scenarios (slump + high inflation; a health shock).
   Value to user: trust -- proof the plan would have survived the worst real
   periods, not just worked in theory.
   Feature: Health-Shock Buffer; credibility for the whole engine.

7. CPF-LIFE PV / ERS trade-off
   How it works: puts CPF LIFE payout and top-up choices (e.g. Enhanced
   Retirement Sum) on a common present-value footing so they are comparable.
   Value to user: clarity on one of the highest-stakes, hardest-to-reverse SG
   decisions -- how much to top up CPF and which payout option.
   Feature: The Floor; the CPF top-up guidance.

8. Attribution layer
   How it works: decomposes each result into plain-English drivers ("confidence
   rose because you delayed 2 years (+8%) and topped up CPF (+5%), but high
   spending pulled it down (-4%)").
   Value to user: the app is trustworthy and actionable, not a black box -- the
   user sees what is driving the number and which levers to pull.
   Feature: the glass-box explanation layer across every feature (the only place
   AI is used).

### How the eight models connect (it is one assembly line, not eight calculators)
- Inputs feed the engine: Model 3 (how long you will live) and Model 2 (how
  markets behave) feed the core simulator, together with Model 7 (the CPF LIFE
  floor and top-up choice) as a major starting input.
- The engine simulates: Model 1 (Monte Carlo) runs the thousands of futures
  from those inputs.
- The output is measured: Model 4 (the funded-ratio gauge) reads whether you are
  on track to cover the floor + lifestyle.
- It is steered: Model 5 (guardrails) adjusts spending up or down as the paths move.
- It is validated: Model 6 (backtest + stress) confirms the plan would have
  survived real history and shocks.
- It is explained: Model 8 (attribution) turns the whole result into
  plain-English drivers.

In one line: 3 + 2 + 7 feed -> 1 SIMULATE -> measured by 4 -> steered by 5 ->
validated by 6 -> explained by 8.

Models 1, 4 and 8 are the three the user feels most -- the confidence number,
the funded-ratio / floor-gap gauge, and the plain-English "why." The other five
make those three credible rather than hand-wavy. This is also why the engine is
glass-box: every link in the chain is traceable, and AI touches only the final
explanation step (Model 8), never the calculation.

## 8. Worked example -- Mr Tan, 65 (figures illustrative; to be verified)
- CPF LIFE ~S$1,550/month; cash + investments ~S$190,000; paid-off 4-room HDB.
- His question: can I sustain my desired spending for the next 30 years?
- Enough returns a safer monthly spend number at ~90% confidence, with the
  basics guaranteed and the discretionary layer sized to his confidence, plus a
  plan that re-checks as markets move.

## 9. The competitive gap
| Capability | CPF tools | Investment platforms | Advisers | Enough |
|---|:--:|:--:|:--:|:--:|
| CPF LIFE payout view | yes | no | partial | yes |
| Investment/savings view | no | yes | yes | yes |
| Non-retirement spending | no | no | partial | yes |
| Safe monthly spend number | no | no | no | yes |
| Updates with real market data | no | partial | no | yes |
Enough is the only one delivering a safe-to-spend number that updates with markets.

## 10. Business model and economics
- Freemium. Free: basic safe-monthly-spend estimate. Premium (~S$X/month):
  monthly plan reset, what-if scenarios, spending alerts, family shared view,
  PDF family report.
- B2B2C-led distribution (banks, insurers, employer wellness platforms) on a
  flat-fee, neutral basis -- no product commissions, which is what keeps it
  trusted.
- Economics drivers: high operating leverage (one engine serves all),
  reach-per-deal via B2B2C partners, strong net revenue retention (a plan
  checked monthly for decades), concentration risk on large partners to manage.

## 11. Defensibility -- "trust is the product"
Incumbents cannot copy the wedge: CPF cannot tell you to spend; banks and
advisers cannot be neutral (they earn on products). Neutrality + decumulation-
first focus is a positioning moat.

## 12. Data network effect
Every plan created improves the Singapore-calibrated confidence model -> better
recommendations -> more users and referrals -> more privacy-safe, anonymised,
aggregated data. A compounding, hard-to-replicate advantage.

## 13. Regulatory path -- phased, MAS-compliant
- Stage 1: educational robo-calculators (awareness + trust; no personalised advice).
- Stage 2: apply for an MAS Financial Adviser licence for personalised advice.
- Stage 3: B2B2C partnerships with banks, insurers, employer wellness platforms.
- Compliant with MAS guidelines at every stage.

## 14. Why now
- Ageing Singapore -- 1 in 4 over 65 by 2030.
- Proven planning gap -- prior digital-advisory efforts showed demand for low-cost guidance.
- Rising digital readiness among older Singaporeans.

## 15. Roadmap -- three value-sequenced waves
- Wave 1 (core promise): The Floor + Your Monthly Paycheck -- the whole value
  proposition and the wedge in one demo.
- Wave 2 (credibility): Will-It-Last + Health-Shock + Real-Money -- makes the
  confidence number believable.
- Wave 3 (delight): Freedom and Legacy -- the emotional payoff once trust is earned.

## 16. Open items before final submission
1. Verify CPF figures -- exact 2025/2026 FRS/ERS/CPF-LIFE payout numbers and
   Standard-vs-Escalating indexing.
2. Decide 6 vs 4 features -- keep all six, or collapse Will-It-Last/Health-Shock/
   Real-Money into one "Stress Test" feature.
3. Confirm the six needs/features against the team's original intent
   (mine are a research-backed reconstruction).
4. Set the premium price point (the S$X/month).
