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
 * Balances reconcile to the aligned worked example (S$520k spendable + CPF LIFE
 * floor + an excluded primary residence).
 */
export const connectedAccounts: ConnectedAccount[] = [
  {
    kind: "cpf",
    source: "connect.acctCpfSource",
    label: "connect.acctCpfLabel",
    amount: 1550,
    isMonthly: true,
    note: "connect.acctCpfNote",
    spendable: true,
  },
  {
    kind: "bank",
    source: "connect.acctBankSource",
    label: "connect.acctBankLabel",
    amount: 40000,
    note: "connect.acctBankNote",
    spendable: true,
  },
  {
    kind: "investment",
    source: "connect.acctInvestSource",
    label: "connect.acctInvestLabel",
    amount: 460000,
    note: "connect.acctInvestNote",
    spendable: true,
  },
  {
    kind: "srs",
    source: "connect.acctSrsSource",
    label: "connect.acctSrsLabel",
    amount: 20000,
    note: "connect.acctSrsNote",
    spendable: true,
  },
  {
    kind: "property",
    source: "connect.acctPropSource",
    label: "connect.acctPropLabel",
    amount: 520000,
    note: "connect.acctPropNote",
    spendable: false,
  },
];

/** The ordered steps the Singpass-pull animation walks through (i18n keys). */
export const singpassPullSteps = [
  "connect.step0",
  "connect.step1",
  "connect.step2",
  "connect.step3",
  "connect.step4",
  "connect.step5",
];

export const spendableTotal = connectedAccounts
  .filter((a) => a.spendable && !a.isMonthly)
  .reduce((sum, a) => sum + a.amount, 0);
