import { Card, SectionTitle, Disclaimer, Pill } from "../components/ui";

export function Business() {
  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="For partners"
        title="Enough for partners"
        subtitle="A neutral Singapore decumulation engine — distributed through partners for whom neutrality is an asset, never a threat."
      />

      {/* The honest position: wedge, not moat (yet) */}
      <Card className="bg-enough-navy text-white border-0">
        <h3 className="text-white text-xl font-bold">
          A wedge today, a built moat tomorrow
        </h3>
        <p className="text-white/85 mt-2 leading-relaxed max-w-3xl">
          The safe-spend engine is honest, focused table stakes — the defensible
          moat is the licence-gated, family-embedded system-of-record it
          becomes: consented whole-wealth aggregation, tax-aware sequencing, and
          a multi-year household relationship no product-seller can assemble.
        </p>
      </Card>

      {/* Problem + Why now + Why wins */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Block title="The problem" tone="red">
          <p>
            Accumulation is crowded. Decumulation is under-served. No neutral
            player owns the monthly spend decision — banks and advisers earn on
            the products they sell.
          </p>
        </Block>
        <Block title="Why now" tone="amber">
          <ul className="list-disc pl-4 space-y-1">
            <li>Singapore is ageing — 1 in 4 over 65 by 2030.</li>
            <li>CPF LIFE is a floor, not a whole-wealth spending answer.</li>
            <li>
              The public neutral whole-wealth planner (MyMoneySense) exited.
            </li>
            <li>SGFinDex makes consented aggregation possible.</li>
          </ul>
        </Block>
        <Block title="The three that survive" tone="emerald">
          <ul className="list-disc pl-4 space-y-1">
            <li>Neutral, whole-wealth aggregation.</li>
            <li>Native CPF-LIFE / SRS / SG-tax depth.</li>
            <li>The family / adult-child layer (uncontested).</li>
          </ul>
        </Block>
      </div>

      {/* Business model — non-bank B2B2C led + family tier */}
      <Card>
        <h3 className="text-lg font-bold text-enough-navy mb-1">
          Channel: non-bank B2B2C led, family tier on top
        </h3>
        <p className="text-sm text-enough-slate mb-3">
          Flat fees only — never commission or product revenue-share. Enough
          stays the data controller in every deal. Banks last, and only as a
          firewalled neutral rail.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <Channel
            name="Employer-wellness (lead)"
            tone="emerald"
            lines={[
              "Support sandwich-generation staff with ageing parents",
              "Per-employee-per-year (PEPY), flat",
              "Cleanest on neutrality + data",
              "Reaches the adult-child buyer directly",
            ]}
          />
          <Channel
            name="Fee-only IFAs"
            tone="amber"
            lines={[
              "A scalable neutral engine + a glass-box plan to hand clients",
              "Per-adviser seat / month",
              "Co-brandable; Enough keeps engine + data",
            ]}
          />
          <Channel
            name="Insurers + family tier"
            tone="navy"
            lines={[
              "Neutral need-sizing as qualified lead-gen (flat + per-lead)",
              "Never commission on sales",
              "Direct family tier: the adult child pays",
            ]}
          />
        </div>
        <p className="text-xs text-enough-slate mt-3">
          All figures illustrative estimates for an academic proposal. Validate
          pricing units with partner discovery + Van Westendorp before
          committing.
        </p>
      </Card>

      {/* Regulatory + Pilot ask */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Block title="Regulatory path" tone="emerald">
          <ul className="space-y-1.5">
            <li>Phase 1 — decision-support & education only.</li>
            <li>No product recommendation, no "you should".</li>
            <li>No "MAS-approved" claim; no guarantee.</li>
            <li>
              Get the MAS Financial Adviser licence before personalising — it's
              plausibly a Wave-1 critical-path item (it gates the moat).
            </li>
          </ul>
        </Block>
        <Block title="Pilot ask" tone="navy">
          <ul className="space-y-1.5">
            <li>One employer-wellness or fee-only IFA partner.</li>
            <li>Sandwich-generation staff with ageing parents.</li>
            <li>
              Measure connected plans, safe-spend adoption, family engagement.
            </li>
            <li>Goal: prove the number, build the family flywheel.</li>
          </ul>
        </Block>
      </div>

      <Card className="bg-enough-navy text-white border-0 text-center">
        <div className="text-xl md:text-2xl font-bold text-enough-emerald">
          Out-focus MoneyOwl. Out-neutral DBS. Own the family.
        </div>
        <p className="text-white/70 text-sm mt-2">
          Educational decision-support only. Not personalised financial advice.
          No product recommendations. No guarantee. Not affiliated with CPF
          Board or MAS.
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
      <div className="flex items-center justify-between gap-2">
        <div className="text-base font-extrabold text-enough-navy">{name}</div>
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
