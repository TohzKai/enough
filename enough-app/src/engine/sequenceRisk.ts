import { calculatePortfolioStats } from "./portfolio";
import type { PlanInputs } from "../types";

/**
 * SEQUENCE-OF-RETURNS RISK
 *
 * The defining risk of decumulation: a bad market EARLY in retirement is far more
 * dangerous than the same bad market LATE, because withdrawals are taken out of a
 * depressed portfolio — "selling low" — which the portfolio may never recover from.
 *
 * To make this concrete we build THREE return paths with the SAME long-run average
 * return, differing only in WHEN a market shock lands. We then run the same
 * withdrawal plan through each and show the ending balances diverge.
 *
 * All three paths share an identical arithmetic mean monthly return (the shock is
 * redistributed as compensation outside the shock window), so the ONLY variable is
 * sequence — exactly the lesson.
 */

export interface SeqPath {
  label: string;
  blurb: string;
  /** monthly portfolio balance trajectory, length = horizonMonths + 1 */
  balance: number[];
  depletedAtYear: number | null; // year balance hit zero, if ever
  endingBalance: number;
  avgReturnPct: number; // annualised, for the "same average" proof
}

export interface SequenceRiskResult {
  paths: SeqPath[];
  startAssets: number;
  baseSpend: number;
  expectedReturnPct: number;
}

const MONTHS = 12;

function buildMonthlyReturns(
  horizonMonths: number,
  avgM: number,
  volM: number,
  shockStartMonth: number,
  shockLenMonths: number,
  shockDepthPerMonth: number,
  seedNoise: number,
): number[] {
  // Mild seeded noise so the path looks like a market, not a flat line.
  let s = seedNoise >>> 0;
  const noise = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296 - 0.5; // [-0.5, 0.5)
  };

  const r: number[] = new Array(horizonMonths);
  let totalShock = 0;
  let shocked = 0;
  for (let m = 0; m < horizonMonths; m++) {
    const inShock =
      m >= shockStartMonth && m < shockStartMonth + shockLenMonths;
    if (inShock) {
      r[m] = avgM - shockDepthPerMonth + volM * noise() * 0.5;
      totalShock += shockDepthPerMonth;
      shocked++;
    } else {
      r[m] = avgM + volM * noise();
    }
  }
  // Compensate outside the shock window so the arithmetic mean is preserved.
  const remaining = horizonMonths - shocked;
  const comp = remaining > 0 ? totalShock / remaining : 0;
  for (let m = 0; m < horizonMonths; m++) {
    const inShock =
      m >= shockStartMonth && m < shockStartMonth + shockLenMonths;
    if (!inShock) r[m] += comp;
  }
  return r;
}

function simulate(
  returns: number[],
  startAssets: number,
  baseSpend: number,
  cpfLifeMonthly: number,
  genM: number,
  bequest: number,
): { balance: number[]; depletedAtYear: number | null; endingBalance: number } {
  const balance: number[] = [startAssets];
  let bal = startAssets;
  let withdrawnThisYrSpend = baseSpend;
  let spendG = 1;
  let cpfG = 1;
  let depletedAtYear: number | null = null;
  for (let m = 0; m < returns.length; m++) {
    spendG *= 1 + genM;
    cpfG *= 1; // CPF Standard = level nominal
    const spend = withdrawnThisYrSpend * spendG;
    const cpf = cpfLifeMonthly * cpfG;
    let withdraw = spend - cpf;
    if (withdraw < 0) withdraw = 0;
    bal = bal * (1 + returns[m]) - withdraw;
    if (bal < 0) {
      bal = 0;
      if (depletedAtYear === null) depletedAtYear = Math.floor(m / MONTHS) + 1;
    }
    balance.push(bal);
  }
  // Apply bequest as a soft floor narrative (ending balance shown as-is).
  void bequest;
  return { balance, depletedAtYear, endingBalance: bal };
}

export function generateSequenceRiskScenario(
  i: PlanInputs,
): SequenceRiskResult {
  const portfolio = calculatePortfolioStats(i);
  const avgM = portfolio.expectedReturn / MONTHS;
  const volM = portfolio.volatility / Math.sqrt(MONTHS);
  const horizonMonths = Math.max(12, (i.horizonAge - i.age) * MONTHS);
  const startAssets = i.cash + i.investments + i.srs;
  const baseSpend =
    i.essentialSpend +
    i.discretionarySpend +
    i.healthcareSpend +
    i.familySupport;
  const genM = Math.pow(1 + i.generalInflation / 100, 1 / MONTHS) - 1;

  // A sustained ~bear-market drawdown: ~1.5%/month loss for 12 months.
  const shockLen = 12;
  const shockDepth = 0.015;
  const earlyStart = 0; // year 1
  const lateStart = Math.max(0, horizonMonths - 13 * 12 - shockLen); // around year 13

  const normalRet = buildMonthlyReturns(
    horizonMonths,
    avgM,
    volM,
    -1,
    0,
    0,
    i.seed + 1,
  );
  const earlyRet = buildMonthlyReturns(
    horizonMonths,
    avgM,
    volM,
    earlyStart,
    shockLen,
    shockDepth,
    i.seed + 1,
  );
  const lateRet = buildMonthlyReturns(
    horizonMonths,
    avgM,
    volM,
    lateStart,
    shockLen,
    shockDepth,
    i.seed + 1,
  );

  const meanAnnualised = (r: number[]) => {
    const m = r.reduce((a, b) => a + b, 0) / r.length;
    return (Math.pow(1 + m, MONTHS) - 1) * 100;
  };

  const paths: SeqPath[] = [
    {
      label: "Steady market",
      blurb: "Returns arrive close to the long-run average throughout.",
      ...simulate(
        normalRet,
        startAssets,
        baseSpend,
        i.cpfLifeMonthly,
        genM,
        i.bequestTarget,
      ),
      avgReturnPct: meanAnnualised(normalRet),
    },
    {
      label: "Bad market EARLY",
      blurb:
        "A 12-month bear market in years 1–2, with the same long-run average. Withdrawals hit a depressed portfolio.",
      ...simulate(
        earlyRet,
        startAssets,
        baseSpend,
        i.cpfLifeMonthly,
        genM,
        i.bequestTarget,
      ),
      avgReturnPct: meanAnnualised(earlyRet),
    },
    {
      label: "Bad market LATE",
      blurb:
        "The same bear market, but around year 13. Far less damage — the portfolio is no longer being drained by withdrawals while depressed.",
      ...simulate(
        lateRet,
        startAssets,
        baseSpend,
        i.cpfLifeMonthly,
        genM,
        i.bequestTarget,
      ),
      avgReturnPct: meanAnnualised(lateRet),
    },
  ];

  return {
    paths,
    startAssets,
    baseSpend,
    expectedReturnPct: portfolio.expectedReturn * 100,
  };
}
