/**
 * Moat pillars C + D — Dynamic guardrails + longitudinal learning.
 *
 * C — Guyton-Klinger style steering: trim spending after sustained drops, RAISE it
 *     after sustained growth (fixes the underspending paradox — the wedge).
 * D — the plan learns the household's REAL spending over time, so the number gets
 *     more personal the longer you stay (a switching cost, not a network effect).
 *
 * All figures illustrative. AI is confined to EXPLAINING the number, never
 * calculating it — so the guardrail math below is deterministic and the plain
 * explanatory text is delivered via i18n keys, not embedded English sentences.
 */

export type GuardZone = "green" | "amber" | "red" | "raise";

export interface GuardrailBand {
  zone: GuardZone;
  /** i18n key for the band headline. */
  headline: string;
  /** i18n key for the rule description. */
  rule: string;
  /** i18n key for the suggested action. */
  action: string;
}

/** The pre-agreed guardrail bands — a steering wheel, not a one-time answer. */
export const guardrailBands: GuardrailBand[] = [
  {
    zone: "raise",
    headline: "guardrails.raiseHeadline",
    rule: "guardrails.raiseRule",
    action: "guardrails.raiseAction",
  },
  {
    zone: "green",
    headline: "guardrails.greenHeadline",
    rule: "guardrails.greenRule",
    action: "guardrails.greenAction",
  },
  {
    zone: "amber",
    headline: "guardrails.amberHeadline",
    rule: "guardrails.amberRule",
    action: "guardrails.amberAction",
  },
  {
    zone: "red",
    headline: "guardrails.redHeadline",
    rule: "guardrails.redRule",
    action: "guardrails.redAction",
  },
];

/** Where the worked example sits today, and the raise it has earned. */
export const currentGuardrail = {
  zone: "raise" as GuardZone,
  currentSpend: 2139,
  suggestedSpend: 2350,
  /** i18n key for the plain-English reason. */
  reason: "guardrails.reason",
};

export interface LearningPoint {
  /** i18n key for the period label (e.g. "Year 1"). */
  period: string;
  safeSpend: number;
  /** i18n key for the event. */
  event: string;
  /** i18n key for the plain-English driver the attribution layer would surface. */
  driver: string;
}

/**
 * Longitudinal learning — the plan as a RECORD of decisions, not a snapshot.
 * A competitor can copy the calculator in a sprint; they cannot copy a
 * multi-year relationship with a household or the track record it builds.
 */
export const learningTimeline: LearningPoint[] = [
  {
    period: "guardrails.learnYear1",
    safeSpend: 2050,
    event: "guardrails.learnEvent1",
    driver: "guardrails.learnDriver1",
  },
  {
    period: "guardrails.learnYear2",
    safeSpend: 2150,
    event: "guardrails.learnEvent2",
    driver: "guardrails.learnDriver2",
  },
  {
    period: "guardrails.learnYear3",
    safeSpend: 2350,
    event: "guardrails.learnEvent3",
    driver: "guardrails.learnDriver3",
  },
  {
    period: "guardrails.learnYear4",
    safeSpend: 2250,
    event: "guardrails.learnEvent4",
    driver: "guardrails.learnDriver4",
  },
];
