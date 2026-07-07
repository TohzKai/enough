/**
 * Shared number/currency formatting helpers.
 *
 * All monetary values in the app are whole Singapore dollars (e.g. 1400, 150000).
 * Percentages arrive in two shapes: raw percentage points (confidence = 92) and
 * fractions (initialWithdrawalRate = 0.036) — hence the two percent helpers.
 *
 * Canonical money + period formats, used consistently across the app:
 *   formatMoney(2150)        => "S$2,150"
 *   formatMoneyMonth(2150)   => "S$2,150/month"
 *   formatRangeMonth(2000, 2350) => "S$2,000 to S$2,350/month"
 *   formatConfidence(0.9)    => "about 90% confidence"
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

/** Monthly amount, e.g. `S$1,400/month`. */
export function s$month(n: number): string {
  return `${money(n)}/month`;
}

/** Alias of {@link s$month}. */
export function formatMoneyMonth(n: number): string {
  return `${money(n)}/month`;
}

/** Monthly range, e.g. `S$2,000 to S$2,350/month`. */
export function formatRangeMonth(lo: number, hi: number): string {
  return `${money(lo)} to ${money(hi)}/month`;
}

/** Signed monthly delta, e.g. `+S$110/month`, `−S$180/month`. */
export function formatDeltaMonth(n: number): string {
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "−" : "+";
  return `${sign}S$${sgd0.format(Math.abs(rounded))}/month`;
}

/**
 * Confidence from a fraction (0.9 → "about 90% confidence"). `digits` sets the
 * decimal places of the percentage.
 */
export function formatConfidence(fraction: number, digits = 0): string {
  return `about ${(fraction * 100).toFixed(digits)}% confidence`;
}

/** Percentage from a fraction (0.036 → "3.6%"). `digits` sets decimal places. */
export function pct(fraction: number, digits = 0): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Alias of {@link pct} (fraction → percent). `formatPercent(0.9)` → "90%". */
export function formatPercent(fraction: number, digits = 0): string {
  return pct(fraction, digits);
}

/** Percentage from a raw percentage number (92 → "92%"), rounded to whole percent. */
export function pctRaw(value: number): string {
  return `${Math.round(value)}%`;
}
