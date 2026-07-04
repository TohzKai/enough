// Public surface of the analytics engine. UI code imports from here.
export { mulberry32, makeGaussian } from "./rng";
export { calculatePortfolioStats, type PortfolioStats } from "./portfolio";
export {
  generateScenarios,
  evaluateSpend,
  runMonteCarloSimulation,
  calculateSuccessProbability,
  planningHorizonMonths,
  cpfStartMonthly,
  cpfGrowthAnnual,
  effectiveStartAssets,
  effectiveMonthlyFloor,
  monetisationMonthlyIncome,
  monetisationCapital,
  CPF_ESCALATING_START_FACTOR,
  IMPUTED_HOUSING_MONTHLY,
  FEMALE_LONGEVITY_YEARS,
  type ScenarioSet,
  type SimulationResult,
} from "./simulation";
export {
  runFullAnalysis,
  runFullAnalysisSync,
  generateSpendConfidenceCurve,
  calculateSafeSpendAtConfidence,
  successAt,
  type CurvePoint,
  type SafeSpendRange,
  type FullAnalysis,
  type CancelToken,
} from "./curve";
export {
  runSensitivityAnalysis,
  type SensitivityRow,
  type SensitivityResult,
} from "./sensitivity";
export {
  generateSequenceRiskScenario,
  type SeqPath,
  type SequenceRiskResult,
} from "./sequenceRisk";
export {
  runBacktest,
  runBacktestSuite,
  HISTORICAL_60_40,
  BACKTEST_YEARS,
  type BacktestRow,
  type BacktestOutcome,
} from "./backtest";
