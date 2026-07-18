import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  demoMrTan,
  demoCurve,
  demoSensitivity,
  demoSequence,
} from "../data/demoDataset";
import { mrTanInputs } from "../data/mrTan";
import { GapCloser } from "../components/GapCloser";
import { FundingSequence } from "../components/FundingSequence";
import { HealthcareConditions } from "../components/HealthcareConditions";
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
import {
  CRISIS_SCENARIOS,
  CRISIS_ZONE_GUIDANCE,
  DEMO_STRESS,
  type CrisisScenario,
  type StressZone,
} from "../data/stressScenarios";
import {
  recompute,
  saferSpendOf,
  crisisOverrides,
  zoneForImpact,
} from "../lib/stress";
import type { PlanInputs } from "../types";
import {
  runSensitivityAnalysis,
  generateSequenceRiskScenario,
  type SensitivityResult,
  type SequenceRiskResult,
  type FullAnalysis,
} from "../engine";

/** Detect the canonical Mr Tan case → stable presentation-calibrated result. */
function isMrTan(i: ReturnType<typeof usePlan>["inputs"]): boolean {
  return (
    i.age === 65 &&
    i.cpfLifeMonthly === 1550 &&
    i.cash + i.investments + i.srs === 520000 &&
    i.desiredSpend === 3100
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const { analysis, inputs, status } = usePlan();

  if (status === "computing" && !analysis) {
    return (
      <Card>
        <Spinner label={t("results.simulating")} />
      </Card>
    );
  }

  if (isMrTan(inputs)) return <MrTanResults />;
  if (!analysis) return <EmptyResults />;
  return <CustomResults analysis={analysis} />;
}

/* ============ Empty state (no plan yet) ============ */
function EmptyResults() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Pill tone="amber">{t("navigation.adultChildView")}</Pill>
        <span className="text-sm font-semibold text-enough-navy">
          {t("results.oversightTitle")}
        </span>
      </div>
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

/* ============ Mr Tan — stable calibrated result ============ */
function MrTanResults() {
  const { t } = useTranslation();
  const { inputs } = usePlan();
  const { mode } = useViewMode();
  const child = mode === "child";

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={child ? t("results.kickerChild") : t("results.kickerParent")}
        title={child ? t("results.titleChild") : t("results.titleParent")}
        subtitle={t("results.subtitleDemo")}
      />

      {child && <OversightStrip />}

      {/* Summary hero — the safer monthly spend range (defect 9.2: amount and
          /month wrap onto separate lines on narrow screens; confidence wraps). */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {child ? t("results.heroLabelChild") : t("results.heroLabelParent")}
        </div>
        <div className="mt-1.5 flex items-end gap-x-2 gap-y-1 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(demoMrTan.saferLower)} {t("common.rangeSeparator")}{" "}
            {formatMoney(demoMrTan.saferUpper)}
          </div>
          <div className="text-white/60 text-base pb-1">
            {t("common.perMonth")}
          </div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold safe-break">
          {t("results.suggestedToday", {
            central: formatMoneyMonth(demoMrTan.saferCentral),
            confidence: formatConfidence(demoMrTan.confidence / 100),
          })}
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <Pill tone="emerald">
            {t("results.overYrs", {
              pct: pctRaw(demoMrTan.confidence),
              yrs: demoMrTan.horizonAge - demoMrTan.age,
            })}
          </Pill>
          <span className="text-white/55 text-sm safe-break">
            {t("results.desiredLine", {
              value: formatMoneyMonth(demoMrTan.desired),
              pct: demoMrTan.desiredConfidence,
            })}
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("results.cpfFloorLabel")}
          value={formatMoney(demoMrTan.cpfLife)}
          tone="navy"
          sub={t("results.cpfFloorSub")}
        />
        <StatCard
          label={t("results.withdrawalLabel")}
          value={formatMoney(demoMrTan.withdrawal)}
          tone="emerald"
          sub={t("results.withdrawalSub", {
            rate: pct(demoMrTan.initialWithdrawalRate, 1),
          })}
        />
        <StatCard
          label={t("results.desiredLabel")}
          value={formatMoney(demoMrTan.desired)}
          tone="amber"
          sub={t("common.perMonth")}
        />
        <StatCard
          label={t("results.gapLabel")}
          value={formatMoney(demoMrTan.gap)}
          tone="red"
          sub={t("common.perMonth")}
        />
      </div>

      <div className="readable rounded-xl2 border border-enough-amber/20 bg-enough-amber/5 px-4 py-2.5 text-sm text-enough-ink leading-relaxed">
        <strong className="text-enough-amber">
          {t("results.cpfFloorWarningDemo")}
        </strong>
      </div>

      {/* Life event stress test — what moves the monthly spend number */}
      <StressTestSection
        child={child}
        centralSpend={demoMrTan.saferCentral}
        horizonAge={demoMrTan.horizonAge}
      />

      {/* Inflation, lifestyle, healthcare, crisis, lifespan deep modules */}
      <ExtraResultsModules
        inputs={inputs}
        baseSpend={demoMrTan.saferCentral}
        isMrTan
      />

      {/* C — Dynamic guardrails: the current steer */}
      <GuardrailNow />

      {/* Item 2 — engine-wired gap-closing ledger */}
      <GapCloser inputs={inputs} gap={demoMrTan.gap} />

      {/* Item 5 — funding sequence with amounts + schemes + referral */}
      <FundingSequence inputs={inputs} centralSpend={demoMrTan.saferCentral} />

      {/* Protection-gap referral map — gap → protection → named partner */}
      <ProtectionReferral inputs={inputs} />

      {/* Curve */}
      <CurveSection
        title={t("results.curveTitleDemo")}
        sub={t("results.curveSub")}
        data={demoCurve.map((p) => ({ spend: p.spend, conf: p.conf }))}
        ticks={[1550, 1850, 2150, 2500, 2800, 3100]}
      />

      {/* Deeper analytical detail — the adult-child face */}
      {child && (
        <>
          <SensitivitySection />
          <SequenceSection inputs={inputs} />
          <LearningSection />
        </>
      )}

      {/* Next action */}
      <Card className="bg-enough-navy text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h3 className="text-white text-xl font-bold safe-break">
              {child
                ? t("results.nextTitleChild")
                : t("results.nextTitleParent")}
            </h3>
            <p className="text-white/80 mt-1 safe-break">
              {child ? t("results.nextBodyChild") : t("results.nextBodyParent")}
            </p>
          </div>
          <Link
            to={child ? "/family" : "/report"}
            className="btn-emerald min-h-[44px]"
          >
            {child ? t("results.nextCtaChild") : t("results.nextCtaParent")}
          </Link>
        </div>
      </Card>
    </div>
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
          <div className="flex items-center gap-2">
            <Pill tone="emerald">{t("results.guardrailPill")}</Pill>
          </div>
          <h3 className="text-2xl font-bold text-enough-navy mt-2 safe-break">
            {t("results.guardrailTitle")}
          </h3>
          <p className="readable text-enough-ink mt-1 leading-relaxed">
            {t("results.guardrailBody", { reason: t(g.reason) })}
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

/* ============ Assumption, lifestyle, and deep stress modules ============ */

function InflationCard({ inputs }: { inputs: PlanInputs }) {
  const { t } = useTranslation();
  const escalating = inputs.cpfPlan === "Escalating";
  const rows: [string, string][] = [
    [
      t("results.inflationGeneral"),
      t("results.inflationPerYear", {
        value: pct(inputs.generalInflation / 100, 1),
      }),
    ],
    [
      t("results.inflationHealthcare"),
      t("results.inflationPerYear", {
        value: pct(inputs.healthcareInflation / 100, 1),
      }),
    ],
    [t("results.inflationCpfStandard"), t("results.inflationCpfStandardValue")],
    [
      t("results.inflationCpfEscalating"),
      escalating
        ? t("results.inflationCpfEscalatingOn")
        : t("results.inflationCpfEscalatingOff"),
    ],
  ];
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-2">
        {t("results.inflationTitle")}
      </h3>
      <ul className="text-sm space-y-1">
        {rows.map(([k, v]) => (
          <li
            key={k}
            className="flex flex-col sm:flex-row sm:justify-between gap-0.5 sm:gap-3"
          >
            <span className="text-enough-slate safe-break">{k}</span>
            <span className="font-semibold text-enough-navy sm:text-right safe-break">
              {v}
            </span>
          </li>
        ))}
      </ul>
      <p className="readable text-xs text-enough-slate mt-2 leading-relaxed">
        {t("results.inflationNote")}
      </p>
    </Card>
  );
}

function LifestyleSummary({ inputs }: { inputs: PlanInputs }) {
  const { t } = useTranslation();
  const tt = layerTotals(inputs.lifestyle);
  const tiles = [
    {
      label: t("lifestyle.layerEssentials"),
      v: tt.essential,
      cls: "text-enough-navy",
    },
    {
      label: t("lifestyle.layerFlexible"),
      v: tt.flexible,
      cls: "text-enough-emeraldDark",
    },
    {
      label: t("lifestyle.layerAspirational"),
      v: tt.aspirational,
      cls: "text-enough-amber",
    },
    { label: t("lifestyle.layerTotal"), v: tt.total, cls: "text-enough-navy" },
  ];
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-2">
        {t("results.lifestyleTitle")}
      </h3>
      {/* Defect 9.7: this card is half-width on sm+, so a 2×2 grid (not 4-across)
          keeps the tiles comfortable in every language. */}
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((x) => (
          <div
            key={x.label}
            className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-3 py-2 text-center"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-enough-slate safe-break">
              {x.label}
            </div>
            <div className={`text-sm font-extrabold ${x.cls}`}>
              {formatMoneyMonth(x.v)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const zoneTone: Record<StressZone, "emerald" | "amber" | "red"> = {
  green: "emerald",
  amber: "amber",
  red: "red",
};
const zoneLabelKey: Record<StressZone, string> = {
  green: "guardrails.zoneGreen",
  amber: "guardrails.zoneAmber",
  red: "guardrails.zoneRed",
};

function CrisisStress({
  inputs,
  baseSpend,
  isMrTan,
}: {
  inputs: PlanInputs;
  baseSpend: number;
  isMrTan: boolean;
}) {
  const { t } = useTranslation();
  const [key, setKey] = useState<CrisisScenario["key"]>("severe");
  const [after, setAfter] = useState<number | null>(null);
  const scenario = CRISIS_SCENARIOS.find((s) => s.key === key)!;

  useEffect(() => {
    if (isMrTan) {
      setAfter(null);
      return;
    }
    const id = setTimeout(() => {
      setAfter(
        saferSpendOf(recompute(inputs, crisisOverrides(inputs, scenario))),
      );
    }, 30);
    return () => clearTimeout(id);
  }, [inputs, key, isMrTan, scenario]);

  const demo = DEMO_STRESS.crisis[key];
  const afterSpend = isMrTan ? demo.afterSpend : (after ?? baseSpend);
  const impact = afterSpend - baseSpend;
  const zone = isMrTan ? demo.zone : zoneForImpact(baseSpend, afterSpend);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.crisisTitle")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.crisisIntro")}
      </p>
      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label={t("results.crisisTitle")}
      >
        {CRISIS_SCENARIOS.map((s) => (
          <button
            key={s.key}
            type="button"
            aria-pressed={key === s.key}
            onClick={() => setKey(s.key)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 ${
              key === s.key
                ? "bg-enough-navy text-white ring-2 ring-enough-navy"
                : "bg-enough-navy/5 text-enough-navy hover:bg-enough-navy/10"
            }`}
          >
            {t(s.label)}
          </button>
        ))}
      </div>
      <p className="text-sm text-enough-slate mt-2 safe-break">
        {t(scenario.blurb)}
      </p>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <StatCard
          label={t("results.crisisBase")}
          value={formatMoneyMonth(baseSpend)}
          tone="navy"
        />
        <StatCard
          label={t("results.crisisAfter", { name: t(scenario.label) })}
          value={formatMoneyMonth(afterSpend)}
          tone={zone === "red" ? "red" : zone === "amber" ? "amber" : "emerald"}
        />
        <StatCard
          label={t("results.crisisImpact")}
          value={formatDeltaMonth(impact)}
          tone={impact < 0 ? "red" : "emerald"}
        />
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Pill tone={zoneTone[zone]}>{t(zoneLabelKey[zone])}</Pill>
        <span className="readable text-sm text-enough-ink">
          {t(CRISIS_ZONE_GUIDANCE[zone])}
        </span>
      </div>
    </Card>
  );
}

function LifespanSensitivity({
  inputs,
  baseSpend,
  isMrTan,
}: {
  inputs: PlanInputs;
  baseSpend: number;
  isMrTan: boolean;
}) {
  const { t } = useTranslation();
  const [points, setPoints] = useState<{ age: number; safer: number }[] | null>(
    null,
  );

  useEffect(() => {
    if (isMrTan) {
      setPoints(null);
      return;
    }
    const id = setTimeout(() => {
      const at = (age: number) =>
        saferSpendOf(recompute(inputs, { horizonAge: age }));
      setPoints([
        { age: 90, safer: at(90) },
        { age: 95, safer: baseSpend },
        { age: 100, safer: at(100) },
      ]);
    }, 30);
    return () => clearTimeout(id);
  }, [inputs, baseSpend, isMrTan]);

  const rows = isMrTan
    ? DEMO_STRESS.lifespan.map((p) => ({ age: p.age, safer: p.saferSpend }))
    : (points ?? []);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("results.lifespanTitle")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("results.lifespanIntro")}
      </p>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {rows.map((r) => (
          <div
            key={r.age}
            className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-3 text-center"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-enough-slate">
              {t("results.lifespanPlanTo", { age: r.age })}
            </div>
            <div className="text-lg font-extrabold text-enough-navy">
              {formatMoneyMonth(r.safer)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Wrapper rendering all five new Results modules (used by both result faces). */
function ExtraResultsModules({
  inputs,
  baseSpend,
  isMrTan,
}: {
  inputs: PlanInputs;
  baseSpend: number;
  isMrTan: boolean;
}) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <InflationCard inputs={inputs} />
        <LifestyleSummary inputs={inputs} />
      </div>
      <HealthcareConditions inputs={inputs} baseSpend={baseSpend} />
      <CrisisStress inputs={inputs} baseSpend={baseSpend} isMrTan={isMrTan} />
      <LifespanSensitivity
        inputs={inputs}
        baseSpend={baseSpend}
        isMrTan={isMrTan}
      />
    </>
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

      {/* Defect 9.4: 3-up on large desktop; 2-up on tablet with the lone third
          card spanning both columns so there is no awkward empty area. */}
      <div
        className={`mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:[&>*:nth-child(3)]:col-span-2 lg:[&>*:nth-child(3)]:col-span-1`}
      >
        {tests.map((tt) => (
          <StressCard key={tt.key} test={tt} />
        ))}
      </div>

      {/* Summary — the most important risk (defect 9.6: full width, wraps, no fixed height) */}
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

      {/* What we suggest — own the advice, stay product-neutral */}
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
              {t("results.suggestNote")}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-enough-ink">
              {optionsToDiscuss.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-enough-emerald">•</span>
                  <span className="leading-snug safe-break">{t(o)}</span>
                </li>
              ))}
            </ul>
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

/* ============ Custom plan — live engine result ============ */
function CustomResults({ analysis }: { analysis: FullAnalysis }) {
  const { t } = useTranslation();
  const { inputs } = usePlan();
  const { mode } = useViewMode();
  const child = mode === "child";
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

      {/* Life event stress test — what moves the monthly spend number */}
      <StressTestSection
        child={child}
        centralSpend={safe.centralSpend}
        horizonAge={inputs.horizonAge}
      />

      {/* Inflation, lifestyle, healthcare, crisis, lifespan deep modules */}
      <ExtraResultsModules
        inputs={inputs}
        baseSpend={safe.centralSpend}
        isMrTan={false}
      />

      {/* Decision-shape sections apply to any plan */}
      <GapCloser inputs={inputs} gap={gap} />
      <FundingSequence inputs={inputs} centralSpend={safe.centralSpend} />
      <ProtectionReferral inputs={inputs} />

      <CurveSection
        title={t("results.curveTitleCustom")}
        sub={t("results.curveSub")}
        data={analysis.curve.map((p) => ({
          spend: Math.round(p.spend),
          conf: Math.round(p.successRate * 100),
        }))}
        ticks={undefined}
      />

      {child &&
        (sens ? (
          <CustomSensitivity sens={sens} />
        ) : (
          <Card>
            <Spinner label={t("results.spinnerSens")} />
          </Card>
        ))}
      {child && seq ? <CustomSequence seq={seq} /> : null}

      <Card className="bg-enough-navy text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-white text-xl font-bold safe-break">
            {t("results.nextTitleParent")}
          </h3>
          <Link to="/report" className="btn-emerald min-h-[44px]">
            {t("results.nextCtaParent")}
          </Link>
        </div>
      </Card>
    </div>
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
  const maxAbs = Math.max(...all.map((r) => Math.abs(r.impact)));
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

/** Custom sequence-risk lines are coloured by position (steady / bad-early / bad-late),
 *  matching the demo chart — the engine's SeqPath carries no tone field. */
const SEQ_LINE_COLORS = ["#0E9F6E", "#DC2626", "#D97706"];
