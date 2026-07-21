import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePlan } from "../store/planStore";
import { useViewMode } from "../store/viewMode";
import { Card, Spinner, SectionTitle } from "../components/ui";
import {
  ResultTabs,
  type ResultSection,
} from "../components/results/ResultTabs";
import { ResultActions } from "../components/results/ResultActions";
import { ScenarioLab } from "../components/results/ScenarioLab";
import { WithdrawalPlan } from "../components/results/WithdrawalPlan";
import { EngineExplainer } from "../components/results/EngineExplainer";
import { formatMoney, formatMoneyMonth, roundToNearest50 } from "../lib/format";

/**
 * Results page shell — the /result route.
 *
 * One canonical answer at the top: "You can safely spend about S$X per
 * month." Below the hero we render four tabs (Overview, Stress Tests,
 * Action Plan, Analytics) that organise the supporting analysis. The
 * main result is never replaced by the tab content.
 *
 * Reads `activeAnalysis` from the plan store (cached demo analysis in
 * demo mode, stored analysis in custom mode). No engine runs in this
 * file. Same `activeAnalysis` is shared with Spend Monitor and Family
 * Report.
 */
export function Dashboard() {
  const { t } = useTranslation();
  const { activeAnalysis, inputs, status, planMode } = usePlan();
  const { mode } = useViewMode();
  const child = mode === "child";
  const [activeSection, setActiveSection] = useState<ResultSection>("overview");

  if (status === "computing" && !activeAnalysis) {
    return (
      <Card>
        <Spinner label={t("results.simulating")} />
      </Card>
    );
  }

  if (!activeAnalysis) {
    return <EmptyResults />;
  }

  const central = activeAnalysis.safe.centralSpend;
  const lower = activeAnalysis.safe.lowerSpend;
  const upper = activeAnalysis.safe.upperSpend;
  const withdrawal = Math.max(0, central - inputs.cpfLifeMonthly);
  const gap = Math.max(0, inputs.desiredSpend - central);
  const desiredConfidence =
    activeAnalysis.curve.find((p) => p.spend >= inputs.desiredSpend)
      ?.successRate ?? 0;

  // Round the central result to the nearest S$50 so the hero reads
  // "About S$2,150/month" rather than the noisy engine value.
  const heroCentral = roundToNearest50(central);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={t("results.kickerCustom")}
        title={t("results.safeSpendPage")}
        subtitle={
          planMode === "demo"
            ? t("results.subtitleDemo")
            : t("results.yourCalculatedResult")
        }
      />

      {/* The single canonical safer-spend result. Always visible. */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {t("results.engineBadge")}
        </div>
        <div className="mt-3 text-white/60 text-xs font-semibold uppercase tracking-wider">
          {t("results.scenarioBaseline")}
        </div>
        <div className="mt-2 text-4xl md:text-5xl font-extrabold leading-tight">
          {t("results.safeSpendHero", { value: formatMoney(heroCentral) })}
        </div>
        <div className="mt-2 text-base text-white/85 safe-break">
          {t("results.safeSpendRange", {
            lower: formatMoney(lower),
            upper: formatMoney(upper),
            confidence: Math.round(activeAnalysis.safe.confidence),
          })}
        </div>
      </Card>

      {/* Four supporting tabs. The hero stays visible. */}
      <ResultTabs active={activeSection} onChange={setActiveSection} />

      <section
        role="tabpanel"
        id={`result-panel-${activeSection}`}
        aria-labelledby={`result-tab-${activeSection}`}
        tabIndex={0}
        className="space-y-6"
      >
        {activeSection === "overview" && (
          <OverviewTab
            cpfFloor={inputs.cpfLifeMonthly}
            withdrawal={withdrawal}
            desiredSpend={inputs.desiredSpend}
            gap={gap}
          />
        )}
        {activeSection === "stress" && (
          <ScenarioLab
            inputs={inputs}
            baseAnalysis={activeAnalysis}
            baseCentral={central}
            baseConfidence={activeAnalysis.safe.confidence}
            baseGap={gap}
          />
        )}
        {activeSection === "actions" && (
          <WithdrawalPlan
            vm={{
              inputs,
              analysis: activeAnalysis,
              saferLower: lower,
              saferUpper: upper,
              saferCentral: central,
              confidence: activeAnalysis.safe.confidence,
              cpfFloor: inputs.cpfLifeMonthly,
              withdrawal,
              desiredSpend: inputs.desiredSpend,
              desiredConfidence,
              gap,
              initialWithdrawalRate:
                (withdrawal * 12) /
                Math.max(1, inputs.cash + inputs.investments + inputs.srs),
              planMode,
              readOnly: child,
            }}
          />
        )}
        {activeSection === "analytics" && (
          <EngineExplainer
            vm={{
              inputs,
              analysis: activeAnalysis,
              saferLower: lower,
              saferUpper: upper,
              saferCentral: central,
              confidence: activeAnalysis.safe.confidence,
              cpfFloor: inputs.cpfLifeMonthly,
              withdrawal,
              desiredSpend: inputs.desiredSpend,
              desiredConfidence,
              gap,
              initialWithdrawalRate:
                (withdrawal * 12) /
                Math.max(1, inputs.cash + inputs.investments + inputs.srs),
              planMode,
              readOnly: child,
            }}
          />
        )}
      </section>
    </div>
  );
}

/**
 * Overview tab — shows the four supporting figures (CPF floor,
 * additional withdrawal, desired spend, gap) plus one compact
 * "Next steps" panel. Does NOT repeat the safer-spend hero.
 */
function OverviewTab({
  cpfFloor,
  withdrawal,
  desiredSpend,
  gap,
}: {
  cpfFloor: number;
  withdrawal: number;
  desiredSpend: number;
  gap: number;
}) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="text-xs text-enough-slate">
            {t("results.cpfFloorLabel")}
          </div>
          <div className="mt-1 text-lg font-extrabold text-enough-navy">
            {formatMoneyMonth(cpfFloor)}
          </div>
          <div className="text-[11px] text-enough-slate">
            {t("results.cpfFloorSub")}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-enough-slate">
            {t("results.withdrawalLabel")}
          </div>
          <div className="mt-1 text-lg font-extrabold text-enough-navy">
            {formatMoneyMonth(withdrawal)}
          </div>
          <div className="text-[11px] text-enough-slate">
            {t("results.withdrawalSource")}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-enough-slate">
            {t("results.desiredLabel")}
          </div>
          <div className="mt-1 text-lg font-extrabold text-enough-navy">
            {formatMoneyMonth(desiredSpend)}
          </div>
          <div className="text-[11px] text-enough-slate">
            {t("results.desiredSub")}
          </div>
        </Card>
        <Card>
          <div className="text-xs text-enough-slate">
            {t("results.gapLabel")}
          </div>
          <div className="mt-1 text-lg font-extrabold text-enough-navy">
            {formatMoneyMonth(Math.max(0, gap))}
          </div>
          <div className="text-[11px] text-enough-slate">
            {t("results.gapSub")}
          </div>
        </Card>
      </div>
      <ResultActions
        onTestScenario={() => {
          /* ResultActions in this layout does not switch tabs (tab is owned
             by the Dashboard). The button shows the "Test a scenario"
             hint — the user clicks the Stress Tests tab below. */
        }}
        onSeeWithdrawalPlan={() => {
          setActiveSectionExternal();
        }}
      />
    </div>
  );
}

/* Minimal helper to bridge ResultActions' callbacks to the Dashboard's
 * setActiveSection. ResultActions was designed to open inline sections
 * in the previous "no tabs" version — for the tabbed version the
 * callbacks jump to the corresponding tab instead. */
function setActiveSectionExternal() {
  // no-op (placeholder; Dashboard's own ResultActions integration is
  // not yet wired). The new tabbed Overview already surfaces the next
  // steps via its own copy.
}

function EmptyResults() {
  const { t } = useTranslation();
  const { loadSample } = usePlan();
  return (
    <Card>
      <div className="text-center py-10">
        <div className="text-2xl font-bold text-enough-navy">
          {t("results.noPlanTitle")}
        </div>
        <p className="readable mt-2 mx-auto text-enough-slate">
          {t("results.noPlanBody")}
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={loadSample} className="btn-emerald min-h-[44px]">
            {t("results.loadSample")}
          </button>
        </div>
      </div>
    </Card>
  );
}
