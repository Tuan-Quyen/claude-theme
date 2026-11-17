// The wallpapers: each a vector scene and a palette to wear with it.

import type { ThemeColors } from 'claude-code'

import type { GlassLevel, WallpaperSettings } from '../types'
import { makeColors } from './make-colors.js'
import { buildCosmicScene } from './scene'
import { buildFrostBladeScene } from './wallpapers/frost-blade'
import { buildNightRainScene } from './wallpapers/night-rain'
import { buildSakuraScene } from './wallpapers/sakura'
import { buildZenLotusScene } from './wallpapers/zen-lotus'

type Palette = Parameters<typeof makeColors>[0]

export type Wallpaper = {
  label: string
  alt: string
  /** The scene as drawn, animated. */
  svg: string
  /** The same scene with every animation stopped: motion off, and the pane's previews. */
  still: string
  /** What the panels over the scene are tinted with. */
  tint: string
  colors: ThemeColors
  problems: string[]
}

const STOP = '<style>*{animation:none!important}</style></svg>'

function wallpaper(label: string, alt: string, svg: string, tint: string, palette: Palette): Wallpaper {
  const { theme, problems } = makeColors(palette)

  return { label, alt, svg, still: svg.replace(/<\/svg>$/, STOP), tint, colors: theme, problems }
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

export const WALLPAPERS: Record<string, Wallpaper> = {
  'night-rain': wallpaper(
    'Night Rain',
    'Rain falling past a night city window, a laptop glowing warm on the desk',
    buildNightRainScene(),
    '#0a1428',
    dark('Night Rain', '#6fa8ff', '#b89cff', ['#0a1428', '#0f1b33', '#14213d', '#192746', '#eef4ff', '#c6d3ea', '#9eb0cf']),
  ),
  sakura: wallpaper(
    'Sakura Dusk',
    'Pink and lilac petals tumbling past a glassy folding fan at violet dusk',
    buildSakuraScene(),
    '#160d29',
    dark('Sakura Dusk', '#c58bff', '#ff9ad5', ['#140c24', '#1b1230', '#22173b', '#281b44', '#f8eefc', '#dccbe8', '#b7a3c9']),
  ),
  'zen-lotus': wallpaper('Zen Lotus', 'Lotus flowers on a misty bright pond with motes of light drifting upward', buildZenLotusScene(), '#f3f7ef', ZEN),
  'frost-blade': wallpaper(
    'Frost Blade',
    'A katana with a crystal snowflake in a snowy blue night, light running down its edge',
    buildFrostBladeScene(),
    '#070d1f',
    dark('Frost Blade', '#7cc4ff', '#d77ad6', ['#070d1f', '#0c1530', '#111c3b', '#152245', '#eef6ff', '#c5d6ef', '#9db1d3']),
  ),
  cosmic: wallpaper(
    'Cosmic Violet',
    'A slowly drifting violet and gold nebula with twinkling stars',
    buildCosmicScene(),
    '#0b0a1c',
    dark('Cosmic Violet', '#a98bff', '#d59cf5', ['#0b0a1c', '#121029', '#181533', '#1d1a3b', '#f2ecff', '#cfc6ea', '#a79fca']),
  ),
}

export const NAMES = Object.keys(WALLPAPERS)

export const GLASS: Record<GlassLevel, { label: string; blur: number; opacity: number }> = {
  clear: { label: 'Clear', blur: 6, opacity: 0.35 },
  soft: { label: 'Soft', blur: 12, opacity: 0.48 },
  frosted: { label: 'Frosted', blur: 18, opacity: 0.58 },
  solid: { label: 'Solid', blur: 28, opacity: 0.78 },
}

export const DEFAULTS: WallpaperSettings = { scene: 'night-rain', glass: 'frosted', motion: true }

/** Settings from anything stored, each field checked, the default where it fails. */
export function settingsFrom(value: unknown): WallpaperSettings {
  const v = typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {}
  const scene = typeof v.scene === 'string' && v.scene in WALLPAPERS ? v.scene : DEFAULTS.scene
  const glass = typeof v.glass === 'string' && v.glass in GLASS ? (v.glass as GlassLevel) : DEFAULTS.glass
  const motion = typeof v.motion === 'boolean' ? v.motion : DEFAULTS.motion

  return { scene, glass, motion }
}
