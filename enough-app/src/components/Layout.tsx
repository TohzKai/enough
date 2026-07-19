import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useViewMode, type ViewMode } from "../store/viewMode";
import { LanguageSelector } from "./LanguageSelector";
import { LOCALE_NAMES, type AppLocale } from "../i18n";

// Primary consumer navigation. "For partners" stays a secondary footer link.
const NAV = [
  { to: "/", key: "navigation.home", end: true },
  { to: "/plan", key: "navigation.connect", end: false },
  { to: "/result", key: "navigation.results", end: false },
  { to: "/spend", key: "navigation.spendMonitor", end: false },
  { to: "/family", key: "navigation.family", end: false },
] as const;

function navClass({ isActive }: { isActive: boolean }) {
  return `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
    isActive
      ? "bg-enough-emerald text-white"
      : "text-white/75 hover:bg-white/10 hover:text-white"
  }`;
}

/** Items the adult-child view must never expose (the adult child cannot
 *  connect accounts or edit the parent's plan). */
const HIDDEN_IN_CHILD = new Set(["/plan"]);

/**
 * Parent vs Adult-child face toggle — the product's two faces.
 * Both buttons are always reachable for presentation purposes. The actual
 * financial content in child mode is gated behind explicit parent permission
 * (see the PermissionGate wrapper below).
 */
function ViewToggle({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const { mode, setMode } = useViewMode();
  const btn = (m: ViewMode, label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      aria-pressed={mode === m}
      className={`min-h-[40px] rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
        mode === m
          ? "bg-white text-enough-navy"
          : "text-white/70 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div
      className={`flex items-center rounded-full bg-white/10 p-0.5 ${className}`}
      role="group"
      aria-label={t("accessibility.viewMode")}
    >
      {btn("parent", t("navigation.parentView"))}
      {btn("child", t("navigation.adultChildView"))}
    </div>
  );
}

/**
 * Permission gate for the adult-child view. When the user has switched to
 * the child mode but the parent has not (yet) granted read-only access, this
 * replaces the page content with a privacy-respecting status page — no
 * financial information is rendered. When access is granted, the page
 * content flows through untouched.
 *
 * NOTE: this is an illustrative permission flow for the educational
 * prototype. localStorage is the only mechanism gating the content; it is
 * NOT real authentication or security.
 */
function PermissionGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { mode, adultChildAccessGranted, setMode } = useViewMode();
  const navigate = useNavigate();
  if (mode !== "child" || adultChildAccessGranted) return <>{children}</>;
  // Primary CTA: route to the Family page (where the parent grants access).
  const openAccessSettings = () => {
    setMode("parent");
    navigate("/family#adult-child-access");
  };
  // Secondary CTA: return to the parent home page.
  const returnToParentHome = () => {
    setMode("parent");
    navigate("/");
  };
  return (
    <div className="mx-auto max-w-app px-4 md:px-6 py-10 md:py-14">
      <div className="mx-auto max-w-2xl rounded-xl2 border border-enough-amber/30 bg-enough-amberSoft p-6 md:p-8 shadow-card">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-enough-amber">
          <span aria-hidden="true">🔒</span>
          <span>{t("family.lockedUntilGranted")}</span>
        </div>
        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-enough-navy leading-tight safe-break">
          {t("family.gateTitle")}
        </h1>
        <p className="mt-4 readable text-base text-enough-ink leading-relaxed safe-break">
          {t("family.gateBody")}
        </p>
        <div className="mt-5 rounded-xl2 bg-white/70 px-4 py-3 text-sm text-enough-slate leading-relaxed safe-break">
          {t("family.gatePrivacyNote")}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openAccessSettings}
            className="btn-emerald min-h-[44px]"
          >
            {t("family.gateOpenSettingsCta")}
          </button>
          <button
            type="button"
            onClick={returnToParentHome}
            className="btn-ghost min-h-[44px]"
          >
            {t("family.gateReturnHomeCta")}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Polite live region that announces a language change for screen readers. */
function LocaleAnnouncer() {
  const { i18n: i18nInstance, t } = useTranslation();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const handler = (lng: string) => {
      const name = LOCALE_NAMES[lng as AppLocale] ?? lng;
      setMsg(t("accessibility.langChanged", { name }));
    };
    i18nInstance.on("languageChanged", handler);
    return () => {
      i18nInstance.off("languageChanged", handler);
    };
  }, [i18nInstance, t]);
  return (
    <div className="sr-only" role="status" aria-live="polite">
      {msg}
    </div>
  );
}

export function Layout() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { mode } = useViewMode();
  const child = mode === "child";

  // The adult-child view is read-only — the parent must explicitly grant
  // permission, and even then the child can never connect or edit the plan.
  // Hide the Connect destination in child mode.
  const visibleNav = useMemo(
    () => NAV.filter((n) => !(child && HIDDEN_IN_CHILD.has(n.to))),
    [child],
  );

  // Focus trap + Escape handling for the mobile navigation drawer.
  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = (): HTMLElement[] => {
      const els = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])',
      );
      return Array.from(els).filter((el) => el.offsetParent !== null);
    };
    // Move focus into the drawer on open.
    const first = focusable()[0];
    first?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const items = focusable();
        if (items.length === 0) return;
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll while the modal drawer is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Restore focus to the trigger when the drawer closes.
      menuBtnRef.current?.focus();
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link btn-emerald text-sm">
        {t("accessibility.skipToContent")}
      </a>
      <LocaleAnnouncer />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-enough-navy text-white shadow-pop no-print">
        <div className="mx-auto max-w-app px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 min-h-[4rem] py-2">
            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-xl2"
            >
              <img
                src="/enough-logo.png"
                alt={t("common.brand")}
                className="brand-icon block h-9 w-9 shrink-0 object-contain rounded-xl"
              />
              <div className="leading-tight min-w-0">
                <div className="text-lg font-extrabold tracking-tight">
                  {t("common.brand")}
                </div>
                <div className="text-[11px] text-white/55 -mt-0.5 hidden sm:block">
                  {t("common.tagline")}
                </div>
              </div>
            </Link>

            {/* Right group: desktop nav + view toggle + language + mobile menu.
                Grouped (and the row is flex-wrap) so in long-script locales
                (Tamil / Malay) the whole group wraps to a compact second row
                instead of forcing a horizontal page scrollbar. */}
            <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 min-w-0">
              <nav
                className="hidden xl:flex items-center gap-1"
                aria-label={t("accessibility.primaryNav")}
              >
                {visibleNav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    className={navClass}
                  >
                    {t(n.key)}
                  </NavLink>
                ))}
              </nav>
              <ViewToggle className="hidden md:flex" />
              <LanguageSelector compact />
              <button
                ref={menuBtnRef}
                type="button"
                className="xl:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl2 p-2 text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={t("accessibility.openMenu")}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((s) => !s)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  {menuOpen ? (
                    <>
                      <line x1="6" y1="6" x2="18" y2="18" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                    </>
                  ) : (
                    <>
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile / tablet navigation drawer */}
        {menuOpen && (
          <div className="xl:hidden no-print">
            <div
              className="fixed inset-0 z-40 bg-enough-navy/50"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              ref={dialogRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t("accessibility.menu")}
              className="fixed right-0 top-0 z-50 h-full w-[min(20rem,85vw)] bg-enough-navy text-white shadow-pop flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-extrabold text-lg">
                  {t("accessibility.menu")}
                </span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={t("accessibility.closeMenu")}
                  className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl2 p-2 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>
              </div>
              <nav
                className="flex flex-col gap-1 p-4"
                aria-label={t("accessibility.mobileNav")}
              >
                {visibleNav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `min-h-[44px] flex items-center rounded-xl2 px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                        isActive
                          ? "bg-enough-emerald text-white"
                          : "text-white/85 hover:bg-white/10"
                      }`
                    }
                  >
                    {t(n.key)}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto p-4 border-t border-white/10 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  {t("navigation.parentView")}
                </div>
                <ViewToggle className="w-full justify-stretch [&>button]:flex-1" />
                <div className="rounded-xl2 bg-white/10 p-2">
                  <LanguageSelector className="w-full justify-between" />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page content — wrapped in the permission gate so the adult-child view
          renders a privacy page instead of any financial information when the
          parent has not granted access. */}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <PermissionGate>
          <div className="mx-auto max-w-app px-4 md:px-6 py-8 md:py-10">
            <Outlet />
          </div>
        </PermissionGate>
      </main>

      {/* Footer with disclaimer + secondary "For partners" link */}
      <footer className="no-print">
        <div className="mx-auto max-w-app px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="readable text-xs text-enough-slate text-center sm:text-left">
            {t("disclaimer.footer")}
          </p>
          <Link
            to="/partners"
            className="text-xs font-semibold text-enough-navy hover:text-enough-emeraldDark whitespace-nowrap shrink-0"
          >
            {t("navigation.forPartners")}
          </Link>
        </div>
      </footer>
    </div>
  );
}
