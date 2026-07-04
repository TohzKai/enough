/**
 * Moat pillar B — Tax- & longevity-aware withdrawal sequencing across
 * CPF / SRS / cash / investments (enough-moat-and-differentiation.md §4, pillar B).
 *
 * The question every retiree has and no NEUTRAL tool answers: which account to draw,
 * in what order, each year, to maximise after-tax, longevity-adjusted spending. A
 * bank can't be neutral here ("draw the unit trust we sold you first" is conflicted).
 *
 * This is an ILLUSTRATIVE decision-support view — not personalised advice and not a
 * product recommendation (enough-risks-and-constraints.md §1.1). It shows the
 * DECISION SHAPE, exactly the line the strategy says stays outside the FAA perimeter.
 */

export interface SequenceStep {
  order: number;
  account: "cash" | "srs" | "investments" | "cpf";
  title: string;
  /** Why this account is drawn at this point in the order. */
  rationale: string;
  /** The tax / longevity nuance that makes the ordering non-obvious. */
  nuance: string;
  tone: "emerald" | "amber" | "navy" | "slate";
}

/** The base drawdown order Enough recommends for the worked example. */
export const withdrawalOrder: SequenceStep[] = [
  {
    order: 1,
    account: "cash",
    title: "Cash buffer — first, and in bad-market years",
    rationale:
      "Spend the cash buffer when markets are down so you never sell investments at a loss (sequence-of-returns defence).",
    nuance:
      "~2 years of the lifestyle gap kept in cash, refilled in good years.",
    tone: "emerald",
  },
  {
    order: 2,
    account: "srs",
    title: "SRS — inside the 10-year tax window",
    rationale:
      "Draw SRS across the 10-year penalty-free window so withdrawals are spread and taxed efficiently.",
    nuance:
      "Only 50% of each SRS withdrawal is taxable — pace it to stay in a low bracket.",
    tone: "amber",
  },
  {
    order: 3,
    account: "investments",
    title: "Investments — the growth engine, drawn steadily",
    rationale:
      "Draw bonds first then equity, trimming with guardrails so the portfolio keeps compounding.",
    nuance:
      "Rebalance on withdrawal; let equity ride in good years, trim in sustained drops.",
    tone: "navy",
  },
  {
    order: 4,
    account: "cpf",
    title: "CPF — the risk-free ~4%, drawn last",
    rationale:
      "CPF LIFE already pays the floor for life; leave remaining CPF to compound at its risk-free rate as the longevity backstop.",
    nuance:
      "The guaranteed base you can never outlive — spend it down last, on purpose.",
    tone: "slate",
  },
];

export interface TopUpRecommendation {
  title: string;
  detail: string;
  confidenceLift: string; // illustrative
  reversible: boolean;
}

/**
 * CPF top-up guidance — framed as the DECISION SHAPE ("a larger guaranteed floor
 * raises confidence"), never a specific product recommendation. Matches the
 * strategy's "cleanest line" (enough-risks-and-constraints.md §1.1).
 */
export const topUpRecommendations: TopUpRecommendation[] = [
  {
    title: "Top up CPF towards the Enhanced Retirement Sum (ERS)",
    detail:
      "A larger CPF LIFE floor means more of your essentials are guaranteed for life, so less of your lifestyle depends on markets.",
    confidenceLift: "+3% modelled confidence",
    reversible: false,
  },
  {
    title: "Keep ~2 years of the lifestyle gap in cash",
    detail:
      "A cash buffer funds bad-market years without selling investments low — the single biggest lever against sequence-of-returns risk.",
    confidenceLift: "+4% modelled confidence",
    reversible: true,
  },
  {
    title: "Draw SRS across the 10-year window, not in one lump",
    detail:
      "Spreading SRS withdrawals keeps only 50% taxable each year in a lower bracket, leaving more to spend.",
    confidenceLift: "Tax saved stays in the plan",
    reversible: true,
  },
];
