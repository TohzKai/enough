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
} from "../components/ui";
import { formatMoney, formatMoneyMonth } from "../lib/format";
import { PRESETS, withPreset, type PresetKey } from "../data/presets";
import type { CpfPlan, Gender, HousingStatus } from "../types";

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

export function Inputs() {
  const navigate = useNavigate();
  const { inputs, setField, setInputs, loadSample, run, status, progress } =
    usePlan();
  const [running, setRunning] = useState(false);

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

  // Which preset is currently active? (for the "Selected:" label)
  const activePreset =
    PRESETS.find(
      (p) =>
        inputs.equityPct === p.apply.equityPct &&
        inputs.equityReturn === p.apply.equityReturn,
    )?.label ?? "Custom";

  return (
    <div className="space-y-5">
      <SectionTitle
        kicker="Build Plan"
        title="Build your retirement spending plan"
        subtitle="Enter a few key numbers. Enough estimates a safer monthly spend range."
      />

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={loadSample} className="btn-soft">
          Load sample profile
        </button>
      </div>

      {/* Two-column: form + sticky summary (desktop) */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-5 items-start">
        {/* ---- Form ---- */}
        <div className="space-y-5">
          {/* Assumption preset (compact) */}
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

          {/* 1. Retiree profile */}
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

          {/* 2. CPF LIFE */}
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

          {/* 3. Housing */}
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

          {/* 4. Cash and investments */}
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
                Asset mix should add to 100% (currently {allocTotal.toFixed(0)}
                %).
              </div>
            )}
          </Group>

          {/* 5. Spending */}
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

          {/* 6. Family needs */}
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

        {/* ---- Summary card (sticky desktop, stacks mobile) ---- */}
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
                      allocOk ? "text-enough-emeraldDark" : "text-enough-amber"
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

      <Disclaimer tone="soft">
        Educational simulator only — not financial advice, no product
        recommendations.
      </Disclaimer>
    </div>
  );
}
