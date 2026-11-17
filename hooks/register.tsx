import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { GlassLevel, WallpaperSettings } from '../types'
import { DEFAULTS, GLASS, NAMES, settingsFrom, WALLPAPERS } from './catalog'

const PANE = 'wallpaper'
const STORE_KEY = 'settings'
// Change the tag when WallpaperSettings' fields change: it declines what an
// earlier version stored in this session's state.
const settings = atom({ plugin: 'live-wallpaper', key: 'settings' } as const, DEFAULTS, { shape: 'settings-1' })

async function wear($: EngineInterface, s: WallpaperSettings) {
  const wp = WALLPAPERS[s.scene]

  if (wp === undefined) {
    return
  }
  const unpainted = wp.problems.find(line => line.startsWith("Desktop won't paint"))

  if (unpainted !== undefined) {
    $.ui.toast(`${s.scene}: ${unpainted}`)
  }
  const glass = GLASS[s.glass]
  const set = await $.theme.set({
    colors: wp.colors,
    backdrop: { scene: s.scene, glass: { blur: glass.blur, tint: wp.tint, opacity: glass.opacity } },
  })

  if (!set.isDrawn) {
    $.ui.status(set.reason)
  }
}

// One place every change goes through: this session's state (redraws the
// pane and the backdrop), the store (the next session), and the theme.
async function apply($: EngineInterface, next: WallpaperSettings) {
  await update($, settings, () => next)
  await $.store.set(STORE_KEY, next)
  await wear($, next)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'wallpaper',
      description: `Open the Wallpaper pane, or switch straight to one: ${NAMES.join(', ')}`,
    })
    const saved = settingsFrom(await $.store.get(STORE_KEY))
    await update($, settings, () => saved)
    await wear($, saved)

    return next(e)
  })

  on('command.run', { command: 'wallpaper' }, async ($, e) => {
    const name = e.args.trim()

    if (name === '') {
      const { isPlaced } = await $.ui.open({ id: PANE, title: 'Wallpaper' })

      return { text: isPlaced ? 'Wallpaper pane opened.' : `Wallpapers: ${NAMES.join(', ')}. Use /wallpaper <name>.` }
    }
    if (!(name in WALLPAPERS)) {
      return { text: `No wallpaper "${name}". Choose one of: ${NAMES.join(', ')}.` }
    }
    await apply($, { ...(await read($, settings)), scene: name })

    return { text: `Wallpaper: ${name}.` }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e)
    const { Box, Text, Button, Select } = els
    // Svg is on desktop and mobile; the terminal shows the cards without pictures.
    const Svg = 'Svg' in els ? els.Svg : undefined
    const s = await read($, settings)

    return (
      <Box flexDirection="column" gap={1}>
        <Text bold>Scene</Text>
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          {NAMES.map(name => {
            const wp = WALLPAPERS[name]

            if (wp === undefined) {
              return null
            }
            const isOn = name === s.scene

            return (
              <Box key={`card-${name}`} flexDirection="column" gap={1} padding={1} borderStyle="round" borderColor={isOn ? 'claude' : 'subtle'}>
                {Svg !== undefined && <Svg source={wp.still} alt={wp.alt} width={208} height={117} />}
                <Button
                  key={`pick-${name}`}
                  label={isOn ? `${wp.label} ✓` : wp.label}
                  variant={isOn ? 'primary' : 'secondary'}
                  onPress={() => void apply($, { ...s, scene: name })}
                />
              </Box>
            )
          })}
        </Box>
        <Select
          key="glass"
          label="Glass"
          options={(Object.keys(GLASS) as GlassLevel[]).map(level => ({ value: level, label: GLASS[level].label }))}
          value={s.glass}
          onSelect={value => void apply($, { ...s, glass: value as GlassLevel })}
        />
        <Select
          key="motion"
          label="Motion"
          options={[
            { value: 'on', label: 'On' },
            { value: 'off', label: 'Off' },
          ]}
          value={s.motion ? 'on' : 'off'}
          onSelect={value => void apply($, { ...s, motion: value === 'on' })}
        />
        <Box flexDirection="row" gap={1}>
          <Button key="reset" label="Reset" dimColor onPress={() => void apply($, DEFAULTS)} />
        </Box>
      </Box>
    )
  })

  on('ui.render', { component: 'Backdrop' }, async ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const wp = WALLPAPERS[e.props.scene]

    if (wp === undefined) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    const { motion } = await read($, settings)

    return <Svg source={motion ? wp.svg : wp.still} alt={wp.alt} isInteractive={motion ? true : undefined} />
  })
}
