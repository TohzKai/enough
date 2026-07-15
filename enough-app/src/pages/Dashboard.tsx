import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  s$,
  s$month,
  formatMoney,
  formatMoneyMonth,
  formatDeltaMonth,
  formatConfidence,
  pct,
  pctRaw,
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
  const { analysis, inputs, status } = usePlan();

  if (status === "computing" && !analysis) {
    return (
      <Card>
        <Spinner label="Simulating thousands of retirement paths…" />
      </Card>
    );
  }

  if (isMrTan(inputs)) return <MrTanResults />;
  if (!analysis) return <EmptyResults />;
  return <CustomResults analysis={analysis} />;
}

/* ============ Empty state (no plan yet) ============ */
function EmptyResults() {
  const navigate = useNavigate();
  const { setInputs } = usePlan();
  return (
    <Card>
      <div className="text-center py-10">
        <div className="text-2xl font-bold text-enough-navy">No plan yet</div>
        <p className="mt-2 text-enough-slate max-w-md mx-auto">
          Connect your accounts first, or load a sample profile to see Enough in
          action.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => navigate("/plan")} className="btn-emerald">
            Connect accounts
          </button>
          <button
            onClick={() => {
              setInputs({ ...mrTanInputs });
            }}
            className="btn-ghost"
          >
            Load sample profile
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ============ Adult-child oversight strip ============ */
function OversightStrip() {
  const alertTone: Record<string, string> = {
    emerald: "border-l-enough-emerald bg-enough-emerald/5",
    amber: "border-l-enough-amber bg-enough-amber/5",
    navy: "border-l-enough-navy bg-enough-navy/5",
  };
  return (
    <Card className="!p-4">
      <div className="flex items-center gap-2 mb-3">
        <Pill tone="amber">Adult-child view</Pill>
        <span className="text-sm font-semibold text-enough-navy">
          Oversight without intrusion — Dad still confirms every number
        </span>
      </div>
      <div className="grid sm:grid-cols-3 gap-2.5">
        {childAlerts.map((a) => (
          <div
            key={a.title}
            className={`rounded-xl2 border border-enough-line border-l-4 p-3 ${alertTone[a.tone]}`}
          >
            <div className="font-bold text-enough-navy text-sm">{a.title}</div>
            <div className="text-xs text-enough-ink mt-1 leading-snug">
              {a.body}
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/family"
        className="mt-3 inline-flex text-sm font-semibold text-enough-navy hover:text-enough-emeraldDark"
      >
        Go to the family plan to co-sign →
      </Link>
    </Card>
  );
}

/* ============ Mr Tan — stable calibrated result ============ */
function MrTanResults() {
  const { inputs } = usePlan();
  const { mode } = useViewMode();
  const child = mode === "child";

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={child ? "Your parent's result" : "Your result"}
        title={
          child ? "Dad's safer monthly spend" : "Your safer monthly spend range"
        }
        subtitle="A range with an estimated confidence — never a guarantee. This is an illustrative result based on stated assumptions."
      />

      {child && <OversightStrip />}

      {/* Summary hero — the safer monthly spend range */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {child
            ? "Dad's safer monthly spend range"
            : "Your safer monthly spend range"}
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(demoMrTan.saferLower)} to{" "}
            {formatMoney(demoMrTan.saferUpper)}
          </div>
          <div className="text-white/60 text-base pb-1">/month</div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold">
          Suggested today: {formatMoneyMonth(demoMrTan.saferCentral)} ·{" "}
          {formatConfidence(demoMrTan.confidence / 100)}
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <Pill tone="emerald">
            ~{pctRaw(demoMrTan.confidence)} over{" "}
            {demoMrTan.horizonAge - demoMrTan.age} yrs
          </Pill>
          <span className="text-white/55 text-sm">
            Desired {formatMoneyMonth(demoMrTan.desired)} ≈{" "}
            {demoMrTan.desiredConfidence}% confidence
          </span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="CPF LIFE floor"
          value={formatMoney(demoMrTan.cpfLife)}
          tone="navy"
          sub="/month · income for life"
        />
        <StatCard
          label="Extra withdrawal"
          value={formatMoney(demoMrTan.withdrawal)}
          tone="emerald"
          sub={`/month · ${pct(demoMrTan.initialWithdrawalRate, 1)} rate`}
        />
        <StatCard
          label="Desired spend"
          value={formatMoney(demoMrTan.desired)}
          tone="amber"
          sub="/month"
        />
        <StatCard
          label="Gap vs desired"
          value={formatMoney(demoMrTan.gap)}
          tone="red"
          sub="/month"
        />
      </div>

      <div className="rounded-xl2 border border-enough-amber/20 bg-enough-amber/5 px-4 py-2.5 text-sm text-enough-ink leading-relaxed">
        <strong className="text-enough-amber">
          CPF LIFE is a longevity floor, not necessarily an inflation hedge.
        </strong>{" "}
        Standard payouts are level nominal; spending is inflated over time.
        Results are estimates, not guarantees.
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
        title="The product is the curve"
        sub="Each extra S$100/month improves lifestyle today but reduces safety tomorrow."
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
          <div>
            <h3 className="text-white text-xl font-bold">
              {child
                ? "Bring the family in to co-sign"
                : "Turn this into a family conversation"}
            </h3>
            <p className="text-white/80 mt-1">
              {child
                ? "Review and co-sign the safe raise on the family plan — Dad confirms."
                : "Open a calm, printable one-page report to share at home."}
            </p>
          </div>
          <Link to={child ? "/family" : "/report"} className="btn-emerald">
            {child ? "Open family plan →" : "Open family report →"}
          </Link>
        </div>
      </Card>
    </div>
  );
}

/* ============ Guardrail "now" card (C) ============ */
function GuardrailNow() {
  const g = currentGuardrail;
  return (
    <Card className="border-enough-emerald/30 bg-enough-emerald/5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Pill tone="emerald">Guardrail · raise available</Pill>
          </div>
          <h3 className="text-2xl font-bold text-enough-navy mt-2">
            Markets are up — the model shows room to raise spend
          </h3>
          <p className="text-enough-ink mt-1 leading-relaxed max-w-2xl">
            {g.reason} A living plan with a steering wheel — no panic in
            downturns, and permission to safely spend more in good times.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-enough-slate">now → suggested</div>
          <div className="text-2xl font-extrabold text-enough-navy whitespace-nowrap">
            {formatMoney(g.currentSpend)} →{" "}
            <span className="text-enough-emeraldDark">
              {formatMoney(g.suggestedSpend)}
            </span>
          </div>
          <div className="text-xs text-enough-slate">/month</div>
        </div>
      </div>
      <div className="mt-4 grid sm:grid-cols-4 gap-2 text-xs">
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
              className={`font-bold ${
                b.zone === "raise" || b.zone === "green"
                  ? "text-enough-emeraldDark"
                  : b.zone === "amber"
                    ? "text-enough-amber"
                    : "text-enough-red"
              }`}
            >
              {b.headline}
            </div>
            <div className="text-enough-slate mt-1 leading-snug">
              {b.action}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============ Assumption, lifestyle, and deep stress modules (F1,F2,F4,F5,F6) ============ */

function InflationCard({ inputs }: { inputs: PlanInputs }) {
  const escalating = inputs.cpfPlan === "Escalating";
  const rows: [string, string][] = [
    [
      "General / lifestyle spending",
      `${pct(inputs.generalInflation / 100, 1)} / year`,
    ],
    ["Healthcare", `${pct(inputs.healthcareInflation / 100, 1)} / year`],
    ["CPF LIFE Standard", "level nominal payout"],
    [
      "CPF LIFE Escalating",
      escalating
        ? "selected — grows about 2% / year"
        : "grows about 2% / year if selected",
    ],
  ];
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-2">
        Inflation assumptions used
      </h3>
      <ul className="text-sm space-y-1">
        {rows.map(([k, v]) => (
          <li key={k} className="flex justify-between gap-3">
            <span className="text-enough-slate">{k}</span>
            <span className="font-semibold text-enough-navy text-right">
              {v}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-enough-slate mt-2 leading-relaxed">
        CPF LIFE is a longevity floor, not necessarily an inflation hedge.
        Spending is inflated over time.
      </p>
    </Card>
  );
}

function LifestyleSummary({ inputs }: { inputs: PlanInputs }) {
  const t = layerTotals(inputs.lifestyle);
  const tiles = [
    { label: "Essentials", v: t.essential, cls: "text-enough-navy" },
    { label: "Flexible", v: t.flexible, cls: "text-enough-emeraldDark" },
    { label: "Aspirational", v: t.aspirational, cls: "text-enough-amber" },
    { label: "Total / month", v: t.total, cls: "text-enough-navy" },
  ];
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-2">
        Lifestyle layers
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {tiles.map((x) => (
          <div
            key={x.label}
            className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-3 py-2 text-center"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-enough-slate">
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
const zoneLabel: Record<StressZone, string> = {
  green: "Green zone",
  amber: "Amber zone",
  red: "Red zone",
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
        Financial crisis stress test
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        A scenario test, not market timing. See how a downturn moves the safer
        spend and which guardrail zone applies.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {CRISIS_SCENARIOS.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setKey(s.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              key === s.key
                ? "bg-enough-navy text-white"
                : "bg-enough-navy/5 text-enough-navy hover:bg-enough-navy/10"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-enough-slate mt-2">{scenario.blurb}</p>

      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        <StatCard
          label="Base safer spend"
          value={formatMoneyMonth(baseSpend)}
          tone="navy"
        />
        <StatCard
          label={`After ${scenario.label.toLowerCase()}`}
          value={formatMoneyMonth(afterSpend)}
          tone={zone === "red" ? "red" : zone === "amber" ? "amber" : "emerald"}
        />
        <StatCard
          label="Estimated impact"
          value={formatDeltaMonth(impact)}
          tone={impact < 0 ? "red" : "emerald"}
        />
      </div>

      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <Pill tone={zoneTone[zone]}>{zoneLabel[zone]}</Pill>
        <span className="text-sm text-enough-ink">
          {CRISIS_ZONE_GUIDANCE[zone]}
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
        Lifespan sensitivity
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        Longer life usually lowers the safer monthly spend because the same
        assets must last longer.
      </p>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {rows.map((r) => (
          <div
            key={r.age}
            className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-3 text-center"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-enough-slate">
              Plan to age {r.age}
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
  const s = stressToneStyles[test.tone];
  return (
    <div className={`rounded-xl2 border ${s.card} p-4 flex flex-col`}>
      <Pill tone={s.pill}>{test.label}</Pill>
      <div className="font-bold text-enough-navy mt-2">{test.title}</div>
      <p className="text-sm text-enough-ink mt-1 leading-relaxed">
        {test.description}
      </p>
      <div className={`text-lg font-extrabold mt-2 ${s.impact}`}>
        Safer spend impact: {formatDeltaMonth(test.impactMonthly)}
      </div>
      <p className="text-xs text-enough-slate mt-2 leading-relaxed">
        {test.footer}
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
  const [showOptions, setShowOptions] = useState(false);
  const tests = lifeEventStressTestsFor(centralSpend, horizonAge);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {child ? "Stress-test Dad's plan" : "Stress-test the plan"}
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        See how life events move the monthly spend number before they happen.
      </p>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {tests.map((t) => (
          <StressCard key={t.key} test={t} />
        ))}
      </div>

      {/* Summary — the most important risk */}
      <div className="mt-4 rounded-xl2 border border-enough-navy/15 bg-enough-navy/5 px-4 py-3">
        <div className="font-bold text-enough-navy">
          {child
            ? "Most important risk for Dad's plan"
            : "Most important risk for this plan"}
        </div>
        <p className="text-sm text-enough-ink mt-1 leading-relaxed">
          Healthcare and longevity move the number more than the retirement
          trip.
        </p>
        <p className="text-xs text-enough-slate mt-1 leading-relaxed">
          Enough does not hide uncertainty. It shows which assumptions matter
          before the family commits to a monthly spend.
        </p>
      </div>

      {/* What we suggest — own the advice, stay product-neutral */}
      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowOptions((s) => !s)}
          className="btn-ghost text-sm"
          aria-expanded={showOptions}
        >
          {showOptions ? "Hide suggestions" : "What we suggest"}
        </button>
        {showOptions && (
          <div className="mt-3 rounded-xl2 border border-enough-line bg-white p-4">
            <div className="font-bold text-enough-navy">What we suggest</div>
            <p className="text-xs text-enough-slate mt-1 leading-relaxed">
              Our advice on the moves to weigh — you decide. We stay neutral on
              the specific product.
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-enough-ink">
              {optionsToDiscuss.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-enough-emerald">•</span>
                  <span className="leading-snug">{o}</span>
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
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        The plan learns over time
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        Not a snapshot — a record of decisions. The longer you stay, the more
        the number reflects your real spending. This is the household switching
        cost no competitor can copy in a sprint.
      </p>
      <div className="mt-4 space-y-3">
        {learningTimeline.map((p) => (
          <div key={p.period} className="flex gap-3 items-start">
            <div className="w-16 shrink-0 text-sm font-bold text-enough-navy pt-0.5">
              {p.period}
            </div>
            <div className="flex-1 rounded-xl2 border border-enough-line p-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="font-semibold text-enough-ink text-sm">
                  {p.event}
                </span>
                <span className="font-extrabold text-enough-emeraldDark whitespace-nowrap">
                  {formatMoneyMonth(p.safeSpend)}
                </span>
              </div>
              <p className="text-xs text-enough-slate mt-1 leading-relaxed">
                {p.driver}
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
        kicker="Your result · live engine"
        title="Your safer monthly spend range"
        subtitle="A range with an estimated confidence — never a guarantee. Based on the assumptions you entered."
      />

      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          Your safer monthly spend range
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(safe.lowerSpend)} to {formatMoney(safe.upperSpend)}
          </div>
          <div className="text-white/60 text-base pb-1">/month</div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold">
          Central: {formatMoneyMonth(safe.centralSpend)} · about{" "}
          {pctRaw(safe.confidence)} confidence
        </div>
        <div className="text-white/60 text-sm mt-1">
          {analysis.trials.toLocaleString()} trials · return{" "}
          {pctRaw(portfolio.expectedReturn * 100)} · vol{" "}
          {pctRaw(portfolio.volatility * 100)}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="CPF LIFE floor"
          value={formatMoney(inputs.cpfLifeMonthly)}
          tone="navy"
          sub="/month"
        />
        <StatCard
          label="Extra withdrawal"
          value={formatMoney(withdrawal)}
          tone="emerald"
          sub="/month"
        />
        <StatCard
          label="Desired spend"
          value={formatMoney(inputs.desiredSpend)}
          tone="amber"
          sub="/month"
        />
        <StatCard
          label="Gap"
          value={formatMoney(gap)}
          tone="red"
          sub="/month"
        />
      </div>

      {aggressive && (
        <Card className="bg-enough-amberSoft border-enough-amber/30">
          <div className="font-bold text-enough-amber">
            Your desired spend is aggressive
          </div>
          <p className="mt-1 text-enough-ink text-sm">
            Desired {s$month(inputs.desiredSpend)} needs a {pct(desiredRate, 1)}{" "}
            withdrawal rate — well above the ~3.5–4% historically considered
            sustainable.
          </p>
        </Card>
      )}

      <div className="rounded-xl2 border border-enough-amber/20 bg-enough-amber/5 px-4 py-2.5 text-sm text-enough-ink leading-relaxed">
        <strong className="text-enough-amber">
          CPF LIFE is a longevity floor, not an inflation hedge.
        </strong>{" "}
        The safer range depends on assumptions. Results are estimates, not
        guarantees.
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
        title="Spend-confidence curve"
        sub="Each extra S$100/month improves lifestyle today but reduces safety tomorrow."
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
            <Spinner label="Testing what moves your number…" />
          </Card>
        ))}
      {child && seq ? <CustomSequence seq={seq} /> : null}

      <Card className="bg-enough-navy text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-white text-xl font-bold">
            Turn this into a family conversation
          </h3>
          <Link to="/report" className="btn-emerald">
            Open family report →
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
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">{title}</h3>
      <p className="text-enough-slate mt-1">{sub}</p>
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
              tickFormatter={(v) => `S$${Number(v).toLocaleString()}`}
              tick={{ fill: "#0F1B2D", fontSize: 13, fontWeight: 600 }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "#5B6B7F", fontSize: 12 }}
            />
            <Tooltip
              formatter={(v: number) => [`${v}% confidence`, ""]}
              labelFormatter={(v) => `Spend ${s$(Number(v))}/month`}
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
                value: "CPF floor",
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
                value: "Safer",
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
                value: "Desired",
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
  const all = [...demoSensitivity.reduces, ...demoSensitivity.improves];
  const maxAbs = Math.max(...all.map((r) => Math.abs(r.impact)));
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        What moves the number?
      </h3>
      <p className="text-enough-slate mt-1">
        Enough does not hide uncertainty. It shows which assumptions matter.
      </p>
      <div className="mt-4 grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-bold text-enough-red mb-2">
            Reduces safer spend
          </div>
          <div className="space-y-2.5">
            {demoSensitivity.reduces.map((r) => (
              <BarRow key={r.factor} {...r} max={maxAbs} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-enough-emeraldDark mb-2">
            Improves sustainability
          </div>
          <div className="space-y-2.5">
            {demoSensitivity.improves.map((r) => (
              <BarRow key={r.factor} {...r} max={maxAbs} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function CustomSensitivity({ sens }: { sens: SensitivityResult }) {
  const top = sens.rows.slice(0, 6);
  const maxAbs = Math.max(...top.map((r) => Math.abs(r.impact)), 1);
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        What moves your number?
      </h3>
      <p className="text-enough-slate mt-1">
        Enough does not hide uncertainty. It shows which assumptions matter.
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
        <span className="text-enough-ink font-medium">{factor}</span>
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
        Bad markets early hurt more
      </h3>
      <p className="text-enough-slate mt-1">
        Two retirees can earn the same average return, but the one hit by losses
        early may run out sooner — withdrawals happen when assets are depressed.
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
                labelFormatter={(l) => `Year ${l}`}
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
              <span className="text-enough-ink font-medium">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      <span className="hidden">{inputs.cpfPlan}</span>
    </Card>
  );
}

function CustomSequence({ seq }: { seq: SequenceRiskResult }) {
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
        Bad markets early hurt more
      </h3>
      <p className="text-enough-slate mt-1">
        The same average return in a different order produces very different
        outcomes.
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
            <Line
              type="monotone"
              dataKey="Steady market"
              stroke="#0E9F6E"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Bad market EARLY"
              stroke="#DC2626"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Bad market LATE"
              stroke="#D97706"
              strokeWidth={2.5}
              dot={false}
            />
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
