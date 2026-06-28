/**
 * Stable sample dataset for the worked example (Mr Tan, 65).
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
  cpfLife: 950,
  plan: "Standard",
  assets: 150000,
  desired: 2350,
  family: "Does not want to burden his children",
  // Calibrated safer spend
  saferLower: 1350,
  saferCentral: 1400,
  saferUpper: 1500,
  confidence: 92,
  desiredConfidence: 40, // ~35–45%
  withdrawal: 450, // 1400 − 950
  gap: 950, // 2350 − 1400
  initialWithdrawalRate: 0.036, // 450 × 12 / 150000
};

/** Spend-confidence curve points with clean x-axis labels. */
export const demoCurve = [
  { spend: 950, conf: 100 },
  { spend: 1200, conf: 97 },
  { spend: 1400, conf: 92 },
  { spend: 1650, conf: 85 },
  { spend: 1900, conf: 75 },
  { spend: 2350, conf: 40 },
];

/** Meaningful sensitivity impacts (no zero rows). */
export const demoSensitivity = {
  base: 1400,
  reduces: [
    { factor: "Planning horizon +5 years", impact: -180 },
    { factor: "Bequest target +S$50,000", impact: -120 },
    { factor: "Healthcare inflation +2%", impact: -100 },
    { factor: "Investment return −1%", impact: -100 },
  ],
  improves: [
    { factor: "Investment return +1%", impact: 110 },
    { factor: "Spending flexibility 15% (guardrails)", impact: 90 },
  ],
};

/** Illustrative sequence-of-returns balance trajectories (20 years, S$'000s). */
export const demoSequence = {
  start: 150000,
  paths: [
    {
      label: "Steady market",
      tone: "emerald" as const,
      blurb: "Returns arrive near the long-run average throughout.",
      series: [
        150, 152, 153, 153, 151, 149, 146, 142, 137, 131, 124, 116, 107, 97, 86,
        74, 61, 47, 32, 16,
      ],
      depletedYear: null as number | null,
    },
    {
      label: "Bad market EARLY",
      tone: "red" as const,
      blurb:
        "A bear market in years 1–2 — withdrawals hit a depressed portfolio.",
      series: [
        150, 128, 112, 108, 107, 105, 100, 93, 84, 73, 60, 45, 28, 9, 0, 0, 0,
        0, 0, 0,
      ],
      depletedYear: 14,
    },
    {
      label: "Bad market LATE",
      tone: "amber" as const,
      blurb: "The same bear market, around year 13 — far less damage.",
      series: [
        150, 152, 153, 153, 151, 149, 146, 142, 137, 131, 124, 116, 107, 88, 76,
        66, 55, 43, 30, 22,
      ],
      depletedYear: null as number | null,
    },
  ],
};

export const demoFamily = {
  saferRange: "S$1,350 – S$1,500",
  central: 1400,
  cpfFloor: 950,
  familyCapacity: 250, // approx room for family support after essentials + healthcare
  bequest: 0,
};

export const demoBusiness = {
  // Column 1 — Regulation
  regulation: [
    "Education calculator first — no product recommendation",
    "No 'MAS-approved' claim; no guarantee",
    "Personalised advice only via licensed partner later",
    "Subject to legal review before any commercial launch",
  ],
  // Column 2 — Business model
  model: [
    "B2B2C first — banks, insurers, wealth managers",
    "S$2–5 per active user / month",
    "B2B adviser SaaS later (per seat)",
    "B2C premium later (family report + updates)",
  ],
  // Column 3 — Pilot ask
  pilot: [
    "One bank or insurer pilot",
    "Retirement-age customer cohort",
    "Measure: completed plans, report downloads, engagement, adviser follow-up",
    "Then: prove the number, scale the floor",
  ],
};

/** CPF LIFE wording used across the demo (conservative, correct). */
export const cpfWording = {
  floor: "CPF LIFE is a longevity floor, not necessarily an inflation hedge.",
  standard: "Standard Plan is modelled as level nominal payout.",
  escalating: "Escalating Plan can be modelled as rising 2% yearly.",
  spending: "Spending is inflated over time.",
};
