import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { usePlan } from "../store/planStore";
import { useViewMode } from "../store/viewMode";
import { Card, SectionTitle, StatCard, Pill, Spinner } from "../components/ui";
import {
  formatMoney,
  formatMoneyMonth,
  formatDeltaMonth,
  formatConfidence,
  pct,
  pctRaw,
  s$,
} from "../lib/format";
import { demoSensitivity, demoSequence } from "../data/demoDataset";
import { mrTanInputs } from "../data/mrTan";
import { GapCloser } from "../components/GapCloser";
import { FundingSequence } from "../components/FundingSequence";
import { ProtectionReferral } from "../components/ProtectionReferral";
import {
  currentGuardrail,
  guardrailBands,
  learningTimeline,
} from "../data/guardrails";
import { childAlerts } from "../data/familyPlane";
import {
  lifeEventStressTestsFor,
  optionsToDiscuss,
  type LifeEventStressTest,
  type StressTone,
} from "../data/lifeEvents";
import { layerTotals } from "../data/lifestyle";
import type { PlanInputs } from "../types";
import {
  runSensitivityAnalysis,
  generateSequenceRiskScenario,
  runFullAnalysisSync,
  type SensitivityResult,
  type SequenceRiskResult,
  type FullAnalysis,
} from "../engine";
import {
  ResultTabs,
  type ResultSection,
} from "../components/results/ResultTabs";
import { ResultNextSteps } from "../components/results/ResultNextSteps";

/* Detect the canonical Mr Tan case → stable presentation-calibrated result. */
function isMrTan(i: ReturnType<typeof usePlan>["inputs"]): boolean {
  return (
    i.age === 65 &&
    i.cpfLifeMonthly === 1550 &&
    i.cash + i.investments + i.srs === 190000 &&
    i.desiredSpend === 3100 &&
    i.horizonAge === 80
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const { analysis, inputs, status } = usePlan();
  const { mode } = useViewMode();
  const child = mode === "child";
  const [activeSection, setActiveSection] = useState<ResultSection>("overview");

  if (status === "computing" && !analysis) {
    return (
      <Card>
        <Spinner label={t("results.simulating")} />
      </Card>
    );
  }

  if (isMrTan(inputs)) {
    return (
      <MrTanResults
        section={activeSection}
        onSectionChange={setActiveSection}
        child={child}
      />
    );
  }
  if (!analysis) return <EmptyResults />;
  return (
    <CustomResults
      section={activeSection}
      onSectionChange={setActiveSection}
      analysis={analysis}
      child={child}
    />
  );
}

/* ============ Empty state (no plan yet) ============ */
function EmptyResults() {
  const { t } = useTranslation();
  const navigate = useNavigateProxy();
  const { setInputs } = usePlan();
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
          <button
            onClick={() => navigate("/plan")}
            className="btn-emerald min-h-[44px]"
          >
            {t("results.connectAccounts")}
          </button>
          <button
            onClick={() => {
              setInputs({ ...mrTanInputs });
            }}
            className="btn-ghost min-h-[44px]"
          >
            {t("results.loadSample")}
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ============ Adult-child oversight strip ============ */
function OversightStrip() {
  const { t } = useTranslation();
  const alertTone: Record<string, string> = {
    emerald: "border-l-enough-emerald bg-enough-emerald/5",
    amber: "border-l-enough-amber bg-enough-amber/5",
    navy: "border-l-enough-navy bg-enough-navy/5",
  };
  return (
    <Card className="!p-4">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <Pill tone="amber">{t("navigation.adultChildView")}</Pill>
        <span className="text-sm font-semibold text-enough-navy">
          {t("results.oversightTitle")}
        </span>
      </div>
      <p className="text-xs text-enough-slate mb-3 leading-snug safe-break">
        {t("results.oversightBody")}
      </p>
      <div className="grid sm:grid-cols-3 gap-2.5">
        {childAlerts.map((a) => (
          <div
            key={a.title}
            className={`rounded-xl2 border border-enough-line border-l-4 p-3 ${alertTone[a.tone]}`}
          >
            <div className="font-bold text-enough-navy text-sm safe-break">
              {t(a.title)}
            </div>
            <div className="text-xs text-enough-ink mt-1 leading-snug safe-break">
              {t(a.body)}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/family"
        className="mt-3 inline-flex text-sm font-semibold text-enough-navy hover:text-enough-emeraldDark"
      >
        {t("results.goToFamily")}
      </Link>
    </Card>
  );
}

/* ============ Mr Tan — presentation worked example ============ */
interface MrTanResultsProps {
  section: ResultSection;
  onSectionChange: (s: ResultSection) => void;
  child: boolean;
}

/**
 * Worked example Results view. Runs the live Monte Carlo engine on
 * `mrTanInputs` so the displayed figures are engine-truthful and the
 * app cannot drift from the slide deck.
 */
function MrTanResults({ section, onSectionChange, child }: MrTanResultsProps) {
  const { t } = useTranslation();
  const { inputs } = usePlan();

  // Run the engine once on the calibrated Mr Tan inputs so every panel
  // sees the same numbers. Custom plans take a different path through
  // CustomResults, which uses the user's stored analysis.
  const analysis = useMemo(() => runFullAnalysisSync(mrTanInputs), []);
  const centralSpend = analysis.safe.centralSpend;
  const saferLower = analysis.safe.lowerSpend;
  const saferUpper = analysis.safe.upperSpend;
  const horizonAge = inputs.horizonAge;
  const totalAssets =
    mrTanInputs.cash + mrTanInputs.investments + mrTanInputs.srs;
  const cpfLifeMonthly = mrTanInputs.cpfLifeMonthly;
  const desired = mrTanInputs.desiredSpend;
  const withdrawal = Math.max(0, centralSpend - cpfLifeMonthly);
  const gap = Math.max(0, desired - centralSpend);
  const iwr = (withdrawal * 12) / totalAssets;
  // Find the desired-confidence from the engine curve.
  const desiredConfidence =
    analysis.curve.find((p) => p.spend >= desired)?.successRate ?? 0;

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={child ? t("results.kickerChild") : t("results.kickerParent")}
        title={child ? t("results.titleChild") : t("results.titleParent")}
        subtitle={t("results.subtitleDemo")}
      />

      <ResultTabs active={section} onChange={onSectionChange} />

      {/* Illustrative worked example notice — appears on every section. */}
      <div
        role="note"
        className="rounded-xl2 border border-enough-navy/20 bg-enough-navy/5 px-4 py-2.5 text-xs text-enough-ink leading-snug safe-break"
      >
        <strong className="text-enough-navy">
          {t("results.illustrativeWorkedExampleLabel")}.{" "}
          {t("results.illustrativeWorkedExampleNote")}
        </strong>
      </div>

      {child && <OversightStrip />}

      {section === "overview" && (
        <MrTanOverviewSection
          child={child}
          inputs={inputs}
          saferLower={saferLower}
          saferUpper={saferUpper}
          centralSpend={centralSpend}
          desired={desired}
          withdrawal={withdrawal}
          gap={gap}
          iwr={iwr}
          cpfLifeMonthly={cpfLifeMonthly}
          desiredConfidence={desiredConfidence}
        />
      )}

      {section === "stress" && (
        <StressTestSection
          child={child}
          centralSpend={centralSpend}
          horizonAge={horizonAge}
        />
      )}

      {section === "actions" && (
        <ActionPlanSection
          inputs={inputs}
          gap={gap}
          centralSpend={centralSpend}
          child={child}
        />
      )}

      {section === "analytics" && (
        <MrTanAnalyticsSection
          child={child}
          inputs={inputs}
          analysis={analysis}
        />
      )}

      {/* Bottom nav row — short, contextual to the active section. */}
      <TabBottomNav section={section} onChange={onSectionChange} />
    </div>
  );
}

/* ============ Custom plan — live engine result ============ */
interface CustomResultsProps {
  section: ResultSection;
  onSectionChange: (s: ResultSection) => void;
  analysis: FullAnalysis;
  child: boolean;
}

function CustomResults({
  section,
  onSectionChange,
  analysis,
  child,
}: CustomResultsProps) {
  const { t } = useTranslation();
  const { inputs } = usePlan();
  const [sens, setSens] = useState<SensitivityResult | null>(null);
  const [seq, setSeq] = useState<SequenceRiskResult | null>(null);

  useEffect(() => {
    let alive = true;
    setSens(null);
    const id = setTimeout(() => {
      if (!alive) return;
      setSens(runSensitivityAnalysis({ ...inputs, trials: 1000 }));
      setSeq(generateSequenceRiskScenario(inputs));
    }, 30);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [inputs]);

  const { safe, portfolio } = analysis;
  const totalAssets = inputs.cash + inputs.investments + inputs.srs;
  const withdrawal = Math.max(0, safe.centralSpend - inputs.cpfLifeMonthly);
  const desiredRate =
    totalAssets > 0
      ? (Math.max(0, inputs.desiredSpend - inputs.cpfLifeMonthly) * 12) /
        totalAssets
      : 0;
  const aggressive = desiredRate > 0.07;
  const gap = Math.max(0, inputs.desiredSpend - safe.centralSpend);

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={t("results.kickerCustom")}
        title={t("results.titleParent")}
        subtitle={t("results.subtitleCustom")}
      />

      <ResultTabs active={section} onChange={onSectionChange} />

      {section === "overview" && (
        <CustomOverviewSection
          child={child}
          inputs={inputs}
          safe={safe}
          portfolio={portfolio}
          withdrawal={withdrawal}
          gap={gap}
          desiredRate={desiredRate}
          aggressive={aggressive}
          analysis={analysis}
        />
      )}

      {section === "stress" && (
        <StressTestSection
          child={child}
          centralSpend={safe.centralSpend}
          horizonAge={inputs.horizonAge}
        />
      )}

      {section === "actions" && (
        <ActionPlanSection
          inputs={inputs}
          gap={gap}
          centralSpend={safe.centralSpend}
          child={child}
        />
      )}

      {section === "analytics" && (
        <CustomAnalyticsSection
          child={child}
          inputs={inputs}
          analysis={analysis}
          sens={sens}
          seq={seq}
        />
      )}

      <TabBottomNav section={section} onChange={onSectionChange} />
    </div>
  );
}

/* ============ Overview sections ============ */
function MrTanOverviewSection({
  child,
  inputs,
  saferLower,
  saferUpper,
  centralSpend,
  desired,
  withdrawal,
  gap,
  iwr,
  cpfLifeMonthly,
  desiredConfidence,
}: {
  child: boolean;
  inputs: PlanInputs;
  saferLower: number;
  saferUpper: number;
  centralSpend: number;
  desired: number;
  withdrawal: number;
  gap: number;
  iwr: number;
  cpfLifeMonthly: number;
  desiredConfidence: number;
}) {
  const { t } = useTranslation();
  const layers = layerTotals(inputs.lifestyle);
  // Use the actual engine-run confidence for the central safer spend.
  const confidence = Math.round(desiredConfidence * 100); // 0% when S$3,100 unattainable
  const horizonYears = inputs.horizonAge - inputs.age;

  return (
    <>
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {child ? t("results.heroLabelChild") : t("results.heroLabelParent")}
        </div>
        <div className="mt-1.5 flex items-end gap-x-2 gap-y-1 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(saferLower)} {t("common.rangeSeparator")}{" "}
            {formatMoney(saferUpper)}
          </div>
          <div className="text-white/60 text-base pb-1">
            {t("common.perMonth")}
          </div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold safe-break">
          {t("results.suggestedToday", {
            central: formatMoneyMonth(centralSpend),
            confidence: formatConfidence(0.9),
          })}
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <Pill tone="emerald">
            {t("results.overYrs", {
              pct: 90,
              yrs: horizonYears,
            })}
          </Pill>
          <span className="text-white/55 text-sm safe-break">
            {t("results.desiredLine", {
              value: formatMoneyMonth(desired),
              pct: confidence,
            })}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("results.cpfFloorLabel")}
          value={formatMoney(cpfLifeMonthly)}
          tone="navy"
          sub={t("results.cpfFloorSub")}
        />
        <StatCard
          label={t("results.withdrawalLabel")}
          value={formatMoney(withdrawal)}
          tone="emerald"
          sub={t("results.withdrawalSub", {
            rate: pct(iwr, 1),
          })}
        />
        <StatCard
          label={t("results.desiredLabel")}
          value={formatMoney(desired)}
          tone="amber"
          sub={t("common.perMonth")}
        />
        <StatCard
          label={t("results.gapLabel")}
          value={formatMoney(gap)}
          tone="red"
          sub={t("common.perMonth")}
        />
      </div>

      <div className="readable rounded-xl2 border border-enough-amber/20 bg-enough-amber/5 px-4 py-2.5 text-sm text-enough-ink leading-relaxed">
        <strong className="text-enough-amber">
          {t("results.cpfFloorWarningDemo")}
        </strong>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-base font-bold text-enough-navy mb-2">
            {t("results.lifestyleTitle")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Tile
              label={t("lifestyle.layerEssentials")}
              value={layers.essential}
              cls="text-enough-navy"
            />
            <Tile
              label={t("lifestyle.layerFlexible")}
              value={layers.flexible}
              cls="text-enough-emeraldDark"
            />
            <Tile
              label={t("lifestyle.layerAspirational")}
              value={layers.aspirational}
              cls="text-enough-amber"
            />
            <Tile
              label={t("lifestyle.layerTotal")}
              value={layers.total}
              cls="text-enough-navy"
            />
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-bold text-enough-navy mb-2">
            {t("results.inflationTitle")}
          </h3>
          <ul className="text-sm space-y-1">
            <li className="flex justify-between gap-3">
              <span className="text-enough-slate safe-break">
                {t("results.inflationGeneral")}
              </span>
              <span className="font-semibold text-enough-navy">
                {t("results.inflationPerYear", {
                  value: pct(inputs.generalInflation / 100, 1),
                })}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-enough-slate safe-break">
                {t("results.inflationHealthcare")}
              </span>
              <span className="font-semibold text-enough-navy">
                {t("results.inflationPerYear", {
                  value: pct(inputs.healthcareInflation / 100, 1),
                })}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-enough-slate safe-break">
                {t("results.inflationCpfStandard")}
              </span>
              <span className="font-semibold text-enough-navy safe-break">
                {t("results.inflationCpfStandardValue")}
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <ResultNextSteps child={child} />
    </>
  );
}

function CustomOverviewSection({
  child,
  inputs,
  safe,
  portfolio,
  withdrawal,
  gap,
  desiredRate,
  aggressive,
  analysis,
}: {
  child: boolean;
  inputs: PlanInputs;
  safe: FullAnalysis["safe"];
  portfolio: FullAnalysis["portfolio"];
  withdrawal: number;
  gap: number;
  desiredRate: number;
  aggressive: boolean;
  analysis: FullAnalysis;
}) {
  const { t } = useTranslation();
  const layers = layerTotals(inputs.lifestyle);
  return (
    <>
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {t("results.heroLabelParent")}
        </div>
        <div className="mt-1.5 flex items-end gap-x-2 gap-y-1 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(safe.lowerSpend)} {t("common.rangeSeparator")}{" "}
            {formatMoney(safe.upperSpend)}
          </div>
          <div className="text-white/60 text-base pb-1">
            {t("common.perMonth")}
          </div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold safe-break">
          {t("results.centralLine", {
            central: formatMoneyMonth(safe.centralSpend),
            pct: pctRaw(safe.confidence),
          })}
        </div>
        <div className="text-white/60 text-sm mt-1 safe-break">
          {t("results.trialsLine", {
            trials: analysis.trials.toLocaleString(),
            ret: pctRaw(portfolio.expectedReturn * 100),
            vol: pctRaw(portfolio.volatility * 100),
          })}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("results.cpfFloorLabel")}
          value={formatMoney(inputs.cpfLifeMonthly)}
          tone="navy"
          sub={t("common.perMonth")}
        />
        <StatCard
          label={t("results.withdrawalLabel")}
          value={formatMoney(withdrawal)}
          tone="emerald"
          sub={t("common.perMonth")}
        />
        <StatCard
          label={t("results.desiredLabel")}
          value={formatMoney(inputs.desiredSpend)}
          tone="amber"
          sub={t("common.perMonth")}
        />
        <StatCard
          label={t("results.gapLabelShort")}
          value={formatMoney(gap)}
          tone="red"
          sub={t("common.perMonth")}
        />
      </div>

      {aggressive && (
        <Card className="bg-enough-amberSoft border-enough-amber/30">
          <div className="font-bold text-enough-amber safe-break">
            {t("results.aggressiveTitle")}
          </div>
          <p className="readable mt-1 text-enough-ink text-sm">
            {t("results.aggressiveBody", {
              value: formatMoneyMonth(inputs.desiredSpend),
              rate: pct(desiredRate, 1),
            })}
          </p>
        </Card>
      )}

      <div className="readable rounded-xl2 border border-enough-amber/20 bg-enough-amber/5 px-4 py-2.5 text-sm text-enough-ink leading-relaxed">
        <strong className="text-enough-amber">
          {t("results.cpfFloorWarningCustom")}
        </strong>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-base font-bold text-enough-navy mb-2">
            {t("results.lifestyleTitle")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Tile
              label={t("lifestyle.layerEssentials")}
              value={layers.essential}
              cls="text-enough-navy"
            />
            <Tile
              label={t("lifestyle.layerFlexible")}
              value={layers.flexible}
              cls="text-enough-emeraldDark"
            />
            <Tile
              label={t("lifestyle.layerAspirational")}
              value={layers.aspirational}
              cls="text-enough-amber"
            />
            <Tile
              label={t("lifestyle.layerTotal")}
              value={layers.total}
              cls="text-enough-navy"
            />
          </div>
        </Card>
        <Card>
          <h3 className="text-base font-bold text-enough-navy mb-2">
            {t("results.inflationTitle")}
          </h3>
          <ul className="text-sm space-y-1">
            <li className="flex justify-between gap-3">
              <span className="text-enough-slate safe-break">
                {t("results.inflationGeneral")}
              </span>
              <span className="font-semibold text-enough-navy">
                {t("results.inflationPerYear", {
                  value: pct(inputs.generalInflation / 100, 1),
                })}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-enough-slate safe-break">
                {t("results.inflationHealthcare")}
              </span>
              <span className="font-semibold text-enough-navy">
                {t("results.inflationPerYear", {
                  value: pct(inputs.healthcareInflation / 100, 1),
                })}
              </span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-enough-slate safe-break">
                {t("results.inflationCpfStandard")}
              </span>
              <span className="font-semibold text-enough-navy safe-break">
                {t("results.inflationCpfStandardValue")}
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <ResultNextSteps child={child} />
    </>
  );
}

function Tile({
  label,
  value,
  cls,
}: {
  label: string;
  value: number;
  cls: string;
}) {
  return (
    <div className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-3 py-2 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-enough-slate safe-break">
        {label}
      </div>
      <div className={`text-sm font-extrabold ${cls}`}>
        {formatMoneyMonth(value)}
      </div>
    </div>
  );
}

/* ============ Action plan section ============ */
function ActionPlanSection({
  inputs,
  gap,
  centralSpend,
  child,
}: {
  inputs: PlanInputs;
  gap: number;
  centralSpend: number;
  child: boolean;
}) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-xl font-bold text-enough-navy safe-break">
        {t("results.tabAction")}
      </h2>
      <p className="text-sm text-enough-slate safe-break">
        {t("results.optionsToExploreNote")}
      </p>
      <GuardrailNow />
      <GapCloser inputs={inputs} gap={gap} />
      <FundingSequence inputs={inputs} centralSpend={centralSpend} />
      <ProtectionReferral inputs={inputs} />
      {/* Hidden no-op ref to keep `child` warning-free if true. */}
      {child && (
        <span className="sr-only">{t("navigation.adultChildView")}</span>
      )}
    </>
  );
}

/* ============ Analytics sections ============ */
function MrTanAnalyticsSection({
  child,
  inputs,
  analysis,
}: {
  child: boolean;
  inputs: PlanInputs;
  analysis: FullAnalysis;
}) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-xl font-bold text-enough-navy safe-break">
        {t("results.analyticsTitle")}
      </h2>
      <p className="text-sm text-enough-slate safe-break">
        {t("results.analyticsSub")}
      </p>
      <CurveSection
        title={t("results.curveTitleOverview")}
        sub={t("results.curveSubOverview")}
        data={analysis.curve.map((p) => ({
          spend: Math.round(p.spend),
          conf: Math.round(p.successRate * 100),
        }))}
        ticks={undefined}
      />
      {child ? (
        <>
          <SensitivitySection />
          <SequenceSection inputs={inputs} />
          <LearningSection />
        </>
      ) : (
        <SensitivitySection />
      )}
    </>
  );
}

function CustomAnalyticsSection({
  child,
  analysis,
  sens,
  seq,
}: {
  child: boolean;
  inputs: PlanInputs;
  analysis: FullAnalysis;
  sens: SensitivityResult | null;
  seq: SequenceRiskResult | null;
}) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className="text-xl font-bold text-enough-navy safe-break">
        {t("results.analyticsTitle")}
      </h2>
      <p className="text-sm text-enough-slate safe-break">
        {t("results.analyticsSub")}
      </p>
      <CurveSection
        title={t("results.curveTitleOverview")}
        sub={t("results.curveSubOverview")}
        data={analysis.curve.map((p) => ({
          spend: Math.round(p.spend),
          conf: Math.round(p.successRate * 100),
        }))}
        ticks={undefined}
      />
      {child ? (
        sens ? (
          <CustomSensitivity sens={sens} />
        ) : (
          <Card>
            <Spinner label={t("results.spinnerSens")} />
          </Card>
        )
      ) : (
        sens && <CustomSensitivity sens={sens} />
      )}
      {child && seq && <CustomSequence seq={seq} />}
    </>
  );
}

/* ============ Guardrail "now" card (C) ============ */
function GuardrailNow() {
  const { t } = useTranslation();
  const g = currentGuardrail;
  return (
    <Card className="border-enough-emerald/30 bg-enough-emerald/5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Pill tone="emerald">{t("results.illustrativeGuardrailPill")}</Pill>
          </div>
          <h3 className="text-2xl font-bold text-enough-navy mt-2 safe-break">
            {t("results.illustrativeGuardrailTitle")}
          </h3>
          <p className="readable text-enough-ink mt-1 leading-relaxed">
            {t("results.illustrativeGuardrailBody", { reason: t(g.reason) })}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs text-enough-slate">
            {t("results.guardrailNow")}
          </div>
          <div className="text-2xl font-extrabold text-enough-navy whitespace-nowrap">
            {formatMoney(g.currentSpend)} →{" "}
            <span className="text-enough-emeraldDark">
              {formatMoney(g.suggestedSpend)}
            </span>
          </div>
          <div className="text-xs text-enough-slate">
            {t("common.perMonth")}
          </div>
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
        {guardrailBands.map((b) => (
          <div
            key={b.zone}
            className={`rounded-xl2 border p-2.5 ${
              b.zone === currentGuardrail.zone
                ? "border-enough-emerald bg-white ring-1 ring-enough-emerald/40"
                : "border-enough-line bg-white/60"
            }`}
          >
            <div
              className={`font-bold safe-break ${
                b.zone === "raise" || b.zone === "green"
                  ? "text-enough-emeraldDark"
                  : b.zone === "amber"
                    ? "text-enough-amber"
                    : "text-enough-red"
              }`}
            >
              {t(b.headline)}
            </div>
            <div className="text-enough-slate mt-1 leading-snug safe-break">
              {t(b.action)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============ Life event stress test ============ */
const stressToneStyles: Record<
  StressTone,
  { card: string; pill: "emerald" | "amber" | "red"; impact: string }
> = {
  green: {
    card: "border-enough-emerald/30 bg-enough-emerald/5",
    pill: "emerald",
    impact: "text-enough-emeraldDark",
  },
  amber: {
    card: "border-enough-amber/30 bg-enough-amber/5",
    pill: "amber",
    impact: "text-enough-amber",
  },
  red: {
    card: "border-enough-red/30 bg-enough-red/5",
    pill: "red",
    impact: "text-enough-red",
  },
};

function StressCard({ test }: { test: LifeEventStressTest }) {
  const { t } = useTranslation();
  const s = stressToneStyles[test.tone];
  return (
    <div className={`rounded-xl2 border ${s.card} p-4 flex flex-col`}>
      <Pill tone={s.pill}>{t(test.label)}</Pill>
      <div className="font-bold text-enough-navy mt-2 safe-break">
        {t(test.title)}
      </div>
      <p className="text-sm text-enough-ink mt-1 leading-relaxed safe-break">
        {t(test.description, test.descriptionVars ?? {})}
      </p>
      <div className={`text-lg font-extrabold mt-2 ${s.impact}`}>
        {t("results.impactPrefix")}
        {formatDeltaMonth(test.impactMonthly)}
      </div>
      <p className="text-xs text-enough-slate mt-2 leading-relaxed safe-break">
        {t(test.footer)}
      </p>
    </div>
  );
}

function StressTestSection({
  child,
  centralSpend,
  horizonAge,
}: {
  child: boolean;
  centralSpend: number;
  horizonAge: number;
}) {
  const { t } = useTranslation();
  const [showOptions, setShowOptions] = useState(false);
  const tests = lifeEventStressTestsFor(centralSpend, horizonAge);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {child ? t("results.stressTitleChild") : t("results.stressTitleParent")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.stressIntro")}
      </p>

      <div
        className={`mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:[&>*:nth-child(3)]:col-span-2 lg:[&>*:nth-child(3)]:col-span-1`}
      >
        {tests.map((tt) => (
          <StressCard key={tt.key} test={tt} />
        ))}
      </div>

      <div className="mt-4 rounded-xl2 border border-enough-navy/15 bg-enough-navy/5 px-4 py-3">
        <div className="font-bold text-enough-navy safe-break">
          {child ? t("results.riskTitleChild") : t("results.riskTitleParent")}
        </div>
        <p className="readable text-sm text-enough-ink mt-1 leading-relaxed">
          {t("results.riskBody")}
        </p>
        <p className="readable text-xs text-enough-slate mt-1 leading-relaxed">
          {t("results.riskFooter")}
        </p>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowOptions((s) => !s)}
          className="btn-ghost text-sm min-h-[44px]"
          aria-expanded={showOptions}
        >
          {showOptions
            ? t("results.suggestToggleHide")
            : t("results.suggestToggleShow")}
        </button>
        {showOptions && (
          <div className="mt-3 rounded-xl2 border border-enough-line bg-white p-4">
            <div className="font-bold text-enough-navy">
              {t("results.suggestTitle")}
            </div>
            <p className="readable text-xs text-enough-slate mt-1 leading-relaxed">
              {t("results.optionsToExploreNote")}
            </p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-enough-navy">
                {t("results.providersHeading")}
              </summary>
              <p className="text-xs text-enough-slate mt-1">
                {t("results.providersNote")}
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-enough-ink">
                {optionsToDiscuss.map((o) => (
                  <li key={o} className="flex gap-2">
                    <span className="text-enough-emerald">•</span>
                    <span className="leading-snug safe-break">{t(o)}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ============ Longitudinal learning (D) ============ */
function LearningSection() {
  const { t } = useTranslation();
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.learnTitle")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.learnIntro")}
      </p>
      <div className="mt-4 space-y-3">
        {learningTimeline.map((p) => (
          <div key={p.period} className="flex gap-3 items-start">
            <div className="w-20 shrink-0 text-sm font-bold text-enough-navy pt-0.5 safe-break">
              {t(p.period)}
            </div>
            <div className="flex-1 rounded-xl2 border border-enough-line p-3 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-semibold text-enough-ink text-sm safe-break">
                  {t(p.event)}
                </span>
                <span className="font-extrabold text-enough-emeraldDark whitespace-nowrap">
                  {formatMoneyMonth(p.safeSpend)}
                </span>
              </div>
              <p className="text-xs text-enough-slate mt-1 leading-relaxed safe-break">
                {t(p.driver)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============ Shared sections ============ */
function CurveSection({
  title,
  sub,
  data,
  ticks,
}: {
  title: string;
  sub: string;
  data: { spend: number; conf: number }[];
  ticks?: number[];
}) {
  const { t } = useTranslation();
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">{title}</h3>
      <p className="readable text-enough-slate mt-1">{sub}</p>
      <p className="sr-only">{t("accessibility.chartUnavailable")}</p>
      <div className="mt-4" style={{ width: "100%", height: 360 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 16, right: 20, bottom: 12, left: -8 }}
          >
            <defs>
              <linearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0E9F6E" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0E9F6E" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EC" />
            <XAxis
              dataKey="spend"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={ticks}
              tickFormatter={(v) => s$(Number(v))}
              tick={{ fill: "#0F1B2D", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => pct(v / 100)}
              tick={{ fill: "#5B6B7F", fontSize: 12 }}
            />
            <Tooltip
              formatter={(v: number) => [
                t("results.curveTooltipConf", { value: v }),
                "",
              ]}
              labelFormatter={(v) =>
                t("results.curveTooltipSpend", { value: s$(Number(v)) })
              }
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E6EC",
                fontSize: 14,
              }}
            />
            <ReferenceLine
              x={1550}
              stroke="#1B6FA8"
              strokeDasharray="5 4"
              label={{
                value: t("results.curveRefCpf"),
                fill: "#1B6FA8",
                fontSize: 11,
                position: "insideTopLeft",
              }}
            />
            <ReferenceLine
              x={2150}
              stroke="#0E9F6E"
              strokeWidth={2}
              label={{
                value: t("results.curveRefSafer"),
                fill: "#0B7A55",
                fontSize: 11,
                position: "insideTopRight",
              }}
            />
            <ReferenceLine
              x={3100}
              stroke="#DC2626"
              strokeDasharray="5 4"
              label={{
                value: t("results.curveRefDesired"),
                fill: "#DC2626",
                fontSize: 11,
                position: "insideTopRight",
              }}
            />
            <Area
              type="monotone"
              dataKey="conf"
              stroke="#0A2540"
              strokeWidth={3}
              fill="url(#curveFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function SensitivitySection() {
  const { t } = useTranslation();
  const all = [...demoSensitivity.reduces, ...demoSensitivity.improves];
  const maxAbs = Math.max(...all.map((r) => Math.abs(r.impact)), 1);
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.sensTitleDemo")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.sensIntro")}
      </p>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-bold text-enough-red mb-2">
            {t("results.sensReduces")}
          </div>
          <div className="space-y-2.5">
            {demoSensitivity.reduces.map((r) => (
              <BarRow
                key={r.factor}
                factor={t(r.factor)}
                impact={r.impact}
                max={maxAbs}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-enough-emeraldDark mb-2">
            {t("results.sensImproves")}
          </div>
          <div className="space-y-2.5">
            {demoSensitivity.improves.map((r) => (
              <BarRow
                key={r.factor}
                factor={t(r.factor)}
                impact={r.impact}
                max={maxAbs}
              />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CustomSensitivity({ sens }: { sens: SensitivityResult }) {
  const { t } = useTranslation();
  const top = sens.rows.slice(0, 6);
  const maxAbs = Math.max(...top.map((r) => Math.abs(r.impact)), 1);
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.sensTitleCustom")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.sensIntro")}
      </p>
      <div className="mt-4 space-y-2.5">
        {top.map((r) => (
          <BarRow
            key={r.factor}
            factor={r.factor}
            impact={r.impact}
            max={maxAbs}
          />
        ))}
      </div>
    </Card>
  );
}

function BarRow({
  factor,
  impact,
  max,
}: {
  factor: string;
  impact: number;
  max: number;
}) {
  const w = (Math.abs(impact) / max) * 100;
  const pos = impact >= 0;
  return (
    <div>
      <div className="flex justify-between text-sm gap-3">
        <span className="text-enough-ink font-medium safe-break">{factor}</span>
        <span
          className={`font-bold whitespace-nowrap ${pos ? "text-enough-emeraldDark" : "text-enough-red"}`}
        >
          {formatDeltaMonth(impact)}
        </span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-enough-navy/5">
        <div
          className={`h-3 rounded-full ${pos ? "bg-enough-emerald" : "bg-enough-red"}`}
          style={{ width: `${Math.max(6, w)}%` }}
        />
      </div>
    </div>
  );
}

function SequenceSection({
  inputs,
}: {
  inputs: ReturnType<typeof usePlan>["inputs"];
}) {
  const { t } = useTranslation();
  const data = Array.from({ length: 20 }, (_, i) => {
    const row: Record<string, number> = { year: i };
    demoSequence.paths.forEach((p) => {
      row[p.label] = p.series[i];
    });
    return row;
  });
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.seqTitle")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.seqIntroDemo")}
      </p>
      <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-4 items-center">
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 4, right: 8, bottom: 0, left: -18 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EC" />
              <XAxis dataKey="year" tick={{ fill: "#5B6B7F", fontSize: 11 }} />
              <YAxis
                tickFormatter={(v) => `${v}k`}
                tick={{ fill: "#5B6B7F", fontSize: 11 }}
              />
              <Tooltip
                formatter={(v: number) => s$(v * 1000)}
                labelFormatter={(l) => t("results.seqYear", { n: l })}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E6EC",
                  fontSize: 13,
                }}
              />
              {demoSequence.paths.map((p) => (
                <Line
                  key={p.label}
                  type="monotone"
                  dataKey={p.label}
                  stroke={pathColor(p.tone)}
                  strokeWidth={2.5}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-1.5">
          {demoSequence.paths.map((p) => (
            <div key={p.label} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: pathColor(p.tone) }}
              />
              <span className="text-enough-ink font-medium safe-break">
                {t(p.labelKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className="hidden">{inputs.cpfPlan}</span>
    </Card>
  );
}

function CustomSequence({ seq }: { seq: SequenceRiskResult }) {
  const { t } = useTranslation();
  const data: { year: number; [k: string]: number }[] = [];
  const len = seq.paths[0].balance.length;
  const months = len - 1;
  const stepM = Math.max(1, Math.floor(months / 19));
  for (let i = 0; i < len; i += stepM) {
    const row: { year: number; [k: string]: number } = {
      year: +(i / 12).toFixed(1),
    };
    seq.paths.forEach((p) => {
      row[p.label] = Math.max(0, Math.round(p.balance[i] / 1000));
    });
    data.push(row);
  }
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.seqTitle")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.seqIntroCustom")}
      </p>
      <div className="mt-4" style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, bottom: 0, left: -18 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E6EC" />
            <XAxis dataKey="year" tick={{ fill: "#5B6B7F", fontSize: 11 }} />
            <YAxis
              tickFormatter={(v) => `${v}k`}
              tick={{ fill: "#5B6B7F", fontSize: 11 }}
            />
            <Tooltip
              formatter={(v: number) => s$(v * 1000)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E6EC",
                fontSize: 13,
              }}
            />
            {seq.paths.map((p, idx) => (
              <Line
                key={p.label}
                type="monotone"
                dataKey={p.label}
                stroke={SEQ_LINE_COLORS[idx % SEQ_LINE_COLORS.length]}
                strokeWidth={2.5}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function pathColor(tone: "emerald" | "amber" | "red") {
  return tone === "emerald"
    ? "#0E9F6E"
    : tone === "amber"
      ? "#D97706"
      : "#DC2626";
}

const SEQ_LINE_COLORS = ["#0E9F6E", "#DC2626", "#D97706"];

/* ============ Bottom nav row per section ============ */
function TabBottomNav({
  section,
  onChange,
}: {
  section: ResultSection;
  onChange: (s: ResultSection) => void;
}) {
  const { t } = useTranslation();
  return (
    <nav
      aria-label={t("results.tabOverview")}
      className="rounded-xl2 border border-enough-line bg-white px-3 py-3 sm:px-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {section === "overview" && (
          <>
            <Link to="/spend" className="btn-emerald min-h-[44px]">
              {t("results.actionTrackSpending")}
            </Link>
            <Link to="/report" className="btn-soft min-h-[44px]">
              {t("results.actionOpenReport")}
            </Link>
          </>
        )}
        {section === "stress" && (
          <>
            <button
              type="button"
              onClick={() => onChange("overview")}
              className="btn-ghost min-h-[44px]"
            >
              {t("results.tabBackOverview")}
            </button>
            <button
              type="button"
              onClick={() => onChange("actions")}
              className="btn-soft min-h-[44px]"
            >
              {t("results.tabViewActionPlan")}
            </button>
          </>
        )}
        {section === "actions" && (
          <>
            <button
              type="button"
              onClick={() => onChange("stress")}
              className="btn-ghost min-h-[44px]"
            >
              {t("results.tabBackStress")}
            </button>
            <Link to="/spend" className="btn-emerald min-h-[44px]">
              {t("results.actionTrackSpending")}
            </Link>
          </>
        )}
        {section === "analytics" && (
          <>
            <button
              type="button"
              onClick={() => onChange("overview")}
              className="btn-ghost min-h-[44px]"
            >
              {t("results.tabBackAnalytics")}
            </button>
            <Link to="/report" className="btn-soft min-h-[44px]">
              {t("results.actionOpenReport")}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

/* Local minimal useNavigate wrapper — avoids an extra react-router-dom
 * import in this file when EmptyResults needs to route to /plan. */
import { useNavigate as useNavigateProxy } from "react-router-dom";
