import { Link } from "react-router-dom";
import { Card, SectionTitle, Disclaimer } from "../components/ui";
import { s$, s$month } from "../lib/format";
import { demoMrTan, demoFamily, cpfWording } from "../data/demoDataset";

export function FamilyReport() {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-5">
      <div className="no-print">
        <SectionTitle
          kicker="For the kitchen table"
          title="Family report"
          subtitle="A calm, one-page summary to discuss at home. Plain language, no product recommendations."
        />
        <button onClick={handlePrint} className="btn-primary">
          Print family report
        </button>
      </div>

      <Card className="print-area">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-enough-line pb-4">
          <div>
            <div className="text-2xl font-extrabold text-enough-navy">
              Enough Family Report
            </div>
            <div className="text-enough-slate text-sm">
              Mr Tan, age {demoMrTan.age}. Plan to age {demoMrTan.horizonAge}.
            </div>
          </div>
          <div className="text-right text-xs text-enough-slate">
            Educational, not advice
          </div>
        </div>

        {/* Safer range */}
        <div className="mt-5 rounded-xl2 bg-enough-navy text-white p-4">
          <div className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            Safer monthly spend range
          </div>
          <div className="mt-1 flex items-end gap-2 flex-wrap">
            <div className="text-2xl md:text-3xl font-extrabold">
              {s$(demoMrTan.saferLower)} to {s$(demoMrTan.saferUpper)}
            </div>
            <div className="text-white/60 text-sm pb-1">per month</div>
          </div>
          <div className="mt-1 text-sm text-enough-emerald font-semibold">
            Central estimate: {s$month(demoMrTan.saferCentral)} at about{" "}
            {demoMrTan.confidence}% confidence
          </div>
        </div>

        {/* CPF floor */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="text-sm font-semibold text-enough-slate">
            CPF LIFE floor
          </div>
          <div className="text-2xl font-extrabold text-enough-navy">
            {s$(demoMrTan.cpfLife)}{" "}
            <span className="text-sm font-medium text-enough-slate">
              per month
            </span>
          </div>
          <div className="text-xs text-enough-slate mt-1">
            {cpfWording.floor}
          </div>
        </div>

        {/* Safe / risky / family / changes */}
        <div className="mt-5 space-y-3">
          <Row tone="emerald" title="What is safe">
            Spending around {s$month(demoMrTan.saferCentral)} keeps the plan
            within the safer range under the base case.
          </Row>
          <Row tone="amber" title="What is risky">
            Spending {s$month(demoMrTan.desired)} lowers confidence to around{" "}
            {demoMrTan.desiredConfidence}%.
          </Row>
          <Row tone="emerald" title="Room for family support">
            About {s$month(demoFamily.familyCapacity)} may be possible within
            the safer range, depending on assumptions.
          </Row>
          <Row tone="navy" title="What changes the number">
            Longer life, higher healthcare inflation, lower returns, or a larger
            bequest target reduce the safer spend.
          </Row>
        </div>

        {/* Conversation */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="font-bold text-enough-navy">Conversation starter</div>
          <p className="text-enough-ink text-sm mt-1 leading-relaxed">
            Our CPF LIFE gives us {s$month(demoFamily.cpfFloor)} for life.
            Spending about {s$month(demoFamily.central)} looks safer. Spending
            much higher means accepting more risk.
          </p>
        </div>

        <p className="mt-5 text-xs text-enough-slate leading-relaxed border-t border-enough-line pt-3">
          Educational simulator only. Not personalised financial advice. No
          product recommendations. No guarantee. Illustrative result based on
          stated assumptions. Discuss this plan with a licensed financial
          adviser before major financial decisions.
        </p>
      </Card>

      <div className="no-print">
        <Link to="/result" className="btn-soft">
          ← Back to results
        </Link>
      </div>

      <Disclaimer tone="soft">
        <span className="no-print">
          Use your browser's Print dialog and choose "Save as PDF" to share this
          report.
        </span>
      </Disclaimer>
    </div>
  );
}

function Row({
  tone,
  title,
  children,
}: {
  tone: "emerald" | "amber" | "navy";
  title: string;
  children: React.ReactNode;
}) {
  const ring =
    tone === "emerald"
      ? "border-l-enough-emerald"
      : tone === "amber"
        ? "border-l-enough-amber"
        : "border-l-enough-navy";
  return (
    <div
      className={`rounded-xl2 border border-enough-line border-l-4 ${ring} p-4`}
    >
      <div className="font-bold text-enough-navy">{title}</div>
      <p className="text-enough-ink text-sm mt-1 leading-relaxed">{children}</p>
    </div>
  );
}
