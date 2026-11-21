# Lantern Lane — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Sepsdeod/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Sepsdeod/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![Node](https://img.shields.io/badge/node-%3E%3D%2022.18-339933)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An original spot-the-difference game for the make.fun bounty
**best-spot-the-difference-game-20261121-0451**. Two near-identical pictures sit
side by side — click (or point with the arrow keys and press Enter) on a
difference in either picture to circle it. Find them all before the lantern
burns down.

## The hunt

| Level | Scene | Differences | Time |
|-------|-------|-------------|------|
| 1 | Harbor at Dusk | 7 | 90 s |
| 2 | Night Market | 7 | 75 s |
| 3 | Moonlit Garden | 8 | 60 s |

Every scene is drawn in code — original vector art, no images, no copied
assets. Differences hide by design: a missing seagull, a flag that changed
colour, a cat that wandered off, tulips that bloomed the wrong colour.

- **Score** — 100 points per find, combo bonus for streaks, time bonus on a
  clear; wrong clicks cost 10 points and 3 seconds.
- **Hints** — 3 per level (H key or the Hint button); a hint pulses a golden
  ring around one still-hidden difference and costs 25 points.
- **Sound** — every effect is synthesized with WebAudio; no audio files.
- **Keyboard + mouse** — arrow keys move a crosshair, Enter marks, H hints,
  R restarts, N continues.

## Play it

```sh
node serve.ts
# open http://localhost:8080
```

Screenshot staging (deterministic states for the maker’s screenshots):

```sh
# ?shot=start | ?shot=play[&level=N][&found=i,j] | ?shot=win
```

## Hand-in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, stdlib only) copies `game/` and `screenshots/` to
`/output` and writes `/output/dossier.json` via `vendor/makefun-game.ts`.

## Layout

- `game/index.html` — page shell, two 560×420 canvases
- `game/styles.css` — dusk theme
- `game/src/main.js` — state machine, render loop, scoring rules
- `game/src/scenes.js` — the three scenes and their 22 differences
- `game/src/input.js` — pointer + keyboard play
- `game/src/audio.js` — WebAudio sound bank
- `game/src/hud.js` — HUD text and overlays
- `game/src/shots.js` — deterministic screenshot staging (`?shot=`)
- `main.ts` — the hand-in program; `serve.ts` — local static server
- `vendor/makefun-game.ts` — the kit’s dossier library, unchanged
- `screenshots/` — 4 real renders of the game in headless Chromium

---

<sub>Entered on [make.fun](https://make.fun/?ref=7nvvsk82&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
