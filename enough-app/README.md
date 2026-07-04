# Enough — Singapore Retirement Spending Simulator

> **How much can I _really_ spend?**

Enough is an educational **retirement decumulation simulator** for Singapore. It answers
the question that matters most in retirement — _how much can I safely spend every month
without outliving my money?_ — by treating **CPF LIFE as a longevity floor** and running
the investable assets above that floor through a Monte Carlo simulation.

Enough is **not** a robo-adviser, an investment platform, a CPF Board tool, a MAS-approved
tool, or personalised financial advice. It makes **no product recommendations**.

Built for **SMU FNCE6041 Financial Analytics and Innovation**.

---

## User flow

A calm, four-step consumer journey:

**Home → Build Plan → Results → Family Report**

A fifth, secondary route — **For Partners** (`/partners`) — is for optional
business/class discussion and is reachable only via a small footer link.

### Routes

| Route       | Page          | Purpose                                               |
| ----------- | ------------- | ----------------------------------------------------- |
| `/`         | Home          | Product positioning + "Start my plan"                 |
| `/plan`     | Build Plan    | Enter retiree profile, CPF LIFE, assets, spending     |
| `/result`   | Results       | Safer spend range, spend-confidence curve, drivers    |
| `/family`   | Family Report | Printable, plain-English report for the family        |
| `/partners` | For Partners  | Secondary: problem, model, regulatory path, pilot ask |

---

## How to run

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build into dist/
npm test         # run the engine unit tests (Vitest)
```

A clean install builds and tests from scratch:

```bash
rm -rf node_modules dist
npm install
npm run build
npm test
```

**No backend, no login, no external APIs.** Plan inputs persist in the browser's
`localStorage`; the sample profile is deterministic and reproducible.

---

## How to demo in class (3–5 minutes)

1. **Home** — the thesis: "how much can I safely spend?"
2. **Build Plan** → click **"Load sample profile"** (loads the Mr Tan example, Base case).
3. Click **"Calculate safer spend"** → land on **Results**.
4. **Results** — read the safer spend range, the spend-confidence curve, what moves the
   number, and sequence-of-returns risk.
5. **Family Report** — open / print the one-page summary.

---

## The worked example (sample profile)

| Input             | Value                                 |
| ----------------- | ------------------------------------- |
| Age / plan to     | 65 → 95                               |
| CPF LIFE          | S$950/month (Standard, level nominal) |
| Investable assets | S$150,000 (cash + investments + SRS)  |
| Asset mix (Base)  | Cash 20 / Bonds 40 / Equity 40        |
| Desired spend     | S$2,350/month                         |

For the sample profile, Enough shows a stable, illustrative safer spend range of
**S$1,350 to S$1,500/month**, central estimate **S$1,400/month at about 92% confidence**
(labelled "Illustrative result based on stated assumptions"). A custom plan entered in
Build Plan is computed live by the Monte Carlo engine.

---

## CPF LIFE wording (used consistently)

- **CPF LIFE is a longevity floor, not necessarily an inflation hedge.**
- **Standard Plan** is modelled as level nominal payout.
- **Escalating Plan** may be modelled as rising 2% yearly (and starting lower).
- **Spending is inflated over time.**
- **The safer range depends on assumptions. Results are estimates, not guarantees.**

---

## Model assumptions (all editable in Build Plan)

| Assumption                  | Base case               |
| --------------------------- | ----------------------- |
| Target confidence           | 92%                     |
| General inflation           | 2.7% / yr               |
| Healthcare inflation        | 5% / yr                 |
| Cash / bond / equity return | 2% / 3.5% / 6.5%        |
| Equity volatility           | 16.5%                   |
| Planning horizon            | to age 95               |
| Trials                      | 2,000 (quick) or 10,000 |

Three presets — **Conservative**, **Base case** (default), **Optimistic** — vary the
market and inflation outlook.

---

## Educational disclaimer

Enough is an **educational simulator only**. It does not provide personalised financial
advice, recommend financial products, or guarantee outcomes. It is **not affiliated with
the CPF Board or the Monetary Authority of Singapore (MAS)**, is **not MAS-approved**, and
makes **no guarantee**. Any future personalised or regulated advice would require the
appropriate licensing or a licensed-partner arrangement, plus PDPA compliance, and is
subject to legal review before any commercial launch.

**Discuss your plan with a licensed financial adviser before making major financial
decisions.**

---

## Known limitations

- Returns are assumed independent and identically distributed month to month; real markets
  show fat tails, clustering, and correlation.
- Portfolio volatility assumes zero cross-asset correlation (slightly conservative).
- **Taxes** (income, SRS withdrawal, property) are not modelled.
- CPF LIFE Basic bequest mechanics and SRS withdrawal schedules are simplified/absent.
- The sample profile uses a deterministic illustrative dataset; custom plans use the live
  engine.

---

## Project structure

```
enough-app/
├── index.html
├── package.json, vite.config.ts, tsconfig*.json, tailwind.config.js, postcss.config.js
├── public/favicon.svg
└── src/
    ├── main.tsx, App.tsx, index.css, types.ts
    ├── engine/             # pure analytics (unit-tested)
    ├── data/               # sample profile, presets, demo dataset
    ├── lib/                # formatting helpers
    ├── store/              # React context + localStorage
    ├── components/         # Layout + UI primitives (MoneyField, Card, …)
    └── pages/              # Home, Inputs, Dashboard, FamilyReport, Business
```
