// Lantern Lane — screenshot staging.
// The maker takes screenshots through ?shot= so every shot shows a real,
// settled game state: no animation mid-flight, no timer ticking.
//   ?shot=start            title screen over scene 1
//   ?shot=play             level 1 mid-play, timer frozen at 62s
//   ?shot=play&found=0,2,4 level 1 with differences 0, 2 and 4 already circled
//   ?shot=play&level=2     level 2 mid-play instead
//   ?shot=win              the final results screen, all scenes solved
// Without ?shot= the game plays normally.

export function readShotParams() {
  const q = new URLSearchParams(window.location.search);
  const shot = q.get('shot');
  if (!shot) return null;
  const found = (q.get('found') || '')
    .split(',')
    .map((s) => parseInt(s, 10))
    .filter((n) => Number.isFinite(n));
  return {
    shot,
    level: Math.min(2, Math.max(0, parseInt(q.get('level') || '0', 10) || 0)),
    found,
  };
}
