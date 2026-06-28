// Seedable pseudo-random number generation.
//
// We need DETERMINISTIC results for presentation reproducibility (the same inputs +
// seed always produce the same safe-spend number). We use mulberry32 — a small,
// fast, well-distributed PRNG — plus a Marsaglia polar transform for standard-normal
// draws used to model monthly portfolio returns.

/** Returns a function producing uniformly distributed floats in [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Returns a function producing standard-normal (mean 0, variance 1) samples,
 * using the Marsaglia polar method. Each call consumes ~1 uniform draw on average.
 */
export function makeGaussian(rng: () => number): () => number {
  let spare: number | null = null;
  return function (): number {
    if (spare !== null) {
      const s = spare;
      spare = null;
      return s;
    }
    let u = 0;
    let v = 0;
    let s = 0;
    do {
      u = rng() * 2 - 1;
      v = rng() * 2 - 1;
      s = u * u + v * v;
    } while (s >= 1 || s === 0);
    const mult = Math.sqrt((-2 * Math.log(s)) / s);
    spare = v * mult;
    return u * mult;
  };
}
