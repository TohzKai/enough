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
import { getDemoAnalysis } from "../lib/activeAnalysis";

// Bumping the version discards any stale selections (e.g. an old Optimistic
// preset) from earlier prototypes, so the app always opens on a clean Base case.
const STORAGE_KEY = "enough.plan.v4";
const ANALYSIS_KEY = "enough.analysis.v4";
const MODE_KEY = "enough.planMode.v4";

export type RunStatus = "idle" | "computing" | "done" | "error";

/**
 * Explicit plan mode. `demo` means the user is on the calibrated Mr Tan
 * worked example; `custom` means the user has edited any input (or built
 * their own plan from scratch). The Dashboard and FamilyReport read this
 * flag instead of inferring the mode from a partial set of input values.
 */
export type PlanMode = "demo" | "custom";

interface PlanContextValue {
  inputs: PlanInputs;
  setField: <K extends keyof PlanInputs>(key: K, value: PlanInputs[K]) => void;
  setInputs: (i: PlanInputs) => void;
  /** Reset to the calibrated Mr Tan worked example. */
  loadSample: () => void;
  /** Reset to a blank custom plan (no analysis yet). */
  startCustomPlan: () => void;
  /** Run the live Monte Carlo engine and persist the result. */
  run: (overrides?: Partial<PlanInputs>) => Promise<FullAnalysis | null>;
  analysis: FullAnalysis | null;
  /**
   * The analysis the UI should read. In demo mode we always have one
   * (cached from the worked example). In custom mode this is the user's
   * stored analysis; it is `null` until the user has clicked "Calculate
   * safer spend" — pages surface a recalculation-required state in that
   * case.
   */
  activeAnalysis: FullAnalysis | null;
  status: RunStatus;
  progress: number;
  error: string | null;
  /**
   * Whether the current plan is the calibrated Mr Tan worked example
   * (`"demo"`) or a user-modified plan (`"custom"`). Set explicitly by
   * `loadSample` / `startCustomPlan` / `setField` / `setInputs` / `run`.
   * Once a plan leaves demo mode it never auto-returns — only
   * `loadSample()` does that.
   */
  planMode: PlanMode;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function loadInputs(): PlanInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...mrTanInputs, ...(JSON.parse(raw) as PlanInputs) };
  } catch {
    /* ignore */
  }
  return { ...mrTanInputs };
}

function loadMode(): PlanMode {
  try {
    const raw = localStorage.getItem(MODE_KEY);
    if (raw === "demo" || raw === "custom") return raw;
  } catch {
    /* ignore */
  }
  // No saved mode — default to demo so the worked-example walkthrough
  // works on a fresh browser.
  return "demo";
}

export function PlanProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputsState] = useState<PlanInputs>(loadInputs);
  // Initial mode: explicit storage if present, else infer from inputs.
  // When the user opens the app for the first time we land on the demo
  // worked example so the presentation walkthrough works.
  const [planMode, setPlanMode] = useState<PlanMode>(() => {
    const stored = loadMode();
    if (localStorage.getItem(STORAGE_KEY)) return stored;
    // No stored inputs — default to demo.
    return "demo";
  });
  const [analysis, setAnalysis] = useState<FullAnalysis | null>(null);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef<CancelToken>({ cancelled: false });

  // Persist inputs whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* storage may be full / disabled */
    }
  }, [inputs]);

  // Persist plan mode whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, planMode);
    } catch {
      /* ignore */
    }
  }, [planMode]);

  const clearAnalysis = () => {
    setAnalysis(null);
    try {
      localStorage.removeItem(ANALYSIS_KEY);
    } catch {
      /* ignore */
    }
  };

  // Any user edit invalidates a previously computed result AND switches the
  // plan to custom mode. Once a plan leaves demo mode it never auto-returns
  // — only an explicit `loadSample()` does that.
  const setField: PlanContextValue["setField"] = (key, value) => {
    setInputsState((prev) => ({ ...prev, [key]: value }));
    setPlanMode("custom");
    clearAnalysis();
  };

  const setInputs = (i: PlanInputs) => {
    setInputsState(i);
    setPlanMode("custom");
    clearAnalysis();
  };

  // Reset to the calibrated Mr Tan worked example. This is the ONLY path
  // back to demo mode.
  const loadSample = () => {
    setInputsState({ ...mrTanInputs });
    setPlanMode("demo");
    clearAnalysis();
    setStatus("idle");
    setProgress(0);
    setError(null);
  };

  // Reset to a blank custom plan. Keeps no analysis — user must calculate.
  const startCustomPlan = () => {
    setInputsState({ ...mrTanInputs });
    setPlanMode("custom");
    clearAnalysis();
    setStatus("idle");
    setProgress(0);
    setError(null);
  };

  const run: PlanContextValue["run"] = async (overrides) => {
    const effective = { ...inputs, ...(overrides ?? {}) };
    setInputsState(effective);
    // Running a calculation is a user-initiated action — always custom.
    setPlanMode("custom");
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

  // The active analysis is the user's stored one in custom mode, or the
  // cached demo analysis in demo mode. Pages read this so they all see the
  // same safer-spend range.
  const activeAnalysis: FullAnalysis | null =
    analysis ?? (planMode === "demo" ? getDemoAnalysis() : null);

  const value = useMemo<PlanContextValue>(
    () => ({
      inputs,
      setField,
      setInputs,
      loadSample,
      startCustomPlan,
      run,
      analysis,
      activeAnalysis,
      status,
      progress,
      error,
      planMode,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputs, analysis, status, progress, error, planMode],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside <PlanProvider>");
  return ctx;
}
