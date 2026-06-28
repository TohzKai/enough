import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PlanInputs } from "../types";
import { mrTanInputs } from "../data/mrTan";
import {
  runFullAnalysis,
  type FullAnalysis,
  type CancelToken,
} from "../engine";

// Bumping the version discards any stale selections (e.g. an old Optimistic
// preset) from earlier prototypes, so the app always opens on a clean Base case.
const STORAGE_KEY = "enough.plan.v3";
const ANALYSIS_KEY = "enough.analysis.v3";

export type RunStatus = "idle" | "computing" | "done" | "error";

interface PlanContextValue {
  inputs: PlanInputs;
  setField: <K extends keyof PlanInputs>(key: K, value: PlanInputs[K]) => void;
  setInputs: (i: PlanInputs) => void;
  /** Full reset: Base-case sample profile + clear any stale result. */
  loadSample: () => void;
  run: (overrides?: Partial<PlanInputs>) => Promise<FullAnalysis | null>;
  analysis: FullAnalysis | null;
  status: RunStatus;
  progress: number;
  error: string | null;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function loadInputs(): PlanInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...mrTanInputs, ...JSON.parse(raw) } as PlanInputs;
  } catch {
    /* ignore */
  }
  // Fresh default = clean Base-case sample profile.
  return { ...mrTanInputs };
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputsState] = useState<PlanInputs>(loadInputs);
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null); // never restored — avoids stale results
  const [status, setStatus] = useState<RunStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<CancelToken>({ cancelled: false });

  // Persist inputs whenever they change (so user edits are kept across refresh).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* storage may be full / disabled */
    }
  }, [inputs]);

  const clearAnalysis = () => {
    setAnalysis(null);
    try {
      localStorage.removeItem(ANALYSIS_KEY);
    } catch {
      /* ignore */
    }
  };

  // Any user edit invalidates a previously computed result, so Results never
  // shows a number that no longer matches the inputs.
  const setField: PlanContextValue["setField"] = (key, value) => {
    setInputsState((prev) => ({ ...prev, [key]: value }));
    clearAnalysis();
  };

  const setInputs = (i: PlanInputs) => {
    setInputsState(i);
    clearAnalysis();
  };

  // Full reset to the Base-case sample profile, discarding any prior selection.
  const loadSample = () => {
    setInputsState({ ...mrTanInputs });
    clearAnalysis();
    setStatus("idle");
    setProgress(0);
    setError(null);
  };

  const run: PlanContextValue["run"] = async (overrides) => {
    const effective = { ...inputs, ...(overrides ?? {}) };
    setInputsState(effective);
    cancelRef.current = { cancelled: false };
    setStatus("computing");
    setProgress(0);
    setError(null);
    try {
      const result = await runFullAnalysis(
        effective,
        (p) => setProgress(p),
        cancelRef.current,
      );
      setAnalysis(result);
      try {
        localStorage.setItem(ANALYSIS_KEY, JSON.stringify(result));
      } catch {
        /* ignore */
      }
      setStatus("done");
      return result;
    } catch (e) {
      if ((e as Error).message === "cancelled") {
        setStatus("idle");
        return null;
      }
      setError((e as Error).message || "Simulation failed");
      setStatus("error");
      return null;
    }
  };

  const value = useMemo<PlanContextValue>(
    () => ({
      inputs,
      setField,
      setInputs,
      loadSample,
      run,
      analysis,
      status,
      progress,
      error,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs, analysis, status, progress, error],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}
