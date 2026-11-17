// Cosmic scene: built once at load from a seeded PRNG, so every reload draws
// the same sky. Pure vector + CSS animation (no script runs in a scene).

const W = 1600
const H = 1000

// mulberry32: tiny deterministic PRNG
function prng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => n.toFixed(1)

function stars(rand: () => number): string {
  const out: string[] = []
  const tints = ['#ffffff', '#ffffff', '#ffffff', '#e9ddff', '#ffe9b8', '#cfe0ff']

  for (let i = 0; i < 220; i++) {
    const x = rand() * W
    const y = rand() * H
    const big = rand() < 0.08
    const r = big ? 1.4 + rand() * 1.1 : 0.35 + rand() * 0.9
    const fill = tints[Math.floor(rand() * tints.length)] ?? '#ffffff'
    const cls = `t${Math.floor(rand() * 4)}`
    const delay = -(rand() * 9)
    out.push(
      `<circle class="${cls}" cx="${f(x)}" cy="${f(y)}" r="${r.toFixed(2)}" fill="${fill}" style="animation-delay:${f(delay)}s"/>`,
    )
  }

  return out.join('')
}

// A few bright stars with a soft cross glint, kept off the centre column.
function glints(rand: () => number): string {
  const out: string[] = []
  const spots: [number, number][] = [
    [180, 160],
    [1420, 120],
    [1300, 820],
    [260, 760],
    [1500, 520],
    [90, 470],
  ]

  for (const [x, y] of spots) {
    const s = 9 + rand() * 8
    const delay = -(rand() * 7)
    out.push(
      `<g class="glint" transform="translate(${x} ${y})" style="animation-delay:${f(delay)}s">` +
        `<circle r="${f(s * 0.9)}" fill="url(#halo)"/>` +
        `<path d="M0 ${-s}L0.6 0L0 ${s}L-0.6 0Z M${-s} 0L0 0.6L${s} 0L0 -0.6Z" fill="#fff6dc"/>` +
        `</g>`,
    )
  }

  return out.join('')
}

// Gold dust: a sparse ring of tiny warm points that slowly turns.
function dust(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 70; i++) {
    const a = rand() * Math.PI * 2
    const d = 380 + rand() * 520
    const x = Math.cos(a) * d
    const y = Math.sin(a) * d * 0.62
    out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${(0.5 + rand() * 0.9).toFixed(2)}"/>`)
  }

  return out.join('')
}

export function buildCosmicScene(): string {
  const rand = prng(20261117)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0.35" y2="1">
<stop offset="0" stop-color="#060515"/><stop offset="0.55" stop-color="#0d0a26"/><stop offset="1" stop-color="#170d2e"/>
</linearGradient>
<radialGradient id="nebV" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#7b4bd6" stop-opacity="0.55"/><stop offset="0.5" stop-color="#4a2a9a" stop-opacity="0.25"/><stop offset="1" stop-color="#2a1660" stop-opacity="0"/>
</radialGradient>
<radialGradient id="nebM" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#c04f9c" stop-opacity="0.38"/><stop offset="0.6" stop-color="#6b2a7a" stop-opacity="0.14"/><stop offset="1" stop-color="#3a1450" stop-opacity="0"/>
</radialGradient>
<radialGradient id="nebG" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#e6b65a" stop-opacity="0.30"/><stop offset="0.55" stop-color="#9a6a2a" stop-opacity="0.10"/><stop offset="1" stop-color="#5a3a14" stop-opacity="0"/>
</radialGradient>
<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
<stop offset="0" stop-color="#fff2cf" stop-opacity="0.9"/><stop offset="0.35" stop-color="#f3cf7a" stop-opacity="0.25"/><stop offset="1" stop-color="#f3cf7a" stop-opacity="0"/>
</radialGradient>
<linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#fff3d1" stop-opacity="0"/><stop offset="1" stop-color="#fff3d1" stop-opacity="0.95"/>
</linearGradient>
</defs>
<style>
.drift1{animation:drift1 70s ease-in-out infinite alternate;transform-origin:300px 250px}
.drift2{animation:drift2 90s ease-in-out infinite alternate;transform-origin:1300px 780px}
.drift3{animation:drift3 60s ease-in-out infinite alternate;transform-origin:1350px 200px}
@keyframes drift1{from{transform:translate(0,0) scale(1)}to{transform:translate(60px,40px) scale(1.12)}}
@keyframes drift2{from{transform:translate(0,0) scale(1.05)}to{transform:translate(-70px,-30px) scale(0.95)}}
@keyframes drift3{from{transform:translate(0,0) scale(0.95);opacity:.7}to{transform:translate(-40px,30px) scale(1.1);opacity:1}}
.t0{animation:tw 3.2s ease-in-out infinite}
.t1{animation:tw 4.7s ease-in-out infinite}
.t2{animation:tw 6.1s ease-in-out infinite}
.t3{opacity:.75}
@keyframes tw{0%,100%{opacity:.25}50%{opacity:1}}
.glint{animation:gl 5.5s ease-in-out infinite}
@keyframes gl{0%,100%{opacity:.45}50%{opacity:1}}
.dust{fill:#f0c870;opacity:.55;animation:spin 240s linear infinite;transform-origin:0 0}
@keyframes spin{to{transform:rotate(360deg)}}
.shoot{opacity:0;animation:shoot 13s linear infinite}
.shoot.b{animation-delay:6.5s;animation-duration:17s}
@keyframes shoot{0%{opacity:0;transform:translate(0,0)}2%{opacity:1}7%{opacity:0;transform:translate(520px,260px)}100%{opacity:0;transform:translate(520px,260px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<ellipse class="drift1" cx="300" cy="250" rx="520" ry="330" fill="url(#nebV)"/>
<ellipse class="drift2" cx="1300" cy="780" rx="560" ry="340" fill="url(#nebM)"/>
<ellipse class="drift3" cx="1350" cy="200" rx="360" ry="240" fill="url(#nebG)"/>
<g transform="translate(${W / 2} ${H / 2})"><g class="dust">${dust(rand)}</g></g>
<g>${stars(rand)}</g>
<g>${glints(rand)}</g>
<g transform="translate(120 90) rotate(26)"><rect class="shoot" width="150" height="1.6" rx="0.8" fill="url(#trail)"/></g>
<g transform="translate(980 60) rotate(26)"><rect class="shoot b" width="110" height="1.3" rx="0.6" fill="url(#trail)"/></g>
</svg>`
}
