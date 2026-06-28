import { Card, SectionTitle, Disclaimer, Pill } from "../components/ui";

export function Business() {
  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="For partners"
        title="Enough for partners"
        subtitle="A Singapore decumulation engine for banks, insurers, and advisers."
      />

      {/* Problem + Why now + Why wins */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Block title="The problem" tone="red">
          <p>
            Accumulation is crowded. Decumulation is under-served. No incumbent
            owns the monthly spend decision.
          </p>
        </Block>
        <Block title="Why now" tone="amber">
          <ul className="list-disc pl-4 space-y-1">
            <li>Singapore is ageing.</li>
            <li>
              CPF LIFE is important but incomplete as a total spending answer.
            </li>
            <li>Healthcare-cost anxiety is rising.</li>
            <li>Older Singaporeans are more digitally reachable.</li>
            <li>Banks and insurers need retirement engagement tools.</li>
          </ul>
        </Block>
        <Block title="Why Enough wins" tone="emerald">
          <ul className="list-disc pl-4 space-y-1">
            <li>Decumulation-first.</li>
            <li>CPF-aware.</li>
            <li>Singapore-calibrated.</li>
            <li>Family-aware.</li>
            <li>Transparent about uncertainty.</li>
            <li>Product-neutral.</li>
          </ul>
        </Block>
      </div>

      {/* Business model */}
      <Card>
        <h3 className="text-lg font-bold text-enough-navy mb-3">
          Business model
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Channel
            name="B2B2C (first)"
            tone="emerald"
            lines={[
              "Banks, insurers, wealth managers",
              "S$2–5 per active user / month",
              "Partner distributes, reducing CAC",
              "Value: retention, engagement, adviser follow-up",
            ]}
          />
          <Channel
            name="B2B adviser SaaS (later)"
            tone="amber"
            lines={[
              "Per adviser seat",
              "S$50–100 per adviser / month",
              "Used in live client meetings",
            ]}
          />
          <Channel
            name="B2C premium (later)"
            tone="navy"
            lines={[
              "S$60–120 per year",
              "Family report and annual updates",
              "Higher CAC — later phase",
            ]}
          />
        </div>
        <p className="text-xs text-enough-slate mt-3">
          All figures illustrative estimates for an academic proposal.
        </p>
      </Card>

      {/* Regulatory + Pilot ask */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Block title="Regulatory path" tone="emerald">
          <ul className="space-y-1.5">
            <li>Start as an education calculator.</li>
            <li>No product recommendation.</li>
            <li>No "MAS-approved" claim.</li>
            <li>
              Personalised advice only through a licensed partner or appropriate
              licence.
            </li>
            <li>Subject to legal review before commercial launch.</li>
          </ul>
        </Block>
        <Block title="Pilot ask" tone="navy">
          <ul className="space-y-1.5">
            <li>One bank or insurer partner.</li>
            <li>Retirement-age customer cohort.</li>
            <li>
              Measure completed plans, report downloads, engagement, adviser
              follow-up.
            </li>
            <li>Goal: prove the number, then scale the floor.</li>
          </ul>
        </Block>
      </div>

      <Card className="bg-enough-navy text-white border-0 text-center">
        <div className="text-xl md:text-2xl font-bold text-enough-emerald">
          Pilot one partner, prove the number, scale the floor.
        </div>
        <p className="text-white/70 text-sm mt-2">
          Educational simulator only. Not personalised financial advice. No
          product recommendations. No guarantee. Not affiliated with CPF Board
          or MAS.
        </p>
      </Card>

      <Disclaimer tone="soft">
        Market and unit-economics figures are illustrative estimates for an
        academic proposal.
      </Disclaimer>
    </div>
  );
}

function Block({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "emerald" | "amber" | "red" | "navy";
  children: React.ReactNode;
}) {
  return (
    <Card>
      <Pill tone={tone}>{title}</Pill>
      <div className="mt-3 text-sm text-enough-ink space-y-1.5">{children}</div>
    </Card>
  );
}

function Channel({
  name,
  tone,
  lines,
}: {
  name: string;
  tone: "emerald" | "amber" | "navy";
  lines: string[];
}) {
  return (
    <div className="rounded-xl2 border border-enough-line p-4">
      <div className="flex items-center justify-between">
        <div className="text-lg font-extrabold text-enough-navy">{name}</div>
        <Pill tone={tone}>channel</Pill>
      </div>
      <ul className="mt-2 space-y-1 text-sm text-enough-ink">
        {lines.map((l) => (
          <li key={l} className="flex gap-2">
            <span className="text-enough-emerald">•</span>
            <span>{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
