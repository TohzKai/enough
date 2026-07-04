/**
 * Shared number/currency formatting helpers.
 *
 * All monetary values in the app are whole Singapore dollars (e.g. 1400, 150000).
 * Percentages arrive in two shapes: raw percentage points (confidence = 92) and
 * fractions (initialWithdrawalRate = 0.036) — hence the two percent helpers.
 */

const sgd0 = new Intl.NumberFormat("en-SG", { maximumFractionDigits: 0 });

/** Core money renderer: "S$1,400", "−S$180". Whole dollars, thousands-grouped. */
function money(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}S$${sgd0.format(Math.abs(rounded))}`;
}

/** Singapore-dollar lump sum, e.g. `S$1,400`. */
export function s$(n: number): string {
  return money(n);
}

/** Alias of {@link s$} for call sites that prefer the descriptive name. */
export function formatMoney(n: number): string {
  return money(n);
}

/** Monthly amount, e.g. `S$1,400/mo`. */
export function s$month(n: number): string {
  return `${money(n)}/mo`;
}

/** Alias of {@link s$month}. */
export function formatMoneyMonth(n: number): string {
  return `${money(n)}/mo`;
}

/** Signed monthly delta, e.g. `+S$110/mo`, `−S$180/mo`. */
export function formatDeltaMonth(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "−" : "+";
  return `${sign}S$${sgd0.format(Math.abs(rounded))}/mo`;
}

/** Percentage from a fraction (0.036 → "3.6%"). `digits` sets decimal places. */
export function pct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Percentage from a raw percentage number (92 → "92%"), rounded to whole percent. */
export function pctRaw(value: number): string {
  return `${Math.round(value)}%`;
}
