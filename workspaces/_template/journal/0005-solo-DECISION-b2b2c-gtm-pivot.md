---
type: DECISION
date: 2026-07-12
author: co-authored
project: enough
topic: B2B2C GTM pivot (insurers-at-scale + fee-only IFA), multi-insurer conflict safeguard, and app-review feedback (6 items)
phase: analyze
verified_id: null
person_id: null
display_id: solo
tags:
  [
    gtm,
    business-model,
    b2b2c,
    insurers,
    conflict-of-interest,
    regulatory,
    faa,
    app-review,
    strategy,
  ]
relates_to: 0002-solo-DECISION-align-demo-to-strategy
---

## Decision

Two threads this session: (A) a product-review of the deployed `enough-app`
prototype (6 questions/feedback items), and (B) a go-to-market strategy pivot to
**B2B2C**, with the channel sequence and a multi-insurer conflict-of-interest
safeguard worked out. The GTM decisions are captured to project memory
(`gtm-channel-strategy.md`, `conflict-of-interest-disclosure-model.md`).

### Thread A — App-review feedback (Mr Tan worked example)

The user reviewed the prototype and raised 6 items. Grounded findings from the
code (`src/data/mrTan.ts`, `src/data/demoDataset.ts`, `src/pages/Dashboard.tsx`,
`src/data/withdrawalSequence.ts`) and the briefs (`workspaces/_template/briefs/`):

1. **Lifestyle chooser -> suggested bucket budgets -> planned vs actual** — NOT
   built. App only lets the user type Essential/Healthcare/Discretionary/Family
   (Mr Tan 1,400/600/800/300 = S$3,100 desired). No lifestyle picker, no
   app-suggested budget, no planned-vs-actual comparison. Build request.
2. **Desired spend / Gap-vs-desired objective** — Desired (3,100) is the wanted
   lifestyle; safer (2,150) is the 90%-confidence spend; Gap (S$950) is the
   honesty mechanism. Valid critique: the red gap number has NO attached
   gap-closing actions. Fix = turn the gap into an action ledger (ties to item 5).
3. **Flexible/aspirational buckets under "lifestyle layers"** — brief language
   ("floor is guaranteed; lifestyle layer flexes"), NOT built. Intended 3-layer
   stack: Essentials(Floor, never flexes) / Flexible / Aspirational. Behavioural
   purpose: tell the retiree exactly what's safe vs what flexes in a downturn.
4. **Healthcare & LTC stress test** — barely modelled today (one healthcareSpend
   input + inflation + one sensitivity row). "Health-Shock Buffer" is spec-only.
   Build request: condition-driven (stroke/dementia/cancer/frailty) with three
   cost stacks (acute / ongoing medical / long-term care: helper vs day-care vs
   nursing home), net of MediShield/CareShield/CHAS/Pioneer-Merdeka subsidies,
   fed back into the Monte Carlo confidence.
5. **Funding sequence specificity** — today generic (Cash->SRS->Investments->CPF,
   no amounts, no schemes, no referral). Build request: read actual balances,
   compute partial/full draw amounts + rationale per step, surface government
   schemes (Silver Support, GST-V, MediSave/CHAS, Pioneer/Merdeka, ComCare) for
   the residual, and route the un-closable gap to a licensed adviser / existing
   IFA (neutral referral, not product pitch).
6. **"Options to discuss, not recommended action" + licensing** — this is the
   deliberate FAA-perimeter firewall, not an oversight (`enough-risks-and-
constraints.md` s1.1: advice-vs-information is "the whole ballgame"). Getting
   an FA licence is exactly Phase-2 in the strategy; real undertaking (MAS Digital
   Advisory Services guidelines: algo governance, board oversight, suitability,
   capital) + strategic cost to the neutrality moat. User's call; needs legal
   check (briefs flag several items [VERIFY]).

Build scope (items 1/4/5, and 2 as the smallest) was NOT locked — the user paused
the build-scope question to pursue Thread B. Open clarifications outstanding:
mockup-vs-engine-wired; real-cited vs placeholder SG figures; fixed-condition-menu
vs free-input; generic-vs-named adviser referral (interacts with item 6);
SMU-submission vs real-pilot framing.

### Thread B — GTM pivot to B2B2C

**Trigger:** user surveys of adult children + retirees show LOW willingness to pay
(one-time or lowest monthly tier only). Matches `enough-competitor-analysis.md`
(both neutral SG B2C planning ventures struggled on WTP) and
`enough-risks-and-constraints.md` s4.1 (frugality paradox).

Decisions:

- **Pivot to B2B2C** — the partner pays, not the retiree. Validated by the briefs.
- **Insurers before banks**, and lead the rationale with **incentive ALIGNMENT**
  (insurer economics = selling protection/annuity/LTC; Enough neutrally sizes
  exactly that gap), not just procurement speed. Banks later because a drawdown
  tool is partly anti-aligned with an AUM/deposits business
  (`enough-risks-and-constraints.md` s4.2, verbatim tension).
- **Employer-wellness: DROPPED** — user does not want that direction for now.
  (Revises the briefs, which listed it first.)
- **Fee-only IFA: run IN PARALLEL with insurers-at-scale** — user overrode my
  earlier "sequence IFA first as a wedge" suggestion.
- **Why insurers buy:** warm needs-based leads, persistency/lower-lapse,
  retention at the disengagement moment, MAS FAIR/Balanced-Scorecard suitability
  trail, trust/differentiation halo.
- **Multi-insurer conflict-of-interest safeguard** (if sold to insurer A and B, B's
  FA seeing A's policies could twist/replace them — MAS-regulated mis-selling).
  Resolution = **three-tier disclosure**: (1) bare gap = too thin; (2) coverage
  CHARACTERISTICS (amount/structure/trigger/term, brand redacted) = DEFAULT,
  enough for a suitable complementary recommendation; (3) full line-item + brand =
  replacement advice only, gated behind explicit separate consent (+ MAS
  replacement-disclosure rules). Structural move: the **neutral custodian (Enough)
  holds the whole fact-find** and does the suitability analysis, satisfying MAS
  reasonable-basis/KYC; the FA advises on the characterised gap. Enough stays
  DATA CONTROLLER; insurer is a scoped processor. This is what makes serving
  competing insurers possible at all.
- **Named risk:** the channel can capture the neutrality moat (Enough becomes an
  insurer's lead-gen funnel). Must be a CONTRACT term ("Enough sizes, partner
  fulfils; no partner-branded product push; Enough neutral + data controller") +
  manage single-partner concentration risk.

## Alternatives Considered

- **Stay B2C (subscription/one-time to retirees & adult children)** — rejected:
  survey WTP too low; both neutral SG B2C ventures struggled (competitor analysis).
- **Banks first** — rejected: longer procurement AND anti-aligned incentives
  (drawdown vs AUM).
- **Employer-wellness first** — dropped by user (not the desired direction now).
- **Fee-only IFA as an earlier de-risking wedge before insurers** — overridden;
  run in parallel with insurers-at-scale instead.
- **Consent-only conflict safeguard** — insufficient; consent is the legal floor,
  not the safeguard. Superseded by the three-tier + neutral-custodian model.
- **Get FA-licensed now and give product advice** — deferred to Phase-2; keeps the
  unlicensed decision-support framing for prototype/pilot (user's business/legal
  call).

## Rationale

The pivot and sequence are backed by the user's own primary research + the
competitor/risk briefs, not just intuition. Insurers-first is reframed onto the
stronger (alignment) argument so the deck pre-empts the "why not banks" challenge.
The three-tier disclosure model reconciles the real tension the user surfaced —
an FA cannot give good product advice on a bare gap, but does not need the
competitor's brand to recommend a suitable complement — by moving the
whole-portfolio suitability duty onto the neutral custodian.

## Consequences

- Business model / deck reframes around: insurers-at-scale + fee-only IFA (parallel)
  -> banks endgame; employer-wellness dropped.
- Product implication: FA-facing data views must implement tiered disclosure + audit
  - consent-gated replacement; Enough as data controller.
- App-review build items (1/4/5, +2) remain open pending scope confirmation.
- Regulatory framing (item 6) stays unlicensed decision-support for now; licensing
  is a Phase-2 milestone requiring legal sign-off.

## Follow-Up

- Confirm app build scope (items 1/4/5/2) + the 5 open clarifications.
- Offer: GTM one-pager (beachhead -> scale -> endgame; buyer + value-prop + conflict
  safeguard per channel).
- Any healthcare/LTC/scheme figures added to the app must be real cited SG sources
  for grading defensibility (per user's later decision).

## For Discussion

1. Counterfactual: if an insurer pilot demands that its own products be surfaced to
   its FAs (breaking tier-2 default), does Enough walk away or accept and lose
   neutrality? Where exactly is the contractual red line?
2. The competitor brief rates MoneyOwl (Temasek, free/neutral, with distribution)
   "HIGHEST on positioning". If MoneyOwl adds a decumulation module, does the
   B2B2C-to-insurers plan still hold, or does it accelerate the need to lock
   insurer partners first?
3. Data point: Mr Tan's gap is S$950 on S$190k assets at a 3.8% withdrawal. For a
   less-wealthy retiree the gap would be larger and less closable by drawdown alone —
   does the funding-sequence + government-scheme routing (item 5) actually close it,
   or does it mostly surface an un-closable gap the app then has no answer for?
