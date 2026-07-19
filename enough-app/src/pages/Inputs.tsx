import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePlan } from "../store/planStore";
import { useViewMode } from "../store/viewMode";
import {
  Card,
  SectionTitle,
  NumberField,
  MoneyField,
  SelectField,
  Slider,
  Disclaimer,
  ProgressBar,
  Pill,
} from "../components/ui";
import { formatMoney, formatMoneyMonth } from "../lib/format";
import { PRESETS, withPreset, type PresetKey } from "../data/presets";
import type {
  CpfPlan,
  Gender,
  HousingStatus,
  LifestyleBucketKey,
  LifestyleLayer,
  PlanInputs,
} from "../types";
import {
  LIFESTYLE_BUCKETS,
  layerTotals,
  syncLifestyleToSpend,
} from "../data/lifestyle";
import {
  LIFESTYLE_PERSONAS,
  personaTotal,
  type LifestylePersona,
} from "../data/lifestylePersonas";
import {
  connectedAccounts,
  singpassPullSteps,
  spendableTotal,
  type ConnectedAccount,
} from "../data/aggregation";

const kindLabelKey: Record<ConnectedAccount["kind"], string> = {
  cpf: "connect.kindCpf",
  bank: "connect.kindBank",
  investment: "connect.kindInvestment",
  srs: "connect.kindSrs",
  property: "connect.kindProperty",
};

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-3 safe-break">
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-enough-slate safe-break">{label}</span>
      <span className="font-bold text-enough-navy text-right whitespace-nowrap">
        {value}
      </span>
    </div>
  );
}

const kindTone: Record<ConnectedAccount["kind"], "navy" | "emerald" | "amber"> =
  {
    cpf: "navy",
    bank: "emerald",
    investment: "emerald",
    srs: "amber",
    property: "navy",
  };

function AccountRow({ acct }: { acct: ConnectedAccount }) {
  const { t } = useTranslation();
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl2 border p-3 ${
        acct.spendable
          ? "border-enough-line bg-white"
          : "border-enough-line bg-enough-navy/5"
      }`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-enough-navy safe-break">
            {t(acct.label)}
          </span>
          {!acct.spendable && <Pill tone="navy">{t("common.excluded")}</Pill>}
        </div>
        <div className="text-xs text-enough-slate mt-0.5">{t(acct.source)}</div>
        {acct.note && (
          <div className="text-xs text-enough-slate mt-1 leading-snug safe-break">
            {t(acct.note)}
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="font-extrabold text-enough-navy whitespace-nowrap">
          {formatMoney(acct.amount)}
          {acct.isMonthly && (
            <span className="text-xs font-medium text-enough-slate">
              {t("common.perMonth")}
            </span>
          )}
        </div>
        <Pill tone={kindTone[acct.kind]}>{t(kindLabelKey[acct.kind])}</Pill>
      </div>
    </div>
  );
}

/** Moat A — the consented Singpass/SGFinDex aggregation flow (prototype). */
function ConnectPanel() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loadSample } = usePlan();
  const [phase, setPhase] = useState<"idle" | "pulling" | "connected">("idle");
  const [step, setStep] = useState(0);

  const connect = () => {
    setPhase("pulling");
    setStep(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      if (i >= singpassPullSteps.length) {
        clearInterval(timer);
        // In this prototype, connecting loads the worked-example household.
        loadSample();
        setPhase("connected");
      } else {
        setStep(i);
      }
    }, 650);
  };

  if (phase === "idle") {
    return (
      <Card>
        <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-enough-navy safe-break">
                {t("connect.connectTitle")}
              </h3>
              <Pill tone="emerald">{t("common.recommended")}</Pill>
            </div>
            <p className="readable text-enough-slate mt-2 leading-relaxed">
              {t("connect.connectBody")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Pill tone="navy">{t("connect.chipCpfBoard")}</Pill>
              <Pill tone="emerald">{t("connect.chipBank")}</Pill>
              <Pill tone="emerald">{t("connect.chipInvestments")}</Pill>
              <Pill tone="amber">{t("connect.chipSrs")}</Pill>
              <Pill tone="navy">{t("connect.chipHdb")}</Pill>
            </div>
          </div>
          <button
            onClick={connect}
            className="btn-emerald text-base !px-6 !py-4 min-h-[52px]"
          >
            {t("connect.connectButton")}
          </button>
        </div>
        <div className="readable mt-4 rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-2.5 text-xs text-enough-slate leading-relaxed">
          {t("connect.protoNote")}
        </div>
      </Card>
    );
  }

  if (phase === "pulling") {
    return (
      <Card>
        <h3 className="text-xl font-bold text-enough-navy">
          {t("connect.connectingTitle")}
        </h3>
        <div className="mt-4 space-y-2">
          {singpassPullSteps.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 text-sm ${
                i <= step ? "text-enough-ink" : "text-enough-slate/50"
              }`}
            >
              <span
                className={`h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center text-[11px] font-bold ${
                  i < step
                    ? "bg-enough-emerald border-enough-emerald text-white"
                    : i === step
                      ? "border-enough-emerald text-enough-emerald animate-pulse"
                      : "border-enough-line text-transparent"
                }`}
              >
                {i < step ? "✓" : ""}
              </span>
              {t(s)}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <ProgressBar value={(step + 1) / singpassPullSteps.length} />
        </div>
      </Card>
    );
  }

  // connected
  const monthlyFloor = connectedAccounts.find((a) => a.isMonthly);
  return (
    <Card>
      <div className="flex items-center gap-2 flex-wrap">
        <Pill tone="emerald">{t("common.connected")}</Pill>
        <h3 className="text-xl font-bold text-enough-navy safe-break">
          {t("connect.connectedTitle")}
        </h3>
      </div>
      <p className="readable text-enough-slate mt-1">
        {t("connect.connectedBody")}
      </p>

      <div className="mt-4 space-y-2.5">
        {connectedAccounts.map((a) => (
          <AccountRow key={a.label} acct={a} />
        ))}
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl2 bg-enough-emerald/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-enough-emeraldDark">
            {t("connect.spendableWealth")}
          </div>
          <div className="text-2xl font-extrabold text-enough-navy mt-1">
            {formatMoney(spendableTotal)}
          </div>
          <div className="text-xs text-enough-slate mt-1">
            {t("connect.spendableWealthNote")}
          </div>
        </div>
        <div className="rounded-xl2 bg-enough-navy/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-enough-navy">
            {t("connect.guaranteedFloor")}
          </div>
          <div className="text-2xl font-extrabold text-enough-navy mt-1">
            {monthlyFloor ? formatMoneyMonth(monthlyFloor.amount) : "—"}
          </div>
          <div className="text-xs text-enough-slate mt-1">
            {t("connect.guaranteedFloorNote")}
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/result")}
        className="btn-emerald w-full mt-4 text-base min-h-[52px]"
      >
        {t("common.seeMySaferSpend")}
      </button>
    </Card>
  );
}

/** Lifestyle spending — nine buckets grouped into three layers, with a compact summary. */
function LifestyleSection({
  lifestyle,
  onChange,
  onApplyPersona,
}: {
  lifestyle: PlanInputs["lifestyle"];
  onChange: (key: LifestyleBucketKey, amount: number) => void;
  onApplyPersona: (p: LifestylePersona) => void;
}) {
  const { t } = useTranslation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const totals = layerTotals(lifestyle);
  // Highlight a persona when the current buckets still match its suggestion exactly.
  const activePersona = LIFESTYLE_PERSONAS.find((p) =>
    LIFESTYLE_BUCKETS.every((b) => lifestyle[b.key] === p.lifestyle[b.key]),
  )?.key;
  const tiles: { label: string; value: number; cls: string }[] = [
    {
      label: t("lifestyle.layerEssentials"),
      value: totals.essential,
      cls: "text-enough-navy",
    },
    {
      label: t("lifestyle.layerFlexible"),
      value: totals.flexible,
      cls: "text-enough-emeraldDark",
    },
    {
      label: t("lifestyle.layerAspirational"),
      value: totals.aspirational,
      cls: "text-enough-amber",
    },
    {
      label: t("lifestyle.layerTotal"),
      value: totals.total,
      cls: "text-enough-navy",
    },
  ];
  const byLayer = (layer: LifestyleLayer) =>
    LIFESTYLE_BUCKETS.filter((b) => b.layer === layer);
  return (
    <Card>
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h3 className="text-base font-bold text-enough-navy">
          {t("connect.group5")}
        </h3>
        <span className="text-xs text-enough-slate">
          {t("connect.lifestylePickHint")}
        </span>
      </div>

      {/* Lifestyle chooser — suggests a full set of buckets in one click */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-enough-slate mb-2">
          {t("connect.startFromLifestyle")}
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {LIFESTYLE_PERSONAS.map((p) => {
            const active = activePersona === p.key;
            return (
              <button
                key={p.key}
                type="button"
                aria-pressed={active}
                onClick={() => onApplyPersona(p)}
                className={`min-h-[44px] text-left rounded-xl2 border px-3 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 ${
                  active
                    ? "border-enough-emerald bg-enough-emerald/5 ring-1 ring-enough-emerald/40"
                    : "border-enough-line hover:bg-enough-navy/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-enough-navy text-sm safe-break">
                    {t(p.label)}
                  </span>
                  <span className="text-sm font-extrabold text-enough-emeraldDark whitespace-nowrap">
                    {formatMoneyMonth(personaTotal(p))}
                  </span>
                </div>
                <div className="text-xs text-enough-slate mt-0.5 leading-snug safe-break">
                  {t(p.blurb)}
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-xs text-enough-slate mt-2">
          {t("connect.lifestyleNote")}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-3 py-2 text-center"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-enough-slate safe-break">
              {tile.label}
            </div>
            <div className={`text-sm font-extrabold ${tile.cls}`}>
              {formatMoneyMonth(tile.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[...byLayer("essential"), ...byLayer("flexible")].map((b) => (
          <MoneyField
            key={b.key}
            label={t(b.label)}
            value={lifestyle[b.key]}
            onChange={(v) => onChange(b.key, v)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        aria-expanded={showAdvanced}
        className="mt-4 text-sm font-semibold text-enough-navy hover:text-enough-emeraldDark min-h-[44px]"
      >
        {showAdvanced
          ? t("connect.hideAspirational")
          : t("connect.showAspirational")}
      </button>
      {showAdvanced && (
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          {byLayer("aspirational").map((b) => (
            <MoneyField
              key={b.key}
              label={t(b.label)}
              value={lifestyle[b.key]}
              onChange={(v) => onChange(b.key, v)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export function Inputs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { inputs, setField, setInputs, loadSample, run, status, progress } =
    usePlan();
  const { mode } = useViewMode();
  const [running, setRunning] = useState(false);
  const [showManual, setShowManual] = useState(false);

  // Route guard: the adult-child view is read-only and must never reach
  // Connect. The Connect page lets the user edit financial inputs, change
  // spending assumptions and (in the prototype) load the worked-example
  // household — none of which the adult child is permitted to do.
  if (mode === "child") {
    return <Navigate to="/result" replace />;
  }

  const totalAssets = inputs.cash + inputs.investments + inputs.srs;
  const allocTotal = inputs.cashPct + inputs.bondPct + inputs.equityPct;
  const allocOk = Math.abs(allocTotal - 100) < 0.5;

  const onPlanChange = (plan: CpfPlan) => {
    setInputs({
      ...inputs,
      cpfPlan: plan,
      payoutGrowthAnnual: plan === "Escalating" ? 2 : 0,
    });
  };

  const onHousingStatusChange = (hs: HousingStatus) => {
    const defaultCost =
      hs === "paid-off"
        ? 0
        : hs === "mortgage"
          ? 1200
          : hs === "renting"
            ? 1500
            : 800;
    // Housing cost lives in the lifestyle "housing" bucket; sync derives monthlyHousingCost.
    const lifestyle = { ...inputs.lifestyle, housing: defaultCost };
    setInputs({
      ...inputs,
      housingStatus: hs,
      lifestyle,
      ...syncLifestyleToSpend(lifestyle),
    });
  };

  // Any lifestyle bucket edit re-derives the engine spending fields + desiredSpend.
  const onLifestyleChange = (key: LifestyleBucketKey, amount: number) => {
    const lifestyle = { ...inputs.lifestyle, [key]: amount };
    setInputs({ ...inputs, lifestyle, ...syncLifestyleToSpend(lifestyle) });
  };

  // Apply a lifestyle persona's suggested buckets in one click, but keep the
  // user's own housing cost (that is driven by housing status, not lifestyle).
  const applyPersona = (p: LifestylePersona) => {
    const lifestyle = { ...p.lifestyle, housing: inputs.lifestyle.housing };
    setInputs({ ...inputs, lifestyle, ...syncLifestyleToSpend(lifestyle) });
  };

  const calculate = async () => {
    if (!allocOk) return; // allocation must total 100%
    setRunning(true);
    await run();
    setRunning(false);
    navigate("/result");
  };

  const activePresetKey =
    PRESETS.find(
      (p) =>
        inputs.equityPct === p.apply.equityPct &&
        inputs.equityReturn === p.apply.equityReturn,
    )?.label ?? "presets.custom";

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker={t("connect.kicker")}
        title={t("connect.title")}
        subtitle={t("connect.subtitle")}
      />

      {/* Prototype privacy notice: data is sample-only. */}
      <div className="rounded-xl2 border border-enough-amber/30 bg-enough-amberSoft px-4 py-3 text-sm text-enough-ink leading-relaxed safe-break">
        <strong className="text-enough-amber">
          {t("connect.privacyTitle")}.
        </strong>{" "}
        {t("connect.privacyBody")}
      </div>

      {/* Moat A — consented aggregation is the primary path */}
      <ConnectPanel />

      {/* Manual fallback */}
      <button
        type="button"
        onClick={() => setShowManual((s) => !s)}
        aria-expanded={showManual}
        className="text-sm font-semibold text-enough-navy hover:text-enough-emeraldDark min-h-[44px]"
      >
        {showManual ? t("connect.manualToggleHide") : t("connect.manualToggle")}
      </button>

      {showManual && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={loadSample} className="btn-soft min-h-[44px]">
              {t("connect.loadSample")}
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
            {/* ---- Form ---- */}
            <div className="space-y-5">
              <Card>
                <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                  <div className="text-sm font-bold text-enough-navy">
                    {t("connect.presetHeading")}
                  </div>
                  <span className="text-xs text-enough-slate">
                    {t("common.selected", { value: t(activePresetKey) })}
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  {PRESETS.map((p) => {
                    const active =
                      inputs.equityPct === p.apply.equityPct &&
                      inputs.equityReturn === p.apply.equityReturn;
                    return (
                      <button
                        key={p.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setInputs(withPreset(inputs, p.key as PresetKey))
                        }
                        className={`min-h-[44px] text-left rounded-xl2 border px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 ${
                          active
                            ? "border-enough-navy bg-enough-navy/5"
                            : "border-enough-line hover:bg-enough-navy/5"
                        }`}
                      >
                        <div className="font-bold text-enough-navy text-sm">
                          {t(p.label)}
                        </div>
                        <div className="text-xs text-enough-slate">
                          {p.apply.equityPct}% {t("common.eq")}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Group title={t("connect.group1")}>
                <NumberField
                  label={t("connect.fCurrentAge")}
                  value={inputs.age}
                  onChange={(v) => setField("age", v)}
                  suffix={t("common.yrs")}
                />
                <Slider
                  label={t("connect.fPlanToAge")}
                  value={inputs.horizonAge}
                  min={85}
                  max={105}
                  step={1}
                  onChange={(v) => setField("horizonAge", v)}
                  format={(v) => t("format.years", { n: v })}
                  help={t("connect.fPlanToAgeHelp")}
                />
                <SelectField<Gender>
                  label={t("connect.fGender")}
                  value={inputs.gender}
                  onChange={(v) => setField("gender", v)}
                  options={[
                    { value: "male", label: t("connect.fGenderMale") },
                    { value: "female", label: t("connect.fGenderFemale") },
                  ]}
                />
                <NumberField
                  label={t("connect.fSpouseAge")}
                  value={inputs.spouseAge}
                  onChange={(v) => setField("spouseAge", v)}
                  suffix={t("common.yrs")}
                  help={t("connect.fSpouseAgeHelp")}
                />
              </Group>

              <Group title={t("connect.group2")}>
                <MoneyField
                  label={t("connect.fCpfPayout")}
                  value={inputs.cpfLifeMonthly}
                  onChange={(v) => setField("cpfLifeMonthly", v)}
                />
                <SelectField<CpfPlan>
                  label={t("connect.fCpfPlan")}
                  value={inputs.cpfPlan}
                  onChange={onPlanChange}
                  options={[
                    { value: "Standard", label: t("presets.cpfStandard") },
                    { value: "Basic", label: t("presets.cpfBasic") },
                    {
                      value: "Escalating",
                      label: t("presets.cpfEscalating"),
                    },
                  ]}
                  help={t("connect.fCpfPlanHelp")}
                />
              </Group>

              <Group title={t("connect.group3")}>
                <SelectField<HousingStatus>
                  label={t("connect.fHousingStatus")}
                  value={inputs.housingStatus}
                  onChange={onHousingStatusChange}
                  options={[
                    { value: "paid-off", label: t("presets.housingPaidOff") },
                    { value: "mortgage", label: t("presets.housingMortgage") },
                    { value: "renting", label: t("presets.housingRenting") },
                    { value: "other", label: t("presets.housingOther") },
                  ]}
                  help={t("connect.fHousingStatusHelp")}
                />
                <MoneyField
                  label={t("connect.fMonthlyHousing")}
                  value={inputs.lifestyle.housing}
                  onChange={(v) => onLifestyleChange("housing", v)}
                  help={t("connect.fMonthlyHousingHelp")}
                />
              </Group>

              <Group title={t("connect.group4")}>
                <MoneyField
                  label={t("connect.fCash")}
                  value={inputs.cash}
                  onChange={(v) => setField("cash", v)}
                />
                <MoneyField
                  label={t("connect.fInvestments")}
                  value={inputs.investments}
                  onChange={(v) => setField("investments", v)}
                />
                <MoneyField
                  label={t("connect.fSrs")}
                  value={inputs.srs}
                  onChange={(v) => setField("srs", v)}
                />
                <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                  <NumberField
                    label={t("connect.fCashPct")}
                    value={inputs.cashPct}
                    onChange={(v) => setField("cashPct", v)}
                    suffix="%"
                  />
                  <NumberField
                    label={t("connect.fBondsPct")}
                    value={inputs.bondPct}
                    onChange={(v) => setField("bondPct", v)}
                    suffix="%"
                  />
                  <NumberField
                    label={t("connect.fEquityPct")}
                    value={inputs.equityPct}
                    onChange={(v) => setField("equityPct", v)}
                    suffix="%"
                  />
                </div>
                {!allocOk && (
                  <div className="sm:col-span-2 text-sm font-semibold text-enough-amber">
                    {t("connect.allocWarning", {
                      value: allocTotal.toFixed(0),
                    })}
                  </div>
                )}
              </Group>

              <LifestyleSection
                lifestyle={inputs.lifestyle}
                onChange={onLifestyleChange}
                onApplyPersona={applyPersona}
              />

              <Group title={t("connect.group6")}>
                <MoneyField
                  label={t("connect.fBequestTarget")}
                  value={inputs.bequestTarget}
                  onChange={(v) => setField("bequestTarget", v)}
                  help={t("connect.fBequestTargetHelp")}
                />
              </Group>

              <Group title={t("connect.group7")}>
                <NumberField
                  label={t("connect.fGeneralInflation")}
                  value={inputs.generalInflation}
                  onChange={(v) => setField("generalInflation", v)}
                  suffix="%"
                  step={0.1}
                />
                <NumberField
                  label={t("connect.fHealthcareInflation")}
                  value={inputs.healthcareInflation}
                  onChange={(v) => setField("healthcareInflation", v)}
                  suffix="%"
                  step={0.5}
                  help={t("connect.fHealthcareInflationHelp")}
                />
              </Group>
            </div>

            {/* ---- Summary card ---- */}
            <div className="lg:sticky lg:top-24">
              <Card className="shadow-pop">
                <div className="text-xs font-bold uppercase tracking-wider text-enough-emerald mb-3">
                  {t("connect.summaryHeading")}
                </div>
                <div className="space-y-2.5">
                  <SummaryRow
                    label={t("connect.sumTotalAssets")}
                    value={formatMoney(totalAssets)}
                  />
                  <SummaryRow
                    label={t("connect.sumCpfPayout")}
                    value={formatMoneyMonth(inputs.cpfLifeMonthly)}
                  />
                  <SummaryRow
                    label={t("connect.sumDesiredSpend")}
                    value={formatMoneyMonth(inputs.desiredSpend)}
                  />
                  <SummaryRow
                    label={t("connect.sumHousingCost")}
                    value={formatMoneyMonth(inputs.monthlyHousingCost)}
                  />
                  <SummaryRow
                    label={t("connect.sumAlloc")}
                    value={
                      <span
                        className={
                          allocOk
                            ? "text-enough-emeraldDark"
                            : "text-enough-amber"
                        }
                      >
                        {inputs.cashPct}/{inputs.bondPct}/{inputs.equityPct}
                      </span>
                    }
                  />
                </div>

                <div className="mt-4">
                  {running || status === "computing" ? (
                    <div className="rounded-xl2 bg-enough-navy/5 p-3">
                      <div className="text-sm font-semibold text-enough-navy">
                        {t("connect.runningSim")}
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={progress} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={calculate}
                      disabled={!allocOk}
                      className="btn-emerald w-full text-base min-h-[52px]"
                    >
                      {t("connect.calculate")}
                    </button>
                  )}
                  {!allocOk && (
                    <div className="mt-2 text-xs font-semibold text-enough-amber">
                      {t("connect.allocWarning100")}
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-enough-slate">
                  {t("connect.planningAdviceNote")}
                </p>
              </Card>
            </div>
          </div>
        </>
      )}

      <Disclaimer tone="soft">{t("connect.disclaimer")}</Disclaimer>
    </div>
  );
}
