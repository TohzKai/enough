/**
 * Funding plan — the specificity half of app-review item 5.
 *
 * The old "which account to spend first" section listed a generic order
 * (cash → SRS → investments → CPF) with no amounts, no schemes and no referral.
 * This module computes per-account draw AMOUNTS from the retiree's actual balances
 * and the engine's safer-spend result, then surfaces the real Singapore
 * government schemes that may help fund the residual gap the plan cannot safely
 * cover, and a referral to an insurer, IFA, or the customer's existing adviser
 * for whatever remains (a permitted MAS introducer arrangement, FAA-N02).
 *
 * Neutral planning advice. Scheme names are real programmes; eligibility and amounts
 * are NOT modelled here (that rigour belongs to the healthcare/scheme figures in a
 * later pass) — each is framed as "check eligibility", never a payout promise.
 * Product-neutral (no specific product pushed); no adviser matching.
 */

import type { PlanInputs } from "../types";

export interface FundingStep {
  account: "cash" | "srs" | "investments" | "cpf";
  title: string;
  /** Computed S$ figure for this step (a buffer for cash, an annual draw otherwise). */
  amount: number;
  amountKind: "buffer" | "perYear" | "preserved";
  rationale: string;
  nuance: string;
  tone: "emerald" | "amber" | "navy" | "slate";
}

export interface FundingPlan {
  /** Monthly spend drawn from assets above the CPF floor (safer plan). */
  assetDrawMonthly: number;
  assetDrawAnnual: number;
  /** Monthly desired-spend the safer plan cannot cover (the residual gap). */
  residualMonthly: number;
  steps: FundingStep[];
}

/**
 * Build the funding plan from the inputs and the engine's central safer spend.
 * All amounts are derived, not hardcoded.
 */
export function buildFundingPlan(
  i: PlanInputs,
  centralSpend: number,
): FundingPlan {
  const cpfFloor = i.cpfLifeMonthly;
  const assetDrawMonthly = Math.max(0, Math.round(centralSpend - cpfFloor));
  const assetDrawAnnual = assetDrawMonthly * 12;
  const residualMonthly = Math.max(
    0,
    Math.round(i.desiredSpend - centralSpend),
  );

  // Cash: ~2 years of the asset draw held liquid, spent in bad-market years.
  const cashBuffer = Math.min(i.cash, assetDrawAnnual * 2);
  // SRS: spread across the 10-year penalty-free window.
  const srsPerYear = Math.min(Math.round(i.srs / 10), assetDrawAnnual);
  // Investments: the remainder of each year's asset draw.
  const investmentsPerYear = Math.max(0, assetDrawAnnual - srsPerYear);

  const steps: FundingStep[] = [
    {
      account: "cash",
      title: "Cash buffer — first, and in bad-market years",
      amount: cashBuffer,
      amountKind: "buffer",
      rationale:
        "Hold about two years of the asset draw in cash so you never sell investments at a loss in a downturn.",
      nuance:
        "Refill it in good years — this is your sequence-of-returns defence.",
      tone: "emerald",
    },
    {
      account: "srs",
      title: "SRS — inside the 10-year tax window",
      amount: srsPerYear,
      amountKind: "perYear",
      rationale:
        "Draw your SRS across the 10-year penalty-free window so withdrawals are spread and taxed efficiently.",
      nuance:
        "Only 50% of each SRS withdrawal is taxable — pace it to stay in a low bracket.",
      tone: "amber",
    },
    {
      account: "investments",
      title: "Investments — the growth engine, drawn steadily",
      amount: investmentsPerYear,
      amountKind: "perYear",
      rationale:
        "Fund the rest of each year's draw from investments (bonds first, then equity), trimming with guardrails so the portfolio keeps compounding.",
      nuance:
        "Rebalance on withdrawal; let equity ride in good years, trim in sustained drops.",
      tone: "navy",
    },
    {
      account: "cpf",
      title: "CPF LIFE — the guaranteed floor, kept for life",
      amount: cpfFloor,
      amountKind: "preserved",
      rationale:
        "CPF LIFE already pays a guaranteed income floor for life; the plan preserves it as the longevity backstop you can never outlive.",
      nuance:
        "Spend it down last, on purpose — it is the base under everything else.",
      tone: "slate",
    },
  ];

  return { assetDrawMonthly, assetDrawAnnual, residualMonthly, steps };
}

export interface ReliefScheme {
  name: string;
  detail: string;
}

/**
 * Real Singapore support schemes that MAY help fund a residual gap, subject to
 * eligibility. Named programmes only — no payout figures, no eligibility claims,
 * no recommendation. The user checks eligibility with the relevant agency.
 */
export const RELIEF_SCHEMES: ReliefScheme[] = [
  {
    name: "Silver Support Scheme",
    detail:
      "Quarterly cash for lower-income seniors — paid automatically if eligible (CPF Board).",
  },
  {
    name: "GST Voucher",
    detail:
      "Cash, MediSave top-ups and U-Save utilities rebates for eligible households.",
  },
  {
    name: "CHAS & MediSave / MediShield Life",
    detail:
      "Subsidised outpatient care, chronic-condition support and hospital-bill coverage.",
  },
  {
    name: "Pioneer / Merdeka Generation",
    detail:
      "Extra healthcare and MediSave benefits for eligible birth cohorts.",
  },
  {
    name: "ComCare",
    detail:
      "Short-to-medium-term financial assistance for those who need it (MSF).",
  },
];

// Gap → protection → named partner referral lives in data/protection.ts.
