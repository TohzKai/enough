import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "../components/ui";
import { useViewMode } from "../store/viewMode";
import { usePlan } from "../store/planStore";

const PILLARS = [
  { titleKey: "home.pillarNeutralTitle", bodyKey: "home.pillarNeutralBody" },
  { titleKey: "home.pillarCpfTitle", bodyKey: "home.pillarCpfBody" },
  { titleKey: "home.pillarFamilyTitle", bodyKey: "home.pillarFamilyBody" },
] as const;

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useViewMode();
  const { loadSample } = usePlan();
  const child = mode === "child";
  // Adult-child view cannot connect or set up the parent's plan — it is a
  // read-only shared view, so the main CTA in child mode lands on the result
  // page (the already-shared plan) instead of /plan.
  const startPlan = () => navigate(child ? "/result" : "/plan");
  // "See a worked example" loads the calibrated Mr Tan demo BEFORE
  // navigating to /result, so the Results page has a valid analysis to
  // display. Without this the user lands on a "no plan" empty state.
  const openWorkedExample = () => {
    loadSample();
    navigate("/result");
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center pt-2 md:pt-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-enough-emerald/10 px-4 py-1.5 text-sm font-semibold text-enough-emeraldDark">
          {t("home.badge")}
        </div>
        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold text-enough-navy leading-tight safe-break">
          {t("home.heroTitle")}
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-lg md:text-xl text-enough-slate leading-relaxed">
          {child ? t("home.heroChild") : t("home.heroParent")}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={startPlan}
            className="btn-emerald text-lg !px-8 !py-4 min-h-[52px]"
          >
            {child ? t("home.ctaChild") : t("home.ctaParent")}
          </button>
          <button
            onClick={openWorkedExample}
            className="btn-ghost text-lg !px-6 !py-4 min-h-[52px]"
          >
            {t("home.seeExample")}
          </button>
        </div>
      </section>

      {/* Three differentiators */}
      <section className="grid gap-5 md:grid-cols-3">
        {PILLARS.map((p) => (
          <Card key={p.titleKey}>
            <h3 className="text-xl font-bold text-enough-navy">
              {t(p.titleKey)}
            </h3>
            <p className="mt-2 text-enough-slate leading-relaxed">
              {t(p.bodyKey)}
            </p>
          </Card>
        ))}
      </section>

      {/* The decumulation gap */}
      <Card className="bg-enough-navy text-white border-0">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-white text-2xl font-bold">
              {t("home.permissionTitle")}
            </h3>
            <p className="readable mt-3 text-white/85 text-lg leading-relaxed">
              {t("home.permissionBody")}
            </p>
          </div>
          <div className="rounded-xl2 bg-white/10 p-4 text-center min-w-[220px]">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">
              {t("home.wholeWealthLabel")}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80">
              <span className="rounded-full bg-white/10 px-2 py-1">
                {t("home.chipCpfLife")}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                {t("home.chipSrs")}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                {t("home.chipBank")}
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                {t("home.chipInvestments")}
              </span>
            </div>
            <div className="mt-2 text-enough-emerald font-bold">
              {t("home.saferMonthlySpend")}
            </div>
          </div>
        </div>
      </Card>

      {/* Trust strip */}
      <p className="readable mx-auto text-center text-sm text-enough-slate">
        {t("home.trustStrip")}
      </p>
    </div>
  );
}
