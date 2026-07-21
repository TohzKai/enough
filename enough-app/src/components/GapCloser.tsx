import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Pill, Spinner } from "./ui";
import { formatMoneyMonth, formatDeltaMonth } from "../lib/format";
import { runFullAnalysisSync } from "../engine";
import { GAP_ACTIONS, applyAllActions } from "../data/gapActions";
import type { PlanInputs } from "../types";

/**
 * GapCloser — app-review item 2, engine-wired.
 *
 * Shows the desired-vs-safer gap, then for each action re-runs the REAL engine
 * (reduced to 1,000 trials for responsiveness) to compute how much of the gap it
 * actually closes. The "do all four" row merges every override and re-runs once
 * more. Nothing here is a hardcoded confidence number; every figure is computed
 * from the inputs.
 */

interface Row {
  key: string;
  title: string;
  detail: string;
  reversible: boolean;
  gapClosed: number; // S$/month of the gap this action closes (modelled)
  safeDelta: number; // S$/month change in the safer spend (modelled)
  remainingGap: number; // S$/month of the gap that remains after this action
  surplus: number; // S$/month the revised safer spend exceeds desired spend (0 if not)
}

interface Computed {
  baselineGap: number;
  rows: Row[];
  combinedGapClosed: number;
}

function gapOf(desired: number, safe: number): number {
  return Math.max(0, desired - safe);
}

function compute(inputs: PlanInputs): Computed {
  const fast = { ...inputs, trials: 1000 };
  const base = runFullAnalysisSync(fast);
  const baseSafe = base.safe.centralSpend;
  const baselineGap = gapOf(base.desiredSpend, baseSafe);

  const rows: Row[] = GAP_ACTIONS.map((a) => {
    const r = runFullAnalysisSync({ ...fast, ...a.buildOverride(fast) });
    const revisedSafeSpend = r.safe.centralSpend;
    const newGap = gapOf(r.desiredSpend, revisedSafeSpend);
    const surplus = Math.max(0, Math.round(revisedSafeSpend - r.desiredSpend));
    return {
      key: a.key,
      title: a.title,
      detail: a.detail,
      reversible: a.reversible,
      gapClosed: Math.max(0, Math.round(baselineGap - newGap)),
      safeDelta: Math.round(revisedSafeSpend - baseSafe),
      remainingGap: Math.round(newGap),
      surplus,
    };
  });

  const all = runFullAnalysisSync({ ...fast, ...applyAllActions(fast) });
  const combinedGapClosed = Math.max(
    0,
    Math.round(baselineGap - gapOf(all.desiredSpend, all.safe.centralSpend)),
  );

  return { baselineGap, rows, combinedGapClosed };
}

export function GapCloser({
  inputs,
  gap,
}: {
  inputs: PlanInputs;
  /** The gap the page displays (desired − safer central), for a consistent header. */
  gap: number;
}) {
  const { t } = useTranslation();
  const [data, setData] = useState<Computed | null>(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    // Defer so the page paints before the (synchronous) engine runs fire.
    const id = setTimeout(() => {
      if (alive) setData(compute(inputs));
    }, 30);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [inputs]);

  const displayedRemaining =
    data && gap > 0 ? Math.max(0, gap - data.combinedGapClosed) : 0;

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("gapActions.closingTitle")}
      </h3>
      <p className="readable text-enough-slate mt-1">
        {t("gapActions.closingIntro", { value: formatMoneyMonth(gap) })}
      </p>

      {!data ? (
        <div className="mt-4">
          <Spinner label={t("gapActions.closingSpinner")} />
        </div>
      ) : (
        <>
          <div className="mt-4 space-y-3">
            {data.rows.map((r) => (
              <div
                key={r.key}
                className="rounded-xl2 border border-enough-line p-4"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="font-bold text-enough-navy safe-break">
                      {t(r.title)}
                    </div>
                    <p className="text-sm text-enough-ink mt-1 leading-relaxed">
                      {t(r.detail)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <Pill tone={r.reversible ? "navy" : "amber"}>
                        {r.reversible
                          ? t("common.reversible")
                          : t("common.hardToReverse")}
                      </Pill>
                      {r.safeDelta > 0 && (
                        <span className="text-xs text-enough-slate">
                          {t("common.raisesSafer", {
                            delta: formatDeltaMonth(r.safeDelta),
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {r.key === "cpf-floor" && r.remainingGap > 0 ? (
                      <>
                        <div className="text-xs text-enough-slate">
                          {t("gapActions.gapReducedBy", {
                            value: formatMoneyMonth(r.gapClosed),
                          })}
                        </div>
                        <div className="text-xs text-enough-slate mt-1">
                          {t("gapActions.amountRemains", {
                            value: formatMoneyMonth(r.remainingGap),
                          })}
                        </div>
                      </>
                    ) : r.key === "cpf-floor" &&
                      r.remainingGap === 0 &&
                      r.surplus > 0 ? (
                      <>
                        <div className="text-xs text-enough-slate">
                          {t("gapActions.desiredFullyCovered")}
                        </div>
                        <div className="text-xs text-enough-slate mt-1">
                          {t("gapActions.estimatedSurplus", {
                            value: formatMoneyMonth(r.surplus),
                          })}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-enough-slate">
                          {t("common.closes")}
                        </div>
                        <div className="text-xl font-extrabold text-enough-emeraldDark whitespace-nowrap">
                          {r.gapClosed > 0
                            ? formatMoneyMonth(r.gapClosed)
                            : "—"}
                        </div>
                        <div className="text-xs text-enough-slate">
                          {t("common.ofTheGap")}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl2 border border-enough-emerald/30 bg-enough-emerald/5 p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="font-bold text-enough-navy">
                {t("gapActions.allFour")}
              </div>
              <p className="readable text-sm text-enough-ink mt-0.5 leading-relaxed">
                {t("gapActions.allFourNote")}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-enough-slate">
                {t("gapActions.gapRemaining")}
              </div>
              <div className="text-2xl font-extrabold text-enough-navy whitespace-nowrap">
                {formatMoneyMonth(displayedRemaining)}
              </div>
              <div className="text-xs text-enough-emeraldDark">
                {t("gapActions.fromToday", { value: formatMoneyMonth(gap) })}
              </div>
            </div>
          </div>

          <p className="readable mt-3 text-xs text-enough-slate leading-relaxed">
            {t("gapActions.closingFooter")}
          </p>
        </>
      )}
    </Card>
  );
}
