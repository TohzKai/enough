/**
 * Moat pillars C + D — Dynamic guardrails + longitudinal learning
 * (enough-moat-and-differentiation.md §4, "C+D").
 *
 * C — Guyton-Klinger style steering: trim spending after sustained drops, RAISE it
 *     after sustained growth (fixes the underspending paradox — the wedge).
 * D — the plan learns the household's REAL spending over time, so the number gets
 *     more personal the longer you stay (a switching cost, not a network effect).
 *
 * All figures illustrative. AI is confined to EXPLAINING the number, never
 * calculating it (enough-risks-and-constraints.md §2.7) — so the guardrail math
 * below is deterministic and the plain-English "why" is a template, not a black box.
 */

export type GuardZone = "green" | "amber" | "red" | "raise";

export interface GuardrailBand {
  zone: GuardZone;
  headline: string;
  rule: string;
  action: string;
}

/** The pre-agreed guardrail bands — a steering wheel, not a one-time answer. */
export const guardrailBands: GuardrailBand[] = [
  {
    zone: "raise",
    headline: "Markets are up — you can safely spend more",
    rule: "Portfolio sustainably above the plan line",
    action: "Raise the monthly paycheck (e.g. S$2,150 → S$2,350).",
  },
  {
    zone: "green",
    headline: "On track — hold steady",
    rule: "Portfolio within the safer band",
    action: "Keep spending the current safe amount. No change.",
  },
  {
    zone: "amber",
    headline: "Below the line — trim discretionary",
    rule: "Portfolio drops below the lower guardrail",
    action: "Trim discretionary spending ~10% until it recovers.",
  },
  {
    zone: "red",
    headline: "Sustained drop — pause increases, use the buffer",
    rule: "Portfolio well below the line for a sustained period",
    action: "Fund the year from the cash buffer; pause any raises.",
  },
];

/** Where the worked example sits today, and the raise it has earned. */
export const currentGuardrail = {
  zone: "raise" as GuardZone,
  currentSpend: 2150,
  suggestedSpend: 2350,
  reason:
    "Markets have run above the plan line for three quarters, so the safe monthly amount has earned a raise.",
};

export interface LearningPoint {
  period: string;
  safeSpend: number;
  event: string;
  /** The plain-English driver the attribution layer would surface. */
  driver: string;
}

/**
 * Longitudinal learning — the plan as a RECORD of decisions, not a snapshot.
 * A competitor can copy the calculator in a sprint; they cannot copy a
 * multi-year relationship with a household or the track record it builds.
 */
export const learningTimeline: LearningPoint[] = [
  {
    period: "Year 1",
    safeSpend: 2050,
    event: "First plan from consented SGFinDex data",
    driver: "Conservative start while the plan learns your real spending.",
  },
  {
    period: "Year 2",
    safeSpend: 2150,
    event: "Learned you consistently spend below the safe line",
    driver:
      "Underspending out of caution → the plan gives you permission to spend more.",
  },
  {
    period: "Year 3",
    safeSpend: 2350,
    event: "Guardrail raise after a strong market",
    driver:
      "Sustained growth above the plan line → an earned, reversible raise.",
  },
  {
    period: "Year 4",
    safeSpend: 2250,
    event: "Guardrail trim after a market dip",
    driver: "A sustained drop → a small trim now protects the plan for later.",
  },
];
