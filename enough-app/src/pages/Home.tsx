import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui";
import { useViewMode } from "../store/viewMode";

// The three differentiators that survive the competitor scan
// (enough-competitor-analysis.md §4) — NOT the engine / "8 models".
const PILLARS = [
  {
    title: "Neutral, whole-wealth",
    body: "Product-free and commission-free. We connect CPF, SRS, bank and investments in one consented view — and tell you how much of your total wealth you can safely spend.",
  },
  {
    title: "CPF-native depth",
    body: "CPF LIFE as your guaranteed floor, SRS drawn inside its 10-year window, tax- and longevity-aware sequencing across every account.",
  },
  {
    title: "For the whole family",
    body: "A permissioned plan for the retiree, spouse, and adult child — the child helps set it up, but the parent always confirms the number.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const { mode } = useViewMode();
  const startPlan = () => navigate("/plan");

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center pt-2 md:pt-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-enough-emerald/10 px-4 py-1.5 text-sm font-semibold text-enough-emeraldDark">
          Singapore's neutral retirement-spending co-pilot
        </div>
        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold text-enough-navy leading-tight">
          How much can I <span className="text-enough-emerald">really</span>{" "}
          spend?
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-lg md:text-xl text-enough-slate leading-relaxed">
          {mode === "parent" ? (
            <>
              One calm number — how much you can safely spend each month, from
              your CPF, savings and the lifestyle you want. Explained in plain
              words. Product-free. No product recommendations.
            </>
          ) : (
            <>
              Help your parents spend their retirement with confidence. Connect
              their accounts once, keep watch with alerts, and co-sign the big
              moves — while they stay in control of the number.
            </>
          )}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={startPlan}
            className="btn-emerald text-lg !px-8 !py-4"
          >
            {mode === "parent" ? "Start my plan" : "Set up for my parent"}
          </button>
          <button
            onClick={() => navigate("/result")}
            className="btn-ghost text-lg !px-6 !py-4"
          >
            See a worked example
          </button>
        </div>
      </section>

      {/* Three differentiators */}
      <section className="grid gap-5 md:grid-cols-3">
        {PILLARS.map((p) => (
          <Card key={p.title}>
            <h3 className="text-xl font-bold text-enough-navy">{p.title}</h3>
            <p className="mt-2 text-enough-slate leading-relaxed">{p.body}</p>
          </Card>
        ))}
      </section>

      {/* The decumulation gap */}
      <Card className="bg-enough-navy text-white border-0">
        <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-white text-2xl font-bold">
              The permission to spend
            </h3>
            <p className="mt-3 text-white/85 text-lg leading-relaxed max-w-2xl">
              CPF, banks and advisers all help Singaporeans save. A neutral
              spending view is harder when providers also sell products. Enough
              focuses on the monthly spend decision.
            </p>
          </div>
          <div className="rounded-xl2 bg-white/10 p-4 text-center min-w-[220px]">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">
              whole wealth → monthly spend
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80">
              <span className="rounded-full bg-white/10 px-2 py-1">
                CPF LIFE
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">SRS</span>
              <span className="rounded-full bg-white/10 px-2 py-1">Bank</span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                Investments
              </span>
            </div>
            <div className="mt-2 text-enough-emerald font-bold">
              → safer monthly spend
            </div>
          </div>
        </div>
      </Card>

      {/* Trust strip */}
      <p className="text-center text-sm text-enough-slate">
        Educational decision-support prototype · No products, no commission ·
        Your data stays yours · Plain-English "why" behind every number.
      </p>
    </div>
  );
}
