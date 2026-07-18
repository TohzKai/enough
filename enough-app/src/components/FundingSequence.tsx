import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Pill } from "./ui";
import { formatMoney, formatMoneyMonth } from "../lib/format";
import { buildFundingPlan, RELIEF_SCHEMES } from "../data/fundingPlan";
import type { PlanInputs } from "../types";

/**
 * FundingSequence — app-review item 5, specific.
 *
 * Per-account draw AMOUNTS computed from the retiree's actual balances and the
 * engine's safer spend, then the real Singapore support schemes that may help
 * fund the residual gap, and a referral to an insurer, IFA, or the customer's
 * existing adviser for whatever the plan cannot safely cover. Neutral planning
 * advice; product-neutral.
 */

const toneBar: Record<string, string> = {
  emerald: "bg-enough-emerald",
  amber: "bg-enough-amber",
  navy: "bg-enough-navy",
  slate: "bg-enough-slate",
};

export function FundingSequence({
  inputs,
  centralSpend,
}: {
  inputs: PlanInputs;
  /** The engine's central safer monthly spend for this plan. */
  centralSpend: number;
}) {
  const { t } = useTranslation();
  const plan = buildFundingPlan(inputs, centralSpend);

  const amountLabel = (amount: number, kind: string): string => {
    if (amount <= 0) return "—";
    if (kind === "buffer")
      return `${formatMoney(amount)} ${t("common.buffer")}`;
    if (kind === "preserved")
      return `${formatMoneyMonth(amount)} ${t("common.forLife")}`;
    return `${formatMoney(amount)}${t("common.perYear")}`;
  };

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("fundingPlan.title")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("fundingPlan.intro", {
          value: formatMoneyMonth(plan.assetDrawMonthly),
        })}
      </p>

      <div className="mt-4 space-y-3">
        {plan.steps.map((s, idx) => (
          <div
            key={s.account}
            className="flex gap-3 rounded-xl2 border border-enough-line p-4"
          >
            <div
              className={`h-8 w-8 shrink-0 rounded-full ${toneBar[s.tone]} text-white flex items-center justify-center font-extrabold`}
            >
              {idx + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="font-bold text-enough-navy safe-break">
                  {t(s.title)}
                </div>
                <div className="font-extrabold text-enough-emeraldDark text-right min-w-0 safe-break">
                  {amountLabel(s.amount, s.amountKind)}
                </div>
              </div>
              <p className="text-sm text-enough-ink mt-1 leading-relaxed">
                {t(s.rationale)}
              </p>
              <p className="text-xs text-enough-slate mt-1 leading-relaxed">
                {t(s.nuance)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Residual gap → real SG schemes + referral to insurer / IFA / existing FA */}
      {plan.residualMonthly > 0 && (
        <div className="mt-4 rounded-xl2 border border-enough-amber/25 bg-enough-amber/5 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Pill tone="amber">{t("common.residualGap")}</Pill>
            <span className="font-bold text-enough-navy">
              {t("fundingPlan.residualTitle", {
                value: formatMoneyMonth(plan.residualMonthly),
              })}
            </span>
          </div>
          <p className="readable text-xs text-enough-slate mt-1 leading-relaxed">
            {t("fundingPlan.residualNote")}
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {RELIEF_SCHEMES.map((s) => (
              <div
                key={s.name}
                className="rounded-xl2 border border-enough-line bg-white p-3"
              >
                <div className="font-bold text-enough-navy text-sm safe-break">
                  {t(s.name)}
                </div>
                <div className="text-xs text-enough-slate mt-0.5 leading-snug">
                  {t(s.detail)}
                </div>
              </div>
            ))}
          </div>
          <p className="readable mt-3 text-sm text-enough-ink leading-relaxed">
            {t("fundingPlan.residualBody", {
              protection: t("fundingPlan.protectionLink"),
            })}
          </p>
          <div className="mt-3">
            <Link to="/report" className="btn-soft text-sm min-h-[44px]">
              {t("fundingPlan.addToReport")}
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
