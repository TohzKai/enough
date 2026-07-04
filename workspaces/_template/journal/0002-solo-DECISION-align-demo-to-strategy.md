---
type: DECISION
date: 2026-07-02
author: co-authored
project: enough
topic: Align the demo app with the strategy briefs (numbers, framing, moat pillars A–E, dual view)
phase: implement
verified_id: null
person_id: null
display_id: solo
tags:
  [
    strategy-alignment,
    frontend,
    moat,
    singpass,
    sgfindex,
    family-tier,
    enough-app,
  ]
relates_to: 0001-solo-DISCOVERY-blank-page-missing-format-lib
---

## Decision

Rebuild the `enough-app` demo so it visibly demonstrates the strategy in the
briefs, rather than a generic "safe-spend calculator." Scope (user-directed):
re-anchor the numbers; reframe messaging away from the engine/"8 models" toward
neutrality + CPF-native depth + the family layer; add a **Parent view** and an
**Adult-child view**; show **Singpass/SGFinDex** aggregation instead of manual
key-in; show **tax- & longevity-aware withdrawal sequencing** across
CPF/SRS/cash/investments; **recommend CPF top-ups**; demonstrate **dynamic
guardrails + longitudinal learning**; build the **family tier** (permissioned
retiree/spouse/adult-child plane with a co-signer flow); honour the moat doc's
"what to cut/avoid"; and confirm the moat "three to build deeply" (A/B/C) are
shown.

Treated the app as a **presentation-grade prototype**: new capabilities shown
with realistic, clearly-labelled illustrative data; the live Monte Carlo engine
retained for custom plans; regulatory discipline preserved (decision-support,
"estimate not guarantee", no product recommendations).

### What was built

- **Numbers** re-anchored to the proposal §8 worked example: Mr Tan CPF LIFE
  **S$1,550/mo**, **S$190,000** spendable (cash 40k / investments 130k / SRS 20k),
  paid-off 4-room HDB, desired **S$3,100**, safer **S$2,000–2,350** (central
  **S$2,150**, ~**90%** confidence). Updated `mrTan.ts`, `demoDataset.ts`, the
  `isMrTan()` detector, and chart reference lines; swept for stray old numbers
  (none remain).
- **Moat A** (aggregation): new `data/aggregation.ts` + a Singpass→SGFinDex
  consented-pull flow on the **Connect** page (manual entry kept as fallback).
- **Moat B** (sequencing): new `data/withdrawalSequence.ts` + a "which account to
  spend first" section + CPF top-up decision-shapes on **Results**.
- **Moat C+D** (guardrails + learning): new `data/guardrails.ts` + a guardrail-now
  card, bands, and a learning timeline on **Results**.
- **Moat E** (family tier): new `data/familyPlane.ts` + a new **Family** page —
  roles (owner/operator/viewer) + co-signer flow + parent-centric guarantee.
- **Dual faces**: new `store/viewMode.tsx` (Parent vs Adult-child) + a header
  toggle; wired `ViewModeProvider` in `main.tsx`.
- **Framing**: reframed **Home** and **For partners** (`Business.tsx`) — neutrality
  moat, non-bank B2B2C-led, flat fees never commission, wedge-not-moat honesty.
- Routing/nav updated (`App.tsx`, `Layout.tsx`).

## Alternatives Considered

- **Only fix the numbers**, leave features as-is — rejected: the user explicitly
  asked for the moat pillars and dual views to be _shown_, not just re-priced.
- **Build a real SGFinDex / tax-sequencing engine** — rejected as out of scope and
  regulated; a labelled illustrative prototype is the correct demo altitude and
  matches the risk doc's "decision-support, not advice" line.
- **Use subagents to parallelise** — not used; the user did not request it and the
  work was a single coherent presentational pass.

## Rationale

- The competitor/moat analysis is explicit that the **engine is commoditised** and
  the defensible differentiation is neutrality + CPF-native depth + the family
  layer — so the demo should lead with those, not "8 models."
- The "three to build deeply" (A account aggregation, B sequencing, C+D guardrails
  - learning) and the family tier (E) are the strategy's core product bets; a demo
    that shows them is far more persuasive than one that only prices a number.

## Consequences

- Verified: `tsc -b` clean; production build passed (858 modules); the built
  bundle grep-confirmed to contain the new features.
- **Cut/avoid honoured**: no "8 models" as the product, no extra calculator tabs,
  **no data-network-effect claim**, no gamification, AI kept explaining-only, PDF
  report kept a nicety not the headline.
- Adds surface area (new pages/data/roles) but no new load-bearing engine logic —
  it is presentational.
- The in-browser visual walk was NOT completed this session (blocked by the
  environment issue — see the RISK entry).

## For Discussion

- The proposal's figures are themselves flagged "illustrative; to be verified"
  (CPF FRS/ERS, SGFinDex eligibility). Should the demo carry an explicit
  "figures illustrative / to be verified" banner so a sharp grader isn't misled?
- The dual-view split gates the heavy analytics (sensitivity, sequence-risk,
  learning) to the Adult-child view. Is that the right division, or should the
  parent also see the sequence-risk explanation (it's core to "why bad markets
  early hurt")?
- SGFinDex access is UNVERIFIED for a non-licensed-FI (risk doc §1.4). The demo
  shows it as a prototype — is that honest enough, or should the Connect page
  state the licensing dependency more prominently than the current small note?
