# Enough — Session Record / Journal (2026-07-01 → 2026-07-02)

_Record of the working session on the **Enough** app (CPF-calibrated retirement-
decumulation prototype for Singapore). This session was hands-on CODE + environment
work on the `enough-app/` frontend, plus MCP setup and a full strategy-alignment build.
Companion to the strategy docs in `workspaces/_template/briefs/` (proposal, research
pack, moat, competitor, risks, adult-children, feature-spec) and to the prior
`enough-session-record-2026-07-01.md`._

---

## 0. What the session covered (agenda, in order)

1. Explained the `/mcp` command; connected the Gmail / Google Calendar / Google Drive
   MCP connectors.
2. `git pull` + merge request — determined there was nothing to merge.
3. Provided the demo product URL (GitHub Pages).
4. Fixed a **blank front end** (a missing source file).
5. Read the ten strategy/research brief files and summarised them; flagged app↔strategy
   number drift.
6. **Aligned the demo with the strategy** — a large frontend build (the main deliverable).
7. Diagnosed why the new pages "weren't showing" (a stale dev server on a OneDrive/WSL
   mount) and served the built app reliably.
8. Wrote this session record.

---

## 1. MCP connectors

- `/mcp` is a built-in Claude Code command (interactive panel) — not something the agent
  runs. Three claude.ai-managed connectors were configured: **Gmail**, **Google
  Calendar**, **Google Drive**. Their OAuth can only be completed from the `/mcp` panel.
- User authenticated all three successfully ("Authentication successful. Connected to
  claude.ai Gmail / Google Calendar / Google Drive"). Their data tools are now available.

## 2. Git state

- Branch `main`, tracking `origin/main` (github.com/**TohzKai/enough**). After `git fetch`,
  local and remote were **already even** (`0 0`) — **nothing to pull or merge**.
- The working tree carried **1,574 modified files**, all uncommitted and local-only
  (mostly `.claude/**`). A pull does not touch them. No destructive git ops were run.

## 3. Demo product URL

- Canonical demo (from `.github/workflows/deploy-pages.yml` + `vite.config.ts` base
  `/enough/`): **https://tohzkai.github.io/enough/** — GitHub Pages, built from
  `enough-app/`, deploys on push to `main` when `enough-app/**` changes.
- A Vercel target also exists in config (base `/`) if deployed there.

## 4. Blank-front-end fix (missing `src/lib/format.ts`)

- **Symptom:** the app rendered blank; Vite error `Failed to resolve import "../lib/format"`
  from `Dashboard.tsx`, `Inputs.tsx`, `FamilyReport.tsx`.
- **Root cause:** `enough-app/src/lib/format.ts` **never existed** (not in git history) —
  three pages imported number/currency formatters from it.
- **Fix:** created `src/lib/format.ts` with the exact exports the pages use:
  `s$`, `formatMoney` (→ `S$1,400`), `s$month`, `formatMoneyMonth` (→ `S$1,400/mo`),
  `formatDeltaMonth` (→ `+S$110/mo` / `−S$180/mo`), `pct(fraction, digits)` (0.036 → `3.6%`),
  `pctRaw(value)` (92 → `92%`). Verified: imports resolve, `tsc` clean.

## 5. Reading the strategy briefs

Read all ten files under `workspaces/_template/briefs/`:
`enough-proposal.md`, `retiree-needs-research.md`, `enough-feature-spec.md`,
`enough-moat-and-differentiation.md`, `enough-competitor-analysis.md`,
`enough-risks-and-constraints.md`, `enough-research-pack.md`,
`enough-adult-children-research.md`, `enough-adult-children-interview-guide.md`,
`enough-session-record-2026-07-01.md`.

Throughline: **lead with neutrality + CPF-native depth + the family layer** (not the
engine / "8 models"); **monetise the family + non-bank B2B2C partners**, not the frugal
retiree; **stay decision-support until MAS-licensed**.

**Drift flagged:** the built app used **Mr Tan CPF LIFE S$950 / S$150,000 assets**, while
the proposal (§8) specifies **CPF LIFE ~S$1,550 / ~S$190,000 / paid-off 4-room HDB**.

---

## 6. THE MAIN DELIVERABLE — aligning the demo with the strategy

Goal (verbatim from the user): align demo numbers, features and framing; add a **parent
view and an adult-child view**; show **Singpass/SGFinDex** aggregation instead of manual
key-in; show **tax- & longevity-aware withdrawal sequencing** across CPF/SRS/cash/
investments; **recommend top-ups**; demonstrate **dynamic guardrails + longitudinal
learning**; build the **family tier** (permissioned retiree/spouse/adult-child plane with a
co-signer flow); honour the moat doc's **"what to cut/avoid"**; and confirm the "three to
build deeply" **A, B, C** are shown.

Treated as a **presentation-grade prototype** — new capabilities shown with realistic,
illustrative, clearly-labelled data; the live Monte Carlo engine retained for custom plans;
regulatory discipline kept (decision-support, "estimate not guarantee", no product
recommendations).

### 6.1 Numbers re-anchored (proposal §8)

- **Mr Tan:** CPF LIFE **S$1,550/mo** (Standard, level nominal), **S$190,000** spendable
  (cash 40k / investments 130k / SRS 20k), paid-off 4-room HDB, spouse included, desired
  **S$3,100/mo**, safer spend **S$2,000–2,350** (central **S$2,150**, ~**90%** confidence,
  ~3.8% initial withdrawal).
- Updated `src/data/mrTan.ts`, `src/data/demoDataset.ts` (curve, sensitivity, sequence-risk,
  family capacity), the `isMrTan()` detector, and the chart reference lines
  (1550 / 2150 / 3100). Swept — **no stray old numbers (950/1400/2350)** remain in
  pages/components.

### 6.2 New data modules

- `src/data/aggregation.ts` — **Moat A**: consented Singpass/SGFinDex account list + pull
  steps + spendable total (property excluded).
- `src/data/withdrawalSequence.ts` — **Moat B**: 4-step drawdown order (cash buffer → SRS in
  10-yr window → investments → CPF last) + **CPF top-up / ERS decision shapes**.
- `src/data/guardrails.ts` — **Moat C+D**: guardrail bands, the current "raise available"
  steer, and a longitudinal-learning timeline.
- `src/data/familyPlane.ts` — **Moat E**: roles (owner/operator/viewer), co-sign requests,
  adult-child alerts; parent-centric guarantee baked in.

### 6.3 Dual faces

- `src/store/viewMode.tsx` — global **Parent view / Adult-child view** context (persisted).
  Toggle added to the header. Parent = one calm number; Child = oversight alerts + deeper
  analytics + co-sign CTAs. Wired `ViewModeProvider` in `main.tsx`.

### 6.4 Pages

- **Home** (`Home.tsx`) — reframed to "neutral co-pilot"; three differentiators
  (neutral whole-wealth / CPF-native depth / family layer); view-aware hero.
- **Connect** (`Inputs.tsx`, nav relabelled) — **Singpass → SGFinDex** consented-pull flow
  (animated steps → aggregated accounts → spendable + floor), with the **manual form kept as
  a labelled fallback**.
- **Results** (`Dashboard.tsx`) — dual-view; "monthly paycheck" hero; **guardrail-now** card
  (S$2,150 → S$2,350) + bands; **withdrawal sequencing** section; **top-up levers**; the
  spend-confidence curve; Adult-child view adds sensitivity, sequence-risk and the
  **learning timeline**.
- **Family** (`Family.tsx`, new route `/family`) — the **permissioned plane** (Mr Tan owner /
  Mrs Tan viewer / Wei Ling operator) + **co-signer flow** + parent-centric notes.
- **Family Report** moved to `/report` (printable, numbers auto-updated).
- **For partners** (`Business.tsx`) — reframed: **non-bank B2B2C-led** (employer-wellness →
  fee-only IFAs → insurers), **flat fees never commission**, Enough stays data controller,
  banks last & firewalled, wedge-not-moat honesty.
- Routing (`App.tsx`) + nav (`Layout.tsx`) updated (Home / Connect / Results / Family).

### 6.5 Moat checks the user asked for

- **A / B / C shown:** A = Connect page (SGFinDex aggregation); B = "which account to spend
  first" sequencing; C+D = guardrail-now + bands + learning timeline. ✓
- **"Cut / avoid" (moat §4) honoured:** no "8 models" as the product, no extra calculator
  tabs, **no data-network-effect claim anywhere**, no gamification, AI kept **explaining-only**
  (guardrail/attribution described as deterministic), family PDF report kept a nicety not the
  headline.

### 6.6 Verification

- `tsc -b` clean (exit 0); **production build passed** (`npm run build`, 858 modules, exit 0;
  only the pre-existing recharts chunk-size advisory).
- The built bundle in `dist/` was grep-confirmed to contain the new strings ("Connect with
  Singpass", "Which account to spend first", "Adult-child view", "family plane", "SGFinDex",
  "Guardrail").
- **Not yet done:** the literal in-browser visual walk (blocked by the environment issue in §7).

---

## 7. Environment issue — stale dev server on a OneDrive/WSL mount

- **Why the new pages "didn't show":** the running Vite dev server was serving a **stale
  in-memory copy from before the edits**. The project lives on a **OneDrive-synced folder
  mounted in WSL**, where Vite's native file-watcher never fires — so no hot reload. The files
  on disk were correct (the production build proved it); the server just never re-read them.
- Restarting Vite on this mount is **pathologically slow** (~80s to "ready", requests not
  answering, load spiking) because it re-reads/transforms source through the OneDrive sync
  layer on every request. A `usePolling` config made it worse (starves on `node_modules`) and
  was reverted (a note left in `vite.config.ts`).
- **Resolution:** bypassed Vite — served the already-built `dist/` as **plain static files
  from native `/tmp`** via Python's `http.server`. Reliable and fast:
  **http://localhost:8080/enough/** (hash-router; routes show as `#/…`). Verified 200 +
  correct asset references + JS 200.

---

## 8. Outstanding / next steps

- **Everything is uncommitted** — `src/lib/format.ts`, all the alignment changes
  (data modules, viewMode store, 6 pages, routing/nav, main.tsx), and the `vite.config.ts`
  note. **Offered to commit + push** (which also deploys the aligned app to the public Pages
  URL `tohzkai.github.io/enough/`). **Not yet done — awaiting the user.**
- **The deployed Pages site still reflects old `main`** (blank-page bug + pre-alignment
  content) until the above is pushed.
- **Proper local dev loop:** the real fix for fast HMR is **moving the project off OneDrive**
  to a native WSL path (e.g. `~/enough-app`). Offered; not yet done.
- **In-browser visual walk** of the aligned app still to be done by the user (§6.6).
- Static-server caveat: `http://localhost:8080/enough/` serves the **current build**; it will
  not auto-update on further edits (would need a rebuild).

## 9. Files created / modified this session (`enough-app/`)

- **Created:** `src/lib/format.ts`, `src/data/aggregation.ts`,
  `src/data/withdrawalSequence.ts`, `src/data/guardrails.ts`, `src/data/familyPlane.ts`,
  `src/store/viewMode.tsx`, `src/pages/Family.tsx`.
- **Modified:** `src/data/mrTan.ts`, `src/data/demoDataset.ts`, `src/main.tsx`,
  `src/App.tsx`, `src/components/Layout.tsx`, `src/pages/Home.tsx`, `src/pages/Inputs.tsx`,
  `src/pages/Dashboard.tsx`, `src/pages/Business.tsx`, `vite.config.ts`.

_End of session record._
