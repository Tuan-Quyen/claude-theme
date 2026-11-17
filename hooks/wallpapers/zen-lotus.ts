// Zen lotus (from "thien"): a bright misty pond. Layered lotus flowers and
// buds rise from round pads at the edges, a hazy far shore of lotus, soft
// light from above, mist drifting, shimmer on the water, motes rising.

import { between, f, H, prng, svg, W } from './util'

const WATER = 640

// Petals: one shape, scaled and rotated into three rings.
const PETAL = 'M0 0C-17 -18 -17 -60 0 -84C17 -60 17 -18 0 0Z'

function lotus(x: number, y: number, s: number, delay: number, stem: number): string {
  const ring = (angles: number[], scale: number, fill: string) =>
    angles.map(a => `<path d="${PETAL}" fill="${fill}" transform="rotate(${a}) scale(${scale})"/>`).join('')

  return (
    `<g transform="translate(${x} ${y}) scale(${s})"><g class="bob" style="animation-delay:${f(delay)}s">` +
    `<path d="M0 6C2 ${stem / 2} -4 ${stem * 0.8} 0 ${stem}" stroke="#6f9a5e" stroke-width="5" fill="none"/>` +
    `<ellipse cx="0" cy="8" rx="46" ry="12" fill="#9cc58a" opacity=".5"/>` +
    ring([-78, -54, 54, 78], 0.8, 'url(#lp3)') +
    ring([-40, -20, 20, 40], 0.95, 'url(#lp2)') +
    ring([-10, 10], 1, 'url(#lp1)') +
    `<ellipse cx="0" cy="-26" rx="13" ry="7" fill="#f4d36a"/>` +
    ring([0], 0.85, 'url(#lp1)') +
    `</g></g>`
  )
}

function bud(x: number, y: number, s: number, delay: number): string {
  return (
    `<g transform="translate(${x} ${y}) scale(${s})"><g class="bob" style="animation-delay:${f(delay)}s">` +
    `<path d="M0 0C2 60 -4 110 0 170" stroke="#6f9a5e" stroke-width="5" fill="none"/>` +
    `<path d="M0 4C-20 -14 -16 -50 0 -70C16 -50 20 -14 0 4Z" fill="url(#lp1)"/><path d="M0 4C-10 -14 -9 -40 0 -64" stroke="#f0a58e" stroke-width="1.5" fill="none" opacity=".6"/>` +
    `</g></g>`
  )
}

// A round pad seen low over the water, with its notch and veins.
function pad(x: number, y: number, r: number, notch: number, tone: string): string {
  const rad = (d: number) => (d * Math.PI) / 180
  const a0 = rad(notch)
  const a1 = rad(notch + 26)
  const p = (a: number) => `${f(Math.cos(a) * r)} ${f(Math.sin(a) * r)}`
  const veins = [0, 45, 90, 135, 180, 225, 270, 315]
    .map(d => `M0 0L${f(Math.cos(rad(d + notch + 13)) * r * 0.85)} ${f(Math.sin(rad(d + notch + 13)) * r * 0.85)}`)
    .join('')

  return (
    `<g transform="translate(${x} ${y}) scale(1 .34)">` +
    `<path d="M0 0L${p(a0)}A${r} ${r} 0 1 0 ${p(a1)}Z" fill="${tone}"/>` +
    `<path d="${veins}" stroke="#d7ead0" stroke-width="2.4" opacity=".45" fill="none"/>` +
    `<path d="M0 0L${p(a0)}A${r} ${r} 0 1 0 ${p(a1)}Z" fill="none" stroke="#6f9a5e" stroke-width="3" opacity=".4"/>` +
    `</g>`
  )
}

function farShore(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 18; i++) {
    const x = between(rand, 40, W - 40)
    const y = WATER - between(rand, 4, 30)
    const s = between(rand, 0.25, 0.45)
    out.push(
      `<g transform="translate(${f(x)} ${f(y)}) scale(${s.toFixed(2)})" opacity=".32"><path d="${PETAL}" fill="#f2c6b6" transform="rotate(-30)"/><path d="${PETAL}" fill="#f2c6b6" transform="rotate(30)"/><path d="${PETAL}" fill="#f7d9cc"/><path d="M0 0V140" stroke="#8fb07f" stroke-width="5"/></g>`,
    )
  }
  for (let i = 0; i < 26; i++) {
    out.push(
      `<ellipse cx="${f(rand() * W)}" cy="${f(WATER + between(rand, -6, 14))}" rx="${f(between(rand, 26, 60))}" ry="${f(between(rand, 5, 9))}" fill="#a9c99a" opacity=".45"/>`,
    )
  }

  return out.join('')
}

function bokeh(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 28; i++) {
    out.push(
      `<circle class="bk" cx="${f(rand() * W)}" cy="${f(between(rand, 0, WATER - 60))}" r="${f(between(rand, 18, 64))}" fill="url(#bok)" style="animation-delay:${f(-rand() * 12)}s"/>`,
    )
  }

  return out.join('')
}

function motes(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 44; i++) {
    const dur = between(rand, 12, 24)
    out.push(
      `<circle class="mote" cx="${f(rand() * W)}" cy="${f(between(rand, 560, H + 40))}" r="${between(rand, 1, 2.8).toFixed(2)}" style="animation-duration:${f(dur)}s;animation-delay:${f(-rand() * dur)}s"/>`,
    )
  }

  return out.join('')
}

function shimmer(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 40; i++) {
    const y = between(rand, WATER + 20, H - 10)
    const w = between(rand, 30, 110) * (0.5 + (y - WATER) / (H - WATER))
    out.push(
      `<rect class="sh" x="${f(rand() * W)}" y="${f(y)}" width="${f(w)}" height="2" rx="1" style="animation-delay:${f(-rand() * 6)}s"/>`,
    )
  }

  return out.join('')
}

export function buildZenLotusScene(): string {
  const rand = prng(808)

  const defs =
    `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f8f0"/><stop offset=".6" stop-color="#e5eddc"/><stop offset=".71" stop-color="#d9e6d1"/><stop offset="1" stop-color="#c3d8bb"/></linearGradient>` +
    `<radialGradient id="sun" cx=".5" cy="0" r=".75"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".5" stop-color="#fffbe8" stop-opacity=".35"/><stop offset="1" stop-color="#fffbe8" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="bok" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff" stop-opacity=".75"/><stop offset=".7" stop-color="#ffffff" stop-opacity=".2"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="lp1" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fffaf4"/><stop offset=".55" stop-color="#ffdccb"/><stop offset="1" stop-color="#f29a86"/></linearGradient>` +
    `<linearGradient id="lp2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fcefe6"/><stop offset="1" stop-color="#eda592"/></linearGradient>` +
    `<linearGradient id="lp3" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f6e6dc"/><stop offset="1" stop-color="#df9c8c"/></linearGradient>` +
    `<linearGradient id="ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".5"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9d2b0" stop-opacity="0"/><stop offset=".25" stop-color="#b9d2b0" stop-opacity=".45"/><stop offset="1" stop-color="#a9c6a0" stop-opacity=".6"/></linearGradient>` +
    `<radialGradient id="mist"cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff" stop-opacity=".6"/><stop offset=".6" stop-color="#ffffff" stop-opacity=".25"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`

  const style =
    `.bob{animation:bob 7s ease-in-out infinite alternate}@keyframes bob{from{transform:translateY(0) rotate(-1.5deg)}to{transform:translateY(-6px) rotate(1.5deg)}}` +
    `.bk{animation:bk 12s ease-in-out infinite alternate}@keyframes bk{from{opacity:.3;transform:translate(0,0)}to{opacity:.95;transform:translate(14px,-10px)}}` +
    `.mote{fill:#fffdf0;animation:rise linear infinite}@keyframes rise{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}85%{opacity:.7}100%{opacity:0;transform:translate(40px,-560px)}}` +
    `.sun{animation:sun 10s ease-in-out infinite alternate}@keyframes sun{from{opacity:.75}to{opacity:1}}` +
    `.ray{animation:ray 14s ease-in-out infinite alternate}@keyframes ray{from{opacity:.25}to{opacity:.8}}` +
    `.mist{animation:mist 40s ease-in-out infinite alternate}.mist.b{animation-duration:55s;animation-direction:alternate-reverse}@keyframes mist{from{transform:translateX(-200px)}to{transform:translateX(200px)}}` +
    `.sh{fill:#ffffff;animation:sh 6s ease-in-out infinite}@keyframes sh{0%,100%{opacity:0;transform:translateX(0)}50%{opacity:.7;transform:translateX(18px)}}` +
    `.ripple{fill:none;stroke:#ffffff;stroke-width:1.6;animation:ripple 6s ease-out infinite}@keyframes ripple{from{opacity:.8;transform:scale(.2)}to{opacity:0;transform:scale(1.6)}}`

  const rays = [520, 700, 880, 1060]
    .map(
      (x, i) =>
        `<path class="ray" d="M${x} -20L${x + 70} -20L${x + 260 - i * 120} ${WATER}L${x + 120 - i * 120} ${WATER}Z" fill="url(#ray)" style="animation-delay:${-i * 3.5}s"/>`,
    )
    .join('')

  const ripples = [
    [330, 790],
    [1290, 770],
    [800, 850],
    [560, 720],
  ]
    .map(([x, y], i) => `<g transform="translate(${x} ${y})"><ellipse class="ripple" rx="90" ry="16" style="animation-delay:${-i * 1.5}s"/></g>`)
    .join('')

  const body =
    `<rect width="${W}" height="${H}" fill="url(#bg)"/>` +
    `<rect class="sun" width="${W}" height="${H}" fill="url(#sun)"/>` +
    rays +
    bokeh(rand) +
    farShore(rand) +
    `<ellipse class="mist" cx="${W / 2}" cy="${WATER - 20}" rx="${W * 0.7}" ry="70" fill="url(#mist)"/>` +
    `<rect x="0" y="${WATER + 4}" width="${W}" height="${H - WATER}" fill="url(#water)"/>` +
    shimmer(rand) +
    ripples +
    // left cluster
    pad(150, 780, 150, 200, '#8ebd78') +
    pad(390, 850, 110, 320, '#9cc887') +
    pad(60, 870, 120, 40, '#86b471') +
    lotus(190, 640, 1.35, 0, 150) +
    lotus(360, 730, 0.9, -2, 120) +
    bud(80, 600, 1.1, -4) +
    // right cluster
    pad(1330, 790, 160, 230, '#8ebd78') +
    pad(1540, 860, 120, 300, '#9cc887') +
    pad(1150, 860, 100, 10, '#86b471') +
    lotus(1360, 630, 1.45, -3.5, 170) +
    lotus(1530, 740, 0.85, -1, 120) +
    bud(1200, 650, 0.95, -6) +
    `<ellipse class="mist b" cx="${W / 2}" cy="${H - 70}" rx="${W * 0.6}" ry="80" fill="url(#mist)" opacity=".8"/>` +
    motes(rand)

  return svg(body, style, defs)
}
