import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, SectionTitle, Disclaimer } from "../components/ui";
import {
  s$,
  s$month,
  formatConfidence,
  formatMoney,
  formatMoneyMonth,
  formatRangeMonth,
} from "../lib/format";
import { demoMrTan, demoFamily, cpfWording } from "../data/demoDataset";
import { lifeEventStressTests } from "../data/lifeEvents";
import {
  DEFAULT_LIFESTYLE,
  layerTotals,
  totalLifestyle,
} from "../data/lifestyle";
import { useSpend } from "../store/spendStore";
import { useViewMode } from "../store/viewMode";

export function FamilyReport() {
  const { t } = useTranslation();
  const { mode } = useViewMode();
  const child = mode === "child";
  const handlePrint = () => window.print();
  // Illustrative safer-spend impact magnitudes (Mr Tan sample) — single source
  // of truth shared with the Results-page stress-test cards.
  const stressMag = (key: string) =>
    Math.abs(
      lifeEventStressTests.find((tt) => tt.key === key)?.impactMonthly ?? 0,
    );
  const layers = layerTotals(DEFAULT_LIFESTYLE);
  const { actuals } = useSpend();
  const totalActual = totalLifestyle(actuals);
  const overUpper = Math.max(0, totalActual - demoMrTan.saferUpper);

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
                age: demoMrTan.age,
                horizon: demoMrTan.horizonAge,
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

        {/* Safer range */}
        <div className="mt-5 rounded-xl2 bg-enough-navy text-white p-4 break-inside-avoid">
          <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            {t("report.saferLabel")}
          </div>
          <div className="mt-1 flex items-end gap-2 flex-wrap">
            <div className="text-2xl md:text-3xl font-extrabold">
              {s$(demoMrTan.saferLower)} {t("common.rangeSeparator")}{" "}
              {s$(demoMrTan.saferUpper)}
            </div>
            <div className="text-white/60 text-sm pb-1">
              {t("common.perMonth")}
            </div>
          </div>
          <div className="mt-1 text-sm text-enough-emerald font-semibold">
            {t("report.centralEstimate", {
              central: s$month(demoMrTan.saferCentral),
              confidence: formatConfidence(demoMrTan.confidence / 100),
            })}
          </div>
        </div>

        {/* CPF floor */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("results.cpfFloorLabel")}
          </div>
          <div className="text-2xl font-extrabold text-enough-navy">
            {s$(demoMrTan.cpfLife)}{" "}
            <span className="text-sm font-medium text-enough-slate">
              {t("common.perMonth")}
            </span>
          </div>
          <div className="text-xs text-enough-slate mt-1">
            {t(cpfWording.floor)}
          </div>
        </div>

        {/* Lifestyle layers */}
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

        {/* Healthcare & care shock */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.healthcareLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.healthcareBody", {
              value: formatMoneyMonth(stressMag("healthcare")),
            })}
          </p>
        </div>

        {/* Bequest */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.bequestLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.bequestBody", {
              target: formatMoney(50000),
              value: formatMoneyMonth(stressMag("bequest")),
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

        {/* Current spending check */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4 break-inside-avoid">
          <div className="text-sm font-semibold text-enough-slate">
            {t("report.currentLabel")}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t("report.currentBody", {
              actual: formatMoneyMonth(totalActual),
              range: formatRangeMonth(
                demoMrTan.saferLower,
                demoMrTan.saferUpper,
              ),
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
              cpf: s$month(demoFamily.cpfFloor),
              central: s$month(demoFamily.central),
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
