import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * The product needs TWO faces (enough-moat-and-differentiation.md §4.4 +
 * enough-adult-children-research.md Part C.4):
 *  - "parent" — one calm "your safer monthly spend range" view for the retiree.
 *  - "child"  — a read-only shared view. The option is always reachable for
 *               presentation purposes; the actual financial content is gated
 *               behind explicit parent permission (see Layout).
 *
 * The parent is the sole plan owner and decision-maker. The adult-child view
 * is OPTIONAL and read-only — it surfaces only what the parent has chosen to
 * share. Access requires the parent's explicit permission and can be revoked
 * at any time. When revoked while the app is in child mode, the content
 * returns to the "permission required" page — the child view remains
 * selected so the presenter can demonstrate the gating.
 *
 * NOTE: localStorage is only simulating permission for the educational
 * prototype. It is NOT real authentication or security.
 */
export type ViewMode = "parent" | "child";

const MODE_STORAGE_KEY = "enough.viewMode.v1";
const ACCESS_STORAGE_KEY = "enough.adultChildAccess.v1";

interface ViewModeValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  /** Whether the parent has granted the adult child read-only access. */
  adultChildAccessGranted: boolean;
  grantAdultChildAccess: () => void;
  revokeAdultChildAccess: () => void;
}

const ViewModeContext = createContext<ViewModeValue | null>(null);

function readStoredMode(): ViewMode {
  try {
    const raw = localStorage.getItem(MODE_STORAGE_KEY);
    if (raw === "parent" || raw === "child") return raw;
  } catch {
    /* ignore */
  }
  return "parent";
}

function readStoredAccess(): boolean {
  try {
    return localStorage.getItem(ACCESS_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function ViewModeProvider({ children }: { children: ReactNode }) {
  // The Adult-child view is reachable at all times for presentation purposes.
  // When access has not been granted, the UI displays a "permission required"
  // page instead of the financial content (see Layout). We deliberately do
  // NOT auto-flip the mode back to parent when access is revoked — that
  // would hide the option the presenter is trying to demonstrate.
  const [mode, setModeState] = useState<ViewMode>(readStoredMode);
  const [adultChildAccessGranted, setAccessGranted] =
    useState<boolean>(readStoredAccess);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  useEffect(() => {
    try {
      localStorage.setItem(
        ACCESS_STORAGE_KEY,
        adultChildAccessGranted ? "true" : "false",
      );
    } catch {
      /* ignore */
    }
  }, [adultChildAccessGranted]);

  const setMode = (next: ViewMode) => setModeState(next);
  const grantAdultChildAccess = () => setAccessGranted(true);
  const revokeAdultChildAccess = () => setAccessGranted(false);

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        setMode,
        adultChildAccessGranted,
        grantAdultChildAccess,
        revokeAdultChildAccess,
      }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode(): ViewModeValue {
  const ctx = useContext(ViewModeContext);
  if (!ctx)
    throw new Error("useViewMode must be used inside <ViewModeProvider>");
  return ctx;
}
