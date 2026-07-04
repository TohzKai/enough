import { useState, type ReactNode } from "react";

/** A white rounded panel — the base container for content. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionTitle({
  title,
  subtitle,
  kicker,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
}) {
  return (
    <div className="mb-6">
      {kicker && (
        <div className="text-sm font-bold uppercase tracking-wider text-enough-emerald mb-1">
          {kicker}
        </div>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-sub">{subtitle}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: "neutral" | "emerald" | "amber" | "red" | "navy";
}) {
  const toneMap: Record<string, string> = {
    neutral: "text-enough-ink",
    emerald: "text-enough-emeraldDark",
    amber: "text-enough-amber",
    red: "text-enough-red",
    navy: "text-enough-navy",
  };
  return (
    <div className="rounded-xl2 border border-enough-line bg-white p-4 h-full flex flex-col">
      <div className="text-sm font-semibold text-enough-slate">{label}</div>
      <div
        className={`mt-1 text-2xl font-extrabold leading-tight ${toneMap[tone]}`}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-auto pt-2 text-xs text-enough-slate">{sub}</div>
      )}
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "emerald" | "amber" | "red" | "navy";
}) {
  const toneMap: Record<string, string> = {
    neutral: "bg-enough-navy/5 text-enough-slate",
    emerald: "bg-enough-emerald/10 text-enough-emeraldDark",
    amber: "bg-enough-amber/10 text-enough-amber",
    red: "bg-enough-red/10 text-enough-red",
    navy: "bg-enough-navy/10 text-enough-navy",
  };
  return <span className={`pill ${toneMap[tone]}`}>{children}</span>;
}

/** Zone badge for the sequence-risk guardrail metaphor. */
export function ZoneBadge({ zone }: { zone: "green" | "amber" | "red" }) {
  const map = {
    green: {
      label: "Green zone",
      cls: "bg-enough-emerald/10 text-enough-emeraldDark",
    },
    amber: { label: "Amber zone", cls: "bg-enough-amber/10 text-enough-amber" },
    red: { label: "Red zone", cls: "bg-enough-red/10 text-enough-red" },
  } as const;
  const z = map[zone];
  return <span className={`pill ${z.cls}`}>{z.label}</span>;
}

export function Disclaimer({
  children,
  tone = "soft",
}: {
  children: ReactNode;
  tone?: "soft" | "strong";
}) {
  const cls =
    tone === "strong"
      ? "bg-enough-amberSoft border-enough-amber/30 text-enough-ink"
      : "bg-enough-navy/5 border-enough-line text-enough-slate";
  return (
    <div
      className={`rounded-xl2 border px-4 py-3 text-sm leading-relaxed ${cls}`}
    >
      {children}
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-enough-navy/15 border-t-enough-emerald" />
      {label && <div className="text-enough-slate font-medium">{label}</div>}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-enough-navy/10">
      <div
        className="h-full rounded-full bg-enough-emerald transition-[width] duration-200"
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

/** Standard labelled number input. */
export function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  help,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  help?: string;
  min?: number;
  max?: number;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-enough-slate">
            {prefix}
          </span>
        )}
        <input
          type="number"
          className={`field-input ${prefix ? "pl-9" : ""} ${suffix ? "pr-12" : ""}`}
          value={Number.isFinite(value) ? value : ""}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-enough-slate">
            {suffix}
          </span>
        )}
      </div>
      {help && <span className="field-help">{help}</span>}
    </label>
  );
}

/**
 * MoneyField — a premium S$ input.
 * Uses type="text" (no browser spinners), shows comma grouping when not focused
 * ("45,000"), with a fixed "S$" prefix. While focused it shows the raw editable
 * number for clean keyboard editing. Parses safely back to a number.
 */
export function MoneyField({
  label,
  value,
  onChange,
  help,
  placeholder = "0",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  help?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const shown = focused
    ? draft
    : Number.isFinite(value) && value !== 0
      ? value.toLocaleString("en-US")
      : "";
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-enough-slate font-semibold">
          S$
        </span>
        <input
          type="text"
          inputMode="numeric"
          className="field-input pl-8"
          value={shown}
          placeholder={placeholder}
          onFocus={() => {
            setFocused(true);
            setDraft(
              Number.isFinite(value) && value !== 0 ? String(value) : "",
            );
          }}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9.]/g, "");
            setDraft(cleaned);
            onChange(cleaned === "" ? 0 : parseFloat(cleaned));
          }}
          onBlur={() => setFocused(false)}
        />
      </div>
      {help && <span className="field-help">{help}</span>}
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  help,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  help?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select
        className="field-input"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {help && <span className="field-help">{help}</span>}
    </label>
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
  help,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  help?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? "bg-enough-emerald" : "bg-enough-navy/15"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
      <span>
        <span className="block font-semibold text-enough-ink">{label}</span>
        {help && (
          <span className="block text-xs text-enough-slate">{help}</span>
        )}
      </span>
    </label>
  );
}

/** A reusable empty-state prompt shown when a user lands on a result page
 *  without having run a simulation. */
export function NeedToRun() {
  return (
    <Card>
      <div className="text-center py-8">
        <div className="text-lg font-semibold text-enough-navy">
          Run a simulation first
        </div>
        <p className="mt-2 text-enough-slate">
          Head to the plan page, enter your details (or load Mr Tan), and run
          the engine. Your results will appear here.
        </p>
        <a href="#/plan" className="btn-primary mt-5 inline-flex">
          Build a plan
        </a>
      </div>
    </Card>
  );
}
