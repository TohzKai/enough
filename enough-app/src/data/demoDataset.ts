/**
 * Stable sample dataset for the worked example (Mr Tan, 65).
 *
 * Single source of truth, engine-driven. The numbers below are what
 * `runFullAnalysisSync(mrTanInputs)` produces for the calibrated Mr Tan
 * profile (S$414k assets, 30-year horizon age 65 → 95, 2.0% general
 * inflation, 4.0% healthcare inflation). The Results page re-runs the
 * engine on the same inputs so the worked-example UI can never drift
 * from the live calculation.
 *
 * The presentation deck cites "about S$2,150/month"; the UI rounds the
 * engine output to the nearest S$50 via `roundToNearest50`. Internally we
 * keep the unrounded values so downstream math (gap, withdrawal, IWR)
 * matches the engine.
 *
 * CPF LIFE is modelled as a longevity floor (Standard = level nominal);
 * spending is inflated over time. Figures are illustrative estimates, not
 * guarantees.
 */

export const demoMrTan = {
  age: 65,
  horizonAge: 95,
  cpfLife: 1550,
  assets: 414000,
  desired: 3100,
  // Engine output for the calibrated inputs above. Tolerance ±S$50 / ±1%
  // confidence is expected across runs because the Monte Carlo simulation
  // is stochastic (deterministic seed for the worked example only).
  saferLower: 2099,
  saferCentral: 2148,
  saferUpper: 2194,
  confidence: 90,
  // Engine: S$3,100 desired is not safely fundable on a S$414k portfolio
  // over a 30-year horizon. Surfaced honestly (~4%) rather than faked.
  desiredConfidence: 4,
  withdrawal: 598, // 2148 − 1550
  gap: 952, // 3100 − 2148
  initialWithdrawalRate: 0.0173, // 598 × 12 / 414000
};

/** Spend-confidence curve points with clean x-axis labels. Updated from
 *  the engine each time the worked-example Results page loads; this static
 *  list is used as a fallback for analytics components. */
export const demoCurve = [
  { spend: 1550, conf: 100 },
  { spend: 1700, conf: 100 },
  { spend: 1850, conf: 100 },
  { spend: 2000, conf: 100 },
  { spend: 2100, conf: 95 },
  { spend: 2200, conf: 80 },
  { spend: 2300, conf: 50 },
  { spend: 2500, conf: 18 },
  { spend: 2800, conf: 6 },
  { spend: 3100, conf: 4 },
];

/**
 * Meaningful sensitivity impacts (no zero rows). `factor` holds an i18n key;
 * the constant figures are embedded in the translated phrases.
 */
export const demoSensitivity = {
  base: 2148,
  reduces: [
    { factor: "results.sensReduceHorizon", impact: -210 },
    { factor: "results.sensReduceBequest", impact: -160 },
    { factor: "results.sensReduceHealth", impact: -140 },
    { factor: "results.sensReduceReturn", impact: -150 },
  ],
  improves: [
    { factor: "results.sensImproveReturn", impact: 140 },
    { factor: "results.sensImproveFlex", impact: 110 },
    { factor: "results.sensImproveCpf", impact: 90 },
  ],
};

/** Illustrative sequence-of-returns balance trajectories (30 years, S$'000s). */
export const demoSequence = {
  start: 414000,
  paths: [
    {
      label: "steady",
      labelKey: "results.seqSteady",
      tone: "emerald" as const,
      series: [
        414, 419, 423, 426, 426, 422, 415, 405, 392, 376, 357, 335, 309, 280,
        248, 213, 175, 134, 90, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      depletedYear: null as number | null,
    },
    {
      label: "badEarly",
      labelKey: "results.seqBadEarly",
      tone: "red" as const,
      series: [
        414, 352, 309, 297, 290, 280, 263, 240, 211, 178, 140, 96, 47, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      depletedYear: 13,
    },
    {
      label: "badLate",
      labelKey: "results.seqBadLate",
      tone: "amber" as const,
      series: [
        414, 419, 423, 426, 426, 422, 415, 405, 392, 376, 357, 335, 309, 280,
        248, 213, 175, 134, 90, 43, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      depletedYear: null as number | null,
    },
  ],
};

export const demoFamily = {
  central: 2148,
  cpfFloor: 1550,
};

/** CPF LIFE wording used in the printable family report (i18n key). */
export const cpfWording = {
  floor: "report.cpfFloorNote",
};
