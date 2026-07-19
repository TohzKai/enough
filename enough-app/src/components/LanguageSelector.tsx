import { useTranslation } from "react-i18next";
import {
  LOCALES,
  LOCALE_NAMES,
  LOCALE_SHORT_NAMES,
  changeLocale,
  type AppLocale,
} from "../i18n";

/**
 * Accessible language selector.
 *
 * A native `<select>` is the most robust choice for senior users: it is fully
 * keyboard-operable, works identically on desktop / tablet / mobile, exposes a
 * real accessible name, and never reloads the page or touches the route. The
 * React tree re-renders on `changeLanguage`, so visible text updates instantly
 * while financial state, view mode and route are untouched (language is
 * presentation state only — see i18n/index.ts).
 *
 * Native names are shown in their own script (no national flags — languages are
 * not countries). Min touch target is 44×44px.
 */
export function LanguageSelector({
  className = "",
  compact = false,
}: {
  className?: string;
  /** Compact variant for tight header space (icon-led, no visible "Language" word). */
  compact?: boolean;
}) {
  const { t, i18n: i18nInstance } = useTranslation();
  const current = (i18nInstance.resolvedLanguage ?? "en-SG") as AppLocale;

  return (
    <label
      className={`inline-flex items-center gap-1.5 min-w-0 ${
        compact ? "" : "rounded-xl2 bg-white/10 px-1 py-0.5"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="select-none text-base leading-none hidden sm:inline-block"
        title={t("accessibility.changeLanguage")}
      >
        {/* Globe glyph — accompanied by the accessible name on the control. */}
        🌐
      </span>
      <span className="sr-only">{t("accessibility.languageLabel")}</span>
      <select
        aria-label={t("accessibility.changeLanguage")}
        value={current}
        onChange={(e) => {
          void changeLocale(e.target.value as AppLocale);
        }}
        className={`min-h-[44px] min-w-0 ${
          compact ? "max-w-[5.5rem]" : "max-w-[6.5rem]"
        } truncate cursor-pointer appearance-none bg-transparent text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-enough-navy ${
          compact ? "text-white py-1 pl-1 pr-1" : "text-white py-1.5 pl-1 pr-2"
        }`}
      >
        {LOCALES.map((l) => (
          <option key={l} value={l} className="bg-white text-enough-navy">
            {compact ? LOCALE_SHORT_NAMES[l] : LOCALE_NAMES[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
