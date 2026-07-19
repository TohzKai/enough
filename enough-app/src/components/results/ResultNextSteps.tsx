import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../ui";

interface Action {
  labelKey: string;
  bodyKey: string;
  to: string;
  ctaKey: string;
  emphasis: "primary" | "secondary" | "tertiary";
}

interface ResultNextStepsProps {
  /** When true, renders the adult-child read-only variant of the actions. */
  child: boolean;
}

/**
 * Three-card next-step action panel for the Results Overview tab. The
 * primary visual emphasis is on `Track monthly spending` (parent) /
 * `View shared spending` (adult-child). All actions route within the app —
 * no external links.
 */
export function ResultNextSteps({ child }: ResultNextStepsProps) {
  const { t } = useTranslation();
  const actions: Action[] = child
    ? [
        {
          labelKey: "results.actionViewSpending",
          bodyKey: "results.actionViewSpendingBody",
          to: "/spend",
          ctaKey: "results.actionViewSpending",
          emphasis: "primary",
        },
        {
          labelKey: "results.actionOpenSharedReport",
          bodyKey: "results.actionOpenReportBody",
          to: "/report",
          ctaKey: "results.actionOpenSharedReport",
          emphasis: "secondary",
        },
        {
          labelKey: "results.actionManageAccessChild",
          bodyKey: "results.actionManageAccessBody",
          to: "/family",
          ctaKey: "results.actionManageAccessChild",
          emphasis: "tertiary",
        },
      ]
    : [
        {
          labelKey: "results.actionTrackSpending",
          bodyKey: "results.actionTrackSpendingBody",
          to: "/spend",
          ctaKey: "results.actionTrackSpending",
          emphasis: "primary",
        },
        {
          labelKey: "results.actionOpenReport",
          bodyKey: "results.actionOpenReportBody",
          to: "/report",
          ctaKey: "results.actionOpenReport",
          emphasis: "secondary",
        },
        {
          labelKey: "results.actionManageAccess",
          bodyKey: "results.actionManageAccessBody",
          to: "/family",
          ctaKey: "results.actionManageAccess",
          emphasis: "tertiary",
        },
      ];

  return (
    <section aria-labelledby="next-steps-heading" className="space-y-3">
      <h2
        id="next-steps-heading"
        className="text-lg sm:text-xl font-bold text-enough-navy safe-break"
      >
        {t("results.nextStepsTitle")}
      </h2>
      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((a) => {
          const isPrimary = a.emphasis === "primary";
          return (
            <Card
              key={a.ctaKey}
              className={
                isPrimary
                  ? "border-enough-emerald/40 bg-enough-emerald/5 ring-1 ring-enough-emerald/30"
                  : "border-enough-line"
              }
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    isPrimary
                      ? "bg-enough-emerald text-white"
                      : a.emphasis === "secondary"
                        ? "bg-enough-navy/10 text-enough-navy"
                        : "bg-enough-navy/5 text-enough-slate"
                  }`}
                >
                  {t(
                    `results.nextSteps${a.emphasis.charAt(0).toUpperCase() + a.emphasis.slice(1)}Label`,
                  )}
                </span>
              </div>
              <h3 className="text-base font-bold text-enough-navy safe-break">
                {t(a.labelKey)}
              </h3>
              <p className="mt-1 text-sm text-enough-slate leading-snug safe-break">
                {t(a.bodyKey)}
              </p>
              <div className="mt-3">
                <Link
                  to={a.to}
                  className={
                    isPrimary
                      ? "btn-emerald min-h-[44px] inline-flex"
                      : a.emphasis === "secondary"
                        ? "btn-soft min-h-[44px] inline-flex"
                        : "btn-ghost min-h-[44px] inline-flex"
                  }
                >
                  {t(a.ctaKey)}
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
