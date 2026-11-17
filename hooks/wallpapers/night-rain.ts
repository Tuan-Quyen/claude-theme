// Night rain: a dark room, a wide two-pane window on a blue city in the rain,
// a monstera in silhouette, a desk with a glowing laptop and a steaming mug.

import { between, f, H, prng, svg, W } from './util'

const WIN = { x: 230, y: 110, w: 1040, h: 520 }
const HORIZON = 470

function skyline(rand: () => number, base: number, minH: number, maxH: number, fill: string, lit: number, gap: number): string {
  const out: string[] = []
  let x = WIN.x - 20

  while (x < WIN.x + WIN.w + 20) {
    const w = between(rand, 26, 74)
    const h = between(rand, minH, maxH)
    const top = base - h
    out.push(`<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${fill}"/>`)

    // A spire or a setback now and then.
    if (rand() < 0.18) {
      out.push(`<rect x="${f(x + w / 2 - 1.5)}" y="${f(top - 26)}" width="3" height="26" fill="${fill}"/><circle class="beacon" cx="${f(x + w / 2)}" cy="${f(top - 27)}" r="2" fill="#ff5a5a" style="animation-delay:${f(-rand() * 2)}s"/>`)
    } else if (rand() < 0.3) {
      out.push(`<rect x="${f(x + w * 0.2)}" y="${f(top - 18)}" width="${f(w * 0.6)}" height="18" fill="${fill}"/>`)
    }

    // Lit windows from one of a few tiled patterns, plus a couple that flicker.
    if (h > 50) {
      out.push(
        `<rect x="${f(x + 4)}" y="${f(top + 6)}" width="${f(w - 8)}" height="${f(h - 12)}" fill="url(#wp${Math.floor(rand() * 3)})" opacity="${lit.toFixed(2)}"/>`,
      )
      for (let i = 0; i < 2; i++) {
        if (rand() < 0.5) continue
        out.push(
          `<rect class="win" style="animation-delay:${f(-rand() * 9)}s" x="${f(x + 5 + rand() * (w - 10))}" y="${f(top + 8 + rand() * (h - 16))}" width="2.6" height="3.4" fill="#ffe2a0"/>`,
        )
      }
    }
    x += w + between(rand, 1, gap)
  }

  return out.join('')
}

function rain(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 140; i++) {
    const x = WIN.x + rand() * (WIN.w + 60)
    const y = WIN.y - 90 + rand() * 70
    const len = between(rand, 16, 44)
    out.push(
      `<line class="r${Math.floor(rand() * 3)}" x1="${f(x)}" y1="${f(y)}" x2="${f(x - 3)}" y2="${f(y + len)}" style="animation-delay:${(-rand() * 1.3).toFixed(2)}s"/>`,
    )
  }

  return out.join('')
}

// Beads of water creeping down the glass, leaving a faint trail.
function drops(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 26; i++) {
    const x = WIN.x + 10 + rand() * (WIN.w - 20)
    const y = WIN.y + rand() * 120
    const r = between(rand, 1.6, 3.4)
    const dur = between(rand, 7, 16)
    out.push(
      `<g class="drop" style="animation-duration:${f(dur)}s;animation-delay:${f(-rand() * dur)}s"><line x1="${f(x)}" y1="${f(y - 30)}" x2="${f(x)}" y2="${f(y)}" class="trail"/><circle cx="${f(x)}" cy="${f(y)}" r="${r.toFixed(2)}" fill="url(#bead)"/></g>`,
    )
  }

  return out.join('')
}

// Car lights sliding along a far elevated road.
function traffic(rand: () => number): string {
  const out: string[] = []

  for (let i = 0; i < 14; i++) {
    const right = rand() < 0.5
    const dur = between(rand, 9, 18)
    out.push(
      `<circle class="${right ? 'car-r' : 'car-l'}" cx="${right ? WIN.x - 10 : WIN.x + WIN.w + 10}" cy="${right ? HORIZON + 12 : HORIZON + 17}" r="1.8" fill="${right ? '#fff1c9' : '#ff6a5a'}" style="animation-duration:${f(dur)}s;animation-delay:${f(-rand() * dur)}s"/>`,
    )
  }

  return out.join('')
}

// A monstera: split leaves on long stems, swaying a little.
function monstera(): string {
  const leaf = (x: number, y: number, a: number, s: number) =>
    `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">` +
    `<path d="M0 0C-38 -18 -70 -70 -52 -120C-40 -150 -10 -160 0 -162C10 -160 40 -150 52 -120C70 -70 38 -18 0 0Z"/>` +
    `<path d="M0 -6V-156" stroke="#16324f" stroke-width="2.4" fill="none"/>` +
    `<path d="M-6 -40L-46 -58M-6 -70L-54 -96M-4 -100L-40 -132M6 -40L46 -58M6 -70L54 -96M4 -100L40 -132" stroke="#0a1426" stroke-width="5" fill="none"/>` +
    `</g>`

  return (
    `<g class="sway" fill="#0d2138">` +
    `<path d="M262 600C250 520 230 470 200 430M268 600C280 520 320 470 360 440M265 600C262 520 270 440 280 380" stroke="#0d2138" stroke-width="5" fill="none"/>` +
    leaf(200, 430, -48, 1.05) +
    leaf(360, 440, 42, 0.95) +
    leaf(280, 380, -6, 1.1) +
    leaf(170, 520, -78, 0.7) +
    leaf(390, 530, 70, 0.65) +
    `</g>` +
    `<path d="M200 596h130l-14 92h-102z" fill="#122a48"/><path d="M196 590h138v12h-138z" fill="#183559"/>`
  )
}

function desk(): string {
  return (
    // desk top and front
    `<rect x="0" y="676" width="${W}" height="20" fill="#2c4d84"/><rect x="0" y="696" width="${W}" height="${H - 696}" fill="#0b1832"/>` +
    `<rect x="0" y="696" width="${W}" height="6" fill="#071026"/>` +
    // books
    `<rect x="440" y="628" width="120" height="16" rx="2" fill="#2a3f6e"/><rect x="448" y="644" width="112" height="16" rx="2" fill="#35508a"/><rect x="436" y="660" width="128" height="16" rx="2" fill="#203560"/>` +
    // small clock
    `<circle cx="640" cy="648" r="26" fill="#152c52" stroke="#2e4c80" stroke-width="4"/><path class="tick" d="M640 648V630" stroke="#b9cff0" stroke-width="2.5" stroke-linecap="round"/><path d="M640 648L652 654" stroke="#b9cff0" stroke-width="2.5" stroke-linecap="round"/>` +
    // mug and steam
    `<path d="M840 628h46v40a8 8 0 0 1 -8 8h-30a8 8 0 0 1 -8 -8z" fill="#1d3a66"/><path d="M886 638c16 0 16 26 0 26" stroke="#1d3a66" stroke-width="6" fill="none"/>` +
    `<g class="steam"><path d="M852 620c-8 -14 8 -22 0 -36s8 -22 0 -34"/><path d="M872 620c-8 -14 8 -22 0 -36s8 -22 0 -34" style="animation-delay:-1.6s"/></g>` +
    // laptop: screen, glow, keyboard
    `<ellipse class="glow" cx="1110" cy="640" rx="260" ry="160" fill="url(#glow)"/>` +
    `<path d="M1000 552h220v124h-220z" fill="#2e2318"/><rect x="1010" y="562" width="200" height="104" fill="url(#screen)"/>` +
    `<g opacity=".75" fill="#8a5a1e"><rect x="1024" y="578" width="90" height="5"/><rect x="1024" y="590" width="130" height="5"/><rect x="1024" y="602" width="70" height="5"/><rect class="caret" x="1098" y="602" width="6" height="5"/><rect x="1024" y="622" width="150" height="26" fill="#c9862c" opacity=".5"/></g>` +
    `<path d="M975 676h270l18 14h-306z" fill="#c9a067"/><path d="M1000 680h220l8 6h-236z" fill="#a8804c"/>` +
    // desk lamp on the right
    `<path d="M1430 676h90l-8 -10h-74z" fill="#152c52"/><path d="M1474 666L1452 560L1500 520" stroke="#1b3762" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M1488 506l52 26l-22 34l-52 -26z" fill="#1f3d6c"/>` +
    `<ellipse class="glow2" cx="1500" cy="640" rx="120" ry="60" fill="url(#glow)"/>`
  )
}

// Three window patterns: a 56x64 tile of 8x8 cells, a few lit in each.
function windowPatterns(rand: () => number): string {
  const out: string[] = []

  for (let p = 0; p < 3; p++) {
    const cells: string[] = []

    for (let cy = 0; cy < 8; cy++) {
      for (let cx = 0; cx < 8; cx++) {
        if (rand() > 0.32) continue
        cells.push(`<rect x="${cx * 7}" y="${cy * 8}" width="2.6" height="3.4" fill="${rand() < 0.8 ? '#ffe2a0' : '#bfe0ff'}"/>`)
      }
    }
    out.push(`<pattern id="wp${p}" width="56" height="64" patternUnits="userSpaceOnUse">${cells.join('')}</pattern>`)
  }

  return out.join('')
}

export function buildNightRainScene(): string {
  const rand = prng(1117)

  const defs =
    windowPatterns(rand) +
    `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2f74"/><stop offset=".55" stop-color="#2f6cc4"/><stop offset=".68" stop-color="#78a6e2"/><stop offset=".71" stop-color="#ffbe86"/><stop offset=".74" stop-color="#3a63a6"/><stop offset="1" stop-color="#172f5c"/></linearGradient>` +
    `<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffc56a" stop-opacity=".55"/><stop offset=".5" stop-color="#ff9d3a" stop-opacity=".16"/><stop offset="1" stop-color="#ff9d3a" stop-opacity="0"/></radialGradient>` +
    `<linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0c0"/><stop offset="1" stop-color="#ffc66e"/></linearGradient>` +
    `<linearGradient id="room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1a38"/><stop offset="1" stop-color="#081329"/></linearGradient>` +
    `<radialGradient id="bead" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".6" stop-color="#bcd8ff" stop-opacity=".5"/><stop offset="1" stop-color="#bcd8ff" stop-opacity=".1"/></radialGradient>` +
    `<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc4ff" stop-opacity="0"/><stop offset="1" stop-color="#9cc4ff" stop-opacity=".35"/></linearGradient>` +
    `<clipPath id="win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}"/></clipPath>`

  const style =
    `line{stroke:#d6e9ff;stroke-width:1.3;stroke-linecap:round}` +
    `.r0{opacity:.6;animation:fall .7s linear infinite}.r1{opacity:.4;animation:fall .95s linear infinite}.r2{opacity:.25;stroke-width:.9;animation:fall 1.2s linear infinite}` +
    `@keyframes fall{to{transform:translate(-18px,${WIN.h + 110}px)}}` +
    `.trail{stroke:#cfe3ff;stroke-width:1;opacity:.25}` +
    `.drop{animation:drop linear infinite}@keyframes drop{0%{transform:translateY(0);opacity:0}8%{opacity:1}100%{transform:translateY(${WIN.h - 110}px);opacity:.6}}` +
    `.win{animation:flick 8s ease-in-out infinite}@keyframes flick{0%,100%{opacity:1}45%{opacity:.1}55%{opacity:1}}` +
    `.beacon{animation:beacon 2s steps(1) infinite}@keyframes beacon{0%{opacity:1}50%{opacity:.15}}` +
    `.car-r{animation:car-r linear infinite}@keyframes car-r{to{transform:translateX(${WIN.w + 20}px)}}` +
    `.car-l{animation:car-l linear infinite}@keyframes car-l{to{transform:translateX(-${WIN.w + 20}px)}}` +
    `.glow{animation:breathe 4.5s ease-in-out infinite}.glow2{animation:breathe 6s ease-in-out infinite;opacity:.5}@keyframes breathe{0%,100%{opacity:.55}50%{opacity:1}}` +
    `.caret{animation:caret 1.1s steps(1) infinite}@keyframes caret{50%{opacity:0}}` +
    `.steam path{fill:none;stroke:#cfe0ff;stroke-width:3;stroke-linecap:round;opacity:0;animation:steam 3.2s ease-out infinite}@keyframes steam{0%{opacity:0;transform:translateY(6px)}30%{opacity:.35}100%{opacity:0;transform:translateY(-24px)}}` +
    `.tick{transform-origin:640px 648px;animation:tick 60s steps(60) infinite}@keyframes tick{to{transform:rotate(360deg)}}` +
    `.sway{transform-origin:265px 600px;animation:sway 9s ease-in-out infinite alternate}@keyframes sway{from{transform:rotate(-1.2deg)}to{transform:rotate(1.4deg)}}` +
    `.mist{animation:mist 16s ease-in-out infinite alternate}@keyframes mist{from{opacity:.2}to{opacity:.7}}`

  const body =
    `<rect width="${W}" height="${H}" fill="url(#room)"/>` +
    // shelf and cables above the window
    `<rect x="0" y="0" width="${W}" height="70" fill="#0e2045"/><rect x="150" y="70" width="1200" height="10" fill="#132a55"/>` +
    [260, 360, 470, 590, 720, 860, 990, 1120, 1230]
      .map((x, i) => `<path d="M${x} 80c-6 ${14 + (i % 3) * 6} 12 ${14 + (i % 3) * 6} 6 0" stroke="#1c3a6e" stroke-width="3" fill="none"/>`)
      .join('') +
    // window
    `<g clip-path="url(#win)">` +
    `<rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" fill="url(#sky)"/>` +
    skyline(rand, HORIZON - 30, 40, 110, '#4f84cf', 0.35, 4) +
    skyline(rand, HORIZON - 6, 70, 180, '#3a6fc0', 0.45, 10) +
    skyline(rand, HORIZON + 6, 110, 250, '#26549f', 0.5, 16) +
    `<rect x="${WIN.x}" y="${HORIZON + 6}" width="${WIN.w}" height="8" fill="#ffb27a" opacity=".55"/>` +
    `<rect x="${WIN.x}" y="${HORIZON + 14}" width="${WIN.w}" height="${WIN.y + WIN.h - HORIZON - 14}" fill="#1b3b72"/>` +
    traffic(rand) +
    `<rect class="mist" x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" fill="url(#haze)"/>` +
    rain(rand) +
    drops(rand) +
    `</g>` +
    // frame and mullion
    `<rect x="${WIN.x - 14}" y="${WIN.y - 14}" width="${WIN.w + 28}" height="${WIN.h + 28}" fill="none" stroke="#132a52" stroke-width="28"/>` +
    `<rect x="${WIN.x + WIN.w / 2 - 7}" y="${WIN.y}" width="14" height="${WIN.h}" fill="#132a52"/>` +
    `<rect x="${WIN.x}" y="${WIN.y + WIN.h - 4}" width="${WIN.w}" height="4" fill="#1d3b6e"/>` +
    // wall notes on the right
    `<rect x="1320" y="150" width="200" height="120" fill="#0f2348"/><rect x="1336" y="166" width="168" height="40" fill="#162f5d"/><rect x="1336" y="216" width="80" height="8" fill="#2a4a80"/><rect x="1336" y="232" width="120" height="8" fill="#2a4a80"/>` +
    `<rect x="1350" y="300" width="70" height="90" fill="#1a3463" transform="rotate(-4 1385 345)"/><rect x="1440" y="310" width="70" height="80" fill="#14305c" transform="rotate(5 1475 350)"/>` +
    monstera() +
    desk()

  return svg(body, style, defs)
}
