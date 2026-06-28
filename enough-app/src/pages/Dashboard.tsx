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
    i.cpfLifeMonthly === 950 &&
    i.cash + i.investments + i.srs === 150000 &&
    i.desiredSpend === 2350
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
          Build a plan first, or load a sample profile to see Enough in action.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => navigate("/plan")} className="btn-emerald">
            Build my plan
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

/* ============ Mr Tan — stable calibrated result ============ */
function MrTanResults() {
  const { inputs } = usePlan();
  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Your result"
        title="Your safer monthly spend range"
        subtitle="A range with an estimated confidence — never a guarantee. This is an illustrative result based on stated assumptions."
      />

      {/* Summary hero */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          Safer spend range
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(demoMrTan.saferLower)} to{" "}
            {formatMoney(demoMrTan.saferUpper)}
          </div>
          <div className="text-white/60 text-base pb-1">per month</div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold">
          Central estimate: {formatMoneyMonth(demoMrTan.saferCentral)} · about{" "}
          {demoMrTan.confidence}% confidence
        </div>
        <div className="mt-2 flex items-center gap-3 flex-wrap">
          <Pill tone="emerald">
            ~{pctRaw(demoMrTan.confidence)}% over{" "}
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

      {/* Curve */}
      <CurveSection
        title="The product is the curve"
        sub="Each extra S$100 per month improves lifestyle today but reduces safety tomorrow."
        data={demoCurve.map((p) => ({ spend: p.spend, conf: p.conf }))}
        ticks={[950, 1200, 1400, 1650, 1900, 2350]}
      />

      {/* Sensitivity */}
      <SensitivitySection />

      {/* Sequence risk */}
      <SequenceSection inputs={inputs} />

      {/* Next action */}
      <Card className="bg-enough-navy text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-white text-xl font-bold">
              Turn this into a family conversation
            </h3>
            <p className="text-white/80 mt-1">
              Open a calm, printable one-page report to share at home.
            </p>
          </div>
          <Link to="/family" className="btn-emerald">
            Open family report →
          </Link>
        </div>
      </Card>
    </div>
  );
}

/* ============ Custom plan — live engine result ============ */
function CustomResults({ analysis }: { analysis: FullAnalysis }) {
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
        kicker="Your result · live engine"
        title="Your safer monthly spend range"
        subtitle="A range with an estimated confidence — never a guarantee. Based on the assumptions you entered."
      />

      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          Safer spend range
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {formatMoney(safe.lowerSpend)} to {formatMoney(safe.upperSpend)}
          </div>
          <div className="text-white/60 text-base pb-1">per month</div>
        </div>
        <div className="mt-2 text-base md:text-lg text-enough-emerald font-semibold">
          Central: {formatMoneyMonth(safe.centralSpend)} · about{" "}
          {pctRaw(safe.confidence)}%
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

      <CurveSection
        title="Spend-confidence curve"
        sub="Each extra S$100 per month improves lifestyle today but reduces safety tomorrow."
        data={analysis.curve.map((p) => ({
          spend: Math.round(p.spend),
          conf: Math.round(p.successRate * 100),
        }))}
        ticks={undefined}
      />

      {sens ? (
        <CustomSensitivity sens={sens} />
      ) : (
        <Card>
          <Spinner label="Testing what moves your number…" />
        </Card>
      )}
      {seq ? <CustomSequence seq={seq} /> : null}

      <Card className="bg-enough-navy text-white border-0">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-white text-xl font-bold">
            Turn this into a family conversation
          </h3>
          <Link to="/family" className="btn-emerald">
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
              x={950}
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
              x={1400}
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
              x={2350}
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
  // Stable illustrative trajectories (Mr Tan demo data).
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
      <div className="mt-4 grid sm:grid-cols-3 gap-2 text-sm">
        <div className="rounded-xl2 bg-enough-emerald/10 p-3">
          <Pill tone="emerald">Green</Pill>
          <div className="text-enough-ink mt-1">
            Stay within the safer range.
          </div>
        </div>
        <div className="rounded-xl2 bg-enough-amber/10 p-3">
          <Pill tone="amber">Amber</Pill>
          <div className="text-enough-ink mt-1">Trim discretionary spend.</div>
        </div>
        <div className="rounded-xl2 bg-enough-red/10 p-3">
          <Pill tone="red">Red</Pill>
          <div className="text-enough-ink mt-1">
            Pause increases; use buffer.
          </div>
        </div>
      </div>
      {/* inputs is used to keep the section tied to the current plan context */}
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
