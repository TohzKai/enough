/**
 * Protection-gap referral map — the specific half of the referral model.
 *
 * Enough advises the retiree on WHICH retirement risk they can't self-fund, maps
 * it to the TYPE of protection that covers it, and refers them to the right
 * licensed partner (an insurance agency, a fee-only IFA, or CPF Board) — a
 * permitted MAS introducer arrangement (Notice FAA-N02). Enough sizes the gap and
 * makes the introduction; the partner advises on and sells the specific product.
 * Flat fees, never commission — so the referral stays neutral.
 *
 * PROVIDER NAMES ARE ILLUSTRATIVE EXAMPLE PARTNERS (real SG firms/schemes, 2025–26),
 * not confirmed commercial relationships. Sources: MOH CareShield Life supplements
 * comparison (Sep 2025); CPF Board; the named IFA firms' own profiles.
 */

import type { PlanInputs } from "../types";

export interface ProtectionReferral {
  key: string;
  gap: string; // the risk / gap
  nature: string; // what the gap actually is
  protection: string; // the protection type that covers it
  why: string; // why it fits
  channel: string; // who to see
  examples: string[]; // illustrative example providers / firms
  /** "always" = shown for any retiree; "bequest" = only when a bequest is set. */
  showIf: "always" | "bequest";
}

export const PROTECTION_REFERRALS: ProtectionReferral[] = [
  {
    key: "longevity",
    gap: "Longevity — outliving your savings",
    nature:
      "Your invested assets fund the spending above CPF LIFE. Live to 95+ or hit a bad market run, and that pot can run dry while you are still here.",
    protection:
      "Guaranteed income for life — top up CPF LIFE to the Enhanced Retirement Sum (ERS), or add a private lifetime annuity.",
    why: "Converts a finite pot into lifelong income — the one risk you cannot safely self-insure.",
    channel:
      "CPF Board (CPF LIFE top-up), or a fee-only IFA to compare private annuities.",
    examples: [
      "CPF LIFE (CPF Board)",
      "Private annuities — Income, Great Eastern, Singlife",
      "Compare via a fee-only IFA — Providend, GYC",
    ],
    showIf: "always",
  },
  {
    key: "hospitalisation",
    gap: "Hospitalisation — beyond MediShield Life",
    nature:
      "MediShield Life covers subsidised (B2/C ward) bills. Private-hospital or A-ward care, and large bills, leave a shortfall you pay out of pocket.",
    protection:
      "An Integrated Shield Plan (IP) with a rider — private / higher-ward cover on top of MediShield Life.",
    why: "Caps your exposure on a big hospital bill so a single admission doesn't derail the plan.",
    channel: "An insurance agency or an IFA.",
    examples: ["AIA, Great Eastern, Prudential, Income, Singlife, HSBC Life"],
    showIf: "always",
  },
  {
    key: "ltc",
    gap: "Long-term care — beyond CareShield Life",
    nature:
      "CareShield Life pays ~S$689/mo only when you are severely disabled (3 of 6 daily activities). Real care — helper, day-care, nursing home — can cost far more.",
    protection:
      "A CareShield Life supplement — a higher monthly payout for long-term care.",
    why: "Turns the biggest, longest-tail retirement cost into a predictable monthly benefit.",
    channel: "An insurance agency.",
    examples: [
      "Singlife CareShield Standard / Plus",
      "Great Eastern",
      "Income Insurance",
    ],
    showIf: "always",
  },
  {
    key: "critical-illness",
    gap: "Critical illness — cancer, stroke, major illness",
    nature:
      "A serious diagnosis brings heavy treatment cost plus lost earning ability. MediShield Life covers only listed cancer drugs, with limits.",
    protection:
      "A Critical Illness (CI) plan — a lump sum on diagnosis to fund treatment and replace income.",
    why: "Gives you cash when you most need it, without selling down investments at the worst time.",
    channel: "An IFA (to compare across insurers) or an insurance agency.",
    examples: [
      "AIA, Prudential, Great Eastern, Manulife",
      "Compare via an IFA — Financial Alliance, IPP",
    ],
    showIf: "always",
  },
  {
    key: "legacy",
    gap: "Legacy — protecting what you leave behind",
    nature:
      "You want to leave a set amount, but drawing down to spend erodes it — and markets make the ending balance uncertain.",
    protection:
      "Whole-life or legacy planning that ring-fences a bequest regardless of market outcomes.",
    why: "Lets you spend more freely today, knowing the bequest is protected separately.",
    channel: "A fee-only IFA.",
    examples: ["Providend, GYC (estate & legacy planning)"],
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
