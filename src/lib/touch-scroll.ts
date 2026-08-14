import type { Terminal as XtermTerminal } from "@xterm/xterm";

const TAP_SLOP_PX = 10;
const FRICTION = 0.93;
const MIN_VELOCITY = 0.12;

/**
 * xterm.js 6 uses a custom scrollbar that does not receive touch-drag on the
 * canvas. Translate one-finger pans into term.scrollLines() (integer rows).
 */
export function attachTouchScroll(
  term: XtermTerminal,
  target: HTMLElement,
): () => void {
  let startY = 0;
  let lastY = 0;
  let lastT = 0;
  let leftover = 0;
  let velocity = 0;
  let dragging = false;
  let moved = false;
  let raf = 0;

  const cellHeight = (): number => {
    const height = term.element?.clientHeight ?? 0;
    return term.rows > 0 && height > 0 ? height / term.rows : 16;
  };

  const applyDelta = (deltaPx: number): void => {
    leftover += deltaPx;
    const row = cellHeight();
    const lines =
      leftover > 0 ? Math.floor(leftover / row) : Math.ceil(leftover / row);
    if (lines === 0) {
      return;
    }
    leftover -= lines * row;
    term.scrollLines(lines);
  };

  const stopInertia = (): void => {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };

  const onStart = (event: TouchEvent): void => {
    if (event.touches.length !== 1) {
      dragging = false;
      return;
    }

    stopInertia();
    dragging = true;
    moved = false;
    leftover = 0;
    velocity = 0;
    startY = event.touches[0].clientY;
    lastY = startY;
    lastT = event.timeStamp;
  };

  const onMove = (event: TouchEvent): void => {
    if (!dragging || event.touches.length !== 1) {
      return;
    }

    const y = event.touches[0].clientY;
    if (!moved && Math.abs(y - startY) < TAP_SLOP_PX) {
      return;
    }

    moved = true;
    event.preventDefault();

    const now = event.timeStamp;
    const dy = lastY - y;
    const dt = Math.max(1, now - lastT);
    applyDelta(dy);
    velocity = dy / dt;
    lastY = y;
    lastT = now;
  };

  const onEnd = (): void => {
    dragging = false;
    if (!moved) {
      term.focus();
      return;
    }

    const tick = (): void => {
      if (Math.abs(velocity) < MIN_VELOCITY) {
        raf = 0;
        return;
      }

      applyDelta(velocity * 16);
      velocity *= FRICTION;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
  };

  const moveOpts: AddEventListenerOptions = { passive: false, capture: true };
  const quietOpts: AddEventListenerOptions = { passive: true, capture: true };

  target.addEventListener("touchstart", onStart, quietOpts);
  target.addEventListener("touchmove", onMove, moveOpts);
  target.addEventListener("touchend", onEnd, quietOpts);
  target.addEventListener("touchcancel", onEnd, quietOpts);

  return () => {
    stopInertia();
    target.removeEventListener("touchstart", onStart, quietOpts);
    target.removeEventListener("touchmove", onMove, moveOpts);
    target.removeEventListener("touchend", onEnd, quietOpts);
    target.removeEventListener("touchcancel", onEnd, quietOpts);
  };
}
