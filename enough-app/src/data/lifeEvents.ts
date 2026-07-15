/**
 * Life Event Stress Test — illustrative "what-if" impacts on the safer monthly
 * spend, shown on the Results page.
 *
 * The scenarios are calibrated to the Mr Tan worked example (central safer
 * spend S$2,150/month). For a custom plan the impacts scale simply with the
 * plan's central safer spend and horizon — deliberately NO Monte Carlo rerun,
 * so the section stays fast and demo-safe (enough-risks-and-constraints.md §2.7:
 * AI explains the number; deterministic math produces it).
 *
 * Neutral financial planning advice; product-neutral. Wording stays honest:
 * "model shows", "estimated impact", "illustrative", estimates not guarantees —
 * we advise the move, the user weighs it and decides.
 */

export type StressTone = "green" | "amber" | "red";

export interface LifeEventStressTest {
  key: string;
  /** Short category label shown in the pill. */
  label: string;
  /** Scenario title. */
  title: string;
  /** One-line description of the what-if premise. */
  description: string;
  /** Monthly safer-spend impact (negative = reduces the safer spend). */
  impactMonthly: number;
  /** Short closing explanation. */
  footer: string;
  /** Severity tone: green = manageable, amber = moderate, red = severe shock. */
  tone: StressTone;
}

/**
 * The stress-test scenarios. Fixed illustrative impacts match the Mr Tan
 * sample exactly (central = S$2,150/month).
 */
export const lifeEventStressTests: LifeEventStressTest[] = [
  {
    key: "longevity",
    label: "Longer life",
    title: "Longer life",
    description: "Plan to age 100 instead of 95.",
    impactMonthly: -180,
    footer: "Longevity is usually the biggest silent risk.",
    tone: "amber",
  },
  {
    key: "healthcare",
    label: "Healthcare shock",
    title: "Healthcare shock",
    description: "Add S$1,500/month of care cost for 3 years.",
    impactMonthly: -250,
    footer:
      "Care cost can be funded by cash buffer, family support, insurance review, or public/community support — subject to eligibility.",
    tone: "red",
  },
  {
    key: "bequest",
    label: "Bequest target",
    title: "Bequest target",
    description: "Leave at least S$50,000 at the end of the plan.",
    impactMonthly: -120,
    footer: "Leaving more behind usually means spending less today.",
    tone: "amber",
  },
];

/**
 * Suggestions shown in the "What we suggest" panel:
 * framed as prompts to raise, never as recommended actions or products.
 */
export const optionsToDiscuss: string[] = [
  "Trim discretionary spending temporarily",
  "Use cash buffer for short shocks",
  "Review family support",
  "Consider housing monetisation options such as room rental or downsizing",
  "Close insurance gaps — Enough refers you to an insurer, IFA, or your existing adviser",
  "Explore public or community support schemes",
];

/** Central safer spend the base impacts are calibrated to (Mr Tan, engine). */
const REFERENCE_CENTRAL = 2139;

/**
 * Return the stress tests scaled to a plan's central safer spend (and,
 * when provided, its horizon). Impacts scale linearly and round to the nearest
 * S$10 so the numbers stay clean and illustrative. No Monte Carlo rerun.
 */
export function lifeEventStressTestsFor(
  centralSpend: number,
  horizonAge?: number,
): LifeEventStressTest[] {
  const safe =
    Number.isFinite(centralSpend) && centralSpend > 0
      ? centralSpend
      : REFERENCE_CENTRAL;
  const scale = safe / REFERENCE_CENTRAL;
  return lifeEventStressTests.map((t) => {
    const next: LifeEventStressTest = {
      ...t,
      impactMonthly: Math.round((t.impactMonthly * scale) / 10) * 10,
    };
    if (t.key === "longevity" && horizonAge && horizonAge > 0) {
      next.description = `Plan to age ${horizonAge + 5} instead of ${horizonAge}.`;
    }
    return next;
  });
}
