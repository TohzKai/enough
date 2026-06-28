import type { PlanInputs } from "../types";

/**
 * Three assumption PRESETS that vary the market/inflation outlook. The CPF LIFE
 * plan itself is a separate user input (Standard by default = level nominal).
 *
 * The A+ point: Mr Tan's safer spend MOVES across these presets. Enough does not
 * promise a single number — it makes the trade-off transparent. Presets only
 * override market assumptions; personal facts (age, CPF payout, assets, spending)
 * are preserved from the user's plan.
 */
export type PresetKey = "conservative" | "base" | "optimistic";

export interface Preset {
  key: PresetKey;
  label: string;
  blurb: string;
  tone: "red" | "amber" | "emerald";
  /** Partial override applied on top of the user's current PlanInputs. */
  apply: Partial<
    Pick<
      PlanInputs,
      | "cashPct"
      | "bondPct"
      | "equityPct"
      | "cashReturn"
      | "bondReturn"
      | "equityReturn"
      | "cashVol"
      | "bondVol"
      | "equityVol"
      | "generalInflation"
      | "healthcareInflation"
    >
  >;
}

export const PRESETS: Preset[] = [
  {
    key: "conservative",
    label: "Conservative",
    blurb:
      "Cautious returns, higher inflation, more cash. The safer spend is lowest here.",
    tone: "red",
    apply: {
      cashPct: 55,
      bondPct: 15,
      equityPct: 30,
      cashReturn: 1.5,
      bondReturn: 3,
      equityReturn: 5.5,
      cashVol: 1.5,
      bondVol: 6,
      equityVol: 18,
      generalInflation: 3,
      healthcareInflation: 7,
    },
  },
  {
    key: "base",
    label: "Base case",
    blurb:
      "Defensible mid-range assumptions. The default used throughout the app.",
    tone: "amber",
    apply: {
      cashPct: 20,
      bondPct: 40,
      equityPct: 40,
      cashReturn: 2,
      bondReturn: 3.5,
      equityReturn: 6.5,
      cashVol: 1,
      bondVol: 5,
      equityVol: 16.5,
      generalInflation: 2.7,
      healthcareInflation: 5,
    },
  },
  {
    key: "optimistic",
    label: "Optimistic",
    blurb:
      "Growth-tilted, lower inflation. The safer spend is highest here — still not a promise.",
    tone: "emerald",
    apply: {
      cashPct: 10,
      bondPct: 30,
      equityPct: 60,
      cashReturn: 2.5,
      bondReturn: 4,
      equityReturn: 7.5,
      cashVol: 1,
      bondVol: 5,
      equityVol: 15,
      generalInflation: 2.5,
      healthcareInflation: 4.5,
    },
  },
];

export const PRESET_MAP: Record<PresetKey, Preset> = {
  conservative: PRESETS[0],
  base: PRESETS[1],
  optimistic: PRESETS[2],
};

/** Apply a preset's market assumptions to a base set of inputs. */
export function withPreset(base: PlanInputs, key: PresetKey): PlanInputs {
  return { ...base, ...PRESET_MAP[key].apply };
}
