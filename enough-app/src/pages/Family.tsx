import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, SectionTitle, Pill, Disclaimer } from "../components/ui";
import { useViewMode } from "../store/viewMode";
import { familyMembers, type FamilyMember } from "../data/familyPlane";

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

/**
 * Permission-management card: the only place the parent toggles adult-child
 * access. Adult-child view shows a read-only summary (no Grant / Revoke).
 *
 * Anchored at `#adult-child-access` so the locked screen in PermissionGate can
 * route directly here (`/family#adult-child-access`) and the card scrolls
 * into view + briefly highlights for the presentation demo.
 */
function AdultChildAccessCard() {
  const { t } = useTranslation();
  const {
    mode,
    adultChildAccessGranted,
    grantAdultChildAccess,
    revokeAdultChildAccess,
  } = useViewMode();
  const child = mode === "child";
  const cardRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState(false);
  // Brief confirmation banner after Grant is clicked. Auto-dismisses.
  const [justGranted, setJustGranted] = useState(false);

  // If the URL hash points at us on mount, smooth-scroll into view and
  // briefly highlight the card so it is obvious during the demo.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#adult-child-access"
    ) {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlight(true);
      const t = window.setTimeout(() => setHighlight(false), 2400);
      return () => window.clearTimeout(t);
    }
    return;
  }, []);

  const onGrant = () => {
    grantAdultChildAccess();
    setJustGranted(true);
    window.setTimeout(() => setJustGranted(false), 4000);
  };

  const onRevoke = () => {
    revokeAdultChildAccess();
    setJustGranted(false);
  };

  return (
    <section
      id="adult-child-access"
      ref={cardRef}
      className={`scroll-mt-28 rounded-xl2 transition-shadow ${
        highlight
          ? "ring-2 ring-enough-emerald shadow-pop"
          : "ring-0 ring-transparent"
      }`}
    >
      <Card
        className={
          child
            ? "border-enough-amber/30 bg-enough-amber/5"
            : "border-enough-navy/20 bg-enough-navy/5"
        }
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Pill tone={child ? "amber" : "navy"}>
              {child
                ? t("family.accessReadOnlyBadge")
                : adultChildAccessGranted
                  ? t("family.accessGranted")
                  : t("family.accessNotShared")}
            </Pill>
            <span className="font-semibold text-enough-navy">
              {t("family.accessHeading")}
            </span>
          </div>
        </div>

        <p className="readable text-sm text-enough-ink mt-3 leading-relaxed">
          {child
            ? t("family.accessChildBody")
            : adultChildAccessGranted
              ? t("family.accessGrantedBody")
              : t("family.accessIntro")}
        </p>

        <ul className="mt-3 space-y-1.5 text-sm text-enough-ink">
          {[
            "canViewSafer",
            "canViewAlerts",
            "cannotEdit",
            "cannotApprove",
            "canRevoke",
          ].map((k) => (
            <li key={k} className="flex gap-2">
              <span className="text-enough-emerald">•</span>
              <span className="leading-snug">
                {t(`family.permissionBullets.${k}`)}
              </span>
            </li>
          ))}
        </ul>

        {/* Parent-only success confirmation. */}
        {!child && justGranted && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 rounded-xl2 border border-enough-emerald/30 bg-enough-emerald/10 px-4 py-3 text-sm text-enough-ink leading-relaxed safe-break"
          >
            <strong className="text-enough-emeraldDark">
              {t("family.accessGrantedConfirmation")}
            </strong>{" "}
            {t("family.accessGrantedHint")}
          </div>
        )}

        {!child && (
          <div className="mt-4 flex flex-wrap gap-2">
            {!adultChildAccessGranted ? (
              <button
                type="button"
                onClick={onGrant}
                className="btn-emerald min-h-[44px]"
              >
                {t("family.grantButton")}
              </button>
            ) : (
              <button
                type="button"
                onClick={onRevoke}
                className="btn-ghost min-h-[44px]"
              >
                {t("family.revokeButton")}
              </button>
            )}
          </div>
        )}
      </Card>
    </section>
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
        title={t("family.familyAccessTitle")}
        subtitle={t("family.familyAccessSubtitle")}
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

      {/* Adult-child access — the parent's permission toggle (or a read-only
          summary in the adult-child view). */}
      <div>
        <AdultChildAccessCard />
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
