import { Link } from "react-router-dom";
import { Card, Pill } from "./ui";
import { applicableProtections } from "../data/protection";
import type { PlanInputs } from "../types";

/**
 * ProtectionReferral — the specific referral map (app-review item 5 extension).
 *
 * Links each retirement gap → the protection that covers it → the licensed
 * partner Enough would refer you to (insurance agency / fee-only IFA / CPF Board).
 * Provider names are illustrative example partners (real SG firms/schemes, 2025–26),
 * not confirmed relationships. A permitted MAS introducer arrangement (FAA-N02).
 */
export function ProtectionReferral({ inputs }: { inputs: PlanInputs }) {
  const items = applicableProtections(inputs);

  return (
    <Card>
      <h3 className="text-2xl font-bold text-enough-navy">
        Protection gaps — and who to see
      </h3>
      <p className="text-enough-slate mt-1 max-w-3xl">
        Some retirement risks are cheaper to insure than to self-fund. Here's
        the risk, the protection that covers it, and the licensed partner we'd
        introduce you to. You choose who — Enough sizes the gap and makes the
        introduction; the partner handles the product.
      </p>

      <div className="mt-4 space-y-3">
        {items.map((r) => (
          <div
            key={r.key}
            className="rounded-xl2 border border-enough-line p-4"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="font-bold text-enough-navy">{r.gap}</div>
              <Pill tone="amber">gap</Pill>
            </div>
            <p className="text-sm text-enough-ink mt-1 leading-relaxed">
              {r.nature}
            </p>

            <div className="mt-3 grid md:grid-cols-2 gap-3">
              <div className="rounded-xl2 bg-enough-emerald/5 border border-enough-emerald/20 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-enough-emeraldDark">
                  Protection that fits
                </div>
                <div className="text-sm font-semibold text-enough-navy mt-1 leading-snug">
                  {r.protection}
                </div>
                <div className="text-xs text-enough-slate mt-1 leading-snug">
                  {r.why}
                </div>
              </div>
              <div className="rounded-xl2 bg-enough-navy/5 border border-enough-line p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-enough-navy">
                  Who to see
                </div>
                <div className="text-sm text-enough-ink mt-1 leading-snug">
                  {r.channel}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.examples.map((e) => (
                    <span
                      key={e}
                      className="rounded-full bg-white border border-enough-line px-2.5 py-1 text-xs font-medium text-enough-navy"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl2 border border-enough-line bg-enough-navy/5 px-4 py-3 text-xs text-enough-slate leading-relaxed">
        Providers shown are{" "}
        <strong className="text-enough-navy">
          illustrative example partners
        </strong>{" "}
        (real Singapore firms and schemes, 2025–26), not confirmed
        relationships. Enough refers as a permitted MAS introducer (FAA-N02);
        flat fees, never commission, so the referral stays neutral — you decide,
        and any product is arranged by the licensed partner.{" "}
        <Link to="/report" className="font-semibold text-enough-navy underline">
          Add to the family report
        </Link>
      </div>
    </Card>
  );
}
