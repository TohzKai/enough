/**
 * Stress-test recompute helpers.
 *
 * Each Results-page stress module builds a small `Partial<PlanInputs>` override
 * that captures the scenario, then calls `runFullAnalysisSync` to get a genuine
 * recomputed safer spend (~300ms). The engine itself is unchanged — we only
 * mutate the input snapshot before running it.
 *
 * Educational decision-support only — outputs are model estimates, not advice.
 */

import { runFullAnalysisSync, type FullAnalysis } from "../engine";
import type { PlanInputs } from "../types";
import type { CrisisScenario, StressZone } from "../data/stressScenarios";

/** Recompute a full analysis with the given overrides merged onto the inputs. */
export function recompute(
  inputs: PlanInputs,
  overrides: Partial<PlanInputs>,
): FullAnalysis {
  return runFullAnalysisSync({ ...inputs, ...overrides });
}

/** Central safer monthly spend for an analysis, rounded to whole dollars. */
export function saferSpendOf(a: FullAnalysis): number {
  return Math.round(a.safe.centralSpend);
}

/**
 * Crisis override: a first-year portfolio drawdown reduces investable assets
 * proportionally; a "lost decade" drags the equity return for its duration.
 */
export function crisisOverrides(
  inputs: PlanInputs,
  s: CrisisScenario,
): Partial<PlanInputs> {
  const keep = 1 - s.firstYearShock;
  return {
    cash: Math.max(0, Math.round(inputs.cash * keep)),
    investments: Math.max(0, Math.round(inputs.investments * keep)),
    srs: Math.max(0, Math.round(inputs.srs * keep)),
    equityReturn: inputs.equityReturn + s.annualReturnAdjustment,
  };
}

/** Healthcare / LTC override: extra ongoing healthcare spend (inflated at the healthcare rate). */
export function careOverrides(
  inputs: PlanInputs,
  care: { healthcareIncrease: number; ltc: number },
): Partial<PlanInputs> {
  return {
    healthcareSpend:
      inputs.healthcareSpend + care.healthcareIncrease + care.ltc,
  };
}

/** One-off goal override: pre-fund the goal by reducing cash today. */
export function oneOffGoalOverrides(
  inputs: PlanInputs,
  goalAmount: number,
): Partial<PlanInputs> {
  return { cash: Math.max(0, inputs.cash - goalAmount) };
}

/** Map a safer-spend drop to a guardrail zone (green / amber / red). */
export function zoneForImpact(
  baseSpend: number,
  afterSpend: number,
): StressZone {
  if (!(baseSpend > 0)) return "green";
  const drop = (baseSpend - afterSpend) / baseSpend;
  if (drop <= 0.05) return "green";
  if (drop <= 0.15) return "amber";
  return "red";
}
