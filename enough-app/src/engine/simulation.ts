import { mulberry32, makeGaussian } from "./rng";
import type { PlanInputs } from "../types";

/**
 * THE MONTE CARLO ENGINE
 * ----------------------
 * CPF LIFE is a LONGEVITY floor — income for life — but it is NOT automatically an
 * inflation floor. CPF LIFE Standard payouts are LEVEL in nominal terms: their real
 * purchasing power erodes with inflation over a 30-year retirement. Only the
 * Escalating plan grows payouts (modelled +2%/yr) and it starts LOWER than Standard.
 *
 * The engine simulates the INVESTABLE ASSETS sitting above the CPF floor, because
 * that is the part subject to market risk. Spending is inflated over time (general
 * inflation for most categories; the higher healthcare rate for healthcare). The
 * CPF payout grows only per the plan (Standard = 0%/yr).
 *
 * Withdrawal logic (monthly):
 *   monthlyWithdrawal = max(0, totalMonthlySpend - incomeFloor)
 * where incomeFloor = cpfPayout(month) + monetisationIncome - imputedHousingCost
 *
 * A trial SUCCEEDS if the portfolio never falls below zero before the planning
 * horizon AND the ending balance meets the bequest target.
 */

/** CPF LIFE Escalating payouts start lower than Standard (estimate, CPF Board).
 *  Modelled as ~82% of the Standard-equivalent starting payout, then +2%/yr. */
export const CPF_ESCALATING_START_FACTOR = 0.82;

/** Imputed monthly housing cost (mortgage/rent proxy) when the HDB home is NOT
 *  paid off. Illustrative estimate, disclosed in the UI. */
export const IMPUTED_HOUSING_MONTHLY = 800;

/** Female longevity adjustment: women live ~2 yrs longer on average → horizon +2. */
export const FEMALE_LONGEVITY_YEARS = 2;

/**
 * Effective planning horizon in MONTHS, accounting for a spouse (joint planning to
 * the longer-lived partner) and gender-based longevity. This is the horizon the
 * portfolio must survive.
 */
export function planningHorizonMonths(i: PlanInputs): number {
  const primaryYears = Math.max(1, i.horizonAge - i.age);
  // Joint planning: cover the spouse living to the same target age.
  const spouseYears =
    i.spouseIncluded && i.spouseAge > 0
      ? Math.max(0, i.horizonAge - i.spouseAge)
      : 0;
  let years = Math.max(primaryYears, spouseYears);
  if (i.gender === "female") years += FEMALE_LONGEVITY_YEARS;
  return Math.max(1, Math.round(years * 12));
}

/** The year-1 CPF LIFE monthly payout, accounting for the plan. Escalating starts
 *  lower than Standard (the trade-off for later growth). */
export function cpfStartMonthly(i: PlanInputs): number {
  if (i.cpfPlan === "Escalating") {
    return i.cpfLifeMonthly * CPF_ESCALATING_START_FACTOR;
  }
  return i.cpfLifeMonthly; // Standard & Basic: level nominal from the start
}

/** CPF payout growth (%/yr) derived from the plan unless manually overridden. */
export function cpfGrowthAnnual(i: PlanInputs): number {
  // payoutGrowthAnnual is the authoritative field; presets/plan-selector set it
  // (Standard/Basic = 0, Escalating = 2). A non-zero manual value is honoured.
  return i.payoutGrowthAnnual;
}

/** Monthly income added by the chosen housing monetisation option (illustrative). */
export function monetisationMonthlyIncome(i: PlanInputs): number {
  return i.monetisationMonthlyIncome ?? 0;
}

/** One-off capital added to investable assets by monetisation (illustrative). */
export function monetisationCapital(i: PlanInputs): number {
  return i.monetisationCapitalInjection ?? 0;
}

/** Investable assets actually available to draw down: total assets + any
 *  monetisation capital, less the protected contingency reserve. */
export function effectiveStartAssets(i: PlanInputs): number {
  const gross = i.cash + i.investments + i.srs + monetisationCapital(i);
  return Math.max(0, gross - (i.contingencyReserve ?? 0));
}

/** The static monthly income floor at retirement start: CPF payout + monetisation
 *  rent, less imputed housing if the home is not paid off. (Excludes CPF growth,
 *  which is applied month-by-month in the simulation.) */
export function effectiveMonthlyFloor(i: PlanInputs): number {
  // The income floor is CPF LIFE + monetisation rent. Housing cost is a SPENDING
  // item (see monthlyHousingCost), not a drag on the floor.
  return Math.max(0, cpfStartMonthly(i) + monetisationMonthlyIncome(i));
}

/** A pre-generated set of monthly portfolio-return scenarios (shared across
 *  spend levels so the spend-confidence curve uses common random numbers →
 *  smoother, monotonic, faster). */
export interface ScenarioSet {
  trials: number;
  horizonMonths: number;
  /** Flattened trials × horizonMonths monthly returns. */
  returns: Float32Array;
}

export interface SimulationResult {
  successRate: number; // 0..1
  medianEndBalance: number;
  p10EndBalance: number; // worst decile ending balance
  endBalances: number[]; // sorted ascending (subset for charts)
  failureYears: number[]; // year (1-indexed) at which each failed trial depleted
}

/** Build the shared monthly-return scenarios for one set of inputs. */
export function generateScenarios(
  i: PlanInputs,
  stats: { expectedReturn: number; volatility: number },
  trials: number,
): ScenarioSet {
  const horizonMonths = planningHorizonMonths(i);
  const muM = stats.expectedReturn / 12;
  const sigmaM = stats.volatility / Math.sqrt(12);
  const rng = mulberry32(i.seed);
  const gauss = makeGaussian(rng);
  const returns = new Float32Array(trials * horizonMonths);
  let idx = 0;
  for (let t = 0; t < trials; t++) {
    for (let m = 0; m < horizonMonths; m++) {
      // Normal monthly return, clamped to avoid impossible single-month losses.
      let r = muM + sigmaM * gauss();
      if (r < -0.3) r = -0.3; // clamp extreme monthly loss to -30%
      returns[idx++] = r;
    }
  }
  return { trials, horizonMonths, returns };
}

/** Spending composition fractions (sum to 1), used to scale any tested total spend. */
function spendingFractions(i: PlanInputs) {
  const tot =
    i.essentialSpend +
    i.discretionarySpend +
    i.healthcareSpend +
    i.familySupport +
    (i.monthlyHousingCost ?? 0);
  const denom = tot > 0 ? tot : 1;
  return {
    essential: i.essentialSpend / denom,
    discretionary: i.discretionarySpend / denom,
    healthcare: i.healthcareSpend / denom,
    family: i.familySupport / denom,
    housing: (i.monthlyHousingCost ?? 0) / denom,
  };
}

function percentileSorted(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const idx = Math.min(
    arr.length - 1,
    Math.max(0, Math.floor(p * (arr.length - 1))),
  );
  return arr[idx];
}

/**
 * Evaluate a single candidate total monthly spend against the shared scenarios.
 * `flexibility` (0..1) optionally cuts discretionary spending once the portfolio
 * drops below 60% of its starting value — the guardrail used to model the
 * sequence-of-returns mitigation.
 */
export function evaluateSpend(
  sc: ScenarioSet,
  i: PlanInputs,
  totalMonthlySpend: number,
  opts?: { flexibility?: number },
): SimulationResult {
  const fr = spendingFractions(i);
  const startAssets = effectiveStartAssets(i);
  const bequest = i.bequestTarget;
  const genM = Math.pow(1 + i.generalInflation / 100, 1 / 12) - 1;
  const hcmM = Math.pow(1 + i.healthcareInflation / 100, 1 / 12) - 1;
  // CPF LIFE grows ONLY per the plan escalator (Standard/Basic = 0, Escalating = 2).
  // It is NOT automatically inflation-indexed.
  const cpfGrowthM = cpfGrowthAnnual(i) / 100 / 12;
  const cpfStart = cpfStartMonthly(i);
  const extraIncome = monetisationMonthlyIncome(i);
  const flexibility = opts?.flexibility ?? i.spendingFlexibility / 100;

  // Base monthly components at the tested total spend. Housing is a spending
  // component (inflates at the general rate), NOT a drag on the income floor.
  const baseEss = fr.essential * totalMonthlySpend;
  const baseDis = fr.discretionary * totalMonthlySpend;
  const baseHc = fr.healthcare * totalMonthlySpend;
  const baseFam = fr.family * totalMonthlySpend;
  const baseHousing = fr.housing * totalMonthlySpend;

  let successes = 0;
  const endBalances: number[] = [];
  const failureYears: number[] = [];
  const { trials, horizonMonths, returns } = sc;
  const guardrailTrigger = startAssets * 0.6;

  for (let t = 0; t < trials; t++) {
    let bal = startAssets;
    let failed = false;
    let failMonth = -1;
    const offset = t * horizonMonths;

    // Cumulative growth factors (grown month by month).
    let essG = 1;
    let disG = 1;
    let hcG = 1;
    let famG = 1;
    let houseG = 1;
    let cpfG = 1;

    for (let m = 0; m < horizonMonths; m++) {
      essG *= 1 + genM;
      disG *= 1 + genM;
      hcG *= 1 + hcmM;
      famG *= 1 + genM;
      houseG *= 1 + genM;
      cpfG *= 1 + cpfGrowthM;

      // CPF payout (plan-grown) + monetisation rent.
      const income = cpfStart * cpfG + extraIncome;
      let spend =
        baseEss * essG +
        baseDis * disG +
        baseHc * hcG +
        baseFam * famG +
        baseHousing * houseG;
      // Guardrail: if the portfolio is stressed, trim discretionary.
      if (flexibility > 0 && bal < guardrailTrigger) {
        spend -= baseDis * disG * flexibility;
      }
      let withdraw = spend - income;
      if (withdraw < 0) withdraw = 0;

      const r = returns[offset + m];
      bal = bal * (1 + r) - withdraw;
      if (bal < 0) {
        failed = true;
        failMonth = m;
        break;
      }
    }

    if (!failed) {
      if (bal >= bequest) successes++;
      endBalances.push(bal);
    } else {
      endBalances.push(0);
      failureYears.push(Math.floor(failMonth / 12) + 1);
    }
  }

  endBalances.sort((a, b) => a - b);
  failureYears.sort((a, b) => a - b);

  return {
    successRate: successes / trials,
    medianEndBalance: percentileSorted(endBalances, 0.5),
    p10EndBalance: percentileSorted(endBalances, 0.1),
    endBalances,
    failureYears,
  };
}

/** Convenience: a plain Monte Carlo run at a single spend level (used by tests
 *  and the methodology page). */
export function runMonteCarloSimulation(
  i: PlanInputs,
  stats: { expectedReturn: number; volatility: number },
  totalMonthlySpend: number,
  trials: number,
): SimulationResult {
  const sc = generateScenarios(i, stats, trials);
  return evaluateSpend(sc, i, totalMonthlySpend);
}

export function calculateSuccessProbability(res: SimulationResult): number {
  return res.successRate;
}
