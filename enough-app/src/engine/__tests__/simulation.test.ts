import { describe, it, expect } from "vitest";
import { mrTanInputs } from "../../data/mrTan";
import { PRESETS, withPreset } from "../../data/presets";
import {
  calculatePortfolioStats,
  runMonteCarloSimulation,
  runFullAnalysisSync,
  calculateSafeSpendAtConfidence,
  successAt,
  runSensitivityAnalysis,
  generateSequenceRiskScenario,
  runBacktestSuite,
  planningHorizonMonths,
  cpfStartMonthly,
  cpfGrowthAnnual,
  effectiveStartAssets,
  effectiveMonthlyFloor,
  CPF_ESCALATING_START_FACTOR,
} from "../index";

/* ---------- CPF LIFE modelling (Critical fix 1) ---------- */

describe("CPF LIFE plans", () => {
  it("Standard payout is level nominal (0% growth)", () => {
    const i = {
      ...mrTanInputs,
      cpfPlan: "Standard" as const,
      payoutGrowthAnnual: 0,
    };
    expect(cpfGrowthAnnual(i)).toBe(0);
    expect(cpfStartMonthly(i)).toBe(i.cpfLifeMonthly);
  });

  it("Basic payout is level nominal (0% growth)", () => {
    const i = {
      ...mrTanInputs,
      cpfPlan: "Basic" as const,
      payoutGrowthAnnual: 0,
    };
    expect(cpfGrowthAnnual(i)).toBe(0);
  });

  it("Escalating grows 2%/yr AND starts lower than Standard", () => {
    const i = {
      ...mrTanInputs,
      cpfPlan: "Escalating" as const,
      payoutGrowthAnnual: 2,
    };
    expect(cpfGrowthAnnual(i)).toBe(2);
    expect(cpfStartMonthly(i)).toBeLessThan(i.cpfLifeMonthly);
    expect(cpfStartMonthly(i)).toBeCloseTo(
      i.cpfLifeMonthly * CPF_ESCALATING_START_FACTOR,
      2,
    );
  });

  it("CPF Standard is NOT inflation-indexed (no general-inflation growth added)", () => {
    // Even with high general inflation, Standard CPF growth stays 0.
    const i = {
      ...mrTanInputs,
      cpfPlan: "Standard" as const,
      payoutGrowthAnnual: 0,
      generalInflation: 5,
    };
    expect(cpfGrowthAnnual(i)).toBe(0);
  });
});

/* ---------- directional behaviour ---------- */

describe("model direction", () => {
  it("higher inflation lowers the safer spend", () => {
    const lo = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      generalInflation: 2,
    });
    const hi = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      generalInflation: 4,
    });
    expect(hi.safe.centralSpend).toBeLessThanOrEqual(lo.safe.centralSpend + 1);
  });

  it("longer planning horizon lowers the safer spend", () => {
    const short = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      horizonAge: 90,
    });
    const long = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      horizonAge: 100,
    });
    expect(long.safe.centralSpend).toBeLessThanOrEqual(
      short.safe.centralSpend + 1,
    );
  });

  it("higher bequest target lowers the safer spend", () => {
    const none = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      bequestTarget: 0,
    });
    const withBeq = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      bequestTarget: 80000,
    });
    expect(withBeq.safe.centralSpend).toBeLessThanOrEqual(
      none.safe.centralSpend + 1,
    );
  });

  it("raising desired spend does not mechanically raise the safe spend", () => {
    // The safe spend is derived from the curve, not from desiredSpend.
    const a = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      desiredSpend: 2000,
    });
    const b = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1500,
      desiredSpend: 3000,
    });
    expect(Math.abs(a.safe.centralSpend - b.safe.centralSpend)).toBeLessThan(
      50,
    );
  });

  it("the spend-confidence curve is monotonic non-increasing", () => {
    const a = runFullAnalysisSync({ ...mrTanInputs, trials: 1500 });
    for (let k = 1; k < a.curve.length; k++) {
      expect(a.curve[k].successRate).toBeLessThanOrEqual(
        a.curve[k - 1].successRate + 0.002,
      );
    }
  });
});

/* ---------- presets spread (Critical fix 2) ---------- */

describe("assumption presets", () => {
  it("optimistic > base > conservative safer spend", () => {
    const results = PRESETS.map((p) =>
      runFullAnalysisSync(withPreset({ ...mrTanInputs, trials: 1500 }, p.key)),
    );
    const byKey = Object.fromEntries(
      results.map((r, idx) => [PRESETS[idx].key, r.safe.centralSpend]),
    );
    expect(byKey.optimistic).toBeGreaterThanOrEqual(byKey.base);
    expect(byKey.base).toBeGreaterThanOrEqual(byKey.conservative);
  });
});

/* ---------- unused inputs now affect the model (Critical fix 7) ---------- */

describe("inputs affect the model", () => {
  it("a spouse extends the planning horizon", () => {
    const solo = planningHorizonMonths({
      ...mrTanInputs,
      spouseIncluded: false,
    });
    const joint = planningHorizonMonths({
      ...mrTanInputs,
      spouseIncluded: true,
      spouseAge: 62, // spouse reaches 95 in 33 yrs > primary's 30
    });
    expect(joint).toBeGreaterThan(solo);
  });

  it("female gender extends the horizon", () => {
    const male = planningHorizonMonths({ ...mrTanInputs, gender: "male" });
    const female = planningHorizonMonths({ ...mrTanInputs, gender: "female" });
    expect(female).toBeGreaterThan(male);
  });

  it("room rental raises the monthly income floor", () => {
    const base = effectiveMonthlyFloor(mrTanInputs);
    const withRent = effectiveMonthlyFloor({
      ...mrTanInputs,
      monetisation: "room-rental",
      monetisationMonthlyIncome: 500,
    });
    expect(withRent).toBeGreaterThan(base);
  });

  it("lease buyback adds capital to investable assets", () => {
    const base = effectiveStartAssets(mrTanInputs);
    const withBuyback = effectiveStartAssets({
      ...mrTanInputs,
      monetisationCapitalInjection: 60000,
    });
    expect(withBuyback).toBeGreaterThan(base);
  });

  it("contingency reserve reduces investable assets", () => {
    const base = effectiveStartAssets({
      ...mrTanInputs,
      contingencyReserve: 0,
    });
    const withReserve = effectiveStartAssets({
      ...mrTanInputs,
      contingencyReserve: 20000,
    });
    expect(withReserve).toBeLessThan(base);
  });

  it("a monthly housing cost is wired into spending (it changes the result)", () => {
    const noHousing = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1000,
      monthlyHousingCost: 0,
    });
    const withHousing = runFullAnalysisSync({
      ...mrTanInputs,
      trials: 1000,
      monthlyHousingCost: 800,
    });
    // Housing is a spending component, so it changes the safer-spend result and
    // the safe total must be at least enough to cover the housing line.
    expect(withHousing.safe.centralSpend).not.toBe(noHousing.safe.centralSpend);
    expect(withHousing.safe.centralSpend).toBeGreaterThanOrEqual(800);
    expect(Number.isFinite(withHousing.safe.centralSpend)).toBe(true);
  });
});

/* ---------- Monte Carlo basics ---------- */

describe("Monte Carlo basics", () => {
  it("is deterministic for a fixed seed", () => {
    const s = calculatePortfolioStats(mrTanInputs);
    const a = runMonteCarloSimulation(mrTanInputs, s, 1200, 500);
    const b = runMonteCarloSimulation(mrTanInputs, s, 1200, 500);
    expect(a.successRate).toBe(b.successRate);
  });

  it("success probability decreases as spending rises", () => {
    const s = calculatePortfolioStats(mrTanInputs);
    const lo = runMonteCarloSimulation(mrTanInputs, s, 1000, 1000).successRate;
    const hi = runMonteCarloSimulation(mrTanInputs, s, 2000, 1000).successRate;
    expect(lo).toBeGreaterThanOrEqual(hi);
  });

  it("produces a coherent safe-spend range", () => {
    const a = runFullAnalysisSync({ ...mrTanInputs, trials: 1500 });
    expect(a.safe.lowerSpend).toBeLessThanOrEqual(a.safe.centralSpend);
    expect(a.safe.centralSpend).toBeLessThanOrEqual(a.safe.upperSpend);
    // safe spend at higher confidence is no higher than at lower confidence
    const hi = calculateSafeSpendAtConfidence(a.curve, 0.95);
    const lo = calculateSafeSpendAtConfidence(a.curve, 0.8);
    expect(hi).toBeLessThanOrEqual(lo + 1);
    expect(successAt(a.curve, a.curve[0].spend)).toBeGreaterThanOrEqual(0);
  });
});

/* ---------- sensitivity / sequence / backtest ---------- */

describe("sensitivity, sequence, backtest", () => {
  it("sensitivity returns ranked finite rows", () => {
    const r = runSensitivityAnalysis({ ...mrTanInputs, trials: 1000 });
    expect(r.baseSpend).toBeGreaterThan(0);
    expect(r.rows.length).toBeGreaterThanOrEqual(8);
    for (const row of r.rows)
      expect(Number.isFinite(row.adjustedSpend)).toBe(true);
    for (let i = 1; i < r.rows.length; i++) {
      expect(Math.abs(r.rows[i - 1].impact)).toBeGreaterThanOrEqual(
        Math.abs(r.rows[i].impact) - 1,
      );
    }
  });

  it("sequence-risk paths share an average return but diverge", () => {
    const r = generateSequenceRiskScenario(mrTanInputs);
    expect(r.paths).toHaveLength(3);
    const avgs = r.paths.map((p) => p.avgReturnPct);
    expect(Math.max(...avgs) - Math.min(...avgs)).toBeLessThan(0.6);
    const early = r.paths.find((p) => p.label === "Bad market EARLY")!;
    const late = r.paths.find((p) => p.label === "Bad market LATE")!;
    expect(early.endingBalance).toBeLessThanOrEqual(late.endingBalance + 1);
  });

  it("backtest runs the three landmark years and classifies verdicts", () => {
    const rows = runBacktestSuite(mrTanInputs, 20);
    expect(rows.map((r) => r.startYear)).toEqual([2000, 2008, 2020]);
    for (const r of rows) {
      expect(r.fixed.endingBalance).toBeGreaterThanOrEqual(0);
      expect(r.guardrail.endingBalance).toBeGreaterThanOrEqual(0);
    }
  });
});
