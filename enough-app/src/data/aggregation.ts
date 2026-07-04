/**
 * Moat pillar A — Account aggregation / system-of-record (Singpass → SGFinDex).
 *
 * The strategy (enough-moat-and-differentiation.md §4 "The three to build deeply",
 * pillar A) makes consented whole-wealth aggregation the biggest single step-change
 * in lock-in and the thing that kills the #1 friction: senior data entry. This
 * dataset drives the "Connect with Singpass" flow — an ILLUSTRATIVE prototype of a
 * consented pull via Myinfo / SGFinDex, never a real connection.
 *
 * Regulatory discipline (enough-risks-and-constraints.md §1.4): SGFinDex
 * participation typically requires licensed-FI status, so at MVP this is Myinfo +
 * manual; full SGFinDex is the post-licence upgrade. The flow is labelled as a
 * prototype throughout.
 */

export type AccountKind = "cpf" | "srs" | "bank" | "investment" | "property";

export interface ConnectedAccount {
  kind: AccountKind;
  source: string; // the institution Singpass/SGFinDex would surface
  label: string;
  /** S$ balance (or monthly payout for the CPF LIFE row). */
  amount: number;
  /** true = a monthly income figure, not a balance. */
  isMonthly?: boolean;
  note?: string;
  /** Whether this account is counted in the spendable base. */
  spendable: boolean;
}

/**
 * The accounts a consented Singpass/SGFinDex pull would surface for Mr Tan.
 * Balances reconcile to the aligned worked example (S$190k spendable + CPF LIFE
 * floor + an excluded primary residence).
 */
export const connectedAccounts: ConnectedAccount[] = [
  {
    kind: "cpf",
    source: "CPF Board",
    label: "CPF LIFE payout (Standard)",
    amount: 1550,
    isMonthly: true,
    note: "Guaranteed income floor for life",
    spendable: true,
  },
  {
    kind: "bank",
    source: "DBS · via SGFinDex",
    label: "Savings & fixed deposits",
    amount: 40000,
    note: "Cash buffer for bad-market years",
    spendable: true,
  },
  {
    kind: "investment",
    source: "Endowus · Poems · via SGFinDex",
    label: "Investments (unit trusts, shares)",
    amount: 130000,
    note: "Bonds + equity — the growth engine",
    spendable: true,
  },
  {
    kind: "srs",
    source: "OCBC SRS · via SGFinDex",
    label: "SRS account",
    amount: 20000,
    note: "10-year window · 50% taxable on withdrawal",
    spendable: true,
  },
  {
    kind: "property",
    source: "HDB · via Myinfo",
    label: "4-room HDB flat (paid off)",
    amount: 520000,
    note: "Excluded from spendable base by default — illiquid",
    spendable: false,
  },
];

/** The ordered steps the Singpass-pull animation walks through. */
export const singpassPullSteps = [
  "Redirecting to Singpass…",
  "Retrieving CPF LIFE & CPF balances (CPF Board)",
  "Retrieving bank balances (SGFinDex)",
  "Retrieving investments & SRS (SGFinDex)",
  "Retrieving HDB property (Myinfo)",
  "Building your whole-wealth picture",
];

export const spendableTotal = connectedAccounts
  .filter((a) => a.spendable && !a.isMonthly)
  .reduce((sum, a) => sum + a.amount, 0);
