// The mod's state contract: what it keeps in $.state.

/** How much the panels frost over the wallpaper. */
export type GlassLevel = 'clear' | 'soft' | 'frosted' | 'solid'

/** What the Wallpaper pane sets; also kept in $.store across sessions. */
export type WallpaperSettings = {
  scene: string
  glass: GlassLevel
  motion: boolean
}

declare module 'claude-code' {
  interface PluginState {
    'live-wallpaper': { settings: Shaped<WallpaperSettings> }
  }
}
