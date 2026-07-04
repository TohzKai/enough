---
type: GAP
date: 2026-07-02
author: agent
project: enough
topic: All session work is uncommitted; the deployed Pages demo still runs old main
phase: implement
verified_id: null
person_id: null
display_id: solo
tags: [git, deploy, github-pages, uncommitted, enough-app]
relates_to: 0002-solo-DECISION-align-demo-to-strategy
---

## What Is Missing

None of this session's work has been committed or pushed:

- `enough-app/src/lib/format.ts` (the blank-page fix, entry 0001).
- The full strategy-alignment change set (entry 0002): `data/aggregation.ts`,
  `data/withdrawalSequence.ts`, `data/guardrails.ts`, `data/familyPlane.ts`,
  `store/viewMode.tsx`, `pages/Family.tsx`, and edits to `mrTan.ts`,
  `demoDataset.ts`, `main.tsx`, `App.tsx`, `Layout.tsx`, `Home.tsx`, `Inputs.tsx`,
  `Dashboard.tsx`, `Business.tsx`, `vite.config.ts`.
- The `briefs/enough-session-record-2026-07-02.md` narrative and these journal
  entries.

Separately, the working tree already carried ~1,574 unrelated modified files
(mostly `.claude/**`) from before this session.

## Why It Matters

- **The public demo is still broken.** `tohzkai.github.io/enough/` deploys from
  `main` on push when `enough-app/**` changes. Until this is pushed, the live site
  serves the pre-fix, pre-alignment build — i.e. the blank-page bug and the old
  content are what anyone visiting the URL sees.
- Uncommitted work on a OneDrive/WSL mount is at higher-than-usual risk (sync
  conflicts, accidental overwrite) than work that is committed and pushed.
- The large pre-existing `.claude/**` diff means a naive `git add -A` would sweep
  unrelated changes into the commit — staging must be scoped.

## How to Resolve

1. Decide scope of the commit. Recommended: stage **only** `enough-app/**` (the
   app changes) plus the new `workspaces/_template/briefs` + `journal` files —
   explicit paths, not `git add -A`, to avoid sweeping the 1,574-file `.claude/**`
   drift.
2. Commit on a branch (repo protects `main`), open a PR, merge — or, if direct
   push is permitted for this personal repo, commit to `main` and push.
3. The push triggers the Pages workflow → the live demo updates to the aligned,
   non-blank app. Verify the deployed bundle hash changed and the site renders.
4. Separately decide what to do with the pre-existing `.claude/**` drift (out of
   scope for this app work).

## For Discussion

- Should the `.claude/**` drift be committed, discarded, or left alone? It predates
  this session and its provenance is unknown — worth a `git status`/`git diff`
  review before any bulk action.
- Is direct-to-`main` acceptable for this coursework repo, or should even solo work
  go through a PR (which also gets a CI build that would have caught the missing
  `format.ts`)?
- The narrative session record and these journal entries duplicate content by
  design (readable overview vs typed/searchable trail). Keep both, or retire the
  session record once the journal is the source of truth?
