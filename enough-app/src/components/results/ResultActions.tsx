import { useTranslation } from "react-i18next";
import { Card } from "../ui";

interface ResultActionsProps {
  /**
   * Called when the user activates a primary action. The Dashboard
   * decides which supporting panel to open (Scenario Lab, Withdrawal
   * Plan, or engine explanation).
   */
  onTestScenario: () => void;
  onSeeWithdrawalPlan: () => void;
}

/**
 * One compact action area beneath the main safer-spend result.
 * Shows three primary actions (Test a scenario, See withdrawal plan,
 * Track monthly spending) and two small text links (Open family
 * report, Manage family access).
 *
 * The primary actions do not duplicate the result; they open
 * supporting sections inline on the same /result page.
 */
export function ResultActions({
  onTestScenario,
  onSeeWithdrawalPlan,
}: ResultActionsProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <h2 className="text-lg font-bold text-enough-navy safe-break">
        {t("results.explorePlan")}
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <button
          type="button"
          onClick={onTestScenario}
          className="rounded-xl2 border border-enough-emerald/40 bg-enough-emerald/5 p-4 text-left hover:bg-enough-emerald/10"
        >
          <span className="inline-block rounded-full bg-enough-emerald text-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {t("results.nextStepsPrimaryLabel")}
          </span>
          <h3 className="mt-2 text-base font-bold text-enough-navy">
            {t("results.testAScenario")}
          </h3>
          <p className="mt-1 text-sm text-enough-slate leading-snug safe-break">
            {t("results.scenarioLabSub")}
          </p>
        </button>
        <button
          type="button"
          onClick={onSeeWithdrawalPlan}
          className="rounded-xl2 border border-enough-line bg-white p-4 text-left hover:bg-enough-navy/5"
        >
          <span className="inline-block rounded-full bg-enough-navy/10 text-enough-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {t("results.nextStepsSecondaryLabel")}
          </span>
          <h3 className="mt-2 text-base font-bold text-enough-navy">
            {t("results.seeWithdrawalPlan")}
          </h3>
          <p className="mt-1 text-sm text-enough-slate leading-snug safe-break">
            {t("results.optionsToExploreNote")}
          </p>
        </button>
        <a
          href="/spend"
          className="rounded-xl2 border border-enough-line bg-white p-4 text-left hover:bg-enough-navy/5"
        >
          <span className="inline-block rounded-full bg-enough-navy/10 text-enough-navy px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
            {t("results.nextStepsTertiaryLabel")}
          </span>
          <h3 className="mt-2 text-base font-bold text-enough-navy">
            {t("results.trackMonthlySpending")}
          </h3>
          <p className="mt-1 text-sm text-enough-slate leading-snug safe-break">
            {t("results.actionTrackSpendingBody")}
          </p>
        </a>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <a
          href="/report"
          className="text-enough-navy hover:text-enough-emeraldDark font-semibold underline-offset-2 hover:underline"
        >
          {t("results.openFamilyReport")} →
        </a>
        <a
          href="/family"
          className="text-enough-navy hover:text-enough-emeraldDark font-semibold underline-offset-2 hover:underline"
        >
          {t("results.manageFamilyAccess")} →
        </a>
      </div>
    </Card>
  );
}
