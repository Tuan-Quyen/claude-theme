import { expect, test } from 'claude-code/testing'

const PANE = {
  plugin: 'live-wallpaper',
  component: 'Pane',
  requestId: 'wallpaper',
  props: {
    title: 'Wallpaper',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

type Look = { backdrop?: { scene?: string; glass?: { blur?: number; opacity?: number } } }

test('the pane picks a scene, a glass and motion, and keeps them', async ($, on) => {
  // Each hook here stands for the engine.
  const looks: Look[] = []
  const stored: unknown[] = []
  on('command.register', () => ({ value: { command: 'wallpaper' } }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', (_, e) => {
    stored.push(e.value)

    return { value: undefined }
  })
  on('theme.set', (_, e) => {
    looks.push(e as Look)

    return { value: { isDrawn: true, requestId: 'theme-1' } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(looks.at(-1)?.backdrop?.scene).toBe('night-rain')

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /Scene/ })).toBeDefined()
    await ui.unmount()
  }

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'pick-sakura' })
  expect(looks.at(-1)?.backdrop?.scene).toBe('sakura')

  await ui.select({ key: 'glass', value: 'solid' })
  expect(looks.at(-1)?.backdrop?.glass?.opacity).toBe(0.78)

  await ui.select({ key: 'motion', value: 'off' })
  expect(stored.at(-1)).toEqual({ scene: 'sakura', glass: 'solid', motion: false })
  await ui.unmount()
})

test('a stored choice comes back, and a broken one falls back to the default', async ($, on) => {
  const looks: Look[] = []
  let saved: unknown = { scene: 'frost-blade', glass: 'nonsense', motion: 'yes' }
  on('command.register', () => ({ value: { command: 'wallpaper' } }))
  on('store.get', () => ({ value: saved }))
  on('store.set', () => ({ value: undefined }))
  on('theme.set', (_, e) => {
    looks.push(e as Look)

    return { value: { isDrawn: true, requestId: 'theme-1' } }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(looks.at(-1)?.backdrop?.scene).toBe('frost-blade')
  expect(looks.at(-1)?.backdrop?.glass?.opacity).toBe(0.58)

  saved = 'night-rain'
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  expect(looks.at(-1)?.backdrop?.scene).toBe('night-rain')
})
