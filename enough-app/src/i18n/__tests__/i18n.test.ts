import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  beforeAll,
} from "vitest";
import {
  i18n,
  LOCALES,
  LOCALE_NAMES,
  STORAGE_KEY,
  detectInitialLocale,
  changeLocale,
} from "../index";
import enSG from "../locales/en-SG";
import zhSG from "../locales/zh-SG";
import msSG from "../locales/ms-SG";
import taSG from "../locales/ta-SG";

// ---- data modules whose fields are i18n keys ----
import { LIFESTYLE_BUCKETS } from "../../data/lifestyle";
import { LIFESTYLE_PERSONAS } from "../../data/lifestylePersonas";
import { PRESETS } from "../../data/presets";
import { GAP_ACTIONS } from "../../data/gapActions";
import { RELIEF_SCHEMES, buildFundingPlan } from "../../data/fundingPlan";
import { CONDITIONS, SOURCES } from "../../data/conditions";
import {
  PROTECTION_REFERRALS,
  applicableProtections,
} from "../../data/protection";
import { familyMembers, childAlerts } from "../../data/familyPlane";
import { connectedAccounts, singpassPullSteps } from "../../data/aggregation";
import {
  lifeEventStressTests,
  lifeEventStressTestsFor,
  optionsToDiscuss,
} from "../../data/lifeEvents";
import {
  CRISIS_SCENARIOS,
  CRISIS_ZONE_GUIDANCE,
} from "../../data/stressScenarios";
import {
  guardrailBands,
  currentGuardrail,
  learningTimeline,
} from "../../data/guardrails";
import { demoSensitivity, demoSequence } from "../../data/demoDataset";
import { mrTanInputs } from "../../data/mrTan";

/** Recursively collect every "dotted.path" leaf in a resource object. */
function collectKeys(obj: unknown, prefix = ""): string[] {
  const out: string[] = [];
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object") out.push(...collectKeys(v, path));
      else out.push(path);
    }
  }
  return out;
}

/** A key resolves when its translation is a non-empty string that is not the raw key. */
function resolves(key: string, lng: string): boolean {
  const val = String(i18n.t(key, { lng }));
  return val.length > 0 && val !== key;
}

/** Closure-based localStorage mock (avoids `this`-typing issues). */
function makeStorage() {
  const store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => {
      store[k] = v;
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      for (const k of Object.keys(store)) delete store[k];
    },
  };
}

describe("i18n resources", () => {
  it("all four locales are registered and load a representative key", () => {
    for (const lc of LOCALES) {
      const brand = String(i18n.t("common.brand", { lng: lc }));
      expect(brand.length).toBeGreaterThan(0);
      expect(brand).not.toBe("common.brand"); // not a raw key
    }
  });

  it("each locale has a native display name (no flags)", () => {
    expect(LOCALE_NAMES["en-SG"]).toBe("English");
    expect(LOCALE_NAMES["zh-SG"]).toBe("简体中文");
    expect(LOCALE_NAMES["ms-SG"]).toBe("Bahasa Melayu");
    expect(LOCALE_NAMES["ta-SG"]).toBe("தமிழ்");
  });

  it("a missing key returns the key text (never a blank screen)", () => {
    // returnEmptyString: false → missing key surfaces as the key itself.
    expect(String(i18n.t("definitely.not.a.real.key"))).toBe(
      "definitely.not.a.real.key",
    );
  });

  it("every English key exists in zh-SG, ms-SG and ta-SG (key parity)", () => {
    const enKeys = new Set(collectKeys(enSG));
    for (const res of [zhSG, msSG, taSG]) {
      const keys = new Set(collectKeys(res));
      const missing = [...enKeys].filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !enKeys.has(k));
      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    }
  });
});

describe("locale detection + persistence", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("maps browser languages to supported locales", () => {
    const cases: [string[], string][] = [
      [["en-SG"], "en-SG"],
      [["en-US", "en"], "en-SG"],
      [["zh-CN", "zh"], "zh-SG"],
      [["zh-SG"], "zh-SG"],
      [["ms-MY"], "ms-SG"],
      [["ta-IN"], "ta-SG"],
      [["fr-FR"], "en-SG"], // unsupported → English
      [["ja-JP"], "en-SG"], // unsupported → English
    ];
    for (const [langs, expected] of cases) {
      vi.stubGlobal("navigator", { languages: langs, language: langs[0] });
      expect(detectInitialLocale()).toBe(expected);
    }
  });

  it("saved locale takes priority over browser language", () => {
    localStorage.setItem(STORAGE_KEY, "ta-SG");
    vi.stubGlobal("navigator", { languages: ["zh-CN"], language: "zh-CN" });
    expect(detectInitialLocale()).toBe("ta-SG");
  });

  it("corrupt / unsupported saved locale is ignored safely", () => {
    localStorage.setItem(STORAGE_KEY, "not-a-locale");
    vi.stubGlobal("navigator", { languages: ["ms"], language: "ms" });
    expect(detectInitialLocale()).toBe("ms-SG");
  });

  it("changeLocale persists the choice to localStorage", async () => {
    await changeLocale("ms-SG");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("ms-SG");
    expect(i18n.language).toBe("ms-SG");
  });

  it("changeLocale updates <html lang>", async () => {
    const docEl = { lang: "" };
    vi.stubGlobal("document", { documentElement: docEl });
    await changeLocale("ta-SG");
    expect(docEl.lang).toBe("ta-SG");
  });
});

/* ---------- State preservation: language is presentation-only (§16 #13–17) ---------- */
describe("changing language preserves app state", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    void changeLocale("en-SG");
  });

  it("does not change the Mr Tan inputs or safer-spend figures", async () => {
    const before = JSON.stringify(mrTanInputs);
    await changeLocale("zh-SG");
    await changeLocale("ta-SG");
    const after = JSON.stringify(mrTanInputs);
    expect(after).toBe(before);
    // Financial display values are locale-independent.
    expect(mrTanInputs.desiredSpend).toBe(3100);
    expect(mrTanInputs.cpfLifeMonthly).toBe(1550);
  });

  it("does not change the funding-plan amounts derived from inputs", async () => {
    const before = buildFundingPlan(mrTanInputs, 2139);
    await changeLocale("ms-SG");
    const after = buildFundingPlan(mrTanInputs, 2139);
    expect(after.assetDrawMonthly).toBe(before.assetDrawMonthly);
    expect(after.residualMonthly).toBe(before.residualMonthly);
    expect(after.steps.map((s) => s.amount)).toEqual(
      before.steps.map((s) => s.amount),
    );
  });
});

/* ---------- Data-file key correctness: every data-driven key resolves ---------- */
describe("data-file translation keys all resolve in en-SG", () => {
  const keys = new Set<string>();
  const add = (k: string | string[] | undefined) => {
    if (!k) return;
    if (Array.isArray(k)) k.forEach((x) => keys.add(x));
    else keys.add(k);
  };

  beforeAll(() => {
    LIFESTYLE_BUCKETS.forEach((b) => add(b.label));
    LIFESTYLE_PERSONAS.forEach((p) => {
      add(p.label);
      add(p.blurb);
    });
    PRESETS.forEach((p) => {
      add(p.label);
      add(p.blurb);
    });
    GAP_ACTIONS.forEach((a) => {
      add(a.title);
      add(a.detail);
    });
    RELIEF_SCHEMES.forEach((s) => {
      add(s.name);
      add(s.detail);
    });
    const plan = buildFundingPlan(mrTanInputs, 2139);
    plan.steps.forEach((s) => {
      add(s.title);
      add(s.rationale);
      add(s.nuance);
    });
    CONDITIONS.forEach((c) => {
      add(c.label);
      add(c.blurb);
      c.careOptions.forEach((o) => {
        add(o.label);
        add(o.note);
      });
    });
    SOURCES.forEach((s) => add(s.label));
    PROTECTION_REFERRALS.forEach((r) => {
      add(r.gap);
      add(r.nature);
      add(r.protection);
      add(r.why);
      add(r.channel);
      add(r.examples);
    });
    familyMembers.forEach((m) => {
      add(m.name);
      add(m.relation);
      add(m.roleLabel);
      add(m.permissions);
    });
    childAlerts.forEach((a) => {
      add(a.title);
      add(a.body);
    });
    connectedAccounts.forEach((a) => {
      add(a.source);
      add(a.label);
      add(a.note);
    });
    add(singpassPullSteps);
    lifeEventStressTests.forEach((t) => {
      add(t.label);
      add(t.title);
      add(t.description);
      add(t.footer);
    });
    add(optionsToDiscuss);
    CRISIS_SCENARIOS.forEach((s) => {
      add(s.label);
      add(s.blurb);
    });
    add(Object.values(CRISIS_ZONE_GUIDANCE));
    guardrailBands.forEach((b) => {
      add(b.headline);
      add(b.rule);
      add(b.action);
    });
    add(currentGuardrail.reason);
    learningTimeline.forEach((p) => {
      add(p.period);
      add(p.event);
      add(p.driver);
    });
    demoSensitivity.reduces.forEach((r) => add(r.factor));
    demoSensitivity.improves.forEach((r) => add(r.factor));
    demoSequence.paths.forEach((p) => add(p.labelKey));
  });

  it("resolves every key (no raw keys / typos in data files)", () => {
    const unresolved: string[] = [];
    for (const k of keys) {
      // description keys with placeholders still resolve to a non-key string.
      if (!resolves(k, "en-SG")) unresolved.push(k);
    }
    expect(unresolved).toEqual([]);
  });

  it("applicableProtections + scaled stress tests keep resolving after language change", async () => {
    await changeLocale("zh-SG");
    const prot = applicableProtections(mrTanInputs);
    for (const r of prot) {
      expect(resolves(r.gap, "zh-SG")).toBe(true);
      expect(resolves(r.protection, "zh-SG")).toBe(true);
    }
    const tests = lifeEventStressTestsFor(2139, 95);
    for (const t of tests) {
      expect(resolves(t.label, "zh-SG")).toBe(true);
      expect(resolves(t.title, "zh-SG")).toBe(true);
      // longevity description carries interpolation vars but must still resolve.
      const desc = String(
        i18n.t(t.description, { lng: "zh-SG", ...(t.descriptionVars ?? {}) }),
      );
      expect(desc).not.toBe(t.description);
    }
  });
});
