// Lantern Lane — sound bank.
// Every sound is synthesized with WebAudio oscillators: no audio files, no
// network, nothing to load. The context is created lazily on first user
// interaction (browsers block audio before a gesture).

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  tone(freq, startAt, dur, type, vol) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + startAt;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // A satisfying two-note chime on each find; the pitch climbs with the combo.
  find(combo) {
    const base = 523 * Math.pow(1.059, Math.min(combo, 8));
    this.tone(base, 0, 0.16, 'sine', 0.22);
    this.tone(base * 1.5, 0.07, 0.22, 'sine', 0.2);
    this.tone(base * 2, 0.14, 0.28, 'triangle', 0.12);
  }

  // A dull thud for a wrong click.
  wrong() {
    this.tone(140, 0, 0.18, 'sawtooth', 0.12);
    this.tone(98, 0.05, 0.22, 'sawtooth', 0.1);
  }

  // A soft shimmer when a hint is spent.
  hint() {
    this.tone(880, 0, 0.3, 'sine', 0.12);
    this.tone(1174, 0.09, 0.3, 'sine', 0.1);
    this.tone(1568, 0.18, 0.36, 'sine', 0.08);
  }

  // A short tick when the clock runs under ten seconds.
  tick() {
    this.tone(1046, 0, 0.06, 'square', 0.05);
  }

  // A rising arpeggio for clearing a level.
  levelClear() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.11, 0.3, 'triangle', 0.18));
  }

  // The full win fanfare.
  win() {
    [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => this.tone(f, i * 0.13, 0.34, 'triangle', 0.18));
  }

  // A low descending phrase for running out of time.
  timeUp() {
    [392, 330, 262, 196].forEach((f, i) => this.tone(f, i * 0.14, 0.3, 'sine', 0.14));
  }
}
