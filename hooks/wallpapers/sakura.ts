// Sakura: violet dusk, a cherry branch in bloom across the top, light rays,
// a large glassy folding fan with flower motifs in the lower left,
// petals tumbling on the wind, bokeh and sparkles.

import { between, f, H, pick, prng, svg, W } from './util'

const SYMBOLS =
  `<symbol id="petal" viewBox="-12 -12 24 24" overflow="visible"><path d="M0 -11C7 -9 9 -1 5 7C3 10 1 11 0 9C-1 11 -3 10 -5 7C-9 -1 -7 -9 0 -11Z"/></symbol>` +
  `<symbol id="flower" viewBox="-20 -20 40 40" overflow="visible">` +
  [0, 72, 144, 216, 288]
    .map(a => `<path transform="rotate(${a})" d="M0 -2C-7 -6 -9 -14 -4 -18C-2 -19 -1 -17 0 -16C1 -17 2 -19 4 -18C9 -14 7 -6 0 -2Z"/>`)
    .join('') +
  `<circle r="3.2" fill="#ffd36e"/></symbol>`

function petals(rand: () => number): string {
  const out: string[] = []
  const fills = ['url(#pet1)', 'url(#pet2)', 'url(#pet1)', '#f7d5ec']

  for (let i = 0; i < 62; i++) {
    const near = i < 6
    const x = between(rand, -150, W + 50)
    const s = near ? between(rand, 2.4, 3.4) : between(rand, 0.6, 1.6)
    const dur = near ? between(rand, 7, 10) : between(rand, 10, 20)
    const sway = between(rand, 2.4, 4.5)
    const op = near ? 0.35 : s < 0.9 ? 0.55 : 0.92
    const size = f(24 * s)
    out.push(
      `<g transform="translate(${f(x)} -60)"><g class="fall" style="animation-duration:${f(dur)}s;animation-delay:${f(-rand() * dur)}s"><g class="spin" style="animation-duration:${f(sway)}s;animation-delay:${f(-rand() * sway)}s"><use href="#petal" x="${f(-12 * s)}" y="${f(-12 * s)}" width="${size}" height="${size}" fill="${pick(rand, fills)}" opacity="${op}"/></g></g></g>`,
    )
  }

  return out.join('')
}

function bokeh(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 24; i++) {
    const x = rand() < 0.5 ? between(rand, 0, 520) : between(rand, 1080, W)
    out.push(
      `<circle class="bk" cx="${f(x)}" cy="${f(between(rand, 0, H))}" r="${f(between(rand, 18, 70))}" fill="url(#bok)" style="animation-delay:${f(-rand() * 10)}s"/>`,
    )
  }

  return out.join('')
}

function sparkles(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 70; i++) {
    out.push(
      `<circle class="sp" cx="${f(rand() * W)}" cy="${f(rand() * H)}" r="${between(rand, 0.6, 1.9).toFixed(2)}" style="animation-delay:${f(-rand() * 5)}s"/>`,
    )
  }

  return out.join('')
}

// A cherry branch reaching in from the top right, blossoms in clusters.
function branch(rand: () => number): string {
  const blossoms: string[] = []
  const spots: [number, number, number][] = [
    [1560, 40, 1.4], [1500, 70, 1.1], [1440, 52, 1.3], [1380, 96, 1.0], [1330, 70, 1.2],
    [1270, 120, 0.9], [1220, 98, 1.1], [1160, 140, 0.8], [1110, 118, 1.0], [1480, 120, 0.9],
    [1400, 150, 0.8], [1300, 168, 0.9], [1050, 150, 0.7], [1580, 110, 1.0], [1350, 30, 0.9],
  ]

  for (const [x, y, s] of spots) {
    const size = f(40 * s)
    blossoms.push(
      `<use href="#flower" x="${f(x - 20 * s)}" y="${f(y - 20 * s)}" width="${size}" height="${size}" fill="${rand() < 0.5 ? 'url(#pet1)' : '#f9d9ee'}" transform="rotate(${f(rand() * 70)} ${x} ${y})"/>`,
    )
  }

  return (
    `<g class="branch">` +
    `<path d="M1640 20C1500 60 1380 80 1260 120S1080 160 1020 170" stroke="#2a1638" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    `<path d="M1460 74C1430 110 1420 140 1400 160M1300 108C1300 140 1290 160 1280 176M1520 56C1540 90 1560 100 1590 116" stroke="#2a1638" stroke-width="6" fill="none" stroke-linecap="round"/>` +
    blossoms.join('') +
    `</g>`
  )
}

// A folding fan: translucent ribs fanned from a pivot near the bottom-left corner.
function fan(rand: () => number): string {
  const px = 360
  const py = 1000
  const R = 640
  const r = 120
  const n = 16
  const from = -64
  const step = 5.6
  const rad = (d: number) => (d * Math.PI) / 180
  const pt = (a: number, rr: number) => `${f(px + Math.sin(rad(a)) * rr)} ${f(py - Math.cos(rad(a)) * rr)}`
  const ribs: string[] = []
  const motifs: string[] = []

  for (let i = 0; i < n; i++) {
    const a0 = from + i * step
    const a1 = a0 + step
    ribs.push(
      `<path d="M${pt(a0, r)}L${pt(a0, R)}L${pt(a1, R)}L${pt(a1, r)}Z" fill="url(#rib${i % 2})"/>` +
        `<path d="M${pt(a0, 40)}L${pt(a0, R)}" stroke="#e9dcff" stroke-opacity=".35" stroke-width="1.2"/>`,
    )

    if (rand() < 0.7) {
      const am = a0 + step / 2
      const rr = between(rand, 260, 580)
      const [mx, my] = pt(am, rr).split(' ').map(Number) as [number, number]
      const s = between(rand, 0.5, 0.9)
      motifs.push(
        `<use href="#flower" x="${f(mx - 20 * s)}" y="${f(my - 20 * s)}" width="${f(40 * s)}" height="${f(40 * s)}" fill="#fbe3ff" opacity=".55"/>`,
      )
    }
  }
  const end = from + n * step
  const outline = `M${pt(from, r)}L${pt(from, R)}A${R} ${R} 0 0 1 ${pt(end, R)}L${pt(end, r)}A${r} ${r} 0 0 0 ${pt(from, r)}Z`

  return (
    `<clipPath id="fanclip"><path d="${outline}"/></clipPath>` +
    `<g>${ribs.join('')}${motifs.join('')}` +
    `<path d="M${pt(from, R)}A${R} ${R} 0 0 1 ${pt(end, R)}" stroke="#f2e4ff" stroke-opacity=".7" stroke-width="3" fill="none"/>` +
    `<path d="M${pt(from, R - 30)}A${R - 30} ${R - 30} 0 0 1 ${pt(end, R - 30)}" stroke="#d4b8ff" stroke-opacity=".35" stroke-width="1.5" fill="none"/>` +
    `<g clip-path="url(#fanclip)"><rect class="sheen" x="-300" y="300" width="260" height="900" fill="url(#sheen)" transform="rotate(25 0 700)"/></g>` +
    `<circle cx="${px}" cy="${py}" r="16" fill="#d9c2ff"/></g>`
  )
}

export function buildSakuraScene(): string {
  const rand = prng(3141)

  const defs =
    SYMBOLS +
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1a0f33"/><stop offset=".55" stop-color="#2c1650"/><stop offset="1" stop-color="#3d1a55"/></linearGradient>` +
    `<radialGradient id="bloom" cx=".85" cy=".1" r=".65"><stop offset="0" stop-color="#ffc2ec" stop-opacity=".6"/><stop offset=".45" stop-color="#b06ad8" stop-opacity=".2"/><stop offset="1" stop-color="#b06ad8" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="bok" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffd0f0" stop-opacity=".35"/><stop offset=".7" stop-color="#d79cf0" stop-opacity=".12"/><stop offset="1" stop-color="#d79cf0" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="pet1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe3f4"/><stop offset="1" stop-color="#f28cc8"/></linearGradient>` +
    `<linearGradient id="pet2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3d9ff"/><stop offset="1" stop-color="#b47af0"/></linearGradient>` +
    `<linearGradient id="rib0" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5a3aa8" stop-opacity=".75"/><stop offset="1" stop-color="#a988f0" stop-opacity=".55"/></linearGradient>` +
    `<linearGradient id="rib1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7650c8" stop-opacity=".7"/><stop offset="1" stop-color="#c6a8ff" stop-opacity=".5"/></linearGradient>` +
    `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe0f6" stop-opacity=".13"/><stop offset="1" stop-color="#ffe0f6" stop-opacity="0"/></linearGradient>`

  const style =
    `.fall{animation:fall linear infinite}@keyframes fall{from{transform:translate(0,0)}to{transform:translate(280px,${H + 140}px)}}` +
    `.spin{animation:spin ease-in-out infinite alternate}@keyframes spin{from{transform:translateX(-22px) rotate(-50deg)}to{transform:translateX(22px) rotate(70deg)}}` +
    `.bk{animation:bk 10s ease-in-out infinite alternate}@keyframes bk{from{opacity:.35;transform:translateY(0)}to{opacity:1;transform:translateY(-18px)}}` +
    `.sp{fill:#fff;animation:sp 3.4s ease-in-out infinite}@keyframes sp{0%,100%{opacity:0}50%{opacity:.95}}` +
    `.sheen{animation:sheen 9s ease-in-out infinite}@keyframes sheen{0%,55%{transform:translateX(0);opacity:0}62%{opacity:1}85%,100%{transform:translateX(900px);opacity:0}}` +
    `.branch{transform-origin:1640px 20px;animation:branch 11s ease-in-out infinite alternate}@keyframes branch{from{transform:rotate(-.8deg)}to{transform:rotate(1deg)}}` +
    `.ray{animation:ray 12s ease-in-out infinite alternate}@keyframes ray{from{opacity:.4}to{opacity:1}}`

  const rays = [
    [1500, 260],
    [1300, 200],
    [1100, 160],
    [900, 120],
  ]
    .map(
      ([x, w], i) =>
        `<path class="ray" d="M${(x ?? 0) + 120} -20L${(x ?? 0) + 120 + (w ?? 0)} -20L${(x ?? 0) - 500 + (w ?? 0)} ${H}L${(x ?? 0) - 500} ${H}Z" fill="url(#ray)" style="animation-delay:${-i * 3}s"/>`,
    )
    .join('')

  const body =
    `<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#bloom)"/>` +
    rays +
    bokeh(rand) +
    fan(rand) +
    branch(rand) +
    sparkles(rand) +
    petals(rand)

  return svg(body, style, defs)
}
