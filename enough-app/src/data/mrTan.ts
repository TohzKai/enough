import type { PlanInputs } from "../types";

/**
 * Mr Tan — the canonical worked example.
 *
 *  - 65 years old, CPF LIFE S$950/mo (Standard plan, LEVEL nominal), HDB paid off.
 *  - S$150,000 in cash + investments + SRS.
 *  - Aspires to spend S$2,350/month.
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
 * IS inflated over time.
 */
export const MR_TAN_SEED = 73210;

export const mrTanInputs: PlanInputs = {
  // Personal
  age: 65,
  gender: "male",
  horizonAge: 95,
  spouseIncluded: false,
  spouseAge: 0,

  // CPF LIFE — Standard plan, LEVEL nominal (payoutGrowthAnnual = 0)
  cpfLifeMonthly: 950,
  cpfPlan: "Standard",
  payoutGrowthAnnual: 0,

  // Assets (total S$150,000)
  cash: 45000,
  investments: 90000,
  srs: 15000,
  cashPct: 20,
  bondPct: 40,
  equityPct: 40,
  housingStatus: "paid-off",
  monthlyHousingCost: 0,
  monetisation: "none",
  monetisationMonthlyIncome: 0,
  monetisationCapitalInjection: 0,

  // Spending (sums to S$2,350 — the aspired total)
  desiredSpend: 2350,
  essentialSpend: 950,
  discretionarySpend: 600,
  healthcareSpend: 500,
  familySupport: 300,
  bequestTarget: 0,
  contingencyReserve: 0,

  // Base-case assumptions (see presets.ts for Conservative / Optimistic variants)
  confidence: 92,
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
  cpfLifeMonthly: 950,
  cpfPlan: "Standard",
  payoutGrowthAnnual: 0,
  cash: 30000,
  investments: 80000,
  srs: 10000,
  cashPct: 20,
  bondPct: 40,
  equityPct: 40,
  housingStatus: "paid-off",
  monthlyHousingCost: 0,
  monetisation: "none",
  monetisationMonthlyIncome: 0,
  monetisationCapitalInjection: 0,
  desiredSpend: 2200,
  essentialSpend: 900,
  discretionarySpend: 550,
  healthcareSpend: 450,
  familySupport: 300,
  bequestTarget: 0,
  contingencyReserve: 10000,
  confidence: 92,
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
