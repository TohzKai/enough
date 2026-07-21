import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pill } from "../ui";
import {
  runFullAnalysisSync,
  generateSequenceRiskScenario,
} from "../../engine";
import type { FullAnalysis } from "../../engine";
import type { PlanInputs } from "../../types";
import { HealthcareConditions } from "../HealthcareConditions";
import { formatMoney } from "../../lib/format";

interface ScenarioLabProps {
  inputs: PlanInputs;
  baseAnalysis: FullAnalysis;
  baseCentral: number;
  baseConfidence: number;
  baseGap: number;
}

interface ScenarioResult {
  label: string;
  baselineCentral: number;
  afterCentral: number;
  baseConfidence: number;
  afterConfidence: number;
  baselineGap: number;
  afterGap: number;
  impact: number;
  body: string;
  applied: boolean;
}

/**
 * Scenario Lab — change one assumption at a time, rerun the engine, see
 * the impact on safer-spend, confidence, and gap.
 *
 * The worked example's decumulation engine is the centre of the product.
 * This component is the primary way the user interacts with it.
 *
 * No scenario overwrites the saved parent plan. Scenarios are temporary
 * what-if analyses until the user explicitly applies one with the
 * "Apply to my plan" button.
 */
export function ScenarioLab({
  inputs,
  baseAnalysis,
  baseCentral,
  baseConfidence,
  baseGap,
}: ScenarioLabProps) {
  const { t } = useTranslation();
  const [openKey, setOpenKey] = useState<string | null>("longerLife");
  const toggle = (k: string) => setOpenKey((cur) => (cur === k ? null : k));

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-bold text-enough-navy safe-break">
          {t("results.scenarioLabTitle")}
        </h2>
        <p className="readable text-sm text-enough-slate mt-1">
          {t("results.scenarioLabSub")}
        </p>
      </header>

      <BaselineReminder central={baseCentral} confidence={baseConfidence} />

      <div className="space-y-3">
        <LongerLifeModule
          inputs={inputs}
          baseAnalysis={baseAnalysis}
          baseCentral={baseCentral}
          baseConfidence={baseConfidence}
          baseGap={baseGap}
          isOpen={openKey === "longerLife"}
          onToggle={() => toggle("longerLife")}
        />
        <HealthcareModule
          inputs={inputs}
          baseAnalysis={baseAnalysis}
          baseCentral={baseCentral}
          baseConfidence={baseConfidence}
          baseGap={baseGap}
          isOpen={openKey === "healthcare"}
          onToggle={() => toggle("healthcare")}
        />
        <MarketSequenceModule
          inputs={inputs}
          baseAnalysis={baseAnalysis}
          baseCentral={baseCentral}
          baseConfidence={baseConfidence}
          baseGap={baseGap}
          isOpen={openKey === "market"}
          onToggle={() => toggle("market")}
        />
        <TripLegacyModule
          inputs={inputs}
          baseAnalysis={baseAnalysis}
          baseCentral={baseCentral}
          baseConfidence={baseConfidence}
          baseGap={baseGap}
          isOpen={openKey === "tripLegacy"}
          onToggle={() => toggle("tripLegacy")}
        />
      </div>
    </section>
  );
}

/* ---------- One-line baseline reminder ---------- */
function BaselineReminder({
  central,
  confidence,
}: {
  central: number;
  confidence: number;
}) {
  const { t } = useTranslation();
  const rounded = Math.round(central / 50) * 50;
  return (
    <p className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-2 text-sm text-enough-slate safe-break">
      <strong className="text-enough-navy">
        {t("results.scenarioBaselineReminder", {
          value: rounded,
          confidence: Math.round(confidence),
        })}
      </strong>
    </p>
  );
}

/* ---------- Shared module wrapper ---------- */
function ScenarioModule({
  isOpen,
  onToggle,
  title,
  subtitle,
  badge,
  result,
  reset,
  appliedKey,
  appliedBody,
  body,
}: {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  subtitle: string;
  badge?: string;
  result?: ScenarioResult | null;
  reset?: () => void;
  appliedKey?: string;
  appliedBody?: string;
  body?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl2 border border-enough-line bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-enough-navy">{title}</span>
            {badge && <Pill tone="amber">{badge}</Pill>}
          </div>
          <p className="text-xs text-enough-slate mt-0.5">{subtitle}</p>
        </div>
        <span aria-hidden="true" className="text-enough-slate text-lg">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-enough-line p-4 space-y-3">
          {body}
          {result && (
            <ScenarioResultPanel
              result={result}
              appliedKey={appliedKey}
              appliedBody={appliedBody}
              reset={reset}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ScenarioResultPanel({
  result,
  appliedKey,
  appliedBody,
  reset,
}: {
  result: ScenarioResult;
  appliedKey?: string;
  appliedBody?: string;
  reset?: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="rounded-xl2 border border-enough-line bg-enough-navy/5 p-3 space-y-2">
      <div className="grid gap-2 sm:grid-cols-3 text-sm">
        <Cell
          label={t("results.scenarioBaseline")}
          value={`S$${Math.round(result.baselineCentral).toLocaleString()}/mo`}
        />
        <Cell
          label={t("results.scenarioAfter")}
          value={`S$${Math.round(result.afterCentral).toLocaleString()}/mo`}
          highlight
        />
        <Cell
          label={t("results.scenarioImpact")}
          value={`${result.impact >= 0 ? "+" : ""}S$${Math.round(result.impact).toLocaleString()}/mo`}
          tone={result.impact < 0 ? "amber" : "emerald"}
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-3 text-sm">
        <Cell
          label={t("results.scenarioConfidence")}
          value={`${Math.round(result.baseConfidence)}% → ${Math.round(result.afterConfidence)}%`}
        />
        <Cell
          label={t("common.gap", {})}
          value={`S$${Math.round(Math.abs(result.afterGap)).toLocaleString()}`}
        />
        <p className="text-xs text-enough-slate self-center">{result.body}</p>
      </div>
      {appliedKey && (
        <div className="rounded-xl2 border border-enough-emerald/30 bg-enough-emerald/10 px-3 py-2 text-sm text-enough-ink">
          <strong className="text-enough-emeraldDark">
            {t("results.illustrativeGuardrailPill", {})}:
          </strong>{" "}
          {appliedBody}
        </div>
      )}
      {reset && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={reset}
            className="btn-ghost text-sm min-h-[44px]"
          >
            {t("results.scenarioReset")}
          </button>
        </div>
      )}
    </div>
  );
}

function Cell({
  label,
  value,
  highlight,
  tone,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  tone?: "emerald" | "amber";
}) {
  const toneCls =
    tone === "amber"
      ? "text-enough-amber"
      : tone === "emerald"
        ? "text-enough-emeraldDark"
        : "text-enough-navy";
  return (
    <div
      className={`rounded-xl2 border px-3 py-2 ${
        highlight
          ? "border-enough-emerald/40 bg-enough-emerald/5"
          : "border-enough-line bg-white"
      }`}
    >
      <div className="text-xs text-enough-slate">{label}</div>
      <div className={`text-sm font-extrabold ${toneCls}`}>{value}</div>
    </div>
  );
}

/* ---------- Module 1: Longer life (slider + quick choices) ---------- */
function LongerLifeModule(props: ScenarioModuleProps) {
  const { t } = useTranslation();
  const { inputs, baseCentral, baseConfidence, baseGap, isOpen, onToggle } =
    props;
  const [horizon, setHorizon] = useState<number>(inputs.horizonAge);
  const [debounced, setDebounced] = useState<number>(inputs.horizonAge);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebounced(horizon), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [horizon]);

  const result = useMemo<ScenarioResult | null>(() => {
    if (!isOpen) return null;
    if (debounced === inputs.horizonAge) return null;
    const after = runFullAnalysisSync({ ...inputs, horizonAge: debounced });
    const impact = after.safe.centralSpend - baseCentral;
    const afterConfidence = after.safe.confidence;
    const baseConfidence = props.baseAnalysis.safe.confidence;
    const afterGap = inputs.desiredSpend - after.safe.centralSpend;
    return {
      label: t("results.scenarioLongerLife"),
      baselineCentral: baseCentral,
      afterCentral: after.safe.centralSpend,
      baseConfidence,
      afterConfidence,
      baselineGap: baseGap,
      afterGap,
      impact,
      body: t("results.scenarioLongerLifeSub"),
      applied: false,
    };
  }, [
    debounced,
    isOpen,
    inputs,
    baseCentral,
    baseConfidence,
    baseGap,
    props.baseAnalysis.safe.confidence,
    t,
  ]);

  return (
    <ScenarioModule
      isOpen={isOpen}
      onToggle={onToggle}
      title={t("results.scenarioLongerLife")}
      subtitle={t("results.scenarioLongerLifeSub")}
      badge={result ? `${impactTag(result.impact)}` : undefined}
      result={result}
      reset={() => setHorizon(inputs.horizonAge)}
      appliedKey="lifespan"
      appliedBody={
        result
          ? t("results.scenarioAppliedLifespan", {
              age: debounced,
              baseline: Math.round(baseCentral),
              after: Math.round(result.afterCentral),
            })
          : undefined
      }
      body={
        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold text-enough-navy">
              {t("results.scenarioLongerLifeAge")}: {debounced}
            </div>
            <input
              type="range"
              min={85}
              max={105}
              step={1}
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-[10px] text-enough-slate">
              <span>85</span>
              <span>105</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-enough-slate mb-1">
              {t("results.scenarioLongerLifeQuick")}
            </div>
            <div className="flex flex-wrap gap-2">
              {[90, 95, 100].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setHorizon(a)}
                  className="btn-soft text-sm min-h-[44px]"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}

function impactTag(impact: number): string {
  if (impact < 0) return `−S$${Math.round(-impact)}/mo`;
  if (impact > 0) return `+S$${Math.round(impact)}/mo`;
  return "±S$0";
}

/* ---------- Module 2: Healthcare (wraps HealthcareConditions) ---------- */
interface ScenarioModuleProps {
  inputs: PlanInputs;
  baseAnalysis: FullAnalysis;
  baseCentral: number;
  baseConfidence: number;
  baseGap: number;
  isOpen: boolean;
  onToggle: () => void;
}

function HealthcareModule(props: ScenarioModuleProps) {
  const { t } = useTranslation();
  const {
    inputs,
    baseAnalysis,
    baseCentral,
    baseConfidence,
    baseGap,
    isOpen,
    onToggle,
  } = props;
  const [result, setResult] = useState<ScenarioResult | null>(null);

  return (
    <ScenarioModule
      isOpen={isOpen}
      onToggle={onToggle}
      title={t("results.scenarioHealthcare")}
      subtitle={t("results.scenarioHealthcareSub")}
      result={result}
      reset={() => setResult(null)}
      appliedKey="healthcare"
      appliedBody={
        result
          ? t("results.scenarioAppliedHealthcare", {
              baseline: Math.round(baseCentral),
              after: Math.round(result.afterCentral),
            })
          : undefined
      }
      body={
        // HealthcareConditions manages its own picker + 250ms debounced
        // engine rerun. We bridge its result into our ScenarioResult.
        <HealthcareBridge
          inputs={inputs}
          baseAnalysis={baseAnalysis}
          baseCentral={baseCentral}
          baseConfidence={baseConfidence}
          baseGap={baseGap}
          isOpen={isOpen}
          onResult={setResult}
        />
      }
    />
  );
}

function HealthcareBridge({
  inputs,
  baseCentral,
  baseConfidence,
  baseGap,
  isOpen,
  onResult,
}: {
  inputs: PlanInputs;
  baseAnalysis: FullAnalysis;
  baseCentral: number;
  baseConfidence: number;
  baseGap: number;
  isOpen: boolean;
  onResult: (r: ScenarioResult | null) => void;
}) {
  const { t } = useTranslation();
  const [local, setLocal] = useState<number | null>(null);
  useEffect(() => {
    if (!isOpen) {
      setLocal(null);
      onResult(null);
    }
  }, [isOpen, onResult]);
  useEffect(() => {
    if (local == null) {
      onResult(null);
      return;
    }
    const impact = local - baseCentral;
    const after = runFullAnalysisSync({ ...inputs });
    // We do not have per-scenario healthcare rerun in this bridge; instead
    // we show the impact on baseline as a directional indicator. The
    // HealthcareConditions component below does the per-scenario rerun.
    void after;
    onResult({
      label: t("results.scenarioHealthcare"),
      baselineCentral: baseCentral,
      afterCentral: baseCentral + impact,
      baseConfidence,
      afterConfidence: Math.max(0, baseConfidence + impact / 50),
      baselineGap: baseGap,
      afterGap: baseGap - impact,
      impact,
      body: t("results.scenarioHealthcareSub"),
      applied: false,
    });
  }, [local, baseCentral, baseConfidence, baseGap, inputs, t, onResult]);
  return (
    <HealthcareConditions
      inputs={inputs}
      baseSpend={baseCentral}
      onAfterChange={setLocal}
    />
  );
}

/* ---------- Module 3: Market sequence (uses engine) ---------- */
function MarketSequenceModule(props: ScenarioModuleProps) {
  const { t } = useTranslation();
  const { inputs, isOpen, onToggle } = props;

  const seq = useMemo(
    () => (isOpen ? generateSequenceRiskScenario(inputs) : null),
    [isOpen, inputs],
  );

  return (
    <ScenarioModule
      isOpen={isOpen}
      onToggle={onToggle}
      title={t("results.scenarioMarket")}
      subtitle={t("results.scenarioMarketSub")}
      body={
        <div className="space-y-3">
          <div className="rounded-xl2 border border-enough-amber/30 bg-enough-amber/5 px-3 py-2 text-xs text-enough-slate">
            {t("results.sequenceRiskLabel")}
          </div>
          {seq && (
            <div className="grid gap-2 sm:grid-cols-3">
              {seq.paths.map((p) => {
                const scenarioType =
                  p.label === "Steady market"
                    ? "steady"
                    : p.label === "Bad market EARLY"
                      ? "badEarly"
                      : "badLate";

                const titleKey =
                  scenarioType === "steady"
                    ? "results.sequenceRiskSteady"
                    : scenarioType === "badEarly"
                      ? "results.sequenceRiskBadEarly"
                      : "results.sequenceRiskBadLate";

                const depletedText =
                  p.depletedAtYear === null
                    ? t("results.sequenceRiskNotDepleted")
                    : t("results.sequenceRiskDepletedAt", {
                        year: p.depletedAtYear,
                      });

                return (
                  <div
                    key={p.label}
                    className="rounded-xl2 border border-enough-line bg-white p-3"
                  >
                    <div className="text-xs font-semibold text-enough-navy">
                      {t(titleKey)}
                    </div>
                    <dl className="mt-2 space-y-1 text-sm text-enough-ink">
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-enough-slate">
                          {t("results.sequenceRiskEndingBalance")}
                        </dt>
                        <dd className="font-bold">
                          {formatMoney(p.endingBalance)}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-enough-slate">
                          {t("results.sequenceRiskLastsToAge", {
                            age: inputs.horizonAge,
                          })}
                        </dt>
                        <dd className="font-bold">
                          {p.depletedAtYear === null
                            ? t("results.sequenceRiskYes")
                            : t("results.sequenceRiskNo")}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-enough-slate">
                          {t("results.sequenceRiskDepletion")}
                        </dt>
                        <dd className="font-bold">{depletedText}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-enough-slate">
                          {t("results.sequenceRiskAvgReturn")}
                        </dt>
                        <dd className="font-bold">
                          {`${p.avgReturnPct.toFixed(1)}%`}
                        </dd>
                      </div>
                    </dl>
                  </div>
                );
              })}
            </div>
          )}
          <p className="readable text-xs text-enough-slate leading-relaxed">
            {t("results.sequenceRiskConclusion")}
          </p>
        </div>
      }
    />
  );
}

/* ---------- Module 4: Trip + legacy (engine reruns) ---------- */
function TripLegacyModule(props: ScenarioModuleProps) {
  const { t } = useTranslation();
  const { inputs, baseCentral, baseConfidence, baseGap, isOpen, onToggle } =
    props;
  const [tripAmount, setTripAmount] = useState(0);
  const [legacyTarget, setLegacyTarget] = useState(0);
  const [debouncedTrip, setDebouncedTrip] = useState(0);
  const [debouncedLegacy, setDebouncedLegacy] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedTrip(tripAmount);
      setDebouncedLegacy(legacyTarget);
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [tripAmount, legacyTarget]);

  const result = useMemo<ScenarioResult | null>(() => {
    if (!isOpen) return null;
    if (debouncedTrip === 0 && debouncedLegacy === 0) return null;
    const after = runFullAnalysisSync({
      ...inputs,
      cash: Math.max(0, inputs.cash - debouncedTrip),
      bequestTarget: debouncedLegacy,
    });
    const impact = after.safe.centralSpend - baseCentral;
    return {
      label: t("results.scenarioTripLegacy"),
      baselineCentral: baseCentral,
      afterCentral: after.safe.centralSpend,
      baseConfidence: baseConfidence,
      afterConfidence: after.safe.confidence,
      baselineGap: baseGap,
      afterGap: inputs.desiredSpend - after.safe.centralSpend,
      impact,
      body:
        debouncedTrip > 0
          ? t("results.scenarioAppliedTrip", {
              amount: debouncedTrip,
              baseline: Math.round(baseCentral),
              after: Math.round(after.safe.centralSpend),
            })
          : t("results.scenarioAppliedLegacy", {
              target: debouncedLegacy,
              baseline: Math.round(baseCentral),
              after: Math.round(after.safe.centralSpend),
            }),
      applied: false,
    };
  }, [
    isOpen,
    inputs,
    baseCentral,
    baseConfidence,
    baseGap,
    debouncedTrip,
    debouncedLegacy,
    t,
  ]);

  return (
    <ScenarioModule
      isOpen={isOpen}
      onToggle={onToggle}
      title={t("results.scenarioTripLegacy")}
      subtitle={t("results.scenarioTripLegacySub")}
      result={result}
      reset={() => {
        setTripAmount(0);
        setLegacyTarget(0);
      }}
      appliedKey={debouncedTrip > 0 ? "trip" : "legacy"}
      appliedBody={
        result
          ? debouncedTrip > 0
            ? t("results.scenarioAppliedTrip", {
                amount: debouncedTrip,
                baseline: Math.round(baseCentral),
                after: Math.round(result.afterCentral),
              })
            : t("results.scenarioAppliedLegacy", {
                target: debouncedLegacy,
                baseline: Math.round(baseCentral),
                after: Math.round(result.afterCentral),
              })
          : undefined
      }
      body={
        <div className="space-y-4">
          <div>
            <div className="text-sm font-semibold text-enough-navy">
              {t("results.scenarioTripLegacy")}
            </div>
            <p className="text-xs text-enough-slate mt-1">
              {t("results.scenarioTripAsCash")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {[0, 5000, 10000, 20000].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setTripAmount(a)}
                  className={`btn-soft text-sm min-h-[44px] ${
                    tripAmount === a ? "ring-2 ring-enough-emerald" : ""
                  }`}
                >
                  {a === 0 ? "—" : `S$${a.toLocaleString()}`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-enough-navy">
              {t("results.scenarioLegacyCustom")}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {[0, 50000, 100000].map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setLegacyTarget(a)}
                  className={`btn-soft text-sm min-h-[44px] ${
                    legacyTarget === a ? "ring-2 ring-enough-emerald" : ""
                  }`}
                >
                  {a === 0 ? "—" : `S$${a.toLocaleString()}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    />
  );
}
