import { runFullAnalysisSync } from "./curve";
import type { PlanInputs } from "../types";

/**
 * TORNADO / SENSITIVITY ANALYSIS
 *
 * For each factor, we clone the inputs, apply one change, re-run the full
 * analysis, and read off how the central safe-spend moves. Sorted by absolute
 * impact, this produces the classic tornado chart: which assumptions the safe
 * number is most exposed to.
 *
 * "Enough does not hide uncertainty. It shows which assumptions matter most."
 */

export interface SensitivityRow {
  factor: string;
  baseSpend: number;
  adjustedSpend: number;
  impact: number; // S$ per month (adjusted - base)
  direction: "up" | "down" | "flat";
}

export interface SensitivityResult {
  baseSpend: number;
  rows: SensitivityRow[];
}

const clone = (i: PlanInputs): PlanInputs => ({ ...i });

export function runSensitivityAnalysis(i: PlanInputs): SensitivityResult {
  // Sensitivity is comparative, so cap trials for speed. A lower trial count
  // does not change the ranking of which factor matters most.
  const trials = Math.min(i.trials, 2000);
  const working: PlanInputs = { ...i, trials };

  const base = runFullAnalysisSync(working);
  const baseSpend = base.safe.centralSpend;

  type Mutator = { label: string; apply: (p: PlanInputs) => void };

  const mutators: Mutator[] = [
    {
      label: "Investment return −1%",
      apply: (p) => {
        p.equityReturn -= 1;
        p.bondReturn -= 1;
        p.cashReturn -= 1;
      },
    },
    {
      label: "Investment return +1%",
      apply: (p) => {
        p.equityReturn += 1;
        p.bondReturn += 1;
        p.cashReturn += 1;
      },
    },
    {
      label: "Healthcare inflation +2%",
      apply: (p) => {
        p.healthcareInflation += 2;
      },
    },
    {
      label: "Planning horizon +5 yrs",
      apply: (p) => {
        p.horizonAge += 5;
      },
    },
    {
      label: "Planning horizon −5 yrs",
      apply: (p) => {
        p.horizonAge = Math.max(p.age + 1, p.horizonAge - 5);
      },
    },
    {
      label: "Equity allocation → 60%",
      apply: (p) => {
        const cash = p.cashPct;
        p.equityPct = 60;
        p.bondPct = Math.max(0, 100 - 60 - cash);
      },
    },
    {
      label: "Bequest target +S$50k",
      apply: (p) => {
        p.bequestTarget += 50000;
      },
    },
    {
      label: "Spending flexibility 0% → 15%",
      apply: (p) => {
        p.spendingFlexibility = 15;
      },
    },
  ];

  const rows: SensitivityRow[] = mutators.map((m) => {
    const p = clone(working);
    m.apply(p);
    const adjusted = runFullAnalysisSync(p);
    const impact = adjusted.safe.centralSpend - baseSpend;
    return {
      factor: m.label,
      baseSpend,
      adjustedSpend: adjusted.safe.centralSpend,
      impact,
      direction: impact > 25 ? "up" : impact < -25 ? "down" : "flat",
    };
  });

  // Sort by absolute impact, largest first (tornado ordering).
  rows.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return { baseSpend, rows };
}
