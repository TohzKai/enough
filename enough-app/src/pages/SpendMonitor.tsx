import { Link } from "react-router-dom";
import {
  Card,
  SectionTitle,
  Pill,
  Disclaimer,
  MoneyField,
} from "../components/ui";
import { usePlan } from "../store/planStore";
import { useSpend } from "../store/spendStore";
import { useViewMode } from "../store/viewMode";
import { LIFESTYLE_BUCKETS } from "../data/lifestyle";
import { demoMrTan } from "../data/demoDataset";
import {
  formatMoneyMonth,
  formatRangeMonth,
  formatDeltaMonth,
} from "../lib/format";

type Zone = "green" | "amber" | "red";

/**
 * Spend Monitor — a light, manual planned-vs-actual check against the safer
 * monthly range. No bank feed, no transaction import, no auto-categorisation.
 */
export function SpendMonitor() {
  const { inputs, analysis } = usePlan();
  const { actuals, setActual, clearActuals } = useSpend();
  const { mode } = useViewMode();
  const child = mode === "child";

  // Safer range: live analysis if available, otherwise the Mr Tan demo range.
  const saferLower = analysis?.safe.lowerSpend ?? demoMrTan.saferLower;
  const saferUpper = analysis?.safe.upperSpend ?? demoMrTan.saferUpper;

  const rows = LIFESTYLE_BUCKETS.map((b) => {
    const planned = Number(inputs.lifestyle[b.key]) || 0;
    const actual = Number(actuals[b.key]) || 0;
    return { ...b, planned, actual, gap: actual - planned };
  });
  const totalActual = rows.reduce((s, r) => s + r.actual, 0);
  const overUpper = Math.max(0, totalActual - saferUpper);

  let zone: Zone;
  if (totalActual <= saferUpper) zone = "green";
  else if (totalActual <= saferUpper * 1.1) zone = "amber";
  else zone = "red";

  const zoneMeta: Record<
    Zone,
    { label: string; tone: "emerald" | "amber" | "red" }
  > = {
    green: { label: "Within safer range", tone: "emerald" },
    amber: { label: "Slightly above range", tone: "amber" },
    red: { label: "Above safe range", tone: "red" },
  };

  const topGap = rows.filter((r) => r.gap > 0).sort((a, b) => b.gap - a.gap)[0];

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={child ? "Adult-child view" : "Spending check"}
        title="Spend Monitor"
        subtitle="Compare what you actually spend against the safer monthly range. Manual entry — no bank feed, no auto-categorisation."
      />

      {/* Status hero */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {child
            ? "Dad's spending vs safer range"
            : "Your spending vs safer range"}
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold">
            {formatMoneyMonth(totalActual)}
          </div>
          <div className="text-white/60 text-base pb-1">actual / month</div>
        </div>
        <div className="mt-2 text-base text-enough-emerald font-semibold">
          Safer range: {formatRangeMonth(saferLower, saferUpper)}
        </div>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <Pill tone={zoneMeta[zone].tone}>{zoneMeta[zone].label}</Pill>
          {overUpper > 0 && (
            <span className="text-white/85 text-sm">
              {formatMoneyMonth(overUpper)} above the upper safer range.
              {topGap ? ` Review ${topGap.label.toLowerCase()} first.` : ""}
            </span>
          )}
        </div>
      </Card>

      {/* Planned vs actual by bucket */}
      <Card>
        <h3 className="text-base font-bold text-enough-navy mb-3">
          Planned vs actual by bucket
        </h3>
        <div className="space-y-3">
          {rows.map((r) => {
            const fill =
              r.planned > 0
                ? Math.min(100, (r.actual / r.planned) * 100)
                : r.actual > 0
                  ? 100
                  : 0;
            const over = r.gap > 0;
            return (
              <div
                key={r.key}
                className="grid sm:grid-cols-[1fr_180px] gap-2 sm:gap-4 items-center"
              >
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-enough-navy">
                      {r.label}
                    </span>
                    <span
                      className={`font-bold ${over ? "text-enough-amber" : "text-enough-emeraldDark"}`}
                    >
                      {r.gap === 0 ? "on plan" : formatDeltaMonth(r.gap)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-enough-navy/5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${over ? "bg-enough-amber" : "bg-enough-emerald"}`}
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                  <div className="text-xs text-enough-slate mt-0.5">
                    Planned {formatMoneyMonth(r.planned)} · Actual{" "}
                    {formatMoneyMonth(r.actual)}
                  </div>
                </div>
                <MoneyField
                  label="Actual"
                  value={r.actual}
                  onChange={(v) => setActual(r.key, v)}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/report" className="btn-emerald text-sm">
            Update family report
          </Link>
          <button
            type="button"
            onClick={clearActuals}
            className="btn-ghost text-sm"
          >
            Reset to planned
          </button>
        </div>
      </Card>

      <Disclaimer tone="soft">
        Spend Monitor is a manual planning tool. Enough does not connect to your
        bank, import transactions, or categorise spending automatically.
      </Disclaimer>
    </div>
  );
}
