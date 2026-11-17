import type { EngineInterface, Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { buildCosmicScene } from './scene'
import { buildFrostBladeScene } from './wallpapers/frost-blade'
import { buildNightRainScene } from './wallpapers/night-rain'
import { buildSakuraScene } from './wallpapers/sakura'
import { buildZenLotusScene } from './wallpapers/zen-lotus'

type Palette = Parameters<typeof makeColors>[0]

type Wallpaper = {
  svg: string
  alt: string
  look: ThemeSetArgs
  problems: string[]
}

// A moving vector scene, with frosted panels over it.
function scene(id: string, alt: string, svg: string, tint: string, palette: Palette): Wallpaper {
  const { theme, problems } = makeColors(palette)

  return {
    svg,
    alt,
    problems,
    look: { colors: theme, backdrop: { scene: id, glass: { blur: 18, tint, opacity: 0.58 } } },
  }
}

// A dark look from a handful of colors.
function dark(label: string, accent: string, pro: string, gray: [string, string, string, string, string, string, string]): Palette {
  const [s0, s1, s2, s3, tp, ts, tm] = gray

  return {
    label,
    only: 'dark',
    roles: { accent, pro, danger: '#f27d8a', success: '#78d6aa', warning: '#f3c46c' },
    dark: {
      gray: {
        anchors: {
          'surface-0': s0,
          'surface-1': s1,
          'surface-2': s2,
          'surface-3': s3,
          'text-primary': tp,
          'text-secondary': ts,
          'text-muted': tm,
        },
      },
    },
  }
}

const COSMIC = dark('Cosmic Violet', '#a98bff', '#d59cf5', ['#0b0a1c', '#121029', '#181533', '#1d1a3b', '#f2ecff', '#cfc6ea', '#a79fca'])
const NIGHT_RAIN = dark('Night Rain', '#6fa8ff', '#b89cff', ['#0a1428', '#0f1b33', '#14213d', '#192746', '#eef4ff', '#c6d3ea', '#9eb0cf'])
const SAKURA = dark('Sakura Dusk', '#c58bff', '#ff9ad5', ['#140c24', '#1b1230', '#22173b', '#281b44', '#f8eefc', '#dccbe8', '#b7a3c9'])
const FROST = dark('Frost Blade', '#7cc4ff', '#d77ad6', ['#070d1f', '#0c1530', '#111c3b', '#152245', '#eef6ff', '#c5d6ef', '#9db1d3'])
const ZEN: Palette = {
  label: 'Zen Lotus',
  only: 'light',
  roles: { accent: '#3f7f62', pro: '#7a5aa8', danger: '#b8423a', success: '#4e8a4f', warning: '#a8711a' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#e6ede1',
        'surface-1': '#eef3ea',
        'surface-2': '#f6f9f3',
        'surface-3': '#f6f9f3',
        'text-primary': '#1f2a22',
        'text-secondary': '#3f4d42',
        'text-muted': '#56655a',
      },
    },
  },
}

const WALLPAPERS: Record<string, Wallpaper> = {
  cosmic: scene('cosmic', 'A slowly drifting violet and gold nebula with twinkling stars', buildCosmicScene(), '#0b0a1c', COSMIC),
  'night-rain': scene('night-rain', 'Rain falling past a night city window, a laptop glowing warm on the desk', buildNightRainScene(), '#0a1428', NIGHT_RAIN),
  sakura: scene('sakura', 'Pink and lilac petals tumbling past a glassy folding fan at violet dusk', buildSakuraScene(), '#160d29', SAKURA),
  'zen-lotus': scene('zen-lotus', 'Lotus flowers on a misty bright pond with motes of light drifting upward', buildZenLotusScene(), '#f3f7ef', ZEN),
  'frost-blade': scene('frost-blade', 'Snowflakes turning in a deep blue night as an icy blade of light flashes across', buildFrostBladeScene(), '#070d1f', FROST),
}

const NAMES = Object.keys(WALLPAPERS)
const DEFAULT = 'night-rain'
const KEY = 'wallpaper'

async function wear($: EngineInterface, name: string) {
  const wp = WALLPAPERS[name]

  if (wp === undefined) {
    return
  }
  const unpainted = wp.problems.find(line => line.startsWith("Desktop won't paint"))

  if (unpainted !== undefined) {
    $.ui.toast(`${name}: ${unpainted}`)
  }
  const set = await $.theme.set(wp.look)

  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'wallpaper',
      description: `Switch the wallpaper: ${NAMES.join(', ')}`,
    })
    const saved = await $.store.get(KEY)
    await wear($, typeof saved === 'string' && saved in WALLPAPERS ? saved : DEFAULT)

    return next(e)
  })

  on('command.run', { command: 'wallpaper' }, async ($, e) => {
    const name = e.args.trim()

    if (name === '') {
      const saved = await $.store.get(KEY)

      return { text: `Wallpapers: ${NAMES.join(', ')}. Wearing: ${typeof saved === 'string' ? saved : DEFAULT}. Use /wallpaper <name>.` }
    }
    if (!(name in WALLPAPERS)) {
      return { text: `No wallpaper "${name}". Choose one of: ${NAMES.join(', ')}.` }
    }
    await $.store.set(KEY, name)
    await wear($, name)

    return { text: `Wallpaper: ${name}.` }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const wp = WALLPAPERS[e.props.scene]

    if (wp === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={wp.svg} alt={wp.alt} isInteractive />
  })
}
