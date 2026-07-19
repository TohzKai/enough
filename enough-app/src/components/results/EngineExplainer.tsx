import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { s$ } from "../../lib/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { demoSensitivity, demoSequence } from "../../data/demoDataset";
import type { ResultViewModel } from "./resultModel";

interface EngineExplainerProps {
  vm: ResultViewModel;
}

/**
 * "How the Engine Works" — the fourth Results tab. Explains the engine
 * inputs, process, and outputs; shows the spend-confidence curve first,
 * then sensitivity + sequence-of-returns analysis. Available in BOTH
 * parent and adult-child view (no child-only restriction).
 */
export function EngineExplainer({ vm }: EngineExplainerProps) {
  const { t } = useTranslation();
  const curve = vm.analysis.curve.map((p) => ({
    spend: Math.round(p.spend),
    conf: Math.round(p.successRate * 100),
  }));

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-enough-navy safe-break">
        {t("results.engineExplainer")}
      </h2>
      <p className="readable text-sm text-enough-slate">
        {t("results.engineExplainerSub")}
      </p>

      <div className="rounded-xl2 border border-enough-line bg-white p-4">
        <h3 className="text-lg font-bold text-enough-navy mb-1">
          {t("results.curveTitleOverview")}
        </h3>
        <p className="text-xs text-enough-slate mb-3">
          {t("results.curveSubOverview")}
        </p>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <AreaChart
              data={curve}
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
                tickFormatter={(v) => s$(Number(v))}
                tick={{ fill: "#0F1B2D", fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: "#5B6B7F", fontSize: 11 }}
              />
              <Tooltip
                formatter={(v: number) => `${v}% confidence`}
                labelFormatter={(v) => s$(Number(v))}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #E2E6EC",
                  fontSize: 13,
                }}
              />
              <ReferenceLine
                x={Math.round(vm.cpfFloor)}
                stroke="#1B6FA8"
                strokeDasharray="5 4"
                label={{
                  value: "CPF floor",
                  fill: "#1B6FA8",
                  fontSize: 10,
                  position: "insideTopLeft",
                }}
              />
              <ReferenceLine
                x={Math.round(vm.saferCentral)}
                stroke="#0E9F6E"
                strokeWidth={2}
                label={{
                  value: "Safer",
                  fill: "#0B7A55",
                  fontSize: 10,
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
      </div>

      <SensitivityPanel />
      <SequencePanel />

      <Card>
        <h3 className="text-base font-bold text-enough-navy mb-2">
          {t("results.optionsToExplore")}
        </h3>
        <p className="text-sm text-enough-slate">
          {t("results.optionsToExploreNote")}
        </p>
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-semibold text-enough-navy">
            {t("results.providersHeading")}
          </summary>
          <p className="text-xs text-enough-slate mt-1">
            {t("results.providersNote")}
          </p>
        </details>
      </Card>
    </section>
  );
}

function SensitivityPanel() {
  const { t } = useTranslation();
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-2">
        {t("results.sensTitleDemo")}
      </h3>
      <p className="text-sm text-enough-slate mb-3">{t("results.sensIntro")}</p>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm font-bold text-enough-red mb-2">
            {t("results.sensReduces")}
          </div>
          <div className="space-y-2">
            {demoSensitivity.reduces.map((r) => (
              <BarRow key={r.factor} factor={t(r.factor)} impact={r.impact} />
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-enough-emeraldDark mb-2">
            {t("results.sensImproves")}
          </div>
          <div className="space-y-2">
            {demoSensitivity.improves.map((r) => (
              <BarRow key={r.factor} factor={t(r.factor)} impact={r.impact} />
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-enough-slate mt-3 safe-break">
        {t("results.curveSubOverview")}
      </p>
    </Card>
  );
}

function BarRow({ factor, impact }: { factor: string; impact: number }) {
  const w = Math.min(100, Math.abs(impact) / 5);
  return (
    <div>
      <div className="text-sm text-enough-ink">{factor}</div>
      <div className="mt-1 h-2 rounded-full bg-enough-navy/5">
        <div
          className={`h-2 rounded-full ${
            impact < 0 ? "bg-enough-red" : "bg-enough-emerald"
          }`}
          style={{ width: `${Math.max(6, w)}%` }}
        />
      </div>
    </div>
  );
}

function SequencePanel() {
  const { t } = useTranslation();
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-2">
        {t("results.seqTitle")}
      </h3>
      <p className="text-sm text-enough-slate mb-2">
        {t("results.sequenceRiskInsight")}
      </p>
      <div className="rounded-xl2 border border-enough-amber/30 bg-enough-amber/5 px-3 py-2 text-xs text-enough-slate">
        {t("results.sequenceRiskLabel")}
      </div>
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        {demoSequence.paths.map((p) => (
          <div
            key={p.label}
            className="rounded-xl2 border border-enough-line bg-white p-3"
          >
            <div className="text-xs font-semibold text-enough-navy">
              {p.label === "steady"
                ? t("results.seqSteady")
                : p.label === "badEarly"
                  ? t("results.seqBadEarly")
                  : t("results.seqBadLate")}
            </div>
            <div className="text-sm text-enough-ink mt-1">
              {p.label === "steady"
                ? t("results.sequenceRiskSteady")
                : p.label === "badEarly"
                  ? t("results.sequenceRiskBadEarly")
                  : t("results.sequenceRiskBadLate")}
            </div>
            {p.depletedYear != null && (
              <div className="text-xs text-enough-red mt-1">
                Depletes ~Year {p.depletedYear}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
