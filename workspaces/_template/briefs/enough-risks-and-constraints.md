# Enough — Key Risks, Constraints & Mitigations

_Companion to enough-proposal.md, enough-feature-spec.md, retiree-needs-research.md.
Compiled 2026-06-30. Purpose: stress-test the idea against real-world constraints so the
submission shows business insight + analytical rigour + feasibility, not just upside.
Regulatory specifics flagged "[VERIFY]" need a primary-source / legal check before the
deck asserts them._

---

## 0. Why this section matters for the grade

A retirement-spending engine makes a promise no other tool makes — "you can safely spend
$X" — and that promise is exactly where the risk concentrates. A grader rewards a team that
can name the ways their own idea breaks and shows it has a credible answer. The thesis of
this document: **Enough is feasible, but only inside a tight envelope — decision-support
positioning, conservative model defaults, and a narrow initial regulatory footprint.** Push
outside that envelope (give individualised product advice, over-claim the confidence number,
count illiquid property as spendable) and the same features become a liability.

The six risk families, ranked by how much they constrain the design:

1. **Regulatory** — defines what Enough is legally allowed to *say*.
2. **Model / technology** — defines whether the number Enough says is *trustworthy*.
3. **Operational** — defines whether Enough can *run and stay calibrated*.
4. **Business-model / market** — defines whether Enough can *make money in Singapore*.
5. **Behavioural / adoption** — defines whether the number actually *changes anything*.
6. **Digital literacy & adoption feasibility** — defines whether the cohort *can and will use the app at all*.

---

## 1. Regulatory & compliance risk (the binding constraint)

### 1.1 The advice-vs-information line is the whole ballgame
Singapore's Financial Advisers Act (FAA), administered by MAS, regulates anyone who gives a
**personalised recommendation** on investment products, life insurance, or CPF
top-ups/transfers. The instant Enough outputs *"you can safely spend $4,200 and you should
top up your CPF to ERS"* calibrated to one person's portfolio, it is arguably providing
**personalised financial advice** — which requires a **Financial Adviser's licence** (or
operating as an exempt entity / representative). A generic educational calculator that
returns factual projections and does **not** recommend a specific product is more defensible
as outside the licensing perimeter. [VERIFY exact perimeter with the FAA + MAS FAQs.]

- **Risk:** Building the full "Your Monthly Paycheck" + "top up CPF" + "insurance gap"
  experience *before* licensing = operating a regulated activity unlicensed. Severe:
  enforcement, reputational, existential.
- **Mitigation (already partly in the proposal's §13 phasing — tighten it):**
  - **Phase 1 — decision-support, not advice.** Frame outputs as *scenario projections and
    education* ("households with this profile have historically been able to spend ~$X at
    90% model confidence"), with no product recommendation, no "you should." Keep CPF and
    insurance features as *illustrative trade-off calculators*, not directives.
  - **Phase 2 — get licensed before personalising.** Apply for the FA licence (or partner
    with/operate under a licensed entity) *before* turning on individualised
    recommendations. MAS's **Guidelines on Provision of Digital Advisory Services (2018)**
    is the specific regime for robo-advice and is the right framework to design to —
    algorithm governance, board/senior-management oversight of the model, client
    suitability, and disclosure of assumptions. [VERIFY current version.]
  - **Cleanest line:** never recommend a *specific* product (a named fund, a named insurer).
    Advise on *the decision shape* ("a larger guaranteed floor raises confidence") and let a
    licensed partner handle product selection. This also protects the neutrality moat.

### 1.2 Insurance recommendations are separately regulated
The Health-Shock Buffer "recommends a buffer / insurance gap." Advising on life/health
insurance adequacy is regulated advice under the FAA. **Mitigation:** present the *gap*
(a number — "a $X long-term-care shock would cut confidence to Y%") without recommending a
product; route the actual product conversation to a licensed adviser/partner.

### 1.3 Data protection (PDPA) + sensitive financial data
Enough ingests a near-complete financial X-ray: CPF, SRS, investments, property, expenses,
family. Under the **Personal Data Protection Act**, this is highly sensitive and a breach is
both a regulatory and trust catastrophe (and "trust is the product").
- **Mitigations:** explicit consent + purpose limitation; data minimisation (only what the
  engine needs); encryption at rest/in transit; clear retention/deletion; consider
  on-device or ephemeral computation for the most sensitive inputs; appoint a DPO; run a
  PDPA impact assessment before launch. Market the privacy posture — it reinforces the
  trust wedge rather than just being overhead.

### 1.4 CPF / Government data access
Enough is only as good as its data, and the best data sits behind Singpass. The realistic
rail is **SGFinDex** (Singapore Financial Data Exchange) — the Singpass-consented network
that aggregates CPF, IRAS, HDB, bank and insurer data. This is a genuine enabler *and* a
gate: **participation typically requires being a regulated/licensed financial institution.**
[VERIFY SGFinDex eligibility + onboarding criteria.]
- **Mitigation / sequencing:** Phase 1 runs on **manual user input + Myinfo basics**
  (lower-friction, no FI status needed); SGFinDex integration is a Phase-2 deliverable that
  *follows* licensing. Don't put SGFinDex on the critical path for the MVP — make it the
  upgrade that the licence unlocks.

### 1.5 Liability if a retiree follows the number and runs short
The deepest reputational risk: a user spends per Enough, markets misbehave, and they run
low at 88. **Mitigations:** (i) conservative defaults (high confidence target, haircuts
below); (ii) prominent "planning estimate, not a guarantee" framing — the glass-box layer
is also a liability shield; (iii) professional-indemnity insurance; (iv) clear T&Cs and
suitability scoping; (v) *guardrails that trim early* rather than letting a plan ride into
trouble. Position as **"the floor is guaranteed; the lifestyle layer flexes"** — never
"guaranteed lifestyle."

---

## 2. Model & technology limitations (the analytical core)

The engine's credibility *is* the product. Each model carries a specific, nameable weakness.
Listing these — and the mitigation — is where the analytical-rigour marks live.

### 2.1 Garbage-in: capital-market assumptions drive everything
Monte Carlo output is only as good as the expected-return, volatility and correlation inputs
(Models 1+2). Small changes in assumed equity premium swing the "safe spend" number
materially. Singapore has comparatively **short, thin local market history**, so bootstrapping
from it under-samples tail events.
- **Mitigations:** use globally-diversified, long-horizon return blocks (not just SG);
  publish the assumptions openly (glass-box); run the number across *multiple* assumption
  sets and show a *range*, not a point; stress-test against 1973/2000/2008 (Model 6 already
  does this — make it load-bearing, not decorative).

### 2.2 False precision — "94% confidence" reads as truth, but it's model-conditional
A probability from a model is **conditional on the model being right** (model risk). Users —
especially anxious retirees — will read "90%" as an objective fact. Over-trust is an ethical
and regulatory hazard; under-delivery destroys the trust moat.
- **Mitigations:** never show a bare number — show it as a *band* with a plain-English caveat
  ("based on these assumptions; markets can always surprise"); avoid implying two-decimal
  precision; the Attribution layer (Model 8) should state *what would move the number*, which
  inherently communicates its softness. **This is the single most important design
  discipline in the product.**

### 2.3 Longevity is idiosyncratic; cohort mortality only covers the average
Lee-Carter (Model 3) projects *population* cohort mortality. An individual's lifespan is
driven by health and family history the model can't see, and the dispersion around the mean
is huge. A "lasts to 95" plan is silent on the person who lives to 100.
- **Mitigation:** plan to a **conservative high-percentile horizon** (e.g. age 95–100) by
  default, with the slider letting users stress further; frame longevity as "we plan for you
  living long, on purpose."

### 2.4 Healthcare / long-term-care costs are fat-tailed and hard to calibrate
SG healthcare inflation has historically outrun CPI, and ILTC/dementia costs have a long,
heavy tail that a buffer poorly captures.
- **Mitigation:** model LTC as an *insurable shock* routed to CareShield Life / private
  cover (gap analysis, not self-funding the whole tail); use conservative healthcare-inflation
  assumptions and surface them.

### 2.5 CPF policy risk — the "guaranteed floor" depends on rules that change
FRS/ERS, payout formulas, CPF interest, and CPF LIFE parameters are **policy variables** that
the Government revises (often annually). The model's floor is only as fixed as today's rules.
- **Mitigation:** treat CPF parameters as a *versioned, externally-maintained config*, not
  hardcoded; show payouts as "under current rules"; build a process to re-calibrate within
  weeks of each CPF/Budget announcement (this is an operational commitment — see §3.2).

### 2.6 Property is illiquid — counting it as spendable is dangerous
The worked example leans on a paid-off HDB. Home equity is not monthly spending money
without downsizing, lease buyback, or reverse arrangements, each with friction and limits.
- **Mitigation:** by default **exclude primary-residence equity from the spendable base**;
  offer it only as an explicit, separately-modelled "unlock" scenario (e.g. Lease Buyback /
  right-sizing) with its own caveats. Over-counting property is the fastest way to a number
  that's wrong in the user's favour.

### 2.7 The AI explanation layer can mis-attribute
The proposal correctly confines AI to *explaining*, never calculating (good — keeps the engine
deterministic and auditable). Residual risk: the LLM narrates a driver incorrectly, eroding
trust precisely where trust is the product.
- **Mitigation:** the attribution math is computed deterministically; the LLM only *verbalises*
  pre-computed drivers from a constrained template; every explanation is traceable to a number
  the user can inspect. Test the explanation layer for faithfulness, not just fluency.

### 2.8 Engine validation
A simulation engine is easy to get subtly wrong (off-by-one in sequencing, mis-stated
confidence, survivorship bias in backtests).
- **Mitigation:** independent backtest validation; reconciliation against published
  safe-withdrawal research; an actuarial review before any "confidence" number ships to a
  real user. Treat the engine as financial-/safety-critical → 100% test coverage on the
  calculation path.

---

## 3. Operational challenges

### 3.1 Data acquisition & integration
Pre-SGFinDex, users must hand-enter CPF, SRS, investments, expenses — high friction, error-prone,
and the elderly target skews low on patience for data entry.
- **Mitigations:** Myinfo pre-fill for basics; sane defaults and ranges; the **adult-child as
  data-entry operator** (flagged in the research pack — likely the real "operator" of the
  account); progressive disclosure so a useful first answer needs minimal input.

### 3.2 Staying calibrated is a permanent operating cost
CPF rules, tax (SRS), healthcare inflation, and market assumptions all drift. A stale model
gives confidently wrong answers.
- **Mitigation:** a standing "calibration owner" function + a versioned assumptions/CPF-rules
  config with a published "last updated" date; an annual re-calibration cycle tied to the
  Budget / CPF announcement calendar. This is a recurring cost, not a one-off — budget for it.

### 3.3 Trust operations & support
A product handling life savings for non-technical seniors needs human-grade support and
extremely clear comms; a confusing screen here is not a UX nit, it's a trust loss.
- **Mitigation:** plain-language everything (the glass-box layer); human support channel;
  conservative, calm defaults; usability-test with actual retirees and their adult children.

### 3.4 Distribution friction (B2B2C)
Bank/insurer sales and compliance cycles are long; integrations are heavy; partners gate hard
on their own risk/compliance.
- **Mitigation:** lead with a standalone B2C/educational MVP to *prove demand and the engine*
  before partner conversations; approach partners where Enough is *complementary* to their
  economics (see §4.2), not threatening.

### 3.5 Talent & build cost
Needs a rare blend: quant/actuarial + regulatory + product + trustworthy AI. Engine compute
(10k-path Monte Carlo, monthly resets per user) is modest but non-zero at scale.
- **Mitigation:** start with a tighter model set (collapse Models 2/3/6 detail into a robust
  core) and expand; pre-compute / cache where the inputs haven't changed; the "8 models" is a
  *narrative* for graders — the *buildable* MVP is Models 1+4+8 (simulate, funded-ratio,
  explain) per the proposal's own Wave-1.

---

## 4. Business-model & market constraints

### 4.1 Willingness to pay — the frugality paradox
Enough's core insight is that retirees under-spend out of fear. Those same fearful, frugal
users are **hard to convert to a paid subscription.** B2C willingness-to-pay among retirees is
a real question, not a given.
- **Mitigation:** keep a genuinely useful free tier (the headline safe-spend estimate);
  monetise the *family* (adult children paying for a parent's plan — higher WTP, they're the
  worried buyer); lean on B2B2C so the *partner* pays, not the retiree (see below). Validate
  WTP directly in the survey instruments already drafted in the research pack.

### 4.2 The neutrality moat is also a distribution barrier
The defensibility thesis (banks/advisers can't be neutral because they earn on products) cuts
both ways: **why would a bank pay for a neutral tool that tells its customers to draw down
assets the bank wants to keep under management or sell products against?**
- **Mitigation:** sell Enough to partners as **engagement, retention and trust** (a
  decumulation tool keeps mass-affluent customers engaged at the moment they'd otherwise
  disengage), and as a **lead-qualifier** for *suitable* products (annuities, LTC cover,
  CPF top-ups) — Enough sizes the need neutrally; the partner fulfils it. Target insurers and
  employer-wellness platforms (clearer alignment) before retail banks. Manage concentration
  risk on any single large partner.

### 4.3 TAM vs the SG-calibration moat — a structural tension
Singapore-only is a **small market**; the deep CPF/SG calibration is the moat **but it does
not travel** — Malaysia/HK/etc. have entirely different retirement systems. Growth requires
re-building the moat per market.
- **Mitigation:** be honest that Phase 1 is a *defensible SG niche*, not a global rocket;
  frame regional expansion as a *replicable methodology* (the engine + a country-calibration
  layer) rather than a copy-paste; for the MBA submission, own the focus — a deep, credible SG
  product beats a shallow pan-Asian claim.

### 4.4 Cold-start on the data network effect
The "every plan improves the model" flywheel (proposal §12) is **weak early** — you can't
claim a data moat with few users, and the core engine is calibrated on public/actuarial data,
not user data.
- **Mitigation:** don't over-claim the network effect in the deck; the early moat is
  **SG-calibration depth + trust positioning + regulatory licence**, not data. The data
  flywheel is a *later* compounding layer, honestly labelled as such.

---

## 5. Behavioural / adoption risk (the "so what" risk)

Even a perfect number may not change behaviour: loss aversion and habit are strong, and a
lifetime of saving doesn't reverse because an app grants "permission to spend."
- **Mitigations:** behavioural design — frame the number as a *paycheck* (already the hero
  feature; income-framing beats balance-framing for spending comfort); guardrails that make
  raising spending feel *safe and reversible*; involve the adult child as a trusted
  co-signer; celebrate the lifestyle, not the balance. Measure the real success metric —
  *did discretionary spending move toward the safe level?* — not just engagement.

---

## 6. Digital literacy & adoption feasibility

Distinct from §5 (will the *number* change behaviour) — this is the prior question: can and
*will* Singaporean retirees use a financial app at all? It is a real, material risk, but a
**designable** one, and Singapore is unusually well-placed among ageing societies. The
analytical key is to split it into two problems with two different fixes — blurring them
produces weak mitigations:

- **Ability** — *can* they physically use it? A UX + onboarding problem.
- **Trust / resistance** — *will* they trust an app with their life savings, or are they
  hesitant and scam-wary? A positioning + security problem.

### 6.1 The Singapore-specific reality
**Reassuring:** Singpass is near-universal, including among seniors (already used for gov
services, health records, payouts) — so consented data-sharing via Myinfo / SGFinDex is a path
seniors already walk; strong public **digital-inclusion machinery** exists to lean on (IMDA
*Seniors Go Digital*, *Digital Ambassadors* 1-to-1 coaching, SG Digital Community Hubs); and
COVID + CDC vouchers + digital payouts already pushed many seniors onto apps with help.
**Cautionary:** the **75+ "old-old"** skew materially lower than the **60–69 "young-old"**;
and **scam-awareness is very high** — seniors are messaged to *distrust* apps asking for bank
details, which is the single biggest source of resistance. [VERIFY current figures via IMDA's
annual digital-society survey + smartphone penetration among 60+.]

### 6.2 Mitigating ABILITY (can they use it?)
- **"One number" simplicity is an accessibility feature, not just the wedge** — a single
  glanceable safe-spend figure suits low digital literacy; resist dashboard creep; large fonts,
  high contrast, accessibility by default.
- **Separate setup from use.** The hard part is one-time setup (data entry), not daily use.
  Design so setup is done once — with help from a family member, an adviser, a bank-branch
  staffer, or an IMDA Digital Ambassador — and everyday use is just "open and look."
- **Minimise typing with consented pre-fill** — Myinfo at MVP, SGFinDex post-licence, auto-pull
  CPF/bank/investment data so the senior barely types. Collapses the biggest literacy barrier.
- **Don't be app-only** — a web version, a printable PDF summary, and a simple monthly digest
  (even SMS/WhatsApp: "Your safe spend this month: $X") meet them on familiar channels.

### 6.3 Mitigating TRUST / RESISTANCE (will they trust it?)
- **Never ask for passwords — use Singpass/Myinfo consented flows.** This is both anti-scam
  best practice and the trust signal a scam-trained senior needs ("we never see your login").
- **Borrow institutional trust** — channel through CPF education, a bank branch, an employer,
  a community centre, or an adviser; trust transfers from the institution to the app.
- **Offer a human backstop / hybrid mode** — a helpline, "call us", or adviser co-pilot mode;
  the research already surfaced "I'd want a person to confirm." Trust transfers from a person.
- **Let the glass-box + neutrality do trust work** — plain-English "why", "no products, no
  commission", visible security/privacy, and aspirational CPF/MAS recognition are exactly the
  credibility a skeptical senior is looking for.
- **Earn trust progressively** — give a useful first answer from rough, non-sensitive inputs
  before asking to connect real accounts; don't demand the full financial X-ray on screen one.

### 6.4 The two strategic moves that keep this feasible
1. **Target the digitally-ready segment first** — the "young-old" (60–69), mass-affluent
   retiree with meaningful non-CPF wealth is both the most digital cohort *and* the segment
   where Enough's value is highest (the §A7 "gap to optimise" group). Serve them first; reach
   the 75+ / lower-literacy cohort later via assisted and institutional channels.
2. **Measure it before betting on it** — Section J of the retiree survey (app comfort,
   will-they-connect-data, need-help-to-set-up, who-actually-uses-it) is a **kill-criterion**.
   A "too risky / only with help" result is not a reason to quit — it sizes the investment in
   assisted onboarding and the human backstop.

**Mitigation, in one line:** consented pre-fill + assisted one-time setup + radical "one number"
simplicity solve *ability*; Singpass-not-passwords + institutional channels + a human backstop +
glass-box neutrality solve *trust*. The bounded cost: onboarding-support and multi-channel spend
you can't skip, and accepting the 75+ cohort as a later, assisted market rather than a day-one
one — a focusing decision, not a weakness.

---

## 7. Consolidated risk register

| # | Risk | Family | Likelihood | Impact | Key mitigation | Residual |
|---|------|--------|:---:|:---:|---|:---:|
| R1 | Unlicensed personalised advice (FAA) | Regulatory | Med | **Critical** | Phase-1 decision-support only; license before personalising | Low |
| R2 | PDPA breach of sensitive financial data | Regulatory | Low | **Critical** | Minimise, encrypt, consent, DPO, PIA | Low |
| R3 | False precision / over-trust in confidence % | Model | **High** | High | Show bands + caveats; never bare number | Med |
| R4 | Wrong capital-market assumptions (GIGO) | Model | Med | High | Diversified blocks, ranges, published assumptions, stress tests | Med |
| R5 | CPF policy change invalidates floor | Model/Ops | Med | Med | Versioned CPF config; fast re-calibration cycle | Low |
| R6 | Property counted as spendable | Model | Med | High | Exclude primary residence by default | Low |
| R7 | Low B2C willingness-to-pay | Business | **High** | High | Free tier + family payer + B2B2C | Med |
| R8 | Partner-incentive conflict blocks B2B2C | Business | Med | High | Sell engagement/retention/lead-qual; target insurers first | Med |
| R9 | Small SG TAM; moat doesn't travel | Business | High | Med | Own the niche; methodology-led expansion | Med |
| R10 | Behaviour doesn't change despite the number | Adoption | Med | High | Paycheck framing, guardrails, family, measure spend-move | Med |
| R11 | Data-entry friction for seniors | Ops | High | Med | Myinfo/SGFinDex pre-fill, assisted one-time setup, defaults (§6.2) | Low |
| R12 | Liability if a user runs short | Regulatory/Ops | Low | High | Conservative defaults, "estimate not guarantee", PI insurance | Low |
| R13 | Digital ability barrier, esp. 75+ (can't / won't use the app) | Adoption | Med | High | Target young-old first; one-number UX; assisted setup; consented pre-fill; multi-channel (§6.2/6.4) | Med |
| R14 | Scam-driven distrust of a financial app | Adoption | High | High | Singpass-not-passwords; institutional channel; human backstop; glass-box + neutrality (§6.3) | Med |

---

## 8. What this means for scope — keeping Enough practical & focused

The analysis converges on a tight, defensible MVP envelope:

1. **Positioning:** decision-support & education first; *advice* only after licensing.
2. **Floor vs lifestyle:** guarantee only the floor (CPF LIFE + conservative withdrawals);
   the lifestyle layer always flexes and is always labelled an estimate.
3. **Model defaults:** conservative (high confidence target, long longevity horizon, property
   excluded, healthcare inflation > CPI, assumptions published).
4. **Feature focus:** Wave-1 = The Floor + Your Monthly Paycheck, powered by the buildable
   core (simulate → funded-ratio → explain). The other models are credibility narrative;
   ship them as the engine earns trust.
5. **Data:** manual + Myinfo at MVP; SGFinDex as the post-licence upgrade.
6. **Monetisation:** free headline number; charge the *family* and the *partner*, not the
   frugal retiree directly.
7. **Honesty in the deck:** name the network-effect cold-start and the SG-only TAM rather than
   overclaiming — graders reward the team that sees its own limits.
8. **Segment & onboarding:** serve the digitally-ready young-old, mass-affluent retiree first;
   reach the 75+ / lower-literacy cohort via assisted and institutional channels (§6.4).

This keeps Enough **feasible** (narrow regulatory footprint, buildable engine), **grounded**
(conservative, real CPF/SG constraints), and **focused** (one wedge, one buildable core), while
the risk register demonstrates the analytical rigour the brief asks for.

---

## 9. Open items to verify before the deck asserts them (evidence discipline)

1. [VERIFY] Exact FAA licensing perimeter for personalised retirement-spending output, and
   whether a generic calculator stays outside it.
2. [VERIFY] Current MAS Guidelines on Provision of Digital Advisory Services (version/year) and
   its safeguards.
3. [VERIFY] SGFinDex eligibility — must a participant be a licensed FI? Onboarding criteria.
4. [VERIFY] Current FRS/ERS/CPF LIFE payout figures and Standard-vs-Escalating indexing (also
   open item #1 in the proposal).
5. [VERIFY] CareShield Life / ElderShield coverage levels for the LTC gap analysis.
6. [VERIFY] PDPA obligations specific to financial data + whether a DPIA is mandatory at our scale.
7. [VERIFY] IMDA digital-readiness / *Seniors Go Digital* statistics + smartphone penetration
   among 60+, to ground §6's digital-literacy claims.
