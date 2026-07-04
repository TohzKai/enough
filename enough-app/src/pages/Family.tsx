import { Link } from "react-router-dom";
import { Card, SectionTitle, Pill, Disclaimer } from "../components/ui";
import { useViewMode } from "../store/viewMode";
import {
  familyMembers,
  coSignRequests,
  type FamilyMember,
  type CoSignRequest,
} from "../data/familyPlane";

const avatarTone: Record<FamilyMember["tone"], string> = {
  navy: "bg-enough-navy",
  emerald: "bg-enough-emerald",
  amber: "bg-enough-amber",
};

function MemberCard({ m }: { m: FamilyMember }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div
          className={`h-11 w-11 rounded-full ${avatarTone[m.tone]} text-white flex items-center justify-center font-extrabold`}
        >
          {m.initials}
        </div>
        <div>
          <div className="font-bold text-enough-navy">{m.name}</div>
          <div className="text-xs text-enough-slate">{m.relation}</div>
        </div>
      </div>
      <div className="mt-3">
        <Pill tone={m.tone}>{m.roleLabel}</Pill>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-enough-ink">
        {m.permissions.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-enough-emerald">•</span>
            <span className="leading-snug">{p}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

const statusMeta: Record<
  CoSignRequest["status"],
  { label: string; tone: "amber" | "navy" | "emerald" }
> = {
  "awaiting-parent": { label: "Awaiting Dad's confirmation", tone: "amber" },
  "awaiting-child": { label: "Awaiting review + confirm", tone: "navy" },
  approved: { label: "Approved", tone: "emerald" },
};

function CoSignCard({ r }: { r: CoSignRequest }) {
  const meta = statusMeta[r.status];
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="font-bold text-enough-navy">{r.title}</div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {r.detail}
          </p>
        </div>
        <Pill tone={meta.tone}>{meta.label}</Pill>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-enough-slate">
        <span>
          Raised by <strong className="text-enough-navy">{r.raisedBy}</strong>
        </span>
        <span>
          Needs <strong className="text-enough-navy">{r.needs}</strong>
        </span>
      </div>
      {r.parentCentricNote && (
        <div className="mt-3 rounded-xl2 border border-enough-emerald/20 bg-enough-emerald/5 px-3 py-2 text-xs text-enough-ink leading-relaxed">
          <strong className="text-enough-emeraldDark">Parent-centric:</strong>{" "}
          {r.parentCentricNote}
        </div>
      )}
      {r.status !== "approved" && (
        <div className="mt-3 flex gap-2">
          <button className="btn-emerald !py-2 !px-4 text-sm">
            {r.status === "awaiting-parent"
              ? "Confirm (as Dad)"
              : "Review & confirm"}
          </button>
          <button className="btn-ghost !py-2 !px-4 text-sm">Not now</button>
        </div>
      )}
    </Card>
  );
}

export function Family() {
  const { mode } = useViewMode();
  const child = mode === "child";

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Family tier"
        title="One plan, the whole family"
        subtitle="A permissioned plan for the retiree, spouse, and adult child — the child helps set it up, but the parent always confirms the number."
      />

      {/* Two-face intro */}
      <Card
        className={
          child
            ? "border-enough-amber/30 bg-enough-amber/5"
            : "border-enough-navy/20 bg-enough-navy/5"
        }
      >
        <div className="flex items-center gap-2">
          <Pill tone={child ? "amber" : "navy"}>
            {child ? "Adult-child view" : "Parent view"}
          </Pill>
          <span className="font-semibold text-enough-navy">
            {child
              ? "Oversight without intrusion"
              : "Confidence without surveillance"}
          </span>
        </div>
        <p className="text-sm text-enough-ink mt-2 leading-relaxed max-w-3xl">
          {child
            ? "You set up and connect the accounts, get alerts when the plan needs a look, and co-sign the big moves — but the final number is always Dad's to confirm. That parent-centric rule is what keeps Enough trustworthy."
            : "Your children can help you set things up and keep watch, but they can never move your money or change your number without you. You see and confirm everything. The plan is always on your side."}
        </p>
      </Card>

      {/* Roles / permissioned plan */}
      <div>
        <h3 className="text-lg font-bold text-enough-navy mb-3">
          Who's on the plan
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {familyMembers.map((m) => (
            <MemberCard key={m.name} m={m} />
          ))}
        </div>
      </div>

      {/* Co-signer flow */}
      <div>
        <h3 className="text-lg font-bold text-enough-navy mb-1">
          Co-signer flow
        </h3>
        <p className="text-sm text-enough-slate mb-3 max-w-3xl">
          Big moves — a spending raise, a CPF top-up, connecting an account —
          route through a shared approval. The operator can raise and review;
          the owner confirms.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {coSignRequests.map((r) => (
            <CoSignCard key={r.id} r={r} />
          ))}
        </div>
      </div>

      {/* Why it matters (moat) */}
      <Card className="bg-enough-navy text-white border-0">
        <h3 className="text-white text-xl font-bold">
          The family layer is the uncontested ground
        </h3>
        <p className="text-white/85 mt-2 leading-relaxed max-w-3xl">
          No Singapore or global competitor surveyed offers this. It solves the
          senior data-entry problem (the child operates), fixes
          willingness-to-pay (the worried child pays), and creates a
          within-household bond a calculator can't copy.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/report" className="btn-emerald">
            Open the family report →
          </Link>
          <Link to="/result" className="btn-ghost !text-white !border-white/30">
            Back to results
          </Link>
        </div>
      </Card>

      <Disclaimer tone="soft">
        Illustrative prototype of the family tier. Roles, permissions and
        co-signer flows are demonstrated with sample data — not a live account.
      </Disclaimer>
    </div>
  );
}
