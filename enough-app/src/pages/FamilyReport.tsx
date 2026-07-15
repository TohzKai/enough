import { Link } from "react-router-dom";
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

export function FamilyReport() {
  const handlePrint = () => window.print();
  // Illustrative safer-spend impact magnitudes (Mr Tan sample) — single source
  // of truth shared with the Results-page stress-test cards.
  const stressMag = (key: string) =>
    Math.abs(
      lifeEventStressTests.find((t) => t.key === key)?.impactMonthly ?? 0,
    );
  const layers = layerTotals(DEFAULT_LIFESTYLE);
  const { actuals } = useSpend();
  const totalActual = totalLifestyle(actuals);
  const overUpper = Math.max(0, totalActual - demoMrTan.saferUpper);

  return (
    <div className="space-y-5">
      <div className="no-print">
        <SectionTitle
          kicker="For the kitchen table"
          title="Family report"
          subtitle="A calm, one-page summary to discuss at home. Plain language, product-neutral advice."
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
            Planning advice · you decide
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
            <div className="text-white/60 text-sm pb-1">/month</div>
          </div>
          <div className="mt-1 text-sm text-enough-emerald font-semibold">
            Central estimate: {s$month(demoMrTan.saferCentral)} at{" "}
            {formatConfidence(demoMrTan.confidence / 100)}
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
              /month
            </span>
          </div>
          <div className="text-xs text-enough-slate mt-1">
            {cpfWording.floor}
          </div>
        </div>

        {/* Lifestyle layers */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="text-sm font-semibold text-enough-slate">
            Lifestyle spending
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            Essentials {formatMoneyMonth(layers.essential)} · Flexible{" "}
            {formatMoneyMonth(layers.flexible)} · Aspirational{" "}
            {formatMoneyMonth(layers.aspirational)} · Total{" "}
            {formatMoneyMonth(layers.total)}.
          </p>
        </div>

        {/* Healthcare & care shock */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="text-sm font-semibold text-enough-slate">
            Healthcare & care shock
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            A care shock (for example, extra care cost for a few years) may
            reduce safer spend by about{" "}
            {formatMoneyMonth(stressMag("healthcare"))}. Ways to cover it: cash
            buffer, family support, public or community schemes, or a referral
            to an insurer, IFA, or your existing adviser.
          </p>
        </div>

        {/* Bequest */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="text-sm font-semibold text-enough-slate">Bequest</div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            A {formatMoney(50000)} bequest target may reduce safer spend by
            about {formatMoneyMonth(stressMag("bequest"))}. A bequest is not
            rejected — Enough shows the monthly trade-off.
          </p>
        </div>

        {/* Crisis guardrail */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="text-sm font-semibold text-enough-slate">
            Market downturn guardrail
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            A severe downturn may move the plan to the Amber zone — the model
            suggests trimming discretionary spending by 5% to 10% until
            confidence recovers. This is a scenario test, not market timing.
          </p>
        </div>

        {/* Current spending check */}
        <div className="mt-5 rounded-xl2 border border-enough-line p-4">
          <div className="text-sm font-semibold text-enough-slate">
            Current spending check
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            Actual {formatMoneyMonth(totalActual)} vs safer range{" "}
            {formatRangeMonth(demoMrTan.saferLower, demoMrTan.saferUpper)}.
            {overUpper > 0
              ? ` About ${formatMoneyMonth(overUpper)} above the upper safer range — review discretionary and travel buckets first.`
              : " Within the safer range."}
          </p>
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
          Neutral financial planning advice (pursuing MAS FA licensing). We
          advise the decision, not a specific product. Estimates, not guarantees
          — illustrative result based on stated assumptions. Think it through
          and make your own call before major financial decisions.
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
