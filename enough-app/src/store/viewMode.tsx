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
 *  - "parent"  — one calm "your safer monthly spend range" view for the retiree.
 *  - "child"   — a richer analytical + oversight view with alerts for the adult child.
 *
 * The child wants oversight WITHOUT intrusion; the parent wants confidence WITHOUT
 * surveillance. This global toggle switches framing across Results and Family.
 */
export type ViewMode = "parent" | "child";

const STORAGE_KEY = "enough.viewMode.v1";

interface ViewModeValue {
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeValue | null>(null);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ViewMode>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === "parent" || raw === "child") return raw;
    } catch {
      /* ignore */
    }
    return "parent";
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return (
    <ViewModeContext.Provider value={{ mode, setMode: setModeState }}>
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
