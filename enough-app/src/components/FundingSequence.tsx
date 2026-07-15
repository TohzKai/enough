import { Link } from "react-router-dom";
import { Card, Pill } from "./ui";
import { formatMoney, formatMoneyMonth } from "../lib/format";
import { buildFundingPlan, RELIEF_SCHEMES } from "../data/fundingPlan";
import type { PlanInputs } from "../types";

/**
 * FundingSequence — app-review item 5, specific.
 *
 * Replaces the generic "which account to spend first" list with per-account draw
 * AMOUNTS computed from the retiree's actual balances and the engine's safer
 * spend, then surfaces the real Singapore support schemes that may help fund the
 * residual gap, and refers the customer to an insurer, IFA, or their existing adviser for whatever the plan
 * cannot safely cover. Neutral planning advice; product-neutral (no specific product pushed).
 */

const toneBar: Record<string, string> = {
  emerald: "bg-enough-emerald",
  amber: "bg-enough-amber",
  navy: "bg-enough-navy",
  slate: "bg-enough-slate",
};

function amountLabel(amount: number, kind: string): string {
  if (amount <= 0) return "—";
  if (kind === "buffer") return `${formatMoney(amount)} buffer`;
  if (kind === "preserved") return `${formatMoneyMonth(amount)} for life`;
  return `${formatMoney(amount)}/year`;
}

export function FundingSequence({
  inputs,
  centralSpend,
}: {
  inputs: PlanInputs;
  /** The engine's central safer monthly spend for this plan. */
  centralSpend: number;
}) {
  const plan = buildFundingPlan(inputs, centralSpend);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        Which account to spend — and how much
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        Tax- and longevity-aware sequencing across cash, SRS, investments and
        CPF — with the amounts worked out from your own balances. About{" "}
        {formatMoneyMonth(plan.assetDrawMonthly)} a month comes from your assets
        above the CPF floor. This is the advice no single product provider can
        give you neutrally.
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
                <div className="font-bold text-enough-navy">{s.title}</div>
                <div className="font-extrabold text-enough-emeraldDark whitespace-nowrap">
                  {amountLabel(s.amount, s.amountKind)}
                </div>
              </div>
              <p className="text-sm text-enough-ink mt-1 leading-relaxed">
                {s.rationale}
              </p>
              <p className="text-xs text-enough-slate mt-1 leading-relaxed">
                {s.nuance}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Residual gap → real SG schemes + referral to insurer / IFA / existing FA */}
      {plan.residualMonthly > 0 && (
        <div className="mt-4 rounded-xl2 border border-enough-amber/25 bg-enough-amber/5 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Pill tone="amber">Residual gap</Pill>
            <span className="font-bold text-enough-navy">
              About {formatMoneyMonth(plan.residualMonthly)} the plan can’t
              safely fund from your own assets
            </span>
          </div>
          <p className="text-xs text-enough-slate mt-1 leading-relaxed">
            What we'd suggest looking at — you decide, and none of these are
            eligibility promises. These are real Singapore schemes that may
            help; check each with the relevant agency.
          </p>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {RELIEF_SCHEMES.map((s) => (
              <div
                key={s.name}
                className="rounded-xl2 border border-enough-line bg-white p-3"
              >
                <div className="font-bold text-enough-navy text-sm">
                  {s.name}
                </div>
                <div className="text-xs text-enough-slate mt-0.5 leading-snug">
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-enough-ink leading-relaxed">
            For the part you can’t fund from assets or these schemes, working a
            little longer or trimming the lifestyle helps. And for the risks you
            can insure against — health, long-term care, longevity — see{" "}
            <span className="font-semibold text-enough-navy">
              Protection gaps
            </span>{" "}
            below, where Enough refers you to the right insurer or IFA.
          </p>
          <div className="mt-3">
            <Link to="/report" className="btn-soft text-sm">
              Add this to the family report
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
