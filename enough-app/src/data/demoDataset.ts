/**
 * Stable sample dataset for the worked example (Mr Tan, 65).
 *
 * Single source of truth, engine-driven. The numbers below are what
 * `runFullAnalysisSync(mrTanInputs)` produces for the calibrated Mr Tan
 * profile (S$190k assets, 80-year planning horizon, 2.0% general
 * inflation, 4.0% healthcare inflation). The Results page re-runs the
 * engine on the same inputs so the worked-example UI can never drift
 * from the live calculation.
 *
 * Calibrated output (~S$2,150 central safer spend, ~3.8% IWR, ~S$950 gap
 * to the desired S$3,100 lifestyle) matches the presentation deck. The
 * engine cannot sustain S$3,100 at 45% confidence on S$190k over the
 * working horizon, so the desired-confidence figure surfaced by the UI
 * will read <1%; we expose this honestly rather than hand-tune it.
 *
 * CPF LIFE is modelled as a longevity floor (Standard = level nominal);
 * spending is inflated over time. Figures are illustrative estimates, not
 * guarantees.
 */

export const demoMrTan = {
  age: 65,
  horizonAge: 80,
  cpfLife: 1550,
  assets: 190000,
  desired: 3100,
  // Engine output for the calibrated inputs above. Tolerance ±S$50 / ±1%
  // confidence is expected across runs because the Monte Carlo simulation
  // is stochastic (deterministic seed for the worked example only).
  saferLower: 2116,
  saferCentral: 2146,
  saferUpper: 2165,
  confidence: 90,
  // Engine: S$3,100 desired is not safely fundable on a S$190k portfolio
  // over a 20-year horizon. Surfaced honestly (~0%) rather than faked.
  desiredConfidence: 0,
  withdrawal: 596, // 2146 − 1550
  gap: 954, // 3100 − 2146
  initialWithdrawalRate: 0.0377, // 596 × 12 / 190000
};

/** Spend-confidence curve points with clean x-axis labels. These are
 *  updated from the engine each time the worked-example Results page
 *  loads; this static list is only used as a fallback and for the
 *  sensitivity / learning views. */
export const demoCurve = [
  { spend: 1550, conf: 100 },
  { spend: 1700, conf: 100 },
  { spend: 1850, conf: 100 },
  { spend: 2000, conf: 99 },
  { spend: 2100, conf: 92 },
  { spend: 2150, conf: 89 },
  { spend: 2300, conf: 25 },
  { spend: 2500, conf: 1 },
  { spend: 3100, conf: 0 },
];

/**
 * Meaningful sensitivity impacts (no zero rows). `factor` holds an i18n key; the
 * constant figures (+S$50,000, −1%, …) are embedded in the translated phrases.
 */
export const demoSensitivity = {
  base: 2146,
  reduces: [
    { factor: "results.sensReduceHorizon", impact: -180 },
    { factor: "results.sensReduceBequest", impact: -140 },
    { factor: "results.sensReduceHealth", impact: -110 },
    { factor: "results.sensReduceReturn", impact: -120 },
  ],
  improves: [
    { factor: "results.sensImproveReturn", impact: 130 },
    { factor: "results.sensImproveFlex", impact: 100 },
    { factor: "results.sensImproveCpf", impact: 80 },
  ],
};

/** Illustrative sequence-of-returns balance trajectories (16 years, S$'000s).
 *  `label` is a stable data-key for the chart; `labelKey` is the i18n display key. */
export const demoSequence = {
  start: 190000,
  paths: [
    {
      label: "steady",
      labelKey: "results.seqSteady",
      tone: "emerald" as const,
      series: [
        190, 192, 194, 195, 194, 191, 187, 182, 176, 168, 158, 146, 132, 116,
        98, 76,
      ],
      depletedYear: null as number | null,
    },
    {
      label: "badEarly",
      labelKey: "results.seqBadEarly",
      tone: "red" as const,
      series: [
        190, 162, 144, 138, 134, 130, 122, 109, 92, 72, 50, 25, 0, 0, 0, 0,
      ],
      depletedYear: 12,
    },
    {
      label: "badLate",
      labelKey: "results.seqBadLate",
      tone: "amber" as const,
      series: [
        190, 192, 194, 195, 194, 191, 187, 182, 176, 168, 158, 146, 132, 116,
        85, 50,
      ],
      depletedYear: null as number | null,
    },
  ],
};

export const demoFamily = {
  central: 2146,
  cpfFloor: 1550,
};

/** CPF LIFE wording used in the printable family report (i18n key). */
export const cpfWording = {
  floor: "report.cpfFloorNote",
};
