/**
 * Lifestyle personas — the "chooser" half of app-review item 1.
 *
 * Today the user types every one of the nine lifestyle buckets by hand. A persona
 * is a SUGGESTED starting decomposition the user can apply with one click, then
 * adjust. Applying a persona sets the real `lifestyle` buckets on the plan inputs,
 * which the engine then consumes exactly as if the user had typed them — the
 * suggestion is a convenience, not a separate code path.
 *
 * The amounts are illustrative, plausible monthly figures for a Singapore retiree
 * household (they are NOT cited government or survey figures — that rigour is
 * reserved for the healthcare / scheme numbers). "Comfortable" reproduces the
 * Mr Tan worked example (Σ = S$3,100).
 */

import type { LifestyleBucketKey } from "../types";
import { totalLifestyle } from "./lifestyle";

export interface LifestylePersona {
  key: "modest" | "comfortable" | "generous";
  label: string;
  blurb: string;
  lifestyle: Record<LifestyleBucketKey, number>;
}

export const LIFESTYLE_PERSONAS: LifestylePersona[] = [
  {
    key: "modest",
    label: "lifestyle.personaModest",
    blurb: "lifestyle.personaModestBlurb",
    lifestyle: {
      essentials: 600,
      foodTransport: 300,
      utilities: 200,
      housing: 0,
      healthcare: 450,
      discretionary: 200,
      familySupport: 100,
      travelHobbies: 50,
      other: 0,
    },
  },
  {
    key: "comfortable",
    label: "lifestyle.personaComfortable",
    blurb: "lifestyle.personaComfortableBlurb",
    lifestyle: {
      essentials: 800,
      foodTransport: 350,
      utilities: 250,
      housing: 0,
      healthcare: 600,
      discretionary: 500,
      familySupport: 300,
      travelHobbies: 300,
      other: 0,
    },
  },
  {
    key: "generous",
    label: "lifestyle.personaGenerous",
    blurb: "lifestyle.personaGenerousBlurb",
    lifestyle: {
      essentials: 1000,
      foodTransport: 450,
      utilities: 300,
      housing: 0,
      healthcare: 750,
      discretionary: 900,
      familySupport: 400,
      travelHobbies: 550,
      other: 50,
    },
  },
];

/** Monthly total for a persona (Σ of its nine buckets). */
export function personaTotal(p: LifestylePersona): number {
  return totalLifestyle(p.lifestyle);
}
