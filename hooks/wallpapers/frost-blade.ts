// Frost blade: deep night blue, violet aurora ribbons, ice shards in the
// corners, a katana across the lower third with a crystal snowflake on the
// blade, a flash of light running down its edge now and then, snow falling.

import { between, f, H, pick, prng, svg, W } from './util'

// Two snowflakes: a plain six-arm star and a crystal with plates.
const SYMBOLS =
  '<symbol id="fl1" viewBox="-12 -12 24 24" overflow="visible"><g stroke="#e6f4ff" stroke-width="1.3" stroke-linecap="round" fill="none">' +
  [0, 60, 120].map(a => `<path transform="rotate(${a})" d="M0 -11V11M0 -7l-3 -3M0 -7l3 -3M0 7l-3 3M0 7l3 3"/>`).join('') +
  '</g></symbol>' +
  '<symbol id="fl2" viewBox="-12 -12 24 24" overflow="visible"><g fill="#e9f6ff">' +
  [0, 60, 120, 180, 240, 300].map(a => `<path transform="rotate(${a})" d="M-1 -1L-1 -10L0 -12L1 -10L1 -1ZM0 -6L-3.5 -8.5L-3 -7L0 -4.6L3 -7L3.5 -8.5Z"/>`).join('') +
  '<circle r="2"/></g></symbol>' +
  // The big crystal on the blade: faceted arms, built once.
  '<symbol id="crystal" viewBox="-100 -100 200 200" overflow="visible"><g>' +
  [0, 60, 120, 180, 240, 300]
    .map(
      a =>
        `<g transform="rotate(${a})"><path d="M0 0L-9 -20L0 -92L9 -20Z" fill="url(#facetA)"/><path d="M0 0L0 -92L9 -20Z" fill="url(#facetB)"/>` +
        `<path d="M0 -40L-26 -58L-22 -50L0 -32ZM0 -40L26 -58L22 -50L0 -32ZM0 -64L-17 -78L-14 -72L0 -58ZM0 -64L17 -78L14 -72L0 -58Z" fill="#dff2ff"/></g>`,
    )
    .join('') +
  '<circle r="14" fill="#f4fbff"/></g></symbol>'

function flakes(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 44; i++) {
    const s = between(rand, 0.5, 2)
    const dur = between(rand, 10, 22)
    const spin = between(rand, 6, 14)
    const size = f(24 * s)
    out.push(
      `<g transform="translate(${f(between(rand, -80, W + 80))} -30)"><g class="fall" style="animation-duration:${f(dur)}s;animation-delay:${f(-rand() * dur)}s"><g class="turn" style="animation-duration:${f(spin)}s"><use href="#${pick(rand, ['fl1', 'fl2'])}" x="${f(-12 * s)}" y="${f(-12 * s)}" width="${size}" height="${size}" opacity="${s < 0.9 ? 0.45 : 0.9}"/></g></g></g>`,
    )
  }

  return out.join('')
}

function dust(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 80; i++) {
    out.push(
      `<circle class="ice" cx="${f(rand() * W)}" cy="${f(rand() * H)}" r="${between(rand, 0.5, 1.7).toFixed(2)}" style="animation-delay:${f(-rand() * 4)}s"/>`,
    )
  }

  return out.join('')
}

// A cluster of ice shards growing from a corner point.
function shards(rand: () => number, cx: number, cy: number, from: number, to: number, scale: number): string {
  const out: string[] = []

  for (let i = 0; i < 9; i++) {
    const a = ((from + rand() * (to - from)) * Math.PI) / 180
    const len = between(rand, 90, 260) * scale
    const w = between(rand, 14, 34) * scale
    const tx = cx + Math.cos(a) * len
    const ty = cy + Math.sin(a) * len
    const nx = -Math.sin(a) * w
    const ny = Math.cos(a) * w
    out.push(
      `<path d="M${f(cx + nx)} ${f(cy + ny)}L${f(tx)} ${f(ty)}L${f(cx - nx)} ${f(cy - ny)}Z" fill="url(#shardA)"/>` +
        `<path d="M${f(cx)} ${f(cy)}L${f(tx)} ${f(ty)}L${f(cx - nx)} ${f(cy - ny)}Z" fill="url(#shardB)"/>` +
        `<circle class="glint" cx="${f(tx)}" cy="${f(ty)}" r="3" fill="#ffffff" style="animation-delay:${f(-rand() * 6)}s"/>`,
    )
  }

  return out.join('')
}

// The katana in its own frame: blade along +x from the guard at 0,0.
function katana(): string {
  const L = 1500
  const blade =
    `M0 -20C${L * 0.4} -24 ${L * 0.8} -30 ${L} -52` + // back of the blade, rising to the tip
    `L${L - 60} -22C${L * 0.8} -4 ${L * 0.4} 6 0 20Z` // edge back to the guard

  return (
    `<g transform="translate(170 800) rotate(-7)" opacity=".9">` +
    // hilt and guard
    `<rect x="-260" y="-17" width="250" height="34" rx="8" fill="#141c3a"/>` +
    [-230, -190, -150, -110, -70, -30]
      .map(x => `<path d="M${x} -17L${x + 20} 17M${x + 20} -17L${x} 17" stroke="#3a4f8a" stroke-width="5"/>`)
      .join('') +
    `<ellipse cx="0" cy="0" rx="16" ry="56" fill="#1b2650" stroke="#8fb8ff" stroke-width="3"/>` +
    // blade body, edge highlight, temper line
    `<path d="${blade}" fill="url(#steel)"/>` +
    `<path d="M0 16C${L * 0.4} 4 ${L * 0.8} -6 ${L - 60} -24" stroke="#ffffff" stroke-width="3" fill="none" opacity=".85"/>` +
    `<path d="M10 6C120 -2 220 10 330 0S560 2 680 -6S920 -8 1040 -16S1260 -22 1400 -34" stroke="#cfeaff" stroke-width="2" fill="none" opacity=".55"/>` +
    // light running down the edge
    `<path class="run" d="M0 16C${L * 0.4} 4 ${L * 0.8} -6 ${L - 60} -24" stroke="url(#runner)" stroke-width="10" fill="none" pathLength="100" stroke-dasharray="14 100"/>` +
    // the crystal on the blade
    `<g transform="translate(330 -2)"><circle class="halo" r="150" fill="url(#halo)"/><g class="crys"><use href="#crystal" x="-95" y="-95" width="190" height="190"/></g></g>` +
    `</g>`
  )
}

export function buildFrostBladeScene(): string {
  const rand = prng(2025)

  const defs =
    SYMBOLS +
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#030713"/><stop offset=".5" stop-color="#091633"/><stop offset="1" stop-color="#111a44"/></linearGradient>` +
    `<radialGradient id="cold" cx=".62" cy=".4" r=".55"><stop offset="0" stop-color="#4f9cff" stop-opacity=".32"/><stop offset=".6" stop-color="#2a5bb8" stop-opacity=".1"/><stop offset="1" stop-color="#2a5bb8" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f8fc4"/><stop offset=".45" stop-color="#c9e2ff"/><stop offset=".6" stop-color="#f2f9ff"/><stop offset="1" stop-color="#8fb4e6"/></linearGradient>` +
    `<linearGradient id="runner" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset=".6" stop-color="#ffffff"/><stop offset="1" stop-color="#bfe4ff" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e8f6ff" stop-opacity=".75"/><stop offset=".35" stop-color="#8fd0ff" stop-opacity=".25"/><stop offset="1" stop-color="#8fd0ff" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="facetA" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#a9dcff"/></linearGradient>` +
    `<linearGradient id="facetB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#cfe9ff"/><stop offset="1" stop-color="#5fa8ea"/></linearGradient>` +
    `<linearGradient id="shardA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bfe2ff" stop-opacity=".55"/><stop offset="1" stop-color="#3f74c4" stop-opacity=".25"/></linearGradient>` +
    `<linearGradient id="shardB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".35"/><stop offset="1" stop-color="#7fb4f0" stop-opacity=".1"/></linearGradient>` +
    `<linearGradient id="aurA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d04fa0" stop-opacity="0"/><stop offset=".5" stop-color="#d04fa0" stop-opacity=".5"/><stop offset="1" stop-color="#7a4bd6" stop-opacity="0"/></linearGradient>` +
    `<linearGradient id="aurB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4bb8d6" stop-opacity="0"/><stop offset=".5" stop-color="#6a7cf0" stop-opacity=".35"/><stop offset="1" stop-color="#7a4bd6" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="flare" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".3" stop-color="#bfe4ff" stop-opacity=".4"/><stop offset="1" stop-color="#bfe4ff" stop-opacity="0"/></radialGradient>`

  const style =
    `.fall{animation:fall linear infinite}@keyframes fall{to{transform:translate(-120px,${H + 80}px)}}` +
    `.turn{animation:turn linear infinite}@keyframes turn{to{transform:rotate(360deg)}}` +
    `.ice{fill:#dff1ff;animation:ice 4s ease-in-out infinite}@keyframes ice{0%,100%{opacity:.1}50%{opacity:1}}` +
    `.glint{animation:glint 6s ease-in-out infinite}@keyframes glint{0%,80%,100%{opacity:0}88%{opacity:1}}` +
    `.run{animation:run 10s ease-in-out infinite}@keyframes run{0%,50%{stroke-dashoffset:110;opacity:0}52%{opacity:1}68%{stroke-dashoffset:-10;opacity:1}72%,100%{stroke-dashoffset:-10;opacity:0}}` +
    `.halo{animation:halo 10s ease-in-out infinite}@keyframes halo{0%,45%,80%,100%{opacity:.55;transform:scale(1)}52%{opacity:1;transform:scale(1.25)}}` +
    `.crys{animation:crys 40s linear infinite}@keyframes crys{to{transform:rotate(60deg)}}` +
    `.aur{animation:aur 18s ease-in-out infinite alternate}.aur.b{animation-duration:24s;animation-direction:alternate-reverse}@keyframes aur{from{transform:translate(0,0);opacity:.6}to{transform:translate(-90px,30px);opacity:1}}` +
    `.flare{animation:flare 10s ease-out infinite;transform-origin:1590px 560px}@keyframes flare{0%,64%{opacity:0;transform:scale(.4)}69%{opacity:1;transform:scale(1)}82%,100%{opacity:0;transform:scale(1.3)}}`

  const body =
    `<rect width="${W}" height="${H}" fill="url(#bg)"/><rect width="${W}" height="${H}" fill="url(#cold)"/>` +
    `<g class="aur"><path d="M800 30C1050 110 1300 50 1680 170L1680 220C1300 100 1050 170 800 80Z" fill="url(#aurA)"/></g>` +
    `<g class="aur b"><path d="M-80 260C200 180 520 280 900 200L900 230C520 320 200 220 -80 300Z" fill="url(#aurB)"/></g>` +
    dust(rand) +
    shards(rand, -20, H + 20, -80, -10, 1.2) +
    shards(rand, W + 20, -20, 100, 170, 1) +
    katana() +
    `<circle class="flare" cx="1590" cy="560" r="130" fill="url(#flare)"/>` +
    flakes(rand)

  return svg(body, style, defs)
}
