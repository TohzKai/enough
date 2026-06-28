import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui";

const PILLARS = [
  {
    title: "CPF LIFE as the floor",
    body: "Start with the income you cannot outlive.",
  },
  {
    title: "Spending confidence",
    body: "See how each spending level affects the chance your money lasts.",
  },
  {
    title: "Family report",
    body: "Turn the result into a simple conversation at home.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const startPlan = () => navigate("/plan");

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center pt-2 md:pt-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-enough-emerald/10 px-4 py-1.5 text-sm font-semibold text-enough-emeraldDark">
          Singapore retirement spending simulator
        </div>
        <h1 className="mt-5 text-4xl md:text-6xl font-extrabold text-enough-navy leading-tight">
          How much can I <span className="text-enough-emerald">really</span>{" "}
          spend?
        </h1>
        <p className="mt-5 mx-auto max-w-2xl text-lg md:text-xl text-enough-slate leading-relaxed">
          A Singapore retirement spending simulator built around CPF LIFE,
          family needs, housing cost, and market uncertainty.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={startPlan}
            className="btn-emerald text-lg !px-8 !py-4"
          >
            Start my plan
          </button>
        </div>
      </section>

      {/* Pillars */}
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
              The decumulation gap
            </h3>
            <p className="mt-3 text-white/85 text-lg leading-relaxed max-w-2xl">
              Most tools help Singaporeans save and invest. Fewer tools answer
              the retirement question that matters most: how much can I safely
              spend every month?
            </p>
          </div>
          <div className="rounded-xl2 bg-white/10 p-4 text-center min-w-[220px]">
            <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">
              balance → monthly spend
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80">
              <span className="rounded-full bg-white/10 px-2 py-1">
                CPF LIFE
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                Savings
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">
                Housing
              </span>
              <span className="rounded-full bg-white/10 px-2 py-1">Family</span>
            </div>
            <div className="mt-2 text-enough-emerald font-bold">
              → safer spend range
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
