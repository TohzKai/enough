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
import {
  withdrawalOrder,
  topUpRecommendations,
} from "../data/withdrawalSequence";
import {
  currentGuardrail,
  guardrailBands,
  learningTimeline,
} from "../data/guardrails";
import { childAlerts } from "../data/familyPlane";
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
    i.cash + i.investments + i.srs === 190000 &&
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
        Go to the family plane to co-sign →
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

      {/* Summary hero — the monthly paycheck */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {child ? "Dad's monthly paycheck" : "Your monthly paycheck"}
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(demoMrTan.saferLower)} to{" "}
            {formatMoney(demoMrTan.saferUpper)}
          </div>
          <div className="text-white/60 text-base pb-1">per month</div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold">
          Safe today: {formatMoneyMonth(demoMrTan.saferCentral)} · about{" "}
          {demoMrTan.confidence}% confidence
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
          sub="per month · income for life"
        />
        <StatCard
          label="Extra withdrawal"
          value={formatMoney(demoMrTan.withdrawal)}
          tone="emerald"
          sub={`per month · ${pct(demoMrTan.initialWithdrawalRate, 1)} rate`}
        />
        <StatCard
          label="Desired spend"
          value={formatMoney(demoMrTan.desired)}
          tone="amber"
          sub="per month"
        />
        <StatCard
          label="Gap vs desired"
          value={formatMoney(demoMrTan.gap)}
          tone="red"
          sub="per month"
        />
      </div>

      <div className="rounded-xl2 border border-enough-amber/20 bg-enough-amber/5 px-4 py-2.5 text-sm text-enough-ink leading-relaxed">
        <strong className="text-enough-amber">
          CPF LIFE is a longevity floor, not necessarily an inflation hedge.
        </strong>{" "}
        Standard payouts are level nominal; spending is inflated over time.
        Results are estimates, not guarantees.
      </div>

      {/* C — Dynamic guardrails: the current steer */}
      <GuardrailNow />

      {/* B — Tax & longevity-aware withdrawal sequencing */}
      <WithdrawalSequenceSection />

      {/* Top-up decision shapes (never product recommendations) */}
      <TopUpSection />

      {/* Curve */}
      <CurveSection
        title="The product is the curve"
        sub="Each extra S$100 per month improves lifestyle today but reduces safety tomorrow."
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
                ? "Review and co-sign the safe raise on the family plane — Dad confirms."
                : "Open a calm, printable one-page report to share at home."}
            </p>
          </div>
          <Link to={child ? "/family" : "/report"} className="btn-emerald">
            {child ? "Open family plane →" : "Open family report →"}
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
            Markets are up — a safe raise is available
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
          <div className="text-xs text-enough-slate">per month</div>
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

/* ============ Withdrawal sequencing (B) ============ */
function WithdrawalSequenceSection() {
  const toneBar: Record<string, string> = {
    emerald: "bg-enough-emerald",
    amber: "bg-enough-amber",
    navy: "bg-enough-navy",
    slate: "bg-enough-slate",
  };
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        Which account to spend first
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        Tax- and longevity-aware sequencing across CPF, SRS, cash and
        investments. This is the decision shape no bank can answer neutrally —
        "draw the unit trust we sold you first" is conflicted.
      </p>
      <div className="mt-4 space-y-3">
        {withdrawalOrder.map((s) => (
          <div
            key={s.order}
            className="flex gap-3 rounded-xl2 border border-enough-line p-4"
          >
            <div
              className={`h-8 w-8 shrink-0 rounded-full ${toneBar[s.tone]} text-white flex items-center justify-center font-extrabold`}
            >
              {s.order}
            </div>
            <div>
              <div className="font-bold text-enough-navy">{s.title}</div>
              <p className="text-sm text-enough-ink mt-1 leading-relaxed">
                {s.rationale}
              </p>
              <p className="text-xs text-enough-slate mt-1 leading-relaxed">
                {s.nuance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ============ Top-up decision shapes ============ */
function TopUpSection() {
  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        Levers that raise confidence
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        The decision shape, never a product. Enough sizes the move; a licensed
        partner would handle any product.
      </p>
      <div className="mt-4 grid md:grid-cols-3 gap-3">
        {topUpRecommendations.map((t) => (
          <div
            key={t.title}
            className="rounded-xl2 border border-enough-line p-4"
          >
            <div className="font-bold text-enough-navy">{t.title}</div>
            <p className="text-sm text-enough-ink mt-1 leading-relaxed">
              {t.detail}
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <Pill tone="emerald">{t.confidenceLift}</Pill>
              <Pill tone={t.reversible ? "navy" : "amber"}>
                {t.reversible ? "reversible" : "hard to reverse"}
              </Pill>
            </div>
          </div>
        ))}
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
          Your monthly paycheck
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(safe.lowerSpend)} to {formatMoney(safe.upperSpend)}
          </div>
          <div className="text-white/60 text-base pb-1">per month</div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold">
          Central: {formatMoneyMonth(safe.centralSpend)} · about{" "}
          {pctRaw(safe.confidence)}
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
          sub="per month"
        />
        <StatCard
          label="Extra withdrawal"
          value={formatMoney(withdrawal)}
          tone="emerald"
          sub="per month"
        />
        <StatCard
          label="Desired spend"
          value={formatMoney(inputs.desiredSpend)}
          tone="amber"
          sub="per month"
        />
        <StatCard
          label="Gap"
          value={formatMoney(gap)}
          tone="red"
          sub="per month"
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

      {/* Decision-shape sections apply to any plan */}
      <WithdrawalSequenceSection />
      <TopUpSection />

      <CurveSection
        title="Spend-confidence curve"
        sub="Each extra S$100 per month improves lifestyle today but reduces safety tomorrow."
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
