import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, Pill } from "./ui";
import { applicableProtections } from "../data/protection";
import type { PlanInputs } from "../types";

/**
 * ProtectionReferral — the specific referral map (app-review item 5 extension).
 *
 * Links each retirement gap → the protection that covers it → the licensed
 * partner Enough would refer you to (insurance agency / fee-only IFA / CPF Board).
 * Provider names are illustrative example partners (real SG firms/schemes, 2025–26),
 * not confirmed relationships. A permitted MAS introducer arrangement (FAA-N02).
 */
export function ProtectionReferral({ inputs }: { inputs: PlanInputs }) {
  const { t } = useTranslation();
  const items = applicableProtections(inputs);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        {t("protection.title")}
      </h3>
      <p className="readable text-enough-slate mt-1">{t("protection.intro")}</p>

      <div className="mt-4 space-y-3">
        {items.map((r) => (
          <div
            key={r.key}
            className="rounded-xl2 border border-enough-line p-4"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="font-bold text-enough-navy safe-break">
                {t(r.gap)}
              </div>
              <Pill tone="amber">{t("common.gap")}</Pill>
            </div>
            <p className="text-sm text-enough-ink mt-1 leading-relaxed">
              {t(r.nature)}
            </p>

            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div className="rounded-xl2 bg-enough-emerald/5 border border-enough-emerald/20 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-enough-emeraldDark">
                  {t("protection.protectionFits")}
                </div>
                <div className="text-sm font-semibold text-enough-navy mt-1 leading-snug safe-break">
                  {t(r.protection)}
                </div>
                <div className="text-xs text-enough-slate mt-1 leading-snug">
                  {t(r.why)}
                </div>
              </div>
              <div className="rounded-xl2 bg-enough-navy/5 border border-enough-line p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-enough-navy">
                  {t("protection.whoToSee")}
                </div>
                <div className="text-sm text-enough-ink mt-1 leading-snug">
                  {t(r.channel)}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.examples.map((e) => (
                    <span
                      key={e}
                      className="rounded-full bg-white border border-enough-line px-2.5 py-1 text-xs font-medium text-enough-navy safe-break"
                    >
                      {t(e)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="readable mt-4 rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-3 text-xs text-enough-slate leading-relaxed">
        {t("protection.footer")}
        <Link
          to="/report"
          className="font-semibold text-enough-navy underline ml-1"
        >
          {t("protection.addToReport")}
        </Link>
      </div>
    </Card>
  );
}
