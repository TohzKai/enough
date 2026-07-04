import type { PlanInputs } from "../types";
import {
  PRESETS,
  withPreset,
  type Preset,
  type PresetKey,
} from "../data/presets";
import { runFullAnalysisSync, type FullAnalysis } from "../engine";

export interface PresetResult {
  preset: Preset;
  key: PresetKey;
  analysis: FullAnalysis;
}

/**
 * Run the user's plan through all three assumption presets and return each one's
 * safer-spend analysis. Used by the dashboard to show that the safer spend is
 * assumption-dependent — the A+ point is the SPREAD, not any single number.
 *
 * Uses a reduced trial count (comparative; only the ranking/spread matters).
 */
export function runPresetComparison(
  base: PlanInputs,
  trials = 1500,
): PresetResult[] {
  return PRESETS.map((preset) => {
    const inputs = withPreset({ ...base, trials }, preset.key);
    return {
      preset,
      key: preset.key,
      analysis: runFullAnalysisSync(inputs),
    };
  });
}

/** Summary line for a preset's safer spend, e.g. "S$1,037/month @ 92%". */
export function presetHeadline(r: PresetResult): {
  central: number;
  lower: number;
  upper: number;
} {
  return {
    central: Math.round(r.analysis.safe.centralSpend),
    lower: Math.round(r.analysis.safe.lowerSpend),
    upper: Math.round(r.analysis.safe.upperSpend),
  };
}
