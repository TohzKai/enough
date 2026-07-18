/**
 * Stable sample dataset for the worked example (Mr Tan, 65).
 *
 * Figures build on the strategy proposal: CPF LIFE S$1,550/month, ~S$520,000 in
 * cash + investments + SRS, paid-off 4-room HDB. The safer-spend values below are
 * taken directly from the live engine run on mrTanInputs — the worked example is
 * engine-driven, not hand-calibrated.
 *
 * This keeps the worked example deterministic so the UI, charts, and narrative are
 * fully reproducible run-to-run. Display prose (sensitivity factor labels, chart
 * series labels) holds i18n KEYS; numbers are untouched. CPF LIFE is modelled as a
 * longevity floor (Standard = level nominal); spending is inflated over time.
 * Figures are illustrative estimates, not guarantees.
 */

export const demoMrTan = {
  age: 65,
  horizonAge: 95,
  cpfLife: 1550,
  assets: 520000,
  desired: 3100,
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

/**
 * Meaningful sensitivity impacts (no zero rows). `factor` holds an i18n key; the
 * constant figures (+S$50,000, −1%, …) are embedded in the translated phrases.
 */
export const demoSensitivity = {
  base: 2139,
  reduces: [
    { factor: "results.sensReduceHorizon", impact: -220 },
    { factor: "results.sensReduceBequest", impact: -160 },
    { factor: "results.sensReduceHealth", impact: -130 },
    { factor: "results.sensReduceReturn", impact: -140 },
  ],
  improves: [
    { factor: "results.sensImproveReturn", impact: 150 },
    { factor: "results.sensImproveFlex", impact: 120 },
    { factor: "results.sensImproveCpf", impact: 90 },
  ],
};

/** Illustrative sequence-of-returns balance trajectories (20 years, S$'000s).
 *  `label` is a stable data-key for the chart; `labelKey` is the i18n display key. */
export const demoSequence = {
  start: 520000,
  paths: [
    {
      label: "steady",
      labelKey: "results.seqSteady",
      tone: "emerald" as const,
      series: [
        520, 526, 528, 528, 523, 515, 504, 490, 473, 452, 427, 400, 369, 334,
        296, 255, 208, 159, 107, 52,
      ],
      depletedYear: null as number | null,
    },
    {
      label: "badEarly",
      labelKey: "results.seqBadEarly",
      tone: "red" as const,
      series: [
        520, 443, 389, 375, 369, 361, 345, 320, 287, 249, 203, 151, 90, 27, 0,
        0, 0, 0, 0, 0,
      ],
      depletedYear: 14,
    },
    {
      label: "badLate",
      labelKey: "results.seqBadLate",
      tone: "amber" as const,
      series: [
        520, 526, 528, 528, 523, 515, 504, 490, 473, 452, 427, 400, 369, 304,
        260, 224, 186, 145, 101, 74,
      ],
      depletedYear: null as number | null,
    },
  ],
};

export const demoFamily = {
  central: 2139,
  cpfFloor: 1550,
};

/** CPF LIFE wording used in the printable family report (i18n key). */
export const cpfWording = {
  floor: "report.cpfFloorNote",
};
