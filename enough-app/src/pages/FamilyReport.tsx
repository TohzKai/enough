import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, SectionTitle, Disclaimer } from "../components/ui";
import {
  s$month,
  formatConfidence,
  formatMoneyMonth,
  formatRangeMonth,
} from "../lib/format";
import { cpfWording } from "../data/demoDataset";
import { layerTotals, totalLifestyle } from "../data/lifestyle";
import { useSpend } from "../store/spendStore";
import { useViewMode } from "../store/viewMode";
import { usePlan } from "../store/planStore";

export function FamilyReport() {
  const { t } = useTranslation();
  const { mode } = useViewMode();
  const { inputs, analysis, planMode } = usePlan();
  const child = mode === "child";
  const handlePrint = () => window.print();

  // The report uses the current plan's inputs + analysis, not the demo
  // dataset. Demo and custom plans both flow through this report.

  // Custom-plan report: if the user has edited inputs since the last
  // engine run, do NOT silently fall back to demo figures. Force a
  // recalculation first.
  const staleCustom = planMode === "custom" && !analysis;
  if (staleCustom) {
    return <RecalculateRequired />;
  }

  // Build the report data object from the current plan.
  const saferLower = analysis?.safe.lowerSpend ?? 0;
  const saferCentral = analysis?.safe.centralSpend ?? 0;
  const saferUpper = analysis?.safe.upperSpend ?? 0;
  const confidence = (analysis?.safe.confidence ?? 0) / 100;

  const layers = layerTotals(inputs.lifestyle);
  const { actuals } = useSpend();
  const totalActual = totalLifestyle(actuals);
  const overUpper = Math.max(0, totalActual - saferUpper);

  return (
    <div className="space-y-5">
      <div className="no-print">
        <SectionTitle
          kicker={t("report.kicker")}
          title={t("report.title")}
          subtitle={t("report.newSubtitle")}
        />
        {/* Top-of-page actions. Primary: Print. Secondaries: navigation
            shortcuts back to the live app. All four are hidden when printing
            because they sit inside .no-print. They wrap / stack on small
            screens via flex-wrap. */}
        <div className="flex flex-wrap gap-2">
          <button onClick={handlePrint} className="btn-emerald min-h-[44px]">
            {t("report.actionPrint")}
          </button>
          <Link to="/result" className="btn-soft min-h-[44px]">
            {t("report.actionBackToResults")}
          </Link>
          <Link to="/spend" className="btn-soft min-h-[44px]">
            {t("report.actionOpenSpendMonitor")}
          </Link>
          <Link to="/family" className="btn-ghost min-h-[44px]">
            {t("report.actionManageFamilyAccess")}
          </Link>
        </div>
        <div className="no-print mt-3 rounded-xl2 border border-enough-navy/20 bg-enough-navy/5 px-4 py-2.5 text-xs text-enough-ink leading-snug safe-break">
          {planMode === "demo"
            ? t("report.usingDemoData")
            : t("report.usingCustomData")}
        </div>
      </div>

      <Card className="print-area">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-enough-line pb-4 gap-4 flex-wrap">
          <div className="min-w-0">
            <div className="text-2xl font-extrabold text-enough-navy">
              {t("report.header")}
            </div>
            <div className="text-enough-slate text-sm">
              {t("report.headerSub", {
                age: inputs.age,
                horizon: inputs.horizonAge,
              })}
            </div>
            {child && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-enough-amberSoft px-3 py-1 text-xs font-semibold text-enough-amber">
                <span aria-hidden="true">🔒</span>
                <span>{t("report.sharedByParent")}</span>
              </div>
            )}
          </div>
          <div className="text-right text-xs text-enough-slate">
            {t("report.headerAdvice")}
          </div>
        </div>

        {/* Safer range — uses CURRENT plan, not demo figures. */}
        <div className="mt-5 rounded-xl2 bg-enough-navy text-white p-4 break-inside-avoid">
          <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            {t("report.saferLabel")}
          </div>
          <div className="mt-1 flex items-end gap-2 flex-wrap">
            <div className="text-2xl md:text-3xl font-extrabold">
              {formatRangeMonth(saferLower, saferUpper)}
            </div>
          </div>
          <div className="mt-1 text-sm text-enough-emerald font-semibold">
            {t("report.centralEstimate", {
              central: s$month(saferCentral),
              confidence: formatConfidence(confidence),
            })}
          </div>
        </div>

        {/* CPF floor */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("results.cpfFloorLabel")}
          </div>
          <div className="text-2xl font-extrabold text-enough-navy">
            {formatMoneyMonth(inputs.cpfLifeMonthly)}
          </div>
          <div className="text-xs text-enough-slate mt-1">
            {t(cpfWording.floor)}
          </div>
        </div>

        {/* Lifestyle layers — uses CURRENT plan inputs.lifestyle. */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.lifestyleLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.lifestyleLine", {
              e: formatMoneyMonth(layers.essential),
              f: formatMoneyMonth(layers.flexible),
              a: formatMoneyMonth(layers.aspirational),
              tt: formatMoneyMonth(layers.total),
            })}
          </p>
        </div>

        {/* Healthcare & care shock — no scenario is run by default; show
            a neutral summary rather than fixed demo impacts. */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.healthcareLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.healthcareBody")}
          </p>
        </div>

        {/* Bequest — show only the user's configured target; no fixed impact. */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.bequestLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.bequestBody", {
              target: formatMoneyMonth(inputs.bequestTarget ?? 50000),
            })}
          </p>
        </div>

        {/* Crisis guardrail */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.crisisLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.crisisBody")}
          </p>
        </div>

        {/* Current spending check — uses CURRENT safer range. */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.currentLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.currentBody", {
              actual: formatMoneyMonth(totalActual),
              range: formatRangeMonth(saferLower, saferUpper),
            })}
            {overUpper > 0
              ? t("report.currentOver", {
                  value: formatMoneyMonth(overUpper),
                })
              : t("report.currentWithin")}
          </p>
        </div>

        {/* Conversation */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="font-bold text-enough-navy">
            {t("report.convoTitle")}
          </div>
          <p className="text-enough-ink text-sm mt-1 leading-relaxed">
            {t("report.convoBody", {
              cpf: s$month(inputs.cpfLifeMonthly),
              central: s$month(saferCentral),
            })}
          </p>
        </div>

        <p className="readable mt-5 text-xs text-enough-slate leading-relaxed border-t border-enough-line pt-3">
          {t("report.disclaimer")}
        </p>
      </Card>

      <Disclaimer tone="soft">
        <span className="no-print">{t("report.saveAsPdf")}</span>
      </Disclaimer>
    </div>
  );
}

/**
 * Stale-custom report state. The user has edited a custom plan but has not
 * recalculated yet — we must NOT fall back to the demo figures. Force a
 * recalculation first.
 */
function RecalculateRequired() {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      <div className="mx-auto max-w-2xl rounded-xl2 border border-enough-amber/30 bg-enough-amberSoft p-6 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-enough-amber">
          <span aria-hidden="true">⚠</span>
          <span>{t("report.recalcTitle")}</span>
        </div>
        <h1 className="mt-4 text-2xl md:text-3xl font-extrabold text-enough-navy leading-tight safe-break">
          {t("report.recalcTitle")}
        </h1>
        <p className="readable mt-3 text-base text-enough-ink leading-relaxed safe-break">
          {t("report.recalcBody")}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link to="/plan" className="btn-emerald min-h-[44px]">
            {t("report.recalcCta")}
          </Link>
          <Link to="/result" className="btn-ghost min-h-[44px]">
            {t("report.actionBackToResults")}
          </Link>
        </div>
      </div>
    </div>
  );
}
