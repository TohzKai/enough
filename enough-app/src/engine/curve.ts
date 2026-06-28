import {
  evaluateSpend,
  generateScenarios,
  effectiveMonthlyFloor,
  type SimulationResult,
} from "./simulation";
import { calculatePortfolioStats } from "./portfolio";
import type { PlanInputs } from "../types";

/** One point on the spend-vs-confidence curve. */
export interface CurvePoint {
  spend: number; // total monthly spend (S$)
  successRate: number; // probability of portfolio survival (0..1)
}

export interface SafeSpendRange {
  lowerSpend: number; // more conservative (higher confidence)
  centralSpend: number; // at the target confidence
  upperSpend: number; // more flexible (lower confidence)
  confidence: number; // central confidence, %
  medianEndBalance: number;
  failureProb: number; // 1 - centralSuccess
  earliestFailureYear: number; // 0 if no failures
}

export interface FullAnalysis {
  curve: CurvePoint[];
  safe: SafeSpendRange;
  centralResult: SimulationResult;
  portfolio: { expectedReturn: number; volatility: number };
  trials: number;
  horizonMonths: number;
  desiredSpend: number;
  cpfLifeMonthly: number;
  generatedAt: string;
}

/** Build the spend sample points spanning the effective income floor → a bit
 *  above desired spend. */
function buildSpendPoints(i: PlanInputs): number[] {
  const lo = Math.max(0, effectiveMonthlyFloor(i));
  const hi = Math.max(i.desiredSpend * 1.15, lo + 2200, 2600);
  const N = 30;
  const pts: number[] = [];
  for (let k = 0; k <= N; k++) pts.push(lo + ((hi - lo) * k) / N);
  return pts;
}

/** Monotonic linear interpolation of success probability at an arbitrary spend. */
export function successAt(curve: CurvePoint[], spend: number): number {
  if (curve.length === 0) return 0;
  if (spend <= curve[0].spend) return curve[0].successRate;
  const last = curve[curve.length - 1];
  if (spend >= last.spend) return last.successRate;
  for (let k = 0; k < curve.length - 1; k++) {
    const a = curve[k];
    const b = curve[k + 1];
    if (spend >= a.spend && spend <= b.spend) {
      const f = (spend - a.spend) / (b.spend - a.spend);
      return a.successRate + f * (b.successRate - a.successRate);
    }
  }
  return 0;
}

/**
 * Invert the curve: find the (max) spend at which success probability first
 * crosses DOWN past `confidence`. Equivalent to a binary search but exploits the
 * monotonic curve we already computed. This is `calculateSafeSpendAtConfidence`.
 */
export function calculateSafeSpendAtConfidence(
  curve: CurvePoint[],
  confidence: number,
): number {
  for (let k = 0; k < curve.length - 1; k++) {
    const a = curve[k];
    const b = curve[k + 1];
    if (a.successRate >= confidence && b.successRate < confidence) {
      const f = (a.successRate - confidence) / (a.successRate - b.successRate);
      return a.spend + f * (b.spend - a.spend);
    }
  }
  // Confidence not crossed — return the highest spend that still meets it.
  let best = curve[0]?.spend ?? 0;
  for (const p of curve)
    if (p.successRate >= confidence) best = Math.max(best, p.spend);
  return best;
}

function tick(): Promise<void> {
  // Yield to the event loop so the UI thread can paint progress and stay responsive.
  return new Promise((r) => setTimeout(r, 0));
}

export interface CancelToken {
  cancelled: boolean;
}

/**
 * The orchestrator: generates shared scenarios once, walks the spend points to
 * build the curve (yielding periodically + reporting progress), then derives the
 * safe-spend range and the central simulation result.
 *
 * This single pass powers the dashboard, the spend-confidence curve, the family
 * report, and (via its building blocks) the methodology page.
 */
export async function runFullAnalysis(
  i: PlanInputs,
  onProgress?: (p: number) => void,
  cancel?: CancelToken,
): Promise<FullAnalysis> {
  const portfolio = calculatePortfolioStats(i);
  const sc = generateScenarios(i, portfolio, i.trials);
  const pts = buildSpendPoints(i);
  const curve: CurvePoint[] = [];

  for (let k = 0; k < pts.length; k++) {
    const res = evaluateSpend(sc, i, pts[k]);
    curve.push({ spend: pts[k], successRate: res.successRate });
    if (k % 3 === 0) {
      onProgress?.(k / pts.length);
      await tick();
      if (cancel?.cancelled) throw new Error("cancelled");
    }
  }
  onProgress?.(1);

  const conf = i.confidence / 100;
  const centralSpend = calculateSafeSpendAtConfidence(curve, conf);
  const lowerSpend = calculateSafeSpendAtConfidence(
    curve,
    Math.min(0.99, conf + 0.03),
  );
  const upperSpend = calculateSafeSpendAtConfidence(
    curve,
    Math.max(0.5, conf - 0.03),
  );

  const centralResult = evaluateSpend(sc, i, centralSpend);
  const earliestFail = centralResult.failureYears.length
    ? centralResult.failureYears[0]
    : 0;

  return {
    curve,
    centralResult,
    portfolio,
    trials: i.trials,
    horizonMonths: sc.horizonMonths,
    desiredSpend: i.desiredSpend,
    cpfLifeMonthly: i.cpfLifeMonthly,
    generatedAt: new Date().toISOString(),
    safe: {
      lowerSpend,
      centralSpend,
      upperSpend,
      confidence: i.confidence,
      medianEndBalance: centralResult.medianEndBalance,
      failureProb: 1 - centralResult.successRate,
      earliestFailureYear: earliestFail,
    },
  };
}

/** Synchronous variant (no progress / no yields) for unit tests. */
export function runFullAnalysisSync(i: PlanInputs): FullAnalysis {
  const portfolio = calculatePortfolioStats(i);
  const sc = generateScenarios(i, portfolio, i.trials);
  const pts = buildSpendPoints(i);
  const curve: CurvePoint[] = pts.map((spend) => {
    const res = evaluateSpend(sc, i, spend);
    return { spend, successRate: res.successRate };
  });
  const conf = i.confidence / 100;
  const centralSpend = calculateSafeSpendAtConfidence(curve, conf);
  const lowerSpend = calculateSafeSpendAtConfidence(
    curve,
    Math.min(0.99, conf + 0.03),
  );
  const upperSpend = calculateSafeSpendAtConfidence(
    curve,
    Math.max(0.5, conf - 0.03),
  );
  const centralResult = evaluateSpend(sc, i, centralSpend);
  const earliestFail = centralResult.failureYears.length
    ? centralResult.failureYears[0]
    : 0;
  return {
    curve,
    centralResult,
    portfolio,
    trials: i.trials,
    horizonMonths: sc.horizonMonths,
    desiredSpend: i.desiredSpend,
    cpfLifeMonthly: i.cpfLifeMonthly,
    generatedAt: "1970-01-01T00:00:00.000Z",
    safe: {
      lowerSpend,
      centralSpend,
      upperSpend,
      confidence: i.confidence,
      medianEndBalance: centralResult.medianEndBalance,
      failureProb: 1 - centralResult.successRate,
      earliestFailureYear: earliestFail,
    },
  };
}

/** Helper to build a synthetic curve for `generateSpendConfidenceCurve` callers. */
export function generateSpendConfidenceCurve(i: PlanInputs): CurvePoint[] {
  return runFullAnalysisSync(i).curve;
}
