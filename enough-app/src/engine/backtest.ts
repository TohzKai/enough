import type { PlanInputs } from "../types";

/**
 * STYLISED HISTORICAL BACKTEST
 * ----------------------------
 * Not an academic-grade backtest. The goal is methodological discipline: show
 * whether Enough's guardrail rule would have WARNED a retiree who started in a
 * bad market year (2000 dot-com, 2008 GFC, 2020 COVID) compared with rigid
 * fixed spending.
 *
 * `HISTORICAL_60_40` is an ILLUSTRATIVE nominal total-return series for a global
 * ~60/40 portfolio (estimates rounded from broad public-market indices). It is
 * labelled as estimates everywhere it appears. The point is the SEQUENCE
 * (bad years early vs late), not precise index values.
 */
export const HISTORICAL_60_40: Record<number, number> = {
  2000: -6,
  2001: -5,
  2002: -9,
  2003: 20,
  2004: 9,
  2005: 5,
  2006: 11,
  2007: 6,
  2008: -20,
  2009: 19,
  2010: 13,
  2011: 1,
  2012: 12,
  2013: 18,
  2014: 10,
  2015: -1,
  2016: 8,
  2017: 14,
  2018: -3,
  2019: 15,
  2020: 12,
  2021: 12,
  2022: -11,
  2023: 12,
};

export const BACKTEST_YEARS = [2000, 2008, 2020];

export interface BacktestOutcome {
  endingBalance: number;
  depletedYear: number | null; // 1-indexed year within retirement, or null
  warningTriggeredYear: number | null; // guardrail first fired
  finalSpend: number; // final monthly spend under the strategy
}

export interface BacktestRow {
  startYear: number;
  yearsSimulated: number;
  fixed: BacktestOutcome;
  guardrail: BacktestOutcome;
  verdict: "fixed-fails-guardrails-survive" | "both-survive" | "both-fail";
}

/** Run one retiree through a historical window starting at `startYear`,
 *  comparing fixed inflation-adjusted spending vs Enough's guardrail rule. */
export function runBacktest(
  i: PlanInputs,
  startYear: number,
  windowYears = 20,
): BacktestRow {
  const startAssets =
    i.cash + i.investments + i.srs - (i.contingencyReserve ?? 0);
  const floor = i.cpfLifeMonthly;
  const startSpend = Math.min(
    i.desiredSpend,
    i.essentialSpend +
      i.discretionarySpend +
      i.healthcareSpend +
      i.familySupport,
  );
  const inflation = i.generalInflation / 100;
  const discretionaryShare =
    i.discretionarySpend /
    Math.max(
      1,
      i.essentialSpend +
        i.discretionarySpend +
        i.healthcareSpend +
        i.familySupport,
    );

  const years: number[] = [];
  for (let k = 0; k < windowYears; k++) {
    const y = startYear + k;
    if (y in HISTORICAL_60_40) years.push(y);
  }
  const n = years.length;

  function simulate(guardrail: boolean): BacktestOutcome {
    let bal = Math.max(0, startAssets);
    let spend = startSpend;
    let depletedYear: number | null = null;
    let warningTriggeredYear: number | null = null;
    const peak = bal;
    for (let k = 0; k < n; k++) {
      const r = HISTORICAL_60_40[years[k]] / 100;
      // Guardrail: if balance < 75% of peak, warn and trim discretionary 10%.
      if (guardrail && bal < peak * 0.75 && warningTriggeredYear === null) {
        warningTriggeredYear = k + 1;
      }
      if (guardrail && bal < peak * 0.75) {
        spend =
          startSpend *
          Math.pow(1 + inflation, k) *
          (1 - discretionaryShare * 0.1);
      } else {
        spend = startSpend * Math.pow(1 + inflation, k);
      }
      const annualWithdraw = Math.max(0, spend - floor) * 12;
      bal = bal * (1 + r) - annualWithdraw;
      if (bal < 0) {
        bal = 0;
        if (depletedYear === null) depletedYear = k + 1;
      }
    }
    return {
      endingBalance: Math.round(bal),
      depletedYear,
      warningTriggeredYear,
      finalSpend: Math.round(spend),
    };
  }

  const fixed = simulate(false);
  const guardrail = simulate(true);

  let verdict: BacktestRow["verdict"] = "both-survive";
  if (fixed.depletedYear !== null && guardrail.depletedYear === null) {
    verdict = "fixed-fails-guardrails-survive";
  } else if (fixed.depletedYear !== null && guardrail.depletedYear !== null) {
    verdict = "both-fail";
  }

  return { startYear, yearsSimulated: n, fixed, guardrail, verdict };
}

/** Run the backtest across the three landmark start years. */
export function runBacktestSuite(
  i: PlanInputs,
  windowYears = 20,
): BacktestRow[] {
  return BACKTEST_YEARS.map((y) => runBacktest(i, y, windowYears));
}
