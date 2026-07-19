import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
 */

const zoneTone: Record<StressZone, "emerald" | "amber" | "red"> = {
  green: "emerald",
  amber: "amber",
  red: "red",
};
const zoneLabelKey: Record<StressZone, string> = {
  green: "guardrails.zoneGreenHealth",
  amber: "guardrails.zoneAmberHealth",
  red: "guardrails.zoneRedHealth",
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
        className={`text-sm safe-break ${strong ? "font-bold text-enough-navy" : "text-enough-slate"}`}
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
  onAfterChange,
}: {
  inputs: PlanInputs;
  baseSpend: number;
  /** Optional callback fired when the rerun engine updates `after`. */
  onAfterChange?: (after: number | null) => void;
}) {
  const { t } = useTranslation();
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
      const v = saferSpendOf(recompute(inputs, override));
      setAfter(v);
      onAfterChange?.(v);
    }, 30);
    return () => clearTimeout(id);
  }, [inputs, cost.netMonthly, cost.acuteNet, onAfterChange]);

  const impact = after === null ? 0 : after - baseSpend;
  const zone = after === null ? "green" : zoneForImpact(baseSpend, after);

  return (
    <Card>
      {/* Defect 9.8: title + badge stack cleanly at narrow widths (flex-wrap,
          shrinkable title, non-colliding badge). */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h3 className="text-2xl font-bold text-enough-navy safe-break min-w-0">
          {t("healthcare.title")}
        </h3>
        <Pill tone="navy">{t("healthcare.badge")}</Pill>
      </div>
      <p className="readable text-enough-slate mt-1">{t("healthcare.intro")}</p>

      {/* Condition menu — wraps, 44px targets, active state not colour-only. */}
      <div
        className="mt-4 flex flex-wrap gap-2"
        role="group"
        aria-label={t("healthcare.title")}
      >
        {CONDITIONS.map((c) => (
          <button
            key={c.key}
            type="button"
            aria-pressed={condKey === c.key}
            onClick={() => setCondKey(c.key)}
            className={`min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 ${
              condKey === c.key
                ? "bg-enough-navy text-white ring-2 ring-enough-navy"
                : "bg-enough-navy/5 text-enough-navy hover:bg-enough-navy/10"
            }`}
          >
            {t(c.label)}
          </button>
        ))}
      </div>
      <p className="text-sm text-enough-slate mt-2 safe-break">
        {t(condition.blurb)}
      </p>

      {/* Care setting selector */}
      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-enough-slate mb-2">
          {t("healthcare.careSetting")}
        </div>
        <div className="grid sm:grid-cols-3 gap-2">
          {condition.careOptions.map((o) => {
            const active = careKey === o.key;
            return (
              <button
                key={o.key}
                type="button"
                aria-pressed={active}
                onClick={() => setCareKey(o.key)}
                className={`min-h-[44px] text-left rounded-xl2 border px-3 py-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-enough-blue/40 ${
                  active
                    ? "border-enough-navy bg-enough-navy/5 ring-1 ring-enough-navy/30"
                    : "border-enough-line hover:bg-enough-navy/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-enough-navy text-sm safe-break">
                    {t(o.label)}
                  </span>
                  <span className="text-sm font-extrabold text-enough-navy whitespace-nowrap">
                    {formatMoneyMonth(o.gross.amount)}
                  </span>
                </div>
                <div className="text-xs text-enough-slate mt-0.5 leading-snug safe-break">
                  {t(o.note)}
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
            {t("healthcare.acuteHeading")}
          </div>
          <StackRow
            label={t("healthcare.acuteGrossLabel")}
            value={formatMoney(cost.acuteGross)}
          />
          <StackRow
            label={t("healthcare.acuteMedishield")}
            value={formatMoney(cost.acuteGross - cost.acuteNet)}
            sign="minus"
          />
          <div className="mt-1 border-t border-enough-line pt-1">
            <StackRow
              label={t("healthcare.acuteYouPay")}
              value={formatMoney(cost.acuteNet)}
              strong
            />
          </div>
        </div>

        <div className="rounded-xl2 border border-enough-line p-4">
          <div className="font-bold text-enough-navy text-sm mb-1">
            {t("healthcare.monthlyHeading", { years: condition.durationYears })}
          </div>
          <StackRow
            label={t("healthcare.ongoingLabel")}
            value={formatMoneyMonth(cost.ongoingGross)}
          />
          <StackRow
            label={t("healthcare.careLabel")}
            value={formatMoneyMonth(cost.careGross)}
          />
          {cost.careShieldOffset > 0 && (
            <StackRow
              label={t("healthcare.careshieldLess", {
                value: formatMoney(CARESHIELD_MONTHLY.amount),
              })}
              value={formatMoneyMonth(cost.careShieldOffset)}
              sign="minus"
            />
          )}
          <StackRow
            label={t("healthcare.subsidyLess")}
            value={formatMoneyMonth(cost.subsidyOffset)}
            sign="minus"
          />
          <div className="mt-1 border-t border-enough-line pt-1">
            <StackRow
              label={t("healthcare.youFund")}
              value={formatMoneyMonth(cost.netMonthly)}
              strong
            />
          </div>
          {!condition.eligibleSevere && (
            <p className="text-xs text-enough-slate mt-1 leading-snug safe-break">
              {t("healthcare.notSevere")}
            </p>
          )}
        </div>
      </div>

      {/* Engine impact */}
      {after === null ? (
        <div className="mt-4">
          <Spinner label={t("healthcare.spinner")} />
        </div>
      ) : (
        <>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            <StatCard
              label={t("healthcare.baseSafer")}
              value={formatMoneyMonth(baseSpend)}
              tone="navy"
            />
            <StatCard
              label={t("healthcare.afterCare")}
              value={formatMoneyMonth(after)}
              tone={impact < 0 ? "red" : "emerald"}
            />
            <StatCard
              label={t("healthcare.impact")}
              value={formatDeltaMonth(impact)}
              tone={impact < 0 ? "red" : "emerald"}
            />
          </div>
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <Pill tone={zoneTone[zone]}>{t(zoneLabelKey[zone])}</Pill>
            <span className="readable text-sm text-enough-ink">
              {t("healthcare.fundingOptions")}
            </span>
          </div>
        </>
      )}

      <div className="readable mt-4 rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-3 text-xs text-enough-slate leading-relaxed">
        <strong className="text-enough-navy">
          {t("healthcare.figuresLabel")}
        </strong>{" "}
        {t("healthcare.figures")}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-enough-navy underline"
            >
              {t(s.label)}
            </a>
          ))}
          <Link
            to="/report"
            className="font-semibold text-enough-navy underline"
          >
            {t("healthcare.addToReport")}
          </Link>
        </div>
      </div>
    </Card>
  );
}
