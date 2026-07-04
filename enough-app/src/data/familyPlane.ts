/**
 * Moat pillar E — the family layer / family tier (the uncontested whitespace).
 *
 * A permissioned retiree + spouse + adult-child on ONE plane, with a co-signer flow
 * for big moves (enough-moat-and-differentiation.md §4 "The family layer (E)" +
 * enough-adult-children-research.md Part C). The adult child is the operator + likely
 * buyer; the retiree stays the beneficiary and decision-maker.
 *
 * The product must stay rigorously PARENT-CENTRIC — the safe-spend number always
 * optimises the parent's wellbeing; the parent (not the child) sees and confirms the
 * number. That parent-centric integrity is what neutralises the inheritance conflict
 * (research Part C §5). All data illustrative.
 */

export type FamilyRole = "owner" | "operator" | "viewer";

export interface FamilyMember {
  name: string;
  relation: string;
  role: FamilyRole;
  roleLabel: string;
  /** What this member can do on the plane. */
  permissions: string[];
  initials: string;
  tone: "navy" | "emerald" | "amber";
}

export const familyMembers: FamilyMember[] = [
  {
    name: "Mr Tan",
    relation: "Retiree",
    role: "owner",
    roleLabel: "Owner · decision-maker",
    permissions: [
      "Sees and confirms the safe-spend number",
      "Owns the plan and all data consent",
      "Must approve any change to spending or accounts",
    ],
    initials: "MT",
    tone: "navy",
  },
  {
    name: "Mrs Tan",
    relation: "Spouse",
    role: "viewer",
    roleLabel: "Viewer",
    permissions: [
      "Sees the plan and the monthly paycheck",
      "Joins family conversations",
      "Cannot change accounts or spending",
    ],
    initials: "WT",
    tone: "emerald",
  },
  {
    name: "Wei Ling",
    relation: "Adult daughter",
    role: "operator",
    roleLabel: "Operator · co-pilot",
    permissions: [
      "Sets up & connects accounts on Dad's behalf (with consent)",
      "Gets alerts when the plan needs a look",
      "Co-signs big moves — but Dad confirms the final number",
    ],
    initials: "WL",
    tone: "amber",
  },
];

export interface CoSignRequest {
  id: string;
  title: string;
  detail: string;
  raisedBy: string;
  needs: string; // who must co-sign / confirm
  status: "awaiting-parent" | "awaiting-child" | "approved";
  parentCentricNote?: string;
}

/**
 * The co-signer flow. Note the parent-centric guarantee: even when the child
 * operates, the PARENT confirms — Enough stays on the parent's side.
 */
export const coSignRequests: CoSignRequest[] = [
  {
    id: "cs-1",
    title: "Raise the monthly paycheck to S$2,350",
    detail:
      "Guardrails earned a raise after a strong market. Wei Ling reviewed it; Dad confirms before it takes effect.",
    raisedBy: "Wei Ling (operator)",
    needs: "Mr Tan must confirm",
    status: "awaiting-parent",
    parentCentricNote:
      "Enough always optimises the parent's wellbeing — the raise is safe, so the plan surfaces it to Dad, not away from him.",
  },
  {
    id: "cs-2",
    title: "Top up CPF towards ERS (larger floor)",
    detail:
      "A larger guaranteed floor raises confidence. Framed as a decision shape, not a product — Dad decides.",
    raisedBy: "Enough (guardrail engine)",
    needs: "Mr Tan + Wei Ling",
    status: "awaiting-child",
  },
  {
    id: "cs-3",
    title: "Connect OCBC SRS account via SGFinDex",
    detail:
      "Wei Ling connected the SRS account so withdrawal sequencing can use the 10-year window.",
    raisedBy: "Wei Ling (operator)",
    needs: "Consented by Mr Tan",
    status: "approved",
  },
];

/** Alerts the adult-child operator sees (the oversight-without-intrusion face). */
export const childAlerts = [
  {
    tone: "emerald" as const,
    title: "Dad's plan is on track",
    body: "90% confidence to age 95. No action needed.",
  },
  {
    tone: "amber" as const,
    title: "A safe raise is waiting for Dad to confirm",
    body: "Markets ran above the plan line — the paycheck can rise to S$2,350.",
  },
  {
    tone: "navy" as const,
    title: "CPF top-up decision to review together",
    body: "A larger floor would lift confidence ~3%. Decision shape, not a product.",
  },
];
