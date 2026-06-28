import { NavLink, Outlet, Link } from "react-router-dom";

// Main consumer navigation — only four destinations. "For Partners" is a
// secondary footer link, not a top-nav item.
const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/plan", label: "Build Plan" },
  { to: "/result", label: "Results" },
  { to: "/family", label: "Family Report" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-enough-emerald text-white"
      : "text-white/75 hover:bg-white/10 hover:text-white"
  }`;
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact premium top bar — no top-right CTA, no secondary scroll row */}
      <header className="sticky top-0 z-30 bg-enough-navy text-white shadow-pop no-print">
        <div className="mx-auto max-w-app px-4 md:px-6">
          <div className="flex items-center justify-between gap-3 h-16">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="h-9 w-9 rounded-xl bg-enough-emerald flex items-center justify-center font-extrabold text-white text-lg">
                e
              </div>
              <div className="leading-tight">
                <div className="text-lg font-extrabold tracking-tight">
                  Enough
                </div>
                <div className="text-[11px] text-white/55 -mt-0.5">
                  Singapore retirement spending
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} className={navClass}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <div className="mx-auto max-w-app px-4 md:px-6 py-8 md:py-10">
          <Outlet />
        </div>
      </main>

      {/* Compact footer with disclaimer + secondary "For partners" link */}
      <footer className="no-print">
        <div className="mx-auto max-w-app px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-enough-slate text-center sm:text-left">
            Educational simulator only · Not financial advice · No product
            recommendations · No guarantee · Not affiliated with CPF Board or
            MAS.
          </p>
          <Link
            to="/partners"
            className="text-xs font-semibold text-enough-navy hover:text-enough-emeraldDark whitespace-nowrap"
          >
            For partners
          </Link>
        </div>
      </footer>
    </div>
  );
}
