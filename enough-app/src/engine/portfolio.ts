import type { PlanInputs } from "../types";

/**
 * Weighted portfolio expected return and volatility from the asset allocation.
 *
 * - Expected return is the allocation-weighted average of the asset-class returns.
 * - Volatility is the square root of the allocation-weighted sum of variances
 *   (we assume zero cross-class correlation — a standard simplification for an
 *   educational model; it slightly understates true portfolio volatility, which
 *   errs toward conservative safe-spend estimates).
 */
export interface PortfolioStats {
  expectedReturn: number; // annual, decimal (e.g. 0.041 = 4.1%)
  volatility: number; // annual std-dev, decimal
}

export function calculatePortfolioStats(i: PlanInputs): PortfolioStats {
  const total = i.cashPct + i.bondPct + i.equityPct;
  const denom = total > 0 ? total : 1;
  const wCash = i.cashPct / denom;
  const wBond = i.bondPct / denom;
  const wEquity = i.equityPct / denom;

  const expectedReturn =
    wCash * (i.cashReturn / 100) +
    wBond * (i.bondReturn / 100) +
    wEquity * (i.equityReturn / 100);

  const variance =
    Math.pow((wCash * i.cashVol) / 100, 2) +
    Math.pow((wBond * i.bondVol) / 100, 2) +
    Math.pow((wEquity * i.equityVol) / 100, 2);

  return { expectedReturn, volatility: Math.sqrt(variance) };
}
