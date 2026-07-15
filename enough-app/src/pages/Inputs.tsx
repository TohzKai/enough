import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "../store/planStore";
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

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <h3 className="text-base font-bold text-enough-navy mb-3">{title}</h3>
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
      <span className="text-sm text-enough-slate">{label}</span>
      <span className="font-bold text-enough-navy text-right">{value}</span>
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
          <span className="font-bold text-enough-navy">{acct.label}</span>
          {!acct.spendable && <Pill tone="navy">excluded</Pill>}
        </div>
        <div className="text-xs text-enough-slate mt-0.5">{acct.source}</div>
        {acct.note && (
          <div className="text-xs text-enough-slate mt-1 leading-snug">
            {acct.note}
          </div>
        )}
      </div>
      <div className="text-right shrink-0">
        <div className="font-extrabold text-enough-navy whitespace-nowrap">
          {formatMoney(acct.amount)}
          {acct.isMonthly && (
            <span className="text-xs font-medium text-enough-slate">
              /month
            </span>
          )}
        </div>
        <Pill tone={kindTone[acct.kind]}>{acct.kind.toUpperCase()}</Pill>
      </div>
    </div>
  );
}

/** Moat A — the consented Singpass/SGFinDex aggregation flow (prototype). */
function ConnectPanel() {
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
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-enough-navy">
                Connect your accounts with Singpass
              </h3>
              <Pill tone="emerald">recommended</Pill>
            </div>
            <p className="text-enough-slate mt-2 leading-relaxed">
              One consented pull via Singpass brings in your CPF, bank, SRS and
              investments through SGFinDex — no typing, always current. We never
              see your password, and we're product-neutral — advice, never a
              sales pitch.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Pill tone="navy">CPF Board</Pill>
              <Pill tone="emerald">Bank · SGFinDex</Pill>
              <Pill tone="emerald">Investments · SGFinDex</Pill>
              <Pill tone="amber">SRS</Pill>
              <Pill tone="navy">HDB · Myinfo</Pill>
            </div>
          </div>
          <button
            onClick={connect}
            className="btn-emerald text-base !px-6 !py-4"
          >
            Connect with Singpass
          </button>
        </div>
        <div className="mt-4 rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-2.5 text-xs text-enough-slate leading-relaxed">
          Prototype only — this simulates a consented Myinfo / SGFinDex pull.
          Full SGFinDex access requires licensed-FI status and is a post-licence
          step; at MVP this is Myinfo + manual entry. Never asks for your
          banking password.
        </div>
      </Card>
    );
  }

  if (phase === "pulling") {
    return (
      <Card>
        <h3 className="text-xl font-bold text-enough-navy">
          Connecting via Singpass…
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
              {s}
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
      <div className="flex items-center gap-2">
        <Pill tone="emerald">Connected</Pill>
        <h3 className="text-xl font-bold text-enough-navy">
          Your whole-wealth picture
        </h3>
      </div>
      <p className="text-enough-slate mt-1">
        Pulled via Singpass / SGFinDex. This is the single view no bank can be
        neutral about — and it's what the safe-spend number is built on.
      </p>

      <div className="mt-4 space-y-2.5">
        {connectedAccounts.map((a) => (
          <AccountRow key={a.label} acct={a} />
        ))}
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl2 bg-enough-emerald/10 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-enough-emeraldDark">
            Spendable wealth
          </div>
          <div className="text-2xl font-extrabold text-enough-navy mt-1">
            {formatMoney(spendableTotal)}
          </div>
          <div className="text-xs text-enough-slate mt-1">
            Cash + investments + SRS (property excluded)
          </div>
        </div>
        <div className="rounded-xl2 bg-enough-navy/5 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-enough-navy">
            Guaranteed floor
          </div>
          <div className="text-2xl font-extrabold text-enough-navy mt-1">
            {monthlyFloor ? formatMoneyMonth(monthlyFloor.amount) : "—"}
          </div>
          <div className="text-xs text-enough-slate mt-1">
            CPF LIFE — income you can't outlive
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/result")}
        className="btn-emerald w-full mt-4 text-base"
      >
        See my safer monthly spend →
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const totals = layerTotals(lifestyle);
  // Highlight a persona when the current buckets still match its suggestion exactly.
  const activePersona = LIFESTYLE_PERSONAS.find((p) =>
    LIFESTYLE_BUCKETS.every((b) => lifestyle[b.key] === p.lifestyle[b.key]),
  )?.key;
  const tiles: { label: string; value: number; cls: string }[] = [
    { label: "Essentials", value: totals.essential, cls: "text-enough-navy" },
    {
      label: "Flexible",
      value: totals.flexible,
      cls: "text-enough-emeraldDark",
    },
    {
      label: "Aspirational",
      value: totals.aspirational,
      cls: "text-enough-amber",
    },
    { label: "Total / month", value: totals.total, cls: "text-enough-navy" },
  ];
  const byLayer = (layer: LifestyleLayer) =>
    LIFESTYLE_BUCKETS.filter((b) => b.layer === layer);
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-enough-navy">
          5 · Lifestyle spending
        </h3>
        <span className="text-xs text-enough-slate">
          Pick a starting point, then adjust
        </span>
      </div>

      {/* Lifestyle chooser — suggests a full set of buckets in one click */}
      <div className="mb-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-enough-slate mb-2">
          Start from a lifestyle
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {LIFESTYLE_PERSONAS.map((p) => {
            const active = activePersona === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => onApplyPersona(p)}
                className={`text-left rounded-xl2 border px-3 py-2.5 transition-colors ${
                  active
                    ? "border-enough-emerald bg-enough-emerald/5 ring-1 ring-enough-emerald/40"
                    : "border-enough-line hover:bg-enough-navy/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-enough-navy text-sm">
                    {p.label}
                  </span>
                  <span className="text-sm font-extrabold text-enough-emeraldDark">
                    {formatMoneyMonth(personaTotal(p))}
                  </span>
                </div>
                <div className="text-xs text-enough-slate mt-0.5 leading-snug">
                  {p.blurb}
                </div>
              </button>
            );
          })}
        </div>
        <div className="text-xs text-enough-slate mt-2">
          Suggested budgets to start from — adjust them to fit your life.
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {tiles.map((t) => (
          <div
            key={t.label}
            className="rounded-xl2 border border-enough-line bg-enough-navy/5 px-3 py-2 text-center"
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-enough-slate">
              {t.label}
            </div>
            <div className={`text-sm font-extrabold ${t.cls}`}>
              {formatMoneyMonth(t.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[...byLayer("essential"), ...byLayer("flexible")].map((b) => (
          <MoneyField
            key={b.key}
            label={b.label}
            value={lifestyle[b.key]}
            onChange={(v) => onChange(b.key, v)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="mt-4 text-sm font-semibold text-enough-navy hover:text-enough-emeraldDark"
      >
        {showAdvanced
          ? "Hide aspirational buckets ▲"
          : "Show aspirational buckets (travel, hobbies, other) ▼"}
      </button>
      {showAdvanced && (
        <div className="grid gap-4 sm:grid-cols-2 mt-3">
          {byLayer("aspirational").map((b) => (
            <MoneyField
              key={b.key}
              label={b.label}
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
  const navigate = useNavigate();
  const { inputs, setField, setInputs, loadSample, run, status, progress } =
    usePlan();
  const [running, setRunning] = useState(false);
  const [showManual, setShowManual] = useState(false);

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

  const onHousingStatusChange = (status: HousingStatus) => {
    const defaultCost =
      status === "paid-off"
        ? 0
        : status === "mortgage"
          ? 1200
          : status === "renting"
            ? 1500
            : 800;
    // Housing cost lives in the lifestyle "housing" bucket; sync derives monthlyHousingCost.
    const lifestyle = { ...inputs.lifestyle, housing: defaultCost };
    setInputs({
      ...inputs,
      housingStatus: status,
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

  const activePreset =
    PRESETS.find(
      (p) =>
        inputs.equityPct === p.apply.equityPct &&
        inputs.equityReturn === p.apply.equityReturn,
    )?.label ?? "Custom";

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker="Connect"
        title="Bring your accounts together"
        subtitle="Connect once with Singpass for a whole-wealth view — or type the key numbers in yourself."
      />

      {/* Moat A — consented aggregation is the primary path */}
      <ConnectPanel />

      {/* Manual fallback */}
      <button
        type="button"
        onClick={() => setShowManual((s) => !s)}
        className="text-sm font-semibold text-enough-navy hover:text-enough-emeraldDark"
      >
        {showManual
          ? "Hide manual entry ▲"
          : "Prefer to type it in yourself? ▼"}
      </button>

      {showManual && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={loadSample} className="btn-soft">
              Load sample profile
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
            {/* ---- Form ---- */}
            <div className="space-y-5">
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-bold text-enough-navy">
                    Assumption preset
                  </div>
                  <span className="text-xs text-enough-slate">
                    Selected: {activePreset}
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
                        onClick={() =>
                          setInputs(withPreset(inputs, p.key as PresetKey))
                        }
                        className={`text-left rounded-xl2 border px-3 py-2 transition-colors ${
                          active
                            ? "border-enough-navy bg-enough-navy/5"
                            : "border-enough-line hover:bg-enough-navy/5"
                        }`}
                      >
                        <div className="font-bold text-enough-navy text-sm">
                          {p.label}
                        </div>
                        <div className="text-xs text-enough-slate">
                          {p.apply.equityPct}% eq
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <Group title="1 · Retiree profile">
                <NumberField
                  label="Current age"
                  value={inputs.age}
                  onChange={(v) => setField("age", v)}
                  suffix="yrs"
                />
                <Slider
                  label="Plan to age"
                  value={inputs.horizonAge}
                  min={85}
                  max={105}
                  step={1}
                  onChange={(v) => setField("horizonAge", v)}
                  format={(v) => `${v} yrs`}
                  help="Longer life usually lowers the safer monthly spend."
                />
                <SelectField<Gender>
                  label="Gender"
                  value={inputs.gender}
                  onChange={(v) => setField("gender", v)}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female (+2 yrs longevity)" },
                  ]}
                />
                <NumberField
                  label="Spouse age (optional)"
                  value={inputs.spouseAge}
                  onChange={(v) => setField("spouseAge", v)}
                  suffix="yrs"
                  help="Joint planning if included."
                />
              </Group>

              <Group title="2 · CPF LIFE">
                <MoneyField
                  label="Monthly CPF LIFE payout"
                  value={inputs.cpfLifeMonthly}
                  onChange={(v) => setField("cpfLifeMonthly", v)}
                />
                <SelectField<CpfPlan>
                  label="CPF LIFE plan"
                  value={inputs.cpfPlan}
                  onChange={onPlanChange}
                  options={[
                    { value: "Standard", label: "Standard (level nominal)" },
                    { value: "Basic", label: "Basic (level nominal)" },
                    {
                      value: "Escalating",
                      label: "Escalating (starts lower, +2%/yr)",
                    },
                  ]}
                  help="A longevity floor, not an inflation hedge."
                />
              </Group>

              <Group title="3 · Housing">
                <SelectField<HousingStatus>
                  label="Housing status"
                  value={inputs.housingStatus}
                  onChange={onHousingStatusChange}
                  options={[
                    { value: "paid-off", label: "Paid off" },
                    { value: "mortgage", label: "Still paying mortgage" },
                    { value: "renting", label: "Renting" },
                    { value: "other", label: "Other" },
                  ]}
                  help="Housing cost is included in spending. Paid off means S$0 monthly cost."
                />
                <MoneyField
                  label="Monthly housing cost"
                  value={inputs.lifestyle.housing}
                  onChange={(v) => onLifestyleChange("housing", v)}
                  help="Mortgage, rent, or other — 0 if paid off."
                />
              </Group>

              <Group title="4 · Cash and investments">
                <MoneyField
                  label="Cash"
                  value={inputs.cash}
                  onChange={(v) => setField("cash", v)}
                />
                <MoneyField
                  label="Investments"
                  value={inputs.investments}
                  onChange={(v) => setField("investments", v)}
                />
                <MoneyField
                  label="SRS"
                  value={inputs.srs}
                  onChange={(v) => setField("srs", v)}
                />
                <div className="sm:col-span-2 grid grid-cols-3 gap-3">
                  <NumberField
                    label="Cash %"
                    value={inputs.cashPct}
                    onChange={(v) => setField("cashPct", v)}
                    suffix="%"
                  />
                  <NumberField
                    label="Bonds %"
                    value={inputs.bondPct}
                    onChange={(v) => setField("bondPct", v)}
                    suffix="%"
                  />
                  <NumberField
                    label="Equity %"
                    value={inputs.equityPct}
                    onChange={(v) => setField("equityPct", v)}
                    suffix="%"
                  />
                </div>
                {!allocOk && (
                  <div className="sm:col-span-2 text-sm font-semibold text-enough-amber">
                    Asset mix should add to 100% (currently{" "}
                    {allocTotal.toFixed(0)}%).
                  </div>
                )}
              </Group>

              <LifestyleSection
                lifestyle={inputs.lifestyle}
                onChange={onLifestyleChange}
                onApplyPersona={applyPersona}
              />

              <Group title="6 · Bequest (optional)">
                <MoneyField
                  label="Bequest target"
                  value={inputs.bequestTarget}
                  onChange={(v) => setField("bequestTarget", v)}
                  help="Minimum to leave at the horizon."
                />
              </Group>

              <Group title="7 · Assumptions">
                <NumberField
                  label="General / lifestyle inflation"
                  value={inputs.generalInflation}
                  onChange={(v) => setField("generalInflation", v)}
                  suffix="%"
                  step={0.1}
                />
                <NumberField
                  label="Healthcare inflation"
                  value={inputs.healthcareInflation}
                  onChange={(v) => setField("healthcareInflation", v)}
                  suffix="%"
                  step={0.5}
                  help="Healthcare costs usually rise faster than general inflation."
                />
              </Group>
            </div>

            {/* ---- Summary card ---- */}
            <div className="lg:sticky lg:top-24">
              <Card className="shadow-pop">
                <div className="text-xs font-bold uppercase tracking-wider text-enough-emerald mb-3">
                  Plan summary
                </div>
                <div className="space-y-2.5">
                  <SummaryRow
                    label="Total assets"
                    value={formatMoney(totalAssets)}
                  />
                  <SummaryRow
                    label="CPF LIFE payout"
                    value={formatMoneyMonth(inputs.cpfLifeMonthly)}
                  />
                  <SummaryRow
                    label="Desired spend"
                    value={formatMoneyMonth(inputs.desiredSpend)}
                  />
                  <SummaryRow
                    label="Housing cost"
                    value={formatMoneyMonth(inputs.monthlyHousingCost)}
                  />
                  <SummaryRow
                    label="Cash/Bonds/Equity"
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
                        Running simulation…
                      </div>
                      <div className="mt-2">
                        <ProgressBar value={progress} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={calculate}
                      disabled={!allocOk}
                      className="btn-emerald w-full text-base"
                    >
                      Calculate safer spend
                    </button>
                  )}
                  {!allocOk && (
                    <div className="mt-2 text-xs font-semibold text-enough-amber">
                      Asset mix should add to 100%.
                    </div>
                  )}
                </div>
                <p className="mt-3 text-xs text-enough-slate">
                  Planning advice — estimates, not guarantees.
                </p>
              </Card>
            </div>
          </div>
        </>
      )}

      <Disclaimer tone="soft">
        Neutral financial planning advice — the decisions are yours to weigh. We
        advise the move, never push a specific product. The Singpass / SGFinDex
        connection is an illustrative prototype.
      </Disclaimer>
    </div>
  );
}
