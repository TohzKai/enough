/**
 * Regression tests for the Analytics-tab "Bad markets early hurt more"
 * section. The previous version:
 *   - showed the scenario title twice per card (header + duplicate body),
 *   - only the early-market card displayed an outcome,
 *   - used demo data instead of the real engine, and
 *   - hard-coded "Depletes ~Year {year}" in English without i18n.
 *
 * The fix wires SequencePanel to generateSequenceRiskScenario and renders
 * title + blurb + ending balance + outcome (horizon-survival or depletion
 * year) + a "Why timing matters" conclusion box. All copy is sourced from
 * the i18n keys, in all four locales.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const SRC = (...p: string[]) => resolve(__dirname, "..", "..", ...p);

const ENGINE_EXPLAINER = readFileSync(
  SRC("components", "results", "EngineExplainer.tsx"),
  "utf8",
);
const EN_SG = readFileSync(SRC("i18n", "locales", "en-SG.ts"), "utf8");
const ZH_SG = readFileSync(SRC("i18n", "locales", "zh-SG.ts"), "utf8");
const MS_SG = readFileSync(SRC("i18n", "locales", "ms-SG.ts"), "utf8");
const TA_SG = readFileSync(SRC("i18n", "locales", "ta-SG.ts"), "utf8");

describe("Analytics — 'Bad markets early hurt more' card rework", () => {
  it("SequencePanel uses the real engine, not the demo dataset", () => {
    expect(ENGINE_EXPLAINER).toMatch(
      /generateSequenceRiskScenario\(vm\.inputs\)/,
    );
    expect(ENGINE_EXPLAINER).not.toMatch(/demoSequence/);
  });

  function sequencePanelBody(): string {
    const start = ENGINE_EXPLAINER.indexOf("function SequencePanel(");
    expect(start, "SequencePanel definition found").toBeGreaterThan(-1);
    // Find the closing brace at column 0 that ends the function. Each
    // top-level helper in the file ends with `^}\n`. Walk forward from
    // `start` until we find one.
    let i = start;
    while (i < ENGINE_EXPLAINER.length) {
      const closeAt = ENGINE_EXPLAINER.indexOf("\n}\n", i);
      if (closeAt === -1) break;
      // The first matching close is the function's own end (no other
      // top-level `}\n` can appear before it because the body itself
      // never contains a top-level closing brace).
      return ENGINE_EXPLAINER.slice(start, closeAt + 3);
    }
    throw new Error("could not find SequencePanel closing brace");
  }

  it("derives title and description keys from the engine's actual labels", () => {
    const fnBody = sequencePanelBody();
    // The local helpers titleKey/descKey take the path label and map the
    // three engine labels ("Steady market", "Bad market EARLY", "Bad market
    // LATE") to distinct i18n keys. The old code compared against the
    // short ids ("steady", "badEarly"); the new code must not.
    expect(fnBody).toMatch(/label === "Steady market"/);
    expect(fnBody).toMatch(/label === "Bad market EARLY"/);
    expect(fnBody).not.toMatch(/label === "steady"/);
    expect(fnBody).not.toMatch(/label === "badEarly"/);
    // Distinct title keys
    expect(fnBody).toMatch(/results\.seqSteady/);
    expect(fnBody).toMatch(/results\.seqBadEarly/);
    expect(fnBody).toMatch(/results\.seqBadLate/);
    // Distinct description keys (not duplicate title text)
    expect(fnBody).toMatch(/results\.seqDescSteady/);
    expect(fnBody).toMatch(/results\.seqDescBadEarly/);
    expect(fnBody).toMatch(/results\.seqDescBadLate/);
    // The cards must consume the helpers (i.e. not bypass them).
    expect(fnBody).toMatch(/titleKey\(p\.label\)/);
    expect(fnBody).toMatch(/descKey\(p\.label\)/);
  });

  it("every card shows an ending balance and an outcome line", () => {
    const fnBody = sequencePanelBody();
    expect(fnBody).toMatch(/formatMoney\(Math\.max\(0, p\.endingBalance\)\)/);
    expect(fnBody).toMatch(/results\.sequenceEndingBalance/);
    expect(fnBody).toMatch(/results\.sequenceLasts/);
    expect(fnBody).toMatch(/results\.sequenceDepletes/);
  });

  it("uses green tone when the portfolio lasts, red tone when it depletes", () => {
    expect(ENGINE_EXPLAINER).toMatch(/text-enough-emeraldDark/);
    expect(ENGINE_EXPLAINER).toMatch(/text-enough-red/);
  });

  it("adds the 'Why timing matters' conclusion box", () => {
    expect(ENGINE_EXPLAINER).toMatch(/results\.seqWhyTitle/);
    expect(ENGINE_EXPLAINER).toMatch(/results\.seqWhyBody/);
  });

  it("clamps negative ending balances to S$0", () => {
    expect(ENGINE_EXPLAINER).toMatch(/Math\.max\(0,\s*p\.endingBalance\)/);
  });
});

describe("Analytics — i18n parity for the new sequence keys", () => {
  const required = [
    "seqDescSteady",
    "seqDescBadEarly",
    "seqDescBadLate",
    "sequenceEndingBalance",
    "sequenceLasts",
    "sequenceDepletes",
    "seqWhyTitle",
    "seqWhyBody",
  ];
  for (const key of required) {
    for (const [name, src] of [
      ["en-SG", EN_SG],
      ["zh-SG", ZH_SG],
      ["ms-SG", MS_SG],
      ["ta-SG", TA_SG],
    ] as const) {
      it(`${name} defines ${key}`, () => {
        expect(src, `${name}.${key}`).toMatch(new RegExp(`${key}\\s*:`));
      });
    }
  }
});

describe("Analytics — sentence-case scenario titles in all locales", () => {
  it("en-SG uses sentence case for the Bad market titles", () => {
    expect(EN_SG).toMatch(/seqBadEarly:\s*"Bad market early"/);
    expect(EN_SG).toMatch(/seqBadLate:\s*"Bad market late"/);
    expect(EN_SG).not.toMatch(/seqBadEarly:\s*"Bad market EARLY"/);
    expect(EN_SG).not.toMatch(/seqBadLate:\s*"Bad market LATE"/);
  });

  it("ms-SG uses sentence case for the Bad market titles", () => {
    expect(MS_SG).toMatch(/seqBadEarly:\s*"Pasaran buruk awal"/);
    expect(MS_SG).toMatch(/seqBadLate:\s*"Pasaran buruk lewat"/);
    expect(MS_SG).not.toMatch(/AWAL/);
    expect(MS_SG).not.toMatch(/AKHIR/);
  });

  it("zh-SG and ta-SG titles remain in sentence case", () => {
    expect(ZH_SG).toMatch(/seqBadEarly:\s*"早期市况不佳"/);
    expect(ZH_SG).toMatch(/seqBadLate:\s*"晚期市况不佳"/);
    expect(TA_SG).toMatch(/seqBadEarly:\s*"முற்கால மோசமான சந்தை"/);
    expect(TA_SG).toMatch(/seqBadLate:\s*"பிற்கால மோசமான சந்தை"/);
  });
});
