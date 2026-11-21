// Lantern Lane — input: mouse/touch clicks and keyboard play.
// A click on either panel marks the same scene coordinates (the panels show
// the same scene, so a difference can be found on either side). Arrow keys
// move a crosshair cursor; Enter or Space marks where it stands.

export function panelPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

export function attachPointer(canvasA, canvasB, onMark) {
  for (const canvas of [canvasA, canvasB]) {
    canvas.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      const p = panelPoint(canvas, ev.clientX, ev.clientY);
      onMark(p.x, p.y, 'mouse');
    });
  }
}

// Arrow-key crosshair. Returns a handle to move the cursor programmatically
// (used by the screenshot staging hook).
export function attachKeyboard(cursor, onMarkAtCursor, onHint, onConfirm, onRestart) {
  const step = 14;
  const fast = 48;
  window.addEventListener('keydown', (ev) => {
    if (ev.repeat && (ev.key === 'Enter' || ev.key === ' ')) return;
    const s = ev.shiftKey ? fast : step;
    switch (ev.key) {
      case 'ArrowLeft':
        cursor.x = Math.max(0, cursor.x - s);
        cursor.visible = true;
        cursor.moved = true;
        ev.preventDefault();
        break;
      case 'ArrowRight':
        cursor.x = Math.min(560, cursor.x + s);
        cursor.visible = true;
        cursor.moved = true;
        ev.preventDefault();
        break;
      case 'ArrowUp':
        cursor.y = Math.max(0, cursor.y - s);
        cursor.visible = true;
        cursor.moved = true;
        ev.preventDefault();
        break;
      case 'ArrowDown':
        cursor.y = Math.min(420, cursor.y + s);
        cursor.visible = true;
        cursor.moved = true;
        ev.preventDefault();
        break;
      case 'Enter':
      case ' ':
        cursor.visible = true;
        onMarkAtCursor(cursor.x, cursor.y);
        ev.preventDefault();
        break;
      case 'h':
      case 'H':
        onHint();
        break;
      case 'n':
      case 'N':
        onConfirm();
        break;
      case 'r':
      case 'R':
        onRestart();
        break;
      default:
        break;
    }
  });
}
