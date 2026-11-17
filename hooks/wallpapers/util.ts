// Shared helpers for the vector scenes.

export const W = 1600
export const H = 900

// mulberry32: tiny deterministic PRNG, so a scene draws the same every load.
export function prng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const f = (n: number) => n.toFixed(1)

export const between = (rand: () => number, lo: number, hi: number) => lo + rand() * (hi - lo)

export function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)] as T
}

export function svg(body: string, style: string, defs = ''): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs><style>${style}@media (prefers-reduced-motion:reduce){*{animation:none!important}}</style>${body}</svg>`
}
