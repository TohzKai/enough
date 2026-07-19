import { useTranslation } from "react-i18next";

export type ResultSection = "overview" | "stress" | "actions" | "analytics";

interface ResultTabsProps {
  active: ResultSection;
  onChange: (next: ResultSection) => void;
}

interface TabDef {
  key: ResultSection;
  labelKey: string;
}

const TABS: TabDef[] = [
  { key: "overview", labelKey: "results.tabOverview" },
  { key: "stress", labelKey: "results.tabStress" },
  { key: "actions", labelKey: "results.tabAction" },
  { key: "analytics", labelKey: "results.tabAnalytics" },
];

/**
 * Accessible segmented tab control for the Results page.
 * - Uses `<button role="tab">` inside `<div role="tablist">`.
 * - `aria-selected` reflects the active tab.
 * - Each tab is keyboard-focusable (44px min height for senior accessibility).
 * - Labels translated through i18next — works in all four locales.
 */
export function ResultTabs({ active, onChange }: ResultTabsProps) {
  const { t } = useTranslation();
  return (
    <div
      role="tablist"
      aria-label={t("results.tabOverview")}
      className="flex flex-wrap gap-2 rounded-xl2 bg-enough-navy/5 p-1"
    >
      {TABS.map((tab) => {
        const selected = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`result-panel-${tab.key}`}
            id={`result-tab-${tab.key}`}
            onClick={() => onChange(tab.key)}
            className={`min-h-[44px] flex-1 rounded-xl2 px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 ${
              selected
                ? "bg-white text-enough-navy shadow-card"
                : "text-enough-navy/75 hover:bg-white/60"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
