// Core domain types for the Enough simulator.
// All monetary values are in Singapore Dollars (S$) unless stated otherwise.

export type CpfPlan = "Basic" | "Standard" | "Escalating";
export type Monetisation =
  "none" | "room-rental" | "lease-buyback" | "downgrade";
export type HousingStatus = "paid-off" | "mortgage" | "renting" | "other";
export type Gender = "male" | "female";

/** The nine lifestyle spending buckets the user fills in on Build Plan. */
export type LifestyleBucketKey =
  | "essentials"
  | "housing"
  | "healthcare"
  | "foodTransport"
  | "utilities"
  | "discretionary"
  | "familySupport"
  | "travelHobbies"
  | "other";

/** Three lifestyle layers used for the spending summary. */
export type LifestyleLayer = "essential" | "flexible" | "aspirational";

/**
 * The full set of user inputs that drive the simulation.
 * Grouped to mirror the input form sections (Personal / CPF / Assets / Spending / Assumptions).
 */
export interface PlanInputs {
  // --- Personal ---
  age: number;
  gender: Gender;
  horizonAge: number; // age to plan to (default 95)
  spouseIncluded: boolean;
  spouseAge: number;

  // --- CPF LIFE (the longevity income floor; NOT an inflation floor) ---
  cpfLifeMonthly: number;
  cpfPlan: CpfPlan;
  payoutGrowthAnnual: number; // %/yr plan escalator (Standard/Basic = 0; Escalating = 2)

  // --- Assets ---
  cash: number;
  investments: number;
  srs: number;
  cashPct: number;
  bondPct: number;
  equityPct: number;
  housingStatus: HousingStatus;
  monthlyHousingCost: number; // S$/month housing cost (0 if paid off) — a spending item
  monetisation: Monetisation;
  monetisationMonthlyIncome: number; // S$/month from room rental (illustrative)
  monetisationCapitalInjection: number; // one-off S$ from lease buyback / downgrade

  // --- Spending (monthly S$) ---
  desiredSpend: number; // the headline number the user aspires to
  essentialSpend: number;
  discretionarySpend: number;
  healthcareSpend: number; // inflates at the (higher) healthcare rate
  familySupport: number;
  bequestTarget: number; // minimum ending balance required
  contingencyReserve: number; // buffer for shocks (narrative / not drawn in base sim)

  // --- Lifestyle buckets (single source for the spending fields above) ---
  lifestyle: Record<LifestyleBucketKey, number>; // 9 bucket amounts; summed → desiredSpend

  // --- Life goals (one-off) ---
  retirementTrip: number; // one-off trip amount (illustrative; modelled as an asset pre-fund)
  otherGoal: number; // other one-off goal amount

  // --- Assumptions ---
  confidence: number; // target success confidence, % (default 92)
  generalInflation: number; // % (default 2.8)
  healthcareInflation: number; // % (default 6)
  cashReturn: number; // % annual
  bondReturn: number; // % annual
  equityReturn: number; // % annual
  cashVol: number; // % annual std dev
  bondVol: number;
  equityVol: number;
  spendingFlexibility: number; // % discretionary cuttable in bad years (0..1 expressed as %)
  trials: number; // 2000 (quick) or 10000 (presentation)
  seed: number; // RNG seed for reproducibility
}
