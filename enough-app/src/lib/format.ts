/**
 * Locale-aware number / currency / percentage formatting helpers.
 *
 * All monetary values are whole Singapore dollars (e.g. 1400, 150000). The
 * helpers preserve the Singapore-dollar identity (always "S$", never an
 * ambiguous "$") while keeping locale-aware digit grouping and translated
 * word fragments ("/month", "to", "about X% confidence").
 *
 * Why a controlled formatter: `Intl.NumberFormat(locale, { style: "currency",
 * currency: "SGD", currencyDisplay: "narrowSymbol" })` renders "$2,139.00" for
 * every locale here — it drops the "S". So we format the digits with Intl
 * (locale grouping) and prepend the guaranteed "S$" prefix ourselves.
 *
 * The active locale comes from the i18next singleton (set before first render
 * in main.tsx), so the original call signatures (e.g. `formatMoney(2150)`)
 * stay valid and become locale-aware automatically. An explicit locale can be
 * passed to override, which the formatting tests rely on.
 *
 * Canonical examples (en-SG):
 *   formatMoney(2150)             => "S$2,150"
 *   formatMoneyMonth(2150)        => "S$2,150/month"
 *   formatRangeMonth(2000, 2350)  => "S$2,000 to S$2,350/month"
 *   formatConfidence(0.9)         => "about 90% confidence"
 *   formatDeltaMonth(-180)        => "−S$180/month"
 */
import { i18n, type AppLocale } from "../i18n";

const FALLBACK_LOCALE = "en-SG";

/** Resolve a BCP-47 string to one of the four supported app locales. */
function resolveLocale(locale?: string): AppLocale {
  const candidate = (locale ?? i18n.language ?? FALLBACK_LOCALE) as string;
  if (candidate.startsWith("zh")) return "zh-SG";
  if (candidate.startsWith("ms")) return "ms-SG";
  if (candidate.startsWith("ta")) return "ta-SG";
  return "en-SG";
}

/** Locale-aware thousands grouping of an absolute whole number. */
function grouped(absWhole: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(absWhole);
  } catch {
    // Defensive: a malformed locale must never break formatting.
    return new Intl.NumberFormat(FALLBACK_LOCALE, {
      maximumFractionDigits: 0,
    }).format(absWhole);
  }
}

/** Core money renderer: "S$1,400", "−S$180". Whole dollars, thousands-grouped. */
export function formatMoney(n: number, locale?: string): string {
  const lc = resolveLocale(locale);
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}S$${grouped(Math.abs(rounded), lc)}`;
}

/** Alias of {@link formatMoney}. `s$(2150)` => "S$2,150". */
export function s$(n: number, locale?: string): string {
  return formatMoney(n, locale);
}

/** Requested public alias. */
export function formatSGD(value: number, locale?: string): string {
  return formatMoney(value, locale);
}

/** Signed lump sum, e.g. `−S$250`, `+S$250`. */
export function formatSignedSGD(value: number, locale?: string): string {
  const lc = resolveLocale(locale);
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "−" : "+";
  return `${sign}S$${grouped(Math.abs(rounded), lc)}`;
}

/** Translated "/month" suffix for the active locale. */
function perMonth(locale?: string): string {
  return i18n.t("format.perMonth", { lng: resolveLocale(locale) }) || "/month";
}

/** Monthly amount, e.g. `S$1,400/month`. */
export function formatMoneyMonth(n: number, locale?: string): string {
  return `${formatMoney(n, locale)}${perMonth(locale)}`;
}

/** Requested public alias. */
export function formatMonthlySGD(value: number, locale?: string): string {
  return formatMoneyMonth(value, locale);
}

/** Alias of {@link formatMoneyMonth}. */
export function s$month(n: number, locale?: string): string {
  return formatMoneyMonth(n, locale);
}

/** Translated range separator (" to "). */
function rangeSep(locale?: string): string {
  return (
    i18n.t("format.rangeSeparator", { lng: resolveLocale(locale) }) || " to "
  );
}

/** Lump-sum range, e.g. `S$2,000 to S$2,350`. */
export function formatRange(lo: number, hi: number, locale?: string): string {
  return `${formatMoney(lo, locale)}${rangeSep(locale)}${formatMoney(hi, locale)}`;
}

/** Monthly range, e.g. `S$2,000 to S$2,350/month`. */
export function formatRangeMonth(
  lo: number,
  hi: number,
  locale?: string,
): string {
  return `${formatRange(lo, hi, locale)}${perMonth(locale)}`;
}

/** Signed monthly delta, e.g. `+S$110/month`, `−S$180/month`. */
export function formatDeltaMonth(n: number, locale?: string): string {
  const lc = resolveLocale(locale);
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "−" : "+";
  return `${sign}S$${grouped(Math.abs(rounded), lc)}${perMonth(lc)}`;
}

/** Signed monthly delta with no leading "+" for non-negative values (used inline). */
export function formatSignedSGDMonth(n: number, locale?: string): string {
  const lc = resolveLocale(locale);
  const rounded = Math.round(n);
  const sign = rounded < 0 ? "−" : "";
  return `${sign}S$${grouped(Math.abs(rounded), lc)}${perMonth(lc)}`;
}

/**
 * Confidence from a fraction (0.9 → "about 90% confidence"). `digits` sets the
 * decimal places of the percentage. The wording ("about", "confidence") is
 * translated for the active locale.
 */
export function formatConfidence(
  fraction: number,
  digits = 0,
  locale?: string,
): string {
  const pct = (fraction * 100).toFixed(digits);
  return (
    i18n.t("format.confidence", { pct, lng: resolveLocale(locale) }) ||
    `about ${pct}% confidence`
  );
}

/** Percentage from a fraction (0.036 → "3.6%"). `digits` sets decimal places. */
export function pct(fraction: number, digits = 0, _locale?: string): string {
  return `${(fraction * 100).toFixed(digits)}%`;
}

/** Alias of {@link pct} (fraction → percent). `formatPercent(0.9)` → "90%". */
export function formatPercent(
  fraction: number,
  digits = 0,
  locale?: string,
): string {
  return pct(fraction, digits, locale);
}

/** Requested public alias (fraction → percent). */
export function formatPercentage(
  fraction: number,
  digits = 0,
  locale?: string,
): string {
  return pct(fraction, digits, locale);
}

/** Percentage from a raw percentage number (92 → "92%"), rounded to whole. */
export function pctRaw(value: number, _locale?: string): string {
  return `${Math.round(value)}%`;
}

/** "2 yrs" style duration, translated for the active locale. */
export function formatYears(n: number, locale?: string): string {
  return (
    i18n.t("format.years", { n: Math.round(n), lng: resolveLocale(locale) }) ||
    `${Math.round(n)} yrs`
  );
}
