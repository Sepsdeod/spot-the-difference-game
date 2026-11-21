// Lantern Lane — game state, render loop and rules.
// Two canvases show the same scene: the left panel is the original, the
// right panel has every difference applied. A click on either panel marks
// the same scene coordinates. Found differences are circled in green on
// both panels; a hint pulses a ring around one still-hidden difference.

import { SCENES, PANEL_W, PANEL_H } from './scenes.js';
import { SoundBank } from './audio.js';
import { attachPointer, attachKeyboard } from './input.js';
import { updateHud, showOverlay, hideOverlay, startOverlay, levelClearOverlay, winOverlay, timeUpOverlay } from './hud.js';
import { readShotParams } from './shots.js';

const canvasA = document.getElementById('panelA');
const canvasB = document.getElementById('panelB');
const ctxA = canvasA.getContext('2d');
const ctxB = canvasB.getContext('2d');
const sound = new SoundBank();

const state = {
  screen: 'start', // start | play | levelDone | win | over
  levelIndex: 0,
  scene: SCENES[0],
  found: new Set(),
  score: 0,
  combo: 0,
  clicks: 0,
  hintsLeft: 3,
  timeLeft: SCENES[0].timeLimit,
  totalFound: 0,
  totalClicks: 0,
  frozen: false, // screenshot staging: the clock never ticks
  hint: null, // { diff, until }
  wrongFlash: null, // { x, y, until }
  cursor: { x: 280, y: 210, visible: false, moved: false },
  lastTickSecond: -1,
};

function allDiffIds(scene) {
  return new Set(scene.diffs.map((d) => d.id));
}

function startLevel(index, keepScore) {
  state.levelIndex = index;
  state.scene = SCENES[index];
  state.found = new Set();
  state.combo = 0;
  state.clicks = 0;
  state.hintsLeft = 3;
  state.timeLeft = state.scene.timeLimit;
  state.hint = null;
  state.wrongFlash = null;
  state.screen = 'play';
  state.lastTickSecond = -1;
  if (!keepScore) state.score = 0;
  hideOverlay();
  updateHud(state);
}

function nearestDiff(x, y) {
  let best = null;
  let bestD = Infinity;
  for (const d of state.scene.diffs) {
    if (state.found.has(d.id)) continue;
    const dist = Math.hypot(d.x - x, d.y - y);
    if (dist < bestD) {
      bestD = dist;
      best = d;
    }
  }
  return best && bestD <= best.r + 10 ? best : null;
}

function mark(x, y) {
  if (state.screen !== 'play') return;
  sound.ensure();
  state.clicks += 1;
  state.totalClicks += 1;
  const d = nearestDiff(x, y);
  if (d) {
    state.found.add(d.id);
    state.totalFound += 1;
    state.combo += 1;
    const gained = 100 + Math.min(state.combo - 1, 5) * 10;
    state.score += gained;
    sound.find(state.combo);
    if (state.found.size === state.scene.diffs.length) {
      const timeBonus = Math.round(state.timeLeft) * 5;
      state.score += timeBonus;
      state.screen = 'levelDone';
      sound.levelClear();
      levelClearOverlay(state, timeBonus);
    }
  } else {
    state.combo = 0;
    state.score = Math.max(0, state.score - 10);
    state.timeLeft = Math.max(0, state.timeLeft - 3);
    state.wrongFlash = { x, y, until: performance.now() + 450 };
    sound.wrong();
  }
  updateHud(state);
}

function useHint() {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const remaining = state.scene.diffs.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - 25);
  state.hint = { diff: remaining[Math.floor(Math.random() * remaining.length)], until: performance.now() + 2200 };
  sound.hint();
  updateHud(state);
}

function nextLevel() {
  if (state.screen !== 'levelDone') return;
  if (state.levelIndex + 1 < SCENES.length) {
    startLevel(state.levelIndex + 1, true);
  } else {
    state.screen = 'win';
    sound.win();
    winOverlay(state);
  }
}

function restart() {
  state.score = 0;
  state.totalFound = 0;
  state.totalClicks = 0;
  startLevel(0, false);
}

// ---- rendering -------------------------------------------------------------
function drawMarkers(ctx, now) {
  for (const d of state.scene.diffs) {
    if (!state.found.has(d.id)) continue;
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(55, 214, 122, 0.35)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    // Check mark inside the circle.
    ctx.strokeStyle = '#37d67a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 10, d.y);
    ctx.lineTo(d.x - 3, d.y + 8);
    ctx.lineTo(d.x + 11, d.y - 8);
    ctx.stroke();
  }
  if (state.hint && now < state.hint.until) {
    const d = state.hint.diff;
    const pulse = 1 + 0.12 * Math.sin(now / 130);
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 7]);
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r * pulse + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  if (state.wrongFlash && now < state.wrongFlash.until) {
    const { x, y } = state.wrongFlash;
    ctx.strokeStyle = '#ff5a5a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 11, y - 11);
    ctx.lineTo(x + 11, y + 11);
    ctx.moveTo(x + 11, y - 11);
    ctx.lineTo(x - 11, y + 11);
    ctx.stroke();
  }
  if (state.cursor.visible && state.screen === 'play') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(state.cursor.x, state.cursor.y, 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(state.cursor.x - 18, state.cursor.y);
    ctx.lineTo(state.cursor.x + 18, state.cursor.y);
    ctx.moveTo(state.cursor.x, state.cursor.y - 18);
    ctx.lineTo(state.cursor.x, state.cursor.y + 18);
    ctx.stroke();
  }
}

let lastNow = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - lastNow) / 1000 || 0);
  lastNow = now;
  if (state.screen === 'play' && !state.frozen) {
    state.timeLeft -= dt;
    const sec = Math.ceil(state.timeLeft);
    if (state.timeLeft <= 10 && sec !== state.lastTickSecond) {
      state.lastTickSecond = sec;
      sound.tick();
    }
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'over';
      sound.timeUp();
      timeUpOverlay(state);
    }
    updateHud(state);
  }
  state.scene.paint(ctxA, new Set());
  state.scene.paint(ctxB, allDiffIds(state.scene));
  drawMarkers(ctxA, now);
  drawMarkers(ctxB, now);
  requestAnimationFrame(frame);
}

// ---- wiring ----------------------------------------------------------------
attachPointer(canvasA, canvasB, (x, y) => mark(x, y));
attachKeyboard(
  state.cursor,
  (x, y) => mark(x, y),
  () => useHint(),
  () => {
    if (state.screen === 'levelDone') nextLevel();
  },
  () => {
    if (state.screen === 'over' || state.screen === 'win') restart();
    else if (state.screen === 'play') startLevel(state.levelIndex, false);
  },
);
document.getElementById('hintBtn').addEventListener('click', () => useHint());
document.getElementById('soundBtn').addEventListener('click', (ev) => {
  sound.muted = !sound.muted;
  ev.currentTarget.textContent = sound.muted ? 'Sound off' : 'Sound on';
});
window.__lanternStart = () => {
  sound.ensure();
  startLevel(0, false);
};
window.__lanternNext = () => nextLevel();
window.__lanternRestart = () => restart();

// ---- screenshot staging ----------------------------------------------------
const shot = readShotParams();
if (shot) {
  state.frozen = true;
  if (shot.shot === 'play') {
    startLevel(shot.level, false);
    state.timeLeft = 62;
    for (const i of shot.found) {
      const d = state.scene.diffs[i];
      if (d) {
        state.found.add(d.id);
        state.totalFound += 1;
      }
    }
    state.score = state.found.size * 110;
    state.combo = state.found.size;
    updateHud(state);
  } else if (shot.shot === 'win') {
    state.levelIndex = 2;
    state.scene = SCENES[2];
    state.timeLeft = 47;
    state.found = allDiffIds(state.scene);
    state.totalFound = 22;
    state.totalClicks = 24;
    state.score = 2840;
    state.screen = 'win';
    winOverlay(state);
    updateHud(state);
  } else {
    startOverlay();
    updateHud(state);
  }
} else {
  startOverlay();
  updateHud(state);
}

requestAnimationFrame(frame);
window.__shotReady = true;
