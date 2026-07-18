/**
 * Stress-test scenario presets for the Results-page modules (healthcare / LTC,
 * financial crisis, lifespan sensitivity).
 *
 * Two modes:
 *  - Custom plan: the Results modules recompute the safer spend via the engine
 *    (`runFullAnalysisSync` with the scenario override).
 *  - Mr Tan demo: the modules render the deterministic illustrative constants in
 *    `DEMO_STRESS` so the class demo stays stable.
 *
 * Display text (label/blurb) holds i18n KEYS; the presentation layer translates.
 * Neutral planning advice; product-neutral. Numeric figures are untouched.
 */

export type StressZone = "green" | "amber" | "red";

/** A financial-crisis scenario the user can apply to their plan. */
export interface CrisisScenario {
  key: "mild" | "severe" | "lostDecade";
  /** i18n key for the tab label. */
  label: string;
  /** i18n key for the explanatory blurb. */
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
    label: "stressTests.crisisMildLabel",
    blurb: "stressTests.crisisMildBlurb",
    firstYearShock: 0.1,
    annualReturnAdjustment: 0,
    durationYears: 1,
  },
  {
    key: "severe",
    label: "stressTests.crisisSevereLabel",
    blurb: "stressTests.crisisSevereBlurb",
    firstYearShock: 0.25,
    annualReturnAdjustment: 0,
    durationYears: 1,
  },
  {
    key: "lostDecade",
    label: "stressTests.crisisLostLabel",
    blurb: "stressTests.crisisLostBlurb",
    firstYearShock: 0,
    annualReturnAdjustment: -4,
    durationYears: 10,
  },
];

/** Guardrail-zone trim guidance (i18n keys; mirrors the guardrail bands). */
export const CRISIS_ZONE_GUIDANCE: Record<StressZone, string> = {
  green: "guardrails.zoneGuidanceGreen",
  amber: "guardrails.zoneGuidanceAmber",
  red: "guardrails.zoneGuidanceRed",
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
