import type { PlanInputs } from "../../types";
import type { FullAnalysis } from "../../engine";

/**
 * Shared view model for the Results page. Computed once in the Dashboard
 * shell and passed to every panel. Avoids each panel recomputing the
 * same figures (and guarantees the safer-spend / confidence shown on
 * every tab is the same number).
 */
export interface ResultViewModel {
  inputs: PlanInputs;
  analysis: FullAnalysis;
  saferLower: number;
  saferCentral: number;
  saferUpper: number;
  confidence: number;
  cpfFloor: number;
  withdrawal: number;
  desiredSpend: number;
  desiredConfidence: number;
  gap: number;
  initialWithdrawalRate: number;
  planMode: "demo" | "custom";
  readOnly: boolean;
}

export function buildResultViewModel(args: {
  inputs: PlanInputs;
  analysis: FullAnalysis;
  planMode: "demo" | "custom";
  readOnly: boolean;
}): ResultViewModel {
  const { inputs, analysis, planMode, readOnly } = args;
  const saferLower = analysis.safe.lowerSpend;
  const saferCentral = analysis.safe.centralSpend;
  const saferUpper = analysis.safe.upperSpend;
  const cpfFloor = inputs.cpfLifeMonthly;
  const withdrawal = Math.max(0, saferCentral - cpfFloor);
  const desired = inputs.desiredSpend;
  const gap = Math.max(0, desired - saferCentral);
  const totalAssets = Math.max(
    1,
    inputs.cash + inputs.investments + inputs.srs,
  );
  const iwr = (withdrawal * 12) / totalAssets;
  const desiredConfidence =
    analysis.curve.find((p) => p.spend >= desired)?.successRate ?? 0;
  return {
    inputs,
    analysis,
    saferLower,
    saferCentral,
    saferUpper,
    confidence: analysis.safe.confidence,
    cpfFloor,
    withdrawal,
    desiredSpend: desired,
    desiredConfidence,
    gap,
    initialWithdrawalRate: iwr,
    planMode,
    readOnly,
  };
}
