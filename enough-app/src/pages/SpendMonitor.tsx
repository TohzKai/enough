import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    { labelKey: string; tone: "emerald" | "amber" | "red" }
  > = {
    green: { labelKey: "spendMonitor.zoneGreen", tone: "emerald" },
    amber: { labelKey: "spendMonitor.zoneAmber", tone: "amber" },
    red: { labelKey: "spendMonitor.zoneRed", tone: "red" },
  };

  const topGap = rows.filter((r) => r.gap > 0).sort((a, b) => b.gap - a.gap)[0];

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={
          child ? t("spendMonitor.kickerChild") : t("spendMonitor.kickerParent")
        }
        title={t("spendMonitor.title")}
        subtitle={t("spendMonitor.subtitle")}
      />

      {/* Read-only banner in child mode — the adult child cannot edit spending
          records or update the family report. */}
      {child && (
        <div
          role="status"
          className="rounded-xl2 border border-enough-amber/30 bg-enough-amber/10 px-4 py-3 text-sm text-enough-ink leading-relaxed safe-break"
        >
          {t("spendMonitor.readOnlyNotice")}
        </div>
      )}

      {/* Status hero */}
      <Card className="bg-gradient-to-br from-enough-navy to-enough-navyLight text-white border-0 !p-5">
        <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
          {child
            ? t("spendMonitor.heroLabelChild")
            : t("spendMonitor.heroLabelParent")}
        </div>
        <div className="mt-1.5 flex items-end gap-2 flex-wrap">
          <div className="text-3xl md:text-4xl font-extrabold">
            {formatMoneyMonth(totalActual)}
          </div>
          <div className="text-white/60 text-base pb-1">
            {t("spendMonitor.actualPerMonth")}
          </div>
        </div>
        <div className="mt-2 text-base text-enough-emerald font-semibold">
          {t("spendMonitor.saferRange", {
            value: formatRangeMonth(saferLower, saferUpper),
          })}
        </div>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <Pill tone={zoneMeta[zone].tone}>{t(zoneMeta[zone].labelKey)}</Pill>
          {overUpper > 0 && (
            <span className="text-white/85 text-sm">
              {t("spendMonitor.overUpper", {
                value: formatMoneyMonth(overUpper),
                review: topGap
                  ? t("spendMonitor.reviewFirst", { bucket: t(topGap.label) })
                  : "",
              })}
            </span>
          )}
        </div>
      </Card>

      {/* Planned vs actual by bucket */}
      <Card>
        <h3 className="text-base font-bold text-enough-navy mb-3">
          {t("spendMonitor.plannedVsActual")}
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
                <div className="min-w-0">
                  <div className="flex justify-between text-sm gap-3">
                    <span className="font-semibold text-enough-navy safe-break">
                      {t(r.label)}
                    </span>
                    <span
                      className={`font-bold whitespace-nowrap ${
                        over ? "text-enough-amber" : "text-enough-emeraldDark"
                      }`}
                    >
                      {r.gap === 0
                        ? t("common.onPlan")
                        : formatDeltaMonth(r.gap)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-enough-navy/5 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${over ? "bg-enough-amber" : "bg-enough-emerald"}`}
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                  <div className="text-xs text-enough-slate mt-0.5">
                    {t("spendMonitor.plannedActual", {
                      planned: formatMoneyMonth(r.planned),
                      actual: formatMoneyMonth(r.actual),
                    })}
                  </div>
                </div>
                {child ? (
                  // Read-only display: no MoneyField editor, no setActual call.
                  <div className="rounded-xl2 border border-enough-line bg-white px-3 py-2 text-right">
                    <div className="text-xs text-enough-slate">
                      {t("connect.fActual")}
                    </div>
                    <div className="font-bold text-enough-ink whitespace-nowrap">
                      {formatMoneyMonth(r.actual)}
                    </div>
                  </div>
                ) : (
                  <MoneyField
                    label={t("connect.fActual")}
                    value={r.actual}
                    onChange={(v) => setActual(r.key, v)}
                  />
                )}
              </div>
            );
          })}
        </div>
        {!child && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/report" className="btn-emerald text-sm min-h-[44px]">
              {t("spendMonitor.updateReport")}
            </Link>
            <button
              type="button"
              onClick={clearActuals}
              className="btn-ghost text-sm min-h-[44px]"
            >
              {t("spendMonitor.resetToPlanned")}
            </button>
          </div>
        )}
      </Card>

      <Disclaimer tone="soft">{t("spendMonitor.disclaimer")}</Disclaimer>
    </div>
  );
}
