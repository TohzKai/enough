import { describe, it, expect } from "vitest";
// Importing format initialises the i18n singleton (it reads i18n.language for
// the word fragments). The detected default in the test env is en-SG.
import {
  formatMoney,
  formatMoneyMonth,
  formatRangeMonth,
  formatRange,
  formatDeltaMonth,
  formatSignedSGD,
  formatConfidence,
  formatPercent,
  formatPercentage,
  pctRaw,
  formatSGD,
  formatMonthlySGD,
  formatYears,
  s$,
} from "../format";
import { LOCALES } from "../../i18n";
import { demoMrTan } from "../../data/demoDataset";

describe("SGD formatting", () => {
  it("formats a whole-dollar amount with the S$ prefix and comma grouping", () => {
    expect(formatMoney(2139)).toBe("S$2,139");
    expect(s$(520000)).toBe("S$520,000");
    expect(formatSGD(0)).toBe("S$0");
  });

  it("uses the S$ prefix (never an ambiguous $) in all four locales", () => {
    for (const lc of LOCALES) {
      const out = formatMoney(2139, lc);
      expect(out).toBe("S$2,139");
      expect(out.startsWith("S$")).toBe(true);
      expect(out.startsWith("$")).toBe(false);
    }
  });

  it("formats negative amounts with a leading minus", () => {
    expect(formatMoney(-250)).toBe("−S$250");
    expect(formatSignedSGD(-250)).toBe("−S$250");
    expect(formatSignedSGD(250)).toBe("+S$250");
  });

  it("appends the translated /month suffix", () => {
    expect(formatMoneyMonth(2150)).toBe("S$2,150/month");
    expect(formatMonthlySGD(2150)).toBe("S$2,150/month");
  });

  it("formats a monthly range", () => {
    expect(formatRangeMonth(2000, 2350)).toBe("S$2,000 to S$2,350/month");
    expect(formatRange(2000, 2350)).toBe("S$2,000 to S$2,350");
  });

  it("formats a signed monthly delta (+ and −)", () => {
    expect(formatDeltaMonth(110)).toBe("+S$110/month");
    expect(formatDeltaMonth(-180)).toBe("−S$180/month");
  });

  it("does not change the NUMBER across locales (financial regression)", () => {
    // The number 2139 must render identically in every supported locale. The
    // "/month" suffix is translated per locale (§16 #29), so only the numeric
    // part (formatMoney, no suffix) is locale-invariant.
    for (const lc of LOCALES) {
      expect(formatMoney(2139, lc)).toBe("S$2,139");
      // The monthly form must still lead with the same number.
      expect(formatMoneyMonth(2139, lc).indexOf("S$2,139")).toBe(0);
    }
  });

  it("translates the /month suffix without changing the number", () => {
    expect(formatMoneyMonth(2139, "en-SG")).toBe("S$2,139/month");
    // Other locales keep the number, translate only the suffix.
    expect(formatMoneyMonth(2139, "zh-SG")).toContain("S$2,139");
    expect(formatMoneyMonth(2139, "zh-SG")).not.toBe("S$2,139/month");
    expect(formatMoneyMonth(2139, "ms-SG")).toContain("S$2,139");
    expect(formatMoneyMonth(2139, "ta-SG")).toContain("S$2,139");
  });
});

describe("percentage formatting", () => {
  it("formats a fraction as a percent", () => {
    expect(formatPercent(0.036, 1)).toBe("3.6%");
    expect(formatPercentage(0.9)).toBe("90%");
  });

  it("formats a raw percentage number", () => {
    expect(pctRaw(92)).toBe("92%");
    expect(pctRaw(89.6)).toBe("90%");
  });

  it("formats confidence wording (about X% confidence)", () => {
    expect(formatConfidence(0.9)).toBe("about 90% confidence");
    expect(formatConfidence(0.905, 1)).toBe("about 90.5% confidence");
  });
});

describe("years formatting", () => {
  it("formats a year count with the translated unit", () => {
    expect(formatYears(95)).toBe("95 yrs");
  });
});

/* ---------- Financial regression (requirements §16 #18–24) ---------- */
// The Mr Tan worked-example figures are the source-of-truth display values.
// i18n must never change them; these guard the "do not change the financial
// model" invariant.
describe("Mr Tan financial figures are unchanged", () => {
  it("keeps the safer monthly spend range S$2,089 to S$2,194", () => {
    expect(demoMrTan.saferLower).toBe(2089);
    expect(demoMrTan.saferUpper).toBe(2194);
    expect(formatRangeMonth(demoMrTan.saferLower, demoMrTan.saferUpper)).toBe(
      "S$2,089 to S$2,194/month",
    );
  });

  it("keeps the suggested central spend S$2,139", () => {
    expect(demoMrTan.saferCentral).toBe(2139);
  });

  it("keeps the confidence at approximately 90%", () => {
    expect(demoMrTan.confidence).toBe(90);
    expect(formatConfidence(demoMrTan.confidence / 100)).toBe(
      "about 90% confidence",
    );
  });

  it("keeps the CPF LIFE floor, extra withdrawal, desired spend and gap", () => {
    expect(demoMrTan.cpfLife).toBe(1550);
    expect(demoMrTan.withdrawal).toBe(589);
    expect(demoMrTan.desired).toBe(3100);
    expect(demoMrTan.gap).toBe(961);
    // The derived relationships must still hold.
    expect(demoMrTan.withdrawal).toBe(
      demoMrTan.saferCentral - demoMrTan.cpfLife,
    );
    expect(demoMrTan.gap).toBe(demoMrTan.desired - demoMrTan.saferCentral);
  });
});
