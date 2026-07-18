/**
 * Condition-driven healthcare & long-term-care stress test — app-review item 4.
 *
 * A menu of four conditions (stroke / dementia / cancer / frailty), each with a
 * three-part cost stack — acute episode, ongoing medical, long-term care (helper
 * vs day-care vs nursing home) — presented NET of the Singapore government schemes
 * that offset them, then fed into the real Monte Carlo engine.
 *
 * Display text (label/blurb/note and the SOURCES link labels) holds i18n KEYS;
 * the `source` fields on CitedAmount are internal provenance citations (not
 * rendered) and stay as short English source attributions. Scheme parameters +
 * care fees are cited (2025–26); acute episode costs and the means-tested
 * subsidy rate are illustrative. Neutral planning advice; product-neutral; costs
 * are estimates, not guarantees.
 */

/** A figure with its provenance. `source` is a short citation or "illustrative". */
export interface CitedAmount {
  amount: number;
  source: string;
}

export interface CareOption {
  key: "helper" | "daycare" | "nursinghome";
  /** i18n key for the care-setting label. */
  label: string;
  gross: CitedAmount; // typical monthly fee before subsidy
  /** i18n key for the explanatory note. */
  note: string;
}

export interface Condition {
  key: "stroke" | "dementia" | "cancer" | "frailty";
  /** i18n key for the condition label. */
  label: string;
  /** i18n key for the condition blurb. */
  blurb: string;
  acuteGross: CitedAmount; // one-off episode before MediShield Life
  ongoingMedical: CitedAmount; // meds/therapy/follow-up, S$/month
  durationYears: number;
  eligibleSevere: boolean; // typically reaches CareShield Life bar (≥3 of 6 ADLs)?
  careOptions: CareOption[];
  defaultCare: CareOption["key"];
}

/** Short source list rendered in the UI for defensibility (labels are i18n keys). */
export const SOURCES: { label: string; url: string }[] = [
  {
    label: "healthcare.srcCareShield",
    url: "https://www.cpf.gov.sg/member/healthcare-financing/careshield-life",
  },
  {
    label: "healthcare.srcHcg",
    url: "https://www.mom.gov.sg/passes-and-permits/work-permit-for-foreign-domestic-worker/foreign-domestic-worker-levy/levy-concession",
  },
  {
    label: "healthcare.srcMedishield",
    url: "https://www.moh.gov.sg/managing-expenses/schemes-and-subsidies/medishield-life/medishield-life-benefits/",
  },
  {
    label: "healthcare.srcAic",
    url: "https://www.aic.sg/care-services/nursing-home",
  },
];

// ---- Government scheme parameters (cited 2025–26) ----

/** CareShield Life monthly payout when severely disabled (≥3 of 6 ADLs), 2026
 *  base; rises ~4%/yr 2026–2030. Source: CPF Board / NTUC Health / MoneySmart. */
export const CARESHIELD_MONTHLY: CitedAmount = {
  amount: 689,
  source: "CPF Board, 2026",
};

/** Home Caregiving Grant — monthly cash for home-based care of someone needing
 *  permanent help with ≥3 ADLs (means-tested, PCHI cap), S$600 from Apr 2026.
 *  Source: MOM / MSF / NTUC Health. */
export const HOME_CAREGIVING_GRANT: CitedAmount = {
  amount: 600,
  source: "MOM/MSF, Apr 2026",
};

/** MediShield Life: S$2,000 annual deductible + 3–10% co-insurance on subsidised
 *  (B2/C ward) bills. We model a conservative 10% co-insurance. Source: CPF/MOH. */
export const MEDISHIELD_DEDUCTIBLE = 2000;
export const MEDISHIELD_COINSURANCE = 0.1;

/** Illustrative means-tested subsidy on day-care / nursing-home fees. Actual is
 *  household-income-dependent (up to 75–80% per MOH/AIC); 50% is a mid estimate. */
export const MEANS_TESTED_FACILITY_RATE = 0.5;

/** Illustrative CHAS / subsidy share of ongoing chronic-outpatient cost. */
export const CHAS_ONGOING_COVERAGE = 0.4;

const CARE_OPTIONS: CareOption[] = [
  {
    key: "helper",
    label: "healthcare.careHelperLabel",
    gross: {
      amount: 1200,
      source: "MOM levy + typical FDW salary/upkeep, 2025",
    },
    note: "healthcare.careHelperNote",
  },
  {
    key: "daycare",
    label: "healthcare.careDaycareLabel",
    gross: { amount: 1300, source: "AIC / NTUC Health, 2025 (~S$945–1,430)" },
    note: "healthcare.careDaycareNote",
  },
  {
    key: "nursinghome",
    label: "healthcare.careNursingLabel",
    gross: { amount: 4500, source: "AIC / MOH, 2025 (from ~S$3,900)" },
    note: "healthcare.careNursingNote",
  },
];

export const CONDITIONS: Condition[] = [
  {
    key: "stroke",
    label: "healthcare.strokeLabel",
    blurb: "healthcare.strokeBlurb",
    acuteGross: { amount: 18000, source: "illustrative" },
    ongoingMedical: { amount: 300, source: "illustrative" },
    durationYears: 10,
    eligibleSevere: true,
    careOptions: CARE_OPTIONS,
    defaultCare: "helper",
  },
  {
    key: "dementia",
    label: "healthcare.dementiaLabel",
    blurb: "healthcare.dementiaBlurb",
    acuteGross: { amount: 5000, source: "illustrative" },
    ongoingMedical: { amount: 400, source: "illustrative" },
    durationYears: 8,
    eligibleSevere: true,
    careOptions: CARE_OPTIONS,
    defaultCare: "daycare",
  },
  {
    key: "cancer",
    label: "healthcare.cancerLabel",
    blurb: "healthcare.cancerBlurb",
    acuteGross: { amount: 60000, source: "illustrative" },
    ongoingMedical: { amount: 800, source: "illustrative" },
    durationYears: 5,
    eligibleSevere: false,
    careOptions: CARE_OPTIONS,
    defaultCare: "helper",
  },
  {
    key: "frailty",
    label: "healthcare.frailtyLabel",
    blurb: "healthcare.frailtyBlurb",
    acuteGross: { amount: 4000, source: "illustrative" },
    ongoingMedical: { amount: 250, source: "illustrative" },
    durationYears: 12,
    eligibleSevere: false,
    careOptions: CARE_OPTIONS,
    defaultCare: "helper",
  },
];

export interface ConditionCost {
  careGross: number;
  ongoingGross: number;
  grossMonthly: number;
  careShieldOffset: number; // CareShield Life (if severe)
  subsidyOffset: number; // HCG / means-tested facility subsidy / CHAS
  netMonthly: number; // what the household funds each month
  acuteGross: number;
  acuteNet: number; // one-off after MediShield Life (deductible + co-insurance)
}

/** Net-of-subsidy monthly + acute cost for a condition and care choice. */
export function costOf(
  c: Condition,
  careKey: CareOption["key"],
): ConditionCost {
  const care = c.careOptions.find((o) => o.key === careKey) ?? c.careOptions[0];
  const careGross = care.gross.amount;
  const ongoingGross = c.ongoingMedical.amount;
  const grossMonthly = careGross + ongoingGross;

  const careShieldOffset = c.eligibleSevere ? CARESHIELD_MONTHLY.amount : 0;

  // Home care → Home Caregiving Grant (if severe); facility → means-tested subsidy.
  const careSubsidy =
    care.key === "helper"
      ? c.eligibleSevere
        ? HOME_CAREGIVING_GRANT.amount
        : 0
      : Math.round(careGross * MEANS_TESTED_FACILITY_RATE);
  const chasOffset = Math.round(ongoingGross * CHAS_ONGOING_COVERAGE);
  const subsidyOffset = careSubsidy + chasOffset;

  const netMonthly = Math.max(
    0,
    grossMonthly - careShieldOffset - subsidyOffset,
  );

  const acuteGross = c.acuteGross.amount;
  const acuteNet = Math.round(
    Math.min(
      acuteGross,
      MEDISHIELD_DEDUCTIBLE +
        MEDISHIELD_COINSURANCE *
          Math.max(0, acuteGross - MEDISHIELD_DEDUCTIBLE),
    ),
  );

  return {
    careGross,
    ongoingGross,
    grossMonthly,
    careShieldOffset,
    subsidyOffset,
    netMonthly,
    acuteGross,
    acuteNet,
  };
}
