import { runFullAnalysisSync, type FullAnalysis } from "../engine";
import { mrTanInputs } from "../data/mrTan";

/**
 * Cache for the demo worked example's engine analysis.
 *
 * The worked example must always have a valid analysis available so the
 * Result overview, Scenario Lab, Spend Monitor, and Family Report can all
 * read the same safer-spend range. Computing this on every render is
 * wasteful; the result is deterministic for a given seed so we cache it
 * for the lifetime of the page.
 *
 * For custom plans the user's stored analysis (planStore.analysis) is the
 * source of truth. Use this helper only as the demo fallback so a custom
 * plan with stale inputs still surfaces a recalculation-required state
 * instead of silently showing demo figures.
 */
let cachedDemoAnalysis: FullAnalysis | null = null;

export function getDemoAnalysis(): FullAnalysis {
  if (!cachedDemoAnalysis) {
    cachedDemoAnalysis = runFullAnalysisSync(mrTanInputs);
  }
  return cachedDemoAnalysis;
}

/** Invalidate the cache (used by "Reset presentation demo"). */
export function clearDemoAnalysisCache(): void {
  cachedDemoAnalysis = null;
}