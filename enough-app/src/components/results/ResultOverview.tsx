import { useTranslation } from "react-i18next";
import { Card, Pill, StatCard } from "../ui";
import { formatMoney, roundToNearest50 } from "../../lib/format";
import type { ResultViewModel } from "./resultModel";

interface ResultOverviewProps {
  vm: ResultViewModel;
}

/**
 * "Safe Spend" — the single canonical result. Shows the engine badge,
 * the rounded safer-spend hero, four supporting stat cards, and a short
 * CPF LIFE explanation. No action cards (those live in ResultActions).
 *
 * Only one of these exists in the entire app. It is mounted by
 * Dashboard.tsx exactly once, directly under the page heading.
 */
export function ResultOverview({ vm }: ResultOverviewProps) {
  const { t } = useTranslation();
  const rounded = roundToNearest50(vm.saferCentral);
  const rangeLow = formatMoney(roundToNearest50(vm.saferLower));
  const rangeHigh = formatMoney(roundToNearest50(vm.saferUpper));
  const withdrawal = Math.max(0, vm.saferCentral - vm.cpfFloor);
  const isDemo = vm.planMode === "demo";

  return (
    <div className="space-y-6">
      <div className="rounded-xl2 border border-enough-emerald/30 bg-enough-emerald/5 p-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-enough-emeraldDark">
        <Pill tone="emerald">{t("results.engineBadge")}</Pill>
      </div>

      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-6">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {t("results.scenarioBaseline")}
        </div>
        <div className="mt-2 text-4xl md:text-5xl font-extrabold leading-tight">
          {t("results.safeSpendHero", { value: rounded })}
        </div>
        <div className="mt-2 text-base text-white/85 safe-break">
          {t("results.safeSpendRange", {
            lower: rangeLow,
            upper: rangeHigh,
            confidence: `${Math.round(vm.confidence)}% confidence`,
          })}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("results.cpfFloorLabel")}
          value={formatMoney(vm.cpfFloor)}
          tone="navy"
          sub={t("results.cpfFloorSub")}
        />
        <StatCard
          label={t("results.withdrawalLabel")}
          value={formatMoney(withdrawal)}
          tone="emerald"
          sub={t("results.withdrawalSub", {
            rate: `${(((withdrawal * 12) / Math.max(1, vm.inputs.cash + vm.inputs.investments + vm.inputs.srs)) * 100).toFixed(1)}%`,
          })}
        />
        <StatCard
          label={t("results.desiredLabel")}
          value={formatMoney(vm.desiredSpend)}
          tone="amber"
          sub={t("common.perMonth")}
        />
        <StatCard
          label={t("results.gapLabel")}
          value={formatMoney(Math.max(0, vm.gap))}
          tone="red"
          sub={t("common.perMonth")}
        />
      </div>

      <p className="readable text-sm text-enough-slate leading-relaxed safe-break">
        {isDemo
          ? t("results.illustrativeWorkedExampleNote")
          : t("results.yourCalculatedNote")}
      </p>
    </div>
  );
}
