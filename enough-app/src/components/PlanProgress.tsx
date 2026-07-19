import { useTranslation } from "react-i18next";

/**
 * Compact 3-step workflow indicator used on Plan Setup, Results and
 * Spend Monitor. Three steps:
 *   1. Set up plan
 *   2. See safer spend
 *   3. Track spending
 *
 * The `currentStep` prop marks the active step (1, 2 or 3). All other steps
 * render as completed (≤ current) or pending (> current). No icons — text and
 * numbers only, to stay accessible to senior readers.
 */
export type PlanProgressStep = 1 | 2 | 3;

interface PlanProgressProps {
  currentStep: PlanProgressStep;
  /** Optional override for the active-step explanation. */
  hintKey?: string;
}

const STEP_KEYS: Array<{ num: PlanProgressStep; labelKey: string }> = [
  { num: 1, labelKey: "connect.workflowStep1" },
  { num: 2, labelKey: "connect.workflowStep2" },
  { num: 3, labelKey: "connect.workflowStep3" },
];

export function PlanProgress({ currentStep, hintKey }: PlanProgressProps) {
  const { t } = useTranslation();
  return (
    <section
      aria-label={t("connect.workflowStep1")}
      className="rounded-xl2 border border-enough-line bg-white px-3 py-2.5 sm:px-4 sm:py-3"
    >
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        {STEP_KEYS.map((step, idx) => {
          const isDone = step.num < currentStep;
          const isActive = step.num === currentStep;
          const stateLabel = isDone
            ? "✓"
            : isActive
              ? String(step.num)
              : String(step.num);
          const stateClasses = isActive
            ? "bg-enough-emerald text-white border-enough-emerald"
            : isDone
              ? "bg-enough-navy text-white border-enough-navy"
              : "bg-white text-enough-slate border-enough-line";
          return (
            <li
              key={step.num}
              className="flex items-center gap-2 min-w-0"
              aria-current={isActive ? "step" : undefined}
            >
              <span
                aria-hidden="true"
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-extrabold ${stateClasses}`}
              >
                {stateLabel}
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isActive
                    ? "text-enough-navy"
                    : isDone
                      ? "text-enough-navy/80"
                      : "text-enough-slate"
                }`}
              >
                <span className="text-enough-slate/70 mr-1">{step.num}.</span>
                {t(step.labelKey)}
              </span>
              {idx < STEP_KEYS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="text-enough-line mx-1 hidden sm:inline"
                >
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {hintKey && (
        <p className="mt-1.5 text-xs text-enough-slate leading-snug safe-break">
          {t(hintKey)}
        </p>
      )}
    </section>
  );
}
