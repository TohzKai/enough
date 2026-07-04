---
type: DISCOVERY
date: 2026-07-02
author: agent
project: enough
topic: Blank front end caused by a never-committed src/lib/format.ts
phase: implement
verified_id: null
person_id: null
display_id: solo
tags: [frontend, vite, bug, enough-app]
relates_to:
---

## What Was Discovered

The `enough-app` front end rendered completely blank. The Vite dev log showed
`Failed to resolve import "../lib/format"` from three pages — `Dashboard.tsx`,
`Inputs.tsx`, and `FamilyReport.tsx`. The file `enough-app/src/lib/format.ts`
**never existed** — it is absent from git history entirely, not merely
uncommitted. Three pages imported number/currency formatters from it, so the
unresolved import crashed the whole SPA to a blank page.

## Why It Matters

- A single missing shared module took down the entire app — the failure was
  total (blank page), not localised to one screen.
- The same bug is almost certainly present on the deployed GitHub Pages demo
  (`tohzkai.github.io/enough/`), since the missing file was never committed.
- It masked the real work: nothing else about the app could be evaluated until
  this resolved.

## Follow-Up

- Recreated `src/lib/format.ts` with the exact exports the pages consume:
  `s$`, `formatMoney` (`S$1,400`), `s$month` / `formatMoneyMonth` (`S$1,400/mo`),
  `formatDeltaMonth` (`+S$110/mo` / `−S$180/mo`), `pct(fraction, digits)`
  (`0.036 → 3.6%`), `pctRaw(value)` (`92 → 92%`). Semantics inferred from the
  call sites and the demo data scales (whole SGD dollars; percentage vs fraction
  inputs).
- Verified: imports resolve, `tsc -b` clean.
- **Still uncommitted** — see the GAP entry on uncommitted work; the live demo
  stays broken until pushed.

## For Discussion

- Why was `format.ts` never committed — was it `.gitignore`d, lost in a move, or
  authored only in a previous session's memory? A `git log --all -- '**/format*'`
  returned nothing, so the file was likely never saved at all.
- The three importing pages compiled locally against a file that didn't exist —
  what would have caught this earlier? (A CI build step on push would have: the
  production build fails hard on the unresolved import.)
- Are there other "phantom" shared modules imported-but-never-committed? A sweep
  of `src/**` imports against on-disk files would confirm none remain.
