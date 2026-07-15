/**
 * Stable sample dataset for the worked example (Mr Tan, 65).
 *
 * Figures build on the strategy proposal (enough-proposal.md §8): CPF LIFE
 * S$1,550/month, ~S$520,000 in cash + investments + SRS, paid-off 4-room HDB.
 * The safer-spend values below are taken directly from the live engine run on
 * mrTanInputs — the worked example is engine-driven, not hand-calibrated.
 *
 * This keeps the worked example deterministic so the UI, charts, and narrative are
 * fully reproducible run-to-run. The sample output is labelled "Illustrative result
 * based on stated assumptions" wherever it appears, and the live Monte Carlo engine
 * is used for any custom plan a user builds in Build Plan.
 *
 * CPF LIFE is modelled as a longevity floor (Standard = level nominal); spending is
 * inflated over time. Figures are illustrative estimates, not guarantees.
 */

export const demoMrTan = {
  age: 65,
  horizonAge: 95,
  cpfLife: 1550,
  plan: "Standard",
  assets: 520000,
  desired: 3100,
  family: "Wants his children to be involved, not burdened",
  // Live-engine safer spend (S$520k assets). These match runFullAnalysisSync(mrTanInputs)
  // exactly — the worked example is engine-driven, not hand-calibrated.
  saferLower: 2089,
  saferCentral: 2139,
  saferUpper: 2194,
  confidence: 90,
  desiredConfidence: 10, // engine: S$3,100 desired ≈ 10% confidence
  withdrawal: 589, // 2139 − 1550
  gap: 961, // 3100 − 2139
  initialWithdrawalRate: 0.0136, // 589 × 12 / 520000
};

/** Spend-confidence curve points with clean x-axis labels. */
export const demoCurve = [
  { spend: 1550, conf: 100 },
  { spend: 1850, conf: 99 },
  { spend: 2150, conf: 89 },
  { spend: 2500, conf: 56 },
  { spend: 2800, conf: 26 },
  { spend: 3100, conf: 10 },
];

/** Meaningful sensitivity impacts (no zero rows). */
export const demoSensitivity = {
  base: 2139,
  reduces: [
    { factor: "Planning horizon +5 years", impact: -220 },
    { factor: "Bequest target +S$50,000", impact: -160 },
    { factor: "Healthcare inflation +2%", impact: -130 },
    { factor: "Investment return −1%", impact: -140 },
  ],
  improves: [
    { factor: "Investment return +1%", impact: 150 },
    { factor: "Spending flexibility 15% (guardrails)", impact: 120 },
    { factor: "Model a higher CPF LIFE floor", impact: 90 },
  ],
};

/** Illustrative sequence-of-returns balance trajectories (20 years, S$'000s). */
export const demoSequence = {
  start: 520000,
  paths: [
    {
      label: "Steady market",
      tone: "emerald" as const,
      blurb: "Returns arrive near the long-run average throughout.",
      series: [
        520, 526, 528, 528, 523, 515, 504, 490, 473, 452, 427, 400, 369, 334,
        296, 255, 208, 159, 107, 52,
      ],
      depletedYear: null as number | null,
    },
    {
      label: "Bad market EARLY",
      tone: "red" as const,
      blurb:
        "A bear market in years 1–2 — withdrawals hit a depressed portfolio.",
      series: [
        520, 443, 389, 375, 369, 361, 345, 320, 287, 249, 203, 151, 90, 27, 0,
        0, 0, 0, 0, 0,
      ],
      depletedYear: 14,
    },
    {
      label: "Bad market LATE",
      tone: "amber" as const,
      blurb: "The same bear market, around year 13 — far less damage.",
      series: [
        520, 526, 528, 528, 523, 515, 504, 490, 473, 452, 427, 400, 369, 304,
        260, 224, 186, 145, 101, 74,
      ],
      depletedYear: null as number | null,
    },
  ],
};

export const demoFamily = {
  saferRange: "S$2,089 to S$2,194/month",
  central: 2139,
  cpfFloor: 1550,
  familyCapacity: 300, // approx room for family support within the safer range
  bequest: 0,
};

export const demoBusiness = {
  // Column 1 — Regulation
  regulation: [
    "Neutral financial planning advice — product-neutral, never a product pitch",
    "Pursuing the MAS Financial Adviser licence to advise",
    "Flat fees, never commission — so the advice stays honest",
    "Subject to legal review before any commercial launch",
  ],
  // Column 2 — Business model
  model: [
    "Non-bank B2B2C led — employer-wellness, fee-only IFAs, insurers",
    "Flat fees only — never commission or product revenue-share",
    "Direct family tier on top — the adult child pays",
    "Enough stays the data controller in every deal",
  ],
  // Column 3 — Pilot ask
  pilot: [
    "One employer-wellness or fee-only IFA pilot",
    "Sandwich-generation staff with ageing parents",
    "Measure: connected plans, safe-spend adoption, family engagement",
    "Then: prove the number, build the family flywheel",
  ],
};

/** CPF LIFE wording used across the demo (conservative, correct). */
export const cpfWording = {
  floor: "CPF LIFE is a longevity floor, not necessarily an inflation hedge.",
  standard: "Standard Plan is modelled as level nominal payout.",
  escalating: "Escalating Plan can be modelled as rising 2% yearly.",
  spending: "Spending is inflated over time.",
};
