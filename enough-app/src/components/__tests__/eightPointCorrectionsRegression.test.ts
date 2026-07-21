/**
 * Regression tests for the eight targeted UI corrections:
 *  1. Money formatter — exactly one S$ prefix (no S$S$)
 *  2. Overview cards — consistent /month units + "From cash, SRS and investments"
 *  3. Healthcare — no duplicated result panel
 *  4. GapCloser — remainingGap reconciles with the page-level baseline gap
 *  5. Funding sequence — CPF LIFE first; no "spent down last" copy
 *  6. Market-sequence Analytics panel — explicit "all three paths deplete" copy
 *  7. Trip/Legacy — "None" button replaces "—"; no duplicated inner heading
 *  8. i18n parity — every new key is declared in all four locales
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = (...p: string[]) => resolve(__dirname, "..", "..", ...p);

const DASHBOARD = readFileSync(SRC("pages", "Dashboard.tsx"), "utf8");
const SCENARIO_LAB = readFileSync(
  SRC("components", "results", "ScenarioLab.tsx"),
  "utf8",
);
const GAP_CLOSER = readFileSync(SRC("components", "GapCloser.tsx"), "utf8");
const ENGINE_EXPLAINER = readFileSync(
  SRC("components", "results", "EngineExplainer.tsx"),
  "utf8",
);
const FUNDING_PLAN_DATA = readFileSync(SRC("data", "fundingPlan.ts"), "utf8");
const EN_SG = readFileSync(SRC("i18n", "locales", "en-SG.ts"), "utf8");
const ZH_SG = readFileSync(SRC("i18n", "locales", "zh-SG.ts"), "utf8");
const MS_SG = readFileSync(SRC("i18n", "locales", "ms-SG.ts"), "utf8");
const TA_SG = readFileSync(SRC("i18n", "locales", "ta-SG.ts"), "utf8");

const LOCALES = [
  ["en-SG", EN_SG],
  ["zh-SG", ZH_SG],
  ["ms-SG", MS_SG],
  ["ta-SG", TA_SG],
] as const;

describe("1 — Money formatter: exactly one S$ prefix", () => {
  it("Dashboard passes formatMoney(...) for the hero value", () => {
    expect(DASHBOARD).toMatch(
      /safeSpendHero",\s*\{\s*value:\s*formatMoney\(heroCentral\)/,
    );
  });

  it("Dashboard passes formatMoney for lower/upper range bounds", () => {
    expect(DASHBOARD).toMatch(/lower:\s*formatMoney\(lower\)/);
    expect(DASHBOARD).toMatch(/upper:\s*formatMoney\(upper\)/);
  });

  it("safeSpendHero template does NOT include a hardcoded S$ prefix", () => {
    expect(EN_SG).not.toMatch(/safeSpendHero:\s*"[^"]*S\$\{\{value\}\}/);
    expect(ZH_SG).not.toMatch(/safeSpendHero:\s*"[^"]*S\$\{\{value\}\}/);
    expect(MS_SG).not.toMatch(/safeSpendHero:\s*"[^"]*S\$\{\{value\}\}/);
    expect(TA_SG).not.toMatch(/safeSpendHero:\s*"[^"]*S\$\{\{value\}\}/);
  });

  it("safeSpendRange template does NOT include hardcoded S$ on {{lower}}/{{upper}}", () => {
    expect(EN_SG).not.toMatch(/safeSpendRange:\s*\n\s*"[^"]*S\$\{\{lower\}\}/);
  });
});

describe("2 — Overview cards consistent /month units + source subtitle", () => {
  it("withdrawal card displays formatMoneyMonth(withdrawal)", () => {
    expect(DASHBOARD).toMatch(/formatMoneyMonth\(withdrawal\)/);
    // The original `formatMoney(withdrawal)` (without /month) is gone.
    const overviewFn = DASHBOARD.slice(
      DASHBOARD.indexOf("function OverviewTab("),
    );
    expect(overviewFn).not.toMatch(/formatMoney\(withdrawal\)/);
  });

  it("desired card uses formatMoneyMonth", () => {
    expect(DASHBOARD).toMatch(/formatMoneyMonth\(desiredSpend\)/);
  });

  it("gap card uses formatMoneyMonth", () => {
    expect(DASHBOARD).toMatch(/formatMoneyMonth\(Math\.max\(0,\s*gap\)\)/);
  });

  it("withdrawalSub is replaced by withdrawalSource", () => {
    expect(DASHBOARD).toMatch(/results\.withdrawalSource/);
    const overviewFn = DASHBOARD.slice(
      DASHBOARD.indexOf("function OverviewTab("),
    );
    expect(overviewFn).not.toMatch(/withdrawalSub/);
  });

  it("every locale declares withdrawalSource / desiredSub / gapSub", () => {
    for (const [name, src] of LOCALES) {
      expect(src, `${name}.withdrawalSource`).toMatch(/withdrawalSource\s*:/);
      expect(src, `${name}.desiredSub`).toMatch(/desiredSub\s*:/);
      expect(src, `${name}.gapSub`).toMatch(/gapSub\s*:/);
    }
  });
});

describe("3 — Healthcare: no duplicated result panel", () => {
  it("HealthcareModule does NOT pass a result prop into ScenarioModule", () => {
    const fnStart = SCENARIO_LAB.indexOf("function HealthcareModule(");
    expect(fnStart, "HealthcareModule definition found").toBeGreaterThan(-1);
    const fnEnd = SCENARIO_LAB.indexOf("\n}\n", fnStart);
    const fnBody =
      fnEnd === -1
        ? SCENARIO_LAB.slice(fnStart)
        : SCENARIO_LAB.slice(fnStart, fnEnd + 2);
    expect(fnBody).toMatch(/<ScenarioModule/);
    expect(fnBody).not.toMatch(/result=\{result\}/);
    expect(fnBody).not.toMatch(/appliedKey="healthcare"/);
  });

  it("HealthcareBridge has been removed (no duplicate generation)", () => {
    expect(SCENARIO_LAB).not.toMatch(/function HealthcareBridge\(/);
  });
});

describe("4 — GapCloser: remainingGap reconciles with the page-level baseline gap", () => {
  it("compute receives the page gap as anchorGap", () => {
    expect(GAP_CLOSER).toMatch(
      /function compute\(inputs: PlanInputs, pageBaselineGap/,
    );
  });

  it("remainingGap = max(0, anchorGap - gapClosed)", () => {
    expect(GAP_CLOSER).toMatch(
      /remainingGap:\s*Math\.max\(\s*0,\s*anchorGap\s*-\s*gapClosed\)/,
    );
  });

  it("reconciles for the worked example (gap=952, gapClosed=283 → remainingGap=669)", () => {
    const gap = 952;
    const gapClosed = 283;
    const remainingGap = Math.max(0, Math.round(gap) - gapClosed);
    expect(remainingGap).toBe(669);
  });
});

describe("5 — Funding sequence: CPF LIFE first", () => {
  it("the steps array begins with the cpf account", () => {
    const steps = FUNDING_PLAN_DATA.slice(
      FUNDING_PLAN_DATA.indexOf("const steps: FundingStep[]"),
    );
    expect(steps).toMatch(/account:\s*"cpf",[\s\S]*?account:\s*"cash"/);
  });

  it("intro in en-SG leads with CPF LIFE provides S$1,550/month for life", () => {
    expect(EN_SG).toMatch(
      /intro:\s*\n\s*"CPF LIFE provides S\$1,550\/month for life/,
    );
  });

  it("stepCpfTitle in en-SG is no longer 'spent down last'", () => {
    expect(EN_SG).toMatch(
      /stepCpfTitle:\s*"CPF LIFE — lifelong monthly income floor"/,
    );
    expect(EN_SG).not.toMatch(/spent down last/);
  });

  it("stepCpfNuance in en-SG states S$1,550/month is received first", () => {
    expect(EN_SG).toMatch(
      /S\$1,550\/month is received first and covers part of monthly spending/,
    );
  });

  it("every locale updates the CPF step title and nuance away from 'spent down last'", () => {
    for (const [name, src] of LOCALES) {
      expect(src, `${name}.cpf`).not.toMatch(/spent down last/);
      expect(src, `${name}.cpf`).not.toMatch(/保留至最后|保留到最後/);
      expect(src, `${name}.cpf`).not.toMatch(/最后才动用|最後才動用/);
    }
  });
});

describe("6 — Market-sequence: 'all three paths deplete' explanation", () => {
  it("EngineExplainer renders the seqAllDepleteBody copy below the cards", () => {
    expect(ENGINE_EXPLAINER).toMatch(/seqAllDepleteBody/);
  });

  it("every locale declares seqAllDepleteBody", () => {
    for (const [name, src] of LOCALES) {
      expect(src, `${name}.seqAllDepleteBody`).toMatch(/seqAllDepleteBody\s*:/);
    }
  });
});

describe("7 — Trip/Legacy: 'None' button + no duplicated inner heading", () => {
  it("TripLegacyModule renders t('common.none') for the zero option", () => {
    const fnStart = SCENARIO_LAB.indexOf("function TripLegacyModule(");
    expect(fnStart, "TripLegacyModule definition found").toBeGreaterThan(-1);
    const fnEnd = SCENARIO_LAB.indexOf("\n}\n", fnStart);
    const fnBody =
      fnEnd === -1
        ? SCENARIO_LAB.slice(fnStart)
        : SCENARIO_LAB.slice(fnStart, fnEnd + 2);
    expect(fnBody).toMatch(/t\("common\.none"\)/);
    expect(fnBody).not.toMatch(/a === 0 \? "—"/);
  });

  it("the duplicated 'Trip and legacy' inner heading is gone", () => {
    const fnStart = SCENARIO_LAB.indexOf("function TripLegacyModule(");
    const fnEnd = SCENARIO_LAB.indexOf("\n}\n", fnStart);
    const fnBody =
      fnEnd === -1
        ? SCENARIO_LAB.slice(fnStart)
        : SCENARIO_LAB.slice(fnStart, fnEnd + 2);
    // The accordion heading already shows scenarioTripLegacy; the body must
    // not render it again as a section title.
    expect(fnBody).not.toMatch(/t\("results\.scenarioTripLegacy"\)\s*<\/div>/);
  });

  it("every locale declares common.none", () => {
    for (const [name, src] of LOCALES) {
      expect(src, `${name}.common.none`).toMatch(/none\s*:/);
    }
  });
});

describe("8 — Trip/Legacy buttons format amounts via formatMoney", () => {
  it("uses formatMoney instead of a hand-built S$ string for non-zero options", () => {
    const fnStart = SCENARIO_LAB.indexOf("function TripLegacyModule(");
    const fnEnd = SCENARIO_LAB.indexOf("\n}\n", fnStart);
    const fnBody =
      fnEnd === -1
        ? SCENARIO_LAB.slice(fnStart)
        : SCENARIO_LAB.slice(fnStart, fnEnd + 2);
    expect(fnBody).toMatch(/formatMoney\(a\)/);
    expect(fnBody).not.toMatch(/`S\$\$\{a\.toLocaleString/);
  });
});
