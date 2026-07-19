import { useRef, type KeyboardEvent } from "react";
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
  { key: "overview", labelKey: "resultsTabs.overview" },
  { key: "stress", labelKey: "resultsTabs.stress" },
  { key: "actions", labelKey: "resultsTabs.actions" },
  { key: "analytics", labelKey: "resultsTabs.analytics" },
];

/**
 * Tablist for the /result page. Always renders above 44px control
 * height. Keyboard navigation: Left/Right/Home/End move focus between
 * tabs; focus is moved to the newly selected tab. The tablist is a
 * scroll-snap container so that on small screens (where the four tabs
 * do not fit) the user can swipe horizontally without overflowing the
 * page.
 */
export function ResultTabs({ active, onChange }: ResultTabsProps) {
  const { t } = useTranslation();
  const buttonRefs = useRef<Record<ResultSection, HTMLButtonElement | null>>({
    overview: null,
    stress: null,
    actions: null,
    analytics: null,
  });

  const focusByKey = (key: ResultSection) => {
    const btn = buttonRefs.current[key];
    if (btn) btn.focus();
  };

  const moveBy = (delta: number) => {
    const idx = TABS.findIndex((t) => t.key === active);
    if (idx < 0) return;
    const nextIdx = (idx + delta + TABS.length) % TABS.length;
    const nextKey = TABS[nextIdx].key;
    onChange(nextKey);
    requestAnimationFrame(() => focusByKey(nextKey));
  };

  const onKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    key: ResultSection,
  ) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveBy(1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveBy(-1);
        break;
      case "Home":
        e.preventDefault();
        onChange("overview");
        requestAnimationFrame(() => focusByKey("overview"));
        break;
      case "End":
        e.preventDefault();
        onChange("analytics");
        requestAnimationFrame(() => focusByKey("analytics"));
        break;
      default:
        void key;
    }
  };

  return (
    <div
      role="tablist"
      aria-label={t("results.tabOverview")}
      className="flex flex-row gap-2 overflow-x-auto rounded-xl2 bg-enough-navy/5 p-1 snap-x snap-mandatory"
    >
      {TABS.map((tab) => {
        const selected = active === tab.key;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              buttonRefs.current[tab.key] = el;
            }}
            type="button"
            role="tab"
            tabIndex={selected ? 0 : -1}
            aria-selected={selected}
            aria-controls={`result-panel-${tab.key}`}
            id={`result-tab-${tab.key}`}
            onClick={() => onChange(tab.key)}
            onKeyDown={(e) => onKeyDown(e, tab.key)}
            className={`min-h-[44px] shrink-0 px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 snap-start ${
              selected
                ? "bg-white text-enough-navy rounded-xl2 shadow-card"
                : "text-enough-navy/75 hover:bg-white/60 rounded-xl2"
            }`}
          >
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
