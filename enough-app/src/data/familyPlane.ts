/**
 * Moat pillar E — the family layer / family tier (the uncontested whitespace).
 *
 * Permission model:
 *  - The retiree (parent) is the SOLE plan owner and decision-maker.
 *  - The adult child is an OPTIONAL, read-only viewer.
 *  - Access for the adult child requires the parent's explicit permission.
 *  - The parent can revoke access at any time.
 *  - The adult child never edits, approves or acts on the parent's behalf.
 *
 * All display text (names, roles, permissions, alerts) holds i18n KEYS; the
 * presentation layer translates. PARENT-CENTRIC by design: the safe-spend
 * number always optimises the parent's wellbeing. All data illustrative.
 */

export type FamilyRole = "owner" | "viewer";

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
    role: "viewer",
    roleLabel: "family.m3Role",
    permissions: ["family.m3p1", "family.m3p2", "family.m3p3"],
    initials: "WL",
    tone: "amber",
  },
];

/**
 * Read-only alerts surfaced to the adult-child view. Treated as notifications
 * only — the adult child cannot act on them.
 */
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
