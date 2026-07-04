---
type: RISK
date: 2026-07-02
author: agent
project: enough
topic: OneDrive-synced folder mounted in WSL breaks Vite file-watching and dev-server performance
phase: implement
verified_id: null
person_id: null
display_id: solo
tags: [environment, wsl, onedrive, vite, dev-server, tooling]
relates_to: 0002-solo-DECISION-align-demo-to-strategy
---

## Risk Identified

The repo lives at `/mnt/c/Users/.../OneDrive - .../GitHub/enough` — a
**OneDrive-synced Windows folder mounted into WSL**. Two failure modes surfaced:

1. **Stale hot-reload (silent).** Vite's native file-watcher never fires on this
   mount, so the running dev server kept serving an **in-memory copy from before
   the edits**. On-disk files were correct (the production build proved it), but
   the browser showed old pages. This is what made the new screens "not appear."
2. **Pathological restart cost (loud).** Restarting Vite on this mount took ~80s
   to reach "ready" and then would not answer HTTP requests within 20s, with
   system load spiking to ~8–9. On-demand TS transforms re-read source through the
   OneDrive sync layer on every request.

An attempted fix — `server.watch.usePolling` in `vite.config.ts` — made it worse
(polling the whole `node_modules` tree on this mount starves the server) and was
reverted, leaving an explanatory note in the config.

## Likelihood and Impact

- **Likelihood: certain** on this machine/layout — it is a property of the mount,
  not intermittent.
- **Impact: high for the dev loop** — no reliable HMR, painfully slow restarts,
  and (worst) a _silent_ stale-serve that looks like "my changes didn't work."
- No impact on correctness of the code or the production build (both fine).

## Mitigation

- **This session's workaround:** bypass Vite — serve the already-built `dist/` as
  plain static files from native `/tmp` via Python `http.server`. Reliable/fast:
  `http://localhost:8080/enough/` (hash-router; routes show as `#/…`). Verified
  200 + correct asset references. Caveat: serves the _current build_, no auto-update
  on further edits.
- **Permanent fix (recommended, not yet done):** move the working copy off OneDrive
  to a **native WSL path** (e.g. `~/enough-app`) and run `npm run dev` there — normal
  fast HMR. OneDrive should not host an actively-developed Node project.

## Follow-Up

- Decide whether to relocate the repo off OneDrive (biggest quality-of-life win).
- If staying on OneDrive: standardise on "edit → rebuild → static-serve `dist/`"
  for previews, and never trust a long-running dev server to reflect edits.
- Note: the same mount slowness affects any `npm`/`node` operation here (installs,
  builds), not just Vite.

## For Discussion

- Is the OneDrive location deliberate (cloud backup of coursework) or incidental?
  If backup is the goal, git + GitHub already provides it — the working tree does
  not need to be inside OneDrive.
- The stale-serve was _silent_ — it cost real diagnosis time. What's the cheapest
  standing guard? (Restarting the server before every review, or just previewing
  the built `dist/`, both sidestep it.)
- Would a `.vscode`/devcontainer or a one-line `make dev` that clones to `~/` and
  runs there be worth setting up for this project?
