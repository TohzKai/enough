/**
 * Stress-test scenario presets for the Results-page modules (healthcare / LTC,
 * financial crisis, lifespan sensitivity) and the shared "Funding sequence to
 * review".
 *
 * Two modes (see the integration plan):
 *  - Custom plan: the Results modules recompute the safer spend via the engine
 *    (`runFullAnalysisSync` with the scenario override).
 *  - Mr Tan demo: the modules render the deterministic illustrative constants in
 *    `DEMO_STRESS` so the class demo stays stable.
 *
 * Educational decision-support only — NOT advice. The funding sequence is framed
 * as "to review" / "options to discuss", never as a recommended action.
 */

export type StressZone = "green" | "amber" | "red";

/** A financial-crisis scenario the user can apply to their plan. */
export interface CrisisScenario {
  key: "mild" | "severe" | "lostDecade";
  label: string;
  blurb: string;
  /** First-year portfolio drawdown applied as a reduction to starting assets (0..1). */
  firstYearShock: number;
  /** Per-year return drag applied for `durationYears` (modelled as an equityReturn cut). */
  annualReturnAdjustment: number;
  durationYears: number;
}

export const CRISIS_SCENARIOS: CrisisScenario[] = [
  {
    key: "mild",
    label: "Mild downturn",
    blurb: "Portfolio falls about 10% in the first year.",
    firstYearShock: 0.1,
    annualReturnAdjustment: 0,
    durationYears: 1,
  },
  {
    key: "severe",
    label: "Severe downturn",
    blurb: "Portfolio falls about 25% in the first year.",
    firstYearShock: 0.25,
    annualReturnAdjustment: 0,
    durationYears: 1,
  },
  {
    key: "lostDecade",
    label: "Lost decade",
    blurb: "Low returns persist for about 10 years.",
    firstYearShock: 0,
    annualReturnAdjustment: -4,
    durationYears: 10,
  },
];

/** Care-cost simulator option lists. */
export const CARE_DURATIONS = [3, 5, 10] as const;
export const CARE_START_AGES = [75, 80, 85] as const;

/** Default care-cost scenario (the spec's worked example). */
export const DEFAULT_CARE = {
  healthcareIncrease: 500, // S$/month extra healthcare cost
  ltc: 1500, // S$/month long-term care cost
  durationYears: 3,
  startAge: 80,
};

/**
 * "Funding sequence to review" — discussion prompts, NOT recommended actions.
 * Wording held to the non-advisory guardrails.
 */
export const FUNDING_SEQUENCE: string[] = [
  "Use existing healthcare budget",
  "Use cash buffer",
  "Reduce discretionary spending temporarily",
  "Review family support",
  "Explore public or community support schemes",
  "Discuss insurance gaps with a licensed adviser",
  "Consider housing monetisation options such as room rental, lease buyback, or downsizing",
];

/** Guardrail-zone trim guidance (mirrors the guardrail bands). */
export const CRISIS_ZONE_GUIDANCE: Record<StressZone, string> = {
  green: "Stay within the safer range — no change needed.",
  amber: "Trim discretionary spending by 5% to 10% until confidence recovers.",
  red: "Pause discretionary increases; use the cash buffer; review family support.",
};

/**
 * Deterministic illustrative values for the Mr Tan demo (central safer spend
 * S$2,150/month). Custom plans recompute these live via the engine.
 */
export const DEMO_STRESS = {
  baseSpend: 2150,
  healthcare: {
    impactMonthly: -300,
    afterSpend: 1850,
    careGap: 18000, // S$500/month healthcare increase × 3 yrs
    needsBuffer: true,
  },
  crisis: {
    mild: {
      impactMonthly: -120,
      afterSpend: 2030,
      zone: "green" as StressZone,
    },
    severe: {
      impactMonthly: -300,
      afterSpend: 1850,
      zone: "amber" as StressZone,
    },
    lostDecade: {
      impactMonthly: -260,
      afterSpend: 1890,
      zone: "amber" as StressZone,
    },
  },
  // Lifespan sensitivity (spec example): higher horizon → lower safer spend.
  lifespan: [
    { age: 90, saferSpend: 2350 },
    { age: 95, saferSpend: 2150 },
    { age: 100, saferSpend: 1970 },
  ],
};
