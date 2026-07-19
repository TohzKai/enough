import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LifestyleBucketKey } from "../types";
import { DEFAULT_LIFESTYLE, LIFESTYLE_BUCKETS } from "../data/lifestyle";

// Bumping the version discards stale actual-spend entries from earlier prototypes.
const STORAGE_KEY = "enough.spend.v1";

type SpendActuals = Record<LifestyleBucketKey, number>;

interface SpendContextValue {
  /** Actual monthly spend per bucket, entered by the user (manual; no bank feed). */
  actuals: SpendActuals;
  setActual: (key: LifestyleBucketKey, amount: number) => void;
  setActuals: (a: SpendActuals) => void;
  clearActuals: () => void;
  /**
   * Reset actuals to the given "planned" baseline. Used by the "Reset to
   * planned" button so the reset uses the CURRENT plan's lifestyle, not a
   * hardcoded sample.
   */
  resetToPlanned: (planned: SpendActuals) => void;
}

const SpendContext = createContext<SpendContextValue | null>(null);

function loadActuals(): SpendActuals {
  const base: SpendActuals = { ...DEFAULT_LIFESTYLE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...base, ...(JSON.parse(raw) as Partial<SpendActuals>) };
  } catch {
    /* ignore */
  }
  return base;
}

export function SpendProvider({ children }: { children: ReactNode }) {
  const [actuals, setActualsState] = useState<SpendActuals>(loadActuals);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actuals));
    } catch {
      /* storage may be full / disabled */
    }
  }, [actuals]);

  const setActual: SpendContextValue["setActual"] = (key, amount) => {
    setActualsState((prev) => ({ ...prev, [key]: Math.max(0, amount) }));
  };

  const setActuals = (a: SpendActuals) => setActualsState({ ...a });
  const clearActuals = () => setActualsState({ ...DEFAULT_LIFESTYLE });
  const resetToPlanned = (planned: SpendActuals) =>
    setActualsState({ ...planned });

  const value = useMemo<SpendContextValue>(
    () => ({ actuals, setActual, setActuals, clearActuals, resetToPlanned }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actuals],
  );

  return (
    <SpendContext.Provider value={value}>{children}</SpendContext.Provider>
  );
}

export function useSpend(): SpendContextValue {
  const ctx = useContext(SpendContext);
  if (!ctx) throw new Error("useSpend must be used inside <SpendProvider>");
  return ctx;
}

/** The ordered bucket keys to render in the spend monitor. */
export const SPEND_BUCKETS = LIFESTYLE_BUCKETS;
