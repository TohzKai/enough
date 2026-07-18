/**
 * Gap-closing actions — the engine-wired half of app-review item 2.
 *
 * The old Results page showed a "gap vs desired" number with static levers that
 * claimed a hardcoded "+3% confidence" — a dead end the review called out. Each
 * action here instead returns a real `Partial<PlanInputs>` OVERRIDE. The
 * GapCloser component merges the override onto the live inputs and re-runs the
 * actual Monte Carlo engine (`runFullAnalysisSync`), so the S$ of gap each action
 * closes is COMPUTED, never asserted.
 *
 * An action can close the gap two ways, and the engine captures both:
 *  - raise the safer spend (e.g. a bigger CPF floor, guardrails, a shorter horizon), or
 *  - lower the desired target (trim the aspirational lifestyle layer).
 * gapClosed = oldGap − newGap handles either uniformly.
 *
 * Neutral advice: we recommend the MOVE ("model a higher floor") and stay
 * product-neutral — the specific product is the user's call with a provider.
 */

import type { PlanInputs } from "../types";
import { syncLifestyleToSpend } from "./lifestyle";

export interface GapAction {
  key: string;
  title: string;
  detail: string;
  reversible: boolean;
  /** Illustrative S$/month the floor top-up models (shown for transparency). */
  buildOverride: (i: PlanInputs) => Partial<PlanInputs>;
}

export const GAP_ACTIONS: GapAction[] = [
  {
    key: "cpf-floor",
    title: "gapActions.cpfFloorTitle",
    detail: "gapActions.cpfFloorDetail",
    reversible: false,
    buildOverride: (i) => ({
      cpfLifeMonthly: i.cpfLifeMonthly + 400,
    }),
  },
  {
    key: "monetise-home",
    title: "gapActions.monetiseTitle",
    detail: "gapActions.monetiseDetail",
    reversible: true,
    buildOverride: () => ({
      monetisation: "room-rental",
      monetisationMonthlyIncome: 800,
    }),
  },
  {
    key: "trim-aspirational",
    title: "gapActions.trimTitle",
    detail: "gapActions.trimDetail",
    reversible: true,
    buildOverride: (i) => {
      const lifestyle = { ...i.lifestyle, travelHobbies: 0, other: 0 };
      return { lifestyle, ...syncLifestyleToSpend(lifestyle) };
    },
  },
  {
    key: "guardrails",
    title: "gapActions.guardrailsTitle",
    detail: "gapActions.guardrailsDetail",
    reversible: true,
    buildOverride: () => ({
      spendingFlexibility: 15,
    }),
  },
];

/** Merge every action's override onto the inputs, in order (for the "do all" preview). */
export function applyAllActions(i: PlanInputs): Partial<PlanInputs> {
  return GAP_ACTIONS.reduce<PlanInputs>(
    (acc, a) => ({ ...acc, ...a.buildOverride(acc) }),
    { ...i },
  );
}
