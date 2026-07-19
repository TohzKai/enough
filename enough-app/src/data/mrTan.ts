import type { PlanInputs } from "../types";
import { DEFAULT_LIFESTYLE } from "./lifestyle";

/**
 * Mr Tan — the canonical worked example.
 *
 * Calibrated so the live Monte Carlo engine (see
 * `src/engine/simulation.ts` and `runFullAnalysis`) naturally produces the
 * presentation-day profile at horizon 95:
 *   - Investable assets: ~S$414,000
 *   - Safer range: ~S$2,099–S$2,194 / month
 *   - Central safer spend: ~S$2,148 / month (rounded display: S$2,150)
 *   - Plan-survival confidence (at central): 90%
 *   - Gap to desired spend (S$3,100): ~S$952 / month
 *   - Initial withdrawal rate: ~1.7%
 *   - Desired-spend confidence at S$3,100: ~4% (low, not 45%)
 *
 * The engine is calibrated to a 30-year horizon (age 65 → 95). General
 * inflation is dropped from the default 2.7% to 2.0% and healthcare
 * inflation from 5.0% to 4.0% so the safer spend sits at ~S$2,150. The
 * presentation deck quotes "about S$2,150/month" — the UI rounds the
 * engine output to the nearest S$50 (`roundToNearest50`) so users see
 * the rounded figure.
 *
 * IMPORTANT — the engine's confidence for the S$3,100 desired lifestyle is
 * ~4%, not the 45% that appears in the slides. We have chosen to keep the
 * engine truthful: the worked example surfaces the real low desired-
 * confidence and frames the S$952 gap as the action item, rather than
 * hand-tuning a 45% result that the engine cannot produce.
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
  horizonAge: 95,
  spouseIncluded: true,
  spouseAge: 63,

  // CPF LIFE — Standard plan, LEVEL nominal (payoutGrowthAnnual = 0)
  cpfLifeMonthly: 1550,
  cpfPlan: "Standard",
  payoutGrowthAnnual: 0,

  // Assets — total S$414,000, calibrated so the engine produces the
  // presentation profile at a 30-year horizon (age 65 → 95).
  cash: 41400,
  investments: 331200,
  srs: 41400,
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

  // Base-case assumptions (see presets.ts for Conservative / Optimistic variants).
  // Inflation is reduced from the project default (2.7% / 5.0%) so the engine's
  // safer spend at 90% confidence sits at the presentation band (~S$2,150).
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
