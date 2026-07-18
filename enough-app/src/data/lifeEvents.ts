/**
 * Life Event Stress Test — illustrative "what-if" impacts on the safer monthly
 * spend, shown on the Results page.
 *
 * The scenarios are calibrated to the Mr Tan worked example (central safer
 * spend S$2,150/month). For a custom plan the impacts scale simply with the
 * plan's central safer spend and horizon — deliberately NO Monte Carlo rerun,
 * so the section stays fast and demo-safe.
 *
 * Display text (label/title/description/footer) holds i18n KEYS, not English
 * sentences; the presentation layer translates. Neutral planning advice;
 * product-neutral. Wording stays honest: "model shows", "estimated impact",
 * "illustrative", estimates not guarantees — we advise the move, the user
 * weighs it and decides.
 */

export type StressTone = "green" | "amber" | "red";

export interface LifeEventStressTest {
  key: string;
  /** i18n key for the short category label shown in the pill. */
  label: string;
  /** i18n key for the scenario title. */
  title: string;
  /** i18n key for the one-line what-if premise. */
  description: string;
  /** Interpolation vars for {@link description} (e.g. longevity target age). */
  descriptionVars?: Record<string, string | number>;
  /** Monthly safer-spend impact (negative = reduces the safer spend). */
  impactMonthly: number;
  /** i18n key for the short closing explanation. */
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
    label: "stressTests.longevityLabel",
    title: "stressTests.longevityTitle",
    description: "stressTests.longevityDescription",
    descriptionVars: { targetAge: 100, currentAge: 95 },
    impactMonthly: -180,
    footer: "stressTests.longevityFooter",
    tone: "amber",
  },
  {
    key: "healthcare",
    label: "stressTests.healthcareLabel",
    title: "stressTests.healthcareTitle",
    description: "stressTests.healthcareDescription",
    impactMonthly: -250,
    footer: "stressTests.healthcareFooter",
    tone: "red",
  },
  {
    key: "bequest",
    label: "stressTests.bequestLabel",
    title: "stressTests.bequestTitle",
    description: "stressTests.bequestDescription",
    impactMonthly: -120,
    footer: "stressTests.bequestFooter",
    tone: "amber",
  },
];

/**
 * i18n keys for the suggestions shown in the "What we suggest" panel:
 * framed as prompts to raise, never as recommended actions or products.
 */
export const optionsToDiscuss: string[] = [
  "stressTests.suggest0",
  "stressTests.suggest1",
  "stressTests.suggest2",
  "stressTests.suggest3",
  "stressTests.suggest4",
  "stressTests.suggest5",
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
      next.descriptionVars = {
        targetAge: horizonAge + 5,
        currentAge: horizonAge,
      };
    }
    return next;
  });
}
