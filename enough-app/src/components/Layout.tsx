import { NavLink, Outlet, Link } from "react-router-dom";
import { useViewMode } from "../store/viewMode";

// Main consumer navigation. "For partners" is a secondary footer link, not a
// top-nav item.
const NAV = [
  { to: "/", label: "Home", end: true },
  { to: "/plan", label: "Connect" },
  { to: "/result", label: "Results" },
  { to: "/family", label: "Family" },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? "bg-enough-emerald text-white"
      : "text-white/75 hover:bg-white/10 hover:text-white"
  }`;
}

/** Parent vs Adult-child face toggle — the product's two faces. */
function ViewToggle() {
  const { mode, setMode } = useViewMode();
  return (
    <div className="flex items-center rounded-full bg-white/10 p-0.5 text-xs font-semibold">
      <button
        type="button"
        onClick={() => setMode("parent")}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          mode === "parent" ? "bg-white text-enough-navy" : "text-white/70"
        }`}
      >
        Parent view
      </button>
      <button
        type="button"
        onClick={() => setMode("child")}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          mode === "child" ? "bg-white text-enough-navy" : "text-white/70"
        }`}
      >
        Adult-child view
      </button>
    </div>
  );
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Compact premium top bar with the two-face toggle */}
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
                  Neutral Singapore retirement spending
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <nav className="hidden sm:flex items-center gap-1">
                {NAV.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    className={navClass}
                  >
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              <ViewToggle />
            </div>
          </div>

          {/* Mobile nav row */}
          <nav className="sm:hidden flex items-center gap-1 pb-2 -mt-1 overflow-x-auto">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={navClass}>
                {n.label}
              </NavLink>
            ))}
          </nav>
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
            Educational decision-support only · Not financial advice · No
            product recommendations · No guarantee · Not affiliated with CPF
            Board or MAS.
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
