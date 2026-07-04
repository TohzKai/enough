import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlan } from "../store/planStore";
import {
  Card,
  SectionTitle,
  NumberField,
  MoneyField,
  SelectField,
  Disclaimer,
  ProgressBar,
  Pill,
} from "../components/ui";
import { formatMoney, formatMoneyMonth } from "../lib/format";
import { PRESETS, withPreset, type PresetKey } from "../data/presets";
import type { CpfPlan, Gender, HousingStatus } from "../types";
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
            <span className="text-xs font-medium text-enough-slate">/mo</span>
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
              see your password, and we sell nothing.
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
    setInputs({
      ...inputs,
      housingStatus: status,
      monthlyHousingCost: defaultCost,
    });
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
                <NumberField
                  label="Plan to age"
                  value={inputs.horizonAge}
                  onChange={(v) => setField("horizonAge", v)}
                  suffix="yrs"
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
                  value={inputs.monthlyHousingCost}
                  onChange={(v) => setField("monthlyHousingCost", v)}
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

              <Group title="5 · Spending">
                <MoneyField
                  label="Desired monthly spend"
                  value={inputs.desiredSpend}
                  onChange={(v) => setField("desiredSpend", v)}
                />
                <MoneyField
                  label="Essential spend"
                  value={inputs.essentialSpend}
                  onChange={(v) => setField("essentialSpend", v)}
                />
                <MoneyField
                  label="Healthcare spend"
                  value={inputs.healthcareSpend}
                  onChange={(v) => setField("healthcareSpend", v)}
                />
                <MoneyField
                  label="Discretionary spend"
                  value={inputs.discretionarySpend}
                  onChange={(v) => setField("discretionarySpend", v)}
                />
              </Group>

              <Group title="6 · Family needs">
                <MoneyField
                  label="Family support"
                  value={inputs.familySupport}
                  onChange={(v) => setField("familySupport", v)}
                />
                <MoneyField
                  label="Bequest target"
                  value={inputs.bequestTarget}
                  onChange={(v) => setField("bequestTarget", v)}
                  help="Minimum to leave at the horizon."
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
                  Educational simulator — estimates, not guarantees.
                </p>
              </Card>
            </div>
          </div>
        </>
      )}

      <Disclaimer tone="soft">
        Educational decision-support only — not financial advice, no product
        recommendations. The Singpass / SGFinDex connection is an illustrative
        prototype.
      </Disclaimer>
    </div>
  );
}
