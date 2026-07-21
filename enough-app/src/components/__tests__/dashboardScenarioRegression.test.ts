/**
 * Regression tests for three production defects:
 *  - Issue 1: CPF LIFE / Desired spend hardcoded to S$0 in Dashboard overview
 *  - Issue 2: Market-sequence cards all labelled "Bad market late"
 *  - Issue 3: CPF LIFE gap-closing language shows unsupported surplus
 *
 * Tests are source-level (file reads) plus a behavioural check on the
 * engine-driven Row computation. They probe the deliverables without
 * mocking React or spinning up the engine integration surface.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { GAP_ACTIONS } from "../../data/gapActions";
import { runFullAnalysisSync } from "../../engine";
import { mrTanInputs } from "../../data/mrTan";

const SRC = (...p: string[]) => resolve(__dirname, "..", "..", ...p);

const DASHBOARD = readFileSync(SRC("pages", "Dashboard.tsx"), "utf8");
const SCENARIO_LAB = readFileSync(
  SRC("components", "results", "ScenarioLab.tsx"),
  "utf8",
);
const GAP_CLOSER = readFileSync(SRC("components", "GapCloser.tsx"), "utf8");
const EN_SG = readFileSync(SRC("i18n", "locales", "en-SG.ts"), "utf8");
const ZH_SG = readFileSync(SRC("i18n", "locales", "zh-SG.ts"), "utf8");
const MS_SG = readFileSync(SRC("i18n", "locales", "ms-SG.ts"), "utf8");
const TA_SG = readFileSync(SRC("i18n", "locales", "ta-SG.ts"), "utf8");

describe("Issue 1 — OverviewTab no longer hardcodes S$0", () => {
  it("OverviewTab accepts cpfFloor and desiredSpend as props", () => {
    expect(DASHBOARD).toMatch(
      /function OverviewTab\(\s*\{[^}]*cpfFloor[^}]*desiredSpend[^}]*gap[^}]*\}/,
    );
  });

  it("Dashboard passes inputs.cpfLifeMonthly and inputs.desiredSpend into OverviewTab", () => {
    // The callsite must bind both inputs to the new props.
    expect(DASHBOARD).toMatch(/cpfFloor=\{inputs\.cpfLifeMonthly\}/);
    expect(DASHBOARD).toMatch(/desiredSpend=\{inputs\.desiredSpend\}/);
  });

  it("OverviewTab does not contain formatMoneyMonth(0) for CPF LIFE or desired spend", () => {
    // Two formatMoneyMonth(0) callsites existed in the old code — one each
    // for CPF LIFE floor and desired spend. Neither should remain.
    expect(DASHBOARD).not.toMatch(/formatMoneyMonth\(0\)/);
  });

  it("OverviewTab renders cpfFloor and desiredSpend values into the cards", () => {
    expect(DASHBOARD).toMatch(/formatMoneyMonth\(cpfFloor\)/);
    expect(DASHBOARD).toMatch(/formatMoneyMonth\(desiredSpend\)/);
  });
});

describe("Issue 2 — Market-sequence cards resolve three distinct scenarios", () => {
  it("derives scenarioType from the engine's actual labels (not 'steady'/'badEarly')", () => {
    // The bug was comparing p.label to "steady" and "badEarly", but the
    // engine emits "Steady market" and "Bad market EARLY". The fix maps
    // the actual labels to scenarioType.
    expect(SCENARIO_LAB).toMatch(/p\.label === "Steady market"/);
    expect(SCENARIO_LAB).toMatch(/p\.label === "Bad market EARLY"/);
    expect(SCENARIO_LAB).not.toMatch(/p\.label === "steady"/);
    expect(SCENARIO_LAB).not.toMatch(/p\.label === "badEarly"/);
  });

  it("does not render the fabricated S$0 safer-spend impact panel", () => {
    // The old code passed `result` with impact=0 into ScenarioModule.
    // The new code omits the result prop and shows portfolio-path metrics.
    expect(SCENARIO_LAB).not.toMatch(/impact:\s*0/);
    // Anchor on the function declaration so we don't capture the parent
    // callsite by mistake.
    const fnStart = SCENARIO_LAB.indexOf("function MarketSequenceModule(");
    expect(fnStart, "MarketSequenceModule definition found").toBeGreaterThan(
      -1,
    );
    const fnEnd = SCENARIO_LAB.indexOf("/* ---------- Module 4", fnStart);
    const fnBody =
      fnEnd === -1
        ? SCENARIO_LAB.slice(fnStart)
        : SCENARIO_LAB.slice(fnStart, fnEnd);
    expect(fnBody).toMatch(/<ScenarioModule/);
    expect(fnBody).not.toMatch(/result=\{result\}/);
  });

  it("renders endingBalance, depletedAtYear, and avgReturnPct per path", () => {
    expect(SCENARIO_LAB).toMatch(/formatMoney\(p\.endingBalance\)/);
    expect(SCENARIO_LAB).toMatch(/p\.depletedAtYear === null/);
    expect(SCENARIO_LAB).toMatch(/p\.avgReturnPct\.toFixed\(1\)/);
  });

  it("renders the 'early loss' insight below the cards", () => {
    expect(SCENARIO_LAB).toMatch(/sequenceRiskConclusion/);
  });

  it("every locale declares the new sequenceRisk result-metric keys", () => {
    const keys = [
      "sequenceRiskEndingBalance",
      "sequenceRiskLastsToAge",
      "sequenceRiskYes",
      "sequenceRiskNo",
      "sequenceRiskDepletion",
      "sequenceRiskNotDepleted",
      "sequenceRiskDepletedAt",
      "sequenceRiskAvgReturn",
      "sequenceRiskConclusion",
    ];
    for (const k of keys) {
      expect(EN_SG, `en-SG.${k}`).toMatch(new RegExp(`${k}\\s*:`));
      expect(ZH_SG, `zh-SG.${k}`).toMatch(new RegExp(`${k}\\s*:`));
      expect(MS_SG, `ms-SG.${k}`).toMatch(new RegExp(`${k}\\s*:`));
      expect(TA_SG, `ta-SG.${k}`).toMatch(new RegExp(`${k}\\s*:`));
    }
  });
});

describe("Issue 3 — CPF LIFE gap-closing language reflects actual engine output", () => {
  it("Row interface exposes gapClosed, safeDelta, remainingGap, surplus", () => {
    expect(GAP_CLOSER).toMatch(/gapClosed:\s*number/);
    expect(GAP_CLOSER).toMatch(/safeDelta:\s*number/);
    expect(GAP_CLOSER).toMatch(/remainingGap:\s*number/);
    expect(GAP_CLOSER).toMatch(/surplus:\s*number/);
  });

  it("computes revisedSafeSpend, newGap and surplus inside GAP_ACTIONS.map", () => {
    expect(GAP_CLOSER).toMatch(/revisedSafeSpend\s*=\s*r\.safe\.centralSpend/);
    expect(GAP_CLOSER).toMatch(
      /Math\.max\(\s*0,\s*Math\.round\(revisedSafeSpend\s*-\s*r\.desiredSpend\)/,
    );
    expect(GAP_CLOSER).toMatch(/remainingGap:\s*Math\.round\(newGap\)/);
  });

  it("shows the 'gap reduced by' / 'amount remains' copy for the CPF action when remainingGap > 0", () => {
    expect(GAP_CLOSER).toMatch(/r\.key === "cpf-floor"/);
    expect(GAP_CLOSER).toMatch(/r\.remainingGap > 0/);
    expect(GAP_CLOSER).toMatch(/gapActions\.gapReducedBy/);
    expect(GAP_CLOSER).toMatch(/gapActions\.amountRemains/);
  });

  it("only shows the surplus / fully-covered copy when remainingGap === 0 AND surplus > 0", () => {
    expect(GAP_CLOSER).toMatch(/r\.remainingGap === 0\s*&&\s*r\.surplus > 0/);
    expect(GAP_CLOSER).toMatch(/gapActions\.desiredFullyCovered/);
    expect(GAP_CLOSER).toMatch(/gapActions\.estimatedSurplus/);
  });

  it("keeps the original 'closes S$X of the gap' copy for every other action", () => {
    // The fallback branch must still reference common.closes + common.ofTheGap.
    expect(GAP_CLOSER).toMatch(/common\.closes/);
    expect(GAP_CLOSER).toMatch(/common\.ofTheGap/);
  });

  it("every locale declares the four new gapActions keys", () => {
    const keys = [
      "gapReducedBy",
      "amountRemains",
      "desiredFullyCovered",
      "estimatedSurplus",
    ];
    for (const k of keys) {
      expect(EN_SG, `en-SG.gapActions.${k}`).toMatch(new RegExp(`${k}\\s*:`));
      expect(ZH_SG, `zh-SG.gapActions.${k}`).toMatch(new RegExp(`${k}\\s*:`));
      expect(MS_SG, `ms-SG.gapActions.${k}`).toMatch(new RegExp(`${k}\\s*:`));
      expect(TA_SG, `ta-SG.gapActions.${k}`).toMatch(new RegExp(`${k}\\s*:`));
    }
  });
});

describe("Issue 3 — CPF-floor action yields the worked-example numbers", () => {
  // The current engine models only an illustrative S$400/month CPF LIFE
  // increase. That lifts safer spend by ~S$283/month, leaving ~S$669/month
  // of the original S$952 gap. There is no surplus in this case.
  it("matches ~S$283 gapClosed, ~S$669 remainingGap, S$0 surplus (±5)", () => {
    const fast = { ...mrTanInputs, trials: 1000 };
    const base = runFullAnalysisSync(fast);
    const baseSafe = base.safe.centralSpend;
    const baselineGap = Math.max(0, base.desiredSpend - baseSafe);

    const cpfAction = GAP_ACTIONS.find((a) => a.key === "cpf-floor");
    expect(cpfAction, "cpf-floor action exists").toBeDefined();

    const after = runFullAnalysisSync({
      ...fast,
      ...cpfAction!.buildOverride(fast),
    });
    const revisedSafeSpend = after.safe.centralSpend;
    const newGap = Math.max(0, after.desiredSpend - revisedSafeSpend);
    const gapClosed = Math.max(0, Math.round(baselineGap - newGap));
    const remainingGap = Math.round(newGap);
    const surplus = Math.max(
      0,
      Math.round(revisedSafeSpend - after.desiredSpend),
    );

    expect(gapClosed).toBeGreaterThan(250);
    expect(gapClosed).toBeLessThan(320);
    expect(remainingGap).toBeGreaterThan(630);
    expect(remainingGap).toBeLessThan(710);
    expect(surplus).toBe(0);
  });
});
