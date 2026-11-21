// Lantern Lane — HUD and overlays.
// All text the player sees lives here: the top bar (level, timer, counter,
// score, hints) and the full-screen overlays (start, level clear, win,
// time up). The game canvas itself never carries text, so screenshots stay
// readable at a glance.

const $ = (id) => document.getElementById(id);

export function updateHud(state) {
  const scene = state.scene;
  $('levelName').textContent = `Level ${state.levelIndex + 1} · ${scene.name}`;
  $('levelSub').textContent = scene.subtitle;
  const mins = Math.floor(Math.max(0, state.timeLeft) / 60);
  const secs = Math.floor(Math.max(0, state.timeLeft) % 60);
  $('timerText').textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  $('timerBar').style.width = `${Math.max(0, (state.timeLeft / scene.timeLimit) * 100)}%`;
  $('timerBar').classList.toggle('low', state.timeLeft <= 10);
  $('foundText').textContent = `Found ${state.found.size} / ${scene.diffs.length}`;
  $('remainText').textContent = `${scene.diffs.length - state.found.size} still hidden`;
  $('scoreText').textContent = `Score ${state.score}`;
  $('hintText').textContent = `Hints ${state.hintsLeft}`;
  $('hintBtn').disabled = state.hintsLeft <= 0 || state.screen !== 'play';
  $('comboText').textContent = state.combo >= 2 ? `Combo ×${state.combo}` : '';
}

export function showOverlay(html) {
  const ov = $('overlay');
  ov.innerHTML = html;
  ov.classList.remove('hidden');
}

export function hideOverlay() {
  $('overlay').classList.add('hidden');
}

export function startOverlay() {
  showOverlay(`
    <h1>Lantern Lane</h1>
    <p class="tag">A spot-the-difference hunt in three hand-drawn scenes</p>
    <div class="rules">
      <p>Two pictures sit side by side. They look the same — they are not.</p>
      <p><b>7–8 differences</b> hide in every scene. Click (or point with the arrow keys and press <b>Enter</b>) on a difference in <i>either</i> picture to circle it.</p>
      <p>Find them all before the lantern burns down. Wrong clicks cost 10 points and 3 seconds. <b>H</b> spends a hint.</p>
    </div>
    <div class="levels">
      <span>1 · Harbor at Dusk — 7 differences, 90s</span>
      <span>2 · Night Market — 7 differences, 75s</span>
      <span>3 · Moonlit Garden — 8 differences, 60s</span>
    </div>
    <button id="startBtn" class="big">Light the lanterns — Start</button>
    <p class="keys">Mouse / touch to mark &nbsp;·&nbsp; Arrow keys + Enter &nbsp;·&nbsp; H hint &nbsp;·&nbsp; R restart</p>`);
  $('startBtn').addEventListener('click', () => window.__lanternStart());
}

export function levelClearOverlay(state, timeBonus) {
  const scene = state.scene;
  const accuracy = state.clicks === 0 ? 100 : Math.round((state.found.size / state.clicks) * 100);
  showOverlay(`
    <h1>Level clear!</h1>
    <p class="tag">Every difference in <b>${scene.name}</b> found.</p>
    <div class="stats">
      <div><b>${state.found.size}</b><span>differences</span></div>
      <div><b>${Math.round(state.timeLeft)}s</b><span>time left · +${timeBonus} bonus</span></div>
      <div><b>${accuracy}%</b><span>accuracy</span></div>
      <div><b>${state.score}</b><span>score</span></div>
    </div>
    <button id="nextBtn" class="big">${state.levelIndex + 1 < 3 ? 'Next scene →' : 'See your results →'}</button>
    <p class="keys">Press N to continue</p>`);
  $('nextBtn').addEventListener('click', () => window.__lanternNext());
}

export function winOverlay(state) {
  showOverlay(`
    <h1>All three scenes solved!</h1>
    <p class="tag">Harbor, market and garden — every difference found.</p>
    <div class="stats">
      <div><b>${state.totalFound}</b><span>differences found</span></div>
      <div><b>${state.totalClicks}</b><span>clicks</span></div>
      <div><b>${Math.round((state.totalFound / Math.max(1, state.totalClicks)) * 100)}%</b><span>accuracy</span></div>
      <div><b>${state.score}</b><span>final score</span></div>
    </div>
    <button id="againBtn" class="big">Play again</button>
    <p class="keys">Press R to play again</p>`);
  $('againBtn').addEventListener('click', () => window.__lanternRestart());
}

export function timeUpOverlay(state) {
  const scene = state.scene;
  showOverlay(`
    <h1>Time’s up!</h1>
    <p class="tag">The lantern burned down in <b>${scene.name}</b> with ${scene.diffs.length - state.found.size} difference${scene.diffs.length - state.found.size === 1 ? '' : 's'} still hidden.</p>
    <div class="stats">
      <div><b>${state.found.size} / ${scene.diffs.length}</b><span>found</span></div>
      <div><b>${state.score}</b><span>score</span></div>
    </div>
    <button id="retryBtn" class="big">Try this scene again</button>
    <p class="keys">Press R to retry</p>`);
  $('retryBtn').addEventListener('click', () => window.__lanternRestart());
}
