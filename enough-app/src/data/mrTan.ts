import type { PlanInputs } from "../types";
import { DEFAULT_LIFESTYLE } from "./lifestyle";

/**
 * Mr Tan — the canonical worked example.
 *
 * Figures are calibrated so the live Monte Carlo engine (see
 * `src/engine/simulation.ts` and `runFullAnalysis`) naturally produces the
 * presentation-day profile:
 *   - Investable assets: ~S$190,000
 *   - Safer range: ~S$2,000–S$2,350/month
 *   - Central safer spend: ~S$2,150/month
 *   - Gap to desired spend (S$3,100): ~S$950/month
 *   - Initial withdrawal rate on portfolio: ~3.8%
 *   - Plan-survival confidence (at the central safer spend): 90%
 *
 * The engine calibrates these figures by:
 *   - Dropping portfolio from the previous S$520k to S$190k,
 *   - Shortening planning horizon to 80 (age 65 → 85),
 *   - Lowering general inflation from 2.7% to 2.0%,
 *   - Lowering healthcare inflation from 5.0% to 4.0%.
 *
 * IMPORTANT — the engine is too honest to support "S$3,100 desired at ~45%
 * confidence" on a S$190k portfolio over a 30-year horizon. With the calibrated
 * inputs the engine's success probability at S$3,100/month is <1%, not 45%.
 * The "45% confidence for the desired lifestyle" figure on the slides is
 * therefore unachievable without unrealistic returns, and we have chosen to
 * keep the engine truthful: the worked example surfaces the real ~0% confidence
 * at S$3,100 and explicitly frames the S$950 gap as the action item.
 *
 * CPF LIFE is a LONGEVITY floor, not an inflation floor. Standard payouts are
 * level in nominal terms; their real value erodes with inflation. Only the
 * Escalating plan (+2%/yr, modelled to start lower) grows. Spending, by
 * contrast, IS inflated over time. Figures are illustrative estimates, not
 * guarantees.
 */
export const MR_TAN_SEED = 73210;

export const mrTanInputs: PlanInputs = {
  // Personal
  age: 65,
  gender: "male",
  // Horizon shortened to 80 (vs the previous 95) so the engine's safer spend
  // sits in the presentation band on a S$190k portfolio. See the file header
  // for the calibration rationale.
  horizonAge: 80,
  spouseIncluded: true,
  spouseAge: 63,

  // CPF LIFE — Standard plan, LEVEL nominal (payoutGrowthAnnual = 0)
  cpfLifeMonthly: 1550,
  cpfPlan: "Standard",
  payoutGrowthAnnual: 0,

  // Assets — total S$190,000 (calibrated for the presentation profile).
  cash: 15000,
  investments: 160000,
  srs: 15000,
  cashPct: 20,
  bondPct: 40,
  equityPct: 40,
  housingStatus: "paid-off",
  monthlyHousingCost: 0,
  monetisation: "none",
  monetisationMonthlyIncome: 0,
  monetisationCapitalInjection: 0,

  // Spending — aspired lifestyle S$3,100/month (the desired number, even
  // though the engine says it is not safely fundable at 90% confidence).
  desiredSpend: 3100,
  essentialSpend: 1400,
  discretionarySpend: 800,
  healthcareSpend: 600,
  familySupport: 300,
  bequestTarget: 0,
  contingencyReserve: 0,

  // Lifestyle buckets (single source for the spending fields above; sum = S$3,100)
  lifestyle: { ...DEFAULT_LIFESTYLE },

  // Base-case assumptions (see presets.ts for Conservative / Optimistic variants)
  confidence: 90,
  generalInflation: 2.0,
  healthcareInflation: 4.0,
  cashReturn: 2,
  bondReturn: 3.5,
  equityReturn: 6.5,
  cashVol: 1,
  bondVol: 5,
  equityVol: 16.5,
  spendingFlexibility: 0,
  trials: 2000,
  seed: MR_TAN_SEED,
};

/** A blank but sensible starting point for "Build my own plan". */
export const blankInputs: PlanInputs = {
  age: 65,
  gender: "male",
  horizonAge: 95,
  spouseIncluded: false,
  spouseAge: 62,
  cpfLifeMonthly: 1550,
  cpfPlan: "Standard",
  payoutGrowthAnnual: 0,
  cash: 30000,
  investments: 120000,
  srs: 15000,
  cashPct: 20,
  bondPct: 40,
  equityPct: 40,
  housingStatus: "paid-off",
  monthlyHousingCost: 0,
  monetisation: "none",
  monetisationMonthlyIncome: 0,
  monetisationCapitalInjection: 0,
  desiredSpend: 2900,
  essentialSpend: 1300,
  discretionarySpend: 700,
  healthcareSpend: 550,
  familySupport: 300,
  bequestTarget: 0,
  contingencyReserve: 10000,
  lifestyle: { ...DEFAULT_LIFESTYLE },
  confidence: 90,
  generalInflation: 2.7,
  healthcareInflation: 5,
  cashReturn: 2,
  bondReturn: 3.5,
  equityReturn: 6.5,
  cashVol: 1,
  bondVol: 5,
  equityVol: 16.5,
  spendingFlexibility: 0,
  trials: 2000,
  seed: MR_TAN_SEED,
};
