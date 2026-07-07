/**
 * Lifestyle spending — the nine buckets the user fills in on Build Plan, and the
 * bridge that maps them into the engine's existing spending fields.
 *
 * The engine (src/engine/simulation.ts `spendingFractions`) already consumes
 * `essentialSpend` / `healthcareSpend` / `discretionarySpend` / `familySupport` /
 * `monthlyHousingCost` and inflates each at its own rate. The lifestyle buckets
 * are the single user-facing source; `syncLifestyleToSpend` rolls them up into
 * those five engine fields plus `desiredSpend` (= Σ buckets). The engine itself
 * is untouched.
 *
 * Layers (display + summary only — they do not change engine math):
 *   essential      — must-haves the CPF LIFE floor should help cover
 *   flexible       — discretionary + family support
 *   aspirational   — travel/hobbies + other one-off lifestyle
 */

import type { LifestyleBucketKey, LifestyleLayer, PlanInputs } from "../types";

export interface LifestyleBucketDef {
  key: LifestyleBucketKey;
  label: string;
  layer: LifestyleLayer;
}

/** The nine buckets in display order, grouped by layer. */
export const LIFESTYLE_BUCKETS: LifestyleBucketDef[] = [
  { key: "essentials", label: "Essentials", layer: "essential" },
  { key: "foodTransport", label: "Food & transport", layer: "essential" },
  { key: "utilities", label: "Utilities & household", layer: "essential" },
  { key: "housing", label: "Housing", layer: "essential" },
  { key: "healthcare", label: "Healthcare", layer: "essential" },
  { key: "discretionary", label: "Discretionary lifestyle", layer: "flexible" },
  { key: "familySupport", label: "Family support", layer: "flexible" },
  { key: "travelHobbies", label: "Travel & hobbies", layer: "aspirational" },
  { key: "other", label: "Other", layer: "aspirational" },
];

/**
 * Default lifestyle decomposition for the Mr Tan worked example. Sums to
 * S$3,100/month and re-derives the existing engine fields exactly:
 * essentialSpend 1400 (800+350+250), healthcare 600, housing 0, discretionary
 * 800 (500+300), familySupport 300.
 */
export const DEFAULT_LIFESTYLE: Record<LifestyleBucketKey, number> = {
  essentials: 800,
  foodTransport: 350,
  utilities: 250,
  housing: 0,
  healthcare: 600,
  discretionary: 500,
  familySupport: 300,
  travelHobbies: 300,
  other: 0,
};

/** Sum a list of bucket amounts (0 for missing/NaN). */
function sum(
  lifestyle: Record<LifestyleBucketKey, number>,
  keys: LifestyleBucketKey[],
): number {
  return keys.reduce((acc, k) => acc + (Number(lifestyle[k]) || 0), 0);
}

const ESSENTIAL_SPEND_KEYS: LifestyleBucketKey[] = [
  "essentials",
  "foodTransport",
  "utilities",
];
const DISCRETIONARY_KEYS: LifestyleBucketKey[] = [
  "discretionary",
  "travelHobbies",
  "other",
];

/**
 * Roll the nine lifestyle buckets up into the engine's six spending fields.
 * Returns a Partial<PlanInputs> ready to merge into the plan inputs.
 */
export function syncLifestyleToSpend(
  lifestyle: Record<LifestyleBucketKey, number>,
): Pick<
  PlanInputs,
  | "essentialSpend"
  | "healthcareSpend"
  | "discretionarySpend"
  | "familySupport"
  | "monthlyHousingCost"
  | "desiredSpend"
> {
  return {
    essentialSpend: sum(lifestyle, ESSENTIAL_SPEND_KEYS),
    healthcareSpend: Number(lifestyle.healthcare) || 0,
    discretionarySpend: sum(lifestyle, DISCRETIONARY_KEYS),
    familySupport: Number(lifestyle.familySupport) || 0,
    monthlyHousingCost: Number(lifestyle.housing) || 0,
    desiredSpend: totalLifestyle(lifestyle),
  };
}

/** Total monthly desired lifestyle = Σ all nine buckets. */
export function totalLifestyle(
  lifestyle: Record<LifestyleBucketKey, number>,
): number {
  return LIFESTYLE_BUCKETS.reduce(
    (acc, b) => acc + (Number(lifestyle[b.key]) || 0),
    0,
  );
}

export interface LifestyleLayerTotals {
  essential: number;
  flexible: number;
  aspirational: number;
  total: number;
}

/** Layer subtotals for the compact spending summary. */
export function layerTotals(
  lifestyle: Record<LifestyleBucketKey, number>,
): LifestyleLayerTotals {
  const byLayer = (layer: LifestyleLayer) =>
    LIFESTYLE_BUCKETS.filter((b) => b.layer === layer).reduce(
      (acc, b) => acc + (Number(lifestyle[b.key]) || 0),
      0,
    );
  const total = totalLifestyle(lifestyle);
  return {
    essential: byLayer("essential"),
    flexible: byLayer("flexible"),
    aspirational: byLayer("aspirational"),
    total,
  };
}
