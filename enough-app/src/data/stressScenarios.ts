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
 * Neutral planning advice; product-neutral. The funding sequence is what we'd
 * suggest reviewing — the user weighs it and decides.
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
  "Close insurance gaps — Enough refers you to an insurer, IFA, or your existing adviser",
  "Consider housing monetisation options such as room rental, lease buyback, or downsizing",
];

/** Guardrail-zone trim guidance (mirrors the guardrail bands). */
export const CRISIS_ZONE_GUIDANCE: Record<StressZone, string> = {
  green: "Stay within the safer range — no change needed.",
  amber: "Trim discretionary spending by 5% to 10% until confidence recovers.",
  red: "Pause discretionary increases; use the cash buffer; review family support.",
};

/**
 * Engine-true values for the Mr Tan demo (central safer spend S$2,139/month),
 * taken from runFullAnalysisSync(mrTanInputs). Custom plans recompute live.
 */
export const DEMO_STRESS = {
  baseSpend: 2139,
  healthcare: {
    impactMonthly: -245,
    afterSpend: 1894,
    careGap: 18000, // display only; the live careGap is computed from the inputs
    needsBuffer: true,
  },
  crisis: {
    mild: {
      impactMonthly: -114,
      afterSpend: 2025,
      zone: "amber" as StressZone,
    },
    severe: {
      impactMonthly: -292,
      afterSpend: 1847,
      zone: "amber" as StressZone,
    },
    lostDecade: {
      impactMonthly: -319,
      afterSpend: 1820,
      zone: "amber" as StressZone,
    },
  },
  // Lifespan sensitivity: higher horizon → lower safer spend (engine values).
  lifespan: [
    { age: 90, saferSpend: 2433 },
    { age: 95, saferSpend: 2139 },
    { age: 100, saferSpend: 1927 },
  ],
};
