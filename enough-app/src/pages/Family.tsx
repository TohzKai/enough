import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div
          className={`h-11 w-11 rounded-full ${avatarTone[m.tone]} text-white flex items-center justify-center font-extrabold`}
        >
          {m.initials}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-enough-navy safe-break">
            {t(m.name)}
          </div>
          <div className="text-xs text-enough-slate">{t(m.relation)}</div>
        </div>
      </div>
      <div className="mt-3">
        <Pill tone={m.tone}>{t(m.roleLabel)}</Pill>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-enough-ink">
        {m.permissions.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="text-enough-emerald">•</span>
            <span className="leading-snug">{t(p)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CoSignCard({ r }: { r: CoSignRequest }) {
  const { t } = useTranslation();
  const statusMeta: Record<
    CoSignRequest["status"],
    { labelKey: string; tone: "amber" | "navy" | "emerald" }
  > = {
    "awaiting-parent": { labelKey: "family.csAwaitingParent", tone: "amber" },
    "awaiting-child": { labelKey: "family.csAwaitingChild", tone: "navy" },
    approved: { labelKey: "family.csApproved", tone: "emerald" },
  };
  const meta = statusMeta[r.status];
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="font-bold text-enough-navy safe-break">
            {t(r.title)}
          </div>
          <p className="text-sm text-enough-ink mt-1 leading-relaxed">
            {t(r.detail)}
          </p>
        </div>
        <Pill tone={meta.tone}>{t(meta.labelKey)}</Pill>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-enough-slate">
        <span>
          {t("family.csRaisedBy")}{" "}
          <strong className="text-enough-navy">{t(r.raisedBy)}</strong>
        </span>
        <span>
          {t("family.csNeeds")}{" "}
          <strong className="text-enough-navy">{t(r.needs)}</strong>
        </span>
      </div>
      {r.parentCentricNote && (
        <div className="mt-3 rounded-xl2 border border-enough-emerald/20 bg-enough-emerald/5 px-3 py-2 text-xs text-enough-ink leading-relaxed">
          <strong className="text-enough-emeraldDark">
            {t("family.csParentCentric")}
          </strong>{" "}
          {t(r.parentCentricNote)}
        </div>
      )}
      {r.status !== "approved" && (
        <div className="mt-3 flex gap-2">
          <button className="btn-emerald !py-2 !px-4 text-sm min-h-[44px]">
            {r.status === "awaiting-parent"
              ? t("family.csConfirmAsDad")
              : t("family.csReviewConfirm")}
          </button>
          <button className="btn-ghost !py-2 !px-4 text-sm min-h-[44px]">
            {t("family.csNotNow")}
          </button>
        </div>
      )}
    </Card>
  );
}

export function Family() {
  const { t } = useTranslation();
  const { mode } = useViewMode();
  const child = mode === "child";

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker={t("family.kicker")}
        title={t("family.title")}
        subtitle={t("family.subtitle")}
      />

      {/* Two-face intro */}
      <Card
        className={
          child
            ? "border-enough-amber/30 bg-enough-amber/5"
            : "border-enough-navy/20 bg-enough-navy/5"
        }
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Pill tone={child ? "amber" : "navy"}>
            {child ? t("family.pillChild") : t("family.pillParent")}
          </Pill>
          <span className="font-semibold text-enough-navy">
            {child ? t("family.childTag") : t("family.parentTag")}
          </span>
        </div>
        <p className="readable text-sm text-enough-ink mt-2 leading-relaxed">
          {child ? t("family.childBody") : t("family.parentBody")}
        </p>
      </Card>

      {/* Roles / permissioned plan */}
      <div>
        <h3 className="text-lg font-bold text-enough-navy mb-3">
          {t("family.whoOnPlan")}
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {familyMembers.map((m) => (
            <MemberCard key={m.initials} m={m} />
          ))}
        </div>
      </div>

      {/* Co-signer flow */}
      <div>
        <h3 className="text-lg font-bold text-enough-navy mb-1">
          {t("family.coSignerHeading")}
        </h3>
        <p className="readable text-sm text-enough-slate mb-3">
          {t("family.coSignerIntro")}
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
          {t("family.moatTitle")}
        </h3>
        <p className="readable text-white/85 mt-2 leading-relaxed">
          {t("family.moatBody")}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/report" className="btn-emerald min-h-[44px]">
            {t("family.openReport")}
          </Link>
          <Link
            to="/result"
            className="btn-ghost !text-white !border-white/30 min-h-[44px]"
          >
            {t("family.backToResults")}
          </Link>
        </div>
      </Card>

      <Disclaimer tone="soft">{t("family.disclaimer")}</Disclaimer>
    </div>
  );
}
