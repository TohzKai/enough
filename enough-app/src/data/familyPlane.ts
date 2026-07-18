/**
 * Moat pillar E — the family layer / family tier (the uncontested whitespace).
 *
 * A permissioned retiree + spouse + adult-child on ONE plan, with a co-signer flow
 * for big moves. The adult child is the operator + likely buyer; the retiree
 * stays the beneficiary and decision-maker.
 *
 * All display text (names, roles, permissions, co-sign detail, alerts) holds
 * i18n KEYS; the presentation layer translates. PARENT-CENTRIC by design: the
 * safe-spend number always optimises the parent's wellbeing; the parent (not the
 * child) sees and confirms the number. All data illustrative.
 */

export type FamilyRole = "owner" | "operator" | "viewer";

export interface FamilyMember {
  /** i18n key for the member's display name. */
  name: string;
  /** i18n key for the relation label. */
  relation: string;
  role: FamilyRole;
  /** i18n key for the role label. */
  roleLabel: string;
  /** i18n keys for what this member can do on the plan. */
  permissions: string[];
  initials: string;
  tone: "navy" | "emerald" | "amber";
}

export const familyMembers: FamilyMember[] = [
  {
    name: "family.m1Name",
    relation: "family.m1Relation",
    role: "owner",
    roleLabel: "family.m1Role",
    permissions: ["family.m1p1", "family.m1p2", "family.m1p3"],
    initials: "MT",
    tone: "navy",
  },
  {
    name: "family.m2Name",
    relation: "family.m2Relation",
    role: "viewer",
    roleLabel: "family.m2Role",
    permissions: ["family.m2p1", "family.m2p2", "family.m2p3"],
    initials: "WT",
    tone: "emerald",
  },
  {
    name: "family.m3Name",
    relation: "family.m3Relation",
    role: "operator",
    roleLabel: "family.m3Role",
    permissions: ["family.m3p1", "family.m3p2", "family.m3p3"],
    initials: "WL",
    tone: "amber",
  },
];

export interface CoSignRequest {
  id: string;
  /** i18n key for the request title. */
  title: string;
  /** i18n key for the request detail. */
  detail: string;
  /** i18n key for the raiser line. */
  raisedBy: string;
  /** i18n key for who must co-sign / confirm. */
  needs: string;
  status: "awaiting-parent" | "awaiting-child" | "approved";
  /** i18n key for the optional parent-centric note. */
  parentCentricNote?: string;
}

/**
 * The co-signer flow. Note the parent-centric guarantee: even when the child
 * operates, the PARENT confirms — Enough stays on the parent's side.
 */
export const coSignRequests: CoSignRequest[] = [
  {
    id: "cs-1",
    title: "familyPlane.cs1Title",
    detail: "familyPlane.cs1Detail",
    raisedBy: "familyPlane.cs1RaisedBy",
    needs: "familyPlane.cs1Needs",
    status: "awaiting-parent",
    parentCentricNote: "familyPlane.cs1Note",
  },
  {
    id: "cs-2",
    title: "familyPlane.cs2Title",
    detail: "familyPlane.cs2Detail",
    raisedBy: "familyPlane.cs2RaisedBy",
    needs: "familyPlane.cs2Needs",
    status: "awaiting-child",
  },
  {
    id: "cs-3",
    title: "familyPlane.cs3Title",
    detail: "familyPlane.cs3Detail",
    raisedBy: "familyPlane.cs3RaisedBy",
    needs: "familyPlane.cs3Needs",
    status: "approved",
  },
];

/** Alerts the adult-child operator sees (the oversight-without-intrusion face). */
export const childAlerts = [
  {
    tone: "emerald" as const,
    title: "familyPlane.alert1Title",
    body: "familyPlane.alert1Body",
  },
  {
    tone: "amber" as const,
    title: "familyPlane.alert2Title",
    body: "familyPlane.alert2Body",
  },
  {
    tone: "navy" as const,
    title: "familyPlane.alert3Title",
    body: "familyPlane.alert3Body",
  },
];
