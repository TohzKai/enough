/**
 * Internationalisation entry point.
 *
 * Initialised synchronously (bundled resources, no network) so the React tree
 * never renders before translations are ready. `main.tsx` imports this module
 * for its side effect before `createRoot().render(...)`.
 *
 * Language is PRESENTATION state only — changing it never touches the financial
 * plan, simulation, route, view mode, or any stored result (see requirements
 * §14). The four supported locales, the localStorage persistence key, and the
 * browser-language → locale mapping all live here.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enSG from "./locales/en-SG";
import zhSG from "./locales/zh-SG";
import msSG from "./locales/ms-SG";
import taSG from "./locales/ta-SG";

/** The four supported Singapore locales. */
export const LOCALES = ["en-SG", "zh-SG", "ms-SG", "ta-SG"] as const;
export type AppLocale = (typeof LOCALES)[number];

/** Display name shown in the language selector (native script, no flags). */
export const LOCALE_NAMES: Record<AppLocale, string> = {
  "en-SG": "English",
  "zh-SG": "简体中文",
  "ms-SG": "Bahasa Melayu",
  "ta-SG": "தமிழ்",
};

/**
 * Compact short codes for the compact header language selector. The full
 * native name lives in LOCALE_NAMES and is used in the dropdown options.
 */
export const LOCALE_SHORT_NAMES: Record<AppLocale, string> = {
  "en-SG": "EN",
  "zh-SG": "中文",
  "ms-SG": "BM",
  "ta-SG": "தமிழ்",
};

/** localStorage key that stores the user's chosen locale. */
export const STORAGE_KEY = "enough.locale";

/** English fallback locale used for any missing key / unsupported value. */
export const FALLBACK: AppLocale = "en-SG";

const isDev =
  typeof import.meta !== "undefined" &&
  Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);

function isSupportedLocale(value: unknown): value is AppLocale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

/**
 * Map a single browser language tag to a supported locale by its primary
 * subtag. en→en-SG, zh→zh-SG, ms→ms-SG, ta→ta-SG; anything else → undefined
 * (caller falls back to English).
 */
function browserTagToLocale(tag: string): AppLocale | undefined {
  const primary = tag.trim().toLowerCase().split(/[-_]/)[0];
  switch (primary) {
    case "en":
      return "en-SG";
    case "zh":
      return "zh-SG";
    case "ms":
      return "ms-SG";
    case "ta":
      return "ta-SG";
    default:
      return undefined;
  }
}

/**
 * Locale priority (requirements §3):
 *   1. previously saved preference (localStorage `enough.locale`)
 *   2. supported browser language on first visit (navigator.languages)
 *   3. English fallback
 * Corrupt / unsupported stored values are ignored safely.
 */
export function detectInitialLocale(): AppLocale {
  // 1. Saved preference
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLocale(saved)) return saved;
  } catch {
    /* localStorage disabled / blocked — fall through to browser detection */
  }

  // 2. Browser language(s)
  try {
    const candidates =
      typeof navigator !== "undefined" && navigator.languages?.length
        ? navigator.languages
        : typeof navigator !== "undefined" && navigator.language
          ? [navigator.language]
          : [];
    for (const tag of candidates) {
      const mapped = browserTagToLocale(tag);
      if (mapped) return mapped;
    }
  } catch {
    /* navigator unavailable — fall through to English */
  }

  // 3. Fallback
  return FALLBACK;
}

/** Set `<html lang>` to the active locale (used on init + on every change). */
function applyHtmlLang(locale: AppLocale): void {
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
}

/** Update the document/tab title for the active locale (falls back gracefully). */
function applyDocumentTitle(locale: AppLocale): void {
  if (typeof document === "undefined") return;
  const title = i18n.t("common.appTitle", { lng: locale });
  if (title && title !== "common.appTitle") document.title = title;
}

/**
 * Switch the active locale, persist it, and sync `<html lang>`. Returns the
 * resolved locale. Invalid input resolves to the English fallback and is
 * persisted as the fallback value so the selector never shows a broken state.
 */
export async function changeLocale(locale: AppLocale): Promise<AppLocale> {
  const resolved = isSupportedLocale(locale) ? locale : FALLBACK;
  await i18n.changeLanguage(resolved);
  try {
    localStorage.setItem(STORAGE_KEY, resolved);
  } catch {
    /* storage unavailable — in-memory change still applies */
  }
  applyHtmlLang(resolved);
  applyDocumentTitle(resolved);
  return resolved;
}

export { i18n };

if (!i18n.isInitialized) {
  const initial = detectInitialLocale();
  i18n.use(initReactI18next).init({
    resources: {
      "en-SG": { translation: enSG },
      "zh-SG": { translation: zhSG },
      "ms-SG": { translation: msSG },
      "ta-SG": { translation: taSG },
    },
    lng: initial,
    fallbackLng: FALLBACK,
    supportedLngs: [...LOCALES],
    // Inline resources ARE the full set (no backend), so mark them as bundled —
    // i18next then treats every locale as loaded immediately and t() resolves
    // without waiting on an async backend cycle.
    partialBundledLanguages: true,
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    // react-i18next: do not suspend; re-render when i18n becomes ready so the
    // first paint falls back to English then swaps once the locale is set.
    react: { useSuspense: false },
    // A missing key returns the key text (not an empty string) so a gap is
    // visible in dev; supported locales fall back to English via fallbackLng,
    // so end users never see a raw key.
    returnEmptyString: false,
    returnNull: false,
    // Dev-only: surface missing keys in the console without flooding production.
    saveMissing: isDev,
    missingKeyHandler: isDev
      ? (_lngs, _ns, key) => {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] missing translation key: "${key}"`);
        }
      : undefined,
  });
  applyHtmlLang(initial);
  applyDocumentTitle(initial);
  // Keep <html lang> and the tab title in sync on any language change.
  i18n.on("languageChanged", (lng: string) => {
    const resolved = isSupportedLocale(lng) ? lng : FALLBACK;
    applyHtmlLang(resolved);
    applyDocumentTitle(resolved);
  });
}
