/**
 * Stable sample dataset for the worked example (Mr Tan, 65).
 *
 * Figures aligned to the strategy proposal (enough-proposal.md §8): CPF LIFE
 * S$1,550/mo, ~S$190,000 in cash + investments + SRS, paid-off 4-room HDB.
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
  assets: 190000,
  desired: 3100,
  family: "Wants his children to be involved, not burdened",
  // Calibrated safer spend (S$190k assets, ~3.8% initial withdrawal)
  saferLower: 2000,
  saferCentral: 2150,
  saferUpper: 2350,
  confidence: 90,
  desiredConfidence: 45, // ~40–50%
  withdrawal: 600, // 2150 − 1550
  gap: 950, // 3100 − 2150
  initialWithdrawalRate: 0.038, // 600 × 12 / 190000
};

/** Spend-confidence curve points with clean x-axis labels. */
export const demoCurve = [
  { spend: 1550, conf: 100 },
  { spend: 1850, conf: 96 },
  { spend: 2150, conf: 90 },
  { spend: 2500, conf: 82 },
  { spend: 2800, conf: 70 },
  { spend: 3100, conf: 45 },
];

/** Meaningful sensitivity impacts (no zero rows). */
export const demoSensitivity = {
  base: 2150,
  reduces: [
    { factor: "Planning horizon +5 years", impact: -220 },
    { factor: "Bequest target +S$50,000", impact: -160 },
    { factor: "Healthcare inflation +2%", impact: -130 },
    { factor: "Investment return −1%", impact: -140 },
  ],
  improves: [
    { factor: "Investment return +1%", impact: 150 },
    { factor: "Spending flexibility 15% (guardrails)", impact: 120 },
    { factor: "Top up CPF to ERS (larger floor)", impact: 90 },
  ],
};

/** Illustrative sequence-of-returns balance trajectories (20 years, S$'000s). */
export const demoSequence = {
  start: 190000,
  paths: [
    {
      label: "Steady market",
      tone: "emerald" as const,
      blurb: "Returns arrive near the long-run average throughout.",
      series: [
        190, 192, 193, 193, 191, 188, 184, 179, 173, 165, 156, 146, 135, 122,
        108, 93, 76, 58, 39, 19,
      ],
      depletedYear: null as number | null,
    },
    {
      label: "Bad market EARLY",
      tone: "red" as const,
      blurb:
        "A bear market in years 1–2 — withdrawals hit a depressed portfolio.",
      series: [
        190, 162, 142, 137, 135, 132, 126, 117, 105, 91, 74, 55, 33, 10, 0, 0,
        0, 0, 0, 0,
      ],
      depletedYear: 14,
    },
    {
      label: "Bad market LATE",
      tone: "amber" as const,
      blurb: "The same bear market, around year 13 — far less damage.",
      series: [
        190, 192, 193, 193, 191, 188, 184, 179, 173, 165, 156, 146, 135, 111,
        95, 82, 68, 53, 37, 27,
      ],
      depletedYear: null as number | null,
    },
  ],
};

export const demoFamily = {
  saferRange: "S$2,000 – S$2,350",
  central: 2150,
  cpfFloor: 1550,
  familyCapacity: 300, // approx room for family support within the safer range
  bequest: 0,
};

export const demoBusiness = {
  // Column 1 — Regulation
  regulation: [
    "Decision-support & education first — no product recommendation",
    "No 'MAS-approved' claim; no guarantee",
    "Personalised advice only after an MAS Financial Adviser licence",
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
