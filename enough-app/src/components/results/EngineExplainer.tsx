import { useTranslation } from "react-i18next";
import { Card } from "../ui";
import { formatMoney, s$ } from "../../lib/format";
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
import { useMemo } from "react";
import { demoSensitivity } from "../../data/demoDataset";
import { generateSequenceRiskScenario } from "../../engine";
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
      <SequencePanel vm={vm} />
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

function SequencePanel({ vm }: { vm: ResultViewModel }) {
  const { t } = useTranslation();
  // Use the real sequence-risk engine output rather than the demo dataset,
  // so the three cards reflect the user's actual plan inputs.
  const seq = useMemo(
    () => generateSequenceRiskScenario(vm.inputs),
    [vm.inputs],
  );
  const titleKey = (label: string) =>
    label === "Steady market"
      ? "results.seqSteady"
      : label === "Bad market EARLY"
        ? "results.seqBadEarly"
        : "results.seqBadLate";
  const descKey = (label: string) =>
    label === "Steady market"
      ? "results.seqDescSteady"
      : label === "Bad market EARLY"
        ? "results.seqDescBadEarly"
        : "results.seqDescBadLate";
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
        {seq.paths.map((p) => {
          const depleted = p.depletedAtYear !== null;
          const outcome = depleted
            ? t("results.sequenceDepletes", { year: p.depletedAtYear })
            : t("results.sequenceLasts", { age: vm.inputs.horizonAge });
          const balanceText = formatMoney(Math.max(0, p.endingBalance));
          const outcomeTone = depleted
            ? "text-enough-red"
            : "text-enough-emeraldDark";
          return (
            <div
              key={p.label}
              className="rounded-xl2 border border-enough-line bg-white p-3 space-y-2"
            >
              <div className="text-sm font-bold text-enough-navy leading-snug">
                {t(titleKey(p.label))}
              </div>
              <p className="text-xs text-enough-slate leading-snug safe-break">
                {t(descKey(p.label))}
              </p>
              <div className="text-xs text-enough-slate">
                {t("results.sequenceEndingBalance", {
                  value: balanceText,
                })}
              </div>
              <div className={`text-xs font-semibold ${outcomeTone}`}>
                {outcome}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-xl2 border border-enough-line bg-enough-navy/5 p-3">
        <div className="text-sm font-bold text-enough-navy">
          {t("results.seqWhyTitle")}
        </div>
        <p className="text-xs text-enough-slate leading-relaxed mt-1 safe-break">
          {t("results.seqWhyBody")}
        </p>
      </div>
      <p className="readable mt-3 text-xs text-enough-slate leading-relaxed safe-break">
        {t("results.seqAllDepleteBody")}
      </p>
    </Card>
  );
}
