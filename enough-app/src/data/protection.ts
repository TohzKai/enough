/**
 * Protection-gap referral map — the specific half of the referral model.
 *
 * Enough advises the retiree on WHICH retirement risk they can't self-fund, maps
 * it to the TYPE of protection that covers it, and refers them to the right
 * licensed partner (an insurance agency, a fee-only IFA, or CPF Board) — a
 * permitted MAS introducer arrangement (Notice FAA-N02).
 *
 * All display text holds i18n KEYS; the presentation layer translates. Provider
 * names are illustrative example partners (real SG firms/schemes, 2025–26), not
 * confirmed commercial relationships. Flat key names (`r_<risk>_<field>`) keep
 * the `examples` arrays simple lists of keys. Neutral; flat fees, never commission.
 */

import type { PlanInputs } from "../types";

export interface ProtectionReferral {
  key: string;
  /** i18n key for the risk / gap. */
  gap: string;
  /** i18n key for what the gap actually is. */
  nature: string;
  /** i18n key for the protection type that covers it. */
  protection: string;
  /** i18n key for why it fits. */
  why: string;
  /** i18n key for who to see. */
  channel: string;
  /** i18n keys for illustrative example providers / firms. */
  examples: string[];
  /** "always" = shown for any retiree; "bequest" = only when a bequest is set. */
  showIf: "always" | "bequest";
}

export const PROTECTION_REFERRALS: ProtectionReferral[] = [
  {
    key: "longevity",
    gap: "protection.r_longevity_gap",
    nature: "protection.r_longevity_nature",
    protection: "protection.r_longevity_protection",
    why: "protection.r_longevity_why",
    channel: "protection.r_longevity_channel",
    examples: [
      "protection.r_longevity_ex0",
      "protection.r_longevity_ex1",
      "protection.r_longevity_ex2",
    ],
    showIf: "always",
  },
  {
    key: "hospitalisation",
    gap: "protection.r_hosp_gap",
    nature: "protection.r_hosp_nature",
    protection: "protection.r_hosp_protection",
    why: "protection.r_hosp_why",
    channel: "protection.r_hosp_channel",
    examples: ["protection.r_hosp_ex0"],
    showIf: "always",
  },
  {
    key: "ltc",
    gap: "protection.r_ltc_gap",
    nature: "protection.r_ltc_nature",
    protection: "protection.r_ltc_protection",
    why: "protection.r_ltc_why",
    channel: "protection.r_ltc_channel",
    examples: [
      "protection.r_ltc_ex0",
      "protection.r_ltc_ex1",
      "protection.r_ltc_ex2",
    ],
    showIf: "always",
  },
  {
    key: "critical-illness",
    gap: "protection.r_ci_gap",
    nature: "protection.r_ci_nature",
    protection: "protection.r_ci_protection",
    why: "protection.r_ci_why",
    channel: "protection.r_ci_channel",
    examples: ["protection.r_ci_ex0", "protection.r_ci_ex1"],
    showIf: "always",
  },
  {
    key: "legacy",
    gap: "protection.r_legacy_gap",
    nature: "protection.r_legacy_nature",
    protection: "protection.r_legacy_protection",
    why: "protection.r_legacy_why",
    channel: "protection.r_legacy_channel",
    examples: ["protection.r_legacy_ex0"],
    showIf: "bequest",
  },
];

/** The protection referrals that apply to a given plan. */
export function applicableProtections(
  inputs: PlanInputs,
): ProtectionReferral[] {
  return PROTECTION_REFERRALS.filter(
    (r) =>
      r.showIf === "always" ||
      (r.showIf === "bequest" && inputs.bequestTarget > 0),
  );
}
