import type { PlanInputs } from "../types";
import { DEFAULT_LIFESTYLE } from "./lifestyle";

/**
 * Mr Tan — the canonical worked example.
 *
 * Figures build on the strategy proposal (enough-proposal.md §8), recapitalised
 * so the LIVE engine — not a hand-written number — drives the worked example:
 *  - 65 years old, CPF LIFE S$1,550/month (Standard plan, LEVEL nominal), paid-off 4-room HDB.
 *  - ~S$520,000 across cash + investments + SRS (mass-affluent; see the assets note below).
 *  - Aspires to spend S$3,100/month (lifestyle he actually wants).
 *
 * IMPORTANT (A+ honesty): Mr Tan's "safer spend" is NOT a fixed number. It moves
 * meaningfully across the Conservative / Base / Optimistic assumption presets
 * (see src/data/presets.ts). The Mr Tan object below carries the BASE-case
 * assumptions; the app shows the safer spend under all three presets so the
 * trade-off — not any single figure — is the point.
 *
 * CPF LIFE is a LONGEVITY floor, not an inflation floor. Standard payouts are
 * level in nominal terms; their real value erodes with inflation. Only the
 * Escalating plan (+2%/yr, modelled to start lower) grows. Spending, by contrast,
 * IS inflated over time. Figures are illustrative estimates, not guarantees.
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

  // Assets (total S$520,000 — mass-affluent; the level at which the honest
  // engine sustains ~S$2,140/month at 90% confidence for this 30-year, level-
  // nominal-CPF profile. A lighter portfolio cannot safely fund much above the
  // CPF floor once inflation erodes it — that is a real result, not a bug.)
  cash: 40000,
  investments: 460000,
  srs: 20000,
  cashPct: 20,
  bondPct: 40,
  equityPct: 40,
  housingStatus: "paid-off",
  monthlyHousingCost: 0,
  monetisation: "none",
  monetisationMonthlyIncome: 0,
  monetisationCapitalInjection: 0,

  // Spending (sums to S$3,100 — the aspired lifestyle total)
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
