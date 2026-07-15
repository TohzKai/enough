import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, StatCard, Pill, Spinner } from "./ui";
import { formatMoney, formatMoneyMonth, formatDeltaMonth } from "../lib/format";
import { recompute, saferSpendOf, zoneForImpact } from "../lib/stress";
import {
  CONDITIONS,
  costOf,
  CARESHIELD_MONTHLY,
  SOURCES,
  type CareOption,
} from "../data/conditions";
import type { PlanInputs } from "../types";
import type { StressZone } from "../data/stressScenarios";

/**
 * HealthcareConditions — app-review item 4, engine-wired.
 *
 * Pick a condition (stroke / dementia / cancer / frailty) and a care setting
 * (helper / day-care / nursing home). The component shows the three-part cost
 * stack net of the Singapore schemes, then re-runs the real engine with the net
 * cost added to see how the safer monthly spend moves.
 *
 * Scheme parameters + care fees are cited (2025–26); acute episode costs and the
 * means-tested subsidy rate are illustrative. See SOURCES in data/conditions.ts.
 */

const zoneTone: Record<StressZone, "emerald" | "amber" | "red"> = {
  green: "emerald",
  amber: "amber",
  red: "red",
};
const zoneLabel: Record<StressZone, string> = {
  green: "Green zone — manageable",
  amber: "Amber zone — plan for it",
  red: "Red zone — needs a funding plan",
};

function StackRow({
  label,
  value,
  strong,
  sign,
}: {
  label: string;
  value: string;
  strong?: boolean;
  sign?: "plus" | "minus";
}) {
  const color =
    sign === "minus"
      ? "text-enough-emeraldDark"
      : strong
        ? "text-enough-navy"
        : "text-enough-ink";
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span
        className={`text-sm ${strong ? "font-bold text-enough-navy" : "text-enough-slate"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-${strong ? "extrabold" : "semibold"} ${color} whitespace-nowrap`}
      >
        {sign === "minus" ? "− " : ""}
        {value}
      </span>
    </div>
  );
}

export function HealthcareConditions({
  inputs,
  baseSpend,
}: {
  inputs: PlanInputs;
  baseSpend: number;
}) {
  const [condKey, setCondKey] =
    useState<(typeof CONDITIONS)[number]["key"]>("stroke");
  const [careKey, setCareKey] = useState<CareOption["key"]>("helper");
  const [after, setAfter] = useState<number | null>(null);

  const condition = CONDITIONS.find((c) => c.key === condKey)!;
  // When switching condition, snap the care choice to that condition's default.
  useEffect(() => {
    setCareKey(condition.defaultCare);
  }, [condKey, condition.defaultCare]);

  const cost = costOf(condition, careKey);

  useEffect(() => {
    setAfter(null);
    const id = setTimeout(() => {
      const override: Partial<PlanInputs> = {
        healthcareSpend: inputs.healthcareSpend + cost.netMonthly,
        cash: Math.max(0, inputs.cash - cost.acuteNet),
      };
      setAfter(saferSpendOf(recompute(inputs, override)));
    }, 30);
    return () => clearTimeout(id);
  }, [inputs, cost.netMonthly, cost.acuteNet]);

  const impact = after === null ? 0 : after - baseSpend;
  const zone = after === null ? "green" : zoneForImpact(baseSpend, after);

  return (
    <Card>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h3 className="text-2xl font-bold text-enough-navy">
          Healthcare & care-cost stress test
        </h3>
        <Pill tone="navy">
          scheme figures cited · episode costs illustrative
        </Pill>
      </div>
      <p className="text-enough-slate mt-1 max-w-3xl">
        Pick a health event and a care setting to see the real cost — net of the
        government schemes that help — and how it moves the safer monthly spend.
      </p>

      {/* Condition menu */}
      <div className="mt-4 flex flex-wrap gap-2">
        {CONDITIONS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCondKey(c.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              condKey === c.key
                ? "bg-enough-navy text-white"
                : "bg-enough-navy/5 text-enough-navy hover:bg-enough-navy/10"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className="text-sm text-enough-slate mt-2">{condition.blurb}</p>

      {/* Care setting selector */}
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-enough-slate mb-2">
          Care setting
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {condition.careOptions.map((o) => {
            const active = careKey === o.key;
            return (
              <button
                key={o.key}
                type="button"
                onClick={() => setCareKey(o.key)}
                className={`text-left rounded-xl2 border px-3 py-2.5 transition-colors ${
                  active
                    ? "border-enough-navy bg-enough-navy/5 ring-1 ring-enough-navy/30"
                    : "border-enough-line hover:bg-enough-navy/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-enough-navy text-sm">
                    {o.label}
                  </span>
                  <span className="text-sm font-extrabold text-enough-navy">
                    {formatMoneyMonth(o.gross.amount)}
                  </span>
                </div>
                <div className="text-xs text-enough-slate mt-0.5 leading-snug">
                  {o.note}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cost stack — three parts, net of subsidies */}
      <div className="mt-4 grid md:grid-cols-2 gap-3">
        <div className="rounded-xl2 border border-enough-line p-4">
          <div className="font-bold text-enough-navy text-sm mb-1">
            One-off acute event
          </div>
          <StackRow
            label="Hospital / treatment (gross)"
            value={formatMoney(cost.acuteGross)}
          />
          <StackRow
            label="Less MediShield Life"
            value={formatMoney(cost.acuteGross - cost.acuteNet)}
            sign="minus"
          />
          <div className="mt-1 border-t border-enough-line pt-1">
            <StackRow
              label="You pay (one-off)"
              value={formatMoney(cost.acuteNet)}
              strong
            />
          </div>
        </div>

        <div className="rounded-xl2 border border-enough-line p-4">
          <div className="font-bold text-enough-navy text-sm mb-1">
            Monthly, for ~{condition.durationYears} years
          </div>
          <StackRow
            label="Ongoing medical"
            value={formatMoneyMonth(cost.ongoingGross)}
          />
          <StackRow
            label="Care setting"
            value={formatMoneyMonth(cost.careGross)}
          />
          {cost.careShieldOffset > 0 && (
            <StackRow
              label={`Less CareShield Life (${formatMoney(CARESHIELD_MONTHLY.amount)}/mo)`}
              value={formatMoneyMonth(cost.careShieldOffset)}
              sign="minus"
            />
          )}
          <StackRow
            label="Less HCG / means-tested / CHAS"
            value={formatMoneyMonth(cost.subsidyOffset)}
            sign="minus"
          />
          <div className="mt-1 border-t border-enough-line pt-1">
            <StackRow
              label="You fund (per month)"
              value={formatMoneyMonth(cost.netMonthly)}
              strong
            />
          </div>
          {!condition.eligibleSevere && (
            <p className="text-xs text-enough-slate mt-1 leading-snug">
              This condition may not reach the CareShield Life severity bar (≥3
              of 6 daily activities), so no payout is assumed.
            </p>
          )}
        </div>
      </div>

      {/* Engine impact */}
      {after === null ? (
        <div className="mt-4">
          <Spinner label="Re-running the engine with this care cost…" />
        </div>
      ) : (
        <>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <StatCard
              label="Base safer spend"
              value={formatMoneyMonth(baseSpend)}
              tone="navy"
            />
            <StatCard
              label="After this care cost"
              value={formatMoneyMonth(after)}
              tone={impact < 0 ? "red" : "emerald"}
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
              Funding options: cash buffer, the withdrawal sequence above,
              family support, or a referral to an insurer, IFA, or your existing
              adviser.
            </span>
          </div>
        </>
      )}

      <div className="mt-4 rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-3 text-xs text-enough-slate leading-relaxed">
        <strong className="text-enough-navy">Figures.</strong> Scheme parameters
        (CareShield Life S$689/mo, Home Caregiving Grant S$600/mo, MediShield
        Life S$2,000 deductible + co-insurance) and typical care fees are from
        2025–26 official sources. One-off episode costs and the means-tested
        subsidy rate are illustrative — actual means-tested subsidies are
        household-income- dependent (up to 75–80%). You weigh it and decide; no
        cost here is a guarantee, and we advise the move, not a specific
        product.
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-enough-navy underline"
            >
              {s.label}
            </a>
          ))}
          <Link
            to="/report"
            className="font-semibold text-enough-navy underline"
          >
            Add to the family report
          </Link>
        </div>
      </div>
    </Card>
  );
}
