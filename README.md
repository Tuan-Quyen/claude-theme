# live-wallpaper

Animated vector wallpapers for the Claude desktop and mobile apps, as a Claude Code mod. Each wallpaper is a hand-built SVG scene animated with CSS, paired with a matching color palette, and drawn behind the conversation with frosted panels on top.

| `/wallpaper …` | Scene | Mode |
|---|---|---|
| `night-rain` (default) | Rain on a city window, a glowing laptop, a steaming mug | dark |
| `sakura` | Petals tumbling past a glassy folding fan and a cherry branch | dark |
| `zen-lotus` | Lotus flowers on a misty pond, motes of light rising | light |
| `frost-blade` | A katana with a crystal snowflake, light running down its edge, snow | dark |
| `cosmic` | A drifting violet and gold nebula with twinkling stars | dark |

## Install

At the prompt of a Claude Code session:

```
/plugin install live-wallpaper --marketplace Tuan-Quyen/claude-theme
```

Answer `y` to add the marketplace, then pick a scope (user scope puts it in every session).

The repository is private: the machine installing it needs GitHub access to it (`gh auth login`, or git credentials for github.com).

From a shell:

```bash
claude plugin install live-wallpaper --marketplace Tuan-Quyen/claude-theme
```

Without GitHub, from a copy of this folder on the machine:

```bash
claude plugin marketplace add /path/to/claude-theme
```

```bash
claude plugin install live-wallpaper@claude-theme
```

## Use

Type in the message box (not in a shell):

```
/wallpaper
```

This opens the **Wallpaper pane** beside the chat:

- **Scene**: a card per wallpaper with a preview; press one to wear it.
- **Glass**: how much the panels frost over the wallpaper (Clear, Soft, Frosted, Solid). Solid is the easiest to read on.
- **Motion**: Off stops every animation.
- **Reset**: back to Night Rain, Frosted, motion on.

To switch without the pane, name the wallpaper:

```
/wallpaper sakura
```

Every choice is remembered across sessions.

## Notes

- Wallpapers draw in the desktop and mobile apps only; the terminal and editors keep their own look.
- Every scene respects `prefers-reduced-motion` and stops animating when it is set.
- Scenes are SVG only: the desktop app does not draw embedded pictures in a scene, so there are no photos or characters here.

## Develop

Run a session with the folder loaded and edits hot-reloaded:

```bash
claude --plugin-dir /path/to/claude-theme
```

Check it:

```bash
claude plugin validate .
```

Test it:

```bash
claude plugin test .
```

`hooks/make-colors.js` is copied unchanged from Claude Code's plugin-authoring skill; re-copy it when Claude Code updates.

## License

MIT
